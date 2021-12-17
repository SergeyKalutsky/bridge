import { IconContext } from "react-icons";
import { AiOutlineFolderAdd, AiFillDelete } from "react-icons/ai";
import NewFile from "./NewFile";

const TreeTab = (): JSX.Element => {
    return (
        <div className="tree-tab">
            <div className="project-name">
                XXXXX
            </div>
            <div className="file-icons">
                <IconContext.Provider value={{ color: 'navy', size: '25', className: 'file-icon' }}>
                    <NewFile />
                    <AiOutlineFolderAdd />
                    <AiFillDelete />
                </IconContext.Provider>
            </div>
        </div>
    )
}

export default TreeTab