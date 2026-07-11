import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import Screener from './pages/Screener';
import Dashboard from './pages/Dashboard';

function PrivateRoute({ children, recruiterOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (recruiterOnly && user.role !== 'recruiter') return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="bottom-center" toastOptions={{ style: { background: '#1a1a26', color: '#e8e8f0', border: '1px solid #2a2a3f' } }} />
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/"           element={<Home />} />
            <Route path="/login"      element={<Login />} />
            <Route path="/register"   element={<Register />} />
            <Route path="/jobs/:id"   element={<JobDetail />} />
            <Route path="/post-job"   element={<PrivateRoute recruiterOnly><PostJob /></PrivateRoute>} />
            <Route path="/screener"   element={<PrivateRoute recruiterOnly><Screener /></PrivateRoute>} />
            <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
