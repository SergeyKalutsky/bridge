import { useState } from 'react';
import { useRef, useEffect } from 'react'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { ipcRenderer } from "electron";
import '../App.css'



const Console = () => {
  // const messagesEndRef = useRef(null)

  const [output, setOutput] = useState([]);

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    scrollToBottom()
  }, [output]);

  const onData = (event, data: string) => {
    setOutput([...output, <p key={output.length}>{'>>> ' + data}</p>])
    ipcRenderer.removeListener('stdout', onData)
  }
  // on init
  ipcRenderer.on('stdout', onData)
  // on deconstruct
  // ipcRenderer.removeListener('stdout', onData)

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