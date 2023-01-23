/* eslint-disable camelcase */
import axios from 'axios';
import mime from 'mime-types';
import { fetchRemoteFile } from 'gatsby-core-utils';
import { md5 } from 'hash-wasm';
// eslint-disable-next-line import/no-extraneous-dependencies
import pluginSharp from 'gatsby-plugin-sharp';

const fetchedDomColorImages = {};
const inProgressDomColorImages = {};
const getDominantColor = async (imageURL, cache) => {
  const defaultColor = 'rgba(0,0,0,0.5)';
  if (!imageURL) return defaultColor;

  // Require the image to be coming from cosmic's imgix cdn
  if (!imageURL.startsWith('https://imgix.cosmicjs.com')) return defaultColor;

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
    console.warn('Could not get dominant color from imgix\nfalling back to sharp', e);
  }

  // Check if we already have the color return it
  if (fetchedDomColorImages[imageURL]) return fetchedDomColorImages[imageURL];
  // Check if we are already fetching the image and return the promise
  if (inProgressDomColorImages[imageURL]) return inProgressDomColorImages[imageURL];

  const fetchFile = async (url, directory) => {
    const ext = mime.extension(mime.lookup(url.split('?')[0]));
    const cacheKey = await md5(`${url}__DOMINANT_COLOR`);
    const path = await fetchRemoteFile({
      url,
      directory,
      ext,
      cacheKey,
    });
    return path;
  };

  const imagePromise = fetchFile(imageURL, cache.directory);
  inProgressDomColorImages[imageURL] = imagePromise;

  return imagePromise.then((path) => {
    // TODO: Has Own check
    const color = pluginSharp.getDominantColor(path);
    fetchedDomColorImages[imageURL] = color;
    delete inProgressDomColorImages[imageURL];
    return color;
  }).catch((e) => {
    // TODO: Use reporter instead of console.error
    console.error(
      '[gatsby-source-cosmic] Could not getDominantColor from image',
      e,
    );
    return 'rgba(0,0,0,0.5)';
  });
};

export {
  fetchedDomColorImages,
  inProgressDomColorImages,
};

export default getDominantColor;
