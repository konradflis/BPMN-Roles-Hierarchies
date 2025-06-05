from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routers import add_roles
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(add_roles.router)

@app.get("/")
async def root():
    return {"message": "Backend works :)"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)