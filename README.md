# UrbanLuxe

> A modern full-stack real estate marketplace featuring map-based discovery, real-time chat, and secure authentication.

<!-- 
  HERO IMAGE REPLACEMENT:
  Replace 'hero-screenshot.png' with a high-quality screenshot of your application
  Recommended: Homepage view showing the property grid and map interface
  Dimensions: 1200x600px or similar 2:1 ratio
  Save as: docs/images/hero-screenshot.png
-->
<div align="center">
  <img src="docs/images/hero-screenshot.png" alt="UrbanLuxe Application" width="800px" />
</div>

<br />

<div align="center">
  
  [Live Demo](#) · [API Docs](#api-reference) · [Report Bug](#)
  
</div>

---

## 📋 Overview

UrbanLuxe is a full-stack real estate marketplace connecting renters, buyers, and agents through an intuitive platform. Built with modern web technologies, it offers map-based property discovery, saved listings, and real-time communication.

**Tech Stack:** React · Express · Prisma · MongoDB · Socket.IO

---

## ✨ Features

**Property Discovery**
- Interactive map-based browsing with Leaflet
- Advanced filtering (location, type, price, bedrooms)
- Detailed property views with agent information

**User Management**
- Secure JWT authentication with httpOnly cookies
- Profile management and customization
- Saved listings functionality

**Real-time Communication**
- Instant messaging between users and agents
- Online status tracking
- Read receipts and notifications

---

## 🖼️ Screenshots

<!-- 
  SCREENSHOT REPLACEMENTS:
  Replace these placeholder images with actual screenshots from your application
  
  1. browse.png - Show the main property listing page with map view
     Dimensions: 600x400px
     
  2. detail.png - Show a property detail page with images and information
     Dimensions: 600x400px
     
  3. chat.png - Show the real-time chat interface
     Dimensions: 600x400px
     
  Save all as: docs/images/[filename].png
-->

<table>
  <tr>
    <td width="33%">
      <img src="docs/images/browse.png" alt="Property Browse View" />
      <p align="center"><strong>Browse & Search</strong></p>
    </td>
    <td width="33%">
      <img src="docs/images/detail.png" alt="Property Detail View" />
      <p align="center"><strong>Property Details</strong></p>
    </td>
    <td width="33%">
      <img src="docs/images/chat.png" alt="Real-time Chat" />
      <p align="center"><strong>Real-time Chat</strong></p>
    </td>
  </tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Client    │ ───> │  REST API    │ ───> │  MongoDB    │
│  (React)    │      │  (Express)   │      │  (Prisma)   │
└─────────────┘      └──────────────┘      └─────────────┘
       │                                           
       └──────────────────────┐                    
                              ▼                    
                      ┌──────────────┐             
                      │  Socket.IO   │             
                      │   Server     │             
                      └──────────────┘             
```

**Key Design Decisions:**
- **JWT in httpOnly cookies** - Enhanced security against XSS attacks
- **Prisma + MongoDB** - Type-safe queries with document database flexibility
- **Separate Socket.IO service** - Independent scaling and clear separation of concerns
- **Resource-level authorization** - Ownership validation on all protected routes

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- MongoDB instance
- npm or yarn

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/urbanluxe.git
cd urbanluxe
```

**2. Setup API**

```bash
cd api
npm install
```

Create `api/.env`:

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/urbanluxe"
JWK="your-super-secret-jwt-key-min-32-characters"
CLIENT_URL="http://localhost:5173"
```

Start the server:

```bash
npm start
```

**3. Setup Socket Server**

```bash
cd socket
npm install
npm start
```

**4. Setup Client**

```bash
cd client
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |

### Properties

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/posts` | List properties with filters | No |
| GET | `/api/posts/:id` | Get property details | No |
| POST | `/api/posts` | Create property | Yes |
| PUT | `/api/posts/:id` | Update property | Yes (Owner) |
| DELETE | `/api/posts/:id` | Delete property | Yes (Owner) |

### Chat & Messages

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/chats` | Get user chats | Yes |
| POST | `/api/chats` | Create chat | Yes |
| POST | `/api/messages/:chatId` | Send message | Yes |

---

## 🛠️ Tech Stack

**Frontend**
- React 18 with Vite
- React Router for navigation
- Zustand for state management
- Sass for styling
- Leaflet for maps
- Axios for HTTP requests

**Backend**
- Node.js & Express
- Prisma ORM
- MongoDB
- JWT authentication
- bcrypt for password hashing
- Socket.IO for real-time features

---

## 📁 Project Structure

```
urbanluxe/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── routes/      # Page components
│   │   ├── lib/         # API client & utilities
│   │   └── context/     # React context providers
│   └── package.json
│
├── api/                 # Express REST API
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth & validation
│   ├── prisma/          # Database schema
│   └── app.js
│
└── socket/              # Socket.IO server
    └── app.js
```

---

## 🔐 Security Features

- Password hashing with bcrypt
- JWT tokens stored in httpOnly cookies
- CORS configuration with credentials
- Resource ownership validation
- Chat membership verification

---

## 🎯 Roadmap

- [ ] Request validation with Zod
- [ ] Rate limiting on auth endpoints
- [ ] Comprehensive test coverage
- [ ] CI/CD pipeline
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Property comparison feature


---

## 👤 Contact

**Your Name**  
📧 Email: your.email@example.com  
💼 LinkedIn: [linkedin.com/in/yourprofile](#)  
🌐 Portfolio: [yourportfolio.com](#)

---

<div align="center">
  
  
  ⭐ Star this repo if you find it helpful!
  
</div>
