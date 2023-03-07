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
