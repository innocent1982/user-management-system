import requests

url = "http://127.0.0.1:3000/course/create/"
payload = {
    "name":"data science",
    "desciption":"data science and stuff",
    "level":1
}
response = requests.post(url, json=payload)
response_data = response.json()
