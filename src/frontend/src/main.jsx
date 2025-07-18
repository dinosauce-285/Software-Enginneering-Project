import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LandingPage from './pages/DeleteAccount/DeleteAccount.jsx'

import App from './App.jsx'
import UserManagementLayout from './pages/UserManagement/index.jsx'
import DeleteDialog from './pages/DeleteDialog/index.jsx'
import ShareDialog from './pages/SharingDialog/index.jsx'
import ActivityLayout from './pages/ActivityLogs/index.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <ActivityLayout />
  </StrictMode>
)
