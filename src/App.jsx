import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Login></Login>
    </AuthProvider>
  )
}

export default App
