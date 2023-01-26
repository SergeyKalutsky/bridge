interface Props {
  children: React.ReactNode
}


const ToolBar = ({ children }: Props): JSX.Element => {

  return (
    <div className='flex w-full h-[50px] bg-zinc-600 items-center mt-0'>
        {children}
    </div>
  )
}


export default ToolBar