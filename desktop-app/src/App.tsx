import { hot } from 'react-hot-loader';
import LeftSideBar from './components/LeftMenu'
import Workspace from './components/Workspace'
import './App.css'


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