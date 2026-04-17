import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useInitAuth } from './hooks/useInitAuth';
import Header from './components/common/Header';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProjectsPage from './pages/projects/ProjectsPage';
import ProjectDetailPage from './pages/projects/ProjectDetailPage';
import ProtectedRoute from './components/common/ProtectedRoute';


function AppContent() {
  const { isLoading } = useInitAuth();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/projects" element={
            <ProtectedRoute isLoading={isLoading}>
              <ProjectsPage />
            </ProtectedRoute>
          } />
          <Route path="/projects/:id" element={
            <ProtectedRoute isLoading={isLoading}>
              <ProjectDetailPage />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  
  return (
 
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;