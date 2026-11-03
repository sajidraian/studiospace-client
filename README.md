<!-- ===================== HERO ===================== -->
<div align="center">

# ✦ StudioSpace

### Find Your Space. Create Your Story.

**A modern marketplace for discovering, listing, and booking creative studios.**

<br />

<a href="https://studiospace-client-one.vercel.app/">
  <img src="https://img.shields.io/badge/🚀_Live_Demo-Visit_StudioSpace-2563EB?style=for-the-badge" alt="Live Demo" />
</a>
<a href="https://github.com/sajidraian/studiospace-server">
  <img src="https://img.shields.io/badge/Backend-Source_Code-111827?style=for-the-badge&logo=github" alt="Backend Repository" />
</a>

<br /><br />

<img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js" />
<img src="https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react" alt="React" />
<img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
<img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
<img src="https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel" alt="Vercel" />

</div>

---

## ✨ About the Project

StudioSpace brings creative people and creative spaces together. It helps photographers, filmmakers, podcasters, musicians, and other creators discover suitable studios, while giving studio owners a simple way to publish listings and manage reservations.

The platform provides separate customer and studio-owner experiences, from studio discovery to booking management and post-booking reviews.

## ⚡ What You Can Do

<table>
  <tr>
    <td width="50%">
      <h3>🔎 Discover Studios</h3>
      Search and filter studio listings by category and location. Explore photos, facilities, pricing, and host information.
    </td>
    <td width="50%">
      <h3>🏢 Manage Listings</h3>
      Studio owners can create, update, view, and remove their own studio listings.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📅 Book with Confidence</h3>
      Customers can request reservations, track bookings, and cancel pending requests.
    </td>
    <td width="50%">
      <h3>📊 Owner Dashboard</h3>
      Owners can manage incoming booking requests and oversee their studio activity.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>⭐ Reviews & Ratings</h3>
      Eligible customers can leave feedback after completed bookings.
    </td>
    <td width="50%">
      <h3>🌗 A Personal Experience</h3>
      Switch between light and dark themes, with a responsive layout across devices.
    </td>
  </tr>
</table>

**More features:** Google and email authentication, protected account areas, booking conflict protection, PDF invoices, loading and empty states, and toast notifications.

## 🧭 User Journey

| Customer | Studio Owner |
|---|---|
| Create an account or sign in | Create an account or sign in |
| Explore and filter studios | Publish studio listings |
| View studio details | Edit and manage listings |
| Request a booking | Review booking requests |
| Track or cancel eligible bookings | Manage reservation status |
| Review completed bookings | Monitor studio activity |

## 🛠️ Tech Stack

| Layer | Tools |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Authentication | Better Auth, JWT, HTTPOnly cookies |
| Backend | Node.js, Express 5, TypeScript |
| Database | MongoDB Atlas |
| UI & Interaction | Lucide React, React Icons, Sonner, Swiper |
| Documents | jsPDF |
| Deployment | Vercel (Frontend), Render (Backend) |

## 🚀 Run Locally

### Prerequisites

- Node.js 20+
- npm
- MongoDB Atlas database
- Better Auth credentials
- Google OAuth credentials (for Google sign-in)
- ImgBB API key (for image uploads)

### 1. Clone

```bash
git clone https://github.com/sajidraian/studiospace-client.git
cd studiospace-client
```

### 2. Install

```bash
npm install
```

### 3. Configure environment

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

Use credentials from your own services and make sure the frontend and backend URLs match your local configuration.

> [!IMPORTANT]
> Never commit `.env.local` or expose database credentials, OAuth secrets, Better Auth secrets, or private API keys. Keep real credentials in your local environment or hosting-provider settings.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Create a production build

```bash
npm run build
npm start
```

## 📜 Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Generate an optimized production build |
| `npm start` | Run the production server |
| `npm run lint` | Check code quality with ESLint |

## 🔐 Authentication & Security

StudioSpace uses Better Auth for sign-in and session management. A signed JWT is issued for backend authentication and stored in an HTTPOnly cookie. The API verifies tokens using Better Auth's JWKS endpoint before allowing protected operations.

- Protected pages and account-specific actions require authentication.
- Studio management is restricted to the authenticated owner.
- Booking operations validate the current user and booking ownership.
- Booking confirmation checks for overlapping confirmed reservations.
- Production communication uses the configured deployment origins and HTTPS.

## 🌐 Live Links

| Service | URL |
|---|---|
| **Live Application** | [studiospace-client-one.vercel.app](https://studiospace-client-one.vercel.app/) |
| Backend API | [studiospace-server-l4bg.onrender.com](https://studiospace-server-l4bg.onrender.com) |
| API Health | [Check API status](https://studiospace-server-l4bg.onrender.com/api/health) |
| Frontend Repository | [studiospace-client](https://github.com/sajidraian/studiospace-client) |
| Backend Repository | [studiospace-server](https://github.com/sajidraian/studiospace-server) |

## 🧪 Evaluation Accounts

Use the following accounts to explore the two main user roles. Demo passwords are shared separately with the evaluator and are intentionally not stored in this public repository.

| Account | Email | Role |
|---|---|---|
| Customer | `raian@gmail.com` | Customer |
| Studio Owner | `sajid12@gmail.com` | Studio Owner |

## 📁 Related Repository

- **Frontend:** [sajidraian/studiospace-client](https://github.com/sajidraian/studiospace-client)
- **Backend:** [sajidraian/studiospace-server](https://github.com/sajidraian/studiospace-server)

---

<div align="center">

### ✦ StudioSpace

*Find Your Space. Create Your Story.*

<sub>Built to make finding and managing creative spaces simpler.</sub>

</div>
