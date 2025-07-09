import React, { useState } from "react";

const initialProfile = {
  age: 25,
  weight: 70,
  height: 175,
  gender: "male",
  activity_level: "moderate",
  goal: "maintenance",
};

function MealPlanning() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(initialProfile);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const generatePlan = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:8000/mealplan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          age: Number(profile.age),
          weight: Number(profile.weight),
          height: Number(profile.height),
        }),
      });
      const data = await res.json();
      setPlan(data);
    } catch {
      setMessage("Error connecting to server.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Meal Planning</h2>
      <form onSubmit={generatePlan} style={{ marginBottom: 16 }}>
        <label>
          Age: <input type="number" name="age" value={profile.age} onChange={handleProfileChange} required />
        </label>{" "}
        <label>
          Weight (kg): <input type="number" name="weight" value={profile.weight} onChange={handleProfileChange} required />
        </label>{" "}
        <label>
          Height (cm): <input type="number" name="height" value={profile.height} onChange={handleProfileChange} required />
        </label>{" "}
        <label>
          Gender:
          <select name="gender" value={profile.gender} onChange={handleProfileChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>{" "}
        <label>
          Activity Level:
          <select name="activity_level" value={profile.activity_level} onChange={handleProfileChange}>
            <option value="sedentary">Sedentary</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
            <option value="very active">Very Active</option>
          </select>
        </label>{" "}
        <label>
          Goal:
          <select name="goal" value={profile.goal} onChange={handleProfileChange}>
            <option value="fat loss">Fat Loss</option>
            <option value="maintenance">Maintenance</option>
            <option value="muscle gain">Muscle Gain</option>
          </select>
        </label>{" "}
        <button type="submit" disabled={loading}>
          {plan ? "Regenerate Meal Plan" : "Generate Meal Plan"}
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}
      {plan && (
        <div>
          <h3>Your Personalized Meal Plan</h3>
          <ul>
            {plan.plan.map((meal, idx) => (
              <li key={idx}>
                <strong>{meal.name}</strong>: {meal.calories} kcal, P: {meal.protein}g, C: {meal.carbs}g, F: {meal.fats}g
              </li>
            ))}
          </ul>
          <h4>Daily Totals</h4>
          <p>
            Calories: {plan.totals.calories} kcal (Target: {plan.targets.calories})<br />
            Protein: {plan.totals.protein} g (Target: {plan.targets.protein})<br />
            Carbs: {plan.totals.carbs} g (Target: {plan.targets.carbs})<br />
            Fats: {plan.totals.fats} g (Target: {plan.targets.fats})
          </p>
        </div>
      )}
    </div>
  );
}

export default MealPlanning; 