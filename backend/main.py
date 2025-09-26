from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import asyncio

app = FastAPI(title="AI Aggregator - MVP")

# Allow frontend (localhost:5173 or 5174) to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Prompt(BaseModel):
    prompt: str

# Fake provider responses (for testing)
async def simulated_provider(name: str, prompt: str):
    await asyncio.sleep(0.5)  # simulate delay
    return {"provider": name, "text": f"{name} response to: {prompt}"}

@app.post("/ask")
async def ask(p: Prompt):
    providers = ["ProviderA", "ProviderB", "ProviderC"]
    tasks = [simulated_provider(name, p.prompt) for name in providers]
    results = await asyncio.gather(*tasks)
    best = max(results, key=lambda r: len(r["text"]))
    return {"best": best, "all": results}
