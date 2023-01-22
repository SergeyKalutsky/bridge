import { useContext, useState, useEffect, useReducer } from "react"
import { RowWithButton } from "./RowWithButton"
import { HeaderPath } from "../create/HeaderPath"
import { Project } from "../types"
import { projectContext } from "../Projects"
import DeleteProjectPopUp from "../popups/DeleteProjectPopUp"
import { FcEditImage } from 'react-icons/fc'
import { ProjectMembers } from "../project-members/ProjectMembers"
import { ProjectsGithubAdd } from "./ProjectsGithubAdd"
import { ProjectsGithubToken } from "./ProjectsGithubToken"
import { InputForm, TextArea, Button, SuccessMessage, ErrorMessage } from "../../common"
import _ from 'lodash'

type Action =
    | { type: 'projectHasChanged', payload: boolean }
    | { type: 'openDeletePopUp', payload: boolean }
    | { type: 'openGitHub', payload: boolean }
    | { type: 'openChangeGitHubToken', payload: boolean }


const initialState = { projectHasChanged: false, openDeletePopUp: false, openChangeGitHubToken: false, openGitHub: false }

function reducer(state: {
    projectHasChanged: boolean,
    openDeletePopUp: boolean,
    openChangeGitHubToken: boolean,
    openGitHub: boolean
},
    action: Action) {
    switch (action.type) {
        case 'projectHasChanged':
            return { ...state, projectHasChanged: action.payload }
        case 'openDeletePopUp':
            return { ...state, openDeletePopUp: action.payload }
        case 'openChangeGitHubToken':
            return { ...state, openChangeGitHubToken: action.payload }
        case 'openGitHub':
            return { ...state, openGitHub: action.payload }
    }
}

export function ProjectMenu(): JSX.Element {
    const { updateProject, userProjects } = useContext(projectContext)
    const [state, dispatch] = useReducer(reducer, initialState)
    const [newProject, setNewProject] = useState<Project>(userProjects.activeProject)
    const [messageJsx, setMessageJsx] = useState<JSX.Element>()
    const [img, setImg] = useState<{ path: string, base64: string }>({ path: userProjects.activeProject.thumbnailPath, base64: '' })

    useEffect(() => {
        if (!_.isEqual(userProjects.activeProject, newProject)) {
            dispatch({ type: 'projectHasChanged', payload: true })
            return
        }
        dispatch({ type: 'projectHasChanged', payload: false })
    }, [newProject])

    useEffect(() => {
        setNewProject({ ...newProject, thumbnailPath: img.path })
    }, [img])

    useEffect(() => {
        setNewProject({ ...userProjects.activeProject })
        const loadBase64 = async () => {
            if (userProjects.activeProject.thumbnailPath) {
                setImg({ ...img, base64: await window.projects.loadimagebase64(userProjects.activeProject.thumbnailPath) })
            } else {
                setImg({ path: '', base64: '' })
            }
        }
        loadBase64()
    }, [userProjects])

    useEffect(() => {
        window.shared.incomingData("dialogue:openimagefile", async (filepath: string) => {
            setImg({ path: filepath, base64: await window.projects.loadimagebase64(filepath) })
        });
        return () => window.shared.removeListeners('dialogue:openimagefile')
    }, [])

    function onSaveChangeClick() {
        const exist = userProjects.projectList.filter((project) => project.name === newProject.name).length > 0
            && newProject.name !== userProjects.activeProject.name
        if (exist) {
            setMessageJsx(<ErrorMessage text='Проект с таким именем существует' classDiv="mt-10 pr-2 pl-2 pb-2 pt-2" />)
            return
        }
        updateProject({ projectName: userProjects.activeProject.name, newProject })
        setMessageJsx(<SuccessMessage text='Данные успешно обновлены' classDiv="mt-10" />)
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
                                <img src={`data:image/jpeg;base64,${img.base64}`} alt="" className="w-full hover:cursor-pointer mb-5" onClick={() => { window.dialogue.openImageFile() }} />
                                <div className='w-full flex justify-center items-center'>
                                    {img.base64 ?
                                        null :
                                        <FcEditImage style={{ marginBottom: 35, width: 150, height: 170, cursor: 'pointer' }}
                                            onClick={() => { window.dialogue.openImageFile() }} />
                                    }
                                </div>
                                <InputForm
                                    type="text"
                                    placeholder='Название'
                                    classInput='border-none pl-4'
                                    value={newProject?.name}
                                    onChange={(e) => { setNewProject({ ...newProject, name: e.target.value }) }}
                                />
                            </div>
                            <div className='w-full flex flex-col'>
                                <TextArea
                                    placeholder='Описание'
                                    value={newProject?.description}
                                    onChange={(e) => { setNewProject({ ...newProject, description: e.target.value }) }}
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
                            {newProject.http ? <ProjectMembers /> : null}
                            <RowWithButton
                                icon='folder'
                                text="Открыть проект в файловом проводнике"
                                btnText="Открыть" onClick={() => window.projects.openSystemFolder()} />
                            {newProject.http ? <RowWithButton
                                icon='share'
                                text="Ссылка на проект"
                                btnText='Поделиться'
                                onClick={() => dispatch({type: 'openGitHub', payload: true})} /> : null}
                            <RowWithButton
                                icon='github'
                                text="GitHub репо"
                                btnText={newProject.http ? 'Изменить' : 'Добавить'}
                                onClick={() => dispatch({type: 'openGitHub', payload: true})} />
                            {newProject.http ?
                                <RowWithButton icon='key'
                                    text="Токен"
                                    btnText={newProject.http ? 'Изменить' : 'Добавить'}
                                    onClick={() => dispatch({type: 'openChangeGitHubToken', payload: true})} /> : null}
                            <RowWithButton icon='trash'
                                className='mb-10'
                                text="Удалить проект навсегда"
                                btnText="Удалить"
                                btnTheme="danger" onClick={() => { setDeleteOpen(true) }} />
                        </div>
                    </div>
                </div>
            </div>
            <DeleteProjectPopUp
                projectDelete={userProjects.activeProject}
                open={openDelete}
                setOpen={setDeleteOpen} />
        </>
    )
}