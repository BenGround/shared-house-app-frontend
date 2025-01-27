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

export function Profile() {
  const { user, updateUser, updateUserPicture } = useUser();
  const { t } = useTranslation();

  const [username, setUsername] = useState<string>(user?.username || '');
  const [profilePicture, setProfilePicture] = useState<string | undefined>(
    user?.profilePicture || undefined
  );

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleProfilePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      updateUserPicture(file);

      const reader = new FileReader();
      reader.onload = () => setProfilePicture(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (user && username) {
      await updateUser(username);
    }
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
          <Button variant="outlined" component="label">
            {t('profile.change.picture')}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleProfilePictureChange}
            />
          </Button>
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
        />

        <Button variant="contained" color="primary" onClick={handleSave}>
          {t('profile.save.changes')}
        </Button>
      </Box>
    </DashboardContent>
  );
}
