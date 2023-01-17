
export function ErrorMessage({ text, classDiv }: { text: string, classDiv?: string }): JSX.Element {
    return (
        <div className={`w-full bg-rose-400/70 flex justify-start items-center rounded-lg ${classDiv}`}>
            <p className='font-medium pl-2'>{'🛑'}</p>
            <p className='font-medium text-slate-100 pl-2'>{text}</p>
        </div>
    )
}
