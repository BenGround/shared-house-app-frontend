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
import { LoadingButton } from '@mui/lab';

const Profile: React.FC = () => {
  return <ProfileView />;
};

export function ProfileView() {
  const { user, updateUser, updateUserPicture, removeUserPicture } = useUser();
  const { t } = useTranslation();

  const [username, setUsername] = useState<string>(user?.username || '');
  const [profilePicture, setProfilePicture] = useState<string | undefined>(
    user?.profilePicture || undefined
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disabledImgButttons, setDisabledImgButttons] =
    useState<boolean>(false);

  const MAX_FILE_SIZE_MB = 2;

  const validateFile = (file: File): string | undefined => {
    const fileSizeInMB = file.size / 1024 / 1024;
    if (!file.type.startsWith('image/')) {
      return t('file.invalid.format');
    }
    if (fileSizeInMB > MAX_FILE_SIZE_MB) {
      return t('file.size.exceeds', { size: MAX_FILE_SIZE_MB });
    }
    return undefined;
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9\s_\u3040-\u30FF\u4E00-\u9FFF]{3,25}$/;
    return usernameRegex.test(username);
  };

  const handleProfilePictureChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      setDisabledImgButttons(true);
      const result = await updateUserPicture(file);

      if (result) {
        const reader = new FileReader();
        reader.onload = () => setProfilePicture(reader.result as string);
        reader.readAsDataURL(file);
      }
      setDisabledImgButttons(false);
    } else {
      toast.error(t('file.not.loaded'));
    }
  };

  const handleProfilePictureDelete = async () => {
    const confirmed = window.confirm(t('profile.picture.confirmDelete'));
    if (!confirmed) return;

    setDisabledImgButttons(true);
    const result = await removeUserPicture();
    setDisabledImgButttons(false);
    if (result) setProfilePicture(undefined);
  };

  const handleSave = async () => {
    if (isLoading) return;
    if (!validateUsername(username)) {
      toast.error(t('profile.username.invalid'));
      return;
    }

    const trimUsername = username.trim();
    setIsLoading(true);
    setUsername(trimUsername);
    await updateUser(trimUsername);
    setIsLoading(false);
  };

  const avatar = profilePicture ? (
    <Avatar src={String(profilePicture)} sx={{ width: 100, height: 100 }} />
  ) : (
    <Avatar sx={{ width: 100, height: 100 }}>
      {user?.username?.charAt(0).toUpperCase()}
    </Avatar>
  );

  return (
    <DashboardContent>
      <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
        <Typography variant="h4">{t('profile')}</Typography>

        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          {avatar}

          <Button
            variant="outlined"
            color="info"
            component="label"
            disabled={disabledImgButttons}
          >
            {t('profile.change.picture')}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleProfilePictureChange}
              aria-label={t('profile.upload.picture')}
            />
          </Button>

          {profilePicture !== undefined && (
            <Button
              variant="outlined"
              onClick={handleProfilePictureDelete}
              aria-label={t('profile.delete.picture')}
              disabled={disabledImgButttons}
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

        <Divider sx={{ width: '100%' }} />

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
          aria-label={t('profile.username')}
        />

        <LoadingButton
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={
            !validateUsername(username) ||
            isLoading ||
            username === user?.username
          }
          aria-label={t('profile.save.changes')}
          loading={isLoading}
        >
          {t('profile.save.changes')}
        </LoadingButton>
      </Box>
    </DashboardContent>
  );
}

export default Profile;
