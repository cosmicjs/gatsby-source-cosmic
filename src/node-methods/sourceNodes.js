import { checkObjectTypes, fetchObjects } from '../helpers';

const sourceNodes = async (node, options) => {
  console.log('options', options);
  const internalOptions = options;

  internalOptions.objectTypes = await checkObjectTypes(node, internalOptions);
  // TODO: WIP
  const objects = await fetchObjects(node, internalOptions);

  console.log('objectTypes', internalOptions);
};

export default sourceNodes;
