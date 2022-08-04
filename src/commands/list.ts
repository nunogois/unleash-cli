import { createSpinner } from 'nanospinner'
import { api, ROUTES } from '../utils/api'
import { FeatureToggleListItem } from '../utils/interfaces'
import { logger } from '../utils/logger'

export const command: string = 'list'
export const desc: string = 'List feature toggles'
export const aliases: string[] = ['ls']

export const handler = async () => {
  const spinner = createSpinner('Loading feature toggles...').start()
  try {
    const featureTogglesData = await api.get<{
      features: FeatureToggleListItem[]
    }>(ROUTES.FEATURE_TOGGLES)
    spinner.success({ text: 'Feature toggles loaded successfully.' })
    logger.featureTogglesTable(featureTogglesData.features)
  } catch (error: any) {
    spinner.error({ text: error.message })
  }
}
