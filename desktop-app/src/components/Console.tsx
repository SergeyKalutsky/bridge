import { useRef, useEffect } from 'react'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { ipcRenderer } from "electron";
import '../App.css'

type propItems = {
  // output: JSX.Element[]
  output: string
}

const Console = () => {
  let output: JSX.Element[] = []
  const messagesEndRef = useRef(null)

  ipcRenderer.on('stdout', async (event, arg) => {
    output = [...output, <p key={output.length}>{'>>> '+arg}</p>]
    console.log(output)
  })
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
      </div>
    </div>
  );
}

export default Console