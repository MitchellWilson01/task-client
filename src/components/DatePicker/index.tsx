import { FunctionComponent, useState } from 'react'

import { useReactiveVar } from '@apollo/client'
import { darkMode, getMonthFromDate } from '../../global'

import styles from './style.module.scss'


interface IDatePickerProps {
  open: boolean
  setDateCallback: (newDate: string) => void
  clear: boolean
}

const DatePicker: FunctionComponent<IDatePickerProps> = (props) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [calendarDate, setCalendarDate] = useState<Date>(new Date())
  const [page, setPage] = useState<number>(0)

  const dark = useReactiveVar(darkMode)

  const getDaysArray = (start: Date, end: Date) => {
    for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt))
    }
    return arr
  }

  const subtractDaysFromDate = (days: number, date: Date) => {
    date.setDate(date.getDate() - days)
    return date
  }

  const addDaysToDate = (days: number, date: Date) => {
    date.setDate(date.getDate() + days)
    return date
  }

  const getDaysInMonth = (month: number, year: number) => {
    var date = new Date(year, month, 1)
    var days = []
    while (date.getMonth() === month) {
      days.push(new Date(date))
      date.setDate(date.getDate() + 1)
    }
    return days
  }

  const subtractMonthFromCalendar = () => {
    if (page <= 12 && page > -12) {
      const newDate = new Date(calendarDate)
      newDate.setMonth(calendarDate.getMonth() - 1)
      setCalendarDate(newDate)
      setPage(page - 1)
    }
  }

  const addMonthToCalendar = () => {
    if (page < 12 && page >= -12) {
      const newDate = new Date(calendarDate)
      newDate.setMonth(calendarDate.getMonth() + 1)
      setCalendarDate(newDate)
      setPage(page + 1)
    } else if (page === -12) {
      setPage(page + 1)
    }
  }

  const setSelectedDateHelper = (day: Date) => {
    const monthNum = day.getMonth() + 1
    const month = monthNum.toString()
    const date = day.getDate().toString()
    const year = day.getFullYear().toString()
    const formattedDateString = month + '/' + date + '/' + year
    setSelectedDate(day)
    props.setDateCallback(formattedDateString)
  }

  const getDayClassName = (day: Date) => {
    let weekend = day.getDay() === 0 || day.getDay() === 6
    let selected = selectedDate.getTime() === day.getTime()
    let classes
    if (selected && !props.clear) {
      classes = `${styles.gridItemDay} ${styles.selected}`
    } else {
      if (weekend) {
        classes = styles.gridItemPrevDay
      } else {
        classes = styles.gridItemDay
      }
    }
    return classes
  }

  let daylist = getDaysArray(subtractDaysFromDate(365, new Date()), addDaysToDate(365, new Date()))
  daylist.map((v)=>v.toISOString().slice(0,10)).join('')

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const days = getDaysInMonth(calendarDate.getMonth(), calendarDate.getFullYear())
  const numGaps = days[0].getDay()
  let gaps = []
  for (let i = 0; i < numGaps; i++) {
    gaps.push('')
  }  

  if (!props.open) return null

  return (
    <div className={dark ? `${styles.outter} ${styles.dark}` : `${styles.outter} ${styles.light}`}>
      <div className={styles.month}>
        <i className={styles.angleLeft + " fas fa-angle-left"} onClick={() => subtractMonthFromCalendar()}></i>
        {getMonthFromDate(calendarDate, true)} {calendarDate.getFullYear()}
        <i className={styles.angleRight + " fas fa-angle-right"} onClick={() => addMonthToCalendar()}></i>
      </div>
      <div className={styles.grid}>
        {weekdays.map((day) => <div className={`${styles.weekday} ${styles.gridItemWeekday}`} key={day}>{day}</div>)}
        {gaps.map((gap, index) => <div key={index}/>)}
        {days.map((day) => <div className={getDayClassName(day)} 
          key={day.getDate()} 
          onClick={() => setSelectedDateHelper(day)}
        >
          {day.getDate()}
        </div>)}
      </div>
    </div>
  )
}

export default DatePicker