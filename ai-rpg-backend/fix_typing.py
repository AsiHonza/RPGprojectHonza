import codecs
import re

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

content = content.replace("travel_mode_set: bool = None", "travel_mode_set: Optional[bool] = None")
content = content.replace("travel_days_left_set: int = None", "travel_days_left_set: Optional[int] = None")
content = content.replace("travel_destination_set: str = None", "travel_destination_set: Optional[str] = None")

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Typing fixed.")
