import Cosmic from 'cosmicjs';
import async from 'async';

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
      try {
        // TODO: Add support for pagination fetching.
        const { objects } = await bucket.objects
          .find({
            // TODO: Add support for querying from object type config.
            type: objectType.slug,
          })
          .limit(objectType.limit);
        reporter.info(`Fetched ${objects.length} objects for type ${objectType.slug}.`);
        console.log('objects', objects);
        return {
          ...objectType,
          objects,
        };
      } catch (error) {
        // TODO: Improve error handling & logging.
        reporter.error(`Error fetching ${objectType.slug}: `, error);
        return [];
      }
    },
  );

  return fetchedObjects;
};

export default fetchObjects;
