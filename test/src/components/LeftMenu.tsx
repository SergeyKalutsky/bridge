import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import '../App.css'

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


const LeftSideBar = () => {
  const classes = useStyles();

  return (
    <div className='left-side-bar'>
      <div className='icon-left-side-bar'>
          <IconButton className={classes.menuIcon}>
            <EmojiEventsIcon />
          </IconButton>
        <IconButton className={classes.menuIcon}>
          <FileCopyIcon />
          </IconButton>
        <IconButton className={classes.menuIcon}>
          <AssignmentTurnedInIcon />
          </IconButton>
      </div>
      <div className='tab-header'>
        <span className='tab-text'>ЛЕНТА</span>
      </div>
    </div>
  )
}

export default LeftSideBar