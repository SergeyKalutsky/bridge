import { hot } from 'react-hot-loader';
import { useState } from 'react'
import Console from './components/Console'
import LeftSideBar from './components/LeftMenu'
import WorkspaceBar from './components/WorkspaceBar'
import { diff as DiffEditor } from "react-ace";
import "ace-builds/src-noconflict/theme-github";
import './App.css'


const Main = () => {
  const [output, setOutput] = useState([]);
  return (
    <>
      <LeftSideBar />
      <div className='right-side-bar'>
        <div className='workspace'>
          <WorkspaceBar output={output} setOutput={setOutput} />
          {/* <DiffEditor
            value={["Test code differences", "Test code "]}
            height="70%"
            width="100%"
            mode="python"
            theme="github"
            // readOnly={true}
            editorProps={{ $blockScrolling: true }}
          />   */}
        </div>
        <Console output={output} />
      </div>
    </>
  )
}

function App() {
  return (
    <Main />
  );
}


export default hot(module)(App);