import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Bookshelf from './pages/Bookshelf'
import Login from './pages/Login'

const App = () => {
  return (
    <>
      <Router>
        <Route path='/' component={Bookshelf} exact />
        <Route path='/login' component={Login} />
      </Router>
    </>
  )
}

export default App
