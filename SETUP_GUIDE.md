# Setup Guide: AD Risk Prediction

Welcome to the AD Risk Prediction project. This guide will walk you through setting up the project on a new computer.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Git**: [Download Git](https://git-scm.com/downloads)
- **Python 3.10+**: [Download Python](https://www.python.org/downloads/)
- **Node.js 20+**: [Download Node.js](https://nodejs.org/)
- **Docker Desktop** (Optional, but recommended): [Download Docker](https://www.docker.com/products/docker-desktop/)

---

## 🚀 Option 1: Using Docker (Recommended)

This is the easiest way to get the project running as it handles all dependencies automatically.

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd "AD Risk Prediction"
    ```

2.  **Start the Application**:
    Ensure Docker Desktop is running, then execute:
    ```bash
    docker-compose up --build
    ```

3.  **Access the Apps**:
    - **Frontend**: [http://localhost:5173](http://localhost:5173)
    - **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🛠️ Option 2: Local Setup (Manual)

Use this option if you want to develop without Docker or if you don't have Docker installed.

### 1. Backend Setup (FastAPI)

1.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```

2.  **Create a Virtual Environment** (Highly Recommended):
    ```bash
    python -m venv venv
    .\venv\Scripts\activate
    ```

3.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the Backend**:
    ```bash
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ```
    The backend will be live at `http://localhost:8000`.

### 2. Frontend Setup (React/Vite)

1.  Open a **new** terminal and navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run the Frontend**:
    ```bash
    npm run dev
    ```
    The frontend will be live at `http://localhost:5173`.

---

## ❓ Troubleshooting

- **Backend Port Conflict**: If port 8000 is taken, change the port in the `uvicorn` command or `docker-compose.yml`.
- **Frontend Port Conflict**: If port 5173 is taken, Vite will automatically try the next available port (e.g., 5174).
- **Python Errors**: Ensure you are using Python 3.10 or higher. Check your version with `python --version`.
- **Node.js Errors**: Ensure you have Node.js 20 or higher installed. Check with `node -v`.
