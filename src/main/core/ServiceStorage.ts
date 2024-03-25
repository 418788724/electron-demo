import { logAfter, logBefore } from './Logger'

export type IServiceStorageVal = {
  name: string
  methodName: string
  showLog?: boolean
}

/**
 * 存储各种Service
 */
export class ServiceStorage {
  static services: WeakMap<any, IServiceStorageVal[]> = new WeakMap()

  @logBefore('[服务]初始化服务...')
  @logAfter('[服务]初始化完成!')
  init(): void {
    // 服务
  }
}
