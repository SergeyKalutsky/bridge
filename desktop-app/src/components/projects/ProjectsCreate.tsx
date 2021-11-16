import '../../assets/css/ProjectsCreate.css'

{/* <div className='menu'>
<div className='crete-inputs row'>
    <div className='row'>
        <input type="text" placeholder='Название проекта' />
    </div>
    <div className='row'>
        <textarea  placeholder='Описание' />
    </div>
    <div className='row'>
        <div>
            <input type="radio" id="huey" name="drone" value="huey"
                checked />
            <label>Публичный</label>
        </div>
        <div>
            <input type="radio" id="dewey" name="drone" value="dewey" />
            <label>Частный</label>
        </div>
    </div>
    <div className='row'>
        <button>Создать проект</button>
    </div>
</div>
</div> */}

const ProjectsCreate = (): JSX.Element => {
    return (
        <div >
            <input type="text" placeholder='Поиск проекта' />
            <button>Поиск</button>
            <button>Создать новый проект</button>
        </div>
    )

}

export default ProjectsCreate