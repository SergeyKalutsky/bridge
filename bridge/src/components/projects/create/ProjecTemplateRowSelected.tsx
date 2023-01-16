import { ImCross } from 'react-icons/im';
import { useContext } from 'react';
import { Template } from '../../../types';
import { projectCreateContext } from './ProjectsCreate';

export function ProjecTemplateRowSelected({ template, setTemplate, setTemplateRows }: {
    template: Template;
    setTemplate: React.Dispatch<React.SetStateAction<Template>>;
    setTemplateRows: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
}): JSX.Element {
    const { projectCreate, setProjectCreate } = useContext(projectCreateContext);
    const onclick = () => {
        const dummy = { name: '', http: '', pkgs: [], description: '' };
        setTemplate(dummy);
        projectCreate.template = dummy;
        setProjectCreate(projectCreate);
        setTemplateRows([]);
    };
    return (
        <>
            <div className='w-full h-[60px] bg-sky-700/75 flex items-center rounded-lg border-2 border-sky-800'>
                <div className='pl-5 w-1/2 text-slate-100 text-2xl'>{template.name}</div>
                <div className='pr-6 w-1/2 text-slate-200 flex items-center justify-end'>
                    <div className='hover: cursor-pointer'>
                        <ImCross onClick={onclick} style={{ justifySelf: 'end', width: 15, height: 15 }} />
                    </div>
                </div>
            </div>
            <div className='mt-10  w-full h-4/5 bg-sky-600/60 border-2 rounded-md border-sky-800 overflow-scroll'>
                <span className='pl-2 text-slate-50 font-medium text-xl'>{template.description}</span>
            </div>
        </>
    );
}
