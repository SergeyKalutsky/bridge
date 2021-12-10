import { GitDiff } from './Git'

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
        <div className='dropdown'>
            <select name="select" value={diffViewFileIndex}
                onChange={(e) => {
                    setDiffViewFileIndex(Number(e.target.value));
                }}>
                {options}
            </select>
        </div>
    )
}

export default DropDown