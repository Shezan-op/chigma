import type { Point } from './point';
import { radToDeg, normalizeAngle, snapAngle } from '../../utils/math';

/**
 * Calculates rotation angle from center to current pointer world position.
 */
export function calculateRotation(
  center: Point,
  currentPoint: Point,
  _initialAngle = 0,
  snapTo45 = false
): number {
  const dx = currentPoint.x - center.x;
  const dy = currentPoint.y - center.y;

  let angle = radToDeg(Math.atan2(dy, dx)) + 90;
  angle = normalizeAngle(angle);

  if (snapTo45) {
    angle = snapAngle(angle, 45, 10);
  }

  return Math.round(angle);
}
