/* eslint-disable camelcase */
import fs from 'fs-extra';
import _ from 'lodash';
import mime from 'mime-types';
import { fetchRemoteFile } from 'gatsby-core-utils';
import { md5 } from 'hash-wasm';
import probe from 'probe-image-size';
import axios from 'axios';
// import { addRemoteFilePolyfillInterface } from 'gatsby-plugin-utils/polyfill-remote-file';
import { generateImageData, getLowResolutionImageURL } from 'gatsby-plugin-image';
import { getGatsbyImageFieldConfig, getGatsbyImageResolver } from 'gatsby-plugin-image/graphql-utils';
import pluginSharp from 'gatsby-plugin-sharp';
// import { getPluginOptions, doMergeDefaults } from 'gatsby-plugin-sharp/plugin-options';
import {
  capitalizeFirstLetter,
  createNodeTypeSlug,
} from '../../helpers';

// case 'parent':
//   childTypeSchema.fields[key] = `${typeSlug}${capitalizeFirstLetter(key)}`;
//   typesArray = getChildTypes(field.children, `${typeSlug}${capitalizeFirstLetter(key)}`, typesArray);
//   break;

// NOTES FOR TOMORROW
// - Let's only create the specific schema for the image nodes
// - Let's create a resolver for the image nodes
// - Add the correct pollyfill for the file node
// - Create specific type for cosmic images, then set the image fields to that type
// - I think things were being weird because I'm no longer creating the root type
//    - The root type should implement node
//    - The image should be infer = false

const generateImageSource = (baseURL, width, height, format, fit, options) => {
  console.log('generateImageSource', baseURL, width, height, format, fit, options);
  let src = `${baseURL}?`;
  const sourceObject = {};
  if (width) {
    src += `w=${width}`;
    sourceObject.width = width;
  }
  if (height) {
    src += `&h=${height}`;
    sourceObject.height = height;
  }
  if (format) {
    src += `&fm=${format}`;
    sourceObject.format = format;
  }

  if (options && options.quality) {
    src += `&q=${options.quality}`;
    sourceObject.quality = options.quality;
  }

  sourceObject.src = src;
  return sourceObject;
};

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
    console.log('results', results);
    const { dominant_colors } = results.data;
    console.log('dominant_colors', dominant_colors);
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

// ---------
// TODO: This function could be rewritten to use imgix's BlurHash feature
// We'd have to add in sharp directly, but it may be more performant than the gatsby method
// Imgix BlurHash: https://docs.imgix.com/apis/rendering/format/fm#blurhash
// Convert to Base64 w/Sharp: https://github.com/woltapp/blurhash/issues/43#issuecomment-759112713
const fetchedBase64Images = {};
const inProgressBase64Images = {};
const getBase64Image = (imageURL, cache) => {
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

let hasShownTraceSVGWarning = false;
const resolveGatsbyImageData = async (image, options, context, info, { cache }) => {
  // Will need to check if file node is actually an image
  console.log('resolveGatsbyImageData', image, options);

  const filename = image.imgix_url;

  const meta = await probe(filename);

  const sourceMetadata = {
    // format: mime.lookup(filename).split('/')[1] ,
    width: meta.width,
    height: meta.height,
    format: meta.type || mime.lookup(filename).split('/')[1],
  };

  const imageDataArgs = {
    ...options,
    pluginName: 'gatsby-source-cosmic',
    sourceMetadata,
    filename,
    generateImageSource,
    options,
  };

  if (options.placeholder === 'tracedSVG') {
    if (!hasShownTraceSVGWarning) {
      // TODO: Use reporter.warn instead if possible
      console.warn(
        '"TRACED_SVG" placeholder argument value is no longer supported, using "DOMINANT_COLOR". See https://gatsby.dev/tracesvg-removal/',
      );
      hasShownTraceSVGWarning = true;
    }
    imageDataArgs.options.placeholder = 'dominantColor';
  }

  if (options.placeholder === 'blurred') {
    const lowRes = generateImageSource(filename, 20);
    imageDataArgs.placeholderURL = await getBase64Image(lowRes.src, cache);
  }

  if (options.placeholder === 'dominantColor') {
    const medRes = generateImageSource(filename, 255);
    imageDataArgs.backgroundColor = await getDominantColor(medRes.src, cache);
  }

  const imageData = generateImageData(imageDataArgs);

  console.log('imageData', JSON.stringify(imageData, null, 2));

  return imageData;
};

const buildCosmicImageType = async (nodeAPIHelpers) => {
  const { schema } = nodeAPIHelpers;
  // const imageType = addRemoteFilePolyfillInterface(
  //   schema.buildObjectType({
  //     name: 'CosmicjsImage',
  //     fields: {
  //       url: 'String!',
  //       imgix_url: 'String!',
  //       mimeType: 'String!',
  //       gatsbyImageData: getGatsbyImageResolver(resolveGatsbyImageData),
  //       // localFile: {
  //       //   type: 'File',
  //       //   extensions: {
  //       //     link: {
  //       //       from: 'localFile',
  //       //       by: 'url',
  //       //     },
  //       //   },
  //       // },
  //     },
  //     interfaces: ['Node'],
  //     extensions: {
  //       infer: false,
  //     },
  //   }),
  //   nodeAPIHelpers,
  // );
  const imageType = schema.buildObjectType({
    name: 'CosmicjsImage',
    fields: {
      url: 'String!',
      imgix_url: 'String!',
      gatsbyImageData: getGatsbyImageFieldConfig(
        async (...args) => resolveGatsbyImageData(...args, nodeAPIHelpers),
        {
          quality: 'Int',
        },
      ),
    },
    interfaces: ['RemoteFile'],
  });

  return imageType;
};

const getChildTypes = (fields, typeSlug, types = []) => {
  const typesArray = _.cloneDeep(types);

  const childTypeSchema = {
    name: typeSlug,
    fields: {},
    extensions: {
      infer: true,
    },
  };

  typesArray.push(childTypeSchema);

  fields.forEach((field) => {
    const { key, type } = field;

    switch (type) {
      case 'file':
        childTypeSchema.fields[key] = 'CosmicjsImage';
        break;
      default:
        break;
    }
  });

  return typesArray;
};

const createSchemaObjectForType = (objectType) => {
  let types = [];
  const name = createNodeTypeSlug(objectType.slug);

  const objectSchema = {
    name,
    fields: {},
    interfaces: ['Node'],
    extensions: {
      // In the future when the Cosmic Schema is strongly typed, we can set this to false
      infer: true,
    },
  };

  types.push(objectSchema);

  types = types.concat(getChildTypes(objectType.metafields, `${name}Metadata`));
  return types;
};

export {
  buildCosmicImageType,
  capitalizeFirstLetter,
  getChildTypes,
};

export default createSchemaObjectForType;
