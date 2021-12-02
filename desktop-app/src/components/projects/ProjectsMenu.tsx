import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import ProjectItem from './ProjectItem';
import 'reactjs-popup/dist/index.css';
import '../../assets/css/ProjectsMenu.css'
import { Adding } from '../Icons';

const useStyles = makeStyles(() => ({
  menuIcon: {
    '& svg': {
      fontSize: 30
    },
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
  projects: Project[]
  dispatch: React.Dispatch<any>
  removeByProjectID: (project_id: number) => void
  setNewProject: (project: Project) => void
}

type Project = {
  id: number;
  name: string;
  isclassroom?: number
}


const ProjectsMenu = ({ projects, setNewProject, removeByProjectID, dispatch }: Props): JSX.Element => {
  const classes = useStyles()
  const projects_list = projects.map((project) =>
    <div className='project-item' key={project.name}>
      <ProjectItem project={project} dispatch={dispatch} removeByProjectID={removeByProjectID} />
    </div>)

  return (
    <div className='left-menu'>
      <div className='tab-header'>
        <span className='tab-text'>ПРОЕКТЫ</span>

        <IconButton className={classes.menuIcon}
          onClick={() => {
            dispatch({
              type: 'createProject', payload: {
                setNewProject: setNewProject
              }
            })
          }}>
          <Adding />
        </IconButton >

        {/* <IconButton className={classes.menuIconSerach}
          onClick={() => { dispatch({ type: 'findProject' }) }}>
          <FontAwesomeIcon icon={faSearch} />
        </IconButton > */}

      </div>
      <div className='projects' >
        {projects_list}
      </div >
    </div>
  )
}

export default ProjectsMenu