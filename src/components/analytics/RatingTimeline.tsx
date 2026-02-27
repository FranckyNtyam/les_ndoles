import React, { useState } from 'react';
import { RatingPoint } from '@/data/playerAnalytics';

interface RatingTimelineProps {
  data: RatingPoint[];
  height?: number;
}

const RatingTimeline: React.FC<RatingTimelineProps> = ({ data, height = 240 }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
        No rating history available
      </div>
    );
  }

  const padding = { top: 30, right: 30, bottom: 40, left: 45 };
  const width = 700;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate scales
  const minRating = Math.max(0, Math.min(...data.map((d) => d.rating)) - 0.5);
  const maxRating = Math.min(10, Math.max(...data.map((d) => d.rating)) + 0.5);
  const ratingRange = maxRating - minRating || 1;

  const getX = (index: number) => padding.left + (index / (data.length - 1)) * chartWidth;
  const getY = (rating: number) =>
    padding.top + chartHeight - ((rating - minRating) / ratingRange) * chartHeight;

  // Build SVG path
  const linePath = data
    .map((d, i) => {
      const x = getX(i);
      const y = getY(d.rating);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Build area path (for gradient fill)
  const areaPath = `${linePath} L ${getX(data.length - 1)} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;

  // Y-axis ticks
  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round((minRating + (ratingRange / yTicks) * i) * 10) / 10
  );

  // X-axis labels (show years)
  const years = [...new Set(data.map((d) => d.year))];
  const yearPositions = years.map((year) => {
    const firstIndex = data.findIndex((d) => d.year === year);
    return { year, x: getX(firstIndex) };
  });

  // Events
  const events = data
    .map((d, i) => (d.event ? { ...d, index: i } : null))
    .filter(Boolean) as (RatingPoint & { index: number })[];

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full min-w-[500px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#006633" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#006633" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#006633" />
            <stop offset="50%" stopColor="#FCD116" />
            <stop offset="100%" stopColor="#006633" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTickValues.map((val) => (
          <g key={`grid-${val}`}>
            <line
              x1={padding.left}
              y1={getY(val)}
              x2={width - padding.right}
              y2={getY(val)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            <text
              x={padding.left - 10}
              y={getY(val)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-gray-500 text-[10px]"
            >
              {val.toFixed(1)}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {yearPositions.map(({ year, x }) => (
          <text
            key={`year-${year}`}
            x={x}
            y={height - 8}
            textAnchor="middle"
            className="fill-gray-500 text-[10px] font-medium"
          >
            {year}
          </text>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#ratingGradient)" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((d, i) => {
          const x = getX(i);
          const y = getY(d.rating);
          const isHovered = hoveredIndex === i;
          const isEvent = !!d.event;

          return (
            <g
              key={`point-${i}`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            >
              {/* Invisible larger hit area */}
              <circle cx={x} cy={y} r="12" fill="transparent" />

              {/* Visible point */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 5 : isEvent ? 4 : 2.5}
                fill={isEvent ? '#FCD116' : '#006633'}
                stroke={isHovered ? '#FCD116' : isEvent ? '#0a1a0f' : 'transparent'}
                strokeWidth="2"
                className="transition-all duration-200"
              />

              {/* Tooltip */}
              {isHovered && (
                <g>
                  <rect
                    x={x - 50}
                    y={y - 42}
                    width="100"
                    height={d.event ? 36 : 24}
                    rx="6"
                    fill="rgba(0,0,0,0.85)"
                    stroke="rgba(252,209,22,0.3)"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={y - 28}
                    textAnchor="middle"
                    className="fill-white text-[10px] font-bold"
                  >
                    {d.rating.toFixed(1)} / 10
                  </text>
                  <text
                    x={x}
                    y={y - 16}
                    textAnchor="middle"
                    className="fill-gray-400 text-[8px]"
                  >
                    {`${d.year}-${String(d.month).padStart(2, '0')}`}
                  </text>
                  {d.event && (
                    <text
                      x={x}
                      y={y - 4}
                      textAnchor="middle"
                      className="fill-[#FCD116] text-[7px] font-medium"
                    >
                      {d.event.length > 20 ? d.event.slice(0, 20) + '...' : d.event}
                    </text>
                  )}
                </g>
              )}
            </g>
          );
        })}

        {/* Event markers on timeline */}
        {events.map((e) => {
          const x = getX(e.index);
          return (
            <g key={`event-${e.index}`}>
              <line
                x1={x}
                y1={getY(e.rating) + 6}
                x2={x}
                y2={padding.top + chartHeight}
                stroke="rgba(252,209,22,0.2)"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default RatingTimeline;
