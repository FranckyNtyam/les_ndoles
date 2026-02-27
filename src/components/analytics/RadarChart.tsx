import React from 'react';

interface RadarChartProps {
  data: { label: string; value: number; max?: number }[];
  size?: number;
  color?: string;
  bgColor?: string;
}

const RadarChart: React.FC<RadarChartProps> = ({
  data,
  size = 280,
  color = '#FCD116',
  bgColor = 'rgba(252, 209, 22, 0.15)',
}) => {
  const center = size / 2;
  const radius = size * 0.38;
  const levels = 5;
  const angleStep = (2 * Math.PI) / data.length;

  // Get point coordinates for a given value at a given index
  const getPoint = (index: number, value: number, maxVal: number = 100) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / maxVal) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Generate polygon points for the data
  const dataPoints = data.map((d, i) => getPoint(i, d.value, d.max || 100));
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // Generate grid levels
  const gridLevels = Array.from({ length: levels }, (_, i) => {
    const levelValue = ((i + 1) / levels) * 100;
    const points = data.map((_, j) => getPoint(j, levelValue));
    return points.map((p) => `${p.x},${p.y}`).join(' ');
  });

  // Label positions (slightly outside the chart)
  const labelPoints = data.map((_, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const r = radius + 28;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* Grid levels */}
      {gridLevels.map((points, i) => (
        <polygon
          key={`grid-${i}`}
          points={points}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {data.map((_, i) => {
        const point = getPoint(i, 100);
        return (
          <line
            key={`axis-${i}`}
            x1={center}
            y1={center}
            x2={point.x}
            y2={point.y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        );
      })}

      {/* Data polygon fill */}
      <polygon
        points={dataPath}
        fill={bgColor}
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        className="transition-all duration-700"
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle
          key={`point-${i}`}
          cx={p.x}
          cy={p.y}
          r="4"
          fill={color}
          stroke="#0a1a0f"
          strokeWidth="2"
          className="transition-all duration-700"
        />
      ))}

      {/* Labels */}
      {data.map((d, i) => {
        const pos = labelPoints[i];
        return (
          <g key={`label-${i}`}>
            <text
              x={pos.x}
              y={pos.y - 6}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-400 text-[10px] font-medium"
            >
              {d.label}
            </text>
            <text
              x={pos.x}
              y={pos.y + 8}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white text-[11px] font-bold"
            >
              {d.value}
            </text>
          </g>
        );
      })}

      {/* Center dot */}
      <circle cx={center} cy={center} r="2" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
};

export default RadarChart;
