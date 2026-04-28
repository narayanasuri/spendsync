# SpendSync: Product Overview

SpendSync is a **privacy-first, mobile-optimized personal finance companion** designed to bridge the gap between complex accounting software and overly simple manual trackers. Built with a "Native-Web" approach, it offers a seamless, high-performance experience for tracking expenses, managing budgets, and monitoring financial health in real-time.

---

## 1. Core Value Proposition

SpendSync focuses on **speed of entry** and **data clarity**. Most users abandon expense trackers because the friction of adding a log is too high. SpendSync reduces this friction through a streamlined UI, haptic feedback, and smart defaults.

- **Privacy Centric:** Users own their data through Supabase integration.
- **Real-time Insights:** Instant aggregation of spending by category and payment mode.
- **Adaptive UI:** Designed specifically for iOS/Android web browsers with native-like navigation and gestures.

---

## 2. Key Features

### ⚡ Rapid Logging

- **Single-Tap Entry:** Access the "Add Log" drawer from any screen via the persistent center action button.
- **Smart Defaults:** Automatically suggests the most used payment modes and categories.
- **Haptic Interaction:** Uses the `ios-haptics` library to provide physical confirmation of actions, mimicking a native app environment.

### 📊 Financial Intelligence

- **Dynamic Grouping:** View spending habits grouped by **Category** (e.g., Housing, Groceries) or **Payment Mode** (e.g., Credit Card, Cash).
- **Infinite History:** Seamlessly scroll through months of financial history with optimized infinite loading and server-side pagination.
- **Balance Management:** Automatically updates account balances using database-level RPC (Remote Procedure Calls) whenever a log is added.

### 🛠 Technical Excellence

- **Tech Stack:** Next.js 14, Tailwind CSS, Shadcn UI, and Supabase.
- **Performance:** Implements aggressive caching and optimistic UI updates for zero-latency feel.
- **Accessibility:** WCAG-compliant color palettes for health statuses (Green for Optimal, Amber for Warning, Red for Critical).

---

## 3. Product Roadmap

- **Income Tracking:** Expansion beyond expense logging to include full cash-flow management.
- **Recurring Expenses:** Automated logging for subscriptions and bills.
- **Data Export:** One-click CSV generation for tax and accounting purposes.
- **Shared Budgets:** Collaborative tracking for couples and households.

---

## 4. Target Audience

- **The Intentional Spender:** Individuals who want to be mindful of where their money goes without spending hours on spreadsheets.
- **The Digital Nomad:** Users who require a mobile-first tool that works across various currencies and payment methods.
- **Privacy Advocates:** Users who prefer self-hosted or transparent cloud solutions over traditional banking apps that sell data.
