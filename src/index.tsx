import { render } from 'react-dom'

import './scss/main.scss'

import Application from './components/Application'
import './scss/main.scss'

const rootElement = document.createElement('div')

document.body.appendChild(rootElement)

render(<Application />, rootElement)