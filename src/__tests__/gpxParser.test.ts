import { readFile } from "fs/promises";
import { Feature, LineString } from "geojson";
import path from "path";
import { gpxParser } from "../gpxParser";

const gpxDir = path.join(__dirname, "..", "..", "test_data");
const fileName = "Olavsspranget.gpx";

async function getTestGpx() {
    const data = await readFile(path.join(gpxDir, fileName), "utf8");
    return data;
}

test("Parser should return geoJSON response from a GPX file", async () => {
    const gpxFile = await getTestGpx();
    const result: Feature = await gpxParser(gpxFile);

    expect(typeof result).toBe("object");
    expect(result).toHaveProperty("type", "Feature");
    expect(result.properties).toHaveProperty("name", "Olavsspranget");
    expect(result.properties).toHaveProperty("time", "2022-06-23T17:51:47Z");
    expect(result.properties).toHaveProperty("elevationMax", 190);
    expect(result.properties).toHaveProperty("elevationNeg", 189);
    expect(result.properties).toHaveProperty("elevationPos", 185);
    expect(result.properties).toHaveProperty("distance", 5305);

    expect(result.geometry.type).toBe("LineString");
    const geometry = result.geometry as LineString;
    expect(geometry.coordinates.length).toBeGreaterThan(0);
});
