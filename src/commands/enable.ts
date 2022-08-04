import { createSpinner } from 'nanospinner'
import { Arguments, CommandBuilder } from 'yargs'
import { api } from '../utils/api'

type Options = {
  featureToggle: string
  project?: string
  environment?: string
}

export const command: string = 'enable <feature-toggle>'
export const desc: string = 'Enables a feature toggle by name'
export const aliases: string[] = ['e', 'te', 'on']

export const builder: CommandBuilder<Options, Options> = yargs =>
  yargs
    .options({
      project: { type: 'string', alias: 'p', default: 'default' },
      environment: { type: 'string', alias: 'e', default: 'development' }
    })
    .positional('featureToggle', { type: 'string', demandOption: true })

export const handler = async (argv: Arguments<Options>) => {
  const { featureToggle, project, environment } = argv
  const spinner = createSpinner(`Enabling ${featureToggle}...`).start()
  try {
    await api.post(
      `api/admin/projects/${project}/features/${featureToggle}/environments/${environment}/on`
    )
    spinner.success({ text: `${featureToggle} enabled successfully.` })
  } catch (error: any) {
    spinner.error({ text: error.message })
  }
}
