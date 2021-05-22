import { hot } from 'react-hot-loader';
import { useState } from 'react'
import Console from './components/Console'
import LeftSideBar from './components/LeftMenu'
import WorkspaceBar from './components/WorkspaceBar'
import './App.css'


const Main = () => {
  const [output, setOutput] = useState([]);
  return (
    <>
      <LeftSideBar />
      <div className='right-side-bar'>
        <div className='workspace'>
          <WorkspaceBar output={output} setOutput={setOutput}/>
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