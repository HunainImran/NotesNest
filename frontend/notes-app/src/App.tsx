import React from 'react'
import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignInSide from './pages/SignIn'
import SignUp from './pages/SignUp'
const routes = (
  <Router>
    <Routes>
      <Route path="/dashboard" element={<Home/>}/>
      <Route path="/login" element={<SignInSide/>}/>
      <Route path="/signup" element={<SignUp/>}/>
    </Routes>
  </Router>
)

function App() {
  return (
    <div>
      {routes}
    </div>
  )
}

export default App
