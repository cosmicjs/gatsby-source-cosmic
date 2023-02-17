# Development Notes
Using this for documenting notes, discoveries, and TODO's during development.

Most info here are things that I'm learning during research, but need to circle back on later.

## Improvements
  - [ ] Improve build logging using the [gatsby reporter](https://www.gatsbyjs.com/docs/reference/config-files/node-api-helpers/#GatsbyReporter)
    - What does `panicOnBuild` do?
    - Should see what `activityTimer` does UI wise in the CLI
      - same with `createProgress`
  - [x] Reformat the file structure
  - [ ] Look into if special support is needed for the markdown field type
    - https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-transformer-remark
    - Search markdown gatsby
  - [ ] Add experimental setting to replace empty strings with null while sourcing nodes.

## Gatsby Node Creation
  - The `touchNode` action seems like it would be something worth investigating for proper data caching. [Docs](https://www.gatsbyjs.com/docs/reference/config-files/actions/#touchNode), [Example Use](https://github.com/gatsbyjs/gatsby/blob/dc3d741260e057540ed1294558df78aa63126a8b/packages/gatsby-source-contentful/src/source-nodes.js#L62-L77)
    - The example may be doing this for the development server?

## Gatsby Image Functionality
  - This article [here](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/adding-gatsby-image-support/) explains the basics of adding Gatbsy Image support to a plugin.
  - We may want to allow the plugin to run in different image modes? (maybe)
    - possible image modes
      - Raw
      - Imgix
      - local