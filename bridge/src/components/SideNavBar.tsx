import { useState } from 'react';
import { PopUp, Button, IconButton } from '../components/common';
import { Link, useHistory } from 'react-router-dom'
import { CupIcon, FileIcon, GitIcon, ProjectIcon } from './common/Icons';


const SideNavBar = (): JSX.Element => {
    const history = useHistory()
    const [open, setOpen] = useState(false)
    const checkActiveProject = (path: string): void => {
        const active_project = window.settings.get('active_project')
        active_project !== undefined ?
            history.push(path) :
            setOpen(true)
    }
    const handleCLose = () => { setOpen(false) }
    return (
        <div className='text-center bg-zinc-600 border-r-1 border-teal-800 flex flex-col w-[80px] drop-shadow-lg'>
            <div className='mt-10 h-2/5 flex flex-col items-center gap-y-10'>
                <IconButton>
                    <CupIcon />
                </IconButton>
                <IconButton onClick={() => { checkActiveProject('/editor') }}>
                    <FileIcon />
                </IconButton>
                <IconButton onClick={() => { checkActiveProject('/git') }}>
                    <GitIcon />
                </IconButton>
                <IconButton>
                    <Link to="/" replace><ProjectIcon /></Link>
                </IconButton>
                <PopUp
                    open={open}
                    onClose={handleCLose}
                >
                    <div>Сначало необходимо создать или выбрать проект</div>
                    <Button btnText='OK' onClick={handleCLose} />
                </PopUp >
            </div>
        </div>
    )
}

export default SideNavBar