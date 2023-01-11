import { Project } from '../types'
import { useState, useEffect } from 'react'
import { Packages, Logs, Button } from '../../../components/common'

interface Prop {
    projectCreate: Project,
    setProjectCreate: React.Dispatch<React.SetStateAction<Project>>
}


export function ProjectsInstall({ projectCreate, setProjectCreate }: Prop): JSX.Element {
    // const [pkgs, setPkgs] = useState<Package[]>(templates[libs[0]].pkgs)
    useEffect(() => {
        // window.pkg.check(templates[libs[0]].pkgs)
        window.shared.incomingData("pkg:check", (pkgs) => {
            let count = 0
            for (const pkg of pkgs) {
                if (pkg.installed === true) {
                    count += 1
                }
            }
            if (count === pkgs.length) {
                // setVisible(false)
                // setBtnText('Создать')
            } else {
                // setBtnText('Установить')
            }
            // setPkgs(pkgs)
        });
        return () => window.shared.removeListeners('pkg:check')
    }, [])
    return (
        <>
            {/* <Packages pkgs={pkgs} className='w-[200px]' /> */}
            <Logs className='bg-zinc-600 w-[450px] mt-2' />
            <div className='w-full gap-y-2 h-1/6 flex flex-row mt-2 gap-x-2 items-center'>
                <Button />
            </div>
            < div >
                <span className="text-white font-medium text-sm">{'Лог Файл: ' + window.settings.logPath()}</span>
            </div >
        </>
    )
}


