import type GpxParser from "gpxparser";

declare module "gpxparser" {
  export default class GpxParser {
    parse(gpxFile: string): void;
    toGeoJSON(): GeoJSON;
  }
}
