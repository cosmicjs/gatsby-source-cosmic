import { createNodeTypeSlug } from './createNodeHelpers';

// NOTE: If we add relationships to the object types, we may need to modify this function.
// TODO: Add media file node support.
const createNodesForObjectType = ({ createContentDigest, actions, reporter }, objectType) => {
  const { createNode } = actions;
  const { slug, objects } = objectType;

  for (let i = 0; i < objects.length; i += 1) {
    const object = objects[i];

    if (!object.id || /^\s*$/.test(object.id)) {
      reporter.panic(`ERROR: An object of type ${slug} has no id.\n\nPlease check your gatsby-config.js file, if you're querying for specific props the id prop is required.`);
      return;
    }

    const nodeMetaData = {
      id: object.id,
      parent: null,
      children: [],
      internal: {
        type: createNodeTypeSlug(slug),
        mediaType: 'text/html',
        contentDigest: createContentDigest(object),
      },
    };
    createNode({ ...object, ...nodeMetaData });
  }
};

export default createNodesForObjectType;
