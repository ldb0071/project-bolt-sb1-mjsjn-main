import json
import time
import os
from urllib.parse import urljoin
import logging
from typing import Dict, List, Optional

import requests
from bs4 import BeautifulSoup
from tqdm import tqdm

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CVPRScraper:
    def __init__(self, year: int, delay: float = 0.25, user_agent: str = "CVPR-Explorer"):
        self.year = year
        self.delay = delay
        self.user_agent = user_agent
        self.headers = {'User-Agent': user_agent}
        self.cvpr_base_url = "https://openaccess.thecvf.com"
        self.cvpr_url = f"{self.cvpr_base_url}/CVPR{self.year}"
        
    def get_paged_papers(self, soup: BeautifulSoup, base_url: str) -> List:
        """Get paper elements from either all papers page or individual day pages."""
        all_papers = False
        page_links = []
        
        for page in soup.findAll('dd'):
            page_link = page.findAll("a")[0].get('href')
            if "all" in page_link:
                all_papers = page_link
                break
            else:
                page_links.append(page_link)
        
        if all_papers:
            url = urljoin(base_url, all_papers)
            html_text = requests.get(url).text
            page_soup = BeautifulSoup(html_text, 'html.parser')
            return page_soup.findAll('dt', {'class': 'ptitle'})
        else:
            paper_elms = []
            for page_link in page_links:
                url = urljoin(base_url, page_link)
                html_text = requests.get(url).text
                page_soup = BeautifulSoup(html_text, 'html.parser')
                paper_elms.extend(page_soup.findAll('dt', {'class': 'ptitle'}))
                time.sleep(self.delay)
            return paper_elms

    def get_paper_details(self, paper_elm) -> Optional[Dict]:
        """Extract details for a single paper."""
        try:
            paper_anchor = paper_elm.findAll('a')[0]
            paper_info_link = urljoin(self.cvpr_base_url, paper_anchor.get('href'))
            paper_title = paper_anchor.contents[0]

            html_text = requests.get(paper_info_link).text
            soup = BeautifulSoup(html_text, "html.parser")

            paper_abstract = soup.find('div', {'id': 'abstract'}).contents[0]
            paper_link = soup.findAll("a", string="pdf")[0].get('href')
            paper_link = urljoin(self.cvpr_base_url, paper_link)

            # Get authors
            authors = []
            author_div = soup.find('div', {'id': 'authors'})
            if author_div:
                author_links = author_div.find_all('a')
                authors = [author.text.strip() for author in author_links]

            return {
                "title": paper_title,
                "info_link": paper_info_link,
                "pdf_link": paper_link,
                "abstract": paper_abstract,
                "authors": authors,
                "year": self.year,
                "conference": "CVPR"
            }

        except Exception as e:
            logger.error(f"Error processing paper: {str(e)}")
            return None

    async def scrape_papers(self) -> Dict:
        """Scrape all papers from the specified CVPR year."""
        try:
            logger.info(f"Getting the publication list for CVPR {self.year}")
            html_text = requests.get(self.cvpr_url).text
            soup = BeautifulSoup(html_text, 'html.parser')

            # Check if papers are split by days
            first_dd = soup.select_one('dd')
            if first_dd and "Day 1: " in first_dd.text:
                paper_elms = self.get_paged_papers(soup, self.cvpr_base_url)
            else:
                paper_elms = soup.findAll('dt', {'class': 'ptitle'})
            
            logger.info(f"{len(paper_elms)} publications found.")
            logger.info("Compiling library...")

            papers = {}
            for i, paper_elm in enumerate(tqdm(paper_elms)):
                paper_details = self.get_paper_details(paper_elm)
                if paper_details:
                    papers[i] = paper_details
                time.sleep(self.delay)

            return papers

        except Exception as e:
            logger.error(f"Error scraping CVPR papers: {str(e)}")
            return {}

    def save_library(self, papers: Dict, output_dir: str = "./libraries"):
        """Save the scraped papers to a JSON file."""
        try:
            if not os.path.isdir(output_dir):
                os.makedirs(output_dir)

            output_file = os.path.join(output_dir, f"cvpr{self.year}.json")
            with open(output_file, "w") as f:
                json.dump(papers, f, indent=4)
            
            logger.info(f"Library saved to {output_file}")
            return output_file
        except Exception as e:
            logger.error(f"Error saving library: {str(e)}")
            return None
