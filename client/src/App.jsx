import { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './App.css'
import LoginComponent from './routes/Login'
import SignupComponent from './routes/Signup'
function App() {
  return (
    <>
      
      <div className='w-screen h-screen'>
        <BrowserRouter>
          <Routes>
            <>
              <Route path="/" element={<h1>hi</h1>} />
              <Route path="/login" element={<LoginComponent/>} />
              <Route path="/signup" element={<SignupComponent/>} />
            </>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
