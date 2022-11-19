import os from 'os'
import fs from 'fs'


export const checkScriptExists = (pkg: string): boolean => {
    const ext = os.platform() === 'win32' ? 'ps1' : 'sh'
    const scriptPath = `src/lib/pkgManager/scripts/${pkg}.${ext}`
    if (fs.existsSync(scriptPath)) {
        return true
    }
    return false
} 
