import { useEffect, useState } from "react";
import { Button } from "./components/common"
import { LogoIcon } from './components/common/Icons';

const InitInstaller = (): JSX.Element => {
    const [gitInstalled, setGitInstalled] = useState(false)
    const [chocoInstalled, setChocoInstalled] = useState(false)
    const checkMark = <>✔️</>
    const crossMark = <>❌</>
    useEffect(() => {
        window.pkg.checkInstall('git')
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
        const pkgs = []
        if (!gitInstalled) { pkgs.push('git') }
        if (!chocoInstalled) { pkgs.push('choco') }
        window.pkg.install(pkgs)
    }
    return (
        <div className="w-full h-full flex flex-col gap-10 items-center justify-center bg-slate-800">
            <LogoIcon />
            <div className="w-full h-2/4 flex flex-col items-center gap-10">
                <h1 className="text-white font-medium text-3xl">Для работы BRIDGE требуется установка 🍫choco и  🔀git</h1>
                <div className="flex flex-col">
                    <span className="text-white font-medium text-xl">{gitInstalled ? checkMark : crossMark}Chocolotey</span>
                    <span className="text-white font-medium text-xl">{chocoInstalled ? checkMark : crossMark}Git</span>
                </div>
                <Button onClick={handleClick}>
                    Установить
                </Button>
            </div>
        </div>
    )
}

export default InitInstaller