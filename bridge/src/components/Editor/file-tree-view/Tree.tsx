import Folder from "./Folder";
import File from "./File"
import { ideContext } from "../Editor";
import { useEffect, useState, useRef, useContext } from "react";

function Tree({ children }: { children: React.ReactNode }): JSX.Element {
    const [color, setColor] = useState('bg-transperent');
    const { ide, setIDE } = useContext(ideContext)
    const ref = useRef(null);
    useEffect(() => {
        const onDragLeave = (e) => {
            setColor("bg-transperent");
        };
        ref.current.addEventListener('dragleave', onDragLeave);
    }, []);

    useEffect(() => {
        const drop = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            setColor("bg-transperent");

            for (const f of e.dataTransfer.files) {
                await window.projects.copyFile({ src: f.path, destination: '', root: true });
            }
            const files = await window.projects.showFiles();
            setIDE({ ...ide, files: files });
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

    return <div ref={ref} onClick={handleClick} className={`leading-8 h-[calc(100%-40px)] ${color} overflow-y-scroll`}>{children}</div>;
}

Tree.File = File;
Tree.Folder = Folder;

export { Tree }