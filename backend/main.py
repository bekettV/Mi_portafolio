from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Backend funcionando 🔥"}


@app.get("/api/test")
def test():
    return {"status": "ok"}


# Evita el 404 automático del navegador cuando pide el favicon.
@app.get("/favicon.ico")
def favicon():
    return {"detail": "No favicon configured"}


# Ruta para servir PDFs desde backend/archivo/pdf
PDF_DIR = Path(__file__).resolve().parent / "archivo" / "pdf"


@app.get("/pdf/{filename}")
@app.get("/pdfs/{filename}")
def view_pdf(filename: str):
    file_path = PDF_DIR / filename
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="PDF not found")
    headers = {"Content-Disposition": f'inline; filename="{filename}"'}
    return FileResponse(path=str(file_path), media_type="application/pdf", headers=headers)


@app.get("/pdf-download/{filename}")
def download_pdf(filename: str):
    file_path = PDF_DIR / filename
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="PDF not found")
    return FileResponse(path=str(file_path), media_type="application/pdf", filename=filename)