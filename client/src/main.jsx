import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import App from './App.jsx'
import './index.css'

// Set Axios Base URL
// In development, this is undefined (requests go to localhost:5173 -> proxy -> localhost:3001)
// In production, user must set VITE_API_URL env var to their backend URL (e.g., Render URL)
if (import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

