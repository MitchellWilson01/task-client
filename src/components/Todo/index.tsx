import { FunctionComponent, useState } from 'react'

import { useReactiveVar, useMutation } from '@apollo/client'
import { DELETE_TASK } from '../../graphql/Mutation'
import { darkMode, editingTask, currentTask } from '../../global'

import Task from '../../models/task'
import styles from './style.module.scss'


interface ITaskProps {
  task: Task
}

const Todo: FunctionComponent<ITaskProps> = (props) => {
  const [deletingTodo, setDeletingTodo] = useState<boolean>(false)

  const dark = useReactiveVar(darkMode)

  const [deleteTask] = useMutation(DELETE_TASK)

  const deleteTaskHelper = (id: number) => {
    deleteTask({
      variables: { id },
      update(cache) {
        const normalizedId = cache.identify({ id, __typename: 'Task' });
        cache.evict({ id: normalizedId });
        cache.gc();
      }
    }).then(() => {
      setDeletingTodo(false)
    })
  }

  const openEditTaskMenuHelper = (task: Task) => {
    currentTask(task)
    editingTask(true)
  }

  return (
    <div className={dark ? `${styles.outter} ${styles.dark}` : `${styles.outter} ${styles.light}`}>
      <i className={styles.circle + " fas fa-circle"}></i>
      <div className={styles.container}>
        <div className={`${styles.section} ${styles.section_1}`}>
          <div className={styles.wrapper}>{props.task.name}</div>
          {!deletingTodo && 
            <div className={styles.wrapper}>
              <i className={styles.button + " far fa-comment"}></i>
              <i className={styles.button + " far fa-edit"} onClick={() => openEditTaskMenuHelper(props.task)}></i>
              <i className={styles.button + " far fa-trash-alt"} onClick={() => setDeletingTodo(true)}></i>
            </div>
          }
          {deletingTodo &&
            <div className={styles.wrapper}>
              <button className={`${styles.bigButton} ${styles.cancelButton}`} onClick={() => setDeletingTodo(false)}>CANCEL</button>
            </div>
          }
        </div>

        <div className={`${styles.section} ${styles.section_2}`}>
          <div className={styles.wrapper_2}>
            {props.task.group && <div className={styles.tag}>
              <i className="far fa-folder-open"></i> {props.task.group}
            </div>}
            {props.task.time && <div className={styles.tag}>
              <i className="far fa-clock"></i> {props.task.time}
            </div>}
            {props.task.date && <div className={styles.tag}>
              <i className="far fa-calendar-check"></i> {props.task.date}
            </div>}
            {props.task.project && <div className={styles.tag}>
              <i className="fas fa-project-diagram"></i> {props.task.project}
            </div>}
          </div>
          {deletingTodo && <button className={`${styles.bigButton} ${styles.deleteButton}`} onClick={() => deleteTaskHelper(props.task.id)}>DELETE</button>}
        </div>
      </div>
    </div>
  )
}

export default Todo