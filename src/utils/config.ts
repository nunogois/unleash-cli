import nconf from 'nconf'
import { logger } from './logger'

nconf.argv().env().file({ file: 'config.json' })

export const config = {
  url: nconf.get('URL'),
  token: nconf.get('TOKEN'),
  isValid: () => !!config.url && !!config.token,
  save(config: { url: string; token: string }) {
    const url = config.url + (config.url.endsWith('/') ? '' : '/')
    nconf.set('URL', url)
    nconf.set('TOKEN', config.token)
    nconf.save((error: any) => {
      if (error) {
        logger.error(error)
      }
    })
  }
}
