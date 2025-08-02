import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {  HashRouter } from 'react-router-dom'
import { AuthProvider } from './context/authContext.tsx'

createRoot(document.getElementById('root')!).render(
 
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>

)
