import { readFile } from "fs/promises";
import path from "path";
import Parser from "../Parser";

const gpxDir = path.join(__dirname, "..", "..", "test_data");
const fileName = "run.gpx";

async function getTestGpx() {
    const data = await readFile(path.join(gpxDir, fileName), "utf8");
    return data;
}

test("Parser should return geoJSON response from a GPX file", async () => {
    const gpxFile = await getTestGpx();
    const result = await Parser(gpxFile);

    expect(typeof result).toBe("object");
    expect(result.type).toBe("Feature");

    if (result.geometry.type !== "LineString") {
        fail("Geometry is not a LineString");
    } else {
        // original GPX has 1,000+ points
        expect(result.geometry.coordinates!.length).toBeLessThan(500);
        const coord = result.geometry.coordinates[0];
        // coords should have lon, lat & elevation
        expect(coord.length).toBe(3);
    }
});
