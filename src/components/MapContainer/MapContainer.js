import React, { PureComponent, Component } from 'react';
import cn from './MapContainer.module.css';
import axios from 'axios';
import config from '../../config'; 
import { connect } from 'react-redux';
import externalConfig from '../../ExternalConfigurationHandler';
import actionTypes from '../../store/actions/actionTypes';

class SLayerGroup
{
    constructor(coordSystemString, bShowGeoInMetricProportion, bSetTerrainBoxByStaticLayerOnly, InitialScale2D)
    {
        this.aLayerCreateStrings = [];
        this.coordSystemString = coordSystemString;
        this.bShowGeoInMetricProportion = bShowGeoInMetricProportion;
        this.bSetTerrainBoxByStaticLayerOnly = bSetTerrainBoxByStaticLayerOnly;
        this.InitialScale2D = InitialScale2D;        
    }
}

class SViewportData {
    constructor(_viewport, _editMode) {
        this.viewport = _viewport;
        this.editMode = _editMode;
        this.canvas = _viewport.GetWindowHandle();
        let aViewportTerrains = _viewport.GetTerrains();
        this.aLayers = (aViewportTerrains != null && aViewportTerrains.length > 0 ? aViewportTerrains[0].GetLayers() : null);
        this.terrainBox = null;
        this.terrainCenter = null;
        this.rotationCenter = null;
        this.bCameraPositionSet = false;
        this.bSetTerrainBoxByStaticLayerOnly = false;
    }
}

class MapContainer extends PureComponent {

    state = {
        mapLayerGroups: new Map(),
        lastTerrainConfiguration: null,
        lastViewportConfiguration: null /*  2D/3D, 3D/2D, 2D, 3D */,
        bSameCanvas: true,
        isDTMClicked: false,
        is3DClicked: false,
    }

    mapTerrains = new Map;
    device = null
    //callbacks classes from mapCore
    CLayerReadCallback;
    CCameraUpdateCallback;
    CAsyncQueryCallback;    
    viewportData = null;
    uCameraUpdateCounter = 0;
    aLastTerrainLayers = [];
    lastCoordSys = null;
    overlayManager = null;
    activeViewport = -1;
    aViewports = [];
    viewport;
    editMode;
    lastRenderTime = (new Date).getTime();
    lastMemUsageLogTime = (new Date).getTime();
    uMemUsageLoggingFrequency = 0;
    nMousePrevX = 0;
    nMousePrevY = 0;
    mouseDownButtons = 0;
    bEdit = false;
    layerCallback = null;

    componentDidMount() {
        window.addEventListener('resize', this.resizeCanvases);
        //this.callGetCapabilitiesApi();
    }

    componentWillUnmount() {
        //Todo -> un-register events and all the map core object
        window.removeEventListener('resize', this.resizeCanvases)
    }

    componentDidUpdate(prevProps) {
        // first time map load or channing from map a to map b
        if ((!prevProps.isMapCoreSDKLoaded && this.props.isMapCoreSDKLoaded) || 
                (this.props.isMapCoreSDKLoaded && prevProps.mapToShow !== this.props.mapToShow)) {
            this.openMap(this.props.mapToShow.groupName, false);
        }
    }

    parseLayersConfiguration(jsonLayerGroups) {
    try {
        for (let jsonGroup of jsonLayerGroups)
        {
            // coordinate system creation string: MapCore.IMcGridCoordSystemGeographic.Create(MapCore.IMcGridCoordinateSystem.EDatumType.EDT_WGS84) etc.
            let coordSystemString = "MapCore." + jsonGroup.coordSystemType + ".Create(" + jsonGroup.coordSystemParams + ")";
            let layerGroup = new SLayerGroup(coordSystemString, jsonGroup.showGeoInMetricProportion, jsonGroup.centerByStaticObjectsLayerOnly, jsonGroup.InitialScale2D);

            if (jsonGroup.layers) {
                for (let layer of jsonGroup.layers) {
                    let layerCreateString = null;
                    switch (layer.type) {
                        case "WMSRaster":
                            // WMS raster layer creation string: CreateWMSRasterLayer('http://wmtsserver/wmts?request=GetCapabilities', 'layer', 'EPSG:4326', 'jpeg') etc.
                            layerCreateString = "Create" + layer.type + "Layer('" + layer.path + "'" + (layer.params ? ", " + layer.params : "") + ")";
                            break;
                        case "IMcNativeRasterMapLayer":
                            layerCreateString = "MapCore.IMcNativeRasterMapLayer.Create('" + layer.path + "', " + (layer.params ? layer.params : "MapCore.UINT_MAX, false, 0, false") + ", this.layerCallback)";
                            break;
                        case "IMcNativeDtmMapLayer":
                            layerCreateString = "MapCore.IMcNativeDtmMapLayer.Create('" + layer.path + "', " + (layer.params ? layer.params : "0") + ", this.layerCallback)";
                            break;
                        case "IMcNativeVectorMapLayer":
                            layerCreateString = "MapCore.IMcNativeVectorMapLayer.Create('" + layer.path + "', " + (layer.params ? layer.params : "") + "this.layerCallback)";
                            break;
                        case "IMcNativeStaticObjectsMapLayer":
                            layerCreateString = "MapCore.IMcNativeStaticObjectsMapLayer.Create('" + layer.path +  "', " + (layer.params ? layer.params : "0, 0") + ", this.layerCallback)";
                            break;
                        default:
                            alert("Invalid type of server layer");
                            return;
                    }
                    layerGroup.aLayerCreateStrings.push(layerCreateString);
                }
            }
            if (jsonGroup.groupName != undefined) {
                
                this.setState({mapLayerGroups: new Map(this.state.mapLayerGroups.set(jsonGroup.groupName, layerGroup))});                
                                
            } 
            // we should not get here...
            else if (jsonGroup.wmtsServerURL != undefined) {

                // layerGroup.wmtsServerURL = jsonGroup.wmtsServerURL;
                // if (jsonGroup.tileMatrixSetFilter != undefined) {

                //     layerGroup.tileMatrixSetFilter = jsonGroup.tileMatrixSetFilter;
                // }
                // aWmtsAdditionalLayerGroups.push(layerGroup);
            }
        }
    }
    catch (e)
    {
        alert("Invalid configuration JSON file");
    }
    }

    parseCapabilitiesXML(xmlDoc, capabilitiesURL, bMapCoreLayerServer = true, wmtsAdditionalLayerGroup) {
        class CXmlNode
        {
            constructor(node)
            {
                this.node = node;
            }
            GetFirstChild(tagName)
            {
                let children = this.node.getElementsByTagName(tagName);
                for (let child of children)
                {
                    if (child.parentNode == this.node)
                    {
                        return new CXmlNode(child);
                    }
                }
                return null;
            }
            GetFirstChildText(tagName)
            {
                let children = this.node.getElementsByTagName(tagName);
                for (let child of children)
                {
                    if (child.parentNode == this.node)
                    {
                        return child.textContent;
                    }
                }
                return null;
            }
            GetFirstChildAttribute(tagName, attributeName)
            {
                let children = this.node.getElementsByTagName(tagName);
                for (let child of children)
                {
                    if (child.parentNode == this.node)
                    {
                        return child.attributes.getNamedItem(attributeName).value;
                    }
                }
                return null;
            }
            GetChildren(tagName)
            {
                let children = this.node.getElementsByTagName(tagName);
                let aNodes = [];
                for (let child of children)
                {
                    if (child.parentNode == this.node)
                    {
                        aNodes.push(new CXmlNode(child));
                    }
                }
                return aNodes;
            }
            GetChildrenTexts(tagName)
            {
                let children = this.node.getElementsByTagName(tagName);
                let aTexts = [];
                for (let child of children)
                {
                    if (child.parentNode == this.node)
                    {
                        aTexts.push(child.textContent);
                    }
                }
                return aTexts;
            }
        }
        
        if (xmlDoc != null)
        {
            try
            {
                let capabilities = new CXmlNode(xmlDoc).GetFirstChild("Capabilities");
                let MapLayerServerURL = capabilities.GetFirstChildAttribute("ServiceMetadataURL", "xlink:href");
                if (MapLayerServerURL == null || MapLayerServerURL == "")
                {
                    MapLayerServerURL = capabilitiesURL;
                }
                let lastSlashIndex = MapLayerServerURL.lastIndexOf("?");
                if (lastSlashIndex < 0)
                {
                    lastSlashIndex = MapLayerServerURL.lastIndexOf("/");
                }
                if (lastSlashIndex < 0)
                {
                    alert("Invalid Capabilities file");
                    return;
                }
                let TrimmedMapLayerServerURL = MapLayerServerURL.substring(0, lastSlashIndex);
    
                let contents = capabilities.GetFirstChild("Contents");
                let aTileMatrixSets = contents.GetChildren("TileMatrixSet");
                let mapTileMatrixSets = new Map();
                for (let matrixSet of aTileMatrixSets)
                {
                    let id = matrixSet.GetFirstChildText("ows:Identifier");
                    let crs = matrixSet.GetFirstChildText("ows:SupportedCRS");
                    if (id != null &&  crs != null)
                    {
                        mapTileMatrixSets.set(matrixSet.GetFirstChildText("ows:Identifier"), { coordSystem : crs, tileMatrixSet : id});
                    }
                }
    
                let aLayers = contents.GetChildren("Layer");
                for (let layer of aLayers)
                {
                    // check here if its single layer preview. if yes put only this layer in the hashMap                    
                    let layerID = layer.GetFirstChildText("ows:Identifier");                    
                    if (this.context.mapToPreview.type === config.nodesLevel.layer && 
                            (this.context.mapToPreview.data.LayerId !== layerID && this.context.mapToPreview.dtmLayerId !== layerID)) 
                            continue;

                    let aFormats = layer.GetChildrenTexts("Format");
                    let aTileMatrixSetLinks = layer.GetChildren("TileMatrixSetLink");
                    if (aTileMatrixSetLinks.length == 0)
                    {
                        aTileMatrixSetLinks.push(null);
                    }
                    
                    for (let tileMatrixSetLink of aTileMatrixSetLinks)
                    {
                        let coordSystem = null;
                        let tileMatrixSet = null;
                        if (tileMatrixSetLink != null)
                        {
                            let tileMatrixSetParams = mapTileMatrixSets.get(tileMatrixSetLink.GetFirstChildText("TileMatrixSet"));
                            coordSystem = tileMatrixSetParams.coordSystem;
                            tileMatrixSet = tileMatrixSetParams.tileMatrixSet;
                            if (wmtsAdditionalLayerGroup && wmtsAdditionalLayerGroup.tileMatrixSetFilter && tileMatrixSet != wmtsAdditionalLayerGroup.tileMatrixSetFilter)
                            {
                                continue;
                            }
                        }
                        if (coordSystem == null)
                        {
                            let boundingBox = layer.GetFirstChild("ows:BoundingBox");
                            if (boundingBox)
                            {
                                coordSystem = boundingBox.GetFirstChildText("ows:crs");
                            }
                        }
                        let prefix = "urn:ogc:def:crs:";
                        if (coordSystem.indexOf(prefix) == 0)
                        {
                            coordSystem = coordSystem.substring(prefix.length).replace("::", ":");
                            let aGroups = [];
                            if (bMapCoreLayerServer)
                            {
                                aGroups = layer.GetFirstChildText("Group").split(",");
                                for (let i = 0; i < aGroups.length; ++i)
                                {
                                    aGroups[i] = aGroups[i] + " (server " + coordSystem + ")";
                                }
                            }
                            else
                            {
                                let groupName = layer.GetFirstChildText("ows:Title");
                                if (groupName == null)
                                {
                                    groupName = layerID;
                                }
    
                                for (let i = 0; i < aFormats.length; ++i)
                                {
                                    aFormats[i] = aFormats[i].replace("image/", "");
                                    aGroups[i] = groupName  + " (WMTS " + aFormats[i] + " " + tileMatrixSet + ")";
                                }
                            }
                            for (let i = 0; i < aGroups.length; ++i)
                            {
                                let group = aGroups[i];
    
                                // coordinate system creation string: MapCore.IMcGridGeneric.Create('EPSG:4326') etc.
                                let coordSystemString = "MapCore.IMcGridGeneric.Create('" + coordSystem + "')";
                                let layerGroup = this.state.mapLayerGroups.get(group);
                                if (layerGroup == undefined)
                                {
                                    layerGroup = new SLayerGroup(coordSystemString, true); // for MapCoreLayerServer only: bShowGeoInMetricProportion is true
                                    this.setState({mapLayerGroups: new Map(this.state.mapLayerGroups.set(group, layerGroup))});
                                }
                                else if (coordSystemString != layerGroup.coordSystemString)
                                {
                                    alert("Layers' coordinate systems do not match");
                                    return;
                                }
                                let layerCreateString;
                                if (bMapCoreLayerServer)
                                {
                                    layerCreateString = aFormats[0].replace("MapCore", "MapCore.IMcNative").replace("DTM", "Dtm") + "MapLayer" + ".Create('" + TrimmedMapLayerServerURL + "/" + layerID + "')";
                                    layerGroup.aLayerCreateStrings.push(layerCreateString);
                                }
                                else
                                {
                                    // WMTS raster layer creation string: CreateWMTSRasterLayer('http://wmtsserver/wmts?request=GetCapabilities', 'layer', 'EPSG:4326', 'jpeg') etc.
                                    layerCreateString = "CreateWMTSRasterLayer('" + capabilitiesURL + "', '" + layerID + "', '" + tileMatrixSet + "', '" + aFormats[i] + "')";
                                    layerGroup.aLayerCreateStrings.push(layerCreateString);
                                    if (wmtsAdditionalLayerGroup)
                                    {
                                        layerGroup.aLayerCreateStrings = layerGroup.aLayerCreateStrings.concat(wmtsAdditionalLayerGroup.aLayerCreateStrings);
                                        layerGroup.bSetTerrainBoxByStaticLayerOnly = wmtsAdditionalLayerGroup.bSetTerrainBoxByStaticLayerOnly;
                                        layerGroup.bShowGeoInMetricProportion = wmtsAdditionalLayerGroup.bShowGeoInMetricProportion;
                                        layerGroup.InitialScale2D = wmtsAdditionalLayerGroup.InitialScale2D;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch (e)
            {
                alert("Invalid Capabilities file");
            }
        }
    }

    createCallbackClasses() {        
        this.CLayerReadCallback = window.MapCore.IMcMapLayer.IReadCallback.extend("IMcMapLayer.IReadCallback", {
            // mandatory
            OnInitialized : function(pLayer, eStatus, strAdditionalDataString)
            {
                if (eStatus == window.MapCore.IMcErrors.ECode.SUCCESS)
                {
                    if (pLayer.GetLayerType() ==  window.MapCore.IMcNativeStaticObjectsMapLayer.LAYER_TYPE && !pLayer.IsBuiltOfContoursExtrusion())
                    {
                        pLayer.SetDisplayingItemsAttachedToTerrain(true);
                        pLayer.SetDisplayingDtmVisualization(true);
                    }
                }
                else if (eStatus !=  window.MapCore.IMcErrors.ECode.NATIVE_SERVER_LAYER_NOT_VALID)
                {
                    alert("Layer initialization: " +  window.MapCore.IMcErrors.ErrorCodeToString(eStatus) + " (" + strAdditionalDataString + ")");
                }
            },
            // mandatory
            OnReadError: function(pLayer, eErrorCode, strAdditionalDataString) {
                alert("Layer read error: " + window.MapCore.IMcErrors.ErrorCodeToString(eErrorCode) + " (" + strAdditionalDataString + ")");
            },
            // mandatory
            OnNativeServerLayerNotValid: function(pLayer, bLayerVersionUpdated) {/*TBD*/},
            // optional, needed if to be deleted by MapCore when no longer used
            // optional
            OnRemoved(pLayer, eStatus, strAdditionalDataString)
            {
                alert("Map layer has been removed");
            },

            // optional
            OnReplaced(pOldLayer, pNewLayer, eStatus, strAdditionalDataString)
            {
                alert("Map layer has been replaced");
            },            
            Release: function() { this.delete(); },
        });
        
        this.CCameraUpdateCallback = window.MapCore.IMcMapViewport.ICameraUpdateCallback.extend("IMcMapViewport.ICameraUpdateCallback", {
            // mandatory
            OnActiveCameraUpdated: function(pViewport) {
                ++this.uCameraUpdateCounter
            },
            // optional
            Release: function() {
                this.delete()
            }
        });
        
        this.CAsyncQueryCallback = window.MapCore.IMcSpatialQueries.IAsyncQueryCallback.extend("IMcSpatialQueries.IAsyncQueryCallback", {
            // optional
            __construct: function(viewportData) {
                this.__parent.__construct.call(this);
                this.viewportData = viewportData;
            },

            OnTerrainHeightResults: function (bHeightFound, height, normal) {
                if (this.viewportData.viewport != null) {
                    this.viewportData.terrainCenter.z = height + 20;
                    if (this.viewportData.viewport.GetMapType() == window.MapCore.IMcMapCamera.EMapType.EMT_3D) {
                        this.viewportData.viewport.SetCameraPosition(this.viewportData.terrainCenter);
                    }
                }
                this.delete();
            },
            OnTerrainHeightMatrixResults: function(uNumHorizontalPoints, uNumVerticalPoints, adHeightMatrix) {},
            OnTerrainHeightsAlongLineResults: function(aPointsWithHeights, aSlopes, pSlopesData) {},
            OnExtremeHeightPointsInPolygonResults: function(bPointsFound, pHighestPoint, pLowestPoint) {},
            OnTerrainAnglesResults: function(dPitch, dRoll) {},

            // OnRayIntersectionResults
            OnLineOfSightResults: function(aPoints, dCrestClearanceAngle, dCrestClearanceDistance){},
            OnPointVisibilityResults: function(bIsTargetVisible, pdMinimalTargetHeightForVisibility, pdMinimalScouterHeightForVisibility) {},
            OnAreaOfSightResults: function(pAreaOfSight, aLinesOfSight, pSeenPolygons, pUnseenPolygons, aSeenStaticObjects) {},
            OnLocationFromTwoDistancesAndAzimuthResults: function(Target){},

            // mandatory
            OnError: function(eErrorCode) {
                alert('error '+ eErrorCode);
                this.delete();
            },
        });

        let CUserData = window.MapCore.IMcUserData.extend("IMcUserData", {
            // optional
            __construct: function(bToBeDeleted) {
                this.__parent.__construct.call(this);
                this.bToBeDeleted = bToBeDeleted;
                // ...
            },

            // optional
            __destruct: function() {
                this.__parent.__destruct.call(this);
                // ...
            },

            // mandatory
            Release: function() {
                if (this.bToBeDeleted)
                {
                    this.delete();
                }
            },

            // optional
            Clone: function() {
                if (this.bToBeDeleted) {
                    return new CUserData(this.bToBeDeleted);
                }
                return this;
            },
        });
        this.layerCallback = new this.CLayerReadCallback();
    }

    doMoveObjects() {
    }

    renderMapContinuously = () => {
        this.trySetTerainBox();
        let currtRenderTime = (new Date).getTime();
        
        // render viewport(s)
        if (!this.state.bSameCanvas) {
            window.MapCore.IMcMapViewport.RenderAll(); 
        } else if (this.viewport != null) {
            this.viewport.Render();
        }
    
        // move objects if they exist
        this.doMoveObjects();
        this.lastRenderTime = currtRenderTime;
    
        // log memory usage and heap size
        if (this.uMemUsageLoggingFrequency != 0 && currtRenderTime >= this.lastMemUsageLogTime + this.uMemUsageLoggingFrequency * 1000) {
            let usage = window.MapCore.IMcMapDevice.GetMaxMemoryUsage();
            console.log("Max mem = " + window.MapCore.IMcMapDevice.GetMaxMemoryUsage().toLocaleString() + ", heap = " + window.MapCore.IMcMapDevice.GetHeapSize().toLocaleString() + " B");
            this.lastMemUsageLogTime = currtRenderTime;
        }
    
        // ask the browser to render again
        requestAnimationFrame(this.renderMapContinuously);
    }

    trySetTerainBox() {
        for (let j = 0; j < this.aViewports.length; j++) {
            if (this.aViewports[j].terrainBox == null) {
                let aViewportLayers = this.aViewports[j].aLayers;
                if (aViewportLayers.length != 0) {
                    this.aViewports[j].terrainBox = new window.MapCore.SMcBox(-window.MapCore.DBL_MAX, -window.MapCore.DBL_MAX, 0, window.MapCore.DBL_MAX, window.MapCore.DBL_MAX, 0);
                    for (let i = 0; i < aViewportLayers.length; ++i) {
                        if (this.aViewports[j].bSetTerrainBoxByStaticLayerOnly && aViewportLayers[i].GetLayerType() != window.MapCore.IMcNativeStaticObjectsMapLayer.LAYER_TYPE) {
                            continue;
                        }
    
                        if (!aViewportLayers[i].IsInitialized()) {
                            this.aViewports[j].terrainBox = null;
                            return;
                        }
    
                        let layerBox = aViewportLayers[i].GetBoundingBox();
                        if (layerBox.MinVertex.x > this.aViewports[j].terrainBox.MinVertex.x) {
                            this.aViewports[j].terrainBox.MinVertex.x = layerBox.MinVertex.x;
                        }
                        if (layerBox.MaxVertex.x < this.aViewports[j].terrainBox.MaxVertex.x) {
                            this.aViewports[j].terrainBox.MaxVertex.x = layerBox.MaxVertex.x;
                        }
                        if (layerBox.MinVertex.y > this.aViewports[j].terrainBox.MinVertex.y) {
                            this.aViewports[j].terrainBox.MinVertex.y = layerBox.MinVertex.y;
                        }
                        if (layerBox.MaxVertex.y < this.aViewports[j].terrainBox.MaxVertex.y) {
                            this.aViewports[j].terrainBox.MaxVertex.y = layerBox.MaxVertex.y;
                        }
                    }
                }
                else {
                    this.aViewports[j].terrainBox = new window.MapCore.SMcBox(0, 0, 0, 0, 0, 0);
                }
    
                this.aViewports[j].terrainCenter = window.MapCore.SMcVector3D((this.aViewports[j].terrainBox.MinVertex.x + this.aViewports[j].terrainBox.MaxVertex.x) / 2, (this.aViewports[j].terrainBox.MinVertex.y + this.aViewports[j].terrainBox.MaxVertex.y) / 2, 0);
                this.aViewports[j].terrainCenter.z = 10000;
            }
    
            if (!this.aViewports[j].bCameraPositionSet)
            {
                if (this.aViewports[j].viewport.GetMapType() == window.MapCore.IMcMapCamera.EMapType.EMT_2D)
                {
                    this.aViewports[j].viewport.SetCameraPosition(this.aViewports[j].terrainCenter);
                    this.aViewports[j].bCameraPositionSet = true;
                }
                else // 3D
                {
                    let height = {};
                    this.aViewports[j].terrainCenter.z = 1000;
                    this.aViewports[j].viewport.SetCameraPosition(this.aViewports[j].terrainCenter);
                    let params = new window.MapCore.IMcSpatialQueries.SQueryParams();
                    params.eTerrainPrecision = window.MapCore.IMcSpatialQueries.EQueryPrecision.EQP_HIGH;
                    this.aViewports[j].bCameraPositionSet = true;
                    params.pAsyncQueryCallback = new this.CAsyncQueryCallback(this.aViewports[j]);
                    this.aViewports[j].viewport.GetTerrainHeight(this.aViewports[j].terrainCenter, height, null, params); // async, wait for OnTerrainHeightResults()
                }
            }
        }
    }

    resizeCanvases = () => {
        if (this.aViewports.length == 0) {
            return;
        }
   
       let CanvasesInRow, CanvasesInColumn;
       if (!this.state.bSameCanvas) {
           CanvasesInRow = Math.ceil(Math.sqrt(this.aViewports.length));
           CanvasesInColumn = Math.ceil(this.aViewports.length / CanvasesInRow);
       }
       else {
           CanvasesInRow = 1;
           CanvasesInColumn = 1;
       }
       //todo: use this instead: document.getElementById('id').getBoundingClientRect()
    //    let width =  (window.innerWidth - 40) / CanvasesInRow - 10;
    //    let height = (window.innerHeight - 80) / CanvasesInColumn - 15;
       let width =  document.getElementById('canvasesContainer').getBoundingClientRect().width;
       let height = document.getElementById('canvasesContainer').getBoundingClientRect().height;
       
       for (let i = 0; i < this.aViewports.length ; i++) {
           this.aViewports[i].canvas.width = width;
           this.aViewports[i].canvas.height = height;
           this.aViewports[i].viewport.ViewportResized();
       }
    }

    calcMinMaxHeights() {
        let minHeight = 0;
        let maxHeight = 700;
        let fp = this.viewport.GetCameraFootprint();

        if (fp.bUpperLeftFound && fp.bUpperRightFound && fp.bLowerRightFound && fp.bLowerLeftFound) {
            let minPoint = {}, maxPoint = {};
            if (this.viewport.GetExtremeHeightPointsInPolygon([fp.UpperLeft, fp.UpperRight, fp.LowerRight, fp.LowerLeft], maxPoint, minPoint)) {
                minHeight = minPoint.Value.z;
                maxHeight = maxPoint.Value.z;
            }
        }
        return { minHeight, maxHeight };
    }

    // function switching DTM-visualization (height map) on/off
    doDtmVisualization = () => {
        if (!this.viewport.GetDtmVisualization()) {
            let result = this.calcMinMaxHeights();
            let DtmVisualization = new window.MapCore.IMcMapViewport.SDtmVisualizationParams();
            window.MapCore.IMcMapViewport.SDtmVisualizationParams.SetDefaultHeightColors(DtmVisualization, result.minHeight, result.maxHeight);
            DtmVisualization.bDtmVisualizationAboveRaster = true;
            DtmVisualization.uHeightColorsTransparency = 120;
            DtmVisualization.uShadingTransparency = 255;
            this.viewport.SetDtmVisualization(true, DtmVisualization);
        } else {
            this.viewport.SetDtmVisualization(false);
        }
    }

    mouseWheelHandler = e => {
        let bHandled = {};
        let eCursor = {};
        let wheelDelta = - e.deltaY;
        this.editMode.OnMouseEvent(window.MapCore.IMcEditMode.EMouseEvent.EME_MOUSE_WHEEL, window.MapCore.SMcPoint(0, 0), e.ctrlKey, wheelDelta, bHandled, eCursor);
        if (bHandled.Value) {
            return;
        }
    
        let factor = (e.shiftKey ? 10 : 1);
    
        if (this.viewport.GetMapType() == window.MapCore.IMcMapCamera.EMapType.EMT_3D) {
            this.viewport.MoveCameraRelativeToOrientation(window.MapCore.SMcVector3D(0, 0, wheelDelta / 8.0 * factor), true);
        } else {
            let fScale = this.viewport.GetCameraScale();
            if (wheelDelta > 0) {
                this.viewport.SetCameraScale(fScale / 1.25);
            } else {
                this.viewport.SetCameraScale(fScale * 1.25);
            }
    
            if (this.viewport.GetDtmVisualization()) {
                this.doDtmVisualization();
                this.doDtmVisualization();
            }
        }
    
        e.preventDefault();
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
    }


    mouseMoveHandler = e => {
        if (this.viewport.GetWindowHandle() != e.target) {
            return;
        }
    
        let EventPixel = window.MapCore.SMcPoint(e.offsetX, e.offsetY);
        if (e.buttons <= 1) {
            let bHandled = {};
            let eCursor = {};
            this.editMode.OnMouseEvent(e.buttons == 1 ? window.MapCore.IMcEditMode.EMouseEvent.EME_MOUSE_MOVED_BUTTON_DOWN : window.MapCore.IMcEditMode.EMouseEvent.EME_MOUSE_MOVED_BUTTON_UP, 
                EventPixel, e.ctrlKey, 0, bHandled, eCursor);
            if (bHandled.Value) {
                e.preventDefault();
                e.cancelBubble = true;
                if (e.stopPropagation) e.stopPropagation();
                return;
            }
        }
    
        if (e.buttons == 1) {
            if (this.nMousePrevX != 0) {
                let factor = (e.shiftKey ? 10 : 1);
                if (this.viewport.GetMapType() == window.MapCore.IMcMapCamera.EMapType.EMT_3D) {
                    if (e.ctrlKey) {
                        this.viewport.MoveCameraRelativeToOrientation(window.MapCore.SMcVector3D((this.nMousePrevX - EventPixel.x) / 2.0 * factor, - (this.nMousePrevY - EventPixel.y) / 2.0 * factor, 0), false);
                    }
                    else {
                        this.viewport.RotateCameraRelativeToOrientation((this.nMousePrevX - EventPixel.x) / 2.0, - (this.nMousePrevY - EventPixel.y) / 2.0, 0);
                    }
                } else {
                    if (e.ctrlKey) {
                        this.viewport.SetCameraOrientation((this.nMousePrevX - EventPixel.x) / 2.0, window.MapCore.FLT_MAX, window.MapCore.FLT_MAX, true);
                    }
                    else {
                        this.viewport.ScrollCamera((this.nMousePrevX - EventPixel.x) * factor, (this.nMousePrevY - EventPixel.y) * factor);
                    }
                }
    
                e.preventDefault();
                e.cancelBubble = true;
                if (e.stopPropagation) e.stopPropagation();
            }
        }
    
        this.nMousePrevX = EventPixel.x;
        this.nMousePrevY = EventPixel.y;
    }

    mouseDownHandler = e => {
        if (this.editMode.IsEditingActive()) {
            // EditMode is active: don't change active viewport, but ignore click on non-active one
            if (this.viewport.GetWindowHandle() != e.target)
            {
               return;
            }
        } else if (!this.state.bSameCanvas) {
            for (let i = 0; i < this.aViewports.length; i++) {
                if (e.target ==  this.aViewports[i].viewport.GetWindowHandle()) {
                    this.activeViewport = i;
                    this.updateActiveViewport();
                    break;
                }                
            }
        }
    
        let EventPixel = window.MapCore.SMcPoint(e.offsetX, e.offsetY);
        this.mouseDownButtons = e.buttons;
        if (e.buttons == 1) {
            let bHandled = {};
            let eCursor = {};
            this.editMode.OnMouseEvent(window.MapCore.IMcEditMode.EMouseEvent.EME_BUTTON_PRESSED, EventPixel, e.ctrlKey, 0, bHandled, eCursor);
            if (bHandled.Value) {
                e.preventDefault();
                e.cancelBubble = true;
                if (e.stopPropagation) e.stopPropagation();
                return;
            }
    
            this.nMousePrevX = EventPixel.x;
            this.nMousePrevY = EventPixel.y;
        }
    
        e.preventDefault();
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
    }
    mouseUpHandler = e => {
        if (this.viewport.GetWindowHandle() != e.target) {
            return;
        }
        
        let EventPixel = window.MapCore.SMcPoint(e.offsetX, e.offsetY);
        let buttons = this.mouseDownButtons & ~e.buttons;
        if (buttons == 1) {
            let bHandled = {};
            let eCursor = {};
            this.editMode.OnMouseEvent(window.MapCore.IMcEditMode.EMouseEvent.EME_BUTTON_RELEASED, EventPixel, e.ctrlKey, 0, bHandled, eCursor);
            if (bHandled.Value) {
                e.preventDefault();
                e.cancelBubble = true;
                if (e.stopPropagation) e.stopPropagation();
                return;
            }
        }
    }
    mouseDblClickHandler = e => {
        if (this.viewport.GetWindowHandle() != e.target) {
            return;
        }
        
        let EventPixel = window.MapCore.SMcPoint(e.offsetX, e.offsetY);
        let buttons = this.mouseDownButtons & ~e.buttons;
        if (this.bEdit) {
            let aTargets = this.viewport.ScanInGeometry(new window.MapCore.SMcScanPointGeometry(window.MapCore.EMcPointCoordSystem.EPCS_SCREEN, window.MapCore.SMcVector3D(EventPixel.x, EventPixel.y, 0), 20), false);
            for (let i = 0; i < aTargets.length; ++i) {
                if (aTargets[i].eTargetType == window.MapCore.IMcSpatialQueries.EIntersectionTargetType.EITT_OVERLAY_MANAGER_OBJECT) {
                    if (this.bEdit) {
                        this.editMode.StartEditObject(aTargets[i].ObjectItemData.pObject, aTargets[i].ObjectItemData.pItem);
                    }
                    break;
                }
            }
            this.bEdit = false;
            e.preventDefault();
            e.cancelBubble = true;
            if (e.stopPropagation) e.stopPropagation();
            return;
        }
    
        if (buttons == 1) {
            let bHandled = {};
            let eCursor = {};
            this.editMode.OnMouseEvent(window.MapCore.IMcEditMode.EMouseEvent.EME_BUTTON_DOUBLE_CLICK, EventPixel, e.ctrlKey, 0, bHandled, eCursor);
            if (bHandled.Value) {
                e.preventDefault();
                e.cancelBubble = true;
                if (e.stopPropagation) e.stopPropagation();
                return;
            }
        }
    }

    createViewport(terrain, eMapTypeToOpen) {
        // create canvas if needed
        let currCanvas;
        if (!this.state.bSameCanvas || this.aViewports.length == 0) {
            // create canvas
            currCanvas = document.createElement('canvas');
            //currCanvas.style.border = "thick solid #FFFFFF"; 
            
            currCanvas.addEventListener("wheel", this.mouseWheelHandler, false);
            currCanvas.addEventListener("mousemove", this.mouseMoveHandler, false);
            currCanvas.addEventListener("mousedown", this.mouseDownHandler, false);
            currCanvas.addEventListener("mouseup", this.mouseUpHandler, false);
            currCanvas.addEventListener("dblclick", this.mouseDblClickHandler, false);
        }
        else {
            // use existing canvas
            currCanvas = this.aViewports[0].canvas;
        }
    
        // create viewport
        let layerGroup = this.state.mapLayerGroups.get(this.state.lastTerrainConfiguration);
        let vpCreateData = new window.MapCore.IMcMapViewport.SCreateData(eMapTypeToOpen);
        vpCreateData.pDevice = this.device;
        vpCreateData.pCoordinateSystem = (terrain != null ? terrain.GetCoordinateSystem() : this.overlayManager.GetCoordinateSystemDefinition());
        vpCreateData.pOverlayManager = this.overlayManager;
        vpCreateData.hWnd = currCanvas;
        if (layerGroup.bShowGeoInMetricProportion) {
            vpCreateData.bShowGeoInMetricProportion = true;
        }
        this.viewport = window.MapCore.IMcMapViewport.Create(/*Camera*/null, vpCreateData, terrain != null ? [terrain] : null);
        this.editMode = window.MapCore.IMcEditMode.Create(this.viewport);
        
        // add camera-update callback
        let callback = new this.CCameraUpdateCallback();
        this.viewport.AddCameraUpdateCallback(callback);

        if (this.viewport.GetMapType() == window.MapCore.IMcMapCamera.EMapType.EMT_3D) {
            this.viewport.SetScreenSizeTerrainObjectsFactor(1.5);
            this.viewport.SetCameraRelativeHeightLimits(3, 10000, true);
        }
        else {
            this.viewport.SetStaticObjectsVisibilityMaxScale(50);
            if (layerGroup.InitialScale2D) {
                this.viewport.SetCameraScale(layerGroup.InitialScale2D);
            }
        }
        
        this.viewport.SetBackgroundColor(window.MapCore.SMcBColor(70, 70, 70, 255));

        // set object delays for optimazing rendering objects
        this.viewport.SetObjectsDelay(window.MapCore.IMcMapViewport.EObjectDelayType.EODT_VIEWPORT_CHANGE_OBJECT_UPDATE, true, 50);
        this.viewport.SetObjectsDelay(window.MapCore.IMcMapViewport.EObjectDelayType.EODT_VIEWPORT_CHANGE_OBJECT_CONDITION, true, 50);
        this.viewport.SetObjectsDelay(window.MapCore.IMcMapViewport.EObjectDelayType.EODT_VIEWPORT_CHANGE_OBJECT_SIZE, true, 5);
        this.viewport.SetObjectsDelay(window.MapCore.IMcMapViewport.EObjectDelayType.EODT_VIEWPORT_CHANGE_OBJECT_HEIGHT, true, 50);

        // set objects movement threshold
        this.viewport.SetObjectsMovementThreshold(1);

        // set terrain cache
        if (terrain != null) {
            this.viewport.SetTerrainNumCacheTiles(terrain, false, 300);
            this.viewport.SetTerrainNumCacheTiles(terrain, true, 300);
        }

        let viewportData = new SViewportData(this.viewport, this.editMode);
        viewportData.terrain = terrain;
        if (layerGroup.bSetTerrainBoxByStaticLayerOnly) {
            viewportData.bSetTerrainBoxByStaticLayerOnly = true;
        }

        this.aViewports.push(viewportData);
        const canvasParent =  document.getElementById('canvasesContainer')
        canvasParent.appendChild(currCanvas);
        this.activeViewport = this.aViewports.length - 1;

        this.updateActiveViewport();
        this.resizeCanvases();
        this.trySetTerainBox();
    }

    // function updating active viewport / Edit Mode and canvas borders
    updateActiveViewport() {
        if (this.activeViewport >= 0) {
            for (let i = 0; i < this.aViewports.length; ++i) {
                if (i == this.activeViewport) {
                    this.viewport = this.aViewports[i].viewport;
                    this.editMode = this.aViewports[i].editMode;
                    if (!this.state.bSameCanvas) {
                        //this.aViewports[i].canvas.style.borderColor = "blue";
                    }
                }
                else {
                    //this.aViewports[i].canvas.style.borderColor = "white";
                }
            }
        }
    }

    doPrevViewport() {
        if (this.aViewports.length > 1) {
            this.activeViewport = (this.activeViewport + this.aViewports.length - 1) % this.aViewports.length;
            this.updateActiveViewport();
        }
    }

    doNextViewport() {
        if (this.aViewports.length > 1)
        {
            this.activeViewport = (this.activeViewport + 1) % this.aViewports.length;
            this.updateActiveViewport();
        }
    }   

    // function creating terrain overlayManager and viewport, starting rendering
    initializeViewports() {
        let terrain = this.mapTerrains.get(this.state.lastTerrainConfiguration);
        if (terrain == undefined) {            
            if (this.aLastTerrainLayers.length > 0) {
                terrain = window.MapCore.IMcMapTerrain.Create(this.lastCoordSys, this.aLastTerrainLayers);
                terrain.AddRef();
            }
            else {
                terrain = null;
            }
            this.mapTerrains.set(this.state.lastTerrainConfiguration, terrain);
        }
    
        // create overlay manager
        if (this.overlayManager == null) {            
            if (this.lastCoordSys == null) {
                this.lastCoordSys = window.MapCore.IMcGridUTM.Create(36, window.MapCore.IMcGridCoordinateSystem.EDatumType.EDT_ED50_ISRAEL);
                this.lastCoordSys.AddRef();
            }
            this.overlayManager = window.MapCore.IMcOverlayManager.Create(this.lastCoordSys);
            this.overlayManager.AddRef();
    
            // create overlay for objects
            this.overlay = window.MapCore.IMcOverlay.Create(this.overlayManager);
    
        }
    
        // create map viewports
        switch (this.state.lastViewportConfiguration) {
            case "2D/3D":
                this.createViewport(terrain, window.MapCore.IMcMapCamera.EMapType.EMT_2D);
                this.createViewport(terrain,window. MapCore.IMcMapCamera.EMapType.EMT_3D);
                this.DoPrevViewport();
                break;
            case "3D/2D":
                if (this.state.bSameCanvas) {
                    this.createViewport(terrain, window.MapCore.IMcMapCamera.EMapType.EMT_2D);
                    this.createViewport(terrain, window.MapCore.IMcMapCamera.EMapType.EMT_3D);
                }
                else {
                    this.createViewport(terrain, window.MapCore.IMcMapCamera.EMapType.EMT_3D);
                    this.createViewport(terrain, window.MapCore.IMcMapCamera.EMapType.EMT_2D);
                    this.doPrevViewport();
                }
                break;
            case "2D":
                this.createViewport(terrain, window.MapCore.IMcMapCamera.EMapType.EMT_2D);
                break;
            case "3D":
                this.createViewport(terrain, window.MapCore.IMcMapCamera.EMapType.EMT_3D);
                break;
        }
        
        // example of try-catch MapCoreError
        try {
            // MapCore API function call
        }
        catch (ex) {
            if (ex instanceof window.MapCoreError) {
                alert("MapCore Error #" + ex.name + ": " + ex.message);
            }
            else {
                throw ex;
            }
        }
    
        // ask the browser to render once
        requestAnimationFrame(this.renderMapContinuously);
    }

    createMapLayersAndViewports() {
        // if this terrain has not been created yet
        if (this.mapTerrains.get(this.state.lastTerrainConfiguration) == undefined) {
            this.aLastTerrainLayers = [];
            let group = this.state.mapLayerGroups.get(this.state.lastTerrainConfiguration);            
            // create coordinate system by running a code string prepared during parsing configuration files (JSON configuration file and capabilities XML of MapCoreLayerServer)
            // e.g. MapCore.IMcGridCoordSystemGeographic.Create(MapCore.IMcGridCoordinateSystem.EDatumType.EDT_WGS84)
            this.lastCoordSys = eval(group.coordSystemString);
        
            for (let i = 0; i < group.aLayerCreateStrings.length; ++i) {
                // create map layer by running code string prepared during parsing configuration files (JSON configuration file and capabilities XML of MapCoreLayerServer)
                // e.g. MapCore.IMcNativeRasterMapLayer.Create('http:Maps/Raster/SwissOrtho-GW') or CreateWMTSRasterLayer(...) or CreateWMSRasterLayer(...)
                const layer = eval(group.aLayerCreateStrings[i]);
                this.aLastTerrainLayers.push(layer);
            }
            this.lastCoordSys.AddRef();
        }
    
        this.initializeViewports();
    }

    // async callGetCapabilitiesApi() {
    //     try {
    //         const response = await axios.get(config.urls.getCapabilities);
    //         const capabilitiesXMLDoc =  new DOMParser().parseFromString(response.data, "text/xml");
    //         this.parseCapabilitiesXML(capabilitiesXMLDoc, config.urls.getCapabilities);
    //         this.openMap(this.context.mapToPreview.title);
            
    //     } catch (e) {
    //         console.log('error when trying to call getCapabilities: ', e);
    //     }
    // }
    
    async openMap(title, is3d) {
        const serverUrl = externalConfig.getConfiguration().MAPCORE_LAYER_SERVER_URL;        
            if (serverUrl) {
                try {
                    const response = await axios.get(serverUrl + config.urls.getCapabilities);
                    const capabilitiesXMLDoc =  new DOMParser().parseFromString(response.data, "text/xml");
                    this.parseCapabilitiesXML(capabilitiesXMLDoc, config.urls.getCapabilities);
                } catch (e) {
                    console.log('error when trying to call getCapabilities: ', e);
                }
            } else {
                this.parseLayersConfiguration([this.props.mapToShow])
            }


            this.state.mapLayerGroups.forEach( (value, key) => {
                if (key === title) {
                    
                    this.setState({
                            lastTerrainConfiguration: key,
                            lastViewportConfiguration: is3d ? "3D":"2D"
                    }, () => {
                        if (this.device === null) {
                            // create map device (MapCore initialization)
                            let init = new window.MapCore.IMcMapDevice.SInitParams();
                            init.uNumTerrainTileRenderTargets = 100;
                        
                            const device = window.MapCore.IMcMapDevice.Create(init);
                            device.AddRef();
                            this.device = device;
                        
                            // create callback classes
                            this.createCallbackClasses();
                        }        
                        this.createMapLayersAndViewports();
                    });
                }
            })                                
    }

    doDtmVisualization() {
        if (!this.viewport.GetDtmVisualization())
        {
            let result = this.calcMinMaxHeights();
            let DtmVisualization = new window.MapCore.IMcMapViewport.SDtmVisualizationParams();
            window.MapCore.IMcMapViewport.SDtmVisualizationParams.SetDefaultHeightColors(DtmVisualization, result.minHeight, result.maxHeight);
            DtmVisualization.bDtmVisualizationAboveRaster = true;
            DtmVisualization.uHeightColorsTransparency = 120;
            DtmVisualization.uShadingTransparency = 255;
            this.viewport.SetDtmVisualization(true, DtmVisualization);
        }
        else
        {
            this.viewport.SetDtmVisualization(false);
        }
    }

    // function closing active viewport
    closeMap() {
        if (this.activeViewport < 0) {
            return;
        }
        // delete Edit Mode
        this.editMode.Destroy();
        // delete viewport
        this.viewport.Release();
        if (!this.bSameCanvas || this.aViewports.length == 1) {
            // delete canvas
            let currCanvas = this.aViewports[this.activeViewport].canvas;
            currCanvas.removeEventListener("wheel", this.mouseWheelHandler, false);
            currCanvas.removeEventListener("mousemove", this.mouseMoveHandler, false);
            currCanvas.removeEventListener("mousedown", this.mouseDownHandler, false);
            currCanvas.removeEventListener("mouseup", this.mouseUpHandler, false);
            currCanvas.removeEventListener("dblclick", this.mouseDblClickHandler, false);
            let canvasParent = document.getElementById('canvasesContainer');
            canvasParent.removeChild(this.aViewports[this.activeViewport].canvas);
        }
        // remove viewport from viewport data array
        //this.activeViewport.viewport = this.activeViewport.viewport ? null :;
        this.aViewports.splice(this.activeViewport, 1);
        if (this.aViewports.length == 0) {
            // no more viewports
            this.viewport = null;
            this.editMode = null;
            this.activeViewport = -1;
            // delete terrain
            this.mapTerrains.forEach(terrain => { terrain.Release(); });
            this.mapTerrains.clear();
            // delete overlay manager
            this.overlayManager.Release();
            this.overlayManager = null;
    
        }
        else {
            // there are viewports: update active viewport
            if (this.activeViewport >= this.aViewports.length) {
                this.activeViewport = this.aViewports.length - 1;
            }
            this.updateActiveViewport();
            this.resizeCanvases();
        }


        this.setState({
            mapLayerGroups: new Map(),
            lastTerrainConfiguration: null,
            lastViewportConfiguration: null /*  2D/3D, 3D/2D, 2D, 3D */,
            bSameCanvas: true
        });
    
        this.mapTerrains = new Map;
        this.device = null         
        this.viewportData = null;
        this.aLastTerrainLayers = [];
        this.lastCoordSys = null;
        this.overlayManager = null;
        this.activeViewport = -1;
        this.aViewports = [];
        this.lastRenderTime = (new Date).getTime();
        this.lastMemUsageLogTime = (new Date).getTime();
        this.uMemUsageLoggingFrequency = 0;
        this.nMousePrevX = 0;
        this.nMousePrevY = 0;
        this.mouseDownButtons = 0;
        this.bEdit = false;

    }

    renderLoadingMessage() {
        return (
            <div className={cn.LoadingMessage}>
                Map core SDK is Loading...
            </div>
        )
    }
    
    renderRow(label, value) {
        return (
            <div className={cn.DescRow}>
                <span className={cn.DescLabel}>{label}:</span>
                <span className={cn.DescValue}>{value}</span>
             </div>
        )
    }

    onSelectOtherMapClicked = () => {

    }

    showHideDtmActionClicked = () => {
        this.setState({isDTMClicked: !this.state.isDTMClicked}, this.doDtmVisualization)
    }

    showHide3DActionClicked = () => {
        this.setState(
            {
                is3DClicked: !this.state.is3DClicked
            }, () => this.openMap(this.props.mapToShow.groupName, this.state.is3DClicked))
    }

    onMoreActionsClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const selectOtherMapAction = {            
            name: "Select Other Map",
            func: this.onSelectOtherMapClicked,
            iconCss: "Map"            
        };

        const menuItemsList = [];

        const dtmLayer = this.props.mapToShow.layers.find(layer => layer.type.toLowerCase().includes('dtm'));

        if (dtmLayer) {
            const showHideDtmAction = {
                name: (this.state.isDTMClicked ? 'Hide' : 'Show') + " DTM visualization",
                func: this.showHideDtmActionClicked,
                iconCss: "DTM"
            }
    
            const showHide3DAction = {
                name: 'Switch To ' + (this.state.is3DClicked ? '2D' : '3D'),
                func: this.showHide3DActionClicked,
                iconCss: "ThreeD"
            }

            menuItemsList.push(showHideDtmAction);
            menuItemsList.push(showHide3DAction);
            menuItemsList.push(selectOtherMapAction);
        }

        this.props.showContextMenu(e.nativeEvent.x, e.nativeEvent.y, menuItemsList);        
    }

    renderMapToolbox() {        
        return (
            <div className={`${cn.MapToolbox}`}>
                <div className={cn.Description}>
                    {this.props.mapToShow.groupName}
                </div>
                <span className={cn.MoreActionsBtn} onClick={this.onMoreActionsClick}></span>
            </div>
        )
    }

    getCanvas() {
        return (
            <div className={cn.MapWrapper}>
                <div className={cn.CanvasContainer} id='canvasesContainer'></div>
                {this.renderMapToolbox()}
            </div>
        );
    }

    render() {    
        return (
            <div className={cn.Wrapper}>
                {this.props.isMapCoreSDKLoaded ? this.getCanvas() : this.renderLoadingMessage()}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isMapCoreSDKLoaded: state.map.isMapCoreSDKLoaded,
        mapToShow: state.map.mapToShow
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        showContextMenu: (x, y, items) => dispatch({ type: actionTypes.SHOW_CONTEXT_MENU, payload: {x, y, items} }),
    };
};

export default connect(mapStateToProps, mapDispachToProps)(MapContainer);