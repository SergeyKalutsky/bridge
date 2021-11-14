import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import '../../assets/css/ProjectsMenu.css'

const useStyles = makeStyles((theme) => ({
  menuIcon: {
    '& svg': {
      fontSize: 45
    },
    'margin-left': '50px',
    'color': '#b3afb0',
    'justify-content': 'flex-end'

  }
})
);

const ProjectsMenu = (): JSX.Element => {
  const classes = useStyles();

  return (
    <div className='left-menu'>
      <div className='tab-header'>
        <span className='tab-text'>ПРОЕКТЫ</span>
        <IconButton className={classes.menuIcon}>
          <AddCircleOutlineIcon />
        </IconButton >
      </div>
      <div className='projects'>
        <div className='project'>
          <span>testProject1</span>
        </div>
        <div className='project'>
          <span>testProject2</span>
        </div>
      </div>
    </div>
  )
}

export default ProjectsMenu