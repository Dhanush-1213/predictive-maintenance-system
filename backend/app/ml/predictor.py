import joblib
import pandas as pd
from pathlib import Path

MODEL_PATH = Path(__file__).resolve().parent / "model.pkl"

bundle = joblib.load(MODEL_PATH)
model = bundle["model"]
metrics = bundle["metrics"]
feature_names = bundle["feature_names"]


def calculate_risk_score(probability: float) -> float:
    return round(probability * 100, 2)


def get_health_status(risk_score: float) -> str:
    if risk_score <= 30:
        return "Healthy"
    if risk_score <= 70:
        return "Warning"
    return "Critical"


def get_recommendation(data: dict) -> str:
    air_temp = data.get("Air temperature [K]", 0)
    process_temp = data.get("Process temperature [K]", 0)
    rotational_speed = data.get("Rotational speed [rpm]", 0)
    torque = data.get("Torque [Nm]", 0)
    tool_wear = data.get("Tool wear [min]", 0)

    if process_temp > 310 and tool_wear > 200:
        return "Inspect cooling system and consider tool replacement."
    if torque > 50 and rotational_speed < 1400:
        return "Check motor load and shaft alignment."
    if air_temp > 305 and torque > 55:
        return "Inspect overheating and vibration-related components."
    return "No immediate action required. Continue monitoring."


def predict_single(input_data: dict):
    df = pd.DataFrame([input_data])

    missing_cols = [col for col in feature_names if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Missing model input columns: {missing_cols}")

    df = df[feature_names]

    prediction = int(model.predict(df)[0])
    probability = float(model.predict_proba(df)[0][1])

    risk_score = calculate_risk_score(probability)
    status = get_health_status(risk_score)
    recommendation = get_recommendation(input_data)

    return {
        "failure_prediction": prediction,
        "failure_probability": round(probability, 4),
        "risk_score": risk_score,
        "health_status": status,
        "recommendation": recommendation,
    }


def predict_batch(df: pd.DataFrame):
    missing_cols = [col for col in feature_names if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Missing model input columns: {missing_cols}")

    df = df[feature_names].copy()

    preds = model.predict(df)
    probs = model.predict_proba(df)[:, 1]

    results = []
    for i in range(len(df)):
        row = df.iloc[i].to_dict()
        risk_score = calculate_risk_score(float(probs[i]))
        results.append({
            "row_id": i,
            "failure_prediction": int(preds[i]),
            "failure_probability": round(float(probs[i]), 4),
            "risk_score": risk_score,
            "health_status": get_health_status(risk_score),
            "recommendation": get_recommendation(row),
        })

    return results