function PackageSpan({ children, icon }: {
    children: React.ReactNode
    icon: string
}): JSX.Element {
    const statusIcon = icon === 'installed' ? <span className="text-sm pr-1">✔️</span> : <span className="text-sm pr-1">❌</span>
    return (
        <span className="text-white font-medium text-xl flex flex-row items-center flex-center pl-3 hover:bg-slate-700">
            {statusIcon}
            {children}
        </span>
    )
}

export default PackageSpan