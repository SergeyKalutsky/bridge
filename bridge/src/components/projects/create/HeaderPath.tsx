export function HeaderPath({ path }: { path: string }): JSX.Element {
    return (
        <h1 className='font-medium bg-zinc-500 pl-2 text-xl text-gray-200 underline drop-shadow-md' >{path}</h1>
    )
}