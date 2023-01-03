type GitDiff = {
    filename: string
    newFile: string
    oldFile: string
}


interface Git {
    activeOid: string
    oids: string[]
    gitDiffs: GitDiff[]
}


export {
    GitDiff,
    Git
}