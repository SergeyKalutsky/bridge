import { Project } from '../types'

interface Prop {
    projectCreate: Project,
    setProjectCreate: React.Dispatch<React.SetStateAction<Project>>
}

export function ProjectsSelectType({ projectCreate, setProjectCreate }: Prop) {
    return (
        <>{projectCreate.name}</>
    )
}