import requests
import json

def test_gemini_api():
    url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
    api_key = 'AIzaSyBQfQ7sN-ASKnlFe8Zg50xsp6qmDdZoweU'

    headers = {
        'Content-Type': 'application/json'
    }

    data = {
        'contents': [{
            'parts': [{
                'text': 'Hello, how are you?'
            }]
        }]
    }

    try:
        print('Making request to:', f'{url}?key={api_key}')
        print('Request data:', json.dumps(data, indent=2))
        response = requests.post(f'{url}?key={api_key}', headers=headers, json=data)
        print('\nStatus Code:', response.status_code)
        print('Response:', json.dumps(response.json(), indent=2))
    except Exception as e:
        print('Error:', str(e))

if __name__ == '__main__':
    test_gemini_api() 