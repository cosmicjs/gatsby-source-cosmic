import { formatObjectTypes, fetchObjects } from '../helpers';

const sourceNodes = async (node, options) => {
  console.log('options', options);
  const internalOptions = options;

  internalOptions.objectTypes = await formatObjectTypes(node, internalOptions);

  const objectsWithData = await fetchObjects(node, internalOptions);
};

export default sourceNodes;
