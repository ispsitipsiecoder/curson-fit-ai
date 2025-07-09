import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import WorkoutLibrary from "./pages/WorkoutLibrary";
import NutritionTracker from "./pages/NutritionTracker";
import MealPlanning from "./pages/MealPlanning";
import Progress from "./pages/Progress";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <a href="/dashboard">Dashboard</a> | <a href="/workouts">Workout Library</a> | <a href="/nutrition">Nutrition Tracker</a> | <a href="/mealplanning">Meal Planning</a> | <a href="/progress">Progress</a>
        </nav>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workouts" element={<WorkoutLibrary />} />
          <Route path="/nutrition" element={<NutritionTracker />} />
          <Route path="/mealplanning" element={<MealPlanning />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 