# 🏠 HomeWise v0.5.0

HomeWise is a futuristic IoT dashboard and automation platform built for smart home enthusiasts and developers. It provides a seamless interface for managing ESP32-based devices with real-time feedback and secure authentication.

## ✨ Latest Updates (v0.5.0)

This version introduces significant stability and robustness improvements to the platform:

### 🔐 Robust Authentication
- **Hybrid Persistence**: Implemented a hybrid strategy using both `LocalStorage` and `Cookies`. This ensures sessions persist even on page refreshes or when `localStorage` is volatile.
- **Secure Fallback**: The API client now automatically switches to cookie-based validation if local storage tokens are missing.

### 🔌 Seamless Data Mapping
- **API Alignment**: Standardized the mapping between frontend camelCase models (`apiKeyId`, `id`) and backend snake_case JSON (`api_key_id`).
- **Device Connectivity**: Resolved issues where devices appeared as "Unassigned" due to ID mapping discrepancies.

### 🏗️ Architectural Excellence
- **Clean Architecture**: Refactored the codebase into distinct layers (UI → Application → Domain → Infrastructure) for better maintainability and testability.
- **TypeScript Optimization**: Fixed various indexing and narrowing errors to provide a strictly typed development experience.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- NPM / PNPM

### Installation
```bash
npm install
```

### Running the Development Server
```bash
npm run dev
```
The application will be available at [http://localhost:9002](http://localhost:9002).

## 🛠️ Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **Architecture**: Domain-Driven Clean Architecture
- **HTTP Client**: Axios with custom interceptors
- **Icons**: Lucide React

---

## 📁 Project Structure
- `src/domain`: Business logic and model definitions (Source of truth).
- `src/application`: Use cases and custom hooks.
- `src/infrastructure`: External services (API calls, data sources).
- `src/components`: UI components organized by domain.
- `src/app`: Next.js pages and server actions.

---

*HomeWise - Making smart homes smarter.*
