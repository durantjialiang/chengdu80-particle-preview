import * as THREE from 'three';
import { siteContent } from '@/content/site';
import { RADIUS } from './scene-config';

export function latLon(latitude: number, longitude: number, radius = RADIUS) {
  const lat = THREE.MathUtils.degToRad(latitude);
  const lon = THREE.MathUtils.degToRad(longitude);
  return new THREE.Vector3(
    -radius * Math.cos(lat) * Math.cos(lon),
    radius * Math.sin(lat),
    radius * Math.cos(lat) * Math.sin(lon),
  );
}

export function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function networkCities(lowPower: boolean, explorer = false) {
  return siteContent.cities.filter(
    (city) => explorer || !lowPower || city.showOnLowPower,
  );
}

export function networkRoutes(lowPower: boolean, explorer = false) {
  const cities = networkCities(lowPower, explorer);
  const origin = cities.find((city) => city.isOrigin)!;
  const start = latLon(origin.latitude, origin.longitude, RADIUS + 0.026);
  return cities
    .filter((city) => !city.isOrigin)
    .map((city) => {
      const end = latLon(city.latitude, city.longitude, RADIUS + 0.026);
      const angle = start.angleTo(end);
      const points = Array.from({ length: 57 }, (_, i) => {
        const t = i / 56;
        // Great-circle interpolation; raised arcs, never flat chords through Earth.
        return (
          angle < 0.00001
            ? start.clone().lerp(end, t)
            : start
                .clone()
                .multiplyScalar(Math.sin((1 - t) * angle))
                .addScaledVector(end, Math.sin(t * angle))
        )
          .normalize()
          .multiplyScalar(
            RADIUS + 0.026 + Math.sin(Math.PI * t) * (0.12 + angle * 0.095),
          );
      });
      return new THREE.CatmullRomCurve3(points);
    });
}

/** North-up orientation that places the selected campus on the visible hemisphere. */
export function universityOrientation(
  latitude: number,
  longitude: number,
  cameraDirection: THREE.Vector3,
) {
  const normal = latLon(latitude, longitude, 1);
  const north = new THREE.Vector3(0, 1, 0)
    .addScaledVector(normal, -normal.y)
    .normalize();
  const east = new THREE.Vector3().crossVectors(north, normal).normalize();
  const view = cameraDirection.clone().normalize();
  const up = new THREE.Vector3(0, 1, 0)
    .addScaledVector(view, -view.y)
    .normalize();
  const right = new THREE.Vector3().crossVectors(up, view).normalize();
  const source = new THREE.Quaternion().setFromRotationMatrix(
    new THREE.Matrix4().makeBasis(east, north, normal),
  );
  const target = new THREE.Quaternion().setFromRotationMatrix(
    new THREE.Matrix4().makeBasis(right, up, view),
  );
  return target.multiply(source.invert());
}

// Deliberately stylized land masks: decorative, not a cartographic dataset.
// No downloaded textures, imagery, models or runtime network requests.
const landMasks: number[][][] = [
  [
    [-168, 71],
    [-142, 70],
    [-128, 58],
    [-123, 49],
    [-126, 41],
    [-117, 32],
    [-107, 29],
    [-97, 16],
    [-84, 9],
    [-77, 9],
    [-87, 22],
    [-80, 25],
    [-81, 31],
    [-65, 47],
    [-54, 52],
    [-61, 61],
    [-83, 63],
    [-101, 73],
    [-134, 70],
  ],
  [
    [-81, 12],
    [-70, 11],
    [-60, 5],
    [-50, 0],
    [-35, -6],
    [-41, -22],
    [-51, -30],
    [-64, -55],
    [-72, -48],
    [-75, -28],
    [-80, -5],
  ],
  [
    [-17, 36],
    [3, 37],
    [12, 33],
    [31, 31],
    [34, 23],
    [43, 12],
    [51, 11],
    [42, 0],
    [35, -15],
    [24, -35],
    [17, -33],
    [10, -15],
    [7, 3],
    [-8, 5],
    [-17, 15],
  ],
  [
    [-10, 36],
    [-9, 44],
    [-1, 48],
    [-5, 58],
    [8, 58],
    [15, 70],
    [29, 71],
    [33, 61],
    [48, 68],
    [68, 70],
    [91, 76],
    [115, 73],
    [144, 71],
    [169, 65],
    [179, 53],
    [161, 57],
    [143, 47],
    [135, 35],
    [122, 30],
    [121, 21],
    [108, 19],
    [103, 10],
    [99, 3],
    [95, 18],
    [89, 23],
    [80, 8],
    [73, 20],
    [67, 24],
    [57, 25],
    [48, 30],
    [43, 13],
    [35, 29],
    [28, 41],
    [22, 36],
    [16, 41],
    [11, 44],
    [3, 42],
  ],
  [
    [113, -22],
    [122, -14],
    [135, -12],
    [141, -16],
    [146, -17],
    [153, -28],
    [146, -39],
    [132, -34],
    [116, -35],
  ],
  [
    [-53, 60],
    [-44, 60],
    [-20, 76],
    [-31, 83],
    [-54, 81],
    [-62, 71],
  ],
  [
    [130, 31],
    [134, 34],
    [141, 41],
    [145, 44],
    [143, 35],
    [137, 33],
  ],
  [
    [95, 5],
    [105, -5],
    [116, -8],
    [130, -9],
    [140, -5],
    [123, 1],
    [109, 4],
  ],
  [
    [47, -13],
    [50, -16],
    [47, -25],
    [44, -21],
  ],
];

function inside(lon: number, lat: number, polygon: number[][]) {
  let hit = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i];
    const b = polygon[j];
    if (
      a[1] > lat !== b[1] > lat &&
      lon < ((b[0] - a[0]) * (lat - a[1])) / (b[1] - a[1]) + a[0]
    )
      hit = !hit;
  }
  return hit;
}

export function landPositions(lowPower: boolean) {
  const positions: number[] = [];
  const step = lowPower ? 4 : 2.5;
  for (let lat = -55; lat < 81; lat += step) {
    const lonStep = step / Math.max(0.35, Math.cos((lat * Math.PI) / 180));
    for (let lon = -180; lon < 180; lon += lonStep) {
      if (landMasks.some((mask) => inside(lon, lat, mask))) {
        const p = latLon(lat, lon, RADIUS * 1.004);
        positions.push(p.x, p.y, p.z);
      }
    }
  }
  return new Float32Array(positions);
}
