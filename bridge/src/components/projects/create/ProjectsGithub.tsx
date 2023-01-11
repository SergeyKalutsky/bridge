import { Project } from '../types'

interface Prop {
    projectCreate: Project,
    setProjectCreate: React.Dispatch<React.SetStateAction<Project>>
}

export function ProjectsGithub({ projectCreate, setProjectCreate }: Prop): JSX.Element {
    return (<></>)
}