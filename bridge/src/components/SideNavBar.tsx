import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import { Link , useHistory } from 'react-router-dom'
import Popup from 'reactjs-popup';
import '../assets/css/SideNavBar.css'
import { CupIcon, FileIcon, GitIcon, ProjectIcon } from './Icons';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
    menuIcon: {
        '& svg': {
            fontSize: 50
        },
        'color': '#b3afb0',
    }
})
);



const SideNavBar = (): JSX.Element => {
    const history = useHistory()
    const [open, setOpen] = useState(false)
    const classes = useStyles();
    return (
        <div className='icon-nav-bar'>
            <IconButton className={classes.menuIcon}>
                <CupIcon />
            </IconButton>
            <IconButton className={classes.menuIcon}>
                <Link to="/editor" replace><FileIcon /></Link>
            </IconButton>
            <IconButton className={classes.menuIcon}
                onClick={() => {
                    const settigns = window.settings.get()
                    'active_project' in settigns && settigns.active_project !== undefined ?
                        history.push('/git') :
                        setOpen(true)
                }}>
                <GitIcon />
            </IconButton>
            <IconButton className={classes.menuIcon}>
                <Link to="/" replace><ProjectIcon /></Link>
            </IconButton>
            <Popup
                open={open}
                onClose={() => { setOpen(false) }}
                // closeOnDocumentClick
                position="right center"
            >
                {<div>Чтобы использовать Git нужно выбрать проект</div>}
            </Popup >

        </div>
    )
}

export default SideNavBar