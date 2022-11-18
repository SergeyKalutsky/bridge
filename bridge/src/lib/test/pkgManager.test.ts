import { expect } from 'chai';
import * as pkgManager from '../pkgManager'
import 'mocha';


describe('test installation pkg manager', () => {
  it('checks if python exists', () => {
    pkgManager.checkInstalled('python')
  })
})


describe('Hello function', () => {
  it('should return hello world', () => {
   
    expect('Hello World!').to.equal('Hello World!');
  });
});