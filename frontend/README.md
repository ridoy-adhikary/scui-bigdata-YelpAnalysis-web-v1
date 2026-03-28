# Statista Clone - Big Data Analysis Frontend

A production-grade, pixel-perfect clone of Statista.com built with React, TypeScript, and Tailwind CSS v4.

## 🚀 Features

- **Dynamic Data Visualization**: Integrated Chart.js, Recharts, and custom animations for data points.
- **Advanced Navigation**: Sticky header with complex Mega Menu dropdowns and full-screen mobile overlay.
- **Interactive Chatbot**: AI-style assistant with Framer Motion animations and staggered typing indicators.
- **Data Tables**: Sortable and paginated data tables with CSV export functionality.
- **GSAP Animations**: Professional scroll-triggered animations and page entrance sequences.
- **Responsive Design**: Mobile-first architecture covering all breakpoints.
- **Performance Optimized**: Code splitting with React.lazy/Suspense and efficient asset management.

## 🛠 Tech Stack

- **Core Frontend**: React 19, React DOM 19, TypeScript (strict)
- **Build Tooling**: Vite 8, `@vitejs/plugin-react`
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` + PostCSS + Autoprefixer)
- **Routing**: React Router DOM 7
- **Charts & Visualization**: Chart.js 4 + `react-chartjs-2`, Recharts, D3
- **Tables**: TanStack React Table v8
- **Animation**: Framer Motion, GSAP
- **Maps**: Leaflet, React Leaflet
- **Data Loading/Parsing**: PapaParse, Axios
- **Utilities**: Lodash, Fuse.js, Zustand, `clsx`, `tailwind-merge`, date-fns
- **Testing (installed)**: Vitest

## 📦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 🏗 Project Structure

- `src/components/layout`: Core layout elements (Header, Footer).
- `src/components/charts`: Specialized chart wrapper components.
- `src/components/chatbot`: Full chatbot implementation.
- `src/components/home`: Sections specific to the homepage (Hero, TrustBadges).
- `src/components/table`: Functional data table components.
- `src/pages`: Main application views (Home, Statistics, NotFound).
- `src/styles`: Tailwind configuration and global animations.

## ✅ Success Criteria

- Pixel-perfect implementation of the Statista aesthetic.
- 60fps animations for charts and UI interactions.
- Accessible navigation and interactive elements.
- Clean, type-safe codebase.