import { useState } from 'react';
import Popup from 'reactjs-popup';
import IconButton from './common/IconButton';
import { Link, useHistory } from 'react-router-dom'
import { CupIcon, FileIcon, GitIcon, ProjectIcon } from './common/Icons';


const SideNavBar = (): JSX.Element => {
    const history = useHistory()
    const [open, setOpen] = useState(false)
    const checkActiveProject = () => {
        const settigns = window.settings.get()
        'active_project' in settigns && settigns.active_project !== undefined ?
            history.push('/git') :
            setOpen(true)
    }
    const handleCLose = () => { setOpen(false) }
    return (
        <div className='text-center bg-zinc-600 border-r-1 border-teal-800 flex flex-col w-[80px] drop-shadow-lg'>
            <div className='mt-10 h-2/5 flex flex-col items-center gap-y-10'>
                <IconButton>
                    <CupIcon />
                </IconButton>
                <IconButton>
                    <Link to="/editor" replace><FileIcon /></Link>
                </IconButton>
                <IconButton onClick={checkActiveProject}>
                    <GitIcon />
                </IconButton>
                <IconButton>
                    <Link to="/" replace><ProjectIcon /></Link>
                </IconButton>
                <Popup
                    open={open}
                    onClose={handleCLose}
                    position="right center"
                    modal={false}
                >
                    {<div>Чтобы использовать Git нужно выбрать проект</div>}
                </Popup >
            </div>
        </div>
    )
}

export default SideNavBar