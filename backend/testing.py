import requests
from bs4 import BeautifulSoup as Soup

from concurrent.futures import ThreadPoolExecutor

import json

from utils.decorators import timer
# from utils.scrap_data import scrape_all_pages_concurrently


def scrape_page(url: str, all_data: list):
    """
    Scrape all text content from the given URL and save it to a file.

    Args:
        url (str): The URL of the webpage to scrape.

    Returns:
        str: Scraped data or an error message.
    """
    try:
        # Fetch the page content
        response = requests.get(url, timeout=20)
        response.raise_for_status()

        # Parse the HTML
        soup = Soup(response.content, 'lxml')

        # Extract text from all elements
        page_text = soup.get_text(separator=' ').split('\n')
        new_data = [text.strip()
                    for text in page_text if len(text.strip()) > 2 if text.strip() not in all_data]

        all_data += new_data

        return new_data

    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")


@timer
def scrape_all_pages():
    with open("static/urls.txt", "r") as file:
        urls = [url.strip() for url in file.readlines()]

    all_data = []
    data_dict = {}

    def scrape_and_store(url):
        data = scrape_page(url, all_data)
        data_dict[url] = data
        print(f"Scrapped URL: {url}")

    with ThreadPoolExecutor(max_workers=10) as executor:
        executor.map(scrape_and_store, urls)

    print(f"All amount of URLs: {len(urls)}")
    print(f"Successfully scraped data from {len(data_dict)} URLs.")

    return data_dict, all_data


scraped_data, all_data_ = scrape_all_pages()

with open('static/not_repeated_data.txt', 'w') as file:
    for url, data in scraped_data.items():
        file.write(f"From {url} URL was scrapped data: {" ".join(data)}\n")
