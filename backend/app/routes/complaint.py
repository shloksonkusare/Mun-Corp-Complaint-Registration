from fastapi import APIRouter, UploadFile, File, Form
from app.database.mongodb import complaints_collection
from app.utils.cloudinary_upload import upload_image
from datetime import datetime
import uuid
from app.models.classifier import predict_department
from app.utils.geocode import get_address_from_coordinates



router = APIRouter()

@router.post("/complaint")
async def create_complaint(
    description: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    image: UploadFile = File(...)
):
    # Predict department
    predicted_department = predict_department(image.file)

    # Reset file pointer
    image.file.seek(0)

    # Upload image
    image_url = upload_image(image.file)

    # Get readable address
    address = get_address_from_coordinates(latitude, longitude)

    complaint = {
        "complaint_id": str(uuid.uuid4()),
        "description": description,
        "image_url": image_url,
        "latitude": latitude,
        "longitude": longitude,
        "address": address,
        "department": predicted_department,
        "status": "Pending",
        "created_at": datetime.utcnow()
    }

    complaints_collection.insert_one(complaint)

    return {
        "message": "Complaint Registered Successfully",
        "complaint_id": complaint["complaint_id"],
        "predicted_department": predicted_department,
        "address": address
    }
