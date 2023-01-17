/* eslint-disable no-await-in-loop */
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */
// You can delete this file if you're not using it

/**
 * You can uncomment the following line to verify that
 * your plugin is being loaded in your site.
 *
 * See: https://www.gatsbyjs.com/docs/creating-a-local-plugin/#developing-a-local-plugin-that-is-outside-your-project
 */
import _ from 'lodash';
import { createRemoteFileNode } from 'gatsby-source-filesystem';
import findImageFieldPaths from './node-methods/sourceNodes/findImageFieldPaths';
import {
  createSchemaCustomization,
  pluginOptionsSchema,
  sourceNodes,
} from './node-methods';
// TODO: Commenting this out for now,
// we should add this in though once error logging levels are added.
// exports.onPreInit = () => console.log('Loaded gatsby-source-cosmic');

// const onCreateNode = async ({ node, actions, createNodeId, getCache }) => {
//   if (_.startsWith(node.internal.type, 'Cosmicjs')) {
//     console.log('node', node.internal.type);
//     const imageFieldPaths = findImageFieldPaths(node);
//     const imageFieldValues = _.at(node, imageFieldPaths);

//     for (let i = 0; i < imageFieldValues.length; i += 1) {
//       const imageFieldValue = imageFieldValues[i];

//       const fileNode = await createRemoteFileNode({
//         url: imageFieldValue.imgix_url,
//         parentNodeId: node.id,
//         createNode: actions.createNode,
//         createNodeId,
//         getCache,
//       });

//       if (fileNode) {
//         actions.createNodeField({ node, name: `localFile`, value: fileNode.url })
//       }
//     }
//   }
// };

export {
  createSchemaCustomization,
  pluginOptionsSchema,
  sourceNodes,
  // onCreateNode,
};
