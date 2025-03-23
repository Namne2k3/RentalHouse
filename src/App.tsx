import { Route, Routes, useParams, Navigate, useNavigate } from 'react-router';
import './App.css';
import GeneralSettingLayout from './layouts/GeneralSettingLayout.tsx';
import CreateNewRentalPostPage from './pages/CreateNewRentalPostPage/CreateNewRentalPostPage.tsx';
import CustomerAppointmentManagementPage from './pages/CustomerAppointmentManagementPage/CustomerAppointmentManagementPage.tsx';
import GeneralSettingPage from './pages/GeneralSettingPage/GeneralSettingPage.tsx';
import HomePage from './pages/HomePage/HomePage.tsx';
import LoginPage from './pages/LoginPage/LoginPage.tsx';
import NewsPage from './pages/NewsPage/NewsPage.tsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.tsx';
import RentalDetailPage from './pages/RentalDetailPage/RentalDetailPage.tsx';
import RentalPage from './pages/RentalPage/RentalPage.tsx';
import RentalPostManagementPage from './pages/RentalPostManagementPage/RentalPostManagementPage.tsx';
import SignUpPage from './pages/SignUpPage/SignUpPage.tsx';
import UserAppointmentManagementPage from './pages/UserAppointmentManagementPage/UserAppointmentManagementPage.tsx';
import { useAppSelector } from './hooks/reduxHook.ts';
import AdminPanel from './pages/Admin/index.tsx';
import { Button, Result } from 'antd';


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate()

  if (!isLoading) {
    if (!user || user?.role !== 'Admin') {
      return <Result
        status="403"
        title="403"
        subTitle="Xin lỗi, bạn không có quyền truy cập vào trang hiện tại."
        extra={<Button onClick={() => navigate("/")} type="primary">Trở lại trang chủ</Button>}
      />
    }
  }

  return <>{children}</>;
};

function GeneralSettingRouter() {
  const { generalPage } = useParams(); // Lấy giá trị từ URL

  return (
    <GeneralSettingLayout>
      {generalPage === "GeneralPage" && <GeneralSettingPage />}
      {generalPage === "ListRentalPage" && <RentalPostManagementPage />}
      {generalPage === "ProfilePage" && <ProfilePage />}
      {generalPage === "UserAppointmentManagementPage" && <UserAppointmentManagementPage />}
      {generalPage === "CustomerAppointmentManagementPage" && <CustomerAppointmentManagementPage />}
    </GeneralSettingLayout>
  );
}


function App() {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminPanel />
        </AdminRoute>
      } />
      {/* Public Routes */}
      <Route path='/' element={
        <HomePage>
          <RentalPage />
        </HomePage>
      } />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
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

      {/* Protected Routes (Requires Authentication) */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <GeneralSettingLayout>
            <ProfilePage />
          </GeneralSettingLayout>
        </ProtectedRoute>
      } />

      <Route path="/nhatro/create" element={
        <HomePage slider={false}>
          <CreateNewRentalPostPage />
        </HomePage>
      } />
      <Route path="/generalSetting/:generalPage" element={
        <AdminRoute>
          <GeneralSettingRouter />
        </AdminRoute>
      } />

      {/* Catch all route - 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;