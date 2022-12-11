import { formatObjectTypes, fetchObjects } from '../../helpers';
import createNodesForObjectType from './createNodesForObjectType';

const sourceNodes = async (lifecycleFunctions, options) => {
  // TODO: Add option logging for debugging mode.
  const internalOptions = options;

  internalOptions.objectTypes = await formatObjectTypes(lifecycleFunctions, internalOptions);

  // TODO: Add check for objectTypes.length > 0. Log warning if no object types are found.
  const objectsWithData = await fetchObjects(lifecycleFunctions, internalOptions);

  objectsWithData.forEach((objectType) => createNodesForObjectType(lifecycleFunctions, objectType));
};

export default sourceNodes;
