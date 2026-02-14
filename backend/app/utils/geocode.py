import requests

def get_address_from_coordinates(latitude, longitude):
    url = "https://nominatim.openstreetmap.org/reverse"
    
    params = {
        "lat": latitude,
        "lon": longitude,
        "format": "json"
    }

    headers = {
        "User-Agent": "municipal-complaint-system"
    }

    response = requests.get(url, params=params, headers=headers)

    if response.status_code == 200:
        data = response.json()
        return data.get("display_name", "Address Not Found")
    
    return "Address Not Found"
