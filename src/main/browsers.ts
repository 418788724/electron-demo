import { is } from '@electron-toolkit/utils'
import { type App, browserOpt } from './core/App'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (app: App): browserOpt[] => {
  return [
    {
      name: 'index',
      option: {
        webPreferences: {
          devTools: is.dev
        }
      }
    },
    {
      name: 'login',
      option: {}
    }
  ]
}
