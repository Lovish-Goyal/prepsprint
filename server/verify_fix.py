from fastapi.testclient import TestClient
import sys
import os

# Add server to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import app

client = TestClient(app)

def test_endpoints():
    print("Testing /api/technologies/...")
    try:
        response = client.get("/api/technologies/")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Items returned: {len(data)}")
            if len(data) > 0:
                print(f"First item: {data[0].get('name')} (id: {data[0].get('id')})")
                if "_id" in data[0]:
                    print("ERROR: _id still present in response!")
                else:
                    print("SUCCESS: _id removed from response.")
        else:
            print(f"Error detail: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")

    print("\nTesting /health...")
    response = client.get("/health")
    print(f"Status: {response.status_code}, Body: {response.json()}")

if __name__ == "__main__":
    test_endpoints()
