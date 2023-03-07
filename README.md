# Gatsby Source for Cosmic
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](https://commitizen.github.io/cz-cli/)

Source plugin for fetching data into [Gatsby](https://www.gatsbyjs.org) from [Cosmic](https://cosmicjs.com). Cosmic offers a [Headless CMS](https://cosmicjs.com/headless-cms) for your Gatsby website.

## Quickstart Guide

### 1. Install the plugin
```
npm install --save @cosmicjs/gatsby-source-cosmic
```

### 2. Configure your plugin
In order to configure this plugin you will need your Cosmic bucket slug & corresponding read key. You can find these by [logging into Cosmic](https://app.cosmicjs.com/login) and going to `Your Bucket > Settings > API Access`.

In your `gatsby-config.js` install the plugin:
```
plugins: [
  {
    resolve: `@cosmicjs/gatsby-source-cosmic`,
    options: {
      bucketSlug: process.env.COSMIC_BUCKET_SLUG,
      readKey: process.env.COSMIC_READ_KEY,
    }
  },
],
```
This configuration will automatically detect the object type in your bucket and pull down all published objects into your site's GraphQL database. If you'd like to only fetch a specific set of object types you can do that by specifying their slugs on the plugin config.
```
...
options: {
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  objectTypes: ['blog-posts', 'authors'],
}
...
```

This will allow you to query your Cosmic content data from within Gatsby. For example if you have an object type called `Blog Post` a query might look something like this:
```
// src/templates/blog-post.js

export const query = graphql`
  query {
    allCosmicjsBlogPosts {
      edges {
        node {
          content
          title
        }
      }
    }
  }
`
```
or filter to a specific post like this:
```
// src/pages/about.js

export const query = graphql`
  query ($slug: String) {
    cosmicjsBlogPosts(slug: {eq: $slug}) {
      edges {
        node {
          content
          title
        }
      }
    }
  }
`
```
You can read more about querying data, template pages, and other queries in the [Gatsby Docs](https://www.gatsbyjs.com/docs/how-to/querying-data/).

## Advanced configuration
This plugin offers a number of other features to allow you to control what data is fetched from your bucket.

### Global Config Options
These options can be specified at the top level of your config.

> **Note**: If a matching property is specified on the object level the object level configuration value will be used.

Property | Required | Type | Default | Description
--- | --- | --- | --- | ---
`bucketSlug` | Required | String | n/a | The slug of the cosmic bucket that you want to pull data from. Best practice is to store this in an ENV variable using [dotenv](https://github.com/motdotla/dotenv).
`readKey` | Required | String | n/a | The read key of the cosmic bucket that you want to pull data from. Best practice is to store this in an ENV variable using [dotenv](https://github.com/motdotla/dotenv). Access this read key in your bucket under `settings > api access`
`limit` | Optional | Number | `500` | Controls the default number of objects that are fetched per request. This can be useful if you have especially large objects and are running into issue with the API timing out requests.
`depth` | Optional | Number | `0` | Controls the default depth of the query into object relations.
`use_cache` | Optional | Bool | `true` | A false value disables the use of the Cosmic API data cache. Please reference the docs [here](https://docs.cosmicjs.com/api-reference/objects#get-objects) for more information.
`sort` | Optional | Enum (`created_at, -created_at, modified_at, -modified_at, random, order`) | `order` | The order that objects are fetched and inserted into the database. The default (order) allows you to control the order of items from the Cosmic UI.
`status` | Optional| Enum (`published, any`) | `published` | The publish status of objects pulled from the API. Published will only pull published items while any will pull published & draft objects.
`objectTypes` | optional | [String \| Object] | n/a | An array of object types that you would like to pull from your Cosmic bucket. This can be an array of object  type slugs or object configs.

### Object Type Config Options
Object type config options allow you to more granularly configure how data is pulled from your Cosmic bucket. **Properties set on object types will override options set at the global config level.**

Object type configs can also be used with a combination of slug strings and objects. For example:
```
options: {
  //...
  objectTypes: [
    'blog-posts', 
    {
      slug: 'authors'
      // other options...  
    },
  ],
}
```

Property | Required | Type | Description
--- | --- | --- | ---
`slug` | Required | String | The slug of the object type for this config object.
`query` | Optional | Object | The query for this object. Learn more about Cosmic's query syntax in our [query documentation](https://docs.cosmicjs.com/api-reference/queries). **IMPORTANT**: Do not include the `type` property in your query. That is handled by the plugin and via the slug property.
`props` | Optional | String | The properties of the object that you want to be returned by the API. The properties should be formatted as a comma separated string. For example: `props: 'id,title,metadata.author'`. Please reference the [Cosmic API docs](https://docs.cosmicjs.com/api-reference/objects#get-objects) for more details. **Note**: When using this property the `id` prop must be included.
`limit` | Optional | Number | Controls the default number of objects that are fetched per request. This can be useful if you have especially large objects and are running into issue with the API timing out requests.
`depth` | Optional | Number | Controls the default depth of the query into object relations. **Note**: This may be removed in an upgrade to the version 3 API
`use_cache` | Optional | Bool | A false value disables the use of the Cosmic API data cache. Please reference the docs [here](https://docs.cosmicjs.com/api-reference/objects#get-objects) for more information.
`sort` | Optional | Enum (`created_at, -created_at, modified_at, -modified_at, random, order`) | The order that objects are fetched and inserted into the database. The default (order) allows you to control the order of items from the Cosmic UI.
`status` | Optional| Enum (`published, any`) | The publish status of objects pulled from the API. Published will only pull published items while any will pull published & draft objects.

### Full Object Config Example
> Please note any values used here are just to demonstrate the properties usage.
```
plugins: [
  {
    resolve: `gatsby-source-cosmic`,
    options: {
      bucketSlug: process.env.COSMIC_BUCKET_SLUG,
      readKey: process.env.COSMIC_READ_KEY,
      limit: 200,
      depth: 2,
      use_cache: true,
      sort: 'order',
      objectTypes: [
        'blog-posts',
        'customer-announcements',
        {
          slug: 'authors',
          limit: 5,          // Overrides global limit
          depth: 1,          // Overrides global depth
          use_cache: true,   // Overrides global use_cache
          sort: 'random',    // Overrides global sort
        },
        {
          slug: 'products',
          query: {
            'metadata.category': {
              '$in': ['Clothing','Food'],
            },
          },
          props: 'id,title,metadata.price,metadata.image'
        },
      ]
    }
  },
],
```

## Querying for Images
> **Note**: `gatsby-plugin-image` (^2.25.0) is a required peer dependency to use these features. 

Image metadata fields create 3 different queryable fields in your graphql schema. Here's what those fields would look like in a query:
```
// src/pages/about.js

export const query = graphql`
  query ($slug: String) {
    cosmicjsBlogPosts(slug: {eq: $slug}) {
      edges {
        node {
          metadata {
            image {
              gatsbyImageData
              imgix_url
              url
            }
          }
        }
      }
    }
  }
`
```
### Image URLs
The two image URL properties can be used directly just like any other image resource URLs. However the `imgix_url` property is served by Cosmic's imgix CDN. This URL can be queried with a variety of rendering parameters, please see the [imgix Rendering API](https://docs.imgix.com/apis/rendering) documentation for details.

### Gatsby Image Data
The `gatsbyImageData` property is attached to image metadata properties, and can be queried to produce an object that's directly usable with a `<GatsbyImage>` component. Here's an example using a static query:
```
import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

export default function Home() {
  const data = useStaticQuery(graphql`
    query {
      cosmicjsImagePages(slug: {eq: "test-image-page"}) {
        slug
        metadata {
          image_level_0 {
            gatsbyImageData(
              formats: JPG,
              placeholder: DOMINANT_COLOR
            )
          }
        }
      }
    }
  `)

  const image = getImage(data.cosmicjsImagePages.metadata.image_level_0.gatsbyImageData)

  return (
    <div>
      <h1>Hello world!</h1>
      <GatsbyImage image={image} alt="Test image" />
    </div>
  )
}
```
For more details on how to query gatsby image data please see the [Gatsby Image plugin documentation](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image).

## Starters
TODO

---
## Plugin Development
Instructions to install this codebase locally.
  1. `git clone https://github.com/cosmicjs/gatsby-source-cosmic.git`
  2. `cd gatsby-source-cosmic`
  3. `npm install`
      - **Important**: You must be using Node Version 18.13.0 
  4. `cd example-site`
  5. `npm install`
### Commands
Action | Command
--- | ---
Run Linter | `npm run lint`
Auto Fix Linter Issues | `npm run lint.fix`
Run Tests | `npm run test`
Develop w/Hot Reload | `npm run watch`
Build Project | `npm run build`

### Setting up plugin hot(ish) reload
If you'd like to use this project locally you can use local file resolution to test out modifications to this project on your local gatsby site.

Instructions:
  1. Install this codebase with the instructions above.
  2. In your (local) gatsby site add the plugin config with a local file resolution to the root of this plugin's folder (See example below).
```
 {
    // Using local plugin resolution for testing
    resolve: require.resolve(`../gatsby-source-cosmic`),
    options: {
      bucketSlug: process.env.COSMIC_BUCKET_SLUG,
      readKey: process.env.COSMIC_READ_KEY,
    }
  },
```
  3. Open up a terminal window and run either the build or watch commands to bundle the library.
  4. In another terminal window run `gatsby develop` or `npm run develop` to start your Gatsby Dev Server.

> **Note**: You will need to re-start the Gatsby Dev Server in order to load the changes you make to the plugin. Gatsby does not re-run it's node lifecycle on changes to the underlying plugin code.
