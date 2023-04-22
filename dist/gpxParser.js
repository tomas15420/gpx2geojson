"use strict";
// replacement for https://github.com/Luuka/GPXParser.js/blob/master/src/GPXParser.js
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gpxParser = void 0;
const node_html_parser_1 = require("node-html-parser");
function gpxParser(gpxString) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const parsed = (0, node_html_parser_1.parse)(gpxString);
        const metadata = parsed.querySelector("metadata");
        const time = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.querySelector("time")) === null || _a === void 0 ? void 0 : _a.innerText;
        const name = (_b = parsed.querySelector("name")) === null || _b === void 0 ? void 0 : _b.innerText;
        const waypoints = parsed.querySelectorAll("trkpt");
        const coordinates = [];
        for (let key in waypoints) {
            const wp = waypoints[key];
            const lat = parseFloat(wp.getAttribute("lat"));
            const lon = parseFloat(wp.getAttribute("lon"));
            const ele = parseFloat(wp.querySelector("ele").innerHTML);
            const point = [lat, lon, ele];
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
            }
            else if (diff > 0) {
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
            const a = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            distance += 6371000 * c;
        }
        const geoJSON = {
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
    });
}
exports.gpxParser = gpxParser;
