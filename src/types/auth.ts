export type UserRole = 
  | 'military_commander'
  | 'defense_officer'
  | 'government_official'
  | 'research_scientist';

export type ClearanceLevel = 
  | 'LEVEL 3 - RESTRICTED'
  | 'LEVEL 4 - TOP SECRET'
  | 'LEVEL 5 - COSMIC PINAKA';

export interface UserSession {
  id: string;
  name: string;
  rankOrTitle: string;
  serviceBranchOrDept: string;
  serviceId: string;
  role: UserRole;
  clearanceLevel: ClearanceLevel;
  departmentCode: string;
  loginTime: string;
  token: string;
}

export const PRESET_OFFICIALS: UserSession[] = [
  {
    id: 'USR-MIL-01',
    name: 'Vikramaditya Rathore',
    rankOrTitle: 'Wing Commander',
    serviceBranchOrDept: 'Indian Air Force • Air Defense Command (ADC)',
    serviceId: 'IAF-88421-V',
    role: 'military_commander',
    clearanceLevel: 'LEVEL 4 - TOP SECRET',
    departmentCode: 'ADC-SECTOR-ALPHA',
    loginTime: '2026-11-21 19:40:00 UTC',
    token: 'jwt_sec_mil_adc_992'
  },
  {
    id: 'USR-GOV-02',
    name: 'Dr. Anita Sharma',
    rankOrTitle: 'Chief Scientist / Director',
    serviceBranchOrDept: 'DRDO • Center for Airborne Systems (CABS)',
    serviceId: 'DRDO-DIR-704',
    role: 'research_scientist',
    clearanceLevel: 'LEVEL 5 - COSMIC PINAKA',
    departmentCode: 'DRDO-CABS-CUAS',
    loginTime: '2026-11-21 19:42:00 UTC',
    token: 'jwt_sec_drdo_cabs_841'
  },
  {
    id: 'USR-GOV-03',
    name: 'Rajesh K. Menon',
    rankOrTitle: 'Joint Secretary (Cyber & Aerospace Defense)',
    serviceBranchOrDept: 'Ministry of Defence (MoD) • Government of India',
    serviceId: 'GOV-MOD-2041',
    role: 'government_official',
    clearanceLevel: 'LEVEL 4 - TOP SECRET',
    departmentCode: 'MOD-JOD-NEWDELHI',
    loginTime: '2026-11-21 19:44:00 UTC',
    token: 'jwt_sec_gov_mod_312'
  },
  {
    id: 'USR-CIV-04',
    name: 'Suresh Verma',
    rankOrTitle: 'Chief Airspace Surveillance Controller',
    serviceBranchOrDept: 'Directorate General of Civil Aviation (DGCA)',
    serviceId: 'DGCA-SURV-901',
    role: 'defense_officer',
    clearanceLevel: 'LEVEL 3 - RESTRICTED',
    departmentCode: 'DGCA-DEL-CTRL',
    loginTime: '2026-11-21 19:45:00 UTC',
    token: 'jwt_sec_dgca_902'
  }
];
