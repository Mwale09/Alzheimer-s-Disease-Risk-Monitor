# AD Risk Prediction

A web application for predicting Alzheimer's Disease risk using machine learning.

## 🏗️ Project Structure
- **backend/**: FastAPI application providing ML prediction services and database management.
- **frontend/**: React/Vite application for a modern and responsive user interface.

## 🚀 How to Run

### Option 1: Using Docker (Recommended)
Handles all dependencies and environment setup automatically.

1.  **Prerequisites**: [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
2.  **Command**:
    ```bash
    docker-compose up --build
    ```
    - **Frontend**: http://localhost:5173
    - **Backend API**: http://localhost:8000/docs

### Option 2: Running Locally
Requires separate terminals for backend and frontend.

#### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
API running at: http://localhost:8000

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
App running at: http://localhost:5173

## 📖 Detailed Setup Guide
For a step-by-step walkthrough, including prerequisites and troubleshooting, see the [SETUP_GUIDE.md](SETUP_GUIDE.md).
