import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

target = """        const url = `http://127.0.0.1:8000/tts?text=${encodeURIComponent(text)}&voice=${voice}`;
        const audio = new Audio(url);
        audio.volume = ttsVolume;
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        audio.play().catch(e => {
          console.error("Chyba přehrávání:", e);
          resolve(); // resolve anyway to not block queue
        });"""

replacement = """        const url = `http://127.0.0.1:8000/tts?text=${encodeURIComponent(text)}&voice=${voice}`;
        fetch(url)
          .then(res => res.blob())
          .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            const audio = new Audio(blobUrl);
            audio.volume = ttsVolume;
            audio.onended = () => { URL.revokeObjectURL(blobUrl); resolve(); };
            audio.onerror = () => { URL.revokeObjectURL(blobUrl); resolve(); };
            audio.play().catch(e => {
              console.error("Chyba přehrávání:", e);
              URL.revokeObjectURL(blobUrl);
              resolve();
            });
          })
          .catch(e => {
            console.error("Network chyba TTS:", e);
            resolve();
          });"""

# Because of encoding issues with 'Chyba přehrávání:', we'll use a regex that ignores it
content = re.sub(
    r'const url = `http://127\.0\.0\.1:8000/tts\?text=\$\{encodeURIComponent\(text\)\}&voice=\$\{voice\}`;.*?resolve\(\); // resolve anyway to not block queue\s*\}\);',
    replacement,
    content,
    flags=re.DOTALL
)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Audio fetch fixed with regex!")
