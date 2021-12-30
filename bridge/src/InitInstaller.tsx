import { Button } from "./components/common"


const InitInstaller = (): JSX.Element => {
    const handleClick = ()=>{console.log('clicked')}
    return (
        <div className="w-full h-full flex items-center justify-center">
            <Button onClick={handleClick}>
                click me to install
            </Button>
        </div>
    )
}

export default InitInstaller