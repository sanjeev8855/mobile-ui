# Personal Mobile UI with Custom Features

A personal mobile interface built with React 19, Vite, TypeScript, Tailwind CSS, Framer Motion, and Web Audio API synthesis.

## 🚀 Quick Start in VS Code

1. Open a terminal in VS Code (`Ctrl + ~`).
2. Run the development server:
   ```bash
   npm run dev
   ```
3. To allow your mobile phone on the same Wi-Fi network to connect:
   ```bash
   npm run dev -- --host
   ```
4. Access in your browser:
   - **Local**: `http://localhost:5173`
   - **Mobile (Same Wi-Fi)**: Check terminal output for the Network IP (e.g. `http://10.12.80.135:5173`)

## 📲 How to Install as an App on Your Phone

1. On your phone, visit the network URL in Safari (iOS) or Chrome (Android).
2. **iOS Safari**: Tap the **Share** button -> **"Add to Home Screen"**.
3. **Android Chrome**: Tap the **three dots** -> **"Install app"** or **"Add to Home screen"**.
4. The app will launch as a full-screen, standalone application with offline support!

## 🧩 Project Structure

```text
personal-mobile-ui/
├── src/
│   ├── components/
│   │   ├── layout/       # MobileShell, StatusBar, DynamicIsland
│   │   ├── navigation/   # BottomDock, CommandPalette
│   │   ├── widgets/      # Habits, FocusPomodoro, AICapsule, Notes, Expenses, etc.
│   │   └── views/        # Home, Widgets Studio, Assistant, Apps, Settings
│   ├── context/          # AppContext (vault state) & ThemeContext (6 themes)
│   ├── utils/            # Web Audio API Sound Synthesizer (rain, waves, chimes)
│   ├── types/            # TypeScript data models
│   ├── App.tsx           # Main application root
│   └── index.css         # Tailwind & custom glow styling
├── public/               # PWA manifest.json & web icons
└── package.json
```
