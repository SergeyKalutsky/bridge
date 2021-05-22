import { spawn } from 'child_process';
import { windows } from './windows'
import { linux } from './linux'


interface instance {
  command: string;
  options?: { name: string };
  uuid?: string;
  path?: string;
}


function elevatedShell(instance: instance,
  callback: (error?: Error, data?: string | Buffer) => void) {
  const platform = process.platform;
  if (platform === 'linux') return linux(instance, callback);
  if (platform === 'win32') return windows(instance);
  callback(new Error('Platform not yet supported.'));
}


export { elevatedShell }
