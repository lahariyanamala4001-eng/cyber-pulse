from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class RoleEnum(str, enum.Enum):
    lea_officer = "lea_officer"
    lea_admin = "lea_admin"

class PriorityEnum(str, enum.Enum):
    Critical = "Critical"
    High = "High"
    Medium = "Medium"
    Low = "Low"

class StatusEnum(str, enum.Enum):
    New = "New"
    Under_Review = "Under Review"
    Assigned = "Assigned"
    Under_Investigation = "Under Investigation"
    Resolved = "Resolved"
    Closed = "Closed"

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    mobile = Column(String)
    role = Column(Enum(RoleEnum), default=RoleEnum.lea_officer)
    badge_number = Column(String, unique=True)
    department = Column(String)
    station = Column(String)
    rank = Column(String)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Complaint(Base):
    __tablename__ = "complaints"
    
    id = Column(String, primary_key=True, index=True)
    complaint_reference = Column(String, unique=True, index=True)
    category = Column(String)
    description = Column(String)
    location = Column(String)
    # Note: For PostGIS, we would use geoalchemy2.Geometry("POINT") here, 
    # but using String for simple text storage initially to ensure broad compatibility.
    priority = Column(Enum(PriorityEnum), default=PriorityEnum.Medium)
    status = Column(Enum(StatusEnum), default=StatusEnum.New)
    amount_involved = Column(Float, default=0.0)
    assigned_officer_id = Column(String, ForeignKey("users.id"), nullable=True)
    complainant_reference = Column(String) # Masked Citizen Ref
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class BankAlert(Base):
    __tablename__ = "bank_alerts"
    
    id = Column(String, primary_key=True, index=True)
    alert_reference = Column(String, unique=True)
    bank_reference = Column(String)
    transaction_reference = Column(String)
    masked_account_reference = Column(String)
    crime_type = Column(String)
    amount = Column(Float)
    transaction_time = Column(DateTime(timezone=True))
    priority = Column(Enum(PriorityEnum), default=PriorityEnum.High)
    location = Column(String)
    status = Column(String, default="Received")
    alert_reason = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

