// Separating the direct call to cosmicjs to make testing easier.
const createCosmicFetch = (objectType, bucket) => async (skip = 0) => {
  let findConfig = {
    type: objectType.slug,
  };

  // Create the find config.
  if (objectType.query) {
    findConfig = {
      ...findConfig,
      ...objectType.query,
    };
  }
  const chainRequest = bucket.objects.find(findConfig);

  if (objectType.props) chainRequest.props(objectType.props);
  if (objectType.limit) chainRequest.limit(objectType.limit);
  if (objectType.depth) chainRequest.depth(objectType.depth);
  if (objectType.use_cache) chainRequest.useCache(objectType.use_cache);
  if (objectType.sort) chainRequest.sort(objectType.sort);
  if (objectType.status) chainRequest.status(objectType.status);

  const result = await chainRequest.skip(skip);

  return result;
};

const calculateRemainingSkips = (total, limit) => {
  const skipArray = [];
  let skip = limit;
  while (skip < total) {
    skipArray.push(skip);
    skip += limit;
  }
  return skipArray;
};

export {
  calculateRemainingSkips,
  createCosmicFetch,
};
