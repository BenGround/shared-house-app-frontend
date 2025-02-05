import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  Box,
} from '@mui/material';
import axiosInstance from 'src/settings/axiosInstance';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { handleError } from 'src/utils/errorHandler';
import { LoadingButton } from '@mui/lab';
import { AxiosResponse } from 'axios';
import {
  ApiResponse,
  FrontUser,
  FrontUserCreation,
  validateEmailFormat,
  validateEmailLength,
  validateUsername,
} from '@benhart44/shared-house-shared';

interface UserEditModalProps {
  open: boolean;
  onClose: () => void;
  user: FrontUser | null;
  onUserUpdated: (userProps: FrontUser) => void;
  onUserCreated: (userProps: FrontUser) => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({
  open,
  onClose,
  user,
  onUserUpdated,
  onUserCreated,
}) => {
  const { t } = useTranslation();

  const [currentUser, setCurrentUser] = useState<FrontUserCreation>({
    username: '',
    email: '',
    roomNumber: 0,
    isAdmin: false,
    isActive: false,
  });

  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    email?: string;
    roomNumber?: string;
  }>({});

  useEffect(() => {
    if (user) {
      setIsUpdate(true);
      setCurrentUser({
        id: user.id,
        username: user.username || '',
        email: user.email || '',
        roomNumber: user.roomNumber,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
      });
    } else {
      setIsUpdate(false);
      setCurrentUser({
        username: '',
        email: '',
        roomNumber: 0,
        isAdmin: false,
        isActive: true,
      });
    }
    setValidationErrors({});
  }, [user, open]);

  const validateFields = () => {
    const errors: { username?: string; email?: string; roomNumber?: string } =
      {};

    const email = currentUser.email.trim();

    if (!email) {
      errors.email = t('errors.user.email.required');
    } else if (!validateEmailLength(email)) {
      errors.email = t('errors.user.email.invalid.length');
    } else if (!validateEmailFormat(email)) {
      errors.email = t('errors.user.email.invalid');
    }

    if (!isUpdate && currentUser.roomNumber === null) {
      errors.roomNumber = t('validation.roomNumber.required');
    }

    if (validateUsername(currentUser.username)) {
      errors.username = t('profile.username.validationMessage');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setCurrentUser((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [field]: undefined,
    }));
  };

  const handleUpdateUser = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const response: AxiosResponse<ApiResponse> = await axiosInstance.put(
        `admin/user`,
        {
          id: currentUser.id,
          username: currentUser.username.trim(),
          email: currentUser.email.trim(),
          isAdmin: Boolean(currentUser.isAdmin),
          isActive: Boolean(currentUser.isActive),
        } as FrontUser,
        {
          withCredentials: true,
        }
      );

      if (response.status === 204) {
        toast.success(t('user.updated.success'));
        onUserUpdated(currentUser as FrontUser);
        onClose();
      } else {
        throw new Error();
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const response: AxiosResponse<ApiResponse> = await axiosInstance.post(
        `admin/user`,
        {
          username: currentUser.username.trim(),
          roomNumber: currentUser.roomNumber,
          email: currentUser.email.trim(),
          isAdmin: Boolean(currentUser.isAdmin),
          isActive: Boolean(currentUser.isActive),
        } as FrontUser,
        {
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        toast.success(t('user.created.success'));
        onUserCreated(response.data.data);
        onClose();
      } else {
        throw new Error();
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {isUpdate ? t('update.user') : t('create.user')}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <TextField
          fullWidth
          label={t('username')}
          value={currentUser.username}
          onChange={(e) => handleChange('username', e.target.value)}
          error={!!validationErrors.username}
          helperText={validationErrors.username}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          label={t('email')}
          value={currentUser.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={!!validationErrors.email}
          helperText={validationErrors.email}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          label={t('room.number')}
          value={currentUser.roomNumber ?? ''}
          inputProps={{ type: 'number' }}
          onChange={(e) => handleChange('roomNumber', e.target.value)}
          error={!!validationErrors.roomNumber}
          helperText={validationErrors.roomNumber}
          sx={{ mb: 1 }}
          disabled={isUpdate}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={currentUser.isAdmin}
                onChange={(e) => handleChange('isAdmin', e.target.checked)}
                color="primary"
              />
            }
            label={t('admin')}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={currentUser.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                color="primary"
              />
            }
            label={t('is.active')}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('button.cancel')}</Button>
        <LoadingButton
          loading={loading}
          disabled={loading}
          onClick={isUpdate ? handleUpdateUser : handleCreateUser}
          variant="contained"
        >
          {isUpdate ? t('button.update') : t('button.create')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default UserEditModal;
