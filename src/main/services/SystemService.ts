import { platform } from '@electron-toolkit/utils'
import { ServiceModule, event } from '.'
import { systemPreferences } from 'electron'

export default class SystemService extends ServiceModule {
  /**
   * @description 检查macos 可用性
   * @returns
   */
  @event('/system/check-accessibility')
  checkAccessibilityForMacOS(): boolean {
    this.app.logger.info('[/system/check-accessibility]: 检查macos 可用性')
    if (!platform.isMacOS) return false
    return systemPreferences.isTrustedAccessibilityClient(true)
  }

  @event('/system/init')
  initSystemService(): void {
    this.app.logger.info('[/system/init]: 系统初始化')
  }
}
