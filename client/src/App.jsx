 import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Login from './components/Login';
import Register from './components/Register';
import Table from './components/Table'
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Tabledetail from './components/Tabledetail';

const App = () => {
  return (
    <BrowserRouter>
       <Navbar/>
      <Routes>
        
        <Route path='/' element={<Table/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/> 
        <Route path='/table/:id' element={<Tabledetail/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
 
//import React from 'react'
/* import Register from './components/Register';

const App = () => {
  return (
    <div>
      <Register/>
    </div>
  )
}

export default App
 */