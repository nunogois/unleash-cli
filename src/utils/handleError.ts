import { logger } from './logger'

export default async (message: string, error: Error): Promise<never> => {
  logger.errorWithHelpHint(message ?? error.message ?? 'Unknown error')
  process.exit(1)
}
