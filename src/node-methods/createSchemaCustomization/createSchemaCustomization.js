import { formatObjectTypes } from '../../helpers';

const createSchemaCustomization = async (nodeAPIHelpers, options) => {
  const internalOptions = options;

  internalOptions.objectTypes = await formatObjectTypes(nodeAPIHelpers, internalOptions);

  // Leaving off here - Need to figure out how to create the schema customizations to attach
  // our image processing resolvers to the image fields.
  console.log(JSON.stringify(internalOptions.objectTypes, null, 2));
};

export default createSchemaCustomization;
