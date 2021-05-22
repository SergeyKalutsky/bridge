import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import '../App.css'

type propItems = {
  output: JSX.Element[]
}

const Console = ({output}: propItems) => {
  return (
    <div className='console'>
      <KeyboardArrowDownIcon />
      <div className='console-output'>
      {output}
      </div>
    </div>
  );
}

export default Console