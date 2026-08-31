import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

target = """        # --- Caching and Image Generation ---
        import os
        from google import genai
        from google.genai import types
        import unicodedata
        import re"""

replacement = """        # --- Caching and Image Generation ---
        import unicodedata
        import re"""

content = content.replace(target, replacement)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Local imports removed!")
