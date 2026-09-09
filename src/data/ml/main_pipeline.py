import pandas as pd
import joblib
from datetime import datetime, timedelta


print("==============================================")
print("       CYBER FRAUD INTELLIGENCE PIPELINE")
print("==============================================")


# ==================================================
# 1. LOAD MODELS
# ==================================================

print("\nLoading Model 1...")
model1 = joblib.load("model1_tabpfn_model.pkl")
encoder = joblib.load("model1_encoder.pkl")
print("Model 1 loaded successfully!")

print("\nLoading Model 2...")
model2 = joblib.load("model2_cashout_model.pkl")
print("Model 2 loaded successfully!")


# ==================================================
# 2. TEST TRANSACTION
# ==================================================

# HIGH-RISK TEST TRANSACTION
# We are intentionally using suspicious values
# only to test the complete pipeline.

transaction = {
    "transaction_id": "DEMO_HIGH_RISK",
    "customer_id": "CUST_TEST001",

    "transaction_hour": 9,
    "transaction_minute": 8,

    "account_age_days": 20,
    "previous_chargebacks": 3,

    "merchant_category": "electronics",
    "transaction_country": "India",
    "device_type": "mobile",
    "transaction_type": "transfer",
    "geo_location_region": "Tamil Nadu",

    "is_international": 1,
    "is_high_risk_merchant_category": 1,
    "is_weekend": 0,

    "customer_total_transactions_30d": 40,
    "customer_risk_score": 90,

    "transaction_amount": 500000,
    "avg_transaction_amount_30d_customer": 15000,

    "transaction_velocity_1h": 10,
    "transaction_velocity_24h": 30
}


print("\n==============================================")
print("          TRANSACTION RECEIVED")
print("==============================================")

print("Transaction ID :", transaction["transaction_id"])
print("Customer ID    :", transaction["customer_id"])
print("Amount         : ₹{:,.2f}".format(
    transaction["transaction_amount"]
))
print("Time           : {:02d}:{:02d}".format(
    transaction["transaction_hour"],
    transaction["transaction_minute"]
))


# ==================================================
# 3. PREPARE MODEL 1 INPUT
# ==================================================

model1_columns = [
    "transaction_hour",
    "transaction_day_of_week",
    "account_age_days",
    "previous_chargebacks",
    "merchant_category",
    "transaction_country",
    "device_type",
    "transaction_type",
    "geo_location_region",
    "is_international",
    "is_high_risk_merchant_category",
    "is_weekend",
    "customer_total_transactions_30d",
    "customer_risk_score",
    "transaction_amount",
    "avg_transaction_amount_30d_customer",
    "transaction_velocity_1h",
    "transaction_velocity_24h"
]


# Monday = 0
transaction["transaction_day_of_week"] = 0


X = pd.DataFrame([transaction])

X = X[model1_columns]


# ==================================================
# 4. ENCODE CATEGORICAL FEATURES
# ==================================================

categorical_columns = [
    "merchant_category",
    "transaction_country",
    "device_type",
    "transaction_type",
    "geo_location_region"
]


X[categorical_columns] = encoder.transform(
    X[categorical_columns]
)


print("\nModel 1 input prepared successfully!")


# ==================================================
# 5. MODEL 1 — FRAUD DETECTION
# ==================================================

print("\n==============================================")
print("          MODEL 1 — FRAUD DETECTION")
print("==============================================")


probability = model1.predict_proba(X)

fraud_probability = probability[0][1]

ml_risk_score = fraud_probability * 100


print("Fraud Probability : {:.2f}%".format(
    fraud_probability * 100
))

print("ML Risk Score     : {:.2f}/100".format(
    ml_risk_score
))


# ==================================================
# 6. TRANSACTION VELOCITY
# ==================================================

velocity_1h = transaction["transaction_velocity_1h"]
velocity_24h = transaction["transaction_velocity_24h"]


if velocity_1h >= 10:
    velocity_1h_score = 100

elif velocity_1h >= 6:
    velocity_1h_score = 80

elif velocity_1h >= 3:
    velocity_1h_score = 50

else:
    velocity_1h_score = 20


if velocity_24h >= 30:
    velocity_24h_score = 100

elif velocity_24h >= 20:
    velocity_24h_score = 80

elif velocity_24h >= 10:
    velocity_24h_score = 50

else:
    velocity_24h_score = 20


velocity_risk_score = (
    velocity_1h_score * 0.70
    +
    velocity_24h_score * 0.30
)


# ==================================================
# 7. FINAL RISK SCORE
# ==================================================

final_risk_score = (
    ml_risk_score * 0.70
    +
    velocity_risk_score * 0.30
)


if final_risk_score >= 80:

    final_risk_level = "CRITICAL"
    final_action = "IMMEDIATE ALERT"


elif final_risk_score >= 60:

    final_risk_level = "HIGH"
    final_action = "URGENT ALERT"


elif final_risk_score >= 30:

    final_risk_level = "MEDIUM"
    final_action = "MONITOR"


else:

    final_risk_level = "LOW"
    final_action = "ALLOW"


print("\n==============================================")
print("          FINAL FRAUD RISK")
print("==============================================")

print("ML Risk Score       : {:.2f}".format(
    ml_risk_score
))

print("Velocity Risk Score : {:.2f}".format(
    velocity_risk_score
))

print("Final Risk Score    : {:.2f}/100".format(
    final_risk_score
))

print("Risk Level          :", final_risk_level)

print("Action              :", final_action)


# ==================================================
# 8. MODEL 2
# ==================================================

if final_risk_level in ["HIGH", "CRITICAL"]:

    print("\n==============================================")
    print("       MODEL 2 — CASH-OUT INTELLIGENCE")
    print("==============================================")


    model2_input = pd.DataFrame([
        {
            "transfer_amount":
                transaction["transaction_amount"],

            "transfer_hour":
                transaction["transaction_hour"],

            "transfer_minute":
                transaction["transaction_minute"]
        }
    ])


    prediction = model2.predict(model2_input)


    minutes_until_cashout = float(prediction[0][0])

    latitude = float(prediction[0][1])

    longitude = float(prediction[0][2])


    # ==================================================
    # CALCULATE CASH-OUT TIME
    # ==================================================

    transfer_time = datetime(
        2026,
        1,
        1,
        transaction["transaction_hour"],
        transaction["transaction_minute"]
    )


    predicted_cashout_time = (
        transfer_time
        +
        timedelta(minutes=minutes_until_cashout)
    )


    print("\nPredicted cash-out after : {:.1f} minutes".format(
        minutes_until_cashout
    ))

    print(
        "Predicted withdrawal time : {}"
        .format(
            predicted_cashout_time.strftime("%H:%M")
        )
    )

    print(
        "Predicted ATM latitude    : {:.6f}"
        .format(latitude)
    )

    print(
        "Predicted ATM longitude   : {:.6f}"
        .format(longitude)
    )


    # ==================================================
    # 9. ACTIONABLE INTELLIGENCE
    # ==================================================

    print("\n==============================================")
    print("        🚨 ACTIONABLE INTELLIGENCE")
    print("==============================================")

    print("Risk Level :", final_risk_level)

    print("Action     :", final_action)

    print(
        "\nPossible cash-out time : {}"
        .format(
            predicted_cashout_time.strftime("%H:%M")
        )
    )

    print(
        "Likely ATM location    : {:.6f}, {:.6f}"
        .format(
            latitude,
            longitude
        )
    )

    print("\nRecommended response:")

    print("1. Alert the bank")

    print("2. Alert the customer")

    print("3. Flag the transaction")

    print("4. Generate intelligence for investigation")


else:

    print("\n==============================================")
    print("          TRANSACTION STATUS")
    print("==============================================")

    print(
        "Transaction does not require immediate"
    )

    print(
        "cash-out prediction."
    )


print("\n==============================================")
print("       PIPELINE EXECUTION COMPLETE")
print("==============================================")