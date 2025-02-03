import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';
import { useTranslation } from 'react-i18next';
import { SharedSpace } from 'src/types/sharedSpace';

type SharespaceTableRowProps = {
  row: SharedSpace;
  selected: boolean;
  onSelectRow: () => void;
  onEditRow: (sharedSpace: SharedSpace) => void;
  onDeleteRow: (nameCode: string) => void;
};

export function SharedspaceTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
}: SharespaceTableRowProps) {
  const { t } = useTranslation();
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(
    null
  );

  const handleOpenPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setPopoverAnchor(event.currentTarget);
    },
    []
  );

  const handleEdit = () => {
    setPopoverAnchor(null);
    onEditRow(row);
  };

  const handleDelete = () => {
    setPopoverAnchor(null);
    onDeleteRow(row.nameCode);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box display="flex" alignItems="center" gap={2}>
            {row.nameCode}
          </Box>
        </TableCell>

        <TableCell>{row.nameEn}</TableCell>

        <TableCell>{row.nameJp}</TableCell>

        <TableCell>{row.descriptionEn}</TableCell>

        <TableCell>{row.descriptionJp}</TableCell>

        <TableCell>{row.startDayTime}</TableCell>

        <TableCell>{row.endDayTime}</TableCell>

        <TableCell>{row.maxBookingHours}</TableCell>

        <TableCell>{row.maxBookingByUser}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover} aria-label="Open menu">
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!popoverAnchor}
        anchorEl={popoverAnchor}
        onClose={() => setPopoverAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList sx={{ p: 1 }}>
          <MenuItem
            component="button"
            onClick={handleEdit}
            sx={{ width: '100%' }}
          >
            <Iconify icon="solar:pen-bold" sx={{ marginRight: 2 }} />
            {t('button.edit')}
          </MenuItem>
          <MenuItem
            component="button"
            onClick={handleDelete}
            sx={{ color: 'error.main', width: '100%' }}
          >
            <Iconify
              icon="solar:trash-bin-trash-bold"
              sx={{ marginRight: 2 }}
            />
            {t('button.delete')}
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
