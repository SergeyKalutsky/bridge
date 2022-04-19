import { exec } from 'child_process'
import util from 'util'
import { instance } from './types'


const promisifiedExec = util.promisify(exec);

async function initSudoTemp(): Promise<boolean> {
    // We use sudo passwd in a bash shell, which is not secure
    // to avoid cousing vulnerabilities we do not store history of using sudo pswd
    const sudoPassword = ''
    const histIgnoreCmd = "export HISTIGNORE='*sudo -S*'"
    await promisifiedExec(histIgnoreCmd)
    try {
        await promisifiedExec(`echo ${sudoPassword} | sudo -S ls`)
    } catch (error) {
        return false
    }
    return true
}

async function darvin(instance: instance): Promise<void> {
    if (instance.elevate) {
        const paswdCheck = await initSudoTemp()
    }
    const command = []
    command.push(instance.command)
    command.push('>>')
    command.push(`'${instance.path}'`)
    command.push('2>&1')
    const strCommand = command.join(' ')
    await promisifiedExec(strCommand)
}

export { darvin, initSudoTemp }
