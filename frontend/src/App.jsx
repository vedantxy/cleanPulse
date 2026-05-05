import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CitizenDashboard from './pages/citizen/Dashboard';
import SubmitReport from './pages/citizen/SubmitReport';
import MyReports from './pages/citizen/MyReports';
import Leaderboard from './pages/citizen/Leaderboard';
import CitizenProfile from './pages/citizen/Profile';
import Stats from './pages/citizen/Stats';
import CollectorDashboard from './pages/collector/Dashboard';
import CollectorPickups from './pages/collector/Pickups';
import CollectorProfile from './pages/collector/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import AdminReports from './pages/admin/Reports';
import AdminUsers from './pages/admin/Users';
import Home from './pages/Home';
import Ecosystem from './pages/citizen/Ecosystem';
import AIChatBot from './components/AIChatBot';
import { Helmet } from 'react-helmet';
import Footer from './components/Footer';


import { SocketProvider } from './context/SocketContext';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center font-bold">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

const SocketWrapper = ({ children }) => {
  const { user } = useAuth();
  return (
    <SocketProvider user={user}>
      {children}
    </SocketProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Helmet>
        <title>CleanPulse | Planetary Healing & Smart Waste</title>
        <meta name="description" content="CleanPulse is the definitive platform for planetary healing. Connect, report, and maintain a pristine environment." />
        <meta name="keywords" content="smart waste, planetary healing, eco-credits, clean city, environmental tech" />
        <meta property="og:title" content="CleanPulse | Planetary Healing" />
        <meta property="og:site_name" content="CleanPulse" />
      </Helmet>
      <AuthProvider>
        <SocketWrapper>
          <Router>
            <div className="flex flex-col min-h-screen">
              <div className="flex-grow">
                <Routes>
                  <Route path="/" element={
                    <>
                      <Navbar />
                      <Home />
                    </>
                  } />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/ecosystem" element={
                    <>
                      <Navbar />
                      <Ecosystem />
                    </>
                  } />
                  
                  {/* Citizen Routes */}
                  <Route path="/citizen" element={
                    <ProtectedRoute allowedRole="citizen">
                      <CitizenDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/citizen/submit" element={
                    <ProtectedRoute allowedRole="citizen">
                      <SubmitReport />
                    </ProtectedRoute>
                  } />
                  <Route path="/citizen/reports" element={
                    <ProtectedRoute allowedRole="citizen">
                      <MyReports />
                    </ProtectedRoute>
                  } />
                  <Route path="/citizen/profile" element={
                    <ProtectedRoute allowedRole="citizen">
                      <CitizenProfile />
                    </ProtectedRoute>
                  } />
                  <Route path="/citizen/stats" element={
                    <ProtectedRoute allowedRole="citizen">
                      <Stats />
                    </ProtectedRoute>
                  } />
                  <Route path="/leaderboard" element={
                    <ProtectedRoute>
                      <Leaderboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Navigate to="/citizen/profile" /> 
                    </ProtectedRoute>
                  } />
                  
                  {/* Collector Routes */}
                  <Route path="/collector" element={
                    <ProtectedRoute allowedRole="collector">
                      <CollectorDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/collector/pickups" element={
                    <ProtectedRoute allowedRole="collector">
                      <CollectorPickups />
                    </ProtectedRoute>
                  } />
                  <Route path="/collector/profile" element={
                    <ProtectedRoute allowedRole="collector">
                      <CollectorProfile />
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute allowedRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/reports" element={
                    <ProtectedRoute allowedRole="admin">
                      <AdminReports />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute allowedRole="admin">
                      <AdminUsers />
                    </ProtectedRoute>
                  } />
                </Routes>
              </div>
              <Footer />
            </div>
            <AIChatBot />
          </Router>
        </SocketWrapper>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
