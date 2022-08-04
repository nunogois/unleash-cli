import chalk from 'chalk'
import Table from 'cli-table3'
import { config } from './config'
import { FeatureToggle, FeatureToggleListItem } from './interfaces'

const info = (message: string, label = 'Info') =>
  console.log(`${chalk.cyan(`${chalk.underline(label)}:`)} ${message}`)

const error = (message: string, label = 'Error') =>
  console.error(`${chalk.red(`${chalk.underline(label)}:`)} ${message}`)

const errorWithHelpHint = (message: string) => {
  error(message)
  info(`Use ${chalk.blue('unleash -h')} for usage help`, 'Hint')
}

const fatal = (message: string) => {
  error(message)
  process.exit(1)
}

const renderTable = (columns: string[], rows: any[]) => {
  const table = new Table({
    head: columns,
    style: {
      head: ['cyan'],
      border: ['grey']
    }
  })
  table.push(...rows)
  console.log(table.toString())
}

const featureTogglesTable = (featureToggles: FeatureToggleListItem[]) => {
  const columns = [
    'Name',
    'Description',
    'Type',
    'Created',
    'Seen',
    'Project ID',
    'State'
  ]
  const rows = featureToggles
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(featureToggle => [
      featureToggle.name,
      featureToggle.description,
      featureToggle.type,
      featureToggle.createdAt?.split('T')[0],
      featureToggle.lastSeenAt?.split('T')[0],
      featureToggle.project,
      featureToggle.stale ? chalk.red('Stale') : chalk.green('Active')
    ])
  renderTable(columns, rows)

  info(`${config.url}features`, 'Open in Unleash')
}

const featureToggle = (featureToggle: FeatureToggle) => {
  const columns = [
    'Name',
    'Description',
    'Type',
    'Created',
    'Seen',
    'Project ID',
    'State',
    'Metrics',
    'Archived'
  ]
  const rows = [
    [
      featureToggle.name,
      featureToggle.description,
      featureToggle.type,
      featureToggle.createdAt?.split('T')[0],
      featureToggle.lastSeenAt?.split('T')[0],
      featureToggle.project,
      featureToggle.stale ? chalk.red('Stale') : chalk.green('Active'),
      featureToggle.impressionData
        ? chalk.green('Enabled')
        : chalk.red('Disabled'),
      featureToggle.archived ? chalk.red('Yes') : chalk.green('No')
    ]
  ]
  renderTable(columns, rows)

  if (featureToggle.environments.length > 0) {
    const envRows = featureToggle.environments.map(env => [
      env.name,
      env.enabled ? chalk.green('Enabled') : chalk.red('Disabled')
    ])
    renderTable(['Environment', 'Enabled'], envRows)
  }

  info(
    `You can toggle this feature on a specific environment by using e.g. ${chalk.blue(
      `unleash enable -e development ${featureToggle.name}`
    )}`,
    'Hint'
  )
  info(
    `${config.url}projects/${featureToggle.project}/features/${featureToggle.name}`,
    'Open in Unleash'
  )
}

export const logger = {
  info,
  error,
  errorWithHelpHint,
  fatal,
  featureTogglesTable,
  featureToggle
}
