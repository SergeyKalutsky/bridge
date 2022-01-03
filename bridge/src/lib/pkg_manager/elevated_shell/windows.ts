import { spawn } from 'child_process';
import { instance } from './types'

// powershell.exe -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "Start-Process powershell.exe -ArgumentList 'choco install -y git | Out-File C:\Users\skalu\lesson3\out.txt' -Verb runAs -Wait"

function windows(instance: instance,
  callback?: (error?: Error, data?: string | Buffer) => void): void {
  const command = [];
  // By default we use CMD in electron, we call on powershell within CMD to excecute a command
  command.push('powershell.exe -NoProfile -InputFormat None -ExecutionPolicy Bypass');
  // In order to use pipe(for logging in this case) in Powershell (basically that >> | << thing) we need to wrap all command in ""
  command.push('-Command "Start-Process');
  command.push('powershell.exe');
  command.push('-windowstyle hidden');
  command.push('-ArgumentList');
  command.push("'" + instance.command + ' | Out-File C:\\Users\\skalu\\lesson3\\out.txt' + "'" + '"')
  command.push('-Verb runAs');
  command.push('-Wait');
  const str_command = command.join(' ');
  const child = spawn(str_command, { shell: true })
  child.on('close', () => {
    callback(null, 'done')
  })
  child.stdin.end(); // Otherwise PowerShell waits indefinitely on Windows 7.
}

export { windows }
