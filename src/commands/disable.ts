import { createSpinner } from 'nanospinner'
import { Arguments, CommandBuilder } from 'yargs'
import { api } from '../utils/api'

type Options = {
  featureToggle: string
  project?: string
  environment?: string
}

export const command: string = 'disable <feature-toggle>'
export const desc: string = 'Disables a feature toggle by name'
export const aliases: string[] = ['d', 'td', 'off']

export const builder: CommandBuilder<Options, Options> = yargs =>
  yargs
    .options({
      project: { type: 'string', alias: 'p', default: 'default' },
      environment: { type: 'string', alias: 'e', default: 'development' }
    })
    .positional('featureToggle', { type: 'string', demandOption: true })

export const handler = async (argv: Arguments<Options>) => {
  const { featureToggle, project, environment } = argv
  const spinner = createSpinner(`Disabling ${featureToggle}...`).start()
  try {
    await api.post(
      `api/admin/projects/${project}/features/${featureToggle}/environments/${environment}/off`
    )
    spinner.success({ text: `${featureToggle} disabled successfully.` })
  } catch (error: any) {
    spinner.error({ text: error.message })
  }
}
