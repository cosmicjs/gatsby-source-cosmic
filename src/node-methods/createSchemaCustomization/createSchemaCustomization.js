import fs from 'fs';
import { formatObjectTypes } from '../../helpers';
import createSchemaObjectForType from './createSchemaObjectForType';
import buildCosmicImageType from './buildCosmicImageType';

const createSchemaCustomization = async (nodeAPIHelpers, options) => {
  const internalOptions = options;

  internalOptions.objectTypes = await formatObjectTypes(nodeAPIHelpers, internalOptions);

  // Leaving off here - Need to figure out how to create the schema customizations to attach
  // our image processing resolvers to the image fields.
  // console.log(JSON.stringify(internalOptions.objectTypes, null, 2));

  const { actions, schema } = nodeAPIHelpers;
  const { createTypes } = actions;

  // iterate over the object types and create the typeDefs
  const typeDefs = internalOptions.objectTypes.flatMap((objectType) => {
    const objectTypeSchemas = createSchemaObjectForType(objectType);
    const builtSchemas = objectTypeSchemas.map((type) => schema.buildObjectType(type));
    return builtSchemas;
  });

  const imageType = await buildCosmicImageType(nodeAPIHelpers);

  typeDefs.push(imageType);
  createTypes(typeDefs);

  // e file ./typeDefs.txt if it exists
  if (fs.existsSync('./typeDefs.txt')) {
    fs.unlinkSync('./typeDefs.txt');
  }
  actions.printTypeDefinitions({ path: './typeDefs.txt' });
};

export default createSchemaCustomization;
