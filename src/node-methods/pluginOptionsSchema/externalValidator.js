import { createBucketClient } from '@cosmicjs/sdk';

const externalValidator = async ({ bucketSlug, readKey }) => {
  // Test that the bucket slug and read key are valid & able to connect to Cosmic.
  const bucket = createBucketClient({
    bucketSlug,
    readKey,
  });
  try {
    await bucket.objectTypes.find();
  } catch (error) {
    // check the error code to return a more helpful message.
    throw new Error(`There was an issue connecting to Cosmic.\nStatus Code: ${error.status}\nMessage: ${error.message}`);
  }
};

export default externalValidator;
