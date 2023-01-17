import { app } from 'electron';
import path from 'path'

const Store = require('electron-store')
const BASE_DIR = path.join(app.getPath('userData'), 'storage')
const LOG_PATH = path.join(app.getPath('userData'), 'bridge.log')
const store = new Store()

function getProjectDir(project?: string): string {
    if (project) {
        return path.join(BASE_DIR, store.get('user.login'), project)
    }
    return path.join(BASE_DIR, store.get('user.login'), store.get('active_project.name'))
}

export { store, getProjectDir, BASE_DIR, LOG_PATH }
