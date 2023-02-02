import getCacheID from './getCacheID';

const attemptCacheRetrieve = async (nodeAPIHelpers, options, cacheItemSlug) => {
  const { cache } = nodeAPIHelpers;
  const cacheID = getCacheID(options, cacheItemSlug);
  const cachedData = await cache.get(cacheID);
  return cachedData;
};

export default attemptCacheRetrieve;
