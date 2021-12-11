import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom'
import Popup from 'reactjs-popup';
import '../assets/css/SideNavBar.css'
import { CupIcon, FileIcon, GitIcon, ProjectIcon } from './Icons';

const useStyles = makeStyles((theme) => ({
    menuIcon: {
        '& svg': {
            fontSize: 50
        },
        'color': '#b3afb0',
    }
})
);


const GitLink = (): JSX.Element => {
    return (
        <Popup
            trigger={<div className='icon'><GitIcon /></div>}
            position="right center"
        >
            {<div>Чтобы использовать Git нужно выбрать проект</div>}
        </Popup >

    )
}

const SideNavBar = (): JSX.Element => {
    const classes = useStyles();
    return (
        <div className='icon-nav-bar'>
            <IconButton className={classes.menuIcon}>
                <CupIcon />
            </IconButton>
            <IconButton className={classes.menuIcon}>
                <Link to="/editor" replace><FileIcon /></Link>
            </IconButton>
            <IconButton className={classes.menuIcon}>
                {'active_project' in window.settings.get() ?
                    <Link to="/git" replace><GitIcon /></Link> :
                    <GitLink />}
            </IconButton>
            <IconButton className={classes.menuIcon}>
                <Link to="/" replace><ProjectIcon /></Link>
            </IconButton>
        </div>
    )
}

export default SideNavBar