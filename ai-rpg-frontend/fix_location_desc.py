import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# Fix loadGame
content = content.replace(
    'if (state.currentRegion) setCurrentRegion(state.currentRegion);',
    'if (state.currentRegion) setCurrentRegion(state.currentRegion);\n        if (state.popis_okoli) setCurrentLocationDesc(state.popis_okoli);'
)

# Also when saving state, we need to save `popis_okoli`!
# Ah, `popis_okoli` is not in state! We can just save `currentLocationDesc`.
content = content.replace(
    'locationType, currentRegion, pointsOfInterest, stats, rations, currentImage, currentImageError',
    'locationType, currentRegion, pointsOfInterest, stats, rations, currentImage, currentImageError, currentLocationDesc'
)
content = content.replace(
    'if (state.currentRegion) setCurrentRegion(state.currentRegion);',
    'if (state.currentRegion) setCurrentRegion(state.currentRegion);\n        if (state.currentLocationDesc) setCurrentLocationDesc(state.currentLocationDesc);'
)

# In startNewGame, set default currentLocationDesc
content = content.replace(
    'setHp(100);',
    'setHp(100);\n          setCurrentLocationDesc("Mlha se pomalu rozestupuje a ty před sebou vidíš neznámý hvozd.");'
)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Location desc fixed!")
