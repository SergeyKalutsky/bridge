import { ParsedGitDiff } from "../../components/git/types"


const parseGitDiff = (diffOutput: string): ParsedGitDiff[] => {
  const output: ParsedGitDiff[] = []
  const files: string[][] = [[]]
  let fileIndex = 0
  let doPush = false
  for (const line of diffOutput.split(/\r?\n/)) {
    if (line.substr(0, 4) === 'diff' && doPush) {
      fileIndex++
      files.push([])
      files[fileIndex].push(line)

    } else if (line.substr(0, 4) === 'diff') {
      files[fileIndex].push(line)
      doPush = true

    } else if (doPush) {
      files[fileIndex].push(line)
    }
  }
  for (const file of files) {
    const filename = file[0].split(/\r? /).slice(-1)[0].slice(1)
    const OldFileList = []
    const NewFileList = []
    for (const line of file.slice(5)) {
      if (line[0] === ' ') {
        OldFileList.push(line.slice(1))
        NewFileList.push(line.slice(1))
      } else if (line[0] === '+') {
        NewFileList.push(line.slice(1))
      } else if (line[0] === '-') {
        OldFileList.push(line.slice(1))
      }
    }
    output.push({
      filename: filename,
      oldFile: OldFileList.join("\r\n"),
      newFile: NewFileList.join("\r\n")
    })
  }
  return output
}

export default parseGitDiff