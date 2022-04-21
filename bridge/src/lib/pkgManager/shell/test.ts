import { exec } from 'child_process'
import util from 'util'


const promisifiedExec = util.promisify(exec);

const func = async ()=> {
    const {stdout, stderr} = await promisifiedExec('/opt/homebrew/bin/python3 -m pip show ll')
    console.log(stdout, stderr)
}
func()