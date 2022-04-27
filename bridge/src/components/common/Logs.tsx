import { useEffect, useState, useRef } from "react";

interface Props {
    className: string
}
const Logs = ({ className }: Props): JSX.Element => {
    const [logs, setLogs] = useState<JSX.Element[]>([])
    const ref = useRef(null)
    
    useEffect(() => {
        const fileContent = setInterval(() => {
            window.pkg.getlogs()
        }, 1000)

        return () => clearInterval(fileContent);
    });

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
        <div className={`w-3/5 h-2/5 flex justify-center flex-col overflow-scroll ${className}`} >
            {logs}
            <div ref={ref} />
        </div>
    )
}

export default Logs