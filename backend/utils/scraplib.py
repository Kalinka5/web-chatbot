from usp.tree import sitemap_tree_for_homepage

import requests

from bs4 import BeautifulSoup as Soup

from urllib.parse import urljoin, urlparse
from concurrent.futures import ThreadPoolExecutor

from pathlib import Path

import json

from typing import Dict, List


class Scraplib:
    def __init__(self, domain, repeat=False, page_limit=1000):
        self.domain = domain
        self.repeat = repeat
        self.page_limit = page_limit
        self.folder = 'static/'

        self.all_data = []

    def save_urls_to_file(self, urls: List[str], file_name: str) -> None:
        """Save a list of urls to a file, ensuring the folder exists."""
        full_path = self.folder + file_name

        # Ensure the folder exists
        output_path = Path(full_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        file_type = file_name.split('.')[-1]

        if file_type == "txt":
            with output_path.open('w') as file:
                for url in urls:
                    file.write(f"{url}\n")
        else:
            raise TypeError("File type should be only txt")

    def save_data_to_file(self, data: Dict[str, List[str]], file_name: str) -> None:
        """Save full scraped data to a file, ensuring the folder exists."""

        full_path = self.folder + file_name

        # Ensure the folder exists
        output_path = Path(full_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        file_type = file_name.split('.')[-1]

        if file_type == 'txt':
            with open(full_path, 'w') as txt_file:
                for url, data in data.items():
                    str_data = " ".join(data)
                    txt_file.write(
                        f"From {url} URL was scrapped data: {str_data}\n"
                    )
        elif file_type == 'json':
            with open(full_path, 'w') as json_file:
                json.dump(data, json_file)
        else:
            raise TypeError("File type should be only txt or json")

    @staticmethod
    def __fetch_links(url: str) -> List[str]:
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

    def urls_crawl(self) -> List[str]:
        """Crawl all links within the same domain."""
        visited = set()
        to_visit = [self.domain]
        domain = urlparse(self.domain).netloc
        all_links = []

        while to_visit and len(all_links) < self.page_limit:
            current_url = to_visit.pop(0)
            if current_url in visited:
                continue

            visited.add(current_url)
            links = self.__fetch_links(url=current_url)

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

    def urls_sitemap(self) -> List[str]:
        """Get all urls from all files of sitemap"""
        tree = sitemap_tree_for_homepage(self.domain)
        urls = [page.url for page in tree.all_pages()]

        return list(set(urls))

    def scrap_data(self, url: str) -> List[str]:
        """Scrap full page if repeat is True and scrap not repeated data if False"""
        try:
            # Fetch the page content
            response = requests.get(url, timeout=20)
            response.raise_for_status()

            # Parse the HTML
            soup = Soup(response.content, 'lxml')

            if self.repeat:
                # extract full text from page
                scraped_data = soup.get_text(separator=' ', strip=True)
            else:
                # Extract text parts from all elements
                page_text = soup.get_text(separator=' ').split('\n')
                scraped_data = [
                    text.strip()
                    for text in page_text
                    if len(text.strip()) > 2 if text.strip() not in self.all_data
                ]

                self.all_data += scraped_data

            return scraped_data

        except requests.RequestException as e:
            print(f"Error fetching {url}: {e}")
        except Exception as e:
            print(f"An error occurred: {e}")

    def scrap_all_pages(self, urls_file: str) -> Dict[str, List[str]]:
        """Scrap each url from urls file"""
        file_path = self.folder + urls_file

        if not Path(file_path).is_file():
            raise FileNotFoundError(f"URLs file not found: {file_path}")

        with open(file_path, "r") as file:
            urls = [url.strip() for url in file.readlines()]

        data_dict = {}

        def scrap_and_store(url):
            data = self.scrap_data(url)
            if data:  # Only store URLs with valid data
                data_dict[url] = data
                print(f"Scrapped URL: {url}")
            else:
                print(f"No data scrapped from URL: {url}")

        with ThreadPoolExecutor(max_workers=10) as executor:
            executor.map(scrap_and_store, urls)

        print(f"All amount of URLs: {len(urls)}")
        print(f"Successfully scraped data from {len(data_dict)} URLs.")

        return data_dict
