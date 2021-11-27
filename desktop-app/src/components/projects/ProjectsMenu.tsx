import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import ProjectSelect from './ProjectSelect';
import 'reactjs-popup/dist/index.css';
import '../../assets/css/ProjectsMenu.css'

const useStyles = makeStyles(() => ({
  menuIcon: {
    '& svg': {
      fontSize: 30
    },
    'margin-left': '30px',
    'color': '#b3afb0',
    'justify-content': 'flex-end'

  },
  menuIconSerach: {
    '& svg': {
      fontSize: 25
    },
    'color': '#b3afb0',
    'justify-content': 'flex-end'
  }
})
);

interface Props {
  dispatch: React.Dispatch<any>
  projects: Project[]
}

type Project = {
  id: number;
  name: string;
  isclassroom?: number
}


const ProjectsMenu = ({ projects, dispatch }: Props): JSX.Element => {
  const classes = useStyles()

  const projects_list = projects.map((project) =>
    <div className='project-item' key={project.name}>
      <ProjectSelect project={project} dispatch={dispatch} />
    </div>)

  return (
    <div className='left-menu'>
      <div className='tab-header'>
        <span className='tab-text'>ПРОЕКТЫ</span>

        <IconButton className={classes.menuIcon}
          onClick={() => { dispatch({ type: 'createProject' }) }}>
          <AddCircleOutlineIcon />
        </IconButton >

        <IconButton className={classes.menuIconSerach}
          onClick={() => { dispatch({ type: 'findProject' }) }}>
          <FontAwesomeIcon icon={faSearch} />
        </IconButton >

      </div>
      <div className='projects' >
        {projects_list}
      </div >
    </div>
  )
}

export default ProjectsMenu