import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SubmitReport from './pages/citizen/SubmitReport';
import MyReports from './pages/citizen/MyReports';
import CitizenProfile from './pages/citizen/Profile';
import Leaderboard from './pages/citizen/Leaderboard';
import CollectorPickups from './pages/collector/Pickups';
import CollectorProfile from './pages/collector/Profile';
import AdminReports from './pages/admin/Reports';
import AdminUsers from './pages/admin/Users';
import ProtectedRoute from './components/ProtectedRoute';
import NatureBackground from './components/NatureBackground';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="flex flex-col min-h-screen relative overflow-x-hidden">
            <NatureBackground />
            <Navbar />
            <main className="flex-grow z-10">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/citizen/dashboard" element={<Navigate to="/dashboard" replace />} />
                <Route path="/collector/dashboard" element={<Navigate to="/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<Navigate to="/dashboard" replace />} />

                <Route 
                  path="/citizen/report" 
                  element={
                    <ProtectedRoute role="citizen">
                      <SubmitReport />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/citizen/my-reports" 
                  element={
                    <ProtectedRoute role="citizen">
                      <MyReports />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/citizen/profile" 
                  element={
                    <ProtectedRoute role="citizen">
                      <CitizenProfile />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/citizen/edit-report/:id" 
                  element={
                    <ProtectedRoute role="citizen">
                      <SubmitReport isEdit={true} />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/citizen/leaderboard" 
                  element={
                    <ProtectedRoute role="citizen">
                      <Leaderboard />
                    </ProtectedRoute>
                  } 
                />
                


                <Route 
                  path="/collector/pickups" 
                  element={
                    <ProtectedRoute role="collector">
                      <CollectorPickups />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/collector/profile" 
                  element={
                    <ProtectedRoute role="collector">
                      <CollectorProfile />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/admin/reports" 
                  element={
                    <ProtectedRoute role="admin">
                      <AdminReports />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/admin/users" 
                  element={
                    <ProtectedRoute role="admin">
                      <AdminUsers />
                    </ProtectedRoute>
                  } 
                />

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
