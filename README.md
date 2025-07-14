# 🏋️‍♂️ Curson Fit AI

Curson Fit AI is a full-stack fitness and nutrition platform with AI-powered features. It helps users manage workouts, track nutrition, plan meals, monitor progress, and interact with an AI Assistant (powered by Gemini). The project uses a FastAPI backend, a React frontend, and is containerized with Docker for easy deployment.

---

## 🚀 Overview
Curson Fit AI provides:
- User registration and login
- Workout library and management
- Nutrition tracking and meal planning
- Progress monitoring
- AI Assistant (Gemini) for smart Q&A

---

## 🛠️ Technologies Used
- **Backend:** Python, FastAPI, SQLAlchemy, SQLite (default)
- **Frontend:** React (JavaScript)
- **AI Integration:** Gemini API (Google Generative Language)
- **Containerization:** Docker, Docker Compose
- **Authentication:** JWT-based user management

---

## 📦 Project Structure
```
backend/
  app/
    main.py           # FastAPI app, Gemini integration
    ...
  requirements.txt
  Dockerfile
frontend/
  src/
    App.js
    pages/
      AIAssistant.js  # Gemini AI Assistant page
      ...
  package.json
  Dockerfile
docker-compose.yml
README.md
```

---

## ⚙️ How to Run Locally

### 1. Prerequisites
- Docker & Docker Compose (recommended)
- Or: Python 3.10+, Node.js 18+

### 2. Clone the Repository
```
git clone https://github.com/ispsitipsiecoder/curson-fit-ai.git
cd curson-fit-ai
```

### 3. Set Environment Variables
- For Gemini AI, set your API key:
  - In your shell: `export GEMINI_API_KEY=your_gemini_api_key`
  - Or add to `docker-compose.yml` under backend > environment

### 4. Run with Docker Compose
```
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

### 5. Run Manually (Dev Mode)
- **Backend:**
  ```
  cd backend/app
  pip install -r ../requirements.txt
  uvicorn main:app --reload --host 0.0.0.0 --port 8000
  ```
- **Frontend:**
  ```
  cd frontend
  npm install
  npm start
  ```

---

## 🤖 AI Assistant (Gemini)
- Visit the "AI Assistant" page in the app.
- Enter a question; the backend will query Gemini and return an answer.

---

## 🌐 Deployment
- **Frontend:** Deploy to Vercel (recommended)
- **Backend:** Deploy to Render, Railway, or similar
- Set environment variables for production (e.g., `GEMINI_API_KEY`)

---

## 📢 Why Curson Fit AI?
Curson Fit AI demonstrates a modern, extensible approach to fitness management, combining classic features with AI-powered assistance.

---

> **Ready to get started? Clone the repo, set up your environment, and explore fitness with AI!** 