import {
    DiJavascript1,
    DiCss3Full,
    DiHtml5,
    DiReact,
    DiDocker,
    DiMarkdown
} from "react-icons/di";
import {
    FcImageFile
} from "react-icons/fc"
import {
    SiPython
} from "react-icons/si"
import {
    AiOutlineFileText
} from "react-icons/ai"

const IMG_FORMATS = [
    'apng',
    'avif',
    'gif',
    'jpg',
    'jpeg',
    'jfif',
    'pjpeg',
    'pjp',
    'png',
    'svg',
    'webp'
]

const FILE_ICONS = {
    js: <DiJavascript1 style={{ color: '#f5f551' }}/>,
    css: <DiCss3Full style={{ color: '#1b61f7' }}/>,
    html: <DiHtml5 style={{ color: '#f76916' }}/>,
    jsx: <DiReact />,
    py: <SiPython style={{ color: '#367dc9' }} />,
    yml: <DiDocker />,
    md: <DiMarkdown />,
    jpg: <FcImageFile />,
    apng: <FcImageFile />,
    avif: <FcImageFile />,
    gif: <FcImageFile />,
    jpeg: <FcImageFile />,
    png: <FcImageFile />,
    svg: <FcImageFile />,
    txt: <AiOutlineFileText style={{ color: 'white' }} />
};

const CMD = {
    js: 'node',
    ts: 'ts-node',
    py: 'python'
}


const ACE_MODS = {
    js: 'javascript',
    css: 'css',
    html: 'html',
    jsx: 'javascript',
    py: 'python',
    md: 'markdown',
    txt: 'plain_text'
};

export {
    FILE_ICONS,
    CMD,
    ACE_MODS,
    IMG_FORMATS
}