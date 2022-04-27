import { useEffect, useState } from "react";
import { Button, Logs, SudoPopUp, Packages } from "./components/common"
import { LoadingIcon, LogoIcon } from './components/common/Icons';
import { Package } from './types'
import templates from "./templates";

interface Props {
    setIsFirstLoad: React.Dispatch<React.SetStateAction<boolean>>
}


const InitInstaller = ({ setIsFirstLoad }: Props): JSX.Element => {

    const [info, setInfo] = useState<JSX.Element>(<><LoadingIcon />Проверяем установлены ли программы...</>)
    const [pkgs, setPkgs] = useState<Package[]>(templates.init.pkgs)
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

    return (
        <>
        <div className="w-full h-full flex flex-col gap-2 items-center justify-center bg-slate-900">
            <LogoIcon />
            <div className="w-full h-3/5 flex flex-col items-center gap-4">
                <span className="text-white h-[60px] font-medium text-3xl text-ellipsis overflow-hidden whitespace-nowrap">Для работы 🌉Bridge требуется установка стороних программ</span>
                <span className="text-white font-medium text-2xl flex flex-row items-center justify-center">{info}</span>
                <Packages pkgs={pkgs} />
                <Logs className="bg-slate-800 h-[200px]"/>
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