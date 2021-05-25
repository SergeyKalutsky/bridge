import { hot } from 'react-hot-loader';
import LeftMenu from './components/LeftMenu'
import SideNavBar from './components/SideNavBar'
import Workspace from './components/Workspace'
import './App.css'


const Rooms = (): JSX.Element => {
  return (
    <div className='rooms'>
    </div>
  )
}



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