import { useState } from 'react'

import './App.css'
import Login from '../components/account/Login'
import { Routes, Route } from 'react-router-dom'
import Profile from '../components/pages/profile'
import Navbar from '../components/pages/Navbar'
import Home from '../components/pages/Home'
import CreatePost from '../components/pages/Create'
import Update from '../components/pages/Update'

function App() {

  return (
    <>
      {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Login />
      </div> */}
            <Navbar />

      <Routes>
        <Route path='/login' element={<Login />} />
  <Route path='/profile' element={<Profile />} />
  <Route path='/' element={<Home />} />
  <Route path='/create' element={<CreatePost />} />
  <Route path="/update/:id" element={<Update />} />

</Routes>


    </>
  )
}

export default App
