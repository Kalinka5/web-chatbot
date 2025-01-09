import requests
from bs4 import BeautifulSoup as Soup

from concurrent.futures import ThreadPoolExecutor

from .decorators import timer
from .save_file import save_data_to_file


def scrape_page_text(url: str):
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
        page_text = soup.get_text(separator=' ', strip=True)

        return f"From {url} URL was scrapped data: {page_text}"

    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")


def scrape_all_pages_concurrently():
    """
    Scrape text content from a list of URLs concurrently.

    Returns:
        list: List of scraped data from all URLs.
    """
    all_data = []
    with open("static/urls.txt", "r") as file:
        urls = [url.strip() for url in file.readlines()]

    # Use ThreadPoolExecutor for concurrency
    with ThreadPoolExecutor(max_workers=10) as executor:
        results = list(executor.map(scrape_page_text, urls))
        all_data.extend(results)

    print(f"All amount of URLs: {len(urls)}")
    print(f"Successfully scraped data from {len(all_data)} URLs.")

    return all_data


@timer
def make_scrapping():
    scraped_data = scrape_all_pages_concurrently()
    save_data_to_file(scraped_data, "static/data.txt")
