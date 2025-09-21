import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PublicHeader from './components/Layout/PublicHeader';
import Footer from './components/Layout/Footer';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import LandingPage from './components/Landing/LandingPage';
import FeaturesPage from './components/Landing/FeaturesPage';
import AboutPage from './components/Landing/AboutPage';
import ContactPage from './components/Landing/ContactPage';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';
import MoodPage from './pages/MoodPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProgressPage from './pages/ProgressPage';
import ResourcesPage from './pages/ResourcesPage';
import SettingsPage from './pages/SettingsPage';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
        <Route path="/features" element={<PublicLayout><FeaturesPage /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
        <Route path="/auth" element={<PublicLayout><AuthPage /></PublicLayout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <AuthenticatedLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/mood" element={<MoodPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </AuthenticatedLayout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;