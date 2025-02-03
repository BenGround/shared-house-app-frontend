import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export type LanguagePopoverProps = IconButtonProps & {
  data?: {
    value: string;
    labelCode: string;
    icon: string;
  }[];
};

export function LanguagePopover({
  data = [],
  sx,
  ...other
}: LanguagePopoverProps) {
  const { i18n, t } = useTranslation();

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(
    null
  );

  const handleOpenPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpenPopover(event.currentTarget);
    },
    []
  );

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleChangeLang = useCallback(
    (newLang: string) => {
      i18n.changeLanguage(newLang);
      handleClosePopover();
      toast.success(t('language.changed'));
    },
    [i18n, handleClosePopover, t]
  );

  let currentLang = data.find((lang) => lang.value === i18n.language);

  if (currentLang === undefined) {
    currentLang = data[0];
  }

  const renderFlag = (label?: string, icon?: string) => (
    <Box
      component="img"
      alt={label}
      src={icon}
      sx={{
        width: 26,
        height: 20,
        borderRadius: 0.5,
        objectFit: 'cover',
        border: '0.5px solid grey',
      }}
    />
  );

  return (
    <>
      <IconButton
        onClick={handleOpenPopover}
        sx={{
          width: 40,
          height: 40,
          ...(openPopover && { bgcolor: 'action.selected' }),
          ...sx,
        }}
        {...other}
      >
        {renderFlag(t(currentLang.labelCode), currentLang?.icon)}
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 160,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: {
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightSemiBold',
              },
            },
          }}
        >
          {data?.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === currentLang?.value}
              onClick={() => handleChangeLang(option.value)}
            >
              {renderFlag(t(option.labelCode), option.icon)}
              {t(option.labelCode)}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </>
  );
}
