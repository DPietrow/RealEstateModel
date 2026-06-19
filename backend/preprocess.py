import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.cluster import KMeans


class HousePricePreprocessor(BaseEstimator, TransformerMixin):

    def fit(self, X, y):
        df = X.copy()
        df["y"] = y

        self.global_mean = y.mean()

        # =========================
        # ZIP + STATE TARGET ENCODING
        # =========================
        zip_stats = df.groupby("zip_code")["y"].agg(["mean", "count"])
        self.zip_mean = zip_stats["mean"]
        self.zip_count = zip_stats["count"]

        state_stats = df.groupby("state")["y"].agg(["mean", "count"])
        self.state_mean = state_stats["mean"]
        self.state_count = state_stats["count"]

        # =========================
        # ZIP fallback mapping
        # =========================
        self.zip_to_state = (
            df.groupby("zip_code")["state"]
            .agg(lambda x: x.mode().iloc[0])
        )

        # =========================
        # 🌍 GEO CLUSTERING (KEY UPGRADE)
        # =========================
        # We create a pseudo-geographic representation of ZIPs using statistics
        zip_geo = df.groupby("zip_code")[["bed", "bath", "house_size"]].mean()

        self.kmeans = KMeans(
            n_clusters=30,
            random_state=42,
            n_init="auto"
        )
        self.kmeans.fit(zip_geo)

        self.zip_to_cluster = pd.Series(
            self.kmeans.predict(zip_geo),
            index=zip_geo.index
        )

        return self


    def transform(self, X):
        X = X.copy()

        # =========================
        # numeric log transforms
        # =========================
        for col in ["bed", "bath", "house_size", "acre_lot"]:
            X[col] = np.log1p(X[col])

        # =========================
        # CLUSTER FEATURE (NEW MAIN SIGNAL)
        # =========================
        X["zip_cluster"] = X["zip_code"].map(self.zip_to_cluster)
        X["zip_cluster"] = X["zip_cluster"].fillna(-1).astype(int)

        # =========================
        # ZIP SMOOTHED ENCODING
        # =========================
        zip_mean = X["zip_code"].map(self.zip_mean)
        zip_count = X["zip_code"].map(self.zip_count)

        zip_mean = zip_mean.fillna(self.global_mean)
        zip_count = zip_count.fillna(0)

        alpha = 30

        X["zip_signal"] = (
            (zip_mean * zip_count + alpha * self.global_mean)
            / (zip_count + alpha)
        )

        # =========================
        # STATE SIGNAL (stable)
        # =========================
        X["state"] = X["state"].fillna("UNKNOWN")

        state_mean = X["state"].map(self.state_mean)
        state_count = X["state"].map(self.state_count)

        state_mean = state_mean.fillna(self.global_mean)
        state_count = state_count.fillna(0)

        beta = 40

        X["state_signal"] = (
            (state_mean * state_count + beta * self.global_mean)
            / (state_count + beta)
        )

        # =========================
        # REMOVE RAW HIGH-NOISE FEATURES
        # =========================
        X.drop(columns=["zip_code", "state"], inplace=True)

        return X