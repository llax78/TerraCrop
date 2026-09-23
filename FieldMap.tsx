import React, { useState } from 'react';
import { FieldPlot, VegetationLayer } from '../types/farm';
import { Layers, Droplets, Thermometer, Mountain, Activity, Calendar, Compass, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface FieldMapProps {
  fields: FieldPlot[];
  selectedFieldId: string;
  onSelectField: (id: string) => void;
  onOpenAdvisorWithField: (field: FieldPlot) => void;
  onOpenDoctorWithField: (field: FieldPlot) => void;
}

export const FieldMap: React.FC<FieldMapProps> = ({
  fields,
  selectedFieldId,
  onSelectField,
  onOpenAdvisorWithField,
  onOpenDoctorWithField,
}) => {
  const [activeLayer, setActiveLayer] = useState<VegetationLayer>('ndvi');
  const [hoveredFieldId, setHoveredFieldId] = useState<string | null>(null);

  const selectedField = fields.find((f) => f.id === selectedFieldId) || fields[0];

  // Helper to colorize field based on layer
  const getFieldColor = (field: FieldPlot, isSelected: boolean, isHovered: boolean) => {
    let baseFill = '';
    let strokeColor = isSelected ? '#10b981' : isHovered ? '#34d399' : 'rgba(255,255,255,0.2)';
    let strokeWidth = isSelected ? 3 : isHovered ? 2 : 1.2;

    if (activeLayer === 'ndvi') {
      if (field.ndviMean >= 0.8) baseFill = 'rgba(16, 185, 129, 0.55)'; // Lush deep emerald
      else if (field.ndviMean >= 0.7) baseFill = 'rgba(52, 211, 153, 0.45)';
      else if (field.ndviMean >= 0.6) baseFill = 'rgba(234, 179, 8, 0.45)'; // Amber/Gold
      else baseFill = 'rgba(239, 68, 68, 0.45)'; // Stressed red
    } else if (activeLayer === 'moisture') {
      if (field.soilMoistureVwc >= 32) baseFill = 'rgba(14, 165, 233, 0.55)'; // Deep cyan/blue
      else if (field.soilMoistureVwc >= 27) baseFill = 'rgba(56, 189, 248, 0.45)';
      else baseFill = 'rgba(245, 158, 11, 0.45)'; // Dry amber
    } else if (activeLayer === 'temperature') {
      if (field.surfaceTempC >= 27) baseFill = 'rgba(249, 115, 22, 0.55)'; // Hot orange
      else if (field.surfaceTempC >= 24) baseFill = 'rgba(234, 179, 8, 0.45)';
      else baseFill = 'rgba(16, 185, 129, 0.45)'; // Cool
    } else {
      // Elevation
      const normalized = Math.min(1, Math.max(0, (field.elevationM - 220) / 50));
      baseFill = `rgba(${Math.round(100 + normalized * 80)}, ${Math.round(90 + normalized * 70)}, ${Math.round(80 + normalized * 60)}, 0.5)`;
    }

    return { baseFill, strokeColor, strokeWidth };
  };

  const totalAcres = fields.reduce((acc, f) => acc + f.acres, 0);
  const avgNdvi = (fields.reduce((acc, f) => acc + f.ndviMean, 0) / fields.length).toFixed(2);
  const avgMoisture = (fields.reduce((acc, f) => acc + f.soilMoistureVwc, 0) / fields.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Visual Hero Header with High-Fidelity Aerial Asset */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-900/60 shadow-lg">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/field_aerial_survey_1790161648851.jpg"
            alt="Aerial survey of precision agriculture fields"
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-8 z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium tracking-wide uppercase mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>GreenValley Agronomy Sector · Drone & Sentinel-2 Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Precision Field Intelligence & Canopy Health
            </h1>
            <p className="mt-2 text-sm text-stone-300 leading-relaxed text-balance">
              Real-time multispectral vegetation reflectance, volumetric soil water saturation, and variable-rate crop monitoring across {fields.length} active management zones.
            </p>

            {/* Zero-Pill Unboxed Metadata Bar */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-400">
              <span>Managed Area: <strong className="text-white font-mono tabular-nums">{totalAcres.toLocaleString()} ac</strong></span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span>Farm Mean NDVI: <strong className="text-emerald-400 font-mono tabular-nums">{avgNdvi}</strong></span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span>Mean Soil VWC: <strong className="text-sky-400 font-mono tabular-nums">{avgMoisture}%</strong></span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span>Sentinel Pass: <span className="text-stone-200">Today 09:42 UTC</span></span>
            </div>
          </div>

          {/* Interactive Layer Switcher (Button tabs) */}
          <div className="bg-stone-900/90 border border-stone-800 p-1.5 rounded-xl flex flex-wrap sm:flex-nowrap gap-1 shadow-inner self-start md:self-center">
            <button
              onClick={() => setActiveLayer('ndvi')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeLayer === 'ndvi'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>NDVI Canopy</span>
            </button>
            <button
              onClick={() => setActiveLayer('moisture')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeLayer === 'moisture'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Soil VWC %</span>
            </button>
            <button
              onClick={() => setActiveLayer('temperature')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeLayer === 'temperature'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" />
              <span>Thermal °C</span>
            </button>
            <button
              onClick={() => setActiveLayer('elevation')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeLayer === 'elevation'
                  ? 'bg-stone-700 text-stone-200 border border-stone-600 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Mountain className="w-3.5 h-3.5" />
              <span>Elevation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Telemetry Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Farm GIS Map Canvas (7 cols on large desktop) */}
        <div className="lg:col-span-7 bg-stone-900/60 border border-stone-800/90 rounded-2xl p-5 shadow-md flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-300">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Interactive Field Geometry & Telemetry Nodes</span>
            </div>
            <div className="text-xs text-stone-400">
              Click any parcel to inspect agronomic telemetry
            </div>
          </div>

          {/* SVG Map Container */}
          <div className="relative w-full aspect-[16/10] bg-stone-950/80 rounded-xl overflow-hidden border border-stone-800/80">
            {/* Subtle GIS grid pattern */}
            <svg
              viewBox="0 0 800 360"
              className="w-full h-full select-none cursor-pointer"
            >
              <defs>
                <pattern id="gisGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
                </pattern>
                {/* Center Pivot Hatch Pattern */}
                <pattern id="pivotHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                </pattern>
              </defs>

              <rect width="100%" height="100%" fill="#0d140e" />
              <rect width="100%" height="100%" fill="url(#gisGrid)" />

              {/* Waterway / Creek canal */}
              <path
                d="M 10 340 Q 240 330 380 280 T 780 270"
                fill="none"
                stroke="rgba(14, 165, 233, 0.35)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <text x="640" y="260" fill="rgba(56, 189, 248, 0.5)" fontSize="10" fontFamily="sans-serif">
                Willow Creek Canal
              </text>

              {/* Render Field Plots */}
              {fields.map((field) => {
                const isSelected = field.id === selectedFieldId;
                const isHovered = field.id === hoveredFieldId;
                const { baseFill, strokeColor, strokeWidth } = getFieldColor(field, isSelected, isHovered);

                if (field.shape === 'pivot' && field.coordinates[0] && field.centerRadius) {
                  const center = field.coordinates[0];
                  return (
                    <g
                      key={field.id}
                      onClick={() => onSelectField(field.id)}
                      onMouseEnter={() => setHoveredFieldId(field.id)}
                      onMouseLeave={() => setHoveredFieldId(null)}
                      className="transition-all duration-200"
                    >
                      <circle
                        cx={center.x}
                        cy={center.y}
                        r={field.centerRadius}
                        fill={baseFill}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                      />
                      {/* Pivot arm radial simulation */}
                      <line
                        x1={center.x}
                        cy={center.y}
                        x2={center.x + field.centerRadius * 0.7}
                        y2={center.y - field.centerRadius * 0.7}
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="2"
                        strokeDasharray="3 3"
                      />
                      <circle cx={center.x} cy={center.y} r="4" fill="#ffffff" />
                      {/* Plot label */}
                      <text
                        x={center.x}
                        y={center.y + 4}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="600"
                        className="pointer-events-none drop-shadow-md"
                      >
                        {field.code}
                      </text>
                      <text
                        x={center.x}
                        y={center.y + 18}
                        textAnchor="middle"
                        fill="rgba(255,255,255,0.85)"
                        fontSize="9.5"
                        className="pointer-events-none font-mono"
                      >
                        {activeLayer === 'ndvi'
                          ? `NDVI ${field.ndviMean}`
                          : activeLayer === 'moisture'
                          ? `${field.soilMoistureVwc}% VWC`
                          : `${field.surfaceTempC}°C`}
                      </text>
                    </g>
                  );
                }

                // Polygon / Rectangle fields
                const pointsString = field.coordinates.map((p) => `${p.x},${p.y}`).join(' ');
                const centroidX =
                  field.coordinates.reduce((sum, p) => sum + p.x, 0) / field.coordinates.length;
                const centroidY =
                  field.coordinates.reduce((sum, p) => sum + p.y, 0) / field.coordinates.length;

                return (
                  <g
                    key={field.id}
                    onClick={() => onSelectField(field.id)}
                    onMouseEnter={() => setHoveredFieldId(field.id)}
                    onMouseLeave={() => setHoveredFieldId(null)}
                    className="transition-all duration-200"
                  >
                    <polygon
                      points={pointsString}
                      fill={baseFill}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                    />
                    <text
                      x={centroidX}
                      y={centroidY}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="600"
                      className="pointer-events-none drop-shadow-md"
                    >
                      {field.code}
                    </text>
                    <text
                      x={centroidX}
                      y={centroidY + 14}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.85)"
                      fontSize="9.5"
                      className="pointer-events-none font-mono"
                    >
                      {activeLayer === 'ndvi'
                        ? `NDVI ${field.ndviMean}`
                        : activeLayer === 'moisture'
                        ? `${field.soilMoistureVwc}% VWC`
                        : `${field.surfaceTempC}°C`}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Layer Legend bar at bottom left */}
            <div className="absolute bottom-3 left-3 bg-stone-900/90 backdrop-blur border border-stone-800 px-3 py-1.5 rounded-lg text-[11px] flex items-center gap-3">
              <span className="text-stone-400 font-medium">
                {activeLayer === 'ndvi' && 'NDVI Spectral Range:'}
                {activeLayer === 'moisture' && 'Soil VWC %:'}
                {activeLayer === 'temperature' && 'Canopy Surface:'}
                {activeLayer === 'elevation' && 'Altitude Contours:'}
              </span>
              <div className="flex items-center gap-1.5 font-mono text-[10px]">
                {activeLayer === 'ndvi' && (
                  <>
                    <span className="w-2.5 h-2.5 rounded-sm bg-red-500/80 inline-block" /> 0.50
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/80 inline-block ml-1" /> 0.65
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/80 inline-block ml-1" /> 0.85+
                  </>
                )}
                {activeLayer === 'moisture' && (
                  <>
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/80 inline-block" /> &lt;25%
                    <span className="w-2.5 h-2.5 rounded-sm bg-sky-400/80 inline-block ml-1" /> 28%
                    <span className="w-2.5 h-2.5 rounded-sm bg-sky-600/80 inline-block ml-1" /> 34%+
                  </>
                )}
                {activeLayer === 'temperature' && (
                  <>
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/80 inline-block" /> 22°C
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/80 inline-block ml-1" /> 25°C
                    <span className="w-2.5 h-2.5 rounded-sm bg-orange-600/80 inline-block ml-1" /> 28°C+
                  </>
                )}
                {activeLayer === 'elevation' && (
                  <>
                    <span className="w-2.5 h-2.5 rounded-sm bg-stone-600 inline-block" /> 225m
                    <span className="w-2.5 h-2.5 rounded-sm bg-stone-400 inline-block ml-1" /> 270m
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Parcel Selector Pills / Tab Strip */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-stone-400 text-[11px] shrink-0 mr-1">Plots:</span>
            {fields.map((f) => (
              <button
                key={f.id}
                onClick={() => onSelectField(f.id)}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap text-xs font-medium ${
                  f.id === selectedFieldId
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800'
                }`}
              >
                {f.code} ({f.crop.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {/* Selected Field Telemetry Inspector (5 cols on large desktop) */}
        <div className="lg:col-span-5 bg-stone-900/60 border border-stone-800/90 rounded-2xl p-6 shadow-md space-y-5">
          {/* Header of Inspector */}
          <div className="flex items-start justify-between gap-3 pb-4 border-b border-stone-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span className="font-mono text-emerald-400 font-semibold">{selectedField.code}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedField.acres} Acres</span>
                <span aria-hidden="true">·</span>
                <span>Elev: {selectedField.elevationM}m</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                {selectedField.name}
              </h2>
              <div className="text-xs text-stone-300 mt-0.5">
                Crop: <strong className="text-white">{selectedField.crop}</strong> ({selectedField.variety})
              </div>
            </div>

            {/* Health status unboxed text */}
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                {selectedField.healthStatus === 'optimal' && (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Optimal Canopy</span>
                  </>
                )}
                {selectedField.healthStatus === 'moderate' && (
                  <>
                    <Activity className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400">Moderate Stress</span>
                  </>
                )}
                {selectedField.healthStatus === 'stress' && (
                  <>
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <span className="text-red-400">Deficiency Alert</span>
                  </>
                )}
              </div>
              <div className="text-[11px] text-stone-400 mt-1 font-mono tabular-nums">
                Stage: {selectedField.growthStage}
              </div>
            </div>
          </div>

          {/* Primary Telemetry Metrics Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-stone-950/60 border border-stone-800/80 p-3 rounded-xl">
              <div className="text-[11px] text-stone-400">Canopy NDVI</div>
              <div className="text-xl font-bold text-emerald-400 font-mono tabular-nums mt-0.5">
                {selectedField.ndviMean}
              </div>
              <div className="text-[10px] text-stone-400 mt-1">
                {selectedField.ndviMean >= 0.8 ? 'Dense Chlorophyll' : 'Moderate Biomass'}
              </div>
            </div>

            <div className="bg-stone-950/60 border border-stone-800/80 p-3 rounded-xl">
              <div className="text-[11px] text-stone-400">Soil Moisture VWC</div>
              <div className="text-xl font-bold text-sky-400 font-mono tabular-nums mt-0.5">
                {selectedField.soilMoistureVwc}%
              </div>
              <div className="text-[10px] text-stone-400 mt-1">
                PAW: 68% Field Cap
              </div>
            </div>

            <div className="bg-stone-950/60 border border-stone-800/80 p-3 rounded-xl">
              <div className="text-[11px] text-stone-400">Yield Forecast</div>
              <div className="text-xl font-bold text-amber-400 font-mono tabular-nums mt-0.5">
                {selectedField.expectedYieldBuPerAcre}
              </div>
              <div className="text-[10px] text-stone-400 mt-1">
                bu/acre expected
              </div>
            </div>
          </div>

          {/* Multi-Depth Soil Moisture Sensors */}
          <div className="bg-stone-950/40 border border-stone-800/70 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-200">
              <div className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                <span>Multi-Depth Soil Telemetry (Capacitance Probes)</span>
              </div>
              <span className="font-mono text-[11px] text-stone-400">Temp: {selectedField.telemetry.soilTemp}°C</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-stone-300 text-[11px] mb-1">
                  <span>10cm Surface Layer</span>
                  <span className="font-mono tabular-nums">{selectedField.telemetry.depth10cmMoisture}% VWC</span>
                </div>
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full"
                    style={{ width: `${Math.min(100, selectedField.telemetry.depth10cmMoisture * 2.5)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-stone-300 text-[11px] mb-1">
                  <span>30cm Primary Root Zone</span>
                  <span className="font-mono tabular-nums">{selectedField.telemetry.depth30cmMoisture}% VWC</span>
                </div>
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full"
                    style={{ width: `${Math.min(100, selectedField.telemetry.depth30cmMoisture * 2.5)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-stone-300 text-[11px] mb-1">
                  <span>60cm Subsoil Reserve</span>
                  <span className="font-mono tabular-nums">{selectedField.telemetry.depth60cmMoisture}% VWC</span>
                </div>
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full"
                    style={{ width: `${Math.min(100, selectedField.telemetry.depth60cmMoisture * 2.5)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Soil Chemistry Laboratory Grid */}
          <div className="bg-stone-950/40 border border-stone-800/70 p-4 rounded-xl">
            <div className="text-xs font-semibold text-stone-200 mb-2.5">
              Soil Chemistry & Macronutrient Status (Lab Spec)
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 bg-stone-900/80 rounded-lg border border-stone-800">
                <div className="text-[10px] text-stone-400">pH</div>
                <div className="text-sm font-bold text-white font-mono tabular-nums mt-0.5">
                  {selectedField.telemetry.ph}
                </div>
              </div>
              <div className="p-2 bg-stone-900/80 rounded-lg border border-stone-800">
                <div className="text-[10px] text-stone-400">Organic (SOM)</div>
                <div className="text-sm font-bold text-white font-mono tabular-nums mt-0.5">
                  {selectedField.telemetry.organicMatter}%
                </div>
              </div>
              <div className="p-2 bg-stone-900/80 rounded-lg border border-stone-800">
                <div className="text-[10px] text-stone-400">Nitrogen</div>
                <div className="text-sm font-bold text-emerald-400 font-mono tabular-nums mt-0.5">
                  {selectedField.telemetry.nitrogenPpm} ppm
                </div>
              </div>
              <div className="p-2 bg-stone-900/80 rounded-lg border border-stone-800">
                <div className="text-[10px] text-stone-400">Potassium (K)</div>
                <div className="text-sm font-bold text-white font-mono tabular-nums mt-0.5">
                  {selectedField.telemetry.potassiumPpm} ppm
                </div>
              </div>
            </div>
          </div>

          {/* Field Log Notes */}
          <div className="text-xs text-stone-400 bg-stone-900/40 p-3 rounded-xl border border-stone-800/60 leading-relaxed">
            <span className="font-semibold text-stone-300">Agronomist Field Note: </span>
            {selectedField.notes}
          </div>

          {/* Quick Context Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onOpenDoctorWithField(selectedField)}
              className="flex-1 py-2 px-3 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Diagnose Leaf / Pest</span>
            </button>
            <button
              onClick={() => onOpenAdvisorWithField(selectedField)}
              className="flex-1 py-2 px-3 text-xs font-semibold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Advisor for Plot</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
