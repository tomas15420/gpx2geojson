import GpxParser from "gpxparser";
import simplify from "simplify-geometry";

export default function Parser(
  gpxFile: string,
  tolerance = 0.0001
): GeoJSON.FeatureCollection {
  const gpxParser = new GpxParser();

  try {
    gpxParser.parse(gpxFile);
    const geoJson = gpxParser.toGeoJSON();
    return parseFeatureCollection(geoJson, tolerance);
  } catch (error) {
    throw Error("Error parsing GPX file: " + error);
  }
}

function simplifyFeature(feature: GeoJSON.Feature, tolerance: number) {
  const { type } = feature.geometry;
  if (type === "LineString") {
    let { coordinates } = feature.geometry;
    coordinates = simplify(coordinates, tolerance);
    return { ...feature, geometry: { ...feature.geometry, coordinates } };
  }
  throw Error("Unsupported geometry type: " + type);
}

function parseFeatureCollection(
  geojson: GeoJSON.FeatureCollection,
  tolerance: number
): GeoJSON.FeatureCollection {
  const features = geojson.features.map((feat) =>
    simplifyFeature(feat, tolerance)
  );
  return { ...geojson, features };
}
