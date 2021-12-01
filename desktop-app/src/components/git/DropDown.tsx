import { useState, useEffect } from 'react';
import { GitDiff } from './Git'

interface Props {
    gitDiffs: GitDiff[]
    setDiffViewFileIndex?: React.Dispatch<React.SetStateAction<number>>
    diffViewFileIndex: number
}


const DropDown = ({ gitDiffs,
    setDiffViewFileIndex,
    diffViewFileIndex }: Props) => {
    const [selectedClient, setSelectedClient] = useState(diffViewFileIndex);

    const options = gitDiffs.map((diff, indx) =>
        <option value={indx} key={diff.filename}>
            {diff.filename}
        </option>
    )

    useEffect(() => { setSelectedClient(diffViewFileIndex) })
    return (
        <div className='dropdown'>
            <select name="select" value={selectedClient}
                onChange={(e) => {
                    const index = Number(e.target.value);
                    setSelectedClient(index)
                    setDiffViewFileIndex(index);
                }}>
                {options}
            </select>
        </div>
    )
}

export default DropDown