/* eslint-disable camelcase */
import axios from 'axios';

const fetchedDomColorImages = {};
const getDominantColor = async (imageURL, { reporter }) => {
  const defaultColor = 'rgba(0,0,0,0.5)';
  if (!imageURL) return defaultColor;

  // Require the image to be coming from cosmic's imgix cdn
  if (!imageURL.startsWith('https://imgix.cosmicjs.com')) return defaultColor;

  // Check if we already have the color return it
  if (fetchedDomColorImages[imageURL]) return fetchedDomColorImages[imageURL];

  // Attempt to get the dominant color from imgix
  // TODO: We could also expose which color to use as a query setting
  // https://docs.imgix.com/apis/rendering/color-palette/palette
  try {
    const results = await axios.get(`${imageURL}&palette=json`);
    const { dominant_colors } = results.data;
    if (dominant_colors && dominant_colors.vibrant_dark && dominant_colors.vibrant_dark.hex) {
      fetchedDomColorImages[imageURL] = dominant_colors.vibrant_dark.hex;
      return dominant_colors.vibrant_dark.hex;
    }
  } catch (e) {
    reporter.warn(`Could not get dominant color from imgix for image: ${imageURL}`);
  }

  return defaultColor;
};

export {
  fetchedDomColorImages,
};

export default getDominantColor;
