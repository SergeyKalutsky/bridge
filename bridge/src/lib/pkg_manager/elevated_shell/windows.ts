import { exec } from 'child_process'
import util from 'util'
import { instance } from './types'


const promisifiedExec = util.promisify(exec);

async function windows(instance: instance): Promise<void> {
  console.log(instance)
  const command = [];
  // By default we use CMD in electron, we call on powershell within CMD to excecute a command
  command.push('powershell.exe -NoProfile -InputFormat None -ExecutionPolicy Bypass');
  // In order to use pipe(for logging in this case) in Powershell (basically that >> | << thing) we need to wrap all command in ""
  command.push('-Command "Start-Process');
  command.push('powershell.exe');
  command.push('-windowstyle hidden');
  command.push('-ArgumentList');
  command.push("' & {")
  command.push(instance.command)
  // Log output of installation
  // -force *>> pipes all powershell output to a log file
  command.push(`} -force *>>  ${instance.path}`)
  // Waits to press Enter before close for Debugging
  // command.push("Read-Host ''Type ENTER to exit''")
  command.push("'")
  if (instance.elevate) {
    command.push('-Verb runAs');
  }
  command.push('-Wait');
  command.push('"')
  const strCommand = command.join(' ');
  console.log(strCommand)
  await promisifiedExec(strCommand)
}

export { windows }
