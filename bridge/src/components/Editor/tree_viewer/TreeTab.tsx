import { IconContext } from "react-icons";
import { AiFillDelete } from "react-icons/ai";
import NewFile from "./NewFile";
import NewFolder from './newFolder'

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
                    <NewFile activePath={activePath} />
                    <NewFolder activePath={activePath} />
                    <AiFillDelete />
                </IconContext.Provider>
            </div>
        </div>
    )
}

export default TreeTab