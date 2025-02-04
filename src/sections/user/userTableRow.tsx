import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import axiosInstance from 'src/settings/axiosInstance';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { handleError } from 'src/utils/errorHandler';
import { FrontUser } from '@benhart44/shared-house-shared';

type UserTableRowProps = {
  row: FrontUser;
  selected: boolean;
  minimizeMode: boolean;
  onSelectRow: () => void;
  onEditRow: (user: FrontUser) => void;
  onDeleteRow: (roomNumber: number) => void;
};

export function UserTableRow({
  row,
  selected,
  minimizeMode,
  onSelectRow,
  onEditRow,
  onDeleteRow,
}: UserTableRowProps) {
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

  const handleSendEmailPassword = async () => {
    setPopoverAnchor(null);
    if (!row.email) {
      toast.warning('user.email.not.set');
      return;
    }
    try {
      const response = await axiosInstance.get(
        `admin/sendPasswordEmail/${row.id}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success(t('email.sent.successfully'));
      } else {
        throw new Error();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleDelete = () => {
    setPopoverAnchor(null);
    onDeleteRow(row.roomNumber);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>
        <TableCell component="th" scope="row">
          {row.roomNumber}
        </TableCell>

        {!minimizeMode && (
          <>
            <TableCell>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar alt={row.username} src={row.profilePicture} />
                {row.username}
              </Box>
            </TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>
              <Label color={row.isActive ? 'success' : 'error'}>
                {row.isActive ? t('active') : t('inactive')}
              </Label>
            </TableCell>
            <TableCell align="center">
              {row.isAdmin ? (
                <Iconify
                  width={22}
                  icon="solar:check-circle-bold"
                  sx={{ color: 'success.main' }}
                />
              ) : (
                '-'
              )}
            </TableCell>
          </>
        )}

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
            onClick={handleSendEmailPassword}
            sx={{ width: '100%' }}
          >
            <Iconify icon="mdi:email-send" sx={{ marginRight: 2 }} />
            {t('button.send.reset.password')}
          </MenuItem>
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
