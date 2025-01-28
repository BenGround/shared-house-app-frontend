import React, { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const Router = React.lazy(() => import('./routes/sections'));
const UserProvider = React.lazy(() => import('./contexts/userContext'));
const ShareSpacesProvider = React.lazy(
  () => import('./contexts/shareSpacesContext')
);
const ThemeProvider = React.lazy(() => import('./theme/theme-provider'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HelmetProvider>
        <ThemeProvider>
          <UserProvider>
            <ShareSpacesProvider>
              <ToastContainer position="bottom-right" />
              <BrowserRouter>
                <Router />
              </BrowserRouter>
            </ShareSpacesProvider>
          </UserProvider>
        </ThemeProvider>
      </HelmetProvider>
    </Suspense>
  );
}

export default App;
