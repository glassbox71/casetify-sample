import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../public/fonts/gmarket-sans.css'
import '../public/fonts/footer-title.css'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>
)
