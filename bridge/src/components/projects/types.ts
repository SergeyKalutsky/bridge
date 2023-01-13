type Project = {
    id: number
    name: string
    isclassroom?: number
    islocal: boolean
    http: string
    description?: string
    typeName?: string
    thumbnailPath?: string
}

interface UserProjects {
    projects: Project[]
    activeProject: Project
}

interface Member {
    id: number
    name: string
    iscurrent?: boolean
}


export { Project, Member, UserProjects }