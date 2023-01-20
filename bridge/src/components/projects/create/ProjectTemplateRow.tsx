import { Template } from '../../../types';

export function ProjectTemplateRow({ template, roundTop, setTemplate }: {
    template: Template;
    roundTop: boolean;
    setTemplate: React.Dispatch<React.SetStateAction<Template>>;
}): JSX.Element {
    const rounded = roundTop ? 'rounded-t-l-lg' : '';
    return (<div
        onClick={() => setTemplate(template)}
        className={`pl-5 hover: cursor-pointer hover:bg-sky-400/20 text-slate-800 text-xl flex items-center w-full h-[40px] ${rounded}`}>
        {template.name}
    </div>);

}
