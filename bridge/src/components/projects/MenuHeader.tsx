import { IconButton, SideMenuHeader } from '../common';
import { Adding } from '../common/Icons';

interface Props {
    onClick: () => void
}

const MenuHeader = ({ onClick }: Props): JSX.Element => {
    return (
        <SideMenuHeader>
            <div className='gap-x-3 flex w-full justify-center items-center'>
                <span className='text-white text-2xl'>ПРОЕКТЫ</span>
                <IconButton width={2} height={2} onClick={onClick}>
                    <Adding />
                </IconButton >
            </div>
        </SideMenuHeader>
    )
}

export default MenuHeader