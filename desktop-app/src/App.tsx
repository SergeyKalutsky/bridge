import { hot } from 'react-hot-loader';
import LeftSideBar from './components/LeftMenu'
import Workspace from './components/Workspace'
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
      <Workspace />
    </>
  )
}


export default hot(module)(function App() {
  return (
    <Main />
  );
});