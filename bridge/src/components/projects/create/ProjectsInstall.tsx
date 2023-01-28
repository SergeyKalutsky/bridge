import { Package } from '../../../types'
import { projectContext } from '../Projects'
import { projectCreateContext } from './ProjectsCreate'
import { useState, useEffect, useContext } from 'react'
import { Packages, Logs, SudoPopUp, Message } from '../../../components/common'


export function ProjectsInstall(): JSX.Element {
    const { projectCreate, setDisabled } = useContext(projectCreateContext)
    const { userProjects, addProject } = useContext(projectContext)
    const [pkgs, setPkgs] = useState<Package[]>(projectCreate.template.pkgs)
    const [loadMessage, setLoadMessage] = useState<JSX.Element>(<Message type='loading' text='Проверка устновленных библиотек' />)

    useEffect(() => {
        const exist = userProjects?.projectList?.filter((project) => project.name === projectCreate.name).length
        setDisabled(!exist)
        setLoadMessage(null)
    }, [userProjects])

    useEffect(() => {
        window.shared.incomingData("git:clone", ({ msg }: { msg: string }) => {
            // Removing information not needed locally
            delete projectCreate.template.http
            delete projectCreate.template.pkgs
            projectCreate.islocal = true
            addProject(projectCreate)
        });
        return () => window.shared.removeListeners('git:clone')
    }, [])

    useEffect(() => {
        window.pkg.check(pkgs)
        window.shared.incomingData("pkg:check", (pkgs: Package[]) => {
            setPkgs(pkgs)
            const count = pkgs.filter((pkg: Package) => pkg.installed).length
            const exist = userProjects?.projectList?.filter((project) => project.name === projectCreate.name).length

            if (count === pkgs.length && !exist) {
                setLoadMessage(<Message type='loading' text='Клонируем шаблон проекта' />)
                window.git.clone({ repo: projectCreate.name, git_url: projectCreate.template.http })
                return
            }
            if (!exist) {
                window.pkg.install(pkgs)
                setLoadMessage(<Message type='loading' text='Установка. Это может занять длительное время' />)
            }
        });
        return () => window.shared.removeListeners('pkg:check')
    }, [])
    return (
        <>
            <div className='w-3/4 max-w-2xl h-4/5 flex-col justify-center items-center'>
                <span className="text-white font-medium text-2xl">Необходимые библиотеки и программы:</span>
                <Packages pkgs={pkgs} className='w-full mt-5' />
                <Logs className='bg-zinc-600 w-full mt-5' />
                <div className='flex items-center justify-center h-[40px] mt-4'>
                    {loadMessage}
                </div>
                <div className='mt-20'>
                    <span className="text-white font-medium text-base ">{'Лог Файл: ' + window.settings.logPath()}</span>
                </div >
                <SudoPopUp />
            </div>
        </>
    )
}


