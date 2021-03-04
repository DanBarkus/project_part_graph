import json
import csv

commonNouns = "most_popular_words.csv"
outFile = "filtered_nouns.csv"


outCSV = open(outFile, "w", encoding="utf-8")
outCSVWriter = csv.writer(outCSV, delimiter='|', quoting=csv.QUOTE_ALL, lineterminator='\n')

with open(commonNouns, "r", encoding="utf-8") as csvFile:
    reader = csv.DictReader(csvFile, delimiter='|', fieldnames=["Word","Parts of speech","OEC rank","COCA rank[8]","Dolch level","Polysemy"])
    for rowNum, row in enumerate(reader):
        outCSVWriter.writerow([row["Word"],"Common"])