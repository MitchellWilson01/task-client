import { makeVar } from '@apollo/client'
import Task from './models/task'

export const getWindowWidthInRems = () => {
  var computedStyle = window.getComputedStyle(document.documentElement)
  var fontSize = computedStyle.fontSize
  var remWidth = document.body.clientWidth / parseInt(fontSize)
  return remWidth
}

export const getDateObject = (targetDate: Date, full: Boolean) => {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const weekday = weekdays[targetDate.getDay()]
  const month = full ? monthsFull[targetDate.getMonth()] : months[targetDate.getMonth()]
  const day = targetDate.getDate().toString()
  const year = targetDate.getFullYear().toString()
  return { weekday, month, day, year }
}

export const getMonthFromDate = (date: Date, full: Boolean) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return full ? monthsFull[date.getMonth()] : months[date.getMonth()]
}

export const getWeekDayFromDate = (date: Date) => {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return weekdays[date.getDay()]
}

export const currentUserID = makeVar<string>('')
export const currentTask = makeVar<Task>({
  __typename: 'Task' ,
  id: -1,
  name: '',
  userid: '',
  group: '',
  date: '',
  time: '',
  project: '',
  inProgress: false,
  completed: false,
  notes: ''
})
export const darkMode = makeVar<boolean>(true)
export const menuOpen = makeVar<boolean>(true)
export const editingTask = makeVar<boolean>(false)
export const bigScreen = makeVar<boolean>(getWindowWidthInRems() >= 72)
export const openedProject = makeVar<string>('')