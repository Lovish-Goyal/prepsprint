import urllib.request
import json

url = "http://localhost:8000/api/skills/analyze"
payload = {
    "current_skills": ["Python", "React"],
    "target_role": "Full Stack Developer"
}
data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

print("Sending request to:", url)
try:
    with urllib.request.urlopen(req) as response:
        print("Status Code:", response.getcode())
        resp_body = response.read().decode('utf-8')
        try:
            print("Response:", json.dumps(json.loads(resp_body), indent=2))
        except Exception as e:
            print("Raw text:", resp_body)
except urllib.error.HTTPError as e:
    print("Error:", e.code, e.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
