import pandas as pd
import joblib
from datetime import datetime, timedelta

print("==========================================")
print("       MODEL 2 CASH-OUT PREDICTION")
print("==========================================")

# ------------------------------------------
# 1. LOAD TRAINED MODEL
# ------------------------------------------

print("\nLoading Model 2...")

model = joblib.load("model2_cashout_model.pkl")

print("Model loaded successfully!")

# ------------------------------------------
# 2. NEW SUSPICIOUS TRANSACTION
# ------------------------------------------

transaction = pd.DataFrame([
    {
        "transfer_amount": 500000,
        "transfer_hour": 9,
        "transfer_minute": 8
    }
])

amount = transaction["transfer_amount"].iloc[0]
hour = transaction["transfer_hour"].iloc[0]
minute = transaction["transfer_minute"].iloc[0]

print("\nTransaction received!")
print(f"Amount : ₹{amount:,.0f}")
print(f"Time   : {hour:02d}:{minute:02d}")

# ------------------------------------------
# 3. MODEL PREDICTION
# ------------------------------------------

prediction = model.predict(transaction)

minutes_until_cashout = prediction[0][0]
latitude = prediction[0][1]
longitude = prediction[0][2]

# ------------------------------------------
# 4. CALCULATE PREDICTED CASH-OUT TIME
# ------------------------------------------

transfer_time = datetime(2026, 1, 1, hour, minute)

predicted_cashout_time = (
    transfer_time + timedelta(minutes=minutes_until_cashout)
)

# ------------------------------------------
# 5. DISPLAY RESULTS
# ------------------------------------------

print("\n==========================================")
print("       MODEL 2 PREDICTION")
print("==========================================")

print(
    f"Predicted cash-out after : "
    f"{minutes_until_cashout:.1f} minutes"
)

print(
    f"Predicted withdrawal time : "
    f"{predicted_cashout_time.strftime('%H:%M')}"
)

print(
    f"Predicted ATM latitude    : "
    f"{latitude:.6f}"
)

print(
    f"Predicted ATM longitude   : "
    f"{longitude:.6f}"
)

print("==========================================")

# ------------------------------------------
# 6. ALERT MESSAGE
# ------------------------------------------

print("\n🚨 CASH-OUT INTELLIGENCE")

print(
    f"Money may be withdrawn around "
    f"{predicted_cashout_time.strftime('%H:%M')}"
)

print(
    f"Likely ATM location: "
    f"{latitude:.6f}, {longitude:.6f}"
)

print("\n==========================================")