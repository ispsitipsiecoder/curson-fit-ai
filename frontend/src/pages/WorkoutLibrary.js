import React, { useEffect, useState } from "react";

function WorkoutLibrary() {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", category: "", difficulty: "" });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ category: "", difficulty: "" });
  const [message, setMessage] = useState("");

  const fetchWorkouts = async () => {
    const res = await fetch("http://localhost:8000/workouts");
    const data = await res.json();
    setWorkouts(data);
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:8000/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMessage("Workout added!");
        setForm({ name: "", description: "", category: "", difficulty: "" });
        fetchWorkouts();
      } else {
        const data = await res.json();
        setMessage(data.detail || "Failed to add workout.");
      }
    } catch {
      setMessage("Error connecting to server.");
    }
  };

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleFilterChange = (e) => setFilter({ ...filter, [e.target.name]: e.target.value });

  const filteredWorkouts = workouts.filter((w) => {
    return (
      (!search || w.name.toLowerCase().includes(search.toLowerCase())) &&
      (!filter.category || w.category === filter.category) &&
      (!filter.difficulty || w.difficulty === filter.difficulty)
    );
  });

  const uniqueCategories = [...new Set(workouts.map((w) => w.category).filter(Boolean))];
  const uniqueDifficulties = [...new Set(workouts.map((w) => w.difficulty).filter(Boolean))];

  return (
    <div>
      <h2>Workout Library</h2>
      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={handleSearchChange}
        />
        <select name="category" value={filter.category} onChange={handleFilterChange}>
          <option value="">All Categories</option>
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select name="difficulty" value={filter.difficulty} onChange={handleFilterChange}>
          <option value="">All Difficulties</option>
          {uniqueDifficulties.map((dif) => (
            <option key={dif} value={dif}>{dif}</option>
          ))}
        </select>
      </div>
      <ul>
        {filteredWorkouts.map((w) => (
          <li key={w.id}>
            <strong>{w.name}</strong> ({w.category}, {w.difficulty})<br />
            <em>{w.description}</em>
          </li>
        ))}
      </ul>
      <h3>Add New Workout</h3>
      <form onSubmit={handleAddWorkout}>
        <input
          type="text"
          name="name"
          placeholder="Workout Name"
          value={form.name}
          onChange={handleFormChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleFormChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleFormChange}
        />
        <input
          type="text"
          name="difficulty"
          placeholder="Difficulty"
          value={form.difficulty}
          onChange={handleFormChange}
        />
        <button type="submit">Add Workout</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default WorkoutLibrary; 