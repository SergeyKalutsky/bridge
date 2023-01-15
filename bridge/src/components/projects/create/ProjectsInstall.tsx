import { createProjectProp } from './types'
import { useState, useEffect } from 'react'
import { Packages, Logs, Button, SudoPopUp} from '../../../components/common'
import { Package } from '../../../types'

const pkgsTest = [
    {
        installed: null,
        name: 'brew',
        manager: 'shell',
    }, {
        installed: null,
        name: 'python3',
        manager: 'brew',
        version: '10.0.1'
    },
    {
        installed: null,
        name: 'flask',
        manager: 'pip',
    },
    {
        installed: null,
        name: 'sqlalchemy',
        manager: 'pip',
    }]


export function ProjectsInstall({ projectCreate, setProjectCreate, setDisabled }: createProjectProp): JSX.Element {

    const [pkgs, setPkgs] = useState<Package[]>(pkgsTest)
    const [btnText, setBtnText] = useState('')
    useEffect(() => {
        setDisabled(true)
        window.pkg.check(pkgs)
        window.shared.incomingData("pkg:check", (pkgs) => {
            console.log(pkgs)
            let count = 0
            for (const pkg of pkgs) {
                if (pkg.installed === true) {
                    count += 1
                }
            }
            if (count === pkgs.length) {
                setDisabled(false)
                setBtnText('Создать')
            } else {
                setBtnText('Установить')
            }
            setPkgs(pkgs)
        });
        return () => window.shared.removeListeners('pkg:check')
    }, [])
    const onClick = () => {
        window.pkg.install(pkgs)
    }
    return (
        <>
            <span className="text-white font-medium text-2xl">Необходимые библиотеки и программы:</span>
            <Packages pkgs={pkgs} className='w-full mt-5' />
            <Logs className='bg-zinc-600 w-full mt-5' />
            <div className='flex items-center justify-center h-[40px] mt-10'>
                <div className='w-[120px] gap-y-2 h-full flex flex-row gap-x-2 items-center'>
                    <Button btnText={btnText} onClick={onClick} />
                </div>
            </div>
            <div className='mt-3'>
                <span className="text-white font-medium text-lg ">{'Лог Файл: ' + window.settings.logPath()}</span>
            </div >
            <SudoPopUp />
        </>
    )
}


