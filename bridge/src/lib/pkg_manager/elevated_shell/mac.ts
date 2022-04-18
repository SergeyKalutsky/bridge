import { exec } from 'child_process'
import util from 'util'

const promisifiedExec = util.promisify(exec);

async function initSudoTemp(sudoPassword: string): Promise<boolean>{
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

// brew install script
// -- it only prompts if stdin is a TTY. So we echo the output
// const cmd = `echo | /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"`
