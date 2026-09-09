import pandas as pd
import joblib

from sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor

print("==========================================")
print("       MODEL 2 TRAINING")
print("==========================================")

# ------------------------------------------
# 1. LOAD DATASET
# ------------------------------------------

print("\nLoading Model 2 dataset...")

df = pd.read_csv("model2_cashout_dataset.csv")

print("Dataset loaded!")
print("Rows:", len(df))

# ------------------------------------------
# 2. SELECT INPUT FEATURES
# ------------------------------------------

X = df[
    [
        "transfer_amount",
        "transfer_hour",
        "transfer_minute"
    ]
]

# ------------------------------------------
# 3. SELECT TARGETS
# ------------------------------------------
# Model predicts:
# 1. Minutes until cash-out
# 2. ATM latitude
# 3. ATM longitude

y = df[
    [
        "minutes_until_withdrawal",
        "atm_latitude",
        "atm_longitude"
    ]
]

print("\nInput features:")
print(X)

print("\nTarget values:")
print(y)

# ------------------------------------------
# 4. TRAIN MODEL
# ------------------------------------------

print("\nTraining Model 2...")

model = MultiOutputRegressor(
    RandomForestRegressor(
        n_estimators=100,
        random_state=42
    )
)

model.fit(X, y)

print("\nModel 2 training completed!")

# ------------------------------------------
# 5. SAVE MODEL
# ------------------------------------------

joblib.dump(model, "model2_cashout_model.pkl")

print("\nModel saved successfully!")
print("File: model2_cashout_model.pkl")

print("\n==========================================")
print("       TRAINING COMPLETE")
print("==========================================")