from homeassistant_api import Client
import os
from dotenv import load_dotenv
load_dotenv()


client = Client(
    'https://hass.mdu-smartroom.se/api',
    os.getenv("HASS_API_KEY")
)


print(client.get_entity(entity_id="camera.192_168_8_125"))
state = client.get_entity(entity_id="camera.192_168_8_125").get_state()
# print(state)
state = dict(state)
# print(state)
token = state['attributes']['access_token']
urlCam = 'https://hass.mdu-smartroom.se/fridge?token='
urlCam = urlCam + token
print(urlCam)


