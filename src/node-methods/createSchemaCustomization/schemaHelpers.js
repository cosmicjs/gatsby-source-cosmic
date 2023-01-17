import fs from 'fs-extra';
import _ from 'lodash';
import mime from 'mime-types';
import { fetchRemoteFile } from 'gatsby-core-utils';
import { md5 } from 'hash-wasm';
import probe from 'probe-image-size';
// import { addRemoteFilePolyfillInterface } from 'gatsby-plugin-utils/polyfill-remote-file';
import { generateImageData, getLowResolutionImageURL } from 'gatsby-plugin-image';
import { getGatsbyImageFieldConfig, getGatsbyImageResolver } from 'gatsby-plugin-image/graphql-utils';
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

  sourceObject.src = src;
  return sourceObject;
};

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
    const cacheKey = await md5(imageURL);

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
        async (...args) => resolveGatsbyImageData(...args, { cache: nodeAPIHelpers.cache }),
        {
          quality: 'String',
        },
      ),
    },
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
