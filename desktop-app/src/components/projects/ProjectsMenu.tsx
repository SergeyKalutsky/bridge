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
  setIsCreate: React.Dispatch<React.SetStateAction<boolean>>
  setMember: React.Dispatch<React.SetStateAction<{
    on: boolean;
    project_name: string;
  }>>
  projects: Project[]
}

type Project = {
  id: number;
  name: string;
  isclassroom?: number
}


const ProjectsMenu = ({ setIsCreate, setMember, projects }: Props): JSX.Element => {
  const classes = useStyles();
  const projects_list = projects.map((project) =>
    <div className='project-item' key={project.name}>
      <ProjectSelect name={project.name}
        id={project.id}
        isclassroom={project.isclassroom}
        setMember={setMember} />
    </div>)
  return (
    <div className='left-menu'>
      <div className='tab-header'>
        <span className='tab-text'>ПРОЕКТЫ</span>
        <IconButton className={classes.menuIcon}
          onClick={() => { setIsCreate(true); setMember({on: false}) }}>
          <AddCircleOutlineIcon />
        </IconButton >
        <IconButton className={classes.menuIconSerach}
          onClick={() => { setIsCreate(false); setMember({on: false}) }}>
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