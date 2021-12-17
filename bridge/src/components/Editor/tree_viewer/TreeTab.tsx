import { IconContext } from "react-icons";
import NewFile from "./NewFile";
import NewFolder from './newFolder'
import DeleteTreeElement from './deleteTreeElement'

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
                    <DeleteTreeElement activePath={activePath} forceUpdate={forceUpdate} />
                </IconContext.Provider>
            </div>
        </div>
    )
}

export default TreeTab