import { createNodeTypeSlug } from './createNodeHelpers';

// NOTE: If we add relationships to the object types, we may need to modify this function.
// TODO: Add media file node support.
const createNodesForObjectType = ({ createContentDigest, actions }, objectType) => {
  const { createNode } = actions;
  const { slug, objects } = objectType;

  for (let i = 0; i < objects.length; i += 1) {
    const object = objects[i];
    const nodeMetaData = {
      id: object.id,
      parent: null,
      children: [],
      internal: {
        type: createNodeTypeSlug(slug),
        mediaType: 'text/html',
        content: JSON.stringify(object),
        contentDigest: createContentDigest(object),
      },
    };
    createNode({ ...object, ...nodeMetaData });
  }
};

export default createNodesForObjectType;
