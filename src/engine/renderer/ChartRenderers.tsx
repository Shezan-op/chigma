import React from 'react';
import type { BarChartNode, LineChartNode, PieChartNode, DonutChartNode } from '../../models/node';

const DEFAULT_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4', '#6366F1'];

export const BarChartRenderer: React.FC<{ node: BarChartNode }> = React.memo(({ node }) => {
  const { width, height, data = [], showGrid = true, showLabels = true, showAxis = true, colors = DEFAULT_COLORS, title } = node;
  
  const padLeft = showAxis ? 40 : 16;
  const padBottom = showLabels ? 30 : 16;
  const padTop = title ? 36 : 16;
  const padRight = 16;

  const chartW = Math.max(10, width - padLeft - padRight);
  const chartH = Math.max(10, height - padTop - padBottom);

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const barCount = data.length || 1;
  const slotWidth = chartW / barCount;
  const barWidth = Math.max(4, Math.min(48, slotWidth * 0.65));

  return (
    <g>
      <rect width={width} height={height} rx={6} fill="#FFFFFF" stroke="#E4E4E7" strokeWidth={1} />
      
      {title && (
        <text
          x={padLeft}
          y={22}
          fontFamily="Inter, sans-serif"
          fontSize={13}
          fontWeight={600}
          fill="#18181B"
        >
          {title}
        </text>
      )}

      {showGrid && (
        <g stroke="#F4F4F5" strokeWidth={1} strokeDasharray="3,3">
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padTop + chartH * (1 - ratio);
            return <line key={i} x1={padLeft} y1={y} x2={padLeft + chartW} y2={y} />;
          })}
        </g>
      )}

      {showAxis && (
        <g stroke="#D4D4D8" strokeWidth={1}>
          <line x1={padLeft} y1={padTop} x2={padLeft} y2={padTop + chartH} />
          <line x1={padLeft} y1={padTop + chartH} x2={padLeft + chartW} y2={padTop + chartH} />
        </g>
      )}

      {data.map((item, index) => {
        const barH = (item.value / maxValue) * chartH;
        const x = padLeft + index * slotWidth + (slotWidth - barWidth) / 2;
        const y = padTop + chartH - barH;
        const barColor = item.color || colors[index % colors.length];

        return (
          <g key={index}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barH}
              rx={3}
              fill={barColor}
            />
            {showLabels && (
              <text
                x={x + barWidth / 2}
                y={padTop + chartH + 16}
                fontFamily="Inter, sans-serif"
                fontSize={10}
                fill="#71717A"
                textAnchor="middle"
              >
                {item.label}
              </text>
            )}
            <text
              x={x + barWidth / 2}
              y={y - 4}
              fontFamily="Inter, sans-serif"
              fontSize={10}
              fontWeight={500}
              fill="#52525B"
              textAnchor="middle"
            >
              {item.value}
            </text>
          </g>
        );
      })}
    </g>
  );
});

export const LineChartRenderer: React.FC<{ node: LineChartNode }> = React.memo(({ node }) => {
  const { width, height, data = [], showGrid = true, showLabels = true, showAxis = true, colors = DEFAULT_COLORS, title } = node;

  const padLeft = showAxis ? 40 : 16;
  const padBottom = showLabels ? 30 : 16;
  const padTop = title ? 36 : 16;
  const padRight = 16;

  const chartW = Math.max(10, width - padLeft - padRight);
  const chartH = Math.max(10, height - padTop - padBottom);

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const points = data.map((d, i) => {
    const x = padLeft + (data.length > 1 ? (i / (data.length - 1)) * chartW : chartW / 2);
    const y = padTop + chartH - (d.value / maxValue) * chartH;
    return { x, y, label: d.label, value: d.value };
  });

  const lineColor = colors[0] || '#10B981';
  let pathD = '';
  let areaD = '';

  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${points[i].x} ${points[i].y}`;
    }
    areaD = `${pathD} L ${points[points.length - 1].x} ${padTop + chartH} L ${points[0].x} ${padTop + chartH} Z`;
  }

  return (
    <g>
      <rect width={width} height={height} rx={6} fill="#FFFFFF" stroke="#E4E4E7" strokeWidth={1} />
      {title && (
        <text x={padLeft} y={22} fontFamily="Inter, sans-serif" fontSize={13} fontWeight={600} fill="#18181B">
          {title}
        </text>
      )}

      {showGrid && (
        <g stroke="#F4F4F5" strokeWidth={1} strokeDasharray="3,3">
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padTop + chartH * (1 - ratio);
            return <line key={i} x1={padLeft} y1={y} x2={padLeft + chartW} y2={y} />;
          })}
        </g>
      )}

      {showAxis && (
        <g stroke="#D4D4D8" strokeWidth={1}>
          <line x1={padLeft} y1={padTop} x2={padLeft} y2={padTop + chartH} />
          <line x1={padLeft} y1={padTop + chartH} x2={padLeft + chartW} y2={padTop + chartH} />
        </g>
      )}

      {areaD && <path d={areaD} fill={lineColor} opacity={0.12} />}
      {pathD && <path d={pathD} fill="none" stroke={lineColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />}

      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill="#FFFFFF" stroke={lineColor} strokeWidth={2} />
          {showLabels && (
            <text x={p.x} y={padTop + chartH + 16} fontFamily="Inter, sans-serif" fontSize={10} fill="#71717A" textAnchor="middle">
              {p.label}
            </text>
          )}
          <text x={p.x} y={p.y - 8} fontFamily="Inter, sans-serif" fontSize={10} fontWeight={500} fill="#52525B" textAnchor="middle">
            {p.value}
          </text>
        </g>
      ))}
    </g>
  );
});

export const PieChartRenderer: React.FC<{ node: PieChartNode }> = React.memo(({ node }) => {
  const { width, height, data = [], colors = DEFAULT_COLORS, title } = node;
  const cx = width / 2;
  const padTop = title ? 30 : 10;
  const cy = padTop + (height - padTop) / 2;
  const radius = Math.min(width, height - padTop) / 2 - 16;

  const total = data.reduce((acc, d) => acc + d.value, 0) || 1;
  let accumulatedAngle = -Math.PI / 2;

  return (
    <g>
      <rect width={width} height={height} rx={6} fill="#FFFFFF" stroke="#E4E4E7" strokeWidth={1} />
      {title && (
        <text x={16} y={22} fontFamily="Inter, sans-serif" fontSize={13} fontWeight={600} fill="#18181B">
          {title}
        </text>
      )}

      {data.map((item, index) => {
        const sliceAngle = (item.value / total) * (Math.PI * 2);
        const startAngle = accumulatedAngle;
        const endAngle = accumulatedAngle + sliceAngle;
        accumulatedAngle += sliceAngle;

        const x1 = cx + radius * Math.cos(startAngle);
        const y1 = cy + radius * Math.sin(startAngle);
        const x2 = cx + radius * Math.cos(endAngle);
        const y2 = cy + radius * Math.sin(endAngle);
        const largeArc = sliceAngle > Math.PI ? 1 : 0;

        const d = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
        const sliceColor = item.color || colors[index % colors.length];

        return (
          <path
            key={index}
            d={d}
            fill={sliceColor}
            stroke="#FFFFFF"
            strokeWidth={1.5}
          />
        );
      })}
    </g>
  );
});

export const DonutChartRenderer: React.FC<{ node: DonutChartNode }> = React.memo(({ node }) => {
  const { width, height, data = [], colors = DEFAULT_COLORS, innerRadiusRatio = 0.6, title } = node;
  const cx = width / 2;
  const padTop = title ? 30 : 10;
  const cy = padTop + (height - padTop) / 2;
  const outerRadius = Math.min(width, height - padTop) / 2 - 16;
  const innerRadius = outerRadius * innerRadiusRatio;

  const total = data.reduce((acc, d) => acc + d.value, 0) || 1;
  let accumulatedAngle = -Math.PI / 2;

  return (
    <g>
      <rect width={width} height={height} rx={6} fill="#FFFFFF" stroke="#E4E4E7" strokeWidth={1} />
      {title && (
        <text x={16} y={22} fontFamily="Inter, sans-serif" fontSize={13} fontWeight={600} fill="#18181B">
          {title}
        </text>
      )}

      {data.map((item, index) => {
        const sliceAngle = (item.value / total) * (Math.PI * 2);
        const startAngle = accumulatedAngle;
        const endAngle = accumulatedAngle + sliceAngle;
        accumulatedAngle += sliceAngle;

        const x1Out = cx + outerRadius * Math.cos(startAngle);
        const y1Out = cy + outerRadius * Math.sin(startAngle);
        const x2Out = cx + outerRadius * Math.cos(endAngle);
        const y2Out = cy + outerRadius * Math.sin(endAngle);

        const x1In = cx + innerRadius * Math.cos(endAngle);
        const y1In = cy + innerRadius * Math.sin(endAngle);
        const x2In = cx + innerRadius * Math.cos(startAngle);
        const y2In = cy + innerRadius * Math.sin(startAngle);

        const largeArc = sliceAngle > Math.PI ? 1 : 0;

        const d = `M ${x1Out} ${y1Out} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2Out} ${y2Out} L ${x1In} ${y1In} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x2In} ${y2In} Z`;
        const sliceColor = item.color || colors[index % colors.length];

        return (
          <path
            key={index}
            d={d}
            fill={sliceColor}
            stroke="#FFFFFF"
            strokeWidth={1.5}
          />
        );
      })}

      <text
        x={cx}
        y={cy - 2}
        fontFamily="Inter, sans-serif"
        fontSize={16}
        fontWeight={700}
        fill="#18181B"
        textAnchor="middle"
      >
        {total}
      </text>
      <text
        x={cx}
        y={cy + 14}
        fontFamily="Inter, sans-serif"
        fontSize={10}
        fill="#71717A"
        textAnchor="middle"
      >
        Total
      </text>
    </g>
  );
});
