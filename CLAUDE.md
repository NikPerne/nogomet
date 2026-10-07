# CLAUDE.md

Nogomet is a small app for signing up to recreational football ("torkova rekreacija"). Users register or log in, see a list of events (dates), and on an event page mark themselves **Pridem** (attending) or **Ne pridem** (not attending). A sidebar chart shows how many times each user attended. UI text is mostly Slovenian.

## Stack and layout

- **Backend**: Node + Express 4 + Mongoose 7, JWT auth (`express-jwt`, `jsonwebtoken`), Passport local strategy for login. Entry point: `server.js`.
- **Frontend**: Angular 16 (NgModule-based, not standalone) in `angular/`, Bootstrap 5 (Sandstone theme), ngx-bootstrap modals, Angular Material datepicker, ng-apexcharts.
- `server.js` serves the **prebuilt** Angular app from `angular/build/` (committed to the repo) and the API under `/api`. **Frontend source changes are not live until the Angular app is rebuilt** (`cd angular && npm run build-prod`).

```
server.js                  Express app, Swagger setup, static Angular, error handler
api/routes/api.js          All REST routes
api/middleware/auth.js     `auth` (JWT + loads req.user from DB) and `adminOnly`
api/controllers/           events.js, signup.js, users.js, authentication.js, helpers.js
api/models/                db.js (connection), events.js (Event + embedded Signup), users.js
api/config/passport.js     Local strategy (email + password)
angular/src/app/shared/    components/, services/, classes/, pipes/
data/                      Seed JSON (events, test users)
test/Demo.test.js          Selenium + mocha end-to-end tests (expects Docker setup)
```

## Commands

- `npm start`: start the API and serve the built frontend (port `PORT` or 3000).
- `npm run build`: install root deps, then install and build the Angular app for production into `angular/build`.
- `cd angular && npm start`: Angular dev server (`ng serve`) talking to `environment.apiUrl` (`https://localhost:3000/api` in dev).
- `npm test`: Selenium E2E tests. Needs the app running at `https://host.docker.internal:3000`, a Selenium server on `localhost:4445`, and the `web-dev-mongo-db` container (see `docker-compose.yml`).

## Environment (.env, not committed)

- `JWT_SECRET` (required): signs and verifies tokens.
- `NODE_ENV`: `production` → `MONGODB_ATLAS_URI`; `test` → `mongodb://web-dev-mongo-db/Demo`; otherwise `mongodb://127.0.0.1/Demo`.
- `HTTPS=true`: serve over HTTPS using `/etc/secrets/server.key` and `/etc/secrets/server.cert`.
- `PORT`: defaults to 3000.

## Domain model

- **User** (`Users` collection): `email` (unique), `name`, `hash`/`salt` (pbkdf2), `admin`. The JWT payload contains `_id`, `email`, `name`, `admin`, `exp` (7 days). The frontend treats tokens without an `admin` claim as logged out. Old documents may still have an unused `timesSignedUp` field.
- **Event** (`Events` collection): `name`, `description`, `date` (date and start time; older events are at midnight with no time), optional `maxPlayers`, `cancelled` + `cancelReason`, `signedup: [Signup]`.
  - Model methods: `isPast()` (signups stay open until 24 h after `date`), `signupsClosedReason()` (past or cancelled), `attendingInOrder()`, `confirmedSignups()`, `waitlistedSignups()`, `isFull()`.
  - The frontend mirrors these in `angular/src/app/shared/classes/event.ts`, so keep the two in sync.
- **Waitlist**: when `maxPlayers` is set, the first `maxPlayers` attending signups, ordered by `attendingSince` (falling back to `createdOn`), are confirmed. The rest are waitlisted ("rezerva"). Nothing about the waitlist is stored; it is derived, so a dropout automatically promotes the next player. Switching to attending resets `attendingSince`, so that player joins the back of the queue.
- **Signup** (embedded in Event): `name`, `userId`, `attending` (boolean), `createdOn`, `attendingSince`, optional `note` (max 100 characters). Older signups have no `userId`, so ownership falls back to matching `name`. Keep that fallback (`isOwnSignup` in `api/controllers/signup.js` and in `event-details.component.ts`).

## API rules worth knowing

- `GET /api/events`, `GET /api/events/:id`, `GET /api/events/:id/signups/:signupId` and `GET /api/users` are public. `/users` returns only `_id`, `name`, `gamesPlayed`, `attendanceRate`, `currentStreak` and `lastPlayed`; never expose `hash`, `salt` or `email` there.
- These stats are **computed on each request** in `api/controllers/users.js`, over started (`date < now`), non-cancelled events, oldest first. There is no stored counter, so don't add one.
  - `gamesPlayed`: events where the user was a confirmed player, not waitlisted. Legacy signups are matched by name.
  - `attendanceRate`: `gamesPlayed` divided by the events since the user's first signup of any kind (0–1).
  - `currentStreak`: consecutive most recent events the user played.
- `POST`, `PUT` and `DELETE /api/events/:id` are **admin only** (`adminOnly`, checked against the DB, not the token). Create and update accept only `name`, `description`, `date`, `maxPlayers`, `cancelled` and `cancelReason`. An empty `maxPlayers` removes the limit, and `cancelled=false` clears `cancelReason`.
- `POST /api/events/:id/signups` takes `attending` (`"true"`/`"false"`) and an optional `note`; one signup per user per event. A full event still accepts attending signups, which go on the waitlist.
- `PUT .../signups/:signupId` changes `attending` and/or `note` (an empty note removes it), and `DELETE` removes the signup; both are allowed only for the signup's owner.
- Signup create, change and delete return 409 when the event is past or cancelled (`signupsClosedReason`).
- List endpoints return `200 []` when empty, not 404. `nResults` is clamped to 1–1000 (default 10).
- Request bodies are form-encoded (`application/x-www-form-urlencoded`); JSON is accepted too.
- Swagger UI: `/api/docs`, spec: `/api/swagger.json`. Generated from `@openapi` JSDoc comments in `api/models` and `api/controllers`, so keep them in sync when changing endpoints.

## Frontend notes

- `DemoDataService` (the name is a leftover from the course template) is the only HTTP client. The token is stored in `localStorage` under `demo-token`. Mutating requests (POST and DELETE) deliberately have no `retry`.
- `AuthenticationService` decodes the JWT client-side (base64url) for `isLoggedIn()` and `getCurrentUser()`; this is for display only.
- Player counts shown are confirmed players (waitlist excluded), derived from `event.signedup`.
- The event list splits events into upcoming (soonest first, the next one highlighted) and past (most recent first, 5 shown).
- `EventFormComponent` (`app-event-form`) is the modal body for both "Add event" (event list) and "Edit event" (event page). It validates, combines the datepicker date with the `<input type="time">`, and emits `save`; the parent makes the API call and passes errors back through `[error]`.
- The "Add event" form (admin) is pre-filled from the latest event: same name, description, time and `maxPlayers`, and the next date one or more weeks later that is in the future.
- On the event page, admins can edit, cancel or restore (with a reason via `prompt`), and delete. Edits are emitted through `eventChange`, so the page header updates.
- The event page also has:
  - an optional signup note input,
  - a client-side random team split ("Razdeli ekipe") of confirmed players (teams are not stored),
  - "Deli", which uses `navigator.share` and falls back to the clipboard,
  - "Koledar", which downloads an `.ics` file built in `shared/classes/calendar.ts`. Events without a time become all-day events, and timed ones last 90 minutes.
- Leaderboard page `/lestvica` (`LeaderboardComponent`) shows all stats from `GET /api/users`. The sidebar chart shows `gamesPlayed`.
- `npm test` E2E tests target 2023 events that are now past, so the signup steps need updated test data.
- Routes `''`, `events`, `events/:eventId` and `lestvica` are protected by `AuthGuard`.

## Conventions

- CommonJS on the backend, double quotes, async/await with try/catch in every controller (Express 4 does not catch async errors).
- Controllers send JSON errors as `{ message }`.
- Don't add `pridemCount` or other denormalized counters back onto Event.
