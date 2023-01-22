import { LoadingIcon } from "./Icons"


export function Message({ type, text, className }:
    {
        type: 'error' | 'warning' | 'success' | 'loading', text: string, className?: string
    }): JSX.Element {
    if (type === 'error') return <ErrorMessage text={text} className={className} />
    if (type === 'warning') return <WarningMessage text={text} className={className} />
    if (type === 'success') return <SuccessMessage text={text} className={className} />
    if (type === 'loading') return <LoadingMessage text={text} className={className} />
}


function LoadingMessage({ text, className }: { text: string, className: string }): JSX.Element {
    return (
        <div className={`text-xl  w-full flex justify-start items-center pt-2 pb-2 pr-2 pl-2 ${className}`}>
            <LoadingIcon />
            <p className='font-medium text-slate-100 pl-2'>{text}</p>
        </div>
    )
}


function ErrorMessage({ text, className }: { text: string, className?: string }): JSX.Element {
    return (
        <div className={`w-full bg-rose-400/70 flex justify-start items-center rounded-lg ${className}`}>
            <p className='font-medium pl-2'>{'🛑'}</p>
            <p className='font-medium text-slate-100 pl-2'>{text}</p>
        </div>
    )
}

function SuccessMessage({ text, className }: { text: string, className?: string }): JSX.Element {
    return (
        <div className={`w-full bg-green-600 flex justify-start items-center rounded-lg pt-2 pb-2 pr-2 pl-2 ${className}`}>
            <p className='font-medium text-slate-100 pl-2'>{text}</p>
        </div>
    )
}


export function WarningMessage({ text, className }: { text: string, className?: string }): JSX.Element {
    return (
        <div className={`-full bg-orange-300/40 flex justify-start items-center mt-8 rounded-lg pt-2 pb-2 pr-2 pl-2 ${className}`}>
            <p className='font-medium text-slate-100 pl-2'>{'⚠️' + text}</p>
        </div>
    )
}