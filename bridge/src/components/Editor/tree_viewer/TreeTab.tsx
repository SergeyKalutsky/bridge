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
    forceUpdate: () => void
}

const TreeTab = ({ activePath, forceUpdate }: Props): JSX.Element => {
    const settigns = window.settings.get()
    return (
        <div className="tree-tab">
            <div className="project-name">
                {settigns.active_project.name}
            </div>
            <div className="file-icons">
                <IconContext.Provider value={{ color: 'navy', size: '25', className: 'file-icon' }}>
                    <NewFile activePath={activePath} forceUpdate={forceUpdate} />
                    <NewFolder activePath={activePath} forceUpdate={forceUpdate} />
                    <AiFillDelete />
                </IconContext.Provider>
            </div>
        </div>
    )
}

export default TreeTab