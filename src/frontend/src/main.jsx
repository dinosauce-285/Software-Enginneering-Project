import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LandingPage from './pages/landingPage'
import './index.css';
import UserManagementLayout from './pages/UserManagement';
import ActivityLogs from './pages/ActivityLogs';
import DeleteDialog from './pages/DeleteDialog';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div>
      {/* <LandingPage/> */}
      {/* <UserManagementLayout/> */}
      {/* <ActivityLogs/> */}
      <DeleteDialog/>
    </div>
  </StrictMode>,
)
