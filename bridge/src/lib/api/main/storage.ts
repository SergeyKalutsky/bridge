import { app } from 'electron';
import path from 'path'

const Store = require('electron-store')
const BASE_DIR = path.join(app.getPath('userData'), 'storage')
const store = new Store()

export  {store, BASE_DIR}
