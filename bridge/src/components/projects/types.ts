type Project = {
    id: number
    name: string
    isclassroom?: number
    islocal: boolean
    http: string
    description?: string
    isactive?: boolean
}

interface Member {
    id: number
    name: string
    iscurrent?: boolean
}


export { Project, Member }