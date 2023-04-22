// replacement for https://github.com/Luuka/GPXParser.js/blob/master/src/GPXParser.js

import { Feature, Position } from "geojson";
import { parse } from "node-html-parser";

export async function gpxParser(gpxString: string): Promise<Feature> {
    const parsed = parse(gpxString);
    const metadata = parsed.querySelector("metadata");
    const time = metadata?.querySelector("time")?.innerText;
    const name = parsed.querySelector("name")?.innerText;
    const waypoints = parsed.querySelectorAll("trkpt");

    const coordinates: Position[] = [];
    for (let key in waypoints) {
        const wp = waypoints[key];
        const lat = wp.getAttribute("lat");
        const lon = wp.getAttribute("lon");
        const ele = wp.querySelector("ele")?.innerHTML;
        if (lat && lon && ele) {
            const point: Position = [
                parseFloat(lon),
                parseFloat(lat),
                parseFloat(ele),
            ];
            coordinates.push(point);
        }
    }
    const geoJSON: Feature = {
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: coordinates,
        },
        properties: {
            name: name,
            time: time,
        },
    };

    return geoJSON;
}
