# Serenity AI

Serenity AI is a modern and intuitive mental wellness web application that seamlessly blends AI technology with holistic self-care tools. Built with React.js and Firebase, Serenity AI empowers users to enhance their emotional well-being through journaling, mood tracking, guided meditation, relaxing music, games, and both text and voice-based AI support.

**Live Demo:** [https://the-serenity-ai.vercel.app/](https://the-serenity-ai.vercel.app/)

---

## Table of Contents

* [Features](#features)
* [Screenshots](#screenshots)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)

  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Running Locally](#running-locally)
  * [Environment Variables](#environment-variables)
* [Project Structure](#project-structure)
* [Usage Guide](#usage-guide)
* [Deployment](#deployment)
* [Contributing](#contributing)
* [License](#license)

---

## Features

* **Dashboard:** Central hub with quick access to all features and motivational content.
* **Journal:** Securely write and store daily reflections, with AI-generated insights.
* **Mood Tracker:** Log emotional states and visualize mood trends.
* **Guidebook & Resources:** Curated wellness guides, articles, and self-help content.
* **Mindful Breathing:** Interactive breathing exercises to reduce stress.
* **Calm Tunes:** Curated playlists of nature sounds, meditation music, and sleep aids.
* **Games & Challenges:** Engaging activities like emotion puzzles, affirmation games, and mindful listening tasks.
* **AI Chat Assistant (Serena):** Smart, text-based AI support.
* **Voice Assistant (Comfort Zone):** Talk to the AI for spoken support and comfort.
* **Personalization:** Toggle dark/light mode and manage account settings.
* **Secure Authentication:** Google Sign-in via Firebase.
* **Responsive Design:** Works beautifully on both desktop and mobile.

---

## Screenshots

> *To add screenshots, place image files inside the `public/screenshots/` directory and reference them below:*

```
![Dashboard](public/screenshots/dashboard.png)
![Journal](public/screenshots/journal.png)
![Mood Tracker](public/screenshots/mood-tracker.png)
![Serena Chat](public/screenshots/serena-chat.png)
![Serena Chat](public/screenshots/serena-voice.png)
![Serena Chat](public/screenshots/wellness-resources.png)
![Serena Chat](public/screenshots/mental-health-guidebook.png)
![Serena Chat](public/screenshots/games-and-challenges.png)
![Serena Chat](public/screenshots/memory-match.png)
![Serena Chat](public/screenshots/mindful-breathing.png)
```

---

## Tech Stack

* **Frontend:** React 18, Vite, React Router, SCSS/Sass, TailwindCSS
* **Backend & Auth:** Firebase (Firestore, Auth)
* **AI Integration:** Google Generative AI (Gemini)
* **Hosting & Deployment:** Vercel
* **Design:** Responsive UI, dark/light mode toggle, animated transitions
* **Other Tools:** ESLint, Prettier

---

## Getting Started

### Prerequisites

* Node.js (v16+)
* npm
* Firebase project setup (Firestore & Authentication enabled)
* (Optional) Vercel account for deployment

### Installation

1. Clone the repository:

```bash
git clone https://github.com/pranav-c-r/Serenity-AI.git
cd Serenity-AI
```

2. Install dependencies:

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

App will run at: [http://localhost:5173](http://localhost:5173)

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## Project Structure

```
Serenity-AI/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── config/
│   ├── utils/
│   ├── hooks/
│   ├── App.jsx
│   ├── main.jsx
│   └── main.scss
├── .env
├── package.json
├── vite.config.js
└── README.md
```

---

## Usage Guide

* Sign in using Google.
* Use the sidebar for navigation.
* Write journal entries and receive AI feedback.
* Track your mood and review analytics.
* Use the breathing tool to relax.
* Listen to calming sounds through Calm Tunes.
* Play games to boost focus and emotional awareness.
* Talk or chat with Serena for mental support.

---

## Deployment

To deploy on Vercel:

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Click Deploy

---

## Contributing

We welcome contributions! Feel free to fork the repo, open issues, or submit pull requests.

---

## License

This project is licensed under the MIT License.

---

**Live Demo:** [https://the-serenity-ai.vercel.app/](https://the-serenity-ai.vercel.app/)
