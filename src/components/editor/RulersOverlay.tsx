import React from 'react';
import type { Viewport } from '../../engine/geometry/matrix';

interface RulersOverlayProps {
  viewport: Viewport;
  width: number;
  height: number;
}

export const RulersOverlay: React.FC<RulersOverlayProps> = ({ viewport, width, height }) => {
  const rulerSize = 18;
  const zoom = viewport.zoom;

  // Choose interval based on zoom
  let step = 100;
  if (zoom >= 4) step = 10;
  else if (zoom >= 2) step = 20;
  else if (zoom >= 0.8) step = 50;
  else if (zoom >= 0.3) step = 100;
  else if (zoom >= 0.1) step = 200;
  else step = 500;

  const startWorldX = Math.floor((-viewport.panX / zoom) / step) * step;
  const endWorldX = Math.ceil(((width - viewport.panX) / zoom) / step) * step;

  const startWorldY = Math.floor((-viewport.panY / zoom) / step) * step;
  const endWorldY = Math.ceil(((height - viewport.panY) / zoom) / step) * step;

  const xTicks = [];
  for (let wx = startWorldX; wx <= endWorldX; wx += step) {
    const sx = wx * zoom + viewport.panX;
    if (sx >= rulerSize && sx <= width) {
      xTicks.push({ sx, wx });
    }
  }

  const yTicks = [];
  for (let wy = startWorldY; wy <= endWorldY; wy += step) {
    const sy = wy * zoom + viewport.panY;
    if (sy >= rulerSize && sy <= height) {
      yTicks.push({ sy, wy });
    }
  }

  return (
    <div className="chigma-rulers-container" style={{ pointerEvents: 'none' }}>
      {/* Top Ruler (Horizontal) */}
      <svg
        className="chigma-ruler-horizontal"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: rulerSize,
          zIndex: 10,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E6E6E6'
        }}
      >
        {xTicks.map((t) => (
          <g key={t.wx} transform={`translate(${t.sx}, 0)`}>
            <line x1={0} y1={10} x2={0} y2={rulerSize} stroke="#888888" strokeWidth={1} />
            <text
              x={3}
              y={9}
              fill="#555555"
              fontSize={8.5}
              fontFamily="var(--chigma-font-mono)"
              textAnchor="start"
            >
              {t.wx}
            </text>
          </g>
        ))}
      </svg>

      {/* Left Ruler (Vertical) */}
      <svg
        className="chigma-ruler-vertical"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: rulerSize,
          height: '100%',
          zIndex: 10,
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E6E6E6'
        }}
      >
        {yTicks.map((t) => (
          <g key={t.wy} transform={`translate(0, ${t.sy})`}>
            <line x1={10} y1={0} x2={rulerSize} y2={0} stroke="#888888" strokeWidth={1} />
            <text
              x={9}
              y={-3}
              fill="#555555"
              fontSize={8.5}
              fontFamily="var(--chigma-font-mono)"
              textAnchor="end"
              transform="rotate(-90 9 -3)"
            >
              {t.wy}
            </text>
          </g>
        ))}
      </svg>

      {/* Top Left Corner Box */}
      <div
        className="chigma-ruler-corner"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: rulerSize,
          height: rulerSize,
          zIndex: 11,
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E6E6E6',
          borderBottom: '1px solid #E6E6E6'
        }}
      />
    </div>
  );
};
