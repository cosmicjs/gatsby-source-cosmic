import getCacheID from './getCacheID';

const deleteCacheItem = async (nodeAPIHelpers, options, cacheItemSlug) => {
  const { cache } = nodeAPIHelpers;
  const cacheID = getCacheID(options, cacheItemSlug);
  await cache.del(cacheID);
};

export default deleteCacheItem;
