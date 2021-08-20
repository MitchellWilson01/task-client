import { FunctionComponent, useState, useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { useQuery, useMutation, useReactiveVar } from '@apollo/client'
import { GET_GROUPS, GET_PROJECTS } from '../../../graphql/Queries'
import { DELETE_GROUP } from '../../../graphql/Mutation'
import { darkMode, currentUserID, menuOpen, openedProject } from '../../../global'

import Group from '../../../models/group'
import Project from '../../../models/project'
import styles from './style.module.scss'


interface ISidebarProps {
  callback: (type: string) => void
}

const Sidebar: FunctionComponent<ISidebarProps> = (props) => {
  const [groupsOpen, setGroupsOpen] = useState<boolean>(true)
  const [projectsOpen, setProjectsOpen] = useState<boolean>(true)
  const [deleteGroupIndex, setDeleteGroupIndex] = useState<number>(-1)

  const history = useHistory()

  const node = useRef<HTMLDivElement>(null)

  const dark = useReactiveVar(darkMode)
  const open = useReactiveVar(menuOpen)

  const { data: groups } = useQuery(GET_GROUPS, { variables: { userid: currentUserID() }})
  const { data: projects } = useQuery(GET_PROJECTS, { variables: { userid: currentUserID() }})
  const [deleteGroup] = useMutation(DELETE_GROUP)

  const deleteGroupHelper = (id: number) => {
    deleteGroup({
      variables: { id },
      update(cache) {
        const normalizedId = cache.identify({ id, __typename: 'Group' });
        cache.evict({ id: normalizedId });
        cache.gc();
      }
    })
  }

  const openProject = (id: number, name: string) => {
    sessionStorage.setItem('project', id.toString())
    openedProject(name)
    history.push('/project')
  }

  const getClassNames = () => {
    let classes;
    if (open) {
      if (dark) {
        classes = `${styles.outter} ${styles.open} ${styles.dark}`
      } else {
        classes = `${styles.outter} ${styles.open} ${styles.light}`
      }
    } else {
      if (dark) {
        classes = `${styles.outter} ${styles.dark}`
      } else {
        classes = `${styles.outter}  ${styles.light}`
      }
    }
    return classes
  }

  const handleClick = (e: MouseEvent) => {
    if (node.current?.contains(e.target as Node)) {
      //inside click
      return
    }

    // outside click
    setDeleteGroupIndex(-1)
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [])

  return (
    <div className={getClassNames()}>
      <div className={styles.container}>
        <div className={styles.title}>Groups</div>
        <div className={styles.wrapper}>
          <i className={groupsOpen ? `${styles.icon} ${styles.up}` + " fas fa-angle-left" : styles.icon + " fas fa-angle-left"} onClick={() => setGroupsOpen(!groupsOpen)}></i>
          <i className={styles.icon + " fas fa-plus"} onClick={() => props.callback('group')}></i>
        </div>

        <ul className={groupsOpen ? `${styles.groups} ${styles.open}` : styles.groups}>
          {groups && groups.getGroups.map((group: Group, index: number) => 
            <li className={styles.group} key={index} onClick={() => setDeleteGroupIndex(index)}>
              <div>
                <span className={styles.bullet}>&#8226;&nbsp;&nbsp;&nbsp;</span>
                {group.name}
              </div>
              {deleteGroupIndex === index && <div className={styles.remove} onClick={() => deleteGroupHelper(group.id)} ref={node}>DELETE</div>}
            </li>
          )}
        </ul>
      </div>
      
      <div className={styles.container}>
        <div className={styles.title}>Projects</div>
        <div className={styles.wrapper}>
          <i className={projectsOpen ? `${styles.icon} ${styles.up}` + " fas fa-angle-left" : styles.icon + " fas fa-angle-left"} 
            onClick={() => setProjectsOpen(!projectsOpen)}>
          </i>
          <i className={styles.icon + " fas fa-plus"} onClick={() => props.callback('project')}></i>
        </div>

        <ul className={projectsOpen ? `${styles.groups} ${styles.open}` : styles.groups}>
          {projects && projects.getProjects.map((project: Project, index: number) => 
            <li className={styles.group} key={index} onClick={() => openProject(project.id, project.name)}>
              <div>
                <span className={styles.bullet}>&#8226;&nbsp;&nbsp;&nbsp;</span>
                {project.name}
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Sidebar

