from utils.scraplib import Scraplib


scraplib = Scraplib('https://kaiduweb.ctwiii.com/')
urls = scraplib.urls_sitemap()
scraplib.save_urls_to_file(urls, 'urls_new_domain.txt')
data = scraplib.scrap_all_pages('urls_new_domain.txt')
scraplib.save_data_to_file(data, 'data_new_domain.txt')
