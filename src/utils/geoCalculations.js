export function calculateDistanceBetween2Points(p1, p2 , ignorHeight) {
    var a = p2.x - p1.x;
    var b = p2.y - p1.y;
    var c = ignorHeight ? 0 : p2.z - p1.z;

    return Math.sqrt(a * a + b * b + c * c);
}

export function getMapCoordinate(workingOrigin , offset){
    if (!workingOrigin) {
        return;
    }
    const offsetWithAngle = calculateOffsetWithAngle(offset,  workingOrigin.angle);
    const mapOffset = convertMapOffsetToDroneOffset(offsetWithAngle);
    return addCoordinates(workingOrigin.coordinate, mapOffset);
}

export function calculateOffsetWithAngle(offset, angle) {
    const radians = angle * Math.PI / 180;
    const {x, y, z} = offset;
    return {
        x: x * Math.cos(radians) - y * Math.sin(radians),
        y: x * Math.sin(radians) + y * Math.cos(radians),
        z: parseInt(z)
    }

}

export function convertMapOffsetToDroneOffset(offset) {
    return {
        x: -offset.y,
        y: offset.x,
        z: offset.z
    }
}
export function convertDroneOffsetToMapOffset(offset) {
    return {
        x: offset.y,
        y: -offset.x,
        z: offset.z
    }
}
export function mapCoordiantesToDroneCoordinates(coordinate) {
    
    return {
        x: coordinate.y,
        y: -coordinate.x,
        z: coordinate.z
    }
}


export function addCoordinates(c1, c2) {

    return {
        x: c1.x + c2.x,
        y: c1.y + c2.y,
        z: c1.z + c2.z
    }
}

export function getCoordinatesOffset(originCoordinate, coordinate) {

    return {
        x: coordinate.x - originCoordinate.x,
        y: coordinate.y - originCoordinate.y,
        z: coordinate.z
    }
}

export function roundCoordinate(coordinate, precision) {
    //precision = decimals after point
    var multiplier = Math.pow(10, precision || 0);
    return {
        x: Math.round(coordinate.x * multiplier) / multiplier,
        y: Math.round(coordinate.y * multiplier) / multiplier,
        z: Math.round(coordinate.z * multiplier) / multiplier,
    }
}

export function quaternionToYaw(q) {
    if(q === null || q === undefined){
        return 0;
    }
    const yawRadians = Math.atan2(2*q.x*q.y - 2*q.w*q.z, 2*q.w*q.w + 2*q.x*q.x - 1);
    const angle = yawRadians * 180 / Math.PI;
    return angle;
}
