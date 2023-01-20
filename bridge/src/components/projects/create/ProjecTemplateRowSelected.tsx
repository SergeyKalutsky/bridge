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
        setTemplate(null);
        setProjectCreate({ ...projectCreate, template: null });
        setTemplateRows([]);
    };
    return (
        <>
            <div className='w-3/4 max-w-2xl h-3/5 flex-col justify-center items-center'>
                <div className='w-full h-[60px] bg-sky-700/75 flex items-center rounded-lg shadow-sm'>
                    <div className='pl-5 w-1/2 text-slate-100 text-2xl'>{template.name}</div>
                    <div className='pr-6 w-1/2 text-slate-200 flex items-center justify-end'>
                        <div className='hover: cursor-pointer'>
                            <ImCross onClick={onclick} style={{ justifySelf: 'end', width: 15, height: 15 }} />
                        </div>
                    </div>
                </div>
                <div className='mt-10  w-full h-4/5 bg-sky-600/60 rounded-md  overflow-scroll shadow-sm'>
                    <span className='pl-2 text-slate-50 font-medium text-xl'>{template.description}</span>
                </div>
            </div>
        </>
    );
}
