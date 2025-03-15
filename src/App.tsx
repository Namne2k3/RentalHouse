import { Route, Routes } from 'react-router';
import './App.css';
import { useAppSelector } from './hooks/reduxHook.ts';
import GeneralSettingLayout from './layouts/GeneralSettingLayout.tsx';
import GeneralSettingPage from './pages/GeneralSettingPage/GeneralSettingPage.tsx';
import HomePage from './pages/HomePage/HomePage.tsx';
import LoginPage from './pages/LoginPage/LoginPage.tsx';
import NewsPage from './pages/NewsPage/NewsPage.tsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.tsx';
import RentalDetailPage from './pages/RentalDetailPage/RentalDetailPage.tsx';
import RentalPage from './pages/RentalPage/RentalPage.tsx';
import RentalPostManagementPage from './pages/RentalPostManagementPage/RentalPostManagementPage.tsx';
import SignUpPage from './pages/SignUpPage/SignUpPage.tsx';
import CreateNewRentalPostPage from './pages/CreateNewRentalPostPage/CreateNewRentalPostPage.tsx';
function App() {

  const { generalPage } = useAppSelector((state) => state.generalSetting)

  return (
    <Routes>
      <Route path='/' element={
        <HomePage>
          <RentalPage />
        </HomePage>
      } />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/nhatro/create" element={
        <HomePage slider={false}>
          <CreateNewRentalPostPage />
        </HomePage>
      } />
      <Route path="/profile" element={
        <GeneralSettingLayout>
          <ProfilePage />
        </GeneralSettingLayout>
      } />
      <Route path="/news" element={
        <HomePage>
          <NewsPage />
        </HomePage>
      } />
      <Route path='/nhatro/detail/:id' element={
        <HomePage slider={false}>
          <RentalDetailPage />
        </HomePage>
      } />
      <Route path='/generalSetting' element={
        <GeneralSettingLayout>
          {
            generalPage == "GeneralPage" &&
            <GeneralSettingPage />
          }
          {
            generalPage == "ListRentalPage" &&
            <RentalPostManagementPage />
          }
          {
            generalPage == "ProfilePage" &&
            <ProfilePage />
          }
        </GeneralSettingLayout>
      } />
    </Routes>
  )
}

export default App
