import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CreateProposal from './pages/CreateProposal';
import ProposalEditor from './pages/ProposalEditor';
import Templates from './pages/Templates';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import KnowledgeBase from './pages/KnowledgeBase';
import FinancialManagement from './pages/FinancialManagement';
import TestingPage from './pages/TestingPage';
import AuthPage from './pages/AuthPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <CreateProposal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/proposal/:id"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <ProposalEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/templates"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <Templates />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/knowledge-base"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <KnowledgeBase />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/financial-management"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <FinancialManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/testing"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <TestingPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;