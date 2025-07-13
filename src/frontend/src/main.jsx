import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LandingPage from './pages/landingPage'
import './index.css';
import UserManagementLayout from './pages/UserManagement';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div>
      {/* <LandingPage/> */}
      <UserManagementLayout/>
    </div>
  </StrictMode>,
)
