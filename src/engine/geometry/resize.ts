import { type Point, rotatePoint } from './point';

export type HandleType = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'rotate';

export interface ResizeOptions {
  preserveAspectRatio?: boolean;
  resizeFromCenter?: boolean;
  minWidth?: number;
  minHeight?: number;
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

export function calculateResize(
  initialBox: Box,
  handle: HandleType,
  currentWorldPoint: Point,
  startWorldPoint: Point,
  options: ResizeOptions = {}
): Box {
  const {
    preserveAspectRatio = false,
    resizeFromCenter = false,
    minWidth = 5,
    minHeight = 5
  } = options;

  const rotation = initialBox.rotation || 0;
  const initialCenter: Point = {
    x: initialBox.x + initialBox.width / 2,
    y: initialBox.y + initialBox.height / 2
  };

  const unrotatedStart = rotatePoint(startWorldPoint, initialCenter, -rotation);
  const unrotatedCurrent = rotatePoint(currentWorldPoint, initialCenter, -rotation);

  let deltaX = unrotatedCurrent.x - unrotatedStart.x;
  let deltaY = unrotatedCurrent.y - unrotatedStart.y;

  if (resizeFromCenter) {
    deltaX *= 2;
    deltaY *= 2;
  }

  let newX = initialBox.x;
  let newY = initialBox.y;
  let newWidth = initialBox.width;
  let newHeight = initialBox.height;

  const initialAspect = initialBox.width / (initialBox.height || 1);

  switch (handle) {
    case 'e':
      newWidth = Math.max(minWidth, initialBox.width + deltaX);
      if (preserveAspectRatio) {
        newHeight = Math.max(minHeight, newWidth / initialAspect);
        if (resizeFromCenter) {
          newY = initialCenter.y - newHeight / 2;
        }
      }
      break;

    case 'w':
      newWidth = Math.max(minWidth, initialBox.width - deltaX);
      newX = initialBox.x + (initialBox.width - newWidth);
      if (preserveAspectRatio) {
        newHeight = Math.max(minHeight, newWidth / initialAspect);
        if (resizeFromCenter) {
          newY = initialCenter.y - newHeight / 2;
        }
      }
      break;

    case 's':
      newHeight = Math.max(minHeight, initialBox.height + deltaY);
      if (preserveAspectRatio) {
        newWidth = Math.max(minWidth, newHeight * initialAspect);
        if (resizeFromCenter) {
          newX = initialCenter.x - newWidth / 2;
        }
      }
      break;

    case 'n':
      newHeight = Math.max(minHeight, initialBox.height - deltaY);
      newY = initialBox.y + (initialBox.height - newHeight);
      if (preserveAspectRatio) {
        newWidth = Math.max(minWidth, newHeight * initialAspect);
        if (resizeFromCenter) {
          newX = initialCenter.x - newWidth / 2;
        }
      }
      break;

    case 'se':
      newWidth = Math.max(minWidth, initialBox.width + deltaX);
      newHeight = Math.max(minHeight, initialBox.height + deltaY);
      if (preserveAspectRatio) {
        const scale = Math.max(newWidth / initialBox.width, newHeight / initialBox.height);
        newWidth = initialBox.width * scale;
        newHeight = initialBox.height * scale;
      }
      break;

    case 'sw':
      newWidth = Math.max(minWidth, initialBox.width - deltaX);
      newHeight = Math.max(minHeight, initialBox.height + deltaY);
      if (preserveAspectRatio) {
        const scale = Math.max(newWidth / initialBox.width, newHeight / initialBox.height);
        newWidth = initialBox.width * scale;
        newHeight = initialBox.height * scale;
      }
      newX = initialBox.x + (initialBox.width - newWidth);
      break;

    case 'ne':
      newWidth = Math.max(minWidth, initialBox.width + deltaX);
      newHeight = Math.max(minHeight, initialBox.height - deltaY);
      if (preserveAspectRatio) {
        const scale = Math.max(newWidth / initialBox.width, newHeight / initialBox.height);
        newWidth = initialBox.width * scale;
        newHeight = initialBox.height * scale;
      }
      newY = initialBox.y + (initialBox.height - newHeight);
      break;

    case 'nw':
      newWidth = Math.max(minWidth, initialBox.width - deltaX);
      newHeight = Math.max(minHeight, initialBox.height - deltaY);
      if (preserveAspectRatio) {
        const scale = Math.max(newWidth / initialBox.width, newHeight / initialBox.height);
        newWidth = initialBox.width * scale;
        newHeight = initialBox.height * scale;
      }
      newX = initialBox.x + (initialBox.width - newWidth);
      newY = initialBox.y + (initialBox.height - newHeight);
      break;
  }

  if (resizeFromCenter) {
    newX = initialCenter.x - newWidth / 2;
    newY = initialCenter.y - newHeight / 2;
  }

  if (rotation !== 0 && !resizeFromCenter) {
    const unrotatedNewCenter: Point = {
      x: newX + newWidth / 2,
      y: newY + newHeight / 2
    };
    const rotatedNewCenter = rotatePoint(unrotatedNewCenter, initialCenter, rotation);
    newX = rotatedNewCenter.x - newWidth / 2;
    newY = rotatedNewCenter.y - newHeight / 2;
  }

  return {
    x: Math.round(newX),
    y: Math.round(newY),
    width: Math.max(minWidth, Math.round(newWidth)),
    height: Math.max(minHeight, Math.round(newHeight)),
    rotation
  };
}
