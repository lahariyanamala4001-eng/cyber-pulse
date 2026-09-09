from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="CyberPulse LEA Portal API",
    description="Backend API for the Law Enforcement Agency Portal",
    version="1.0.0",
)

# CORS configuration
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "CyberPulse LEA Backend"}

# Import routers later as they are created
# from app.api import auth, dashboard, complaints, cases, previous_cases, map, bank_coordination, notifications
# app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
# app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
# app.include_router(complaints.router, prefix="/api/complaints", tags=["Complaints"])
# app.include_router(cases.router, prefix="/api/cases", tags=["Cases"])
# app.include_router(previous_cases.router, prefix="/api/previous-cases", tags=["Previous Cases"])
# app.include_router(map.router, prefix="/api/map", tags=["Map"])
# app.include_router(bank_coordination.router, prefix="/api/bank-coordination", tags=["Bank Coordination"])
# app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
# app.include_router(ml_integration.router, prefix="/api/intelligence", tags=["Predictive Intelligence"])

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8001))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
