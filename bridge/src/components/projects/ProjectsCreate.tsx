import { useState, useRef, useEffect } from 'react'
import { Project } from './types'
import { InputForm, Button } from '../common'
import { LoadingIcon } from '../common/Icons'
import templates from './templates'
import { createProject } from '../../lib/api/gitlab'

interface Prop {
    addProject: (project: Project) => void
}

const libs = ['Python', 'Python Flask', 'Python Discord', 'Python Pgzero']
const dummyProject: Project = {
    id: null,
    islocal: true,
    name: '',
    description: '',
    isclassroom: 0,
    http: templates[libs[0]].http
}

const ProjectsCreate = ({ addProject }: Prop): JSX.Element => {
    // const [checked, setChecked] = useState<number>(0)
    const [visible, setVisible] = useState(false)
    const [logs, setLogs] = useState<JSX.Element[]>([])
    const [pkgs, setPkgs] = useState(templates[libs[0]].lib)
    const [option, setOption] = useState('Python')
    const [project, setProject] = useState<Project>(dummyProject)
    const ref = useRef(null)

    const handleClick = () => {
        console.log(project)
        setVisible(true)
        addProject(project)
        window.pkg.install(pkgs)
    }

    useEffect(() => {
        window.shared.removeListeners('pkg:getlogs')
        window.shared.incomingData("pkg:getlogs", (data: string) => {
            const logs = data.split(/\r?\n/)
            setLogs(logs.map((log: string, indx: number) => <p key={indx} className="text-white font-medium ml-3">{log}</p>))
        });
    })

    useEffect(() => {
        const scrollToBottom = () => {
            ref.current.scrollIntoView({
                behavior: "smooth", block: 'end',
                inline: 'nearest'
            })
        }
        scrollToBottom()
    }, [logs])

    useEffect(() => {
        const fileContent = setInterval(() => {
            window.pkg.getlogs()
        }, 1000)

        return () => clearInterval(fileContent);
    }, []);

    const options = libs.map((option, indx) =>
        <option value={indx} key={option}>
            {option}
        </option>
    )
    const loadInfo = <><LoadingIcon />
        <div className='text-lg text-slate-50 font-medium'>Создание/установка проекта...</div></>
    return (
        <>
            <h1 className='font-medium bg-zinc-500 pl-2 text-xl text-gray-200 underline'>Создание проекта</h1>
            <div className='bg-zinc-500 flex flex-col h-full items-center justify-center'>
                <div className='w-3/5 h-1/2'>
                    <div className='w-full gap-y-5 flex flex-col'>
                        <InputForm type="text" placeholder='Название'
                            onChange={(e) => { setProject({ ...project, name: e.target.value }) }} />
                        <textarea placeholder='Описание' className='w-full h-[150px] text-xl rounded-lg focus:outline-none'
                            onChange={(e) => { setProject({ ...project, description: e.target.value }) }} />
                    </div>
                    <div className='w-full gap-y-2 flex flex-col mt-2'>
                        {/* <div>
                            <input type="checkbox"
                                className='scale-150'
                                checked={checked == 0}
                                onChange={() => { setChecked(0); setProject({ ...project, isclassroom: 0 }) }} />
                            <label className='ml-2 text-xl font-medium text-white'>Личный проект</label>
                        </div>
                        <div>
                            <input type="checkbox"
                                className='scale-150'
                                checked={checked == 1}
                                onChange={() => { setChecked(1); setProject({ ...project, isclassroom: 1 }) }} />
                            <label className='ml-2 text-xl font-medium text-white'>Для обучения</label>
                        </div> */}
                        <div className='flex justify-center items-center w-[300px] h-[44px]'>
                            <select className="text-black w-full bg-white h-3/5 rounded-lg" value={option}
                                onChange={(e) => { 
                                    setOption(e.target.value) 
                                    setProject({ ...project, http: templates[libs[e.target.value]].http })
                                    setPkgs(templates[libs[e.target.value]].lib)
                                    }}>
                                {options}
                            </select>
                        </div>
                    </div>
                    <div className="w-full h-2/5 flex justify-center flex-col overflow-scroll bg-zinc-600 mb-2" >
                        {logs}
                        <div ref={ref} />
                    </div>
                    <div className='w-full gap-y-2 flex flex-row mt-2 gap-x-2 items-center'>
                        <Button onClick={handleClick} btnText='Создать' />
                        {visible ? loadInfo : null }
                    </div>
                </div>
            </div >
        </>
    )

}

export default ProjectsCreate