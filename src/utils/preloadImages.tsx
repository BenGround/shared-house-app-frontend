import { useState, useEffect } from 'react';

export const TypeBackground = 'TYPE_BACKGROUND';
export const TypeImage = 'TYPE_IMAGE';
export type ImgType = typeof TypeBackground | typeof TypeImage;

interface PreloadImageProps {
  src: string;
  type: ImgType;
}

const PreloadImage: React.FC<PreloadImageProps> = ({ src, type }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      setIsLoaded(true);
    };

    img.onerror = () => {
      setIsLoaded(false);
    };
  }, [src]);

  if (type === TypeBackground) {
    return (
      <div
        style={{
          backgroundImage: isLoaded ? `url(${src})` : 'none',
        }}
      ></div>
    );
  }
  return <div>{isLoaded && <img src={src} style={{ display: 'none' }} />}</div>;
};

export default PreloadImage;
