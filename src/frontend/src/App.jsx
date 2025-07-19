import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingPage/index.jsx';
import SignUp from './pages/signUp/index.jsx';
import LogIn from './pages/logIn/index.jsx';
import ForgetPass from './pages/ForgetPass/index.jsx';
import UserManagementLayout from './pages/UserManagement/index.jsx';
import DeleteAccount from './pages/DeleteAccount/index.jsx';
function App() {
  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<LandingPage />} />
    //     <Route path="/signup" element={<SignUp />} />
    //     <Route path="/login" element={<LogIn />} />
    //     <Route path="/forgot-password" element={<ForgetPass />} />
    //     <Route path="/user-management" element={<UserManagementLayout/>} />
    //   </Routes>
    // </BrowserRouter>
    <DeleteAccount/>
  );
}

export default App;
