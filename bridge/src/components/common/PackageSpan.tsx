import { LoadingIcon } from './Icons'

interface Props {
    children: React.ReactNode
    icon: string
}

const PackageSpan = ({ children, icon }: Props): JSX.Element => {
    let statusIcon: JSX.Element
    switch (icon) {
        case 'not installed':
            statusIcon = <>❌</>
            break
        case 'installed':
            statusIcon = <>✔️</>
            break
        case 'installing':
            statusIcon = <LoadingIcon />
    }
    return (
        <span className="text-white font-medium text-xl flex flex-row items-center flex-center">
            {statusIcon}
            {children}
        </span>
    )
}

export default PackageSpan