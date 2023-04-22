import simplify from "simplify-geometry";
import { gpxParser } from "./gpxParser";

export default async function Parser(
    gpxFile: string,
    tolerance = 0.0001
): Promise<GeoJSON.Feature> {
    try {
        const geo = await gpxParser(gpxFile);
        return simplifyFeature(geo, tolerance);
    } catch (error) {
        throw Error("Error parsing GPX file: " + error);
    }
}

function simplifyFeature(feature: GeoJSON.Feature, tolerance: number) {
    const { type } = feature.geometry;
    if (type === "LineString") {
        let { coordinates } = feature.geometry;
        coordinates = simplify(coordinates, tolerance);
        feature.geometry.coordinates = coordinates;
        return feature;
    }
    throw Error("Unsupported geometry type: " + type);
}
