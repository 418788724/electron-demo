import EventEmitter from 'events'
import { browserOpt, type App } from './App'
import { BrowserWindow, BrowserWindowConstructorOptions, shell } from 'electron'
import { is } from '@electron-toolkit/utils'
import icon from '../../../resources/icon.png?asset'
import { join } from 'path'
import _ from 'lodash'

export default class Browser extends EventEmitter {
  /**
   * 外部的 app
   * @private
   */
  private app: App

  /**
   * 内部的 electron 窗口
   * @private
   */
  private _browserWindow?: BrowserWindow

  /**
   * 标识符
   */
  name: string

  /**
   * 生成时的选项
   */
  options: BrowserWindowConstructorOptions

  /**
   * 对外暴露的获取窗口的方法
   */
  get browserWindow(): BrowserWindow {
    return this.init()
  }

  constructor(config: browserOpt, application: App) {
    super()

    this.app = application

    this.name = config.name

    this.options = config.option

    this.init()

    this.browserWindow.on('closed', () => {
      this.destroy()
    })
  }

  // 加载窗口地址
  loadUrl(name): void {
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.browserWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      this.browserWindow.loadFile(join(__dirname, '../renderer/index.html'), {
        hash: name !== 'index' ? `/${name}` : ''
      })
    }
  }

  /**
   * @description 加载devtoolschrome插件配置 如redux-tools等
   */
  loadDevTools(): void {
    // dev console
  }

  /**
   * @description 初始化窗口配置
   * @returns
   */
  init(): BrowserWindow {
    if (this._browserWindow && !this._browserWindow.isDestroyed()) {
      return this._browserWindow
    }

    const baseOption: BrowserWindowConstructorOptions = {
      width: 900,
      height: 670,
      show: false,
      autoHideMenuBar: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        devTools: is.dev,
        preload: join(__dirname, `../preload/index.mjs`),
        sandbox: false,
        webSecurity: false
      }
    }

    this._browserWindow = new BrowserWindow(_.merge({}, baseOption, this.options))

    this._browserWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    this.loadUrl(this.name)

    this.loadDevTools()

    if (is.dev && this.options.webPreferences?.devTools) {
      this._browserWindow.webContents.openDevTools()
    }
    this.app.logger.info(`注册窗口${this.name}`)
    return this._browserWindow
  }

  /**
   * @description 显示窗口
   */
  show() {
    this.app.logger.info(`打开窗口${this.name}`)
    this.browserWindow.show()
    return this
  }

  /**
   * @description 隐藏窗口
   */
  hide() {
    this.app.logger.info(`关闭窗口${this.name}`)
    this.browserWindow.hide()
    return this
  }

  /**
   * @description 窗口事件
   * @param event
   * @param data
   */
  send(event: string, data?: any) {
    this.browserWindow.webContents.send(event, data)
    return this
  }

  /**
   * @description 销毁窗口实例
   */
  destroy(): void {
    this.app.logger.info(`销毁窗口${this.name}`)
    this._browserWindow = undefined
  }
}
