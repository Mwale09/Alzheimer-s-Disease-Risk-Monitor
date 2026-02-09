# AD Risk Prediction

## Project Structure
- **backend/**: FastAPI application for risk prediction.
- **frontend/**: Streamlit application for the user interface.

## How to Run

### Option 1: Using Docker (Recommended)
This approach handles all dependencies automatically.

1.  **Prerequisites**: Ensure Docker Desktop is installed and running.
2.  **Run**:
    ```bash
    docker-compose up --build
    ```
    *   The **Frontend** will be available at: http://localhost:8501
    *   The **Backend** API docs will be at: http://localhost:8000/docs

### Option 2: Running Locally (Without Docker)
You will need to run the backend and frontend in separate terminals.

#### 1. Backend Setup
1.  Open a terminal and navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Run the server:
    ```bash
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ```
    The backend is now running at `http://localhost:8000`.

#### 2. Frontend Setup
1.  Open a **new** terminal and navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Set the backend URL environment variable to point to localhost (Windows PowerShell example):
    ```powershell
    $env:BACKEND_URL="http://localhost:8000"
    streamlit run app.py
    ```
    *   **CMD**: `set BACKEND_URL=http://localhost:8000 && streamlit run app.py`
    *   **Git Bash**: `BACKEND_URL=http://localhost:8000 streamlit run app.py`

    The frontend will launch in your browser at `http://localhost:8501`.
