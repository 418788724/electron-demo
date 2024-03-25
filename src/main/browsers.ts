import { is } from '@electron-toolkit/utils'
import { type App, browserOpt } from './core/App'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_app: App): browserOpt[] => {
  // console.log('app', app)
  return [
    {
      name: 'index',
      option: {
        webPreferences: {
          devTools: is.dev
        }
      }
    }
  ]
}
