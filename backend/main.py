from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Backend funcionando 🔥"}

@app.get("/api/test")
def test():
    return {"status": "ok"}