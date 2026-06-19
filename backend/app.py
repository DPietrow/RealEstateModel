from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import os

# =====================================================
# APP SETUP (Gunicorn entry point)
# =====================================================
app = Flask(__name__)

# allow Vercel frontend
CORS(app, resources={r"/*": {"origins": "*"}})

# =====================================================
# PATHS (Railway-safe)
# =====================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "model", "house_price_pipeline.pkl")
ZIP_PATH = os.path.join(BASE_DIR, "data", "zip_to_state.csv")

pipeline = joblib.load(MODEL_PATH)

zip_df = pd.read_csv(ZIP_PATH)
zip_map = dict(zip(zip_df["zip"].astype(str), zip_df["state"]))


# =====================================================
# HEALTH CHECK (IMPORTANT FOR DEPLOYMENT)
# =====================================================
@app.route("/")
def health():
    return jsonify({
        "status": "ok",
        "message": "Real Estate API running"
    })


# =====================================================
# HELPERS
# =====================================================
def get_state_from_zip(zip_code: str):
    return zip_map.get(str(zip_code), "UNKNOWN")


def validate_input(data):
    required = ["bed", "bath", "house_size", "acre_lot", "zip_code"]

    for r in required:
        if r not in data:
            return f"Missing field: {r}"

    return None


# =====================================================
# PREDICT ROUTE
# =====================================================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # validation
        error = validate_input(data)
        if error:
            return jsonify({"error": error}), 400

        input_df = pd.DataFrame([{
            "bed": float(data["bed"]),
            "bath": float(data["bath"]),
            "house_size": float(data["house_size"]),
            "acre_lot": float(data["acre_lot"]),
            "zip_code": str(data["zip_code"]),
            "state": get_state_from_zip(data["zip_code"])
        }])

        pred_log = pipeline.predict(input_df)[0]

        if pred_log is None or np.isnan(pred_log):
            return jsonify({"error": "Model returned NaN"}), 500

        pred = float(np.expm1(pred_log))

        return jsonify({
            "predicted_price": round(pred, 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)