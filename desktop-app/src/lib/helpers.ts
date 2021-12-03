import { join } from 'path'
import storage from 'electron-json-storage';

const makeBaseDir = (): string => {
    const settings = storage.getSync('settings')
    if ('user' in settings) {
        const basedir = join(storage.getDataPath(), settings.user.login)
        return basedir
    }
    return storage.getDataPath()
}


export {makeBaseDir}