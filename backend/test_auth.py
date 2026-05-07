from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def run_tests():
    print("Testing /health...")
    resp = client.get("/health")
    print(resp.json())

    print("\nTesting /predict without auth...")
    patient = {
        "name": "Jane Doe", "age": 70, "gender": "Female",
        "education_level": 12, "family_history": True, "variants": []
    }
    resp = client.post("/predict", json={"patient_data": patient})
    print("Expect 401:", resp.status_code, resp.json())
    
    print("\nRegistering testuser...")
    resp = client.post("/register", json={"username": "testuser", "password": "password"})
    print(resp.status_code, resp.json())

    print("\nLogging in testuser...")
    resp = client.post("/login", data={"username": "testuser", "password": "password"})
    print(resp.status_code)
    token = resp.json().get("access_token")
    
    print("\nTesting /predict with Auth...")
    headers = {"Authorization": f"Bearer {token}"}
    resp = client.post("/predict", json={"patient_data": patient}, headers=headers)
    print(resp.status_code)
    data = resp.json()
    print("Risk Category:", data.get("risk_category"))
    print("Model Metrics:", data.get("model_metrics"))

if __name__ == "__main__":
    run_tests()
