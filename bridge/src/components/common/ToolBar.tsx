import '../../assets/css/WorkspaceTab.css'

interface Props {
  children: React.ReactNode
}


const ToolBar = ({ children }: Props): JSX.Element => {

  return (
    <div className='flex w-full h-[40px] bg-zinc-600 items-center mt-0'>
      <div className='flex justify-around items-center w-3/5 h-[30px]'>
        {children}
      </div>
    </div>
  )
}


export default ToolBar