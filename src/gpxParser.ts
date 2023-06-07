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
        const lat = parseFloat(wp.getAttribute("lat")!);
        const lon = parseFloat(wp.getAttribute("lon")!);
        const ele = parseFloat(wp.querySelector("ele")!.innerHTML);

        const point: Position = [lat, lon, ele];
        coordinates.push(point);
    }

    const elevationMax = Math.max(...coordinates.map((c) => c[2]));
    let downHill = 0;
    let upHill = 0;
    let distance = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
        // calculate elevation gain/loss
        const nextEle = coordinates[i + 1][2];
        const currEle = coordinates[i][2];

        const diff = nextEle - currEle;

        if (diff < 0) {
            downHill += diff;
        } else if (diff > 0) {
            upHill += diff;
        }

        // calculate distance
        const rad = Math.PI / 180;
        const currLat = coordinates[i][0];
        const currLon = coordinates[i][1];
        const lat1 = currLat * rad;

        const nextLat = coordinates[i + 1][0];
        const nextLon = coordinates[i + 1][1];
        const lat2 = nextLat * rad;

        const sinLat = Math.sin(((nextLat - currLat) * rad) / 2);
        const sinLon = Math.sin(((nextLon - currLon) * rad) / 2);
        const a =
            sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        distance += 6_371_000 * c;
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
            distance: Math.floor(distance),
            elevationMax: Math.floor(elevationMax),
            elevationPos: Math.floor(Math.abs(upHill)),
            elevationNeg: Math.floor(Math.abs(downHill)),
        },
    };

    return geoJSON;
}
