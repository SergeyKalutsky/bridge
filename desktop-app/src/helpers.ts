import { join } from 'path'

const makeBaseDir = (storage: any): string => {
    const settings = storage.getSync('settings')
    if ('user' in settings) {
        const basedir = join(storage.getDataPath(), settings.user.login)
        return basedir
    }
    return storage.getDataPath()
}


export {makeBaseDir}