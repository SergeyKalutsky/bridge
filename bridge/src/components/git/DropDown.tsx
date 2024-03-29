import { GitDiff } from './types'

interface Props {
    gitDiffs: GitDiff[]
    setDiffViewFileIndex?: React.Dispatch<React.SetStateAction<number>>
    diffViewFileIndex: number
}

const DropDown = ({ gitDiffs,
    setDiffViewFileIndex,
    diffViewFileIndex }: Props): JSX.Element => {
    const options = gitDiffs.map((diff, indx) =>
        <option value={indx} key={diff.filename}>
            {diff.filename}
        </option>
    )
    return (
        <div className='flex justify-center items-center w-[200px] h-[44px]'>
            <select className="text-black w-full bg-white h-3/5 rounded-lg" value={diffViewFileIndex}
                onChange={(e) => {setDiffViewFileIndex(Number(e.target.value))}}>
                {options}
            </select>
        </div>
    )
}

export default DropDown