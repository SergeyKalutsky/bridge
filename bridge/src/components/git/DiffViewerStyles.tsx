const darkModeStyle = {
    variables: {
        light: {
            diffViewerBackground: '#2e303c',
            diffViewerColor: '#FFF',
            addedBackground: '#044B53',
            addedColor: 'white',
            removedBackground: '#632F34',
            removedColor: 'white',
            wordAddedBackground: '#055d67',
            wordRemovedBackground: '#7d383f',
            addedGutterBackground: '#034148',
            removedGutterBackground: '#632b30',
            gutterBackground: '#2c2f3a',
            gutterBackgroundDark: '#262933',
            highlightBackground: '#2a3967',
            highlightGutterBackground: '#2d4077',
            codeFoldGutterBackground: '#21232b',
            codeFoldBackground: '#262831',
            emptyLineBackground: '#363946',
            gutterColor: '#464c67',
            addedGutterColor: '#8c8c8c',
            removedGutterColor: '#8c8c8c',
            codeFoldContentColor: '#555a7b',
            diffViewerTitleBackground: '#2f323e',
            diffViewerTitleColor: '#555a7b',
            diffViewerTitleBorderColor: '#353846',
        }
    },
    line: {
        padding: '10px 2px',
        '&:hover': {
            background: '#a26ea1',
        },
    },
};

export default darkModeStyle