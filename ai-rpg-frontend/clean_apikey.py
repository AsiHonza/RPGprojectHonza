import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# Remove the broken state
content = re.sub(r'const \[setApiKey\] = useState\(""\);\s*', '', content)

# Remove the useEffect that restores the key
pattern_effect = r'useEffect\(\(\) => \{\s*const savedKey = localStorage\.getItem\("aethelgard_api_key"\);\s*if \(savedKey\) setApiKey\(savedKey\);\s*\}, \[\]\);\s*'
content = re.sub(pattern_effect, '', content)

# Remove the setItem in startNewGame
content = content.replace('localStorage.setItem("aethelgard_api_key", apiKey.trim());', '')

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("API Key remnants cleaned!")
