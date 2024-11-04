import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '../../lib/utils';

interface DataPoint {
  value: number;
  label: string;
}

interface VitalChartProps {
  data: DataPoint[];
  type: string;
  unit: string;
  height?: number;
  className?: string;
}

export function VitalChart({ data, type, unit, height = 200, className }: VitalChartProps) {
  // Мемоизация отсортированных данных
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.label);
      const dateB = new Date(b.label);
      return dateA.getTime() - dateB.getTime();
    });
  }, [data]);

  // Мемоизация подготовленных данных для графика
  const chartData = useMemo(() => {
    return sortedData.map(point => ({
      time: point.label,
      value: point.value
    }));
  }, [sortedData]);

  const getReferenceRange = (type: string) => {
    switch (type) {
      case 'systolic': return { min: 90, max: 120, danger: 140 };
      case 'diastolic': return { min: 60, max: 80, danger: 90 };
      case 'heartRate': return { min: 60, max: 100, danger: 120 };
      case 'temperature': return { min: 36, max: 37.8, danger: 38.5 };
      case 'bloodSugar': return { min: 70, max: 140, danger: 180 };
      case 'weight': return { min: 65, max: 75, danger: 80 };
      default: return null;
    }
  };

  const getStatusColor = (value: number) => {
    const reference = getReferenceRange(type);
    if (!reference) return '#22c55e';
    if (value >= reference.danger) return '#ef4444';
    if (value >= reference.max) return '#eab308';
    if (value <= reference.min) return '#ef4444';
    return '#22c55e';
  };

  const getStatusText = (value: number) => {
    const reference = getReferenceRange(type);
    if (!reference) return 'Normal';
    if (value >= reference.danger) return 'High';
    if (value >= reference.max) return 'Elevated';
    if (value <= reference.min) return 'Low';
    return 'Normal';
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.[0]) {
      const value = payload[0].value;
      return (
        <div className="bg-popover/95 backdrop-blur-sm text-popover-foreground px-3 py-2 rounded-lg text-sm shadow-md border border-border/50">
          <div className="font-medium whitespace-nowrap">
            {value} {unit}
            <span className={`ml-2 text-xs`} style={{ color: getStatusColor(value) }}>
              {getStatusText(value)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground whitespace-nowrap">
            {payload[0].payload.time}
          </div>
        </div>
      );
    }
    return null;
  };

  const reference = getReferenceRange(type);

  // Вычисляем оптимальную ширину графика на основе размера экрана
  const chartWidth = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    const minWidth = isMobile ? window.innerWidth - 40 : 600;
    return Math.max(minWidth, data.length * (isMobile ? 40 : 20));
  }, [data.length]);

  return (
    <div className={cn(
      "w-full overflow-x-auto scrollbar-thin scrollbar-thumb-pink-500/20 scrollbar-track-transparent",
      "touch-pan-x overscroll-x-contain",
      className
    )}>
      <div style={{ width: chartWidth + 'px', height: '100%' }}>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(219, 39, 119)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="rgb(219, 39, 119)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            {reference && (
              <CartesianGrid 
                strokeDasharray="3 3"
                horizontal={false}
                stroke="hsl(var(--border))"
                opacity={0.5}
              />
            )}
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={20}
              className="text-muted-foreground"
            />
            <YAxis 
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              domain={reference ? ['auto', 'auto'] : undefined}
              className="text-muted-foreground"
              width={30}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ 
                stroke: 'rgb(219, 39, 119)',
                strokeWidth: 1,
                strokeDasharray: '4 4'
              }}
            />
            {reference && (
              <>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="rgb(219, 39, 119)"
                  strokeWidth={2}
                  fill={`url(#gradient-${type})`}
                  dot={{ 
                    fill: 'white', 
                    stroke: (data: any) => getStatusColor(data.value),
                    strokeWidth: 2,
                    r: 3
                  }}
                  activeDot={{ 
                    fill: 'rgb(219, 39, 119)', 
                    stroke: 'white',
                    strokeWidth: 2,
                    r: 5
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="transparent"
                  fill="rgb(239, 68, 68)"
                  fillOpacity={0.1}
                  activeDot={false}
                  isAnimationActive={false}
                  baseValue={reference.danger}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="transparent"
                  fill="rgb(234, 179, 8)"
                  fillOpacity={0.1}
                  activeDot={false}
                  isAnimationActive={false}
                  baseValue={reference.max}
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}