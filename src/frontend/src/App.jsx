// --- BƯỚC 1: IMPORT SEARCHPROVIDER ---
import { SearchProvider } from './contexts/SearchContext.jsx';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Các trang
import DeleteAccount from './pages/DeleteAccount';
import LandingPage from './pages/landingPage/index.jsx';
import SignUp from './pages/signUp/index.jsx';
import LogIn from './pages/logIn/index.jsx';
import ForgetPass from './pages/ForgetPass/index.jsx';
import UserManagementLayout from './pages/UserManagement/index.jsx';
import CreateMemory from './pages/CreateMemory/index.jsx';
import Dashboard from './pages/Dashboard/index.jsx';
import MemoryDetail from './pages/MemoryDetail/index.jsx';
import SettingLayout from './pages/Setting/index.jsx';
import EnterOTP from './pages/EnterOTP/index.jsx';
import ResetPassword from './pages/ResetPassword/index.jsx';
import EditMemory from './pages/EditMemory/index.jsx';
import EmotionReport from './pages/ReportEmotion/index.jsx';

import { ThemeProvider } from './contexts/ThemeContext.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';
import AdminRoute from './components/AdminRoute';

import ChangeAvatarPage from './pages/ChangeAvatar/index.jsx';
import SharedMemoryPage from './pages/SharedMemory/index.jsx'; 

function App() {
  return (
    <AuthProvider>

      <SearchProvider>
        <ThemeProvider>
          <BrowserRouter>
            <ToastContainer position="top-center" autoClose={2000} />
            <Routes>

              <Route element={<RedirectIfAuthenticated />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/forgot-password" element={<ForgetPass />} />
                <Route path="/enter-otp" element={<EnterOTP />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-memory" element={<CreateMemory />} />
                <Route path="/memory/:memoryId" element={<MemoryDetail />} />
                <Route path="/settings" element={<SettingLayout />} />
                <Route path="/delete-account" element={<DeleteAccount />} />
                <Route path="/memory/:memoryId/edit" element={<EditMemory />} />
                <Route path="/report" element={<EmotionReport />} />
                <Route path="/change-avatar" element={<ChangeAvatarPage />} />
              </Route>

              <Route element={<AdminRoute />}>
                <Route path="/user-management" element={<UserManagementLayout />} />
              </Route>

              <Route path="/share/:token" element={<SharedMemoryPage />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>

      </SearchProvider>
    </AuthProvider>
  );
}

export default App;