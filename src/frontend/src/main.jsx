import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'


import App from './App.jsx'
import UserManagementLayout from './pages/UserManagement/index.jsx'
import DeleteDialog from './pages/DeleteDialog/index.jsx'
import ShareDialog from './pages/SharingDialog/index.jsx'
import ActivityLayout from './pages/ActivityLogs/index.jsx'
import DeleteAccount from './pages/DeleteAccount/index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
