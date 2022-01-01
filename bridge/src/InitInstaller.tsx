import { Button } from "./components/common"
import { LogoIcon } from './components/common/Icons';

const InitInstaller = (): JSX.Element => {
    const gitInstalled = window.pkg.checkInstall('git')
    const chocoInstalled = window.pkg.checkInstall('choco')
    const checkMark = <>✔️</>
    const crossMark = <>❌</>
    const handleClick = () => { window.pkg.checkInstall('choco') }
    return (
        <div className="w-full h-full flex flex-col gap-10 items-center justify-center bg-slate-800">
            <LogoIcon />
            <div className="w-full h-2/4 flex flex-col items-center gap-10">
                <h1 className="text-white font-medium text-3xl">Для работы BRIDGE требуется установка 🍫choco и  🔀git</h1>
                <div className="flex flex-col">
                    <span className="text-white font-medium text-xl">{gitInstalled ? crossMark : checkMark}Chocolotey</span>
                    <span className="text-white font-medium text-xl">{chocoInstalled ? crossMark : checkMark}Git</span>
                </div>
                <Button onClick={handleClick}>
                    Установить
                </Button>
            </div>
        </div>
    )
}

export default InitInstaller