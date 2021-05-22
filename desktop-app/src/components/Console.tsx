import { useRef, useEffect } from 'react'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import '../App.css'

type propItems = {
  output: JSX.Element[]
}

const Console = ({output}: propItems) => {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    scrollToBottom()
  }, [output]);

  return (
    <div className='console'>
      <KeyboardArrowDownIcon />
      <div className='console-output'>
      {output}
      <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default Console