import { useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer';
import WorkspaceTab from './WorkspaceTab'
import '../../assets/css/Workspace.css'


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

const newStyles = {
  variables: {
    light: {
      diffViewerBackground: '#2e303c',
      diffViewerColor: '#FFF',
      addedBackground: '#044B53',
      addedColor: 'white',
      removedBackground: '#632F34',
      removedColor: 'white',
      wordAddedBackground: '#055d67',
      wordRemovedBackground: '#7d383f',
      addedGutterBackground: '#034148',
      removedGutterBackground: '#632b30',
      gutterBackground: '#2c2f3a',
      gutterBackgroundDark: '#262933',
      highlightBackground: '#2a3967',
      highlightGutterBackground: '#2d4077',
      codeFoldGutterBackground: '#21232b',
      codeFoldBackground: '#262831',
      emptyLineBackground: '#363946',
      gutterColor: '#464c67',
      addedGutterColor: '#8c8c8c',
      removedGutterColor: '#8c8c8c',
      codeFoldContentColor: '#555a7b',
      diffViewerTitleBackground: '#2f323e',
      diffViewerTitleColor: '#555a7b',
      diffViewerTitleBorderColor: '#353846',
    }
  },
  line: {
    padding: '10px 2px',
    '&:hover': {
      background: '#a26ea1',
    },
  },
};

const CodeSnipets = ({ diff, splitView, diffViewOption, index }: CodeSnipetsProp) => {
  const activeOption = diffViewOption === undefined ? 0 : diffViewOption
  return (
    <div className={activeOption === index ? 'code-snippet' : 'code-snippet hidden'}>
      <ReactDiffViewer styles={newStyles}
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