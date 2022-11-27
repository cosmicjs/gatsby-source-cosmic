import Cosmic from 'cosmicjs';
import async from 'async';
import { createCosmicFetch, calculateRemainingSkips } from './fetchObjectHelpers';

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
        // TODO: Improve error handling.
        reporter.panic(error);
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
            // TODO: Improve error handling.
            reporter.panic(error);
          }
          // this should never happen
          return null;
        });

        const remainingObjects = remainingResults.flatMap((result) => result.objects);
        objects = objects.concat(remainingObjects);
      }

      reporter.info(
        `Fetched ${objects.length} objects of type ${objectType.slug} in ${callCount} calls with limit ${objectType.limit}.`,
      );

      return {
        ...objectType,
        objects,
      };
    },
  );

  return fetchedObjects;
};

export default fetchObjects;
