import React, { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import PreloadImage, {
  ImgType,
  TypeBackground,
  TypeImage,
} from './utils/preloadImages';

const Router = React.lazy(() => import('./routes/sections'));
const UserProvider = React.lazy(() => import('./contexts/userContext'));
const ShareSpacesProvider = React.lazy(
  () => import('./contexts/shareSpacesContext')
);
const ThemeProvider = React.lazy(() => import('./theme/theme-provider'));

function App() {
  const imagesToPreLoad = [
    { src: 'https://i.imgur.com/wmFWM7L.jpeg', type: TypeBackground },
    { src: 'https://i.imgur.com/UJn3GdA.jpeg', type: TypeBackground },
    { src: 'https://i.imgur.com/5qz622G.jpeg', type: TypeBackground },
    { src: 'https://i.imgur.com/QmDHn63.jpeg', type: TypeBackground },
    { src: 'https://www.oakhouse.jp/assets/img/logo.png', type: TypeImage },
    {
      src: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg',
      type: TypeImage,
    },
    {
      src: 'https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg',
      type: TypeImage,
    },
  ];

  return (
    <Suspense>
      <HelmetProvider>
        <ThemeProvider>
          <UserProvider>
            <ShareSpacesProvider>
              <ToastContainer position="bottom-right" />
              <BrowserRouter>
                {imagesToPreLoad.map((data, index) => (
                  <PreloadImage
                    key={index}
                    src={data.src}
                    type={data.type as ImgType}
                  />
                ))}
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
