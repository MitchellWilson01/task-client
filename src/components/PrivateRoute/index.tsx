import { FunctionComponent } from 'react'
import { Redirect } from 'react-router-dom'

import { auth } from '../../authentication/firebase'

const PrivateRoute: FunctionComponent = props => {
  const { children } = props

  if (!auth.currentUser) {
    return <Redirect to='/login' />
  }

  return (
    <div>{children}</div>
  )
}

export default PrivateRoute