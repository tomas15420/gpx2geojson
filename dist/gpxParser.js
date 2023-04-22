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
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const parsed = (0, node_html_parser_1.parse)(gpxString);
        const metadata = parsed.querySelector("metadata");
        const time = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.querySelector("time")) === null || _a === void 0 ? void 0 : _a.innerText;
        const name = (_b = parsed.querySelector("name")) === null || _b === void 0 ? void 0 : _b.innerText;
        const waypoints = parsed.querySelectorAll("trkpt");
        const coordinates = [];
        for (let key in waypoints) {
            const wp = waypoints[key];
            const lat = wp.getAttribute("lat");
            const lon = wp.getAttribute("lon");
            const ele = (_c = wp.querySelector("ele")) === null || _c === void 0 ? void 0 : _c.innerHTML;
            if (lat && lon && ele) {
                const point = [
                    parseFloat(lon),
                    parseFloat(lat),
                    parseFloat(ele),
                ];
                coordinates.push(point);
            }
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
            },
        };
        return geoJSON;
    });
}
exports.gpxParser = gpxParser;
