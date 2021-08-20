import { FunctionComponent } from 'react'

import { useReactiveVar } from '@apollo/client'
import { darkMode } from '../../global'

import styles from './style.module.scss'


interface IConfirmDeleteProps {
  callback: () => any
}

const ConfirmDelete: FunctionComponent<IConfirmDeleteProps> = (props) => {
  const dark = useReactiveVar(darkMode)

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
        </div>
    </div>
  )
}

export default ConfirmDelete