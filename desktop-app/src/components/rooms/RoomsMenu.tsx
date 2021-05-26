import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import '../../App.css'

const useStyles = makeStyles((theme) => ({
  menuIcon: {
      '& svg': {
          fontSize: 45
      },
      'padding-left': 70,
      'color': '#0811EF',
      'justify-content': 'flex-end'

  }
})
);

const RoomsMenu = (): JSX.Element => {
  const classes = useStyles();

  return (
    <div className='left-menu'>
      <div className='tab-header'>
        <span className='tab-text'>КОМНАТЫ</span>
        <IconButton className={classes.menuIcon}>
          <AddCircleOutlineIcon />
        </IconButton >
      </div>
    </div>
  )
}

export default RoomsMenu