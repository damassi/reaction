import {
  Box,
  Button,
  color,
  Flex,
  Input,
  Serif,
  TextArea,
} from "@artsy/palette"
import { SendFeedbackSearchResultsMutation } from "__generated__/SendFeedbackSearchResultsMutation.graphql"
import { ContextProps } from "Artsy"
import { withContext } from "Artsy/SystemContext"
import React from "react"
import { commitMutation, graphql } from "react-relay"
import styled from "styled-components"

interface Inputs {
  message: string
  name: string
  email: string
}

interface State extends Inputs {
  submitted: boolean
  triggeredValidation: boolean
}

class SendFeedbackForm extends React.Component<ContextProps, State> {
  state = {
    submitted: false,
    message: null,
    name: null,
    email: null,
    triggeredValidation: false,
  }

  handleClick() {
    const { user, relayEnvironment } = this.props
    const { message, name, email } = this.state
    if (!message) return
    if (!user && !(name && email)) return

    commitMutation<SendFeedbackSearchResultsMutation>(relayEnvironment, {
      mutation: graphql`
        mutation SendFeedbackSearchResultsMutation(
          $input: SendFeedbackMutationInput!
        ) {
          sendFeedback(input: $input) {
            feedbackOrError {
              ... on SendFeedbackMutationSuccess {
                feedback {
                  message
                }
              }
              ... on SendFeedbackMutationFailure {
                mutationError {
                  type
                  message
                  detail
                }
              }
            }
          }
        }
      `,
      variables: {
        input: { message, email, name },
      },
      optimisticUpdater: () => {
        this.setState({
          submitted: true,
        })
      },
    })
  }

  renderPersonalInfoInputs() {
    const { name, email, triggeredValidation } = this.state
    return (
      <LoggedOutInputContainer mt={2} alignContent="space-between">
        <Box mr={1} width="50%">
          <Input
            placeholder="Your name"
            onChange={({ currentTarget: { value } }) => {
              this.setState({ name: value })
            }}
            required
            error={
              !name && triggeredValidation ? "Cannot leave field blank" : ""
            }
          />
        </Box>
        <Box width="50%">
          <Input
            placeholder="Email address"
            onChange={({ currentTarget: { value } }) => {
              this.setState({ email: value })
            }}
            required
            error={
              !email && triggeredValidation ? "Cannot leave field blank" : ""
            }
          />
        </Box>
      </LoggedOutInputContainer>
    )
  }

  renderFeedbackTextArea() {
    const { message, triggeredValidation } = this.state
    return (
      <FeedbackTextAreaContainer mt={2}>
        <TextArea
          onChange={({ value }) => {
            this.setState({ message: value })
          }}
          placeholder="Your comments here"
          required
          error={
            !message && triggeredValidation ? "Cannot leave field blank" : ""
          }
        />
      </FeedbackTextAreaContainer>
    )
  }

  render() {
    const { user } = this.props

    return (
      <Box bg={color("black5")} p={3} mt={3}>
        <FeedbackContainer
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
        >
          <Box textAlign="center">
            <Serif size="4">Your feedback is important to us.</Serif>
          </Box>
          <Box>
            <Serif size="2">
              Tell us how we can improve and help you find what you are looking
              for.
            </Serif>
          </Box>
          {!user ? this.renderPersonalInfoInputs() : null}
          {this.renderFeedbackTextArea()}
          <Button
            onClick={() => {
              this.setState({ triggeredValidation: true }, () =>
                this.handleClick()
              )
            }}
          >
            Submit
          </Button>
        </FeedbackContainer>
      </Box>
    )
  }
}

const FeedbackContainer = styled(Flex)`
  min-height: 212px;
`

const FeedbackTextAreaContainer = styled(Box)`
  width: 484px;
`

const LoggedOutInputContainer = styled(Flex)`
  width: 484px;
`

export const SendFeedback = withContext(SendFeedbackForm)
