import fs from 'fs-extra';
import mime from 'mime-types';
import { fetchRemoteFile } from 'gatsby-core-utils/dist/fetch-remote-file';
import { md5 } from 'hash-wasm';

// ---------
// TODO: This function could be rewritten to use imgix's BlurHash feature
// We'd have to add in sharp directly, but it may be more performant than the gatsby method
// Imgix BlurHash: https://docs.imgix.com/apis/rendering/format/fm#blurhash
// Convert to Base64 w/Sharp: https://github.com/woltapp/blurhash/issues/43#issuecomment-759112713
const fetchedBase64Images = {};
const inProgressBase64Images = {};
const getBase64Image = (imageURL, { cache }) => {
  if (!imageURL) return null;

  // Require the image to be coming from cosmic's imgix cdn
  if (!imageURL.startsWith('https://imgix.cosmicjs.com')) return null;

  // Check if we already have the base64 image
  if (fetchedBase64Images[imageURL]) return fetchedBase64Images[imageURL];
  // Check if we are already fetching the base64 image
  if (inProgressBase64Images[imageURL]) return inProgressBase64Images[imageURL];

  // Fetch the base64 image
  const fetchBase64 = async (url, directory) => {
    const ext = mime.extension(mime.lookup(imageURL.split('?')[0]));
    const cacheKey = await md5(`${url}__BASE64`);

    const path = await fetchRemoteFile({
      url,
      directory,
      ext,
      cacheKey,
    });

    const contents = await fs.readFile(path);
    const base64 = contents.toString('base64');
    return `data:image/${ext};base64,${base64}`;
  };

  // Add the promise to the inProgressBase64Images object
  const imagePromise = fetchBase64(imageURL, cache.directory);
  inProgressBase64Images[imageURL] = imagePromise;

  return imagePromise.then((result) => {
    fetchedBase64Images[imageURL] = result;
    delete inProgressBase64Images[imageURL];
    return result;
  });
};

export {
  fetchedBase64Images,
  inProgressBase64Images,
};

export default getBase64Image;
