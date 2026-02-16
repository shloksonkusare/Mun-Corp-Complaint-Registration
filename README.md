# Municipal Complaint Registration System

An AI-powered civic complaint platform that allows citizens to:

- Capture real-time photos of municipal issues

- Automatically classify complaint category using Deep Learning

- Capture exact GPS location

- Convert coordinates to human-readable address

- Store complete complaint data in MongoDB

- Generate unique complaint IDs

## Features
#### Frontend (React)

- Live camera integration (WebRTC)

- Image upload from gallery

- Image preview

- GPS location capture

- Real-time complaint submission

- Clean modern UI

- Loading state handling

- Success confirmation screen

#### Backend (FastAPI)

- REST API for complaint submission

- MongoDB Atlas integration

- Cloudinary image storage

- Reverse geocoding (OpenStreetMap)

- Unique complaint ID generation (UUID)

- Real-time AI prediction before database insertion

#### AI Model

- Transfer Learning using MobileNetV2

- Trained on labeled municipal issue dataset

- Classes supported:

    - DamagedRoads

    - GarbageAndSanitation

    - ElectricityIssues

- Model saved as complaint_model.pt

- Integrated directly into FastAPI inference pipeline

## System Architecture
```
User (Browser)
      ↓
React Frontend
      ↓
FastAPI Backend
      ↓
AI Model (PyTorch)
      ↓
MongoDB Atlas
      ↓
Cloudinary (Image Storage)
      ↓
OpenStreetMap API (Reverse Geocoding)
```

## Project Structure
```
municipal-complaint-system/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   │   └── classifier.py
│   │   ├── routes/
│   │   │   └── complaint.py
│   │   ├── database/
│   │   │   └── mongodb.py
│   │   └── utils/
│   │       ├── cloudinary_upload.py
│   │       └── geocode.py
│   │
│   ├── train_model.py
│   ├── complaint_model.pt
│   ├── requirements.txt
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── ComplaintForm.jsx
    │   ├── main.jsx
    │   └── styles.css
    └── package.json
```

## Requirements
#### Backend Requirements

- Python 3.9+

- MongoDB Atlas account

- Cloudinary account

- OpenStreetMap API (free, no key required)

#### Frontend Requirements

- Node.js 18+

```
npm or yarn
```

#### Python Dependencies

Installed via:

```
pip install -r requirements.txt
```


Main packages:

- fastapi

- uvicorn

- pymongo

- python-dotenv

- cloudinary

- torch

- torchvision

- pillow

- requests

- python-multipart

#### Dataset Requirements

***Dataset Links:***
- Road & Garbage Dataset: https://data.mendeley.com/datasets/zndzygc3p3/2
- Street Light Dataset (Electricity Issues): https://github.com/Team16Project/Street-Light-Dataset

Your dataset must follow this structure:
```
dataset/
│
├── DamagedRoads/
│   ├── img1.jpg
│   ├── img2.jpg
│
├── GarbageAndSanitation/
│   ├── img1.jpg
│   ├── img2.jpg
│
└── ElectricityIssues/
    ├── img1.jpg
    ├── img2.jpg
```

Each folder name becomes the prediction class label.

## Train the AI Model

Navigate to backend:

```
cd backend
```

Run:

```
python train_model.py
```


This will:

- Load dataset

- Train MobileNetV2

Save model as:

```complaint_model.pt```

## Environment Variables

Create .env inside backend/:
```
MONGO_URI=your_mongodb_connection_string
DATABASE_NAME=municipal_db

CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

## Running the Project
#### Backend Setup
```
cd backend
python -m venv venv
venv\Scripts\activate     # Windows
source venv/bin/activate  # Mac/Linux
```

```
pip install -r requirements.txt
```


Run backend:

```
uvicorn app.main:app --reload
```


Backend runs at:

http://127.0.0.1:8000


Swagger Docs:

http://127.0.0.1:8000/docs

#### Frontend Setup
```
cd frontend
npm install
npm run dev
```

Frontend runs at:

http://localhost:5173



## Complaint Data Structure (MongoDB)

Each complaint document contains:
```
{
  "complaint_id": "UUID",
  "description": "Road damaged badly",
  "image_url": "https://cloudinary.com/...",
  "latitude": 19.0760,
  "longitude": 72.8777,
  "address": "Mumbai, Maharashtra, India",
  "department": "DamagedRoads",
  "status": "Pending",
  "created_at": "timestamp"
}
```
### Important Notes

- Camera requires HTTPS in production.

- For local testing, localhost works.

- Ensure dataset has sufficient images for better accuracy.

- If deploying to CPU-only server, install CPU version of PyTorch.