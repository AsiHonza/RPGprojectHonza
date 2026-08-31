import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

target = """                <>
                  <div className="flex gap-2">"""

replacement = """                <>
                  <div className="mb-4">
                    <label className="block font-bold mb-2 text-[#3d2b1f]">Gemini API Klíč (Nutné pro hraní!)</label>
                    <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} className="w-full p-2 bg-[#e8dcc4] border border-[#c4a47c] rounded outline-none focus:ring-2 focus:ring-[#8b1e1e]" placeholder="AIzaSy..." />
                  </div>
                  <div className="flex gap-2">"""

content = content.replace(target, replacement)

target2 = """        setIsLoggedIn(true);
        fetchCharacters(email);
      } catch (error: any) {"""

replacement2 = """        localStorage.setItem("aethelgard_api_key", apiKey.trim());
        setIsLoggedIn(true);
        fetchCharacters(email);
      } catch (error: any) {"""

content = content.replace(target2, replacement2)


with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Login API Key fixed!")
