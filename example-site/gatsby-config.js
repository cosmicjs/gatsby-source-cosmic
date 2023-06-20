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
        /* 
          For this example, use the Simple Next.js Blog template
          https://www.cosmicjs.com/marketplace/templates/simple-nextjs-blog
          1. Install the template
          2. Go to Bucket > Settings > API Access to get the following values:
        */
        bucketSlug: process.env.COSMIC_BUCKET_SLUG,
        readKey: process.env.COSMIC_READ_KEY,
        limit: 1,
        depth: 3,
        use_cache: false,
        objectTypes: [
          'posts'
          // {
          //   slug: 'pages',
          // },
          // 'authors',
          // 'image-pages',
          // 'every-types',
          // 'dead-simple-image-pages',
        ],
      }
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
  ],
}
