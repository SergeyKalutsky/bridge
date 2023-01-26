import { IoMdGitCommit, IoMdPlay } from 'react-icons/io'
import { FaLongArrowAltDown, FaLongArrowAltUp } from 'react-icons/fa'
import { IconButton } from "../common";
import { useContext } from 'react';
import { ideContext } from './Editor';
import { CMD } from './Constants'

export function ActionControllIcons(): JSX.Element {
    const { ide } = useContext(ideContext)
    const handlePlayButtonClick = () => {
        if (!ide.activePath.isDirectory) {
            const extList = ide.activePath.path.split(".");
            const ext = extList[extList.length - 1];
            const excecutable = CMD[ext];
            if (excecutable !== undefined) {
                window.terminal.exec({ exec: excecutable, path: '"' + ide.activePath.path + '"' });
            }
        }
    };

    return (
        <div className="w-2/4 flex justify-end">
            <div className="flex justify-between w-[160px] mr-10 h-1/5">
                <IconButton onClick={handlePlayButtonClick}>
                    <IoMdPlay style={{ color: '#76de85', height: 30, width: 35 }} />
                </IconButton>
                {/* <IconButton onClick={()=>{window.terminal.keystoke('\x03')}}> <FaStop style={{ color: '#d91a1a', height: 25, width: 25 }} /></IconButton> */}
                <div className="flex">
                    <IconButton onClick={() => { window.git.commit(); }}>
                        <IoMdGitCommit style={{ color: 'white', height: 45, width: 45 }} />
                    </IconButton>
                    <IconButton>
                        <FaLongArrowAltDown style={{ color: 'white', height: 30, width: 30, textDecorationColor: 'white' }} />
                    </IconButton>
                    <IconButton>
                        <FaLongArrowAltUp style={{ color: 'grey', height: 30, width: 30, textDecorationColor: 'white', cursor: 'not-allowed' }} />
                    </IconButton>
                </div>
            </div>
        </div>
    )
}