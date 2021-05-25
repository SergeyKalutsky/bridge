import { useRef, useEffect, useState } from 'react'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { ipcRenderer } from "electron";
import '../../assets/css/console.css'


const Console = (): JSX.Element => {

  const [output, setOutput] = useState([]);
  const [hidden, setHidden] = useState(false);

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
  if (hidden) return (
    <div className='console-hidden'>
      <KeyboardArrowUpIcon onClick={() => {
        setHidden(hidden ? false : true);
        ipcRenderer.removeListener('stdout', onData)
      }} />
    </div>
  )
  return (
    <div className='console'>
      <KeyboardArrowDownIcon onClick={() => {
        setHidden(hidden ? false : true);
        ipcRenderer.removeListener('stdout', onData)
      }} />
      <div className='console-output'>
        {output}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default Console