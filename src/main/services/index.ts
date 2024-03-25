import { App } from '../core/App'
import { type IServiceStorageVal, ServiceStorage } from '../core/ServiceStorage'
import { type RendererEvents } from '../types/events'

// 装饰器
const baseDecorator =
  (name: string, showLog = true) =>
  (target: any, methodName: string, descriptor: any): any => {
    const actions: IServiceStorageVal[] = ServiceStorage.services.get(target.constructor) || []
    actions.push({
      name,
      methodName,
      showLog
    })
    // 存储service方法
    ServiceStorage.services.set(target.constructor, actions)
    return descriptor
  }

export const event = (url: keyof RendererEvents): any => baseDecorator(url)

export class ServiceModule {
  public app: App

  constructor(app: App) {
    this.app = app
  }
}

export type TServiceModule = typeof ServiceModule
