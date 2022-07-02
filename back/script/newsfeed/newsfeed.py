import os
import requests
from bs4 import BeautifulSoup as bs

filePath = os.path.dirname(__file__)

target = "https://www.hkbs.co.kr"
page = requests.get(target)
soup = bs(page.text, "html.parser")

elements = soup.select('#skin-32 a', href=True)

f = open(os.path.join(filePath, 'news.txt'), 'w', encoding='utf-8')

for index, element in enumerate(elements, 1):
  element['href'] = target + element['href']
  f.write("{}@{}\n".format(element['href'], element.text))

f.close()