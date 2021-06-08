import React, { PureComponent, Component } from 'react';
import cn from './MapContainer.module.css';
import axios from 'axios';
import config from '../../config';
import { connect } from 'react-redux';
import externalConfig from '../../ExternalConfigurationHandler';
import actionTypes from '../../store/actions/actionTypes';
import actions from '../../store/actions';
import SwitchMapForm from '../SwitchMapForm/SwitchMapForm';
import * as geoCalculations from '../../utils/geoCalculations';
import { viewerStates } from '../../store/reducers/plannerReducer';

class SLayerGroup {
    constructor(coordSystemString, bShowGeoInMetricProportion, bSetTerrainBoxByStaticLayerOnly, InitialScale2D) {
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
        isSwitchMapFormOpen: false,
        isOriginSelectionMode: false
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
    requestAnimationFrameId = -1;
    aPositions = [];
    aObjects = [];
    lineScheme = null;
    textScheme = null;

    TempOriginAngle = 0;

    MapObjects = {};

    EnemyPositions = [];

    SelectedMissionPointObject = null;
    MissionPointsObjects = [];

    componentDidMount() {
        window.addEventListener('resize', this.resizeCanvases);
        if (this.props.isMapCoreSDKLoaded) {
            this.openMap(this.props.mapToShow.groupName, false);
            console.log('mapCore version: ', window.MapCore.IMcMapDevice.GetVersion());
            this.CreateMapcoreObjects();
        }
        //this.callGetCapabilitiesApi();
    }

    componentWillUnmount() {
        //Todo -> un-register events and all the map core object
        window.removeEventListener('resize', this.resizeCanvases);
        cancelAnimationFrame(this.requestAnimationFrameId);
        this.requestAnimationFrameId = null;
    }

    componentDidUpdate(prevProps) {
        // first time map load or channing from map a to map b
        if ((!prevProps.isMapCoreSDKLoaded && this.props.isMapCoreSDKLoaded) ||
            (this.props.isMapCoreSDKLoaded && prevProps.mapToShow !== this.props.mapToShow)) {
            this.openMap(this.props.mapToShow.groupName, false);
            console.log('mapCore version: ', window.MapCore.IMcMapDevice.GetVersion());
            this.CreateMapcoreObjects();
            this.RemoveDroneData();
        }

        const dronesPositions = this.props.dronesPositions;
        if (dronesPositions &&
            (prevProps.dronesPositions != dronesPositions)) {
            Object.keys(dronesPositions).forEach(droneNumber => {
                if (dronesPositions[droneNumber] && dronesPositions[droneNumber].offset && dronesPositions[droneNumber].workingOrigin) {
                    if (!prevProps.dronesPositions[droneNumber] ||  // first position
                        (dronesPositions[droneNumber].offset != prevProps.dronesPositions[droneNumber].offset)) {  // cahnged position
                        this.MoveDrone(droneNumber);
                     //   this.DrawDroneMapImage();
                    }
                    else if (dronesPositions[droneNumber].enemyOffsets != prevProps.dronesPositions[droneNumber].enemyOffsets) {
                        this.DrawEnemyObject(droneNumber);
                    }
                }
            })
        }

        if (this.props.isPointSelectionMode && !prevProps.isPointSelectionMode && !this.SelectedMissionPointObject) {
            this.selectMissionPointFromMap();
        }

        if (this.props.selectedDrone != prevProps.selectedDrone) {
            Object.keys(dronesPositions).forEach(droneNumber => {
                if (this.MapObjects[droneNumber] && this.MapObjects[droneNumber].WorkingOrigin) {
                    this.SetOpacityToDroneObjects(droneNumber, droneNumber == this.props.selectedDrone);
                }
            })

        }

        const { viewerState, savedMissionPlan, draftMissionStages } = this.props;

        if (viewerState == viewerStates.savedMission &&
            (viewerState != prevProps.viewerState || savedMissionPlan != prevProps.savedMissionPlan)) {
            this.DrawMissionWayPoints(savedMissionPlan);
        }
        else if (viewerState == viewerStates.draft &&
            (viewerState != prevProps.viewerState || draftMissionStages != prevProps.draftMissionStages)) {
            this.DrawMissionWayPoints(draftMissionStages);
        }
    }

    RemoveDroneData = (droneNumber) => {
        if (this.MapObjects[droneNumber]) {
            if (this.MapObjects[droneNumber].WorkingOrigin) {
                this.MapObjects[droneNumber].WorkingOrigin.Remove();
                this.MapObjects[droneNumber].WorkingOrigin = null;
                this.props.deleteDronePosition();
            }
            if (this.MapObjects[droneNumber].Drone) {
                this.MapObjects[droneNumber].Drone.Remove();
                this.MapObjects[droneNumber].Drone = null;
            }
            if (this.MapObjects[droneNumber].Route) {
                this.MapObjects[droneNumber].Route.Remove();
                this.MapObjects[droneNumber].Route = null;
            }
        }
    }

    CreateMapcoreObjects = () => {
        this.LoadMapcoreObject("lineScheme", "LineScheme.json");
        this.LoadMapcoreObject("ScreenPictureClick", "ScreenPictureClick.json");
        this.LoadMapcoreObject("ScreenPictureDrone", "ScreenPictureDrone.json");
        this.LoadMapcoreObject("WorldPictureScheme", "WorldPicture3.json");
        this.LoadMapcoreObject("textScheme", "TextScheme.m");
    }

    LoadMapcoreObject(objectName, schemeName) {
        if (this[objectName] == null) {
            this.FetchFileToByteArray("http:ObjectWorld/Schemes/" + schemeName).then(
                bytes => {
                    if (bytes != null) {
                        this[objectName] = this.overlayManager.LoadObjectSchemes(bytes)[0];
                        this[objectName].AddRef();
                    }
                }
            );
        }
    }

    StartEditMode = (ID) => {
        if (this.ScreenPictureClick != null) {
            // find item marked for editing (e.g. by setting ID = 1000)
            let pItem = this.ScreenPictureClick.GetNodeByID(1000);
            if (pItem == null) {
                alert("There is no item marked for editing (with ID = 1000)");
                return null;
            }
            // create object
            let pObject = window.MapCore.IMcObject.Create(this.overlay, this.ScreenPictureClick);
            // ID !== null && ID !== undefined && pObject.SetID(ID);
            // start EditMode action
            this.editMode.StartInitObject(pObject, pItem);

            return pObject;
        }

        return null;
    }



    DrawMissionWayPoints = (missionStages) => {
        let index = 1;
        this.MissionPointsObjects.forEach(wayPoint => wayPoint.Remove());
        this.MissionPointsObjects = [];
        for (const stage of missionStages) {

            const { rossService } = stage.selectedStageType;

            if (rossService && rossService == 'addMissionWP') {
                const [x, y, z] = stage.stageParamsInput.split(',');
                let wayPoint = window.MapCore.IMcObject.Create(this.overlay, this.ScreenPictureClick, [{ x: parseFloat(x), y: parseFloat(y), z: parseFloat(z) }]);
                wayPoint.SetTextureProperty(1, window.MapCore.IMcImageFileTexture.Create(window.MapCore.SMcFileSource("http:ObjectWorld/Images/pinPoint.png", false), false));
                if (this.props.viewerState == viewerStates.draft) {
                    wayPoint.SetBColorProperty(3, new window.MapCore.SMcBColor(255, 255, 255, 100));
                }
                this.MissionPointsObjects.push(wayPoint);

                index++;
            }
        }
    }

    selectMissionPointFromMap = () => {
        this.SelectedMissionPointObject = this.StartEditMode();
    }

    SetWorkingOrigin = () => {
        this.RemoveDroneData(this.props.selectedDrone);
        if (!this.MapObjects[this.props.selectedDrone]) {
            this.MapObjects[this.props.selectedDrone] = {
                WorkingOrigin: null,
                Drone: null,
                Route: null
            };
        }
        this.MapObjects[this.props.selectedDrone].WorkingOrigin = this.StartEditMode();

        this.MapObjects[this.props.selectedDrone].WorkingOrigin.SetTextureProperty(1, window.MapCore.IMcImageFileTexture.Create(window.MapCore.SMcFileSource("http:ObjectWorld/Images/location4.png", false), false));
        this.MapObjects[this.props.selectedDrone].WorkingOrigin.SetDrawPriority(1);
        this.setState({ isOriginSelectionMode: true });

    }


    DrawDroneMapImage = () => {
        const { DRONES_DATA } = externalConfig.getConfiguration();
        const ip = `http://${DRONES_DATA.segment}.${this.props.selectedDrone}:${DRONES_DATA.port}`;
        const mapImageStream = `http://192.168.1.116:8081/stream?topic=/map_image/full`;

        if (this.DroneMapImage) {
            this.DroneMapImage.GetTextureProperty(1).SetImageFile(window.MapCore.SMcFileSource(mapImageStream, false));
        }
        else {
            this.DroneMapImage = window.MapCore.IMcObject.Create(this.overlay, this.WorldPictureScheme, [this.MapObjects[this.props.selectedDrone].WorkingOrigin.GetLocationPoints()[0]]);
            this.DroneMapImage.SetTextureProperty(1, window.MapCore.IMcImageFileTexture.Create(window.MapCore.SMcFileSource(mapImageStream, false), false));
            this.DroneMapImage.SetBColorProperty(4, new window.MapCore.SMcBColor(255, 255, 255, 100));
        }

        //  setTimeout(this.DrawDroneMapImage, 3000);
    }


    DrawEnemyObject(droneNumber) {
        debugger;
        let dronePosition = this.props.dronesPositions[droneNumber];
        const coordinateWithOffset = geoCalculations.getMapCoordinate(dronePosition.workingOrigin, dronePosition.enemyOffsets[dronePosition.enemyOffsets.length - 1]);
        this.EnemyObject = window.MapCore.IMcObject.Create(this.overlay, this.ScreenPictureClick, [coordinateWithOffset]);
        this.EnemyObject.SetTextureProperty(1, window.MapCore.IMcImageFileTexture.Create(window.MapCore.SMcFileSource("http:ObjectWorld/Images/enemy.png", false), false));
        this.EnemyObject.SetFloatProperty(2, 0.5);
    }

    DrawDroneObjects(droneNumber) {
        const droneList = externalConfig.getConfiguration().DRONES_DATA.dronesList;
        const originCoordinate = this.MapObjects[droneNumber].WorkingOrigin.GetLocationPoints()[0];
        this.MapObjects[droneNumber].Drone = window.MapCore.IMcObject.Create(this.overlay, this.ScreenPictureDrone, [originCoordinate]);
        this.MapObjects[droneNumber].Drone.SetTextureProperty(1, window.MapCore.IMcImageFileTexture.Create(window.MapCore.SMcFileSource(`http:ObjectWorld/Images/droneNew${droneList.indexOf(droneNumber) + 1}.png`, false), false));
        this.MapObjects[droneNumber].Drone.SetFloatProperty(2, 0.9);
        this.MapObjects[droneNumber].Drone.SetFloatProperty(4, this.props.dronesPositions[droneNumber].workingOrigin.angle);
        this.MapObjects[droneNumber].Drone.SetDrawPriority(2);

        this.MapObjects[droneNumber].Route = window.MapCore.IMcObject.Create(this.overlay, this.lineScheme, [originCoordinate]);
        this.MapObjects[droneNumber].Route.SetFloatProperty(2, 3);

        let lineColor = new window.MapCore.SMcBColor(44, 229, 246, 255);
        if (droneList.indexOf(this.props.selectedDrone) == 1) {
            lineColor = new window.MapCore.SMcBColor(0, 128, 0, 255);
        }
        else if (droneList.indexOf(this.props.selectedDrone) == 2) {
            lineColor = new window.MapCore.SMcBColor(255, 165, 0, 255)
        }

        this.MapObjects[droneNumber].Route.SetBColorProperty(1, lineColor);


        this.SetOpacityToDroneObjects(droneNumber, droneNumber == this.props.selectedDrone);

    }

    SetOpacityToDroneObjects = (droneNumber, isSelected) => {
        this.MapObjects[droneNumber].WorkingOrigin && this.MapObjects[droneNumber].WorkingOrigin.SetBColorProperty(3, new window.MapCore.SMcBColor(255, 255, 255, isSelected ? 255 : 100));
        this.MapObjects[droneNumber].Drone && this.MapObjects[droneNumber].Drone.SetBColorProperty(3, new window.MapCore.SMcBColor(255, 255, 255, isSelected ? 255 : 150));
        // this.MapObjects[droneNumber].Route && this.MapObjects[droneNumber].Route.SetBColorProperty(1, new window.MapCore.SMcBColor(255, 255, 255, isSelected ? 255 : 100));
    }

    MoveDrone = (droneNumber) => {
        if (!this.MapObjects[droneNumber] || !this.MapObjects[droneNumber].WorkingOrigin) {
            console.log("No Working Origin Selected!!");
            return;
        }

        if (!this.MapObjects[droneNumber].Drone || !this.MapObjects[droneNumber].Route) {
            this.DrawDroneObjects(droneNumber);
            return;
        }

        const coordinateWithOffset = geoCalculations.getMapCoordinate(this.props.dronesPositions[droneNumber].workingOrigin, this.props.dronesPositions[droneNumber].offset);
        let routeCoordinates = this.MapObjects[droneNumber].Route.GetLocationPoints();
        if (routeCoordinates.length > 0) {
            let prevCoordinate = routeCoordinates[routeCoordinates.length - 1];
            if (geoCalculations.calculateDistanceBetween2Points(prevCoordinate, coordinateWithOffset) < config.MIN_DRONE_DISTANCE_MOVE) { //too small distance , not importent
                return;
            }
        }
        this.MapObjects[droneNumber].Drone.UpdateLocationPoints([coordinateWithOffset]);
        this.MapObjects[droneNumber].Drone.SetFloatProperty(4, this.props.dronesPositions[droneNumber].workingOrigin.angle + this.props.dronesPositions[droneNumber].angle);


        routeCoordinates.push(coordinateWithOffset);
        this.MapObjects[droneNumber].Route.SetLocationPoints(routeCoordinates);
        this.SetOpacityToDroneObjects(droneNumber, droneNumber == this.props.selectedDrone);
        
    }


    // function fetching a file from server to byte-array
    FetchFileToByteArray(uri) {
        return fetch(uri)
            .then(response => (response.ok ? response.arrayBuffer() : null))
            .then(
                arrayBuffer => {
                    if (arrayBuffer != null) {
                        return new Uint8Array(arrayBuffer);
                    }
                    else {
                        alert("Cannot fetch " + uri);
                        return null;
                    }
                },
                error => {
                    alert("Network error in fetching " + uri);
                    return null;
                }
            );
    }

    OnEditClickWorkingOrigin = (droneNumber) => {

        if (this.MapObjects[droneNumber].WorkingOrigin && this.MapObjects[droneNumber].WorkingOrigin.GetLocationPoints().length > 0) {
            //    this.WorkingOrigin.SetFloatProperty(2, 1);
            const originCoordinate = geoCalculations.roundCoordinate(this.MapObjects[droneNumber].WorkingOrigin.GetLocationPoints()[0], config.COORDINATE_DECIMALS_PRECISION);
            this.props.saveOriginCoordinate(originCoordinate, 360 - this.TempOriginAngle);
        }
        this.setState({ isOriginSelectionMode: false });
    }
    OnEditClickMissionPoint = () => {
        if (this.SelectedMissionPointObject && this.SelectedMissionPointObject.GetLocationPoints().length > 0) {
            this.props.togglePointSelectionMode();
            //this.SelectedMissionPointObject.SetFloatProperty(2, 0.8);
            let locationPoints = this.SelectedMissionPointObject.GetLocationPoints()[0];
            locationPoints.z = config.DEFAULT_MISSION_POINT_HEIGHT;
            this.props.selectPointFromMap(geoCalculations.roundCoordinate(locationPoints, config.COORDINATE_DECIMALS_PRECISION));
            this.SelectedMissionPointObject.Remove();
        }

        this.SelectedMissionPointObject = null;
    }


    parseLayersConfiguration(jsonLayerGroups) {
        try {
            for (let jsonGroup of jsonLayerGroups) {
                // coordinate system creation string: MapCore.IMcGridCoordSystemGeographic.Create(MapCore.IMcGridCoordinateSystem.EDatumType.EDT_WGS84) etc.
                let coordSystemString = "MapCore." + jsonGroup.coordSystemType + ".Create(" + jsonGroup.coordSystemParams + ")";
                let layerGroup = new SLayerGroup(coordSystemString, jsonGroup.showGeoInMetricProportion, jsonGroup.centerByStaticObjectsLayerOnly, jsonGroup.InitialScale2D);

                if (jsonGroup.layers) {
                    for (let layer of jsonGroup.layers) {
                        let layerCreateString = null;
                        const protocol = window.location.protocol;
                        switch (layer.type) {
                            case "WMSRaster":
                                // WMS raster layer creation string: CreateWMSRasterLayer('http://wmtsserver/wmts?request=GetCapabilities', 'layer', 'EPSG:4326', 'jpeg') etc.
                                layerCreateString = "Create" + layer.type + "Layer('" + layer.path + "'" + (layer.params ? ", " + layer.params : "") + ")";
                                break;
                            case "IMcNativeRasterMapLayer":
                                layerCreateString = "MapCore.IMcNativeRasterMapLayer.Create('" + protocol + layer.path + "', " + (layer.params ? layer.params : "MapCore.UINT_MAX, false, 0, false") + ", this.layerCallback)";
                                break;
                            case "IMcNativeDtmMapLayer":
                                layerCreateString = "MapCore.IMcNativeDtmMapLayer.Create('" + protocol + layer.path + "', " + (layer.params ? layer.params : "0") + ", this.layerCallback)";
                                break;
                            case "IMcNativeVectorMapLayer":
                                layerCreateString = "MapCore.IMcNativeVectorMapLayer.Create('" + protocol + layer.path + "', " + (layer.params ? layer.params : "") + "this.layerCallback)";
                                break;
                            case "IMcNative3DModelMapLayer":
                                layerCreateString = "MapCore.IMcNative3DModelMapLayer.Create('" + protocol + layer.path + "', " + (layer.params ? layer.params : "0") + ", this.layerCallback)";
                                break;
                            case "IMcNativeVector3DExtrusionMapLayer":
                                layerCreateString = "MapCore.IMcNativeVector3DExtrusionMapLayer.Create('" + protocol + layer.path + "', " + (layer.params ? layer.params : "0, 10") + ", this.layerCallback)";
                                break;
                            default:
                                alert("Invalid type of server layer");
                                return;
                        }
                        layerGroup.aLayerCreateStrings.push(layerCreateString);
                    }
                }
                if (jsonGroup.groupName != undefined) {

                    this.setState({ mapLayerGroups: new Map(this.state.mapLayerGroups.set(jsonGroup.groupName, layerGroup)) });

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
        catch (e) {
            alert("Invalid configuration JSON file");
        }
    }

    parseCapabilitiesXML(xmlDoc, capabilitiesURL, bMapCoreLayerServer = true, wmtsAdditionalLayerGroup) {
        class CXmlNode {
            constructor(node) {
                this.node = node;
            }
            GetFirstChild(tagName) {
                let children = this.node.getElementsByTagName(tagName);
                for (let child of children) {
                    if (child.parentNode == this.node) {
                        return new CXmlNode(child);
                    }
                }
                return null;
            }
            GetFirstChildText(tagName) {
                let children = this.node.getElementsByTagName(tagName);
                for (let child of children) {
                    if (child.parentNode == this.node) {
                        return child.textContent;
                    }
                }
                return null;
            }
            GetFirstChildAttribute(tagName, attributeName) {
                let children = this.node.getElementsByTagName(tagName);
                for (let child of children) {
                    if (child.parentNode == this.node) {
                        return child.attributes.getNamedItem(attributeName).value;
                    }
                }
                return null;
            }
            GetChildren(tagName) {
                let children = this.node.getElementsByTagName(tagName);
                let aNodes = [];
                for (let child of children) {
                    if (child.parentNode == this.node) {
                        aNodes.push(new CXmlNode(child));
                    }
                }
                return aNodes;
            }
            GetChildrenTexts(tagName) {
                let children = this.node.getElementsByTagName(tagName);
                let aTexts = [];
                for (let child of children) {
                    if (child.parentNode == this.node) {
                        aTexts.push(child.textContent);
                    }
                }
                return aTexts;
            }
        }

        if (xmlDoc != null) {
            try {
                let capabilities = new CXmlNode(xmlDoc).GetFirstChild("Capabilities");
                let MapLayerServerURL = capabilities.GetFirstChildAttribute("ServiceMetadataURL", "xlink:href");
                if (MapLayerServerURL == null || MapLayerServerURL == "") {
                    MapLayerServerURL = capabilitiesURL;
                }
                let lastSlashIndex = MapLayerServerURL.lastIndexOf("?");
                if (lastSlashIndex < 0) {
                    lastSlashIndex = MapLayerServerURL.lastIndexOf("/");
                }
                if (lastSlashIndex < 0) {
                    alert("Invalid Capabilities file");
                    return;
                }
                let TrimmedMapLayerServerURL = MapLayerServerURL.substring(0, lastSlashIndex);

                let contents = capabilities.GetFirstChild("Contents");
                let aTileMatrixSets = contents.GetChildren("TileMatrixSet");
                let mapTileMatrixSets = new Map();
                for (let matrixSet of aTileMatrixSets) {
                    let id = matrixSet.GetFirstChildText("ows:Identifier");
                    let crs = matrixSet.GetFirstChildText("ows:SupportedCRS");
                    if (id != null && crs != null) {
                        mapTileMatrixSets.set(matrixSet.GetFirstChildText("ows:Identifier"), { coordSystem: crs, tileMatrixSet: id });
                    }
                }

                let aLayers = contents.GetChildren("Layer");
                for (let layer of aLayers) {
                    // check here if its single layer preview. if yes put only this layer in the hashMap                    
                    let layerID = layer.GetFirstChildText("ows:Identifier");
                    if (this.context.mapToPreview.type === config.nodesLevel.layer &&
                        (this.context.mapToPreview.data.LayerId !== layerID && this.context.mapToPreview.dtmLayerId !== layerID))
                        continue;

                    let aFormats = layer.GetChildrenTexts("Format");
                    let aTileMatrixSetLinks = layer.GetChildren("TileMatrixSetLink");
                    if (aTileMatrixSetLinks.length == 0) {
                        aTileMatrixSetLinks.push(null);
                    }

                    for (let tileMatrixSetLink of aTileMatrixSetLinks) {
                        let coordSystem = null;
                        let tileMatrixSet = null;
                        if (tileMatrixSetLink != null) {
                            let tileMatrixSetParams = mapTileMatrixSets.get(tileMatrixSetLink.GetFirstChildText("TileMatrixSet"));
                            coordSystem = tileMatrixSetParams.coordSystem;
                            tileMatrixSet = tileMatrixSetParams.tileMatrixSet;
                            if (wmtsAdditionalLayerGroup && wmtsAdditionalLayerGroup.tileMatrixSetFilter && tileMatrixSet != wmtsAdditionalLayerGroup.tileMatrixSetFilter) {
                                continue;
                            }
                        }
                        if (coordSystem == null) {
                            let boundingBox = layer.GetFirstChild("ows:BoundingBox");
                            if (boundingBox) {
                                coordSystem = boundingBox.GetFirstChildText("ows:crs");
                            }
                        }
                        let prefix = "urn:ogc:def:crs:";
                        if (coordSystem.indexOf(prefix) == 0) {
                            coordSystem = coordSystem.substring(prefix.length).replace("::", ":");
                            let aGroups = [];
                            if (bMapCoreLayerServer) {
                                aGroups = layer.GetFirstChildText("Group").split(",");
                                for (let i = 0; i < aGroups.length; ++i) {
                                    aGroups[i] = aGroups[i] + " (server " + coordSystem + ")";
                                }
                            }
                            else {
                                let groupName = layer.GetFirstChildText("ows:Title");
                                if (groupName == null) {
                                    groupName = layerID;
                                }

                                for (let i = 0; i < aFormats.length; ++i) {
                                    aFormats[i] = aFormats[i].replace("image/", "");
                                    aGroups[i] = groupName + " (WMTS " + aFormats[i] + " " + tileMatrixSet + ")";
                                }
                            }
                            for (let i = 0; i < aGroups.length; ++i) {
                                let group = aGroups[i];

                                // coordinate system creation string: MapCore.IMcGridGeneric.Create('EPSG:4326') etc.
                                let coordSystemString = "MapCore.IMcGridGeneric.Create('" + coordSystem + "')";
                                let layerGroup = this.state.mapLayerGroups.get(group);
                                if (layerGroup == undefined) {
                                    layerGroup = new SLayerGroup(coordSystemString, true); // for MapCoreLayerServer only: bShowGeoInMetricProportion is true
                                    this.setState({ mapLayerGroups: new Map(this.state.mapLayerGroups.set(group, layerGroup)) });
                                }
                                else if (coordSystemString != layerGroup.coordSystemString) {
                                    alert("Layers' coordinate systems do not match");
                                    return;
                                }
                                let layerCreateString;
                                if (bMapCoreLayerServer) {
                                    layerCreateString = aFormats[0].replace("MapCore", "MapCore.IMcNative").replace("DTM", "Dtm") + "MapLayer" + ".Create('" + TrimmedMapLayerServerURL + "/" + layerID + "')";
                                    layerGroup.aLayerCreateStrings.push(layerCreateString);
                                }
                                else {
                                    // WMTS raster layer creation string: CreateWMTSRasterLayer('http://wmtsserver/wmts?request=GetCapabilities', 'layer', 'EPSG:4326', 'jpeg') etc.
                                    layerCreateString = "CreateWMTSRasterLayer('" + capabilitiesURL + "', '" + layerID + "', '" + tileMatrixSet + "', '" + aFormats[i] + "')";
                                    layerGroup.aLayerCreateStrings.push(layerCreateString);
                                    if (wmtsAdditionalLayerGroup) {
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
            catch (e) {
                alert("Invalid Capabilities file");
            }
        }
    }

    createCallbackClasses() {
        this.CLayerReadCallback = window.MapCore.IMcMapLayer.IReadCallback.extend("IMcMapLayer.IReadCallback", {
            // mandatory
            OnInitialized: function (pLayer, eStatus, strAdditionalDataString) {
                if (eStatus == window.MapCore.IMcErrors.ECode.SUCCESS) {
                    //this.trySetTerainBox();
                    // if (pLayer.GetLayerType() ==  window.MapCore.IMcNativeStaticObjectsMapLayer.LAYER_TYPE && !pLayer.IsBuiltOfContoursExtrusion())
                    // {
                    //     pLayer.SetDisplayingItemsAttachedToTerrain(true);
                    //     pLayer.SetDisplayingDtmVisualization(true);
                    // }
                }
                else if (eStatus != window.MapCore.IMcErrors.ECode.NATIVE_SERVER_LAYER_NOT_VALID) {
                    alert("Layer initialization: " + window.MapCore.IMcErrors.ErrorCodeToString(eStatus) + " (" + strAdditionalDataString + ")");
                }
            },
            // mandatory
            OnReadError: function (pLayer, eErrorCode, strAdditionalDataString) {
                alert("Layer read error: " + window.MapCore.IMcErrors.ErrorCodeToString(eErrorCode) + " (" + strAdditionalDataString + ")");
            },
            // mandatory
            OnNativeServerLayerNotValid: function (pLayer, bLayerVersionUpdated) {/*TBD*/ },
            // optional, needed if to be deleted by MapCore when no longer used
            // optional
            OnRemoved(pLayer, eStatus, strAdditionalDataString) {
                alert("Map layer has been removed");
            },

            // optional
            OnReplaced(pOldLayer, pNewLayer, eStatus, strAdditionalDataString) {
                alert("Map layer has been replaced");
            },
            Release: function () { this.delete(); },
        });

        this.CCameraUpdateCallback = window.MapCore.IMcMapViewport.ICameraUpdateCallback.extend("IMcMapViewport.ICameraUpdateCallback", {
            // mandatory
            OnActiveCameraUpdated: function (pViewport) {
                ++this.uCameraUpdateCounter
            },
            // optional
            Release: function () {
                this.delete()
            }
        });

        this.CAsyncQueryCallback = window.MapCore.IMcSpatialQueries.IAsyncQueryCallback.extend("IMcSpatialQueries.IAsyncQueryCallback", {
            // optional
            __construct: function (viewportData) {
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
            OnTerrainHeightMatrixResults: function (uNumHorizontalPoints, uNumVerticalPoints, adHeightMatrix) { },
            OnTerrainHeightsAlongLineResults: function (aPointsWithHeights, aSlopes, pSlopesData) { },
            OnExtremeHeightPointsInPolygonResults: function (bPointsFound, pHighestPoint, pLowestPoint) { },
            OnTerrainAnglesResults: function (dPitch, dRoll) { },

            // OnRayIntersectionResults
            OnLineOfSightResults: function (aPoints, dCrestClearanceAngle, dCrestClearanceDistance) { },
            OnPointVisibilityResults: function (bIsTargetVisible, pdMinimalTargetHeightForVisibility, pdMinimalScouterHeightForVisibility) { },
            OnAreaOfSightResults: function (pAreaOfSight, aLinesOfSight, pSeenPolygons, pUnseenPolygons, aSeenStaticObjects) { },
            OnLocationFromTwoDistancesAndAzimuthResults: function (Target) { },

            // mandatory
            OnError: function (eErrorCode) {
                alert('error ' + eErrorCode);
                this.delete();
            },
        });

        let CUserData = window.MapCore.IMcUserData.extend("IMcUserData", {
            // optional
            __construct: function (bToBeDeleted) {
                this.__parent.__construct.call(this);
                this.bToBeDeleted = bToBeDeleted;
                // ...
            },

            // optional
            __destruct: function () {
                this.__parent.__destruct.call(this);
                // ...
            },

            // mandatory
            Release: function () {
                if (this.bToBeDeleted) {
                    this.delete();
                }
            },

            // optional
            Clone: function () {
                if (this.bToBeDeleted) {
                    return new CUserData(this.bToBeDeleted);
                }
                return this;
            },
        });
        this.layerCallback = new this.CLayerReadCallback();
    }

    renderMapContinuously = () => {
        if (!this.requestAnimationFrameId) return;
        this.trySetTerainBox();
        let currtRenderTime = (new Date).getTime();

        // render viewport(s)
        if (!this.state.bSameCanvas) {
            window.MapCore.IMcMapViewport.RenderAll();
        } else if (this.viewport != null) {
            this.viewport.Render();
        }

        // move objects if they exist
        this.lastRenderTime = currtRenderTime;

        // log memory usage and heap size
        if (this.uMemUsageLoggingFrequency != 0 && currtRenderTime >= this.lastMemUsageLogTime + this.uMemUsageLoggingFrequency * 1000) {
            let usage = window.MapCore.IMcMapDevice.GetMaxMemoryUsage();
            console.log("Max mem = " + window.MapCore.IMcMapDevice.GetMaxMemoryUsage().toLocaleString() + ", heap = " + window.MapCore.IMcMapDevice.GetHeapSize().toLocaleString() + " B");
            this.lastMemUsageLogTime = currtRenderTime;
        }

        // ask the browser to render again
        this.requestAnimationFrameId = requestAnimationFrame(this.renderMapContinuously);
    }

    trySetTerainBox = () => {
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

            if (!this.aViewports[j].bCameraPositionSet) {
                if (this.aViewports[j].viewport.GetMapType() == window.MapCore.IMcMapCamera.EMapType.EMT_2D) {
                    this.aViewports[j].viewport.SetCameraPosition(this.aViewports[j].terrainCenter);
                    this.aViewports[j].bCameraPositionSet = true;
                }
                else // 3D
                {
                    let height = {};
                    this.aViewports[j].terrainCenter.z = 100;
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
        let width = document.getElementById('canvasesContainer').getBoundingClientRect().width;
        let height = document.getElementById('canvasesContainer').getBoundingClientRect().height;

        for (let i = 0; i < this.aViewports.length; i++) {
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


    mouseMoveHandler = (e, isTouch = false) => {
        if (this.viewport.GetWindowHandle() != e.target) {
            return;
        }

        let EventPixel = null;
        if (isTouch) {
            const rect = e.target.getBoundingClientRect();
            const offsetX = e.targetTouches[0].pageX - rect.left;
            const offsetY = e.targetTouches[0].pageY - rect.top;
            EventPixel = window.MapCore.SMcPoint(offsetX, offsetY);
        } else {
            EventPixel = window.MapCore.SMcPoint(e.offsetX, e.offsetY);
        }

        if (e.buttons <= 1) {
            let bHandled = {};
            let eCursor = {};
            this.editMode.OnMouseEvent((e.buttons == 1 || isTouch) ?
                window.MapCore.IMcEditMode.EMouseEvent.EME_MOUSE_MOVED_BUTTON_DOWN :
                window.MapCore.IMcEditMode.EMouseEvent.EME_MOUSE_MOVED_BUTTON_UP,
                EventPixel,
                e.ctrlKey,
                0,
                bHandled,
                eCursor
            );
            if (bHandled.Value) {
                e.preventDefault();
                e.cancelBubble = true;
                if (e.stopPropagation) e.stopPropagation();
                return;
            }
        }

        if (e.buttons == 1 || isTouch) {
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
            if (this.viewport.GetWindowHandle() != e.target) {
                return;
            }
        } else if (!this.state.bSameCanvas) {
            for (let i = 0; i < this.aViewports.length; i++) {
                if (e.target == this.aViewports[i].viewport.GetWindowHandle()) {
                    this.activeViewport = i;
                    this.updateActiveViewport();
                    break;
                }
            }
        }

        const rect = e.target.getBoundingClientRect();
        let EventPixel = e.type == 'touchend' ?
            window.MapCore.SMcPoint(e.changedTouches[0].pageX - rect.left, e.changedTouches[0].pageY - rect.top) :
            window.MapCore.SMcPoint(e.offsetX, e.offsetY);

        this.mouseDownButtons = e.buttons;
        if (e.type == 'touchend' || e.buttons == 1) {
            let bHandled = {};
            let eCursor = {};
            this.editMode.OnMouseEvent(window.MapCore.IMcEditMode.EMouseEvent.EME_BUTTON_PRESSED, EventPixel, e.ctrlKey, 0, bHandled, eCursor);
            if (this.props.isPointSelectionMode) {
                this.OnEditClickMissionPoint();
            }

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
        this.props.closeContextMenu();
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
        let aTargets = this.viewport.ScanInGeometry(new window.MapCore.SMcScanPointGeometry(window.MapCore.EMcPointCoordSystem.EPCS_SCREEN, window.MapCore.SMcVector3D(EventPixel.x, EventPixel.y, 0), 20), false);

        if (this.bEdit) {
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
        for (let i = 0; i < aTargets.length; ++i) {
            if (aTargets[i].eTargetType == window.MapCore.IMcSpatialQueries.EIntersectionTargetType.EITT_OVERLAY_MANAGER_OBJECT) {
                const ID = aTargets[i].ObjectItemData.pObject.GetID();
                ID !== null && ID !== undefined && this.props.showContextMenu(EventPixel.x + 5, EventPixel.y + 5, [{ name: ID == 0 ? "Working Origin" : "WayPoint " + ID }]);
                break;
            }
        }


    }

    stopEvent = (e) => {
        e.preventDefault();
        e.cancelBubble = true;
        e.stopPropagation && e.stopPropagation();
    }

    touchStartHandler = (e) => {
        const rect = e.target.getBoundingClientRect();
        this.nMousePrevX = this._onMouseDownX = e.targetTouches[0].pageX - rect.left;
        this.nMousePrevY = this._onMouseDownY = e.targetTouches[0].pageY - rect.top;
        //this.stopEvent(e);        
    }

    screenToWorld = (x, y, options) => {
        const screenPoint = new window.MapCore.SMcVector3D(x, y, 0);
        const worldPoint = {};
        if (!this.viewport.ScreenToWorldOnTerrain(screenPoint, worldPoint)) {
            this.viewport.ScreenToWorldOnPlane(screenPoint, worldPoint);
        }
        let ret = worldPoint;
        if (!options || !options.withoutConvert) {
            //   const worldPointGeo = this.gridConverter.ConvertAtoB(worldPoint.Value);
            //   const worldPointGeoConverted = ConvertGEOPartial.geoPartialCoordsToGeoPartial(new geo.coordinate(worldPointGeo.x / DEG_TO_MC, worldPointGeo.y / DEG_TO_MC, worldPointGeo.z));
            //   const worldPointGrid = worldPoint.Value;
            //   ret = {worldPointGeo, worldPointGeoConverted, worldPointGrid};
        }
        return ret;
    }

    worldToScreen = (coordinate, options) => {
        let srcCoords = coordinate;
        if (!options || !options.native) {
            //srcCoords = this._transformCoordinateToNative(coordinate);
        }
        const screenPoint = this.viewport.WorldToScreen(srcCoords);
        let inScreen = true;
        if (screenPoint.x < 0 || screenPoint.x > this._canvas.width ||
            screenPoint.y < 0 || screenPoint.y > this._canvas.height) {
            inScreen = false;
        }
        return { x: screenPoint.x, y: screenPoint.y, inScreen };
    }

    moveCameraRelativeToOrientation = (moveX, moveY, ignorePitch = true, useHeightFactor = false) => {
        let factor = 1;
        if (useHeightFactor) {
            const currentPosition = this.viewport.GetCameraPosition();
            let height = {};
            let heightDiff = Math.abs(currentPosition.z);
            if (this.viewport.GetTerrainHeight(currentPosition, height)) {
                heightDiff = currentPosition.z - height.Value;
            }

            //   if (this.moveCameraRelativeToOrientationFactor) {
            //     const heightFactorNameToUse = useHeightFactor ? useHeightFactor : 'other';
            //     const heightFactorToUse = this.moveCameraRelativeToOrientationFactor[heightFactorNameToUse];
            //     if (heightFactorToUse) {              
            //       for (let i = 0; i < heightFactorToUse.length; i++) {
            //         if (!heightFactorToUse[i].max) {
            //           factor = heightFactorToUse[i].factor;
            //         }
            //         if (heightDiff < heightFactorToUse[i].max) {
            //           factor = heightFactorToUse[i].factor;
            //           break;
            //         }
            //       }
            //     }
            //   }
            // }

            if (useHeightFactor === 'mouse') {
                factor = 600;
                if (heightDiff < 10) {
                    factor = 1;
                } else if (heightDiff < 30) {
                    factor = 3;
                } else if (heightDiff < 100) {
                    factor = 6;
                } else if (heightDiff < 200) {
                    factor = 12;
                } else if (heightDiff < 300) {
                    factor = 20;
                } else if (heightDiff < 500) {
                    factor = 35;
                } else if (heightDiff < 1000) {
                    factor = 100;
                } else if (heightDiff < 2000) {
                    factor = 200;
                } else if (heightDiff < 5000) {
                    factor = 400;
                }
            } else if (useHeightFactor === 'touch') {
                factor = 600;
                if (heightDiff < 10) {
                    factor = 2;
                } else if (heightDiff < 30) {
                    factor = 6;
                } else if (heightDiff < 100) {
                    factor = 9;
                } else if (heightDiff < 200) {
                    factor = 12;
                } else if (heightDiff < 300) {
                    factor = 20;
                } else if (heightDiff < 500) {
                    factor = 35;
                } else if (heightDiff < 1000) {
                    factor = 100;
                } else if (heightDiff < 2000) {
                    factor = 200;
                } else if (heightDiff < 5000) {
                    factor = 400;
                }
                factor *= 2;
            } else {
                factor = 150;
                if (heightDiff < 10) {
                    factor = 1;
                } else if (heightDiff < 30) {
                    factor = 4;
                } else if (heightDiff < 100) {
                    factor = 8;
                } else if (heightDiff < 200) {
                    factor = 12;
                } else if (heightDiff < 300) {
                    factor = 30;
                } else if (heightDiff < 500) {
                    factor = 50;
                } else if (heightDiff < 1000) {
                    factor = 100;
                }
            }
        }
        this.viewport.MoveCameraRelativeToOrientation(window.MapCore.SMcVector3D(moveX * factor, moveY * factor, 0), ignorePitch);
    }

    getCameraOrientation = () => {
        let ret = { azimuth: 0, pitch: 0 };
        const azimuthOrientation = {};
        const pitchOrientation = {};
        this.viewport.GetCameraOrientation(azimuthOrientation, pitchOrientation, null);
        if (azimuthOrientation) {
            ret.azimuth = azimuthOrientation.Value;
        }
        if (pitchOrientation) {
            ret.pitch = pitchOrientation.Value;
        }
        return ret;
    }

    setCameraOrientation = (cameraOrientationAzimuth, cameraOrientationPitch, stopDrag = true) => {
        const azimuthOrientation = {};
        const pitchOrientation = {};
        const rollOrientation = {};
        this.viewport.GetCameraOrientation(azimuthOrientation, pitchOrientation, rollOrientation);
        const azimuthToSet = cameraOrientationAzimuth !== undefined ? cameraOrientationAzimuth : azimuthOrientation.Value;
        const pitchToSet = cameraOrientationPitch !== undefined ? cameraOrientationPitch : pitchOrientation.Value;
        this.viewport.SetCameraOrientation(azimuthToSet, pitchToSet, 0);
    }

    isGeoCoordValid = (coord, isNative = true) => {
        const DEG_TO_MC = 100000;

        let isValid = true;
        const coordFactor = isNative ? DEG_TO_MC : 1;
        if (coord.x < -180 * coordFactor || coord.y < -89.5 * coordFactor || coord.y === 0) {
            isValid = false;
        } else if (coord.x > 180 * coordFactor || coord.y > 89.5 * coordFactor || coord.z > Number.MAX_VALUE) {
            isValid = false;
        }
        return isValid;
    }

    rotateCameraAroundWorldPoint = (coord, azimuthDelta, azimuthPitch, watchRoll) => {
        const currentAzimuth = {};
        const currentPitch = {};
        const currentRoll = {};
        let currentPosition;
        if (watchRoll) {
            this.viewport.GetCameraOrientation(currentAzimuth, currentPitch, currentRoll);
            currentPosition = this.viewport.GetCameraPosition();
        }

        this.viewport.RotateCameraAroundWorldPoint(coord, azimuthDelta, azimuthPitch);

        if (watchRoll) {
            const newAzimuth = {};
            const newPitch = {};
            const newRoll = {};
            this.viewport.GetCameraOrientation(newAzimuth, newPitch, newRoll);
            if (Math.abs(newRoll.Value) === 180) {
                this.viewport.SetCameraOrientation(currentAzimuth.Value, currentPitch.Value, currentRoll.Value, false);
                this.viewport.SetCameraPosition(currentPosition);
            } else {
                //this.mapMngr.notifyGeneralEvent('maporientationchanged', newAzimuth.Value, this.elementId);
            }
        }
    }

    rotateCameraRelativeToOrientation = (moveX, moveY, factor) => {
        this.viewport.RotateCameraRelativeToOrientation(moveX * factor, moveY * factor, 0);
        const azimuthChange = {};
        this.viewport.GetCameraOrientation(azimuthChange, null, null);
        //this.mapMngr.notifyGeneralEvent('maporientationchanged', azimuthChange.Value, this.elementId);
    }

    getCameraScale = (convertToMeters = false) => {
        let ret;
        if (!this.state.is3DClicked) {
            ret = this.viewport.GetCameraScale();
            if (convertToMeters) {
                ret /= this.viewport.GetPixelPhysicalHeight();
                ret = (ret * 10).toFixed(2);
                ret = parseInt(ret);
            }
        } else {
            ret = this.viewport.GetCameraPosition().z;
        }

        return ret;
    }
    setCameraScale = (scale, factorFor3D = 1, notifyFpAndScale) => {
        if (!this.state.is3DClicked) {
            const mapScaleTopLimit = this.mapScaleTopLimit || 200000;
            this.cameraScaleChanged = true;
            const pixelPhysicalHeight = this.viewport.GetPixelPhysicalHeight();
            const ratio = scale / pixelPhysicalHeight;
            if (ratio < 25) {
                scale = pixelPhysicalHeight * 25;
            } else if (ratio > mapScaleTopLimit) {
                scale = pixelPhysicalHeight * mapScaleTopLimit;
            }
            this.viewport.SetCameraScale(scale);
        } else {
            const camPosition = this.viewport.GetCameraPosition();
            let zoomSign = 1;
            if (scale > camPosition.z) {
                zoomSign = -1;
            }
            const factor = factorFor3D * camPosition.z / 100;
            this.viewport.MoveCameraRelativeToOrientation(window.MapCore.SMcVector3D(0, zoomSign * factor, 0), false);
        }

        // if (notifyFpAndScale) {
        //   let fpToUpdate;
        //   let scaleToUpdate;
        //   if (!this.state.is3DClicked) {
        //     // Notify scale change if needed (only in 2d viewport)
        //     let currentScale = this.viewport.GetCameraScale() / this.viewport.GetPixelPhysicalHeight();
        //     currentScale = (currentScale * 10).toFixed(2);
        //     currentScale = parseInt(currentScale);

        //     fpToUpdate = this.viewport.GetCameraFootprint();
        //     scaleToUpdate = currentScale;
        //   } else {
        //     const footPrint = this.calculate3DFootPrint();
        //     fpToUpdate = footPrint.fp;
        //     scaleToUpdate = footPrint.scale;
        //   }
        //   if (fpToUpdate && fpToUpdate.bUpperLeftFound && fpToUpdate.bUpperRightFound &&
        //     fpToUpdate.bLowerRightFound && fpToUpdate.bLowerLeftFound) {

        //     this.notifyCameraMove(fpToUpdate, scaleToUpdate, this.elementId);
        //   }
        // }
    }

    updatePositionText = (x, y, z, updateHeight = true) => {
        let height;
        try {
            //when updating position height displayed, use default precision
            const heightForQuery = {};
            const lonNew = (Math.abs(x) > 100000) ? x : x * 100000;
            const latNew = (Math.abs(y) > 100000) ? y : y * 100000;
            const positionToCheck = new window.MapCore.SMcVector3D(lonNew, latNew, 0);
            if (this.viewport.GetTerrainHeight(positionToCheck, heightForQuery)) {
                height = heightForQuery.Value;
            }
        } catch (exp) { }

        // Update context with new height
        if (updateHeight) {
            this.lastUpdatedHeight = height;
            console.log('mapheightchanged', height);
        }

        // Update context with new position
        // const point = new geo.coordinate(x, y, height);
        // this.mapMngr.notifyGeneralEvent('mappositionchanged', point, this.elementId);
    }

    zoomIn = (amount, duration) => {
        const currentScale = this.getCameraScale();
        this.setCameraScale(currentScale / (amount || 1.5));
        if (this.lastClickPos) {
            this.updatePositionText(this.lastClickPos.x, this.lastClickPos.y, this.lastClickPos.z);
        }
    }

    zoomOut = (amount, duration) => {
        const currentScale = this.getCameraScale();
        this.setCameraScale(currentScale * (amount || 1.5));
        if (this.lastClickPos) {
            this.updatePositionText(this.lastClickPos.x, this.lastClickPos.y, this.lastClickPos.z);
        }
    }

    handleZoomOrRotate = e => {

        const xDistance = e.touches[0].screenX - e.touches[1].screenX;
        const yDistance = e.touches[0].screenY - e.touches[1].screenY;

        const currentDistance = Math.abs((xDistance * xDistance) + (yDistance * yDistance));

        if (!this.lastTouchDistance) {
            this.lastTouchDistance = currentDistance;
        } else {
            const zoomIn = currentDistance - this.lastTouchDistance > 0;
            const difDistance = Math.abs(currentDistance - this.lastTouchDistance);

            // Calculate the average position(screen and geo) of the touches
            const rect = e.target.getBoundingClientRect();

            const firstTouchX = e.targetTouches[0].pageX - rect.left;
            const firstTouchY = e.targetTouches[0].pageY - rect.top;

            const secondTouchX = e.targetTouches[1].pageX - rect.left;
            const secondTouchY = e.targetTouches[1].pageY - rect.top;

            const averageX = (firstTouchX + secondTouchX) / 2;
            const averageY = (firstTouchY + secondTouchY) / 2;

            const averageWorldPosition = this.screenToWorld(averageX, averageY, { withoutConvert: true });

            let prevAverageX;
            let prevAverageY;

            if (!this.pinchStatus) {
                this.pinchStatus = { averageX, averageY, averageWorldPosition };
            } else {
                prevAverageX = this.pinchStatus.averageX;
                prevAverageY = this.pinchStatus.averageY;

                this.pinchStatus.averageX = averageX;
                this.pinchStatus.averageY = averageY;
            }

            if (!this.state.is3DClicked) {
                if (difDistance > 10000) {
                    //The distance between the touches is big\small enough for zooming in\out.
                    if (zoomIn) {
                        this.zoomIn(1.05);
                    } else {
                        this.zoomOut(1.05);
                    }
                    this.lastTouchDistance = currentDistance;
                }
            } else if (!this.pinchStatus.coordToRotateAround3D) {
                if (difDistance > 1000) {
                    //The distance between the touches is big\small enough for zooming in\out.
                    const zoomFactor = difDistance / 5000;
                    if (zoomIn) {
                        this.moveCameraRelativeToOrientation(0, zoomFactor, false, true);
                    } else {
                        this.moveCameraRelativeToOrientation(0, -zoomFactor, false, true);
                    }
                    this.lastTouchDistance = currentDistance;
                    prevAverageX = undefined;
                    prevAverageY = undefined;
                    this.pinchStatus.zooming3D = true;
                } else {
                    this.pinchStatus.zooming3D = false;
                }
            }

            if (!this.state.is3DClicked) {
                // Calculating the angle between the touches for orientation setting
                const currentRotation = Math.atan2(firstTouchY - secondTouchY, firstTouchX - secondTouchX) * 180 / Math.PI;
                let difRotation = 0;
                if (this.lastTouchRotation === undefined) {
                    //first series of rotations
                    this.lastTouchRotation = currentRotation;
                } else {
                    difRotation = Math.abs(currentRotation - this.lastTouchRotation);
                    if (difRotation > 0.5) {
                        const currentCameraOrientation = this.getCameraOrientation().azimuth;
                        this.setCameraOrientation(currentCameraOrientation + this.lastTouchRotation - currentRotation);
                        this.lastTouchRotation = currentRotation;
                    }
                }

                if (this.pinchStatus) {
                    // After zooming or changing orientation, set the map so the previous screen position with be placed on
                    // the same geo position as it was before.
                    const averageScreenAfterZoom = this.worldToScreen(this.pinchStatus.averageWorldPosition.Value, { native: true });
                    const scrollX = averageScreenAfterZoom.x - this.pinchStatus.averageX;
                    const scrollY = averageScreenAfterZoom.y - this.pinchStatus.averageY;
                    try {
                        this.viewport.ScrollCamera(scrollX, scrollY);
                    } catch (exp) {
                    }
                }
            } else {
                //handle 3d rotating
                if (prevAverageX || prevAverageY) {
                    const currentRotation = Math.atan2(firstTouchY - secondTouchY, firstTouchX - secondTouchX) * 180 / Math.PI;
                    let difRotation = 0;
                    if (this.lastTouchRotation === undefined) {
                        //first series of rotations
                        this.lastTouchRotation = currentRotation;
                    } else {
                        difRotation = Math.abs(currentRotation - this.lastTouchRotation);
                        if (!this.pinchStatus.zooming3D && (difRotation > 2.5 || this.pinchStatus.coordToRotateAround3D)) {
                            this.pinchStatus.coordToRotateAround3D = this.pinchStatus.coordToRotateAround3D || averageWorldPosition.Value;
                            const nativeCoord = this.pinchStatus.coordToRotateAround3D;
                            if (this.isGeoCoordValid(nativeCoord)) {
                                const rotateSign = Math.sign(this.lastTouchRotation - currentRotation);
                                this.rotateCameraAroundWorldPoint(nativeCoord, rotateSign * 2, 0, true);
                            }
                        } else {
                            this.cameraMoved = true;
                            const offsetX = prevAverageX - this.pinchStatus.averageX;
                            const offsetY = this.pinchStatus.averageY - prevAverageY;
                            this.rotateCameraRelativeToOrientation(offsetX, offsetY, 0.1);
                        }
                        this.lastTouchRotation = currentRotation;
                    }
                }
            }
        }
    }

    touchMoveHandler = e => {
        const isTouch = true;
        if (e.touches.length === 1) {
            this.mouseMoveHandler(e, isTouch);
        } else {
            this.handleZoomOrRotate(e);
        }
        e.preventDefault();
    }

    touchEndHandler = (e) => {
        this.isTouch = false;
        this.pinchStatus = undefined;
        if (e.touches && e.touches.length) {
            // Removing only one touch while there is more touches enabled
            this.disableMoveAfterMultiTouches = true;
            setTimeout(() => {
                this.disableMoveAfterMultiTouches = false;
            }, 200);
        }
        if (!e.touches.length) {
            this.isMouseDown = false;
            this.lastTouchDistance = 0;
            this.lastTouchRotation = undefined;

            // Cancel long click listening
            //clearTimeout(longClick);
            // Not in edit mode
            this.dbclickHandled = true;

            // canvas.clickCount++;
            // if (canvas.clickCount === 1) {
            //     singleClick = setTimeout(e => {
            //     canvas.clickCount = 0;
            //     this.onLeftClick(e) || this.stopEvent(e);
            //     }, 200, e);
            // } else if (canvas.clickCount === 2) {
            //     clearTimeout(singleClick);
            //     canvas.clickCount = 0;
            //     this.onLeftDoubleClick(e);
            // }
        }

        // if (this.props.isPointSelectionMode || !this.props.workingOrigin || !this.MapObjects[droneNumber].WorkingOrigin.GetLocationPoints()[0]) {
        //     this.mouseDownHandler(e);
        // }
        e.preventDefault();
        e.target.focus()
    }

    touchCancelHandler = (e) => { }

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

            currCanvas.addEventListener("touchstart", this.touchStartHandler, false);
            currCanvas.addEventListener("touchend", this.touchEndHandler, false);
            currCanvas.addEventListener("touchend", this.mouseDownHandler, false);
            currCanvas.addEventListener("touchmove", this.touchMoveHandler, false);
            currCanvas.addEventListener("touchcancel", this.touchCancelHandler, false);
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
        const canvasParent = document.getElementById('canvasesContainer')
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
        if (this.aViewports.length > 1) {
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
                this.createViewport(terrain, window.MapCore.IMcMapCamera.EMapType.EMT_3D);
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
            this.viewport.SetDtmTransparencyWithoutRaster(true);
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
                if (layer instanceof window.MapCore.IMc3DModelMapLayer) {

                    layer.SetDisplayingItemsAttachedToTerrain(true);
                    layer.SetDisplayingDtmVisualization(true);
                    layer.SetResolvingConflictsWithDtmAndRaster(true);
                }
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
    //         
    //     }
    // }

    async openMap(title, is3d) {
        const serverUrl = externalConfig.getConfiguration().MAPCORE_LAYER_SERVER_URL;
        if (serverUrl) {
            try {
                const response = await axios.get(serverUrl + config.urls.getCapabilities);
                const capabilitiesXMLDoc = new DOMParser().parseFromString(response.data, "text/xml");
                this.parseCapabilitiesXML(capabilitiesXMLDoc, config.urls.getCapabilities);
            } catch (e) {
            }
        } else {
            this.parseLayersConfiguration([this.props.mapToShow])
        }


        this.state.mapLayerGroups.forEach((value, key) => {
            if (key === title) {

                this.setState({
                    lastTerrainConfiguration: key,
                    lastViewportConfiguration: is3d ? "3D" : "2D"
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
        if (!this.viewport.GetDtmVisualization()) {
            let result = this.calcMinMaxHeights();
            let DtmVisualization = new window.MapCore.IMcMapViewport.SDtmVisualizationParams();
            window.MapCore.IMcMapViewport.SDtmVisualizationParams.SetDefaultHeightColors(DtmVisualization, result.minHeight, result.maxHeight);
            DtmVisualization.bDtmVisualizationAboveRaster = true;
            DtmVisualization.uHeightColorsTransparency = 120;
            DtmVisualization.uShadingTransparency = 255;
            this.viewport.SetDtmVisualization(true, DtmVisualization);
        }
        else {
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
            currCanvas.removeEventListener("touchstart", this.touchStartHandler, false);
            currCanvas.removeEventListener("touchend", this.touchEndHandler, false);
            currCanvas.removeEventListener("touchmove", this.touchMoveHandler, false);
            currCanvas.removeEventListener("touchcancel", this.touchCancelHandler, false);

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
        this.setState({ isSwitchMapFormOpen: true });
    }

    showHideDtmActionClicked = () => {
        this.setState({ isDTMClicked: !this.state.isDTMClicked }, this.doDtmVisualization)
    }

    showHide3DActionClicked = () => {
        this.setState(
            {
                is3DClicked: !this.state.is3DClicked
            }, () => this.openMap(this.props.mapToShow.groupName, this.state.is3DClicked))
    }
    setTempAngle = (value) => {
        this.TempOriginAngle = value;
    }

    setOriginAngle = () => {
        const popupDetails = {
            title: 'Set Origin Angle',
            modalChild: 'SingleInputForm',
            modalChildProps: {
                size: 'small',
                label: 'Set Angle(degrees ,North = 0):',
                defaultValue: 0,
                onValueChange: this.setTempAngle
            },
            onCloseButtonClick: () => {
            },
            primayButton: {
                title: 'Set Origin',
                callback: () => this.SetWorkingOrigin()
            },
            secondaryButton: {
                title: 'Cancel',
                callback: () => this.setTempAngle(0)
            }
        };
        this.props.showPopup(popupDetails);
    }

    SetWorkingOrigin = () => {
        debugger;
        this.RemoveDroneData(this.props.selectedDrone);
        if (!this.MapObjects[this.props.selectedDrone]) {
            this.MapObjects[this.props.selectedDrone] = {
                WorkingOrigin: null,
                Drone: null,
                Route: null
            };
        }

        const addStageState = this.getAddMissionPlanStageFormState();
        let selectedOriginData =  addStageState.multiParamsInput;
        let selectedOrigin = {
            x: parseFloat(selectedOriginData.x),
            y: parseFloat(selectedOriginData.y),
            z: parseFloat(selectedOriginData.z),
        }
        if (addStageState.multiParamsInput) {
            this.MapObjects[this.props.selectedDrone].WorkingOrigin = window.MapCore.IMcObject.Create(this.overlay, this.ScreenPictureClick, [selectedOrigin]);
            this.MapObjects[this.props.selectedDrone].WorkingOrigin.SetTextureProperty(1, window.MapCore.IMcImageFileTexture.Create(window.MapCore.SMcFileSource("http:ObjectWorld/Images/location4.png", false), false));
            this.MapObjects[this.props.selectedDrone].WorkingOrigin.SetDrawPriority(1);

            const originCoordinate = geoCalculations.roundCoordinate(this.MapObjects[this.props.selectedDrone].WorkingOrigin.GetLocationPoints()[0], config.COORDINATE_DECIMALS_PRECISION);
            this.props.saveOriginCoordinate(originCoordinate, 360 - parseFloat(selectedOriginData.angle || 0));
        }
    }



    onAddOrEditStageBtnClicked = () => {
        const popupDetails = {
            title: `Select Origin `,
            modalChild: 'AddMissionPlanStageForm',
            modalChildProps: {
                size: 'small',
                selectPointFromMap: this.props.togglePointSelectionMode,
                onPopupInitalLoad: getChildState => this.getAddMissionPlanStageFormState = getChildState,
                isSelectOrigin: true,
                stage: {
                    selectedStageType: { label: 'Go To Waypoint', isMultiInputs: true, params: { label: 'Origin Coordinate:', } },
                }
            },
            onCloseButtonClick: () => { },
            primayButton: {
                title: 'Done',
                callback: this.SetWorkingOrigin
            },
            secondaryButton: {
                title: 'Cancel',
                callback: () => { }
            }
        };
        this.props.showPopup(popupDetails);
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

        if (true) {
            const showHideDtmAction = {
                name: (this.state.isDTMClicked ? 'Hide' : 'Show') + " DTM visualization",
                func: () => this.showHideDtmActionClicked(),
                iconCss: "DTM"
            }
            const selectOrigin = {
                name: "Select Origin",
                func: () => this.onAddOrEditStageBtnClicked(),
                iconCss: "AddMapLocation"
            }
            const showHide3DAction = {
                name: 'Switch To ' + (this.state.is3DClicked ? '2D' : '3D'),
                func: this.showHide3DActionClicked,
                iconCss: "ThreeD"
            }

            const toggleBetweenMapToTabs = {
                name: 'Toggle Map and Tabs',
                func: this.props.toggleBetweenMapToTabs,
                iconCss: "SwitchArrows"
            }

            menuItemsList.push(showHideDtmAction);
            menuItemsList.push(showHide3DAction);
            menuItemsList.push(selectOrigin);
            menuItemsList.push(selectOtherMapAction);
            menuItemsList.push(toggleBetweenMapToTabs);
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

    renderSwitchMapForm() {
        const isOpenClass = this.state.isSwitchMapFormOpen ? cn.Open : '';
        return (
            <div className={`${cn.SwitchMapForm} ${isOpenClass}`}>
                {isOpenClass ? <SwitchMapForm onCancel={() => this.setState({ isSwitchMapFormOpen: false })} /> : null}
            </div>
        )
    }

    getCanvas() {
        let zIndex = this.props.isPointSelectionMode ? { zIndex: 100, width: "100%" } : {};

        return (
            <div className={cn.MapWrapper} style={zIndex}>
                <div className={cn.CanvasContainer} id='canvasesContainer'></div>
                {this.renderMapToolbox()}
                {this.renderSwitchMapForm()}
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
        mapToShow: state.map.mapToShow,
        dronesPositions: state.map.dronesPositions,
        isPointSelectionMode: state.layout.isPointSelectionMode,
        savedMissionPlan: state.planner.savedMissionPlan,
        draftMissionStages: state.planner.draftMissionStages,
        viewerState: state.planner.viewerState,
        selectedDrone: state.map.selectedDrone,
        appPrimaryUiElement: state.layout.appPrimaryUiElement
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        showContextMenu: (x, y, items) => dispatch({ type: actionTypes.SHOW_CONTEXT_MENU, payload: { x, y, items } }),
        closeContextMenu: () => dispatch({ type: actionTypes.CLOSE_CONTEXT_MENU }),
        showPopup: details => dispatch({ type: actionTypes.SHOW_POPUP, payload: details }),
        saveOriginCoordinate: (coordinate, angle) => dispatch({ type: actionTypes.SAVE_ORIGIN_COORDINATE, payload: { coordinate, angle } }),
        deleteDronePosition: () => dispatch({ type: actionTypes.DELETE_DRONE_POSITION }),
        togglePointSelectionMode: () => dispatch({ type: actionTypes.TOGGLE_POINT_SELECTION_MODE }),
        selectPointFromMap: (pointFromMap) => dispatch({ type: actionTypes.SELECT_POINT_FROM_MAP, payload: { pointFromMap } }),
        toggleBetweenMapToTabs: () => dispatch({ type: actionTypes.TOGGLE_MAP_AND_OUTPUT_TABS }),
    };
};

export default connect(mapStateToProps, mapDispachToProps)(MapContainer);