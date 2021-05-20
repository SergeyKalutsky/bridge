import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import '../App.css'

type propItems = {
  output: String
}

const Console = ({output}: propItems) => {
  return (
    <div className='console'>
      <KeyboardArrowDownIcon />
      <p>
      {output}
      </p>
    </div>
  );
}

export default Console