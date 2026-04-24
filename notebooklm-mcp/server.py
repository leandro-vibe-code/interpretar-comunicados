import os
from typing import Any

import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="NotebookLM MCP Adapter", version="0.1.0")

NOTEBOOKLM_API_BASE_URL = os.getenv("NOTEBOOKLM_API_BASE_URL", "https://notebooklm.google.com")
NOTEBOOKLM_API_KEY = os.getenv("NOTEBOOKLM_API_KEY", "")


class ExtractionRequest(BaseModel):
    turma: str = Field(..., description="Nome da turma associada ao comunicado")
    documento: str = Field(..., description="Texto do comunicado ou instrução escolar")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "notebooklm-mcp"}


@app.post("/extract")
async def extract(request: ExtractionRequest) -> dict[str, Any]:
    if not NOTEBOOKLM_API_KEY or NOTEBOOKLM_API_KEY == "change-me":
        raise HTTPException(
            status_code=400,
            detail="Defina NOTEBOOKLM_API_KEY para habilitar a integração real com NotebookLM."
        )

    # Endpoint de exemplo para integração. Ajuste conforme API real disponibilizada.
    target_url = f"{NOTEBOOKLM_API_BASE_URL.rstrip('/')}/api/extract"

    payload = {
        "classroom": request.turma,
        "content": request.documento,
        "fields": [
            "tipo_atividade",
            "disciplina",
            "data_prova",
            "data_entrega",
            "materiais_necessarios",
            "itens_mochila",
            "prioridade",
            "confianca"
        ]
    }

    headers = {"Authorization": f"Bearer {NOTEBOOKLM_API_KEY}"}

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(target_url, json=payload, headers=headers)

    if response.status_code >= 400:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    return {"source": "notebooklm", "data": response.json()}
