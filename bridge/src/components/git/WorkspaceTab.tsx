import '../../assets/css/WorkspaceTab.css'


type Props = {
  switchBtn: JSX.Element
  dropDown: JSX.Element
}


const WorkspaceTab = ({ switchBtn, dropDown }: Props): JSX.Element => {

  return (
    <div className='flex justify-self-start w-full h-[40px] bg-zinc-600 items-center mt-0'>
      <div className='flex justify-around items-center w-3/5 h-[30px]'>
        {dropDown}
        {switchBtn}
      </div>
    </div>
  )
}


export default WorkspaceTab