import json
import csv

inFile = "adafruit.json"
outFile = "adafruit.csv"

data = json.loads(open(inFile, "r").read())
outCSV = open(outFile, "w", encoding="utf-8", newline='')
outCSVWriter = csv.writer(outCSV, delimiter='|', quoting=csv.QUOTE_ALL, lineterminator='\n')

ignore_rows = ["discount_pricing", "product_image", "image_is_video"]

headers = data[0].keys()

headers = [x for x in headers if x not in ignore_rows]

outCSVWriter.writerow(headers)


for entry in data:
    line = []
    for attr in entry:
        if attr in headers:
            line.append(entry[attr])
    outCSVWriter.writerow(line)