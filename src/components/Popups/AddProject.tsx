import { FunctionComponent, useState } from 'react'

import { gql, useMutation, useReactiveVar, useQuery } from '@apollo/client'
import { CREATE_PROJECT } from '../../graphql/Mutation'
import { GET_PROJECTS } from '../../graphql/Queries'
import { darkMode, currentUserID } from '../../global'

import Project from '../../models/group'
import ErrorText from '../ErrorText'

import styles from './style.module.scss'

interface IAddProjectProps {
  callback: () => any
}

const AddProject: FunctionComponent<IAddProjectProps> = (props) => {
  const [project, setProject] = useState<string>('')
  const [error, setError] = useState<string>('')

  const dark = useReactiveVar(darkMode)

  const { data: projects } = useQuery(GET_PROJECTS, { 
    variables: { userid: currentUserID() },
    fetchPolicy: 'cache-only' 
  })

  const [createProject] = useMutation(CREATE_PROJECT, {
    update(cache, { data: { createProject } }) {
      cache.modify({
        fields: {
          getProjects(existingProjects = []) {
            const newProjectRef = cache.writeFragment({
              data: createProject,
              fragment: gql`
                fragment NewProject on Project {
                  id
                  name
                  userid
                }
              `
            })
            return [...existingProjects, newProjectRef]
          }
        }
      })
    }
  })
  
  const createProjectHelper = () => {
    setError('')
    if (projects.getProjects.some((element: Project) => element.name === project)) {
      setError('That project name already exists')
      return
    } else if (project.length > 20) {
      setError('Project names can not exceed 20 characters')
      return
    } else if (project.toLowerCase() === 'empty :(') {
      setError('Invalid project name')
      return
    } else {
      createProject({variables: { name: project, userid: currentUserID()} })
      props.callback()
    }
  }

  return (
    <div className={dark ? `${styles.outter} ${styles.dark} ${styles.change}` : `${styles.outter} ${styles.light} ${styles.change}`}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <button
              className={`${styles.button} ${styles.cancel}`}
              onClick={() => props.callback()}
            >
              CANCEL
            </button>
          </div>

          <ErrorText error={error} />
        </div>

        <input 
          className={styles.input}
          type='text'
          name='project'
          id='project'
          placeholder='Project Name'
          onChange={event => setProject(event.target.value)}
          value={project}
          autoFocus
        />

        <button
          className={styles.button}
          onClick={() => createProjectHelper()}
        >
          ADD PROJECT
        </button>
    </div>     
  )
}

export default AddProject