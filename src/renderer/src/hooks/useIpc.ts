import { type IpcRendererListener } from '@electron-toolkit/preload'
import { useEffect } from 'react'

export const useIpc = (eventName: string, callback: IpcRendererListener, deps = []) => {
  useEffect(() => {
    window.electron.ipcRenderer.on(eventName, callback)
    return () => {
      window.electron.ipcRenderer.removeAllListeners(eventName)
    }
  }, [deps])
}

export const IpcInvoke = (key: string) => window.electron.ipcRenderer.invoke(key)
