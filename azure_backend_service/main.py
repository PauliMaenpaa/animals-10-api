from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import predictions

app = FastAPI()
app.include_router(predictions.router)

# sallitaan kaikki yhteydet frontendistä myös eri origineista
app.add_middleware(
    CORSMiddleware, 
    allow_origins="*",
    allow_credentials=True,
    allow_methods="*",
    allow_headers="*"
)