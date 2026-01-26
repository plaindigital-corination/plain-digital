import React, { useState, useEffect } from 'react';
import { AppView } from './types';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Workshop } from './components/Workshop';
import { Translator } from './components/Translator';
import { About } from './components/About';
import { Library } from './components/Library';
import { Connect } from './components/Connect';
import { Privacy } from './components/Privacy';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.Home);

  // Interaction Tracking Logic
  useEffect(() => {
    const trackClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        const trackingData = JSON.parse(localStorage.getItem('plain_digital_clicks') || '[]');
        const newEntry = {
          timestamp: new Date().toISOString(),
          element: target.tagName,
          text: (target.innerText || target.getAttribute('aria-label') || 'unnamed-element').slice(0, 50),
          view: view
        };
        
        trackingData.push(newEntry);
        localStorage.setItem('plain_digital_clicks', JSON.stringify(trackingData.slice(-100)));
      }
    };

    window.addEventListener('click', trackClick);
    return () => window.removeEventListener('click', trackClick);
  }, [view]);

  const renderView = () => {
    switch (view) {
      case AppView.Home:
        return <Home onStart={setView} />;
      case AppView.Workshop:
        return <Workshop onNavigate={setView} />;
      case AppView.Translator:
        return <Translator />;
      case AppView.Library:
        return <Library />;
      case AppView.Connect:
        return <Connect />;
      case AppView.About:
        return <About onNavigate={setView} />;
      case AppView.Privacy:
        return <Privacy />;
      default:
        return <Home onStart={setView} />;
    }
  };

  return (
    <Layout activeView={view} onNavigate={setView}>
      {renderView()}
    </Layout>
  );
};

export default App;