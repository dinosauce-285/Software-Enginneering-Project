import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/landingPage/index.jsx';
import SignUp from './pages/signUp/index.jsx';
import LogIn from './pages/logIn/index.jsx';
import ForgetPass from './pages/ForgetPass/index.jsx';
import UserManagementLayout from './pages/UserManagement/index.jsx';

import Dashboard from './pages/Dashboard/index.jsx';
import MemoryDetail from './pages/MemoryDetail/index.jsx'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/forgot-password" element={<ForgetPass />} />
        <Route path="/user-management" element={<UserManagementLayout/>} />

    
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/memory/:memoryId" element={<MemoryDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;