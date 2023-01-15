import { useEffect, useState } from "react"
import PopUp from "./PopuUp"
import InputForm from "./InputForm"
import Button from "./Button"

export function SudoPopUp(): JSX.Element {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string>()
    const [sudoPassword, setSudoPassword] = useState<string>()
    useEffect(() => {
        window.shared.incomingData('pkg:sudo', async ({ open, error }) => {
            setOpen(open)
            setError(error)
        })
        return () => window.shared.removeListeners('pkg:sudo')
    }, [])

    return (
        < PopUp open={open} onClose={() => { setOpen(false); window.pkg.sudo(sudoPassword) }}>
            <span className='text-red-400 font-medium text-base'>{error}</span>
            <div className="w-4/5">
                <InputForm type="password" onChange={(e) => { setSudoPassword(e.target.value) }} placeholder="Введите sudo пароль" />
            </div>
            <Button onClick={() => { window.pkg.sudo(sudoPassword); setError(null) }} btnText='OK' />
        </PopUp>
    )
}
