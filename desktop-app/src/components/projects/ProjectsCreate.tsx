import '../../assets/css/ProjectsCreate.css'


const ProjectsCreate = (): JSX.Element => {
    return (
        <div className='menu'>
            <div className='crete-inputs row'>
                <div className='row'>
                    <input type="text" placeholder='Название проекта' />
                </div>
                <div className='row'>
                    <textarea placeholder='Описание' />
                </div>
                <div className='row checkbox'>
                    <div>
                        <input type="checkbox"/>
                        <label>Для обучения</label>
                    </div>
                    <div>
                        <input type="checkbox" />
                        <label>Личный проект</label>
                    </div>
                </div>
                <div className='row'>
                    <button>Создать</button>
                </div>
            </div>
        </div>

    )

}

export default ProjectsCreate