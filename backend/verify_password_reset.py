from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_password_update():
    print("Registering testuser_reset...")
    client.post("/register", json={"username": "testuser_reset", "password": "password123"})
    
    print("Logging in to get token...")
    resp = client.post("/login", data={"username": "testuser_reset", "password": "password123"})
    if resp.status_code != 200:
        print(f"Login failed: {resp.status_code}")
        return
    token = resp.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    
    print("Updating password...")
    resp = client.post("/update-password", json={"new_password": "newpassword123"}, headers=headers)
    print(f"Update response: {resp.status_code}, {resp.json()}")
    
    print("Verifying login with new password...")
    resp = client.post("/login", data={"username": "testuser_reset", "password": "newpassword123"})
    if resp.status_code == 200:
        print("Success: Login with new password work!")
    else:
        print(f"Failure: Login with new password failed with {resp.status_code}")

if __name__ == "__main__":
    test_password_update()
