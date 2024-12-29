import { toast as hotToast } from 'react-hot-toast';

export const toast = {
  error: (message: string) => {
    hotToast.error(message, {
      duration: 3000,
      position: 'bottom-right',
      style: {
        background: '#1a1b26',
        color: '#ffffff',
        border: '1px solid #2f3342',
      },
    });
  },
  success: (message: string) => {
    hotToast.success(message, {
      duration: 3000,
      position: 'bottom-right',
      style: {
        background: '#1a1b26',
        color: '#ffffff',
        border: '1px solid #2f3342',
      },
    });
  },
};
