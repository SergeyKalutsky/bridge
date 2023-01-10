// LINUX HAS NOT BEEN REFACTORED
import { spawn } from 'child_process';
import { instance } from './types'
import fs from 'fs';


function escapeDoubleQuotes(string: string | Array<string>) {
  if (typeof string !== 'string') throw new Error('Expected a string.');
  return string.replace(/"/g, '\\"');
}


async function linuxSpawn(instance: instance,
  callback: (error?: Error, data?: string | Buffer) => void) {
  linuxBinary(instance, async (error: Error, binary: string) => {
    if (error) return callback(error);
    const command = [];
    // Preserve current working directory:
    command.push('cd "' + escapeDoubleQuotes(process.cwd()) + '";');
    command.push('"' + escapeDoubleQuotes(binary) + '"');
    if (/kdesudo/i.test(binary)) {
      command.push(
        '--comment',
        '"' + instance.options.name + ' wants to make changes. ' +
        'Enter your password to allow this."'
      );
      command.push('-d'); // Do not show the command to be run in the dialog.
      command.push('--');
    } else if (/pkexec/i.test(binary)) {
      command.push('--disable-internal-agent');
    }
    const magic = 'SUDOPROMPT\n';
    command.push(
      '/bin/bash -c "echo ' + escapeDoubleQuotes(magic.trim()) + '; ' +
      escapeDoubleQuotes(instance.command) +
      '"'
    );
    const str_command = command.join(' ');
    const child = spawn(str_command, { shell: true });
    child.stdout.on('data', (chunk) => {
      callback(null, chunk)
    })
    child.stderr.on('data', (chunk) => {
      callback(null, chunk)
    })
  }
  );
}

async function linuxBinary(instance: instance, callback: (error: Error, path?: string) => void) {
  let index = 0;
  // We used to prefer gksudo over pkexec since it enabled a better prompt.
  // However, gksudo cannot run multiple commands concurrently.
  const paths = ['/usr/bin/kdesudo', '/usr/bin/pkexec'];
  async function test() {
    if (index === paths.length) {
      return callback(new Error('Unable to find pkexec or kdesudo.'));
    }
    const path = paths[index++];
    fs.stat(path, (error) => {
      if (error) {
        if (error.code === 'ENOTDIR') return test();
        if (error.code === 'ENOENT') return test();
        callback(error);
      } else {
        callback(undefined, path);
      }
    }
    );
  }
  test();
}


export { linuxSpawn as linux }
