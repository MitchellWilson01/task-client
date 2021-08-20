import { FunctionComponent, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'

import { useReactiveVar } from '@apollo/client'

import { currentUserID, darkMode } from '../../../global'
import { auth } from '../../../authentication/firebase'
import ErrorText from '../../ErrorText'

import styles from '../style.module.scss'

const Login: FunctionComponent = () => {
  const [authenticating, setAuthenticating] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')

  const history = useHistory()

  const dark = useReactiveVar(darkMode)

  const signInWithEmailAndPassword = () => {
    if (error !== '') setError('')

    setAuthenticating(true)

    auth.signInWithEmailAndPassword(email, password)
      .then(result => {
        history.push('/feed')
      })
      .catch(error => {
        console.log(error)
        setAuthenticating(false)

        if (error.code.includes('auth/invalid-email')) {
            setError('Enter a valid email address')
        } else if (error.code.includes) {
            setError('Incorrect email or password')
        } else {
            setError('Failed to sign in')
        }
      })
  }
  
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

      <input 
        className={styles.input}
        autoComplete='password'
        type='password'
        name='password'
        id='password'
        placeholder='Password'
        onChange={event => setPassword(event.target.value)}
        value={password}
      />

      <Link to='/forgot' className={styles.forgot}>Forgot password?</Link>

      <button
        className={styles.button}
        disabled={authenticating}
        onClick={() => signInWithEmailAndPassword()}
      >
        SIGN IN
      </button>

      <div className={styles.small}>
        Need an account? &nbsp;
        <Link to='/register' className={styles.link}> Sign up.</Link>
      </div>
    </div>
  )
} 

export default Login