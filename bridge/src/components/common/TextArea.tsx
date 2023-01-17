export function TextArea({ value, onChange, placeholder }: {
    value?: string,
    onChange?: (e) => void,
    placeholder: string

}): JSX.Element {
    return (
        <textarea placeholder={placeholder}
            className='w-full pl-4 pt-2 bg-zinc-50 placeholder-slate-500 font-medium text-slate-700 h-[150px] text-xl rounded-lg focus:outline-none'
            onChange={onChange}
            value={value}
        />
    )
}
