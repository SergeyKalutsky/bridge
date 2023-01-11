import { BiSearch } from 'react-icons/bi'
import { InputForm } from '../../../components/common'
import { createProjectProp } from './types'


export function ProjectsSelectType({ projectCreate, setProjectCreate, setDisabled }: createProjectProp) {
    return (
        <>
            <InputForm
                placeholder='Введите тип проетка'
                type='text'
                classInput='border-none pl-1'>
                {<BiSearch style={{ color: '#71717a', width: 28, height: 30, paddingLeft: 5, backgroundColor: '#d4d4d8' }} />}
            </InputForm>
        </>
    )
}