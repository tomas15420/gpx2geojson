"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gpxparser_1 = __importDefault(require("gpxparser"));
const simplify_geometry_1 = __importDefault(require("simplify-geometry"));
function Parser(gpxFile, tolerance = 0.0001) {
    const gpxParser = new gpxparser_1.default();
    try {
        gpxParser.parse(gpxFile);
        const geoJson = gpxParser.toGeoJSON();
        return parseFeatureCollection(geoJson, tolerance);
    }
    catch (error) {
        throw Error("Error parsing GPX file: " + error);
    }
}
exports.default = Parser;
function simplifyFeature(feature, tolerance) {
    const { type } = feature.geometry;
    if (type === "LineString") {
        let { coordinates } = feature.geometry;
        coordinates = (0, simplify_geometry_1.default)(coordinates, tolerance);
        return Object.assign(Object.assign({}, feature), { geometry: Object.assign(Object.assign({}, feature.geometry), { coordinates }) });
    }
    throw Error("Unsupported geometry type: " + type);
}
function parseFeatureCollection(geojson, tolerance) {
    const features = geojson.features.map((feat) => simplifyFeature(feat, tolerance));
    return Object.assign(Object.assign({}, geojson), { features });
}
