from datasets import load_dataset
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OrdinalEncoder
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)
from tabpfn import TabPFNClassifier
import numpy as np


# ==========================================
# 1. LOAD DATASET
# ==========================================

print("Loading dataset...")

ds = load_dataset(
    "arun-gharami/lead-ai-fraud-detection-dataset-v2"
)

df = ds["train"].to_pandas()

print("Dataset loaded successfully!")
print("Shape:", df.shape)

print("\nRisk label distribution:")
print(df["risk_label"].value_counts())


# ==========================================
# 2. FEATURES AND TARGET
# ==========================================

X = df.drop(
    columns=[
        "risk_label",
        "transaction_id",
        "customer_id"
    ]
)

y = df["risk_label"]


# ==========================================
# 3. TRAIN / TEST SPLIT
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("\nTraining data:", X_train.shape)
print("Testing data:", X_test.shape)


# ==========================================
# 4. ENCODE CATEGORICAL FEATURES
# ==========================================

categorical_columns = [
    "merchant_category",
    "transaction_country",
    "device_type",
    "transaction_type",
    "geo_location_region"
]

encoder = OrdinalEncoder(
    handle_unknown="use_encoded_value",
    unknown_value=-1
)

X_train[categorical_columns] = encoder.fit_transform(
    X_train[categorical_columns]
)

X_test[categorical_columns] = encoder.transform(
    X_test[categorical_columns]
)

print("Categorical columns encoded successfully!")


# ==========================================
# 5. CREATE AND TRAIN TABPFN
# ==========================================

print("\n==============================================")
print("          TABPFN MODEL TRAINING")
print("==============================================")

model = TabPFNClassifier()


# ------------------------------------------
# STRATIFIED 5,000 SAMPLE SELECTION
# ------------------------------------------

print("\nSelecting 5,000 stratified training samples...")

X_train_small, _, y_train_small, _ = train_test_split(
    X_train,
    y_train,
    train_size=5000,
    random_state=42,
    stratify=y_train
)

print("Small training data:", X_train_small.shape)

print("\nTraining sample distribution:")
print(y_train_small.value_counts())


# ------------------------------------------
# TRAIN MODEL
# ------------------------------------------

print("\nTraining TabPFN with 5,000 stratified samples...")

model.fit(
    X_train_small,
    y_train_small
)

print("\nModel training completed!")


# ==========================================
# 6. GET FRAUD PROBABILITIES
# ==========================================

print("\n==============================================")
print("          FRAUD PROBABILITY")
print("==============================================")

print("\nGetting fraud probabilities...")

probabilities = model.predict_proba(X_test)

# Find class 1 = Fraud
fraud_class_index = list(model.classes_).index(1)

fraud_probability = probabilities[:, fraud_class_index]

print("Fraud probabilities generated!")


# ==========================================
# 7. TEST MULTIPLE THRESHOLDS
# ==========================================

thresholds = [
    0.10,
    0.20,
    0.30,
    0.40,
    0.50,
    0.60,
    0.70,
    0.80,
    0.90
]

threshold_results = []

print("\n==============================================")
print("          THRESHOLD COMPARISON")
print("==============================================")

print(
    f"{'Threshold':<12}"
    f"{'Precision':<12}"
    f"{'Recall':<12}"
    f"{'F1-Score':<12}"
    f"{'Accuracy':<12}"
)

for threshold in thresholds:

    # Convert probability into 0/1
    y_pred_threshold = (
        fraud_probability >= threshold
    ).astype(int)

    accuracy = accuracy_score(
        y_test,
        y_pred_threshold
    )

    precision = precision_score(
        y_test,
        y_pred_threshold,
        zero_division=0
    )

    recall = recall_score(
        y_test,
        y_pred_threshold,
        zero_division=0
    )

    f1 = f1_score(
        y_test,
        y_pred_threshold,
        zero_division=0
    )

    threshold_results.append({
        "threshold": threshold,
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1": f1
    })

    print(
        f"{threshold:<12.2f}"
        f"{precision:<12.4f}"
        f"{recall:<12.4f}"
        f"{f1:<12.4f}"
        f"{accuracy:<12.4f}"
    )


# ==========================================
# 8. FIND BEST THRESHOLD
# ==========================================

best_result = max(
    threshold_results,
    key=lambda x: x["f1"]
)

best_threshold = best_result["threshold"]

print("\n==============================================")
print("          BEST THRESHOLD")
print("==============================================")

print(f"Best Threshold : {best_threshold:.2f}")
print(f"Accuracy       : {best_result['accuracy']:.4f}")
print(f"Precision      : {best_result['precision']:.4f}")
print(f"Recall         : {best_result['recall']:.4f}")
print(f"F1-Score       : {best_result['f1']:.4f}")


# ==========================================
# 9. FINAL PREDICTIONS
# ==========================================

y_pred_best = (
    fraud_probability >= best_threshold
).astype(int)


# ==========================================
# 10. CONFUSION MATRIX
# ==========================================

cm = confusion_matrix(
    y_test,
    y_pred_best
)

print("\n==============================================")
print("          CONFUSION MATRIX")
print("==============================================")

print(cm)


# ==========================================
# 11. CLASSIFICATION REPORT
# ==========================================

print("\n==============================================")
print("       FINAL CLASSIFICATION REPORT")
print("==============================================")

print(
    classification_report(
        y_test,
        y_pred_best,
        target_names=[
            "Legitimate",
            "Fraud"
        ],
        zero_division=0
    )
)


# ==========================================
# 12. FRAUD RISK SCORE
# ==========================================

print("\n==============================================")
print("          FRAUD RISK SCORING")
print("==============================================")

# Convert probability into 0-100 score
risk_score = fraud_probability * 100


# ------------------------------------------
# Risk Level
# ------------------------------------------

risk_level = np.select(
    [
        risk_score >= 80,
        risk_score >= 60,
        risk_score >= 30
    ],
    [
        "CRITICAL",
        "HIGH",
        "MEDIUM"
    ],
    default="LOW"
)


# ------------------------------------------
# Alert Decision
# ------------------------------------------

alert = np.select(
    [
        risk_score >= 80,
        risk_score >= 60,
        risk_score >= 30
    ],
    [
        "IMMEDIATE ALERT",
        "URGENT ALERT",
        "MONITOR"
    ],
    default="ALLOW"
)

print("Risk score calculation completed!")


# ==========================================
# 13. CREATE RESULTS TABLE
# ==========================================

results = df.loc[X_test.index].copy()

results["fraud_probability"] = fraud_probability.round(4)

results["risk_score"] = risk_score.round(2)

results["risk_level"] = risk_level

results["alert"] = alert


print("\n===== FRAUD RISK RESULTS =====")

print(
    results[
        [
            "transaction_id",
            "customer_id",
            "transaction_amount",
            "transaction_velocity_1h",
            "transaction_velocity_24h",
            "fraud_probability",
            "risk_score",
            "risk_level",
            "alert"
        ]
    ].head(10)
)


# ==========================================
# 14. HIGHEST RISK TRANSACTIONS
# ==========================================

print("\n===== HIGHEST RISK TRANSACTIONS =====")

high_risk = results.sort_values(
    "risk_score",
    ascending=False
).head(10)

print(
    high_risk[
        [
            "transaction_id",
            "customer_id",
            "transaction_amount",
            "transaction_velocity_1h",
            "transaction_velocity_24h",
            "fraud_probability",
            "risk_score",
            "risk_level",
            "alert"
        ]
    ].to_string(index=False)
)


# ==========================================
# 15. TRANSACTION VELOCITY RISK ENGINE
# ==========================================

print("\n==============================================")
print("      TRANSACTION VELOCITY ANALYSIS")
print("==============================================")


def calculate_velocity_risk(row):

    velocity_1h = row["transaction_velocity_1h"]

    velocity_24h = row["transaction_velocity_24h"]


    # --------------------------------------
    # 1-HOUR VELOCITY
    # --------------------------------------

    if velocity_1h >= 10:
        velocity_1h_score = 100

    elif velocity_1h >= 6:
        velocity_1h_score = 80

    elif velocity_1h >= 3:
        velocity_1h_score = 50

    else:
        velocity_1h_score = 20


    # --------------------------------------
    # 24-HOUR VELOCITY
    # --------------------------------------

    if velocity_24h >= 30:
        velocity_24h_score = 100

    elif velocity_24h >= 20:
        velocity_24h_score = 80

    elif velocity_24h >= 10:
        velocity_24h_score = 50

    else:
        velocity_24h_score = 20


    # --------------------------------------
    # COMBINED VELOCITY SCORE
    # --------------------------------------

    velocity_score = (
        velocity_1h_score * 0.7
        +
        velocity_24h_score * 0.3
    )

    return round(velocity_score, 2)


# Calculate velocity score
results["velocity_risk_score"] = results.apply(
    calculate_velocity_risk,
    axis=1
)


# ------------------------------------------
# Velocity Risk Level
# ------------------------------------------

results["velocity_risk_level"] = np.select(
    [
        results["velocity_risk_score"] >= 80,
        results["velocity_risk_score"] >= 60,
        results["velocity_risk_score"] >= 30
    ],
    [
        "CRITICAL",
        "HIGH",
        "MEDIUM"
    ],
    default="LOW"
)

print("Velocity analysis completed!")


# ==========================================
# 16. HIGHEST VELOCITY RISK
# ==========================================

print("\n===== HIGHEST VELOCITY RISK =====")

velocity_risk = results.sort_values(
    "velocity_risk_score",
    ascending=False
).head(10)

print(
    velocity_risk[
        [
            "transaction_id",
            "customer_id",
            "transaction_velocity_1h",
            "transaction_velocity_24h",
            "velocity_risk_score",
            "velocity_risk_level"
        ]
    ].to_string(index=False)
)


# ==========================================
# 17. COMBINED FRAUD RISK ENGINE
# ==========================================

print("\n==============================================")
print("        COMBINED FRAUD RISK ENGINE")
print("==============================================")


# ------------------------------------------
# ML Risk Score
# ------------------------------------------

results["ml_risk_score"] = results["risk_score"]


# ------------------------------------------
# Combine ML + Velocity
# ------------------------------------------

results["final_risk_score"] = (
    results["ml_risk_score"] * 0.70
    +
    results["velocity_risk_score"] * 0.30
)


results["final_risk_score"] = (
    results["final_risk_score"].round(2)
)


# ------------------------------------------
# Final Risk Level
# ------------------------------------------

results["final_risk_level"] = np.select(
    [
        results["final_risk_score"] >= 80,
        results["final_risk_score"] >= 60,
        results["final_risk_score"] >= 30
    ],
    [
        "CRITICAL",
        "HIGH",
        "MEDIUM"
    ],
    default="LOW"
)


# ------------------------------------------
# Final Action
# ------------------------------------------

results["final_action"] = np.select(
    [
        results["final_risk_score"] >= 80,
        results["final_risk_score"] >= 60,
        results["final_risk_score"] >= 30
    ],
    [
        "IMMEDIATE ALERT",
        "URGENT ALERT",
        "MONITOR"
    ],
    default="ALLOW"
)

print("Combined risk calculation completed!")


# ==========================================
# 18. FINAL HIGH-RISK TRANSACTIONS
# ==========================================

print("\n==============================================")
print("       FINAL HIGH-RISK TRANSACTIONS")
print("==============================================")

final_high_risk = results.sort_values(
    "final_risk_score",
    ascending=False
).head(10)

print(
    final_high_risk[
        [
            "transaction_id",
            "customer_id",
            "transaction_amount",
            "transaction_velocity_1h",
            "transaction_velocity_24h",
            "ml_risk_score",
            "velocity_risk_score",
            "final_risk_score",
            "final_risk_level",
            "final_action"
        ]
    ].to_string(index=False)
)


# ==========================================
# 19. FINAL MESSAGE
# ==========================================

print("\n==============================================")
print("       FRAUD DETECTION PIPELINE COMPLETE")
print("==============================================")

print("\nML Model       : TabPFN")
print("Training Data  : 5,000 stratified samples")
print("Testing Data   : 20,000 unseen transactions")
print("Risk Detection : ML + Transaction Velocity")
print(f"Best Threshold : {best_threshold:.2f}")

print("\nNext step: Cash-out location and time prediction.")

# ==========================================
# SAVE MODEL 1
# ==========================================

import joblib

joblib.dump(model, "model1_tabpfn_model.pkl")
joblib.dump(encoder, "model1_encoder.pkl")

print("\nModel 1 saved successfully!")
print("File: model1_tabpfn_model.pkl")
print("File: model1_encoder.pkl")