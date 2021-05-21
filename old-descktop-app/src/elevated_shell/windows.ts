import { spawn } from 'child_process';

interface instance {
  command: string,
}

function windows(instance: instance): void {
  const command = [];
  command.push('powershell.exe');
  command.push('Start-Process');
  command.push('powershell.exe');
  command.push('-Verb runAs');
  command.push('-ArgumentList');
  command.push("('" + instance.command + "')");
  const str_command = command.join(' ');
  console.log(str_command)
  const child = spawn(str_command, { shell: true })
  child.stdin.end(); // Otherwise PowerShell waits indefinitely on Windows 7.
}

const instance = { command: 'choco install -y putty.install' }

export { windows }
