import { CacheSlug } from '../../constants';
import {
  deleteCacheItem,
  formatObjectTypes,
  fetchObjects,
} from '../../helpers';
import createNodesForObjectType from './createNodesForObjectType';

const sourceNodes = async (nodeAPIHelpers, options) => {
  // TODO: Add option logging for debugging mode.
  const internalOptions = options;

  internalOptions.objectTypes = await formatObjectTypes(nodeAPIHelpers, internalOptions);

  // TODO: Add check for objectTypes.length > 0. Log warning if no object types are found.
  const objectsWithData = await fetchObjects(nodeAPIHelpers, internalOptions);

  objectsWithData.forEach((objectType) => createNodesForObjectType(nodeAPIHelpers, objectType));

  // Cleanup temp cache items.
  deleteCacheItem(nodeAPIHelpers, internalOptions, CacheSlug.forObjectTypes);
};

export default sourceNodes;
