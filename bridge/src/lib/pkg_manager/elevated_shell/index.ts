import { windows } from './windows'
import { instance } from './types'


async function shell(instance: instance): Promise<void> {
  const platform = process.platform;
  if (platform === 'win32') {
    return await windows(instance);
  }
}


export default shell