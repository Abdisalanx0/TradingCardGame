import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CardProvider } from './context/CardContext'
import { EventsProvider } from './context/EventsContext'
import { HeaderProvider } from './context/HeaderContext'
import { MarketplaceProvider } from './context/MarketplaceContext'
import { InventoryProvider } from './context/InventoryContext'
import Login from './page/Login'
import Dashboard from './page/Dashboard'
import { MessageProvider } from './context/MessageContext'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EventsProvider>
          <MessageProvider>
            <CardProvider>
              <HeaderProvider>
                <MarketplaceProvider>
                  <InventoryProvider>
                    <Routes>
                      <Route path='/' element={ <Login /> }></Route>
                      <Route path='/dashboard' element={ <Dashboard /> }></Route>
                    </Routes>
                  </InventoryProvider>
                </MarketplaceProvider>
              </HeaderProvider>
            </CardProvider>
          </MessageProvider>
        </EventsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
