import React from 'react';
import type { Page } from '../../models/document';
import type { Effect, FillPaint } from '../../models/styles';

interface SvgDefsRendererProps {
  page: Page;
}

export const SvgDefsRenderer: React.FC<SvgDefsRendererProps> = ({ page }) => {
  const allNodes = page.children || [];

  return (
    <defs>
      {allNodes.map((node) => {
        const defs: React.ReactNode[] = [];

        // 1. Gradients from fills
        if (node.fills && node.fills.length > 0) {
          node.fills.forEach((fill: FillPaint, idx: number) => {
            if (fill.type === 'gradient' && fill.gradient) {
              const grad = fill.gradient;
              const gradId = `grad_${node.id}_${idx}`;

              if (grad.type === 'linear-gradient') {
                const angleRad = ((grad.angle || 90) * Math.PI) / 180;
                const x1 = Math.round(50 - Math.cos(angleRad) * 50) + '%';
                const y1 = Math.round(50 - Math.sin(angleRad) * 50) + '%';
                const x2 = Math.round(50 + Math.cos(angleRad) * 50) + '%';
                const y2 = Math.round(50 + Math.sin(angleRad) * 50) + '%';

                defs.push(
                  <linearGradient key={gradId} id={gradId} x1={x1} y1={y1} x2={x2} y2={y2}>
                    {grad.stops.map((stop) => (
                      <stop
                        key={stop.id}
                        offset={`${Math.round(stop.offset * 100)}%`}
                        stopColor={stop.color}
                        stopOpacity={stop.opacity !== undefined ? stop.opacity : 1}
                      />
                    ))}
                  </linearGradient>
                );
              } else if (grad.type === 'radial-gradient') {
                defs.push(
                  <radialGradient key={gradId} id={gradId} cx="50%" cy="50%" r="50%">
                    {grad.stops.map((stop) => (
                      <stop
                        key={stop.id}
                        offset={`${Math.round(stop.offset * 100)}%`}
                        stopColor={stop.color}
                        stopOpacity={stop.opacity !== undefined ? stop.opacity : 1}
                      />
                    ))}
                  </radialGradient>
                );
              }
            }
          });
        }

        // 2. Effects Filter (Drop shadow, Layer Blur, etc.)
        if (node.effects && node.effects.length > 0) {
          const filterId = `filter_${node.id}`;
          defs.push(
            <filter key={filterId} id={filterId} x="-40%" y="-40%" width="180%" height="180%">
              {node.effects
                .filter((eff) => eff.visible)
                .map((eff: Effect, eIdx: number) => {
                  if (eff.type === 'drop-shadow') {
                    return (
                      <React.Fragment key={eff.id || eIdx}>
                        <feDropShadow
                          dx={eff.x}
                          dy={eff.y}
                          stdDeviation={eff.blur / 2}
                          floodColor={eff.color}
                          floodOpacity={eff.opacity}
                        />
                      </React.Fragment>
                    );
                  }
                  if (eff.type === 'layer-blur' || eff.type === 'background-blur') {
                    return (
                      <feGaussianBlur
                        key={eff.id || eIdx}
                        stdDeviation={eff.blur / 2}
                      />
                    );
                  }
                  return null;
                })}
            </filter>
          );
        }

        return <React.Fragment key={node.id}>{defs}</React.Fragment>;
      })}
    </defs>
  );
};
