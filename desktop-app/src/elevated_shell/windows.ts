import { spawn } from 'child_process';

interface instance {
  command: string,
}
// init windows command
// `-NoProfile -InputFormat None -ExecutionPolicy Bypass -Command [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString(''https://chocolatey.org/install.ps1'')); choco install -y python; choco install -y git; choco install -y vscode; Read-Host ''Type ENTER to exit''`

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

export { windows }
