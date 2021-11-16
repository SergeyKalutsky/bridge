// Delete project
// Manage memebers(Should be a separate component)
// A list of all names of users with buttons add and delete
// If user added he will have a differen color 
// If deleted as well

const ProjectsEdit = (): JSX.Element => {
    return (
        <div className='menu'>
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
                <button>Сохранить</button>
            </div>
            <div className='row'>
                <button>Удалить</button>
            </div>
        </div>
    </div>
    )
}

export default ProjectsEdit