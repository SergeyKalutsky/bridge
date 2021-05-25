import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { makeStyles } from '@material-ui/core/styles';
import ClassIcon from '@material-ui/icons/Class';
import IconButton from '@material-ui/core/IconButton';
import '../assets/css/SideNavBar.css'

const useStyles = makeStyles((theme) => ({
    menuIcon: {
        '& svg': {
            fontSize: 50
        },
        'padding-left': 10,
        'color': '#b3afb0'
    }
})
);


const SideNavBar = (): JSX.Element => {
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
                <AccountTreeIcon />
            </IconButton>
            <IconButton className={classes.menuIcon} onClick={() => { console.log('here') }}>
                <ClassIcon />
            </IconButton>
        </div>
    )
}

export default SideNavBar