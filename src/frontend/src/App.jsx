import { AuthProvider } from './contexts/AuthContext';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DeleteAccount from './pages/DeleteAccount';
import LandingPage from './pages/landingPage/index.jsx';
import SignUp from './pages/signUp/index.jsx';
import LogIn from './pages/logIn/index.jsx';
import ForgetPass from './pages/ForgetPass/index.jsx';
import UserManagementLayout from './pages/UserManagement/index.jsx';
import CreateMemory from './pages/CreateMemory/index.jsx';
import Dashboard from './pages/Dashboard/index.jsx';
import MemoryDetail from './pages/MemoryDetail/index.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';
import SettingLayout from './pages/Setting/index.jsx';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-center" autoClose={2000} />
        <Routes>
          <Route element={<RedirectIfAuthenticated />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/forgot-password" element={<ForgetPass />} />
          </Route>

        
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-memory" element={<CreateMemory />} />
            <Route path="/memory/:memoryId" element={<MemoryDetail />} />
            <Route path="/settings" element={<SettingLayout />} />
            <Route path="/delete-account" element={<DeleteAccount />} />
          </Route>

  
          <Route element={<AdminRoute />}>
            <Route path="/user-management" element={<UserManagementLayout />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;