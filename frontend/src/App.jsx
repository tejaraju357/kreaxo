import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Public Pages
import Landing from './pages/Landing';
import OurWork from './pages/OurWork';
import ServicesPage from './pages/ServicesPage';
import CreatorProfile from './pages/CreatorProfile';
import PublicBrands from './pages/PublicBrands';
import ContactUs from './pages/ContactUs';
import SimplePage from './pages/SimplePage';
import AboutUs from './pages/AboutUs';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageCreators from './pages/admin/ManageCreators';
import ManageBrands from './pages/admin/ManageBrands';
import ManageWorks from './pages/admin/ManageWorks';
import ViewCollaborations from './pages/admin/ViewCollaborations';
import ManageRegistrations from './pages/admin/ManageRegistrations';

// Brand Pages
import BrandHome from './pages/brand/BrandHome';
import BrowseCreators from './pages/brand/BrowseCreators';
import BrandRequests from './pages/brand/BrandRequests';
import BrandPayments from './pages/brand/BrandPayments';

// Creator Pages
import CreatorHome from './pages/creator/CreatorHome';
import CreatorRequests from './pages/creator/CreatorRequests';
import CreatorPortfolio from './pages/creator/CreatorPortfolio';
import CreatorEarnings from './pages/creator/CreatorEarnings';

// Shared Pages
import ProfileEdit from './pages/shared/ProfileEdit';
// import ThemeToggle from './components/ThemeToggle'; // global theme toggle

import './App.css';

// Component to handle redirect based on role
function DashboardRedirect() {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'brand') return <Navigate to="/brand" replace />;
  if (user.role === 'creator') return <Navigate to="/creator" replace />;
  
  return <Navigate to="/" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        {/* Global theme toggle removed from here as it overlaps with WhatsApp icon, now handled in Navbar */}
        {/* <ThemeToggle /> */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/our-work" element={<OurWork />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:category" element={<ServicesPage />} />
          <Route path="/profile/:id" element={<CreatorProfile />} />
          <Route path="/creators" element={<Navigate to="/services" replace />} />
          <Route path="/brands" element={<PublicBrands />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/privacy-policy" element={<SimplePage title="Privacy Policy" />} />
          <Route path="/terms" element={<SimplePage title="Terms & Conditions" />} />
          <Route path="/cancellation" element={<SimplePage title="Cancellation Policy" />} />
          <Route path="/anti-discrimination" element={<SimplePage title="Anti Discrimination Policy" />} />
          <Route path="/refund" element={<SimplePage title="Refund Policy" />} />
          <Route path="/faq" element={<SimplePage title="Frequently Asked Questions" />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/creators" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageCreators />
            </ProtectedRoute>
          } />
          <Route path="/admin/brands" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageBrands />
            </ProtectedRoute>
          } />
          <Route path="/admin/works" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageWorks />
            </ProtectedRoute>
          } />
          <Route path="/admin/collaborations" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ViewCollaborations />
            </ProtectedRoute>
          } />
          <Route path="/admin/registrations" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageRegistrations />
            </ProtectedRoute>
          } />

          {/* Brand Routes */}
          <Route path="/brand" element={
            <ProtectedRoute allowedRoles={['brand']}>
              <BrandHome />
            </ProtectedRoute>
          } />
          <Route path="/brand/creators" element={
            <ProtectedRoute allowedRoles={['brand']}>
              <BrowseCreators />
            </ProtectedRoute>
          } />
          <Route path="/brand/requests" element={
            <ProtectedRoute allowedRoles={['brand']}>
              <BrandRequests />
            </ProtectedRoute>
          } />
          <Route path="/brand/payments" element={
            <ProtectedRoute allowedRoles={['brand']}>
              <BrandPayments />
            </ProtectedRoute>
          } />
          <Route path="/brand/profile" element={
            <ProtectedRoute allowedRoles={['brand']}>
              <ProfileEdit />
            </ProtectedRoute>
          } />

          {/* Creator Routes */}
          <Route path="/creator" element={
            <ProtectedRoute allowedRoles={['creator']}>
              <CreatorHome />
            </ProtectedRoute>
          } />
          <Route path="/creator/profile" element={
            <ProtectedRoute allowedRoles={['creator']}>
              <ProfileEdit />
            </ProtectedRoute>
          } />
          <Route path="/creator/portfolio" element={
            <ProtectedRoute allowedRoles={['creator']}>
              <CreatorPortfolio />
            </ProtectedRoute>
          } />
          <Route path="/creator/requests" element={
            <ProtectedRoute allowedRoles={['creator']}>
              <CreatorRequests />
            </ProtectedRoute>
          } />
          <Route path="/creator/earnings" element={
            <ProtectedRoute allowedRoles={['creator']}>
              <CreatorEarnings />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/profile" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ProfileEdit />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
