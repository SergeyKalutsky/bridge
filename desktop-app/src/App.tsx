import { hot } from 'react-hot-loader';
import LeftMenu from './components/git/LeftMenu'
import SideNavBar from './components/SideNavBar'
import Workspace from './components/git/Workspace'
import './assets/css/base.css'



const Main = () => {
  return (
    <>
      <SideNavBar />
      <LeftMenu />
      <Workspace />
      {/* <Rooms /> */}
    </>
  )
}


export default hot(module)(function App() {
  return (
    <Main />
  );
});