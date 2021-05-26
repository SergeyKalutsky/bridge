import { hot } from 'react-hot-loader';
import GitMenu from './components/git/GitMenu'
import SideNavBar from './components/SideNavBar'
import Workspace from './components/git/Workspace'
import Rooms from './components/rooms/Rooms'
import RoomsMenu from './components/rooms/RoomsMenu'
import './assets/css/base.css'




const Main = () => {
  return (
    <>
      <SideNavBar />
      <GitMenu />
      <Workspace />
    </>
  )
}


export default hot(module)(function App() {
  return (
    <Main />
  );
});