import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext
from app.core.database import engine, Base, AsyncSessionLocal
from app.models.schema import User, Complaint, BankAlert, RoleEnum, PriorityEnum, StatusEnum

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

async def init_db():
    async with engine.begin() as conn:
        # Create all tables (WARNING: this is for dev only. In prod, use Alembic)
        await conn.run_sync(Base.metadata.create_all)

async def seed_data():
    async with AsyncSessionLocal() as session:
        # Check if we already have users
        from sqlalchemy.future import select
        result = await session.execute(select(User).limit(1))
        if result.scalars().first() is not None:
            print("Database already seeded. Skipping.")
            return

        print("Seeding initial LEA users...")
        # 1. Create LEA Officer
        officer = User(
            id="LEA-OFF-001",
            full_name="Vikram Reddy",
            email="vikram.reddy@cyberpolice.gov.in",
            mobile="9876501234",
            role=RoleEnum.lea_officer,
            badge_number="CYB-HYD-2024-047",
            department="Cyber Crime Cell",
            station="Hyderabad Central",
            rank="Inspector",
            password_hash=await get_password_hash("password123")
        )
        
        # 2. Create LEA Admin
        admin = User(
            id="LEA-ADM-001",
            full_name="DCP Ramesh",
            email="ramesh.dcp@cyberpolice.gov.in",
            mobile="9876501235",
            role=RoleEnum.lea_admin,
            badge_number="CYB-HYD-2015-001",
            department="Cyber Crime Cell",
            station="Hyderabad Central",
            rank="DCP",
            password_hash=await get_password_hash("admin123")
        )

        session.add(officer)
        session.add(admin)

        print("Seeding initial Complaints...")
        comp1 = Complaint(
            id="COMP-001",
            complaint_reference="CCP-2026-104382",
            category="UPI / Payment Fraud",
            description="Complainant received a call from an unknown number posing as bank representative.",
            location="Hyderabad, Telangana",
            priority=PriorityEnum.High,
            status=StatusEnum.Under_Investigation,
            amount_involved=45000.0,
            assigned_officer_id="LEA-OFF-001",
            complainant_reference="CIT-REF-7821"
        )
        session.add(comp1)

        print("Seeding initial Bank Alerts...")
        alert1 = BankAlert(
            id="BANK-ALERT-001",
            alert_reference="BA-SBI-2026-4421",
            bank_reference="SecureBank India Ltd.",
            transaction_reference="TXN-UPI-2026090712340089",
            masked_account_reference="XXXX XXXX 4821",
            crime_type="Suspected UPI Fraud",
            amount=145000.0,
            priority=PriorityEnum.Critical,
            location="Hyderabad, Telangana",
            status="Under Review",
            alert_reason="High-value UPI transfer at unusual hour (2:14 AM). ML risk score: 94.2/100."
        )
        session.add(alert1)

        await session.commit()
        print("Database seeding completed successfully.")

if __name__ == "__main__":
    import asyncio
    asyncio.run(init_db())
    asyncio.run(seed_data())
