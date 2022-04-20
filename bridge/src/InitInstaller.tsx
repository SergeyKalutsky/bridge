import { PackageSpan } from "./components/common";
import { useEffect, useState } from "react";
import { Button, Logs, SudoPopUp } from "./components/common"
import { LoadingIcon, LogoIcon } from './components/common/Icons';
import { Package } from './types'

interface Props {
    setIsFirstLoad: React.Dispatch<React.SetStateAction<boolean>>
}

const startInfo = <><LoadingIcon />Проверяем установлены ли программы...</>

const pkgsToInstall = [
    {
        installed: null,
        name: 'brew',
        manager: 'custom',
    },
    {
        installed: null,
        name: 'git',
        manager: 'brew'
    },
]

const InitInstaller = ({ setIsFirstLoad }: Props): JSX.Element => {
    const [pkgsMenu, setPkgsMenu] = useState<JSX.Element[]>(null)
    const [info, setInfo] = useState<JSX.Element>(startInfo)
    const [pkgs, setPkgs] = useState<Package[]>(pkgsToInstall)
    const [btnTheme, setBtnTheme] = useState('default')
    const [disabled, setDisabled] = useState(true)

    useEffect(() => {
        window.pkg.check(pkgs)
        window.shared.incomingData("pkg:check", (pkgs) => {
            setPkgs(pkgs)
        });
        return () => window.shared.removeListeners('pkg:check')
    }, [])

    useEffect(() => {
        const fileContent = setInterval(() => {
            window.pkg.getlogs()
        }, 1000)

        return () => clearInterval(fileContent);
    });

    useEffect(() => {
        let count = 0
        for (const pkg of pkgs) {
            if (pkg.installed === null) {
                return
            }
            if (pkg.installed === true) {
                count += 1
            }
        }
        if (count === pkgs.length) {
            setBtnTheme('teal')
        }
        setInfo(<>Проверка завершена</>)
        setDisabled(false)
    }, [pkgs])

    const handleClick = (e) => {
        if (e.target.innerText === 'Продолжить') {
            setIsFirstLoad(false)
            return
        }
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
        <>
        <div className="w-full h-full flex flex-col gap-2 items-center justify-center bg-slate-900">
            <LogoIcon />
            <div className="w-full h-3/5 flex flex-col items-center gap-4">
                <span className="text-white font-medium text-3xl text-ellipsis overflow-hidden whitespace-nowrap">Для работы 🌉Bridge требуется установка стороних программ</span>
                <span className="text-white font-medium text-2xl flex flex-row items-center justify-center">{info}</span>
                <div className="flex flex-col">
                    {pkgsMenu}
                </div>
                <Logs bgColor="bg-slate-800"/>
                <div className="w-full h-1/6 flex items-center justify-center">
                    <Button onClick={handleClick} disabled={disabled} theme={btnTheme}>
                        {btnTheme === 'default' ? 'Установить' : 'Продолжить'}
                    </Button>
                </div>
                <div>
                    <span className="text-white font-medium text-xl">{'Лог Файл: ' + window.settings.logPath()}</span>
                </div>
            </div>
        </div>
        <SudoPopUp/>
        </>
    )
}

export default InitInstaller