import { FunctionComponent } from 'react'

import styles from './style.module.scss'

interface IErrorTextProps {
  error: string
}

const ErrorText: FunctionComponent<IErrorTextProps> = (props) => {
  if (props.error === '') return null;

  return (
    <div className={styles.text}>
      {props.error}
    </div>
  )
}

export default ErrorText