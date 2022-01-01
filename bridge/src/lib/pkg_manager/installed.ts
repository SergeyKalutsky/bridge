import CMD from "./cmds";
import { spawn } from 'child_process';

async function checkInstalled(pkg: string,
    callback?: (installed: boolean, error?: Error) => void): Promise<any> {

    const check = CMD[pkg].check
    const child = spawn(check.cmd, { shell: true })
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


export default checkInstalled