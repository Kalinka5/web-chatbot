from utils.scrap_data import make_scrapping
from utils.urls_browler import save_links
from utils.urls_sitemap import save_links_sitemap


domain = "https://kaiduweb.com/"
URLS_FOLDER = "static/urls.txt"


# links = save_links_sitemap(domain, URLS_FOLDER)
save_links(domain, URLS_FOLDER)
make_scrapping()
