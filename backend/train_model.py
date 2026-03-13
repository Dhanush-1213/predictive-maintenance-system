import pandas as pd
import joblib
from pathlib import Path
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    ConfusionMatrixDisplay,
)

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR.parent / "data" / "ai4i2020.csv"
MODEL_DIR = BASE_DIR / "app" / "ml"
STATIC_DIR = BASE_DIR / "app" / "static"

MODEL_DIR.mkdir(parents=True, exist_ok=True)
STATIC_DIR.mkdir(parents=True, exist_ok=True)

MODEL_PATH = MODEL_DIR / "model.pkl"
CONF_MATRIX_PATH = STATIC_DIR / "confusion_matrix.png"

df = pd.read_csv(DATA_PATH)
df.columns = df.columns.str.strip()

target_col = "Machine failure"

drop_cols = [
    "UDI",
    "Product ID",
    "Type",
    "TWF",
    "HDF",
    "PWF",
    "OSF",
    "RNF",
]

existing_drop_cols = [col for col in drop_cols if col in df.columns]
df = df.drop(columns=existing_drop_cols)

X = df.drop(columns=[target_col])
y = df[target_col]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    random_state=42,
    class_weight="balanced"
)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

feature_importance = dict(zip(X.columns, model.feature_importances_))

cm = confusion_matrix(y_test, y_pred)
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=["No Failure", "Failure"])
disp.plot(cmap="Blues")
plt.title("Confusion Matrix")
plt.tight_layout()
plt.savefig(CONF_MATRIX_PATH)
plt.close()

metrics = {
    "accuracy": accuracy_score(y_test, y_pred),
    "precision": precision_score(y_test, y_pred, zero_division=0),
    "recall": recall_score(y_test, y_pred, zero_division=0),
    "f1_score": f1_score(y_test, y_pred, zero_division=0),
    "roc_auc": roc_auc_score(y_test, y_prob),
    "feature_names": list(X.columns),
    "feature_importance": feature_importance,
    "confusion_matrix_image": "/static/confusion_matrix.png",
}

joblib.dump(
    {
        "model": model,
        "metrics": metrics,
        "feature_names": list(X.columns),
    },
    MODEL_PATH
)

print(f"Model saved to: {MODEL_PATH}")
print(f"Confusion matrix saved to: {CONF_MATRIX_PATH}")
print(metrics)