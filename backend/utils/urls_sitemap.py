from usp.tree import sitemap_tree_for_homepage

from .decorators import timer
from .save_file import save_data_to_file


def get_links_sitemap(domain):
    tree = sitemap_tree_for_homepage(domain)
    urls = [page.url for page in tree.all_pages()]

    return urls


@timer
def save_links_sitemap(domain, file_name):
    links = get_links_sitemap(domain)
    save_data_to_file(links, file_name)
