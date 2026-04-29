# `/schemas` — Backend Domain Schemas

Zod schemas for backend / data-layer entities (Upload, Product, Order, Lead,
Customer, Booking, Event). These are **intentionally separate** from
`src/schemas/`, which holds frontend display models (LandingTemplate,
PricingPlan).

## Status

These schemas are **not currently imported by frontend code**. They are
preserved as the canonical contracts for:

- File upload validation (mime / magic-bytes guards)
- Backend-side product, order, lead, customer, booking and event domain models

They are exercised by `schemas/index.test.ts` (run via `npm test`) to keep the
contracts honest while no production consumer is wired up yet.

## When to delete vs. keep

- **Keep** if you plan to wire a Supabase / serverless backend that consumes
  these contracts.
- **Delete** if the backend has moved elsewhere or the schemas have been
  superseded. Remember to also remove `./schemas/index.test.ts` from the
  `test` script in `package.json`.
