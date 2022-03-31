import CMD from "./cmds";
import { spawn } from 'child_process';


async function checkInstalled(pkg: string,
    callback?: (installed: boolean, error?: Error) => void): Promise<any> {
    const platform = process.platform

    const check = CMD[pkg].check
    const command = platform === 'win32' ? 'powershell.exe "' + check.cmd + '"' : check.cmd
    const child = spawn(command, { shell: true })
    let installed = false

    child.stdout.on('data', (chunk) => {
        if (chunk.toString().includes(check.string)) {
            installed = true
        }
    })

    child.on('close', () => {
        callback(installed)
    })
}
export { checkInstalled }