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
    const platform = os.platform()
    if (platform === 'win32') {
      fs.writeFile('src/lib/pkgManager/scripts/test.ps1', 'test', function (err) {
        if (err) throw err;
      });
    } else {
      fs.writeFile('src/lib/pkgManager/scripts/test.sh', 'test', function (err) {
        if (err) throw err;
      });
    }
    fs.unlink('src/lib/pkgManager/scripts/test.sh', function (err) {
      if (err) throw err;
    });
    expect(pkgManager.checkScriptExists('test')).equals(true)
  })
})

