import os from 'os'
import fs from 'fs'


export const checkScriptExists = (pkg: string): boolean => {
    const platform = os.platform()
    if (platform === 'win32' && fs.existsSync(`src/lib/pkgManager/scripts/${pkg}.ps1`) ) {
        return true
    } else if ((platform === 'darwin' || platform === 'linux') && fs.existsSync(`src/lib/pkgManager/scripts/${pkg}.sh`)) {
        return true
    }
    return false
} 