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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
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
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    console.log("API RESPONSE:", data);

    if (!res.ok || data.error) {
      setResult("Error: " + (data.error || "Unknown error"));
      return;
    }

    setResult(data.predicted_price);

    // ✅ CLEAR FORM AFTER SUCCESS
    setForm({
      bed: "",
      bath: "",
      house_size: "",
      acre_lot: "",
      zip_code: ""
    });

  } catch (err) {
    console.error(err);
    setResult("Error contacting API");
  } finally {
    setLoading(false);
  }
};

  return (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      gap: "40px",
      padding: "50px",
      fontFamily: "Arial"
    }}
  >
    {/* ================= LEFT PANEL ================= */}
    <div style={{ width: "40%" }}>
      <img
        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa"
        alt="house"
        style={{
          width: "100%",
          borderRadius: "12px",
          marginBottom: "20px"
        }}
      />

      <h2>House Price Predictor</h2>

      <p style={{ lineHeight: "1.6", color: "#444" }}>
        This project uses a machine learning pipeline built with LightGBM to
        predict house prices based on features like number of bedrooms, bathrooms,
        house size, lot size, and ZIP code.
        <br /><br />
        The model includes advanced preprocessing such as target encoding,
        geographic clustering, and log-transformed regression for improved accuracy.
      </p>

      <a
        href="https://github.com/YOUR_USERNAME/YOUR_REPO"
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-block",
          marginTop: "10px",
          color: "white",
          backgroundColor: "#333",
          padding: "10px 15px",
          borderRadius: "6px",
          textDecoration: "none"
        }}
      >
        View GitHub Repo
      </a>
    </div>

    {/* ================= RIGHT PANEL ================= */}
    <div style={{ width: "40%" }}>
      <h2>Predictor Form</h2>

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
        placeholder="House Size (sqft)"
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

      {result !== null && (
        <h3 style={{ marginTop: 20 }}>
          {isNaN(result)
            ? "Invalid prediction"
            : `Predicted Price: $${Number(result).toLocaleString()}`}
        </h3>
      )}
    </div>
  </div>
);
}