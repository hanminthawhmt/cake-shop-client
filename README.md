# Petal & Cocoa — Customer Storefront 🌸🎂

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://petal-and-cocoa.vercel.app/cakes)
[![React](https://img.shields.io/badge/React_19-TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite- Build_Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

> **Live Customer Storefront:** [https://petal-and-cocoa.vercel.app/cakes](https://petal-and-cocoa.vercel.app/cakes)

Welcome to **Petal & Cocoa**, a warm, inviting customer-facing bakery web application. Built for cake lovers, this mobile-first storefront lets customers browse artisanal cakes, customize options, schedule pickup dates and time slots, track real-time order status, and reserve private birthday tea rooms.

---

> [!IMPORTANT]
> **Server Wake-Up Announcement (Render Free Tier Hosting)**
>
> The backend REST API service is hosted on **Render's free plan**. To conserve resources, Render automatically puts inactive free web services to sleep after 15 minutes of inactivity.
>
> If you are the first visitor after a period of inactivity, **your initial request or page load may take up to 50–60 seconds** while the server wakes up. Once active, all subsequent requests will respond instantly! We have built an automated in-app banner to notify visitors whenever the backend is spinning up.

---

## 🌟 Key Features

### 🎂 Cake Catalog & Customization
- **Catalog Browsing (`/cakes`)**: Live search bar and category filter connected directly to the REST API (`GET /cakes` & `GET /categories`). Guest visitors can browse freely without logging in.
- **Dynamic Price Calculator (`/cakes/:id`)**: Cake detail view featuring photo galleries, option selectors (e.g. Size, Flavor, Crust), and dynamic real-time running price calculations (`basePrice + sum(selectedModifiers)`).
- **Custom Notes**: Add personalized birthday messages or dietary notes to individual cake pre-orders.

### 🔐 Authentication & OAuth Sign-In
- **Email/Password Auth (`/login` & `/signup`)**: JWT-based customer signup and login with persistent storage.
- **Google OAuth Sign-In**: One-click Google sign-in (`window.location.href = /auth/google`) with token handling at `/auth/callback`.
- **Return-Path Redirection**: Unauthenticated customers attempting to add items to cart or reserve rooms are prompted to log in and automatically returned right back to their active selection page (`?redirect=...`).

### 🛒 Cart & Checkout Flow
- **Cart Management (`/cart`)**: Live cart line-item list (`GET /cart`), item quantity modification (`PATCH /cart/items/:id`), item removal, and header cart badge indicator.
- **Pickup Scheduling (`/checkout`)**: Minimum **1-day advance pickup date picker** and fixed pickup time slots matching backend validation rules before submitting orders (`POST /orders`).

### 📦 Customer Order History & Tracking
- **Order List (`/orders`)**: View past and active orders (`GET /orders`) with color-coded status badges:
  - 🔵 **Confirmed** (`confirmed`)
  - 🟡 **Preparing** (`preparing`)
  - 🟢 **Ready for Pickup** (`ready_for_pick_up`)
  - 🟣 **Completed** (`completed`)
  - 🔴 **Cancelled** (`cancelled`)
- **Order Details & Cancellation (`/orders/:id`)**: Full item breakdown with line totals and a 2-hour pre-pickup cutoff cancellation action (`PATCH /orders/:id/cancel`).

### 🎉 Birthday Room Browsing & Reservations
- **Private Room Catalog (`/rooms`)**: Browse available bakery birthday rooms with guest capacity badges and hourly rates.
- **Real-Time Slot Availability (`/rooms/:id`)**: Select dates to fetch live time slot availability (`GET /rooms/:id/availability?date=...`). Booked slots (`10:00`, `12:00`, `14:00`) are visibly disabled and greyed out.
- **Reservation Management (`/reservations` & `/reservations/:id`)**: View customer room bookings, birthday requirements notes, and cancellation options (`PATCH /reservations/:id/cancel`).

### 👤 Customer Profile & Account Settings
- **Profile Management (`/profile` / `/account`)**: View read-only account details (Name, Email) and edit contact information (Phone, Delivery Address) via `PATCH /users/me`.
- **Security & Password Update**: Independent password change form (`PATCH /auth/change-password`) with client-side validation and isolated error handling.

---

## 🛠️ Tech Stack & Architecture

- **Framework & Language**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling & UI**: Tailwind CSS (Warm Pink `#D86A78` and Deep Cocoa `#4A2E2B` brand palette)
- **Icons**: Lucide React
- **Routing**: React Router v7
- **Data Fetching & State**: TanStack Query (React Query v5) & Axios
- **Form Validation**: Native React state & client-side validation

```
src/
├── api/          # Axios API service instances & endpoint methods
├── components/   # Shared layout (Header, Footer) & ServerWarmupBanner
├── context/      # AuthContext for app-wide user state & JWT persistence
├── features/     # Feature-based architecture
│   ├── auth/         # Login, Signup, Google OAuth Callback
│   ├── cakes/        # Cake Detail & Customization
│   ├── cart/         # Cart Page & Row Items
│   ├── catalog/      # Main Cake Catalog & Category Filters
│   ├── checkout/     # Checkout Summary & Order Placement
│   ├── orders/       # Order History & Order Details
│   ├── profile/      # Profile Info & Password Update Forms
│   ├── reservations/ # Reservation History & Details
│   └── rooms/        # Birthday Room Catalog & Availability
├── hooks/        # Custom React Query hooks (e.g. useCart)
├── routes/       # React Router configuration (AppRouter)
└── types/        # TypeScript interfaces & API DTO contracts
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** or **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hanminthawhmt/cake-shop-client.git
   cd cake-shop-client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
   *(For production deployment, point `VITE_API_URL` to your live NestJS API instance)*

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🔗 Related Links

- **Live Storefront**: [https://petal-and-cocoa.vercel.app/cakes](https://petal-and-cocoa.vercel.app/cakes)
- **Backend API Docs (OpenAPI/Swagger)**: `http://localhost:3000/api`

---

Developed with ❤️ for **Petal & Cocoa**.
