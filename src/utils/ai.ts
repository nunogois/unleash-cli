import OpenAI from 'openai'
import { config } from './config'
import { api, ROUTES } from './api'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { Spinner } from 'nanospinner'
// import axios from 'axios'
// import { logger } from './logger'

let client: OpenAI | undefined

const initOpenAI = () => {
  if (!client) {
    if (!config.openAIToken) {
      throw new Error('OpenAI token is not set. Please run unleash setup.')
    }
    client = new OpenAI({
      apiKey: config.openAIToken
    })
  }
  return client
}

// // TODO: The idea would be to provide the OpenAPI spec to the AI assistant and allow it to interact with the Unleash API in a dynamic way. Unfortunately it was not trivial.
// const makeApiRequest = async ({
//   method,
//   path,
//   params,
//   data
// }: {
//   method: string
//   path: string
//   params?: any
//   data?: any
// }) => {
//   try {
//     const url = `${config.url}${path}`
//     console.log(method, url, params, data)
//     const response = await axios({
//       method,
//       url,
//       headers: {
//         Authorization: config.token,
//         'Content-Type': 'application/json'
//       },
//       params,
//       data
//     })
//     console.log(response.data)
//     return response.data
//   } catch (error) {
//     logger.error(`Error making Unleash API request: ${error}`)
//     return error
//   }
// }

const getFlag = async ({
  project,
  flag
}: {
  project: string
  flag: string
}) => {
  try {
    const flagData = await api.get(
      `${ROUTES.API_ADMIN}/projects/${project}/features/${flag}`
    )
    return flagData
  } catch (error) {
    return error
  }
}

const toggleFlag = async ({
  project,
  flag,
  environment,
  enabled
}: {
  project: string
  flag: string
  environment: string
  enabled: boolean
}) => {
  try {
    return api.post(
      `${
        ROUTES.API_ADMIN
      }/projects/${project}/features/${flag}/environments/${environment}/${
        enabled ? 'on' : 'off'
      }`
    )
  } catch (error) {
    return error
  }
}

export const ai = async (
  conversationHistory: ChatCompletionMessageParam[],
  spinner: Spinner
) => {
  const client = initOpenAI()
  const stream = client.beta.chat.completions.runTools({
    model: 'gpt-4o-mini',
    messages: conversationHistory,
    stream: true,
    tools: [
      {
        type: 'function',
        function: {
          function: getFlag,
          description: 'Get a feature flag by name and project',
          parse: JSON.parse,
          parameters: {
            type: 'object',
            properties: {
              project: { type: 'string' },
              flag: { type: 'string' }
            },
            required: ['project', 'flag']
          }
        }
      },
      {
        type: 'function',
        function: {
          function: toggleFlag,
          description:
            'Toggle a feature flag by name, project, environment, and enabled status',
          parse: JSON.parse,
          parameters: {
            type: 'object',
            properties: {
              project: { type: 'string' },
              flag: { type: 'string' },
              environment: { type: 'string' },
              enabled: { type: 'boolean' }
            },
            required: ['project', 'flag', 'environment', 'enabled']
          }
        }
      }
      // {
      //   type: 'function',
      //   function: {
      //     function: makeApiRequest,
      //     description: 'Make a request to the Unleash API',
      //     parse: JSON.parse,
      //     parameters: {
      //       type: 'object',
      //       properties: {
      //         method: { type: 'string' },
      //         path: { type: 'string' },
      //         params: { type: 'object', additionalProperties: true },
      //         data: { type: 'object', additionalProperties: true }
      //       },
      //       required: ['method', 'path']
      //     }
      //   }
      // }
    ]
  })

  let loading = true
  for await (const chunk of stream) {
    if (loading && chunk.choices[0]?.delta?.content) {
      spinner.success({ text: 'Answer:' })
      loading = false
    }
    process.stdout.write(chunk.choices[0]?.delta?.content || '')
  }
  process.stdout.write('\n')

  return stream.finalContent()
}
