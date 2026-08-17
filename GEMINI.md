# Petal & Cocoa — Customer Storefront

## Project Overview

This is the **customer-facing web app** for Petal & Cocoa, a cake shop. The
backend is a fully built, documented NestJS + PostgreSQL REST API (auth,
cakes, cart, orders, birthday room reservations). This repo is the
**frontend only** — do not modify or assume access to backend source code.

A separate owner dashboard (Next.js) already exists for shop management —
this app is exclusively for customers: browsing, ordering, and reserving
rooms. Nothing here should expose owner-only functionality.

## Tech Stack

- **React + TypeScript**, Vite as the build tool
- **React Router** for client-side routing
- **Axios** for API calls
- **Tailwind CSS** for styling
- Form handling: **react-hook-form** + **zod**
- Data fetching/caching: **TanStack Query**

(These are assumed defaults consistent with the owner dashboard build — flag
if any should change before starting.)

## Design Direction

- **Pink and brown palette**, same brand as the owner dashboard — but the
  *tone* here is different: this is a storefront meant to be warm, inviting,
  and appetizing, not a data-dense admin tool. Prioritize appealing cake
  photography, generous imagery, and a browsing experience that feels like
  window-shopping at a bakery — not a spreadsheet.
- Mobile-first — assume most customers browse and order from their phone.
- Checkout and cart flows should feel simple and low-friction; don't make the
  customer hunt for "add to cart" or "checkout."

## Backend API

- Full API contract: `http://localhost:3000/api-json` (OpenAPI/Swagger JSON)
  — read this before building any screen that talks to the API.
- Interactive docs: `http://localhost:3000/api`
- **Auth**: JWT Bearer token. `POST /auth/signup` and `POST /auth/signin`.
  Store the token and attach as `Authorization: Bearer <token>` on
  subsequent requests.
- **Roles**: this app is for `customer`-role users. Routes with no
  `@Roles()` restriction (authenticated-any-role) are the ones a logged-in
  customer can call — e.g. cart, checkout, viewing their own orders.
  `GET /cakes`, `GET /cakes/:id`, `GET /rooms`, `GET /rooms/:id`, and
  `GET /rooms/:id/availability` are public and don't require login — a
  visitor should be able to browse before creating an account.
- Pickup dates must be at least 1 day in advance (enforced server-side, but
  the date picker in the UI should reflect this so customers aren't
  surprised by a rejected submission).
- Room reservations only allow fixed daily time slots — check the `TimeSlot`
  enum in the schema rather than allowing free-form time entry.

## Scope — Build in This Order

1. **Auth**: signup and login pages, token storage, a way to tell whether
   the visitor is logged in (affects header/nav, but browsing stays
   available either way)
2. **Cake browsing**: catalog page (`GET /cakes`, with search/category
   filter), cake detail page showing images, description, and the
   customization options (size/flavor/etc. with their price modifiers)
3. **Cart**: add to cart with selected options and quantity, view cart,
   update quantity/notes, remove items (`GET/POST/PATCH/DELETE /cart`,
   `/cart/items`)
4. **Checkout**: pickup date/time selection, order confirmation
   (`POST /orders`)
5. **Order history & tracking**: list past/current orders
   (`GET /orders`, scoped to the logged-in customer automatically),
   order detail, cancel order (`PATCH /orders/:id/cancel` — note the 2-hour
   pre-pickup cutoff, surface a clear message if cancellation is no longer
   allowed)
6. **Birthday rooms**: browse rooms, check availability by date, reserve
   a room (guest count, birthday requirements notes), view/cancel own
   reservations

## Working Conventions

- Feature-based folder structure, not one flat `/components` dump.
- Before implementing a screen: explore the relevant part of the Swagger
  spec, propose an implementation plan, and wait for approval before
  writing code.
- Never hardcode API URLs, tokens, or credentials — use environment
  variables.
- This app never needs backend secrets (Cloudinary keys, JWT signing
  secret, SMTP credentials) — if a task seems to require one, stop and ask.
- Match backend enums exactly (order status, payment status, reservation
  status, time slots) — read them from the Swagger schema rather than
  guessing string values.
- Guest browsing (no login) must work for catalog/room browsing — only
  cart, checkout, and reservations should require being logged in. Prompt
  to log in at the point of action (e.g. "add to cart"), not on page load.

