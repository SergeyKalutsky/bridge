import { spawn, exec } from 'child_process'
import  util  from 'util'


const execAsync = util.promisify(exec);

async function lsExample() {
    const cmd = `powershell.exe -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "Start-Process powershell.exe -windowstyle hidden -ArgumentList 'C:\\Python310\\python.exe -m pip install fuzzywuzzy --user | Out-File -append C:\\Users\\skalutsky\\out.txt' -Wait"`
    const { stdout, stderr } = await execAsync(cmd);
    console.log('stdout:', stdout);
    console.error('stderr:', stderr);
}
lsExample();