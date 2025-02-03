import React, { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import PreloadImagesMiddleware from './middlewares/PreloadImagesMiddleware';

const Router = React.lazy(() => import('./routes/sections'));
const UserProvider = React.lazy(() => import('./contexts/userContext'));
const ShareSpacesProvider = React.lazy(
  () => import('./contexts/shareSpacesContext')
);
const ThemeProvider = React.lazy(() => import('./theme/theme-provider'));

function App() {
  return (
    <Suspense>
      <HelmetProvider>
        <ThemeProvider>
          <UserProvider>
            <ShareSpacesProvider>
              <PreloadImagesMiddleware>
                <ToastContainer position="bottom-right" />
                <BrowserRouter>
                  <Router />
                </BrowserRouter>
              </PreloadImagesMiddleware>
            </ShareSpacesProvider>
          </UserProvider>
        </ThemeProvider>
      </HelmetProvider>
    </Suspense>
  );
}

export default App;
