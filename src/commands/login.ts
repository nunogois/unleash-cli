import inquirer from 'inquirer'
import { logger } from '../utils/logger'
import { createSpinner } from 'nanospinner'
import { config } from '../utils/config'

enum LOGIN_MODE {
  LOGIN = 'login',
  SSO = 'sso',
  TOKEN = 'token'
}

export const command: string = 'login'
export const desc: string = 'Login to Unleash'
export const aliases: string[] = ['setup']

export const handler = async () => {
  let { url } = await inquirer.prompt<{ url: string }>([
    {
      message: 'Unleash URL:',
      name: 'url'
    }
  ])

  const { mode } = await inquirer.prompt<{ mode: LOGIN_MODE }>([
    {
      message: 'Login using:',
      name: 'mode',
      type: 'list',
      choices: [
        {
          name: 'Unleash account (username / password)',
          short: 'Unleash account',
          value: LOGIN_MODE.LOGIN
        },
        { name: 'Single Sign-On', short: 'SSO', value: LOGIN_MODE.SSO },
        { name: 'API Token', short: 'Token', value: LOGIN_MODE.TOKEN }
      ],
      default: LOGIN_MODE.TOKEN
    }
  ])

  if (mode !== LOGIN_MODE.TOKEN) {
    logger.fatal('Not implemented yet.')
  }

  const { token } = await inquirer.prompt<{ token: string }>([
    {
      message: 'Unleash Token:',
      name: 'token'
    }
  ])

  const { setupOpenAI } = await inquirer.prompt<{ setupOpenAI: boolean }>([
    {
      message: 'Setup OpenAI API Token?',
      name: 'setupOpenAI',
      type: 'confirm',
      default: false
    }
  ])

  if (!setupOpenAI) {
    await save({ url, token })
    return
  }

  const { openAIToken } = await inquirer.prompt<{ openAIToken: string }>([
    {
      message: 'OpenAI API Token:',
      name: 'openAIToken'
    }
  ])

  await save({ url, token, openAIToken })
}

const save = async ({
  url,
  token,
  openAIToken
}: {
  url: string
  token: string
  openAIToken?: string
}) => {
  const spinner = createSpinner('Saving...').start()
  try {
    config.save({ url, token, openAIToken })
    spinner.success({ text: 'Configuration saved successfully.' })
  } catch (error: any) {
    spinner.error({ text: error.message })
  }
}
