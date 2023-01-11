import { createProjectProp } from './types'


export function ProjectsSelectType({ projectCreate, setProjectCreate, setDisabled }: createProjectProp) {
    return (
        <>{projectCreate.name}</>
    )
}