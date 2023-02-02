// TODO: Ensure all image options are correctly mapped.
// TODO: Expose other imgix options.
const generateImageSource = (baseURL, width, height, format, fit, options) => {
  const sourceObject = {};
  const query = {};
  if (width) {
    query.w = width;
    sourceObject.width = width;
  }
  if (height) {
    query.h = height;
    sourceObject.height = height;
  }
  if (format) {
    query.fm = format;
    sourceObject.format = format;
  }

  if (options && options.quality) {
    query.q = options.quality;
    sourceObject.quality = options.quality;
  }

  const searchParams = new URLSearchParams(query);

  sourceObject.src = `${baseURL}?${searchParams.toString()}`;
  return sourceObject;
};

export default generateImageSource;
