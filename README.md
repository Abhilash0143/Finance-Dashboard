# 💎 FinDash: Premium Financial Analytics Dashboard

FinDash is a high-performance, glassmorphic financial dashboard built for modern wealth management. It combines cutting-edge design aesthetics with robust functional features, enabling users to track, analyze, and manage their finances with a premium user experience.

## 🚀 Live Evaluation & Key Features

### 1. Design & Creativity
- **Glassmorphism Design System**: Built with modern CSS design tokens using semi-transparent containers, backdrop filters, and subtle border glows.
- **Micro-Animations**: Features a **Pulse Number Ticker** for financial totals and **Staggered Entry** animations for a cinematic dashboard load experience.
- **Dynamic Themes**: Hand-crafted Light and Dark modes that morph smoothly using persistent state.

### 2. Responsiveness
- **Mobile-Adaptive Layout**: Fully responsive sidebar, summary cards, and chart containers.
- **Single-Line Pagination**: Custom pagination logic that stays in one line on mobile while sacrificing no usability.
- **Unified Controls**: Responsive search and filter bar that adapts from a 3-column desktop view to a mobile-stacked view intelligently.

### 3. Functionality & RBAC
- **Role-Based Access Control (RBAC)**: Supports "Admin" and "Viewer" roles.
  - **Admin**: Full access to add/send money and delete historical transactions.
  - **Viewer**: Read-only view with restricted action buttons and hidden administration columns.
- **Dynamic Calculations**: Instant balance, income, and expense tracking with Indian Rupee (INR) localization.
- **Quick-Action Modals**: Custom-built glassmorphic modals for adding funds with immediate state updates.

### 4. Technical Quality
- **Tech Stack**: React 18, Vite, TypeScript, Lucide Icons, Recharts.
- **State Management**: Orchestrated via **Zustand** with persistent storage to `localStorage`, ensuring a seamless experience across browser refreshes.
- **Modular Structure**: Logic is separated into pure utility functions (`calculations.ts`), visual components, and a centralized store.
- **Performance Optimized**: Leverages `useMemo` for heavy data filtering/sorting and Zustand selectors to minimize re-renders.

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
- **Chart Polish**: Customized Recharts tooltips with theme-aware colors and localized currency symbols.
- **Edge Case Handling**: Empty states for graphs and tables ensure the UI looks polished even with zero data.