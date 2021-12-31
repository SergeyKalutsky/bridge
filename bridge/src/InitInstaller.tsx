import { Button } from "./components/common"


const InitInstaller = (): JSX.Element => {
    const handleClick = () => { window.pkg.checkInstall('git') }
    return (
        <div className="w-full h-full flex items-center justify-center bg-slate-500">
            <Button onClick={handleClick}>
                Установить
            </Button>
        </div>
    )
}

export default InitInstaller