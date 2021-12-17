import { IconContext } from "react-icons";
import { AiOutlineFileAdd, AiOutlineFolderAdd, AiFillDelete } from "react-icons/ai";

const TreeTab = (): JSX.Element => {
    return (
        <div className="tree-tab">
            <IconContext.Provider value={{ color: 'navy', size: '25', className:'file-icon' }}>
                <AiOutlineFileAdd />
                <AiOutlineFolderAdd />
                <AiFillDelete />
            </IconContext.Provider>
        </div>
    )
}

export default TreeTab