from lxml import html
import requests
import time
import csv

# Create our file
fh = open("Hackaday.csv", 'w', encoding="utf-8", newline='')
# Pipe delimited, quote encased, minimizes ocnflicts down the line
outCSVWriter = csv.writer(fh, delimiter='|', quoting=csv.QUOTE_ALL)

headers = ["postID", "date", "title", "content", "posts", "tags"]
outCSVWriter.writerow(headers)

for pageNum in range(5606):
    print(pageNum)
    page = requests.get('http://hackaday.com/blog/page/%d/'%pageNum)
    tree = html.fromstring(page.content)

    titles = tree.xpath('//article/header/h1/a/text()')
    postIDs = tree.xpath('//article/@id')
    dates = tree.xpath('//article/header/div/span[@class="entry-date"]/a/text()')
    article = tree.xpath('//article/div//p/child::text()/child::text()')
    posts = []
    tags = []
    content = []
    for i in range(len(titles)):
        posts.append(tree.xpath('//article[%d]/footer/span/a[@rel="category tag"]/text()'%(i+1)))
        tags.append(tree.xpath('//article[%d]/footer/span/a[@rel="tag"]/text()'%(i+1)))
        content.append("".join(tree.xpath('//article[%d]/div//p//child::text()'%(i+1))))
    for i in range(len(titles)):
        #print postIDs[i], + dates[i] +'\t' +titles[i] +'\t' + authors[i]+'\t'+commentCounts[i]+ '\t' + ",".join(posts[i]), + ",".join(tags[i])
        try:
            outCSVWriter.writerow([postIDs[i], dates[i], titles[i], content[i], ",".join(posts[i]), ",".join(tags[i])])
        except:
            pass
    time.sleep(1)
fh.close()

# Additional cleanup requires
# removing unnecessary new lines  regex(\n([^\\"])) \g{1}
# removing '[' and ']'
# remove 'word.word' and 'word-word'
# remove 'post-'