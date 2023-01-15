
export function ErrorMessage({ text }: { text: string }): JSX.Element {
    return (
        <div className='w-full bg-rose-400/70 flex justify-start items-center mt-8 rounded-lg pt-2 pb-2 pr-2 pl-2'>
            <p className='font-medium pl-2'>{'🛑'}</p>
            <p className='font-medium text-slate-100 pl-2'>{text}</p>
        </div>
    )
}
