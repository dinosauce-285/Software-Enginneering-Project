// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import DeleteAccount from './pages/DeleteAccount';
// import LandingPage from './pages/landingPage/index.jsx';
// import SignUp from './pages/signUp/index.jsx';
// import LogIn from './pages/logIn/index.jsx';
// import ForgetPass from './pages/ForgetPass/index.jsx';
// import UserManagementLayout from './pages/UserManagement/index.jsx';
// import CreateMemory from './pages/CreateMemory/index.jsx';
// import Dashboard from './pages/Dashboard/index.jsx';
// import MemoryDetail from './pages/MemoryDetail/index.jsx';

// import ProtectedRoute from './components/ProtectedRoute';
// import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';
// import SettingLayout from './pages/Setting/index.jsx';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route element={<RedirectIfAuthenticated />}>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/signup" element={<SignUp />} />
//           <Route path="/login" element={<LogIn />} />
//           <Route path="/forgot-password" element={<ForgetPass />} />
//         </Route>

//         <Route element={<ProtectedRoute />}>
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/user-management" element={<UserManagementLayout />} />
//           <Route path="/create-memory" element={<CreateMemory />} />
//           <Route path="/memory/:memoryId" element={<MemoryDetail />} />
//           <Route path="/settings" element={<SettingLayout />} />
//           <Route path="/delete-account" element={<DeleteAccount />} />
//         </Route>
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;



// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import AdminRoute from './components/AdminRoute'; // <<< Import AdminRoute

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RedirectIfAuthenticated />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/forgot-password" element={<ForgetPass />} />
        </Route>

        {/* Route cho user thường */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-memory" element={<CreateMemory />} />
          <Route path="/memory/:memoryId" element={<MemoryDetail />} />
          <Route path="/settings" element={<SettingLayout />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
        </Route>

        {/* Route chỉ dành cho ADMIN */}
        <Route element={<AdminRoute />}>
          <Route path="/user-management" element={<UserManagementLayout />} />
          {/* Thêm các trang admin khác ở đây nếu có */}
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;