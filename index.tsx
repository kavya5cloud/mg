
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
        // Strict wait for persistent storage hydration
        console.debug("BOOT: Hydrating persistent storage...");
        await bootstrapMuseumData();
        console.debug("BOOT: Storage synchronized. Mounting React.");
        
        const root = ReactDOM.createRoot(rootElement);
        root.render(
          <React.StrictMode>
            <App />
          </React.StrictMode>
        );
    } catch (e) {
        console.error("BOOT: Critical Failure", e);
        // Emergency render if DB is totally broken
        const root = ReactDOM.createRoot(rootElement);
        root.render(<App />);
    }
};

startApp();
