import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Divider,
} from '@mui/material';
import axiosInstance from 'src/settings/axiosInstance';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { handleError } from 'src/utils/errorHandler';
import { LoadingButton } from '@mui/lab';
import { SharedSpace } from 'src/types/sharedSpace';

interface SharedSpaceEditModalProps {
  open: boolean;
  onClose: () => void;
  sharedspace: SharedSpace | null;
  onSharedspaceUpdated: (sharedspaceProps: SharedspacePropsModal) => void;
  onSharedspaceCreated?: (sharedspace: SharedSpace) => void;
}

export interface SharedspacePropsModal {
  id?: number;
  nameCode: string;
  nameEn: string;
  nameJp: string;
  descriptionEn: string | null;
  descriptionJp: string | null;
  startDayTime: string;
  endDayTime: string;
  maxBookingHours: number;
  maxBookingByUser: number;
}

const SharedspaceEditModal: React.FC<SharedSpaceEditModalProps> = ({
  open,
  onClose,
  sharedspace,
  onSharedspaceUpdated,
  onSharedspaceCreated,
}) => {
  const { t } = useTranslation();

  const [currentSharespace, setCurrentSharespace] =
    useState<SharedspacePropsModal>({
      nameCode: '',
      nameEn: '',
      nameJp: '',
      descriptionEn: '',
      descriptionJp: '',
      startDayTime: '',
      endDayTime: '',
      maxBookingHours: 0,
      maxBookingByUser: 0,
    });

  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{
    nameCode?: string;
    nameEn?: string;
    nameJp?: string;
    descriptionEn?: string;
    descriptionJp?: string;
    startDayTime?: string;
    endDayTime?: string;
    maxBookingHours?: string;
    maxBookingByUser?: string;
  }>({});

  useEffect(() => {
    if (sharedspace) {
      setIsUpdate(true);
      setCurrentSharespace({
        id: sharedspace.id,
        nameCode: sharedspace.nameCode || '',
        nameEn: sharedspace.nameEn || '',
        nameJp: sharedspace.nameJp || '',
        descriptionEn: sharedspace.descriptionEn || '',
        descriptionJp: sharedspace.descriptionJp || '',
        startDayTime: sharedspace.startDayTime || '8:00',
        endDayTime: sharedspace.endDayTime || '23:00',
        maxBookingHours: sharedspace.maxBookingHours || 0,
        maxBookingByUser: sharedspace.maxBookingByUser || 0,
      });
    } else {
      setIsUpdate(false);
      setCurrentSharespace({
        nameCode: '',
        nameEn: '',
        nameJp: '',
        descriptionEn: '',
        descriptionJp: '',
        startDayTime: '8:00',
        endDayTime: '23:00',
        maxBookingHours: 0,
        maxBookingByUser: 0,
      });
    }
    setValidationErrors({});
  }, [sharedspace, open]);

  const validateFields = () => {
    const errors: {
      nameCode?: string;
      nameEn?: string;
      nameJp?: string;
      descriptionEn?: string;
      descriptionJp?: string;
      startDayTime?: string;
      endDayTime?: string;
      maxBookingHours?: string;
      maxBookingByUser?: string;
    } = {};

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setCurrentSharespace((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [field]: undefined,
    }));
  };

  const handleUpdateSharedspace = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      await axiosInstance.put(
        `admin/sharedspace`,
        {
          id: currentSharespace.id,
          nameCode: currentSharespace.nameCode.trim(),
          nameEn: currentSharespace.nameEn.trim(),
          nameJp: currentSharespace.nameJp.trim(),
          descriptionEn: currentSharespace.descriptionEn?.trim(),
          descriptionJp: currentSharespace.descriptionJp?.trim(),
          startDayTime: currentSharespace.startDayTime,
          endDayTime: currentSharespace.endDayTime,
          maxBookingHours: currentSharespace.maxBookingHours,
          maxBookingByUser: currentSharespace.maxBookingByUser,
        },
        {
          withCredentials: true,
        }
      );
      toast.success(t('sharedspace.updated.success'));
      onSharedspaceUpdated(currentSharespace);
      onClose();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSharespace = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `admin/sharedspace`,
        {
          nameCode: currentSharespace.nameCode.trim(),
          nameEn: currentSharespace.nameEn.trim(),
          nameJp: currentSharespace.nameJp.trim(),
          descriptionEn: currentSharespace.descriptionEn?.trim(),
          descriptionJp: currentSharespace.descriptionJp?.trim(),
          startDayTime: currentSharespace.startDayTime,
          endDayTime: currentSharespace.endDayTime,
          maxBookingHours: currentSharespace.maxBookingHours,
          maxBookingByUser: currentSharespace.maxBookingByUser,
        },
        {
          withCredentials: true,
        }
      );
      toast.success(t('sharedspace.created.success'));
      if (onSharedspaceCreated) onSharedspaceCreated(response.data.data);
      onClose();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {isUpdate ? t('update.sharedspace') : t('create.sharedspace')}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <TextField
          fullWidth
          label={t('sharedspace.name.code')}
          value={currentSharespace.nameCode}
          onChange={(e) => handleChange('nameCode', e.target.value)}
          error={!!validationErrors.nameCode}
          helperText={validationErrors.nameCode}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          label={t('sharedspace.name.en')}
          value={currentSharespace.nameEn}
          onChange={(e) => handleChange('nameEn', e.target.value)}
          error={!!validationErrors.nameEn}
          helperText={validationErrors.nameEn}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          label={t('sharedspace.name.jp')}
          value={currentSharespace.nameJp}
          onChange={(e) => handleChange('nameJp', e.target.value)}
          error={!!validationErrors.nameJp}
          helperText={validationErrors.nameJp}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          label={t('sharedspace.description.en')}
          value={currentSharespace.descriptionEn}
          onChange={(e) => handleChange('descriptionEn', e.target.value)}
          error={!!validationErrors.descriptionEn}
          helperText={validationErrors.descriptionEn}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          label={t('sharedspace.description.jp')}
          value={currentSharespace.descriptionJp}
          onChange={(e) => handleChange('descriptionJp', e.target.value)}
          error={!!validationErrors.descriptionJp}
          helperText={validationErrors.descriptionJp}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          label={t('sharedspace.start.day.time')}
          value={currentSharespace.startDayTime}
          onChange={(e) => handleChange('startDayTime', e.target.value)}
          error={!!validationErrors.startDayTime}
          helperText={validationErrors.startDayTime}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          label={t('sharedspace.end.day.time')}
          value={currentSharespace.endDayTime}
          onChange={(e) => handleChange('endDayTime', e.target.value)}
          error={!!validationErrors.endDayTime}
          helperText={validationErrors.endDayTime}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          label={t('sharedspace.max.booking.hours')}
          value={currentSharespace.maxBookingHours ?? ''}
          inputProps={{ type: 'number' }}
          onChange={(e) => handleChange('maxBookingHours', e.target.value)}
          error={!!validationErrors.maxBookingHours}
          helperText={validationErrors.maxBookingHours}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          label={t('sharedspace.max.booking.by.user')}
          value={currentSharespace.maxBookingByUser ?? ''}
          inputProps={{ type: 'number' }}
          onChange={(e) => handleChange('maxBookingByUser', e.target.value)}
          error={!!validationErrors.maxBookingByUser}
          helperText={validationErrors.maxBookingByUser}
          sx={{ mb: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('button.cancel')}</Button>
        <LoadingButton
          loading={loading}
          disabled={loading}
          onClick={isUpdate ? handleUpdateSharedspace : handleCreateSharespace}
          variant="contained"
        >
          {isUpdate ? t('button.update') : t('button.create')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default SharedspaceEditModal;
