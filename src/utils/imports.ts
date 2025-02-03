export const loadToast = async () => {
  const { toast } = await import('react-toastify');
  return toast;
};
