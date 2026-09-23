export type VegetationLayer = 'ndvi' | 'moisture' | 'temperature' | 'elevation';

export interface SoilTelemetry {
  depth10cmMoisture: number; // % VWC (Volumetric Water Content)
  depth30cmMoisture: number;
  depth60cmMoisture: number;
  soilTemp: number; // °C
  ph: number;
  organicMatter: number; // %
  cec: number; // meq/100g
  nitrogenPpm: number;
  phosphorusPpm: number;
  potassiumPpm: number;
}

export interface FieldPlot {
  id: string;
  name: string;
  code: string;
  crop: string;
  variety: string;
  acres: number;
  shape: 'polygon' | 'pivot' | 'rectangle';
  coordinates: { x: number; y: number }[]; // for SVG map rendering
  centerRadius?: number; // for circular pivot
  plantedDate: string;
  expectedHarvest: string;
  growthStage: string;
  healthStatus: 'optimal' | 'moderate' | 'stress' | 'alert';
  ndviMean: number; // e.g. 0.82
  soilMoistureVwc: number; // % e.g. 28.4%
  surfaceTempC: number; // e.g. 24.2°C
  elevationM: number;
  expectedYieldBuPerAcre: number;
  telemetry: SoilTelemetry;
  notes: string;
}

export interface WeatherDay {
  date: string;
  dayName: string;
  tempHigh: number;
  tempLow: number;
  condition: 'sunny' | 'partly_cloudy' | 'rain' | 'thunderstorm' | 'windy';
  precipChance: number;
  precipMm: number;
  windSpeedKmh: number;
  windDirection: string;
  humidityPct: number;
  deltaT: number; // °C
  spraySuitability: 'optimal' | 'marginal' | 'unsuitable';
  et0: number; // mm/day
  gddAccumulated: number;
}

export interface IrrigationZone {
  id: string;
  name: string;
  fieldId: string;
  fieldName: string;
  type: 'Center Pivot' | 'Subsurface Drip' | 'Variable Rate Gun';
  status: 'active' | 'idle' | 'scheduled';
  applicationRateMmPerHour: number;
  targetMoisturePct: number;
  currentMoisturePct: number;
  durationMinutes: number;
  totalDeliveredM3: number;
  efficiencyRatingPct: number;
}

export interface CommodityPrice {
  symbol: string;
  name: string;
  contract: string;
  price: number;
  unit: string;
  change: number;
  changePct: number;
  high: number;
  low: number;
  volume: string;
}

export interface MachineryItem {
  id: string;
  name: string;
  model: string;
  category: 'Tractor' | 'Combine Harvester' | 'Sprayer' | 'Planter';
  status: 'operating' | 'standby' | 'maintenance';
  operator: string;
  currentField: string;
  fuelPct: number;
  engineHours: number;
  gpsAccuracy: string;
}

export interface FarmTask {
  id: string;
  title: string;
  field: string;
  priority: 'high' | 'medium' | 'low';
  assignedTo: string;
  dueDate: string;
  completed: boolean;
  type: 'Scouting' | 'Spraying' | 'Irrigation' | 'Fertilization' | 'Harvesting';
}

export interface DiagnosticResult {
  pathogen: string;
  diseaseName: string;
  affectedPart: string;
  severityLevel: string;
  confidenceScore: number;
  description: string;
  immediateActions: string[];
  remedies: {
    biological: string[];
    chemical: string[];
  };
  preventativeMeasures: string[];
  environmentalCorrelation: string;
}
