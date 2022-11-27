import Cosmic from 'cosmicjs';
import async from 'async';
import { createCosmicFetch, calculateRemainingSkips, handleCosmicError } from './fetchObjectHelpers';

const fetchObjects = async (
  { reporter },
  {
    bucketSlug, readKey, objectTypes,
  },
) => {
  const api = Cosmic();
  const bucket = api.bucket({
    slug: bucketSlug,
    read_key: readKey,
  });

  const fetchedObjects = await async.mapSeries(
    objectTypes,
    async (objectType) => {
      const cosmicFetch = createCosmicFetch(objectType, bucket);
      let objects = [];
      let initialCallResults = {};

      // Make first call to fetch objects.
      try {
        initialCallResults = await cosmicFetch(0);
        objects = objects.concat(initialCallResults.objects);
      } catch (error) {
        handleCosmicError(error, reporter, objectType);
      }

      // TODO: Add debug mode logging.
      let callCount = 1;
      if (initialCallResults.total > objectType.limit) {
        // If there are more objects than the limit, fetch them all.
        const skipArray = calculateRemainingSkips(initialCallResults.total, objectType.limit);
        const remainingResults = await async.mapSeries(skipArray, async (skip) => {
          try {
            const result = await cosmicFetch(skip);
            callCount += 1;
            return result;
          } catch (error) {
            handleCosmicError(error, reporter, objectType);
          }
          // this should never happen
          return null;
        });

        const remainingObjects = remainingResults.flatMap((result) => result.objects);
        objects = objects.concat(remainingObjects);
      }

      const message = `Fetched ${objects.length} objects of type ${objectType.slug} in ${callCount} call(s) with limit ${objectType.limit}.`;

      if (objects.length === 0) reporter.warn(message);
      else reporter.info(message);

      return {
        ...objectType,
        objects,
      };
    },
  );

  return fetchedObjects;
};

export default fetchObjects;
