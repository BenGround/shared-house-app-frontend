import { lazy, Suspense, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from 'src/routes/hooks';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import axiosInstance from 'src/settings/axiosInstance';
import { toast } from 'react-toastify';
import { Iconify } from 'src/components/iconify';
import { IconButton } from '@mui/material';
import { CircularProgress } from '@mui/material';
import {
  PasswordRule,
  passwordRules,
  validatePassword,
} from 'src/utils/passwordValidation';

const LoadingButton = lazy(() => import('@mui/lab/LoadingButton'));

export function CreatePasswordView() {
  const { t } = useTranslation();
  const router = useRouter();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [validationStatus, setValidationStatus] = useState<boolean[]>(
    passwordRules.map(() => false)
  );
  const [error, setError] = useState<string>('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setValidationStatus(validatePassword(newPassword));
  };

  const handleCreatePassword = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError(t('password.mismatch'));
      return;
    }

    if (!token) {
      setError(t('invalid.token'));
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('create-password', {
        token,
        password,
        confirmPassword,
      });
      toast.success(t('password.created'));
      router.push(`/sign-in?roomNumber=${response.data.roomNumber}`);
    } catch (err) {
      setError(t('password.create.error'));
      setPassword('');
      setConfirmPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        maxWidth: '400px',
        width: '100%',
        margin: 'auto',
        padding: 3,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h5" gutterBottom align="center" color="text.primary">
        {t('create.password')}
      </Typography>

      <Box
        onSubmit={handleCreatePassword}
        sx={{ width: '100%' }}
        component="form"
      >
        <TextField
          fullWidth
          name="password"
          label={t('password')}
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={handlePasswordChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  color="primary"
                >
                  <Iconify
                    icon={
                      showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
          required
        />

        <Box sx={{ mb: 3 }}>
          {passwordRules.map((rule: PasswordRule, index: number) => (
            <Box key={rule.label} display="flex" alignItems="center" gap={1}>
              <Iconify
                icon={
                  validationStatus[index]
                    ? 'eva:checkmark-circle-2-fill'
                    : 'eva:close-circle-fill'
                }
                color={validationStatus[index] ? 'success.main' : 'error.main'}
                sx={{ transition: 'color 0.3s ease' }}
              />
              <Typography
                color={validationStatus[index] ? 'success.main' : 'error.main'}
                variant="body2"
                sx={{ fontWeight: validationStatus[index] ? 600 : 400 }}
              >
                {rule.label}
              </Typography>
            </Box>
          ))}
        </Box>

        <TextField
          fullWidth
          name="confirmPassword"
          label={t('confirm.password')}
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                  color="primary"
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'error.main',
              marginBottom: 2,
              fontWeight: 500,
            }}
          >
            <Iconify
              icon="eva:alert-triangle-fill"
              sx={{ color: 'error.main', marginRight: 1 }}
            />
            <Typography variant="body2" sx={{ textAlign: 'center' }}>
              {error}
            </Typography>
          </Box>
        )}

        <Suspense fallback={<CircularProgress size={24} color="primary" />}>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            color="primary"
            variant="contained"
            disabled={!validationStatus.every(Boolean) && loading}
            loading={loading}
            sx={{
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            {t('create.password')}
          </LoadingButton>
        </Suspense>
      </Box>
    </Box>
  );
}

export default CreatePasswordView;
