# StudioSpace — Find Your Space. Create Your Story.

<p align="center">
  <strong>A peer-to-peer marketplace for creative workspaces and production studios.</strong>
  <br />
  Discover inspiring spaces, book the right studio, and manage every reservation in one place.
</p>

<p align="center">
  <a href="https://studiospace-client-one.vercel.app/"><strong>Visit Live Website</strong></a>
  &nbsp;•&nbsp;
  <a href="https://github.com/sajidraian/studiospace-server">Backend Repository</a>
  &nbsp;•&nbsp;
  <a href="https://studiospace-server-l4bg.onrender.com/api/health">API Health</a>
</p>

---

## Overview

**StudioSpace** connects studio owners with photographers, filmmakers, podcasters, musicians, and other creative professionals looking for flexible spaces to bring their ideas to life.

Customers can explore studios, review facilities and pricing, request bookings, track reservations, and share feedback after eligible bookings. Studio owners can publish and manage listings and handle incoming booking requests.

## Highlights

- **Authentication:** Email/password and Google sign-in powered by Better Auth.
- **Discover Studios:** Browse and search studio listings, with category and location filters and pricing/rating information.
- **Studio Listings:** Owners can create, edit, view, and delete their own studio listings.
- **Studio Details:** Explore studio images, amenities, host information, and specifications.
- **Booking Management:** Customers can submit requests, view booking history, and cancel pending bookings.
- **Owner Dashboard:** Studio owners can review and confirm booking requests.
- **Booking Conflict Protection:** Prevent overlapping confirmed reservations.
- **Reviews & Ratings:** Eligible customers can review completed bookings; studios display review ratings.
- **Personalized Experience:** Light and dark themes with saved preferences.
- **PDF Invoices:** Generate booking invoices for record keeping.
- **Protected Experiences:** Authentication is required for private account and management features.
- **Responsive Interface:** Designed for desktop, tablet, and mobile screens.

## Screens and User Flows

| Area | What users can do |
|---|---|
| Home | Explore the platform and discover featured studios |
| Explore Studios | Search and filter available studio listings |
| Studio Details | Review photos, amenities, pricing, and host information |
| Customer Dashboard | View bookings and manage reservations |
| Owner Dashboard | Manage studio listings and booking requests |
| Reviews | Share feedback for eligible past bookings |
| Theme Settings | Switch between light and dark appearance |

## Technology

| Layer | Technologies |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Authentication | Better Auth, JWT, HTTPOnly cookies |
| Database | MongoDB Atlas |
| Backend API | Node.js, Express 5, TypeScript |
| UI & Feedback | Lucide React, React Icons, Sonner, Swiper |
| PDF | jsPDF |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm
- MongoDB Atlas database
- Better Auth configuration
- Google OAuth credentials (if enabling Google sign-in)
- ImgBB API key (for image uploads)

### 1. Clone the repository

```bash
git clone https://github.com/sajidraian/studiospace-client.git
cd studiospace-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000

MONGODB_URI=your_mongodb_connection_string

BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

Use your own credentials and make sure the frontend and backend URLs match your local setup. For production, configure the corresponding deployment environment variables in your hosting provider.

> **Security:** Never commit `.env.local` or expose database credentials, OAuth secrets, Better Auth secrets, or private API keys. The repository's environment files should contain placeholders only.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Build and run the production version locally

```bash
npm run build
npm start
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create an optimized production build |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint checks |

## Authentication & Security

StudioSpace uses Better Auth for user authentication. The frontend obtains a signed JWT and maintains the backend authentication token in an HTTPOnly cookie. The backend verifies the token using Better Auth's JWKS endpoint before allowing protected operations.

- Private routes and account-specific actions require authentication.
- Backend requests use credentialed communication with the configured API origin.
- Studio management actions are restricted to the authenticated owner.
- Booking actions validate the current user and booking ownership.
- Booking confirmation checks for overlapping confirmed reservations.
- Keep all secrets in environment variables and use HTTPS in production.

## Related Links

| Resource | Link |
|---|---|
| Live Website | [studiospace-client-one.vercel.app](https://studiospace-client-one.vercel.app/) |
| Backend API | [studiospace-server-l4bg.onrender.com](https://studiospace-server-l4bg.onrender.com) |
| Backend Health Check | [API Health](https://studiospace-server-l4bg.onrender.com/api/health) |
| Frontend Source | [studiospace-client](https://github.com/sajidraian/studiospace-client) |
| Backend Source | [studiospace-server](https://github.com/sajidraian/studiospace-server) |

## Demo Accounts for Evaluation

Dedicated evaluation accounts are available for demonstrating the customer and studio-owner experiences.

| Account | Email | Role |
|---|---|---|
| Customer | `raian@gmail.com` | Customer |
| Studio Owner | `sajid12@gmail.com` | Studio Owner |

For security, demo passwords are not published in this repository. Share them with the evaluator through a private channel.

## Project Information

- **Project:** StudioSpace
- **Type:** Peer-to-peer creative workspace and production studio marketplace
- **Frontend:** Next.js application
- **Backend:** Express REST API
- **Database:** MongoDB Atlas
- **Deployment:** Vercel + Render

---

<p align="center">
  <strong>StudioSpace — Find Your Space. Create Your Story.</strong>
</p>
