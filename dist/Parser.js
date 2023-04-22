"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simplify_geometry_1 = __importDefault(require("simplify-geometry"));
const gpxParser_1 = require("./gpxParser");
function Parser(gpxFile, tolerance = 0.0001) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const geo = yield (0, gpxParser_1.gpxParser)(gpxFile);
            return simplifyFeature(geo, tolerance);
        }
        catch (error) {
            throw Error("Error parsing GPX file: " + error);
        }
    });
}
exports.default = Parser;
function simplifyFeature(feature, tolerance) {
    const { type } = feature.geometry;
    if (type === "LineString") {
        let { coordinates } = feature.geometry;
        coordinates = (0, simplify_geometry_1.default)(coordinates, tolerance);
        return Object.assign(Object.assign({}, feature), { geometry: Object.assign(Object.assign({}, feature.geometry), { coordinates }) });
    }
    throw Error("Unsupported geometry type: " + type);
}
