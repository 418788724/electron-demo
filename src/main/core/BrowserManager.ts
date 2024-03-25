import { App, browserOpt } from './App'
import Browser from './Browser'

/**
 * @description 窗口管理
 */
export default class BrowserManager {
  app: App

  browsers: Map<string, Browser | null> = new Map()

  constructor(app: App) {
    this.app = app
  }

  /**
   * @description 初始化窗口
   * @param config
   * @returns
   */
  init(config: browserOpt): any {
    let browser = this.browsers.get(config.name)
    if (browser) {
      return browser
    }
    browser = new Browser(config, this.app)
    this.browsers.set(config.name, browser)
    return browser
  }

  /**
   * @description 广播
   */
  broadcast(): void {
    //
  }
}
