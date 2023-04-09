### Gpx 2 geoJSON

A simple parser that I made for handling parsing of Strava GPX files to geoJSON, and simplifying the geometry.

This reduces the files a lot and makes it more manageable in a map. The attached GPX file is 223kb, but the geoJSON ends up at less than 4kb, while still retaining most of the information that's required for a map path. GPX files can be huge as my Garmin logs every second, and this is a simple way to reduce the size of the file.

The geometry is simplified using Ramer-Douglas-Peucker algorithm, thanks to the implementation
at https://github.com/seabre/simplify-geometry

It's not been made for any other types of geometry than LineStrings as that is my use case.

### How to use

```ts
import parser from "@bovan/gpx2geojson";

// define url to gpx file
const gpxDir = path.join(__dirname, "DIR_NAME_CONTAINING_GPX");
const fileName = "run.gpx";
export async function parseGpx() {
  // Read the GPX file to a variable
  const gpxData = await readFile(path.join(gpxDir, fileName), "utf8");
  // parse the gpx data to geoJSON
  const simplifiedGeoJSON = parser(gpxData);
  // Do something with the simplified geoJSON, like putting it in a map
  return simplifiedGeoJSON;
}
```
