import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

export default function Home() {
  const data = useStaticQuery(graphql`
    query {
      cosmicjsPosts(slug: {eq: "exploring-the-worlds-natural-wonders"}) {
        title
        slug
        metadata {
          content
          hero {
            gatsbyImageData(
              formats: JPG,
              placeholder: DOMINANT_COLOR
            )
          }
        }
      }
    }
  `)
  const title = data.cosmicjsPosts.title;
  const image = getImage(data.cosmicjsPosts.metadata.hero.gatsbyImageData)
  return (
    <div>
      <h1>{title}</h1>
      <GatsbyImage image={image} />
    </div>
  )
}
