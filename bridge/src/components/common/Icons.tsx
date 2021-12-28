const LogoIcon = (): JSX.Element => {
    return (
        <svg className="" 
        xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M273.025 115.998V104.635C215.397 101.794 163.706 53.9063 163.706 0.336731H154.731C154.731 22.3277 148.597 40.5953 137.586 55.3684C126.737 40.8271 120.353 22.6581 120.026 0.336731H109.881C109.881 56.0001 53.5741 104.635 0.712463 104.635V115.998H109.881H120.026H154.731H163.706H273.025ZM154.731 104.635H121.145V85.5193C127.418 80.7383 132.98 75.4877 138.107 69.4896C143.166 75.0784 148.919 80.8758 154.731 86.1123V104.635ZM109.881 104.635H87.5601C95.8886 100.934 103.256 97.1833 109.881 93.1639V104.635ZM121.145 44.9781V72.2131C121.323 72.0718 121.5 71.93 121.676 71.7878C125.346 68.8249 128.747 65.6529 131.861 62.2682C125.419 54.4349 121.145 47.8214 121.145 44.9781ZM163.706 104.635H184.554C179.362 104.387 171.806 99.9999 163.706 93.6785V104.635ZM109.881 80.0525V44.9781C109.881 62.946 90.849 83.3841 65.2442 97.707C82.0719 93.6631 97.1311 87.8111 109.881 80.0525ZM143.589 62.5708C147.469 57.2987 151.136 51.482 154.731 44.9781V72.7891C157.582 75.0243 160.578 77.1289 163.706 79.1069V44.9781C163.706 57.2139 185.271 82.0992 214.857 98.9153C195.743 94.7964 178.286 88.3273 163.706 79.1069C160.578 77.1289 157.582 75.0243 154.731 72.7891C150.72 69.6451 146.995 66.2426 143.589 62.5708Z" fill="#00569F"/>
            <path d="M163.706 160.837H154.731V124.989H163.706V160.837Z" fill="#00569F"/>
            <path d="M120.026 160.837H109.881V124.989H120.026V160.837Z" fill="#00569F"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M163.706 55.3685L154.731 49.4679V72.7891C157.582 75.0243 160.578 77.1289 163.706 79.1069V55.3685ZM152.907 48.2078L145.594 42.2688C143.317 46.9073 140.639 51.2722 137.586 55.3685C139.457 57.8763 141.461 60.2762 143.589 62.5708C146.816 58.1871 149.894 53.4267 152.907 48.2078Z" fill="url(#paint0_linear_1118_294)"/>
            <path d="M109.878 93.2851V80.0215L98.8081 86.0051L99.5061 99.0692L109.878 93.2851Z" fill="url(#paint1_linear_1118_294)"/>
            <path d="M138.11 69.4961L131.859 62.2672L125.863 68.2077L133.58 74.5151C135.413 72.5866 136.414 71.4878 138.11 69.4961Z" fill="url(#paint2_linear_1118_294)"/>
            <path d="M121.146 85.5208V72.2144C123.088 70.639 124.166 69.8122 126.031 68.0204L129.947 78.2038C126.559 81.2111 124.566 82.8951 121.146 85.5208Z" fill="url(#paint3_linear_1118_294)"/>
            <defs>
                <linearGradient id="paint0_linear_1118_294" x1="144.779" y1="78.8569" x2="161.374" y2="63.8897" gradientUnits="userSpaceOnUse">
                    <stop/>
                    <stop offset="1" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="paint1_linear_1118_294" x1="113.866" y1="88.2988" x2="101.6" y2="89.5454" gradientUnits="userSpaceOnUse">
                    <stop/>
                    <stop offset="1" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="paint2_linear_1118_294" x1="137.287" y1="63.5028" x2="130.826" y2="69.3496" gradientUnits="userSpaceOnUse">
                    <stop/>
                    <stop offset="1" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="paint3_linear_1118_294" x1="117.076" y1="78.2428" x2="127.397" y2="76.3996" gradientUnits="userSpaceOnUse">
                    <stop/>
                    <stop offset="1" stopOpacity="0"/>
                </linearGradient>
            </defs>
        </svg>
    )
}

const UserIcon = (): JSX.Element => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" 
            className="w-16 h-11 stroke-gray-500 fill-transparent stroke-2" 
            viewBox="0 0 24 24" >
            <circle cx="12" cy="7" r="4" />
            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
        </svg>
    )
}

const KeyIcon = (): JSX.Element => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" 
            className="w-16 h-11 stroke-gray-500 fill-transparent stroke-2"
            viewBox="0 0 24 24">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <circle cx="8" cy="15" r="4" />
            <line x1="10.85" y1="12.15" x2="19" y2="4" />
            <line x1="18" y1="5" x2="20" y2="7" />
            <line x1="15" y1="8" x2="17" y2="10" />
        </svg>
    )
}

const CupIcon = (): JSX.Element => {
    return (
        <svg className="IconSlideBar" xmlns="http://www.w3.org/2000/svg">
            <path d="M24.6131 31.1901H19.2492H17.2882C15.904 31.1901 15.904 32.1115 15.904 34.0162H28.016C28.016 32.6728 28.016 31.1901 26.4559 31.1901H24.6131Z" fill="white" />
            <path d="M19.2492 27.0374H24.6131C26.5634 24.9146 27.7872 23.0037 28.5451 21.0031C29.6875 17.9875 29.7712 14.7679 29.6887 10.3112H14.1737C14.1586 14.9155 14.4133 18.1614 15.4505 21.0031C16.2184 23.107 17.4153 24.9894 19.2492 27.0374Z" fill="white" />
            <path d="M30.8422 8.14828V10.3112H29.6887M30.8422 8.14828V5.98541H27.2086H25.5359H13.1355V8.14828M30.8422 8.14828H34.5335C35.1567 14.8872 34.5837 18.1301 28.5451 21.0031M13.1355 8.14828V10.3112H14.1737M13.1355 8.14828H9.3865C8.86351 16.0728 9.96794 19.1118 15.4505 21.0031M14.1737 10.3112H29.6887M14.1737 10.3112C14.1586 14.9155 14.4133 18.1614 15.4505 21.0031M19.2492 27.0374H24.6131M19.2492 27.0374V31.1901M19.2492 27.0374C17.4153 24.9894 16.2184 23.107 15.4505 21.0031M24.6131 27.0374V31.1901M24.6131 27.0374C26.5634 24.9146 27.7872 23.0037 28.5451 21.0031M29.6887 10.3112C29.7712 14.7679 29.6875 17.9875 28.5451 21.0031M19.2492 31.1901H24.6131M19.2492 31.1901H17.2882C15.904 31.1901 15.904 32.1115 15.904 34.0162M24.6131 31.1901H26.4559C28.016 31.1901 28.016 32.6728 28.016 34.0162M15.904 34.0162H28.016M15.904 34.0162H13.5969V40.0146H30.3808V34.0162H28.016" />
        </svg>

    )
}

const FileIcon = (): JSX.Element => {
    return (
        <svg className="IconSlideBar" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.5 5.69397V13.0273C27.5 13.5135 27.6932 13.9798 28.037 14.3237C28.3808 14.6675 28.8471 14.8606 29.3333 14.8606H36.6667" />
            <path d="M33 31.3606H20.1667C19.1942 31.3606 18.2616 30.9743 17.5739 30.2867C16.8863 29.5991 16.5 28.6664 16.5 27.694V9.36064C16.5 8.38818 16.8863 7.45554 17.5739 6.76791C18.2616 6.08028 19.1942 5.69397 20.1667 5.69397H27.5L36.6667 14.8606V27.694C36.6667 28.6664 36.2804 29.5991 35.5927 30.2867C34.9051 30.9743 33.9725 31.3606 33 31.3606Z" />
            <path d="M29.3334 31.3606V35.0273C29.3334 35.9997 28.9471 36.9324 28.2595 37.62C27.5718 38.3076 26.6392 38.694 25.6667 38.694H12.8334C11.861 38.694 10.9283 38.3076 10.2407 37.62C9.55306 36.9324 9.16675 35.9997 9.16675 35.0273V16.6939C9.16675 15.7215 9.55306 14.7889 10.2407 14.1012C10.9283 13.4136 11.861 13.0273 12.8334 13.0273H16.5001L16.5001 27.694C16.5001 28.6664 16.8864 29.5991 17.5741 30.2867C18.2617 30.9743 19.1943 31.3606 20.1668 31.3606L29.3334 31.3606Z" fill="white" />
        </svg>
    )
}

const GitIcon = (): JSX.Element => {
    return (
        <svg className="IconSlideBar" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.9999 37.5273C24.025 37.5273 25.6666 35.8857 25.6666 33.8606C25.6666 31.8356 24.025 30.194 21.9999 30.194C19.9749 30.194 18.3333 31.8356 18.3333 33.8606C18.3333 35.8857 19.9749 37.5273 21.9999 37.5273Z" />
            <path d="M12.8334 15.5273C14.8585 15.5273 16.5001 13.8857 16.5001 11.8606C16.5001 9.83559 14.8585 8.19397 12.8334 8.19397C10.8084 8.19397 9.16675 9.83559 9.16675 11.8606C9.16675 13.8857 10.8084 15.5273 12.8334 15.5273Z" />
            <path d="M34.8333 11.8606C34.8333 13.8857 33.1917 15.5273 31.1667 15.5273C29.1416 15.5273 27.5 13.8857 27.5 11.8606C27.5 9.83559 29.1416 8.19397 31.1667 8.19397C33.1917 8.19397 34.8333 9.83559 34.8333 11.8606Z" fill="white" />
            <path d="M12.8333 15.5273V19.194C12.8333 20.1665 13.2196 21.0991 13.9072 21.7867C14.5948 22.4744 15.5275 22.8607 16.4999 22.8607H27.4999C28.4724 22.8607 29.405 22.4744 30.0926 21.7867C30.7803 21.0991 31.1666 20.1665 31.1666 19.194V15.5273" />
            <path d="M22 22.8607V30.194" />
        </svg>
    )
}

const ProjectIcon = (): JSX.Element => {
    return (
        <svg className="IconSlideBar" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1119_391)">
                <path d="M25.6665 5.94403V13.2774C25.6665 13.7636 25.8597 14.2299 26.2035 14.5737C26.5473 14.9175 27.0136 15.1107 27.4998 15.1107H34.8332" />
                <path d="M9.1665 24.2774V9.6107C9.1665 8.63824 9.55281 7.70561 10.2404 7.01797C10.9281 6.33034 11.8607 5.94403 12.8332 5.94403H25.6665L34.8332 15.1107V35.2774C34.8332 36.2498 34.4469 37.1825 33.7592 37.8701C33.0716 38.5577 32.139 38.944 31.1665 38.944H26.4998M13.5145 24.2774H26.3478M26.3478 24.2774L20.8478 18.7774M26.3478 24.2774L20.8478 29.7774M22.1958 38.944H9.36578M9.36578 38.944L14.8644 33.444M9.36578 38.944L14.8644 44.444" />
            </g>
            <defs>
                <clipPath id="clip0_1119_391">
                    <rect width="44" height="46" fill="white" transform="translate(0 0.527344)" />
                </clipPath>
            </defs>
        </svg>

    )
}

const Arrow = (): JSX.Element => {
    return (
        <svg className="IconWTab" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.33333 1.77943L6.33333 14.2206M6.33333 14.2206L1 8.88869M6.33333 14.2206L11.6667 8.88869" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}

const Refresh = (): JSX.Element => {
    return (
        <svg className="IconWTab" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.7538 10.1535C14.3856 9.99261 13.9569 10.1607 13.7962 10.5287C12.7893 12.833 10.5143 14.3219 8.0001 14.3219C6.00712 14.3219 4.16463 13.3852 2.98467 11.8491L5.46851 12.3431C5.86249 12.4215 6.24527 12.1656 6.32367 11.7717C6.40202 11.3777 6.14617 10.9949 5.75224 10.9165L1.67939 10.1064C1.28546 10.0282 0.902627 10.2839 0.824228 10.6778L0.0141097 14.7507C-0.0642404 15.1446 0.19161 15.5275 0.585542 15.6058C0.633444 15.6153 0.681152 15.62 0.728182 15.62C1.06805 15.62 1.37185 15.3804 1.4407 15.0344L1.88423 12.8045C3.33739 14.6529 5.57881 15.7764 8.0001 15.7764C11.0924 15.7764 13.8907 13.9452 15.129 11.111C15.2898 10.743 15.1218 10.3143 14.7538 10.1535Z" fill="white" />
            <path d="M15.4144 0.393702C15.0205 0.315449 14.6376 0.571202 14.5593 0.965134L14.1157 3.19525C12.6625 1.34704 10.4211 0.223572 8.00007 0.223572C4.90781 0.223572 2.10951 2.05486 0.871084 4.88889C0.710262 5.25693 0.878259 5.68568 1.2463 5.8465C1.34114 5.8879 1.4399 5.90754 1.53716 5.90754C1.81744 5.90754 2.08454 5.74454 2.20396 5.47128C3.21087 3.16698 5.48598 1.67804 8.00012 1.67804C9.99276 1.67804 11.8352 2.61456 13.0152 4.15048L10.5314 3.65638C10.1374 3.57808 9.75461 3.83383 9.67621 4.22777C9.59786 4.6217 9.85366 5.00458 10.2476 5.08297L14.3205 5.89319C14.3676 5.90255 14.4151 5.90715 14.4625 5.90715C14.6052 5.90715 14.746 5.86507 14.8665 5.78459C15.0269 5.67744 15.1381 5.51094 15.1757 5.32176L15.9858 1.24881C16.0642 0.85493 15.8084 0.472052 15.4144 0.393702Z" fill="white" />
        </svg>
    )
}

const Adding = (): JSX.Element => {
    return (
        <svg width="24" height="24"xmlns="http://www.w3.org/2000/svg">
            <path d="M11.9995 1V12M11.9995 23V12M11.9995 12H0.999999H23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

    )
}

export {
    LogoIcon,
    UserIcon,
    KeyIcon, 
    CupIcon, 
    FileIcon, 
    GitIcon, 
    ProjectIcon, 
    Arrow, 
    Refresh,
    Adding
}