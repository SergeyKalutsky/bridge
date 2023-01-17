export function SuccessMessage({ text, classDiv }: { text: string, classDiv?: string }): JSX.Element {
    return (
        <div className={`w-full bg-green-600 flex justify-start items-center rounded-lg pt-2 pb-2 pr-2 pl-2 ${classDiv}`}>
            <p className='font-medium text-slate-100 pl-2'>{text}</p>
        </div>
    )
}
