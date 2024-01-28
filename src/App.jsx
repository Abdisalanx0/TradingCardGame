import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { HeaderProvider } from './contexts/HeaderContext'
import { EventsProvider } from './contexts/EventsContext'
import { MarketplaceProvider } from './contexts/MarketplaceContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EventsProvider>
          <HeaderProvider>
            <MarketplaceProvider>
              <Routes>
                <Route path='/' element={ <Login /> }></Route>
                <Route path='/dashboard' element={ <Dashboard /> }></Route>
              </Routes>
            </MarketplaceProvider>
          </HeaderProvider>
        </EventsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
