import { useState, useEffect } from "react"
import PackageSpan from "./PackageSpan"
import { Package } from '../../types'

interface Props {
    pkgs: Package[]
}


const Packages = ({ pkgs }: Props): JSX.Element => {
    const [pkgsMenu, setPkgsMenu] = useState<JSX.Element[]>(null)

    useEffect(() => {

        const pkgsMenu = pkgs.map((pkg, indx) =>
            <PackageSpan key={indx} icon={pkg.installed ? 'installed' : 'not installed'}>{pkg.name}</PackageSpan>
        )
        setPkgsMenu(pkgsMenu)
    }, [pkgs])

    return (
        <div className="flex flex-col w-[120px] h-[80px] overflow-scroll">
            {pkgsMenu}
        </div>
    )

}

export default Packages