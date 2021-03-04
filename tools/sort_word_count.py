import json

nounFile = "nouns.json"
sortedFile = open("sorted.json", "w")

words = json.loads(open(nounFile, "r", encoding="utf-8").read())

outJSON = {}
for word in sorted(words, key=words.get, reverse=True):
    outJSON[word] = words[word]

json.dump(outJSON, sortedFile)