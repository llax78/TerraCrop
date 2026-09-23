import React, { useState } from 'react';
import { FieldPlot } from '../types/farm';
import { X, Send, Sparkles, RefreshCw, Sprout, CheckCircle2 } from 'lucide-react';

interface AgronomistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedField: FieldPlot;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'advisor';
  text: string;
  recommendations?: string[];
  timestamp: string;
}

export const AgronomistDrawer: React.FC<AgronomistDrawerProps> = ({
  isOpen,
  onClose,
  selectedField,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-0',
      sender: 'advisor',
      text: `Hello! I'm your TerraCrop Certified Crop Advisor (CCA). I've loaded the active field telemetry for ${selectedField.name} (${selectedField.crop}, ${selectedField.acres} acres, soil pH ${selectedField.telemetry.ph}, moisture ${selectedField.soilMoistureVwc}% VWC). How can I assist your agronomic management today?`,
      recommendations: [
        'Variable-rate side-dress Nitrogen recommendation based on silking stage',
        'Foliar fungicide timing based on upcoming humidity and Delta-T',
        'Cover crop selection for organic matter improvement post-harvest'
      ],
      timestamp: 'Now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || inputValue.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          fieldData: {
            name: selectedField.name,
            crop: selectedField.crop,
            variety: selectedField.variety,
            growthStage: selectedField.growthStage,
            soilMoisture: `${selectedField.soilMoistureVwc}%`,
            ndvi: selectedField.ndviMean,
            ph: selectedField.telemetry.ph,
            organicMatter: `${selectedField.telemetry.organicMatter}%`,
            nitrogen: `${selectedField.telemetry.nitrogenPpm} ppm`,
          },
        }),
      });

      if (!res.ok) throw new Error('API failed');

      const data = await res.json();
      const advisorMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'advisor',
        text: data.answer,
        recommendations: data.recommendations,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, advisorMsg]);
    } catch (err) {
      console.error('Advisor error:', err);
      const fallbackMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'advisor',
        text: `Based on ${selectedField.name}'s current soil test (pH ${selectedField.telemetry.ph}, SOM ${selectedField.telemetry.organicMatter}%), optimize Nitrogen timing for the ${selectedField.growthStage} stage using 4R Nutrient Stewardship (Right Source, Right Rate, Right Time, Right Place). Maintain soil moisture above 26% VWC during pollination.`,
        recommendations: [
          'Split nitrogen application: 40% pre-plant, 60% in-season side-dress.',
          'Add urease inhibitor if broadcasting dry urea during warm dry weather.',
          'Verify that Delta-T is between 2°C and 8°C prior to tank-mix application.'
        ],
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-stone-950 border-l border-stone-800 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-stone-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>TerraCrop Agronomist AI</span>
                <span className="text-[10px] text-emerald-400 font-mono">CCA Certified</span>
              </div>
              <div className="text-[11px] text-stone-400">
                Grounded to: <strong className="text-stone-200">{selectedField.code} · {selectedField.name}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-stone-900 border border-stone-800 text-stone-200 rounded-bl-none shadow-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-stone-800/80 space-y-1.5">
                    <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">
                      Key Recommendations:
                    </div>
                    {msg.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-stone-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-stone-500 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-stone-400 p-3 bg-stone-900/60 rounded-xl border border-stone-800 w-fit">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>Analyzing agronomic database & soil telemetry...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="p-3 border-t border-stone-800/80 bg-stone-900/40">
          <div className="text-[11px] text-stone-400 mb-1.5">Suggested Questions:</div>
          <div className="flex flex-wrap gap-1.5">
            {[
              'Side-dress N rate for corn silking',
              'Delta-T window for spraying',
              'Soil compaction treatment',
              'Expected yield vs fertilizer ROI',
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="px-2.5 py-1 text-[11px] bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-lg text-stone-300 hover:text-white transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-stone-800 bg-stone-950 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about fertilizer NPK, irrigation, pest thresholds..."
            className="flex-1 px-3.5 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xl text-white placeholder:text-stone-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-stone-950 font-semibold transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
