import { exec } from 'child_process'
import util from 'util'
import { instance } from './types'
import { ipcMain, BrowserWindow } from 'electron';


const promisifiedExec = util.promisify(exec);


const getMainWindow = () => {
    const ID = parseInt(process.env.MAIN_WINDOW_ID)
    return BrowserWindow.fromId(ID)
}


async function initSudoTemp(sudoPassword: string): Promise<boolean> {
    // We use sudo passwd in a bash shell, which is not secure
    // to avoid cousing vulnerabilities we do not store history of using sudo pswd
    const histIgnoreCmd = "export HISTIGNORE='*sudo -S*'"
    await promisifiedExec(histIgnoreCmd)
    try {
        await promisifiedExec(`echo ${sudoPassword} | sudo -S ls`)
    } catch (error) {
        return false
    }
    return true
}

async function sudoIsSet(){
    while(process.env.SUDO_STATUS === undefined) {
        await new Promise(r => setTimeout(r, 300));
    }
    console.log(JSON.parse(process.env.SUDO_STATUS))
    return true
}


async function darvin(instance: instance): Promise<void> {
    const command = []
    command.push(instance.command)
    // log stdout to file
    command.push('>>')
    command.push(`'${instance.path}'`)
    // log stderr to the same file
    command.push('2>&1')
    const strCommand = command.join(' ')

    if (instance.elevate) {
        const mainWindow = getMainWindow()
        mainWindow.webContents.send('pkg:sudo', { open: true, error: null })
        ipcMain.on('pkg:sudo', async (event, password: string) => {
            const sudoCorrect = await initSudoTemp(password)
            if (sudoCorrect) {
                mainWindow.webContents.send('pkg:sudo', { open: false, error: null })
                process.env.SUDO_STATUS = JSON.stringify({updateTime: new Date().getTime()})
                return
            }
            mainWindow.webContents.send('pkg:sudo', { open: true, error: 'Неверный пароль' })
        })
        await sudoIsSet()
    }
    await promisifiedExec(strCommand)
}

export { darvin, initSudoTemp }
