// import fs from 'fs';
import { getGatsbyImageFieldConfig } from 'gatsby-plugin-image/graphql-utils';
import resolveGatsbyImageData from './resolveGatsbyImageData';
import { formatObjectTypes } from '../../helpers';
import createSchemaObjectForType from './createSchemaObjectForType';

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

  const imageType = schema.buildObjectType({
    name: 'CosmicjsImage',
    fields: {
      url: 'String!',
      imgix_url: 'String!',
      gatsbyImageData: getGatsbyImageFieldConfig(
        async (...args) => resolveGatsbyImageData(...args, nodeAPIHelpers),
        {
          quality: 'Int',
        },
      ),
    },
    interfaces: [],
  });

  typeDefs.push(imageType);
  createTypes(typeDefs);

  // Leaving this here for now - it's useful for debugging the typeDefs
  // if (fs.existsSync('./typeDefs.txt')) {
  //   fs.unlinkSync('./typeDefs.txt');
  // }
  // actions.printTypeDefinitions({ path: './typeDefs.txt' });
};

export default createSchemaCustomization;
