import { lazy, Suspense, useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';
import { useUser } from 'src/contexts/userContext';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Iconify } from 'src/components/iconify';

const LoadingButton = lazy(() => import('@mui/lab/LoadingButton'));

const SignIn: React.FC = () => {
  return (
    <Suspense>
      <SignInView />
    </Suspense>
  );
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
  const [loading, setLoading] = useState(false);

  const handleSignIn = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (loading) return;
      setLoading(true);

      try {
        await login(roomNumber, password);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [roomNumber, password, login, loading]
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

          <Suspense>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              color="inherit"
              variant="contained"
              loading={loading}
              disabled={loading}
            >
              {t('signin')}
            </LoadingButton>
          </Suspense>
        </Box>
      </form>
    </>
  );
}

export default SignIn;
