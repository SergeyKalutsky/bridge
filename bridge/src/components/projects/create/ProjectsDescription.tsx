import { InputForm, ErrorMessage, Button, TextArea } from '../../common'
import { useState, useEffect, useContext } from 'react'
import { projectCreateContext } from './ProjectsCreate'


function isLatinString({ s }: { s: string }): boolean {
    for (let i = s.length; i--;) {
        if ((s[i] >= '0' && s[i] <= '9') || s[i] === '-') return true
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
        return 'Название содержит недопустимые символы'
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
    const [img, setImg] = useState<{ path: string, base64: string }>({ path: '', base64: '' })
    const [error, setError] = useState<JSX.Element>(null)

    useEffect(() => {
        setDisabled(!(repo && !error))
        setProjectCreate({ ...projectCreate, name: repo, thumbnailPath: img.path })
    }, [repo, img, error])

    useEffect(() => {
        const loadBase64 = async () => {
            if (projectCreate.thumbnailPath) {
                setImg({ ...img, base64: await window.projects.loadimagebase64(projectCreate.thumbnailPath) })
            }
        }
        loadBase64()
        if (projectCreate.name) {
            setRepo(projectCreate.name)
        }
        window.shared.incomingData("dialogue:openimagefile", async (filepath: string) => {
            setImg({ path: filepath, base64: await window.projects.loadimagebase64(filepath) })
        });
        return () => window.shared.removeListeners('dialogue:openimagefile')
    }, [])

    const onChange = (e) => {
        setRepo(e.target.value)
        const error = projectNameError({ name: e.target.value })
        if (error) {
            setError(<ErrorMessage text={error} classDiv='pt-2 pb-2 pr-2 pl-2' />)
            return
        }
        setError(null)
    }
    return (
        <div className='w-full h-4/7 gap-y-4 flex flex-col'>
            {error ? error : <div className='w-full h-[40px]'></div>}
            <div className='w-full'>
                <InputForm
                    type="text"
                    placeholder='Название'
                    classInput='border-none pl-4'
                    value={repo}
                    onChange={onChange}
                />
            </div>
            <div className='w-full flex flex-col'>
                <TextArea
                    placeholder='Описание'
                    value={projectCreate.description}
                    onChange={(e) => { setProjectCreate({ ...projectCreate, description: e.target.value }) }}
                />
                <img src={`data:image/jpeg;base64,${img.base64}`} alt="" className="w-full hover:cursor-pointer pb-5" onClick={() => { window.dialogue.openImageFile() }} />
                <div className='w-full flex justify-center items-center'>
                    <div className='w-1/2 h-[40px]'>
                        {img.base64 ?
                            null :
                            <Button width={24} btnText='Загрузить изображение' onClick={() => { window.dialogue.openImageFile() }} />
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}   