import { expect } from 'chai';
import * as pkgManager from '../src/lib/pkgManager'
import 'mocha';

const hello = () => {
  return 'Hello World!'
}

describe('test installation pkg manager', () => {
  it('checks if python exists', () => {
    pkgManager.checkInstalled('python')
  })
})


describe('Hello function', () => {
  it('should return hello world', () => {
    const result = hello();
    expect(result).to.equal('Hello World!');
  });
});