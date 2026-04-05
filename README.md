# 💎 FinDash: Premium Financial Analytics Dashboard

FinDash is a high-performance, glassmorphic financial dashboard built for modern wealth management. It combines cutting-edge design aesthetics with robust functional features, enabling users to track, analyze, and manage their finances with a premium user experience.

## 🚀 Live Evaluation & Key Features

### 1. 📈 Dynamic Analytics Intelligence
- **Intelligent Time-Scaling**: The Balance Trend chart automatically adapts its granularity based on your data range:
  - **Single Day Mode**: Hourly tracking (HH:mm) for high-frequency day traders/users.
  - **Mid-range (1-15 days)**: Standard Daily view for week-over-week trends.
  - **Growth Mode (15-60 days)**: Weekly aggregation to maintain a clean, smooth trend line.
  - **Long-term (60+ days)**: Monthly summaries for bird's-eye financial planning.
- **Theme-Aware Data Visualization**: Customized Recharts with premium gradients, theme-synced tooltips, and localized currency formatting.

### 2. 🛡️ Smart Fund Protection & UX
- **Insufficient Balance Logic**: Pro-active validation on both Quick Action modals and the Transaction Table prevents adding expenses that exceed the total available balance.
- **Premium Notification System**: Integrated **`sonner`** for high-performance, glassmorphic toast notifications. Includes success/error feedback with detailed sub-text descriptions.
- **Polished Controls**: Refined "Add Money" and "Send Money" modals with distinct, energetic color-coded "Confirm" buttons (`primary` vs `error`) and interactive depth-shadows.

### 3. 🎨 Design & Aesthetics
- **Glassmorphism Design System**: Built with modern CSS design tokens using semi-transparent containers, backdrop filters, and subtle border glows.
- **Micro-Animations**: Features a **Pulse Number Ticker** for financial totals and **Staggered Entry** animations for a cinematic dashboard load experience.
- **Dynamic Themes**: Hand-crafted Light and Dark modes that morph smoothly using persistent state.

### 4. ⚙️ Functionality & RBAC
- **Role-Based Access Control (RBAC)**: Supports "Admin" and "Viewer" roles.
  - **Admin**: Full access to add/send money and delete historical transactions.
  - **Viewer**: Read-only view with restricted action buttons and hidden administration columns.
- **Dynamic Calculations**: Instant balance, income, and expense tracking with Indian Rupee (INR) localization.
- **Unified Controls**: Responsive search and filter bar that adapts from a 3-column desktop view to a mobile-stacked view intelligently.

## 🛠️ Tech Stack
- **Library**: React 18, Vite, TypeScript.
- **Icons & UI**: Lucide Icons, Sonner (Toasts).
- **Visualization**: Recharts (Customized).
- **State**: **Zustand** with persistent storage to `localStorage`.
- **Styling**: Modern CSS Design Tokens with Utility Logic.

## 🛠️ Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd finance-dashboard
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## 📈 State Management Approach
We used **Zustand** for its lightweight footprint and high performance. The store handles:
- **Transactions**: Persistent array of financial entries.
- **Theme**: User-selected appearance mode.
- **Role**: Global RBAC state affecting UI visibility and action permissions.

## 🎯 Attention to Detail
- **INR Formatting**: Numbers follow the Indian numbering system (e.g., 1,00,000).
- **Edge Case Handling**: Empty states for graphs and tables ensure the UI looks polished even with zero data.
- **Mobile-Adaptive Layout**: Fully responsive sidebar, summary cards, and chart containers that reorganize based on screen size.