declare namespace MapCore {

    function SetStartCallbackFunction(CallbackFunction : any);

    interface IMcBase {
        AddRef();
        Release();
        GetRefCount() : number;
    }

    interface IMcDestroyable {
        Destroy();
    }

    ////////////////////////////////////////////////////////////////////////////////////////
    // Map

    interface IMcMapCamera extends IMcBase {
        GetMapType() : IMcMapCamera.EMapType;
        SetCameraPosition(Position : SMcVector3D, bRelative? : boolean)
        GetCameraPosition() : SMcVector3D;
        MoveCameraRelativeToOrientation(DeltaPosition : SMcVector3D, bIgnorePitch : boolean);
        SetCameraOrientation(fYaw : number , fPitch : number, fRoll : number, bRelative : boolean);
         /**
          * @param pfYaw      pfYaw.Value : number
          * @param pfPitch    pfPitch.Value : number
          * @param pfRoll     pfRoll.Value : number
          */
        GetCameraOrientation(pfYaw : any, pfPitch? : any, pfRoll? : any);
        SetCameraUpVector(UpVector : SMcVector3D, bRelativeToOrientation? : boolean);
        GetCameraUpVector() : SMcVector3D;
        RotateCameraAroundWorldPoint(PivotPoint :SMcVector3D, fDeltaYaw : number, fDeltaPitch? : number, fDeltaRoll? : number, bRelativeToOrientation? : boolean)
        SetCameraScale(fWorldUnitsPerPixel : number, Point? : SMcVector3D);
        GetCameraScale(Point? : SMcVector3D) : number;
        SetCameraCenterOffset(Offset : SMcFVector2D);
        GetCameraCenterOffset() : SMcFVector2D;
        SetCameraWorldVisibleArea(VisibleArea : SMcBox, nScreenMargin? : number, fRectangleYaw? : number);
        GetCameraWorldVisibleArea(nScreenMargin? : number, fRectangleYaw? : number) : SMcBox;
        SetCameraScreenVisibleArea(VisibleArea : SMcRect, e3DOperation? : IMcMapCamera.ESetVisibleArea3DOperation);
        ScrollCamera(nDeltaX : number, nDeltaY : number);
        SetCameraLookAtPoint(LookAtPoint : SMcVector3D);
        SetCameraForwardVector(ForwardVector : SMcVector3D, bRelativeToOrientation? : boolean);
        GetCameraForwardVector() : SMcVector3D;
        SetCameraFieldOfView(fFieldOfViewHorizAngle : number);
        GetCameraFieldOfView() : number;
        RotateCameraRelativeToOrientation(fDeltaYaw : number, fDeltaPitch : number, fDeltaRoll : number);
        SetCameraRelativeHeightLimits(dMinHeight : number, dMaxHeight : number, bEnabled : boolean);
        GetCameraRelativeHeightLimits(pdMinHeight : number, pdMaxHeight : number) : boolean;
        SetCameraClipDistances(fMin : number, fMax : number, bRenderInTwoSessions : boolean);
         /**
          * @param pfMin      pfMin.Value : number
          * @param pfMax      pfMax.Value : number
          */
        GetCameraClipDistances(pfMin : any, pfMax :any) : boolean;
        SetCameraAttachmentEnabled(bEnable : boolean);
        GetCameraAttachmentEnabled() : boolean;
        SetCameraAttachment(pAttachment : IMcMapCamera.SCameraAttachmentParams, pLookAtAttachment :IMcMapCamera.SCameraAttachmentTarget);
        /**
         * @param pAttachment                       pAttachment.Value : IMcMapCamera.SCameraAttachmentParams
         * @param pbAttachmentDefined               pbAttachmentDefined.Value : boolean
         * @param pLookAtAttachment                 pLookAtAttachment.Value : IMcMapCamera.SCameraAttachmentTarget
         * @param pbLookAtAttachmentDefined         pbLookAtAttachmentDefined.Value : IMcMapCamera.SCameraAttachmentTarget
         */
        GetCameraAttachment(pAttachment? : any, pbAttachmentDefined? : any, pLookAtAttachment? : any, pbLookAtAttachmentDefined? : any);
        WorldToScreen(WorldPoint : SMcVector3D) : SMcVector3D;
        /**
         * @param pWorldPoint                       pWorldPoint.Value : SMcVector3D
         */
        ScreenToWorldOnTerrain(ScreenPoint : SMcVector3D, pWorldPoint : any, pParams? : IMcSpatialQueries.SQueryParams) : boolean;
        /**
         * @param pWorldPoint                       pWorldPoint.Value : SMcVector3D
         */
        ScreenToWorldOnPlane(ScreenPoint : SMcVector3D, pWorldPoint : any, dPlaneLocation? : number, PlaneNormal? : SMcVector3D) : boolean;
        ImageToScreen(ImagePoint : SMcVector3D) : SMcVector3D;
        ScreenToImage(ScreenPoint : SMcVector3D) : SMcVector3D;
        GetCameraFootprint() : IMcMapCamera.SCameraFootprintPoints;
    }

    namespace IMcMapCamera {
        enum EMapType {
            EMT_2D,
            EMT_3D
        }
        enum ESetVisibleArea3DOperation {
            ESVAO_ROTATE_AND_MOVE,
            ESVAO_ROTATE_AND_SET_FOV
        }
        class SCameraFootprintPoints {
            constructor();
            UpperLeft : SMcVector3D;
            UpperRight : SMcVector3D;
            LowerRight : SMcVector3D;
            LowerLeft : SMcVector3D;
            Center : boolean;
            bUpperLeftFound : boolean;
            bUpperRightFound : boolean;
            bLowerRightFound : boolean;
            bLowerLeftFound : boolean;
            bCenterFound : boolean;
        }
        class SCameraAttachmentTarget {
            constructor();
            pObject : IMcObject;
            pItem : IMcObjectSchemeItem;
            uAttachPoint : number;
        }
        class SCameraAttachmentParams extends SCameraAttachmentTarget {
            constructor();
            pObject : IMcObject;
            pItem : IMcObjectSchemeItem;
            uAttachPoint : number;
            Offset : SMcVector3D;
            bAttachOrientation : boolean;
            fAdditionalYaw : number;
            fAdditionalPitch : number;
            fAdditionalRoll : number;
        }
    }

    interface IMcMapViewport extends IMcSpatialQueries, IMcMapCamera {
        CreateCamera() : IMcMapCamera;
        DestroyCamera(pCamera : IMcMapCamera);
        SetActiveCamera(pCamera : IMcMapCamera);
        GetActiveCamera() : IMcMapCamera;
        GetCameras() : IMcMapCamera[];
        GetWindowHandle() : HTMLCanvasElement;
        GetImageCalc(bStereoSlave? : boolean) : IMcImageCalc;
        ViewportResized();
        /**
         * @param puWidth               puWidth.Value : number
         * @param puHeight              puHeight.Value : number
         */
        GetViewportSize(puWidth : any, puHeight : any);
        SetRelativePositionInWindow(TopLeftCorner : SMcFVector2D, BottomRightCorner : SMcFVector2D);
        /**
         * @param pTopLeftCorner        pTopLeftCorner.Value : SMcFVector2D
         * @param pBottomRightCorner    pBottomRightCorner.Value : SMcFVector2D
         */
        GetRelativePositionInWindow(pTopLeftCorner : any, pBottomRightCorner : any);
        GetAbsolutePositionInWindow() : SMcPoint;
        /**
         * @param pViewportPixel        pViewportPixel.Value : SMcVector2D
         * @param pbInViewport          pbInViewport.Value : boolean
         * @param pbInViewportRect      pbInViewportRect.Value : boolean
         * @param ppPixelViewport       ppPixelViewport.Value : IMcMapViewport
         */
        WindowPixelToViewportPixel(WindowPixel : SMcPoint, pViewportPixel : any, pbInViewport : any, pbInViewportRect? : any, ppPixelViewport? : any);
        SetTopMostZOrderInWindow();
        GetPixelPhysicalHeight(fDisplayHeightInMeters? : number) : number;
        SetFullScreenMode(bFullScreen : boolean);
        GetFullScreenMode() : boolean;
        AddTerrain(pTerrain : IMcMapTerrain);
        RemoveTerrain(pTerrain : IMcMapTerrain);
        SetTerrainNumCacheTiles(pTerrain : IMcMapTerrain, bStaticObjects : boolean, uNumTiles : number);
        GetTerrainNumCacheTiles(pTerrain : IMcMapTerrain, bStaticObjects : boolean) :number;
        GetTerrainByID(uID : number) : IMcMapTerrain;
        SetTerrainDrawPriority(pTerrain : IMcMapTerrain, nDrawPriority : number);
        GetTerrainDrawPriority(pTerrain : IMcMapTerrain) : number;
        GetVisibleLayers(pTerrain : IMcMapTerrain) : IMcMapLayer[];
        SetGrid(pGrid : IMcMapGrid);
        GetGrid() : IMcMapGrid;
        SetGridVisibility(bVisible : boolean);
        GetGridVisibility() : boolean;
        SetGridAboveVectorLayers(bAboveVector : boolean);
        GetGridAboveVectorLayers() : boolean;
        SetHeightLines(pHeightLines : IMcMapHeightLines);
        GetHeightLines() : IMcMapHeightLines;
        SetHeightLinesVisibility(bVisible : boolean);
        GetHeightLinesVisibility() : boolean;
        SetDtmVisualization(bEnabled : boolean, pParams? : IMcMapViewport.SDtmVisualizationParams);
         /**
          * @param pParams    pParams.Value : IMcMapViewport.SDtmVisualizationParams
          */
        GetDtmVisualization(pParams? : any) : boolean;
        SetDtmTransparencyWithoutRaster(bEnabled : boolean);
        GetDtmTransparencyWithoutRaster() : boolean;
        SetBackgroundColor(BackgroundColor : SMcBColor);
        GetBackgroundColor() : SMcBColor;
        SetBrightness(eStage : IMcMapViewport.EImageProcessingStage, fBrightness : number);
        GetBrightness(eStage : IMcMapViewport.EImageProcessingStage) : number;
        AddCameraUpdateCallback(callback : IMcMapViewport.ICameraUpdateCallback);
        RemoveCameraUpdateCallback(pCallback : IMcMapViewport.ICameraUpdateCallback);
        OverlayManagerToViewportWorld(OverlayManagerPoint : SMcVector3D, pOverlayManager? : IMcOverlayManager) : SMcVector3D;
        ViewportToOverlayManagerWorld(ViewportPoint : SMcVector3D, pOverlayManager? : IMcOverlayManager) : SMcVector3D;
        ViewportToOtherViewportWorld(ThisViewportPoint : SMcVector3D, pOtherViewport : IMcMapViewport) : SMcVector3D;
        WorldToImage(WorldPoint : SMcVector3D, pImageCalc? : IMcImageCalc) : SMcVector3D;
        ImageToWorld(ImagePoint : SMcVector3D, pImageCalc? : IMcImageCalc) : SMcVector3D;
        Render();
        SetRenderToBufferMode(bOn : boolean);
        GetRenderToBufferMode() : boolean;
        RenderScreenRectToBuffer(Rect : SMcRect, uBufferWidth : number, uBufferHeight : number, eBufferPixelFormat : IMcTexture.EPixelFormat, uBufferRowPitch : number) : Uint8Array;
        /**
         * @param pePixelFormat       pePixelFormat.Value    :  IMcTexture.EPixelFormat
         * @param puPixelByteCount    puPixelByteCount.Value :  number
         */
        GetRenderToBufferNativePixelFormat(pePixelFormat : any, puPixelByteCount? : any);
        RenderRollingShutter(RollingShutterData : IMcMapViewport.SRollingShutterData);
        RenderRollingShutterRectToBuffer(RollingShutterData : IMcMapViewport.SRollingShutterData, Rect : SMcRect,
		    uBufferWidth : number, uBufferHeight : number, eBufferPixelFormat : IMcTexture.EPixelFormat,
		    uBufferRowPitch : number, aBuffer : Uint8Array);
        HasPendingUpdates(uUpdateTypeBitField? : number) : boolean;
        PerformPendingUpdates(uUpdateTypeBitField? : number, uTerrainLoadTimeout? : number);
        GetRenderStatistics() : IMcMapViewport.SRenderStatistics;
        ResetRenderStatistics();
        GetRenderSurface() : number;
        ResizeRenderSurface(uNewWidth : number, uNewHeight : number) : number;
        SetTerrainNoiseMode(eNoiseMode : IMcMapViewport.ETerrainNoiseMode);
        GetTerrainNoiseMode() : IMcMapViewport.ETerrainNoiseMode;
        SetShadowMode(eShadowMode : IMcMapViewport.EShadowMode);
        GetShadowMode() : IMcMapViewport.EShadowMode;
        SetMaterialSchemeDefinition(strMaterialSchemeName : string, strMaterialNameToCopyFrom : string);
        SetMaterialScheme(strMaterialSchemeName : string);
        SetClipPlanes(aClipPlanes : SMcPlane[]);
        GetClipPlanes() : SMcPlane[];
        SetStaticObjectsVisibilityMaxScale(fStaticObjectsVisibilityMaxScale : number);
        GetStaticObjectsVisibilityMaxScale() : number;
        SetObjectsVisibilityMaxScale(fObjectsVisibilityMaxScale : number);
        GetObjectsVisibilityMaxScale() : number;
        SetObjectsMovementThreshold(uThresholdInPixels : number);
        GetObjectsMovementThreshold() : number;
        SetSpatialPartitionNumCacheNodes(uNumNodes : number);
        GetSpatialPartitionNumCacheNodes() : number;
        SetScreenSizeTerrainObjectsFactor(fFactor : number);
        GetScreenSizeTerrainObjectsFactor() : number;
        SetObjectsDelay(eDelayType : IMcMapViewport.EObjectDelayType, bEnabled : boolean, uNumToUpdatePerRender : number);
        /**
         * @param pbEnabled                 pbEnabled.Value              :  boolean
         * @param puNumToUpdatePerRender    puNumToUpdatePerRender.Value :  number
         */
        GetObjectsDelay(eDelayType : IMcMapViewport.EObjectDelayType, pbEnabled : any, puNumToUpdatePerRender : any);
        SetOverloadMode(bEnabled : boolean, uMinNumItemsForOverload : number);
        /**
         * @param pbEnabled                 pbEnabled.Value              :  boolean
         * @param puNumToUpdatePerRender    puNumToUpdatePerRender.Value :  number
         */
        GetOverloadMode(pbEnabled : any, puMinNumItemsForOverload : any);
        GetVisibleOverlays() : IMcOverlay[];
        SetOverlaysVisibilityOption(eVisibility : IMcConditionalSelector.EActionOptions, apOverlays : IMcOverlay[]);
        SetObjectsVisibilityOption(eVisibility : IMcConditionalSelector.EActionOptions,	apObjects : IMcObject[]);
        GetObjectsVisibleInWorldRectAndScale2D(WorldRect : SMcBox, fCameraScale : number) : IMcObject[];
        /**
         * @param pCorrectionFactor                 pCorrectionFactor.Value              :  SMcFVector2D
         * @param pbCorrectionFactorNeeded           pbCorrectionFactorNeeded.Value      :  boolean
         */
         GetLocalGeoCorrectionFactorAtObject(pObject : IMcObject, eGeometryType : IMcObjectSchemeItem.EGeometryType, pCorrectionFactor : any, pbCorrectionFactorNeeded? : any);
        /**
         * @param pCorrectionFactor                 pCorrectionFactor.Value              :  SMcFVector2D
         * @param pbCorrectionFactorNeeded           pbCorrectionFactorNeeded.Value      :  boolean
         */
         GetLocalGeoCorrectionFactorAtPoint(WorldPoint : SMcVector3D, eGeometryType : IMcObjectSchemeItem.EGeometryType, pCorrectionFactor : any, pbCorrectionFactorNeeded? : any);
         SetOneBitAlphaMode(uAlphaRejectValue : number);
         GetOneBitAlphaMode() : number;
         SetTransparencyOrderingMode(bEnabled : boolean);
         GetTransparencyOrderingMode() : boolean;
         SetSoundListener();
         IsSoundListener() : boolean;
         AddPostProcess(strPostProcess : string);
         RemovePostProcess(strPostProcess : string);
         SetNextFrameDeltaTime(fTimeSinceLastFrame : number);
    }
    namespace IMcMapViewport {
        /**
         * @param camera    camera.Value : IMcMapCamera
         */
        function Create(camera : any, CreateData : IMcMapViewport.SCreateData, apTerrains : IMcMapTerrain[] ) : IMcMapViewport;
        function RenderStatic(apViewports : IMcMapViewport[]);
        function RenderAll();

        enum EObjectDelayType {
            EODT_VIEWPORT_CHECK_HIDDEN_OBJECT_COLLISION, 
            EODT_VIEWPORT_CHANGE_OBJECT_UPDATE,
            EODT_VIEWPORT_CHANGE_OBJECT_CONDITION,
            EODT_VIEWPORT_CHANGE_OBJECT_SIZE,
            EODT_VIEWPORT_CHANGE_OBJECT_HEIGHT
        }
        enum EPendingUpdateType {
            EPUT_TERRAIN,
            EPUT_OBJECTS,
            EPUT_GLOBAL_MAP,
            EPUT_GRID, EPUT_IMAGEPROCESS, 
            EPUT_ANY_UPDATE
        }
        enum EImageProcessingStage {
            EIPS_RASTER_LAYERS,
            EIPS_WITHOUT_OBJECTS, 
            EIPS_ALL
        }
        enum EDisplayingItemsAttachedToTerrain {
            EDIATT_ON_TERRAIN_ONLY,
            EDIATT_ON_TERRAIN_AND_SPECIFIED_ITEMS, 
            EDIATT_ON_TERRAIN_AND_ALL_MESH_ITEMS
        }
        enum ETerrainNoiseMode {
            ETNM_NONE, 
            ETNM_NOISE_TEXTURE
        }
        enum EShadowMode {
            ESM_NONE, 
            ESM_STENCIL_MODULATIVE, 
            ESM_STENCIL_ADDITIVE, 
            ESM_TEXTURE_MODULATIVE, 
            ESM_TEXTURE_ADDITIVE, 
            ESM_TEXTURE_ADDITIVE_INTEGRATED, 
            ESM_TEXTURE_MODULATIVE_INTEGRATED
        }
        interface ICameraUpdateCallback {
            /** Mandatory */
            OnActiveCameraUpdated(pViewport : IMcMapViewport);
            /** Optional */
            Release();
        }
        namespace ICameraUpdateCallback {
            function extend(strName : string, Class : any) : ICameraUpdateCallback;
        }
        class SCreateData {
            constructor(mapType : IMcMapCamera.EMapType);
            pDevice : IMcMapDevice;
            pCoordinateSystem : IMcGridCoordinateSystem;
            pOverlayManager : IMcOverlayManager;
            uViewportID : number;
            hWnd : HTMLCanvasElement;
            pShareWindowViewport : IMcMapViewport;
            pGrid : IMcMapGrid;
            pImageCalc : IMcImageCalc;
            eMapType : IMcMapCamera.EMapType;
            TopLeftCornerInWindow : SMcFVector2D;
            BottomRightCornerInWindow : SMcFVector2D;
            bShowGeoInMetricProportion : boolean;
            eDtmUsageAndPrecision : IMcSpatialQueries.EQueryPrecision;
            fTerrainObjectsBestResolution : number;
            bTerrainObjectsCache : boolean;
            eDisplayingItemsAttachedToTerrain : EDisplayingItemsAttachedToTerrain;
            fTerrainPrecisionFactor : number;
        }
        class SHeigtColor {
            constructor();
            Color : SMcBColor; 
            nHeightInSteps : number;
        }
        class SDtmVisualizationParams {
            constructor();
            aHeightColors : IMcMapViewport.SHeigtColor;
            fHeightColorsHeightOrigin : number;
            fHeightColorsHeightStep : number;
            fShadingHeightFactor : number;
            fShadingLightSourceYaw : number;
            fShadingLightSourcePitch : number;
            uHeightColorsTransparency : Number;
            uShadingTransparency: Number;
            bHeightColorsInterpolation : boolean;
            bDtmVisualizationAboveRaster : boolean;
            static SetDefaultHeightColors(Params : SDtmVisualizationParams, fMinHeight? : Number, fMaxHeight? : Number);
        }
        class SRenderStatistics {
            constructor();
            fLastFPS : number; 
            fAverageFPS : number; 
            fBestFPS : number;
            fWorstFPS : number;
            uNumLastFrameTriangles : number;
            uNumLastFrameBatches : number;
        }
        class SRollingShutterLocation {
            constructor();
            Position : SMcVector3D;
            fYaw : number;
            fPitch : number;
            fRoll : number;
            uRow : number;
        }
        class SRollingShutterData {
            constructor();
            aRollingShutterLocations : SRollingShutterLocation[];
            uNumPixelsPerStrip : number;
        }
    }

    interface IMcMapLayer extends IMcBase {
        GetCoordinateSystem() : IMcGridCoordinateSystem;
        GetBoundingBox() : SMcBox;
        SetVisibility(bVisibility : boolean, pMapViewport? :  IMcMapViewport);
        GetVisibility(pMapViewport? :  IMcMapViewport) : boolean;
        GetEffectiveVisibility(pMapViewport : IMcMapViewport, pTerrain : IMcMapTerrain, pbVisibility : boolean) : boolean;
        SetEarthCurvatureCorrection(pCorrectionPoint : SMcVector3D);
        GetEarthCurvatureCorrectionLocalOffset(WorldPoint : SMcVector3D) : number;
        SetID(uID : number);
        GetID() : number;
        SetUserData(pUserData : IMcUserData);
        GetUserData() : IMcUserData;
        GetBackgroundThreadIndex() : number;
        GetCallback() : IMcMapLayer.IReadCallback;
        GetLevelsOfDetail() : IMcMapLayer.SLayerLodParams[];
        /**
         * @param pTileKey              pTileKey.Value :            IMcMapLayer.SLayerTileKey
         * @param pTileBoundingBox      pTileBoundingBox.Value :    SMcBox
         * @param pbDoesTileExist       pbDoesTileExist.Value :     boolean
         */
        GetTileDataByPoint(Point : SMcVector3D, nLOD : number, bBuildIfPossible : boolean, pTileKey : any, pTileBoundingBox? : any, pbDoesTileExist? : boolean);
        /**
         * @param pTileBoundingBox      pTileBoundingBox.Value :    SMcBox
         * @param pbDoesTileExist       pbDoesTileExist.Value :     boolean
         */
        GetTileDataByKey(TileKey : IMcMapLayer.SLayerTileKey, bBuildIfPossible : boolean, pTileBoundingBox? : any, pbDoesTileExist? : any);

        RemoveLayerAsync();
        ReplaceNativeServerLayerAsync(pNewReadCallback : IMcMapLayer.IReadCallback);
        Save(strBaseDirectory? : string, bSaveUserData? : boolean) : Uint8Array;
        LoadFromFile(strFileName : string, strBaseDirectory? : string, pUserDataFactory? :  IMcUserDataFactory) : IMcMapLayer;
        Load(abMemoryBuffer : Uint8Array, strBaseDirectory? : string, pUserDataFactory? :  IMcUserDataFactory) : IMcMapLayer;
        IsInitialized(): boolean;
        GetLayerType() : number;
    }

    namespace IMcMapLayer {
        function GetStandardTilingScheme(eType : IMcMapLayer.ETilingSchemeType) : IMcMapLayer.STilingScheme;
        function SetNativeServerCredentials(strToken : string, strSessionID : string);
        /**
         * @param pstrToken         pstrToken.Value :       string
         * @param pstrSessionID     pstrSessionID.Value :   string
         */
        function GetNativeServerCredentials(pstrToken : any, pstrSessionID : any);
        function CheckAllNativeServerLayersValidityAsync();
        function LoadFromFile(strFileName : string, strBaseDirectory? : string, pUserDataFactory? :  IMcUserDataFactory) : IMcMapLayer;
        function Load(abMemoryBuffer : Uint8Array, strBaseDirectory? : string, pUserDataFactory? :  IMcUserDataFactory) : IMcMapLayer;

        enum EComponentType {
            ECT_FILE, 
            ECT_DIRECTORY
        }
        enum ETilingSchemeType {
		    ETST_MAPCORE,
            ETST_GLOBAL_LOGICAL,
            ETST_GOOGLE_CRS84_QUAD,
            ETST_GOOGLE_MAPS_COMPATIBLE
        }
        enum ECoordinateAxesOrder {
            ECAO_DEFAULT,
            ECAO_INVERSE,
            ECAO_XY, 
            ECAO_YX
        }
        enum ELayerKind {
            ELK_DTM, 
            ELK_RASTER, 
            ELK_VECTOR, 
            ELK_HEAT_MAP, 
            ELK_STATIC_OBJECTS, 
            ELK_CODE_MAP
        }
        enum EVectorFieldReturnedType {
            EVFRT_INT,
            EVFRT_DOUBLE,
            EVFRT_STRING, 
            EVFRT_WSTRING
        }
        interface IReadCallback {
            /** Mandatory */
            OnInitialized(pLayer: IMcMapLayer, eStatus : IMcErrors.ECode, strAdditionalDataString : string);
            /** Mandatory */
            OnReadError(pLayer: IMcMapLayer, eErrorCode : IMcErrors.ECode, strAdditionalDataString : string);
            /** Mandatory */
            OnNativeServerLayerNotValid(pLayer: IMcMapLayer, bLayerVersionUpdated : boolean);
            /** Optional */
            OnRemoved(pLayer: IMcMapLayer, eStatus: IMcErrors.ECode, strAdditionalDataString: string);
            /** Optional */
            OnReplaced(pOldLayer: IMcMapLayer, pNewLayer: IMcMapLayer, eStatus: IMcErrors.ECode, strAdditionalDataString: string);
        }
        namespace IReadCallback {
            function extend(strName : string, Class : any) : IReadCallback;
        }

        interface IAsyncOperationCallback {
            OnScanExtendedDataResult(pLayer: IMcMapLayer, eStatus: IMcErrors.ECode, aVectorItems : IMcMapLayer.SVectorItemFound[], aUnifiedVectorItemsPoints : SMcVector3D[]);
            /** Optional */
            OnVectorItemPointsResult(pLayer: IMcMapLayer, eStatus: IMcErrors.ECode, aaPoints : SMcVector3D[][]);
             /** Optional */
             /**
             * @param paUniqueValues      paUniqueValues     the type depend on eReturndType
             *                            number for EVFRT_INT or EVFRT_DOUBLE
		     *                            string for EVFRT_STRING or EVFRT_WSTRING
             */
            OnFieldUniqueValuesResult(pLayer: IMcMapLayer, eStatus: IMcErrors.ECode, eReturnedType : IMcMapLayer.EVectorFieldReturnedType, paUniqueValues : any);
             /** Optional */
             /**
             * @param pValue              pValue               the type depend on eReturndType
             *                            number for EVFRT_INT or EVFRT_DOUBLE
		     *                            string for EVFRT_STRING or EVFRT_WSTRING
             */
            OnVectorItemFieldValueResult(pLayer: IMcMapLayer, eStatus: IMcErrors.ECode, eReturnedType : IMcMapLayer.EVectorFieldReturnedType, pValue : any);
            /** Optional */
            OnVectorQueryResult(pLayer: IMcMapLayer, eStatus: IMcErrors.ECode, auVectorItemsID : Float64Array);
            /** Optional */
            Release();
        }
        namespace IAsyncOperationCallback {
            function extend(strName : string, Class : any) : IAsyncOperationCallback;
        }


        class SNonNativeParams {
            constructor();
            pCoordinateSystem : IMcGridCoordinateSystem;
            pTilingScheme : IMcMapLayer.STilingScheme;
            fMaxScale : number;
            bResolveOverlapConflicts : boolean;
            bEnhanceBorderOverlap : boolean;
            bFillEmptyTilesByLowerResolutionTiles : boolean;
            TransparentColor : SMcBColor;
            byTransparentColorPrecision : number;
            pReadCallback : IReadCallback;
        }
        class SLocalCacheLayerParams {
            constructor();
            strLocalCacheSubFolder : string;
            strOriginalFolder : string;
        }
        class STilingScheme {
            constructor();
            constructor(TilingOrigin : SMcVector2D, dLargestTileSizeInMapUnits : number, uNumLargestTilesX : number, uNumLargestTilesY : number, uTileSizeInPixels : number, uRasterTileMarginInPixels : number);
            TilingOrigin : SMcVector2D;
            dLargestTileSizeInMapUnits : number;
            uNumLargestTilesX : number;
            uNumLargestTilesY : number;
            uTileSizeInPixels : number;
            uRasterTileMarginInPixels:number;
        }

        class SComponentParams {
            constructor();
            strName : string;
            eType : EComponentType;
            WorldLimit : SMcBox;
        }
        class SRawParams {
            constructor();
            pCoordinateSystem : IMcGridCoordinateSystem;
            pTilingScheme : IMcMapLayer.STilingScheme;
            fMaxScale : number;
            bResolveOverlapConflicts : boolean;
            bEnhanceBorderOverlap : boolean;
            TransparentColor : SMcBColor;
            byTransparentColorPrecision : number;
            pReadCallback : IReadCallback;
            strDirectory : string;
            aComponents : SComponentParams[];
            uMaxNumOpenFiles : number;
            fFirstPyramidResolution : number;
            auPyramidResolutions: Uint32Array;
            bIgnoreRasterPalette: boolean;
        }
        class SWebMapServiceParams {
            constructor();
            pCoordinateSystem : IMcGridCoordinateSystem;
            pTilingScheme : IMcMapLayer.STilingScheme;
            fMaxScale : number;
            bResolveOverlapConflicts : boolean;
            bEnhanceBorderOverlap : boolean;
            TransparentColor : SMcBColor;
            byTransparentColorPrecision : number;
            pReadCallback : IReadCallback;
            strServerURL : string;
            strOptionalUserAndPassword : string;
            bSkipSSLCertificateVerification : boolean;
            uTimeoutInSec : number;
            strLayersList : string;
            strStylesList : string;
            BoundingBox : SMcBox;
            strServerCoordinateSystem : string;
            strImageFormat : string;
            bTransparent : boolean;
            strZeroBlockHttpCodes : string;
            bZeroBlockOnServerException : boolean;
        }
        class SWMSParams {
            constructor();
            pCoordinateSystem : IMcGridCoordinateSystem;
            pTilingScheme : IMcMapLayer.STilingScheme;
            fMaxScale : number;
            bResolveOverlapConflicts : boolean;
            bEnhanceBorderOverlap : boolean;
            TransparentColor : SMcBColor;
            byTransparentColorPrecision : number;
            pReadCallback : IReadCallback;
            strServerURL : string;
            strOptionalUserAndPassword : string;
            bSkipSSLCertificateVerification : boolean;
            uTimeoutInSec : number;
            strLayersList : string;
            strStylesList : string;
            BoundingBox : SMcBox;
            strServerCoordinateSystem : string;
            strImageFormat : string;
            bTransparent : boolean;
            strZeroBlockHttpCodes : string;
            bZeroBlockOnServerException : boolean;
            strWMSVersion : string;
            uBlockWidth : number;	
            uBlockHeight : number;	
            fMinScale : number;	
        }
        class SWMTSParams {
            constructor();
            pCoordinateSystem : IMcGridCoordinateSystem;
            pTilingScheme : IMcMapLayer.STilingScheme;
            fMaxScale : number;
            bResolveOverlapConflicts : boolean;
            bEnhanceBorderOverlap : boolean;
            TransparentColor : SMcBColor;
            byTransparentColorPrecision : number;
            pReadCallback : IReadCallback;
            strServerURL : string;
            strOptionalUserAndPassword : string;
            bSkipSSLCertificateVerification : boolean;
            uTimeoutInSec : number;
            strLayersList : string;
            strStylesList : string;
            BoundingBox : SMcBox;
            strServerCoordinateSystem : string;
            strImageFormat : string;
            bTransparent : boolean;
            strZeroBlockHttpCodes : string;
            bZeroBlockOnServerException : boolean;
            strInfoFormat : string;
            bUseServerTilingScheme : boolean;
            bExtendBeyondDateLine : boolean;
            eCapabilitiesBoundingBoxAxesOrder : ECoordinateAxesOrder;
        }
        class SLayerTileKey {
            nLOD : number;
            uX : number;
            uY : number;
        }
        class SLayerLodParams {
            nLevelIndex : number;
            TileWorldSize : SMcVector2D;
            TileImagePixelSize : SMcSize;
            dTileImageResolution : number;
        }
        class SVectorItemFound {
            constructor();
            uVectorItemID : number;
            uVectorItemFirstPointIndex : number;
            uVectorItemLastPointIndex : number;
        }
    }

    interface IMcDtmMapLayer extends IMcMapLayer {
        /**
         * @param pTileGeometry      pTileGeometry.Value :     IMcDtmMapLayer.STileGeometry
         */
        GetTileGeometryByKey(TileKey : IMcMapLayer.SLayerTileKey, bBuildIfPossible : boolean, pTileGeometry : any);
    }

    namespace IMcDtmMapLayer {
        class STileGeometry {
            constructor();
            aPointsCoordinates : SMcFVector3D[];	
            aPointsNormals : SMcFVector3D[];		
            auConnectionIndices : Uint16Array;
            uNumSkirtPoints : number;
            uNumSkirtIndices : number;
            fMinHeight : number;
            fMaxHeight : number;
        }
    }

    interface IMcNativeDtmMapLayer extends IMcDtmMapLayer {}
    namespace IMcNativeDtmMapLayer {
        function Create(strDirectory : string, uNumLevelsToIgnore? : number, pReadCallback? : IMcMapLayer.IReadCallback, pLocalCacheLayerParams? : IMcMapLayer.SLocalCacheLayerParams) : IMcNativeDtmMapLayer;
        var LAYER_TYPE;
    }

    interface IMcNativeServerDtmMapLayer extends IMcDtmMapLayer {}
    namespace IMcNativeServerDtmMapLayer {
        function Create(strDirectory : string, pReadCallback? : IMcMapLayer.IReadCallback) : IMcNativeServerDtmMapLayer;
        var LAYER_TYPE;
    }

    interface IMcRawDtmMapLayer extends IMcDtmMapLayer {
        	GetDirectory() : string;
	        GetComponents() : IMcMapLayer.SComponentParams[];
            /**
             * @param pauPyramidResolutions           pauPyramidResolutions.Value :     Uint32Array
             * @param pfFirstPyramidResolution        pfFirstPyramidResolution.Value :  number
             */
	        GetResolutions(pauPyramidResolutions : any, pfFirstPyramidResolution : any);
    }
    namespace IMcRawDtmMapLayer {
        function Create(Params : IMcMapLayer.SRawParams, pLocalCacheLayerParams? : IMcMapLayer.SLocalCacheLayerParams) : IMcRawDtmMapLayer;
    }

    interface IMcWMSDtmMapLayer extends IMcDtmMapLayer {
        GetWMSParams() : IMcMapLayer.SWMSParams;
        GetWMTSParams() : IMcMapLayer.SWMTSParams;
    }
    namespace IMcWMSDtmMapLayer {
        function Create(Params : IMcMapLayer.SRawParams, pLocalCacheLayerParams? : IMcMapLayer.SLocalCacheLayerParams) : IMcWMSDtmMapLayer;
    }

    interface IMcRasterMapLayer extends IMcMapLayer {
        CalcHistogram(aHistogram : MC_HISTOGRAM[]);
        /**
         * @param peBitmapPixelFormat       peBitmapPixelFormat.Value :         IMcTexture.EPixelFormat
         * @param pbBitmapFromTopToBottom   pbBitmapFromTopToBottom.Value :     boolean
         * @param pBitmapSize               pBitmapSize.Value :                 SMcSize
         * @param pBitmapMargins            pBitmapMargins.Value :              SMcSize
         */
        GetTileBitmapByKey(TileKey : IMcMapLayer.SLayerTileKey, bDecompress : boolean,
		peBitmapPixelFormat : any, pbBitmapFromTopToBottom : boolean,
		pBitmapSize : any, pBitmapMargins : any) : Uint8Array;
    }

    interface IMcNativeRasterMapLayer extends IMcRasterMapLayer {}
    namespace IMcNativeRasterMapLayer {
        function Create(strDirectory :string, uFirstLowerQualityLevel? : number, bThereAreMissingFiles? : boolean,
            uNumLevelsToIgnore? : number, bEnhanceBorderOverlap? : boolean,
            pReadCallback? : IMcMapLayer.IReadCallback, pLocalCacheLayerParams? : IMcMapLayer.SLocalCacheLayerParams) : IMcNativeRasterMapLayer;
        var LAYER_TYPE : number;
    }

    interface IMcNativeServerRasterMapLayer extends IMcRasterMapLayer {}
    namespace IMcNativeServerRasterMapLayer {
        function Create(strLayerURL :string, pReadCallback? : IMcMapLayer.IReadCallback) : IMcNativeServerRasterMapLayer;
        var LAYER_TYPE : number;
    }

    interface IMcRawRasterMapLayer extends IMcRasterMapLayer {
        GetDirectory() : string;
        GetComponents() : IMcMapLayer.SComponentParams[];
         /**
         * @param pauPyramidResolutions           pauPyramidResolutions.Value :     Uint32Array
         * @param pfFirstPyramidResolution        pfFirstPyramidResolution.Value :  number
         */
        GetResolutions(pauPyramidResolutions : any, pfFirstPyramidResolution : any);
    }
    namespace IMcRawRasterMapLayer {
        function Create(Params : IMcMapLayer.SRawParams, bImageCoordinateSystem? : boolean, pLocalCacheLayerParams? : IMcMapLayer.SLocalCacheLayerParams) : IMcRawRasterMapLayer;
        var LAYER_TYPE : number;
    }

    interface IMcWMSRasterMapLayer extends IMcRasterMapLayer {}
    namespace IMcWMSRasterMapLayer {
        function Create(Params : IMcMapLayer.SWMSParams | IMcMapLayer.SWMTSParams, pLocalCacheLayerParams? : IMcMapLayer.SLocalCacheLayerParams) : IMcWMSRasterMapLayer;
        var LAYER_TYPE : number;
    }

    interface IMcCodeMapLayer extends IMcRasterMapLayer {
        SetColorTable(aCodeMapColors : IMcCodeMapLayer.SCodeMapData[]);
        GetColorTable() : IMcCodeMapLayer.SCodeMapData[];
    }
    namespace IMcCodeMapLayer {
        class SCodeMapData
        {
            uCode : number;
            CodeColor : SMcBColor;
        }
    }

    interface IMcTraversabilityMapLayer extends IMcCodeMapLayer {
        GetNumTraversabilityDirections() : number;
        GetTraversabilityFromColorCode(ColorCode : SMcBColor) : IMcTraversabilityMapLayer.STraversabilityDirection[];
    }
    namespace IMcTraversabilityMapLayer {
        class STraversabilityDirection
        {
            fDirectionAngle : number;
            bTraversable : boolean;
        }
    }

    interface IMcNativeTraversabilityMapLayer extends IMcTraversabilityMapLayer {}
    namespace IMcNativeTraversabilityMapLayer {
        function Create(strDirectory :string, bThereAreMissingFiles? : boolean, pReadCallback? : IMcMapLayer.IReadCallback, 
            pLocalCacheLayerParams? : IMcMapLayer.SLocalCacheLayerParams) : IMcNativeTraversabilityMapLayer;
        var LAYER_TYPE : number;
    }

    interface IMcNativeServerTraversabilityMapLayer extends IMcTraversabilityMapLayer {}
    namespace IMcNativeServerTraversabilityMapLayer {
        function Create(strLayerURL :string, pReadCallback? : IMcMapLayer.IReadCallback) : IMcNativeServerTraversabilityMapLayer;
        var LAYER_TYPE : number;
    }

    interface IMcStaticObjectsMapLayer extends IMcBase {
        SetDisplayingItemsAttachedToTerrain(bDisplaysItemsAttachedToTerrain : boolean, pMapViewport? : IMcMapViewport);
        SetDisplayingDtmVisualization(bDisplaysDtmVisualization : boolean, pMapViewport? : IMcMapViewport);
    }
   
    interface IMc3DModelMapLayer extends IMcStaticObjectsMapLayer {
	    SetResolutionFactor(fResolutionFactor : number, pMapViewport? : IMcMapViewport);
        SetResolvingConflictsWithDtmAndRaster(bResolvesConflictsWithDtmAndRaster : boolean, pMapViewport? : IMcMapViewport);
    }
    
    interface IMcNative3DModelMapLayer extends IMc3DModelMapLayer { }
    namespace IMcNative3DModelMapLayer {
        function Create(strDirectory : string, uNumLevelsToIgnore? : number, pReadCallback? : IMcMapLayer.IReadCallback) : IMcNative3DModelMapLayer;
        var LAYER_TYPE : number;
    }
    
    interface IMcNativeServer3DModelMapLayer extends IMc3DModelMapLayer { }
     namespace IMcNativeServer3DModelMapLayer {
        function Create(strLayerURL : string, pReadCallback? : IMcMapLayer.IReadCallback) : IMcNativeServer3DModelMapLayer;
        var LAYER_TYPE : number;
    }

    interface IMcRaw3DModelMapLayer extends IMc3DModelMapLayer { }
     namespace IMcRaw3DModelMapLayer {
        function Create(strIndexingDataDirectory : string, uNumLevelsToIgnore? : number, pReadCallback? : IMcMapLayer.IReadCallback) : IMcRaw3DModelMapLayer;
        var LAYER_TYPE : number;
    }

    interface IMcVector3DExtrusionMapLayer extends IMcStaticObjectsMapLayer {
	    GetObjectIDBitCount() : number;
        SetObjectsColors(aObjectsColors : IMcVector3DExtrusionMapLayer.SObjectColor[]);
        SetObjectsColor(Color : SMcBColor, auObjectsIDs : SMcVariantID[]);
        RemoveAllObjectsColors();
        GetObjectsColors() : SMcBColor[];
	    GetObjectColor(uObjectID : SMcVariantID) : SMcBColor; 
        IsExtrusionHeightChangeSupported() : boolean;
        SetObjectExtrusionHeight(uObjectID : SMcVariantID, fHeight : number);
        SetObjectsExtrusionHeights( aObjectsHeights : IMcVector3DExtrusionMapLayer.SObjectExtrusionHeight[]);
        RemoveAllObjectsExtrusionHeights();
        GetObjectExtrusionHeight(uObjectID : SMcVariantID) : number;
        GetObjectsExtrusionHeights() : IMcVector3DExtrusionMapLayer.SObjectExtrusionHeight[];
    }
    namespace IMcVector3DExtrusionMapLayer {
        class SObjectColor {
            constructor();
            uObjectID : SMcVariantID;
            Color :     SMcBColor;
        }
        class SObjectExtrusionHeight {
            constructor();
            uObjectID : SMcVariantID;
            fHeight :   number;
        }
    }
    
    interface IMcNativeVector3DExtrusionMapLayer extends IMcVector3DExtrusionMapLayer { }
    namespace IMcNativeVector3DExtrusionMapLayer {
        function Create(strDirectory : string, uNumLevelsToIgnore? : number, fExtrusionHeightMaxAddition? : number, pReadCallback? : IMcMapLayer.IReadCallback) : IMcNativeVector3DExtrusionMapLayer;
        var LAYER_TYPE : number;
    }

     interface IMcNativeServerVector3DExtrusionMapLayer extends IMcVector3DExtrusionMapLayer { }
    namespace IMcNativeServerVector3DExtrusionMapLayer {
        function Create(strLayerURL : string, pReadCallback? : IMcMapLayer.IReadCallback) : IMcNativeServerVector3DExtrusionMapLayer;
        var LAYER_TYPE : number;
    }

    interface IMcRawVector3DExtrusionMapLayer extends IMcVector3DExtrusionMapLayer { }
    namespace IMcRawVector3DExtrusionMapLayer {
        function Create(Params : IMcRawVector3DExtrusionMapLayer.SParams, fExtrusionHeightMaxAddition? : number,	pReadCallback? : IMcMapLayer.IReadCallback) : IMcRawVector3DExtrusionMapLayer;
        
        enum ETexturePlacementFlags {
            ETPF_NONE,
            ETPF_REPEAT_EDGE_PIXELS,
            ETPF_RESTART_EACH_FACE,
            ETPF_ALIGN_CENTER,
            ETPF_REVERSE_ALIGNMENT,
            ETPF_FIT
        }

        class SExtrusionTexture {
            constructor();
            strTexturePath : string;
            TextureScale : SMcFVector2D;
            uXPlacementBitField : number;
            uYPlacementBitField : number;

        }
        class SParams {
            constructor(_strDataSource? : string, _pSourceCoordSys? :  IMcGridCoordinateSystem);
            strDataSource : string;								
            pSourceCoordinateSystem : IMcGridCoordinateSystem;	
            pTargetCoordinateSystem : IMcGridCoordinateSystem;	
            pTilingScheme : IMcMapLayer.STilingScheme;
            RoofDefaultTexture : SExtrusionTexture;				
            SideDefaultTexture : SExtrusionTexture;				
            aSpecificTextures : SExtrusionTexture[];				
            strHeightColumn : string;
            strObjectIDColumn : string;
            strRoofTextureIndexColumn : string;
            strSideTextureIndexColumn : string;
            pClipRect : SMcBox;
		}
    }

    interface IMcVectorBasedMapLayer extends IMcMapLayer { }
   
    interface IMcVectorMapLayer extends IMcVectorBasedMapLayer {
        SetOverlayState(Arg2 : number | Uint8Array, pMapViewport? : IMcMapViewport);
        GetOverlayState(pMapViewport? : IMcMapViewport) : Uint8Array;
        SetOverlayDrawPriority(bEnabled : boolean, nPriority : number);
        /**
         * @param nPriority    nPriority.Value :   number
         */
        GetOverlayDrawPriority(nPriority : any) : boolean;
        SetDrawPriorityConsistency(bConsistency : boolean);
        GetDrawPriorityConsistency() : boolean;
        SetCollisionPrevention(bCollisionPrevention : boolean);
        GetCollisionPrevention() : boolean;
        SetBrightness(fBrightness : number, pMapViewport? : IMcMapViewport);
        GetBrightness(pMapViewport? : IMcMapViewport) : number;
        LockIO();
        UnLockIOAndRefresh();
        SetToleranceForPoint(nTolerance : number);
        GetToleranceForPoint() : number;
        SetFieldAsInt(nFieldId : number, nVectorItemId : number, nNewVal : number);
        SetFieldAsDouble(nFieldId : number, nVectorItemId : number, nNewVal : number);
        SetFieldAsString(nFieldId : number, nVectorItemId : number, strNewVal : string);
        DeleteVectorItem(nVectorItemId : number);
        AddVectorItem(pPointArr : SMcVector3D, nPointsNum : number, Geometry : EGeometry) : number;
        UpdateVectorItemGeometry(pNewPointArr : SMcVector3D, nPointsNum : number, eGeometry : EGeometry, uVectorItemId : number);
        SyncToDisc();
        GetNumFields() : number;
        /**
         * @param pstrName          pstrName.Value :      string
         * @param peFieldType       peFieldType.Value :   EFieldType
         */
        GetFieldData(nFieldId : number, pstrName : any, peFieldType : any);
        GetValidFieldsPerDataSource(uVectorItemID : number, strDataSourceName? : string, uDataSourceID? : number) : Uint32Array;
        GetGeometryType() : EGeometry;
        GetVectorItemsCount() : number;
        GetVectorItemPoints(nVectorItemId : number, pAsyncOperationCallback? : IMcMapLayer.IAsyncOperationCallback) : SMcVector3D[][];
        /**
         * @param paVectorItems                    paVectorItems.Value :                IMcMapLayer.SVectorItemFound[]
         * @param paUnifiedVectorItemsPoints       paUnifiedVectorItemsPoints.Value :   SMcVector3D[]
         * @param paUnifiedVectorItemsPoints       paUnifiedVectorItemsPoints.Value :   SMcVector3D[]
         */
        GetScanExtendedData(ScanGeometry : SMcScanGeometry, VectorTargetFound : IMcSpatialQueries.STargetFound, pMapViewport : IMcMapViewport, paVectorItems : any, paUnifiedVectorItemsPoints? : any, pAsyncOperationCallback? : IMcMapLayer.IAsyncOperationCallback);
        GetFieldUniqueValuesAsInt(nFieldId : number, pAsyncOperationCallback? : IMcMapLayer.IAsyncOperationCallback) : Int32Array;
        GetFieldUniqueValuesAsDouble(nFieldId : number, pAsyncOperationCallback? : IMcMapLayer.IAsyncOperationCallback) : Float64Array;
        GetFieldUniqueValuesAsString(nFieldId : number, pAsyncOperationCallback? : IMcMapLayer.IAsyncOperationCallback) : string[];
        GetFieldUniqueValuesAsWString(nFieldId : number, pAsyncOperationCallback? : IMcMapLayer.IAsyncOperationCallback) : string[]
        GetVectorItemFieldValueAsInt(nVectorItemId : number, nFieldId : number, pAsyncOperationCallback? : IMcMapLayer.IAsyncOperationCallback) : number;
        GetVectorItemFieldValueAsDouble(nVectorItemId : number, nFieldId : number, pAsyncOperationCallback? : IMcMapLayer.IAsyncOperationCallback) : number;
        GetVectorItemFieldValueAsString(nVectorItemId : number, nFieldId : number, pAsyncOperationCallback? : IMcMapLayer.IAsyncOperationCallback) : string;
        GetVectorItemFieldValueAsWString(nVectorItemId : number, nFieldId : number, pAsyncOperationCallback? : IMcMapLayer.IAsyncOperationCallback);
        Query(strAttributeFilter : string, pAsyncOperationCallback? : IMcMapLayer.IAsyncOperationCallback) : Float64Array;
        /**
         * @param pastrAttributesNames          array created by the user, allocated and filled by MapCore
         * @param pastrAttributesValues         array created by the user, allocated and filled by MapCore
         */
        GetLayerAttributes(pastrAttributesNames : string[], pastrAttributesValues? : string[]);
        /**
         * @param pastrDataSourcesNames         array created by the user, allocated and filled by MapCore
         * @param pauDataSourcesIDs             pauDataSourcesIDs.Value : Uint32Array;
         */
        GetLayerDataSources(pastrDataSourcesNames : string[], pauDataSourcesIDs? : any);
        /**
         * @param puOriginalID                  puOriginalID.Value : number;
         * @param pstrDataSourceName            pstrDataSourceName.Value : string;
         * @param puDataSourceID                puDataSourceID.Value : number;
         */
        VectorItemIDToOriginalID(uVectorItemID : number, puOriginalID : any, pstrDataSourceName? : any, puDataSourceID? : any);
        VectorItemIDFromOriginalID(uOriginalID : number, strDataSourceName? : string, uDataSourceID? : number): number;
        IsLiteVectorLayer() : boolean;
        /**
         * @param pfMinSizeFactor    pfMinSizeFactor.Value :   number
         * @param pfMaxSizeFactor    pfMaxSizeFactor.Value :   number
         */
        GetMinMaxSizeFactor(pfMinSizeFactor : any, pfMaxSizeFactor : any);
        GetExtendedGeometryDataSize() : number;
        LoadExtendedGeometryDataToMemory();
    }

    interface IMcNativeVectorMapLayer extends IMcVectorMapLayer {
        GetDirectory() : string;
    }
    namespace IMcNativeVectorMapLayer {
        function Create(strDirectory : string, pReadCallback? : IMcMapLayer.IReadCallback, pLocalCacheLayerParams? : IMcMapLayer.SLocalCacheLayerParams) : IMcNativeVectorMapLayer;
        var LAYER_TYPE : number;
    }
    
    interface IMcNativeServerVectorMapLayer extends IMcVectorMapLayer {}
    namespace IMcNativeServerVectorMapLayer {
        function Create(strDirectory : string, pReadCallback? : IMcMapLayer.IReadCallback) : IMcNativeServerVectorMapLayer;
        var LAYER_TYPE : number;
    }
    
    interface IMcRawVectorMapLayer extends IMcVectorMapLayer {
        IsRasterizedVectorLayer() : boolean;
    }
    namespace IMcRawVectorMapLayer {
        function Create(Params : IMcRawVectorMapLayer.SParams, pTargetCoordinateSystem? : IMcGridCoordinateSystem,
		    pTilingScheme? : IMcMapLayer.STilingScheme, pReadCallback? : IMcMapLayer.IReadCallback, 
            pLocalCacheLayerParams? : IMcMapLayer.SLocalCacheLayerParams) : IMcRawVectorMapLayer;
        var LAYER_TYPE : number;

        enum EAutoStylingType {
            EAST_NONE,
            EAST_INTERNAL,
            EAST_S52,
            EAST_CUSTOM
        }

        class SInternalStylingParams {
            constructor(_strOutputFolder? : string, _strOutputXMLFileName? : string, _eVersion? : IMcOverlayManager.ESavingVersionCompatibility, _fMaxScaleFactor? : number, 
                _pDefaultFont? : IMcFont, _fTextMaxScale? : number);
            strOutputFolder : string;
            strOutputXMLFileName : string;
            eVersion : IMcOverlayManager.ESavingVersionCompatibility;
            fMaxScaleFactor : number;
            pDefaultFont : IMcFont;
            fTextMaxScale: number;
        }

        class SParams {
            constructor(_strDataSource : string,
                _pSourceCoordinateSystem : IMcGridCoordinateSystem,
                _fMinScale? : number, _fMaxScale? : number,
                _strPointTextureFile? : string,
                _strLocaleStr? : string,
                _dSimplificationTolerance? : number,
                _pClipRect? : SMcBox,
                _pStylingParams?: IMcRawVectorMapLayer.SInternalStylingParams,
                _eAutoStylingType? : EAutoStylingType,
                _strCustomStylingFolder? : string);
            strDataSource : string;
            fMinScale : number;
            fMaxScale : number;
            strPointTextureFile : string;
            strLocaleStr : string;
            dSimplificationTolerance : number;
            pSourceCoordinateSystem : IMcGridCoordinateSystem;
            pClipRect : SMcBox;
            eAutoStylingType: EAutoStylingType;
            strCustomStylingFolder: string;
            pStylingParams: SInternalStylingParams;
            uMaxNumVerticesPerTile: number;
            uMaxNumVisiblePointObjectsPerTile: number;
            uMinPixelSizeForObjectVisibility : number;
            fOptimizationMinScale : number;
        }

        class SDataSourceSubLayerProperties {
            constructor();
            uLayerIndex : number;						
            strLayerName : string;			
            eGeometry : EGeometry;					
            eExtendedGeometry : EExtendedGeometry;	
            strMultiGeometriesSuffix : string;
            uNumVectorItems : number;					
        }

        class SDataSourceSubLayersProperties {
            constructor();
            aLayersProperties : MapCore.IMcRawVectorMapLayer.SDataSourceSubLayerProperties[];
        }

    }

    interface IMcGlobalMap {
        SetGlobalMapAutoCenterMode(bAutoCenter : boolean);
        GetGlobalMapAutoCenterMode() : boolean;
        RegisterLocalMap(pLocalMap : IMcMapViewport);
	    GetRegisteredLocalMaps() : IMcMapViewport[];
        UnRegisterLocalMap(pLocalMap : IMcMapViewport);
        SetActiveLocalMap(pLocalMap : IMcMapViewport);
        GetActiveLocalMap() : IMcMapViewport;
        SetLocalMapFootprintItem(pInactiveLine : IMcLineItem, pActiveLine : IMcLineItem);
        /**
         * @param pInactiveLinepdY    pInactiveLine.Value :   IMcLineItem
         * @param pActiveLine         pActiveLine.Value :     IMcLineItem
         */
        GetLocalMapFootprintItem(pInactiveLine : any, pActiveLine : any);
        /**
         * @param pbRenderNeeded    pbRenderNeeded.Value :   boolean
         * @param peCursorType      peCursorType.Value :     IMcGlobalMap.ECursorType
         */
        OnMouseEvent(eEvent : IMcGlobalMap.EMouseEvent, MousePosition : SMcPoint, pbRenderNeeded : any, peCursorType : any);
    }
    namespace IMcGlobalMap {
        enum EMouseEvent {
            EME_BUTTON_PRESSED, 
            EME_BUTTON_RELEASED, 
            EME_MOUSE_MOVED_BUTTON_DOWN, 
            EME_MOUSE_MOVED_BUTTON_UP
        }
        enum ECursorType {
            ECT_DEFAULT_CURSOR, 
            ECT_DRAG_CURSOR, 
            ECT_RESIZE_CURSOR
        }
    }

    interface IMcHeatMapLayer extends IMcMapLayer {
        /**
         * @param pdMin        pdMin.Value :     number
         * @param pdMax        pdMax.Value :     number
         */
        GetMinMaxValues(fScale : number, pdMin : any, pdMax : any)
        SetColorTable(aColors : SMcBColor[]);
        GetColorTable() : SMcBColor[];
    }

    interface IMcNativeHeatMapLayer extends IMcHeatMapLayer {}
    namespace IMcNativeHeatMapLayer {
        function Create(strDirectory : string, uFirstLowerQualityLevel? : number, bThereAreMissingFiles? : boolean, uNumLevelsToIgnore? : number, 
            pReadCallback? : IMcMapLayer.IReadCallback, bEnhanceBorderOverlap? : boolean, pLocalCacheLayerParams? : IMcMapLayer.SLocalCacheLayerParams) : IMcNativeHeatMapLayer;
        var LAYER_TYPE;
    }

    interface IMcHeatMapViewport extends IMcMapViewport {
        UpdateHeatMapPoints(bRemoveAllPrevPoints : boolean, aPoints : IMcHeatMapViewport.SHeatMapPoint[], eItemType : boolean,  uItemInfluenceRadius : number, bIsRadiusInPixels : boolean);
        GetHeatMapPixelNormalizedValue(WorldPos : SMcVector3D) : number;
        GetHeatMapPixelSumValue(WorldPos : SMcVector3D) : number;
        GetHeatMapPixelCountValue(WorldPos : SMcVector3D) : number;
        GetHeatMapNormalizedBuffer() : Uint8Array;
        GetHeatMapSumBuffer() : Float32Array;
        GetHeatMapCountBuffer() : Float32Array;
        /**
         * @param pdMinValue        pdMinValue.Value :     number
         * @param pdMaxValue        pdMaxValue.Value :     number
         */
        GetHeatMapUnNormalizedMinMaxValue(pdMinValue : any, pdMaxValue : any);
        IsHeatMapAverageCalculatedPerPoint() : boolean;
        IsHeatMapPictureShown() : boolean;
        SetHeatMapMinThresholdValues(dMinValThreshold : number, dMinValToUse : number);
        /**
         * @param pdMinValThreshold        pdMinValThreshold.Value :     number
         * @param pdMinValToUse            pdMinValToUse.Value :         number
         */
        GetHeatMapMinThresholdValues(pdMinValThreshold : any, pdMinValToUse : any);
        SetHeatMapMaxThresholdValues(dMaxValThreshold : number, dMaxValToUse : number);
         /**
         * @param pdMaxValThreshold        pdMaxValThreshold.Value :     number
         * @param pdMaxValToUse            pdMaxValToUse.Value :         number
         */
        GetHeatMapMaxThresholdValues(pdMaxValThreshold : any, pdMaxValToUse : any);
        SetHeatMapDrawPriority(nDrawPriority : number);
        GetHeatMapDrawPriority() : number;
        SetHeatMapTransparency(byTransparency : number);
        GetHeatMapTransparency() : number;
        SetHeatMapVisibility(bVisible : boolean);
        GetHeatMapVisibility() : boolean;
    }
    namespace IMcHeatMapViewport {  
        /**
         * @param pCamera        pCamera.Value :     IMcMapCamera
         */
        function CreateHeatMap(pCamera, CreateData : IMcMapViewport.SCreateData,
		apTerrains : IMcMapTerrain[], bCalcAveragePerPoint : boolean, bShowHeatMapPicture : boolean) : IMcHeatMapViewport;

        class SHeatMapPoint {
            constructor();
            aLocations : SMcVector2D[];
            uIntensity : number;
        }
    } 
    interface IMcMapGrid extends IMcBase {
        SetGridRegions(aGridRegions : IMcMapGrid.SGridRegion[]);
        GetGridRegions() : IMcMapGrid.SGridRegion[];
	    SetScaleSteps(aScaleSteps : IMcMapGrid.SScaleStep[]);
	    GetScaleSteps() : IMcMapGrid.SScaleStep[];
    }
    namespace IMcMapGrid {
        function Create(aGridRegions : IMcMapGrid.SGridRegion[], aScaleSteps : IMcMapGrid.SScaleStep[]);

        enum EAngleFormat {
            EAF_DECIMAL_DEG,
            EAF_DEG_MIN_SEC,
            EAF_DEG_MIN
        }
        class SGridRegion {
            constructor();
            pCoordinateSystem : IMcGridCoordinateSystem;
            GeoLimit : SMcBox;
            pGridLine : IMcLineItem;
            pGridText : IMcTextItem;
            uFirstScaleStepIndex : number;
            uLastScaleStepIndex : number;
        }
        class SScaleStep {
            constructor();
            fMaxScale : number;
            NextLineGap : SMcVector2D;
            uNumOfLinesBetweenDifferentTextX : number;
            uNumOfLinesBetweenDifferentTextY : number;
            uNumOfLinesBetweenSameTextX : number;
            uNumOfLinesBetweenSameTextY : number;
            uNumMetricDigitsToTruncate : number;
            eAngleValuesFormat : EAngleFormat;
        }
    }

    interface IMcMapHeightLines extends IMcBase {
        	SetScaleSteps( aScaleSteps : IMcMapHeightLines.SScaleStep[]);
            GetScaleSteps() : IMcMapHeightLines.SScaleStep[];
            SetColorInterpolationMode(bEnabled : boolean, fMinHeight? : number, fMaxHeight? : number);
            /**
             * @param pfMinHeight        pfMinHeight.Value :     number
             * @param pfMaxHeight        pfMaxHeight.Value :     number
             */
            GetColorInterpolationMode(pbEnabled : boolean, pfMinHeight? : number, pfMaxHeight? : number);
            SetLineWidth(fWidth : number);
	        GetLineWidth() : number;
    }
    namespace IMcMapHeightLines {
        function Create(aScaleSteps : IMcMapHeightLines.SScaleStep, fLineWidth? : number) : IMcMapHeightLines;

        class SScaleStep {
            constructor();
            fMaxScale : number;
            fLineHeightGap : SMcBColor;
            aColors : SMcBColor[];
        }
    }

    interface IMcMapWaterElement extends IMcBase {
        SetGeometricParams(aBoundingPolygonPoints : SMcVector3D[], dAbsoluteHeight : number);
        /**
        * @param paBoundingPolygonPoints       array created by the user, allocated and filled by MapCore
        * @param pdAbsoluteHeight              pdAbsoluteHeight.Value : number
        */
        GetGeometricParams(paBoundingPolygonPoints : SMcVector3D[], pdAbsoluteHeight : any);
        SetPhysicalParams(PhysicalParams : IMcMapWaterElement.SPhysicalParams);
        GetPhysicalParams() : IMcMapWaterElement.SPhysicalParams;
    }    
    namespace IMcMapWaterElement {
        function Create(strConfigFile : string, aBoundingPolygonPoints : SMcVector3D[]) : IMcMapWaterElement;

        class SPhysicalParams {
            constructor();
            dWaveStrength : number;
            uWaveComplexity : number;
        }
    }

    interface IMcSectionMapViewport extends IMcMapViewport {
        SetSectionRoutePoints(aSectionRoutePoints : SMcVector3D[], aSectionHeightPoints? : SMcVector3D[]);
        /**
        * @param aSectionRoutePoints       array created by the user, allocated and filled by MapCore
        * @param aSectionHeightPoints      array created by the user, allocated and filled by MapCore
        */
        GetSectionRoutePoints(aSectionRoutePoints : SMcVector3D[], aSectionHeightPoints? : SMcVector3D[]);
        SetAxesRatio(fYXRatio : number);
        GetAxesRatio() : number;
        SetSectionPolygonItem(pPolygonItem : IMcPolygonItem);
        GetSectionPolygonItem() : IMcPolygonItem;
        SectionToWorld(SectionPoint : SMcVector3D) : SMcVector3D;
        WorldToSection(WorldPoint : SMcVector3D) : number;
        /**
         * @param pdY            pdY.Value :         number
         * @param pdSlope        pdSlope.Value :     number
         */
        GetSectionHeightAtPoint(dX : number, pdY : any, pdSlope? : any);
        /**
         * @param pdMinY         pdMinY.Value :         number
         * @param pdMaxY         pdMaxY.Value :         number
         */
        GetHeightLimits(dMinX : number, dMaxX : number, pdMinY : any, pdMaxY : any);
    }
    namespace IMcSectionMapViewport {
        function CreateSection(pCamera : IMcMapCamera, CreateData : IMcMapViewport.SCreateData,
            apTerrains : IMcMapTerrain[], aSectionRoutePoints : SMcVector3D[], aSectionHeightPoints? : SMcVector3D[]) : IMcSectionMapViewport;
    }

    interface IMcMapTerrain extends IMcBase {
        SetCoordinateSystem(pCoordinateSystem : IMcGridCoordinateSystem);
        GetCoordinateSystem() : IMcGridCoordinateSystem;
        GetBoundingBox() : SMcBox;
        SetVisibility(bVisibility : boolean,pMapViewport? :  IMcMapViewport);
        GetVisibility(pMapViewport? : IMcMapViewport) : boolean;
        SetID(uID : number);
        GetID() : number;
        SetUserData(pUserData : IMcUserData);
        GetUserData() : IMcUserData;
        AddLayer(pLayer : IMcMapLayer);
        RemoveLayer(pLayer : IMcMapLayer);
        SetLayerParams(pLayer : IMcMapLayer, Params : IMcMapTerrain.SLayerParams);
        GetLayerParams(pLayer : IMcMapLayer) : IMcMapTerrain.SLayerParams;
        GetLayerByID(uID : number) : IMcMapLayer;
        GetLayers() : IMcMapLayer[];
        GetDtmLayer() : IMcDtmMapLayer;
        Save(strBaseDirectory? : string, bSaveUserData? : boolean) : Uint8Array;
        LoadFromFile(strFileName : string, strBaseDirectory? : string,pUserDataFactory? : IMcUserDataFactory) : IMcMapTerrain;
        Load(abMemoryBuffer : Uint8Array, strBaseDirectory? : string,pUserDataFactory? : IMcUserDataFactory) : IMcMapTerrain;
    }
    namespace IMcMapTerrain {
        function Create(pCoordinateSystem : IMcGridCoordinateSystem, apLayers : IMcMapLayer[], pBoundingRect? : SMcBox) : IMcMapTerrain;
        function LoadFromFile(strFileName : string, strBaseDirectory? : string,pUserDataFactory? : IMcUserDataFactory) : IMcMapTerrain;
        function Load(abMemoryBuffer : Uint8Array, strBaseDirectory? : string,pUserDataFactory? : IMcUserDataFactory) : IMcMapTerrain;
        class SLayerParams {
            constructor();
            constructor(fMinScale : number, fMaxScale : number, nDrawPriority : number, byTransparency : number, bVisibility : boolean, bNearestPixelMagFilter? : boolean);
            fMinScale : number;
            fMaxScale : number;
            nDrawPriority : number;
            byTransparency : number;
            bVisibility : boolean;
            bNearestPixelMagFilter: boolean;
        }
    }

    interface IMcMapDevice extends IMcBase {}
    namespace IMcMapDevice {
        function Create(params : IMcMapDevice.SInitParams) : IMcMapDevice;
        function GetVersion() : string;
        function PerformPendingCalculations(uTimeout? : number) : boolean;
        function LoadResourceGroup(strGroupName : string, astrResourceLocations : string[], eResourceLocationType? : IMcMapDevice.EResourceLocationType);
        function UnloadResourceGroup(strGroupName : string);
        function LoadFilesListAsync(strFilesServerURL : string, strFilesListPath : string, pCallback : IMcMapDevice.ICallback);
        function UnloadFilesListSync(strFilesListPath : string);
        function LoadSingleFileAsync(strFilesServerURL : string, strFilePath : string, pCallback : IMcMapDevice.ICallback);
        function UnloadSingleFileSync(strFilePath : string);
        function GetMaxMemoryUsage() : number;
        function GetHeapSize() : number;
        function MapNodeJsDirectory(strPhysicalDirectory : string, strVirtualDirectory : string);
        function UnMapNodeJsDirectory(strVirtualDirectory : string);
        function CreateFileSystemDirectory(strDirectory : string);
        function DeleteFileSystemEmptyDirectory(strDirectory : string);
        function CreateFileSystemFile(strFileFullName, FileContents : Uint8Array | string);
        function DeleteFileSystemFile(strFileFullName);

        enum ETerrainObjectsQuality {
            ETOQ_HIGH,
            ETOQ_MEDIUM,
            ETOQ_LOW,
            ETOQ_EXTRA_LOW
        }
        enum ELoggingLevel {
            ELL_NONE,
            ELL_LOW,
            ELL_MEDIUM,
            ELL_HIGH
        }
        enum EAntiAliasingLevel {
            EAAL_NONE,
            EAAL_1,
            EAAL_2,
            EAAL_3,
            EAAL_4,
            EAAL_5,
            EAAL_6,
            EAAL_7,
            EAAL_8,
            EAAL_8_QUALITY,
            EAAL_9,
            EAAL_9_QUALITY,
            EAAL_10,
            EAAL_10_QUALITY,
            EAAL_11,
            EAAL_11_QUALITY,
            EAAL_12,
            EAAL_12_QUALITY,
            EAAL_13,
            EAAL_13_QUALITY,
            EAAL_14,
            EAAL_14_QUALITY,
            EAAL_15,
            EAAL_15_QUALITY,
            EAAL_16,
            EAAL_16_QUALITY
        }
        enum EStaticObjectsVisibilityQueryPrecision {
            ESOVQP_HIGH,
            ESOVQP_MEDIUM,
            ESOVQP_LOW,
            ESOVQP_EXTRA_LOW
        }
        enum EResourceLocationType {
            ERLT_FOLDER, 
            ERLT_FOLDER_RECURSIVE, 
            ERLT_ZIP_FILE, 
            ERLT_ZIP_FILE_RECURSIVE
        }
        enum ERenderingSystem {
            ERS_AUTO_SELECT, 
            ERS_NONE
        }
        class SInitParams {
            constructor();
            uNumBackgroundThreads : number;
            eLoggingLevel : IMcMapDevice.ELoggingLevel;
            strConfigFilesDirectory : string;
			strPrefixForPathsInResourceFile : string;
            eViewportAntiAliasingLevel : IMcMapDevice.EAntiAliasingLevel;
            eTerrainObjectsAntiAliasingLevel : IMcMapDevice.EAntiAliasingLevel;
            eTerrainObjectsQuality : IMcMapDevice.ETerrainObjectsQuality;
            eStaticObjectsVisibilityQueryPrecision : IMcMapDevice.EStaticObjectsVisibilityQueryPrecision;
            uDtmVisualizationPrecision : number;
            fObjectsBatchGrowthRatio : number;
            uObjectsTexturesAtlasSize : number;
            bObjectsTexturesAtlas16bit : boolean;
            bDisableDepthBuffer : boolean;
            eRenderingSystem : IMcMapDevice.ERenderingSystem;
            bIgnoreRasterLayerMipmaps : boolean;
            bFullScreen : boolean;
            uNumTerrainTileRenderTargets : number;
            bPreferUseTerrainTileRenderTargets : boolean; 
            uObjectsBatchInitialNumVertices : number;
            uObjectsBatchInitialNumIndices : number; 
            bEnableObjectsBatchEnlarging : boolean; 
            bAlignScreenSizeObjects : boolean;
        }
        interface ICallback { 
            /** Mandatory */
            OnFilesLoaded(bFilesListSuccess : boolean, bFilesSuccess : boolean);
        }
        namespace ICallback {
            function extend(strName : string, Class : any) : ICallback;
        }
    }

    interface IMcMapEnvironment extends IMcBase {
            EnableComponents(uComponentsBitField : number);
	        DisableComponents(uComponentsBitField : number);
            GetEnabledComponents() : number;
	        ShowComponents(uComponentsBitField : number);
            HideComponents(uComponentsBitField : number);
            GetVisibleComponents() : number;
            SetSkyParams(eType : IMcMapEnvironment.ESkyType, strMaterial? : string,	BackgroundColor? : SMcFColor);
            /**
            * @param peType             peType.Value            :  IMcMapEnvironment.ESkyType
            * @param pstrMaterial       pstrMaterial.Value      :  string
            * @param pBackgroundColor   pBackgroundColor.Value  :  SMcFColor
            */
            GetSkyParams(peType : any, pstrMaterial : any, pBackgroundColor : any);
            SetSunParams(eType : IMcMapEnvironment.ESunType);
            GetSunParams() : IMcMapEnvironment.ESunType;
            SetFogParams(eType : IMcMapEnvironment.EFogType, Color? : SMcFColor, fExpDensity? : number,fLinearStart? : number,fLinearEnd? : number);
            /**
            * @param peType             peType.Value        :  IMcMapEnvironment.EFogType
            * @param pColor             pColor.Value        :  SMcFColor
            * @param pfExpDensity       pfExpDensity.Value  :  number
            * @param pfLinearStart      pfLinearStart.Value :  number
            * @param pfLinearEnd        pfLinearEnd.Value   :  number
            */
            GetFogParams(peType : any,pColor : any,	pfExpDensity : any,pfLinearStart : any, pfLinearEnd : any);
            SetCloudsParams(fCloudCover? : any, CloudSpeed? : SMcFVector2D);
            /**
            * @param pfCloudCover       pfCloudCover.Value  :  number
            * @param pCloudSpeed        pCloudSpeed.Value   :  SMcFVector2D
            */
	        GetCloudsParams(pfCloudCover : any, pCloudSpeed : any);
            SetRainParams(fRainSpeed? : number, RainDirection? : SMcFVector3D, fRainAngleDegrees? :any, fRainIntensity? : number);
            /**
            * @param pfRainSpeed           pfRainSpeed.Value  :           number
            * @param pRainDirection        pRainDirection.Value   :       SMcFVector2D
            * @param pfRainAngleDegrees    pfRainAngleDegrees.Value   :   SMcFVector2D
            * @param pfRainIntensity       pfRainIntensity.Value   :      SMcFVector2D
            */
            GetRainParams(pfRainSpeed : any, pRainDirection : any, pfRainAngleDegrees : any, pfRainIntensity : any);
	        SetSnowParams(fSnowSpeed? : number, SnowDirection? : SMcFVector3D, fSnowAngleDegrees? : number, fSnowIntensity? : number);
            /**
            * @param pfSnowSpeed           pfSnowSpeed.Value  :           number
            * @param pSnowDirection        pSnowDirection.Value   :       SMcFVector3D
            * @param pfSnowAngleDegrees    pfSnowAngleDegrees.Value   :   number
            * @param pfSnowIntensity       pfSnowIntensity.Value   :      number
            */
            GetSnowParams(pfSnowSpeed : any, pSnowDirection : any, pfSnowAngleDegrees : any, pfSnowIntensity : any);
            SetDefaultAmbientLight(Color? : SMcFColor);
            GetDefaultAmbientLight() : SMcFColor;
            SetAbsoluteTime(Time : Date);
            GetAbsoluteTime() : Date;
            IncrementTime(nSeconds : number);
            SetTimeAutoUpdate(bEnabled : boolean);
            GetTimeAutoUpdate() : boolean;
	        SetTimeAutoUpdateFactor(fFactor :number);
            GetTimeAutoUpdateFactor() : number;
    }
    namespace IMcMapEnvironment {
        function Create(pViewport : IMcMapViewport) : IMcMapEnvironment;
        enum EComponentType {
            ECT_SKY, 
            ECT_STARS, 
            ECT_SUN, 
            ECT_FOG, 
            ECT_CLOUDS,
            ECT_RAIN, 
            ECT_SNOW, 
            ECT_NONE, 
            ECT_ALL
        }
        enum ESkyType {
            EST_BACKGROUND, 
            EST_SKYBOX, 
            EST_SKYDOME, 
            EST_ANIMATED_SKY
        }
        enum ESunType {
            EST_LENS_FLARE, 
            EST_ANIMATED_SUN
        }
        enum EFogType {
            EFT_LINEAR, 
            EFT_EXPONENTIAL, 
            EFT_EXPONENTIAL_SQUARED, 
            EFT_ADVANCED_FOG
        }
    }

interface IMcPathFinder extends IMcDestroyable {
	UpdateTables();
    /**
     * @param paLocationPoints          array created by the user, allocated and filled by MapCore
     * @param aEdgeIds                  aEdgeIds.Value : Uint32Array
     */
    FindShortestPath(SourcePoint : SMcVector3D, TargetPoint : SMcVector3D, strCostField : string, strReverseCostField : string, bConsiderObstacles : boolean, paLocationPoints : SMcVector3D[], aEdgeIds : any);
}
namespace IMcPathFinder {
    function Create(strVectorData : string, strTableName : string, strObstaclesTables : string[], uPointTolerance : number,	strCostFields : string[]) : IMcPathFinder;
}
    
/////////////////////////////////////////////////////////////////////////////
// Overlay Management

    interface IMcFont extends IMcBase {
        	GetIsStaticFont() : boolean;
	        GetCharactersRanges() : IMcFont.SCharactersRange[];
	        GetMaxNumCharsInDynamicAtlas() : number;
            GetTextOutlineWidth() : number;
	        IsCreatedWithUseExisting() : boolean;
        	GetEffectiveCharacterSpacing() : number;
	        GetEffectiveNumAntialiasingAlphaLevels() : number;
    }
    namespace IMcFont {
        function SetCharacterSpacing(uSpacing : number);
        function GetCharacterSpacing() : number;
	    function SetNumAntialiasingAlphaLevels(uNumAlphaLevels : number);
	    function GetNumAntialiasingAlphaLevels() : number;

        class SCharactersRange {
            nFrom : number;
            nTo : number;
        }
    }

    interface IMcLogFont extends IMcFont {
        	SetLogFont(LogFont : SMcVariantLogFont);
	        GetLogFont() : SMcVariantLogFont;
    }
    namespace IMcLogFont {
        function SetLogFontToTtfFileMap(aLogFonts : IMcLogFont.SLogFontToTtfFile);
        function GetLogFontToTtfFileMap() : IMcLogFont.SLogFontToTtfFile;
        /**
         * @param pbExistingUsed       pbExistingUsed.Value  :  boolean
         */
        function Create(LogFont : SMcVariantLogFont, bStaticFont? : boolean, aCharactersRanges? : IMcFont.SCharactersRange[],
            uMaxNumCharsInDynamicAtlas? : number, bUseExisting? : boolean, pbExistingUsed? : any, uTextOutlineWidth? : number) : IMcLogFont;
	
        class SLogFontToTtfFile {
            constructor();
            LogFont : SMcVariantLogFont;
            strTtfFileFullPathName : string;
        }
    }

    interface IMcFileFont extends IMcFont {
        	SetFontFileAndHeight(FontFile : SMcFileSource, nFontHeight : number);
 	        GetFontFileAndHeight(pFontFile : SMcFileSource, pnFontHeight : number);
    }
    namespace IMcFileFont {
        /**
         * @param pbExistingUsed       pbExistingUsed.Value  :  boolean
         */
        function Create(FontFile : SMcFileSource, nFontHeight : number, bStaticFont? : boolean,	aCharactersRanges? : IMcFont.SCharactersRange[],
            uMaxNumCharsInDynamicAtlas? : number, bUseExisting? : boolean, pbExistingUsed? : any, uTextOutlineWidth? : number) : IMcFileFont;
    }

    interface IMcTexture extends IMcBase {
        GetTextureType() : number;
        GetPixelFormatByteCount(ePixelFormat : IMcTexture.EPixelFormat) : number;
        /**
         * @param puWidth       puWidth.Value  :  number
         * @param puHeight      puHeight.Value :  number
         */
        GetSize(puWidth : any, puHeight : any);
        /**
         * @param puWidth       puWidth.Value  :  number
         * @param puHeight      puHeight.Value :  number
         */
        GetSourceSize(puWidth : any, puHeight : any)
        /**
         * @param pTransparentColor       pTransparentColor.Value  :  SMcBColor
         */
        GetTransparentColor(pTransparentColor : any) : boolean;
        /**
         * @param pColorToSubstitute    pColorToSubstitute.Value  :  SMcBColor
         * @param pSubstituteColor      pSubstituteColor.Value :     SMcBColor
         */
        GetSubstituteColors(pColorToSubstitute : any, pSubstituteColor : any) : boolean;
        IsFillPattern() : boolean;
        IsTransparentMarginIgnored() : boolean;
        IsCreatedWithUseExisting() : boolean;
        GetName() : string;
    }
    namespace IMcTexture {
        enum EPixelFormat {
            EPF_UNKNOWN,
            EPF_L8,
            EPF_L16,
            EPF_A8,
            EPF_BYTE_LA,
            EPF_R5G6B5,
            EPF_B5G6R5,
            EPF_A4R4G4B4,
            EPF_A1R5G5B5,
            EPF_R8G8B8,
            EPF_B8G8R8,
            EPF_A8R8G8B8,
            EPF_A8B8G8R8,
            EPF_B8G8R8A8,
            EPF_A2R10G10B10,
            EPF_A2B10G10R10,
            EPF_DXT1,
            EPF_DXT2,
            EPF_DXT3,
            EPF_DXT4,
            EPF_DXT5,
            EPF_FLOAT16_RGB,
            EPF_FLOAT16_RGBA,
            EPF_FLOAT32_RGB,
            EPF_FLOAT32_RGBA,
            EPF_X8R8G8B8,
            EPF_X8B8G8R8,
            EPF_R8G8B8A8,
            EPF_DEPTH,
            EPF_SHORT_RGBA,
            EPF_R3G3B2,
            EPF_FLOAT16_R,
            EPF_FLOAT32_R,
            EPF_SHORT_GR,
            EPF_FLOAT16_GR,
            EPF_FLOAT32_GR,
            EPF_SHORT_RGB,
            EPF_COUNT
        }
        enum EUsage {
            EU_STATIC, 
            EU_STATIC_WRITE_ONLY, 
            EU_STATIC_WRITE_ONLY_IN_ATLAS, 
            EU_DYNAMIC, 
            EU_DYNAMIC_WRITE_ONLY, 
            EU_DYNAMIC_WRITE_ONLY_DISCARDABLE, 
            EU_RENDERTARGET
        }
    }

    interface IMcMemoryBufferTexture extends IMcTexture {
        UpdateFromMemoryBuffer(uBufferWidth : number, uBufferHeight : number, 
		    eBufferPixelFormat : IMcTexture.EPixelFormat, uBufferRowPitch : number, pBuffer : Uint8Array);
        GetToMemoryBuffer(uBufferWidth : number, uBufferHeight : number, eBufferPixelFormat : IMcTexture.EPixelFormat, uBufferRowPitch : number) :Uint8Array;
        GetPixelFormat() : IMcTexture.EPixelFormat;
        GetSourcePixelFormat() : IMcTexture.EPixelFormat;
    }
    namespace IMcMemoryBufferTexture {
        function Create(uWidth : number, uHeight : number, ePixelFormat? : IMcTexture.EPixelFormat,
		    eUsage? : IMcTexture.EUsage, bAutoMipmap? : boolean, pBuffer? : Uint8Array,
		    uBufferRowPitch? : number, strUniqueName? : string);
            var TEXTURE_TYPE;
    }

    interface IMcImageFileTexture extends IMcTexture {
        SetImageFile(ImageSource : SMcFileSource, pTransparentColor? : SMcBColor, 
		    pColorToSubstitute? : SMcBColor, pSubstituteColor? : SMcBColor);
        GetImageFile() : SMcFileSource;
    }
    namespace IMcImageFileTexture {
        /**
         * @param pbExistingUsed       pbExistingUsed.Value : boolean
         */
        function Create(ImageSource : SMcFileSource, bFillPattern : boolean, bIgnoreTransparentMargin? : boolean, 
		    pTransparentColor? : SMcBColor, pColorToSubstitute? : SMcBColor, pSubstituteColor? : SMcBColor, bUseExisting? : boolean, pbExistingUsed? : any);
            var TEXTURE_TYPE;
    }

    interface IMcIconHandleTexture extends IMcTexture {
        SetIcon(hIcon : HTMLImageElement, pTransparentColor? : SMcBColor, pColorToSubstitute? : SMcBColor, pSubstituteColor? : SMcBColor, bTakeOwnership? : boolean);
        GetIcon() : HTMLImageElement;
    }
     namespace IMcIconHandleTexture {
         /**
         * @param pbExistingUsed       pbExistingUsed.Value : boolean
         */
        function Create(hIcon : HTMLImageElement, bFillPattern : boolean, bIgnoreTransparentMargin? : boolean, pTransparentColor? : SMcBColor, 
            pColorToSubstitute? : SMcBColor, pSubstituteColor? : SMcBColor, bTakeOwnership? : boolean, bUseExisting? : boolean, pbExistingUsed? : any) : IMcIconHandleTexture;
            var TEXTURE_TYPE;
     }

     interface IMcBitmapHandleTexture extends IMcTexture {
        SetBitmap(hBitmap : HTMLCanvasElement | HTMLImageElement, pTransparentColor? : SMcBColor, pColorToSubstitute? : SMcBColor, pSubstituteColor? : SMcBColor, bTakeOwnership? : boolean);
        GetBitmap() : HTMLCanvasElement | HTMLImageElement;
     }
      namespace IMcBitmapHandleTexture {
         /**
         * @param pbExistingUsed       pbExistingUsed.Value : boolean
         */
        function Create(hBitmap : HTMLCanvasElement | HTMLImageElement, bFillPattern : boolean, bIgnoreTransparentMargin? : boolean, pTransparentColor? : SMcBColor, 
            pColorToSubstitute? : SMcBColor, pSubstituteColor? : SMcBColor, bTakeOwnership? : boolean, bUseExisting? : boolean, pbExistingUsed? : any) : IMcBitmapHandleTexture;
            var TEXTURE_TYPE;
     }

     interface IMcVideoTexture extends IMcTexture {
        SetState(eState : IMcVideoTexture.EState);
        GetState() : IMcVideoTexture.EState;
        SetFrameRateForRenderBasedUpdate(fFramesPerSecond : number);
        GetFrameRateForRenderBasedUpdate() : number;
        SetManualUpdateMethod(bManual : boolean);
        GetManualUpdateMethod() : boolean;
        UpdateFrame();
        GetToMemoryBuffer(uBufferWidth : number, uBufferHeight : number, eBufferPixelFormat : IMcTexture.EPixelFormat,  uBufferRowPitch : number) : Uint8Array;
         /**
         * @param puBufferWidth       puBufferWidth.Value : number
         * @param puBufferHeight      puBufferHeight.Value : number
         * @param peBufferPixelFormat peBufferPixelFormat.Value : IMcTexture.EPixelFormat
         * @param puBufferRowPitch    puBufferRowPitch.Value : number
         */
        GetCurrFrameBuffer(puBufferWidth : any, puBufferHeight : any, peBufferPixelFormat : any, puBufferRowPitch : any) : Uint8Array;
    }

    namespace IMcVideoTexture {
        enum EState {
            ES_STOPPED,
            ES_RUNNING,
            ES_PAUSED
        }
    }

     interface IMcHtmlVideoTexture extends IMcVideoTexture {
        GetSourceName() : string;
     }
      namespace IMcHtmlVideoTexture {
        function Create(strSourceName : string, bPlayInLoop? : boolean, bReadable? : boolean, bWithSound? : boolean) : IMcHtmlVideoTexture;
            var TEXTURE_TYPE;
     }

     interface IMcTextureArray extends IMcTexture {
        GetTextures() : IMcTexture[];
     }
      namespace IMcTextureArray {
        function Create(apTextures : IMcTexture[]) : IMcTextureArray;
            var TEXTURE_TYPE;
     }

    interface IMcSightPresentationItemParams {
        	ReleaseSightPresentationParameters();
            SetSightPresentationType(eSightPresentationType : IMcSightPresentationItemParams.ESightPresentationType, uPropertyID? : number, uObjectStateToServe? : number);
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetSightPresentationType(puPropertyID? : any, uObjectStateToServe? : number) : IMcSightPresentationItemParams.ESightPresentationType;
            SetSightObserverPosition(ObserverPosition : SMcVector2D, uPropertyID? : number, uObjectStateToServe? : number);
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetSightObserverPosition(puPropertyID? : any, uObjectStateToServe? : number) : SMcVector2D;
            SetSightObserverHeight(fObserverHeight : number, uPropertyID? : number, uObjectStateToServe? : number);
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetSightObserverHeight(puPropertyID? : any, uObjectStateToServe? : number) : number;
            SetIsSightObserverHeightAbsolute(bIsSightObserverHeightAbsolute : boolean, uPropertyID? : number, uObjectStateToServe? : number);
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetIsSightObserverHeightAbsolute(puPropertyID? : any, uObjectStateToServe? : number) : boolean;
            SetSightObserverMinPitch(fMinPitch : number, uPropertyID? : number, uObjectStateToServe? : number);
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetSightObserverMinPitch(puPropertyID? : any, uObjectStateToServe? : number) : number;
            SetSightObserverMaxPitch(pfMaxPitch : number, uPropertyID? : number, uObjectStateToServe? : number);
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetSightObserverMaxPitch(puPropertyID? : any, uObjectStateToServe? : number) : number;
            SetSightObservedHeight(fObservedHeight : number, uPropertyID? : number, uObjectStateToServe? : number);
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetSightObservedHeight(puPropertyID? : any, uObjectStateToServe? : number) : number;
            SetIsSightObservedHeightAbsolute(bIsSightObservedHeightAbsolute : boolean, uPropertyID? : number, uObjectStateToServe? : number);
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetIsSightObservedHeightAbsolute(puPropertyID? : any, uObjectStateToServe? : number) : boolean;
            SetSightColor(eVisibilityType : IMcSpatialQueries.EPointVisibility, Color : SMcBColor, uPropertyID? : number, uObjectStateToServe? : number);
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetSightColor(eVisibilityType : IMcSpatialQueries.EPointVisibility, puPropertyID? : any, uObjectStateToServe? : number) : SMcBColor;
            SetSightQueryPrecision(eQueryPrecision : IMcSpatialQueries.EQueryPrecision, uPropertyID? : number, uObjectStateToServe? : number);
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetSightQueryPrecision(puPropertyID? : any, uObjectStateToServe? : number) : IMcSpatialQueries.EPointVisibility;
            SetSightNumEllipseRays(uNumRays : number, uPropertyID? : number, uObjectStateToServe? : number);
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetSightNumEllipseRays(puPropertyID? : any, uObjectStateToServe? : number) : number;
            SetSightTextureResolution(fTextureResolution : number, uPropertyID? : number, uObjectStateToServe? : number);
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetSightTextureResolution(puPropertyID? : any, uObjectStateToServe? : number) : number;
            SetSightNoDTMResult(eNoDTMResult : IMcSpatialQueries.ENoDTMResult);
            GetSightNoDTMResult(peNoDTMResult : IMcSpatialQueries.ENoDTMResult);
    }   
    namespace IMcSightPresentationItemParams {
        enum ESightPresentationType {
            ESPT_NONE,
            ESPT_CPU,
            ESPT_GPU,
            ESPT_MIXED
        }
    }

    interface IMcSymbolicItem extends IMcObjectSchemeItem {
        Clone(pObject? : IMcObject) : IMcSymbolicItem;
        Connect(ParentNodeOrArray : IMcObjectSchemeNode | IMcObjectSchemeNode[]);
        /**
         * @param paPoints              array created by the user, allocated and filled by MapCore
         * @param peCoordSystem         peCoordSystem.Value :  EMcPointCoordSystem
         */
        GetAllCalculatedPoints(pMapViewport : IMcMapViewport , pObject : IMcObject, paPoints : SMcVector3D[], peCoordSystem : EMcPointCoordSystem[], pauOriginalPointsIndices? : Uint32Array);
        SetAttachPointType(uParentIndex : number, eType : IMcSymbolicItem.EAttachPointType);
        GetAttachPointType(uParentIndex : number) : IMcSymbolicItem.EAttachPointType ;
        SetBoundingBoxAttachPointType(uParentIndex : number, uBoundingBoxPointBitField : number);
        GetBoundingBoxAttachPointType(uParentIndex : number) : number;
        SetAttachPointIndex(uParentIndex : number, nPointIndex : number, uPropertyID? : number, uObjectStateToServe? : number);
         /**
          * @param puPropertyID       puPropertyID.Value :  number
          */
        GetAttachPointIndex(uParentIndex : number, puPropertyID? : any, uObjectStateToServe? : any) : number;
        SetNumAttachPoints(uParentIndex : number, nNumPoints : number, uPropertyID? : number, uObjectStateToServe? : number);
         /**
          * @param puPropertyID      puPropertyID.Value :   number
          */
        GetNumAttachPoints(uParentIndex : number, puPropertyID? : any, uObjectStateToServe?: any) : number;
        SetAttachPointPositionValue(uParentIndex : number, fPositionValue : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID          puPropertyID.Value :   number
         */
        GetAttachPointPositionValue(uParentIndex : number, puPropertyID? : any, uObjectStateToServe? : number) : number;
	    SetOffsetType(eOffsetType : IMcObjectSchemeItem.EGeometryType );
	    GetOffsetType() : IMcObjectSchemeItem.EGeometryType;
	    SetOffsetOrientation(eOffsetOrientation : IMcSymbolicItem.EOffsetOrientation);
	    GetOffsetOrientation() : IMcSymbolicItem.EOffsetOrientation;
	    SetVectorTransformParentIndex(uParentIndex : number);
	    GetVectorTransformParentIndex() : number;
        SetVectorTransformSegment(uSegmentIndexOrType : number,	uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value         : number
         */
        GetVectorTransformSegment(puPropertyID? : any, uObjectStateToServe? : number) : number;
	    SetVectorOffsetCalc(eCalc : IMcSymbolicItem.EVectorOffsetCalc);
	    GetVectorOffsetCalc() : IMcSymbolicItem.EVectorOffsetCalc;
        SetCoordinateSystemConversion(eCoordinateSystem : EMcPointCoordSystem, bEnabled? : boolean);
        /**
         * @param peCoordinateSystem        peCoordinateSystem.Value : EMcPointCoordSystem
         * @param pbEnabled                 pbEnabled.Value :          boolean
         */
        GetCoordinateSystemConversion(peCoordinateSystem : any, pbEnabled? : any);
        SetRotationAlignment(eAlignToCoordinateSystem : EMcPointCoordSystem, bAlignYaw? : boolean , bAlignPitch? : boolean, bAlignRoll? : boolean);
        /**
         * @param peAlignToCoordinateSystem        peAlignToCoordinateSystem.Value : EMcPointCoordSystem
         * @param pbAlignYaw                       pbAlignYaw.Value                : boolean
         * @param pbAlignPitch                     pbAlignPitch.Value              : boolean
         * @param pbAlignRoll                      pbAlignRoll.Value               : boolean
         */
        GetRotationAlignment(peAlignToCoordinateSystem : any, pbAlignYaw? : boolean, pbAlignPitch? : boolean, pbAlignRoll? : boolean);
        SetVectorOffsetValue(fVectorOffsetValue : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID         puPropertyID.Value  :      number
         */
        GetVectorOffsetValue(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetOffset(Offset : SMcFVector3D, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID         puPropertyID.Value  :      number
         */
        GetOffset(pOffset : SMcFVector3D, puPropertyID? : any, uObjectStateToServe? : any) : SMcFVector3D;
        SetPointsDuplication(anPointIndicesAndDuplicates : IMcProperty.SArrayPropertyInt, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetPointsDuplication(puPropertyID? : any, uObjectStateToServe? : number) : IMcProperty.SArrayPropertyInt;
        SetPointsDuplicationOffsets(aDuplicationOffsets : IMcProperty.SArrayPropertySMcFVector3D, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetPointsDuplicationOffsets(puPropertyID? : any, uObjectStateToServe? : number) : IMcProperty.SArrayPropertySMcFVector3D;



        SetVectorRotation(bEnabled : boolean);
	    GetVectorRotation() : boolean;
        SetRotationYaw(fYaw : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID       puPropertyID.Value  :      number
         */
        GetRotationYaw(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetRotationPitch(fPitch : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID       puPropertyID.Value  :      number
         */
        GetRotationPitch(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetRotationRoll(fRoll : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID       puPropertyID.Value  :      number
         */
        GetRotationRoll(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetSubItemsData(SubItemsData : IMcProperty.SArrayPropertySMcSubItemData, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID       puPropertyID.Value  :      number
         */
        GetSubItemsData(puPropertyID? : any, uObjectStateToServe? : number) : IMcProperty.SArrayPropertySMcSubItemData;
        SetDrawPriorityGroup(eDrawPriorityGroup : IMcSymbolicItem.EDrawPriorityGroup, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID          puPropertyID.Value :  number
         */
	    GetDrawPriorityGroup(puPropertyID? : any, uObjectStateToServe? : any) :number;
	    SetDrawPriority(nPriority : number);
	    GetDrawPriority() : number;
	    SetCoplanar3DPriority(nPriority : number);
	    GetCoplanar3DPriority() : number;
        SetTextureFiltering(eMinFilter : IMcSymbolicItem.ETextureFilter, eMagFilter : IMcSymbolicItem.ETextureFilter, eMipmapFilter : IMcSymbolicItem.ETextureFilter);
        SetSpecialMaterial(strSpecialMaterial : string, bSpecialMaterialUseItemTexture : boolean);
        /**
         * @param pstrSpecialMaterial                   pstrSpecialMaterial.Value :              string
         * @param pbSpecialMaterialUseItemTexture       pbSpecialMaterialUseItemTexture.Value :  boolean
         */
        GetSpecialMaterial(pstrSpecialMaterial : any, pbSpecialMaterialUseItemTexture : any);
        SetMoveIfBlockedMaxChange(fMaxChange : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID           puPropertyID.Value :   number
         */
        GetMoveIfBlockedMaxChange(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetMoveIfBlockedHeightAboveObstacle(fHeightAboveObstacle : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID                 puPropertyID.Value :             number
         */
        GetMoveIfBlockedHeightAboveObstacle(puPropertyID? : any, uObjectStateToServe? : any) : number;

}
    namespace IMcSymbolicItem {
        enum EAttachPointType {
            EAPT_ALL_POINTS,
            EAPT_NONE,
            EAPT_BOUNDING_BOX_POINT,
            EAPT_INDEX_POINTS,
            EAPT_EXCEPT_INDEX_POINTS,
            EAPT_SEGMENTS_INTERP,
		    EAPT_ALL_SEGMENTS_INTERPS,
            EAPT_FIRST_POINTS,
            EAPT_LAST_POINTS,
            EAPT_MID_POINT,
            EAPT_ALL_MIDDLES,
            EAPT_CENTER_POINT,
		    EAPT_SCREEN_TOP_MOST,
            EAPT_SCREEN_BOTTOM_MOST,
            EAPT_SCREEN_LEFT_MOST,
            EAPT_SCREEN_RIGHT_MOST,
            EAPT_SCREEN_EQUIDISTANT,
            EAPT_NUM
        }
        enum EBoundingBoxPointFlags {
            EBBPF_NONE, 
            EBBPF_TOP_LEFT, 
            EBBPF_TOP_MIDDLE, 
            EBBPF_TOP_RIGHT, 
            EBBPF_MIDDLE_RIGHT,
            EBBPF_BOTTOM_RIGHT, 
            EBBPF_BOTTOM_MIDDLE, 
            EBBPF_BOTTOM_LEFT, 
            EBBPF_MIDDLE_LEFT, 
            EBBPF_CENTER,
            EBBPF_REVERSED_ORDER, 
            EBBPF_UPPER_PLANE, 
            EBBPF_LOWER_PLANE
        }
        enum EDrawPriorityGroup {
            EDPG_REGULAR,
            EDPG_TOP_MOST,
            EDPG_SCREEN_BACKGROUND,
            EDPG_BOTTOM_MOST,
            EDPG_WORLD_WITH_TERRAIN
        }
        enum EVectorOffsetCalc {
            EVOC_PARALLEL_DISTANCE, EVOC_PARALLEL_RATIO, 
            EVOC_PERPENDICULAR_DISTANCE, 
            EVOC_PERPENDICULAR_RATIO, 
            EVOC_SEGMENT_LENGTH_RATIO_UPWARD, 
            EVOC_PERPENDICULAR_LENGTH_RATIO_UPWARD, 
            EVOC_PERPENDICULAR_RATIO_PARALLEL
        }
        enum EOffsetOrientation {
            EOO_RELATIVE_TO_PARENT_ROTATION,
            EOO_RELATIVE_TO_ITEM_ROTATION,	
            EOO_ABSOLUTE					
        }
        enum ETextureFilter {
            ETF_DEFAULT, 
            ETF_NONE, 
            ETF_POINT, 
            ETF_LINEAR, 
            ETF_ANISOTROPIC				
        }
        class SAttachPointParams {
            constructor();
            eType: IMcSymbolicItem.EAttachPointType;
            nPointIndex : number;
            nNumPoints : number;
            fPositionValue : number;
            uBoundingBoxPointTypeBitField : number;
        }
    }

    interface IMcClosedShapeItem extends IMcLineBasedItem {
        SetFillStyle(eFillStyle : IMcLineBasedItem.EFillStyle, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID     puPropertyID.Value : number
         */
        GetFillStyle(puPropertyID? : any, uObjectStateToServe? : number) : IMcLineBasedItem.EFillStyle;
        SetFillColor(FillColor : SMcBColor, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID     puPropertyID.Value : number
         */
        GetFillColor(puPropertyID? : any, uObjectStateToServe? : number) : SMcBColor;
        SetFillTexture(pFillTexture : IMcTexture, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID        puPropertyID.Value :    number
         */
        GetFillTexture(puPropertyID? : any, uObjectStateToServe? : number) : IMcTexture;
        SetFillTextureScale(FillTextureScale : SMcFVector2D, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID        puPropertyID.Value :    number
         */
        GetFillTextureScale(puPropertyID? : any, uObjectStateToServe? : number) : SMcFVector2D;
    }


    interface IMcLineBasedItem extends IMcSymbolicItem {
        SetShapeType(eShapeType : IMcLineBasedItem.EShapeType);
        GetShapeType() : IMcLineBasedItem.EShapeType;
        SetLineStyle(LineStyle : IMcLineBasedItem.ELineStyle, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID      puPropertyID.Value : number
         */
        GetLineStyle(puPropertyID? : any, uObjectStateToServe? : number) : IMcLineBasedItem.ELineStyle;
        SetLineColor(LineColor : SMcBColor,	uPropertyID? : number,	uObjectStateToServe? : number);
        /**
         * @param puPropertyID      puPropertyID.Value :    number
         */
        GetLineColor(puPropertyID? : any, uObjectStateToServe? : number) : SMcBColor;
        SetOutlineColor(OutlineColor : SMcBColor, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID      puPropertyID.Value : number
         */
        GetOutlineColor(puPropertyID? : any, uObjectStateToServe? : number) : SMcBColor;
        SetLineWidth(fLineWidth : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID          puPropertyID.Value :    number
         */
        GetLineWidth(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetOutlineWidth(fOutlineWidth : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID          puPropertyID.Value :    number
         */
        GetOutlineWidth(puPropertyID? : any, uObjectStateToServe? : number) : number;
        
        SetLineTexture(pLineTexture : IMcTexture, uPropertyID? : number, uObjectStateToServe? : number);
         /**
         * @param puPropertyID            puPropertyID.Value :      number
         */
        GetLineTexture(puPropertyID? : any, uObjectStateToServe? : number) : IMcTexture;
        SetLineTextureHeightRange(LineTextureHeightRange : SMcFVector2D , uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID            puPropertyID.Value :      number
         */
        GetLineTextureHeightRange(puPropertyID? : any, uObjectStateToServe? : number) : SMcFVector2D;
        
        SetLineTextureScale(fLineTextureScale : number , uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID            puPropertyID.Value :      number
         */
        GetLineTextureScale(uPropertyID? : number, uObjectStateToServe? : number) : number;
        SetVerticalHeight(fVerticalHeight : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID        puPropertyID.Value :    number
         */
        GetVerticalHeight(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetSidesFillStyle(eSidesFillStyle : IMcLineBasedItem.EFillStyle, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID        puPropertyID.Value :    number
         */
        GetSidesFillStyle(puPropertyID? : any, uObjectStateToServe? : number) : IMcLineBasedItem.EFillStyle;
        SetSidesFillColor(SidesFillColor : SMcBColor, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID        puPropertyID.Value :    number
         */
        GetSidesFillColor(puPropertyID? : any, uObjectStateToServe? : number) : SMcBColor;
        SetSidesFillTexture(pSidesFillTexture : IMcTexture, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID        puPropertyID.Value :    number
         */
        GetSidesFillTexture(puPropertyID? : any, uObjectStateToServe? : number) : IMcTexture;
        SetSidesFillTextureScale(SidesFillTextureScale : SMcFVector2D, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID        puPropertyID.Value :    number
         */
        GetSidesFillTextureScale(puPropertyID? : any, uObjectStateToServe? : number) : SMcFVector2D;
        SetGreatCirclePrecision(fGreatCirclePrecision : number);
        GetGreatCirclePrecision() : number;
        SetNumSmoothingLevels(uNumSmoothingLevels : number , uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID            puPropertyID.Value :      number
         */
        GetNumSmoothingLevels(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetClippingItems(apClippingItems : IMcObjectSchemeItem[], bSelfClippingOnly? : boolean);
        /**
         * @param pbSelfClippingOnly            pbSelfClippingOnly.Value :      boolean
         */
        GetClippingItems(pbSelfClippingOnly : any) : IMcObjectSchemeItem[];
    }
    namespace IMcLineBasedItem {
        enum EFillStyle {
            EFS_HORIZONTAL, 
            EFS_VERTICAL, 
            EFS_FDIAGONAL, 
            EFS_BDIAGONAL,
            EFS_CROSS, 
            EFS_DIAGCROSS, 
            EFS_SOLID, 
            EFS_TEXTURE, 
            EFS_NONE
        }
        enum EShapeType {
            EST_2D,
            EST_3D_EXTRUSION
        }

        enum ELineStyle {
            ELS_SOLID, 
            ELS_DASH, 
            ELS_DOT, 
            ELS_DASH_DOT, 
            ELS_DASH_DOT_DOT, 
            ELS_TEXTURE, 
            ELS_NO_LINE
        }
        class SSlopePresentationColor {
            fMaxSlope : number;
            Color : SMcBColor;

        }
    }

    interface IMcProceduralGeometryItem extends IMcSymbolicItem {
        GetProceduralGeometryCoordinateSystem() : EMcPointCoordSystem;
    }
    namespace IMcProceduralGeometryItem {
        enum ERenderingMode {
        	ERM_POINTS,
            ERM_LINES,
            ERM_TRIANGLES
        }
	}

    interface IMcEmptySymbolicItem extends IMcSymbolicItem {
    }
    namespace IMcEmptySymbolicItem {
        function Create() : IMcEmptySymbolicItem;
        var NODE_TYPE;
    }
       
    interface IMcPictureItem extends IMcSymbolicItem {
        Clone() : IMcPictureItem;
        SetRectAlignment(eRectAlignment : IMcSymbolicItem.EBoundingBoxPointFlags);
        GetRectAlignment() : IMcSymbolicItem.EBoundingBoxPointFlags ;
        SetWidth(fWidth : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
          * @param puPropertyID            puPropertyID.Value :      number
          */
        GetWidth(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetHeight(fHeight : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
          * @param puPropertyID            puPropertyID.Value :      number
          */
        GetHeight(puPropertyID? : any, uObjectStateToServe? : number) : number;
        IsSizeFactor() : boolean;
        IsUsingTextureGeoReferencing() : boolean;
        SetTexture(pTexture : IMcTexture, uPropertyID? : number, uObjectStateToServe? : number);
         /**
          * @param puPropertyID            puPropertyID.Value :      number
          */
        GetTexture(puPropertyID? : any, uObjectStateToServe? : number) : IMcTexture;
        SetTextureColor(TextureColor : SMcBColor, uPropertyID? : number, uObjectStateToServe? : number);
        /**
          * @param puPropertyID            puPropertyID.Value :      number
          */
        GetTextureColor(puPropertyID? : any, uObjectStateToServe? : number) : SMcBColor;
    }
    namespace IMcPictureItem {
        function Create(uItemSubTypeBitField : number, pDefaultTexture : IMcTexture, fDefaultWidth? : number,fDefaultHeight? : number, 
        bIsSizeFactor? : boolean,	DefaultTextureColor? : SMcBColor,eDefaultRectAlignment? : IMcSymbolicItem.EBoundingBoxPointFlags,
		bUseTextureGeoReferencing? : boolean) : IMcPictureItem;
        var NODE_TYPE;
    }

    interface IMcTextItem extends IMcSymbolicItem {
        
        SetText(Text : SMcVariantString, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID        puPropertyID.Value :  number
         */
        GetText(puPropertyID? : any, uObjectStateToServe? : number) : SMcVariantString;
        SetFont(pFont : IMcFont, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID        puPropertyID.Value :  number
         */
        GetFont(puPropertyID? : any, uObjectStateToServe? : number) : IMcFont;
        SetTextAlignment(eTextAlignment : EAxisXAlignment, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID        puPropertyID.Value :  number
         */
        GetTextAlignment(puPropertyID? : any, uObjectStateToServe? : number) : EAxisXAlignment;
        SetRightToLeftReadingOrder(bRightToLeftReadingOrder : boolean, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID        puPropertyID.Value :  number
         */
        GetRightToLeftReadingOrder(puPropertyID? : any, uObjectStateToServe? : number) : boolean;
        SetRectAlignment(eRectAlignment : IMcSymbolicItem.EBoundingBoxPointFlags);
        GetRectAlignment() : IMcSymbolicItem.EBoundingBoxPointFlags;
        SetScale(Scale : SMcFVector2D, uPropertyID? : number, uObjectStateToServe? : number);
        /**
          * @param puPropertyID            puPropertyID.Value :      number
          */
        GetScale(puPropertyID? : any, uObjectStateToServe? : number) : SMcFVector2D;
        SetMargin(uMargin : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
          * @param puPropertyID            puPropertyID.Value :      number
          */
        GetMargin(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetTextColor(TextColor : SMcBColor, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID        puPropertyID.Value :   number
         */
        GetTextColor(puPropertyID? : any, uObjectStateToServe? : number) : SMcBColor;
        SetBackgroundColor(BackgroundColor : SMcBColor, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID        puPropertyID.Value :         number
         */
        GetBackgroundColor(puPropertyID? : any, uObjectStateToServe? : number) : SMcBColor;
        SetOutlineColor(OutlineColor : SMcBColor, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID        puPropertyID.Value :         number
         */
        GetOutlineColor(puPropertyID? : any, uObjectStateToServe? : number) : SMcBColor;
        GetNeverUpsideDownMode() : IMcTextItem.ENeverUpsideDownMode;
    }
    namespace IMcTextItem {
        function Create(uItemSubTypeBitField : number, pDefaultFont : IMcFont, DefaultScale? : SMcFVector2D,
		eNeverUpsideDownMode? : IMcTextItem.ENeverUpsideDownMode, eDefaultTextAlignment? : EAxisXAlignment,
		eDefaultRectAlignment? : IMcSymbolicItem.EBoundingBoxPointFlags, bDefaultRightToLeftReadingOrder? : boolean, uDefaultMargin? : number,
		DefaultTextColor? : SMcBColor, DefaultBackgroundColor? : SMcBColor) : IMcTextItem;
        enum ENeverUpsideDownMode {
            ENUDM_NONE, 
            ENUDM_ROTATE_TEXT, 
            ENUDM_ROTATE_EACH_LINE
        }
        var NODE_TYPE;
    }

    interface IMcManualGeometryItem extends IMcProceduralGeometryItem {
        Clone(pObject? : IMcObject) : IMcManualGeometryItem;
        SetRenderingMode(eRenderingMode : IMcProceduralGeometryItem.ERenderingMode, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetRenderingMode(puPropertyID? : any, uObjectStateToServe? : number) : IMcProceduralGeometryItem.ERenderingMode;
        SetTexture(pTexture : IMcTexture ,uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetTexture(puPropertyID? : any, uObjectStateToServe? : number) : IMcTexture;
        SetConnectionIndices(auConnectionIndices : IMcProperty.SArrayPropertyUint, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetConnectionIndices(puPropertyID? : any, uObjectStateToServe? : number) : IMcProperty.SArrayPropertyUint;
        SetPointsCoordinates(aPointsCoordinates : IMcProperty.SArrayPropertySMcVector3D, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetPointsCoordinates(puPropertyID? : any, uObjectStateToServe? : number) : IMcProperty.SArrayPropertySMcVector3D;
        SetPointsTextureCoordinates(aPointsTextureCoordinates : IMcProperty.SArrayPropertySMcFVector2D, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetPointsTextureCoordinates(puPropertyID? : any, uObjectStateToServe? : number) : IMcProperty.SArrayPropertySMcFVector2D;
        SetPointsColors(aPointsColors : IMcProperty.SArrayPropertySMcBColor, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetPointsColors(puPropertyID? : any, uObjectStateToServe? : number) : IMcProperty.SArrayPropertySMcBColor;
        SetPointsData(aPointsCoordinates : SMcVector3D[], aPointsTextureCoordinates : SMcFVector2D[], aPointsColors : SMcBColor[]);
        /**
         * @param aPointsCoordinates          array created by the user, allocated and filled by MapCore
         * @param aPointsTextureCoordinates   array created by the user, allocated and filled by MapCore
         * @param aPointsColors               array created by the user, allocated and filled by MapCore
         */
        GetPointsData(paPointsCoordinates : SMcVector3D[], paPointsTextureCoordinates : SMcFVector2D[], paPointsColors : SMcBColor[])
    }
    namespace IMcManualGeometryItem {
        function Create(uItemSubTypeBitField : number, eProceduralGeometryCoordinateSystem : EMcPointCoordSystem,
		eRenderingMode : IMcProceduralGeometryItem.ERenderingMode, pTexture? : IMcTexture, 
		auConnectionIndices? : Uint8Array,  aPointsCoordinates? : SMcVector3D[], 
        aPointsTextureCoordinates? : SMcFVector2D[], aPointsColors? : SMcBColor[]) : IMcManualGeometryItem;
        var NODE_TYPE;
    }

    interface IMcArcItem extends IMcLineBasedItem {
        Clone(pObject? : IMcObject) : IMcArcItem;
        GetEllipseCoordinateSystem() : EMcPointCoordSystem;
        GetEllipseType() : IMcObjectSchemeItem.EGeometryType;
        SetEllipseDefinition(eEllipseDefinition : IMcObjectSchemeItem.EEllipseDefinition); 
        GetEllipseDefinition() : IMcObjectSchemeItem.EEllipseDefinition;
        SetStartAngle(fStartAngle : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetStartAngle(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetEndAngle(fEndAngle : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetEndAngle(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetRadiusX(fRadiusX : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetRadiusX(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetRadiusY(fRadiusY : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetRadiusY(puPropertyID? : any, uObjectStateToServe? : number) : number;
     }
    namespace IMcArcItem {
        function Create(uItemSubTypeBitField : number, eEllipseCoordinateSystem : EMcPointCoordSystem, eEllipseType? : IMcObjectSchemeItem.EGeometryType,
		fDefaultRadiusX? : number, fDefaultRadiusY? : number, fDefaultStartAngle? : number,
		fDefaultEndAngle? : number, eDefaultLineStyle? : IMcLineBasedItem.ELineStyle, DefaultLineColor? : SMcBColor,
		fDefaultLineWidth? : number, pDefaultLineTexture? : IMcTexture, DefaultLineTextureHeightRange? : SMcFVector2D,
		fDefaultLineTextureScale? : number) : IMcArcItem;
        var NODE_TYPE;
    }

    interface IMcLineItem extends IMcLineBasedItem {
        Clone() : IMcLineItem;

        SetSlopePresentationColors(aColors : IMcLineBasedItem.SSlopePresentationColor[]);
        GetSlopePresentationColors() : IMcLineBasedItem.SSlopePresentationColor[];
        SetSlopeQueryPrecision(eQueryPrecision : IMcSpatialQueries.EQueryPrecision, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetSlopeQueryPrecision(puPropertyID? : any, uObjectStateToServe? : number) : IMcSpatialQueries.EQueryPrecision;
        SetShowSlopePresentation(bShowSlopePresentation : boolean, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetShowSlopePresentation(puPropertyID? : any, uObjectStateToServe? : number) : boolean;
    }
    namespace IMcLineItem {
        function Create(uItemSubTypeBitField : number,
		eDefaultLineStyle? : IMcLineBasedItem.ELineStyle,
		DefaultLineColor? : SMcBColor,
		fDefaultLineWidth? : number,
		pDefaultLineTexture? : IMcTexture,
		DefaultLineTextureHeightRange? : SMcFVector2D,
		fDefaultLineTextureScale? : number) : IMcLineItem;
        var NODE_TYPE;
    }

    interface IMcRectangleItem extends IMcClosedShapeItem {
        Clone(pObject? : IMcObject) : IMcRectangleItem;
        GetRectangleCoordinateSystem() : EMcPointCoordSystem;
        GetRectangleType() : IMcObjectSchemeItem.EGeometryType;
	    SetRectangleDefinition(eRectangleDefinition : IMcRectangleItem.ERectangleDefinition);
	    GetRectangleDefinition() : IMcRectangleItem.ERectangleDefinition;
        SetRadiusX(fRadiusX : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
          * @param puPropertyID            puPropertyID.Value :      number
          */
        GetRadiusX(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetRadiusY(fRadiusY : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
          * @param puPropertyID            puPropertyID.Value :      number
          */
        GetRadiusY(puPropertyID? : any, uObjectStateToServe? : number) : number;
    }
    namespace IMcRectangleItem{
        function Create(uItemSubTypeBitField : number,
		eRectangleCoordinateSystem : EMcPointCoordSystem,
		eRectangleType? : IMcObjectSchemeItem.EGeometryType,
		eRectangleDefinition? : IMcRectangleItem.ERectangleDefinition,
		fDefaultRadiusX? : number, fDefaultRadiusY? : number,
		eDefaultLineStyle? : IMcLineBasedItem.ELineStyle,
		DefaultLineColor? : SMcBColor,
		fDefaultLineWidth? : number,
		pDefaultLineTexture? : IMcTexture,
		DefaultLineTextureHeightRange? : SMcFVector2D,
		fDefaultLineTextureScale? : number,
		eDefaultFillStyle? : IMcLineBasedItem.EFillStyle,
		DefaultFillColor? : SMcBColor,
		pDefaultFillTexture? : IMcTexture,
		DefaultFillTextureScale? : SMcFVector2D) : IMcRectangleItem;
        enum ERectangleDefinition {
            ERD_RECTANGLE_DIAGONAL_POINTS, 
            ERD_RECTANGLE_CENTER_DIMENSIONS, 
            ERD_SQUARE_CENTER_DIMENSION
        }
        var NODE_TYPE;
    }

    interface IMcPolygonItem extends IMcClosedShapeItem {
        Clone(pObject? : IMcObject) : IMcPolygonItem;
    }
    namespace IMcPolygonItem {
        function Create(uItemSubTypeBitField : number, DefaultLineStyle? : IMcLineBasedItem.ELineStyle, DefaultLineColor? : SMcBColor,
		fDefaultLineWidth? : number, pDefaultLineTexture? : IMcTexture,	DefaultLineTextureHeightRange? : SMcFVector2D,
		fDefaultLineTextureScale? : number,	eDefaultFillStyle? : IMcLineBasedItem.EFillStyle,
		DefaultFillColor? : SMcBColor, pDefaultFillTexture? : IMcTexture,
		DefaultFillTextureScale? : SMcFVector2D) : IMcPolygonItem;
        var NODE_TYPE;
    }

    interface IMcLineExpansionItem extends IMcClosedShapeItem {
        Clone() : IMcLineExpansionItem;
        GetLineExpansionCoordinateSystem(peLineExpansionCoordinateSystem : EMcPointCoordSystem);
        GetLineExpansionType(peLineExpansionType : IMcObjectSchemeItem.EGeometryType);
        SetRadius(fRadius : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetRadius(puPropertyID? : any, uObjectStateToServe? : number) : number;
    }
    namespace IMcLineExpansionItem {
        function Create(uItemSubTypeBitField : number,
		eLineExpansionCoordinateSystem : EMcPointCoordSystem,
		eLineExpansionType? : IMcObjectSchemeItem.EGeometryType,
		fDefaultRadius? : number,
		DefaultLineStyle? : IMcLineBasedItem.ELineStyle,
		DefaultLineColor? : SMcBColor,
		fDefaultLineWidth? : number,
		pDefaultLineTexture? : IMcTexture,
		DefaultLineTextureHeightRange? : SMcFVector2D,
		fDefaultLineTextureScale? : number,
		eDefaultFillStyle? : IMcLineBasedItem.EFillStyle,
		DefaultFillColor? : SMcBColor,
		pDefaultFillTexture? : IMcTexture,
		DefaultFillTextureScale? : SMcFVector2D) : IMcLineExpansionItem;
        var NODE_TYPE;
    }

    interface IMcEllipseItem extends IMcClosedShapeItem {
        Clone(pObject? : IMcObject) : IMcEllipseItem;
        GetEllipseCoordinateSystem() : EMcPointCoordSystem;
        GetEllipseType() : IMcObjectSchemeItem.EGeometryType;
        SetEllipseDefinition(eEllipseDefinition : IMcObjectSchemeItem.EEllipseDefinition);
        GetEllipseDefinition() : IMcObjectSchemeItem.EEllipseDefinition;
        SetFillTexturePolarMapping(bPolar : boolean);
        GetFillTexturePolarMapping() : boolean;
        SetStartAngle(fStartAngle : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetStartAngle(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetEndAngle(fEndAngle : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetEndAngle(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetRadiusX(fRadiusX : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetRadiusX(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetRadiusY(fRadiusY : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetRadiusY(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetInnerRadiusFactor(fInnerRadiusFactor : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetInnerRadiusFactor(puPropertyID? : any, uObjectStateToServe? : number) : number;
    }
    namespace IMcEllipseItem {
        function Create(uItemSubTypeBitField : number, eEllipseCoordinateSystem : EMcPointCoordSystem,
		eEllipseType? : IMcObjectSchemeItem.EGeometryType, fDefaultRadiusX?  : number, fDefaultRadiusY? : number,
		fDefaultStartAngle? : number, fDefaultEndAngle? : number, fDefaultInnerRadiusFactor? : number,
		eDefaultLineStyle? : IMcLineBasedItem.ELineStyle, DefaultLineColor? : SMcBColor, fDefaultLineWidth? : number,
		pDefaultLineTexture? : IMcTexture, DefaultLineTextureHeightRange? : SMcFVector2D, fDefaultLineTextureScale? : number,
		eDefaultFillStyle? : IMcLineBasedItem.EFillStyle,	DefaultFillColor? : SMcBColor, pDefaultFillTexture? : IMcTexture,
		DefaultFillTextureScale? : SMcFVector2D) : IMcEllipseItem;
        var NODE_TYPE;
    }

    interface IMcArrowItem extends IMcClosedShapeItem {
        Clone(pObject? : IMcObject) : IMcArrowItem;
        GetArrowCoordinateSystem() : EMcPointCoordSystem;
        SetHeadSize(fHeadSize : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetHeadSize(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetHeadAngle(fHeadAngle : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetHeadAngle(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetGapSize(fGapSize : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetGapSize(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetSlopePresentationColors(aColors : IMcLineBasedItem.SSlopePresentationColor[]);
        GetSlopePresentationColors() : IMcLineBasedItem.SSlopePresentationColor[];
        SetSlopeQueryPrecision(eQueryPrecision : IMcSpatialQueries.EQueryPrecision, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetSlopeQueryPrecision(puPropertyID? : any, uObjectStateToServe? : number) : IMcSpatialQueries.EQueryPrecision;
        SetShowSlopePresentation(bShowSlopePresentation : boolean, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetShowSlopePresentation(puPropertyID? : any, uObjectStateToServe? : number) : boolean;
    }
    namespace IMcArrowItem {
        function Create(uItemSubTypeBitField : number, eArrowCoordinateSystem : EMcPointCoordSystem, fDefaultHeadSize? : number,
		fDefaultHeadAngle? : number, fDefaultGapSize? : number,	eDefaultLineStyle? : IMcLineBasedItem.ELineStyle,
		DefaultLineColor? : SMcBColor, fDefaultLineWidth? : number,	pDefaultLineTexture? : IMcTexture,
		DefaultLineTextureHeightRange? : SMcFVector2D, fDefaultLineTextureScale? : number) : IMcArrowItem;
        var NODE_TYPE;
    }

    interface IMcConditionalSelector extends IMcBase {
        GetOverlayManager() : IMcOverlayManager;
        SetID(uID : number);
        GetID() : number;
        SetName(strName : string);
        GetName() : string;
        GetConditionalSelectorType() : number;
    }
    namespace IMcConditionalSelector {
        enum EActionOptions {
            EAO_FORCE_FALSE,
            EAO_FORCE_TRUE, 
            EAO_USE_SELECTOR
        }
        enum EActionType {
            EAT_ACTIVITY,
            EAT_VISIBILITY,
            EAT_TRANSFORM,
            EAT_NUM
        }
    }

    interface IMcScaleConditionalSelector extends IMcConditionalSelector {
        SetMinScale(fMinScale : number);
        GetMinScale() : number;
        SetMaxScale(fMaxScale : number);
        GetMaxScale() : number;
        SetCancelScaleMode(uCancelScaleMode : number);
        GetCancelScaleMode() : number;
        SetCancelScaleModeResult(uCancelScaleModeResult : number);
        GetCancelScaleModeResult() : number;
    }
    namespace IMcScaleConditionalSelector {
        function Create(pOverlayManager : IMcOverlayManager, fMinScale : number, fMaxScale : number, uCancelScaleMode : number, uCancelScaleModeResult : number) : IMcScaleConditionalSelector;
        var CONDITIONAL_SELECTOR_TYPE : number;
    }

    interface IMcViewportConditionalSelector extends IMcConditionalSelector {
        SetViewportTypeBitField(uViewportTypeBitField : number);
        GetViewportTypeBitField() : number;
        SetViewportCoordinateSystemBitField(uViewportCoordinateSystemBitField : number);
        GetViewportCoordinateSystemBitField() : number;
        SetSpecificViewports(auViewportsIDs : Uint8Array, bIDsInclusive : boolean);
        GetSpecificViewports(pbIDsInclusive : boolean): Uint32Array;
    }
    namespace IMcViewportConditionalSelector{
        function Create(pOverlayManager : IMcOverlayManager, uViewportTypeBitField? : number,
    		uViewportCoordinateSystemBitField? : number, uViewportsIDs? : Uint8Array, bIDsInclusive? : boolean) : IMcViewportConditionalSelector;
        var CONDITIONAL_SELECTOR_TYPE : number;
        enum EViewportTypeFlags {
            EVT_NONE, 
            EVT_2D_REGULAR_VIEWPORT, 
            EVT_2D_IMAGE_VIEWPORT, 
            EVT_2D_SECTION_VIEWPORT,
            EVT_2D_VIEWPORT, 
            EVT_3D_VIEWPORT, 
            EVT_ALL_VIEWPORTS
        }
        enum EViewportCoordinateSystem {
            EVCS_GEO_COORDINATE_SYSTEM, 
            EVCS_UTM_COORDINATE_SYSTEM, 
            EVCS_ALL_COORDINATE_SYSTEMS
        }
    }

    interface IMcBlockedConditionalSelector extends IMcConditionalSelector {
    }
    namespace IMcBlockedConditionalSelector {
        function Create(pOverlayManager : IMcOverlayManager) : IMcBlockedConditionalSelector;
        var CONDITIONAL_SELECTOR_TYPE : number;
    
    }

    interface IMcObjectStateConditionalSelector extends IMcConditionalSelector {
        SetObjectState(uObjectState : number);
        GetObjectState() : number;
    }
    namespace IMcObjectStateConditionalSelector {
        function Create(pOverlayManager : IMcOverlayManager, uObjectState? : number) : IMcObjectStateConditionalSelector;
        var CONDITIONAL_SELECTOR_TYPE : number;
    }

    interface IMcLocationConditionalSelector extends IMcConditionalSelector {
        
        SetPolygonPoints(aPoints : SMcVector3D[]);
        GetPolygonPoints() : SMcVector3D[];
    }
    namespace IMcLocationConditionalSelector {
        function Create(pOverlayManager : IMcOverlayManager, aPoints : SMcVector3D[]) : IMcConditionalSelector;
        var CONDITIONAL_SELECTOR_TYPE : number;
    }

    interface IMcMesh extends IMcBase {
            GetMeshType() : number;
        	IsCreatedWithUseExisting() : boolean;
    }
    namespace IMcMesh {
    }

    interface IMcXFileMesh extends IMcMesh {
        SetXFile(strXFile : string, pTransparentColor? :  SMcBColor);
        GetXFile() : string;
        /**
         * @param pTransparentColor     pTransparentColor.Value :  SMcBColor
         */
	    GetTransparentColor(pTransparentColor : any) : boolean;
    }
    namespace IMcXFileMesh {
        /**
         * @param pbExistingUsed     pbExistingUsed.Value :  boolean
         */
        function Create(strXFile : string, pTransparentColor? : SMcBColor,	bUseExisting? : boolean, pbExistingUsed? : any) : IMcXFileMesh;
        var MESH_TYPE;
    }

    interface IMcNativeMesh extends IMcMesh {
        	SetMappedNameID(eType : IMcNativeMesh.EMappedNameType, uID : number, strName : string);
            GetMappedNameByID(eType : IMcNativeMesh.EMappedNameType, uID : number) : string;
            SetMappedNamesIDs(eType : IMcNativeMesh.EMappedNameType, aMappedNamesData : IMcNativeMesh.SMappedNameData[]);
            GetMappedNamesIDs(eType : IMcNativeMesh.EMappedNameType) : Uint32Array;
            GetTextureUnitStatesNames() : string[];
	        GetAttachPointsNames() : string[];
	        GetNumAttachPoints() : number;
            GetAttachPointIndexByName(strName : string) : number;
            GetAttachPointNameByIndex(uIndex : number) : string;
            GetAttachPointChildren(uParentIndex : number) : Uint32Array;
            GetAnimationsNames() : string[];
    }
    namespace IMcNativeMesh {
        enum EMappedNameType {
            EMNT_ATTACH_POINT, 
            EMNT_TEXTURE_UNIT_STATE
        }
        class SMappedNameData {
            constructor();
            uID : number;
            strName : string;
        }
        var MESH_TYPE;
    } 

    interface IMcNativeMeshFile extends IMcNativeMesh {
        	SetMeshFile(strMeshFile : string);
            GetMeshFile() : string;
    }
    namespace IMcNativeMeshFile {
        /**
         * @param pbExistingUsed     pbExistingUsed.Value :  boolean
         */
        function Create(strMeshFile : string, bUseExisting? : boolean, pbExistingUsed? : any)
        var MESH_TYPE;        
    }

    interface IMcBooleanConditionalSelector extends IMcConditionalSelector {
        SetListOfSelectors(ppSelectorList : IMcConditionalSelector[]);
        GetListOfSelectors() : IMcConditionalSelector[];
        SetBooleanOperation(eOperation : IMcBooleanConditionalSelector.EBooleanOp);
        GetBooleanOperation() : IMcBooleanConditionalSelector.EBooleanOp;
    }
    namespace IMcBooleanConditionalSelector {
        function Create(pOverlayManager : IMcOverlayManager, ppSelectorList : IMcConditionalSelector[], eOperation : IMcBooleanConditionalSelector.EBooleanOp) : IMcBooleanConditionalSelector;
        var CONDITIONAL_SELECTOR_TYPE : number;
        enum EBooleanOp{
            EB_AND,
            EB_OR, 
            EB_NOT
        }
    }

    interface IMcCollection extends IMcBase {
        Remove();
        Clear();
        GetOverlayManager() : IMcOverlayManager;
        SetCollectionVisibility(bVisibility : boolean, pMapViewport? : IMcMapViewport);
        GetCollectionVisibility(pMapViewport? : IMcMapViewport) : boolean;
        AddObjects(pObjects : IMcObject[]);
        RemoveObjectFromCollection(pObject : IMcObject);
        RemoveObjectsFromTheirOverlays();
        GetObjects() : IMcObject[];
        MoveObjects(Offset : SMcVector3D);
        SetObjectsState(uState : number, pMapViewport? : IMcMapViewport);
        SetObjectsVisibilityOption(eVisibility : IMcConditionalSelector.EActionOptions, pMapViewport? : IMcMapViewport);
        AddOverlays(pOverlays : IMcOverlay[]);
        RemoveOverlayFromCollection(pOverlay : IMcOverlay);
        RemoveOverlaysFromOverlayManager();
        GetOverlays() : IMcOverlay[];
        SetOverlaysVisibilityOption(eVisibility : IMcConditionalSelector.EActionOptions, pMapViewport? : IMcMapViewport);
    }
    namespace IMcCollection {
        function Create(pOverlayManager : IMcOverlayManager) : IMcCollection;
    }

    interface IMcObject extends IMcBase {
        Clone(pOverlay : IMcOverlay, bCloneObjectScheme : boolean , bClonePointsAndSubItems? : boolean) : IMcObject;
        SetObjectToObjectAttachment(uAttachedLocationIndex : number, pAttachmentParams : IMcObject.SObjectToObjectAttachmentParams);
        GetObjectToObjectAttachment(uAttachedLocationIndex : number) : IMcObject.SObjectToObjectAttachmentParams;
        IsAttachedToAnotherObject() : boolean;
        Remove();
        GetNumLocations() : number;
        GetLocationIndexByID(uNodeID : number) : number;
        SetNumLocationPoints(uNumLocationPoints : number, uLocationIndex? : number);
        SetLocationPoints(aLocationPoints : SMcVector3D[], uLocationIndex? : number);
        UpdateLocationPoints(aLocationPoints: SMcVector3D[], uStartIndex? : number, uLocationIndex? : number);
        GetLocationPoints(uLocationIndex? : number) : SMcVector3D[];
        AddLocationPoint(uInsertIndex : number, LocationPoint : SMcVector3D, uLocationIndex? : number) : number;
        RemoveLocationPoint(uRemoveIndex : number, uLocationIndex? : number);
        UpdateLocationPoint(uUpdateIndex : number,LocationPoint : SMcVector3D, uLocationIndex? : number);
        MoveAllLocationsPoints(Offset : SMcVector3D);
        PlayPathAnimation(aPathAnimationNodes : IMcObject.SPathAnimationNode[], ePositionInterpolationMode : IMcObject.EPositionInterpolationMode, 
            eRotationInterpolationMode : IMcObject.ERotationInterpolationMode,fStartingTimePoint : number, fRotationAdditionalYaw : number, 
            bAutomaticRotation : boolean,	bLoop : boolean);
        StopPathAnimation();
        RotateByItem(Rotation : SMcRotation);
        SetScreenArrangementOffset(pMapViewport : IMcMapViewport, Offset : SMcFVector2D);
        GetScreenArrangementOffset(pMapViewport : IMcMapViewport) : SMcFVector2D;
        SetImageCalc(pLocationImageCalc : IMcImageCalc);
        GetImageCalc() : IMcImageCalc;
        SetOverlay(pOverlay : IMcOverlay);
        GetOverlay() : IMcOverlay;
        GetOverlayManager() : IMcOverlayManager;
        GetCollections() : IMcCollection[];
        SetScheme(pObjectScheme : IMcObjectScheme, bKeepRelevantProperties : boolean);
        GetScheme() : IMcObjectScheme;
        GetNodeByID(uNodeID : number) : IMcObjectSchemeNode;
        GetNodeByName(strNodeName : string) : IMcObjectSchemeNode;
	    SetSuppressSightPresentationMapTilesWebRequests(bSuppress: boolean);
		GetSuppressSightPresentationMapTilesWebRequests() : boolean;
        SetID(uID : number);
        GetID() : number;
        SetUserData(pUserData : IMcUserData);
        GetUserData() : IMcUserData;
        SetDrawPriority(nPriority : number, pMapViewport? : IMcMapViewport);
        GetDrawPriority(pMapViewport : IMcMapViewport) : number;
        SetVisibilityOption(eVisibility : IMcConditionalSelector.EActionOptions, MapViewportOrArray? : IMcMapViewport | IMcMapViewport[]);
        GetVisibilityOption(pMapViewport? : IMcMapViewport) : IMcConditionalSelector.EActionOptions;
        GetEffectiveVisibilityInViewport(pMapViewport : IMcMapViewport) : boolean;
        SetConditionalSelector(eActionType : IMcConditionalSelector.EActionType, bActionOnResult : boolean, pSelector : IMcConditionalSelector);           
        /**
         * @param pbActionOnResult     pbActionOnResult.Value :  boolean
         * @param pSelector            pSelector.Value :  IMcConditionalSelector
         */
        GetConditionalSelector(eActionType : IMcConditionalSelector.EActionType, pbActionOnResult : any, pSelector : any);
        SetIgnoreViewportVisibilityMaxScale(bIgnoreViewportVisibilityMaxScale : boolean);
        GetIgnoreViewportVisibilityMaxScale() : boolean;
        SetDetectibility(bDetectibility : boolean , pMapViewport? : IMcMapViewport);
        GetDetectibility(pMapViewport? : IMcMapViewport) : boolean;
        SetState(StateOrStatesArray: number | Uint8Array, pMapViewport?: IMcMapViewport);
        GetState(pMapViewport? : IMcMapViewport) : Uint8Array;
        GetEffectiveState(pMapViewport? : IMcMapViewport) : Uint32Array;
        ResetProperty(uID : number);
        ResetAllProperties();
        IsPropertyDefault(uID : number) : boolean;
        SetBoolProperty(uID : number, Value : boolean);
        GetBoolProperty(uID : number) : boolean;
        SetByteProperty(uID : number, Value : number);
        GetByteProperty(uID : number) : number;
        SetEnumProperty(uID : number, Value : number);
        GetEnumProperty(uID : number) : number;
        SetIntProperty(uID : number, Value : number);
        GetIntProperty(uID : number) : number;
        SetUIntProperty(uID : number, Value : number);
        GetUIntProperty(uID : number) : number;
        SetFloatProperty(uID : number, Value : number);
        GetFloatProperty(uID : number) : number;
        SetDoubleProperty(uID : number, Value : number);
        GetDoubleProperty(uID : number) : number;
        SetVector2DProperty(uID : number, Value : SMcVector2D);
        GetVector2DProperty(uID : number) : SMcVector2D;
        SetFVector2DProperty(uID : number, Value : SMcFVector2D);
        GetFVector2DProperty(uID : number) : SMcFVector2D;
        SetVector3DProperty(uID : number, Value : SMcVector3D);
        GetVector3DProperty(uID : number) : SMcVector3D;
        SetFVector3DProperty(uID : number, Value : SMcFVector3D);
        GetFVector3DProperty(uID : number) : SMcFVector3D;
        SetBColorProperty(uID : number, Value : SMcBColor);
        GetBColorProperty(uID : number) : SMcBColor;
        SetFColorProperty(uID : number, Value : SMcFColor);
        GetFColorProperty(uID : number) : SMcFColor;
        SetStringProperty(uID : number, Value : SMcVariantString);
        GetStringProperty(uID : number) : SMcVariantString;
        SetFontProperty(uID : number, Value : IMcFont);
        GetFontProperty(uID : number) : IMcFont;
        SetTextureProperty(uID : number, Value : IMcTexture);
        GetTextureProperty(uID : number) : IMcTexture;
        SetMeshProperty(uID : number, Value : IMcMesh);
        GetMeshProperty(uID : number) : IMcMesh;
        SetConditionalSelectorProperty(uID : number, Value : IMcConditionalSelector);
        GetConditionalSelectorProperty(uID : number) : IMcConditionalSelector;
        SetRotationProperty(uID : number, Value : SMcRotation);
        GetRotationProperty(uID : number) : SMcRotation;
        SetAnimationProperty(uID : number, Value : SMcAnimation);
        GetAnimationProperty(uID : number) : SMcAnimation;
        SetProperty(Property : IMcProperty.SVariantProperty);
        GetProperty(uID : number) : IMcProperty.SVariantProperty;
        SetProperties(aProperties :  IMcProperty.SVariantProperty[]);
        GetProperties() : IMcProperty.SVariantProperty[];
        GetPropertyType(uID : number, bNoFailOnNonExistent? : boolean) : IMcProperty.EPropertyType;
        GetEnumPropertyActualType(uID : number) : string;
	    UpdatePropertiesAndLocationPoints(aProperties : IMcProperty.SVariantProperty[], aLocationPoints : SMcVector3D[], uStartIndex? : number, uLocationIndex? : number);
	    /**
         * @param paProperties              array created by the user, allocated and filled by MapCore
         * @param paLocationPoints          array created by the user, allocated and filled by MapCore
         */
        GetPropertiesAndLocationPoints(paProperties : IMcProperty.SVariantProperty[], paLocationPoints: SMcVector3D[], uLocationIndex? : number);
        SetArraySMcSubItemDataProperty(uID : number, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertySMcSubItemData);
        GetArraySMcSubItemDataProperty(uID : number, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertySMcSubItemData;
        SetArrayIntProperty(uID : number, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertyInt);
        GetArrayIntProperty(uID : number, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertyInt;
        SetArrayUINTProperty(uID : number, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertyUint);
        GetArrayUINTProperty(uID : number, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertyUint;
        SetArraySMcFVector2DProperty(uID : number, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertySMcFVector2D);
        GetArraySMcFVector2DProperty(uID : number, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertySMcFVector2D;
        SetArraySMcVector2DProperty(uID : number, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertySMcVector2D);
        GetArraySMcVector2DProperty(uID : number, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertySMcVector2D;
        SetArraySMcFVector3DProperty(uID : number, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertySMcFVector3D);
        GetArraySMcFVector3DProperty(uID : number, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertySMcFVector3D;
        SetArraySMcVector3DProperty(uID : number, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertySMcVector3D);
        GetArraySMcVector3DProperty(uID : number, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertySMcVector3D;
        SetArraySMcBColorProperty(uID : number, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertySMcBColor);
        GetArraySMcBColorProperty(uID : number, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertySMcBColor;
    }
    namespace IMcObject {
        function Create(pOverlay : IMcOverlay, pObjectScheme : IMcObjectScheme, aLocationPoints? : SMcVector3D[]) : IMcObject;
        /**
         * @param ppLocation     ppLocation.Value : IMcObjectLocation
         */
        function Create(ppLocation : any, pOverlay : IMcOverlay, eLocationCoordSystem : EMcPointCoordSystem,	aLocationPoints : SMcVector3D[], bLocationRelativeToDTM? : boolean) : IMcObject;
        function Create(pOverlay : IMcOverlay, pItem : IMcObjectSchemeItem, eLocationCoordSystem : EMcPointCoordSystem, aLocationPoints : SMcVector3D[], bLocationRelativeToDTM? : boolean) : IMcObject;
        function SetEachObjectLocationPoint(apObjects : IMcObject[], aLocationPoints : SMcVector3D[], uLocationIndex? :number);
	    function SetEachObjectProperty(apObjects : IMcObject[], aProperties : IMcProperty.SVariantProperty[]);
	
        enum EPositionInterpolationMode {
            EPIM_LINEAR, 
            EPIM_SPLINE
        }
        enum ERotationInterpolationMode {
            ERIM_LINEAR, 
            ERIM_SPHERICAL
        }
        class SObjectToObjectAttachmentParams {
            constructor();
            pTargetObject : IMcObject;
            pTargetNode : IMcObjectSchemeNode;
            AttachPointParams : IMcSymbolicItem.SAttachPointParams;
            Offset : SMcFVector3D;
        }

        class SPathAnimationNode {
            constructor();
            Position : SMcVector3D; 
            fTime : number;
            ManualRotation : SMcRotation;
        }
    }

    interface IMcObjectLocation extends IMcObjectSchemeNode {
        GetIndex() : number;
	    GetCoordSystem() : EMcPointCoordSystem;
	    SetRelativeToDTM(bRelativeToDTM : boolean, uPropertyID? : number);
        /**
         * @param pbRelativeToDTM     pbRelativeToDTM.Value :   boolean
         * @param puPropertyID        puPropertyID.Value :      number
         */
	    GetRelativeToDTM(pbRelativeToDTM : any, puPropertyID? : any);
    }
    namespace IMcObjectLocation {
        var NODE_TYPE;
    }

    interface IMcObjectScheme extends IMcBase {
        Clone() : IMcObjectScheme;
        GetOverlayManager() : IMcOverlayManager;
        SetTerrainObjectsConsideration(uTerrainObjectsConsiderationBitField : number);
        GetTerrainObjectsConsideration() : number;
	    SetTerrainItemsConsistency(bEnabled : boolean);
        GetTerrainItemsConsistency() : boolean;
        SetGroupingItemsByDrawPriorityWithinObjects(bEnabled : boolean);
        GetGroupingItemsByDrawPriorityWithinObjects() : boolean;
        GetNumObjectLocations() : number;
	    GetObjectLocationIndexByID(uNodeID : number) : number;
         /**
         * @param puLocationIndex       puLocationIndex.Value :     number
         */
        AddObjectLocation(eLocationCoordSystem : EMcPointCoordSystem, bLocationRelativeToDTM? : boolean, puLocationIndex? : any, uInsertAtIndex? : number) : IMcObjectLocation;
        RemoveObjectLocation(uLocationIndex? : number);
        GetObjectLocation(uLocationIndex? : number) : IMcObjectLocation;
        GetNodeByID(uNodeID : number) : IMcObjectSchemeNode;
        GetNodeByName(strNodeName : string) : IMcObjectSchemeNode;
        GetNodes(uNodeKindBitField? : number) : IMcObjectSchemeNode[];
        GetNodesByPropertyID(uPropertyID : number) : IMcObjectSchemeNode[];
        GetObjects() : IMcObject[];
        SetObjectStateName(strStateName : string, uState : number);
        GetObjectStateByName(strStateName : string) : number;
        GetObjectStateName(uState : number) : string;
        SetObjectsState(StateOrStatesArray : number | Uint8Array,pMapViewport? :  IMcMapViewport);
	    SetObjectStateModifiers(aObjectStateModifiers : IMcObjectScheme.SObjectStateModifier[]);
        GetObjectStateModifiers() : IMcObjectScheme.SObjectStateModifier[];
        SetObjectRotationItem(pItem : IMcObjectSchemeItem);
        GetObjectRotationItem() : IMcObjectSchemeItem;
        SetObjectScreenArrangementItem(pItem : IMcObjectSchemeItem);
        GetObjectScreenArrangementItem(): IMcObjectSchemeItem;
        SetEditModeDefaultItem(pItem: IMcObjectSchemeItem);
        GetEditModeDefaultItem(): IMcObjectSchemeItem;
        SetID(uID : number);
        GetID() : number;
        SetName(strName : string);
	    GetName() : string;
	    SetUserData(pUserData : IMcUserData);
        GetUserData() : IMcUserData;
        GetProperties() : IMcProperty.SPropertyID[];
        GetPropertyType(uID : number, bNoFailOnNonExistent? : boolean) :  IMcProperty.EPropertyType; 
        GetEnumPropertyActualType(uID : number) : string;
        SetPropertyName(strPropertyName : string, uID : number);
        GetPropertyIDByName(strPropertyName : string) : number;
        GetPropertyNameByID(uID : number) : string;
        SetPropertyNames(aProperties : IMcProperty.SPropertyName[]);
	    GetPropertyNames() : IMcProperty.SPropertyName[];
	    SetBoolPropertyDefault(uID : number, Value : boolean);
        GetBoolPropertyDefault(uID : number) : boolean;
        SetBytePropertyDefault(uID : number, Value : number);
        GetBytePropertyDefault(uID : number) : number;
        SetEnumPropertyDefault(uID : number, Value : number);
        GetEnumPropertyDefault(uID : number) : number;
        SetIntPropertyDefault(uID : number, Value : number);
        GetIntPropertyDefault(uID : number) : number;
        SetUIntPropertyDefault(uID : number, Value : number);
        GetUIntPropertyDefault(uID : number) : number;
        SetFloatPropertyDefault(uID : number, Value : number);
        GetFloatPropertyDefault(uID : number) : number;
        SetDoublePropertyDefault(uID : number, Value : number);
        GetDoublePropertyDefault(uID : number) : number;
        SetVector2DPropertyDefault(uID : number, Value : SMcVector2D);
        GetVector2DPropertyDefault(uID : number) : SMcVector2D;
        SetFVector2DPropertyDefault(uID : number, Value : SMcFVector2D);
        GetFVector2DPropertyDefault(uID : number) : SMcFVector2D;
        SetVector3DPropertyDefault(uID : number, Value : SMcVector3D);
        GetVector3DPropertyDefault(uID : number) : SMcVector3D;
        SetFVector3DPropertyDefault(uID : number, Value : SMcFVector3D);
        GetFVector3DPropertyDefault(uID : number) : SMcFVector3D;
        SetBColorPropertyDefault(uID : number, Value : SMcBColor);
        GetBColorPropertyDefault(uID : number) : SMcBColor;
        SetFColorPropertyDefault(uID : number, Value : SMcFColor);
        GetFColorPropertyDefault(uID : number) : SMcFColor;
        SetStringPropertyDefault(uID : number, Value : SMcVariantString);
        GetStringPropertyDefault(uID : number) : SMcVariantString;
        SetFontPropertyDefault(uID : number, Value : IMcFont);
        GetFontPropertyDefault(uID : number) : IMcFont;
        SetTexturePropertyDefault(uID : number, Value : IMcTexture);
        GetTexturePropertyDefault(uID : number) : IMcTexture;
        SetMeshPropertyDefault(uID : number, Value : IMcMesh);
        GetMeshPropertyDefault(uID : number) : IMcMesh;
        SetConditionalSelectorPropertyDefault(uID : number, Value : IMcConditionalSelector);
        GetConditionalSelectorPropertyDefault(uID : number) : IMcConditionalSelector;
        SetRotationPropertyDefault(uID : number, Value : SMcRotation);
        GetRotationPropertyDefault(uID : number) : SMcRotation;
        SetArraySMcSubItemDataPropertyDefault(uID : number, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertySMcSubItemData);
        GetArraySMcSubItemDataPropertyDefault(uID : number, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertySMcSubItemData;
        SetArrayUINTPropertyDefault(uID : number, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertyUint);
        GetArrayUINTPropertyDefault(uID : number, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertyUint;
        SetArraySMcFVector2DPropertyDefault(uID : number, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertySMcFVector2D);
        GetArraySMcFVector2DPropertyDefault(uID : number, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertySMcFVector2D;
        SetArraySMcVector2DPropertyDefault(uID : number, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertySMcVector2D);
        GetArraySMcVector2DPropertyDefault(uID : number, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertySMcVector2D;
        SetArraySMcFVector3DPropertyDefault(uID : number, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertySMcFVector3D);
        GetArraySMcFVector3DPropertyDefault(uID : number, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertySMcFVector3D;
        SetArraySMcVector3DPropertyDefault(uID : number, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertySMcVector3D);
        GetArraySMcVector3DPropertyDefault(uID : number, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertySMcVector3D;
        SetArraySMcBColorPropertyDefault(uID : number, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertySMcBColor);
        GetArraySMcBColorPropertyDefault(uID : number, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertySMcBColor;
        SetPropertyDefault(Property : IMcProperty.SVariantProperty);
	    GetPropertyDefault(uID : number) : IMcProperty.SVariantProperty;
        SetPropertyDefaults(aProperties : IMcProperty.SVariantProperty[]);
	    GetPropertyDefaults() : IMcProperty.SVariantProperty[];
        SetEditModeParams(Params: IMcEditMode.SObjectOperationsParams);
        GetEditModeParams() : IMcEditMode.SObjectOperationsParams;
    }
    namespace IMcObjectScheme {
         /**
          * @param ppLocation     ppLocation.Value : IMcObjectLocation
          */
        function Create(ppLocation : any, pOverlayManager : IMcOverlayManager, eLocationCoordSystem : EMcPointCoordSystem,
		    bLocationRelativeToDTM? : boolean, uTerrainObjectsConsiderationBitField? : number) : IMcObjectScheme;
        function Create(pOverlayManager : IMcOverlayManager,	pItem : IMcObjectSchemeItem, eLocationCoordSystem : EMcPointCoordSystem,
		    bLocationRelativeToDTM? : boolean, uTerrainObjectsConsiderationBitField? : number) : IMcObjectScheme;
        function SetIgnoreUpdatingNonExistentProperty(bIgnore : boolean);
        function GetIgnoreUpdatingNonExistentProperty() : boolean;
        function SaveSchemeComponentInterface(eComponentKind: IMcObjectScheme.ESchemeComponentKind, uComponentType : number, strJsonFileName : string);
        function SaveSchemeComponentInterface(eComponentKind: IMcObjectScheme.ESchemeComponentKind, uComponentType : number) : Uint8Array;
        enum ETerrainObjectsConsiderationFlags {
            ETOCF_NONE, 
            ETOCF_STATIC_OBJECTS_LAYER
        }
        enum ESchemeComponentKind {
            ESCK_OBJECT_SCHEME_NODE,
            ESCK_CONDITIONAL_SELECTOR,
            ESCK_FONT,
            ESCK_MESH,
            ESCK_TEXTURE,
            ESCK_ENUMERATION
        }
        class SObjectStateModifier {
            constructor();
            pConditionalSelector : IMcConditionalSelector;
            bActionOnResult : boolean;
            uObjectState : number;
        }
    }

    interface IMcObjectSchemeItem extends IMcObjectSchemeNode {
        Clone(pObject? : IMcObject) : IMcObjectSchemeItem;
        Disconnect();
        SetDetectibility(bDetectibility : boolean);
        GetDetectibility() : boolean;
        SetHiddenIfViewportOverloaded(bHiddenIfViewportOverloaded : boolean);
	    GetHiddenIfViewportOverloaded() : boolean;
	    SetBlockedTransparency(byTransparency : number,	uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID        puPropertyID.Value :      number
         */
        GetBlockedTransparency(puPropertyID? : any, uObjectStateToServe? : number) : number;
		SetParticipationInSightQueries(bParticipates : boolean);
	    GetParticipationInSightQueries() : boolean;

    }
    namespace IMcObjectSchemeItem {
        enum EItemSubTypeFlags {
            EISTF_WORLD, 
            EISTF_SCREEN, 
            EISTF_ATTACHED_TO_TERRAIN, 
            EISTF_ACCURATE_3D_SCREEN_WIDTH
        }
        enum EGeometryType {
            EGT_GEOMETRIC_IN_OVERLAY_MANAGER, 
            EGT_GEOMETRIC_IN_VIEWPORT,
            EGT_GEOGRAPHIC
        }
        enum EEllipseDefinition {
            EED_ELLIPSE_CENTER_RADIUSES_ANGLES, 
            EED_CIRCLE_CENTER_RADIUS_ANGLES, 
            EED_CIRCLE_CENTER_POINT_ANGLES, 
            EED_CIRCLE_START_POINT_CENTER_END_POINT
        }
    }

    interface IMcObjectSchemeNode extends IMcBase {
        GetNodeKind() : IMcObjectSchemeNode.ENodeKindFlags;
        GetNodeType() : number;
        GetGeometryCoordinateSystem() : EMcPointCoordSystem;
        GetScheme() : IMcObjectScheme;
        GetParents() : IMcObjectSchemeNode[];
        GetChildren() : IMcObjectSchemeNode[];
        GetCoordinates(pMapViewport : IMcMapViewport, eCoordinateSystem : EMcPointCoordSystem, pObject : IMcObject) : SMcVector3D[];
        GetWorldBoundingBox(pMapViewport : IMcMapViewport,pObject : IMcObject) : SMcBox;
        GetScreenBoundingRect(pMapViewport : IMcMapViewport,pObject : IMcObject) : SMcBox;
        SetID(uID : number);
        GetID() : number;
        SetName(strName : string);
        GetName() : string;
        SetUserData(pUserData : IMcUserData);
        GetUserData() : IMcUserData;
        SetVisibilityOption(eVisibility : IMcConditionalSelector.EActionOptions, uPropertyID? : number,	uObjectStateToServe? : number);
        /**
         * @param puPropertyID            puPropertyID.Value :  number
         */
        GetVisibilityOption(puPropertyID? : any, uObjectStateToServe? : number) : IMcConditionalSelector.EActionOptions;
        GetEffectiveVisibilityInViewport(pObject : IMcObject, pMapViewport : IMcMapViewport) : boolean;
        SetTransformOption(eTransform : IMcConditionalSelector.EActionOptions, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param puPropertyID           puPropertyID.Value : number
         */
        GetTransformOption(puPropertyID? : any, uObjectStateToServe? : number) : IMcConditionalSelector.EActionOptions;
        SetConditionalSelector(eActionType : IMcConditionalSelector.EActionType, bActionOnResult : boolean,
		    pSelector : IMcConditionalSelector, uPropertyID? : number, uObjectStateToServe? : number);
        /**
         * @param pbActionOnResult        pbActionOnResult.Value :  boolean
         * @param ppSelector              ppSelector.Value :        IMcConditionalSelector
         * @param puPropertyID            puPropertyID.Value :      number
         */
        GetConditionalSelector(eActionType : IMcConditionalSelector.EActionType, pbActionOnResult : any,
		    ppSelector : any, puPropertyID? : any, uObjectStateToServe? : number);

    }
    namespace IMcObjectSchemeNode {
        enum ENodeKindFlags {
            ENKF_NONE, 
            ENKF_OBJECT_LOCATION, 
            ENKF_PHYSICAL_ITEM, 
            ENKF_SYMBOLIC_ITEM, 
            ENKF_ANY_ITEM, 
            ENKF_ANY_NODE
        }
    }

    interface IMcOverlay extends IMcBase {
            Remove();
            LoadObjectsFromFile(strFileName : string, pUserDataFactory? : IMcUserDataFactory) : IMcObject[];
            LoadObjects(abMemoryBuffer : Uint8Array, pUserDataFactory? : IMcUserDataFactory) : IMcObject[];
	        SaveAllObjects(eStorageFormat? : IMcOverlayManager.EStorageFormat, eVersion? : IMcOverlayManager.ESavingVersionCompatibility ) : Uint8Array;
            SaveObjects(pObjects : IMcObject[], eStorageFormat? : IMcOverlayManager.EStorageFormat, eVersion? : IMcOverlayManager.ESavingVersionCompatibility) : Uint8Array;
            LoadObjectsFromRawVectorData(Params : IMcRawVectorMapLayer.SParams, bClearObjectSchemesCache? : boolean)  : IMcObject[];
            GetObjectByID(uObjectID : number) : IMcObject;
	        GetObjects() : IMcObject[];
             /**
             * @param aProperties            array of fixed size IMcOverlay.EColorPropertyType.ECPT_NUM
             */
            SetColorOverriding(aProperties : IMcOverlay.SColorPropertyOverriding[], pMapViewport? : IMcMapViewport)
            GetColorOverriding(pMapViewport? : IMcMapViewport): IMcOverlay.SColorPropertyOverriding[];
            GetOverlayManager() : IMcOverlayManager;
            GetCollections() : IMcCollection[];
            SetState(StateOrStatesArray : number | Uint8Array, pMapViewport? : IMcMapViewport);
            GetState(pMapViewport? : IMcMapViewport) : Uint8Array;
            SetID(uID : number);
	        GetID() : number;
            SetUserData(pUserData : IMcUserData);
            GetUserData() : IMcUserData;
            SetDrawPriority(nPriority : number, pMapViewport? : IMcMapViewport);
            GetDrawPriority(pMapViewport : IMcMapViewport) : number;
            SetVisibilityOption(eVisibility : IMcConditionalSelector.EActionOptions, MapViewportOrArray? : IMcMapViewport | IMcMapViewport[]);
            GetVisibilityOption(pMapViewport? : IMcMapViewport) : IMcConditionalSelector.EActionOptions;
            GetEffectiveVisibilityInViewport(pMapViewport : IMcMapViewport) : boolean;
            SetConditionalSelector(eActionType : IMcConditionalSelector.EActionType, bActionOnResult : boolean, pSelector : IMcConditionalSelector);
             /**
             * @param pbActionOnResult      pbActionOnResult.Value :  boolean
             * @param ppSelector            ppSelector.Value :        IMcConditionalSelector
             */
            GetConditionalSelector(eActionType : IMcConditionalSelector.EActionType , pbActionOnResult : any, ppSelector : any);
	        SetSubItemsVisibility(auSubItemsIDs : Uint32Array, bVisibility : boolean, pMapViewport? : IMcMapViewport);
            /**
             * @param bVisibility        bVisibility.Value :    boolean
             */
            GetSubItemsVisibility(bVisibility : any, pMapViewport? : IMcMapViewport) : Uint32Array;
            SetDetectibility(bDetectibility : boolean, pMapViewport? : IMcMapViewport);
            GetDetectibility(pMapViewport : IMcMapViewport) : boolean;
            SetState(StateOrStatesArray : number | Uint8Array, pMapViewport? : IMcMapViewport);
            GetState(pMapViewport? : IMcMapViewport) : Uint8Array;
        }
    namespace IMcOverlay {
        function Create(overlayManager : IMcOverlayManager) : IMcOverlay;
        enum EColorComponentFlags {
            ECCF_NONE, 
            ECCF_REPLACE_RGB, 
            ECCF_REPLACE_ALPHA, 
            ECCF_ADD_RGB, 
            ECCF_SUB_RGB,
            ECCF_ADD_ALPHA, 
            ECCF_SUB_ALPHA, 
            ECCF_MODULATE_RGB, 
            ECCF_MODULATE_ALPHA, 
            ECCF_POSTPROCESS_ADD_RGB,
            ECCF_POSTPROCESS_SUB_RGB, 
            ECCF_RGB_FLAGS, 
            ECCF_ALPHA_FLAGS
        }

        enum EColorPropertyType {
            ECPT_LINE, 
            ECPT_FILL, 
            ECPT_TEXT, 
            ECPT_TEXT_BACKGROUND, 
            ECPT_PICTURE,
            ECPT_SIGHT_SEEN,
            ECPT_SIGHT_UNSEEN,
            ECPT_SIGHT_UNKNOWN,
            ECPT_SIGHT_OUT_OF_QUERY_AREA,
            ECPT_SIGHT_SEEN_STATIC_OBJECT,
            ECPT_LINE_OUTLINE, 
            ECPT_TEXT_OUTLINE, 
            ECPT_MANUAL_GEOMETRY, 
            ECPT_NUM
        }

        class SColorPropertyOverriding {
            constructor();
            Color : SMcBColor;
            uColorComponentsBitField : number;
            bEnabled : boolean;
          }
    }

    interface IMcOverlayManager extends IMcBase {
        	GetViewportsIDs() : Uint8Array;
    	    GetOverlayByID(uOverlayID : number) : IMcOverlay;
	        GetOverlays() : IMcOverlay[];
	        GetCollections() : IMcCollection[];
	        SetCollectionsMode(eCollectionsMode : IMcOverlayManager.ECollectionsMode, pMapViewport? : IMcMapViewport);
	        GetCollectionsMode(pMapViewport? : IMcMapViewport) : IMcOverlayManager.ECollectionsMode;
	        SetObjectSchemeLock(pObjectScheme : IMcObjectScheme, bLocked : boolean);
	        IsObjectSchemeLocked(pObjectScheme : IMcObjectScheme) : boolean;
	        GetObjectSchemeByID(uObjectSchemeID : number) : IMcObjectScheme;
            GetObjectSchemeByName(strObjectSchemeName : string) : IMcObjectScheme;
            GetObjectSchemes() : IMcObjectScheme[];
	        SaveAllObjectSchemes(eStorageFormat? : IMcOverlayManager.EStorageFormat, eVersion? : IMcOverlayManager.ESavingVersionCompatibility) : Uint8Array;
            SaveObjectSchemes(pSchemes : IMcObjectScheme[], eStorageFormat? : IMcOverlayManager.EStorageFormat, 
                eVersion?: IMcOverlayManager.ESavingVersionCompatibility) : Uint8Array;
            /** 
            * @param pbObjectDataDetected                   pbObjectDataDetected.Value :         boolean
            */
            LoadObjectSchemesFromFile(strFileName : string, pUserDataFactory? : IMcUserDataFactory, pbObjectDataDetected? : any) : IMcObjectScheme[];
            /** 
            * @param pbObjectDataDetected                   pbObjectDataDetected.Value :         boolean
            */
			LoadObjectSchemes(abMemoryBuffer : Uint8Array, pUserDataFactory? : IMcUserDataFactory, pbObjectDataDetected? : any) : IMcObjectScheme[];
            SetConditionalSelectorLock(pSelector: IMcConditionalSelector, bLocked: boolean);
            IsConditionalSelectorLocked(pSelector: IMcConditionalSelector): boolean;
            GetConditionalSelectorByID(uSelectorID: number): IMcConditionalSelector;
            GetConditionalSelectorByName(strSelectorName: string): IMcConditionalSelector;
            GetConditionalSelectors(): IMcConditionalSelector[];
           	SetItemSizeFactors(eSizeTypesBitField : number, fSizeFactor : number, pMapViewport? : IMcMapViewport, bVectorItems? : boolean);
	        GetItemSizeFactor(eSizeType : IMcOverlayManager.ESizePropertyType, pMapViewport? : IMcMapViewport, bVectorItems? : boolean) : number;
            SetScaleFactor(fScaleFactor: number, pMapViewport?: IMcMapViewport);
            GetScaleFactor(pMapViewport?: IMcMapViewport): number;
            SetState(StateOrStatesArray : number | Uint8Array, pMapViewport? : IMcMapViewport);
            GetState(pMapViewport? : IMcMapViewport) : Uint8Array;
           	SetScreenArrangement(pMapViewport : IMcMapViewport, apObjects : IMcObject[]);
	        CancelScreenArrangements(pMapViewport : IMcMapViewport);
            SetEquidistantAttachPointsMinScale(fMinScale : number, pMapViewport? : IMcMapViewport);
            GetEquidistantAttachPointsMinScale(pMapViewport? :  IMcMapViewport) : number;
            SetScreenTerrainItemsConsistencyScaleSteps(afScaleSteps: Float32Array);
            GetScreenAttachedConsistencyScaleSteps(): Float32Array;
            SetCancelScaleMode(uModeBitField : number, pMapViewport? : IMcMapViewport);
	        GetCancelScaleMode(pMapViewport? : IMcMapViewport) : number;
            SetMoveIfBlockedMode(bMoveIfBlocked : boolean , pMapViewport? : IMcMapViewport);
            GetMoveIfBlockedMode(pMapViewport? : IMcMapViewport) : boolean;
            SetBlockedTransparencyMode(bBlockedTransparency : boolean, pMapViewport? : IMcMapViewport);
            GetBlockedTransparencyMode(pMapViewport? : IMcMapViewport) : boolean;
            SetTopMostMode(bTopMost : boolean, pMapViewport? : IMcMapViewport);
            GetTopMostMode(pMapViewport? : IMcMapViewport) : boolean;
	        GetCoordinateSystemDefinition() : IMcGridCoordinateSystem;
            ConvertWorldToImage(WorldPoints : SMcVector3D[], pImageCalc : IMcImageCalc) : SMcVector3D[];
            ConvertImageToWorld(ImagePoints : SMcVector3D[], pImageCalc : IMcImageCalc) : SMcVector3D[];

    }
    namespace IMcOverlayManager {
        function Create(pCoordinateSystem : IMcGridCoordinateSystem) : IMcOverlayManager;
        enum ESavingVersionCompatibility {
            ESVC_7_6_1,	
            ESVC_7_7_3,	
            ESVC_7_7_7,	
            ESVC_7_7_8,	
            ESVC_7_7_9,	
            ESVC_7_7_10,
            ESVC_7_7_11,
            ESVC_7_8_1,	
            ESVC_7_8_2,	
            ESVC_7_8_3,	
            ESVC_7_8_4,	
            ESVC_7_9_0,	
            ESVC_7_9_1,	
            ESVC_7_9_3,	
            ESVC_7_9_4,	
            ESVC_7_9_5,
            ESVC_7_9_6,
            ESVC_7_9_7,
            ESVC_7_10_0,
            ESVC_7_11_2,
            ESVC_7_11_3,
            ESVC_7_11_4,
            ESVC_7_11_5,
            ESVC_LATEST
        }
        enum EStorageFormat {
            ESF_MAPCORE_BINARY, 
            ESF_JSON
        }
        enum ECollectionsMode {
            ECM_OR,
            ECM_AND
        }
        enum ESizePropertyType {
            ESPT_LINE_WIDTH, 
            ESPT_LINE_OUTLINE_WIDTH, 
            ESPT_TEXT_SCALE, 
            ESPT_TEXT_OUTLINE_WIDTH, 
            ESPT_TEXT_MARGIN,
            ESPT_PICTURE_SIZE,
            ESPT_FILL_TEXTURE_SCALE,
            ESPT_ARROW, ESPT_ELLIPSE_ARC_RADIUS,
            ESPT_RECTANGLE_RADIUS, 
            ESPT_LINE_EXPANSION_RADIUS,
            ESPT_MANUAL_GEOMETRY, 
            ESPT_OFFSET, 
            ESPT_EQUIDISTANT_DISTANCE, 
            ESPT_ALL_LINE, 
            ESPT_ALL_TEXT, 
            ESPT_ALL_RADIUS, 
            ESPT_ALL
        }
    }

    interface IMcPhysicalItem extends IMcObjectSchemeItem {
        	Clone(pObject? : IMcObject) : IMcPhysicalItem;
            Connect(pParentNode : IMcObjectSchemeNode);
            SetAttachPoint(uAttachPoint : number, uPropertyID? : number, uObjectStateToServe? : number);
            /**
            * @param puAttachPoint   puAttachPoint.Value :  number
            * @param puPropertyID    puPropertyID.Value :   number 
            */
            GetAttachPoint(puAttachPoint : any, puPropertyID? : any, uObjectStateToServe? : number);
            SetOffset(Offset : SMcFVector3D, uPropertyID? : number, uObjectStateToServe? : number);
            /**
            * @param pOffset         pOffset.Value :        SMcFVector3D
            * @param puPropertyID    puPropertyID.Value :   number 
            */
            GetOffset(pOffset : SMcFVector3D, puPropertyID? : any, uObjectStateToServe? : number);
            SetRotation(Rotation : SMcRotation, uPropertyID? : number);
            /**
            * @param puPropertyID      puPropertyID.Value :   number 
            */
            GetRotation(puPropertyID? : any) : SMcRotation;
            GetCurrRotation(pMapViewport : IMcMapViewport, pObject : IMcObject, bRelativeToParentRotation : boolean, SMcRotation : any) : SMcRotation;
            GetCurrRotation(pMapViewport : IMcMapViewport, uPropertyID : number, pObject :IMcObject, bRelativeToParentRotation : boolean) : SMcRotation;
            SetInheritsParentRotation(bInheritsParentRotation : boolean, uPropertyID? : number);
            /**
            * @param puPropertyID      puPropertyID.Value :   number 
            */
            GetInheritsParentRotation(puPropertyID? : any) : boolean;
            SetColorModulateEffect(pObject : IMcObject, Color : SMcFColor, fFadeTimeMS : number);
            /**
            * @param pColor            pColor.Value :   SMcFColor 
            * @param pfFadeTimeMS      pfFadeTimeMS.Value :   number 
            */
            GetColorModulateEffect(pObject : IMcObject, pColor : any, pfFadeTimeMS : any) : boolean;
            RemoveColorModulateEffect(pObject : IMcObject);
            SetWireFrameEffect(pObject : IMcObject, Color : SMcFColor, fFadeTimeMS : number, bWireFrameOnly : boolean);
            /**
            * @param pbEnabled            pbEnabled.Value :         boolean 
            * @param pColor               pColor.Value :            SMcFColor 
            * @param pfFadeTimeMS         pfFadeTimeMS.Value :      number 
            * @param pbWireFrameOnly      pbWireFrameOnly.Value :   boolean 
            */
            GetWireFrameEffect(pObject : IMcObject, pbEnabled : any, pColor : any, pfFadeTimeMS : any, pbWireFrameOnly : any);
            RemoveWireFrameEffect(pObject : IMcObject);
    }  

    interface IMcEmptyPhysicalItem extends IMcPhysicalItem {}
    namespace IMcEmptyPhysicalItem {
        function Create() : IMcEmptyPhysicalItem;
        var NODE_TYPE;
    }
    
    interface IMcLightBasedItem extends IMcPhysicalItem {
        SetDiffuseColor(DiffuseColor : SMcFColor, uPropertyID? : number, uObjectStateToServe? : number);
        /**
        * @param puPropertyID      puPropertyID.Value :   number 
        */
        GetDiffuseColor(puPropertyID? : any, uObjectStateToServe? : number) : SMcFColor;
        SetSpecularColor(DiffuseColor : SMcFColor, uPropertyID? : number, uObjectStateToServe? : number);
        /**
        * @param puPropertyID      puPropertyID.Value :   number 
        */
        GetSpecularColor(puPropertyID? : any, uObjectStateToServe? : number) : SMcFColor;
    }

    interface IMcLocationBasedLightItem extends IMcLightBasedItem {
        SetAttenuation(Attenuation : SMcAttenuation, uPropertyID? : number, uObjectStateToServe? : number);
        /**
        * @param puPropertyID      puPropertyID.Value :   number 
        */
        GetAttenuation(puPropertyID? : any, uObjectStateToServe? : number) : SMcAttenuation;
    }

    interface IMcParticleEffectItem extends IMcPhysicalItem {
        Clone(pObject? : IMcObject) : IMcParticleEffectItem;
        SetEffectName(strEffectName : string, uPropertyID? : number, uObjectStateToServe? : number);
        /**
        * @param pstrEffectName         pstrEffectName.Value : string
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetEffectName(pstrEffectName : any, puPropertyID? : any, uObjectStateToServe? : number);
        SetState(eState : IMcParticleEffectItem.EState,	uPropertyID ? : number,	uObjectStateToServe ? : number);
        /**
        * @param peState                peState.Value :        IMcParticleEffectItem.EState
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetState(peState : any, puPropertyID? : any, uObjectStateToServe? : any);
        SetStartingTimePoint(fSeconds : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
        * @param pfSeconds              pfSeconds.Value :      number
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetStartingTimePoint(pfSeconds : any, puPropertyID? : any, uObjectStateToServe? : number);
        SetStartingDelay(fSeconds : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
        * @param pfSeconds              pfSeconds.Value :      number
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetStartingDelay(pfSeconds : any, puPropertyID? : any, uObjectStateToServe? : number);
        SetSamplingStep(fSeconds : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
        * @param pfSeconds              pfSeconds.Value :      number
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetSamplingStep(pfSeconds : any, puPropertyID? : any, uObjectStateToServe? : number);
        SetTimeFactor(fFactor : number, uPropertyID : number, uObjectStateToServe? : number);
        /**
        * @param pfSeconds              pfSeconds.Value :      number
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetTimeFactor(pfFactor : any, puPropertyID? : any, uObjectStateToServe? : number);
        SetParticleVelocity(fVelocity : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
        * @param pfVelocity             pfVelocity.Value :     number
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetParticleVelocity(pfVelocity : any, puPropertyID? : any, uObjectStateToServe? : number);
        SetParticleDirection(Direction : SMcFVector3D, uPropertyID? : number, uObjectStateToServe? : number);
        /**
        * @param pDirection             pDirection.Value :     SMcFVector3D
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetParticleDirection(pDirection : any, puPropertyID? : number, uObjectStateToServe? : number);
        SetParticleAngle(fAngleDegrees : number, uPropertyID? : number,	uObjectStateToServe? : number);
        /**
        * @param pfAngleDegrees         pDirection.Value :     number
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetParticleAngle(pfAngleDegrees : any, puPropertyID? : any, uObjectStateToServe? : number);
        SetParticleEmissionRate(fEmissionRate : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
        * @param pfEmissionRate         pfEmissionRate.Value : number
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetParticleEmissionRate(pfEmissionRate : any, puPropertyID? : any, uObjectStateToServe? : number);
        SetTimeToLive(fSeconds : number, uPropertyID? : number,	uObjectStateToServe? : number);
        /**
        * @param pfSeconds              pfSeconds.Value :      number
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetTimeToLive(pfSeconds : any, puPropertyID? : any, uObjectStateToServe? : number);
    }
     namespace IMcParticleEffectItem {
        function Create(strEffectName : string) : IMcParticleEffectItem;
        enum EState {
            ES_STOPPED, 
            ES_RUNNING, 
            ES_PAUSED
        }
        var NODE_TYPE;
    }

     interface IMcMeshItem extends IMcPhysicalItem {
        Clone(pObject? : IMcObject) : IMcMeshItem;
        SetMesh(pMesh : IMcMesh, uPropertyID? : number, uObjectStateToServe? : number);
        /**
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetMesh(puPropertyID? : any, uObjectStateToServe? : number) : IMcMesh;
        SetAnimation(Animation : SMcAnimation, uPropertyID? : number);
        /**
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetAnimation(puPropertyID? : any) : SMcAnimation;
	    GetAnimationStates(pObject : IMcObject) : IMcAnimationState[];
        SetCastShadows(bCastShadows : boolean, uPropertyID? : number, uObjectStateToServe? : number);
        /**
        * @param pbCastShadows          pbCastShadows.Value :  bool
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetCastShadows(pbCastShadows : any, puPropertyID? : any, uObjectStateToServe? : number);
        SetSubPartOffset(uAttachPointID : number, Offset : SMcFVector3D, uPropertyID? : number, uObjectStateToServe? : number);
        /**
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetSubPartOffset(uAttachPointID: number, puPropertyID?: any, uObjectStateToServe?: number) : SMcFVector3D;
        SetSubPartRotation(uAttachPointID : number, Rotation : SMcRotation, uPropertyID? : number);
        /**
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetSubPartRotation(uAttachPointID : number, puPropertyID? : any): SMcRotation;
        GetSubPartCurrRotation(pMapViewport : IMcMapViewport, pObject : IMcObject, uAttachPointID : number, bRelativeToMeshRotation : boolean) : SMcRotation;
        SetSubPartInheritsParentRotation(uAttachPointID : number, bInheritsParentRotation : boolean, uPropertyID? : number);
        /**
        * @param puPropertyID               puPropertyID.Value :                number 
        */
        GetSubPartInheritsParentRotation(uAttachPointID : number, puPropertyID? : any) : boolean;
        SetTextureScrollSpeed(uMeshTextureID : number, ScrollSpeed :  SMcFVector2D, uPropertyID? :number, uObjectStateToServe? : number);
        /**
        * @param puPropertyID               puPropertyID.Value :    number 
        */
        GetTextureScrollSpeed(uMeshTextureID : number, puPropertyID?: any, uObjectStateToServe? : number) : SMcFVector2D;
        SetBasePointAlignment(eBasePointAlignment : IMcMeshItem.EBasePointAlignment, uPropertyID? : number, uObjectStateToServe? : number);
        /**
        * @param puPropertyID               puPropertyID.Value :           number 
        */
        GetBasePointAlignment(puPropertyID? : any, uObjectStateToServe? : any) : IMcMeshItem.EBasePointAlignment;
        GetParticipationInTerrainHeight() : boolean;
        GetStatic() : boolean;
        GetDisplayingItemsAttachedToTerrain() : boolean;
    }    
    namespace IMcMeshItem {
        function Create(pMesh : IMcMesh, eBasePointAlignment? : IMcMeshItem.EBasePointAlignment, bParticipateInTerrainHeight? : boolean,
		    bCastShadows? : boolean, bStatic? : boolean, bDisplayItemsAttachedToTerrain? : boolean) : IMcMeshItem;
        function GetSubPartCurrRotation(pMapViewport : IMcMapViewport, uPropertyID : number, pObject : IMcObject, bRelativeToMeshRotation : boolean) : SMcRotation;

        enum EBasePointAlignment {
            EBPA_MESH_ZERO, 
            EBPA_MESH_ZERO_LOWERED, 
            EBPA_BOUNDING_BOX_CENTER, 
            EBPA_BOUNDING_BOX_CENTER_LOWERED
        }
        var NODE_TYPE;
    }

     interface IMcProjectorItem extends IMcPhysicalItem {
         Clone(pObject? : IMcObject) : IMcProjectorItem;
         SetTexture(pTexture : IMcTexture, uPropertyID? : number, uObjectStateToServe? : number);
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetTexture(puPropertyID? : any, uObjectStateToServe? : number) : IMcTexture;
         IsUsingTextureMetadata() : boolean;
         SetFieldOfView(fHalfFieldOfViewHorizAngle : number, uPropertyID? : number, uObjectStateToServe? : number);
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetFieldOfView(puPropertyID? : any, uObjectStateToServe? : number) : number;
         SetAspectRatio(fAspectRatio : number, uPropertyID? : number, uObjectStateToServe? : number);
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetAspectRatio(puPropertyID? : any, uObjectStateToServe? : number) : number;
         SetTargetTypes(uTargetTypesBitField : number, uPropertyID? : number, uObjectStateToServe? : number);
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetTargetTypes(puPropertyID? : any, uObjectStateToServe? : number) : number;
         SetProjectionBorders(fLeft : number, fTop : number, fRight : number, fBottom : number);
         /**
         * @param pfLeft           pfLeft.Value :   number 
         * @param pfTop            pfTop.Value :    number 
         * @param pfRight          pfRight.Value :  number 
         * @param pfBottom         pfBottom.Value : number 
         */
         GetProjectionBorders(pfLeft : any, pfTop : any, pfRight : any, pfBottom : any)
     }
     namespace IMcProjectorItem {
         function Create(pDefaultTexture : IMcTexture, fDefaultHalfFieldOfViewHorizAngle : number, fDefaultAspectRatio : number, uDefaultTargetTypesBitField? : number, bUseVideoTextureMetadata? : boolean) : IMcProjectorItem;
         enum ETargetTypesFlags {
            ETTF_NONE, ETTF_DTM, 
            ETTF_STATIC_OBJECTS, 
            ETTF_MESHES, 
            ETTF_TERRAIN_OBJECTS,
            ETTF_UNBLOCKED_ONLY
         }
         var NODE_TYPE;
     }

     interface IMcSoundItem extends IMcPhysicalItem {
         Clone(pObject? : IMcObject) : IMcSoundItem;
         SetSoundName(strSoundName : string, uPropertyID? : number, uObjectStateToServe? : number);
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetSoundName(puPropertyID? : any, uObjectStateToServe? : number ) : string;
         SetState(eState : IMcSoundItem.EState, uPropertyID? : number, uObjectStateToServe? : number);
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetState(puPropertyID? : any, uObjectStateToServe? : number) : IMcSoundItem.EState;
         SetStartingTimePoint(fSeconds : number, uPropertyID? : number, uObjectStateToServe? : number);
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetStartingTimePoint(puPropertyID? : any, uObjectStateToServe? : number) : number;
         SetTimePoint(fSeconds : number, uPropertyID? : number, uObjectStateToServe? : number);
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetTimePoint(puPropertyID? : any, uObjectStateToServe? : number) : number;
         GetCurrTimePoint(pMapViewport : IMcMapViewport, pObject : IMcObject) : number;
         SetLoop(bLoop : boolean, uPropertyID? : number, uObjectStateToServe? : number);
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetLoop(puPropertyID? : any, uObjectStateToServe? : number) : boolean;
         SetVolume(fVolume : number, uPropertyID? : number, uObjectStateToServe? : number);
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetVolume(puPropertyID? : any, uObjectStateToServe? : number) : number;
         SetMinVolume(fMinVolume : number, uPropertyID? : number, uObjectStateToServe? : number);
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetMinVolume(puPropertyID? : any, uObjectStateToServe? : number) : number;
         SetMaxVolume(fMaxVolume : number, uPropertyID? : number, uObjectStateToServe? : number);
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetMaxVolume(puPropertyID? : any, uObjectStateToServe? : number) : number;
         SetRollOffFactor(fRollOffFactor : number, uPropertyID? : number, uObjectStateToServe? : number);
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetRollOffFactor(puPropertyID? : any, uObjectStateToServe? : number) : number;
         SetMaxDistance(fMaxDistance : number, uPropertyID? : number, uObjectStateToServe? : number);
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetMaxDistance(puPropertyID? : any, uObjectStateToServe? : number) : number;
         SetHalfVolumeDistance(fHalfVolumeDistance : number, uPropertyID? : number, uObjectStateToServe? : number);
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetHalfVolumeDistance(puPropertyID? : any, uObjectStateToServe? : number) : number;
         SetHalfOuterAngle(fHalfOuterAngle : number, uPropertyID? : number, uObjectStateToServe? : number);
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetHalfOuterAngle(puPropertyID? : any, uObjectStateToServe? : number) : number;
         SetHalfInnerAngle(fHalfInnerAngle : number, uPropertyID? : number, uObjectStateToServe? : number);
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
        GetHalfInnerAngle(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetOuterAngleVolume(fOuterAngleVolume : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetOuterAngleVolume(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetVelocity(Velocity : SMcFVector3D, uPropertyID? : number, uObjectStateToServe? : number);
        /**
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetVelocity(puPropertyID? : any, uObjectStateToServe? : number) : SMcFVector3D;
        SetPitch(fPitch : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetPitch(puPropertyID? : any, uObjectStateToServe? : number) : number;
     }
     namespace IMcSoundItem {
         function Create(strSoundName : string) : IMcSoundItem;
         function GetCurrTimePoint(pMapViewport : IMcMapViewport, uPropertyID : number, pObject : IMcObject);
         enum EState {
             ES_STOPPED, 
             ES_RUNNING, 
             ES_PAUSED, 
             ES_FADE_IN, 
             ES_FADE_OUT
         }
         var NODE_TYPE;
     }

    interface IMcPointLightItem extends IMcLocationBasedLightItem {
        Clone(pObject? : IMcObject) : IMcPointLightItem;
    }
    namespace IMcPointLightItem {
        function Create(DefaultDiffusColor? : SMcFColor, DefaultSpecularColor? : SMcFColor, DefaultAttenuation? : SMcAttenuation) : IMcPointLightItem;
        var NODE_TYPE;
    }

    interface IMcSpotLightItem extends IMcLocationBasedLightItem {
        Clone(pObject? : IMcObject) : IMcSpotLightItem;
        SetDirection(Direction : SMcFVector3D, uPropertyID? : number, uObjectStateToServe? : number);
        /**
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetDirection(puPropertyID? : any, uObjectStateToServe? : number) : SMcFVector3D;
        SetHalfOuterAngle(fHalfOuterAngle : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetHalfOuterAngle(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetHalfInnerAngle(fHalfInnerAngle : number, uPropertyID? : number, uObjectStateToServe? : number);
        /**
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetHalfInnerAngle(puPropertyID? : any, uObjectStateToServe? : number) : number;
    }
    namespace IMcSpotLightItem {
        function Create(DefaultDiffusColor? : SMcFColor, DefaultSpecularColor? : SMcFColor, DefaultAttenuation? : SMcAttenuation, DefaultDirection? : SMcFVector3D, fDefaultHalfOuterAngle? : number, fDefaultHalfInnerAngle? : number) : IMcSpotLightItem;
        var NODE_TYPE;
    }

    interface IMcDirectionalLightItem extends IMcLightBasedItem {
        Clone(pObject? : IMcObject) : IMcDirectionalLightItem;
        SetDirection(Direction : SMcFVector3D, uPropertyID? : number, uObjectStateToServe? : number);
        /**
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetDirection(puPropertyID? : any, uObjectStateToServe? : number) : SMcFVector3D;
    }
    namespace IMcDirectionalLightItem {
        function Create(DefaultDiffusColor? : SMcFColor, DefaultSpecularColor? : SMcFColor, DefaultDirection? : SMcFVector3D) : IMcDirectionalLightItem;
        var NODE_TYPE;
    }

    interface IMcAnimationState extends IMcBase {
        Remove();
        AttachToAnimation(strAnimationName : string, bLoop? : boolean, fTimePoint? : number, fTimeDelay? : number, fSpeedFactor? : number, fWeight? : number, fLength? : number);
        GetAttachedAnimation() : string;
        GetObject() : IMcObject;
	    GetMeshItem() : IMcMeshItem;
        SetEnabled(bEnabled : boolean);
        GetEnabled() : boolean;
        SetTimePoint(fTimePoint : number);
        GetTimePoint() : number;
        SetWeight(fWeight : number, fChangeDuration? : number);
        GetWeight() : number;
        SetAttachPointsWeights(afWeights : Float32Array, fChangeDuration? : number);
	    GetAttachPointsWeights() : Float32Array;
	    SetLength(fLength : number);
        GetLength() : number;
        SetLoop(bLoop : boolean);
        GetLoop() : boolean;
        SetSpeedFactor(fSpeedFactor : number);
        GetSpeedFactor() : number;
	    HasEnded() : boolean;
    }
    namespace IMcAnimationState {
        function Create(pObject : IMcObject, MeshItemOrMeshID : IMcMeshItem | number, strAnimationName? : string,
		bLoop? : boolean, fTimePoint? : number, fTimeDelay? : number, fSpeedFactor? : number, fWeight? : number, fLength? : number) : IMcAnimationState;
    }

    interface IMcProperty  {}
    namespace IMcProperty {
        enum EPredefinedPropertyIDs {
            EPPI_FIRST_RESERVED_ID, 
            EPPI_SHARED_PROPERTY_ID, 
            EPPI_NO_STATE_PROPERTY_ID, 
            EPPI_NO_MORE_STATE_PROPERTIES_ID
        }

        enum EPropertyType {
            EPT_BOOL, 
            EPT_BYTE,
            EPT_INT, 
            EPT_UINT,
            EPT_FLOAT,
            EPT_DOUBLE,
            EPT_FVECTOR2D,
            EPT_VECTOR2D,
            EPT_FVECTOR3D,
            EPT_VECTOR3D,
            EPT_BCOLOR,
            EPT_FCOLOR,
            EPT_ATTENUATION,
            EPT_STRING,
            EPT_TEXTURE,
            EPT_FONT,
            EPT_MESH,
            EPT_CONDITIONALSELECTOR,
            EPT_ROTATION,
            EPT_ANIMATION,
            EPT_SUBITEM_ARRAY,
            EPT_INT_ARRAY,
            EPT_UINT_ARRAY,
            EPT_FVECTOR2D_ARRAY,
            EPT_VECTOR2D_ARRAY,
            EPT_FVECTOR3D_ARRAY,
            EPT_VECTOR3D_ARRAY,
            EPT_BCOLOR_ARRAY,
            EPT_NUM
        }

        class SVariantProperty {
            constructor();
            uID : number;
            eType : EPropertyType;
            Value : any;
        }

        class SPropertyID {
            constructor();
            uID : number;
            eType : IMcProperty.EPropertyType;
        }

        class SPropertyName {
            constructor();
            strName : string;
            uID : number;
        }

        class SArrayPropertySMcSubItemData {
            constructor();
            constructor(aElements : SMcSubItemData[]);
            aElements : any;
        }
        class SArrayPropertyInt {
            constructor();
            constructor(aElements : Int32Array);
            aElements : any;
        }
        class SArrayPropertyUint {
            constructor();
            constructor(aElements : Uint32Array);
            aElements : any;
        }
        class SArrayPropertySMcFVector2D {
            constructor();
            constructor(aElements : SMcFVector2D[]);
            aElements : any;
        }
        class SArrayPropertySMcVector2D {
            constructor();
            constructor(aElements : SMcVector2D[]);
            aElements : any;
        }
        class SArrayPropertySMcFVector3D {
            constructor();
            constructor(aElements : SMcFVector3D[]);
            aElements : any;
        }
        class SArrayPropertySMcVector3D {
            constructor();
            constructor(aElements : SMcVector3D[]);
            aElements : any;
        }
        class SArrayPropertySMcBColor {
            constructor();
            constructor(aElements : SMcBColor[]);
            aElements : any;
        }
    }

////////////////////////////////////////////////////////////////////////////////////////
// Calculations

    interface IMcImageCalc extends IMcBase {
        GetSpatialQueries() : IMcSpatialQueries;
        WorldCoordToImagePixel(WorldCoord : SMcVector3D): SMcVector2D;
         /**
         * @param pbDTMAvailable              pbDTMAvailable.Value :        boolean 
         * @param peIntersectionStatus        peIntersectionStatus.Value :  IMcErrors.ECode 
         */
        ImagePixelToCoordWorld(ImagePixel : SMcVector2D, pbDTMAvailable? : any, peIntersectionStatus? : any, pAsyncQueryCallback? : IMcSpatialQueries.IAsyncQueryCallback) : SMcVector3D;
         /**
         * @param peIntersectionStatus        peIntersectionStatus.Value :  IMcErrors.ECode  
         */
        ImagePixelToCoordWorldOnHorzPlane(ImagePixel : SMcVector2D, dPlaneHeight : number, peIntersectionStatus? : any) : SMcVector3D;
        /**
         * @param peIntersectionStatus        peIntersectionStatus.Value :  IMcErrors.ECode  
         */
        ImagePixelToCoordWorldWithCache(ImagePixel : SMcVector2D, peIntersectionStatus? : any, pAsyncQueryCallback? : IMcSpatialQueries.IAsyncQueryCallback) : SMcVector3D;
        WorldCoordToImagePixelWithCache(WorldCoord : SMcVector3D) : SMcVector2D;
        /**
         * @param worldCoords                 worldCoords.Value :            SMcVector3D
         * @param successfulWorldCoords       successfulWorldCoords.Value :  boolean  
         */
        TwoImagesPixelsToWorldCoords(numberOfcorrelatedPixels : number, thisImagePixels : SMcVector2D[], otherImagePixels : SMcVector2D[], otherImageCalc : IMcImageCalc, worldCoords : SMcVector3D[], successfulWorldCoords : boolean[]);
	    /**
         * @param pRayOrigin                pRayOrigin.Value :      SMcVector3D
         * @param pRayDirection             pRayDirection.Value :   SMcVector3D  
         */
        ImageToWorldRay(ImagePixel : SMcVector2D, pRayOrigin : any, pRayDirection : any);
	    IsWorldCoordVisible(WorldCoord : SMcVector3D, pAsyncQueryCallback? : IMcSpatialQueries.IAsyncQueryCallback) : boolean;
	    CalcRPC(nPixelDensity : number) : IMcImageCalc.SRationalPolynomialCoefficients;
        CalculateHeightAboveGround(stGroundPixel : SMcVector2D, stUpperPixel : 	SMcVector2D) : number;
        CalculateBoxVolume(stBasePixel : SMcVector2D, stTopOfBasePixel : SMcVector2D, stTopPixel1 : SMcVector2D, stTopPixel2 : SMcVector2D) : number;
        GetHeight(x : number, y : number, pAsyncQueryCallback? : IMcSpatialQueries.IAsyncQueryCallback) : number;
        GetGeoImageFileName() : string;
        GetGridCoordSys() : IMcGridCoordinateSystem;
        GetLines() : number;
        GetSamples() : number;
        GetMinGSD() : number;
        GetMaxGSD() : number;
        GetWorkingAreaValid() : boolean;
        SetWorkingAreaValid(bWorkingAreaValid : boolean);
	    SetWorkingArea(arrWorkingArea : SMcVector3D[]);
        GetWorkingArea() : SMcVector3D
        IsInWorkingArea(WorldCoord : SMcVector3D) : boolean;
        GetPixelWorkingAreaValid () : boolean;
	    SetPixelWorkingAreaValid(bPixelWorkingAreaValid : boolean);
	    SetPixelWorkingArea(PixelWorkingAreaUpperLeft : SMcVector2D, PixelWorkingAreaLowerRight : SMcVector2D);
        /**
         * @param pPixelWorkingAreaUpperLeft            pPixelWorkingAreaUpperLeft.Value :      SMcVector2D
         * @param pPixelWorkingAreaLowerRight           pPixelWorkingAreaLowerRight.Value :     SMcVector2D  
         */
        GetPixelWorkingArea(pPixelWorkingAreaUpperLeft : any, pPixelWorkingAreaLowerRight : any);
		IsInPixelWorkingArea(PixelCoord : SMcVector2D) : boolean;
        GetDefaultHeight() : number;
        SetDefaultHeight(height : number);
        RegisterForImageCalcChanges(pImageCalcChange : IMcImageCalc.IImageCalcChangeCallBack);
        UnregisterForImageCalcChanges(pImageCalcChange : IMcImageCalc.IImageCalcChangeCallBack)

 }
    namespace IMcImageCalc {
        enum EImageType {
            EIT_NONE,		
            EIT_GALAXYAIDS,	
            EIT_LOROP,
            EIT_FRAME,		
            EIT_AFFINE,		
            EIT_ORTHO,	
            EIT_FRAME_MOSAIC,
            EIT_USER_DEFINED,
            EIT_NUM
        }
        class SRationalPolynomialCoefficients {
            dErrBias : number;					
            dErrRand : number;					
            adOffsets : Float64Array;				
            adScales : Float64Array;					
            adLineNumCoefficients : Float64Array;	
            adLineDenCoefficients : Float64Array;	
            adSampleNumCoefficients : Float64Array;	
            adSampleDenCoefficients : Float64Array;	
        }
        interface IImageCalcChangeCallBack {
            /** Mandatory */
            OnImageCalcChanged();
        }
        namespace IImageCalcChangeCallBack {
            function extend(strName : string, Class : any) : IImageCalcChangeCallBack;
        }
    }

    interface IMcAffineImageCalc extends IMcImageCalc {
        GetImageType() : IMcImageCalc.EImageType;
    }
    namespace IMcAffineImageCalc {
        function Create(strImageDataFileName : string, DtmMapLayerOrMapTerrains : IMcDtmMapLayer | IMcMapTerrain[], pGridCoordinateSystem : IMcGridCoordinateSystem) : IMcAffineImageCalc;
    }

    interface IMcFrameIC extends IMcImageCalc {
            SetCameraParams(stParams : IMcFrameIC.SCameraParams);
            GetCameraParams() : IMcFrameIC.SCameraParams;
            SetQueryMaxDistance(dMaxDistance : number);
            GetQueryMaxDistance() : number;
            /**
             * @param arrCenterAndCorners     array created by the user, allocated and filled by MapCore
             * @param arrRayStatus            array created by the user, allocated and filled by MapCore
             */
            GetCameraCornersAndCenter(bCalcHorizon : boolean, arrCenterAndCorners : SMcVector3D[], arrRayStatus : IMcFrameImageCalc.ERayStatus[], 
                pAsyncQueryCallback? : IMcSpatialQueries.IAsyncQueryCallback);
    }
    namespace IMcFrameIC {
        class SCameraParams
        {
            nPixelesNumX : number;
            nPixelesNumY : number;
            dCameraOpeningAngleX : number;
            dPixelRatio : number;			
            dCameraRoll : number;
            dCameraPitch : number;
            dCameraYaw : number;
            CameraLocation :SMcVector3D;
            dOffsetCenterPixelX : number;
            dOffsetCenterPixelY : number;
        }
    }

    interface IMcFrameImageCalc extends IMcFrameIC {
            GetImageType() : IMcImageCalc.EImageType;
              }
    namespace IMcFrameImageCalc {
        function Create(Params : IMcFrameIC.SCameraParams, DtmMapLayerOrMapTerrains : IMcDtmMapLayer | IMcMapTerrain[], pGridCoordinateSystem : IMcGridCoordinateSystem) : IMcFrameImageCalc;
        enum ERayStatus {
            ERS_Intersection,	
            ERS_HorizonPoint, 
            ERS_NoIntersection
        }
        class SCameraParams {
            constructor();
            nPixelesNumX : number;
            nPixelesNumY : number;
            dCameraOpeningAngleX : number;
            dPixelRatio : number;		
            dCameraRoll : number;
            dCameraPitch : number;
            dCameraYaw : number;
            CameraLocation : SMcVector3D;
            dOffsetCenterPixelX : number;
            dOffsetCenterPixelY : number;
        }
        
    }

    interface IMcUserDefinedImageCalc extends IMcImageCalc {
        SetQueryMaxDistance(dMaxDistance : number);
	    GetQueryMaxDistance() : number;
        CameraModelChanged();
    }
    namespace IMcUserDefinedImageCalc {
        function Create(pCallBack : IMcUserDefinedImageCalc.ICallback, DtmMapLayerOrMapTerrains : IMcDtmMapLayer | IMcMapTerrain, pGridCoordinateSystem : IMcGridCoordinateSystem) : IMcUserDefinedImageCalc;

        interface ICallback {
            /**
             * Mandatory
             * @param pRayOrigin                 pRayOrigin.Value :  SMcVector3D
             */
            ImageToRay(ImagePixel : SMcVector2D, pRayOrigin : any) : boolean;
            /**
             * Mandatory
             * @param pImagePixel                 pImagePixel.Value :  SMcVector2D
             */
            /** Mandatory */
            WorldCoordToImagePixel(WorldCoord : SMcVector3D, pImagePixel : any) : boolean;
            /** Mandatory */
            GetScale(WorldCoord : SMcVector3D) : number;
            /** Optional */
            Release();
        }
        namespace ICallback {
            function extend(strName : string, Class : any) : ICallback;
        }
    }

    interface IMcImageProcessing {
        SetFilterImageProcessing(pLayer : IMcRasterMapLayer, eOperation : IMcImageProcessing.EFilterProccessingOperation);
	    GetFilterImageProcessing(pLayer : IMcRasterMapLayer) : IMcImageProcessing.EFilterProccessingOperation;
        SetCustomFilter(pLayer : IMcRasterMapLayer, uFilterXsize : number, uFilterYsize : number, aFilter : Float64Array, fBias : number, fDivider : number);
        SetEnableColorTableImageProcessing(pLayer : IMcRasterMapLayer, bEnable : boolean);
        GetEnableColorTableImageProcessing(pLayer : IMcRasterMapLayer) : boolean;
        IsHistogramSet(pLayer : IMcRasterMapLayer) : boolean;
        SetOriginalHistogram(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, aHistogram : Float64Array);
        GetOriginalHistogram(pLayer : IMcRasterMapLayer, eColorChannelm : IMcImageProcessing.EColorChannel) : Float64Array;
        GetCurrentHistogram(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel) : Float64Array;
        SetUserColorValues(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, aColorValues : Uint8Array, bUse : boolean);
        GetUserColorValues(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, aColorValues : Uint8Array) : boolean;
        SetColorValuesToDefault(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel);
        GetCurrentColorValues(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel) : Float64Array;
        SetWhiteBalanceBrightness(pLayer : IMcRasterMapLayer, r : number, g : number, b : number);
        /**
         * @param pR                pR.Value : number
         * @param pG                pG.Value : number
         * @param pB                pB.Value : number
         */
        GetWhiteBalanceBrightness(pLayer : IMcRasterMapLayer, pR : any, pG : any, pB : any)
        SetColorTableBrightness(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, dBrightness : number);
	    GetColorTableBrightness(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel) : number;
        SetContrast(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, dContrast : number);
	    GetContrast(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel) : number;
        SetNegative(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, bUse : boolean);
	    GetNegative(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel) : boolean;
        SetGamma(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, dGamma : number);
	    GetGamma(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel);
        SetHistogramEqualization(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, bUse : boolean);
        GetHistogramEqualization(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel) : boolean;
        SetHistogramFit(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, bUse : boolean, aReferenceHistogram : Float64Array);
        GetHistogramFit(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, aReferenceHistogram : Float64Array) : boolean;
        SetHistogramNormalization(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, bUse : boolean, dMean? : number, dStandardDeviation? : number);
        /**
         * @param pdMean               pdMean.Value : number
         * @param pdStandardDeviation  pdStandardDeviation.Value : number
         */
        GetHistogramNormalization(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, pdMean : any, pdStandardDeviation : any) : boolean;
    }
    namespace IMcImageProcessing {
        enum EColorChannel {
            ECC_RED, 
            ECC_GREEN, 
            ECC_BLUE, 
            ECC_MULTI_CHANNEL
        }
        enum EFilterProccessingOperation {
            EFPO_NO_FILTER, 
            EFPO_SMOOTH_LOW, 
            EFPO_SMOOTH_MID, 
            EFPO_SMOOTH_HIGH, 
            EFPO_SHARP_LOW, 
            EFPO_SHARP_MID, 
            EFPO_SHARP_HIGH, 
            EFPO_CUSTOM_FILTER
        }
        type MC_COLORTABLE = Uint8Array;
        
    }

    interface IMcGeographicCalculations extends IMcDestroyable {
        CalcMagneticElements(Point : SMcVector3D, Date : Date) : IMcGeographicCalculations.SMagneticElements;
        SetCheckGridLimits(bCheckGridLimits : boolean);
        GetCheckGridLimits() : boolean;
        /**
         * @param pdAzimuth                 pdAzimuth.Value :  number
         * @param pdDistance                pdDistance.Value : number
         */
        AzimuthAndDistanceBetweenTwoLocations(SourceLocation : SMcVector3D, TargetLocation : SMcVector3D, pdAzimuth : any, pdDistance : any, bUseHeights? :boolean);
        LocationFromAzimuthAndDistance(SourceLocation : SMcVector3D, dAzimuth : number, dDistance : number, bUseHeights? : boolean) : SMcVector3D;
        ArcSample(sArc : IMcGeographicCalculations.SEllipseArc, uFullEllipseReqPoints : number, bIsGeometric? : boolean) : SMcVector3D[];
        IsPointInArc(Point : SMcVector3D, sArc : IMcGeographicCalculations.SEllipseArc) : boolean;
        LineSample(StartPoint : SMcVector3D, EndPoint : SMcVector3D, dMaxError : number) : SMcVector3D[];
        PolyLineLength(aLineVertices : SMcVector3D[], bUseHeights? : boolean) : number;
        /**
        * @param pdArea                     pdArea.Value :         number
        */
        PolygonSphericArea(aPolygonVertices : SMcVector3D[], dEarthLocalRadius : number, pdArea : any) : boolean;
        CalcLocalRadius(Point : SMcVector3D) : number;
        CalcLocalAzimuthRadius(Point : SMcVector3D, dAzimuth : number) : number;
        /**
         * @param pdSunAzimuth              pdSunAzimuth.Value :  number
         * @param pdSunElevation            pdSunElevation.Value : number
         */
        CalcSunDirection(nYear : number, nMonth : number, nDay : number, nHour : number, nMin : number, nSec : number, fTimeZone : number,
		    Location : SMcVector3D, pdSunAzimuth : any, pdSunElevation : any);
        LocationFromLocationAndVector(SourceLocation : SMcVector3D, dVectorLengthInMeters : number, dVectorAzimuth : number, dVectorElevation : number) : SMcVector3D;
        /**
         * @param pdVectorLengthInMeters    pdVectorLengthInMeters.Value :  number
         * @param pdVectorAzimuth           pdVectorAzimuth.Value : number
         * @param pdVectorElevation         pdVectorElevation.Value : number
         */
        VectorFromTwoLocations(SourceLocation : SMcVector3D, TargetLocation : SMcVector3D, pdVectorLengthInMeters : any,
            pdVectorAzimuth : any, pdVectorElevation : any);
        /**
         * @param pdRaysOriginDistance     pdRaysOriginDistance.Value :   number
         * @param pdRaysShortestDistance   pdRaysShortestDistance.Value : number
         * @param pLocation                pLocation.Value :              SMcVector3D
         */
        LocationFromTwoRays(FstRayOrigin : SMcVector3D,	FstRayOrientation : SMcVector3D, SndRayOrigin : SMcVector3D,	SndRayOrientation : SMcVector3D, 
            pdRaysOriginDistance : any,	pdRaysShortestDistance : any, pLocation : any, bOrientationsAsLocations? : boolean);
        /**
         * @param pnNumOfIntersections     pnNumOfIntersections.Value :   number
         * @param pFstIntersection         pFstIntersection.Value : SMcVector3D
         * @param pSndIntersection         pSndIntersection.Value :              SMcVector3D
         */
        CirclesIntersection(FstCenter : SMcVector3D, dFstRadius : number, SndCenter : SMcVector3D,
		    dSndRadius : number, bCheckOnlyFstAzimuth : boolean, dFstAzimuth : number,
		    pnNumOfIntersections : any, pFstIntersection : any, pSndIntersection : any);
        /**
        * @param pLeftUp       pLeftUp.Value :     SMcVector3D
        * @param pRightUp      pRightUp.Value :    SMcVector3D
        * @param pRightDown    pRightDown.Value :  SMcVector3D
        * @param pLeftDown     pLeftDown.Value :   SMcVector3D
        */
        CalcRectangleFromCenterAndLengths(RectangleCenterPoint : SMcVector3D,dRectangletHeight : number,
		    dRectangleWidth : number, dRotationAzimutDeg : number, pLeftUp : any,
		    pRightUp : any, pRightDown : any, pLeftDown : any, bIsGeometric? : boolean);
        /**
        * @param pRectangleCenterPoint       pRectangleCenterPoint.Value :     SMcVector3D
        * @param pdRectangletHeight          pdRectangletHeight.Value :        number
        * @param pdRectangleWidth            pdRectangleWidth.Value :          number
        * @param pdRotationAzimutDeg         pdRotationAzimutDeg.Value :       number
        */
        CalcCenterAndLengthsFromRectangle(LeftUp : SMcVector3D, RightUp : SMcVector3D, RightDown : SMcVector3D, LeftDown : SMcVector3D,
		    pRectangleCenterPoint : any, pdRectangletHeight : any, pdRectangleWidth : any, pdRotationAzimutDeg : any, bIsGeometric? : boolean);
        /**
        * @param pRectangleCenterPoint    pRectangleCenterPoint.Value :     SMcVector3D
        * @param pdRectangletHeight       pdRectangletHeight.Value :        number
        * @param pdRectangleWidth         pdRectangleWidth.Value :          number
        * @param bIsGeometric             bIsGeometric.Value :              boolean
        */
        CalcCenterAndLengthsFromRectangle(LeftUp : SMcVector3D, RightDown : SMcVector3D, dRotationAzimutDeg : number,
		    pRectangleCenterPoint : any, pdRectangletHeight : any, pdRectangleWidth : any,	bIsGeometric? : any)
        CalcRectangleCenterFromCornerAndLengths(RectangleCornerPoint : SMcVector3D,	dRectangletHeight : number,	dRectangleWidth : number,
		    dRotationAzimutDeg : number, eCornerMeaning : IMcGeographicCalculations.ERectangleCorner, bIsGeometric? : boolean) : SMcVector3D;
        PolygonExpand(aPolygonVertices : SMcVector3D[], dExpansionDistance : number, uNumPointsInArc : number) : SMcVector3D[];
        PolylineExpand(aPolylineVertices : SMcVector3D[], dExpansionDistance : number, uNumPointsInArc : number) : SMcVector3D[];
        IsPointOn2DLine(Point : SMcVector3D, aPolylineVertices : SMcVector3D[], sLineAccuracy : number) : boolean;
        /**
        * @param pNearestPoint       pNearestPoint.Value :  SMcVector3D
        * @param pDist               pDist.Value :          number
        */
        ShortestDistPoint2DLine(Point : SMcVector3D,aPolylineVertices : SMcVector3D[],pNearestPoint : any, pDist : any);
        /**
        * @param pNearestPoint       pNearestPoint.Value :  SMcVector3D
        * @param pDist               pDist.Value :          number
        */
        ShortestDistPointArc(Point : SMcVector3D, Arc : IMcGeographicCalculations.SEllipseArc, pNearestPoint : any,	pDist : any);
        ConvertAzimuthFromOtherCoordSys(OriginLocation : SMcVector3D, bIsLocationInOtherCoordSys : boolean, OtherCoordSys : IMcGridCoordinateSystem, dOtherCoordSysAzimuth : number) : number;
        ConvertAzimuthToOtherCoordSys(OriginLocation : SMcVector3D, bIsLocationInOtherCoordSys : boolean, OtherCoordSys : IMcGridCoordinateSystem, dThisCoordSysAzimuth : number) : number;
        ConvertAzimuthFromGridToGeo(OriginLocation : SMcVector3D, dGridAzimuth : number, IsOriginLocationInGeoCoordinates : boolean) : number;
        ConvertAzimuthFromGeoToGrid(OriginLocation : SMcVector3D, dGeoAzimuth : number, IsOriginLocationInGeoCoordinates : boolean) : number;
        /**
        * @param pDestLocationsNum    pDestLocationsNum.Value :     number
        * @param pFstDestLocation     pFstDestLocation.Value :      SMcVector3D
        * @param pSndDestLocation     pSndDestLocation.Value :      SMcVector3D
        */
        LocationsFromTwoLocationsAndDistances(FstLocation : SMcVector3D, dDistanceFromFst : number, dElevationFromFst : number,	SndLocation : SMcVector3D, dDistanceFromSnd : number,
		    pDestLocationsNum : any, pFstDestLocation : any, pSndDestLocation : any);
        /**
        * @param pCenterPoint    pCenterPoint.Value :  SMcVector3D
        * @param pdAzimuth       pdAzimuth.Value :     number
        * @param pdLength        pdLength.Value :      number
        * @param pdWidth         pdWidth.Value :       number
        * @param pdArea          pdArea.Value :        number
        */
        SmallestBoundingRect(aPoints : SMcVector3D[], dDeltaAngleToCheck : number,
		    pCenterPoint : any,	pdAzimuth : any, pdLength : any, pdWidth : any,	pdArea : any);
         /**
        * @param pCenterPoint    pCenterPoint.Value :  SMcVector3D
        * @param pdAzimuth       pdAzimuth.Value :     number
        * @param pdLength        pdLength.Value :      number
        * @param pdWidth         pdWidth.Value :       number
        * @param pdArea          pdArea.Value :        number
        */
        BoundingRectAtAngle(aPoints : SMcVector3D[], dAngle : number,
		    pCenterPoint : any,	pdAzimuth : any, pdLength : any, pdWidth : any, pdArea : any);
    }
    namespace IMcGeographicCalculations {
        function Create(pGridCoordinateSystem: IMcGridCoordinateSystem, strMagneticDataFileName? : string) : IMcGeographicCalculations;
        function Create(pGridCoordinateSystem: IMcGridCoordinateSystem, aMagneticDataCofFileBuffer : Uint8Array, aMagneticDataBinFileBuffer : Uint8Array) : IMcGeographicCalculations;
        enum ERectangleCorner {
            ERC_LEFT_UP,
            ERC_RIGHT_UP,
            ERC_RIGHT_DOWN,
            ERC_LEFT_DOWN
        }
        class SEllipseArc {
            constructor();
            Center : SMcVector3D;				
            dRadiusX : number;			
            dRadiusY : number;			
            dRotationAngle : number;		
            dInnerRadiusFactor : number;	
            bClockWise : boolean;			
            dStartAzimuth : number;		
            dEndAzimuth : number;		
        }
        class SMagneticElements {
            constructor();
            dDecl : number;   
            dIncl : number;   
            dF : number;      
            dH : number;      
            dX : number;      
            dY : number;      
            dZ : number;      
            dDecldot : number;
            dIncldot : number;
            dFdot : number;   
            dHdot : number;   
            dXdot : number;   
            dYdot : number;   
            dZdot : number;   
            dGVdot : number;  
        }
    }

    interface IMcTrackSmoother extends IMcDestroyable {
        AddPoints(aOriginalPoints : SMcVector3D[]);
        GetSmoothedTrack(paSmoothedTrackPoints : any, puNumSmoothedTrackPoints : any) : SMcVector3D[];
        ClearTrack(dSmoothDistance : number);

    }
    namespace IMcTrackSmoother {
        function Create(pGeoCalc : IMcGeographicCalculations, dSmoothDistance : number) : IMcTrackSmoother;
    }

    namespace IMcGeometricCalculations {
        function EGParallelLine(stBaseLine : SMcVector3D[], dDist : number) : SMcVector3D[];
        function EGPerpendicularLine(stBaseLine : SMcVector3D[], dDist : number, stThroughPoint : SMcVector3D) : SMcVector3D[];
        function EG2DLineMove(stLine : SMcVector3D[], dX : number, dY : number);
	    function EG2DLineRotate(stLine : SMcVector3D[], dAngle : number, stBasePoint : SMcVector3D);
        function EG2DIsPointOnLine(stPoint : SMcVector3D, stLine : SMcVector3D[], eLineType : GEOMETRIC_SHAPE, dAccuracy : number) : POINT_LINE_STATUS;
        function EGDistancePointLine(stLine : SMcVector3D[], eLineType : GEOMETRIC_SHAPE,	stPoint : SMcVector3D) : number;
        /**
        * @param pstClosestPointOn1            pstClosestPointOn1.Value :  SMcVector3D
        * @param pstClosestPointOn2            pstClosestPointOn2.Value :  SMcVector3D
        * @param pDist                         pDist.Value :               number
        */
        function EGLineDistance(stLine1 : SMcVector3D[], eLineType1 : GEOMETRIC_SHAPE, stLine2 : SMcVector3D[], eLineType2 : GEOMETRIC_SHAPE,
            pstClosestPointOn1 : any, pstClosestPointOn2 : any, pDist : any);
        /**
        * @param pstClosestPointOn1            pstClosestPointOn1.Value :  SMcVector3D
        * @param pstClosestPointOn2            pstClosestPointOn2.Value :  SMcVector3D
        * @param pDist                         pDist.Value :               number
        */
        function EGSegmentsDistance(stSegment1 : SMcVector3D[], stSegment2 : SMcVector3D[], pstClosestPointOn1: any, pstClosestPointOn2 : any, pDist : any);
        /**
        * @param pstFstPoint            pstFstPoint.Value :  SMcVector3D
        * @param pstScdPoint            pstScdPoint.Value :  SMcVector3D
        * @param peStatus               peStatus.Value :     SL_SL_STATUS
        */
        function EG2DSegmentsRelation(stSegment1 : SMcVector3D[], stSegment2 : SMcVector3D[],	pnIntersectPointsNum : any, pstFstPoint : any, pstScdPoint : any, peStatus : any);
        function EGAngleBetween3Points(stFstPoint : SMcVector3D, stMidPoint : SMcVector3D, stScdPoint : SMcVector3D) : number;
        function EG2DAngleFromX(stLine : SMcVector3D[]) : number;
	    function EG3DAngleFromXY(stLine : SMcVector3D[]) : number;
        /**
        * @param pnTangentsNum          pnTangentsNum.Value :       number
        * @param Tangent1               array created by the user, allocated and filled by MapCore
        * @param Tangent2               array created by the user, allocated and filled by MapCore
        */
        function EG2DTangentsThroughPoint(stCircleCenter : SMcVector3D, dRadius : number, stThroughPoint : SMcVector3D,	pnTangentsNum : SMcVector3D[], Tangent1 : SMcVector3D[], Tangent2 : any);
        /**
        * @param pnTangentsNum          pnTangentsNum.Value :       number
        * @param Tangent1               array created by the user, allocated and filled by MapCore
        * @param Tangent2               array created by the user, allocated and filled by MapCore
        * @param Tangent3               array created by the user, allocated and filled by MapCore
        * @param Tangent4               array created by the user, allocated and filled by MapCore
        */
        function EG2DTangents2Circles(stCircleCenter1 : SMcVector3D, dRadius1 : number, stCircleCenter2 : SMcVector3D, dRadius2 : number, pnTangentsNum : SMcVector3D[], Tangent1 : SMcVector3D[],	Tangent2 : SMcVector3D[],	Tangent3 : SMcVector3D[],	Tangent4 : SMcVector3D[])
        function EGArcLengthFromAngle(dAngleDegrees : number, dRadius : number) : number;
        function EGArcAngleFromLength(dLength : number,	dRadius : number) : number;
        /**
        * @param pCenter            pCenter.Value :         SMcVector3D
        * @param pRadius            pRadius.Value :         number
        */
        function EG2DCircleFrom3Points(stCircle1stPoint : SMcVector3D, stCircle2ndPoint : SMcVector3D,	stCircle3rdPoint : SMcVector3D,	pCenter : any, pRadius : any);
        /**
        * @param pstCircle1stPoint            pstCircle1stPoint.Value :         SMcVector3D
        * @param pstCircle2ndPoint            pstCircle2ndPoint.Value :         SMcVector3D
        * @param pstCircle3rdPoint            pstCircle3rdPoint.Value :         SMcVector3D
        */
        function EG2D3PointsFromCircle(pstCircle1stPoint : any, pstCircle2ndPoint : any, pstCircle3rdPoint : any, stCenter : SMcVector3D, dRadius : number);
        function EG2DCircleCircleIntersection(st1stCircle1stPoint : SMcVector3D, st1stCircle2ndPoint : SMcVector3D, st1stCircle3rdPoint : SMcVector3D,	e1stCircleType : GEOMETRIC_SHAPE, st2ndCircle1stPoint : SMcVector3D, 
            st2ndCircle2ndPoint : SMcVector3D, st2ndCircle3rdPoint : SMcVector3D, e2ndCircleType : GEOMETRIC_SHAPE) : SMcVector3D[];
        /**
        * @param pstClosestOn1st            pstClosestOn1st.Value :         SMcVector3D
        * @param pstClosestOn2nd            pstClosestOn2nd.Value :         SMcVector3D
        * @param pdDistance                 pdDistance.Value :              number
        */
        function EG2DCircleCircleDistance(st1stCircle1stPoint : SMcVector3D, st1stCircle2ndPoint : SMcVector3D, st1stCircle3rdPoint : SMcVector3D, e1stCircleType : GEOMETRIC_SHAPE, st2ndCircle1stPoint : SMcVector3D,
		    st2ndCircle2ndPoint : SMcVector3D, st2ndCircle3rdPoint : SMcVector3D, e2ndCircleType : GEOMETRIC_SHAPE, pstClosestOn1st : any, pstClosestOn2nd : any, pdDistance : any);
        function EG2DCircleLineIntersection(st1stCircle1stPoint : SMcVector3D, st1stCircle2ndPoint : SMcVector3D, st1stCircle3rdPoint : SMcVector3D, e1stCircleType : GEOMETRIC_SHAPE, stLine : SMcVector3D[], eLineType : GEOMETRIC_SHAPE) : SMcVector3D[];
        /** 
        * @param pstClosestOnCircle         pstClosestOnCircle.Value :      SMcVector3D
        * @param pstClosestOnLine           pstClosestOnLine.Value :        SMcVector3D
        * @param pdDistance                 pdDistance.Value :              number
        */
        function EG2DCircleLineDistance(st1stCircle1stPoint : SMcVector3D, st1stCircle2ndPoint : SMcVector3D, st1stCircle3rdPoint : SMcVector3D, e1stCircleType : GEOMETRIC_SHAPE,
            stLine : SMcVector3D[], eLineType : GEOMETRIC_SHAPE, pstClosestOnCircle : any, pstClosestOnLine : any, pdDistance : any);
        /** 
        * @param pstClosestOnCirc           pstClosestOnCirc.Value :      SMcVector3D
        * @param pdDistance                 pdDistance.Value :            number
        */
        function EG2DCirclePointDistance(st1stCircle1stPoint : SMcVector3D, st1stCircle2ndPoint : SMcVector3D, st1stCircle3rdPoint : SMcVector3D, e1stCircleType : GEOMETRIC_SHAPE, stPoint : SMcVector3D, pstClosestOnCirc : any, pdDistance : any);
        function EG2DIsPointOnCircle(stPoint : SMcVector3D, stCircle1st : SMcVector3D, stCircle2nd : SMcVector3D, stCircle3rd : SMcVector3D, eCircleType : GEOMETRIC_SHAPE, dAccuracy : number) : boolean;
        function EG2DIsPointInCircle(stPoint : SMcVector3D, stCircle1st : SMcVector3D, stCircle2nd : SMcVector3D, stCircle3rd : SMcVector3D, eCircleType : GEOMETRIC_SHAPE) : POINT_PG_STATUS;
        /** 
        * @param pdLeft                     pdLeft.Value :         number
        * @param pdRight                    pdRight.Value :        number
        * @param pdDown                     pdDown.Value :         number
        * @param pdUp                       pdUp.Value :           number
        */
        function EG2DCircleBoundingRect(stCircle1st : SMcVector3D, stCircle2nd : SMcVector3D, stCircle3rd : SMcVector3D, eCircleType : GEOMETRIC_SHAPE, pdLeft : any, pdRight : any, pdDown : any, pdUp : any);
        function EG2DCircleSample(stCircle1st : SMcVector3D, stCircle2nd : SMcVector3D, stCircle3rd : SMcVector3D, eCircleType : GEOMETRIC_SHAPE, unNumOfPoints : number) : SMcVector3D[];
        function EG2DPolyLineMove(pstPolyLine : SMcVector3D[], dX : number, dY : number);
        function EG2DPolyLineRotate(pstPolyLine : SMcVector3D[], dAngle : number, stBasePoint : SMcVector3D);
        /**
        * @param peCrossResult            peCrossResult.Value :         PL_PL_STATUS
        */
        function EGPolyLinesRelation(stPolyLine1 : SMcVector3D[], stPolyLine2 : SMcVector3D[], peCrossResult: any, unDimension : number) : SMcVector3D[];
        function EG2DIsPointOnPoly(stPoint : SMcVector3D, stPoly :  SMcVector3D[], ePolyType : GEOMETRIC_SHAPE , dAccuracy : number) : boolean;
        /**
        * @param pstClosest           pstClosest.Value :        SMcVector3D
        * @param puSegment            puSegment.Value :         number
        * @param pdDistance           pdDistance.Value :        number
        */
        function EGDistancePoint2Poly(stPoint : SMcVector3D, stPoly : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE, pstClosest : any, puSegment : any, pdDistance : any, unDimension : number);
        /**
        * @param pstClosest1          pstClosest2.Value :       SMcVector3D
        * @param pstClosest2          pstClosest1.Value :       SMcVector3D
        * @param pdDistance           pdDistance.Value :        number
        */
        function EGDistancePoly2Poly(stPoly1 : SMcVector3D[], ePolyType1 : GEOMETRIC_SHAPE, stPoly2 : SMcVector3D[], ePolyType2 : GEOMETRIC_SHAPE, pstClosest1 : any, pstClosest2 : any, pdDistance : any, unDimension : number);
        function EGPolyLength(stPoly : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE, unDimension : number) : number;
        function EG2DPolySelfIntersection(stPoly : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE) : boolean;
        function EG2DLinePolyIntersection(stPoly :  SMcVector3D[], ePolyType : GEOMETRIC_SHAPE, stLine : SMcVector3D[], eLineType : GEOMETRIC_SHAPE) : SMcVector3D[];
        /** 
        * @param pstClosestOnPoly          pstClosestOnPoly.Value :     SMcVector3D
        * @param pstClosestOnLine          pstClosestOnLine.Value :     SMcVector3D
        * @param pdDistance                pdDistance.Value :           number
        */
        function EG2DLinePolyDistance(stPoly : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE, stLine :  SMcVector3D[], eLineType : GEOMETRIC_SHAPE, pstClosestOnPoly : any, pstClosestOnLine : any, pdDistance : any);
        function EG2DPolyCircleIntersection(stPoly :  SMcVector3D[], ePolyType : GEOMETRIC_SHAPE, stCircle1st : SMcVector3D, stCircle2nd : SMcVector3D, stCircle3rd : SMcVector3D, eCircleType : GEOMETRIC_SHAPE) : SMcVector3D[];
        /** 
        * @param pstClosestOnPoly          pstClosestOnPoly.Value :     SMcVector3D
        * @param pstClosestOnCircle        pstClosestOnCircle.Value :   SMcVector3D
        * @param pdDistance                pdDistance.Value :           number
        */
        function EG2DPolyCircleDistance(stPoly : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE, stCircle1st : SMcVector3D, stCircle2nd : SMcVector3D, stCircle3rd : SMcVector3D, eCircleType : GEOMETRIC_SHAPE, pstClosestOnPoly : any, pstClosestOnCircle : any, pdDistance : any);
        /** 
        * @param pdLeft                     pdLeft.Value :         number
        * @param pdRight                    pdRight.Value :        number
        * @param pdDown                     pdDown.Value :         number
        * @param pdUp                       pdUp.Value :           number
        */
        function EG2DPolyBoundingRect(stPoly : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE, pdLeft : any, pdRight : any, pdDown : any, pdUp : any);
        function EG2DPolySmoothingSample(aPolyPoints : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE, uNumSmoothingLevels : number, pauOriginalPointsIndices? : Uint32Array) : SMcVector3D[];
        function EG2DClipPolyInRect(aPolyPoints : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE, pPolyBoundingRect : SMcBox, Rect2D : SMcBox) : Uint8Array;
        function EG2DPolyGonMove(stPolyGon : SMcVector3D[], dX : number, dY : number)
        function EG2DPolyGonRotate(stPolyGon : SMcVector3D[], dAngle : number, stBasePoint : SMcVector3D);
        function EG2DIsPointInPolyGon(stPoint : SMcVector3D, stPolyGon : SMcVector3D[]) : POINT_PG_STATUS;
        /**
        * @param peCrossResult            peCrossResult.Value :         PL_PL_STATUS
        * @param pePolygonStatus          pePolygonStatus.Value :       PG_PG_STATUS
        */
        function EG2DPolyGonsRelation(stPolyGon1 : SMcVector3D[], stPolyGon2 : SMcVector3D[], peCrossResult : any, pePolygonStatus : any) : SMcVector3D[];
        /**
        * @param pdArea                   pdArea.Value :         number
        */
        function EG2DPolyGonArea(stPolyGon : SMcVector3D[], pdArea : any) : boolean;
        function EG2DPolyGonInflate(stPolyGon : SMcVector3D	[], dProportion : number, stBasePoint : SMcVector3D);
	    function EG2DPolyGonCenterOfGravity(stPolyGon : SMcVector3D[]) : SMcVector3D;
	    function EG2DPolyGonTriangulation(stPolyGon : SMcVector3D[]) : SMcVector3D[][];
        /** 
        * @param arrAminB                array created by the user, allocated and filled by MapCore
        * @param arrBminA                array created by the user, allocated and filled by MapCore
        * @param arrAandB                array created by the user, allocated and filled by MapCore
        * @param arrAorB                 array created by the user, allocated and filled by MapCore
        */
        function EG2DClipPolyGon(PolyGon1 : SMcVector3D[], PolyGon2 : SMcVector3D[], arrAminB : SMcVector3D[][], arrBminA : SMcVector3D[][], arrAandB : SMcVector3D[][], arrAorB : SMcVector3D[][]);
        function EG2DPolyGonDirection(stPolyGon : SMcVector3D[], bCheckForSelfIntersection : boolean) : PG_DIRECTION;
	    function EG2DPolyGonIsConvex(stPolyGon : SMcVector3D[]) : boolean;
	    function EG2DPolyGonConvexHull(stPolyGon : SMcVector3D[]) : SMcVector3D[];
        function EG2DPolygonExpandWithCurves(stPolyGon : SMcVector3D[], dExpansionDistance : number) : STGeneralShapePoint[];
        function EG2DPolygonExpandWithCorners(stPolyGon : SMcVector3D[], dExpansionDistance : number) : SMcVector3D[];
        function EG2DOpenShapeMove(pstOGS : STGeneralShape, dX : number, dY : number);
        function EG2DOpenShapeRotate(pstOGS : STGeneralShape, dAngle : number, stBasePoint : SMcVector3D);
	    function EG2DOpenShapeOpenShapeIntersection(stOGS1 : STGeneralShape,  stOGS2 : STGeneralShape) : SMcVector3D[];
        function EG2DGeneralShapeSelfIntersection(stGS : STGeneralShape, eGeneralShapeType : GEOMETRIC_SHAPE) : boolean;
        function EG2DIsPointOnGeneralShape(stPoint : SMcVector3D, stGS : STGeneralShape, eGeneralShapeType : GEOMETRIC_SHAPE , dAccuracy : number) : boolean;
	    function EG2DGeneralShapeLength(stGS : STGeneralShape, eGeneralShapeType : GEOMETRIC_SHAPE) : number;
        /**
        * @param pstClosestOnShape      pstClosestOnShape.Value :   SMcVector3D
        * @param pdDistance             pdDistance.Value :          number
        */
        function EG2DGeneralShapeDistance2Point(stGS : STGeneralShape, eGeneralShapeType : GEOMETRIC_SHAPE, stPoint : SMcVector3D, pstClosestOnShape : any, pdDistance : any);
        /**
        * @param pstClosestOnShape      pstClosestOnShape.Value :   SMcVector3D
        * @param pstClosestOnCirc       pstClosestOnCirc.Value :    SMcVector3D
        * @param pdDistance             pdDistance.Value :          number
        */
        function EG2DGeneralShapeDistance2Circle(stGS : STGeneralShape, eGeneralShapeType : GEOMETRIC_SHAPE, stCircle1st : SMcVector3D, stCircle2nd : SMcVector3D, stCircle3rd : SMcVector3D, eCircleType : GEOMETRIC_SHAPE, pstClosestOnShape : any, pstClosestOnCirc : any, pdDistance : any);
        /**
        * @param pstClosestOnShape      pstClosestOnShape.Value :   SMcVector3D
        * @param pstClosestOnPoly       pstClosestOnPoly.Value :    SMcVector3D
        * @param pdDistance             pdDistance.Value :          number
        */
        function EG2DGeneralShapeDistance2Poly(stGS : STGeneralShape, eGeneralShapeType : GEOMETRIC_SHAPE, stPoly : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE, pstClosestOnShape : any, pstClosestOnPoly : any, pdDistance : any);
        /**
        * @param pstClosestOnShape          pstClosestOnShape.Value :         SMcVector3D
        * @param pstClosestOnOtherShape     pstClosestOnOtherShape.Value :    SMcVector3D
        * @param pdDistance                 pdDistance.Value :                number
        */
        function EG2DGeneralShapeDistance2GeneralShape(stGS1 : STGeneralShape, eGeneralShapeType1 : GEOMETRIC_SHAPE, stGS2 : STGeneralShape, eGeneralShapeType2 : GEOMETRIC_SHAPE, pstClosestOnShape : any, pstClosestOnOtherShape : any, pdDistance : any);
        /** 
        * @param pdLeft                     pdLeft.Value :         number
        * @param pdRight                    pdRight.Value :        number
        * @param pdDown                     pdDown.Value :         number
        * @param pdUp                       pdUp.Value :           number
        */
        function EG2DGeneralShapeBoundingRect(stGS : STGeneralShape, eGeneralShapeType : GEOMETRIC_SHAPE, pdLeft : any, pdRight : any, pdDown : any, pdUp : any);
        function EG2DLineGeneralShapeIntersection(stGS : STGeneralShape, eGeneralShapeType : GEOMETRIC_SHAPE, stLine : SMcVector3D[], eLineType : GEOMETRIC_SHAPE);
        function EG2DGeneralShapeCircleIntersection(stGS : STGeneralShape, eGeneralShapeType : GEOMETRIC_SHAPE, stCircle1st : SMcVector3D, stCircle2nd : SMcVector3D, stCircle3rd : SMcVector3D, eCircleType : GEOMETRIC_SHAPE) : SMcVector3D[];
        function EG2DGeneralShapePolyIntersection(stGS : STGeneralShape, eGeneralShapeType :GEOMETRIC_SHAPE, stPoly : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE ) : SMcVector3D[];
        function EG2DGeneralShapeSample(stGS : STGeneralShape, eGeneralShapeType : GEOMETRIC_SHAPE, unPointsNumPerArc : number) : SMcVector3D[];
        function EG2DClosedShapeMove(pstCGS : STGeneralShape, dX : number, dY : number);
        function EG2DClosedShapeRotate(pstCGS : STGeneralShape, dAngle : number, stBasePoint : SMcVector3D);
        function EG2DIsPointInClosedShape(stPoint : SMcVector3D, stCGS : STGeneralShape) : POINT_PG_STATUS;
	    function EG2DClosedShapeOpenShapeIntersection(stCGS1 : STGeneralShape, stOGS2 : STGeneralShape) : SMcVector3D[];
        /** 
        * @param pShapesRelation            pShapesRelation.Value :    PG_PG_STATUS
        */
        function EG2DClosedShapeClosedShapeIntersection(stCGS1 : STGeneralShape, stCGS2 : STGeneralShape, pShapesRelation : any) : SMcVector3D[];
        function EG2DClosedShapeArea(stCGS1 : STGeneralShape) : number;
        function EG2DClosedShapeWithHolesMove(astContours : STGeneralShape[], dX : number, dY : number);
        function EG2DClosedShapeWithHolesRotate(astContours : STGeneralShape[], dAngle : number, stBasePoint : SMcVector3D);
        function EG2DIsPointInClosedShapeWithHoles(stPoint : SMcVector3D, astContours : STGeneralShape[]) : POINT_PG_STATUS;
        function EG2DIsPointOnClosedShapeWithHoles(stPoint : SMcVector3D, astContours : STGeneralShape[], dAccuracy : number) : boolean;
        function EG2DClosedShapeWithHolesArea(astContours : STGeneralShape[]) : number;
        function EG2DClosedShapeWithHolesLength(astContours : STGeneralShape[]) : number;
        /** 
        * @param pstClosestOnShape         pstClosestOnShape.Value :    SMcVector3D
        * @param pdDistance                pdDistance.Value :           number
        */
        function EG2DClosedShapeWithHolesDistance2Point(astContours : STGeneralShape[], stPoint : SMcVector3D, pstClosestOnShape : any, pdDistance : any);
        /** 
        * @param pstClosestOnShape         pstClosestOnShape.Value :    SMcVector3D
        * @param pstClosestOnCirc          pstClosestOnCirc.Value :     SMcVector3D
        * @param pdDistance                pdDistance.Value :           number
        */
        function EG2DClosedShapeWithHolesDistance2Circle(astContours : STGeneralShape[], stCircle1st : SMcVector3D, stCircle2nd : SMcVector3D, stCircle3rd : SMcVector3D, eCircleType : GEOMETRIC_SHAPE, pstClosestOnShape : any, pstClosestOnCirc : any, pdDistance : any);
        /** 
        * @param pstClosestOnShape         pstClosestOnShape.Value :        SMcVector3D
        * @param pstClosestOnPolyLine      pstClosestOnPolyLine.Value :     SMcVector3D
        * @param pdDistance                pdDistance.Value :               number
        */
        function EG2DClosedShapeWithHolesDistance2Poly(astContours : STGeneralShape[], stPoly : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE, pstClosestOnShape : any, pstClosestOnPolyLine : any, pdDistance : any);
        /** 
        * @param pstClosestOnShape         pstClosestOnShape.Value :        SMcVector3D
        * @param pstClosestOnOtherShape    pstClosestOnOtherShape.Value :   SMcVector3D
        * @param pdDistance                pdDistance.Value :               number
        */
        function EG2DClosedShapeWithHolesDistance2GeneralShape(astContours : STGeneralShape[], stGS2 : STGeneralShape, eGeneralShapeType2 : GEOMETRIC_SHAPE, pstClosestOnShape : any, pstClosestOnOtherShape : any, pdDistance : any);
        function EG2DClosedShapeWithHolesCircleIntersection(astContours : STGeneralShape[], stCircle1st : SMcVector3D, stCircle2nd : SMcVector3D, stCircle3rd : SMcVector3D, eCircleType : GEOMETRIC_SHAPE);
        function EG2DClosedShapeWithHolesPolyIntersection(astContours : STGeneralShape[], stPoly : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE) : SMcVector3D[];
        function EG2DClosedShapeWithHolesGeneralShapeIntersection(astContours : STGeneralShape[], stGS2 : STGeneralShape, eGeneralShapeType2 : GEOMETRIC_SHAPE) : SMcVector3D[];
        /** 
        * functions EG2DDeleteUnionArcs() and EG2DDeleteUnionShapes() are not used
        * 
        * @param pastArcs         array created by the user, allocated and filled by MapCore
        * @param pastShapes       array created by the user, allocated and filled by MapCore
        */
        function EG2DCirclesUnion(astCircles : STCircle[], bAddParticipatingCircles : boolean, pastArcs : STUnionArc[], pastShapes : STUnionShape[]);
        /** 
        * @param RotatedUpperLeft         RotatedUpperLeft.Value :    SMcVector3D
        * @param RotatedUpperRight        RotatedUpperRight.Value :   SMcVector3D
        * @param RotatedLowerRight        RotatedLowerRight.Value :   SMcVector3D
        * @param RotatedLowerLeft         RotatedLowerLeft.Value :    SMcVector3D
        */
        function EGGetRectanglePoints(firstCornerInDiagonal : SMcVector3D, secondCornerInDiagonal : SMcVector3D, rotationAzimDeg : number, RotatedUpperLeft : any, RotatedUpperRight : any, RotatedLowerRight : any, RotatedLowerLeft : any);
        /** 
        * @param upperLeft          upperLeft.Value :       SMcVector3D
        * @param LowerRight         LowerRight.Value :      SMcVector3D
        * @param rotationAzim       rotationAzim.Value :    number
        */
        function EGGetRectangleParameters(RotatedUpperLeft : SMcVector3D, RotatedUpperRight : SMcVector3D, RotatedLowerRight : SMcVector3D, RotatedLowerLeft? : SMcVector3D, upperLeft? : any, LowerRight? : any,	rotationAzim? : any);
        /** 
        * @param upperLeft          upperLeft.Value :       SMcVector3D
        * @param LowerRight         LowerRight.Value :      SMcVector3D
        */
        function EGGetRectangleParameters(RotatedUpperLeft : SMcVector3D, RotatedLowerRight : SMcVector3D, rotationAzim : number, upperLeft? : SMcVector3D, LowerRight? : SMcVector3D);
        /** 
        * @param pdDeltaYawInPlatformSpace          pdDeltaYawInPlatformSpace.Value :       number
        * @param pdDeltaPitchInPlatformSpace        pdDeltaPitchInPlatformSpace.Value :     number
        */
        function EGCalcRotationDeltaAngles(dGunbarrelYaw : number, dGunbarrelPitch : number, dGunbarrelRoll : number, dCurrentGunbarrelYawInPlatformSpace : number, dCurrentGunbarrelPitchInPlatformSpace : number, 
            dTargetYaw : number, dTargetPitch : number, pdDeltaYawInPlatformSpace : any, pdDeltaPitchInPlatformSpace : any);
    }

    interface IMcGridConverter extends IMcBase {
            /**
             * @param pnZoneB    pnZoneB.Value : IMcGridConverter
             */
            ConvertAtoB(LocationA : SMcVector3D, pnZoneB? : any) : SMcVector3D;
            /**
             * @param pnZoneA    pnZoneA.Value : IMcGridConverter
             */
            ConvertBtoA(LocationB : SMcVector3D, pnZoneA? : any) : SMcVector3D;
            IsSameCoordinateSystem() : boolean;
            GetGridCoordinateSystem_A() : IMcGridCoordinateSystem;
            GetGridCoordinateSystem_B() : IMcGridCoordinateSystem;
            SetCheckGridLimits(bCheckGridLimits : boolean);
            GetCheckGridLimits() : boolean;
        }
    namespace IMcGridConverter {
        function Create(pGridCoordinateSystem_A : IMcGridCoordinateSystem, pGridCoordinateSystem_B : IMcGridCoordinateSystem) : IMcGridConverter;
    }

    interface IMcGridCoordinateSystem extends IMcBase {
        GetGridCoorSysType() : number;
        IsEqual(pOtherCoordinateSystem : IMcGridCoordinateSystem) : boolean;
        GetDatum() : IMcGridCoordinateSystem.EDatumType;
        GetDatumParams() : IMcGridCoordinateSystem.SDatumParams;
        IsGeographicLocationLegal(Location : SMcVector3D) : boolean;
        IsLocationLegal(Location : SMcVector3D) : boolean;
        GetLegalValuesForGeographicCoordinates() : SMcBox;
        GetLegalValuesForGridCoordinates() : SMcBox;
        SetLegalValuesForGeographicCoordinates(LegalValues : SMcBox);
        SetLegalValuesForGridCoordinates(LegalValues : SMcBox);
	    IsMultyZoneGrid() : boolean;
	    GetZone() : number;
	    GetDefaultZoneFromGeographicLocation(GeographicLocation : SMcVector3D) : number;
	    IsGeographic() : boolean;
	    IsUtm() : boolean;
    }
    namespace IMcGridCoordinateSystem {
            function Create(eDatum : IMcGridCoordinateSystem.EDatumType, pDatumParams? : IMcGridCoordinateSystem.SDatumParams) : IMcGridCoordinateSystem;
            enum EDatumType {                       
                    EDT_USER_DEFINED,	
                    EDT_WGS84,		
                    EDT_ED50_ISRAEL,	
                    EDT_PULKOVO42_POLAND,
                    EDT_HERMANSKOGEL,
                    EDT_NAD27,	
                    EDT_KKJ,
                    EDT_INDIAN_EVEREST56,
                    EDT_RT90_BESSEL1841,
                    EDT_NAD83,
                    EDT_PULKOVO_GEORGIA,
                    EDT_IND,
                    EDT_NZGD1949,
                    EDT_NZGD2000,
                    EDT_SAD69,
                    EDT_PULKOVO_KAMIN,
                    EDT_KERTAU,
                    EDT_ED50_MEAN,
                    EDT_PULKOVO_KZ,
                    EDT_PULKOVO_RU,
                    EDT_OSGB,
                    EDT_IRISH1965,
                    EDT_NUM
            }

            class SDatumParams {
                constructor();
                constructor(_dA : number, _dF : number, _dDX : number, _dDY : number, _dDZ : number, _dRx : number, _dRy : number, _dRz : number, _dS : number);
                dA : number;
                dF : number;
                dDX : number;
                dDY : number;
                dDZ : number;
                dRx : number;
                dRy : number;
                dRz : number;
                dS : number;
            }
    }

    interface IMcGridCoordSystemGeographic extends IMcGridCoordinateSystem {}
    namespace IMcGridCoordSystemGeographic {
        function Create(eDatum : IMcGridCoordinateSystem.EDatumType, pDatumParams? : IMcGridCoordinateSystem.SDatumParams) : IMcGridCoordSystemGeographic; 
    }

    interface IMcGridCoordSystemGeocentric extends IMcGridCoordinateSystem {}
    namespace IMcGridCoordSystemGeocentric {
        function Create(eDatum : IMcGridCoordinateSystem.EDatumType, pDatumParams? : IMcGridCoordinateSystem.SDatumParams) : IMcGridCoordSystemGeocentric; 
    }

    interface IMcGridGeneric extends IMcGridCoordinateSystem {
        IsEllipsoidOf(strEllipsoidName : string) : boolean;
        /**
         * @param pstrOgcCrsCode    pstrOgcCrsCode.Value : string
         */
        GetOgcCrsCode(pstrOgcCrsCode: any) : boolean;
    }
    namespace IMcGridGeneric {
        function GetFullInitializationString(strSRID : string) : string;
        function Create(strInitializationString : string, bIsSRID? : boolean) : IMcGridGeneric;
        function Create(astrGridParams : string[]) : IMcGridGeneric;
    }
    interface IMcGridCoordSystemTraverseMercator extends IMcGridCoordinateSystem {
        GetTMParams() : IMcGridCoordSystemTraverseMercator.STMGridParams;
    }
    namespace IMcGridCoordSystemTraverseMercator {
        class STMGridParams {
            constructor(_dFalseNorthing : number, _dFalseEasting : number, _dCentralMeridian : number, _dLatitudeOfGridOrigin : number, _dScaleFactor : number, _dZoneWidth : number);
            dFalseNorthing : number; 
            dFalseEasting : number; 
            dCentralMeridian : number;
            dLatitudeOfGridOrigin : number;
            dScaleFactor : number;
            dZoneWidth : number;
        }
    }

    interface IMcGridTMUserDefined extends IMcGridCoordSystemTraverseMercator {
    }
    namespace IMcGridTMUserDefined {
        function Create(GridParams : IMcGridCoordSystemTraverseMercator.STMGridParams, nZone : number, eDatum : IMcGridCoordinateSystem.EDatumType, pDatumParams? : IMcGridCoordinateSystem.SDatumParams) : IMcGridTMUserDefined;
    }

    interface IMcGridUTM extends IMcGridCoordSystemTraverseMercator {}
    namespace IMcGridUTM {
        function Create(nZone : number, eeDatum : IMcGridCoordinateSystem.EDatumType, pDatumParams? : IMcGridCoordinateSystem.SDatumParams) : IMcGridUTM;
    }

    interface IMcGridMGRS extends IMcGridCoordSystemTraverseMercator {
        CoordToFullMGRS(Coord : SMcVector3D) : IMcGridMGRS.SFullMGRS;
        FullMGRSToCoord(FullMGRS : IMcGridMGRS.SFullMGRS) : SMcVector3D;
    }
    namespace IMcGridMGRS {
        function Create() : IMcGridMGRS;

        class SSquare {
            constructor();
            cSquareFst : string;
            cSquareSnd : string;
            cBand : string;     
            nZone : number;     
        }
        class SFullMGRS {
            constructor();
            Coord : SMcVector3D;
            Square : IMcGridMGRS.SSquare; 
        }
    }

    interface IMcGridBNG extends IMcGridCoordSystemTraverseMercator {
        CoordToFullBNG(Coord : SMcVector3D) : IMcGridBNG.SFullBNG;
        FullBNGToCoord(FullBNG : IMcGridBNG.SFullBNG) : SMcVector3D;
    }
    namespace IMcGridBNG {
          function Create() : IMcGridBNG;

          class SSquare {
              constructor();
              cSquareFst : string;
		      cSquareSnd : string;
          }
          class SFullBNG {
              constructor();
              Coord : SMcVector3D;
              Square : IMcGridBNG.SSquare; 
          }
    }

    interface IMcGridGARS extends IMcGridCoordinateSystem {
        CoordToFullGARS(Coord : SMcVector3D) : string;
        FullGARSToCoord(strGARS5minute : string) : SMcVector3D;
    }
    namespace IMcGridGARS {
          function Create() : IMcGridGARS;
    }
    
    interface IMcGridIrish extends IMcGridCoordSystemTraverseMercator {
        CoordToFullIrish(Coord : SMcVector3D) : IMcGridIrish.SFullIrish;
        FullIrishToCoord(FullIrish : IMcGridIrish.SFullIrish) : SMcVector3D;
    }
    namespace IMcGridIrish {
          function Create() : IMcGridIrish;

          class SFullIrish {
              constructor();
              Coord : SMcVector3D;
              cLetter : string; 
          }
    }

    interface IMcGridNewIsrael extends IMcGridCoordSystemTraverseMercator {}
    namespace IMcGridNewIsrael {
        function Create() : IMcGridNewIsrael; 
    }

    interface IMcGridS42 extends IMcGridCoordSystemTraverseMercator {}
    namespace IMcGridS42 {
        function Create(nZone : number, eDatum : IMcGridCoordinateSystem.EDatumType , pDatumParams? : IMcGridCoordinateSystem.SDatumParams) : IMcGridS42; 
    }

    interface IMcGridRT90 extends IMcGridCoordSystemTraverseMercator {}
    namespace IMcGridRT90 {
        function Create() : IMcGridRT90; 
    }

    interface IMcGridNZMG extends IMcGridCoordinateSystem {}
    namespace IMcGridNZMG {
        function Create() : IMcGridNZMG; 
    }

    interface IMcGridCoordSystemRSO extends IMcGridCoordinateSystem {}
    
    interface IMcGridRSOSingapore extends IMcGridCoordSystemRSO {}
    namespace IMcGridRSOSingapore {
        function Create() : IMcGridRSOSingapore; 
    }

    interface IMcGridCoordSystemLambertConicConformic extends IMcGridCoordinateSystem {}
    
    interface IMcSpatialQueries extends IMcBase {
        GetInterfaceType() : number;
	    GetDevice() : IMcMapDevice;
	    GetOverlayManager() : IMcOverlayManager;
        GetCoordinateSystem() : IMcGridCoordinateSystem;
        GetViewportID() : number;
        SetTerrainQueriesNumCacheTiles(pTerrain : IMcMapTerrain, eLayerKind : IMcMapLayer.ELayerKind, uNumTiles : number);
        GetTerrains() : IMcMapTerrain[];
        GetTerrainsBoundingBox() :SMcBox;
        /**
         * @param pdHeight                         pdHeight.Value :      bumber   
         * @param pNormal                          pNormal.Value :      SMcVector3D   
         */
        GetTerrainHeight(Point : SMcVector3D, pdHeight : any, pNormal? : any, pParams? : IMcSpatialQueries.SQueryParams) : boolean;
        GetTerrainHeightMatrix(LowerLeftPoint : SMcVector3D, dHorizontalResolution : number, dVerticalResolution : number,
		    uNumHorizontalPoints : number, uNumVerticalPoints : number, pParams? : IMcSpatialQueries.SQueryParams) : Float64Array;
        /**
         * @param pdPitch                          pdPitch.Value :     number   
         * @param pdRoll                           pdRoll.Value :      number
         */
        GetTerrainAngles(Point : SMcVector3D, dAzimuth : number, pdPitch : any, pdRoll : any,
		    pParams? : IMcSpatialQueries.SQueryParams);
        /**
         * @param pIntersection          pIntersection.Value :       SMcVector3D
         * @param pNormal                pNormal.Value :             SMcVector3D
         * @param pdDistance             pdDistance.Value :          number
         */
        GetRayIntersection(RayOrigin :SMcVector3D, RayDirection : SMcVector3D, dMaxDistance : number,
		 	pIntersection? : any, pNormal? : any, pdDistance? : any, pParams? : IMcSpatialQueries.SQueryParams) : boolean;
        GetRayIntersectionTargets(RayOrigin : SMcVector3D, RayDirection : SMcVector3D, dMaxDistance : number,
		    pParams? : IMcSpatialQueries.SQueryParams) : IMcSpatialQueries.STargetFound[];
        /**
         * @param pdCrestClearanceAngle                          pdCrestClearanceAngle.Value :         number   
         * @param pdCrestClearanceDistance                       pdCrestClearanceDistance.Value :      number
         */
        GetLineOfSight(Scouter : SMcVector3D, bIsScouterHeightAbsolute : boolean, Target : SMcVector3D,
		 bTargetHeightAbsolute : boolean, pdCrestClearanceAngle? : any,
		 pdCrestClearanceDistance? : any, dMaxPitchAngle? : number,
		 dMinPitchAngle? : number, pParams? : IMcSpatialQueries.SQueryParams) : IMcSpatialQueries.SLineOfSightPoint[];
        /**
         * @param pMinimalTargetHeightForVisibility           pMinimalTargetHeightForVisibility.Value :      number               
         * @param pMinimalScouterHeightForVisibility          pMinimalScouterHeightForVisibility.Value :     number
         */
        GetPointVisibility(Scouter : SMcVector3D, bIsScouterHeightAbsolute : boolean, Target : SMcVector3D,
		   bTargetHeightAbsolute : boolean, pMinimalTargetHeightForVisibility : any, pMinimalScouterHeightForVisibility? : any,
		   dMaxPitchAngle? : number, dMinPitchAngle? : number,
		   pParams? : IMcSpatialQueries.SQueryParams) : boolean;
        /**
         * @param ppAreaOfSight         ppAreaOfSight.Value : IMcSpatialQueries.IAreaOfSight
         * @param paLinesOfSight        array created by the user, allocated and filled by MapCore
         * @param pSeenPolygons         pSeenPolygons.Value : SPolygonsOfSight
         * @param pUnseenPolygons       pUnseenPolygons.Value : SPolygonsOfSight
         * @param paSeenStaticObjects   array created by the user, allocated and filled by MapCore
         */
        GetPolygonAreaOfSight(Scouter : SMcVector3D, bIsScouterHeightAbsolute : boolean, aTargetPolygonPoints,
            dTargetHeight : number, bTargetsHeightAbsolute : boolean, fTargetResolutionInMeters : number,
            dRotationAngle : number, uNumRaysPer360Degrees : number, aVisibilityColors : SMcBColor[],
            ppAreaOfSight? : any, paLinesOfSight? : IMcSpatialQueries.SLineOfSightPoint[][], pSeenPolygons? :any, pUnseenPolygons? : any,
            paSeenStaticObjects? : IMcSpatialQueries.SStaticObjectsIDs[], dMaxPitchAngle? : number, dMinPitchAngle? : number, pParams? : IMcSpatialQueries.SQueryParams, bGPUBased? : boolean);
        /**
         * @param ppAreaOfSight         ppAreaOfSight.Value : IMcSpatialQueries.IAreaOfSight
         * @param paLinesOfSight        array created by the user, allocated and filled by MapCore
         * @param pSeenPolygons         pSeenPolygons.Value : SPolygonsOfSight
         * @param pUnseenPolygons       pUnseenPolygons.Value : SPolygonsOfSight
         * @param paSeenStaticObjects   array created by the user, allocated and filled by MapCore
         */
        GetRectangleAreaOfSight(Scouter : SMcVector3D, bIsScouterHeightAbsolute: boolean, dRectangletHeight : boolean,
		    dRectangleWidth : number, dRotationAngle : number, dTargetHeight : number, bTargetsHeightAbsolute : boolean,
		    fTargetResolutionInMeters : number,	uNumRaysPer360Degrees : number, aVisibilityColors : SMcBColor[],
            ppAreaOfSight? : any, paLinesOfSight? : IMcSpatialQueries.SLineOfSightPoint[][], pSeenPolygons? :any, pUnseenPolygons? : any, paSeenStaticObjects? : IMcSpatialQueries.SStaticObjectsIDs[], 
            dMaxPitchAngle? : number, dMinPitchAngle? : number, pParams? : IMcSpatialQueries.SQueryParams, bGPUBased? : boolean);
        /**
         * @param ppAreaOfSight         ppAreaOfSight.Value : IMcSpatialQueries.IAreaOfSight
         * @param paLinesOfSight        array created by the user, allocated and filled by MapCore
         * @param pSeenPolygons         pSeenPolygons.Value : SPolygonsOfSight
         * @param pUnseenPolygons       pUnseenPolygons.Value : SPolygonsOfSight
         * @param paSeenStaticObjects   array created by the user, allocated and filled by MapCore
         */
        GetEllipseAreaOfSight(Scouter : SMcVector3D, bIsScouterHeightAbsolute : boolean, dTargetHeight : number,
		    bTargetsHeightAbsolute : boolean, fTargetResolutionInMeters : number, fRadiusX : number,
            fRadiusY : number, fStartAngle : number, fEndAngle : number, fRotationAngle : number, uNumRaysPer360Degrees : number,
            aVisibilityColors : SMcBColor[], ppAreaOfSight? : any, paLinesOfSight? : IMcSpatialQueries.SLineOfSightPoint[][], pSeenPolygons? : any,
            pUnseenPolygons? : any, paSeenStaticObjects? : IMcSpatialQueries.SStaticObjectsIDs[], dMaxPitchAngle? : number, dMinPitchAngle? : number,
            pParams? : IMcSpatialQueries.SQueryParams, bGPUBased? : any);
        /**
         * @param ppAreaOfSight         ppAreaOfSight.Value : IMcSpatialQueries.IAreaOfSight
         */
        GetEllipseAreaOfSightForMultipleScouters(Scouters : SMcVector3D[], bIsScoutersHeightsAbsolute : boolean, dTargetHeight : number, bTargetsHeightAbsolute : boolean, fTargetResolutionInMeters : Number,
            TargetEllipseCenter : SMcVector3D, fRadiusX : number, fRadiusY : number, uNumRaysPer360Degrees : number, eScoutersSumType : IMcSpatialQueries.EScoutersSumType, ppAreaOfSight : any, 
            dMaxPitchAngle? : number, dMinPitchAngle? : number, pParams? : IMcSpatialQueries.SQueryParams, bGPUBased? : boolean);
        GetBestScoutersLocationsInEllipse(TargetEllipseCenter : SMcVector3D, dTargetHeight : number, bTargetsHeightAbsolute : boolean, fRadiusX : number, fRadiusY : number, ScoutersCenter : SMcVector3D, 
                fScoutersRadiusX : number, fScoutersRadiusY : number, dScoutersHeight : number, bIsScoutersHeightsAbsolute : boolean, uMaxNumOfScouters : number, 
                pParams? : IMcSpatialQueries.SQueryParams) : SMcVector3D[];
            /**
         * @param pafSlopes                     pafSlopes.Value : Float32Array
         * @param pSlopesData                   pSlopesData.Value : IMcSpatialQueries.SSlopesData
         */
        GetTerrainHeightsAlongLine(LineVertices : SMcVector3D[], pafSlopes? : any, pSlopesData? : any, pParams? : IMcSpatialQueries.SQueryParams) : SMcVector3D[];
        /**
         * @param pHighestPoint    pHighestPoint.Value : IMcSpatialQueries
         * @param pLowestPoint     pLowestPoint.Value : IMcSpatialQueries
         */
        GetExtremeHeightPointsInPolygon(aPolygonVertices : SMcVector3D[], pHighestPoint? : any, pLowestPoint? : any, pParams? : IMcSpatialQueries.SQueryParams) : boolean;
        GetDtmLayerTileGeometryByKey(pLayer : IMcDtmMapLayer, TileKey : IMcDtmMapLayer.STileGeometry, bBuildIfPossible : boolean, pParams? : IMcSpatialQueries.SQueryParams) : IMcDtmMapLayer.STileGeometry;
        /**
         * @param peBitmapPixelFormat           peBitmapPixelFormat.Value :       IMcTexture.EPixelFormat               
         * @param pbBitmapFromTopToBottom       pbBitmapFromTopToBottom.Value :   boolean
         * @param pBitmapSize                   pBitmapSize.Value :               SMcSize
         * @param pBitmapMargins                pBitmapMargins.Value :            SMcSize
         */
        GetRasterLayerTileBitmapByKey(pLayer : IMcRasterMapLayer, TileKey : IMcMapLayer.SLayerTileKey, bDecompress : boolean,
		    peBitmapPixelFormat : any, pbBitmapFromTopToBottom : any, pBitmapSize : any, pBitmapMargins : any, pParams? : IMcSpatialQueries.SQueryParams) : Uint8Array;
        GetRasterLayerColorByPoint(Point : SMcVector3D, nLOD : number, bNearestPixel : boolean, pParams? : IMcSpatialQueries.SQueryParams) : SMcBColor;
        GetTraversabilityAlongLine(pLayer : IMcTraversabilityMapLayer, aLineVertices : SMcVector3D[], pParams? : IMcSpatialQueries.SQueryParams) : IMcSpatialQueries.STraversabilityPoint[];
        ScanInGeometry(Geometry : SMcScanGeometry, bCompletelyInsideOnly : boolean, pParams? :  IMcSpatialQueries.SQueryParams) : IMcSpatialQueries.STargetFound[];
       	LocationFromTwoDistancesAndAzimuth(FstOrigin : SMcVector3D, FstDistance : number, FstAzimuth : number,
            SndOrigin : SMcVector3D, SndDistance : number, dTargetHeightAboveGround : number, pParams? : IMcSpatialQueries.SQueryParams) : SMcVector3D;
        CancelAsyncQuery(pAsyncQueryCallback : IMcSpatialQueries.IAsyncQueryCallback);
       	SetDebugOption(uKey : number, nValue : number);
       	IncrementDebugOption(uKey : number);
    }
    namespace IMcSpatialQueries {
        function Create(CreateData : IMcSpatialQueries.SCreateData,	apTerrains? : IMcMapTerrain[]) : IMcSpatialQueries;
        function CloneAreaOfSightMatrix(Source : IMcSpatialQueries.SAreaOfSightMatrix, bFillPointsVisibility : boolean) : IMcSpatialQueries.SAreaOfSightMatrix;
        function SumAreaOfSightMatrices(pMatrix : IMcSpatialQueries.SAreaOfSightMatrix, MatrixToAdd : IMcSpatialQueries.SAreaOfSightMatrix, eScoutersSumType : IMcSpatialQueries.EScoutersSumType);
        function AreSameRectAreaOfSightMatrices(First : IMcSpatialQueries.SAreaOfSightMatrix, Second : IMcSpatialQueries.SAreaOfSightMatrix);
        enum EIntersectionTargetType {
                EITT_NONE,					
                EITT_DTM_LAYER,					
                EITT_STATIC_OBJECTS_LAYER,		
                EITT_VISIBLE_VECTOR_LAYER,		
                EITT_NON_VISIBLE_VECTOR_LAYER,	
                EITT_OVERLAY_MANAGER_OBJECT,		
                EITT_ANY_TARGET					
            }
            
            enum EQueryPrecision { 
                EQP_DEFAULT,
                EQP_DEFAULT_PLUS_LOWEST,
                EQP_HIGHEST,
                EQP_HIGH,
                EQP_MEDIUM,
                EQP_LOW,
                EQP_LOWEST
            }

            enum ENoDTMResult {
                ENDR_FAIL,
                ENDR_VISIBLE,
                ENDR_INVISIBLE
            }

            enum EItemPart {
                EAP_VERTEX,					
                EAP_LINE_SEGMENT,			
                EAP_ARC_SEGMENT,			
                EAP_ARROW_HEAD,				
                EAP_MESH_PART,				
                EAP_INSIDE				
            }

            enum EPointVisibility {
                EPV_SEEN,				
                EPV_UNSEEN,				
                EPV_UNKNOWN,			
                EPV_OUT_OF_QUERY_AREA,	
                EPV_SEEN_STATIC_OBJECT,	
                EPV_NUM					
            }

            enum EScoutersSumType {
                ESST_OR,
                ESST_ADD,
                ESST_ALL
            }
                    interface IAsyncQueryCallback {
                /** Optional */
                OnTerrainHeightResults(bHeightFound : boolean, dHeight : number, pNormal : SMcVector3D);
                /** Optional */
                OnTerrainHeightMatrixResults(adHeightMatrix : Float64Array);
                /** Optional */
                OnTerrainHeightsAlongLineResults(aPointsWithHeights : SMcVector3D[], afSlopes : Float32Array, pSlopesData : IMcSpatialQueries.SSlopesData);
                /** Optional */
                OnExtremeHeightPointsInPolygonResults(bPointsFound : boolean, pHighestPoint : SMcVector3D, pLowestPoint : SMcVector3D);
                /** Optional */
                OnTerrainAnglesResults(dPitch : number, dRoll : number);
                /** Optional */
                //OnRayIntersectionResults(bIntersectionFound : boolean, pIntersection : SMcVector3D, pNormal : SMcVector3D, pdDistance : number);
                /** Optional */
                //OnRayIntersectionTargetsResults(aIntersections : IMcSpatialQueries.STargetFound[]);
                /** Optional */
                OnLineOfSightResults(aPoints : IMcSpatialQueries.SLineOfSightPoint[], dCrestClearanceAngle : number, dCrestClearanceDistance : number);
                /** Optional */
                OnPointVisibilityResults(bIsTargetVisible : boolean, pdMinimalTargetHeightForVisibility : number, pdMinimalScouterHeightForVisibility : number);
                /** Optional */
                OnAreaOfSightResults(pAreaOfSight : IMcSpatialQueries.IAreaOfSight, aLinesOfSight : IMcSpatialQueries.SLineOfSightPoint[][], pSeenPolygons : IMcSpatialQueries.SPolygonsOfSight, pUnseenPolygons : IMcSpatialQueries.SPolygonsOfSight, aSeenStaticObjects : IMcSpatialQueries.SStaticObjectsIDs[]);
                /** Optional */
                OnBestScoutersLocationsResults(aScouters: SMcVector3D[]);
                /** Optional */
                OnLocationFromTwoDistancesAndAzimuthResults(Target : SMcVector3D);
                /** Optional */
                OnDtmLayerTileGeometryByKeyResults(TileGeometry : IMcDtmMapLayer.STileGeometry);
                /** Optional */
                OnRasterLayerTileBitmapByKeyResults(eBitmapPixelFormat : IMcTexture.EPixelFormat, bBitmapFromTopToBottom : boolean,
                    BitmapSize : SMcSize, BitmapMargins : SMcSize, aBitmapBits : Uint8Array);
                /** Optional */
                OnRasterLayerColorByPointResults(Color : SMcBColor);
                /** Optional */
                OnTraversabilityAlongLineResults(aTraversabilitySegments : IMcSpatialQueries.STraversabilityPoint)
                /** Mandatory */
                OnError(eErrorCode : IMcErrors.ECode);
            }
            namespace IAsyncQueryCallback {
                function extend(strName : string, Class : any) : IAsyncQueryCallback;
            }

            class SQueryParams {
                constructor();
                uTargetsBitMask : number;
                uMaxNumTargetsToFind : number;
                fBoundingBoxExpansionDist : number;
                pOverlayFilter : IMcOverlay;
                uItemKindsBitField : number;
                uItemTypeFlagsBitField : number;
                eTerrainPrecision : IMcSpatialQueries.EQueryPrecision;
                bUseMeshBoundingBoxOnly : boolean;
                bUseFlatEarth : boolean;
                bAddStaticObjectContours : boolean;
                fGreatCirclePrecision: number;
                eNoDTMResult : IMcSpatialQueries.ENoDTMResult;
                pAsyncQueryCallback : IAsyncQueryCallback;
            }

            class SObjectItemFound {
                constructor();
                pObject : IMcObject;
                pItem : IMcObjectSchemeItem;
                uSubItemID : number;
                ePartFound : IMcSpatialQueries.EItemPart;
                uPartIndex : number;
            }

            class SStaticObjectContour {
                aPoints: SMcVector3D[];
                dRelativeHeight : number;
            }

            class STargetFound {
                constructor();
                eTargetType : IMcSpatialQueries.EIntersectionTargetType;
                IntersectionPoint : SMcVector3D;
                eIntersectionCoordSystem : EMcPointCoordSystem;
                pTerrain : IMcMapTerrain;
                pTerrainLayer : IMcMapLayer;
                uTargetID : SMcVariantID;
                ObjectItemData : SObjectItemFound;
                aStaticObjectContours : SStaticObjectContour[];
            }

            class SCreateData {
                constructor();
                pDevice : IMcMapDevice;
                pCoordinateSystem : IMcGridCoordinateSystem;
                pOverlayManager : IMcOverlayManager;
                uViewportID : number;
            }
            
            class SLineOfSightPoint {
                constructor();
                Point : SMcVector3D;
                bVisible : boolean;
            }

            class SAreaOfSightMatrix {
                constructor();
                uWidth : number;
                uHeight : number;
                fAngle : number;
                fTargetResolutionInMeters : number;
                fTargetResolutionInMapUnitsX : number;
                fTargetResolutionInMapUnitsY : number;
                LeftTopPoint : SMcVector3D;				
                RightTopPoint : SMcVector3D;				
                LeftBottomPoint : SMcVector3D;			
                RightBottomPoint : SMcVector3D;			
            }
            class IAreaOfSight {
                Save(strFileName : string);
                GetAreaOfSightMatrix(bFillPointsVisibility : boolean) : IMcSpatialQueries.SAreaOfSightMatrix;
                GetPointVisibilityColor(Point : SMcVector3D) : SMcBColor;
                GetPointVisibilityColorsSurrounding(Point : SMcVector3D, NumVisibilityColorsX : number, NumVisibilityColorsY : number) : Uint32Array;
                GetVisibilityColors() : SMcBColor[];
            }
            namespace IAreaOfSight {
                function Load(strFileName : string) : IMcSpatialQueries.IAreaOfSight;
            }
            class SPolygonsOfSight {
                constructor();
		        aaContoursPoints : SMcVector3D[][];
            }
            class SStaticObjectsIDs {
                constructor();
                pMapLayer : IMcStaticObjectsMapLayer;
                auIDs : SMcVariantID[];
                aaStaticObjectsContours : SStaticObjectContour[][];
            }
            class STraversabilityPoint
            {
                Point : SMcVector3D;
                bTraversable : boolean;
            }
            class SSlopesData {
                constructor();
                fMaxSlope : number;
                fMinSlope : number;
                fHeightDelta : number;
            }
            class ICoverageQuality {
                GetQuality(Location : SMcVector3D, eType : IMcSpatialQueries.ICoverageQuality.ETargetType, fMovementAngle : number) : number;
            }
            namespace ICoverageQuality {
                function Create(sAreaOfSightMatrix : IMcSpatialQueries.SAreaOfSightMatrix,
                    aVisibilityColors : SMcBColor[],
                    QualityParams : IMcSpatialQueries.ICoverageQuality.SQualityParams) : IMcSpatialQueries.ICoverageQuality;
                class SQualityParams {
                    constructor();
                }
                enum ETargetType {
                    ETT_STANDING, 
                    ETT_WALKING, 
                    ETT_VEHICLE
                }
            }
        }
        class SMcScanGeometry {
            eCoordinateSystem : EMcPointCoordSystem;
            uGeometryType : number;
        }
        class SMcScanPointGeometry  extends SMcScanGeometry {
            constructor(_eCoordinateSystem : EMcPointCoordSystem, Point : SMcVector3D, _fPointAndLineTolerance : number);
            static GEOMETRY_TYPE : number;
        }
        class SMcScanBoxGeometry extends SMcScanGeometry {
            constructor(_eCoordinateSystem : EMcPointCoordSystem, _Box : SMcBox);
            static GEOMETRY_TYPE : number;
        }
        class SMcScanPolygonGeometry extends SMcScanGeometry {
            constructor(_eCoordinateSystem : EMcPointCoordSystem , _aPolygonVertices :SMcVector3D[] );
            static GEOMETRY_TYPE : number;
        }
        
////////////////////////////////////////////////////////////////////////////////////////
// IMcEditMode

    interface IMcEditMode extends IMcDestroyable {
        AutoScroll(bAutoScroll : boolean, nMarginsSize : number);
        SetUtilityItems(pRectangle : IMcRectangleItem, pLine : IMcLineItem,	pText : IMcTextItem);
        SetUtilityPicture(pIcon : IMcPictureItem, eType : IMcEditMode.EUtilityPictureType);
        SetUtility3DEditItem(pEditItem : IMcObjectSchemeItem, eType : IMcEditMode.EUtility3DEditItemType);
        Set3DEditParams(Params : IMcEditMode.S3DEditParams);
	    SetRotatePictureOffset(fOffset : number);
        SetMaxNumberOfPoints(uMaxNumberOfPoints : number, bForceFinishOnMaxPoints : boolean);
        SetIntersectionTargets(uTargetsBitMask : number);
        SetEventsCallback(pEventsCallback : IMcEditMode.ICallback);
        GetEventsCallback() : IMcEditMode.ICallback;
        SetPermissions(uPermissionsBitField : number);
        SetHiddenIconsPerPermission(ePermission : IMcEditMode.EPermission, auIconIndices : Uint8Array);
        SetMaxRadius(dMaxRadius : number,  eCoordSystem : EMcPointCoordSystem);
        SetCameraPitchRange(dMinPitch : number, dMaxPitch : number);
        GetAutoScrollMode() : boolean;
        GetMarginSize() : number;
        /**
         * @param pRectangle      pRectangle.Value : IMcRectangleItem
         * @param pLine           pLine.Value : IMcLineItem
         * @param pText           pText.Value : IMcTextItem
         */
        GetUtilityItems(pRectangle : any, pLine : any, pText : any);
        GetUtility3DEditItem(eType : IMcEditMode.EUtility3DEditItemType) : IMcObjectSchemeItem;
        Get3DEditParams() : IMcEditMode.S3DEditParams;
        GetRotatePictureOffset() : number;
        /**
         * @param puMaxNumberOfPoints            puMaxNumberOfPoints.Value : number
         * @param pbForceFinishOnMaxPoints       pbForceFinishOnMaxPoints.Value : boolean
         */
        GetMaxNumberOfPoints(puMaxNumberOfPoints : any, pbForceFinishOnMaxPoints : any);
        GetIntersectionTargets() : number;
        GetPermissions() : number;
        GetHiddenIconsPerPermission(ePermission : IMcEditMode.EPermission) : Uint32Array;
        GetMaxRadius(eCoordSystem : EMcPointCoordSystem) : number;
        /**
         * @param pdMinPitch            pdMinPitch.Value : number
         * @param pdMaxPitch            pdMaxPitch.Value : number
         */
        GetCameraPitchRange(pdMinPitch : any, pdMaxPitch : any);
        GetLastExitStatus() : number;
        StartInitObject(pObject : IMcObject, pItem : IMcObjectSchemeItem);
        StartEditObject(pObject : IMcObject, pItem : IMcObjectSchemeItem, bEnableAddingNewPointsForMultiPointItem? : boolean);
        StartNavigateMap(bDrawLine : boolean, bOneOperationOnly? : boolean, bWaitForMouseClick? : boolean, MousePos? : SMcPoint);
        StartDistanceDirectionMeasure(DistanceTextParams? : IMcEditMode.SMeasureTextParams,
		 AngleTextParams? : IMcEditMode.SMeasureTextParams,
		 pHeightTextParams? : IMcEditMode.SMeasureTextParams, bShowResults? : boolean, bWaitForMouseClick? : boolean,
		 MousePos? : SMcPoint, pText? : IMcTextItem, pLine? : IMcLineItem, pDirectionCoordSys? : IMcGridCoordinateSystem);
        StartDynamicZoom(fMinScale? : number, bWaitForMouseClick? : boolean, MousePos? : SMcPoint, pRectangle? : IMcRectangleItem,
		 e3DOperation? : IMcMapCamera.ESetVisibleArea3DOperation);
        StartCalculateHeightInImage(pLine : IMcLineItem);
        StartCalculateVolumeInImage(pLine : IMcLineItem);
         /**
          * @param pbRenderNeeded          pbRenderNeeded.Value : boolean
          * @param peCursorType            peCursorType.Value :   IMcEditMode.ECursorType
          */
        OnMouseEvent(eEvent : IMcEditMode.EMouseEvent , MousePosition : SMcPoint, bControlKeyDown : boolean , nWheelDelta : number,	pbRenderNeeded : any, peCursorType : any, pSecondTouchPosition? : SMcPoint);
        /**
         * @param pbRenderNeeded          pbRenderNeeded.Value : boolean
         */
        OnKeyEvent(eEvent : IMcEditMode.EKeyEvent, pbRenderNeeded : any);
        SetKeyStep(eStepType : IMcEditMode.EKeyStepType , fStep : number);
        GetKeyStep(eStepType : IMcEditMode.EKeyStepType) : number;
        IsEditingActive() : boolean;
        ExitCurrentAction(bDiscard : boolean);
        SetMouseMoveUsageForMultiPointItem(eMouseMoveUsage : IMcEditMode.EMouseMoveUsage);
        GetMouseMoveUsageForMultiPointItem() : IMcEditMode.EMouseMoveUsage ;
        AddOverlayManagerWorldPoint(WorldPoint : SMcVector3D) : number;
        SetPointAndLineClickTolerance(uTolerance : number);
        GetPointAndLineClickTolerance() : number;
        SetRectangleResizeRelativeToCenter(bRelativeToCenter : boolean);
        GetRectangleResizeRelativeToCenter() : boolean;
        SetAutoSuppressSightPresentationMapTilesWebRequests(bSuppress : boolean);
        GetAutoSuppressSightPresentationMapTilesWebRequests() : boolean;
        ChangeObjectOperationsParams(Params : IMcEditMode.SObjectOperationsParams, bForOneOperationOnly? : boolean);
        GetObjectOperationsParams() : IMcEditMode.SObjectOperationsParams;
        SetAutoChangeObjectOperationsParams(bChange : boolean);
        GetAutoChangeObjectOperationsParams() : boolean;
    }

    namespace IMcEditMode {
        function Create(pViewport : IMcMapViewport) : IMcEditMode;
        enum ECursorType
        {
            ECT_DEFAULT_CURSOR,	
            ECT_DRAG_CURSOR,	
            ECT_MOVE_CURSOR,	
            ECT_EDIT_CURSOR		
        }

        enum EMouseEvent
        {
            EME_BUTTON_PRESSED,				
            EME_BUTTON_RELEASED,			
            EME_BUTTON_DOUBLE_CLICK,		
            EME_MOUSE_MOVED_BUTTON_DOWN,	
            EME_MOUSE_MOVED_BUTTON_UP,		
            EME_MOUSE_WHEEL,
            EME_SECOND_TOUCH_PRESSED,
            EME_SECOND_TOUCH_RELEASED
        }

        enum EKeyEvent
        {
            EKE_MOVE_LEFT,		
            EKE_MOVE_RIGHT,		
            EKE_MOVE_UP,		
            EKE_MOVE_DOWN,		
            EKE_RAISE,			
            EKE_LOWER,			
            EKE_ROTATE_LEFT,	
            EKE_ROTATE_RIGHT,	
            EKE_ROTATE_UP,		
            EKE_ROTATE_DOWN,	
            EKE_DELETE_VERTEX,	
            EKE_NEXT_ICON,		
            EKE_PREV_ICON,		
            EKE_CONFIRM,		
            EKE_ABORT,			
        }

        enum EKeyStepType
        {
            EKST_MAP_MOVE_PIXELS, 
            EKST_OBJECT_MOVE_PIXELS, 
            EKST_ROTATION_DEGREES, 
            EKST_3D_EDIT_MOVE_WORLD_UNITS, 
            EKST_3D_EDIT_RESIZE_FACTOR
        }

        enum EPermission 
        {
            EEMP_NONE, 
            EEMP_MOVE_VERTEX, 
            EEMP_BREAK_EDGE, 
            EEMP_RESIZE, 
            EEMP_ROTATE, 
            EEMP_DRAG, 
            EEMP_FINISH_TEXT_STRING_BY_KEY
        }

        enum EUtilityPictureType {
            EUPT_VERTEX_ACTIVE,
            EUPT_VERTEX_REGULAR, 
            EUPT_MID_EDGE_ACTIVE, 
            EUPT_MID_EDGE_REGULAR, 
            EUPT_MOVE_ITEM_ACTIVE, 
            EUPT_MOVE_ITEM_REGULAR,
            EUPT_MOVE_PART_ACTIVE, 
            EUPT_MOVE_PART_REGULAR,	
            EUPT_ITEM_ROTATE_ACTIVE, 
            EUPT_ITEM_ROTATE_REGULAR, 
            EUPT_TYPES
        }

        enum EUtility3DEditItemType {
            EUEIT_MOVE_ITEM_CENTER_ACTIVE, 
            EUEIT_MOVE_ITEM_CENTER_REGULAR, 
            EUEIT_MOVE_ITEM_X_ACTIVE, 
            EUEIT_MOVE_ITEM_X_REGULAR,
            EUEIT_MOVE_ITEM_Y_ACTIVE, 
            EUEIT_MOVE_ITEM_Y_REGULAR, 
            EUEIT_MOVE_ITEM_Z_ACTIVE, 
            EUEIT_MOVE_ITEM_Z_REGULAR,
            EUEIT_RESIZE_ITEM_X_ACTIVE,	
            EUEIT_RESIZE_ITEM_X_REGULAR, 
            EUEIT_RESIZE_ITEM_Y_ACTIVE, 
            EUEIT_RESIZE_ITEM_Y_REGULAR,
            EUEIT_RESIZE_ITEM_Z_ACTIVE, 
            EUEIT_RESIZE_ITEM_Z_REGULAR, 
            EUEIT_ROTATE_ITEM_YAW_ACTIVE, 
            EUEIT_ROTATE_ITEM_YAW_REGULAR,
            EUEIT_ROTATE_ITEM_PITCH_ACTIVE, 
            EUEIT_ROTATE_ITEM_PITCH_REGULAR, 
            EUEIT_ROTATE_ITEM_ROLL_ACTIVE, 
            EUEIT_ROTATE_ITEM_ROLL_REGULAR, 
            EUEIT_TYPES
        }

        enum EMouseMoveUsage {
            EMMU_REGULAR, 
            EMMU_IGNORED, 
            EMMU_ADDS_POINT,
            EMMU_TYPES
        }

        class SMeasureTextParams {
            constructor();
            dUnitsFactor : number;
            UnitsName : SMcVariantString;
            uNumDigitsAfterDecimalPoint : number;
        }

        class S3DEditParams {
            constructor();
            bLocalAxes : boolean;
            bKeepScaleRatio : boolean;
            fUtilityItemsOptionalScreenSize : number;
        }

        class SPermissionHiddenIcons {
            constructor();
            ePermission : EPermission;
            auIconIndices : Uint32Array;
        }
        
        class SObjectOperationsParams {
            constructor();
            uPermissions : IMcEditMode.EPermission;
            aPermissionsWithHiddenIcons : IMcEditMode.SPermissionHiddenIcons[];
            apUtilityPictures : IMcPictureItem[];
            pUtilityLine : IMcLineItem;
            bUtilityLineOverriden : boolean;
            fRotatePictureOffset : number;
            eMouseMoveUsageForMultiPointItem : IMcEditMode.EMouseMoveUsage;
            uPointAndLineClickTolerance : number;
            uMaxNumberOfPoints : number;
            bForceFinishOnMaxPoints : boolean;
            dMaxRadiusForImageCoordSys : number;
            dMaxRadiusForWorldCoordSys : number;
            dMaxRadiusForScreenCoordSys : number;
            bRectangleResizeRelativeToCenter : boolean;
            ap3DEditUtilityItems : IMcObjectSchemeItem[];
            b3DEditLocalAxes : boolean;
            b3DEditKeepScaleRatio : boolean;
            f3DEditUtilityItemsOptionalScreenSize : number;
            static IsDefault(Params : SObjectOperationsParams) : boolean;
            
        }

        interface ICallback {
            /** Optional */
            NewVertex(pObject : IMcObject, pItem : IMcObjectSchemeItem, WorldVertex : SMcVector3D, ScreenVertex : SMcVector3D, uVertexIndex : number, dAngle : number);
            /** Optional */
            PointDeleted(pObject : IMcObject, pItem : IMcObjectSchemeItem,WorldVertex : SMcVector3D, ScreenVertex : SMcVector3D, uVertexIndex : number) 
            /** Optional */
            PointNewPos(pObject : IMcObject, pItem : IMcObjectSchemeItem, WorldVertex : SMcVector3D, ScreenVertex : SMcVector3D, uVertexIndex : number, dAngle : number, bDownOnHeadPoint : boolean); 
            /** Optional */
            InitItemResults(pObject : IMcObject, pItem : IMcObjectSchemeItem, nExitCode : number);
            /** Optional */
            EditItemResults(pObject : IMcObject, pItem : IMcObjectSchemeItem, nExitCode : number);
            /** Optional */
            DragMapResults(pViewport : IMcMapViewport, NewCenter : SMcVector3D);
            /** Optional */
            RotateMapResults(pViewport : IMcMapViewport, fNewYaw : number, fNewPitch);
            /** Optional */
            DynamicZoomResults(pViewport : IMcMapViewport, fNewScale : number, NewCenter : SMcVector3D);
            /** Optional */
            DistanceDirectionMeasureResults(pViewport : IMcMapViewport, WorldVertex1 : SMcVector3D, WorldVertex2 : SMcVector3D, dDistance : number, dAngle : number); 
            /** Optional */
            CalculateHeightResults(pViewport : IMcMapViewport, dHeight : number, aCoords : SMcVector3D[], nStatus : number);
            /** Optional */
            CalculateVolumeResults(pViewport : IMcMapViewport, dVolume : number, aCoords : SMcVector3D[], nStatus : number);
            /** Optional */
            ExitAction(nExitCode : number);
            /** Optional */ 
            Release();
        }
        namespace ICallback {
            function extend(strName : string, Class : any) : ICallback;
        }
    }

    namespace IMcErrors {
        function ErrorCodeToString(eErrorCode: IMcErrors.ECode) : string;
        function GetLastStorageErrorDetailedString() : string;
        enum ECode {
            SUCCESS, FAILURE, NOT_IMPLEMENTED, INVALID_PARAMETERS, INVALID_ARGUMENT, NOT_INITIALIZED, CANNOT_ALLOC_BUFFER, GDI_FAILURE,
            FILE_NOT_FOUND, RESOURCE_FILE_NOT_LOADED, RESOURCE_NOT_FOUND, FONT_ATLAS_FAILURE, COORDINATE_SYSTEMS_MISMATCH, COORDINATES_NOT_CONVERTED, COORDINATE_NOT_IN_AREA, RENDERING_DEVICE_LOST,
            CONFIGURATION_FILE_NOT_FOUND, RESOURCE_LOCATION_NOT_FOUND, ILLEGAL_COORDINATE, CANT_READ_FILE, PRODUCTION_OUT_OF_MEMORY, PRODUCTION_CANT_EMPTY_DEST_DIR, PRODUCTION_CANT_CREATE_DEST_DIR, PRODUCTION_MISSING_SRC_IMAGES,
            PRODUCTION_CANT_READ_FILE, PRODUCTION_CANT_WRITE_FILE, PRODUCTION_CANT_READ_IMAGE_FILE, PRODUCTION_CANT_RESIZE_IMAGE_FILE, PRODUCTION_CANT_READ_DTM_FILE, PRODUCTION_CANT_ADD_IMAGE_FILE, PRODUCTION_CANT_ADD_DTM_FILE, PRODUCTION_SRC_FILES_NOT_FOUND,
            PRODUCTION_CANT_GET_TERRAIN_RES, PRODUCTION_DIFFERENT_TILE_SIZE, PRODUCTION_DIFFERENT_TEX_MARGIN, PRODUCTION_CANT_GET_IMAGE_SIZE, PRODUCTION_INVALID_TEX_RESOLUTION, PRODUCTION_INVALID_DTM_RESOLUTION, PRODUCTION_NO_TERRAIN_IN_DEST_DIR, PRODUCTION_CANT_READ_TILES_FILE,
            PRODUCTION_INVALID_SRC_FILE_PARAMS, PRODUCTION_MORE_THAN_ONE_IMAGE_FILE, PRODUCTION_FILE_FORMAT_NOT_SUPPORTED, PRODUCTION_CANT_PROCESS_STATIC_OBJECTS, PRODUCTION_STATIC_OBJECTS_NO_DEST_FILES, PRODUCTION_INCOMPATIBLE_RECOVERY_DATA, PRODUCTION_CANT_WRITE_RECOVERY_DATA, PRODUCTION_CANT_READ_RECOVERY_DATA,
            OBJECT_EXISTS_IN_COLLECTION, OVERLAY_EXISTS_IN_COLLECTION, OBJECT_NOT_FOUND_IN_COLLECTION, OVERLAY_NOT_FOUND_IN_COLLECTION, NOT_THE_SAME_OVERLAY_MANAGER, NO_OVERLAY, OVERLAY_ALREADY_REMOVED, OBJECTS_NOT_FOUND,
            PROPERTY_NOT_EXIST_IN_TABLE, CANT_SET_RESERVED_PROPERTY_ID, PROPERTY_TYPE_MISMATCH, RELATIVE_TO_DTM_CANNOT_BE_USED, ID_ALREADY_EXISTS, ID_NOT_FOUND, NAME_NOT_FOUND, NO_OVERLAY_MANAGER,
            CONDITIONAL_SELECTOR_NOT_EXIST, CANNOT_SET_CONDITIONAL_SELECTOR, PRODUCING_NODES_CONNECTION_LOOP, CANNOT_CONVERT_VERTEX, THE_PROPERTY_CANT_BE_SET_PER_VIEWPORT, OBJECT_STATE_CONDITIONAL_SELECTOR_CANT_BE_USED, ITEM_DOESNT_EXIST, ITEM_CANT_BE_NULL,
            ITEM_CANT_CONNECT_CONNECTED_ITEM, ITEM_CANT_CONNECT_PHYSICAL_TO_SYMBOLIC, ITEM_CANT_CONNECT_PHYSICAL_TO_SCREEN_LOCATION, ITEM_NOT_CONNECTED_CANT_SET_PROP_ID, WRITE_TO_STORAGE_FAILED, READ_FROM_STORAGE_FAILED, 
            INVALID_STORAGE_FORMAT, WRONG_STORAGE_FORMAT, STORAGE_VERSION_MISMATCH,	CONDITIONAL_SELECTOR_STORAGE_ERROR,	FONT_STORAGE_ERROR, TEXTURE_STORAGE_ERROR, MESH_STORAGE_ERROR, IMAGE_CALC_STORAGE_ERROR,       
            NOT_COMPATIBLE_ATTACH_POINT_PARENT, LOCAL_CACHE_NOT_INIT,
            LOCAL_CACHE_HAS_ACTIVE_LAYER, EDIT_MODE_UTILITY_ITEM_SHOULD_BE_SCREEN, EDIT_MODE_IMAGE_CALC_MISMATCH, EDIT_MODE_IS_ALREADY_ACTIVE, EDIT_MODE_IS_NOT_ACTIVE, EDIT_MODE_IS_NOT_CONNECTED, EDIT_MODE_AUTO_REFRESH_IS_NOT_ACTIVE, EDIT_MODE_ITEM_IS_NOT_SUPPORTED,
            TERRAIN_ALREADY_EXISTS, TERRAIN_NOT_FOUND, LAYER_ALREADY_EXISTS, LAYER_NOT_FOUND, LAYER_TILING_SCHEME_MISMATCH, DTM_LAYER_ALREADY_EXISTS, DTM_LAYER_DOES_NOT_EXIST, DTM_LAYER_CANT_BE_REMOVED,
            VIEWPORT_CANT_HAVE_EMPTY_TERRAIN, DTM_LAYER_CANT_BE_ADDED, NATIVE_SERVER_LAYER_NOT_VALID, LAYER_WEB_REQUEST_FAILURE, SYNC_OPERATION_ON_NATIVE_SERVER_LAYER, RAW_3D_EXTRUSION_LAYER_DTM_MISMATCH,
            NATIVE_SERVER_LAYER_AUTHENTICATION_REQUIRED, NATIVE_SERVER_LAYER_UNAUTHENTICATED, NATIVE_SERVER_LAYER_AUTHENTICATION_EXPIRED, NATIVE_SERVER_LAYER_UNAUTHORIZED,
            VIEWPORT_MAP_TYPE_MISMATCH, CANNOT_DESTROY_ACTIVE_CAMERA, VIEWPORT_SIZE_MISSING, VIEWPORT_INVALID_WINDOW_HANDLE, QUERY_DTM_NOT_FOUND, TOO_MANY_TARGETS, ASYNC_QUERY_WITH_CURRENT_LOD, SYNC_QUERY_WITH_NON_CURRENT_LOD,
            IC_OUT_OF_LIMIT,
            IC_OUT_OF_WORKING_AREA, IC_TOO_MANY_OPEN_IMAGE_CALCS, IC_IMAGE_CALCS_NOT_OPENED, IC_INVALID_IMAGE_ID, IC_INPUT_ERR, IC_IMPORT_ERR, IC_RELEASE_ERR, IC_LOAD_ERR,
            IC_UNLOAD_ERR, IC_XML_ERR, IC_ALLOCATION_ERR, IC_CS_ERR, IC_G2I_ERR, IC_I2G_ERR, IC_I2LOS_ERR, IC_LOS2G_ERR,
            IC_IMAGE_ADJUSTMENT_ERR, IC_BLOCK_ADJUSTMENT_ERR, IC_GET_ERR, IC_SET_ERR, IC_READ_ERR, IC_WRITE_ERR, IC_NO_SUPPORT, IC_BAD_DTM,
            CROSSING_POLYGONS, MAPLAYER_FILE_WITHOUT_COORDINATES, NOT_SUPPORTED_FOR_THIS_LAYER, LOCALE_NOT_FOUND, ACTIVE_VECTOR_LAYER_NOT_FOUND, HISTOGRAM_NOT_CALCULATED, INVALID_GUESS, LISENCE_IS_INVALID, LICENSE_EXPIRED, LICENSE_BAD_FORMAT, LICENSE_FEATURE_NOT_FOUND, LICENSE_FILE_NOT_FOUND,
        }
    }

////////////////////////////////////////////////////////////////////////////////////////
// General

enum PL_PL_STATUS {
        SEPARATE_PL, 
        OVERLAP_PL, 
        INTERSECT_PL, 
        RESERVED_PL, 
        TANGENT_PL, 
        TOUCHES_PL
    }

    enum PG_PG_STATUS {
        SEPARATE_PG, 
        A_IN_B_PG, 
        B_IN_A_PG, 
        SAME_PG, 
        INTERSECT_PG
    }

    enum GEOMETRIC_SHAPE {
        EG_LINE, 
        EG_RAY, 
        EG_SEGMENT, 
        EG_CIRCLE, 
        EG_ARC, 
        EG_CIRCLESECTOR, 
        EG_CIRCLESEGMENT, 
        EG_POLYLINE, 
		EG_POLYGON, 
        EG_GENERAL_OPENSHAPE, 
        EG_GENERAL_CLOSEDSHAPE, 
        EG_GENERAL_CLOSEDSHAPE_WITH_HOLES, 
        EG_GEOMETRIC_SHAPE_TYPE_NONE        
    }

    enum PG_DIRECTION {
        LOCKWISE, 
        COUNTER_CLOCKWISE, 
        SELF_INTERSECT
    }

    enum GS_POINT_TYPE {
        START_ARC_END_ARC,
        START_ARC_END_SEG,
        START_SEG_END_ARC,
        START_SEG_END_SEG,
        MID_ARC,			
        START_SEG,			
        START_ARC,			
        END_SEG,				
        END_ARC,				
        GS_POINT_TYPE_NONE
    }

    class STGeneralShapePoint {
        constructor();
        stPoint : SMcVector3D;
        ePointType :GS_POINT_TYPE;
    }

   class STCircle {
        constructor();
        stCenter : SMcVector3D;
        dRadius : number;
    }
    
    class STUnionArc {
        constructor();
        unCircleID : number;
        dStartAngle : number;
        dEndAngle : number;
    }

    class STGeneralShape {
        constructor();
        constructor(Father : STGeneralShape);
        astPoints : STGeneralShapePoint[];
    }
    
    class STUnionShape {
        constructor();
        constructor(Father : STUnionShape);
        astContours : STGeneralShape[];
        aunParticipatingCirclesIDs : Uint8Array;
    }

    enum POINT_PG_STATUS {
        POINT_NOT_IN_PG,
        POINT_IN_PG,    
        POINT_ON_PG    
    }

    enum POINT_LINE_STATUS {
        BEFORE_EDGE,
        AFTER_EDGE,
        NOT_ON_LINE,
        IS_ON_LINE,
        IS_1st_EDGE,
        IS_2cd_EDGE
    }

    enum SL_SL_STATUS {
        SEPARATE_SL,				
        OVERLAP_SL,				
        INTERSECT_SL,			
        INTERSECT_PARALLEL_SL,
        PARALLEL_SL,	
        LINE1_1st_TOUCHES_SL,
        LINE1_2cd_TOUCHES_SL,	
        LINE2_1st_TOUCHES_SL,	
        LINE2_2cd_TOUCHES_SL,	
        SAME_POINT11_SL,	
        SAME_POINT12_SL,		
        SAME_POINT21_SL,		
        SAME_POINT22_SL			
    }
    enum EMcPointCoordSystem 
    {
        EPCS_IMAGE,
        EPCS_WORLD,
        EPCS_SCREEN
    }

    enum EExtendedGeometry
    {
        EEG_Unknown,		
        EEG_Point,
        EEG_LineString,		
        EEG_Polygon,
        EEG_MultiPoint,
        EEG_MultiLineString,
        EEG_MultiPolygon,
        EEG_GeometryCollection,
        EEG_None,
        EEG_LinearRing,
        EEG_Point25D,
        EEG_LineString25D,
        EEG_Polygon25D,		
        EEG_MultiPoint25D,
        EEG_MultiLineString25D,
        EEG_MultiPolygon25D,
        EEG_GeometryCollection25D
    }

    enum EAxisXAlignment
    {
        EXA_LEFT,
        EXA_CENTER,
        EXA_RIGHT
    }

    enum EAxisYAlignment
    {
        EYA_TOP,
        EYA_CENTER,
        EYA_BOTTOM
    }

    enum EFieldType
    {
        IntegerType,
        RealType,
        StringType,
        RawBinaryType,
        Integer64Type,
        UnSupportedType
    }

    enum EGeometry
    {
        LineGeometry,
        PointGeometry,
        PolygonGeometry,
        UnSupportedGeometry,
    }

    var MC_EMPTY_ID : number;
    var MC_MAX_NUM_POINTS_PER_COMPLETE_ELLIPSE : number;
    var FLT_MAX : number;
    var DBL_MAX : number;
    var INT_MAX : number;
    var UINT_MAX : number;
    var INT_MIN : number;

    interface IMcUserData {
        /** Mandatory */
        Release();
        /** Optional */
        Clone() : IMcUserData;
        /** Optional */
        GetSaveBufferSize() : number;
        /** Optional */
        IsSavedBufferUTF8Bytes() : boolean;
        /** Optional */
        SaveToBuffer(aBuffer : Uint8Array);
    }
    namespace IMcUserData {
        function extend(strName : string, Class : any) : IMcUserData;
    }

    interface IMcUserDataFactory {
        /** Mandatory */
        CreateUserData(aBuffer : Uint8Array) : IMcUserData;
    }
    namespace IMcUserDataFactory {
        function extend(strName : string, Class : any) : IMcUserDataFactory;
    }

    class SMcVariantID {
        constructor();
        constructor(NumberOrArrayOrVariantID : number | Uint8Array | SMcVariantID);
        constructor(u32Bit : number, u64BitHigh : number);
        constructor(u32Bit : number, u64BitHigh : number, u128BitHighLow : number, u128BitHighHigh : number);
        static Set128Bit(ID : SMcVariantID, aArray128Bit : Uint8Array);
        static Get128Bit(ID : SMcVariantID) : Uint8Array;
        static SetEmpty(ID : SMcVariantID);
        static IsEmpty(ID : SMcVariantID) : boolean;
        static AreEqual(ID1 : SMcVariantID, ID2 : SMcVariantID) : boolean;
        u32Bit : number;
        u64BitHigh : number;
        u128BitHighLow : number;
        u128BitHighHigh : number;
    }

    class SMcVariantString {
        constructor();
        constructor(StringOrStringArray : string | string[], _bIsUnicode : boolean);
        astrStrings : string[];
        bIsUnicode : boolean;
    }

    class SMcVariantLogFont {
        constructor();
        lfHeight : number; 
        lfWidth : number;               
        lfEscapement : number;          
        lfOrientation : number;         
        lfWeight : number;              
        lfItalic : number;              
        lfUnderline : number;           
        lfStrikeOut : number;           
        lfCharSet : number;             
        lfOutPrecision : number;        
        lfClipPrecision : number;       
        lfQuality : number;             
        lfPitchAndFamily : number;      
        lfFaceName : string;        
        bIsUnicode : boolean;
    }

    class SMcSubItemData {
        constructor();
        constructor(uSubItemID : number, nPointsStartIndex : number);
        uSubItemID : number;
        nPointsStartIndex : number;
    }

    class SMcQuaternion {
        constructor();
        constructor(w : number, x : number, y : number, z : number);
        constructor(Other : SMcQuaternion);
        w : number;
        x : number;
        y : number;
        z : number;
    }

    class SMcRotation {
        constructor();
        constructor(fYaw : number, fPitch : number, fRoll : number,	bRelativeToCurrOrientation? : boolean);
        constructor(Other : SMcRotation);
        constructor(Quaternion : SMcQuaternion, bRelativeToCurrOrientation? : boolean);
        fYaw : number;
        fPitch : number;
        fRoll : number;
        bRelativeToCurrOrientation : boolean;
    }

    class SMcFileSource {
        constructor();
        constructor(NameOrBuffer : string | Uint8Array, bIsBuffer : boolean);
        strFileName : string;
        aFileMemoryBuffer : Uint8Array;
        bIsMemoryBuffer : boolean;
    }

    class SMcBColor {
        constructor();
        constructor(r : number, g : number, b : number, a : number);
        constructor(Color : SMcBColor, bDummy : boolean);
        constructor(uARGB : number);
        r : number;
        g : number;
        b : number;
        a : number;
    }
    var bcBlackTransparent : SMcVector3D;
    var bcBlackOpaque : SMcVector3D;
    var bcWhiteTransparent : SMcVector3D;
    var bcWhiteOpaque : SMcVector3D;

    class SMcFColor {
        constructor();
        constructor(r : number, g : number, b : number, a : number);
    	constructor(Color : SMcBColor);
        r : number;
        g : number;
        b : number;
        a : number;
    }
    var fcBlackTransparent : SMcFColor;
    var fcBlackOpaque : SMcFColor;
    var fcWhiteTransparent : SMcFColor;
    var fcWhiteOpaque : SMcFColor;

    class SMcSize {
        constructor();
        constructor(initCX : number, initCY : number);
        cx : number;
        cy : number;
    }

    class SMcPoint{
        constructor();
        constructor(initX : number, initY : number);
        x : number;
        y : number; 
    }

    class SMcRect{
        constructor();
        constructor(l : number, t : number, r : number, b : number);
        left : number;
        top : number;
        right : number;
        bottom : number;
     }

    class SMcVector3D {
        constructor(x : number, y : number, z : number);
        constructor(v : SMcVector3D);
        x : number;
        y : number;
        z : number;
        }
    namespace SMcVector3D {
        function Copy(target : SMcVector3D, source : SMcVector3D);
        function IsEqual(item1 : SMcVector3D, item2 : SMcVector3D) : boolean;
        function IsNotEqual(item1 : SMcVector3D, item2 : SMcVector3D) : boolean;
        function PlusEq(target : SMcVector3D, source : SMcVector3D);
        function MinusEq(target : SMcVector3D, source : SMcVector3D);
        function MulEq(target : SMcVector3D, source : SMcVector3D);
        function DivEq(target : SMcVector3D, source : SMcVector3D);
        function Plus(item1 : SMcVector3D, item2 : SMcVector3D) : SMcVector3D;
        function Minus(item1 : SMcVector3D, item2 : SMcVector3D) : SMcVector3D;
        function Mul(item1 : SMcVector3D, item2 : number) : SMcVector3D;
        function Mul(item1 : number, item2 : SMcVector3D) : SMcVector3D;
        function Mul(item1 : SMcVector3D, item2 : SMcVector3D) : number;
        function Div(item1 : SMcVector3D, item2 : SMcVector3D) : SMcVector3D;
        function Div(item1 : SMcVector3D, item2 : number) : SMcVector3D;
        function CrossProduct(item1 : SMcVector3D, item2 : SMcVector3D) : SMcVector3D;
        function CrossProductEq(target : SMcVector3D, source : SMcVector3D);
        function Average(item1 : SMcVector3D, item2 : SMcVector3D) : SMcVector3D;
        function AverageEq(target : SMcVector3D, source : SMcVector3D);
        function SquareLength(item1 : SMcVector3D, item2 : SMcVector3D) : number;
        function Length(item1 : SMcVector3D, item2 : SMcVector3D) : number;
        function MulAdd(target : SMcVector3D, dMul : number, vAdd : SMcVector3D);
        function GetMulAdded(vector : SMcVector3D, dMul : number, vAdd : SMcVector3D) : SMcVector3D;
        function Normalize(vector : SMcVector3D);
        function GetNormalized(vector : SMcVector3D) : SMcVector3D;
        function GetLinearInterpolationWith(vector : SMcVector3D, vSecond : SMcVector3D, dInterpolationParam : number) : SMcVector3D;
        function GetDegreeYawPitchFromForwardVector(vector : SMcVector3D, pdYaw : number, pdPitch : number);
        function GetRadianPitchRollFromUpVector(vector : SMcVector3D, pdPitch : number, pdRoll : number);
        function GetDegreePitchRollFromUpVector(vector : SMcVector3D, pdPitch : number, pdRoll : number);
        function RotateByRadianYawAngle(vector : SMcVector3D, pdYaw : number);
        function RotateByDegreeYawAngle(vector : SMcVector3D, pdYaw : number);
        function RotateByRadianYawPitchRoll(vector : SMcVector3D, dYaw : number, dPitch : number, dRoll:number);
        function RotateByDegreeYawPitchRoll(vector : SMcVector3D, dYaw : number, dPitch : number, dRoll:number);
    }
    var v3Zero : SMcVector3D;
    var v3MinDouble : SMcVector3D;
    var v3MaxDouble : SMcVector3D;
    var MC_VECTOR_DOUBLE_EPS : number;
    
    class SMcFVector3D {
        constructor(x : number, y : number, z : number);
        constructor(v : SMcFVector3D);
        x : number;
        y : number;
        z : number;
    }
    namespace SMcFVector3D {
        function Copy(target : SMcFVector3D, source : SMcFVector3D);
        function IsEqual(item1 : SMcFVector3D, item2 : SMcFVector3D) : boolean;
        function IsNotEqual(item1 : SMcFVector3D, item2 : SMcFVector3D) : boolean;
        function PlusEq(target : SMcFVector3D, source : SMcFVector3D);
        function MinusEq(target : SMcFVector3D, source : SMcFVector3D);
        function MulEq(target : SMcFVector3D, source : SMcFVector3D);
        function DivEq(target : SMcFVector3D, source : SMcFVector3D);
        function Plus(item1 : SMcFVector3D, item2 : SMcFVector3D) : SMcFVector3D;
        function Minus(item1 : SMcFVector3D, item2 : SMcFVector3D) : SMcFVector3D;
        function Mul(item1 : SMcFVector3D, item2 : number) : SMcFVector3D;
        function Mul(item1 : number, item2 : SMcFVector3D) : SMcFVector3D;
        function Mul(item1 : SMcFVector3D, item2 : SMcFVector3D) : number;
        function Div(item1 : SMcFVector3D, item2 : SMcFVector3D) : SMcFVector3D;
        function Div(item1 : SMcFVector3D, item2 : number) : SMcFVector3D;
        function CrossProduct(item1 : SMcFVector3D, item2 : SMcFVector3D) : SMcFVector3D;
        function CrossProductEq(target : SMcFVector3D, source : SMcFVector3D);
        function Average(item1 : SMcFVector3D, item2 : SMcFVector3D) : SMcFVector3D;
        function AverageEq(target : SMcFVector3D, source : SMcFVector3D);
        function SquareLength(item1 : SMcFVector3D, item2 : SMcFVector3D) : number;
        function Length(item1 : SMcFVector3D, item2 : SMcFVector3D) : number;
        function MulAdd(target : SMcFVector3D, dMul : number, vAdd : SMcFVector3D);
        function GetMulAdded(vector : SMcFVector3D, dMul : number, vAdd : SMcFVector3D) : SMcVector3D;
        function Normalize(vector : SMcFVector3D);
        function GetNormalized(vector : SMcFVector3D) : SMcFVector3D;
        function GetLinearInterpolationWith(vector : SMcFVector3D, vSecond : SMcFVector3D, dInterpolationParam : number) : SMcFVector3D;
        function GetDegreeYawPitchFromForwardVector(vector : SMcFVector3D, pdYaw : number, pdPitch : number);
        function GetRadianPitchRollFromUpVector(vector : SMcFVector3D, pdPitch : number, pdRoll : number);
        function GetDegreePitchRollFromUpVector(vector : SMcFVector3D, pdPitch : number, pdRoll : number);
        function RotateByRadianYawAngle(vector : SMcFVector3D, pdYaw : number);
        function RotateByDegreeYawAngle(vector : SMcFVector3D, pdYaw : number);
        function RotateByRadianYawPitchRoll(vector : SMcFVector3D, dYaw : number, dPitch : number, dRoll:number);
        function RotateByDegreeYawPitchRoll(vector : SMcFVector3D, dYaw : number, dPitch : number, dRoll:number);
    }
    var vf3Zero : SMcFVector3D;
    var vf3MinFloat : SMcFVector3D;
    var vf3MaxFloat : SMcFVector3D;
    var MC_VECTOR_FLOAT_EPS : number;

    class SMcVector2D {
        constructor();
        constructor(x : number, y : number);
        constructor(v : SMcVector2D);
        x : number;
        y : number;                        
    }
    namespace SMcVector2D {
        function Copy(target : SMcVector2D, source : SMcVector2D);
        function IsEqual(item1 : SMcVector2D, item2 : SMcVector2D) : boolean;
        function IsNotEqual(item1 : SMcVector2D, item2 : SMcVector2D) : boolean;
        function PlusEq(target : SMcVector2D, source : SMcVector2D);
        function MinusEq(target : SMcVector2D, source : SMcVector2D);
        function MulEq(target : SMcVector2D, source : SMcVector2D);
        function DivEq(target : SMcVector2D, source : SMcVector2D);
        function Plus(item1 : SMcVector2D, item2 : SMcVector2D) : SMcVector2D;
        function Minus(item1 : SMcVector2D, item2 : SMcVector2D) : SMcVector2D;
        function Mul(item1 : SMcVector2D, item2 : number) : SMcVector2D;
        function Mul(item1 : number, item2 : SMcVector2D) : SMcVector2D;
        function Mul(item1 : SMcVector2D, item2 : SMcVector2D) : number;
        function Div(item1 : SMcVector2D, item2 : SMcVector2D) : SMcVector2D;
        function Div(item1 : SMcVector2D, item2 : number) : SMcVector2D;
        function CrossProduct(item1 : SMcVector2D, item2 : SMcVector2D) : SMcVector2D;
        function Average(item1 : SMcVector2D, item2 : SMcVector2D) : SMcVector2D;
        function AverageEq(target : SMcVector2D, source : SMcVector2D);
    }
    var v2Zero : SMcVector2D;
    var v2MinDouble : SMcVector2D;
    var v2MaxDouble : SMcVector2D;

    class SMcFVector2D {
        constructor();
        constructor(x : number, y : number);
        constructor(v : SMcFVector2D);
        x : number;
        y : number;                        
    }
    namespace SMcFVector2D {
        function Copy(target : SMcFVector2D, source : SMcFVector2D);
        function IsEqual(item1 : SMcFVector2D, item2 : SMcFVector2D) : boolean;
        function IsNotEqual(item1 : SMcFVector2D, item2 : SMcFVector2D) : boolean;
        function PlusEq(target : SMcFVector2D, source : SMcFVector2D);
        function MinusEq(target : SMcFVector2D, source : SMcFVector2D);
        function MulEq(target : SMcFVector2D, source : SMcFVector2D);
        function DivEq(target : SMcFVector2D, source : SMcFVector2D);
        function Plus(item1 : SMcFVector2D, item2 : SMcFVector2D) : SMcFVector2D;
        function Minus(item1 : SMcFVector2D, item2 : SMcFVector2D) : SMcFVector2D;
        function Mul(item1 : SMcFVector2D, item2 : number) : SMcFVector2D;
        function Mul(item1 : number, item2 : SMcFVector2D) : SMcFVector2D;
        function Mul(item1 : SMcFVector2D, item2 : SMcFVector2D) : number;
        function Div(item1 : SMcFVector2D, item2 : SMcFVector2D) : SMcFVector2D;
        function Div(item1 : SMcFVector2D, item2 : number) : SMcFVector2D;
        function CrossProduct(item1 : SMcFVector2D, item2 : SMcFVector2D) : SMcFVector2D;
        function Average(item1 : SMcFVector2D, item2 : SMcFVector2D) : SMcFVector2D;
        function AverageEq(target : SMcFVector2D, source : SMcFVector2D);
    }
    var vf2Zero : SMcFVector2D;
    var vf2MinFloat : SMcFVector2D;
    var vf2MaxFloat : SMcFVector2D;

    class SMcBox {
        constructor();
        constructor(MinVertex : SMcVector3D, MaxVertex : SMcVector3D)
        constructor(dMinX : number, dMinY : number, dMinZ : number, dMaxX : number, dMaxY : number, dMaxZ : number);   
        constructor(Box : SMcBox);
        MinVertex : SMcVector3D;
        MaxVertex : SMcVector3D;               
    }

    namespace SMcBox {
        function Size(box : SMcBox) : SMcVector3D;
        function SizeX(box : SMcBox) : number;
        function SizeY(box : SMcBox) : number;
        function SizeZ(box : SMcBox) : number;
        function VertexInBox(box : SMcBox, Vertex : SMcVector3D) : boolean;
        function VertexInBoxXY(box : SMcBox, Vertex : SMcVector3D) : boolean;
        function BoxInBox(box1 : SMcBox, box2 : SMcBox) : boolean;
        function Contains(box1 : SMcBox, box2 : SMcBox) : boolean;
        function Inflate(box : SMcBox, vector1 : SMcVector3D, vector2 : SMcVector3D);
        function Deflate(box : SMcBox, vector1 : SMcVector3D, vector2 : SMcVector3D);
        function Offset(box : SMcBox, x : number, y : number, z : number);
        function Intersect(box : SMcBox, box1 : SMcBox, box2 : SMcBox) : boolean;
        function Union(box : SMcBox, box1 : SMcBox, box2 : SMcBox) : boolean;
        function Normalize(box : SMcBox);
        function Copy(target : SMcBox, source : SMcBox);
        function IsEqual(item1 : SMcBox, item2 : SMcBox) : boolean;
        function IsNotEqual(item1 : SMcBox, item2 : SMcBox) : boolean;
    }

     class SMcPlane {
        constructor();
        constructor(Normal : SMcVector3D, dLocationOrPoint : number | SMcVector3D);
        constructor(Point1 : SMcVector3D, Point2 : SMcVector3D, Point3 : SMcVector3D);
        Normal : SMcVector3D;
        dLocation : number;
     }

     class SMcAttenuation {
        constructor();
        constructor(fConst : number, fLinear : number, fSquare : number, fRange : number);
        constructor(Attenuation : SMcAttenuation);
        fConst  : number;	
        fLinear : number;
        fSquare : number;
        fRange  : number;
     }
     var aNoAttenuation : SMcAttenuation;
     var aLinearAttenuation : SMcAttenuation;
     var aSquareAttenuation : SMcAttenuation;

     class SMcAnimation {
        constructor();
        constructor(strAnimationName : string, bLoop : boolean);
        strAnimationName : string;
        bLoop : boolean;
    }

    type MC_HISTOGRAM = Float64Array;
    type CMcTime = Date;

}