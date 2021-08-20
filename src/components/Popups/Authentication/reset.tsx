import { FunctionComponent, useEffect, useState, useContext } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import queryString from 'querystring'

import { useReactiveVar } from '@apollo/client'

import { darkMode } from '../../../global'
import { auth } from '../../../authentication/firebase'
import ErrorText from '../../ErrorText'

import styles from '../style.module.scss'

const ResetPassword: FunctionComponent<RouteComponentProps> = (props) => {
  const [verifying, setVerifying] = useState<boolean>(true)
  const [verified, setVerified] = useState<boolean>(false)
  const [changing, setChanging] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')
  const [confirm, setConfirm] = useState<string>('')
  const [oobCode, setOobCode] = useState<string>('')
  const [error, setError] = useState<string>('')

  const dark = useReactiveVar(darkMode)

  const history = useHistory()

  useEffect(() => {
    let stringParams = queryString.parse(props.location.search)

    if (stringParams) {
      let oobCode = stringParams.oobCode as string

      if (oobCode) {
        verifyPasswordResetLink(oobCode)
      }
      else {
        setVerified(false)
        setVerifying(false)
      }
    }
    else {
      setVerified(false)
      setVerifying(false)
    }
    // eslint-disable-next-line
  }, [])

  const verifyPasswordResetLink = (_oobCode: string) => {
    auth.verifyPasswordResetCode(_oobCode)
    .then(result => {
      setOobCode(_oobCode)
      setVerified(true)
      setVerifying(false)
    })
    .catch(error => {
      setVerified(false)
      setVerifying(false)
    })
  }

  const passwordResetRequest = () => {
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    if (error !== '') setError('')

    setChanging(true)

    auth.confirmPasswordReset(oobCode, password)
    .then(() => {
      history.push('/login')
    })
    .catch(error => {
      setError(error.message)
      setChanging(false)
    })
  }

  if (verifying) return null

  if (verified) {
    return (
      <div className={dark ? `${styles.outter} ${styles.dark}` : `${styles.outter} ${styles.light}`}>
        <div className={styles.header}>
          <i className={styles.logo + ' fas fa-brain'}></i>
          <div className={styles.title}>quark</div>
        </div>

        <ErrorText error={error} />

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
          onClick={() => passwordResetRequest()}
        >
          RESET PASSWORD
        </button>
      </div>
    )
  } else {
    return (
      <div className={`${styles.outter} ${styles.dark}`}>
        <div className={styles.header}>
          <i className={styles.logo + ' fas fa-brain'}></i>
          <div className={styles.title}>quark</div>
        </div>

        <div className={styles.message}>
          Invalid link
        </div>
      </div>
    )
  }
}

export default ResetPassword