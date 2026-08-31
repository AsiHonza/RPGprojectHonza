import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# Add the API_URL constant right after imports
if "const API_URL =" not in content:
    content = content.replace(
        'import React, { useState, useRef, useEffect } from "react";',
        'import React, { useState, useRef, useEffect } from "react";\n\nconst API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";'
    )

# Replace fetch calls
content = content.replace('"http://127.0.0.1:8000/load-game"', '`${API_URL}/load-game`')
content = content.replace('"http://127.0.0.1:8000/save-state"', '`${API_URL}/save-state`')
content = content.replace('"http://127.0.0.1:8000/action"', '`${API_URL}/action`')
content = content.replace('"http://127.0.0.1:8000/create-character"', '`${API_URL}/create-character`')
content = content.replace('"http://127.0.0.1:8000/generate-backstory"', '`${API_URL}/generate-backstory`')

# Replace TTS URL
content = content.replace('`http://127.0.0.1:8000/tts?text=${encodeURIComponent(text)}&voice=${voice}`', '`${API_URL}/tts?text=${encodeURIComponent(text)}&voice=${voice}`')

# Fix image URL if it's absolute
content = content.replace(
    'if (data.image_url) setCurrentImage(data.image_url);',
    'if (data.image_url) setCurrentImage(data.image_url.startsWith("http") ? data.image_url : `${API_URL}${data.image_url}`);'
)
content = content.replace(
    'if (state.currentImage) setCurrentImage(state.currentImage);',
    'if (state.currentImage) setCurrentImage(state.currentImage.startsWith("http") && !state.currentImage.includes("127.0.0.1") ? state.currentImage : (state.currentImage.includes("127.0.0.1") ? state.currentImage.replace("http://127.0.0.1:8000", API_URL) : `${API_URL}${state.currentImage}`));'
)


with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Frontend URLs updated!")
