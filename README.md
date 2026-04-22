# 🍱 Bangin' Bites Desktop App

[![Tauri](https://img.shields.io/badge/Tauri-2.0-24C8DB?style=for-the-badge&logo=tauri&logoColor=white)](https://tauri.app/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-State_Management-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)

Bangin' Bites Desktop is a robust cross-platform management and ordering solution. Built with **Tauri v2** and **React 19**, it provides a high-performance desktop experience for administrators, kitchen owners, and customers.

---

## 🚀 Key Features

### 👑 Administrator Portal
- **User Management:** Oversee and manage all registered users and their roles.
- **Seller Oversight:** Validate and manage kitchen partners (Sellers).
- **Category Control:** Dynamically manage food categories and system-wide settings.
- **Financial Analytics:** Track platform-wide revenue and growth metrics.

### 👨‍🍳 Seller Dashboard
- **Menu Management:** Advanced interface for adding and editing dishes with image support.
- **Order Processing:** Real-time order management pipeline for efficient kitchen operations.
- **Deep Analytics:** Detailed charts and reports on kitchen performance and sales trends.
- **Real-time Notifications:** Instant alerts for new orders and system updates.

### 🛒 Buyer Experience
- **Kitchen Exploration:** Browse local kitchens and discover new culinary delights.
- **Seamless Ordering:** Full-featured cart and checkout system with Stripe integration.
- **Order History:** Detailed tracking of past and current orders.
- **Favorites & Reviews:** Save preferred items and share feedback with the community.

---

## 🛠️ Technical Excellence

- **Core Framework:** [Tauri](https://tauri.app/) for a tiny footprint and native performance.
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) for predictable application state.
- **Real-time Connectivity:** [Socket.io](https://socket.io/) for instant updates across all platforms.
- **Payment Processing:** [Stripe](https://stripe.com/) for secure and reliable transactions.
- **Data Visualization:** [Recharts](https://recharts.org/) for beautiful, interactive analytics.
- **UI & Animations:** 
  - [Tailwind CSS](https://tailwindcss.com/) for modern, responsive styling.
  - [Framer Motion](https://www.framer.com/motion/) for fluid and high-quality animations.
  - [Lucide React](https://lucide.dev/) for premium iconography.

---

## 📁 Project Structure

```text
src/
├── components/     # Reusable UI components (Shared, Layout, UI)
├── pages/          # Role-based screen components
│   ├── admin/      # Management dashboards and user control
│   ├── seller/     # Kitchen and menu management
│   ├── buyer/      # Browsing and ordering interface
│   ├── auth/       # Authentication flows (Login, Signup, OTP)
│   └── shared/     # Common pages (Notifications, Profile)
├── store/          # Redux Toolkit slices and store configuration
├── services/       # API integration and external service handlers
├── hooks/          # Custom React hooks for shared logic
├── context/        # React context providers
├── lib/            # Utility libraries and configurations
└── types/          # Global TypeScript type definitions
```

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js** (LTS)
- **Rust** (Required for Tauri builds)
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd banginBites-dapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root and configure your API and Stripe keys.

### Development Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Run the frontend in Vite (browser mode) |
| `npm run tauri dev` | Launch the Desktop App in Development mode |
| `npm run build` | Build the frontend for production |
| `npm run tauri build` | Build the native desktop installer |

---

## 🛡️ Security & Performance
- **Tiny Bundle:** Tauri's Rust-based backend ensures a significantly smaller footprint than Electron.
- **Native Security:** Leverages Rust's memory safety and native OS security features.
- **Deep Linking:** Custom protocol support (`banginbites-desktop://`) for seamless app integration.

---

## 📄 License
This project is private and proprietary. All rights reserved.

---
Built with 🧡 by the **Bangin' Bites** Team.

