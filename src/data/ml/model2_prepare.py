import pandas as pd

# ==========================================
# 1. LOAD BOTH DATASETS
# ==========================================

print("Loading datasets...")

transactions = pd.read_excel("fraud_account_transactions.xlsx")
atm = pd.read_excel("secondary_account_atm_withdrawals.xlsx")

print("Transaction data loaded:", transactions.shape)
print("ATM data loaded:", atm.shape)


# ==========================================
# 2. CONVERT DATE + TIME
# ==========================================

transactions["datetime"] = pd.to_datetime(
    transactions["거래일자"].astype(str) + " " +
    transactions["거래시간"].astype(str)
)

atm["datetime"] = pd.to_datetime(
    atm["거래일자"].astype(str) + " " +
    atm["거래시간"].astype(str)
)


# ==========================================
# 3. SELECT MONEY TRANSFER TRANSACTIONS
# ==========================================

transfers = transactions[
    (transactions["계좌주"] == "대포계좌1") &
    (transactions["상대예금주"] == "대포계좌2") &
    (transactions["출금액"] > 0)
].copy()

print("\nTransfer transactions:")
print(transfers[
    ["거래일자", "거래시간", "출금액", "상대예금주"]
].to_string(index=False))


# ==========================================
# 4. CREATE MODEL 2 DATA
# ==========================================

model2_data = []

for _, transfer in transfers.iterrows():

    transfer_amount = transfer["출금액"]
    transfer_time = transfer["datetime"]

    # Find ATM withdrawal with same amount
    possible_withdrawals = atm[
        atm["출금액"] == transfer_amount
    ].copy()

    if len(possible_withdrawals) == 0:
        continue

    # Find the first ATM withdrawal after the transfer
    possible_withdrawals["time_difference"] = (
        possible_withdrawals["datetime"] - transfer_time
    ).dt.total_seconds() / 60

    possible_withdrawals = possible_withdrawals[
        possible_withdrawals["time_difference"] >= 0
    ]

    if len(possible_withdrawals) == 0:
        continue

    withdrawal = possible_withdrawals.sort_values(
        "time_difference"
    ).iloc[0]

    model2_data.append({

        # INPUT FEATURES
        "transfer_amount": transfer_amount,

        "transfer_hour": transfer_time.hour,

        "transfer_minute": transfer_time.minute,

        "minutes_until_withdrawal":
            withdrawal["time_difference"],

        # TARGET: CASH-OUT TIME
        "withdrawal_hour":
            withdrawal["datetime"].hour,

        "withdrawal_minute":
            withdrawal["datetime"].minute,

        # TARGET: CASH-OUT LOCATION
        "atm_latitude":
            withdrawal["위도"],

        "atm_longitude":
            withdrawal["경도"],

        "atm_address":
            withdrawal["ATM 출금 주소"],

        "atm_branch":
            withdrawal["지점명"]
    })


# ==========================================
# 5. CREATE DATAFRAME
# ==========================================

model2_df = pd.DataFrame(model2_data)

print("\n==========================================")
print("       MODEL 2 DATASET")
print("==========================================")

print("\nShape:")
print(model2_df.shape)

print("\nDataset:")
print(model2_df.to_string(index=False))


# ==========================================
# 6. SAVE DATASET
# ==========================================

model2_df.to_csv(
    "model2_cashout_dataset.csv",
    index=False,
    encoding="utf-8-sig"
)

print("\n==========================================")
print("Model 2 dataset created successfully!")
print("Saved as: model2_cashout_dataset.csv")
print("==========================================")