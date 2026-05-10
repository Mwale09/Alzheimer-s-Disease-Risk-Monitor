import requests

BASE_URL = "http://localhost:8000"

def test_password_update():
    # 1. Login to get token
    login_data = {
        "username": "admin",
        "password": "password123" # Assuming this is the current password
    }
    # Note: If admin/password123 doesn't exist, this will fail. 
    # I should check the DB or create a test user.
    
    try:
        response = requests.post(f"{BASE_URL}/login", data=login_data)
        if response.status_code != 200:
            print(f"Login failed: {response.text}")
            return
        
        token = response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # 2. Update password
        update_data = {"new_password": "newpassword123"}
        response = requests.post(f"{BASE_URL}/update-password", json=update_data, headers=headers)
        print(f"Update response: {response.status_code}, {response.json()}")
        
        # 3. Verify login with new password
        login_data["password"] = "newpassword123"
        response = requests.post(f"{BASE_URL}/login", data=login_data)
        print(f"Login with new password response: {response.status_code}")
        
        # 4. Reset back to original (for safety/consistency)
        response = requests.post(f"{BASE_URL}/update-password", json={"new_password": "password123"}, headers=headers)
        print(f"Reset response: {response.status_code}")

    except Exception as e:
        print(f"Error during test: {e}")

if __name__ == "__main__":
    test_password_update()
