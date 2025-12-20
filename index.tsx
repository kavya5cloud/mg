
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { bootstrapMuseumData } from './services/data';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const startApp = async () => {
    try {
        // Force-await storage hydration to ensure refresh survival
        console.debug("BOOT: Syncing mirror storage...");
        await bootstrapMuseumData();
        console.debug("BOOT: Mirror ready. Mounting UI.");
        
        const root = ReactDOM.createRoot(rootElement);
        root.render(
          <React.StrictMode>
            <App />
          </React.StrictMode>
        );
    } catch (e) {
        console.error("BOOT: Critical Persistence Error", e);
        const root = ReactDOM.createRoot(rootElement);
        root.render(<App />);
    }
};

startApp();
