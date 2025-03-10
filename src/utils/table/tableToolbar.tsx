import { useCallback } from 'react';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { t } from 'i18next';

type customTableToolbarProps = {
  numSelected: number;
  filter: string;
  onFilter: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteSelected: () => void;
};

export function CustomTableToolbar({
  numSelected,
  filter,
  onFilter,
  onDeleteSelected,
}: customTableToolbarProps) {
  const handleDelete = useCallback(() => {
    onDeleteSelected();
  }, [onDeleteSelected]);

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1" aria-live="polite">
          {t('table.number.selected', { numSelected })}
        </Typography>
      ) : (
        <OutlinedInput
          fullWidth
          value={filter}
          onChange={onFilter}
          placeholder={t('table.search.by.name.code')}
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                width={20}
                icon="eva:search-fill"
                sx={{ color: 'text.secondary' }}
              />
            </InputAdornment>
          }
          sx={{ maxWidth: 320 }}
        />
      )}

      {numSelected > 0 && (
        <Tooltip title={t('delete.selected')}>
          <IconButton
            onClick={handleDelete}
            aria-label="Delete selected elements"
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
