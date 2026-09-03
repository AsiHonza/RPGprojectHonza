import io
import edge_tts
from fastapi.responses import StreamingResponse
from fastapi import APIRouter, HTTPException
from app.models.schemas import *
from app.core.config import supabase
from google import genai
from google.genai import types
import os
import json
import uuid
import random
from app.services.game_service import *

router = APIRouter(prefix="", tags=["Audio"])

@router.get('/tts')
async def get_tts(text: str, voice: str='cs-CZ-AntoninNeural'):
    try:
        communicate = edge_tts.Communicate(text, voice)
        audio_data = b''
        async for chunk in communicate.stream():
            if chunk['type'] == 'audio':
                audio_data += chunk['data']
        return StreamingResponse(io.BytesIO(audio_data), media_type='audio/mpeg')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))