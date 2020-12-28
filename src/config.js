const config = {   
    urls: {
      getCapabilities: '/map/opr?service=wmts&request=GetCapabilities',
      configuration: '/configuration.json',
      stream: '/stream?topic=/d415/color/image_raw',
      snapshot: '/snapshot?topic=/d415/color/image_raw',
    }
};

export const popupSize  = {
  small: 'small',
  medium: 'medium'
};

export const logSeverities = {
  success: 'success',
  info: 'info',
  warn: 'warn',
  error: 'error'
};

export default config;