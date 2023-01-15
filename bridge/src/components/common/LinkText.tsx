export function LinkText({ text }: { text: string }): JSX.Element {
    return <span className='font-semibold text-blue-600 underline hover:underline-offset-1 hover:cursor-pointer'>{text}</span>
}