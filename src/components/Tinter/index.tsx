import { FunctionComponent } from 'react'

import styles from './style.module.scss'

const Tinter: FunctionComponent = (props) => {
  return (
    <div className={styles.outter}>
      {props.children}
    </div>
  )
}

export default Tinter