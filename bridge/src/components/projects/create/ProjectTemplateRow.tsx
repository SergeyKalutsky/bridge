import { Template } from '../../../types';

export function ProjectTemplateRow({ template, roundTop, setTemplate }: {
    template: Template;
    roundTop: boolean;
    setTemplate: React.Dispatch<React.SetStateAction<Template>>;
}): JSX.Element {
    const rounded = roundTop ? 'rounded-t-l-lg' : '';
    return (<div
        onClick={() => setTemplate(template)}
        className={`pl-5 hover: cursor-pointer hover:bg-sky-700/75 hover:text-slate-200 text-slate-800 font-medium flex items-center w-full h-[40px] ${rounded}`}>
        {template.name}
    </div>);

}
