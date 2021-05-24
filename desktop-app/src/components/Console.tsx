import { useRef, useEffect, useState } from 'react'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { ipcRenderer } from "electron";
import '../App.css'


const Console = (): JSX.Element => {
  const [output, setOutput] = useState([]);

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    scrollToBottom()
  }, [output]);

  const onData = (event: any, data: string) => {
    setOutput([...output, <p key={output.length}>{'>>> ' + data}</p>])
    ipcRenderer.removeListener('stdout', onData)
  }

  ipcRenderer.on('stdout', onData)

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