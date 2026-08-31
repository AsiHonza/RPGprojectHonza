import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# Instead of checking data.image_base64, check data.image_url
content = content.replace("if (data.image_base64) setCurrentImage(data.image_base64);", "if (data.image_url) setCurrentImage(data.image_url); else if (data.image_base64) setCurrentImage(data.image_base64);")
content = content.replace("else if (data.image_base64) setCurrentImageError(null);", "else if (data.image_url || data.image_base64) setCurrentImageError(null);")

# Update the img src logic to handle both URL and base64
target_img = '              <img src={`data:image/jpeg;base64,${currentImage}`} className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-luminosity" />'
replacement_img = '              <img src={currentImage.startsWith("http") ? currentImage : `data:image/jpeg;base64,${currentImage}`} className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-luminosity" />'
content = content.replace(target_img, replacement_img)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Frontend URL logic added!")
