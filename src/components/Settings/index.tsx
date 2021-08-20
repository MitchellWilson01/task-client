import { FunctionComponent, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { useReactiveVar } from '@apollo/client'

import { darkMode } from '../../global'
import { auth } from '../../authentication/firebase'
import ChangePassword from '../Popups/Authentication/change'

import styles from './style.module.scss'

const Settings: FunctionComponent = () => {
  const [changing, setChanging] = useState<boolean>(false)

  const dark = useReactiveVar(darkMode)

  const history = useHistory()

  const Logout = () => {
    auth.signOut()
    .then(() => history.push('/login'))
  }

  return (
    <div className={styles.outter}>
      <button 
        className={dark ? styles.dark : styles.light}
        onClick={() => darkMode(!darkMode())}
      >
        Toggle
      </button>
      
      <button onClick={() => Logout()}>Logout</button>

      <button onClick={() => setChanging(true)}>Change Password</button>

      {changing && <ChangePassword  callback={() => setChanging(false)} />}
    </div>
  )
}

export default Settings

/*
<button 
        className={dark ? styles.dark : styles.light}
        onClick={() => setDark(!dark)}
      >
        Toggle
      </button>
*/