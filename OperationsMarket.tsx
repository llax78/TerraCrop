import React, { useState } from 'react';
import { CommodityPrice, MachineryItem, FarmTask } from '../types/farm';
import { DollarSign, TrendingUp, TrendingDown, Tractor, CheckSquare, Calculator, Fuel, Wrench, ShieldCheck, Check } from 'lucide-react';

interface OperationsMarketProps {
  commodities: CommodityPrice[];
  machinery: MachineryItem[];
  tasks: FarmTask[];
  onToggleTask: (id: string) => void;
}

export const OperationsMarket: React.FC<OperationsMarketProps> = ({
  commodities,
  machinery,
  tasks,
  onToggleTask,
}) => {
  // Margin Calculator State
  const [cropType, setCropType] = useState<'Corn' | 'Soybeans' | 'Wheat'>('Corn');
  const [expectedYield, setExpectedYield] = useState<number>(215); // bu/ac
  const [marketPrice, setMarketPrice] = useState<number>(4.48); // $/bu
  const [seedCost, setSeedCost] = useState<number>(115); // $/ac
  const [fertilizerCost, setFertilizerCost] = useState<number>(165); // $/ac
  const [chemicalCost, setChemicalCost] = useState<number>(55); // $/ac
  const [fuelMachineryCost, setFuelMachineryCost] = useState<number>(75); // $/ac
  const [landRentInsurance, setLandRentInsurance] = useState<number>(220); // $/ac

  // Calculations
  const totalCostPerAcre = seedCost + fertilizerCost + chemicalCost + fuelMachineryCost + landRentInsurance;
  const grossRevenuePerAcre = expectedYield * marketPrice;
  const netMarginPerAcre = grossRevenuePerAcre - totalCostPerAcre;
  const breakEvenYield = (totalCostPerAcre / marketPrice).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner: CBOT Grain & Input Markets Board */}
      <div className="bg-stone-900/60 border border-stone-800/90 rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium uppercase tracking-wide">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Chicago Board of Trade (CBOT) & Input Cash Markets</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
              Agricultural Commodity Quotes & Input Costs
            </h1>
          </div>
          <div className="text-xs text-stone-400 font-mono">
            Delayed 10 min · CME Group Feed
          </div>
        </div>

        {/* Commodity Ticker Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          {commodities.map((item) => {
            const isPositive = item.change >= 0;
            return (
              <div
                key={item.symbol}
                className="p-3.5 bg-stone-950/70 rounded-xl border border-stone-800/80 hover:border-stone-700 transition-colors"
              >
                <div className="flex items-center justify-between text-[11px] text-stone-400">
                  <span className="font-mono font-semibold text-stone-200">{item.symbol}</span>
                  <span className="text-[10px] text-stone-500">{item.contract}</span>
                </div>
                <div className="text-lg font-bold text-white font-mono tabular-nums mt-1">
                  ${item.price.toFixed(2)}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono tabular-nums mt-1">
                  {isPositive ? (
                    <>
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">+{item.changePct}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-3 h-3 text-rose-400" />
                      <span className="text-rose-400">{item.changePct}%</span>
                    </>
                  )}
                  <span className="text-stone-500 text-[10px] ml-auto">{item.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Gross Margin Calculator + Machinery & Task Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Crop Margin & Break-Even Economic Calculator (6 cols) */}
        <div className="lg:col-span-6 bg-stone-900/60 border border-stone-800/90 rounded-2xl p-6 shadow-md space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Per-Acre Enterprise Gross Margin Simulator</span>
            </h2>
            <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800 text-xs">
              {(['Corn', 'Soybeans', 'Wheat'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCropType(c);
                    if (c === 'Corn') {
                      setExpectedYield(215);
                      setMarketPrice(4.48);
                    } else if (c === 'Soybeans') {
                      setExpectedYield(62);
                      setMarketPrice(11.24);
                      setFertilizerCost(85);
                    } else {
                      setExpectedYield(80);
                      setMarketPrice(5.86);
                      setFertilizerCost(95);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    cropType === c ? 'bg-emerald-600 text-white font-medium' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders & Inputs */}
          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-stone-300">Expected Field Yield:</span>
                <span className="font-mono font-bold text-white">{expectedYield} bu/acre</span>
              </div>
              <input
                type="range"
                min={cropType === 'Soybeans' ? 30 : 120}
                max={cropType === 'Soybeans' ? 90 : 280}
                value={expectedYield}
                onChange={(e) => setExpectedYield(Number(e.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-stone-300">Target Cash Sale Price:</span>
                <span className="font-mono font-bold text-emerald-400">${marketPrice.toFixed(2)} /bu</span>
              </div>
              <input
                type="range"
                min={cropType === 'Soybeans' ? 8.0 : 3.0}
                max={cropType === 'Soybeans' ? 15.0 : 7.5}
                step={0.05}
                value={marketPrice}
                onChange={(e) => setMarketPrice(parseFloat(e.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">Seed ($/ac)</label>
                <input
                  type="number"
                  value={seedCost}
                  onChange={(e) => setSeedCost(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-stone-950 border border-stone-800 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">Fertilizer N-P-K ($/ac)</label>
                <input
                  type="number"
                  value={fertilizerCost}
                  onChange={(e) => setFertilizerCost(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-stone-950 border border-stone-800 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">Chemicals & Fungicide ($/ac)</label>
                <input
                  type="number"
                  value={chemicalCost}
                  onChange={(e) => setChemicalCost(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-stone-950 border border-stone-800 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">Fuel & Machine Pass ($/ac)</label>
                <input
                  type="number"
                  value={fuelMachineryCost}
                  onChange={(e) => setFuelMachineryCost(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-stone-950 border border-stone-800 rounded-lg text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Economic Output Summary Card */}
          <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-[10px] text-stone-400">Total Input Cost</div>
                <div className="text-base font-bold text-stone-200 font-mono tabular-nums mt-0.5">
                  ${totalCostPerAcre}/ac
                </div>
              </div>
              <div>
                <div className="text-[10px] text-stone-400">Break-Even Yield</div>
                <div className="text-base font-bold text-amber-400 font-mono tabular-nums mt-0.5">
                  {breakEvenYield} bu
                </div>
              </div>
              <div>
                <div className="text-[10px] text-stone-400">Net Margin / Acre</div>
                <div className={`text-base font-bold font-mono tabular-nums mt-0.5 ${
                  netMarginPerAcre >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  ${netMarginPerAcre.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs">
              <span className="text-stone-400">Projected 320-Acre Field Profit:</span>
              <span className={`font-mono font-bold text-sm ${netMarginPerAcre >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${(netMarginPerAcre * 320).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Machinery Fleet & Task Execution Log (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Machinery Fleet Telematics */}
          <div className="bg-stone-900/60 border border-stone-800/90 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Tractor className="w-4 h-4 text-emerald-400" />
                <span>Machinery Fleet Telematics (ISOBUS / CAN-Bus)</span>
              </h2>
              <span className="text-xs text-stone-400 font-mono">RTK Connected</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {machinery.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 bg-stone-950/60 rounded-xl border border-stone-800/80 text-xs space-y-1.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-white">{m.name}</div>
                      <div className="text-[11px] text-stone-400">{m.model}</div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      m.status === 'operating'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : m.status === 'standby'
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {m.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-[11px] text-stone-300">
                    Location: <span className="text-white">{m.currentField}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] border-t border-stone-800/60 text-stone-400">
                    <div className="flex items-center gap-1">
                      <Fuel className="w-3 h-3 text-amber-400" />
                      <span className="font-mono">{m.fuelPct}% Fuel</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wrench className="w-3 h-3 text-stone-400" />
                      <span className="font-mono">{m.engineHours} hrs</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Farm Fieldwork Tasks Log */}
          <div className="bg-stone-900/60 border border-stone-800/90 rounded-2xl p-6 shadow-md space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span>Agronomic Operations & Scouting Task Log</span>
              </h2>
              <span className="text-xs text-stone-400">
                {tasks.filter(t => t.completed).length} of {tasks.length} Done
              </span>
            </div>

            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`cursor-pointer p-3 rounded-xl border transition-colors flex items-start gap-3 text-xs ${
                    task.completed
                      ? 'bg-stone-950/30 border-stone-800/50 opacity-60'
                      : 'bg-stone-950/70 border-stone-800/90 hover:border-stone-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center transition-colors ${
                    task.completed ? 'bg-emerald-500 border-emerald-500 text-stone-950' : 'border-stone-600'
                  }`}>
                    {task.completed && <Check className="w-3 h-3" />}
                  </div>

                  <div className="flex-1">
                    <div className={`font-medium ${task.completed ? 'line-through text-stone-500' : 'text-stone-200'}`}>
                      {task.title}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5 flex items-center gap-2">
                      <span>{task.field}</span>
                      <span>·</span>
                      <span>{task.assignedTo}</span>
                      <span>·</span>
                      <span className="font-mono text-emerald-400">{task.dueDate}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-semibold uppercase ${
                    task.priority === 'high' ? 'text-rose-400' : 'text-stone-400'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
