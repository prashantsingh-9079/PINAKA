import React, { useState } from 'react';
import { PinakaLogo } from '../common/PinakaLogo';
import { UserSession, PRESET_OFFICIALS, ClearanceLevel } from '../../types/auth';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Key, 
  UserCheck, 
  Building2, 
  CreditCard, 
  Fingerprint, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Globe2, 
  Radio, 
  Cpu, 
  Compass,
  ArrowRight
} from 'lucide-react';

interface DefenseLoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
}

export const DefenseLoginPage: React.FC<DefenseLoginPageProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'military' | 'government' | 'smartcard'>('military');
  
  // Military Form Fields
  const [serviceNumber, setServiceNumber] = useState<string>('IAF-88421-V');
  const [militaryPasscode, setMilitaryPasscode] = useState<string>('••••••••••••');
  const [clearanceTier, setClearanceTier] = useState<ClearanceLevel>('LEVEL 4 - TOP SECRET');

  // Government Form Fields
  const [govtEmail, setGovtEmail] = useState<string>('director.cabs@drdo.gov.in');
  const [departmentCode, setDepartmentCode] = useState<string>('DRDO-CABS-CUAS');
  const [pkiToken, setPkiToken] = useState<string>('PKI-RSA4096-SEC-092');

  // Smartcard Status
  const [isSmartCardInserted, setIsSmartCardInserted] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Authenticate using manual form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setAuthError(null);

    setTimeout(() => {
      setIsVerifying(false);

      if (authMode === 'military') {
        const session: UserSession = {
          id: `USR-MIL-${Date.now().toString().slice(-4)}`,
          name: serviceNumber.includes('88421') ? 'Vikramaditya Rathore' : 'Field Commander',
          rankOrTitle: serviceNumber.includes('88421') ? 'Wing Commander' : 'Defense Officer',
          serviceBranchOrDept: 'Indian Armed Forces • Joint Air Defense Command',
          serviceId: serviceNumber || 'IAF-88421-V',
          role: 'military_commander',
          clearanceLevel: clearanceTier,
          departmentCode: 'ADC-SECTOR-ALPHA',
          loginTime: new Date().toISOString(),
          token: 'jwt_sec_mil_' + Math.random().toString(36).substring(7)
        };
        onLoginSuccess(session);
      } else if (authMode === 'government') {
        const session: UserSession = {
          id: `USR-GOV-${Date.now().toString().slice(-4)}`,
          name: govtEmail.includes('drdo') ? 'Dr. Anita Sharma' : 'Government Official',
          rankOrTitle: govtEmail.includes('drdo') ? 'Chief Scientist / Director' : 'Joint Secretary',
          serviceBranchOrDept: govtEmail.includes('drdo') ? 'DRDO • Center for Airborne Systems' : 'Ministry of Defence',
          serviceId: departmentCode || 'GOV-SEC-2041',
          role: 'government_official',
          clearanceLevel: 'LEVEL 4 - TOP SECRET',
          departmentCode: departmentCode || 'MOD-JOD-NEWDELHI',
          loginTime: new Date().toISOString(),
          token: 'jwt_sec_gov_' + Math.random().toString(36).substring(7)
        };
        onLoginSuccess(session);
      } else {
        // Smartcard
        const session = PRESET_OFFICIALS[0];
        onLoginSuccess(session);
      }
    }, 900);
  };

  // Instant login via official preset
  const handleSelectPreset = (preset: UserSession) => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onLoginSuccess(preset);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#030611] text-slate-100 flex flex-col justify-between relative overflow-hidden font-mono select-none">
      {/* Background Tactical Grid & Ambient Radar Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        
        {/* Subtle grid pattern */}
        <div 
          className="w-full h-full opacity-10" 
          style={{
            backgroundImage: `linear-gradient(to right, rgba(6, 182, 212, 0.3) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(6, 182, 212, 0.3) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Top Classification Bar */}
      <div className="w-full bg-[#060B18]/90 border-b border-cyan-500/20 px-4 py-2 flex items-center justify-between text-[11px] tracking-wider z-20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-400 font-bold uppercase">
            GOVERNMENT OF INDIA // JOINT AIR DEFENSE COMMAND
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">C-UAS INTEGRATED SYSTEM</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-red-300 font-bold text-[10px]">
            RESTRICTED // AIR DEFENSE ONLY
          </span>
          <span className="text-slate-500 text-[10px] hidden md:inline">
            ENCRYPTED TLS 1.3 // POST-QUANTUM AES-256
          </span>
        </div>
      </div>

      {/* Main Authentication Card Container */}
      <div className="flex-1 flex items-center justify-center p-4 z-10 my-4">
        <div className="w-full max-w-xl tactical-glass rounded-xl p-6 md:p-8 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative">
          {/* Tactical Corner Brackets */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

          {/* Logo & Platform Header */}
          <div className="text-center mb-6">
            <div className="inline-block mb-2">
              <PinakaLogo size="lg" showTagline={false} />
            </div>
            <h1 className="font-tactical font-bold text-xl md:text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 uppercase">
              DEFENSE SURVEILLANCE & COMMAND GATEWAY
            </h1>
            <p className="text-xs text-slate-400 mt-1 tracking-wider">
              Military & Government Official Authentication Portal
            </p>
          </div>

          {/* Authentication Mode Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-slate-900/90 border border-cyan-500/20 mb-6 text-xs">
            <button
              type="button"
              onClick={() => setAuthMode('military')}
              className={`py-2 px-3 rounded flex items-center justify-center gap-1.5 transition-all ${
                authMode === 'military'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ARMED FORCES</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('government')}
              className={`py-2 px-3 rounded flex items-center justify-center gap-1.5 transition-all ${
                authMode === 'government'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>GOVT / MoD</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('smartcard')}
              className={`py-2 px-3 rounded flex items-center justify-center gap-1.5 transition-all ${
                authMode === 'smartcard'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>CAC / PIV CARD</span>
            </button>
          </div>

          {/* Form Content based on Tab */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {authMode === 'military' && (
              <>
                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px] block">
                    SERVICE NUMBER / OFFICER REGIMENTAL ID:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={serviceNumber}
                      onChange={(e) => setServiceNumber(e.target.value)}
                      placeholder="e.g. IAF-88421-V"
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-cyan-200 text-xs tracking-wider focus:outline-none focus:border-cyan-400"
                    />
                    <span className="absolute right-3 top-3 text-[10px] text-slate-500">
                      MIL-SEC
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px] block">
                    SECURITY ACCESS PASSCODE / HARDWARE TOKEN:
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={militaryPasscode}
                      onChange={(e) => setMilitaryPasscode(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-cyan-200 text-xs tracking-wider focus:outline-none focus:border-cyan-400"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px] block">
                    MANDATED SECURITY CLEARANCE TIER:
                  </label>
                  <select
                    value={clearanceTier}
                    onChange={(e) => setClearanceTier(e.target.value as ClearanceLevel)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="LEVEL 4 - TOP SECRET">LEVEL 4 - TOP SECRET (Air Defense Command)</option>
                    <option value="LEVEL 5 - COSMIC PINAKA">LEVEL 5 - COSMIC PINAKA (Full Swarm Analytics)</option>
                    <option value="LEVEL 3 - RESTRICTED">LEVEL 3 - RESTRICTED (Surveillance Operator)</option>
                  </select>
                </div>
              </>
            )}

            {authMode === 'government' && (
              <>
                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px] block">
                    OFFICIAL GOVERNMENT EMAIL (NIC / GOV.IN):
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={govtEmail}
                      onChange={(e) => setGovtEmail(e.target.value)}
                      placeholder="e.g. officer@drdo.gov.in"
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-cyan-200 text-xs tracking-wider focus:outline-none focus:border-cyan-400"
                    />
                    <Building2 className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-400 text-[11px] block">
                      DEPARTMENT CODE:
                    </label>
                    <input
                      type="text"
                      value={departmentCode}
                      onChange={(e) => setDepartmentCode(e.target.value)}
                      placeholder="e.g. DRDO-CABS-CUAS"
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-cyan-200 text-xs tracking-wider focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 text-[11px] block">
                      PKI CRYPTO KEY ID:
                    </label>
                    <input
                      type="text"
                      value={pkiToken}
                      onChange={(e) => setPkiToken(e.target.value)}
                      placeholder="e.g. PKI-RSA4096-SEC-092"
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-cyan-200 text-xs tracking-wider focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </>
            )}

            {authMode === 'smartcard' && (
              <div className="p-4 rounded-lg bg-slate-950/80 border border-cyan-500/20 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Fingerprint className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 text-xs">
                    DEFENSE SMART CARD (CAC / PIV) READER
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Insert your physical Ministry of Defence / Armed Forces cryptographic smartcard into the reader slot.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="text-[10px] px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>SMART CARD DETECTED: Wg Cdr. V. Rathore (IAF)</span>
                  </span>
                </div>
              </div>
            )}

            {/* Submit Clearance Button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full mt-2 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                  <span>VERIFYING DEFENSE CLEARANCE...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>AUTHENTICATE & ENTER C2 DECK</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Clearance Presets for Instant Demonstration */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2.5">
              <span className="font-bold tracking-wider text-slate-300 uppercase">
                AUTHORIZED DEMO CLEARANCE PRESETS (1-CLICK ACCESS):
              </span>
              <span className="text-cyan-400 text-[10px]">SELECT TO LOGIN</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {PRESET_OFFICIALS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  disabled={isVerifying}
                  className="p-2.5 rounded bg-slate-900/60 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                      {preset.rankOrTitle} {preset.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                      {preset.serviceId.split('-')[0]}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                    {preset.serviceBranchOrDept.split('•')[0]}
                  </span>
                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800/60 text-[9px] text-slate-500">
                    <span className="text-amber-400/90">{preset.clearanceLevel.split('-')[1]}</span>
                    <span className="group-hover:text-cyan-400 flex items-center">
                      LOGIN →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Warning / Legal Notice */}
          <div className="mt-5 p-2.5 rounded bg-amber-500/5 border border-amber-500/20 text-[10px] text-slate-400 leading-tight flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong>RESTRICTED DEFENSE PLATFORM:</strong> Access is governed under the Official Secrets Act and Military Cyber Defense Directives. Unaccredited access is cryptographically audited and reported to Joint Air Defense Command.
            </p>
          </div>
        </div>
      </div>

      {/* Footer System Status Bar */}
      <div className="w-full bg-[#040814] border-t border-slate-800/80 px-4 py-2 flex flex-wrap items-center justify-between text-[10px] text-slate-500 z-20">
        <div className="flex items-center gap-4">
          <span>PINAKA CORE v2.4</span>
          <span>•</span>
          <span className="text-emerald-400">PTP IEEE-1588 SYNCHRONIZED</span>
          <span>•</span>
          <span>STATION: DEL-NCR-SECTOR-01</span>
        </div>

        <div className="flex items-center gap-3">
          <span>SECURE CERT: SHA-384</span>
          <span>•</span>
          <span>SYSTEM READY</span>
        </div>
      </div>
    </div>
  );
};
