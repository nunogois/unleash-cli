import axios from 'axios'
import { config } from './config'

export enum ROUTES {
  API_ADMIN = 'api/admin',
  FEATURE_TOGGLES = 'api/admin/features'
}

const getUrl = (url: string) => {
  if (url.startsWith('http')) {
    return url
  }
  const trailingSlash = config.url.endsWith('/') ? '' : '/'
  return config.url + trailingSlash + url
}

const getConfig = () => ({
  headers: {
    Authorization: config.token
  }
})

const get = async <T>(url: string): Promise<T> =>
  await axios.get(getUrl(url), getConfig()).then(res => res.data)

const post = async (url: string): Promise<void> =>
  axios.post(getUrl(url), {}, getConfig())

export const api = {
  get,
  post
}
