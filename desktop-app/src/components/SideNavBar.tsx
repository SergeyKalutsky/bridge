import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { makeStyles } from '@material-ui/core/styles';
import ClassIcon from '@material-ui/icons/Class';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import '../assets/css/SideNavBar.css'
import { SettingsContext } from '../App';

const useStyles = makeStyles((theme) => ({
    menuIcon: {
        '& svg': {
            fontSize: 50
        },
        'padding-left': 20,
        'color': '#b3afb0',
    }
})
);

type Setter = {
    setActiveProjectSet: React.Dispatch<React.SetStateAction<boolean>>
}

const GitLink = ({ setActiveProjectSet }: Setter): JSX.Element => {
    const {settings, setSettings} = useContext(SettingsContext)
    useEffect(() => {
        settings !== null ? 'active_project' in settings && settings.active_project !== null ?
            setActiveProjectSet(true) : setActiveProjectSet(false) : null
    }, [settings])
    return (
        <Popup
            trigger={<div className='icon'><AccountTreeIcon /></div>}
            position="right center"
        >
            {
                <div>Чтобы использовать Git нужны выбрать или создать проект</div>
            }
        </Popup >

    )
}


const SideNavBar = (): JSX.Element => {
    const [activeProjectSet, setActiveProjectSet] = useState(false)
    const classes = useStyles();

    return (
        <div className='icon-nav-bar'>
            <IconButton className={classes.menuIcon}>
                <EmojiEventsIcon />
            </IconButton>
            <IconButton className={classes.menuIcon}>
                <FileCopyIcon />
            </IconButton>
            <IconButton className={classes.menuIcon}>
                {activeProjectSet == true ?
                    <Link to="/git" replace><AccountTreeIcon /></Link> :
                    <GitLink setActiveProjectSet={setActiveProjectSet} />}
            </IconButton>
            <IconButton className={classes.menuIcon}>
                <Link to="/" replace><ClassIcon /></Link>
            </IconButton>
        </div>
    )
}

export default SideNavBar