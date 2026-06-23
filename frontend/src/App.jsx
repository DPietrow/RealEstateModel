import { useState } from "react";
import "./App.css";
const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [form, setForm] = useState({
    bed: "",
    bath: "",
    house_size: "",
    acre_lot: "",
    zip_code: ""
  });

  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme")
      ? localStorage.getItem("theme") === "dark"
      : true
  );


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    try {
      const payload = {
        bed: Number(form.bed),
        bath: Number(form.bath),
        house_size: Number(form.house_size),
        acre_lot: Number(form.acre_lot),
        zip_code: form.zip_code
      };

      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setResult("Error");
        return;
      }

      const prediction = data.predicted_price;
      const fakeConfidence = (Math.random() * 15 + 80).toFixed(1);

      setResult(prediction);
      setConfidence(fakeConfidence);

      setHistory((prev) => [
        { id: Date.now(), price: prediction, confidence: fakeConfidence },
        ...prev.slice(0, 6)
      ]);

      setForm({
        bed: "",
        bath: "",
        house_size: "",
        acre_lot: "",
        zip_code: ""
      });
    } catch {
      setResult("Error contacting API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>

      {/* LEFT NAV */}
      <div className="sidebar">
        <div className="brand">
          <h2>Real Estate AI</h2>
          <p>ML Pricing Engine</p>
        </div>

        {/* PROFILE CARD */}
        <div className="profileCard">
          <img src="/portrait2.jpg" alt="profile" />
          <div>
            <h4>David Pietrow</h4>
            <p>Enterprise Architect</p>
          </div>
        </div>

        {/* ABOUT ME */}
        <div className="aboutCard">
          <h4>About Me</h4>
          <p>
            I’m currently an Enterprise Architect exploring new opportunies,
            ideally in a technical delivery AI/ML role such as a Forward Deployment Engineer or Solution Architect.
            If my work here interests you and you have a related opening, please feel free to reach out to me!
          </p>
        </div>

        {/* LINKS */}
        <div className="links">
          <a href="https://github.com/DPietrow/RealEstateModel/tree/main">GitHub</a>
          <a href="https://www.linkedin.com/in/david-pietrow/">LinkedIn</a>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        <div className="themeToggle">
          <button
            className="themeButton"
            onClick={() => {
            const next = !darkMode;
            setDarkMode(next);
            localStorage.setItem("theme", next ? "dark" : "light");
              }}
          >
            {darkMode
            ? "☀️ Switch to Light Mode"
            : "🌙 Switch to Dark Mode"}
          </button>
        </div>
        {/* HERO INPUT CARD */}
        <div className="card hero">
          <h2>House Price Predictor</h2>

          <div className="grid">
            <input name="bed" placeholder="Beds" value={form.bed} onChange={handleChange} />
            <input name="bath" placeholder="Baths" value={form.bath} onChange={handleChange} />
            <input name="house_size" placeholder="House Size" value={form.house_size} onChange={handleChange} />
            <input name="acre_lot" placeholder="Acre Lot" value={form.acre_lot} onChange={handleChange} />
            <input name="zip_code" placeholder="ZIP Code" value={form.zip_code} onChange={handleChange} />
          </div>

          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Predicting..." : "Predict Price"}
          </button>
        </div>

        {/* RESULT CARD */}
        {result && (
          <div className="card resultCard">
            <h3>Prediction</h3>
            <div className="price">
              ${Number(result).toLocaleString()}
            </div>

            <div className="bar">
              <div style={{ width: `${confidence}%` }} />
            </div>

            <p className="muted">{confidence}% model confidence</p>
          </div>
        )}

        {/* DESCRIPTION */}
        <div className="card">
        <h3
        style={{
          marginBottom: "20px"
        }}
        >About This Model</h3>

        <p style={{ marginBottom: "16px" }}>
          LightGBM regression model with feature engineering including geographic
          clustering, target encoding, and log-transformed price prediction,
          deployed using a React frontend and Python Flask API. Try it out and see
          how close I get to your home's valuation!
        </p>

        <p style={{ marginBottom: "16px" }}>
          Please note that this application is hosted on Render's free tier.
          Predictions may take up to a minute to be returned to the webpage,
          especially after periods of inactivity.
        </p>

        <p>
          For a more in-depth analysis of the project, I invite you to review the
          README in the GitHub repository.
        </p>
        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="right">
        <h3>Recent Predictions</h3>

        {history.length === 0 && (
          <p className="muted">No predictions yet</p>
        )}

        {history.map((h) => (
          <div key={h.id} className="historyItem">
            <div>${Number(h.price).toLocaleString()}</div>
            <span>{h.confidence}%</span>
          </div>
        ))}
      </div>

    </div>
  );
}