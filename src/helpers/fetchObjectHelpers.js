// Separating the direct call to cosmicjs to make testing easier.
const createCosmicFetch = (objectType, bucket) => async (skip = 0) => {
  const result = await bucket.objects
    .find({
      // TODO: Add support for querying from object type config.
      type: objectType.slug,
    })
    .limit(objectType.limit)
    .skip(skip);

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
