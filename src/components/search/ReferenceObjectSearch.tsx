import React, { useState } from 'react';
import { usePinaka } from '../../context/PinakaContext';
import { TacticalCard } from '../common/TacticalCard';
import { SimulatedBadge } from '../common/SimulatedBadge';
import { REFERENCE_DRONES } from '../../data/mockData';
import { ReferenceDrone } from '../../types/pinaka';
import { api } from '../../services/api';
import { 
  Search, 
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  XCircle, 
  Sliders, 
  Filter, 
  Sparkles, 
  ShieldAlert, 
  Check, 
  Info,
  Radio,
  Battery,
  Zap,
  Gauge
} from 'lucide-react';

export const ReferenceObjectSearch: React.FC = () => {
  const { addEvent } = usePinaka();

  // Search filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [selectedDrone, setSelectedDrone] = useState<ReferenceDrone>(REFERENCE_DRONES[0]);
  const [verificationFeedback, setVerificationFeedback] = useState<{ [id: string]: 'confirmed' | 'rejected' | 'annotated' }>({});
  const [backendMatches, setBackendMatches] = useState<ReferenceDrone[]>(REFERENCE_DRONES);

  // Query backend search API on filter change
  React.useEffect(() => {
    api.searchReferenceDrones({
      query: searchQuery,
      color: selectedColor,
      category: selectedCategory,
      imageBase64: uploadedPreview || undefined
    })
    .then(results => {
      if (results && results.length > 0) {
        setBackendMatches(results);
        setSelectedDrone(results[0]);
      }
    })
    .catch(() => {
      // Local fallback
    });
  }, [searchQuery, selectedColor, selectedCategory, uploadedPreview]);

  // Filter drones fallback
  const filteredDrones = backendMatches.length > 0 ? backendMatches : REFERENCE_DRONES;

  // Handle mock image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedPreview(event.target?.result as string);
        // Automatically simulate match ranking
        setSelectedDrone(REFERENCE_DRONES[0]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerify = (droneId: string, status: 'confirmed' | 'rejected' | 'annotated') => {
    setVerificationFeedback(prev => ({ ...prev, [droneId]: status }));
    addEvent({
      type: 'OPERATOR_OVERRIDE',
      severity: status === 'confirmed' ? 'info' : 'warning',
      title: `Reference Match ${status.toUpperCase()}`,
      message: `Operator ${status} reference signature identification for ${selectedDrone.modelName}.`
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="tactical-glass p-3.5 rounded-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tactical font-bold text-base text-slate-100 uppercase tracking-wider">
                Reference UAV Signature & Visual Object Search
              </h2>
              <SimulatedBadge variant="compact" />
            </div>
            <p className="text-xs font-mono text-slate-400">
              Multi-Modal Visual Embeddings • ResNet-50 / CLIP Cosine Similarity • Human Verification Gating
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-cyan-400 font-bold">DATABASE:</span>
          <span className="text-slate-300">AUTHORIZED AIRFRAME REPOSITORY (124 PROFILES)</span>
        </div>
      </div>

      {/* Human Verification Mandate Alert */}
      <div className="tactical-glass p-3 rounded-lg border-l-4 border-l-cyan-400 flex items-center justify-between gap-3 bg-cyan-950/20 font-mono text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-slate-300">
            <strong className="text-cyan-300">MANDATORY PROTOCOL:</strong> Automated visual & RF signature similarity matches are algorithmic candidates. An authorized human operator must review and confirm before tactical escalation.
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 shrink-0">
          HUMAN-IN-THE-LOOP ACTIVE
        </span>
      </div>

      {/* Search Input Bar (Text, Color, Category, Image Drag-and-Drop) */}
      <div className="tactical-glass p-4 rounded-lg space-y-3 font-mono text-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Text Semantic Search (6 cols) */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, protocol (e.g. OcuSync, ELRS), model, or wingspan..."
              className="w-full pl-9 pr-3 py-2 rounded bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Color Filter (3 cols) */}
          <div className="md:col-span-3">
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full py-2 px-3 rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="all">Color: All Signatures</option>
              <option value="Black">Matte Black / Stealth</option>
              <option value="Grey">Carbon Grey</option>
              <option value="Orange">Aviation Orange Beacon</option>
              <option value="White">White / Light Polycarbonate</option>
            </select>
          </div>

          {/* Category Filter (3 cols) */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="all">Category: All Airframes</option>
              <option value="Commercial Quadcopter">Commercial Quadcopter</option>
              <option value="FPV Drone">FPV Drone</option>
              <option value="Fixed-Wing Drone">Fixed-Wing Drone</option>
              <option value="Heavy-Lift Hexacopter">Heavy-Lift Hexacopter</option>
            </select>
          </div>
        </div>

        {/* Drag and Drop Image Snapshot Search Box */}
        <div className="p-3 rounded-lg border border-dashed border-cyan-500/30 bg-slate-900/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-200 font-bold block">
                Visual Snapshot & Feature Embedding Match
              </span>
              <span className="text-slate-400 text-[11px]">
                Upload an EO/IR camera crop to query 512-dim visual embeddings against known airframe library
              </span>
            </div>
          </div>

          <label className="px-3 py-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-semibold cursor-pointer transition-all">
            <span>SELECT IMAGE SNAPSHOT</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Main Results Layout: Candidate List (Left 5 cols), Dossier Detail & Verification (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Candidate Drone Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block">
            MATCH CANDIDATES ({filteredDrones.length} AIRFRAMES FOUND)
          </span>

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredDrones.map((drone, idx) => {
              const isSelected = drone.id === selectedDrone.id;
              // Mock similarity score (e.g. 96.8% for top match)
              const simScore = Math.max(78, Math.round((98.5 - idx * 4.8) * 10) / 10);
              const verification = verificationFeedback[drone.id];

              return (
                <div
                  key={drone.id}
                  onClick={() => setSelectedDrone(drone)}
                  className={`p-3 rounded-lg tactical-glass cursor-pointer border transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={drone.image}
                      alt={drone.modelName}
                      className="w-16 h-16 rounded object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0 flex-1 font-mono text-xs">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-slate-200 truncate">
                          {drone.modelName}
                        </span>
                        <span className="text-cyan-400 font-bold text-xs shrink-0">
                          {simScore}% MATCH
                        </span>
                      </div>
                      <span className="text-slate-400 block text-[11px] truncate">
                        {drone.manufacturer} • {drone.category}
                      </span>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500">
                        <span>Span: {drone.wingspanMeters}m</span>
                        <span>•</span>
                        <span>RCS: {drone.typicalRcs} dBsm</span>
                        <span>•</span>
                        <span>{drone.rotorCount} Rotors</span>
                      </div>

                      {verification && (
                        <div className="mt-1.5">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            verification === 'confirmed'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : verification === 'rejected'
                              ? 'bg-red-950 text-red-300 border border-red-500/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          }`}>
                            OPERATOR {verification.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Airframe Detailed Dossier & Verification Action (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <TacticalCard
            title={`${selectedDrone.modelName} — Reference Dossier`}
            subtitle={`${selectedDrone.manufacturer} • ${selectedDrone.category}`}
            headerAction={
              <span className="text-xs font-mono text-emerald-400 font-bold">
                SIMILARITY: 98.5% COSINE
              </span>
            }
          >
            <div className="space-y-4 font-mono text-xs">
              {/* Drone Hero Image & Visual Signatures */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-5">
                  <img
                    src={selectedDrone.image}
                    alt={selectedDrone.modelName}
                    className="w-full h-44 object-cover rounded-lg border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  />
                  <div className="mt-1.5 text-center text-[10px] text-slate-500">
                    AUTHORIZED ARCHIVE SNAPSHOT
                  </div>
                </div>

                <div className="sm:col-span-7 space-y-2">
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {selectedDrone.description}
                  </p>
                  <div className="p-2.5 rounded bg-slate-900/70 border border-slate-800 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">VISUAL COLOR:</span>
                      <span className="text-slate-200 font-semibold">{selectedDrone.visualColor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">RF PROTOCOL:</span>
                      <span className="text-purple-300 font-semibold">{selectedDrone.rfProtocol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">THERMAL PROFILE:</span>
                      <span className="text-amber-300 font-semibold truncate">{selectedDrone.thermalProfile}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">WINGSPAN</span>
                  <span className="text-slate-200 font-bold">{selectedDrone.wingspanMeters} meters</span>
                </div>
                <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">MAX SPEED</span>
                  <span className="text-slate-200 font-bold">{selectedDrone.maxSpeedKmh} km/h</span>
                </div>
                <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">TYPICAL RCS</span>
                  <span className="text-slate-200 font-bold">{selectedDrone.typicalRcs} dBsm</span>
                </div>
                <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">PAYLOAD</span>
                  <span className="text-slate-200 font-bold">{selectedDrone.maxPayloadKg} kg</span>
                </div>
              </div>

              {/* Operator Verification Protocol Buttons */}
              <div className="p-3.5 rounded-lg bg-slate-900/80 border border-cyan-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 text-xs uppercase tracking-wider">
                    HUMAN OPERATOR VERIFICATION PROTOCOL
                  </span>
                  <span className="text-[10px] text-slate-400">GATING REQUIRED</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleVerify(selectedDrone.id, 'confirmed')}
                    className="py-2 px-3 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 font-semibold flex items-center justify-center gap-1.5 transition-all text-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>CONFIRM MATCH</span>
                  </button>

                  <button
                    onClick={() => handleVerify(selectedDrone.id, 'rejected')}
                    className="py-2 px-3 rounded bg-red-950 hover:bg-red-900 border border-red-500/50 text-red-200 font-semibold flex items-center justify-center gap-1.5 transition-all text-xs"
                  >
                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                    <span>REJECT MATCH</span>
                  </button>

                  <button
                    onClick={() => handleVerify(selectedDrone.id, 'annotated')}
                    className="py-2 px-3 rounded bg-amber-950 hover:bg-amber-900 border border-amber-500/50 text-amber-200 font-semibold flex items-center justify-center gap-1.5 transition-all text-xs"
                  >
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span>ANNOTATE / RETRAIN</span>
                  </button>
                </div>
              </div>
            </div>
          </TacticalCard>
        </div>
      </div>
    </div>
  );
};
