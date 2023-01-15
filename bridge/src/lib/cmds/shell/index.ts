import { windows } from './windows'
import { darvin } from './mac';
import { instance } from './types'


async function shell(instance: instance): Promise<void> {
  const platform = process.platform;
  if (platform === 'win32') {
    return await windows(instance);
  }
  if (platform === 'darwin') {
    return await darvin(instance)
  }
}


export default shell