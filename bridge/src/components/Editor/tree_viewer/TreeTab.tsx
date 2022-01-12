import { IconContext } from "react-icons";
import { ActivePath } from "../types";
import NewFile from "./NewFile";
import NewFolder from './newFolder'
import DeleteTreeElement from './DeleteTreeElement'


interface Props {
    activePath: ActivePath
    forceUpdate: () => void
}

const TreeTab = ({ activePath, forceUpdate }: Props): JSX.Element => {
    const active_project = window.settings.get('active_project')
    return (
        <div className="tree-tab">
            <div className="project-name">
                {active_project.name}
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