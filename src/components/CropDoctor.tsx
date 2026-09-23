import React, { useState } from 'react';
import { SAMPLE_CROP_CASES } from '../data/mockData';
import { DiagnosticResult, FieldPlot } from '../types/farm';
import { ShieldCheck, AlertCircle, Upload, Sparkles, Stethoscope, RefreshCw, Leaf, Bug, Info } from 'lucide-react';

interface CropDoctorProps {
  fields: FieldPlot[];
  initialField?: FieldPlot;
}

export const CropDoctor: React.FC<CropDoctorProps> = ({ fields, initialField }) => {
  const [selectedCrop, setSelectedCrop] = useState<string>(initialField ? initialField.crop : 'Corn (Field Grain)');
  const [growthStage, setGrowthStage] = useState<string>(initialField ? initialField.growthStage : 'R1 Silking / Flowering');
  const [symptoms, setSymptoms] = useState<string>(
    'Cigar-shaped elliptical lesions observed on lower leaves with grayish-green fungal sporulation developing under prolonged high leaf wetness (>6 hours).'
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    '/src/assets/images/crop_disease_sample_1790161666405.jpg'
  );
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  // Handle Preset Case Selection
  const handleSelectPreset = (presetId: string) => {
    const preset = SAMPLE_CROP_CASES.find((c) => c.id === presetId);
    if (!preset) return;
    setSelectedCrop(preset.crop);
    setGrowthStage(preset.stage);
    setSymptoms(preset.symptoms);
    if (presetId === 'case-corn-nclb') {
      setImagePreview('/src/assets/images/crop_disease_sample_1790161666405.jpg');
    }
  };

  // Handle File Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run AI Diagnostic
  const handleRunDiagnosis = async () => {
    setIsDiagnosing(true);
    try {
      const res = await fetch('/api/gemini/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: selectedCrop,
          growthStage: growthStage,
          symptoms: symptoms,
          imageBase64: imagePreview,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Diagnostic error:', err);
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-stone-900/60 border border-stone-800/90 rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium uppercase tracking-wide">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Plant Pathology & Agronomic Epidemiology Diagnostic Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              AI Crop Doctor & Foliar Disease Laboratory
            </h1>
            <p className="mt-1 text-sm text-stone-300">
              Multimodal pathogen identification, FRAC code rotational fungicide recommendations, and organic biocontrol protocols.
            </p>
          </div>

          <div className="text-xs text-stone-400">
            Powered by <strong className="text-emerald-400">Gemini 3.8 Intelligence</strong>
          </div>
        </div>

        {/* Preset Sample Cases Strip */}
        <div className="mt-4">
          <div className="text-xs text-stone-400 mb-2 font-medium">
            Quick Symptom Presets (Click to load clinical scenario):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {SAMPLE_CROP_CASES.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className="text-left p-3 rounded-xl bg-stone-950/60 hover:bg-stone-900 border border-stone-800/80 hover:border-emerald-500/40 transition-all text-xs group"
              >
                <div className="font-semibold text-stone-200 group-hover:text-emerald-400 flex items-center justify-between">
                  <span>{preset.name}</span>
                </div>
                <div className="text-[11px] text-stone-400 mt-1 line-clamp-1">
                  {preset.suspected}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Diagnostic Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Form & Leaf Image (5 cols) */}
        <div className="lg:col-span-5 bg-stone-900/60 border border-stone-800/90 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Diagnostic Sample Intake</span>
            </h2>
            <span className="text-xs text-stone-400 font-mono">ID: CLINIC-08</span>
          </div>

          {/* Leaf Photographic Asset */}
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-2">
              Foliar Leaf Macro Sample
            </label>
            <div className="relative rounded-xl overflow-hidden border border-stone-800 bg-stone-950/80 aspect-[4/3] group">
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Foliar disease sample leaf"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer px-3 py-1.5 bg-stone-900/90 text-xs font-medium text-white rounded-lg border border-stone-700 hover:bg-stone-800 flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Replace Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                  <Upload className="w-8 h-8 text-stone-500 mb-2" />
                  <span className="text-xs font-medium text-stone-300">Upload leaf photo</span>
                  <span className="text-[11px] text-stone-500 mt-1">JPEG or PNG, macro focus</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Crop Selector */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Crop Species
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="Corn (Field Grain)">Corn (Field Maize)</option>
                <option value="Soybeans (Non-GMO)">Soybeans</option>
                <option value="Hard Red Winter Wheat">Winter Wheat</option>
                <option value="Honeycrisp & Gala Apples">Apples (Orchard)</option>
                <option value="Cotton No. 2">Upland Cotton</option>
                <option value="Alfalfa (High Protein)">Alfalfa Legume</option>
                <option value="Tomatoes (Processing)">Solanaceous Tomatoes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Phenological Stage
              </label>
              <select
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="Vegetative (V4-V8)">Vegetative Early (V4-V8)</option>
                <option value="Rapid Vegetative (V10-V14)">Rapid Vegetative (V10-V14)</option>
                <option value="R1 Silking / Flowering">R1 Silking / Flowering</option>
                <option value="R3-R4 Pod / Grain Fill">R3-R4 Pod / Grain Fill</option>
                <option value="Late Maturation / Ripening">Late Maturation / Ripening</option>
              </select>
            </div>
          </div>

          {/* Symptoms Description */}
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Observed Symptoms & Field Patterns
            </label>
            <textarea
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe lesion shape, color, canopy height, leaf veins, or pustules..."
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none placeholder:text-stone-600 resize-none"
            />
          </div>

          {/* Quick Symptom Chips helper */}
          <div>
            <span className="text-[11px] text-stone-400">Append symptom: </span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {[
                'Cigar lesions',
                'Interveinal chlorosis',
                'Orange rust pustules',
                'Powdery mildew',
                'Stalk lodging',
                'Ear rot molds',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setSymptoms((prev) => `${prev} ${chip}.`)}
                  className="px-2 py-0.5 text-[11px] bg-stone-950 text-stone-300 hover:text-white border border-stone-800 rounded hover:border-stone-700 transition-colors"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleRunDiagnosis}
            disabled={isDiagnosing}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-stone-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-950/40"
          >
            {isDiagnosing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Sequencing Pathogen via Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run AI Pathologist Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Diagnostic Laboratory Report (7 cols) */}
        <div className="lg:col-span-7 bg-stone-900/60 border border-stone-800/90 rounded-2xl p-6 shadow-md space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-400" />
              <span>Plant Pathology Laboratory Report</span>
            </h2>
            <div className="text-xs text-stone-400">
              Reference: <span className="font-mono text-stone-300">ISO 17025 Agronomic Spec</span>
            </div>
          </div>

          {result ? (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Primary Diagnosis Header Card */}
              <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-xs text-emerald-400 font-mono font-medium">
                      Pathogen: {result.pathogen}
                    </div>
                    <h3 className="text-xl font-bold text-white mt-0.5">
                      {result.diseaseName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <div className="text-[10px] text-stone-400">AI Confidence</div>
                      <div className="text-lg font-bold text-emerald-400 font-mono tabular-nums">
                        {result.confidenceScore}%
                      </div>
                    </div>
                    <div className="border-l border-stone-800 pl-3">
                      <div className="text-[10px] text-stone-400">Severity Rating</div>
                      <div className="text-xs font-semibold text-amber-400 mt-1">
                        {result.severityLevel}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed pt-2 border-t border-stone-800/60">
                  {result.description}
                </p>

                {/* Microclimate Link */}
                <div className="p-2.5 rounded-lg bg-stone-900/90 border border-stone-800 text-xs text-stone-400 flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-stone-300">Microclimate Vector: </strong>
                    {result.environmentalCorrelation}
                  </span>
                </div>
              </div>

              {/* Immediate Emergency Action Plan */}
              <div>
                <h4 className="text-xs font-semibold text-stone-200 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Immediate Containment Steps</span>
                </h4>
                <ul className="space-y-2">
                  {result.immediateActions.map((action, i) => (
                    <li
                      key={i}
                      className="p-2.5 rounded-lg bg-stone-950/40 border border-stone-800/70 text-xs text-stone-300 flex items-start gap-2"
                    >
                      <span className="font-mono text-emerald-400 font-semibold">{i + 1}.</span>
                      <span className="flex-1 leading-relaxed">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Remedies: Biological vs Chemical Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Biological Plan */}
                <div className="p-4 rounded-xl bg-stone-950/50 border border-stone-800/80 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <Leaf className="w-3.5 h-3.5" />
                    <span>Biological & Organic Control</span>
                  </div>
                  <ul className="space-y-2 text-xs text-stone-300">
                    {result.remedies.biological.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                        <span className="text-emerald-500 shrink-0">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Chemical Plan */}
                <div className="p-4 rounded-xl bg-stone-950/50 border border-stone-800/80 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
                    <Bug className="w-3.5 h-3.5" />
                    <span>Synthetic & FRAC Chemistry</span>
                  </div>
                  <ul className="space-y-2 text-xs text-stone-300">
                    {result.remedies.chemical.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                        <span className="text-sky-400 shrink-0">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Preventative Cultural Measures */}
              <div className="p-4 rounded-xl bg-stone-950/40 border border-stone-800/60">
                <div className="text-xs font-semibold text-stone-200 mb-2">
                  Long-Term Agronomic Sanitation & Resistance Strategy
                </div>
                <ul className="space-y-1.5 text-xs text-stone-400">
                  {result.preventativeMeasures.map((measure, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-stone-500 font-mono">·</span>
                      <span className="leading-relaxed">{measure}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center text-stone-500 mx-auto">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-base font-semibold text-white">No Diagnostic Run Yet</h3>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Select one of the sample cases above or upload your own leaf/crop photograph and press "Run AI Pathologist Analysis".
              </p>
              <button
                onClick={handleRunDiagnosis}
                className="mt-2 px-4 py-2 text-xs font-semibold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze Sample Case (Corn NCLB)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
