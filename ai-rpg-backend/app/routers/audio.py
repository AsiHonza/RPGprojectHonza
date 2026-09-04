import io
import os
import httpx
import edge_tts
from fastapi.responses import StreamingResponse
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="", tags=["Audio"])

# ElevenLabs voice mappings (verified working with free tier)
ELEVEN_VOICES = {
    "narrator": "JBFqnCBsd6RMkjVDRZzb",  # George (deep, warm, British-style fantasy narrator)
    "npc_muz": "pNInz6obpgDQGcFmaJgB",    # Adam (grounded male voice)
    "npc_zena": "EXAVITQu4vr4xnSDxMaL",   # Bella (expressive female voice)
}

# Edge-TTS voice mappings and tuning for atmospheric fantasy immersion
EDGE_CONFIG = {
    "narrator": {"voice": "cs-CZ-AntoninNeural", "rate": "-6%", "pitch": "-6Hz"},
    "npc_muz": {"voice": "cs-CZ-AntoninNeural", "rate": "-3%", "pitch": "-3Hz"},
    "npc_zena": {"voice": "cs-CZ-VlastaNeural", "rate": "-2%", "pitch": "0Hz"}
}

async def generate_edge_tts(text: str, voice_type: str = "narrator") -> bytes:
    cfg = EDGE_CONFIG.get(voice_type, EDGE_CONFIG["narrator"])
    communicate = edge_tts.Communicate(
        text=text,
        voice=cfg["voice"],
        rate=cfg["rate"],
        pitch=cfg["pitch"]
    )
    audio_data = b''
    async for chunk in communicate.stream():
        if chunk['type'] == 'audio':
            audio_data += chunk['data']
    return audio_data

async def generate_elevenlabs_tts(text: str, voice_type: str = "narrator") -> bytes:
    api_key = os.environ.get("ELEVENLABS_API_KEY")
    if not api_key:
        raise ValueError("ELEVENLABS_API_KEY is not configured")

    voice_id = ELEVEN_VOICES.get(voice_type, ELEVEN_VOICES["narrator"])
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": 0.35,
            "use_speaker_boost": True
        }
    }
    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        res = await client.post(url, json=payload, headers=headers)
        if res.status_code != 200:
            raise RuntimeError(f"ElevenLabs HTTP {res.status_code}: {res.text}")
        return res.content

@router.get('/tts')
async def get_tts(text: str, voice_type: str = "narrator", provider: str = "elevenlabs", voice: str = None):
    # Backward compatibility with legacy frontend voice parameter
    if voice and (not voice_type or voice_type == "narrator"):
        if "Vlasta" in voice:
            voice_type = "npc_zena"
        elif "Antonin" in voice:
            voice_type = "narrator"

    # Attempt ElevenLabs if requested and API key is present
    if provider == "elevenlabs" and os.environ.get("ELEVENLABS_API_KEY"):
        try:
            audio_bytes = await generate_elevenlabs_tts(text, voice_type)
            return StreamingResponse(io.BytesIO(audio_bytes), media_type='audio/mpeg')
        except Exception as e:
            print(f"[TTS Warning] ElevenLabs request failed: {e}. Falling back to tuned Edge-TTS.")

    # Default and reliable fallback: Tuned Edge-TTS
    try:
        audio_bytes = await generate_edge_tts(text, voice_type)
        return StreamingResponse(io.BytesIO(audio_bytes), media_type='audio/mpeg')
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS failure: {str(e)}")
