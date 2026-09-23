import React, { useState } from 'react';
import { IrrigationZone } from '../types/farm';
import { Droplets, Play, Pause, RotateCw, Gauge, Zap, CheckCircle2, Sliders, ShieldCheck } from 'lucide-react';

interface IrrigationManagerProps {
  zones: IrrigationZone[];
  onToggleZone: (id: string) => void;
}

export const IrrigationManager: React.FC<IrrigationManagerProps> = ({ zones, onToggleZone }) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>(zones[0]?.id || 'iz-1');
  const [applicationDepthMm, setApplicationDepthMm] = useState<number>(18);
  const [cropKcFactor, setCropKcFactor] = useState<number>(1.15); // e.g. R1 Silking Corn

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || zones[0];

  // Daily water budget calculation
  const et0 = 4.6; // mm/day from weather station
  const dailyEtc = (et0 * cropKcFactor).toFixed(2);
  const daysUntilWilting = ((selectedZone.currentMoisturePct - 18) / parseFloat(dailyEtc)).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Visual Hero Card with Generated Center-Pivot Photography */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-900/60 shadow-lg">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/smart_irrigation_pivot_1790161684272.jpg"
            alt="Center pivot irrigation system spraying mist over crops"
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-8 z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-sky-400 font-medium tracking-wide uppercase mb-2">
              <Droplets className="w-3.5 h-3.5" />
              <span>Smart Hydro-Telemetry & Center-Pivot Automation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Variable-Rate Irrigation & Moisture Deficit Management
            </h1>
            <p className="mt-2 text-sm text-stone-300 leading-relaxed">
              Automated root-zone replenishment synchronized with daily Penman-Monteith crop evapotranspiration (ETc) to eliminate deep percolation leaching.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-400">
              <span>Active Systems: <strong className="text-white font-mono tabular-nums">{zones.filter(z => z.status === 'active').length} of {zones.length} Running</strong></span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span>Total Volume Delivered: <strong className="text-sky-400 font-mono tabular-nums">9,700 m³</strong></span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span>Mean Water Use Efficiency: <strong className="text-emerald-400 font-mono tabular-nums">92.4%</strong></span>
            </div>
          </div>

          <div className="bg-stone-950/80 border border-stone-800 p-4 rounded-xl flex items-center gap-4 self-start md:self-center">
            <div>
              <div className="text-[11px] text-stone-400">Pump VFD Frequency</div>
              <div className="text-xl font-bold text-emerald-400 font-mono tabular-nums mt-0.5">
                58.4 Hz
              </div>
            </div>
            <div className="border-l border-stone-800 pl-4">
              <div className="text-[11px] text-stone-400">Mainline Pressure</div>
              <div className="text-xl font-bold text-white font-mono tabular-nums mt-0.5">
                48.2 psi
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Zone Cards + Variable Rate Controller */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Irrigation Zones List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Gauge className="w-4 h-4 text-sky-400" />
              <span>Telemetry Zones & Pivot Controllers</span>
            </h2>
            <span className="text-xs text-stone-400">VFD Pressure Regulated</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {zones.map((zone) => {
              const isSelected = zone.id === selectedZoneId;
              const isActive = zone.status === 'active';

              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZoneId(zone.id)}
                  className={`cursor-pointer p-5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-stone-900/90 border-sky-500/50 shadow-md ring-1 ring-sky-500/30'
                      : 'bg-stone-900/50 border-stone-800/80 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[11px] text-sky-400 font-medium">{zone.type}</div>
                      <h3 className="text-base font-bold text-white mt-0.5">{zone.name}</h3>
                      <div className="text-xs text-stone-400 mt-0.5">{zone.fieldName}</div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleZone(zone.id);
                      }}
                      className={`p-2 rounded-xl text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-sky-500 text-stone-950 hover:bg-sky-400'
                          : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                      }`}
                      title={isActive ? 'Pause Irrigation Run' : 'Start Irrigation Run'}
                    >
                      {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Telemetry Progress Bars */}
                  <div className="mt-4 space-y-2.5">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-stone-400">Current Soil Moisture</span>
                        <span className="font-mono font-semibold text-sky-400 tabular-nums">
                          {zone.currentMoisturePct}% VWC
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sky-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, zone.currentMoisturePct * 2.5)}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-800/60 text-xs">
                      <div>
                        <span className="text-stone-400 text-[11px]">Flow Rate: </span>
                        <span className="font-mono tabular-nums text-stone-200">
                          {zone.applicationRateMmPerHour} mm/h
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[11px]">Efficiency: </span>
                        <span className="font-mono tabular-nums text-emerald-400">
                          {zone.efficiencyRatingPct}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Water Balance & Variable Rate Application (5 cols) */}
        <div className="lg:col-span-5 bg-stone-900/60 border border-stone-800/90 rounded-2xl p-6 shadow-md space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>VRA Prescription & Water Budget</span>
            </h2>
            <span className="text-xs font-mono text-emerald-400">FAO-56 Dual Kc</span>
          </div>

          {/* Selected Zone Context */}
          <div className="p-3.5 bg-stone-950/60 rounded-xl border border-stone-800">
            <div className="text-xs text-stone-400">Active Controller:</div>
            <div className="text-sm font-bold text-white mt-0.5">{selectedZone.name}</div>
            <div className="text-xs text-stone-300 mt-0.5">{selectedZone.fieldName}</div>
          </div>

          {/* Water Balance Calculator */}
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-300">Crop Coefficient (Kc factor):</span>
              <span className="font-mono font-bold text-white">{cropKcFactor} (Silking)</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="1.3"
              step="0.05"
              value={cropKcFactor}
              onChange={(e) => setCropKcFactor(parseFloat(e.target.value))}
              className="w-full accent-emerald-400"
            />

            <div className="flex items-center justify-between">
              <span className="text-stone-300">Planned Pass Depth:</span>
              <span className="font-mono font-bold text-sky-400">{applicationDepthMm} mm</span>
            </div>
            <input
              type="range"
              min="5"
              max="35"
              step="1"
              value={applicationDepthMm}
              onChange={(e) => setApplicationDepthMm(parseInt(e.target.value))}
              className="w-full accent-sky-400"
            />
          </div>

          {/* Calculated Agronomic Budget Box */}
          <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800/80 space-y-2.5">
            <div className="text-xs font-semibold text-stone-200">
              Crop Evapotranspiration Balance (FAO Penman-Monteith)
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-stone-900/60 rounded-lg border border-stone-800">
                <div className="text-[10px] text-stone-400">Daily Crop ETc</div>
                <div className="text-base font-bold text-sky-400 font-mono tabular-nums mt-0.5">
                  {dailyEtc} mm/day
                </div>
              </div>
              <div className="p-2.5 bg-stone-900/60 rounded-lg border border-stone-800">
                <div className="text-[10px] text-stone-400">Days to Wilting (PWP)</div>
                <div className="text-base font-bold text-emerald-400 font-mono tabular-nums mt-0.5">
                  {daysUntilWilting} days
                </div>
              </div>
            </div>

            <div className="text-[11px] text-stone-400 pt-1 leading-relaxed">
              <strong className="text-stone-300">Prescription: </strong>
              Applying <span className="text-white font-mono">{applicationDepthMm} mm</span> will restore soil water depletion from 28.5% to 32.2% VWC, preventing stomatal closure without nitrate leaching into deep aquifers.
            </div>
          </div>

          {/* Manual / Scheduled trigger */}
          <button
            onClick={() => onToggleZone(selectedZone.id)}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              selectedZone.status === 'active'
                ? 'bg-amber-400 hover:bg-amber-300 text-stone-950'
                : 'bg-sky-400 hover:bg-sky-300 text-stone-950 shadow-md shadow-sky-950/40'
            }`}
          >
            {selectedZone.status === 'active' ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause {selectedZone.name} Run</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Execute {applicationDepthMm}mm Pass on {selectedZone.name}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
