import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { AuthPage } from './components/auth/AuthPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { ResumeBuilder } from './components/builder/ResumeBuilder';
import { useAuth } from './hooks/useAuth';
import { Resume } from './types';

function App() {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'builder'>('dashboard');
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  const handleCreateResume = () => {
    setSelectedResume(null);
    setCurrentPage('builder');
  };

  const handleEditResume = (resume: Resume) => {
    setSelectedResume(resume);
    setCurrentPage('builder');
  };

  const handleBackToDashboard = () => {
    setSelectedResume(null);
    setCurrentPage('dashboard');
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication page if user is not logged in
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Show main application for authenticated users
  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      
      <main className="pb-8">
        {currentPage === 'dashboard' && (
          <Dashboard
            onCreateResume={handleCreateResume}
            onEditResume={handleEditResume}
          />
        )}
        
        {currentPage === 'builder' && (
          <ResumeBuilder
            resume={selectedResume}
            onBack={handleBackToDashboard}
          />
        )}
      </main>
    </div>
  );
}

export default App;