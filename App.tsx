
import React, { useState, useEffect, useRef } from 'react';
import { ThoughtEntry, DisagreementMode, ReflectionType } from './types';
import { MODES, REFLECTION_LABELS } from './constants';
import ConfidenceSlider from './components/ConfidenceSlider';
import ModeSelector from './components/ModeSelector';
import ThoughtCard from './components/ThoughtCard';
import { generatePushback } from './services/geminiService';

const App: React.FC = () => {
  const [history, setHistory] = useState<ThoughtEntry[]>([]);
  const [currentThought, setCurrentThought] = useState('');
  const [confidence, setConfidence] = useState(70);
  const [mode, setMode] = useState<DisagreementMode>('logical');
  const [loading, setLoading] = useState(false);
  const [activeEntry, setActiveEntry] = useState<ThoughtEntry | null>(null);
  
  const [reflectionNote, setReflectionNote] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('friction_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('friction_history', JSON.stringify(history));
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentThought.trim() || loading) return;

    setLoading(true);
    const modeConfig = MODES.find(m => m.id === mode)!;
    
    const responseBullets = await generatePushback(
      currentThought,
      confidence,
      modeConfig,
      history
    );

    const newEntry: ThoughtEntry = {
      id: crypto.randomUUID(),
      text: currentThought,
      confidence,
      mode,
      timestamp: Date.now(),
      response: responseBullets
    };

    setActiveEntry(newEntry);
    setCurrentThought('');
    setLoading(false);
  };

  const handleReflection = (type: ReflectionType) => {
    if (!activeEntry) return;

    const completedEntry: ThoughtEntry = {
      ...activeEntry,
      reflection: type,
      reflectionNote: reflectionNote
    };

    setHistory([completedEntry, ...history]);
    setActiveEntry(null);
    setReflectionNote('');
    
    // Scroll to top of history
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-4 py-12 md:py-24 space-y-16">
      {/* Header */}
      <header className="border-b border-neutral-800 pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase italic">Friction</h1>
          <p className="text-neutral-500 text-xs font-bold tracking-[0.2em] uppercase mt-1">
            Cognitive Sparring Partner
          </p>
        </div>
        <div className="text-[10px] text-neutral-600 font-mono text-right">
          STATUS: OPERATIONAL<br />
          MEMORY: {history.length} NODES
        </div>
      </header>

      {/* Main Action Area */}
      {!activeEntry ? (
        <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-4">
              <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">
                State your assertion
              </label>
              <textarea
                value={currentThought}
                onChange={(e) => setCurrentThought(e.target.value)}
                placeholder="I should quit my job."
                className="w-full bg-transparent border-b-2 border-neutral-800 focus:border-white outline-none text-2xl md:text-3xl font-bold py-4 resize-none transition-colors h-32"
                maxLength={200}
                required
              />
              <div className="flex justify-between text-[10px] text-neutral-600 font-bold uppercase">
                <span>Force clarity. No essays.</span>
                <span>{currentThought.length}/200</span>
              </div>
            </div>

            <ConfidenceSlider value={confidence} onChange={setConfidence} />

            <div className="space-y-4">
              <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">
                Select Disagreement Mode
              </label>
              <ModeSelector selectedMode={mode} onSelect={setMode} />
            </div>

            <button
              type="submit"
              disabled={loading || !currentThought.trim()}
              className={`w-full py-6 font-bold uppercase tracking-widest text-lg transition-all border-2 ${
                loading 
                  ? 'border-neutral-800 text-neutral-700' 
                  : 'border-white text-white hover:bg-white hover:text-black'
              }`}
            >
              {loading ? 'Analyzing Flaws...' : 'Challenge Thought'}
            </button>
          </form>
        </section>
      ) : (
        /* Response / Reflection Area */
        <section className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
          <div className="border-2 border-white p-8 space-y-8 bg-neutral-900">
            <div className="space-y-2">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                The Friction:
              </span>
              <h2 className="text-2xl font-bold leading-tight">"{activeEntry.text}"</h2>
            </div>

            <ul className="space-y-6">
              {activeEntry.response?.map((bullet, idx) => (
                <li key={idx} className="flex gap-4 items-start group">
                  <span className="text-neutral-600 font-bold mt-1 text-sm">0{idx + 1}</span>
                  <p className="text-lg leading-snug text-neutral-200 group-hover:text-white transition-colors">
                    {bullet}
                  </p>
                </li>
              ))}
            </ul>

            <div className="pt-8 border-t border-neutral-800 space-y-6">
              <div className="space-y-4">
                <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">
                  Compulsory Response
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(['disagree', 'exposed', 'need-evidence', 'changing-mind'] as ReflectionType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => handleReflection(type)}
                      className="p-4 border border-neutral-700 text-left hover:bg-white hover:text-black transition-all group"
                    >
                      <span className="text-xs font-bold uppercase">{REFLECTION_LABELS[type]}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-neutral-600 font-bold">Optional Nuance</label>
                <input
                  type="text"
                  value={reflectionNote}
                  onChange={(e) => setReflectionNote(e.target.value)}
                  placeholder="Elaborate briefly..."
                  className="w-full bg-neutral-950 border border-neutral-800 p-3 text-sm focus:border-neutral-500 outline-none"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* History */}
      {history.length > 0 && (
        <section className="space-y-8 pt-12 border-t border-neutral-900">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">
              Cognitive History
            </h2>
            <button 
              onClick={() => {
                if(confirm("Clear memory? This cannot be undone.")) {
                  setHistory([]);
                  localStorage.removeItem('friction_history');
                }
              }}
              className="text-[10px] text-neutral-700 hover:text-red-500 font-bold uppercase"
            >
              Purge Database
            </button>
          </div>
          <div className="space-y-8">
            {history.map((entry) => (
              <ThoughtCard key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      )}

      {/* Footer / Meta */}
      <footer className="pt-16 pb-8 text-center">
        <p className="text-[10px] text-neutral-700 font-bold tracking-[0.2em] uppercase">
          Friction is not therapy. Friction is not a chatbot.<br />
          Friction is intellectual resistance.
        </p>
      </footer>
    </div>
  );
};

export default App;
