import { useEffect, useState, useRef } from "react";

interface Props {
    className: string
}
const Logs = ({ className }: Props): JSX.Element => {
    const [logs, setLogs] = useState<JSX.Element[]>([])
    const ref = useRef(null)

    useEffect(() => {
        window.shared.incomingData("pkg:getlogs", (data: string) => {
            let logs = data.split(/\r?\n/)
            logs = logs.slice(logs.length - 10)
            setLogs(logs.map((log: string, indx: number) => <p key={indx} className="text-white font-medium ml-3">{log}</p>))
        });
        return () => window.shared.removeListeners('pkg:getlogs')
    }, [])

    useEffect(() => {
        const scrollToBottom = () => {
            ref.current.scrollIntoView({
                behavior: "smooth", block: 'end',
                inline: 'nearest'
            })
        }
        scrollToBottom()
    }, [logs])

    return (
        <div className={`h-2/5 flex justify-center flex-col overflow-scroll ${className}`} >
            {logs}
            <div ref={ref} />
        </div>
    )
}

export default Logs