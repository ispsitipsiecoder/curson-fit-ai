import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function NutritionTracker() {
  const [meals, setMeals] = useState([]);
  const [form, setForm] = useState({ name: "", calories: "", protein: "", carbs: "", fats: "", date: todayISO() });
  const [message, setMessage] = useState("");
  const [date, setDate] = useState(todayISO());
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (!token) {
    return (
      <div>
        <p>You are not logged in.</p>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  const fetchMeals = async () => {
    const res = await fetch(`http://localhost:8000/meals?date=${date}`);
    const data = await res.json();
    setMeals(data);
  };

  useEffect(() => {
    fetchMeals();
    // eslint-disable-next-line
  }, [date]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:8000/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          date,
          calories: parseFloat(form.calories),
          protein: form.protein ? parseFloat(form.protein) : null,
          carbs: form.carbs ? parseFloat(form.carbs) : null,
          fats: form.fats ? parseFloat(form.fats) : null,
        }),
      });
      if (res.ok) {
        setMessage("Meal added!");
        setForm({ name: "", calories: "", protein: "", carbs: "", fats: "", date });
        fetchMeals();
      } else {
        const data = await res.json();
        setMessage(data.detail || "Failed to add meal.");
      }
    } catch {
      setMessage("Error connecting to server.");
    }
  };

  const handleDeleteMeal = async (id) => {
    setMessage("");
    try {
      const res = await fetch(`http://localhost:8000/meals/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage("Meal deleted.");
        fetchMeals();
      } else {
        setMessage("Failed to delete meal.");
      }
    } catch {
      setMessage("Error connecting to server.");
    }
  };

  const totals = meals.reduce(
    (acc, m) => {
      acc.calories += m.calories || 0;
      acc.protein += m.protein || 0;
      acc.carbs += m.carbs || 0;
      acc.fats += m.fats || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return (
    <div>
      <h2>Nutrition Tracker</h2>
      <label>
        Select date: <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </label>
      <h3>Meals for {date}</h3>
      <ul>
        {meals.map((meal) => (
          <li key={meal.id}>
            <strong>{meal.name}</strong>: {meal.calories} kcal, P: {meal.protein || 0}g, C: {meal.carbs || 0}g, F: {meal.fats || 0}g
            <button style={{ marginLeft: 8 }} onClick={() => handleDeleteMeal(meal.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h4>Daily Totals</h4>
      <p>
        Calories: {totals.calories} kcal<br />
        Protein: {totals.protein} g<br />
        Carbs: {totals.carbs} g<br />
        Fats: {totals.fats} g
      </p>
      <h3>Add Meal</h3>
      <form onSubmit={handleAddMeal}>
        <input
          type="text"
          name="name"
          placeholder="Meal Name"
          value={form.name}
          onChange={handleFormChange}
          required
        />
        <input
          type="number"
          name="calories"
          placeholder="Calories"
          value={form.calories}
          onChange={handleFormChange}
          required
        />
        <input
          type="number"
          name="protein"
          placeholder="Protein (g)"
          value={form.protein}
          onChange={handleFormChange}
        />
        <input
          type="number"
          name="carbs"
          placeholder="Carbs (g)"
          value={form.carbs}
          onChange={handleFormChange}
        />
        <input
          type="number"
          name="fats"
          placeholder="Fats (g)"
          value={form.fats}
          onChange={handleFormChange}
        />
        <button type="submit">Add Meal</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default NutritionTracker; 