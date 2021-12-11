import 'reactjs-popup/dist/index.css';
import '../../assets/css/ProjectsMenu.css'


interface Props {
  projects_list: JSX.Element[]
  addProjectBtn: JSX.Element
}

const ProjectsMenu = ({ projects_list, addProjectBtn }: Props): JSX.Element => {

  return (
    <div className='left-menu'>
      <div className='tab-header'>
        <span className='tab-text'>ПРОЕКТЫ</span>
        {addProjectBtn}
      </div>
      <div className='projects' >
        {projects_list}
      </div >
    </div>
  )
}

export default ProjectsMenu