const axios = require("axios");
const cheerio = require("cheerio");

// Base URL for scraping
const BASE_URL = "https://www.flipkart.com/search?q=";
const MAX_PAGES = 10; // Set a maximum number of pages to scrape

// Function to scrape a single page
async function scrapePage(url, page = 1) {
  try {
    console.log(`Scraping page ${page}: ${url}`);

    // Send GET request to the page

    console.log("::: url is : ", url);
    const response = await axios.get(url, {
      headers: {
        Cookie:
          "T=cm3icj1aj001l0wefeq45clp0-BR1731651391819; K-ACTION=null; ud=1.Fi97cbXq2dHNohHvhwt5IQQQ-3lLgphcH2IIHH8S8b52as_x4uqoFL8paEZjNkOxAo1u1tR8TLxQ7tVBO6Qysdpm7J4v45WOTCORit0oRidhcjv0FM_SuU9dNo7PtSMwVo3TYFjGBn195_KuS_X5_w; vh=823; vw=1512; dpr=2; rt=null; at=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImQ2Yjk5NDViLWZmYTEtNGQ5ZC1iZDQyLTFkN2RmZTU4ZGNmYSJ9.eyJleHAiOjE3MzQyNzI0NzYsImlhdCI6MTczMjU0NDQ3NiwiaXNzIjoia2V2bGFyIiwianRpIjoiNjgzYTYyMzMtNzJiMi00MDNiLWE0MGQtYWY5MGNjODhiMjVmIiwidHlwZSI6IkFUIiwiZElkIjoiY20zaWNqMWFqMDAxbDB3ZWZlcTQ1Y2xwMC1CUjE3MzE2NTEzOTE4MTkiLCJrZXZJZCI6IlZJODcwMEI4Mjk5QTVDNEQxMzhENjY4NTY1NzdFRUIyOTMiLCJ0SWQiOiJtYXBpIiwidnMiOiJMTyIsInoiOiJIWUQiLCJtIjp0cnVlLCJnZW4iOjR9.9jns__37UrTrjE9jAPOJ7wLJNZq0Jl_1l9tBXdqSbSM; Network-Type=4g; qH=c06ea84a1e3dc3c6; AMCVS_17EB401053DAF4840A490D4C%40AdobeOrg=1; S=d1t14AT8MYT9CCnw/Hj8GOz0/P7u5f3zeguRzM0naq06GvR4ae0xg5VIoeWf+eb+iAfH8t+VjMH5U0Jb8ty4kLU+V3w==; vd=VI8700B8299A5C4D138D66856577EEB293-1731651395139-2.1732546391.1732544476.151631608; AMCV_17EB401053DAF4840A490D4C%40AdobeOrg=-227196251%7CMCIDTS%7C20053%7CMCMID%7C49682504822087725633800302034721100862%7CMCAAMLH-1732256192%7C12%7CMCAAMB-1732544476%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1732553592s%7CNONE%7CMCAID%7CNONE; SN=VI8700B8299A5C4D138D66856577EEB293.TOK85CBC33E577849A595E168B430A91D73.1732546394681.LO",
      },
    });

    console.log("::: response is : ", response);
    const $ = cheerio.load(response.data);

    console.log("::: $ is : ", $);

    // Array to store product data
    let products = [];

    // Extract product data (this is just an example; adjust as per the structure of Flipkart)
    $(".col-12-12").each((index, element) => {
      const title = $(element).find("KzDlHZ").text().trim();
      console.log("::: title is : ", title);
      const link =
        "https://www.flipkart.com" + $(element).find("a").attr("href");
      products.push({ title, link });
    });

    console.log(`Found ${products.length} products on page ${page}.`);

    // Check if there is a "Next" page and recursively scrape the next page if available
    const nextPageLink = $(".pagination-next a").attr("href");
    if (nextPageLink && page < MAX_PAGES) {
      const nextPageUrl = `https://www.flipkart.com${nextPageLink}`;
      await scrapePage(nextPageUrl, page + 1);
    }

    return products; // Return product data from this page
  } catch (error) {
    console.error(`Error scraping page ${page}: ${error.message}`);
    return [];
  }
}

// Start scraping from the first page with a sample search term
const searchQuery = "laptops"; // Example search query
const initialUrl = `${BASE_URL}${encodeURIComponent(searchQuery)}&page=1`;

scrapePage(initialUrl)
  .then((allProducts) => {
    console.log("All products scraped:", allProducts);
  })
  .catch((error) => {
    console.error("Error in scraping:", error.message);
  });
