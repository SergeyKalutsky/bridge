import '../../assets/css/ProjectsFind.css'

const ProjectFind = (): JSX.Element => {
    return (
        <div className='menu'>
            <div className='search'>
                <input type="text" placeholder='Введите уникальный ключ проекта' />
                <button>Поиск</button>
            </div>
    </div>
    )
}

export default ProjectFind