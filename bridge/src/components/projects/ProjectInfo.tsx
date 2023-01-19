import { InputForm, Button, TextArea } from "../common"
import { useContext, useState, useEffect } from "react"
import { HeaderPath } from "./create/HeaderPath"
import { Project } from "./types"
import { projectContext } from "./Projects"

export function ProjectInfo({ oldProject }: { oldProject: Project }): JSX.Element {
    const { updateProject } = useContext(projectContext)
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
                                        <Button w={300} btnText='Загрузить изображение' onClick={() => { window.dialogue.openImageFile() }} />
                                    }

                                </div>
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