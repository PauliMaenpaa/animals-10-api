import os
from fastapi import File, UploadFile
import httpx
from dotenv import load_dotenv

# ladataan ensin ympäristömuuttujat .env tiedostosta
load_dotenv()

PREDICTION_KEY = os.getenv("PREDICTION_KEY")
PREDICTION_URL: httpx.URL | str = os.getenv("PREDICTION_URL")

async def predict_image(file: UploadFile = File(...)):
    image_bytes = await file.read()

    # azure vaatii alla olevat headerit
    headers = {
        "Prediction-Key": PREDICTION_KEY,
        "Content-Type": "application/octet-stream"
    }

    # lähetetään kuva azurelle
    async with httpx.AsyncClient() as client:
        # mihin content tallennetaan AsyncClient instanssissa?
        response = await client.post(PREDICTION_URL, headers=headers, content=image_bytes)

        # puretaan vastaus
        data = response.json()
        prediction = data["predictions"][0]

        # palautetaan frontille oleellisimmat tiedot
        return {
            "tag": prediction["tagName"],
            "probability": round(prediction["probability"] * 100, 1)
        }