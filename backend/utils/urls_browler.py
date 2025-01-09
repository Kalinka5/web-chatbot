import requests

from bs4 import BeautifulSoup as Soup

from urllib.parse import urljoin, urlparse

from .decorators import timer
from .save_file import save_data_to_file


def crawl_domain(base_url, page_limit=1000):
    """Crawl all links within the same domain."""
    visited = set()
    to_visit = [base_url]
    domain = urlparse(base_url).netloc
    all_links = []

    def fetch_links(url):
        """Fetch all links from a given URL."""
        try:
            response = requests.get(url, timeout=20)
            response.raise_for_status()
            soup = Soup(response.content, 'lxml')
            links = [
                urljoin(url, link.get('href'))
                for link in soup.find_all('a', href=True)
            ]
            return links
        except requests.RequestException as e:
            print(f"Error fetching {url}: {e}")
            return []

    while to_visit and len(all_links) < page_limit:
        current_url = to_visit.pop(0)
        if current_url in visited:
            continue

        visited.add(current_url)
        links = fetch_links(current_url)

        # Filter links to keep only those in the same domain
        filtered_links = [
            link for link in links if urlparse(link).netloc == domain
        ]

        # Add new links to visit and to the result list
        for link in filtered_links:
            if link not in visited and link not in to_visit:
                to_visit.append(link)

        all_links.extend(filtered_links)

    return list(set(all_links))  # Return unique links


@timer
def save_links(domain, file_name):
    links = crawl_domain(domain)
    save_data_to_file(links, file_name)
