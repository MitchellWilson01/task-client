import { FunctionComponent, useEffect, useState, useRef } from 'react'

import { useReactiveVar, useQuery, useMutation} from '@apollo/client'
import { GET_PROJECTS, GET_TASKS } from '../../graphql/Queries'
import { DELETE_PROJECT, DELETE_TASK } from '../../graphql/Mutation'
import { bigScreen, darkMode, menuOpen, getWindowWidthInRems, openedProject, currentUserID } from '../../global'

import Task from '../../models/task'
import Project from '../../models/project'
import Todo from '../Todo'
import styles from './style.module.scss'


const ProjectFeed: FunctionComponent = () => {
  const [deleteProjectId, setDeleteProjectId] = useState<number>(-1)
  const [project, setProject] = useState<Project>({
    __typename: '', 
    id: -1,
    name: '', 
    userid: ''
  })

  const node = useRef<HTMLDivElement>(null)

  const dark = useReactiveVar(darkMode)
  const open = useReactiveVar(menuOpen)
  const big = useReactiveVar(bigScreen)

  const [deleteProject] = useMutation(DELETE_PROJECT)
  const [deleteTask] = useMutation(DELETE_TASK)

  const { data: projects } = useQuery(GET_PROJECTS, { 
    variables: { userid: currentUserID() },
    fetchPolicy: 'cache-only' 
  })

  const { data: tasks } = useQuery(GET_TASKS, { variables: { userid: currentUserID() }})

  let lastWidth = window.innerWidth

  const getCurrentProjectsTasks = () => {
    const currentProjectsTasks = tasks.getTasks.filter((task: Task) => { 
      return task.project === openedProject()
    })
    return currentProjectsTasks
  }

  const deleteProjectHelper = (id: number) => {
    deleteProject({
      variables: { id },
      update(cache) {
        const normalizedId = cache.identify({ id, __typename: 'Project' })
        cache.evict({ id: normalizedId })
        cache.gc()
      }
    })

    getCurrentProjectsTasks().forEach((task: Task) => {
      deleteTaskHelper(task.id)
    })
  }

  const deleteTaskHelper = (id: number) => {
    deleteTask({
      variables: { id },
      update(cache) {
        const normalizedId = cache.identify({ id, __typename: 'Task' });
        cache.evict({ id: normalizedId });
        cache.gc();
      }
    })
  }

  const getClassNames = () => {
    let classes;
    if (open && big) {
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
    setDeleteProjectId(-1)
  }

  useEffect(() => {
    const handleResize = () => {
      if (getWindowWidthInRems() >= 72) {
        bigScreen(true)
        if (window.innerWidth > lastWidth) {
          menuOpen(true)
        }
      } else {
        bigScreen(false)
      }
      lastWidth = window.innerWidth
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [])

  useEffect(() => {
    if (projects) {
      setProject(projects.getProjects.find((element: Project) => element.id.toString() === sessionStorage.getItem('project')))
    }
  }, [projects, openedProject()])

  return (
    <div className={getClassNames()}>
      <div className={styles.header}>
        {project ? project.name : 'Empty :('}
        <div className={styles.taskDeleter}>
          {deleteProjectId === -1 && <i className={styles.times + " fas fa-times"} onClick={() => setDeleteProjectId(project.id)}></i>}
          {deleteProjectId != -1 && <div ref={node}><button onClick={() => deleteProjectHelper(project.id)}>DELETE</button></div>}
        </div>
      </div>
      {tasks && getCurrentProjectsTasks().map((task: Task, index: number) => 
        <Todo task={task} key={index} />
      )}
    </div>
  )
}

export default ProjectFeed
