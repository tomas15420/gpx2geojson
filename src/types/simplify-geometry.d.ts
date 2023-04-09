declare module "simplify-geometry" {
  export default function simplify(
    points: GeoJSON.Position[],
    tolerance: number
  ): GeoJSON.Position[];
}
