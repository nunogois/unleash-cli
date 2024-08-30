import nconf from 'nconf'
import { logger } from './logger'

nconf.argv().env().file({ file: 'config.json' })

export const config = {
  url: nconf.get('URL'),
  token: nconf.get('TOKEN'),
  isValid: () => !!config.url && !!config.token,
  save(config: { url: string; token: string; openAIToken?: string }) {
    const url = config.url + (config.url.endsWith('/') ? '' : '/')
    nconf.set('URL', url)
    nconf.set('TOKEN', config.token)
    if (config.openAIToken) {
      nconf.set('OPEN_AI_TOKEN', config.openAIToken)
    } else {
      nconf.clear('OPEN_AI_TOKEN')
    }
    nconf.save((error: any) => {
      if (error) {
        logger.error(error)
      }
    })
  },
  openAIToken: nconf.get('OPEN_AI_TOKEN'),
  saveOpenAIToken(token: string) {
    nconf.set('OPEN_AI_TOKEN', token)
    nconf.save((error: any) => {
      if (error) {
        logger.error(error)
      }
    })
  }
}
