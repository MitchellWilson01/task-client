import { FunctionComponent, useState } from 'react'

import { gql, useMutation, useReactiveVar, useQuery } from '@apollo/client'
import { CREATE_GROUP } from '../../graphql/Mutation'
import { GET_GROUPS } from '../../graphql/Queries'
import { darkMode, currentUserID } from '../../global'

import Group from '../../models/group'
import ErrorText from '../ErrorText'

import styles from './style.module.scss'
import { useEffect } from 'react'


interface IAddGroupProps {
  callback: () => any
}

const AddGroup: FunctionComponent<IAddGroupProps> = (props) => {
  const [group, setGroup] = useState<string>('')
  const [error, setError] = useState<string>('')

  const dark = useReactiveVar(darkMode)

  const { data: groups } = useQuery(GET_GROUPS, { 
    variables: { userid: currentUserID() },
    fetchPolicy: 'cache-only' 
  })

  const [createGroup] = useMutation(CREATE_GROUP, {
    update(cache, { data: { createGroup } }) {
      cache.modify({
        fields: {
          getGroups(existingGroups = []) {
            const newGroupRef = cache.writeFragment({
              data: createGroup,
              fragment: gql`
                fragment NewGroup on Group {
                  id
                  name
                  userid
                }
              `
            })
            return [...existingGroups, newGroupRef]
          }
        }
      })
    }
  })
  
  const createGroupHelper = () => {
    setError('')
    if (groups.getGroups.some((element: Group) => element.name === group)) {
      setError('That group name already exists')
      return
    } else if (group.length > 20) {
      setError('Group names can not exceed 20 characters')
    } else {
      createGroup({variables: { name: group, userid: currentUserID()} })
      props.callback()
    }
  }

  useEffect(() => {
    console.log(JSON.stringify(groups.getGroups))
    const exists = groups.getGroups.some((element: Group) => element.name === 'Homee')
    console.log("Exists: " + exists)
  }, [groups])

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
          name='group'
          id='group'
          placeholder='Group Name'
          onChange={event => setGroup(event.target.value)}
          value={group}
          autoFocus
        />

        <button
          className={styles.button}
          onClick={() => createGroupHelper()}
        >
          ADD GROUP
        </button>
    </div>     
  )
}

export default AddGroup

