import mime from 'mime-types';
import probe from 'probe-image-size';
import { generateImageData } from 'gatsby-plugin-image';
import getBase64Image from './getBase64Image';
import getDominantColor from './getDominantColor';
import generateImageSource from './generateImageSource';

let hasShownTraceSVGWarning = false;
const resolveGatsbyImageData = async (image, options, context, info, nodeAPIHelpers) => {
  const { reporter } = nodeAPIHelpers;
  // Will need to check if file node is actually an image

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
      reporter.warn(
        '"TRACED_SVG" placeholder argument value is no longer supported, using "DOMINANT_COLOR". See https://gatsby.dev/tracesvg-removal/',
      );
      hasShownTraceSVGWarning = true;
    }
    imageDataArgs.options.placeholder = 'dominantColor';
  }

  if (options.placeholder === 'blurred') {
    const lowRes = generateImageSource(filename, 20);
    imageDataArgs.placeholderURL = await getBase64Image(lowRes.src, nodeAPIHelpers);
  }

  if (options.placeholder === 'dominantColor') {
    const medRes = generateImageSource(filename, 255);
    imageDataArgs.backgroundColor = await getDominantColor(medRes.src, nodeAPIHelpers);
  }

  const imageData = generateImageData(imageDataArgs);

  // console.log('imageData', JSON.stringify(imageData, null, 2));

  return imageData;
};

export default resolveGatsbyImageData;
