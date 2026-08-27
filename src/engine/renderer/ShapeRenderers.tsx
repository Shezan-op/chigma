import React from 'react';
import type {
  RectangleNode,
  EllipseNode,
  LineNode,
  ArrowNode,
  PolygonNode,
  PencilNode
} from '../../models/node';
import { generateRoundedRectPath } from './svgPathUtils';

function getDashArray(style?: string, strokeWidth = 1): string | undefined {
  if (style === 'dashed') return `${strokeWidth * 4},${strokeWidth * 3}`;
  if (style === 'dotted') return `${strokeWidth},${strokeWidth * 2}`;
  return undefined;
}

function resolveFill(node: any): string {
  if (node.fills && node.fills.length > 0) {
    const activeFill = node.fills.find((f: any) => f.visible);
    if (activeFill) {
      if (activeFill.type === 'gradient') {
        return `url(#grad_${node.id}_0)`;
      }
      if (activeFill.color) return activeFill.color;
    }
  }
  return node.fill || 'transparent';
}

function resolveFilter(node: any): string | undefined {
  if (node.effects && node.effects.some((e: any) => e.visible)) {
    return `url(#filter_${node.id})`;
  }
  return undefined;
}

export const RectangleRenderer: React.FC<{ node: RectangleNode }> = React.memo(({ node }) => {
  const d = generateRoundedRectPath(node.width, node.height, node.cornerRadius);
  const fill = resolveFill(node);
  const filter = resolveFilter(node);

  return (
    <path
      d={d}
      fill={fill}
      stroke={node.stroke || 'none'}
      strokeWidth={node.strokeWidth || 0}
      strokeDasharray={getDashArray(node.strokeStyle, node.strokeWidth)}
      filter={filter}
      style={{
        mixBlendMode: (node.blendMode as any) || 'normal'
      }}
    />
  );
});

export const EllipseRenderer: React.FC<{ node: EllipseNode }> = React.memo(({ node }) => {
  const rx = Math.max(1, node.width / 2);
  const ry = Math.max(1, node.height / 2);
  const fill = resolveFill(node);
  const filter = resolveFilter(node);

  return (
    <ellipse
      cx={rx}
      cy={ry}
      rx={rx}
      ry={ry}
      fill={fill}
      stroke={node.stroke || 'none'}
      strokeWidth={node.strokeWidth || 0}
      strokeDasharray={getDashArray(node.strokeStyle, node.strokeWidth)}
      filter={filter}
      style={{
        mixBlendMode: (node.blendMode as any) || 'normal'
      }}
    />
  );
});

export const LineRenderer: React.FC<{ node: LineNode }> = React.memo(({ node }) => {
  const x2 = node.x2 !== undefined ? node.x2 : node.width;
  const y2 = node.y2 !== undefined ? node.y2 : node.height;
  const filter = resolveFilter(node);

  return (
    <line
      x1={0}
      y1={0}
      x2={x2}
      y2={y2}
      stroke={node.stroke || '#000000'}
      strokeWidth={Math.max(1, node.strokeWidth || 1)}
      strokeDasharray={getDashArray(node.strokeStyle, node.strokeWidth)}
      strokeLinecap="round"
      filter={filter}
      style={{
        mixBlendMode: (node.blendMode as any) || 'normal'
      }}
    />
  );
});

export const ArrowRenderer: React.FC<{ node: ArrowNode }> = React.memo(({ node }) => {
  const x1 = 0;
  const y1 = 0;
  const x2 = node.width;
  const y2 = node.height;
  const markerId = `arrow_${node.id}`;
  const filter = resolveFilter(node);

  return (
    <>
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill={node.stroke || '#000000'} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={node.stroke || '#000000'}
        strokeWidth={Math.max(1, node.strokeWidth || 2)}
        strokeDasharray={getDashArray(node.strokeStyle, node.strokeWidth)}
        strokeLinecap="round"
        markerEnd={node.arrowEnd === 'arrow' ? `url(#${markerId})` : undefined}
        filter={filter}
        style={{
          mixBlendMode: (node.blendMode as any) || 'normal'
        }}
      />
    </>
  );
});

export const PolygonRenderer: React.FC<{ node: PolygonNode }> = React.memo(({ node }) => {
  const sides = Math.max(3, node.sides || 3);
  const rx = node.width / 2;
  const ry = node.height / 2;
  const points: string[] = [];
  const fill = resolveFill(node);
  const filter = resolveFilter(node);

  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const px = rx + rx * Math.cos(angle);
    const py = ry + ry * Math.sin(angle);
    points.push(`${px},${py}`);
  }

  return (
    <polygon
      points={points.join(' ')}
      fill={fill}
      stroke={node.stroke || 'none'}
      strokeWidth={node.strokeWidth || 0}
      strokeDasharray={getDashArray(node.strokeStyle, node.strokeWidth)}
      filter={filter}
      style={{
        mixBlendMode: (node.blendMode as any) || 'normal'
      }}
    />
  );
});

export const PencilRenderer: React.FC<{ node: PencilNode }> = React.memo(({ node }) => {
  if (!node.points || node.points.length === 0) return null;

  let d = `M ${node.points[0].x} ${node.points[0].y}`;
  for (let i = 1; i < node.points.length; i++) {
    d += ` L ${node.points[i].x} ${node.points[i].y}`;
  }
  if (node.isClosed) {
    d += ' Z';
  }

  const fill = resolveFill(node);
  const filter = resolveFilter(node);

  return (
    <path
      d={d}
      fill={fill === 'transparent' ? 'none' : fill}
      stroke={node.stroke || '#000000'}
      strokeWidth={Math.max(1, node.strokeWidth || 2)}
      strokeDasharray={getDashArray(node.strokeStyle, node.strokeWidth)}
      strokeLinecap="round"
      strokeLinejoin="round"
      filter={filter}
      style={{
        mixBlendMode: (node.blendMode as any) || 'normal'
      }}
    />
  );
});
