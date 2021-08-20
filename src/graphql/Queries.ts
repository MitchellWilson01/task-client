import { gql } from '@apollo/client'

export const GET_USER = gql`
  query getUser($userid: String!) {
    getUser(userid: $userid) {
      id
      userid
      name
      email
    }
  }
`

export const GET_GROUPS = gql`
  query getGroups($userid: String!) {
    getGroups(userid: $userid) {
      id
      name
      userid
    }
  }
`

export const GET_PROJECTS = gql`
  query getProjects($userid: String!) {
    getProjects(userid: $userid) {
      id
      name
      userid
    }
  }
`

export const GET_PROJECT = gql`
  query getProject($id: Int!) {
    getProject(id: $id) {
      id
      name
      userid
    }
  }
`

export const GET_TASKS = gql`
  query getTasks($userid: String!) {
    getTasks(userid: $userid) {
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

export const GET_TASK = gql`
  query getTask($id: ID!) {
    getTask(id: $id) {
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

export const GET_PROJECT_TASKS = gql`
  query getProjectTasks($project: String!) {
    getProjectTasks(project: $project) {
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