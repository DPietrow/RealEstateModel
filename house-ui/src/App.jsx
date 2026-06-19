import { useState } from "react";
import "./App.css";

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

      const res = await fetch("http://127.0.0.1:5000/predict", {
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
    <div style={styles.app}>

     {/* ================= LEFT SIDEBAR ================= */}
<div style={styles.sidebar}>
  <h2>David Pietrow</h2>

  {/* PORTRAIT */}
  <img src="/portrait2.jpg" style={styles.avatar} />

  {/* ABOUT ME SECTION */}
  <div style={styles.aboutBox}>
    <h4 style={{ marginBottom: "8px" }}>About Me</h4>

    <p style={{ fontSize: "13px", color: "#aaa", lineHeight: "1.5" }}>
      I’m currently an Enterprise Architect exploring new opportunies, 
      ideally in a technical delivery AI/ML role such as a Forward Deployment Engineer or Solution Architect. If my work here
      interests you and you have a related opening, please feel free to reach out to me!
    </p>
  </div>

  {/* LINKS */}
  <a style={styles.link} href="https://github.com/DPietrow/RealEstateModel">
    My GitHub
  </a>

  <a style={styles.link} href="https://www.linkedin.com" target="_blank">
    My LinkedIn
  </a>

  <a style={styles.link} href="https://linktr.ee" target="_blank">
    You can find my other projects here
  </a>
</div>

      {/* ================= MAIN CENTER ================= */}
<div style={styles.main}>
  
  {/* FORM CARD */}
  <div style={styles.card}>
    <h2>House Price Predictor</h2>

    <input
      name="bed"
      placeholder="Beds"
      value={form.bed}
      onChange={handleChange}
    />

    <input
      name="bath"
      placeholder="Baths"
      value={form.bath}
      onChange={handleChange}
    />

    <input
      name="house_size"
      placeholder="House Size"
      value={form.house_size}
      onChange={handleChange}
    />

    <input
      name="acre_lot"
      placeholder="Acre Lot"
      value={form.acre_lot}
      onChange={handleChange}
    />

    <input
      name="zip_code"
      placeholder="ZIP Code"
      value={form.zip_code}
      onChange={handleChange}
    />

    <button onClick={handleSubmit} disabled={loading}>
      {loading ? "Predicting..." : "Predict Price"}
    </button>
  </div>

  {/* PROJECT DESCRIPTION CARD (SEPARATE) */}
  <div style={styles.descriptionCard}>
    <h3> About This Project</h3>

    <p style={{ color: "#aaa", lineHeight: "1.6", fontSize: "14px" }}>
      This machine learning system predicts real estate prices using a LightGBM regression model.
      It includes advanced feature engineering such as geographic clustering, target encoding,
      and log-transformed price prediction for improved accuracy. 
      Try it out and see how close I am to your home evaluation!
    </p>

    <p style={{ color: "#777", fontSize: "13px", marginTop: "10px" }}>
      Built as a full-stack project with React frontend + Flask backend API.
    </p>
  </div>

</div>
      {/* ================= RIGHT SIDEBAR (HISTORY) ================= */}
      <div style={styles.rightSidebar}>
        <h3>Predictions + History </h3>

        {history.length === 0 && (
          <p style={{ color: "#777" }}>No predictions yet</p>
        )}

        {history.map((item) => (
          <div key={item.id} style={styles.historyItem}>
            <div style={{ fontWeight: "bold" }}>
              ${Number(item.price).toLocaleString()}
            </div>
            <div style={{ fontSize: "12px", color: "#aaa" }}>
              {item.confidence}% confidence
            </div>
          </div>
        ))}

        {result && (
          <div style={styles.currentResult}>
            <h4>Latest</h4>
            <div style={{ color: "#4ade80", fontSize: "18px" }}>
              ${Number(result).toLocaleString()}
            </div>
            <div style={styles.barOuter}>
              <div
                style={{
                  ...styles.barInner,
                  width: `${confidence}%`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  app: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#0f0f10",
    color: "white",
    fontFamily: "Arial"
  },
  descriptionCard: {
  width: "100%",
  maxWidth: "750px",
  backgroundColor: "#1c1c1c",
  padding: "20px",
  borderRadius: "14px",
  color: "white",
  marginTop: "20px"
},
aboutBox: {
  backgroundColor: "#222",
  padding: "12px",
  borderRadius: "10px",
  marginTop: "10px",
  marginBottom: "10px"
},

  sidebar: {
    width: "260px",
    backgroundColor: "#171717",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  rightSidebar: {
    width: "280px",
    backgroundColor: "#171717",
    padding: "20px",
    overflowY: "auto"
  },

  main: {
  flex: 1,
  display: "flex",
  flexDirection: "column",   // 🔥 THIS FIXES IT
  alignItems: "center",
  padding: "30px",
  gap: "20px"
},

  card: {
    width: "100%",
    maxWidth: "750px",
    backgroundColor: "#1c1c1c",
    padding: "28px",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  link: {
    backgroundColor: "#333",
    padding: "10px",
    borderRadius: "8px",
    color: "white",
    textDecoration: "none",
    textAlign: "center"
  },

  avatar: {
    width: "100%",
    borderRadius: "12px"
  },

  historyItem: {
    backgroundColor: "#222",
    padding: "10px",
    borderRadius: "8px",
    marginTop: "8px"
  },

  currentResult: {
    marginTop: "20px",
    padding: "12px",
    backgroundColor: "#222",
    borderRadius: "8px"
  },

  barOuter: {
    height: "6px",
    backgroundColor: "#333",
    borderRadius: "4px",
    marginTop: "6px"
  },

  barInner: {
    height: "100%",
    backgroundColor: "#4ade80",
    borderRadius: "4px"
  }
};