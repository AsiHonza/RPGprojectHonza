import codecs

target = """
from fastapi.responses import StreamingResponse
import edge_tts
import io

@app.get("/tts")
async def get_tts(text: str, voice: str = "cs-CZ-AntoninNeural"):
    try:
        communicate = edge_tts.Communicate(text, voice)
        audio_data = b""
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_data += chunk["data"]
        
        return StreamingResponse(io.BytesIO(audio_data), media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
"""

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

if "def get_tts" not in content:
    content += target

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("TTS endpoint added!")
