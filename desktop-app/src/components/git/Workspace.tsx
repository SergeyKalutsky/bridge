import { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import ReactDiffViewer from 'react-diff-viewer';
import WorkspaceTab from './WorkspaceTab'
import '../../assets/css/Workspace.css'


type GitDiff = {
  filename: string
  newFile: string
  oldFile: string
}

type WorkspaceGitProp = {
  gitDiff: GitDiff
}

const WorkspaceGit = ({ gitDiff }: WorkspaceGitProp): JSX.Element => {
  return (
    <div className='workspace'>
      <div className='workspace-background'>
        <WorkspaceTab />
        <div className='code'>
          <ReactDiffViewer oldValue={gitDiff.oldFile} newValue={gitDiff.newFile} splitView={true} />
        </div>
      </div>
    </div>
  )
}



export default WorkspaceGit