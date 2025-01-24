import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import axiosInstance from 'src/settings/axiosInstance';
import { toast } from 'react-toastify';

const SignIn: React.FC = () => {
  return <CreatePassword />;
};

export function CreatePassword() {
  const { t } = useTranslation();
  const router = useRouter();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>('');

  const handleCreatePassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (password !== confirmPassword) {
        setError(t('password.mismatch')); // Error message if passwords don't match
        return;
      }

      if (!token) {
        setError(t('invalid.token'));
        return;
      }

      try {
        const response = await axiosInstance.post('create-password', {
          token,
          password,
          confirmPassword,
        });
        toast.success(t('password.created'));
        router.push(`/sign-in?roomNumber=${response.data.roomNumber}`);
      } catch (err) {
        setError(t('password.create.error'));
      }
    },
    [password, confirmPassword, token, router, t]
  );

  return (
    <>
      <Box
        gap={1.5}
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ mb: 5 }}
      >
        <Typography variant="h5">{t('create.password')}</Typography>
      </Box>

      <form onSubmit={handleCreatePassword}>
        <Box display="flex" flexDirection="column" alignItems="flex-end">
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

          <TextField
            fullWidth
            name="confirmPassword"
            label={t('confirm.password')}
            InputLabelProps={{ shrink: true }}
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    <Iconify
                      icon={
                        showConfirmPassword
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

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="contained"
          >
            {t('create.password')}
          </LoadingButton>
        </Box>
      </form>
    </>
  );
}

export default SignIn;
