import { Template } from "../../types"

type Project = {
    id: number
    name: string
    islocal: boolean
    http: string
    description?: string
    thumbnailPath?: string
    template?: Template
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