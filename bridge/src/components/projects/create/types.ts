import { Project } from "../types"

export interface createProjectProp {
    projectCreate: Project,
    setProjectCreate: React.Dispatch<React.SetStateAction<Project>>
    setDisabled: React.Dispatch<React.SetStateAction<boolean>>
}