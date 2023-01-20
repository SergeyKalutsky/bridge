import { Template } from "../../types"

type Project = {
    id: number
    name: string
    islocal: boolean
    http: string
    token?: string
    description?: string
    thumbnailPath?: string
    template?: Template
    activePath?: {
        path: string
        isDirectory: boolean
    }
}

interface UserProjects {
    activeProject: Project
    projectList: Project[]
}

interface Member {
    id: number
    name: string
    iscurrent?: boolean
}


export { Project, Member, UserProjects }