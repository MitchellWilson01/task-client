type Task = {
  __typename: string 
  id: number
  name: string 
  userid: string 
  group: string
  date: string
  time: string
  project: string
  inProgress: boolean
  completed: boolean
  notes: string
}

export default Task