import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Dash from './pages/Dashboard.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Dash />
  </StrictMode>,
)
