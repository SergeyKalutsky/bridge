import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { UserIconButton, TrashIconButton } from './projectsMenuIcons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import IconButton from '@material-ui/core/IconButton';
import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { ipcRenderer } from 'electron'
import Popup from 'reactjs-popup';
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
    // 'margin-left': '5px',
    'color': '#b3afb0',
    'justify-content': 'flex-end'
  }
})
);

type Project = {
  id: number;
  name: string;
  setActive?: React.Dispatch<React.SetStateAction<boolean>>
  setMember?: React.Dispatch<React.SetStateAction<{
    on: boolean;
    project_name: string;
  }>>
  close?: any
  isclassroom?: number
}

type Setter = {
  setIsCreate: React.Dispatch<React.SetStateAction<boolean>>;
  setMember: React.Dispatch<React.SetStateAction<{
    on: boolean;
    project_name: string;
  }>>
  projects: Array<Project>
}


const ProjectSelect = ({ name, id, isclassroom, setMember }: Project): JSX.Element => {
  const [active, setActive] = useState(false)
  const settings = JSON.parse(window.sessionStorage.getItem('settings'))
  return (
    <div className={'active_project' in settings &&
      settings['active_project']['id'] == id ? 'project active' : 'project'}
      onMouseOver={() => { setActive(true) }}
      onMouseLeave={() => { setActive(false) }}>
      <Popup
        trigger={<span className={active == true ? 'selected' : ''}>{name}</span>}
        position="right center"
        key={name}
        modal>
        {
          <div className="modal">
            <div>Проект выбран как основной</div>
            <button className="close" onClick={() => {
              ipcRenderer.send('user-settings',
                {
                  cmd: 'set',
                  data: {
                    'active_project': {
                      'name': name,
                      'id': id,
                      'isclassroom': isclassroom
                    }
                  }
                });
              window.location.reload()
            }}>
              ОК
            </button>
          </div>
        }
      </Popup>
      {active &&
        <div className='icons'>
          <UserIconButton name={name} id={id} setActive={setActive} setMember={setMember} />
          <TrashIconButton name={name} id={id} setActive={setActive} />
        </div>}
    </div>
  )
}

const ProjectsMenu = ({ setIsCreate, setMember, projects }: Setter): JSX.Element => {
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