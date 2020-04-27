import { Box, Button, Flex, Sans, Serif } from "@artsy/palette"
import { ArtistConsignHeader_artist } from "__generated__/ArtistConsignHeader_artist.graphql"
import {
  LightPurpleColor,
  SectionContainer,
} from "Apps/Artist/Routes/Consign/Components/SectionContainer"
import { AnalyticsSchema } from "Artsy"
import { RouterLink } from "Artsy/Router/RouterLink"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { Media } from "Utils/Responsive"
import { getConsignSubmissionUrl } from "../Utils/getConsignSubmissionUrl"
import { ArtistConsignHeaderImagesFragmentContainer as ArtistConsignHeaderImages } from "./ArtistConsignHeaderImages"

interface ArtistConsignHeaderProps {
  artist: ArtistConsignHeader_artist
}

export const ArtistConsignHeader: React.FC<ArtistConsignHeaderProps> = ({
  artist,
}) => {
  return (
    <SectionContainer background={LightPurpleColor}>
      <Media greaterThan="sm">
        {classNames => {
          return (
            <Flex
              className={classNames}
              position="absolute"
              width="70%"
              height="100%"
              justifyContent="center"
            >
              <ArtistConsignHeaderImages artist={artist} />
            </Flex>
          )
        }}
      </Media>

      <Box textAlign="center" position="relative" zIndex={1}>
        <Box>
          <Serif element="h1" size={["10", "12"]}>
            Sell Works by <br />
            {artist.name}
          </Serif>
        </Box>

        <Box mt={3} mb={4}>
          <Sans element="h2" size="4t">
            With Artsy's expert guidance, selling is simple
          </Sans>
        </Box>

        <Box>
          <RouterLink
            to={getConsignSubmissionUrl({
              contextPath: artist.href,
              subject: AnalyticsSchema.Subject.RequestPriceEstimate,
            })}
          >
            <Button>Request a price estimate</Button>
          </RouterLink>
        </Box>
      </Box>
    </SectionContainer>
  )
}

export const ArtistConsignHeaderFragmentContainer = createFragmentContainer(
  ArtistConsignHeader,
  {
    artist: graphql`
      fragment ArtistConsignHeader_artist on Artist {
        ...ArtistConsignHeaderImages_artist
        name
        href
      }
    `,
  }
)
