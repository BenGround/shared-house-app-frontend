import { BrowserRouter } from 'react-router-dom';
import { Router } from './routes/sections';
import { UserProvider } from './contexts/userContext';
import { ThemeProvider } from 'src/theme/theme-provider';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ShareSpacesProvider } from './contexts/shareSpacesContext';

function App() {
  return (
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
  );
}

export default App;
