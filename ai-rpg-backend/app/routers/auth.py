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

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post('/register')
async def register(req: AuthRequest):
    try:
        return {'status': 'success', 'api_key': f'{req.email}#DummyKey'}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post('/login')
async def login(req: AuthRequest):
    try:
        return {'status': 'success', 'api_key': f'{req.email}#DummyKey', 'email': req.email, 'name': 'Player'}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))