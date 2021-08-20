import { FunctionComponent, useState, useContext } from 'react'
import { Link } from 'react-router-dom'

import { useReactiveVar } from '@apollo/client'

import { darkMode } from '../../../global'
import { auth } from '../../../authentication/firebase'
import ErrorText from '../../ErrorText'

import styles from '../style.module.scss'

const ForgotPassword: FunctionComponent = () => {
  const [sending, setSending] = useState<boolean>(false)
  const [sent, setSent] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [error, setError] = useState<string>('')

  const dark = useReactiveVar(darkMode)

  const resetPasswordRequest = () => {
    if (error !== '') setError('')

    setSending(true)

    auth.sendPasswordResetEmail(email)
    .then(() => {
        setSent(true)
        setSending(false)
    })
    .catch(error => {
        setError(error.message)
        setSending(false)
    })
  }

  if (sent) {
    return (
      <div className={dark ? `${styles.outter} ${styles.dark}` : `${styles.outter} ${styles.light}`}>
        <div className={styles.header}>
          <i className={styles.logo + ' fas fa-brain'}></i>
          <div className={styles.title}>quark</div>
        </div>

        <div className={styles.message}>
          A link has been sent to your email with instructions.
        </div>
      </div>
    )
  } else {
    return (
      <div className={dark ? `${styles.outter} ${styles.dark}` : `${styles.outter} ${styles.light}`}>
        <div className={styles.header}>
          <i className={styles.logo + ' fas fa-brain'}></i>
          <div className={styles.title}>quark</div>
        </div>

        <ErrorText error={error} />

        <input 
          className={styles.input}
          autoComplete='email'
          type='email'
          name='email'
          id='email'
          placeholder='Email Address'
          onChange={event => setEmail(event.target.value)}
          value={email}
        />

        <button
          className={styles.button}
          disabled={sending}
          onClick={() => resetPasswordRequest()}
        >
          SEND PASSWORD RESET LINK
        </button>

        <div className={styles.small}>
          Need an account? &nbsp;
          <Link to='/register' className={styles.link}> Sign up.</Link>
        </div>
      </div>
    )
  }
}

export default ForgotPassword