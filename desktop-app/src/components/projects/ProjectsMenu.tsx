import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
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

type Setter = {
  setIsCreate: React.Dispatch<React.SetStateAction<boolean>>
}

type ProjectProp = {
  project: string
}

const TrashButton = (): JSX.Element => {
  return (
    <div className='icon' onClick={() => { alert('Dont click') }}>
      <FontAwesomeIcon icon={faTrashAlt} />
    </div>
  )
}

const ProjectSelect = ({ project }: ProjectProp): JSX.Element => {
  const [active, setActive] = useState(false)
  return (
    <div className='project'
      onMouseOver={() => { setActive(true) }}
      onMouseLeave={() => { setActive(false) }}>
      <span>{project}</span>
      {active && <TrashButton />}
    </div>
  )
}

const ProjectsMenu = ({ setIsCreate }: Setter): JSX.Element => {
  const classes = useStyles();
  const projects = ['testProject1', 'testProject2']

  return (
    <div className='left-menu'>
      <div className='tab-header'>
        <span className='tab-text'>ПРОЕКТЫ</span>
        <IconButton className={classes.menuIcon}
          onClick={() => { setIsCreate(true) }}>
          <AddCircleOutlineIcon />
        </IconButton >

      </div>
      <div className='projects' >
        <ProjectSelect project={projects[0]} />
        <ProjectSelect project={projects[1]} />
      </div >
    </div>
  )
}

export default ProjectsMenu