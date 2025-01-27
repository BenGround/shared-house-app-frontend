import { useState, ChangeEvent } from 'react';
import { useUser } from 'src/contexts/userContext';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  Avatar,
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export function Profile() {
  const { user, updateUser, updateUserPicture, removeUserPicture } = useUser();
  const { t } = useTranslation();

  const [username, setUsername] = useState<string>(user?.username || '');
  const [profilePicture, setProfilePicture] = useState<string | undefined>(
    user?.profilePicture || undefined
  );

  const MAX_FILE_SIZE_MB = 2;

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9\s_\u3040-\u30FF\u4E00-\u9FFF]{3,25}$/;
    return usernameRegex.test(username);
  };

  const handleProfilePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const fileSizeInMB = file.size / 1024 / 1024;
      const isImage = file.type.startsWith('image/');

      if (!isImage) {
        toast.error(t('file.invalid.format'));
        return;
      }

      if (fileSizeInMB > MAX_FILE_SIZE_MB) {
        toast.error(t('file.size.exceeds', { size: MAX_FILE_SIZE_MB }));
        return;
      }

      updateUserPicture(file);

      const reader = new FileReader();
      reader.onload = () => setProfilePicture(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      toast.error(t('file.not.loaded'));
    }
  };

  const handleProfilePictureDelete = () => {
    const confirmed = window.confirm(t('profile.picture.confirmDelete'));
    if (!confirmed) {
      return;
    }
    removeUserPicture();
    setProfilePicture(undefined);
  };

  const handleSave = async () => {
    if (!validateUsername(username)) {
      toast.error(t('profile.username.invalid'));
      return;
    }

    await updateUser(username.trim());
  };

  return (
    <DashboardContent>
      <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
        <Typography variant="h4">{t('profile')}</Typography>

        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          {profilePicture ? (
            <Avatar
              src={String(profilePicture)}
              sx={{ width: 100, height: 100 }}
            />
          ) : (
            <Avatar sx={{ width: 100, height: 100 }}>
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
          )}
          <Button variant="outlined" color="info" component="label">
            {t('profile.change.picture')}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleProfilePictureChange}
            />
          </Button>
          {profilePicture !== undefined && (
            <Button
              variant="outlined"
              component="label"
              onClick={handleProfilePictureDelete}
            >
              {t('profile.delete.picture')}
            </Button>
          )}
        </Box>

        <TextField
          label={t('room.number')}
          value={user?.roomNumber || ''}
          InputProps={{ readOnly: true }}
          fullWidth
          disabled={true}
        />

        <TextField
          label={t('email')}
          value={user?.email || ''}
          InputProps={{ readOnly: true }}
          fullWidth
          disabled={true}
        />

        <Divider />

        <TextField
          label={t('username')}
          value={username}
          onChange={handleUsernameChange}
          fullWidth
          error={!validateUsername(username) && username !== ''}
          helperText={
            !validateUsername(username) && username !== ''
              ? t('profile.username.validationMessage')
              : ''
          }
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={!validateUsername(username)}
        >
          {t('profile.save.changes')}
        </Button>
      </Box>
    </DashboardContent>
  );
}
