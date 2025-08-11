
import './App.css'
import { Routes , Route } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import DashBoard from './pages/DashBoard'
import { useAuth } from './context/authContext'
import AddUserPage from './components/AddUserPage'
// import ImageCorusel from './components/ImageCorusel'

function App() {
  const {loggedIn} = useAuth()
  return (
    <Routes>
      <Route path='/' element={loggedIn ? <DashBoard/> : <AuthPage/>} />
      <Route path='/dashboard' element={loggedIn ? <DashBoard/> : <AuthPage/>} />
      <Route path='/addUser' element={<AddUserPage/>} />
    </Routes>
  )
}

export default App
