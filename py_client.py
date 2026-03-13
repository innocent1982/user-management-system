import requests

url = "http://127.0.0.1:3000/student/initiate-verify-email/"
payload = {
    "username":"yamikani",
    "email":"innocentkamesa055@gmail.com",
}
response = requests.post(url, json=payload)
if response.status_code == 200:
    data = response.json()
    token = data.get("token")
    url = f"http://127.0.0.1:3000/student/verify-email?token={token}"
    response = requests.get(url)
    print(response.text)