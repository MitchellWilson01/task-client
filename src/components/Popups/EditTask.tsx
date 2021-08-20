import { FunctionComponent, useState, useRef, useEffect } from 'react'

import { gql, useMutation, useReactiveVar, useQuery } from '@apollo/client'
import { CREATE_TASK, UPDATE_TASK } from '../../graphql/Mutation'
import { GET_GROUPS, GET_PROJECTS, GET_TASK, GET_TASKS } from '../../graphql/Queries'
import { darkMode, currentUserID, editingTask, currentTask } from '../../global'

import Group from '../../models/group'
import Project from '../../models/project'
import ErrorText from '../ErrorText'
import DatePicker from '../DatePicker'

import styles from './style.module.scss'


interface IAddTaskProps {
  callback: () => any
}

const EditTask: FunctionComponent<IAddTaskProps> = (props) => {
  const [name, setName] = useState<string>(currentTask().name)
  const [group, setGroup] = useState<string>(currentTask().group)
  const [project, setProject] = useState<string>(currentTask().project)
  const [error, setError] = useState<string>('')
  const [date, setDate] = useState<string>(currentTask().date)
  const [time, setTime] = useState<string>(currentTask().time)
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false)

  const dark = useReactiveVar(darkMode)

  const { data: groups } = useQuery(GET_GROUPS, {
    variables: { userid: currentUserID() },
    fetchPolicy: 'cache-only' 
  })

  const { data: projects } = useQuery(GET_PROJECTS, {
    variables: { userid: currentUserID() },
    fetchPolicy: 'cache-only'
  })

  const [updateTask] = useMutation(UPDATE_TASK)
  
  const updateTaskHelper = () => {
    setError('')
    if (name.length > 20) {
      setError('Task names can not exceed 20 characters')
    } else if (name === '') {
      setError('Task name field cannot be empty')
    } else if (group !== '' && !groups.getGroups.some((element: Group) => element.name === group)) {
      setError('That group name does not exist')
      return
    } else if (project !== '' && !projects.getProjects.some((element: Project) => element.name === project)) {
      setError('That group name does not exist')
      return
    }
    
    updateTask({variables: { id: currentTask().id, name: name, userid: currentUserID(), group: group, date: date.toString(), time: time, project: project, in_progress: false, completed: false, notes: '' } })
    editingTask(false)
  }

  const closeAddingPane = () => {
    setShowDatePicker(false)
    editingTask(false)
  }

  const setDateHelper = (newDate: string) => {
    setDate(newDate)
    setShowDatePicker(false)
  }

  const getClear = () => {
    if (date === '') {
      return true
    } else {
      return false
    }
  }

  const validateTimeInput = () => {
    if (time === '') {
      setTime('')
    }
  }

  const getDatePickerClassNames = () => {
    let classes
    if (showDatePicker) {
      if (date) {
        classes = `${styles.datePicker} ${styles.datePickerOpen}`
      } else {
        classes = `${styles.datePicker} ${styles.noDate} ${styles.datePickerOpen}`
      }
    } else {
      if (date) {
        classes = styles.datePicker
      } else {
        classes = `${styles.datePicker} ${styles.noDate}`
      }
    }
    return classes
  }

  return (
    <div className={dark ? `${styles.outter} ${styles.dark} ${styles.change}` : `${styles.outter} ${styles.light} ${styles.change}`}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <button
              className={`${styles.button} ${styles.cancel}`}
              onClick={() => closeAddingPane()}
            >
              CANCEL
            </button>
          </div>
          <ErrorText error={error} />
        </div>

        <input 
          className={styles.input}
          type='text'
          name='task'
          id='task'
          placeholder='Task Name'
          onChange={event => setName(event.target.value)}
          value={name}
          onBlur={() => validateTimeInput()}
        />

        <div className = {styles.datePicker}>
          <input 
            className={styles.miniInput}
            type='text'
            name='group'
            id='group'
            placeholder='Group Name'
            onChange={event => setGroup(event.target.value)}
            value={group}
            onBlur={() => validateTimeInput()}
          />
          <i className={styles.icon + " fas fa-times"} onClick={() => setGroup('')}></i>
        </div>

        <div className = {styles.datePicker}>
          <input 
            className={styles.miniInput}
            type='text'
            name='project'
            id='project'
            placeholder='Project Name'
            onChange={event => setProject(event.target.value)}
            value={project}
            onBlur={() => validateTimeInput()}
          />
          <i className={styles.icon + " fas fa-times"} onClick={() => setProject('')}></i>
        </div>

        <div className={getDatePickerClassNames()}>
          <div className={styles.date} onClick={() => setShowDatePicker(!showDatePicker)}>
            {date ? date : '01/01/2021'}
          </div> 
          <i className={styles.icon + " fas fa-times"} onClick={() => setDate('')}></i>
        </div>

        <div className = {styles.datePicker}>
          <input 
            className={styles.miniInput}
            type='text'
            name='time'
            id='time'
            placeholder='12:00 AM'
            onChange={event => setTime(event.target.value)}
            value={time}
          />
          <i className={styles.icon + " fas fa-times"} onClick={() => setTime('')}></i>
        </div>
        
        <DatePicker open={showDatePicker} setDateCallback={(newDate: string) => setDateHelper(newDate)} clear={getClear()} />
      
        <button
          className={styles.button}
          onClick={() => updateTaskHelper()}
        >
          UPDATE TASK
        </button>
    </div>     
  )
}

export default EditTask
//