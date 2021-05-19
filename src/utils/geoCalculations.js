export function calculateDistanceBetween2Points(p1, p2) {
    var a = p2.x - p1.x;
    var b = p2.y - p1.y;
    var c = p2.z - p1.z;

    return Math.sqrt(a * a + b * b + c * c);
}
export function calculateOffsetWithAngle(offset, angle) {
    const radians = angle * Math.PI / 180;
    let x = offset.x;
    let y = offset.y;
    let z = offset.z;
    return {
        x: - x * Math.sin(radians) - y * Math.cos(radians),
        y: x * Math.cos(radians) - y * Math.sin(radians),
        z: z
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
        x: coordinate.y - originCoordinate.y,
        y: -(coordinate.x - originCoordinate.x) ,
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