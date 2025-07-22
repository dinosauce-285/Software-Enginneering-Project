// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import các trang của bạn
import LandingPage from './pages/landingPage/index.jsx';
import SignUp from './pages/signUp/index.jsx';
import LogIn from './pages/logIn/index.jsx';
import ForgetPass from './pages/ForgetPass/index.jsx';
import UserManagementLayout from './pages/UserManagement/index.jsx';
import CreateMemory from './pages/CreateMemory/index.jsx';
import Dashboard from './pages/Dashboard/index.jsx';
import MemoryDetail from './pages/MemoryDetail/index.jsx';

// Import cả hai "nhân viên an ninh"
import ProtectedRoute from './components/ProtectedRoute';
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === KHỐI ROUTE CÔNG KHAI (DÀNH CHO KHÁCH LẠ) === */}
        {/* "Người Hướng Dẫn" sẽ gác ở đây. */}
        {/* Nếu người dùng đã đăng nhập, họ sẽ bị chuyển hướng đến /dashboard. */}
        <Route element={<RedirectIfAuthenticated />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/forgot-password" element={<ForgetPass />} />
        </Route>
        
        {/* === KHỐI ROUTE ĐƯỢC BẢO VỆ (DÀNH CHO THÀNH VIÊN) === */}
        {/* "Người Soát Vé" sẽ gác ở đây. */}
        {/* Nếu người dùng chưa đăng nhập, họ sẽ bị chuyển hướng về /login. */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user-management" element={<UserManagementLayout />} />
          <Route path="/create-memory" element={<CreateMemory />} />
          <Route path="/memory/:memoryId" element={<MemoryDetail />} />
        </Route>

        {/* Route bắt lỗi 404, chuyển hướng về trang chủ */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;