import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './Home';
import Exercise from './Exercise';
import AIAssistantPage from './AIAssistantPage';
import AssistantWeb from './AssistantWeb';
import Diet from './Diet';
import Login from './Login';
import Profile from './Profile';
import Preloader from './Preloader';
import { ThemeProvider } from './ThemeContext';
import { BMIProvider } from './BMIContext';
import './App.css';

function App() {
  const [route] = useHashRoute();
  const [loaded, setLoaded] = React.useState(false);

  return (
    <ThemeProvider>
      <BMIProvider>
        {/* VU-meter preloader — shown on every first load */}
        {!loaded && <Preloader onDone={() => setLoaded(true)} />}

        {/* Main app — rendered behind the preloader, revealed after fade-out */}
        <div style={{ visibility: loaded ? 'visible' : 'hidden', opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease' }}>
          {route === '/exercise' ? (
            <Exercise />
          ) : route === '/assistant' ? (
            <AIAssistantPage />
          ) : route === '/assistant-web' ? (
            <AssistantWeb />
          ) : route === '/diet' ? (
            <Diet />
          ) : route === '/login' ? (
            <Login />
          ) : route === '/profile' ? (
            <Profile />
          ) : (
            <Home />
          )}
        </div>
      </BMIProvider>
    </ThemeProvider>
  );
}

export default App

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
  return hash.replace('#', '') || '/';
}

