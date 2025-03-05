import { Route, Routes } from 'react-router';
import './App.css';
import HomePage from './pages/HomePage/HomePage.tsx';
import LoginPage from './pages/LoginPage/LoginPage.tsx';
import SignUpPage from './pages/SignUpPage/SignUpPage.tsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.tsx';
import RentalDetailPage from './pages/RentalDetailPage/RentalDetailPage.tsx';
import RentalPage from './pages/RentalPage/RentalPage.tsx';
import NewsPage from './pages/NewsPage/NewsPage.tsx';
function App() {


  return (
    <Routes>
      <Route path='/' element={
        <HomePage>
          <RentalPage />
        </HomePage>
      } />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/profile" element={
        <HomePage>
          <ProfilePage />
        </HomePage>
      } />
      <Route path="/news" element={
        <HomePage>
          <NewsPage />
        </HomePage>
      } />
      <Route path='/nhatro/detail/:id' element={
        <HomePage>
          <RentalDetailPage />
        </HomePage>
      } />
    </Routes>
  )
}

export default App
