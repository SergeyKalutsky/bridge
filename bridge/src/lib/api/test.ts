import path from 'path'

const newPath = "C:\\Users\\skalu\\AppData\\Roaming\\bridge\\storage\\guest\\test"
const oldPath = "C:\\Users\\skalu\\AppData\\Roaming\\bridge\\storage\\guest\\plain"
const activePath = "C:\\Users\\skalu\\AppData\\Roaming\\bridge\\storage\\guest\\plain\\main.py"

let endPath = activePath.replace(path.parse(oldPath).dir, '') 
endPath = endPath.replace(path.parse(endPath).dir, '')
path.join(newPath, endPath)
console.log(path.join(newPath, endPath))