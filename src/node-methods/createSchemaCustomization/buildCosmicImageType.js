import { getGatsbyImageFieldConfig } from 'gatsby-plugin-image/graphql-utils';
import resolveGatsbyImageData from './resolveGatsbyImageData';

const buildCosmicImageType = async (nodeAPIHelpers) => {
  const { schema } = nodeAPIHelpers;

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

  return imageType;
};

export default buildCosmicImageType;
