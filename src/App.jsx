import React from 'react';
import LandingPage from './LandingPage';
import Exercise from './Exercise';
import AIAssistantPage from './AIAssistantPage';
import AssistantWeb from './AssistantWeb';
import Diet from './Diet';
import Login from './Login';
import Onboarding from './Onboarding';
import Profile from './Profile';
import Preloader from './Preloader';
import { ThemeProvider } from './ThemeContext';
import { BMIProvider } from './BMIContext';
import { AuthProvider, useAuth } from './AuthContext';
import './App.css';

const PROTECTED_ROUTES = ['/exercise', '/diet', '/assistant', '/assistant-web', '/profile', '/onboarding'];

function AppContent({ loaded, setLoaded }) {
  const [route] = useHashRoute();
  const { user, isAuthenticated, loading } = useAuth();

  React.useEffect(() => {
    // If not loading, not authenticated, and user navigates to a protected route -> redirect to login
    if (!loading && !isAuthenticated && PROTECTED_ROUTES.includes(route)) {
      window.location.hash = '#/login';
      return;
    }

    // If authenticated, check if onboarding is completed for this specific user
    if (!loading && isAuthenticated && user?.id) {
      const isCompleted = localStorage.getItem(`fitzer_onboarding_completed_${user.id}`) === 'true';
      if (!isCompleted && route !== '/onboarding' && route !== '/login' && route !== '/') {
        window.location.hash = '#/onboarding';
      }
    }
  }, [route, isAuthenticated, loading, user]);

  // Route selector
  const renderRoute = () => {
    // While checking initial Supabase session, avoid rendering protected content prematurely
    if (loading && PROTECTED_ROUTES.includes(route)) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg1, #08080c)', color: 'var(--text2, #888)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(255,107,53,0.2)', borderTopColor: '#ff6b35', animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>Authenticating athlete session...</span>
          </div>
        </div>
      );
    }

    if (!isAuthenticated && PROTECTED_ROUTES.includes(route)) {
      return <Login />;
    }

    switch (route) {
      case '/onboarding':
        return <Onboarding />;
      case '/exercise':
        return <Exercise />;
      case '/assistant':
        return <AIAssistantPage />;
      case '/assistant-web':
        return <AssistantWeb />;
      case '/diet':
        return <Diet />;
      case '/login':
        return <Login />;
      case '/profile':
        return <Profile />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <>
      {/* VU-meter preloader — shown on initial boot */}
      {!loaded && <Preloader onDone={() => setLoaded(true)} />}

      {/* Main app container */}
      <div style={{ visibility: loaded ? 'visible' : 'hidden', opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease' }}>
        {renderRoute()}
      </div>
    </>
  );
}

function App() {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <ThemeProvider>
      <BMIProvider>
        <AuthProvider>
          <AppContent loaded={loaded} setLoaded={setLoaded} />
        </AuthProvider>
      </BMIProvider>
    </ThemeProvider>
  );
}

export default App;

function useHashRoute() {
  const [route, setRoute] = React.useState(getHashRoute());

  React.useEffect(() => {
    const handler = () => setRoute(getHashRoute());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return [route, setRoute];
}

function getHashRoute() {
  const hash = window.location.hash || '#/';
  // If returning from OAuth redirect with access token fragments, default to /exercise or /login
  if (hash.includes('access_token=') || hash.includes('error_description=')) {
    return '/exercise';
  }
  return hash.replace('#', '') || '/';
}
