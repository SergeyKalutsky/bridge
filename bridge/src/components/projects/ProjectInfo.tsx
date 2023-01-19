import { InputForm, Button, TextArea } from "../common"
import { useContext, useState, useEffect } from "react"
import { HeaderPath } from "./create/HeaderPath"
import { projectContext } from "./Projects"
import { Project } from "./types"

export function ProjectInfo(): JSX.Element {
    const { userProjects } = useContext(projectContext)
    const [project, setProject] = useState<Project>(null)
    const [img, setImg] = useState<{ path: string, base64: string }>({ path: '', base64: '' })

    useEffect(() => {
        setProject({ ...project, thumbnailPath: img.path })
    }, [img])

    useEffect(() => {
        setProject(userProjects?.activeProject)
    }, [userProjects])

    useEffect(() => {
        const loadBase64 = async () => {
            if (project?.thumbnailPath) {
                setImg({ ...img, base64: await window.projects.loadimagebase64(project.thumbnailPath) })
            }
        }
        loadBase64()
        window.shared.incomingData("dialogue:openimagefile", async (filepath: string) => {
            setImg({ path: filepath, base64: await window.projects.loadimagebase64(filepath) })
        });
        return () => window.shared.removeListeners('dialogue:openimagefile')
    }, [])

    if (!project) {
        return null
    }
    return (
        <div className="w-full h-full">
            <HeaderPath path='Информация о проекте' />
            <div className='bg-zinc-500 flex flex-col h-[calc(100%-28px)] items-center justify-center overflow-scroll'>
                <div className='w-3/5 h-4/5'>
                    <div className='w-full h-4/7 gap-y-4 flex flex-col'>
                        <div className='w-full'>
                            <img src={`data:image/jpeg;base64,${img.base64}`} alt="" className="w-full hover:cursor-pointer pb-5" onClick={() => { window.dialogue.openImageFile() }} />
                            <div className='w-full flex justify-center items-center'>
                                <div className='w-1/2 h-[40px]'>
                                    {img.base64 ?
                                        null :
                                        <Button width={24} btnText='Загрузить изображение' onClick={() => { window.dialogue.openImageFile() }} />
                                    }

                                </div>
                            </div>
                            <InputForm
                                type="text"
                                placeholder='Название'
                                classInput='border-none pl-4'
                                value={project?.name}
                                onChange={(e) => { setProject({ ...project, name: e.target.value }) }}
                            />
                        </div>
                        <div className='w-full flex flex-col'>
                            <TextArea
                                placeholder='Описание'
                                value={project?.description}
                                onChange={(e) => { setProject({ ...project, description: e.target.value }) }}
                            />
                        </div>
                        <span>Члены проекта</span>
                        <div className='w-full h-[200px] flex flex-col bg-amber-200 rounded-sm'>
                            {/* Члены проекта  */}
                        </div>
                        <div className='w-full h-[100px] flex justify-between items-center border-2 border-slate-800 rounded-sm'>
                            <span>Путь в системе до проекта:</span>
                            <Button btnText="Открыть" onClick={() => window.projects.openSystemFolder()} />
                        </div>
                        <div className='w-full flex justify-between items-center'>
                            <span>Удаленный серевер</span>
                            <Button btnText="Добавить/Изменить" />
                        </div>
                        <div className='w-full flex justify-between items-center'>
                            <span>Токен для удаленного сервера</span>
                            <Button btnText="Добавить/Изменить" />
                        </div>
                        <div className='w-full flex justify-between items-center'>
                            <span>Удалить проект</span>
                            <Button btnText="Удалить" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}