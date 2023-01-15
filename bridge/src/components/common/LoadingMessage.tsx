import { LoadingIcon } from "./Icons"

export function LoadingMessage({ text }: { text: string }): JSX.Element {
    return (
        <div className='text-xl  w-full flex justify-start items-center pt-2 pb-2 pr-2 pl-2'>
            <LoadingIcon />
            <p className='font-medium text-slate-100 pl-2'>{text}</p>
        </div>
    )
}