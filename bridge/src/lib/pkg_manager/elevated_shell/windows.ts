import { spawn } from 'child_process';
import { instance } from './types'

function windows(instance: instance,
  callback?: (error?: Error, data?: string | Buffer) => void): void {
  const command = [];
  command.push('powershell.exe');
  command.push('-NoProfile');
  command.push('-InputFormat None');
  command.push('-ExecutionPolicy Bypass');
  command.push('-Command Start-Process');
  command.push('-Wait');
  command.push('powershell.exe');
  command.push('-windowstyle hidden');
  command.push('-ArgumentList');
  command.push("('" + instance.command + "')")
  command.push('-Verb runAs');
  const str_command = command.join(' ');
  const child = spawn(str_command, { shell: true })
  child.on('close', () => {
    callback(null, 'done')
  })
  child.stdin.end(); // Otherwise PowerShell waits indefinitely on Windows 7.
}

export { windows }
