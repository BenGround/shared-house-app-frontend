import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { useUser } from 'src/contexts/userContext';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const SignIn: React.FC = () => {
  return <SignInView />;
};

export function SignInView() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomNumberFromQueryParams = queryParams.get('roomNumber');
  const { t } = useTranslation();
  const router = useRouter();
  const { login, isAuthenticated } = useUser();

  const [roomNumber, setRoomNumber] = useState<string>(
    roomNumberFromQueryParams ? roomNumberFromQueryParams : ''
  );
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await login(roomNumber, password);
      router.push('/');
    },
    [roomNumber, password, router, login]
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <Box
        gap={1.5}
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ mb: 5 }}
      >
        <Typography variant="h5">{t('signin')}</Typography>
      </Box>

      <form onSubmit={handleSignIn}>
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <TextField
            fullWidth
            name="roomNumber"
            value={roomNumber}
            label={t('room.number')}
            inputProps={{ type: 'number' }}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 3 }}
            onChange={(e) => setRoomNumber(e.target.value)}
            required
          />

          <TextField
            fullWidth
            name="password"
            label={t('password')}
            InputLabelProps={{ shrink: true }}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    <Iconify
                      icon={
                        showPassword
                          ? 'solar:eye-bold'
                          : 'solar:eye-closed-bold'
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
            required
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="contained"
          >
            {t('signin')}
          </LoadingButton>
        </Box>
      </form>
    </>
  );
}

export default SignIn;
