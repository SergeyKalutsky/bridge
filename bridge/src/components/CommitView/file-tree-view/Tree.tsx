import Folder from "./Folder";
import File from "./File"
import { ideContext } from "../CommitView";
import { useEffect, useState, useRef, useContext } from "react";

function Tree({ children }: { children: JSX.Element[] }): JSX.Element {
    const [color, setColor] = useState('bg-transperent');
    const { ide, setIDE, buildFileTree } = useContext(ideContext)
    const ref = useRef(null);
    useEffect(() => {
        const onDragLeave = (e) => {
            setColor("bg-transperent");
        };
        ref.current.addEventListener('dragleave', onDragLeave);
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
        </>
    )
}

Tree.File = File;
Tree.Folder = Folder;

export { Tree }