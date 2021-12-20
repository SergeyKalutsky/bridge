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
    return (
        <div className='text-center bg-zinc-600 border-r-1 border-teal-800 flex flex-col w-20'>
            <div className='mt-5 h-2/5 flex flex-col items-center justify-between'>
                <IconButton width={15} height={15}>
                    <CupIcon />
                </IconButton>
                <IconButton width={15} height={15}>
                    <Link to="/editor" replace><FileIcon /></Link>
                </IconButton>
                <IconButton width={15} height={15}
                    onClick={checkActiveProject}>
                    <GitIcon />
                </IconButton>
                <IconButton width={15} height={15}>
                    <Link to="/" replace><ProjectIcon /></Link>
                </IconButton>
                <Popup
                    open={open}
                    onClose={() => { setOpen(false) }}
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