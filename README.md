# email-server

Express 5 + TypeScript API for sending emails through **Brevo** or **Resend**, built for deployment on Vercel.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000, restarts on file changes (tsx)
npm run build      # compile src/ -> dist/
npm start          # run the compiled server
npm run typecheck  # type-check without emitting
```

Requires Node.js 24.x. No environment variables are needed; settings live in `src/config/index.ts`:

| Setting            | Value        |
| ------------------ | ------------ |
| `nodeEnv`          | `production` |
| `port`             | `3000`       |
| `corsOrigin`       | `*` (any)    |
| `requestTimeoutMs` | `10000`      |

## Folder structure

```
api/
  index.js                 Vercel entry point (re-exports the compiled app from dist/)
src/
  app.ts                   Express app: middleware, routes, error handling
  server.ts                Local entry point (app.listen)
  config/                  App settings (port, CORS, timeout)
  constants/               HTTP status codes, messages, provider URLs, API prefix
  types/                   Shared TypeScript types and interfaces
  models/                  Email model: validates and normalizes request data
  controllers/             Request handlers: model -> service -> response
  services/                Provider integrations (Brevo, Resend)
  routes/
    index.ts               /api  (health check + version mounting)
    v1/
      index.ts             /api/v1
      email.routes.ts      /api/v1/email/*
  middlewares/             404 and error handlers
  utils/                   ApiError, response helpers, HTTP client, validators
tsconfig.json              Compiles src/ to dist/
vercel.json                Runs the build and rewrites every request to the api/ function
```

A request flows **route -> controller -> model (validation) -> service (provider call) -> controller (response)**.
Because this API has no database, the "model" layer holds the domain object and its validation rules,
and the provider-specific logic lives in `services/`.

### Adding a new endpoint

1. Add a controller in `src/controllers/`.
2. Add a route file in `src/routes/v1/` and mount it in `src/routes/v1/index.ts`.
3. Put any external-API logic in `src/services/` and any validation in `src/models/`.

## Endpoints

| Method | Path                     | Description          |
| ------ | ------------------------ | -------------------- |
| GET    | `/api/health`            | Health check         |
| POST   | `/api/v1/email/brevo`    | Send email via Brevo |
| POST   | `/api/v1/email/resend`   | Send email via Resend |

### Request body (same for both providers)

```json
{
  "apiKey": "provider-api-key",
  "fromEmail": "sender@yourdomain.com",
  "fromName": "Your App",
  "toEmail": "user@example.com",
  "title": "Hello",
  "content": "<p>Hello world</p>",
  "cc": "cc@example.com",
  "bcc": ["bcc@example.com"],
  "replyTo": "support@yourdomain.com"
}
```

| Param       | Required | Description                                                     |
| ----------- | -------- | --------------------------------------------------------------- |
| `apiKey`    | yes      | Brevo or Resend API key                                         |
| `fromEmail` | yes      | Sender email (must be verified in the provider account)         |
| `fromName`  | no       | Sender display name                                             |
| `toEmail`   | yes      | Recipient email, or an array of emails                          |
| `title`     | yes      | Email subject                                                   |
| `content`   | yes      | Email body; sent as HTML if it contains tags, otherwise as text |
| `cc`        | no       | Email or array of emails                                        |
| `bcc`       | no       | Email or array of emails                                        |
| `replyTo`   | no       | Reply-to email                                                  |

### Example

```bash
curl -X POST http://localhost:3000/api/v1/email/resend \
  -H "Content-Type: application/json" \
  -d '{"apiKey":"re_xxx","fromEmail":"onboarding@resend.dev","fromName":"My App","toEmail":"you@example.com","title":"Hi","content":"<p>Hi</p>"}'
```

### Responses

Success (`200`):

```json
{ "success": true, "message": "Email sent successfully", "data": { "provider": "resend", "id": "...", "raw": { } } }
```

Validation error (`400`):

```json
{ "success": false, "message": "Validation failed", "details": [{ "field": "toEmail", "message": "is required" }] }
```

Provider errors (bad API key, unverified sender, etc.) are passed through with the provider's
status code and response under `details.providerResponse`.

## Deploying to Vercel

1. Push this repo and import it in Vercel (or run `npx vercel` from the project root).
2. Leave the framework preset as **Other**. `vercel.json` already sets the build command
   (`npm run build`), and no environment variables are required.

The build compiles `src/` to `dist/`, and `api/index.js` serves the compiled app.
`vercel.json` rewrites every path to that function, so the URLs are
`https://<your-domain>/api/v1/email/brevo` and `https://<your-domain>/api/v1/email/resend`.
