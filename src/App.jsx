import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ContextProvider from './context/ContextProvider'
import Login from './page/Login'
import Dashboard from './page/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <ContextProvider>
        <Routes>
          <Route path='/' element={ <Login /> }></Route>
          <Route path='/dashboard' element={ <Dashboard /> }></Route>
        </Routes>
      </ContextProvider>
    </BrowserRouter>
  )
}

export default App
