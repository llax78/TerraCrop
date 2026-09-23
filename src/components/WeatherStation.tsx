import React, { useState } from 'react';
import { WeatherDay } from '../types/farm';
import { CloudSun, Wind, Droplets, Thermometer, AlertTriangle, ShieldCheck, Sun, CloudRain } from 'lucide-react';

interface WeatherStationProps {
  forecast: WeatherDay[];
}

export const WeatherStation: React.FC<WeatherStationProps> = ({ forecast }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const current = forecast[selectedDayIndex] || forecast[0];

  // Spray status classification
  const getSprayBadge = (suitability: WeatherDay['spraySuitability'], deltaT: number, wind: number) => {
    if (suitability === 'optimal') {
      return {
        label: 'Optimal Spray Window',
        sub: `Delta-T: ${deltaT}°C · Wind: ${wind} km/h (Minimal Drift Risk)`,
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
        icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />
      };
    }
    if (suitability === 'marginal') {
      return {
        label: 'Marginal Spray Window',
        sub: `Delta-T: ${deltaT}°C · Monitor wind gusts carefully`,
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
        icon: <AlertTriangle className="w-4 h-4 text-amber-400" />
      };
    }
    return {
      label: 'Unsuitable for Spraying',
      sub: deltaT > 8 ? `Delta-T too high (${deltaT}°C) - excessive droplet evaporation` : `Adverse weather (${wind} km/h wind / high inversion risk)`,
      color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
      icon: <AlertTriangle className="w-4 h-4 text-rose-400" />
    };
  };

  const sprayInfo = getSprayBadge(current.spraySuitability, current.deltaT, current.windSpeedKmh);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-stone-900/60 border border-stone-800/90 rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-400 font-medium uppercase tracking-wide">
              <span>On-Farm Automatic Weather Station #01 (Campbell Scientific WXT536)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Microclimate & Agronomic Spray Intelligence
            </h1>
            <p className="mt-1 text-sm text-stone-300">
              Delta-T evaporation index, reference evapotranspiration (ET₀), and GDD accumulation for optimal chemical applications and irrigation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400">Sensor status:</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Telemetry 1-min Sync
            </span>
          </div>
        </div>

        {/* Real-Time Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          <div className="p-3.5 bg-stone-950/60 rounded-xl border border-stone-800/80">
            <div className="flex items-center justify-between text-stone-400 text-xs">
              <span>Air Temp</span>
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
              {current.tempHigh}°<span className="text-stone-400 text-base font-normal">C</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              Low: {current.tempLow}°C
            </div>
          </div>

          <div className="p-3.5 bg-stone-950/60 rounded-xl border border-stone-800/80">
            <div className="flex items-center justify-between text-stone-400 text-xs">
              <span>Delta-T Index</span>
              <span className="text-[10px] text-emerald-400 font-mono">2-8°C optimal</span>
            </div>
            <div className={`text-2xl font-bold font-mono tabular-nums mt-1 ${
              current.deltaT >= 2 && current.deltaT <= 8 ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {current.deltaT}°<span className="text-stone-400 text-base font-normal">C</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              Dry/Wet bulb gap
            </div>
          </div>

          <div className="p-3.5 bg-stone-950/60 rounded-xl border border-stone-800/80">
            <div className="flex items-center justify-between text-stone-400 text-xs">
              <span>Wind Speed</span>
              <Wind className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
              {current.windSpeedKmh} <span className="text-stone-400 text-xs font-normal">km/h</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              Direction: <span className="text-stone-200 font-medium">{current.windDirection}</span>
            </div>
          </div>

          <div className="p-3.5 bg-stone-950/60 rounded-xl border border-stone-800/80">
            <div className="flex items-center justify-between text-stone-400 text-xs">
              <span>Rel. Humidity</span>
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
              {current.humidityPct}<span className="text-stone-400 text-base font-normal">%</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              Dew Point: 14.2°C
            </div>
          </div>

          <div className="p-3.5 bg-stone-950/60 rounded-xl border border-stone-800/80">
            <div className="flex items-center justify-between text-stone-400 text-xs">
              <span>Daily ET₀</span>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-sky-400 font-mono tabular-nums mt-1">
              {current.et0} <span className="text-stone-400 text-xs font-normal">mm</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              Evapotranspiration
            </div>
          </div>

          <div className="p-3.5 bg-stone-950/60 rounded-xl border border-stone-800/80">
            <div className="flex items-center justify-between text-stone-400 text-xs">
              <span>Daily GDD</span>
              <span className="text-[10px] text-stone-400 font-mono">Base 10°C</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums mt-1">
              +{current.gddAccumulated}
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              Season: <strong className="text-white font-mono tabular-nums">1,420 GDD</strong>
            </div>
          </div>
        </div>

        {/* Current Spraying Guidance Alert Card */}
        <div className={`mt-5 p-4 rounded-xl border flex items-start gap-3.5 ${sprayInfo.color}`}>
          <div className="mt-0.5">{sprayInfo.icon}</div>
          <div className="flex-1">
            <div className="font-semibold text-sm">{sprayInfo.label}</div>
            <div className="text-xs text-stone-300 mt-0.5">{sprayInfo.sub}</div>
          </div>
          <div className="hidden sm:block text-right text-xs">
            <div className="text-stone-300">Surface Inversion Risk:</div>
            <div className="font-semibold text-emerald-400">Low (Lapse Rate -0.7°C/100m)</div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast & Agronomic Windows Table */}
      <div className="bg-stone-900/60 border border-stone-800/90 rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-semibold text-white">7-Day Agronomic Forecast & Operations Matrix</h2>
          </div>
          <div className="text-xs text-stone-400">
            Select a day to view localized spraying conditions
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-800 text-xs text-stone-400">
                <th className="pb-3 font-medium">Day</th>
                <th className="pb-3 font-medium">Condition</th>
                <th className="pb-3 font-medium text-right">Temp (High/Low)</th>
                <th className="pb-3 font-medium text-right">Precipitation</th>
                <th className="pb-3 font-medium text-right">Wind & Gusts</th>
                <th className="pb-3 font-medium text-right">Humidity</th>
                <th className="pb-3 font-medium text-right">Delta-T</th>
                <th className="pb-3 font-medium text-right">ET₀ Loss</th>
                <th className="pb-3 font-medium text-right">Spraying Window</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {forecast.map((day, idx) => {
                const isSelected = idx === selectedDayIndex;
                return (
                  <tr
                    key={day.date}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-950/30'
                        : 'hover:bg-stone-800/40'
                    }`}
                  >
                    <td className="py-3 font-medium text-white flex items-center gap-2">
                      <span className={isSelected ? 'text-emerald-400' : 'text-stone-300'}>{day.dayName}</span>
                      <span className="text-xs text-stone-500 font-mono">{day.date.slice(5)}</span>
                    </td>
                    <td className="py-3 text-stone-300">
                      <div className="flex items-center gap-2">
                        {day.condition === 'sunny' && <Sun className="w-4 h-4 text-amber-400" />}
                        {day.condition === 'partly_cloudy' && <CloudSun className="w-4 h-4 text-stone-300" />}
                        {day.condition === 'rain' && <CloudRain className="w-4 h-4 text-sky-400" />}
                        {day.condition === 'windy' && <Wind className="w-4 h-4 text-amber-300" />}
                        <span className="capitalize text-xs">{day.condition.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right font-mono tabular-nums text-white">
                      <span className="text-stone-200 font-semibold">{day.tempHigh}°</span>
                      <span className="text-stone-500 ml-1">/ {day.tempLow}°C</span>
                    </td>
                    <td className="py-3 text-right font-mono tabular-nums">
                      {day.precipChance > 30 ? (
                        <span className="text-sky-400 font-medium">{day.precipChance}% ({day.precipMm} mm)</span>
                      ) : (
                        <span className="text-stone-400">{day.precipChance}%</span>
                      )}
                    </td>
                    <td className="py-3 text-right font-mono tabular-nums text-stone-300">
                      {day.windSpeedKmh} km/h <span className="text-stone-500 text-xs">{day.windDirection}</span>
                    </td>
                    <td className="py-3 text-right font-mono tabular-nums text-stone-300">
                      {day.humidityPct}%
                    </td>
                    <td className="py-3 text-right font-mono tabular-nums">
                      <span className={day.deltaT >= 2 && day.deltaT <= 8 ? 'text-emerald-400' : 'text-amber-400 font-semibold'}>
                        {day.deltaT}°C
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono tabular-nums text-sky-400">
                      {day.et0} mm
                    </td>
                    <td className="py-3 text-right">
                      {day.spraySuitability === 'optimal' && (
                        <span className="text-xs font-semibold text-emerald-400">Optimal (Morning/Evening)</span>
                      )}
                      {day.spraySuitability === 'marginal' && (
                        <span className="text-xs font-semibold text-amber-400">Marginal (Gusts)</span>
                      )}
                      {day.spraySuitability === 'unsuitable' && (
                        <span className="text-xs font-semibold text-rose-400">Unsuitable (Drift)</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
