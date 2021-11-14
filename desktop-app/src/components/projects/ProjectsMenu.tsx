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

type Name = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
}

const ProjectsMenu = ({ name, setName }: Name): JSX.Element => {
  const classes = useStyles();
  const projects = ['testProject1', 'testProject2']
  return (
    <div className='left-menu'>
      <div className='tab-header'>
        <span className='tab-text'>ПРОЕКТЫ</span>
        <IconButton className={classes.menuIcon}>
          <AddCircleOutlineIcon />
        </IconButton >
      </div>
      <div className='projects'>
        <div className='project' onClick={() => { setName(projects[0]) }} >
          <span>{projects[0]}</span>
        </div>
        <div className='project' onClick={() => { setName(projects[1]) }}>
          <span>{projects[1]}</span>
        </div>
      </div>
    </div>
  )
}

export default ProjectsMenu