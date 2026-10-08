# CLAUDE.md

Nogomet is a small app for signing up to recreational football ("torkova rekreacija"). Users register or log in, see a list of events, and on an event page mark themselves **Pridem** (attending) or **Ne pridem** (not attending). It also covers a waitlist, guests, statistics and a leaderboard, and season membership fees. UI text is mostly Slovenian.

## Stack and layout

- **Backend**: Node + Express 4 + Mongoose 7, JWT auth (`express-jwt`, `jsonwebtoken`), Passport local strategy for login. Entry point: `server.js`.
- **Frontend**: Angular 16 (NgModule-based, not standalone) in `angular/`, Bootstrap 5 (Sandstone theme, loaded from `src/assets` in `index.html`), ngx-bootstrap modals, ng-apexcharts.
  - Date and time inputs are native `<input type="date">` / `<input type="time">`. Angular Material is still in `package.json` but no longer imported. Its theme CSS was never loaded, which is why the old Material datepicker rendered broken, so don't reintroduce Material components without adding a theme.
- `server.js` serves the built Angular app from `angular/build/` and the API under `/api`. `angular/build` is **not committed** (it's in `.gitignore`). Render builds it with the build command `npm run build`, and `build-prod` installs dev dependencies with `--include=dev` because `NODE_ENV=production` is set there.

```
server.js                  Express app, Swagger setup, static Angular, error handler
api/routes/api.js          All REST routes
api/middleware/auth.js     `auth` (JWT + loads req.user from DB) and `adminOnly`
api/controllers/           events.js, signup.js, users.js, season.js, authentication.js, helpers.js
api/models/                db.js (connection), events.js (Event + embedded Signup), users.js, payments.js
api/config/                passport.js (local strategy), season.js (season dates and fee)
angular/src/app/shared/    components/, services/, classes/, pipes/
data/                      Seed JSON (events, test users)
test/Demo.test.js          Selenium + mocha end-to-end tests (expects Docker setup)
```

## Commands

- `npm start`: start the API and serve the built frontend (port `PORT` or 3000).
- `npm run build`: install root deps, then install and build the Angular app for production into `angular/build`.
- `cd angular && npm start`: Angular dev server (`ng serve`) talking to `environment.apiUrl` (`https://localhost:3000/api` in dev).
- `cd angular && npx ng build --configuration production --output-path <tmp>`: quickest full type check (`strictTemplates` is on).
- `npm test`: Selenium E2E tests. Needs the app running at `https://host.docker.internal:3000`, a Selenium server on `localhost:4445`, and the `web-dev-mongo-db` container (see `docker-compose.yml`). They target 2023 events that are now past, so the signup steps need updated test data.
- Node 18 on Render. Angular 16 only supports Node 16 and 18, so upgrade Angular before upgrading Node.

## Environment (.env, not committed)

- `JWT_SECRET` (required): signs and verifies tokens.
- `NODE_ENV`: `production` → `MONGODB_ATLAS_URI`; `test` → `mongodb://web-dev-mongo-db/Demo`; otherwise `mongodb://127.0.0.1/Demo`.
- `SEASON_FEE_EUR`: season membership fee, default 80.
- `APP_URL`: public base URL used in emailed links, e.g. `https://nogomet.onrender.com`. **Required in production**, and never derived from the request's Host header.
- `BREVO_API_KEY`, `MAIL_FROM` (a sender verified in Brevo), optional `MAIL_FROM_NAME`: email via the Brevo HTTP API (`api/config/mail.js`). Without them, emails are printed to the console outside production; in production the send fails and is only logged.
- `HTTPS=true`: serve over HTTPS using `/etc/secrets/server.key` and `/etc/secrets/server.cert`.
- `PORT`: defaults to 3000.

## Domain model

- **User** (`Users` collection): `email` (unique), `name`, `hash`/`salt` (pbkdf2), `admin`, plus `resetTokenHash`/`resetTokenExpires`/`resetRequestedAt` for password reset. Only a SHA-256 hash of the emailed token is stored; it is valid 1 hour and works once. Never expose these fields. The JWT payload contains `_id`, `email`, `name`, `admin`, `exp` (7 days). The frontend treats tokens without an `admin` claim as logged out. Old documents may still have an unused `timesSignedUp` field.
- **Event** (`Events` collection): `name`, `description`, `date` (date and start time; older events are at midnight with no time), optional `maxPlayers`, `cancelled` + `cancelReason`, `signedup: [Signup]`.
  - Model methods: `isPast()` (signups stay open until 24 h after `date`), `signupsClosedReason()` (past or cancelled), `attendingInOrder()`, `confirmedSignups()`, `waitlistedSignups()`, `isFull()`.
  - The frontend mirrors these in `angular/src/app/shared/classes/event.ts`, so keep the two in sync.
- **Signup** (embedded in Event): `name`, `userId`, `attending` (boolean), `createdOn`, `attendingSince`, optional `note` (max 100 characters).
  - Older signups have no `userId`, so ownership falls back to matching `name`.
  - **Guests** have `guestOf` (the user who added them) and `guestOfName`, no `userId`, and are always attending. A guest is never the user's "own" signup and never counts in that user's stats.
  - All of this lives in `isOwnSignup` in `api/controllers/helpers.js`, mirrored in `event-details.component.ts`.
- **Waitlist**: when `maxPlayers` is set, the first `maxPlayers` attending signups (guests included), ordered by `attendingSince` (falling back to `createdOn`), are confirmed. The rest are waitlisted ("rezerva"). Nothing about the waitlist is stored; it is derived, so a dropout automatically promotes the next player. Switching to attending resets `attendingSince`, so that player joins the back of the queue.
- **Teams and score** (on Event): `teams: { rumeni: [TeamPlayer], rdeci: [TeamPlayer] }` (Rumeni = yellow, Rdeči = red; keys in `TEAM_KEYS`) and `score: { rumeni, rdeci }` (integers 0–99).
  - `TeamPlayer` is `{ name, userId?, guest? }`. Players match users by `userId`, or by name for legacy players; guests never match.
  - Model methods: `teamOf(user)` and `resultFor(user)` (`win`/`draw`/`loss`).
  - Saved teams are a snapshot. When signups change afterwards, the UI warns admins but doesn't update the teams.
- **Season** (`api/config/season.js`): 1 October – 30 April. Dates in May–September belong to the *upcoming* season. Labels look like `2026/27`.
- **SeasonPayment** (`SeasonPayments` collection): `{ season, userId, paidOn }`, unique per season and user. A document exists only when the fee is paid; marking a player unpaid deletes it. Fees are per season, not per match.

## API rules worth knowing

- `GET /api/events`, `GET /api/events/:id`, `GET /api/events/:id/signups/:signupId` and `GET /api/users` are public. `/users` returns only `_id`, `name`, `gamesPlayed`, `attendanceRate`, `currentStreak` and `lastPlayed`; never expose `hash`, `salt` or `email` there.
- These stats are **computed on each request** in `api/controllers/users.js`, over started (`date < now`), non-cancelled events, oldest first. There is no stored counter, so don't add one.
  - `gamesPlayed`: events where the user was a confirmed player, not waitlisted.
  - `attendanceRate`: `gamesPlayed` divided by the events since the user's first signup of any kind (0–1).
  - `currentStreak`: consecutive most recent events the user played.
  - `wins`/`draws`/`losses`: from events with saved teams and a score.
- Teams (admin): `PUT /api/events/:id/teams` takes a **JSON** body `{ rumeni: [...], rdeci: [...] }`; `DELETE` removes the teams and the score. `PUT /api/events/:id/score` takes form-encoded `rumeni` and `rdeci` (409 without saved teams); `DELETE` removes the score.
- Passwords:
  - `PUT /api/me/password` (logged in) takes `currentPassword` and `newPassword`.
  - `POST /api/password/forgot` takes `email`. It responds immediately with the same message whether or not the account exists, then sends at most one email per minute with a `${APP_URL}/ponastavi-geslo?token=...` link.
  - `POST /api/password/reset` takes `token` and `newPassword`, and returns a JWT.
- `POST`, `PUT` and `DELETE /api/events/:id` are **admin only** (`adminOnly`, checked against the DB, not the token). Create and update accept only `name`, `description`, `date`, `maxPlayers`, `cancelled` and `cancelReason`. An empty `maxPlayers` removes the limit, and `cancelled=false` clears `cancelReason`.
- `POST /api/events/:id/signups` takes `attending` (`"true"`/`"false"`) and an optional `note`; one own signup per user per event. A full event still accepts attending signups, which go on the waitlist.
- `PUT .../signups/:signupId` changes `attending` and/or `note` (an empty note removes it); only the owner can do this. `DELETE` is allowed for the owner and for the user who added a guest.
- `POST /api/events/:id/guests` (`name`, max 40 characters) adds an attending guest. Each user can add up to 3 per event; admins have no limit, so they can add players who answered elsewhere.
- Signup create, change, delete and guest create return 409 when the event is past or cancelled (`signupsClosedReason`).
- `GET /api/season[?season=2026/27]` (logged in) returns the season, start/end, fee, players with `gamesPlayed` in the season and paid status, plus `paidCount` and `collected`. A player is anyone with an own attending signup in a non-cancelled event of the season, or anyone who has already paid.
- `PUT /api/season/payments/:userId` (admin) takes `paid` and optional `season`. It upserts, keeping the original `paidOn`, or deletes the payment.
- List endpoints return `200 []` when empty, not 404. `nResults` is clamped to 1–1000 (default 10).
- Request bodies are form-encoded (`application/x-www-form-urlencoded`); JSON is accepted too.
- Swagger UI: `/api/docs`, spec: `/api/swagger.json`. Generated from `@openapi` JSDoc comments in `api/models` and `api/controllers`, so keep them in sync when changing endpoints.

## Frontend notes

- `DemoDataService` (the name is a leftover from the course template) is the only HTTP client. The token is stored in `localStorage` under `demo-token`. Mutating requests (POST, PUT and DELETE) deliberately have no `retry`.
- `AuthenticationService` decodes the JWT client-side (base64url) for `isLoggedIn()` and `getCurrentUser()`; this is for display only.
- Player counts shown are confirmed players (waitlist excluded), derived from `event.signedup`.
- The event list splits events into upcoming (soonest first, the next non-cancelled one highlighted) and past (most recent first, 5 shown).
- `EventFormComponent` (`app-event-form`) is the modal body for both "Add event" (event list) and "Edit event" (event page). It validates, combines the date (`yyyy-MM-dd`) and time (`HH:mm`) inputs into a local `Date`, and emits `save`; the parent makes the API call and passes errors back through `[error]`.
- The "Add event" form (admin) is pre-filled from the latest event: same name, description, time and `maxPlayers`, and the next date one or more weeks later that is in the future.
- On the event page, admins can edit, cancel or restore (with a reason via `prompt`), and delete. Edits are emitted through `eventChange`, so the page header updates.
- The event page also has:
  - an optional signup note input,
  - "Dodaj gosta" (add guest),
  - the teams card, `EventTeamsComponent` (`app-event-teams`). Anyone can shuffle a local preview of confirmed players (non-admins only while nothing is saved). Admins "Shrani za vse", enter the score, or remove both. It has its own "Deli ekipe" button.
  - "Še niso odgovorili": regulars (`gamesPlayed > 0` in `GET /api/users`) without an own signup on an open event, with an "Opomni" reminder share,
  - "Deli", which uses `navigator.share` and falls back to the clipboard,
  - "Koledar", which downloads an `.ics` file built in `shared/classes/calendar.ts`. Events without a time become all-day events, and timed ones last 90 minutes.
- Sharing goes through `ShareService` (`navigator.share`, falling back to the clipboard).
- `EventDetailsComponent.setSignups` replaces the whole `event` object, so child components' `ngOnChanges` fire. Don't mutate `event.signedup` in place.
- Pages: `/lestvica` (`LeaderboardComponent`, all stats from `GET /api/users`), `/profil` (own stats, season status, change password; linked from the user menu), `/pozabljeno-geslo` and `/ponastavi-geslo?token=` (public; the latter path must match the link built in `api/controllers/authentication.js`), and `/clanarina` (`SeasonComponent`). On `/clanarina` admins tick payments with checkboxes, and you can browse seasons with the arrows. The sidebar chart shows `gamesPlayed`.
- Routes `''`, `events`, `events/:eventId`, `lestvica`, `clanarina` and `profil` are protected by `AuthGuard`. Unknown routes redirect to `''`.
- The Angular service worker (`ngsw-config.json`) is enabled in production. Its `navigationUrls` exclude `/api` and `/api/**`. Without that, the service worker answers navigations to `/api/docs` (Swagger) with the cached Angular app. Keep the exclusion when adding server-rendered pages. Users get a new frontend version after reloading twice.

## Conventions

- CommonJS on the backend, double quotes, async/await with try/catch in every controller (Express 4 does not catch async errors).
- Controllers send JSON errors as `{ message }`.
- Don't add `pridemCount` or other denormalized counters back onto Event.
