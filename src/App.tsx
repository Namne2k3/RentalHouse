import { Route, Routes } from 'react-router';
import './App.css';
import HomePage from './pages/HomePage/HomePage.tsx';
import LoginPage from './pages/LoginPage/LoginPage.tsx';
import SignUpPage from './pages/SignUpPage/SignUpPage.tsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.tsx';
function App() {


  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  )
}

export default App
