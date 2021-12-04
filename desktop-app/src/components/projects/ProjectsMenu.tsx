import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import ProjectItem from './ProjectItem';
import 'reactjs-popup/dist/index.css';
import '../../assets/css/ProjectsMenu.css'
import { Adding } from '../Icons';
import { Project } from './Projects'

const useStyles = makeStyles(() => ({
  menuIcon: {
    '& svg': {
      fontSize: 30
    },
    'color': '#b3afb0',
    'justify-content': 'flex-end'

  }
})
);

interface Props {
  projects: Project[]
  dispatch: React.Dispatch<any>
  updateProjects: (project: Project) => void
  removeProject: (project_id: number) => void
  addProject: (project: Project) => void
}


const ProjectsMenu = ({ projects,
  addProject,
  removeProject,
  dispatch,
  updateProjects }: Props): JSX.Element => {
  const classes = useStyles()
  const projects_list = projects.map((project) =>
    <div className='project-item' key={project.name}>
      <ProjectItem project={project}
        dispatch={dispatch}
        removeProject={removeProject}
        updateProjects={updateProjects} />
    </div>)

  return (
    <div className='left-menu'>
      <div className='tab-header'>
        <span className='tab-text'>ПРОЕКТЫ</span>

        <IconButton className={classes.menuIcon}
          onClick={() => {
            dispatch({
              type: 'createProject', payload: {
                addProject: addProject
              }
            })
          }}>
          <Adding />
        </IconButton >

      </div>
      <div className='projects' >
        {projects_list}
      </div >
    </div>
  )
}

export default ProjectsMenu