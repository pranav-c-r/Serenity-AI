# Serenity AI

Serenity AI is a modern, full-featured mental wellness web application that combines journaling, mood tracking, guided meditations, games, music, and AI-powered chat/voice support. It is designed to help users improve their mental health, build positive habits, and find comfort through interactive and engaging tools.

**Live Demo:** [https://the-serenity-ai.vercel.app/](https://the-serenity-ai.vercel.app/)

---

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
  - [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Dashboard:** Overview of your wellness journey, quick access to all features.
- **Journal:** Write daily entries, save your thoughts, and get AI-powered feedback.
- **Mood Tracker:** Log your mood, view history, and track emotional trends.
- **Guidebook:** Curated mental health resources and guides.
- **Resources:** Articles, videos, and links for self-help and learning.
- **Mindful Breathing:** Guided breathing exercises for relaxation.
- **Calm Tunes:** Listen to relaxing music and nature sounds.
- **Games & Challenges:** Play cognitive and mindfulness games (e.g., word puzzles, emotion recognition, mindful listening, affirmation builder, etc.).
- **Chat with Serena:** Text-based AI chat for support and conversation.
- **Comfort Zone:** Voice-based AI assistant for spoken support.
- **Settings:** Personalize your experience, including dark/light mode.
- **Authentication:** Secure Google login and user data storage via Firebase.
- **Mobile Responsive:** Fully optimized for mobile and desktop.

---

## Screenshots

> _Add screenshots here of the dashboard, journal, chat, games, etc. for visual reference._

---

## Tech Stack

- **Frontend:** React 18, React Router, SCSS/Sass, Vite
- **Backend/Database:** Firebase (Firestore, Auth)
- **AI Integration:** Google Generative AI (Gemini)
- **UI/UX:** Modern, responsive, dark/light mode, animated transitions
- **Other:** ESLint, TailwindCSS (utility), Vercel (deployment)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A [Firebase](https://firebase.google.com/) project (for authentication and database)
- (Optional) [Vercel](https://vercel.com/) account for deployment

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/Serenity-AI.git
   cd Serenity-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running Locally

Start the development server:

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) (or as indicated in your terminal).

### Environment Variables

Create a `.env` file in the root directory and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

You can find these values in your Firebase project settings.

---

## Project Structure

```
Serenity-AI/
├── public/                # Static assets (logo, icons, etc.)
├── src/
│   ├── assets/            # Images, music, etc.
│   ├── components/        # Reusable UI components (layout, chat, auth, etc.)
│   ├── context/           # React context providers (auth, theme)
│   ├── pages/             # Main feature pages (Journal, Dashboard, Games, etc.)
│   ├── services/          # API and AI service integrations
│   ├── config/            # Firebase config
│   ├── utils/             # Utility functions
│   ├── hooks/             # Custom React hooks
│   ├── main.jsx           # App entry point
│   ├── App.jsx            # Main app and routing
│   └── main.scss          # Global styles
├── package.json
├── vite.config.js
└── README.md
```

---

## Usage Guide

### Authentication

- Sign up or log in using your Google account.
- All your data (journal, moods, etc.) is securely stored in Firebase.

### Main Features

- **Dashboard:** Quick links and motivational quotes.
- **Journal:** Write, save, and analyze your thoughts. Click "What Serenity felt" for AI feedback.
- **Mood Tracker:** Select your mood, view mood history.
- **Guidebook & Resources:** Browse curated articles, guides, and videos.
- **Mindful Breathing:** Follow animated breathing exercises.
- **Calm Tunes:** Play relaxing music and nature sounds.
- **Games & Challenges:** Play games to boost mindfulness and cognitive skills.
- **Chat with Serena:** Type messages to chat with the AI assistant.
- **Comfort Zone:** Speak to Serena for voice-based support.
- **Settings:** Switch between dark and light mode, manage your account.

### Navigation

- Use the sidebar to navigate between features.
- The app is fully responsive and works on mobile devices.

---

## Deployment

To deploy on Vercel:

1. Push your code to GitHub.
2. Connect your repository to [Vercel](https://vercel.com/).
3. Set the same environment variables in Vercel's dashboard.
4. Deploy!

---

## Contributing

Contributions are welcome! Please open issues or pull requests for improvements, bug fixes, or new features.

---

## License

MIT License

---

**Live Demo:** [https://the-serenity-ai.vercel.app/](https://the-serenity-ai.vercel.app/)

---

If you have any questions or need help, feel free to open an issue or contact the maintainer.
