import requests
from bs4 import BeautifulSoup as Soup

from concurrent.futures import ThreadPoolExecutor


def scrape_page_with_repeatition(url: str):
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
        results = list(executor.map(scrape_page_with_repeatition, urls))
        all_data.extend(results)

    print(f"All amount of URLs: {len(urls)}")
    print(f"Successfully scraped data from {len(all_data)} URLs.")

    return all_data


def scrape_page_without_repetition(url: str, all_data: list):
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


def scrape_all_pages():
    with open("static/urls.txt", "r") as file:
        urls = [url.strip() for url in file.readlines()]

    all_data = []
    data_dict = {}

    def scrape_and_store(url):
        data = scrape_page_without_repetition(url, all_data)
        data_dict[url] = data
        print(f"Scrapped URL: {url}")

    with ThreadPoolExecutor(max_workers=10) as executor:
        executor.map(scrape_and_store, urls)

    print(f"All amount of URLs: {len(urls)}")
    print(f"Successfully scraped data from {len(data_dict)} URLs.")

    return data_dict, all_data


# scraped_data, all_data_ = scrape_all_pages()

# with open('static/not_repeated_data.txt', 'w') as file:
#     for url, data in scraped_data.items():
#         file.write(f"From {url} URL was scrapped data: {" ".join(data)}\n")
