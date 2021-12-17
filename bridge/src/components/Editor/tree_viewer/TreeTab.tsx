import { IconContext } from "react-icons";
import { AiOutlineFolderAdd, AiFillDelete } from "react-icons/ai";
import NewFile from "./NewFile";

interface ActivePath {
    path: string
    isDirectory: boolean
}

interface Props {
    activePath: ActivePath
}

const TreeTab = ({ activePath }: Props): JSX.Element => {
    return (
        <div className="tree-tab">
            <div className="project-name">
                XXXXX
            </div>
            <div className="file-icons">
                <IconContext.Provider value={{ color: 'navy', size: '25', className: 'file-icon' }}>
                    <NewFile activePath={activePath}/>
                    <AiOutlineFolderAdd />
                    <AiFillDelete />
                </IconContext.Provider>
            </div>
        </div>
    )
}

export default TreeTab