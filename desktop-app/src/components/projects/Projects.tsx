import { useState } from 'react'
import '../../assets/css/Projects.css'
import ProjectsMenu from './ProjectsMenu'
import ProjectEdit from './ProjectsEdit'
import ProjectCreate from './ProjectsCreate'

interface Page {
    iscreate: boolean;
    projectName?: String;
}

const Projects = (): JSX.Element => {
    const [page, setPage] = useState<Page>({iscreate: false})
    return (
        <>
            <ProjectsMenu setPage={setPage} />
            <div className='workspace'>
                <div className='workspace-background'>
                    {page.iscreate == true ?
                        <ProjectCreate />: <ProjectEdit />
                    }
                </div>
            </div>
        </>
    )
}


export { Projects, Page }