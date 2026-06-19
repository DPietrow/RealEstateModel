import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score
from sklearn.pipeline import Pipeline
from lightgbm import LGBMRegressor

from preprocess import HousePricePreprocessor


data = pd.read_csv("source/realtor-data.zip.csv")

features = ["bed", "bath", "house_size", "zip_code", "acre_lot", "state"]
data = data.dropna(subset=features + ["price"])

X = data[features].copy()

# target clipping (VERY important for housing)
y = np.log1p(data["price"])
y = np.clip(y, np.percentile(y, 1), np.percentile(y, 99))


X_train, X_valid, y_train, y_valid = train_test_split(
    X, y, test_size=0.2, random_state=42
)

pipeline = Pipeline([
    ("preprocessor", HousePricePreprocessor()),
    ("model", LGBMRegressor(
        n_estimators=6000,
        learning_rate=0.015,

        num_leaves=96,
        max_depth=-1,

        subsample=0.85,
        colsample_bytree=0.85,

        min_child_samples=40,

        reg_alpha=0.1,
        reg_lambda=1.0,

        random_state=42
    ))
])

pipeline.fit(X_train, y_train)

preds = pipeline.predict(X_valid)

print("R²:", r2_score(np.expm1(y_valid), np.expm1(preds)))

joblib.dump(pipeline, "house_price_pipeline.pkl")

print("Saved pipeline")