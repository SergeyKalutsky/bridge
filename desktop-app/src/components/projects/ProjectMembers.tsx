import '../../assets/css/ProjectMembers.css'

type Member = {
    on?: boolean;
    project_id?: number
}

const ProjectMembers = ({ project_id }: Member): JSX.Element => {
    return (
        <div className='menu'>
            <div className='search'>
                <input type="text"
                    placeholder='Введите имя пользователя' />
                <button onClick={() => {
                    const settings = JSON.parse(window.sessionStorage.getItem('settings'))
                }}> Поиск</button>
            </div>
        </div>
    )
}


export default ProjectMembers