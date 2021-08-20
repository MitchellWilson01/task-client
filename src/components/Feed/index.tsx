import { FunctionComponent, useState, useEffect } from 'react'

import { useQuery, useReactiveVar } from '@apollo/client'
import { GET_TASKS } from '../../graphql/Queries'
import { darkMode, currentUserID, menuOpen, getWindowWidthInRems, bigScreen } from '../../global'

import { getWeekDayFromDate, getMonthFromDate } from '../../global'
import Todo from '../Todo'
import Task from '../../models/task'
import styles from './style.module.scss'

interface DateObj {
  weekday: string
  month: string
  day: string
  year: string
}

const Feed: FunctionComponent = () => {
  const [date, setDate] = useState<Date>(new Date())
  const [daysFromCurrentDate, setDaysFromCurrentDate] = useState<number>(0)

  const { data: tasks } = useQuery(GET_TASKS, { variables: { userid: currentUserID() }})

  const dark = useReactiveVar(darkMode)
  const open = useReactiveVar(menuOpen)
  const big = useReactiveVar(bigScreen)

  let lastWidth = window.innerWidth

  const changeDateHelper = (offset: number) => {
    const newDate = date
    newDate.setDate(newDate.getDate() + offset)
    setDaysFromCurrentDate(daysFromCurrentDate + offset)
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

  const getCurrentDatesTasks = () => {
    const currentDaysTasks = tasks.getTasks.filter((task: Task) => { 
      const currentDateMonth = date.getMonth() + 1
      const currentDateString = currentDateMonth.toString() + '/' + date.getDate().toString() + '/' + date.getFullYear().toString()
      return task.date === currentDateString || task.date === ''
    })
    return currentDaysTasks
  }

  useEffect(() => {
    const today = new Date()
    today.setDate(today.getDate() + daysFromCurrentDate)
    const strToday = today.toLocaleDateString()
    var timer = setInterval(() => {
      if (strToday != date.toLocaleDateString()) {
        setDate(new Date())
      }
    }, 1000)
    return () => clearInterval(timer)
  })

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

  return (
    <div className={getClassNames()}>
      <div className={styles.header}>
        {getWeekDayFromDate(date)} <span className={styles.date}>{getMonthFromDate(date, false)} {date.getDate()} {date.getFullYear()}</span>
        <div className={styles.dateToggler}>
          <i className={styles.leftArrow + " fas fa-angle-left"} onClick={() => changeDateHelper(-1)}></i>
          <i className={styles.rightArrow + " fas fa-angle-right"} onClick={() => changeDateHelper(1)}></i>
        </div>
      </div>

      {tasks && getCurrentDatesTasks().map((task: Task, index: number) => 
        <Todo task={task} key={index} />
      )}
    </div>
  )
}

export default Feed
