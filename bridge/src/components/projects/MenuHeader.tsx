import { useContext } from 'react';
import { IconButton, SideMenuHeader } from '../common';
import { Adding } from '../common/Icons';
import { projectContext } from './Projects';


const MenuHeader = (): JSX.Element => {
    const { dispatch } = useContext(projectContext)
    return (
        <SideMenuHeader>
            <div className='gap-x-3 flex w-full justify-center items-center'>
                <span className='text-white text-2xl'>ПРОЕКТЫ</span>
                <IconButton width={2} height={2} onClick={()=>{
                    dispatch({
                        type: 'createProject'
                    })
                }}>
                    <Adding />
                </IconButton >
            </div>
        </SideMenuHeader>
    )
}

export default MenuHeader