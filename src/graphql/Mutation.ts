
import { gql } from '@apollo/client'

export const CREATE_USER = gql`
  mutation createGroup($userid: String!, $name: String!, $email: String!) {
    createUser(userid: $userid, name: $name, email: $email) {
      id
      userid
      name
      email
    }
  }
`

export const CREATE_GROUP = gql`
  mutation createGroup($name: String!, $userid: String!) {
    createGroup(name: $name, userid: $userid) {
      id
      name
      userid
    }
  }
`

export const DELETE_GROUP = gql`
  mutation deleteGroup($id: ID!) {
    deleteGroup(id: $id) {
      message
    }
  }
`

export const CREATE_PROJECT = gql`
  mutation createProject($name: String!, $userid: String!) {
    createProject(name: $name, userid: $userid) {
      id
      name
      userid
    }
  }
`

export const DELETE_PROJECT = gql`
  mutation deleteProject($id: ID!) {
    deleteProject(id: $id) {
      message
    }
  }
`

export const CREATE_TASK = gql`
  mutation createTask($name: String!, $userid: String!, $group: String!, $date: String!, $time: String!, $project: String!, $in_progress: Boolean!, $completed: Boolean!, $notes: String!) {
    createTask(name: $name, userid: $userid, group: $group, date: $date, time: $time, project: $project, in_progress: $in_progress, completed: $completed, notes: $notes) {
      id
      name
      userid
      group
      date
      time
      project
      in_progress
      completed
      notes
    }
  }
`

export const UPDATE_TASK = gql`
  mutation updateTask($id: ID!, $name: String!, $userid: String!, $group: String!, $date: String!, $time: String!, $project: String!, $in_progress: Boolean!, $completed: Boolean!, $notes: String!) {
    updateTask(id: $id, name: $name, userid: $userid, group: $group, date: $date, time: $time, project: $project, in_progress: $in_progress, completed: $completed, notes: $notes) {
      id
      name
      userid
      group
      date
      time
      project
      in_progress
      completed
      notes
    }
  }
`

export const DELETE_TASK = gql`
  mutation deleteTask($id: ID!) {
    deleteTask(id: $id) {
      message
    }
  }
`
