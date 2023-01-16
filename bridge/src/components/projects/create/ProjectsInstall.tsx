import { createProjectProp } from './types'
import { useState, useEffect } from 'react'
import { Packages, Logs, Button, SudoPopUp } from '../../../components/common'
import { LoadingMessage } from '../../../components/common'
import { Package } from '../../../types'


export function ProjectsInstall({ projectCreate, setProjectCreate, setDisabled }: createProjectProp): JSX.Element {
    const [pkgs, setPkgs] = useState<Package[]>(projectCreate.template.pkgs)
    const [btn, setBtn] = useState(false)
    const [loadMessage, setLoadMessage] = useState<JSX.Element>(<LoadingMessage text='Проверка устновленных библиотек' />)

    useEffect(() => {
        window.shared.incomingData("git:clone", ({ msg }: { msg: string }) => {
            if (msg === 'cloned') {
                setDisabled(false)
                setLoadMessage(null)
            }
        });
        return () => window.shared.removeListeners('git:clone')
    }, [])

    useEffect(() => {
        setDisabled(true)
        console.log(pkgs)
        window.pkg.check(pkgs)
        window.shared.incomingData("pkg:check", (pkgs) => {
            let count = 0
            for (const pkg of pkgs) {
                if (pkg.installed === true) {
                    count += 1
                }
            }
            if (count === pkgs.length) {
                setLoadMessage(<LoadingMessage text='Клонируем шаблон проекта' />)
                window.git.clone({ repo: projectCreate.name, git_url: projectCreate.template.http })
                setPkgs(pkgs)
                return
            } else {
                setBtn(true)
            }
            setLoadMessage(null)
            setPkgs(pkgs)
        });
        return () => window.shared.removeListeners('pkg:check')
    }, [])
    const onClick = () => {
        setBtn(false)
        window.pkg.install(pkgs)
        setLoadMessage(<LoadingMessage text='Установка. Это может занять длительное время' />)
    }
    return (
        <>
            <span className="text-white font-medium text-2xl">Необходимые библиотеки и программы:</span>
            <Packages pkgs={pkgs} className='w-full mt-5' />
            <Logs className='bg-zinc-600 w-full mt-5' />
            <div className='flex items-center justify-center h-[40px] mt-4'>
                {loadMessage}
                {btn ?
                    <div className='w-[120px] gap-y-2 h-full flex flex-row items-center'><Button btnText='Установить' onClick={onClick} /></div> : null}
            </div>
            <div className='mt-20'>
                <span className="text-white font-medium text-base ">{'Лог Файл: ' + window.settings.logPath()}</span>
            </div >
            <SudoPopUp />
        </>
    )
}


