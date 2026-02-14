from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import complaint

app = FastAPI(
    title="Municipal Complaint System API",
    description="Backend API for AI-powered municipal complaint registration",
    version="1.0.0"
)

# -----------------------------
# CORS Configuration
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠ Change this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Include Routers
# -----------------------------
app.include_router(complaint.router)

# -----------------------------
# Root Endpoint
# -----------------------------
@app.get("/")
def home():
    return {
        "status": "success",
        "message": "Municipal Complaint System Backend Running"
    }
