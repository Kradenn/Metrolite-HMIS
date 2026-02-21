import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router';
import App from './App';
import { PatientProvider } from './context/PatientContext';
import { HospitalProvider } from './context/HospitalContext';
import { SecurityProvider } from './context/SecurityContext';
import { NotificationProvider } from './context/NotificationContext';
import { ModuleProvider } from './context/ModuleContext';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider>
        <NotificationProvider>
          <HospitalProvider>
            <SecurityProvider>
              <ModuleProvider>
                <UserProvider>
                  <PatientProvider>
                    <App />
                  </PatientProvider>
                </UserProvider>
              </ModuleProvider>
            </SecurityProvider>
          </HospitalProvider>
        </NotificationProvider>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);