import { Button } from '../../common'
import { InputForm, ErrorMessage } from '../../common'
import { useState, useEffect, useContext } from 'react'
import { projectCreateContext } from './ProjectsCreate'


function isLatinString({ s }: { s: string }): boolean {
    for (let i = s.length; i--;) {
        if (s[i] >= '0' && s[i] <= '9') return true
        if (s.charCodeAt(i) < 65 || s.charCodeAt(i) > 122) return false
    }
    return true
}

function projectNameError({ name }: { name: string }): string {
    if (name === '') {
        return 'Название проекта не может быть пустым'
    }
    if (name.includes(' ')) {
        return 'Название проекта не может содержать пробелы'
    }
    if (!isLatinString({ s: name })) {
        return 'Название может содержать только латинские буквы и цифры'
    }
    for (const local of window.projects.getLocalProjectsNames()) {
        if (name === local) {
            return 'Проект с таким именем уже есть'
        }
    }
    return ''
}


export function ProjectsDescription(): JSX.Element {
    const { projectCreate, setProjectCreate, setDisabled } = useContext(projectCreateContext)
    const [repo, setRepo] = useState('')
    const [imgPath, setImagePath] = useState('')
    const [error, setError] = useState<JSX.Element>(null)
    const [imgBase64, setImgBase64] = useState('')

    useEffect(() => {
        setProjectCreate({ ...projectCreate, name: repo, thumbnailPath: imgPath })
    }, [repo, imgPath])

    useEffect(() => {
        const setImage = async () => {
            if (projectCreate.thumbnailPath) {
                const imgBase64 = await window.projects.loadimagebase64(projectCreate.thumbnailPath)
                setImgBase64(imgBase64)
            }
        }
        setImage()
        if (projectCreate.name) {
            setRepo(projectCreate.name)
            return
        }
        setDisabled(true)
    }, [])

    const onChange = (e) => {
        setRepo(e.target.value)
        const error = projectNameError({ name: e.target.value })
        if (error) {
            setError(<ErrorMessage text={error} classDiv='pt-2 pb-2 pr-2 pl-2' />)
            setDisabled(true)
            return
        }
        setError(null)
        setDisabled(false)
    }
    useEffect(() => {
        window.shared.incomingData("dialogue:openimagefile", async (filepath: string) => {
            setImagePath(filepath)
            const imgBase64 = await window.projects.loadimagebase64(filepath)
            setImgBase64(imgBase64)
        });
        return () => window.shared.removeListeners('dialogue:openimagefile')
    }, [])
    return (
        <div className='w-full h-4/7 gap-y-4 flex flex-col'>
            {error ? error : <div className='w-full h-[40px]'></div>}
            <div className='w-full'>
                <InputForm
                    type="text"
                    placeholder='Название'
                    classInput='border-none pl-4'
                    value={repo}
                    onChange={onChange} />
            </div>
            <textarea placeholder='Описание'
                className='w-full pl-4 pt-2 bg-zinc-50 placeholder-slate-500 font-medium text-slate-700 h-[150px] text-xl rounded-lg focus:outline-none'
                onChange={(e) => { setProjectCreate({ ...projectCreate, description: e.target.value }) }}
                value={projectCreate.description}
            />
            <div className='w-full flex flex-col'>

                <img src={`data:image/jpeg;base64,${imgBase64}`} alt="" className="w-full hover:cursor-pointer pb-5" onClick={() => { window.dialogue.openImageFile() }} />
                <div className='w-full flex justify-center items-center'>
                    <div className='w-1/2 h-[40px]'>
                        {imgBase64 ?
                            null :
                            <Button width={24} btnText='Загрузить изображение' onClick={() => { window.dialogue.openImageFile() }} />
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}   