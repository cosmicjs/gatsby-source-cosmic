/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */
require('dotenv').config();

module.exports = {
  /* Your site config here */
  plugins: [
    {
      // Using local plugin resolution for testing
      resolve: require.resolve(`../`),
      options: {
        bucketSlug: process.env.COSMIC_BUCKET_SLUG,
        readKey: process.env.COSMIC_READ_KEY,
        limit: 1,
        depth: 3,
        use_cache: false,
        objectTypes: [
          {
            slug: 'pages',
          },
          'authors',
          'image-pages',
        ],
      }
    },
  ],
}
