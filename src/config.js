const config = {   
    urls: {
      getCapabilities: '/map/opr?service=wmts&request=GetCapabilities',
      configuration: 'configuration.json',
      loadMission: 'defaultMission.json',
      videoStream: '/stream?topic=/d415/color/image_raw',
      videoSnapshot: '/snapshot?topic=/d415/color/image_raw',

      skeletonStream: '/stream?topic=/SkeletonDetector/Image',
      skeletonSnapshot: '/snapshot?topic=/SkeletonDetector/Image',

      windowDetectionStream: '/stream?topic=/seeker/detectionImage',
      windowDetectionSnapshot: '/snapshot?topic=/seeker/detectionImage',
    },

    MIN_DRONE_DISTANCE_MOVE : 0.25, // 25 cm
    EXPOSURE_MAX_LEVEL : 100,
    COORDINATE_DECIMALS_PRECISION : 2,
    DEFAULT_MISSION_POINT_HEIGHT : 0
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