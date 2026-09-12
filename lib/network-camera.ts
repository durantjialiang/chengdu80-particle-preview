/** Fit the entire sphere inside the narrower camera field of view.
 * Padding includes the atmosphere; camera distance also respects the desktop baseline.
 */
export function networkCameraDistance(
  width: number,
  height: number,
  verticalFov: number,
  radius: number,
  baseline: number,
) {
  const halfVertical = (verticalFov * Math.PI) / 360;
  const aspect = Math.max(1, width) / Math.max(1, height);
  const halfHorizontal = Math.atan(Math.tan(halfVertical) * aspect);
  const paddedHalfAngle = Math.atan(
    Math.tan(Math.min(halfVertical, halfHorizontal)) * 0.84,
  );
  return Math.max(baseline, (radius * 1.08) / Math.sin(paddedHalfAngle));
}
