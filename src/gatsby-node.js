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
const Cosmic = require('cosmicjs');

// TODO: Commenting this out for now,
// we should add this in though once error logging levels are added.
// exports.onPreInit = () => console.log('Loaded gatsby-starter-plugin');

exports.pluginOptionsSchema = ({ Joi }) => Joi.object({
  bucketSlug: Joi.string()
    .required()
    .description('Your Cosmic bucket slug.'),
  readKey: Joi.string()
    .required()
    .description('Your Cosmic API read key.'),
  objectTypes: Joi.array()
    .items(Joi.string())
    // TODO: reword after adding object type support
    .description('The type slugs of the object types you want to fetch from your Cosmic Bucket.'),
  limit: Joi.number()
    .default(500)
    .description('The number of objects to fetch per request.'),
}).external(async ({ bucketSlug, readKey }) => {
  const api = Cosmic();
  const bucket = api.bucket({
    slug: bucketSlug,
    read_key: readKey,
  });
  try {
    await bucket.getObjects();
  } catch (error) {
    // TODO: If we wanted to provide specific error instructions, we could
    // check the error code to return a more helpful message.
    throw new Error(`There was an issue connecting to Cosmic.\nStatus Code: ${error.status}\nMessage: ${error.message}`);
  }
});
