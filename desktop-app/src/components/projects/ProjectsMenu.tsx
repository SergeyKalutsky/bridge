import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import IconButton from '@material-ui/core/IconButton';
import 'reactjs-popup/dist/index.css';
import Popup from 'reactjs-popup';
import { makeStyles } from '@material-ui/core/styles';
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
    // 'margin-left': '5px',
    'color': '#b3afb0',
    'justify-content': 'flex-end'
  }
})
);

type Project = {
  id: number;
  name: string
}

type Setter = {
  setIsCreate: React.Dispatch<React.SetStateAction<boolean>>;
  projects: Array<Project>
}

type ProjectProp = {
  repo: string
  setActive?: React.Dispatch<React.SetStateAction<boolean>>
}


const TrashButton = ({ repo, setActive }: ProjectProp): JSX.Element => {
  return (
    <Popup
      trigger={<div className='icon'><FontAwesomeIcon icon={faTrashAlt} /></div>}
      position="right center"
      modal
    >
      {close => (
        <div className="modal">
          <div>Вы уверены, что хотите удалить/покинуть проект? (Изменения не обратимы)</div>
          <button className="close" onClick={() => {
            fetch('http://172.29.0.1:8000/projects/delete',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_login: 'sergey', repo: repo })

              })
              .then(response => response.json())
              .then(data => data['res'] == 'deleted' ?
                window.location.reload() : console.log(data));
            close
          }}>
            Удалить
          </button>
          <button className="close" onClick={() => { setActive(false); close }}>
            Закрыть
          </button>
        </div>
      )
      }
    </Popup >

  )
}

const ProjectSelect = ({ repo }: ProjectProp): JSX.Element => {
  const [active, setActive] = useState(false)
  return (
    <div className='project'
      onMouseOver={() => { setActive(true) }}
      onMouseLeave={() => { setActive(false) }}>
      <span className={active == true ? 'selected' : ''}>{repo}</span>
      {active && <TrashButton repo={repo} setActive={setActive} />}
    </div>
  )
}

const ProjectsMenu = ({ setIsCreate, projects }: Setter): JSX.Element => {
  const classes = useStyles();
  const projects_list = projects.map((project) =>
    <ProjectSelect repo={project.name} key={project.name} />)
  return (
    <div className='left-menu'>
      <div className='tab-header'>
        <span className='tab-text'>ПРОЕКТЫ</span>
        <IconButton className={classes.menuIcon}
          onClick={() => { setIsCreate(true) }}>
          <AddCircleOutlineIcon />
        </IconButton >
        <IconButton className={classes.menuIconSerach}
          onClick={() => { setIsCreate(false) }}>
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