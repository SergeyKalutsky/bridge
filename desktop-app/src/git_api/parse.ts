import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git'

const git: SimpleGit = simpleGit();

const test = 'diff --git a/desktop-app/src/assets/css/ProjectsMenu.css b/desktop-app/src/assets/css/ProjectsMenu.css'

const handleFnc = (diffOutput: string) => {
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
  console.log(files[0])
}


git.show('7af75457c444960d69c47ad44cacd3676298d22c')
  .then(result => handleFnc(result));
