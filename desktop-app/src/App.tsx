import { hot } from 'react-hot-loader';
import { useState } from 'react'
import Console from './components/Console'
import LeftSideBar from './components/LeftMenu'
import WorkspaceBar from './components/WorkspaceBar'
import './App.css'


// https://github.com/praneshr/react-diff-viewer#readme unified verision
// use for diff viewing

// https://commonmark.org/help/
// this is for task editing
// https://github.com/remarkjs/react-markdown
const Main = () => {
  return (
    <>
      <LeftSideBar />
      <div className='right-side-bar'>
        <div className='workspace'>
          <WorkspaceBar/>
        </div>
        <Console />
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