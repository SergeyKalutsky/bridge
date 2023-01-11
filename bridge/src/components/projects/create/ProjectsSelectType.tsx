import { InputForm } from '../../../components/common'
import { createProjectProp } from './types'


export function ProjectsSelectType({ projectCreate, setProjectCreate, setDisabled }: createProjectProp) {
    return (
        <><InputForm
            placeholder='Введите тип проетка'
            type='text'></InputForm></>
    )
}