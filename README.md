# TheHomemakers — Frontend

<div align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**React frontend for TheHomemakers — a full-stack home services booking platform.**

[Live Demo](https://homemakers-frontend.vercel.app) · [Backend Repo](https://github.com/vedanshgupta06/homemakers-backend)

</div>

---

## Screenshots

### Login Page
![Login](https://homemakers-frontend.vercel.app/og-login.png)

> Premium home services landing with sign-in form

### User Dashboard
![User Dashboard](https://homemakers-frontend.vercel.app/og-user.png)

> Personalized dashboard with booking stats, quick actions, and service marketplace

### Provider Dashboard
![Provider Dashboard](https://homemakers-frontend.vercel.app/og-provider.png)

> Earnings overview, booking requests, attendance tracking, and availability management

### Admin Panel
![Admin Panel](https://homemakers-frontend.vercel.app/og-admin.png)

> Platform analytics with revenue charts, service distribution, and operational alerts

---

## Features

**User Portal**
- Browse and book home services (Cleaning, Cooking, Babysitting, Laundry, and more)
- Real-time booking status tracking
- Dual payment — Stripe (card) and Razorpay (UPI/Netbanking)
- Wallet system — recharge, use balance, view transaction history
- Attendance marking for ongoing services
- Help & Support with complaint submission

**Provider Portal**
- Accept or reject incoming booking requests
- Manage availability slots by date and time
- Track daily work schedule and mark attendance
- View earnings, request payouts, and track deductions
- Set custom pricing per service

**Admin Panel**
- Real-time platform analytics
- Revenue breakdown (Stripe vs Razorpay vs Wallet)
- Monthly revenue line chart and service distribution pie chart
- Provider management with document verification
- Booking oversight and complaint handling
- Payout approval workflow with history

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| HTTP Client | Axios (with JWT interceptor) |
| Auth | JWT stored in localStorage via AuthContext |
| Payments | Stripe.js + Razorpay Checkout |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── api/
│   └── axios.js          # Axios instance with JWT interceptor
├── context/
│   └── AuthContext.jsx   # Auth state, login, logout, role management
├── pages/
│   ├── auth/             # Login, Register
│   ├── user/             # Dashboard, Bookings, Wallet, Services
│   ├── provider/         # Dashboard, Jobs, Availability, Payouts
│   └── admin/            # Dashboard, Providers, Bookings, Reports
├── components/           # Shared UI components
├── routes/               # ProtectedRoute with role-based guards
└── constants/            # API endpoints, service types
```

---

## Auth Flow

```
Login → POST /api/auth/login
     → { accessToken, refreshToken, role }
     → Saved in localStorage as 'user' object
     → AuthContext reads user.accessToken
     → Axios interceptor attaches Bearer token
     → ProtectedRoute checks token + role
```

---

## Local Setup

**Prerequisites:** Node.js 18+

```bash
# Clone the repo
git clone https://github.com/vedanshgupta06/homemakers-frontend.git
cd homemakers-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL=http://localhost:8080

# Start development server
npm run dev
```

App runs on `http://localhost:5173`.

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL |
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key (safe to expose) |

---

## Deployment

Deployed on **Vercel** with automatic deployments on push to `main`.

Build settings:
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

---

## Role-Based Access

| Role | Access |
|---|---|
| `USER` | `/user/*` — booking, wallet, services |
| `PROVIDER` | `/provider/*` — jobs, earnings, availability |
| `ADMIN` | `/admin/*` — analytics, providers, payouts |

Unauthenticated users are redirected to `/login`. Wrong-role access is blocked by `ProtectedRoute`.

---

## Related

- [Backend Repository](https://github.com/vedanshgupta06/homemakers-backend) — Spring Boot + MySQL
- [Live Demo](https://homemakers-frontend.vercel.app)

---

<div align="center">
Made with ☕ by <a href="https://github.com/vedanshgupta06">Vedansh Gupta</a>
</div>
