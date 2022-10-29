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
import { pluginOptionsSchema } from './node-methods';

// TODO: Commenting this out for now,
// we should add this in though once error logging levels are added.
// exports.onPreInit = () => console.log('Loaded gatsby-starter-plugin');

export {
  pluginOptionsSchema,
};
