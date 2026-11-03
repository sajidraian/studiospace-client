# StudioSpace — Creative Spaces for Creators

🌐 **Live Website:** https://studiospace-client-one.vercel.app/

StudioSpace is a peer-to-peer creative workspace and production studio sharing platform. It connects studio owners with photographers, filmmakers, podcasters, musicians, and other creative professionals.

Users can discover creative spaces, explore studio details, book available time slots, and manage their reservations. Studio owners can list and manage their creative workspaces.

## ✨ Key Features

- **User Authentication:** Secure email/password and Google authentication using Better Auth.
- **Studio Exploration:** Browse creative studios with category, location, rating, and pricing information.
- **Studio Management:** Create, update, and delete studio listings.
- **Studio Details:** View studio images, amenities, host information, and other specifications.
- **Booking System:** Submit booking requests and manage booking status.
- **Double Booking Prevention:** Prevent overlapping confirmed reservations.
- **User Dashboard:** Manage studio listings and personal bookings.
- **Review & Rating System:** Customers can review eligible completed bookings and studios display average ratings.
- **Theme Customization:** Switch between light and dark themes with saved preferences.
- **PDF Booking Invoice:** Generate downloadable booking invoices.
- **Responsive Design:** Optimized for mobile, tablet, and desktop devices.
- **Protected Routes:** Secure access to authenticated user features.

## 🛠️ Technology Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Lucide React
- Swiper.js
- Sonner

### Authentication
- Better Auth
- MongoDB Adapter
- JWT Authentication
- HTTPOnly Cookies

### Backend
- Express.js
- Node.js
- TypeScript
- MongoDB

### Deployment
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

## 📦 Installation and Setup

### Prerequisites

- Node.js 20 or later
- npm
- MongoDB Atlas account

### 1. Clone the Repository

```bash
git clone https://github.com/sajidraian/studiospace-client.git
```

### 2. Navigate to the Project

```bash
cd studiospace-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

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

Replace the placeholder values with your own credentials.

**Important:** Never commit `.env.local` or publish database credentials, API keys, OAuth secrets, or authentication secrets.

### 5. Start the Development Server

```bash
npm run dev
```

Open the application in your browser:

http://localhost:3000

## 🔗 Backend Repository

**Server-side source code:**

https://github.com/sajidraian/studiospace-server

**Backend API:**

https://studiospace-server-l4bg.onrender.com

## 👨‍💻 Developer

- **Project Name:** StudioSpace
- **Project Type:** Peer-to-Peer Creative Workspace Marketplace
- **Frontend Repository:** https://github.com/sajidraian/studiospace-client
- **Backend Repository:** https://github.com/sajidraian/studiospace-server
- **Live Website:** https://studiospace-client-one.vercel.app/

## 🧪 Examiner Demo Accounts

The following dedicated demo accounts are available for evaluation.

### Customer Account
- **Email:** raian@gmail.com
- **Role:** Customer

### Studio Owner Account
- **Email:** sajid12@gmail.com
- **Role:** Studio Owner

For security, demo passwords should be shared directly with the examiner through a private channel rather than published in this public repository.

## 📝 Additional Notes

- Users can register and log in using email/password or Google.
- Studio owners can manage their own studio listings.
- Customers can explore studios and submit booking requests.
- Customers can manage their bookings and submit eligible studio reviews.
- Studio owners can manage booking requests.
- Private operations require authentication.
- Booking conflicts are checked to prevent overlapping confirmed reservations.
- User preferences, including theme selection, are saved.

---

**StudioSpace — Find Your Space. Create Your Story.**
