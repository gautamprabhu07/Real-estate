import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { SocketContextProvider } from './context/SocketContext.jsx'
import './index.scss'
import App from './App.jsx'

// Apply the persisted theme before first paint to avoid a light/dark flash.
try {
  const stored = JSON.parse(localStorage.getItem('theme-storage'));
  const theme = stored?.state?.theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
} catch {
  document.documentElement.dataset.theme = 'light';
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <SocketContextProvider>
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <App />
      </SocketContextProvider>
    </AuthContextProvider>
  </StrictMode>,
)
