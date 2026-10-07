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

- **User** (`Users` collection): `email` (unique), `name`, `hash`/`salt` (pbkdf2), `timesSignedUp`, `admin`. The JWT payload contains `_id`, `email`, `name`, `admin`, `exp` (7 days).
- **Event** (`Events` collection): `name`, `description`, `date`, `signedup: [Signup]`.
- **Signup** (embedded in Event): `name`, `userId`, `attending` (boolean), `createdOn`. Older signups have no `userId`, so ownership falls back to matching `name`. Keep that fallback (`isOwnSignup` in `api/controllers/signup.js` and in `event-details.component.ts`).

## API rules worth knowing

- `GET /api/events`, `GET /api/events/:id`, `GET /api/events/:id/signups/:signupId` and `GET /api/users` are public. `/users` returns only `name` and `timesSignedUp`; never expose `hash`, `salt` or `email` there.
- `POST /api/events` and `PUT /api/events/:id` are **admin only** (`adminOnly`, checked against the DB, not the token). PUT accepts only `name`, `description`, `date`.
- `POST /api/events/:id/signups` takes `attending` (`"true"`/`"false"`); one signup per user per event (409 otherwise). `DELETE` is allowed only for the signup's owner.
- `timesSignedUp` counts **attending** signups only. It is incremented or decremented atomically with `$inc` in the signup controller.
- List endpoints return `200 []` when empty, not 404. `nResults` is clamped to 1–1000 (default 10).
- Request bodies are form-encoded (`application/x-www-form-urlencoded`); JSON is accepted too.
- Swagger UI: `/api/docs`, spec: `/api/swagger.json`. Generated from `@openapi` JSDoc comments in `api/models` and `api/controllers`, so keep them in sync when changing endpoints.

## Frontend notes

- `DemoDataService` (the name is a leftover from the course template) is the only HTTP client. The token is stored in `localStorage` under `demo-token`. Mutating requests (POST and DELETE) deliberately have no `retry`.
- `AuthenticationService` decodes the JWT client-side (base64url) for `isLoggedIn()` and `getCurrentUser()`; this is for display only.
- The attending count on the event page is derived from `event.signedup`, not stored.
- Routes `''`, `events` and `events/:eventId` are protected by `AuthGuard`.

## Conventions

- CommonJS on the backend, double quotes, async/await with try/catch in every controller (Express 4 does not catch async errors).
- Controllers send JSON errors as `{ message }`.
- Don't add `pridemCount` or other denormalized counters back onto Event.
