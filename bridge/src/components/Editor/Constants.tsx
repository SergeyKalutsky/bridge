import {
    DiJavascript1,
    DiCss3Full,
    DiHtml5,
    DiReact,
    DiPython,
    DiDocker,
    DiMarkdown
} from "react-icons/di";

const FILE_ICONS = {
    js: <DiJavascript1 />,
    css: <DiCss3Full />,
    html: <DiHtml5 />,
    jsx: <DiReact />,
    py: <div className="bg-yellow-500 rounded-full text-cyan-900 opacity-60"><DiPython /></div>,
    yml: <DiDocker />,
    md: <DiMarkdown />
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
    ACE_MODS
}