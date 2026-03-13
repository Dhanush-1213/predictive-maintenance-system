
# 🔧 Predictive Maintenance System

A full-stack industrial IoT application that uses machine learning to predict equipment failures, assess machine health in real time, and surface actionable maintenance recommendations — all through an interactive React dashboard.

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#-usage)
  - [Dashboard](#dashboard)
  - [Upload Data (Batch Prediction)](#upload-data-batch-prediction)
  - [Model Metrics](#model-metrics)
- [API Reference](#-api-reference)
- [Machine Learning Model](#-machine-learning-model)
- [Dataset](#-dataset)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌐 Overview

Unplanned machine downtime is one of the costliest problems in industrial operations. This system uses a trained **Random Forest classifier** on the [AI4I 2020 Predictive Maintenance Dataset](https://archive.ics.uci.edu/ml/datasets/AI4I+2020+Predictive+Maintenance+Dataset) to analyze real-time sensor readings and predict the probability of machine failure before it happens.

The backend exposes a **FastAPI** REST API for both single and batch predictions. The frontend is a **React + Vite** dashboard with live health status cards, sensor charts, alert panels, and a CSV upload tool.

---

## ✨ Features

- **Real-time Failure Prediction** — Submit live sensor readings and get instant failure probability, risk score, and health status
- **Batch CSV Upload** — Upload a CSV file of sensor readings and get predictions for every row at once
- **Health Status Classification** — Each machine is labelled `Healthy`, `Warning`, or `Critical` based on risk score thresholds
- **Actionable Recommendations** — Rule-based engine surfaces specific maintenance guidance (e.g. *"Inspect cooling system and consider tool replacement"*)
- **Interactive Sensor Charts** — Recharts-powered visualizations of torque, temperature, tool wear, and rotational speed across machines
- **Model Metrics Dashboard** — Accuracy, precision, recall, F1 score, ROC-AUC, feature importances, and confusion matrix — all served live from the model bundle
- **Responsive UI** — Clean React dashboard with gradient layout, card-based health indicators, and alert panels

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, React Router v7, Recharts, Axios |
| **Backend** | Python, FastAPI, Uvicorn |
| **Machine Learning** | scikit-learn (Random Forest), pandas, NumPy, joblib |
| **Data** | AI4I 2020 Predictive Maintenance Dataset (UCI) |

---

## 📁 Project Structure

```
predictive-maintenance-system/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app & route definitions
│   │   ├── schemas.py           # Pydantic request models
│   │   ├── ml/
│   │   │   ├── predictor.py     # Inference logic, risk scoring, recommendations
│   │   │   └── model.pkl        # Trained Random Forest bundle (model + metrics)
│   │   └── static/
│   │       └── confusion_matrix.png
│   ├── train_model.py           # Model training & evaluation script
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Main health monitoring view
│   │   │   ├── UploadData.jsx   # Batch CSV prediction page
│   │   │   └── Metrics.jsx      # Model performance & feature importance
│   │   ├── components/
│   │   │   ├── Layout.jsx       # App shell & navigation
│   │   │   ├── HealthCard.jsx   # Summary stat cards
│   │   │   ├── AlertCard.jsx    # Warning/critical alert items
│   │   │   ├── MachineTable.jsx # Full machine predictions table
│   │   │   └── SensorChart.jsx  # Recharts sensor visualization
│   │   └── services/
│   │       └── api.js           # Axios base configuration
│   ├── index.html
│   └── package.json
│
├── data/
│   └── ai4i2020.csv             # Training dataset
└── screenshots/
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+**
- **Node.js 18+** and **npm**

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. (Recommended) Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Train the model (generates model.pkl and confusion_matrix.png)
python train_model.py

# 5. Start the API server
uvicorn app.main:app --reload
```

The API will be available at **`http://127.0.0.1:8000`**.  
Interactive API docs: **`http://127.0.0.1:8000/docs`**

> **Note:** A pre-trained `model.pkl` is already included. You only need to run `train_model.py` if you want to retrain the model.

---

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **`http://localhost:5173`**.

> Make sure the backend is running before launching the frontend.

---

## 📖 Usage

### Dashboard

The main dashboard runs predictions against 4 built-in sample machines with varied sensor profiles. Click **"Run Sample Predictions"** to:

- Fetch failure probability and risk score for each machine
- View summary health cards (Total / Healthy / Warning / Critical counts)
- Inspect sensor readings in an interactive bar chart
- Review recent alerts for machines in Warning or Critical state
- See the full prediction table with recommendations

![Dashboard](screenshots/dashboard%202.png)

### Upload Data (Batch Prediction)

Navigate to **Upload Data** to submit a CSV file with multiple sensor readings at once.

**Required CSV columns:**

| Column Name | Alternate (auto-renamed) | Description |
|---|---|---|
| `Air temperature [K]` | `Air_temperature_K` | Ambient temperature in Kelvin |
| `Process temperature [K]` | `Process_temperature_K` | Process temperature in Kelvin |
| `Rotational speed [rpm]` | `Rotational_speed_rpm` | Spindle speed |
| `Torque [Nm]` | `Torque_Nm` | Applied torque |
| `Tool wear [min]` | `Tool_wear_min` | Cumulative tool wear in minutes |

The API accepts both the original bracket-style names and the underscore variants, making it easy to export directly from most SCADA or historian systems.

![Upload Page](screenshots/Upload%20data%20page%20.png)

### Model Metrics

Navigate to **Metrics** to view live model performance statistics fetched directly from the model bundle:

- Accuracy, Precision, Recall, F1 Score, ROC-AUC
- Feature importance rankings
- Confusion matrix image

![Metrics](screenshots/metrics.png)

---

## 📡 API Reference

### `GET /`
Health check. Returns `{ "message": "Predictive Maintenance API is running" }`.

---

### `GET /metrics`
Returns model evaluation metrics and feature importances.

**Response:**
```json
{
  "accuracy": 0.985,
  "precision": 0.91,
  "recall": 0.88,
  "f1_score": 0.89,
  "roc_auc": 0.97,
  "feature_names": ["Air temperature [K]", ...],
  "feature_importance": { "Air temperature [K]": 0.12, ... },
  "confusion_matrix_image": "/static/confusion_matrix.png"
}
```

---

### `POST /predict`
Single machine prediction.

**Request body:**
```json
{
  "Air_temperature_K": 300.0,
  "Process_temperature_K": 310.5,
  "Rotational_speed_rpm": 1500,
  "Torque_Nm": 45.0,
  "Tool_wear_min": 120
}
```

**Response:**
```json
{
  "failure_prediction": 0,
  "failure_probability": 0.0821,
  "risk_score": 8.21,
  "health_status": "Healthy",
  "recommendation": "No immediate action required. Continue monitoring."
}
```

---

### `POST /predict-batch`
Batch prediction from a CSV file upload.

**Request:** `multipart/form-data` with a `.csv` file field named `file`.

**Response:**
```json
{
  "total_rows": 100,
  "predictions": [
    {
      "row_id": 0,
      "failure_prediction": 1,
      "failure_probability": 0.8342,
      "risk_score": 83.42,
      "health_status": "Critical",
      "recommendation": "Inspect cooling system and consider tool replacement."
    }
  ]
}
```

---

## 🤖 Machine Learning Model

| Detail | Value |
|---|---|
| **Algorithm** | Random Forest Classifier |
| **Estimators** | 200 trees |
| **Max Depth** | 10 |
| **Class Weights** | Balanced (handles class imbalance) |
| **Train/Test Split** | 80% / 20% (stratified) |
| **Features** | Air temp, Process temp, Rotational speed, Torque, Tool wear |
| **Target** | Binary `Machine failure` label |

**Risk Score Thresholds:**

| Risk Score | Status |
|---|---|
| ≤ 30 | ✅ Healthy |
| 31 – 70 | ⚠️ Warning |
| > 70 | 🔴 Critical |

**Recommendation Engine:**

Beyond ML predictions, a rule-based layer maps sensor combinations to specific maintenance actions:
- High process temperature + high tool wear → inspect cooling system
- High torque + low rotational speed → check motor load and shaft alignment
- High air temperature + high torque → inspect overheating and vibration components

---

## 📊 Dataset

This project uses the **AI4I 2020 Predictive Maintenance Dataset** from the UCI Machine Learning Repository.

- **10,000** data points simulating industrial milling machine behavior
- **6 features** used for training (after dropping metadata and sub-failure-type columns)
- **~3.4%** positive (failure) rate — balanced via `class_weight="balanced"`

> Matzka, S. (2020). *Explainable Artificial Intelligence for Predictive Maintenance Applications.* IEEE AIKE.

---

## 📸 Screenshots

| Dashboard | Alerts | Metrics |
|---|---|---|
| ![](screenshots/dashboard%201.png) | ![](screenshots/dashboard%203.png) | ![](screenshots/metrics.png) |

| Confusion Matrix | Upload Page |
|---|---|
| ![](screenshots/confusion%20matrix.png) | ![](screenshots/Upload%20data%20page%20.png) |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Ideas for Future Improvements

- [ ] WebSocket support for live streaming sensor data
- [ ] Time-series anomaly detection model
- [ ] Docker Compose setup for one-command deployment
- [ ] Authentication & multi-user support
- [ ] Historical prediction logging with a database backend
- [ ] Email / Slack alert notifications for Critical machines

---
Author 
Dhanush K | PES University | CSE(AIML)

---

<div align="center">
  Built with ⚙️ FastAPI · ⚛️ React · 🌲 scikit-learn
</div>
