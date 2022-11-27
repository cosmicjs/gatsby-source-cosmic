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
      resolve: require.resolve(`../dist`),
      options: {
        bucketSlug: process.env.COSMIC_BUCKET_SLUG,
        readKey: process.env.COSMIC_READ_KEY,
        limit: 20,
        objectTypes: [
          {
            slug: 'pages',
            limit: 2,
            depth: 1,
            use_cache: false,
            sort: '-created_at',
            status: 'published',
            props: 'id,slug,title,content',
          },
          'authors',
          'badType',
        ],
      }
    },
  ],
}
