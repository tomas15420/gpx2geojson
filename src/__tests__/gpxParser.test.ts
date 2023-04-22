import { readFile } from "fs/promises";
import { Feature, LineString } from "geojson";
import path from "path";
import { gpxParser } from "../gpxParser";

const gpxDir = path.join(__dirname, "..", "..", "test_data");
const fileName = "run.gpx";

async function getTestGpx() {
    const data = await readFile(path.join(gpxDir, fileName), "utf8");
    return data;
}

test("Parser should return geoJSON response from a GPX file", async () => {
    const gpxFile = await getTestGpx();
    const result: Feature = await gpxParser(gpxFile);

    expect(typeof result).toBe("object");
    expect(result).toHaveProperty("type", "Feature");
    expect(result.geometry.type).toBe("LineString");
    const geometry = result.geometry as LineString;
    expect(geometry.coordinates.length).toBeGreaterThan(0);
});
