import { FunctionComponent, useState, useContext } from 'react'
import { Redirect } from 'react-router-dom'

import { useReactiveVar } from '@apollo/client'

import { darkMode } from '../../../global'
import { auth } from '../../../authentication/firebase'
import ErrorText from '../../ErrorText'

import styles from '../style.module.scss'

interface IChangePasswordProps {
  callback: () => any
}

const ChangePassword: FunctionComponent<IChangePasswordProps> = (props) => {
    const [changing, setChanging] = useState<boolean>(false)
    const [changed, setChanged] = useState<boolean>(false)
    const [password, setPassword] = useState<string>('')
    const [old, setOld] = useState<string>('')
    const [confirm, setConfirm] = useState<string>('')
    const [error, setError] = useState<string>('')

    const dark = useReactiveVar(darkMode)
    
    const passwordChangeRequest = () => {
      if (password !== confirm) {
        setError('Passwords do not match')
        return
      }

      if (error !== '') setError('')

      setChanging(true)

      auth.currentUser?.updatePassword(password)
      .then(() => {
        setChanged(true)
      })
      .catch(error => {
        setChanging(false)
        setError(error.message)
      })
    }

    if (auth.currentUser?.providerData[0]?.providerId !== 'password') {
      return <Redirect to='feed' />
    }
    
    if (changed) {
      return (
        <div className={dark ? `${styles.outter} ${styles.dark} ${styles.change}` : `${styles.outter} ${styles.light} ${styles.change}`}>
          <div className={styles.container}>
          <div className={styles.wrapper}>
            <button
              className={`${styles.button} ${styles.cancel}`}
              onClick={() => props.callback()}
            >
              CLOSE
            </button>
          </div>

          <div className={styles.message}>
            Your password has been changed
          </div>
        </div>
        </div>
      )
    }

    return (
      <div className={dark ? `${styles.outter} ${styles.dark} ${styles.change}` : `${styles.outter} ${styles.light} ${styles.change}`}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <button
              className={`${styles.button} ${styles.cancel}`}
              disabled={changing}
              onClick={() => props.callback()}
            >
              CANCEL
            </button>
          </div>

          <ErrorText error={error} />
        </div>

        <input 
          className={styles.input}
          autoComplete='new-password'
          type='password'
          name='oldPassword'
          id='oldPassword'
          placeholder='Current Password'
          onChange={event => setOld(event.target.value)}
          value={old}
        />

        <input 
          className={styles.input}
          autoComplete='new-password'
          type='password'
          name='password'
          id='password'
          placeholder='Password'
          onChange={event => setPassword(event.target.value)}
          value={password}
        />

        <input 
          className={styles.input}
          autoComplete='new-password'
          type='password'
          name='confirm'
          id='confirm'
          placeholder='Confirm Password'
          onChange={event => setConfirm(event.target.value)}
          value={confirm}
        />

        <button
          className={styles.button}
          disabled={changing}
          onClick={() => passwordChangeRequest()}
        >
          CHANGE PASSWORD
        </button>
    </div>     
    )
}

export default ChangePassword