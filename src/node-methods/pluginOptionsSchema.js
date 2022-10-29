import Cosmic from 'cosmicjs';

const pluginOptionsSchema = ({ Joi }) => Joi.object({
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
  // Test that the bucket slug and read key are valid & able to connect to Cosmic.
  const api = Cosmic();
  const bucket = api.bucket({
    slug: bucketSlug,
    read_key: readKey,
  });
  try {
    await bucket.getObjectTypes();
  } catch (error) {
    // TODO: If we wanted to provide specific error instructions, we could
    // check the error code to return a more helpful message.
    throw new Error(`There was an issue connecting to Cosmic.\nStatus Code: ${error.status}\nMessage: ${error.message}`);
  }
});

export default pluginOptionsSchema;
