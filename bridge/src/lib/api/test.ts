import fs from 'fs'
const directoryPath = '/Users/sergeykalutsky/Library/Application Support/bridge/storage/guest/test'

const files = fs.readdirSync(directoryPath, {withFileTypes: true}).map(item => item.name)
console.log(files)