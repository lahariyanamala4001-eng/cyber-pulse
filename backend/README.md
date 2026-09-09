# CyberPulse LEA Portal — Backend

This is the FastAPI backend for the Law Enforcement Agency (LEA) Portal of the CyberPulse project. 
It provides the necessary APIs for the frontend and acts as a secure integration layer with the existing ML fraud prediction models.

## Architecture

- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL (with PostGIS support)
- **ORM**: SQLAlchemy + asyncpg
- **Authentication**: JWT with Role-Based Access Control (RBAC)
- **ML Integration**: `ml_service.py` acts as a proxy to your existing ML models running on port `8000`.

---

## Prerequisites

1. **Python 3.10+**
2. **PostgreSQL 14+** (with PostGIS extension installed)
3. Your existing **ML Server** running on `http://localhost:8000`

---

## Local Setup Instructions

### 1. Database Setup (PostgreSQL)

You must have PostgreSQL installed. Create a database and user:

```sql
CREATE DATABASE cyberpulse_lea;
CREATE USER cyberpulse WITH PASSWORD 'cyberpulse';
GRANT ALL PRIVILEGES ON DATABASE cyberpulse_lea TO cyberpulse;
```

*(Optional)* Enable PostGIS if you plan to use geospatial queries for the Cybercrime Map:
```sql
\c cyberpulse_lea
CREATE EXTENSION postgis;
```

### 2. Python Environment Setup

Navigate to the `backend/` directory:

```bash
cd backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Variables

Create a `.env` file in the `backend/` directory based on the example provided:

```bash
cp .env.example .env
```

Ensure `DATABASE_URL` and `ML_SERVICE_URL` match your local setup. The backend defaults to running on port `8001` so it doesn't conflict with your ML server on `8000`.

### 4. Database Seeding

Run the seed script to populate the database with initial mock data (Users, Complaints, Cases, Alerts):

```bash
python seed_data.py
```

### 5. Running the Backend

Start the FastAPI server:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

You can view the interactive Swagger API documentation at:  
`http://localhost:8001/docs`

---

## Testing the Application

1. **Frontend**: Ensure Vite is running (`npm run dev` in the root folder) on `http://localhost:5173`.
2. **ML Server**: Ensure your existing TabPFN/Cash-out model server is running on port `8000`.
3. **LEA Backend**: Ensure this FastAPI server is running on port `8001`.

Go to the LEA login page on the frontend (`/lea/login`) and log in with the seeded credentials:
- **Officer ID**: `LEA-OFF-001`
- **Password**: `password123`
