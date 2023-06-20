import attemptCacheRetrieve from './attemptCacheRetrieve';
import { CacheSlug } from '../constants';
import setCacheValue from './setCacheValue';

const fetchObjectTypes = async (nodeAPIHelpers, options, bucket) => {
  let objectTypes;

  if (process.env.GATSBY_WORKER_ID) {
    objectTypes = await attemptCacheRetrieve(nodeAPIHelpers, options, CacheSlug.forObjectTypes);
  }

  if (!Array.isArray(objectTypes)) {
    const results = await bucket.objectTypes.find();
    objectTypes = results.object_types;
    if (process.env.GATSBY_WORKER_ID) {
      await setCacheValue(nodeAPIHelpers, options, CacheSlug.forObjectTypes, objectTypes);
    }
  }

  return objectTypes;
};

export default fetchObjectTypes;
