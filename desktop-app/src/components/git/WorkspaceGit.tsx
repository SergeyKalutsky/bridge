import { useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer';
import WorkspaceTab from './WorkspaceTab'
import '../../assets/css/Workspace.css'
import darkModeStyle from './DiffViewerStyles'


type GitDiff = {
  filename: string
  newFile: string
  oldFile: string
}

type WorkspaceGitProp = {
  gitDiff: GitDiff[]
  diffViewOption: number
  setDiffViewOption: React.Dispatch<React.SetStateAction<number>>
}

type CodeSnipetsProp = {
  diff: GitDiff
  splitView: boolean
  diffViewOption: number
  index: number
}


const CodeSnipets = ({ diff, splitView, diffViewOption, index }: CodeSnipetsProp) => {
  const activeOption = diffViewOption === undefined ? 0 : diffViewOption
  return (
    <div className={activeOption === index ? 'code-snippet' : 'code-snippet hidden'}>
      <ReactDiffViewer styles={darkModeStyle}
        oldValue={diff.oldFile}
        newValue={diff.newFile}
        splitView={splitView} />
    </div>
  )
}


const WorkspaceGit = ({ gitDiff, diffViewOption, setDiffViewOption }: WorkspaceGitProp): JSX.Element => {
  const [splitView, setSplitView] = useState(true)
  const gitDiffDisplays = gitDiff.map((diff, index) =>
    <CodeSnipets key={diff.filename}
      splitView={splitView}
      diff={diff}
      index={index}
      diffViewOption={diffViewOption} />
  )
  return (
    <div className='workspace'>
      <div className='workspace-background'>
        <WorkspaceTab setSplitView={setSplitView}
          splitView={splitView}
          gitDiff={gitDiff}
          setDiffViewOption={setDiffViewOption} 
          diffViewOption={diffViewOption}/>
        <div className='code'>
          {gitDiffDisplays}
        </div>
      </div>
    </div>
  )
}


export default WorkspaceGit