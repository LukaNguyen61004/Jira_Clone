import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProjectsPage from './pages/projects/ProjectsPage';
import ProjectDetailPage from './pages/projects/ProjectDetailPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import ProjectedRoute from './components/common/ProtectedRoute';
function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/projects" element={
          <ProtectedRoute>
            <ProjectsPage />
          </ProtectedRoute>
        } />
        <Route path="/projects/:id" element={
            <ProjectedRoute>
              <ProjectDetailPage />
            </ProjectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;