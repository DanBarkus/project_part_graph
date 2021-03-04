import csv
import nltk
import re
import copy
# nltk.download('punkt')
# nltk.download('averaged_perceptron_tagger')

def is_noun(pos):
    return pos[:2] in ['NN', 'JJ']

inFile = "Hackaday.csv"
outFile = "hackaday_nouns.csv"
rowsToExtract = ["title", "content","posts", "tags"]
# rowsToExtract = ["product_name"]
# rowsToExtract = ["title", "description"]
rowToMatch = "postID"



outCSV = open(outFile, "w", encoding="utf-8", newline='')
outCSVWriter = csv.writer(outCSV, delimiter='|', quoting=csv.QUOTE_ALL)
outCSVWriter.writerow([rowToMatch, "noun"])

rows = []
with open(inFile, "r", encoding="utf-8") as csvFile:
    reader = csv.DictReader(csvFile, delimiter='|', quoting=csv.QUOTE_ALL)
    for row in reader:
        nouns = set()
        for col in rowsToExtract:
            if col == "tags":
                nouns = set(row[col]) | nouns
            else:
                tokenized = nltk.word_tokenize(row[col])
                nouns = set([word for (word, pos) in nltk.pos_tag(tokenized) if (is_noun(pos) or re.search("([a-zA-Z]+\d+.*?)", word))]) | nouns
        # print(nouns)
        noons = copy.deepcopy(nouns)
        for noun in noons:
            split = re.split('.|-|_|\+|~|',noun)
            if split:
                nouns.update(split)
                # nouns.remove(noun)
        for noun in nouns:
            if re.search("\w{2,}",noun):
                outCSVWriter.writerow([row[rowToMatch],noun.lower()])
        