import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# Insert after import
if "const API_URL" not in content:
    content = content.replace(
        'import { useState, useRef, useEffect } from "react";',
        'import { useState, useRef, useEffect } from "react";\n\nconst API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";\n'
    )

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("API_URL defined!")
