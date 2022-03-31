import { windows } from './windows'
import { linux } from './linux'
import { instance } from './types'


async function shell(instance: instance,
  callback: (error?: Error, data?: string | Buffer) => void): Promise<void> {
  const platform = process.platform;
  if (platform === 'linux') return linux(instance, callback);
  if (platform === 'win32') return windows(instance, callback);
  callback(new Error('Platform not yet supported.'));
}


export default shell