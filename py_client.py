import requests

url = "http://127.0.0.1:3000/student/register/"
payload = {
    "username":"rodrickhadza",
    "email":"rodricchadza@gmail.com",
    "password":"@Inno2006"
}
response = requests.post(url, json=payload)
response_data = response.json()
if response.status_code == 200:
    user_data = response_data.get("data")
    print(user_data)
    token = user_data.get("token")
    url = f"http://127.0.0.1:3000/student/verify-email?token={token}"
    response = requests.get(url)
    print(response.text)