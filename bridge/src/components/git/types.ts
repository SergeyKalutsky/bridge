type GitDiff = {
    filename: string
    newFile: string
    oldFile: string
}

type Commit = {
    author_email?: string,
    author_name?: string,
    body?: string,
    date?: string,
    hash?: string,
    message?: string,
    refs?: string,
    activeHashRow?: string,
}



export {
    GitDiff,
    Commit
}