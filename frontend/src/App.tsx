
import './App.css'
import { Routes , Route } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import DashBoard from './pages/DashBoard'
import { useAuth } from './context/authContext'
// import ImageCorusel from './components/ImageCorusel'

function App() {
  const {loggedIn} = useAuth()
  return (
    <Routes>
      <Route path='/' element={loggedIn ? <DashBoard/> : <AuthPage/>} />
      <Route path='/dashboard' element={<DashBoard/>} />
    </Routes>
  )
}

export default App
