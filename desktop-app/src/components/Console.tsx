import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import '../App.css'

type propItems = {
  output: JSX.Element[]
}

const Console = ({output}: propItems) => {
  return (
    <div className='console'>
      <KeyboardArrowDownIcon />
      {output}
      {/* <p>
      {'Test'}
      </p>
      <p>
      {'Test2'}
      </p>
      <p>
      {'Test3'}
      </p>
      <p>
      {'Test4'}
      </p> */}
    </div>
  );
}

export default Console