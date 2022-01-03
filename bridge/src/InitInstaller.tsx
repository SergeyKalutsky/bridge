import { PackageSpan } from "./components/common";
import { useEffect, useState } from "react";
import { Button } from "./components/common"
import { LoadingIcon, LogoIcon } from './components/common/Icons';

interface Props {
    setIsFirstLoad: React.Dispatch<React.SetStateAction<boolean>>
}

const startInfo = <><LoadingIcon />Проверяем установлены ли программы...</>

const InitInstaller = ({ setIsFirstLoad }: Props): JSX.Element => {
    const [info, setInfo] = useState<JSX.Element>(startInfo)
    const [gitInstalled, setGitInstalled] = useState(false)
    const [chocoInstalled, setChocoInstalled] = useState(false)
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        window.pkg.checkInstall(['git', 'choco'])

        window.shared.incomingData("pkg:check", (data) => {
            switch (data.pkg) {
                case 'git':
                    setGitInstalled(data.installed)
                    break
                case 'choco':
                    setChocoInstalled(data.installed)
            }
        });
    }, [])

    useEffect(() => {
        if (gitInstalled !== null && chocoInstalled !== null) {
            setInfo(<>Проверка завершена</>)
        }
    }, [gitInstalled, chocoInstalled])

    const handleClick = () => {
        if (gitInstalled && chocoInstalled) {
            setIsFirstLoad(false)
            return
        }
        const pkgs = []
        if (!chocoInstalled) { pkgs.push('choco') }
        if (!gitInstalled) { pkgs.push('git') }
        setDisabled(true)
        setInfo(<>Выполняется установка не закрывайте окно...</>)
        window.pkg.install(pkgs)
    }
    return (
        <div className="w-full h-full flex flex-col gap-10 items-center justify-center bg-slate-900">
            <LogoIcon />
            <div className="w-full h-2/4 flex flex-col items-center gap-10">
                <span className="text-white font-medium text-3xl">Для работы 🌉Bridge требуется установка 🍫choco и 🔀git</span>
                <span className="text-white font-medium text-2xl flex flex-row items-center justify-center">{info}</span>
                <div className="flex flex-col">
                    <PackageSpan icon={chocoInstalled ? 'installed': 'not installed'}>Chocolotey</PackageSpan>
                    <PackageSpan icon={gitInstalled ? 'installed': 'not installed'}>Git</PackageSpan>
                </div>
                <div className="w-full h-full gap-3 flex items-center justify-center">
                    <Button onClick={handleClick} disabled={disabled}>
                        {gitInstalled && chocoInstalled ? 'Продолжить' : 'Установить'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default InitInstaller