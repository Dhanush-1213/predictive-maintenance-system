from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import pandas as pd

from app.schemas import SensorDataInput
from app.ml.predictor import predict_single, predict_batch, metrics

app = FastAPI(title="Predictive Maintenance API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="app/static"), name="static")


@app.get("/")
def root():
    return {"message": "Predictive Maintenance API is running"}


@app.get("/metrics")
def get_metrics():
    return metrics


@app.post("/predict")
def predict(data: SensorDataInput):
    result = predict_single(data.to_model_input())
    return result


@app.post("/predict-batch")
async def predict_batch_endpoint(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Please upload a CSV file.")

    try:
        df = pd.read_csv(file.file)
        df.columns = df.columns.str.strip()

        rename_map = {
            "Air_temperature_K": "Air temperature [K]",
            "Process_temperature_K": "Process temperature [K]",
            "Rotational_speed_rpm": "Rotational speed [rpm]",
            "Torque_Nm": "Torque [Nm]",
            "Tool_wear_min": "Tool wear [min]",
        }
        df = df.rename(columns=rename_map)

        expected_columns = [
            "Air temperature [K]",
            "Process temperature [K]",
            "Rotational speed [rpm]",
            "Torque [Nm]",
            "Tool wear [min]",
        ]

        missing = [col for col in expected_columns if col not in df.columns]
        if missing:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required columns: {missing}",
            )

        results = predict_batch(df)

        return {
            "total_rows": len(results),
            "predictions": results,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")