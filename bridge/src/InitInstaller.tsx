import { useEffect, useState } from "react";
import { Button } from "./components/common"
import { LogoIcon } from './components/common/Icons';

interface Props {
    setIsFirstLoad: React.Dispatch<React.SetStateAction<boolean>>
}

const InitInstaller = ({ setIsFirstLoad }: Props): JSX.Element => {
    const [gitInstalled, setGitInstalled] = useState(false)
    const [chocoInstalled, setChocoInstalled] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const checkMark = <>✔️</>
    const crossMark = <>❌</>


    useEffect(() => {
        // window.pkg.checkInstall('git')
        window.pkg.checkInstall('choco')

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

    const handleClick = () => {
        if (chocoInstalled && gitInstalled) {
            setIsFirstLoad(false)
            return
        }
        const pkgs = []
        if (!chocoInstalled) { pkgs.push('choco') }
        if (!gitInstalled) { pkgs.push('git') }
        window.pkg.install(pkgs)
        // setDisabled(true)
    }
    return (
        <div className="w-full h-full flex flex-col gap-10 items-center justify-center bg-slate-800">
            <LogoIcon />
            <div className="w-full h-2/4 flex flex-col items-center gap-10">
                <h1 className="text-white font-medium text-3xl">Для работы BRIDGE требуется установка 🍫choco и 🔀git</h1>
                <div className="flex flex-col">
                    <span className="text-white font-medium text-xl">{chocoInstalled ? checkMark : crossMark}Chocolotey</span>
                    <span className="text-white font-medium text-xl">{gitInstalled ? checkMark : crossMark}Git</span>
                </div>
                <div className="w-full h-full gap-3 flex items-center justify-center">
                    <Button onClick={handleClick} disabled={disabled}>
                        {chocoInstalled && gitInstalled ? 'Продолжить' : 'Установить'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default InitInstaller