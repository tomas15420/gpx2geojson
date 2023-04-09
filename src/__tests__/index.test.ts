import Parser from "../Parser";
import path from "path";
import { readFile } from "fs/promises";

const gpxDir = path.join(__dirname, "..", "..", "test_data");
const fileName = "run.gpx";

async function getTestGpx() {
  const data = await readFile(path.join(gpxDir, fileName), "utf8");
  return data;
}

test("Parser should return geoJSON response from a GPX file", async () => {
  const gpxFile = await getTestGpx();
  const result = Parser(gpxFile);

  expect(typeof result).toBe("object");
  expect(result.type).toBe("FeatureCollection");

  const geo = result.features[0].geometry;
  if (geo.type !== "LineString") {
    fail("Geometry is not a LineString");
  } else {
    // original GPX has 1,000+ points
    expect(geo.coordinates!.length).toBeLessThan(500);
    const coord = geo.coordinates[0];
    // coords should have lon, lat & elevation
    expect(coord.length).toBe(3);
  }
});
