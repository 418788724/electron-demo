import { BrowserWindow, type BrowserWindowConstructorOptions, app } from 'electron'
import { EventEmitter } from 'events'
import { ServiceModule, type TServiceModule } from '../services'
import { type IServiceStorageVal, ServiceStorage } from './ServiceStorage'
import { electronApp, ipcHelper, optimizer } from '@electron-toolkit/utils'
import BrowserManager from './BrowserManager'
import browsers from '../browsers'
import Logger from './Logger'

export interface browserOpt {
  name: string
  option: BrowserWindowConstructorOptions
}

const importAll = (r: any): any[] => Object.values(r).map((v: any) => v.default)

type IserviceEventsVal = {
  methodName: string
  service: ServiceModule
}

export class App extends EventEmitter {
  /**
   * app 挂载服务
   */
  services: WeakMap<TServiceModule, ServiceModule> = new WeakMap()

  /**
   * 挂载服务的事件
   */
  serviceEvents: Map<string, IserviceEventsVal> = new Map()

  /**
   * 窗口管理
   */
  browserManager!: BrowserManager

  /**
   * 日志
   */
  logger: Logger

  constructor() {
    super()

    this.logger = new Logger()

    this.beforeInit()
  }

  /**
   * @description 初始化前
   */
  async beforeInit(): Promise<void> {
    this.logger.info('初始化前: 初始化用户配置，数据库等')
    // 处理异步信息再初始化

    this.initServices()

    this.applyServiceMethod()

    this.browserManager = new BrowserManager(this)
  }

  /**
   * @description 初始化导入service
   */
  initServices(): void {
    this.logger.info(`开始注册服务-----`)
    const servicesPkg: TServiceModule[] = importAll(
      import.meta.glob('../services/*Service.ts', { eager: true })
    )
    servicesPkg.forEach((service) => this.registerService(service))
    this.logger.info(`结束注册服务-----`)
  }

  /**
   * @description 注册service
   * @param serviceClass
   * @returns
   */
  registerService(serviceClass: TServiceModule): void {
    const service = new serviceClass(this)
    this.services.set(serviceClass, service)
    this.logger.info(`注册服务: ${serviceClass.name}`)
    ServiceStorage.services.get(serviceClass)?.forEach((event) => {
      this.registerServiceMethod(event, service)
    })
  }

  /**
   * @description 注册服务事件
   * @param event
   * @param service
   * @returns
   */
  registerServiceMethod(event: IServiceStorageVal, service: ServiceModule): void {
    this.serviceEvents.set(event.name, {
      service,
      methodName: event.methodName
    })
  }

  /**
   * @description 服务消息方法监听
   */
  applyServiceMethod(): void {
    this.serviceEvents.forEach((serviceInfo, key) => {
      const { service, methodName } = serviceInfo

      ipcHelper.handle(key, async (_, ...data) => {
        try {
          return await service[methodName](...data)
        } catch (error: any) {
          // error
          return {
            error: error?.message
          }
        }
      })
    })
  }

  /**
   * @description 初始化所有窗口配置
   */
  initBrowsers(): void {
    this.logger.info(`开始注册应用窗口-----`)
    // 加载用户browsers配置
    const userConfig = browsers(this)
    if (!Array.isArray(userConfig)) {
      throw new Error('browsers return is not a Array!')
    }
    userConfig.forEach((item) => {
      this.browserManager.init(item)
    })
  }

  /**
   * @description 离开应用前
   * @returns
   */
  beforeQuit(): void {
    //
    this.logger.info(`离开应用前`)

    ipcHelper.removeAllListeners()
  }

  /**
   * @description 启动应用
   * @returns
   */
  bootstrap(): void {
    const isSingle = app.requestSingleInstanceLock()
    if (!isSingle) {
      app.exit(0)
    }
    app.whenReady().then(() => {
      // 初始化
      this.logger.logSystemInfo()

      // 注册 app 协议
      // createProtocol('app');

      // Set app user model id for windows
      electronApp.setAppUserModelId('com.electron')

      // 初始化browsers
      this.initBrowsers()

      // 初始化完毕打开主界面
      this.browserManager.browsers.get('index')?.show()

      this.logger.info('app 初始化完毕!')
      this.logger.divider('🎉')

      setTimeout(() => {
        this.browserManager.browsers.get('index')?.send('initDatabase', '?????')
      }, 3000)
    })

    // F12 调试
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    // 应用激活时
    app.on('activate', () => {
      // 打开browsers
      if (BrowserWindow.getAllWindows().length === 0) {
        // 打开主窗口
        this.browserManager.browsers.get('index')?.show()
      }
    })

    // 退出前
    app.on('before-quit', () => {
      // 退出前
      this.beforeQuit()
      app.exit()
    })

    // 关闭所有窗口
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
  }
}
