import { FunctionComponent, useState } from 'react'

import { useReactiveVar } from '@apollo/client'
import { menuOpen, editingTask } from '../../global'

import Header from './Header'
import SideBar from './SideBar'
import Tinter from '../Tinter'
import AddTask from '../Popups/AddTask'
import AddGroup from '../Popups/AddGroup'
import AddProject from '../Popups/AddProject'
import EditTask from '../Popups/EditTask'

import styles from './style.module.scss'

const Menu : FunctionComponent = () => {
  const [addingTask, setAddingTask] = useState<boolean>(false)
  const [addingGroup, setAddingGroup] = useState<boolean>(false)
  const [addingProject, setAddingProject] = useState<boolean>(false)
  const isEditingTask = useReactiveVar(editingTask)

  const callbackHandler = (type: string) => {
    if (type === 'task') {
      setAddingTask(true)
      setAddingGroup(false)
      setAddingProject(false)
    } else if (type === 'group') {
      setAddingGroup(true)
      setAddingTask(false)
      setAddingProject(false)
    } else if (type === 'project') {
      setAddingProject(true)
      setAddingTask(false)
      setAddingGroup(false)
    }
  }

  const open = useReactiveVar(menuOpen)

  return (
    <div className={styles.outter}>
      <Header callback={callbackHandler} />
      <SideBar callback={callbackHandler} />

      {addingTask && <Tinter><AddTask callback={() => setAddingTask(false)} /></Tinter>}
      {addingGroup && <Tinter><AddGroup callback={() => setAddingGroup(false)} /></Tinter>}
      {addingProject && <Tinter><AddProject callback={() => setAddingProject(false)} /></Tinter>}
      {isEditingTask && <Tinter><EditTask callback={() => setAddingTask(false)} /></Tinter>}
    </div>
  )
}

export default Menu