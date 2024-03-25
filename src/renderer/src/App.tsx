import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import { IpcInvoke, useIpc } from './hooks'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const ipcHandle = async () => {
    try {
      const res = await IpcInvoke('/system/check-accessibility')
      console.log('res', res)
    } catch (error) {
      /* empty */
    }
  }
  useIpc('initDatabase', (_e, value) => {
    console.log('app.ipc initDatabase:', _e, value)
  })

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App
