import React, { useState } from 'react';
import { FieldPlot } from '../types/farm';
import { X, Sprout, Plus } from 'lucide-react';

interface NewFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddField: (newField: FieldPlot) => void;
}

export const NewFieldModal: React.FC<NewFieldModalProps> = ({
  isOpen,
  onClose,
  onAddField,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [crop, setCrop] = useState('Corn (Field Grain)');
  const [variety, setVariety] = useState('Pioneer P1197AM');
  const [acres, setAcres] = useState(160);
  const [shape, setShape] = useState<'rectangle' | 'pivot' | 'polygon'>('rectangle');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newField: FieldPlot = {
      id: `f-${Date.now()}`,
      name: name.trim(),
      code: code.trim() || `FLD-${Math.floor(10 + Math.random() * 90)}`,
      crop,
      variety: variety.trim() || 'Standard Commercial Hybrid',
      acres: Number(acres),
      shape,
      coordinates:
        shape === 'pivot'
          ? [{ x: 550, y: 180 }]
          : [
              { x: 520, y: 160 },
              { x: 680, y: 160 },
              { x: 680, y: 280 },
              { x: 520, y: 280 },
            ],
      centerRadius: shape === 'pivot' ? 80 : undefined,
      plantedDate: '2026-05-10',
      expectedHarvest: '2026-10-25',
      growthStage: 'V4 Early Vegetative',
      healthStatus: 'optimal',
      ndviMean: 0.76,
      soilMoistureVwc: 29.8,
      surfaceTempC: 24.5,
      elevationM: 240,
      expectedYieldBuPerAcre: 195,
      telemetry: {
        depth10cmMoisture: 30.5,
        depth30cmMoisture: 29.2,
        depth60cmMoisture: 28.0,
        soilTemp: 22.0,
        ph: 6.5,
        organicMatter: 3.2,
        cec: 17.0,
        nitrogenPpm: 38,
        phosphorusPpm: 28,
        potassiumPpm: 180,
      },
      notes: notes.trim() || 'New field onboarded. Drone base calibration complete.',
    };

    onAddField(newField);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Enroll New Crop Management Zone</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-stone-300 mb-1">Field Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. West Creek Quarter"
              className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white placeholder:text-stone-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-300 mb-1">Plot Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. WC-04"
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white font-mono placeholder:text-stone-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-300 mb-1">Acreage (ac)</label>
              <input
                type="number"
                min="1"
                value={acres}
                onChange={(e) => setAcres(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-300 mb-1">Crop Type</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Corn (Field Grain)">Corn (Field Grain)</option>
                <option value="Soybeans (Non-GMO)">Soybeans</option>
                <option value="Hard Red Winter Wheat">Winter Wheat</option>
                <option value="Cotton No. 2">Cotton</option>
                <option value="Alfalfa (High Protein)">Alfalfa</option>
                <option value="Honeycrisp & Gala Apples">Apples</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-stone-300 mb-1">Field Geometry</label>
              <select
                value={shape}
                onChange={(e) => setShape(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="rectangle">Square / Rectangle</option>
                <option value="pivot">Center Pivot (Circular)</option>
                <option value="polygon">Irregular Contour</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-300 mb-1">Seed Variety / Hybrid</label>
            <input
              type="text"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              placeholder="e.g. Asgrow AG27XF0"
              className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white placeholder:text-stone-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-300 mb-1">Agronomic Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Previous crop, tillage regime, tile drainage status..."
              className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white placeholder:text-stone-600 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-3 text-stone-300 hover:bg-stone-800 rounded-lg border border-stone-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-3 bg-emerald-400 hover:bg-emerald-300 text-stone-950 font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Enroll Field</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
