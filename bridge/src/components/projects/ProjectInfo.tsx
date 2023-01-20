import { InputForm, Button, TextArea } from "../common"
import { useContext, useState, useEffect } from "react"
import { RowWithButton } from "./RowWithButton"
import { HeaderPath } from "./create/HeaderPath"
import { Project } from "./types"
import { projectContext } from "./Projects"
import DeleteProjectPopUp from "./popups/DeleteProjectPopUp"
import { FcEditImage } from 'react-icons/fc'


export function ProjectInfo({ oldProject }: { oldProject: Project }): JSX.Element {
    const { updateProject } = useContext(projectContext)
    const [openDelete, setDeleteOpen] = useState(false)
    const [newProject, setNewProject] = useState<Project>(oldProject)
    const [img, setImg] = useState<{ path: string, base64: string }>({ path: '', base64: '' })

    useEffect(() => {
        setNewProject({ ...newProject, thumbnailPath: img.path })
    }, [img])

    useEffect(() => {
        setNewProject({ ...oldProject })
        const loadBase64 = async () => {
            if (oldProject.thumbnailPath) {
                setImg({ ...img, base64: await window.projects.loadimagebase64(oldProject.thumbnailPath) })
            } else {
                setImg({ path: '', base64: '' })
            }
        }
        loadBase64()
    }, [oldProject])

    useEffect(() => {
        window.shared.incomingData("dialogue:openimagefile", async (filepath: string) => {
            setImg({ path: filepath, base64: await window.projects.loadimagebase64(filepath) })
        });
        return () => window.shared.removeListeners('dialogue:openimagefile')
    }, [])

    return (
        <>
            <div className="w-full h-full">
                <HeaderPath path='Информация о проекте' />
                <div className='bg-zinc-500 flex flex-col h-[calc(100%-28px)] items-center justify-center overflow-scroll'>
                    <div className='w-3/5 h-full'>
                        <div className='w-full h-4/7 gap-y-4 flex flex-col'>
                            <div className='w-full'>
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
                            <span>Члены проекта</span>
                            <div className='w-full h-[200px] flex flex-col bg-zinc-400 rounded-lg'>
                                {/* Члены проекта  */}
                            </div>
                            <RowWithButton icon='folder' text="Открыть проект в файловом проводнике" btnText="Открыть" onClick={() => window.projects.openSystemFolder()} />
                            <RowWithButton icon='github' text="GitHub репо" btnText={newProject.http ? 'Изменить' : 'Добавить'} />
                            {newProject.http ? <RowWithButton icon='key' text="Токен" btnText={newProject.http ? 'Изменить' : 'Добавить'} /> : null}
                            <RowWithButton icon='trash' className='mb-10' text="Удалить проект навсегда" btnText="Удалить" btnTheme="danger" onClick={() => { setDeleteOpen(true) }} />
                        </div>
                    </div>
                </div>
            </div>
            <DeleteProjectPopUp
                projectDelete={oldProject}
                open={openDelete}
                setOpen={setDeleteOpen} />
        </>
    )
}