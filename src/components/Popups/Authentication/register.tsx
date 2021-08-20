import { FunctionComponent, useState, useContext } from 'react'
import { useHistory, Link } from 'react-router-dom'

import { useMutation, useReactiveVar } from '@apollo/client'
import { CREATE_USER, CREATE_GROUP, CREATE_PROJECT, CREATE_TASK } from '../../../graphql/Mutation'

import { darkMode } from '../../../global'
import { auth } from '../../../authentication/firebase'
import ErrorText from '../../ErrorText'

import styles from '../style.module.scss'

const Register: FunctionComponent = () => {
  const [registering, setRegistering] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirm, setConfirm] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [name, setName] = useState<string>('')

  const [createUser, { error: userError }] = useMutation(CREATE_USER)
  const [createGroup, { error: groupError }] = useMutation(CREATE_GROUP)
  const [createProject, { error: projectError }] = useMutation(CREATE_PROJECT)
  const [createTask, {error: taskError}] = useMutation(CREATE_TASK)

  const history = useHistory()
  const dark = useReactiveVar(darkMode)

  const signUpWithEmailAndPassword = () => {
    if (error !== '') {
      setError('')
    }

    setRegistering(true)

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    auth.createUserWithEmailAndPassword(email, password)
    .then(result => {
      createUser({ variables: { userid: result.user?.uid, name: name, email: email } })
      createGroup({ variables: {name: 'Home', userid: result.user?.uid} })
      createGroup({ variables: {name: 'Work', userid: result.user?.uid} })
      createGroup({ variables: {name: 'Health', userid: result.user?.uid} })
      createGroup({ variables: {name: 'School', userid: result.user?.uid} })
      createGroup({ variables: {name: 'Other', userid: result.user?.uid} })
      createProject({ variables: {name: 'Get Started', userid: result.user?.uid} })
      createTask({ variables: {
        name: 'Create a task', 
        userid: result.user?.uid,
        group: '',
        date: '',
        time: '',
        project: 'Get Started',
        in_progress: true,
        completed: false,
        notes: 'Click the plus button in the menu bar and fill out the new task form.'
      }})
      createTask({ variables: {
        name: 'Keep your tasks up to date', 
        userid: result.user?.uid,
        group: '',
        date: '',
        time: '',
        project: 'Get Started',
        in_progress: true,
        completed: false,
        notes: 'Clicking the circle next to a task will step through that task\'s lifecycle. Yellow is for incomplete, blue is for in-progress, and green is for completed.'
      }})
      
      history.push('/feed')
    })
    .catch(error => {
      if (error.code.includes('auth/weak-password')) {
        setError('Password is too weak')
      } 
      else if (error.code.includes('auth/email-already-in-use')) {
        setError('Email is already in use')
      } 
      else if (error.code.includes('auth/invalid-email')) {
        setError('Enter a valid email')
      } 
      else {
        setError('An unknown error occured')
      }

      setRegistering(false)
    })
  }

  const catchOtherErrors = () => {
    if (password !== confirm) {
      setError('Passwords do not match')
    }
    else {
      signUpWithEmailAndPassword()
    }
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
        autoComplete='username'
        type='text'
        name='name'
        id='name'
        placeholder='Display Name'
        onChange={event => setName(event.target.value)}
        value={name}
      />

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
        disabled={registering}
        onClick={() => catchOtherErrors()}
      >
        SIGN UP
      </button>

      <div className={styles.small}>
          Already have an account? &nbsp;
          <Link to='/login' className={styles.link}> Sign in.</Link>
        </div>
    </div>
  )
} 

export default Register