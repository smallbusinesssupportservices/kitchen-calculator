import axios from 'axios';
import * as cheerio from 'cheerio';

async function getProductImage(url) {
  try {
    console.log(`Fetching URL: ${url}`);

    // Adding a timeout and custom headers for better request handling
    const response = await axios.get(url, {
      headers: {
        Accept: 'text/html',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        Connection: 'keep-alive', // Prevent connection closure
      },
      timeout: 15000, // Increase timeout
    });

    console.log(`Received status: ${response.status}`);

    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const html = response.data;
    const $ = cheerio.load(html); // Use cheerio to load the HTML

    // Look for all <img> tags in the page
    const images = $('img');
    let foundImage = null;

    images.each((i, img) => {
      const src = $(img).attr('src');
      const hiddenAttr = $(img).attr('hidden');
      const isVisible = !hiddenAttr; // Exclude hidden images

      // If image has a source and isn't hidden, accept it (more flexible than previous checks)
      if (src && isVisible) {
        foundImage = src;
        return false; // Break the loop once we find a valid image
      }
    });

    if (foundImage) {
      console.log('Product Image URL:', foundImage);
      return foundImage;
    } else {
      console.log('No image found.');
      throw new Error('No product image found');
    }
  } catch (error) {
    console.error('Error fetching product image:', error);
    return null;
  }
}

// Example usage:
getProductImage(
  'https://www.lowes.com/pd/Metabo-HPT-was-Hitachi-Power-Tools-1-4-in-Kink-Free-50-ft-Polyurethane-Air-Hose/1001098260'
)
  .then((imgUrl) => console.log('Product Image URL:', imgUrl))
  .catch((error) => console.error('Failed to retrieve image:', error));
