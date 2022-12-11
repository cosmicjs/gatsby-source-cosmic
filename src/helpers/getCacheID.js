const getCacheID = (
  { bucketSlug } /** Plugin Options */,
  cacheItemSlug,
) => {
  const env = process.env.NODE_ENV;
  return `${cacheItemSlug}-${env}-${bucketSlug}`;
};

export default getCacheID;
