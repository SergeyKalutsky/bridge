import { useContext, useState, useEffect } from "react"
import { RowWithButton } from "./RowWithButton"
import { HeaderPath } from "./create/HeaderPath"
import { Project } from "./types"
import { projectContext } from "./Projects"
import DeleteProjectPopUp from "./popups/DeleteProjectPopUp"
import { FcEditImage } from 'react-icons/fc'
import { ProjectMembers } from "./ProjectMembers"
import { ProjectsGithubAdd } from "./ProjectsGithubAdd"
import { ProjectsGithubToken } from "./ProjectsGithubToken"
import { InputForm, TextArea, Button, SuccessMessage, ErrorMessage } from "../common"
import _ from 'lodash'


export function ProjectInfo(): JSX.Element {
    const { updateProject, userProjects } = useContext(projectContext)
    const [hasChanges, setHasChanged] = useState(false)
    const [openDelete, setDeleteOpen] = useState(false)
    const [addGitHub, setAddGitHub] = useState(false)
    const [changeGitHubToken, setChangeGitHubToken] = useState(false)
    const [newProject, setNewProject] = useState<Project>(userProjects.activeProject)
    const [messageJsx, setMessageJsx] = useState<JSX.Element>()
    // const [inputData, setInputData] = useState<{ name: string, description: string }>()
    const [img, setImg] = useState<{ path: string, base64: string }>({ path: '', base64: '' })

    useEffect(() => {
        if (!_.isEqual(userProjects.activeProject, newProject)) {
            setHasChanged(true)
            return
        }
        setHasChanged(false)
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
        console.log(exist)
        if (exist) {
            setMessageJsx(<ErrorMessage text='Проект с таким именем существует' classDiv="mt-10 pr-2 pl-2 pb-2 pt-2" />) 
            return   
        }
        updateProject({ projectName: userProjects.activeProject.name, newProject })
        setMessageJsx(<SuccessMessage text='Данные успешно обновлены' classDiv="mt-10" />)
    }

    if (addGitHub) {
        return <ProjectsGithubAdd setAddGitHub={setAddGitHub} />
    }
    if (changeGitHubToken) {
        return <ProjectsGithubToken setChangeGitHubToken={setChangeGitHubToken} />
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
                                    disabled={!hasChanges}
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
                                onClick={() => setAddGitHub(true)} /> : null}
                            <RowWithButton
                                icon='github'
                                text="GitHub репо"
                                btnText={newProject.http ? 'Изменить' : 'Добавить'}
                                onClick={() => setAddGitHub(true)} />
                            {newProject.http ?
                                <RowWithButton icon='key'
                                    text="Токен"
                                    btnText={newProject.http ? 'Изменить' : 'Добавить'}
                                    onClick={() => setChangeGitHubToken(true)} /> : null}
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