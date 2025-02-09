import React from 'react';
import PreloadImage, {
  ImgType,
  TypeBackground,
  TypeImage,
} from '../utils/preloadImages';
import { useSharedSpaces } from '../contexts/shareSpacesContext';
import {
  ENGLISH_FLAG,
  JAPAN_FLAG,
  NAV_LOGO,
  DASHBOARD_IMG,
} from 'src/utils/imgUtils';

const PreloadImagesMiddleware: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { sharedSpaces } = useSharedSpaces();

  const imagesToPreLoad = [
    ...sharedSpaces
      .filter((share) => Boolean(share.picture))
      .map((share) => ({ src: share.picture as string, type: TypeBackground })),
    { src: DASHBOARD_IMG, type: TypeBackground },
    { src: NAV_LOGO, type: TypeImage },
    {
      src: JAPAN_FLAG,
      type: TypeImage,
    },
    {
      src: ENGLISH_FLAG,
      type: TypeImage,
    },
  ];

  return (
    <>
      {imagesToPreLoad.map((data, index) => (
        <PreloadImage key={index} src={data.src} type={data.type as ImgType} />
      ))}
      {children}
    </>
  );
};

export default PreloadImagesMiddleware;
