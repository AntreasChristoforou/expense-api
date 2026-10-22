# Expense API

A REST API for tracking expenses, built with Node, Express, TypeScript and Zod. It supports full CRUD, filtering by category, per-category totals, request validation and consistent JSON error responses.

## Tech

- Node + Express 5
- TypeScript
- Zod (request validation and types)
- Vitest (tests)

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

The API runs on http://localhost:3000. To use another port, change `PORT` in `.env`.

## Tests

```bash
npm test
```

The service functions are tested with Vitest: getting, creating, deleting, ids never being reused after a delete, and totals.

## Endpoints

| Method | URL | Description | Success | Errors |
|---|---|---|---|---|
| GET | `/api/health` | Health check | 200 | |
| GET | `/api/expenses` | List all expenses. Filter with `?category=Food` | 200 | |
| GET | `/api/expenses/totals` | Total amount per category | 200 | |
| GET | `/api/expenses/:id` | Get one expense | 200 | 400 invalid id, 404 not found |
| POST | `/api/expenses` | Create an expense | 201 (returns the new expense with its id) | 400 invalid body |
| PATCH | `/api/expenses/:id` | Update some fields of an expense | 200 (returns the updated expense) | 400 invalid id or body, 404 not found |
| DELETE | `/api/expenses/:id` | Delete an expense | 204 (no body) | 400 invalid id, 404 not found |

Unknown routes return `404` and unexpected server errors return `500`, both as JSON.

### Examples

```bash
# Create an expense
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"name":"Coffee","amount":2.5,"category":"Drink","date":"2026-10-17"}'

# Filter by category
curl "http://localhost:3000/api/expenses?category=Food"

# Totals per category
curl http://localhost:3000/api/expenses/totals
```

Example totals response:

```json
{ "Drink": 2.5, "Food": 60, "Life": 15 }
```

## Expense

```json
{
  "id": 1,
  "name": "Coffee",
  "amount": 2.5,
  "category": "Drink",
  "date": "2026-10-17"
}
```

The `id` is created by the server. Clients send every field except `id`.

### Validation rules

- `name`: text, at least 1 character
- `amount`: a positive number
- `category`: one of `Food`, `Drink`, `Life`, `Travel`, `Bills`
- `date`: a date in `YYYY-MM-DD` format

On `PATCH`, every field is optional, but any field that is sent must follow the same rules. Unknown fields are ignored.

## Errors

Every error is returned as JSON:

```json
{ "error": "Expense not found" }
```

Validation errors also list which fields are wrong:

```json
{
  "error": "Invalid expense",
  "details": [
    { "field": "amount", "message": "Invalid input: expected number, received string" }
  ]
}
```

## Project structure

```
src/
  index.ts       App setup: middleware, routes, 404 handler, error handler, server start
  routes/        Which URL and method goes to which handler
  handlers/      Read the request, validate it, call the service, send the response
  services/      The logic: list, get, create, update, delete, totals (no Express)
  schemas/       Zod schemas, TypeScript types and error formatting
```

## Notes

Data is stored in memory, so it resets when the server restarts. The next step is moving it into a PostgreSQL database.
