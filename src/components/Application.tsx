import { FunctionComponent, useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import { ApolloClient, ApolloProvider, InMemoryCache, useReactiveVar } from '@apollo/client'

import { auth } from '../authentication/firebase'
import { darkMode, currentUserID } from '../global'

import PrivateRoute from './PrivateRoute'
import Register from './Popups/Authentication/register'
import Login from './Popups/Authentication/login'
import ForgotPassword from './Popups/Authentication/forgot'
import ResetPassword from './Popups/Authentication/reset'
import Menu from './Menu'
import Settings from './Settings'
import Feed from './Feed'
import ProjectFeed from './ProjectFeed'

import styles from './style.module.scss'


const App: FunctionComponent = () => {
  const [authorized, setAuthorized] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const dark = useReactiveVar(darkMode)

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        currentUserID(user.uid)
        setAuthorized(true)
      }
      else {
        setAuthorized(false)
      }

      setLoading(false)
    })
  }, [])

  const client = new ApolloClient({
    uri: 'http://localhost:3001/graphql',
    connectToDevTools: true,
    cache: new InMemoryCache({
      typePolicies: {
        GroupType: {
          keyFields: ['id', 'name, userid']
        },
        ProjectType: {
          keyFields: ['id', 'name, userid']
        },
        TaskType: {
          keyFields: ['id', 'name', 'userid', 'group', 'date', 'time', 'project', 'in_progress', 'completed', 'notes']
        }
      }
    })
  })

  if (loading) return null

  return (
    <Router>
      <ApolloProvider client={client}>
        <div className={dark ? `${styles.wrapper} ${styles.dark}` : `${styles.wrapper} ${styles.light}`}>
        <div className={styles.tinter}>
          {authorized && <Menu />}       
          <Switch>
            <Route path='/register' exact component={Register} />
            <Route path='/login' exact component={Login} />
            <Route path='/forgot' exact component={ForgotPassword} />
            <Route path='/reset' exact component={ResetPassword} />
            <PrivateRoute>
              <Route path='/' exact>
                <Redirect to='/feed' />
              </Route>
              <Route path='/feed' exact component={Feed} />
              <Route path='/settings' exact component={Settings} />
              <Route path='/project' exact component={ProjectFeed} />
            </PrivateRoute>
          </Switch>
        </div>
        </div>
      </ApolloProvider>
    </Router>
  )
}

export default App

