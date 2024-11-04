import React, { useState, useMemo } from 'react';
import { Activity, TrendingUp, Heart, Thermometer, Droplets, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { VitalChart } from './charts/VitalChart';
import { cn } from '../lib/utils';

interface VitalReading {
  date: string;
  time: string;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  temperature: number;
  bloodSugar: {
    value: number;
    type: string;
  };
  weight: number;
}

interface VitalStatsProps {
  readings: VitalReading[];
}

type SortField = 'datetime' | 'bp' | 'hr' | 'temp' | 'sugar' | 'weight';
type SortOrder = 'asc' | 'desc';

const ITEMS_PER_PAGE = 5; // Уменьшено для мобильных устройств

export default function VitalStats({ readings }: VitalStatsProps) {
  const [sortField, setSortField] = useState<SortField>('datetime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [timeRange, setTimeRange] = useState('7d');
  const [currentPage, setCurrentPage] = useState(1);

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date} ${time}`);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(dateObj);
  };

  const formatChartDate = (date: string, time: string) => {
    const dateObj = new Date(`${date} ${time}`);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      hour12: true
    }).format(dateObj);
  };

  const filterReadingsByTimeRange = useMemo(() => {
    const now = new Date();
    const msInDay = 24 * 60 * 60 * 1000;
    
    return readings.filter(r => {
      const readingDate = new Date(`${r.date} ${r.time}`);
      switch (timeRange) {
        case '24h':
          return now.getTime() - readingDate.getTime() <= msInDay;
        case '7d':
          return now.getTime() - readingDate.getTime() <= 7 * msInDay;
        case '30d':
          return now.getTime() - readingDate.getTime() <= 30 * msInDay;
        default:
          return true;
      }
    });
  }, [readings, timeRange]);

  const sortedReadings = useMemo(() => {
    return [...filterReadingsByTimeRange].sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      
      switch (sortField) {
        case 'datetime':
          return multiplier * (new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime());
        case 'bp':
          return multiplier * (a.bloodPressure.systolic - b.bloodPressure.systolic);
        case 'hr':
          return multiplier * (a.heartRate - b.heartRate);
        case 'temp':
          return multiplier * (a.temperature - b.temperature);
        case 'sugar':
          return multiplier * (a.bloodSugar.value - b.bloodSugar.value);
        case 'weight':
          return multiplier * (a.weight - b.weight);
        default:
          return 0;
      }
    });
  }, [filterReadingsByTimeRange, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(sortedReadings.length / ITEMS_PER_PAGE);
  const paginatedReadings = sortedReadings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => toggleSort(field)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {children}
      {sortField === field && (
        <ArrowUpDown className="h-3 w-3" />
      )}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center space-x-2 text-foreground">
          <Activity className="text-pink-500" size={24} />
          <h2 className="text-lg font-semibold">Vital Statistics</h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {['24h', '7d', '30d', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => {
                setTimeRange(range);
                setCurrentPage(1);
              }}
              className={cn(
                "px-3 py-1 rounded-md text-sm transition-colors",
                timeRange === range
                  ? 'bg-pink-500 text-white'
                  : 'bg-secondary hover:bg-secondary/80'
              )}
            >
              {range === 'all' ? 'All' : range}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium">Blood Pressure</h3>
              <p className="text-sm text-muted-foreground">Systolic & Diastolic</p>
            </div>
            <Heart className="text-pink-500" size={20} />
          </div>
          <div className="space-y-6">
            <VitalChart
              data={filterReadingsByTimeRange.map(r => ({
                value: r.bloodPressure.systolic,
                label: formatChartDate(r.date, r.time)
              }))}
              type="systolic"
              unit="mmHg"
              height={140}
            />
            <VitalChart
              data={filterReadingsByTimeRange.map(r => ({
                value: r.bloodPressure.diastolic,
                label: formatChartDate(r.date, r.time)
              }))}
              type="diastolic"
              unit="mmHg"
              height={140}
            />
          </div>
        </div>

        <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium">Heart Rate</h3>
              <p className="text-sm text-muted-foreground">Beats per minute</p>
            </div>
            <TrendingUp className="text-pink-500" size={20} />
          </div>
          <VitalChart
            data={filterReadingsByTimeRange.map(r => ({
              value: r.heartRate,
              label: formatChartDate(r.date, r.time)
            }))}
            type="heartRate"
            unit="bpm"
            height={140}
          />
        </div>

        <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium">Blood Sugar</h3>
              <p className="text-sm text-muted-foreground">Daily measurements</p>
            </div>
            <Droplets className="text-pink-500" size={20} />
          </div>
          <VitalChart
            data={filterReadingsByTimeRange.map(r => ({
              value: r.bloodSugar.value,
              label: formatChartDate(r.date, r.time)
            }))}
            type="bloodSugar"
            unit="mg/dL"
            height={140}
          />
        </div>

        <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium">Temperature & Weight</h3>
              <p className="text-sm text-muted-foreground">Daily tracking</p>
            </div>
            <Thermometer className="text-pink-500" size={20} />
          </div>
          <div className="space-y-6">
            <VitalChart
              data={filterReadingsByTimeRange.map(r => ({
                value: r.temperature,
                label: formatChartDate(r.date, r.time)
              }))}
              type="temperature"
              unit="°C"
              height={140}
            />
            <VitalChart
              data={filterReadingsByTimeRange.map(r => ({
                value: r.weight,
                label: formatChartDate(r.date, r.time)
              }))}
              type="weight"
              unit="kg"
              height={140}
            />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6">
          <h3 className="font-medium mb-4">Detailed History</h3>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="text-left">
                    <th className="py-3 px-4 text-sm font-medium text-muted-foreground">
                      <SortButton field="datetime">Date & Time</SortButton>
                    </th>
                    <th className="py-3 px-4 text-sm font-medium text-muted-foreground">
                      <SortButton field="bp">BP</SortButton>
                    </th>
                    <th className="py-3 px-4 text-sm font-medium text-muted-foreground">
                      <SortButton field="hr">HR</SortButton>
                    </th>
                    <th className="py-3 px-4 text-sm font-medium text-muted-foreground">
                      <SortButton field="temp">Temp</SortButton>
                    </th>
                    <th className="py-3 px-4 text-sm font-medium text-muted-foreground">
                      <SortButton field="sugar">Sugar</SortButton>
                    </th>
                    <th className="py-3 px-4 text-sm font-medium text-muted-foreground">
                      <SortButton field="weight">Weight</SortButton>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedReadings.map((reading, index) => (
                    <tr
                      key={index}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        {formatDateTime(reading.date, reading.time)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        <span className={reading.bloodPressure.systolic > 140 || reading.bloodPressure.systolic < 90 ? 'text-destructive' : ''}>
                          {reading.bloodPressure.systolic}
                        </span>
                        /
                        <span className={reading.bloodPressure.diastolic > 90 || reading.bloodPressure.diastolic < 60 ? 'text-destructive' : ''}>
                          {reading.bloodPressure.diastolic}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        <span className={reading.heartRate > 100 || reading.heartRate < 60 ? 'text-destructive' : ''}>
                          {reading.heartRate}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        <span className={reading.temperature > 37.8 || reading.temperature < 36 ? 'text-destructive' : ''}>
                          {reading.temperature}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        <span className={reading.bloodSugar.value > 140 || reading.bloodSugar.value < 70 ? 'text-destructive' : ''}>
                          {reading.bloodSugar.value}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">
                          ({reading.bloodSugar.type})
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        {reading.weight.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Упрощенная пагинация для мобильных устройств */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md text-sm bg-secondary disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md text-sm bg-secondary disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}