import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

target = """                      </button>
                    {msg.vypravec}
                    </div>"""

replacement = """                      </button>
                    <TypewriterText text={msg.vypravec} animate={i === history.length - 1} />
                    </div>"""

content = content.replace(target, replacement)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Vypravec fixed!")
