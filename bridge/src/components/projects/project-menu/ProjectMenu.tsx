import { Project } from "../types"
import { HeaderPath } from "../create/HeaderPath"
import { FcEditImage } from 'react-icons/fc'
import { RowWithButton } from "./RowWithButton"
import { projectContext } from "../Projects"
import DeleteProjectPopUp from "../popups/DeleteProjectPopUp"
import { ProjectMembers } from "../project-members/ProjectMembers"
import { ProjectsGithubAdd } from "./ProjectsGithubAdd"
import { ProjectsGithubToken } from "./ProjectsGithubToken"
import { useContext, useState, useEffect, useReducer } from "react"
import { InputForm, TextArea, Button, Message } from "../../common"
import _ from 'lodash'

export type Action =
    | { type: 'open', payload: Open }
    | { type: 'image', payload: { path: string, base64: string } }
    | { type: 'update', payload: ProjectMenuState }


const initialState = {
    projectHasChanged: false,
    openDeletePopUp: false,
    openChangeGitHubToken: false,
    openGitHub: false,
    project: {
        id: null,
        islocal: true,
        name: '',
        description: '',
        http: '',
        thumbnailPath: '',
        template: null,
        token: ''
    },
    base64: ''
}

interface Open {
    projectHasChanged?: boolean,
    openDeletePopUp?: boolean,
    openChangeGitHubToken?: boolean,
    openGitHub?: boolean
}
interface ProjectMenuState {
    projectHasChanged?: boolean,
    openDeletePopUp?: boolean,
    openChangeGitHubToken?: boolean,
    openGitHub?: boolean
    base64: string
    project: Project
}

function reducer(state: ProjectMenuState, action: Action) {
    switch (action.type) {
        case 'open':
            return { ...state, ...action.payload }
        case 'image':
            return {
                ...state,
                base64: action.payload.base64,
                project: { ...state.project, thumbnailPath: action.payload.path }
            }
        case 'update':
            return action.payload
    }
}

export function ProjectMenu(): JSX.Element {
    const { updateProject, userProjects } = useContext(projectContext)
    const [state, dispatch] = useReducer(reducer, initialState)
    const [messageJsx, setMessageJsx] = useState<JSX.Element>()

    useEffect(() => {
        // checks if the changes 
        if (!_.isEqual(userProjects.activeProject, state.project)) {
            dispatch({ type: 'open', payload: { projectHasChanged: true } })
            return
        }
        dispatch({ type: 'open', payload: { projectHasChanged: false } })
    }, [state.project])

    useEffect(() => {
        // Updates project if active project has been changed
        const initProject = async () => {
            dispatch({
                type: 'update',
                payload: {
                    ...state,
                    project: userProjects.activeProject,
                    base64: await window.projects.loadimagebase64(userProjects.activeProject.thumbnailPath)
                }
            })
        }
        initProject()
    }, [userProjects.activeProject])

    useEffect(() => {
        // Loads thumb image for a project
        window.shared.incomingData("dialogue:openimagefile", async (filepath: string) => {
            dispatch({
                type: 'image',
                payload: {
                    path: filepath,
                    base64: await window.projects.loadimagebase64(filepath)
                }
            })
        });
        return () => window.shared.removeListeners('dialogue:openimagefile')
    }, [])

    function onSaveChangeClick() {
        const exist = userProjects.projectList.filter((project) => project.name === state.project.name).length > 0
            && state.project.name !== userProjects.activeProject.name
        if (exist) {
            setMessageJsx(<Message type='error' text='Проект с таким именем существует' className="mt-10 pr-2 pl-2 pb-2 pt-2" />)
            return
        }
        updateProject({ projectName: userProjects.activeProject.name, newProject: state.project })
        setMessageJsx(<Message type='success' text='Данные успешно обновлены' className="mt-10" />)
    }

    if (state.openGitHub) {
        return <ProjectsGithubAdd dispatch={dispatch} />
    }
    if (state.openChangeGitHubToken) {
        return <ProjectsGithubToken dispatch={dispatch} />
    }
    return (
        <>
            <div className="w-full h-full">
                <HeaderPath path='Информация о проекте' />
                <div className='bg-zinc-500 flex flex-col h-[calc(100%-28px)] items-center justify-center overflow-scroll'>
                    <div className='w-3/5 h-full'>
                        <div className='w-full h-4/7 gap-y-4 flex flex-col'>
                            <div className='w-full'>
                                {messageJsx}
                                <img src={`data:image/jpeg;base64,${state.base64}`} alt="" className="w-full hover:cursor-pointer mb-5" onClick={() => { window.dialogue.openImageFile() }} />
                                <div className='w-full flex justify-center items-center'>
                                    {state.base64 ?
                                        null :
                                        <FcEditImage style={{ marginBottom: 35, width: 150, height: 170, cursor: 'pointer' }}
                                            onClick={() => { window.dialogue.openImageFile() }} />
                                    }
                                </div>
                                <InputForm
                                    type="text"
                                    placeholder='Название'
                                    classInput='border-none pl-4'
                                    value={state.project?.name}
                                    onChange={(e) => { dispatch({ type: 'update', payload: { ...state, project: { ...state.project, name: e.target.value } } }) }}
                                />
                            </div>
                            <div className='w-full flex flex-col'>
                                <TextArea
                                    placeholder='Описание'
                                    value={state.project?.description}
                                    onChange={(e) => { dispatch({ type: 'update', payload: { ...state, project: { ...state.project, description: e.target.value } } }) }}
                                />
                            </div>
                            <div className={`w-full h-[55px] flex justify-between items-center bg-zinc-600/20 shadow-sm rounded-lg`}>
                                <div className="ml-4 flex justify-start items-center">
                                </div>
                                <Button
                                    disabled={!state.projectHasChanged}
                                    onClick={onSaveChangeClick}
                                    className="mr-3 pt-0 pb-0 pr-2 pl-2" h={40}
                                    theme='teal' btnText='Cохранить' />
                            </div>
                            {state.project?.http ? <ProjectMembers /> : null}
                            <RowWithButton
                                icon='folder'
                                text="Открыть проект в файловом проводнике"
                                btnText="Открыть" onClick={() => window.projects.openSystemFolder()} />
                            {state.project?.http ? <RowWithButton
                                icon='share'
                                text="Ссылка на проект"
                                btnText='Поделиться'
                                onClick={() => dispatch({ type: 'open', payload: { openGitHub: true } })} /> : null}
                            <RowWithButton
                                icon='github'
                                text="GitHub репо"
                                btnText={state.project?.http ? 'Изменить' : 'Добавить'}
                                onClick={() => dispatch({ type: 'open', payload: { openGitHub: true } })} />
                            {state.project?.http ?
                                <RowWithButton icon='key'
                                    text="Токен"
                                    btnText={state.project?.http ? 'Изменить' : 'Добавить'}
                                    onClick={() => dispatch({ type: 'open', payload: { openChangeGitHubToken: true } })} /> : null}
                            <RowWithButton icon='trash'
                                className='mb-10'
                                text="Удалить проект навсегда"
                                btnText="Удалить"
                                btnTheme="danger" onClick={() => dispatch({ type: 'open', payload: { openDeletePopUp: true } })} />
                        </div>
                    </div>
                </div>
            </div>
            <DeleteProjectPopUp
                projectDelete={userProjects.activeProject}
                open={state.openDeletePopUp}
                onClose={() => { dispatch({ type: 'open', payload: { openDeletePopUp: false } }) }} />
        </>
    )
}