import { PackageSpan } from "./components/common";
import { useRef, useEffect, useState } from "react";
import { Button } from "./components/common"
import { LoadingIcon, LogoIcon } from './components/common/Icons';

interface Props {
    setIsFirstLoad: React.Dispatch<React.SetStateAction<boolean>>
}

const startInfo = <><LoadingIcon />Проверяем установлены ли программы...</>

const InitInstaller = ({ setIsFirstLoad }: Props): JSX.Element => {
    const [logFileName, setLogFileName] = useState<string>()
    const [info, setInfo] = useState<JSX.Element>(startInfo)
    const [logs, setLogs] = useState<JSX.Element[]>([])
    const [gitInstalled, setGitInstalled] = useState(false)
    const [chocoInstalled, setChocoInstalled] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        window.shared.incomingData("pkg:getlogs", (data: string) => {
            const logs = data.split(/\r?\n/)
            setLogs(logs.map((log: string, indx: number) => <p key={indx} className="text-white font-medium ml-3">{log}</p>))
        });

        return () => window.shared.removeListeners('pkg:getlogs')
    }, [])

    useEffect(() => {
        window.shared.incomingData("pkg:check", (data) => {
            switch (data.pkg) {
                case 'git':
                    setGitInstalled(data.installed)
                    break
                case 'choco':
                    setChocoInstalled(data.installed)
            }
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
            if (logFileName !== undefined) {
                window.pkg.getlogs()
            }
        }, 1000)

        return () => clearInterval(fileContent);
    }, [logFileName]);

    useEffect(() => {
        if (gitInstalled !== null && chocoInstalled !== null) {
            setInfo(<>Проверка завершена</>)
            setDisabled(false)
        }
    }, [gitInstalled, chocoInstalled])

    const handleClick = () => {
        if (gitInstalled && chocoInstalled) {
            setIsFirstLoad(false)
            return
        }
        const pkgs = []
        if (!chocoInstalled) { pkgs.push('custom choco') }
        if (!gitInstalled) { pkgs.push('choco git') }
        setDisabled(true)
        setInfo(<><LoadingIcon />Выполняется установка не закрывайте окно...</>)
        console.log(pkgs)
        window.pkg.install(['custom choco'])
    }
    return (
        <div className="w-full h-full flex flex-col gap-2 items-center justify-center bg-slate-900">
            <LogoIcon />
            <div className="w-full h-3/5 flex flex-col items-center gap-4">
                <span className="text-white font-medium text-3xl text-ellipsis overflow-hidden whitespace-nowrap">Для работы 🌉Bridge требуется установка 🍫choco и 🔀git</span>
                <span className="text-white font-medium text-2xl flex flex-row items-center justify-center">{info}</span>
                <div className="flex flex-col">
                    <PackageSpan icon={chocoInstalled ? 'installed' : 'not installed'}>Chocolotey</PackageSpan>
                    <PackageSpan icon={gitInstalled ? 'installed' : 'not installed'}>Git</PackageSpan>
                </div>
                <div className="w-3/4 h-2/5 flex justify-center flex-col overflow-scroll bg-slate-800" >
                    {logs}
                    <div ref={ref} />
                </div>
                <div className="w-full h-1/6 flex items-center justify-center">
                    <Button onClick={handleClick} disabled={disabled}>
                        {gitInstalled && chocoInstalled ? 'Продолжить' : 'Установить'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default InitInstaller