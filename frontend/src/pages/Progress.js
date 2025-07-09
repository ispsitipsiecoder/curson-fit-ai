import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function weekAgoISO() {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  return d.toISOString().slice(0, 10);
}

function Progress() {
  const [startDate, setStartDate] = useState(weekAgoISO());
  const [endDate, setEndDate] = useState(todayISO());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchProgress = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(
        `http://localhost:8000/progress/nutrition?start_date=${startDate}&end_date=${endDate}`
      );
      const d = await res.json();
      setData(d);
    } catch {
      setMessage("Error fetching progress data.");
    }
    setLoading(false);
  };

  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Calories",
        data: data.map((d) => d.calories),
        borderColor: "#f39c12",
        backgroundColor: "#f9e79f",
      },
      {
        label: "Protein (g)",
        data: data.map((d) => d.protein),
        borderColor: "#2980b9",
        backgroundColor: "#aed6f1",
      },
      {
        label: "Carbs (g)",
        data: data.map((d) => d.carbs),
        borderColor: "#27ae60",
        backgroundColor: "#abebc6",
      },
      {
        label: "Fats (g)",
        data: data.map((d) => d.fats),
        borderColor: "#c0392b",
        backgroundColor: "#f5b7b1",
      },
    ],
  };

  const totals = data.reduce(
    (acc, d) => {
      acc.calories += d.calories;
      acc.protein += d.protein;
      acc.carbs += d.carbs;
      acc.fats += d.fats;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );
  const avg = data.length
    ? {
        calories: Math.round(totals.calories / data.length),
        protein: Math.round(totals.protein / data.length),
        carbs: Math.round(totals.carbs / data.length),
        fats: Math.round(totals.fats / data.length),
      }
    : totals;

  return (
    <div>
      <h2>Progress & Analytics</h2>
      <form onSubmit={fetchProgress} style={{ marginBottom: 16 }}>
        <label>
          Start Date: <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        </label>{" "}
        <label>
          End Date: <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
        </label>{" "}
        <button type="submit" disabled={loading}>Show Progress</button>
      </form>
      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}
      {data.length > 0 && (
        <>
          <Line data={chartData} />
          <h4>Analytics</h4>
          <p>
            <strong>Totals:</strong><br />
            Calories: {totals.calories} kcal<br />
            Protein: {totals.protein} g<br />
            Carbs: {totals.carbs} g<br />
            Fats: {totals.fats} g
          </p>
          <p>
            <strong>Averages per day:</strong><br />
            Calories: {avg.calories} kcal<br />
            Protein: {avg.protein} g<br />
            Carbs: {avg.carbs} g<br />
            Fats: {avg.fats} g
          </p>
        </>
      )}
    </div>
  );
}

export default Progress; 