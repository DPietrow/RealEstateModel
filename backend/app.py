from flask import Flask, request, jsonify
from flask_cors import CORS
from preprocess import HousePricePreprocessor
import pandas as pd
import numpy as np
import joblib



# =====================================================
# LOAD MODEL
# =====================================================
pipeline = joblib.load("backend/model/house_price_pipeline.pkl")

# =====================================================
# LOAD ZIP → STATE MAP
# =====================================================
zip_df = pd.read_csv("backend/data/zip_to_state.csv")

zip_map = dict(zip(zip_df["zip"].astype(str), zip_df["state"]))


# =====================================================
# APP SETUP
# =====================================================
app = Flask(__name__)
CORS(app)


# =====================================================
# HELPERS
# =====================================================
def get_state_from_zip(zip_code: str):

    zip_code = str(zip_code)

    # fallback if ZIP not found
    return zip_map.get(zip_code, "UNKNOWN")


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

        input_df = pd.DataFrame([{
            "bed": data["bed"],
            "bath": data["bath"],
            "house_size": data["house_size"],
            "acre_lot": data["acre_lot"],
            "zip_code": str(data["zip_code"]),
            "state": ""
        }])

        pred_log = pipeline.predict(input_df)[0]

        # 🔒 DEBUG SAFETY CHECK
        if pred_log is None or np.isnan(pred_log):
            return jsonify({
                "error": "Model returned NaN",
                "raw": str(pred_log)
            }), 500

        # ONLY USE expm1 IF YOU TRAINED WITH log1p TARGET
        pred = float(np.expm1(pred_log))
        return jsonify({
            "predicted_price": round(pred, 2)
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# =====================================================
# RUN SERVER
# =====================================================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)