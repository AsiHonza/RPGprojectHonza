import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

target = """      return new Promise((resolve) => {
        let voice = "cs-CZ-AntoninNeural";
        if (voiceType === "npc_zena") voice = "cs-CZ-VlastaNeural";
        if (voiceType === "npc_muz") voice = "cs-CZ-AntoninNeural";

        const url = `http://127.0.0.1:8000/tts?text=${encodeURIComponent(text)}&voice=${voice}`;
        const audio = new Audio(url);
        audio.volume = ttsVolume;
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        audio.play().catch(e => {
          console.error("Chyba přehrávání:", e);
          resolve(); // resolve anyway to not block queue
        });
      });"""

replacement = """      return new Promise(async (resolve) => {
        let voice = "cs-CZ-AntoninNeural";
        if (voiceType === "npc_zena") voice = "cs-CZ-VlastaNeural";
        if (voiceType === "npc_muz") voice = "cs-CZ-AntoninNeural";

        const url = `http://127.0.0.1:8000/tts?text=${encodeURIComponent(text)}&voice=${voice}`;
        try {
          // Fetch blob to bypass strict adblocker media policies
          const response = await fetch(url);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          
          const audio = new Audio(blobUrl);
          audio.volume = ttsVolume;
          audio.onended = () => { URL.revokeObjectURL(blobUrl); resolve(); };
          audio.onerror = () => { URL.revokeObjectURL(blobUrl); resolve(); };
          audio.play().catch(e => {
            console.error("Chyba přehrávání:", e);
            resolve();
          });
        } catch (e) {
          console.error("Network chyba tts:", e);
          resolve();
        }
      });"""

if target in content:
    content = content.replace(target, replacement)
    with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
        f.write(content)
    print("Audio fetch fixed!")
else:
    print("Target not found!")
