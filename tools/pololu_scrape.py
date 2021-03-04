from lxml import html
import requests
import time
import csv

# Create our file
fh = open("Pololu.csv", 'w', encoding="utf-8", newline='')
# Pipe delimited, quote encased, minimizes ocnflicts down the line
outCSVWriter = csv.writer(fh, delimiter='|', quoting=csv.QUOTE_ALL)

headers = ["postID", "title", "description"]
outCSVWriter.writerow(headers)

for pageNum in range(3,328):
    print(pageNum)
    page = requests.get('http://pololu.com/category/%d/'%pageNum)
    tree = html.fromstring(page.content)

    pageTitles = tree.xpath('//div[@class="category_product"]/div[@class="product_name_and_description"]/div[@class="product_name"]/h2/a/text()')
    postIDs = tree.xpath('//div[@class="category_product"]/div[@class="product_name_and_description"]/div[@class="product_name"]/h2/a/@href')
    pageDescription = tree.xpath('//div[@class="category_product"]/div[@class="product_name_and_description"]/div[@class="description"]/p//child::text()')
    # article = tree.xpath('//article/div//p/child::text()/child::text()')
    titles = []
    ids = []
    descriptions = []
    # content = []
    for i in range(len(pageTitles)):
        titles.append(tree.xpath('//div[@class="category_product"][%d]/div[@class="product_name_and_description"]/div[@class="product_name"]/h2/a/text()'%(i+1)))
        ids.append(postIDs[i].split('/')[-1])
        descriptions.append("".join(tree.xpath('//div[@class="category_product"][%d]/div[@class="product_name_and_description"]/div[@class="description"]/p//child::text()'%(i+1))))
    #     tags.append(tree.xpath('//article[%d]/footer/span/a[@rel="tag"]/text()'%(i+1)))
    #     content.append("".join(tree.xpath('//article[%d]/div//p//child::text()'%(i+1))))
    for i in range(len(titles)):
    #     #print postIDs[i], + dates[i] +'\t' +titles[i] +'\t' + authors[i]+'\t'+commentCounts[i]+ '\t' + ",".join(posts[i]), + ",".join(tags[i])
        try:
            outCSVWriter.writerow([ids[i], titles[i], descriptions[i]])
        except:
            pass
    time.sleep(1)

fh.close()

# Additional cleanup requires
# removing unnecessary new lines  regex(\n([^\\"])) \g{1}
# removing '[' and ']'
# remove 'post-'