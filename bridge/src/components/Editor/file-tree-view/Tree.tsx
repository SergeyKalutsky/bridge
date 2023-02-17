import Folder from "./Folder";
import File from "./File"
import ReplaceFilePopUp from "./ReplaceFilePopUp";
import { ideContext } from "../Editor";
import buildEditor from "../TextEditor";
import { useEffect, useState, useRef, useContext } from "react";

function Tree({ children }: { children: JSX.Element[] }): JSX.Element {
    const [popUp, setPopUp] = useState<JSX.Element>()
    const [color, setColor] = useState('bg-transperent');
    const { ide, setIDE, buildFileTree } = useContext(ideContext)
    const ref = useRef(null);
    useEffect(() => {
        const onDragLeave = (e) => {
            setColor("bg-transperent");
        };
        ref.current.addEventListener('dragleave', onDragLeave);
    }, []);

    useEffect(() => {
        const drop = async (e) => {
            e.preventDefault()
            e.stopPropagation()
            setColor("bg-transperent")
            if (e.dataTransfer.files.length > 0) {
                for (const f of e.dataTransfer.files) {
                    await window.projects.copyFile({ src: f.path, destination: '', root: true });
                }
            } else {
                const files = await window.projects.showFiles();
                const draggedPath = JSON.parse(window.localStorage.getItem('draggedPath'))
                const dirname = window.projects.getDirName({ filepath: draggedPath.path })
                if (files[0].path === dirname) return

                const filename = window.projects.getFileBasename({ filepath: draggedPath.path })
                for (const file of files[0].files) {
                    if (file.name === filename) {
                        setPopUp(null)
                        setPopUp(<ReplaceFilePopUp destination={''} draggedPath={draggedPath} root={true} />)
                        return
                    }
                }
                await window.projects.copyFile({ src: draggedPath.path, destination: '', root: true });
                await window.projects.deleteTreeElement(draggedPath)
            }
            const files = await window.projects.showFiles()
            const branch = await window.git.getCurrentBranch();
            window.settings.del('userProjects.activeProject.activePath');
            setIDE({
                ...ide,
                files: files,
                fileTree: buildFileTree(files[0].files),
                editor: await buildEditor(),
                activePath: { path: files[0].path, isDirectory: true },
                branch: branch
            });
        };
        ref.current.addEventListener('drop', drop);
        ref.current.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            setColor("bg-slate-700");
        });
    }, []);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIDE({
            ...ide,
            activePath: { path: ide.files[0].path, isDirectory: true }
        });

    };

    return (
        <>
            <div ref={ref}
                onClick={handleClick}
                className={`leading-8 h-[calc(100%-40px)] ${color} overflow-y-scroll`}>
                {children}
            </div>
            {popUp}
        </>
    )
}

Tree.File = File;
Tree.Folder = Folder;

export { Tree }