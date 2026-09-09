from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
import os

# Using asyncpg for async PostgreSQL support
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql+asyncpg://cyberpulse:cyberpulse@localhost:5432/cyberpulse_lea"
)

# For dev environment, if the user doesn't have postgres ready, we can use a fallback.
# But for now, we set up the standard postgres URL.
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
