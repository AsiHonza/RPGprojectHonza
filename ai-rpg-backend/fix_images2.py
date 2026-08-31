import codecs
import re

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

target = "dm_json = json.loads(response.text)"

replacement = """dm_json = json.loads(response.text)
        
        # --- Caching and Image Generation ---
        import os
        from google import genai
        from google.genai import types
        import unicodedata
        import re
        
        region = dm_json.get("aktualni_region", "nezname_konciny")
        slug = unicodedata.normalize('NFKD', region).encode('ascii', 'ignore').decode('ascii')
        slug = re.sub(r'[^a-z0-9]+', '_', slug.lower()).strip('_')
        if not slug:
            slug = "lokace_bez_jmena"
            
        filename = f"{slug}.jpg"
        filepath = os.path.join("images", filename)
        
        # Check if already cached
        if os.path.exists(filepath):
            dm_json["image_url"] = f"http://127.0.0.1:8000/images/{filename}"
        else:
            img_key = os.environ.get("GEMINI_IMAGE_API_KEY")
            img_prompt = dm_json.get("image_prompt")
            if img_key and img_prompt:
                try:
                    img_client = genai.Client(api_key=img_key)
                    img_res = img_client.models.generate_images(
                        model='imagen-3.0-generate-002',
                        prompt=img_prompt,
                        config=types.GenerateImagesConfig(
                            number_of_images=1,
                            output_mime_type="image/jpeg",
                            aspect_ratio="16:9"
                        )
                    )
                    if img_res.generated_images:
                        image_bytes = img_res.generated_images[0].image.image_bytes
                        with open(filepath, "wb") as img_file:
                            img_file.write(image_bytes)
                        dm_json["image_url"] = f"http://127.0.0.1:8000/images/{filename}"
                except Exception as img_e:
                    err_str = str(img_e).lower()
                    if "429" in err_str or "exhausted" in err_str or "quota" in err_str:
                        dm_json["image_error"] = "Vyčerpán denní limit pro obrázky. Zobrazuji černé pozadí."
                    else:
                        dm_json["image_error"] = f"Chyba: {str(img_e)}"
"""

if target in content:
    content = content.replace(target, replacement)
    with codecs.open("main.py", "w", "utf-8") as f:
        f.write(content)
    print("Image logic added!")
else:
    print("Target not found!")
