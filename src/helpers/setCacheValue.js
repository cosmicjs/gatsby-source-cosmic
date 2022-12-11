import getCacheID from './getCacheID';

const setCacheValue = async (nodeAPIHelpers, options, cacheItemSlug, value) => {
  const { cache } = nodeAPIHelpers;
  const cacheID = getCacheID(options, cacheItemSlug);
  await cache.set(cacheID, value);
};

export default setCacheValue;
