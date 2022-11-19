import os from 'os'
import fs from 'fs'
import { expect } from 'chai';
import * as pkgManager from '../pkgManager'
import 'mocha';


describe('test installation pkg manager', () => {
  it('check if pkg doesnt exist', () => {
    expect(pkgManager.checkScriptExists('test')).equals(false)
  })

  it('check if pkg exist', () => {
    const ext = os.platform() === 'win32' ? 'ps1' : 'sh'
    const scriptPath = `src/lib/pkgManager/scripts/test.${ext}`

    fs.writeFileSync(scriptPath, 'test')
    expect(pkgManager.checkScriptExists('test')).equals(true)
    fs.unlinkSync(scriptPath);
  })
})

