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

  const spinner = createSpinner('Saving...').start()
  try {
    config.save({ url, token })
    spinner.success({ text: 'Token saved successfully.' })
  } catch (error: any) {
    spinner.error({ text: error.message })
  }
}
