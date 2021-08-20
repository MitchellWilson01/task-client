import { FunctionComponent, useState } from 'react'
import { Link } from 'react-router-dom'

import { useReactiveVar } from '@apollo/client'
import { bigScreen, darkMode, menuOpen } from '../../../global'

import styles from './style.module.scss'


interface IHeaderProps {
  callback: (type: string) => void
}

const Header: FunctionComponent<IHeaderProps> = (props) => {
  const dark = useReactiveVar(darkMode)
  const open = useReactiveVar(menuOpen)
  const big = useReactiveVar(bigScreen)

  const closeMenuHelper = (): void => {
    if (open && !big) menuOpen(!open)
  }

  return (
    <div className={dark ? `${styles.outter} ${styles.dark}` : `${styles.outter} ${styles.light}`}>
      <div className={styles.left}>
        <i className={styles.icon + " fas fa-bars"} onClick={() => menuOpen(!open)}></i>
        <Link to='/feed'>
          <i className={styles.icon + " fas fa-home"} onClick={() => closeMenuHelper()}></i>
        </Link>
      </div>
      <div className={styles.right}>
        <i className={styles.icon + " fas fa-plus"} onClick={() => props.callback('task')}></i>
        <i className={styles.icon + " fas fa-calendar-check"}></i>
        <Link to='/settings' onClick={() => closeMenuHelper()}>
          <i className={styles.icon + " fas fa-cog"}></i>
        </Link>
      </div>
    </div>
  )
}

export default Header