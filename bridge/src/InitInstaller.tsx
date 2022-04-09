import { PackageSpan } from "./components/common";
import { useRef, useEffect, useState } from "react";
import { Button } from "./components/common"
import { LoadingIcon, LogoIcon } from './components/common/Icons';
import { Package } from './types'

interface Props {
    setIsFirstLoad: React.Dispatch<React.SetStateAction<boolean>>
}


const startInfo = <><LoadingIcon />Проверяем установлены ли программы...</>

const pkgsToInstall = [
    {
        installed: null,
        name: 'choco',
        manager: 'custom',
    },
    {
        installed: null,
        name: 'git',
        manager: 'choco'
    },
]

const InitInstaller = ({ setIsFirstLoad }: Props): JSX.Element => {
    const [pkgsMenu, setPkgsMenu] = useState<JSX.Element[]>(null)
    const [info, setInfo] = useState<JSX.Element>(startInfo)
    const [logs, setLogs] = useState<JSX.Element[]>([])
    const [pkgs, setPkgs] = useState<Package[]>(pkgsToInstall)
    const [disabled, setDisabled] = useState(true)
    const ref = useRef(null)

    useEffect(() => {
        window.shared.incomingData("pkg:getlogs", (data: string) => {
            const logs = data.split(/\r?\n/)
            setLogs(logs.map((log: string, indx: number) => <p key={indx} className="text-white font-medium ml-3">{log}</p>))
        });

        return () => window.shared.removeListeners('pkg:getlogs')
    }, [])

    useEffect(() => {
        window.pkg.check(pkgs)
        window.shared.incomingData("pkg:check", (pkgs) => {
            setPkgs(pkgs)
        });
        return () => window.shared.removeListeners('pkg:check')
    }, [])

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
    });

    useEffect(() => {
        console.log(pkgs)
        for (const pkg of pkgs) {
            if (pkg.installed === null) {
                return
            }
        }
        setInfo(<>Проверка завершена</>)
        setDisabled(false)
    }, [pkgs])

    const handleClick = () => {
        // if (gitInstalled && chocoInstalled) {
        //     setIsFirstLoad(false)
        //     return
        // }
        setDisabled(true)
        setInfo(<><LoadingIcon />Выполняется установка не закрывайте окно...</>)
        window.pkg.install(pkgs)
    }
    useEffect(() => {
        const pkgsMenu = pkgs.map((pkg, indx) =>
            <PackageSpan key={indx} icon={pkg.installed ? 'installed' : 'not installed'}>{pkg.name}</PackageSpan>
        )
        setPkgsMenu(pkgsMenu)
    }, [pkgs])
    return (
        <div className="w-full h-full flex flex-col gap-2 items-center justify-center bg-slate-900">
            <LogoIcon />
            <div className="w-full h-3/5 flex flex-col items-center gap-4">
                <span className="text-white font-medium text-3xl text-ellipsis overflow-hidden whitespace-nowrap">Для работы 🌉Bridge требуется установка стороних программ</span>
                <span className="text-white font-medium text-2xl flex flex-row items-center justify-center">{info}</span>
                <div className="flex flex-col">
                    {pkgsMenu}
                </div>
                <div className="w-3/4 h-2/5 flex justify-center flex-col overflow-scroll bg-slate-800" >
                    {logs}
                    <div ref={ref} />
                </div>
                <div className="w-full h-1/6 flex items-center justify-center">
                    <Button onClick={handleClick} disabled={disabled}>
                        Установить
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default InitInstaller