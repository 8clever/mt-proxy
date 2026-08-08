# ✈️ Telegram Proxy List

A modern, fast, and mobile-optimized web proxy collector for Telegram. Easily discover, latency-test, and connect to public MTProto and SOCKS5 proxies with a single tap.

![Telegram Proxy List App](https://img.shields.io/badge/Telegram-Proxy--Collector-blue?style=for-the-badge&logo=telegram)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## ✨ Features

- 🚀 **Instant Connection:** Direct `tg://proxy` deep links and `t.me/proxy` web links for 1-tap Telegram connection.
- 📱 **Mobile-First Design:** Clean, touch-friendly UI optimized for mobile devices and Telegram In-App Browser.
- 🛡️ **Multi-Protocol Support:** Filter and organize MTProto and SOCKS5 proxies effortlessly.
- ⚡ **Latency Testing:** Measure round-trip ping times to servers with instant visual speed indicators.
- 🔍 **Search & Filters:** Search by IP address, port, or secret key, and sort by lowest latency.
- 🎲 **Quick Connect:** Connect to a random working proxy with a single tap.
- 📋 **Batch Copy:** One-click copying for individual IP:Port strings, Telegram proxy links, or all visible links.
- ⚙️ **Custom Sources:** Update the proxy collection URL source or input custom raw text lists directly.
- 🌓 **Light & Dark Mode:** Clean minimalist aesthetic supporting both dark and light themes.

---

## 🛠 Tech Stack

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 Local Setup & Development

1. **Clone the repository:**
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd telegram-proxy-list
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```
   The app will be accessible at `http://localhost:3000`.

4. **Build for production:**
   ```bash
   npm run build
   ```
   Static output files will be generated in the `dist/` directory.

---

## 🌐 Deploying to GitHub Pages

This repository includes GitHub Actions automation in `.github/workflows/`. On pushing to the `main` branch, your app is automatically built and deployed.

To enable GitHub Pages deployment:
1. Navigate to repository **Settings** on GitHub.
2. Under **Pages**, select **GitHub Actions** as the build source.
3. Save changes. Subsequent commits to `main` will deploy automatically.

---

## 📄 License

MIT
