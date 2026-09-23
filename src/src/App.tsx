import React, { useState } from 'react';
import { Header } from './components/Header';
import { FieldMap } from './components/FieldMap';
import { WeatherStation } from './components/WeatherStation';
import { CropDoctor } from './components/CropDoctor';
import { IrrigationManager } from './components/IrrigationManager';
import { OperationsMarket } from './components/OperationsMarket';
import { AgronomistDrawer } from './components/AgronomistDrawer';
import { NewFieldModal } from './components/NewFieldModal';
import {
  INITIAL_FIELDS,
  MOCK_WEATHER_FORECAST,
  INITIAL_IRRIGATION_ZONES,
  COMMODITY_PRICES,
  MACHINERY_FLEET,
  FARM_TASKS,
} from './data/mockData';
import { FieldPlot } from './types/farm';

export default function App() {
  const [activeTab, setActiveTab] = useState<'fields' | 'weather' | 'doctor' | 'irrigation' | 'operations'>('fields');
  const [fields, setFields] = useState<FieldPlot[]>(INITIAL_FIELDS);
  const [selectedFieldId, setSelectedFieldId] = useState<string>(INITIAL_FIELDS[0].id);
  const [irrigationZones, setIrrigationZones] = useState(INITIAL_IRRIGATION_ZONES);
  const [machinery] = useState(MACHINERY_FLEET);
  const [tasks, setTasks] = useState(FARM_TASKS);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isNewFieldOpen, setIsNewFieldOpen] = useState(false);

  const selectedField = fields.find((f) => f.id === selectedFieldId) || fields[0];

  const handleToggleZone = (zoneId: string) => {
    setIrrigationZones((prev) =>
      prev.map((z) =>
        z.id === zoneId
          ? { ...z, status: z.status === 'active' ? 'idle' : 'active' }
          : z
      )
    );
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddField = (newField: FieldPlot) => {
    setFields((prev) => [...prev, newField]);
    setSelectedFieldId(newField.id);
  };

  const handleOpenAdvisorWithField = (field: FieldPlot) => {
    setSelectedFieldId(field.id);
    setIsAdvisorOpen(true);
  };

  const handleOpenDoctorWithField = (field: FieldPlot) => {
    setSelectedFieldId(field.id);
    setActiveTab('doctor');
  };

  const totalAcres = fields.reduce((sum, f) => sum + f.acres, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f0c] text-stone-100 font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Bar Contract Compliant Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAdvisor={() => setIsAdvisorOpen(true)}
        onOpenNewField={() => setIsNewFieldOpen(true)}
        totalAcres={totalAcres}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {activeTab === 'fields' && (
          <FieldMap
            fields={fields}
            selectedFieldId={selectedFieldId}
            onSelectField={setSelectedFieldId}
            onOpenAdvisorWithField={handleOpenAdvisorWithField}
            onOpenDoctorWithField={handleOpenDoctorWithField}
          />
        )}

        {activeTab === 'weather' && (
          <WeatherStation forecast={MOCK_WEATHER_FORECAST} />
        )}

        {activeTab === 'doctor' && (
          <CropDoctor fields={fields} initialField={selectedField} />
        )}

        {activeTab === 'irrigation' && (
          <IrrigationManager
            zones={irrigationZones}
            onToggleZone={handleToggleZone}
          />
        )}

        {activeTab === 'operations' && (
          <OperationsMarket
            commodities={COMMODITY_PRICES}
            machinery={machinery}
            tasks={tasks}
            onToggleTask={handleToggleTask}
          />
        )}
      </main>

      {/* Agronomist AI Drawer */}
      <AgronomistDrawer
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        selectedField={selectedField}
      />

      {/* Add New Field Modal */}
      <NewFieldModal
        isOpen={isNewFieldOpen}
        onClose={() => setIsNewFieldOpen(false)}
        onAddField={handleAddField}
      />

      {/* Clean Uncluttered Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-950/80 py-6 px-6 mt-auto text-xs text-stone-500">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-stone-400">
            <span className="font-semibold text-stone-200">TerraCrop Precision Ag</span>
            <span>·</span>
            <span>GreenValley Agronomy Management Unit</span>
            <span>·</span>
            <span className="font-mono tabular-nums">{totalAcres.toLocaleString()} Total Managed Acres</span>
          </div>

          <div className="flex items-center gap-4 text-stone-500 text-[11px]">
            <span>Sensors: Active</span>
            <span>·</span>
            <span>NDVI Engine: Online</span>
            <span>·</span>
            <span>ISOBUS CAN-Bus: Synced</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
