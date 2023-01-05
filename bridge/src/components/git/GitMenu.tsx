import { ToggleBar, SideMenu, SideMenuHeader } from '../common';
import { Git } from './types'
import CommitRow from './CommitRow'
import { useState } from 'react'


type Props = {
  git: Git
  setGit: React.Dispatch<React.SetStateAction<Git>>
}


const GitMenu = ({ git, setGit }: Props): JSX.Element => {
  const [activeToggle, setActiveToggle] = useState(false)
  const handleToggle = () => { setActiveToggle(!activeToggle) }
  const onClickCallback = async (oid: string) => {
    let i = 0
    for (const oidA of git.oids) {
      i += 1
      if (oid == oidA) {
        break
      }
    }
    const oid_prev = git.oids[i] === undefined ? '' : git.oids[i]
    const args = {oid: oid, oid_prev: oid_prev}
    const gitDiffs = await window.git.diff(args)
    setGit({
      ...git,
      gitDiffs: gitDiffs,
      activeOid: oid
    })
  }

  const elements = git.oids.map((oid) =>
    <CommitRow oid={oid}
      key={oid}
      active={git.activeOid === oid}
      onClickCallback={onClickCallback}
    />
  )

  return (
    <>
      <SideMenu activeToggle={activeToggle}>
        <SideMenuHeader>
          <span className='text-white text-2xl'>ЛЕНТА</span>
        </SideMenuHeader>
        <div className='overflow-scroll h-[calc(100%-40px)]'>
          {elements}
        </div>
      </SideMenu>
      <ToggleBar handleToggle={handleToggle} />
    </>
  )
}

export default GitMenu