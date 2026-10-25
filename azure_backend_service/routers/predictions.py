from fastapi import APIRouter, File, UploadFile, status
from services.custom_vision import predict_image

router = APIRouter()

@router.post("/predict", status_code=status.HTTP_202_ACCEPTED)
async def predict(file: UploadFile = File(...)):
    return await predict_image(file)