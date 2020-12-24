const config = {   
    urls: {
      uploadFiles: 'upload-files',
      editLayerInfo: 'edit-layer-info',
      removeLayer: 'remove-layer',
      renameGroup: 'rename-group',
      layersInfo: 'layers-info',
      getCapabilities: 'map/opr?service=wmts&request=GetCapabilities',
      dictionary: 'dictionary.json',
      export: 'map/opr?request=export&layerId=',
      epsgCodes: 'map/opr?service=mcwls&request=proj-info'
    },
    nodesLevel: {
      none: '',
      repository: 'repository',
      group: 'group',
      layer: 'layer'
    },
    actions: {
      previewMap: 'previewMap'
    },
    selectedLayerDelimiter: '###',
    BACKLOG_PREFIX: 'BACKLOG:',
    LAYERS_BACKLOGS_TITLE:'Layers Backlog'
};

export const mapActions = {
  MAP: 'Map',
  DATA: 'Data',
  THREE_D: 'threeD',
  DESCRIPTION: 'Description',
  SHOW_DTM_MAP: 'SHOW_DTM_MAP'
};

export const layerTypesStrings = {
  RAW_VECTOR: 'Vector',
  RAW_RASTER: 'Raster',
  RAW_DTM: 'DTM', 
  RAW_MCPACKAGE: 'McPackage',
  NATIVE_VECTOR: 'Vector',
  NATIVE_RASTER: 'Raster',
  NATIVE_DTM: 'DTM',
  NATIVE_MCPACKAGE: 'McPackage',
  NATIVE_STATIC_OBJECT: '3D model',
  NATIVE_3D_MODEL: '3D model',
  NATIVE_VECTOR_3D_EXTRUSION: '3D model'
};

export const popupTypes = {
  ADD: 'Add',
  CONFIG: 'Config',
  RENAME: 'Rename', 
  EXPORT: 'Export',
  REMOVE: 'Remove',
  EDIT: 'Edit',
  MOVE_TO_GROUP: 'Move to Group',
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