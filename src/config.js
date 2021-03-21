const config = {   
    urls: {
      getCapabilities: '/map/opr?service=wmts&request=GetCapabilities',
      configuration: 'configuration.json',
      videoStream: '/stream?topic=/d415/color/image_raw',
      videoSnapshot: '/snapshot?topic=/d415/color/image_raw',

      skeletonStream: '/stream?topic=/SkeletonDetector/Image',
      skeletonSnapshot: '/snapshot?topic=/SkeletonDetector/Image',

      windowDetectionStream: '/stream?topic=/seeker/detectionImage',
      windowDetectionSnapshot: '/snapshot?topic=/seeker/detectionImage',
    }
};

export const devVideoSnapshotUrl = `https://images.pexels.com/photos/78783/submachine-gun-rifle-automatic-weapon-weapon-78783.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260`;
//export const devVideoSnapshotUrl = `//camera.ehps.ncsu.edu:8100/c8`

//export const devVideoStreamUrl = `http://88.53.197.250/axis-cgi/mjpg/video.cgi?resolution=320x240`;
//export const devVideoStreamUrl = `//camera.ehps.ncsu.edu:8100/c8`;
export const devVideoStreamUrl = `https://images.pexels.com/photos/78783/submachine-gun-rifle-automatic-weapon-weapon-78783.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260`;

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