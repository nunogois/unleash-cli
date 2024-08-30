import { createSpinner } from 'nanospinner'
import { api, ROUTES } from '../utils/api'
import { FeatureToggleListItem } from '../utils/interfaces'
import { logger } from '../utils/logger'
import { Arguments, CommandBuilder } from 'yargs'

type Options = {
  project?: string
}

export const command: string = 'list'
export const desc: string = 'List feature toggles'
export const aliases: string[] = ['ls']

export const builder: CommandBuilder<Options, Options> = yargs =>
  yargs.options({
    project: { type: 'string', alias: 'p', default: 'default' }
  })

export const handler = async (argv: Arguments<Options>) => {
  const { project } = argv
  const spinner = createSpinner('Loading feature toggles...').start()
  try {
    const featureTogglesData = await api.get<{
      features: FeatureToggleListItem[]
    }>(`api/admin/projects/${project}/features`)
    spinner.success({ text: 'Feature toggles loaded successfully.' })
    logger.featureTogglesTable(featureTogglesData.features)
  } catch (error: any) {
    spinner.error({ text: error.message })
  }
}
