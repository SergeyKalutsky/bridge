import { Button } from "../common";


export function RowWithButton({ className, text, btnTheme, btnText, onClick }: {
    className?: string,
    text: string;
    btnText: string;
    btnTheme?: string;
    onClick?: () => void;
}): JSX.Element {

    return (
        <div className={`w-full h-[80px] flex justify-between items-center bg-zinc-600/50 shadow-sm rounded-lg ${className}`}>
            <span className="ml-5 text-slate-200 font-semibold text-lg">{text}</span>
            <Button className="mr-3" theme={btnTheme} btnText={btnText} onClick={onClick} />
        </div>);
}
