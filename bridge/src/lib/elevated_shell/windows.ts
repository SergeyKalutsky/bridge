import { spawn } from 'child_process';

interface instance {
  command: string,
}

function windows(instance: instance): void {
  const command = [];
  command.push('powershell.exe');
  command.push('-NoProfile');
  command.push('-InputFormat None');
  command.push('-ExecutionPolicy Bypass');
  command.push('-Command Start-Process');
  // command.push('-WindowStyle hidden');
  command.push('powershell.exe');
  command.push('-ArgumentList');
  command.push("('" + instance.command + ';' + " Read-Host ''Type ENTER to exit'' ')");
  command.push('-Verb runAs');
  const str_command = command.join(' ');
  console.log(str_command)
  const child = spawn(str_command, { shell: true })
  child.stdin.end(); // Otherwise PowerShell waits indefinitely on Windows 7.
}

export { windows }
