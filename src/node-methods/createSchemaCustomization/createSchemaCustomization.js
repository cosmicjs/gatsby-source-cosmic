import { formatObjectTypes } from '../../helpers';

const createSchemaCustomization = async (nodeAPIHelpers, options) => {
  console.log('createSchemaCustomization');
  const internalOptions = options;

  internalOptions.objectTypes = await formatObjectTypes(nodeAPIHelpers, internalOptions);
};

export default createSchemaCustomization;
