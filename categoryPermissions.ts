import { UserRole, CategoryFeatureMeta, ClearanceLevel } from '../types/railway';

export interface CategoryInfo {
  role: UserRole;
  title: string;
  badgeLabel: string;
  clearanceLevel: ClearanceLevel;
  iconName: string;
  color: string;
  tagline: string;
  securityScope: string;
}

export const CATEGORIES_CONFIG: Record<UserRole, CategoryInfo> = {
  passenger: {
    role: 'passenger',
    title: 'Passenger Portal',
    badgeLabel: 'Passenger Access',
    clearanceLevel: 'LEVEL 1 (PUBLIC)',
    iconName: 'Train',
    color: 'blue',
    tagline: 'Personalized Travel, Live PNRs, Delay Explanations & Alerts',
    securityScope: 'Public & passenger-facing services. Strictly isolated from railway signaling, platform switches, and dispatch controls.'
  },
  station_staff: {
    role: 'station_staff',
    title: 'Station Operations',
    badgeLabel: 'Station Staff Clearance',
    clearanceLevel: 'LEVEL 2 (STATION OPERATIONAL)',
    iconName: 'Building2',
    color: 'emerald',
    tagline: 'Platform Allocation, Concourse Crowd, Dwell Times & Station PA',
    securityScope: 'Terminal management clearance. Isolated from corridor-level dispatch, interlocking blocks, and passenger private ticketing records.'
  },
  control_room: {
    role: 'control_room',
    title: 'Section Control Room',
    badgeLabel: 'Traffic Controller Clearance',
    clearanceLevel: 'LEVEL 3 (TRAFFIC CONTROL)',
    iconName: 'Sliders',
    color: 'amber',
    tagline: 'Corridor Dispatch, Precedence, Caution Orders & What-If Simulator',
    securityScope: 'Active railway traffic operations. Authorized to command train priority and section speeds; isolated from system administration and AI model tuning.'
  },
  admin: {
    role: 'admin',
    title: 'AI & System Administration',
    badgeLabel: 'System Administrator Clearance',
    clearanceLevel: 'LEVEL 4 (SYSADMIN & AI)',
    iconName: 'Cpu',
    color: 'purple',
    tagline: 'ML Ensemble Calibration, Sensor Telemetry, RBAC & Audit Ledger',
    securityScope: 'Highest governance clearance. Enforces category security boundaries, monitors ML model drift, and audits system integrity.'
  }
};

export const CATEGORY_EXCLUSIVE_FEATURES: CategoryFeatureMeta[] = [
  // 1. Passenger Features (Strictly Passenger Only)
  {
    id: 'pnr_wallet',
    name: 'My Journey & Live PNR Wallet',
    category: 'passenger',
    clearanceLevel: 'LEVEL 1 (PUBLIC)',
    description: 'Personalized e-ticket management, live coach locator, and berth indicators for passenger PNRs.',
    restrictedFrom: ['station_staff', 'control_room', 'admin'],
    securityReason: 'Passenger Privacy Act: Station staff and controllers are legally restricted from viewing passenger private itinerary and payment records without a warrant.'
  },
  {
    id: 'plain_eta',
    name: 'Plain-English Delay Explainer',
    category: 'passenger',
    clearanceLevel: 'LEVEL 1 (PUBLIC)',
    description: 'Deconstructs technical signaling jargon into intuitive, human-friendly reasons with projected recovery times.',
    restrictedFrom: ['station_staff', 'control_room', 'admin'],
    securityReason: 'Passenger-tailored UX: Tailored to simplify operational data for traveler peace-of-mind.'
  },
  {
    id: 'connections',
    name: 'Connecting Train Protection',
    category: 'passenger',
    clearanceLevel: 'LEVEL 1 (PUBLIC)',
    description: 'Calculates junction transfer safety buffers and suggests alternative connections if delays exceed buffer limits.',
    restrictedFrom: ['station_staff', 'control_room', 'admin'],
    securityReason: 'Personalized ticketing travel assist. Not applicable to train traffic controllers.'
  },
  {
    id: 'amenities',
    name: 'Station Amenities & Crowd Guide',
    category: 'passenger',
    clearanceLevel: 'LEVEL 1 (PUBLIC)',
    description: 'Live information on waiting rooms, escalators, cloak rooms, and platform crowd density before boarding.',
    restrictedFrom: ['station_staff', 'control_room', 'admin'],
    securityReason: 'Passenger concourse utility intended strictly for disembarking and embarking passengers.'
  },
  {
    id: 'sms_alerts',
    name: 'Live SMS & WhatsApp Subscriptions',
    category: 'passenger',
    clearanceLevel: 'LEVEL 1 (PUBLIC)',
    description: 'Subscribe personal mobile numbers to push notifications whenever predicted ETA shifts by 5+ minutes.',
    restrictedFrom: ['station_staff', 'control_room', 'admin'],
    securityReason: 'Personal notification channel. Operational staff receive telemetry alerts via internal railway radios.'
  },

  // 2. Station Staff Features (Strictly Station Staff Only)
  {
    id: 'platform_matrix',
    name: 'Platform Allocation & Conflict Resolver',
    category: 'station_staff',
    clearanceLevel: 'LEVEL 2 (STATION OPERATIONAL)',
    description: 'Live platform Gantt chart, train track assignments, and one-click conflict resolution for station platforms.',
    restrictedFrom: ['passenger', 'control_room', 'admin'],
    securityReason: 'Station Safety Protocol: Platform track allocations are restricted strictly to station master staff to prevent unauthorized track reassignments.'
  },
  {
    id: 'dwell_tracker',
    name: 'Dwell Time & Turnaround Tracker',
    category: 'station_staff',
    clearanceLevel: 'LEVEL 2 (STATION OPERATIONAL)',
    description: 'Real-time stop duration monitoring, flagging dwell overruns to recover lost corridor minutes.',
    restrictedFrom: ['passenger', 'control_room', 'admin'],
    securityReason: 'Internal platform performance metric. Passengers cannot intervene in train turnaround operations.'
  },
  {
    id: 'crowd_surge',
    name: 'Concourse Crowd & Gate Throttling',
    category: 'station_staff',
    clearanceLevel: 'LEVEL 2 (STATION OPERATIONAL)',
    description: 'Platform crowd surge detection with automated entry gate throttling to prevent terminal stampedes.',
    restrictedFrom: ['passenger', 'control_room', 'admin'],
    securityReason: 'Security & Crowd Management: Physical access controls are restricted to certified station security staff.'
  },
  {
    id: 'pa_broadcast',
    name: 'Multi-Lingual Station PA Dispatcher',
    category: 'station_staff',
    clearanceLevel: 'LEVEL 2 (STATION OPERATIONAL)',
    description: 'Broadcast regional audio and visual platform announcements across the station sound system.',
    restrictedFrom: ['passenger', 'control_room', 'admin'],
    securityReason: 'Public Address System Security: Direct broadcast access is strictly guarded to prevent rogue announcements.'
  },
  {
    id: 'porter_dispatch',
    name: 'Wheelchair & Porter Dispatch',
    category: 'station_staff',
    clearanceLevel: 'LEVEL 2 (STATION OPERATIONAL)',
    description: 'Assign station staff, battery carts, and wheelchair assistants to arriving train coaches.',
    restrictedFrom: ['passenger', 'control_room', 'admin'],
    securityReason: 'Internal station workforce allocation tool for ground station staff.'
  },

  // 3. Control Room Features (Strictly Control Room Only)
  {
    id: 'corridor_schematic',
    name: 'Corridor Dispatch Schematic',
    category: 'control_room',
    clearanceLevel: 'LEVEL 3 (TRAFFIC CONTROL)',
    description: 'Real-time signal interlock map, block section occupancy, and train progression along the quad corridor.',
    restrictedFrom: ['passenger', 'station_staff', 'admin'],
    securityReason: 'Railway Safety Act: Section dispatch controls are restricted strictly to licensed Section Controllers.'
  },
  {
    id: 'precedence_control',
    name: 'Dynamic Precedence & Overtake Controller',
    category: 'control_room',
    clearanceLevel: 'LEVEL 3 (TRAFFIC CONTROL)',
    description: 'Command priority overtaking at passing loops (e.g. Vande Bharat green wave over slow passenger/freight).',
    restrictedFrom: ['passenger', 'station_staff', 'admin'],
    securityReason: 'Traffic Regulation Mandate: Precedence commands dictate physical signal aspects; restricted from passengers & station staff.'
  },
  {
    id: 'tsr_caution',
    name: 'Caution Orders & Temporary Speed Restrictions',
    category: 'control_room',
    clearanceLevel: 'LEVEL 3 (TRAFFIC CONTROL)',
    description: 'Issue and revoke speed restriction orders (TSR) with instant network-wide ETA recalculation.',
    restrictedFrom: ['passenger', 'station_staff', 'admin'],
    securityReason: 'Train Operational Safety: Speed restrictions govern track safety and cannot be issued by non-controllers.'
  },
  {
    id: 'propagation_tree',
    name: 'Delay Propagation & Cascading Ripple Tree',
    category: 'control_room',
    clearanceLevel: 'LEVEL 3 (TRAFFIC CONTROL)',
    description: 'Analyzes how an initial 10-minute delay cascades through secondary and tertiary crossing trains.',
    restrictedFrom: ['passenger', 'station_staff', 'admin'],
    securityReason: 'High-level network dispatch tool meant exclusively for section traffic controllers.'
  },
  {
    id: 'what_if_sandbox',
    name: 'Interactive What-If Simulation Sandbox',
    category: 'control_room',
    clearanceLevel: 'LEVEL 3 (TRAFFIC CONTROL)',
    description: 'Simulate operational disruptions (signal trips, weather friction, additional stops) before execution.',
    restrictedFrom: ['passenger', 'station_staff', 'admin'],
    securityReason: 'Tactical simulation sandbox reserved for corridor dispatch planners.'
  },
  {
    id: 'disruption_blocks',
    name: 'Corridor Disruption & Emergency Track Blocks',
    category: 'control_room',
    clearanceLevel: 'LEVEL 3 (TRAFFIC CONTROL)',
    description: 'Declare emergency track blocks, signal fault flags, and monitor corridor recovery headroom.',
    restrictedFrom: ['passenger', 'station_staff', 'admin'],
    securityReason: 'Emergency powers reserved exclusively for Section Controllers to prevent unauthorized line closures.'
  },

  // 4. Admin / AI ML Features (Strictly Admin Only)
  {
    id: 'model_tuning',
    name: 'Ensemble Model Hyperparameters & Weights',
    category: 'admin',
    clearanceLevel: 'LEVEL 4 (SYSADMIN & AI)',
    description: 'Rebalance weights between Gradient Boosted Trees, GNNs, and Physics Run-Time Engine.',
    restrictedFrom: ['passenger', 'station_staff', 'control_room'],
    securityReason: 'AI Governance: Machine Learning weights determine national dispatch ETAs; restricted to ML Operations Engineers.'
  },
  {
    id: 'drift_matrix',
    name: 'Feature Importance & Concept Drift Monitor',
    category: 'admin',
    clearanceLevel: 'LEVEL 4 (SYSADMIN & AI)',
    description: 'Inspect model feature attribution (weather vs track friction vs dwell) and monitor accuracy degradation.',
    restrictedFrom: ['passenger', 'station_staff', 'control_room'],
    securityReason: 'Deep ML diagnostics reserved for data science and administrative teams.'
  },
  {
    id: 'sensor_fleet',
    name: 'Corridor IoT & Telemetry Fleet Monitor',
    category: 'admin',
    clearanceLevel: 'LEVEL 4 (SYSADMIN & AI)',
    description: 'Real-time health, ping latency, and battery status of track axle counters, transponders, and weather stations.',
    restrictedFrom: ['passenger', 'station_staff', 'control_room'],
    securityReason: 'Infrastructure Telemetry: Hardware diagnostics are restricted to system administrators.'
  },
  {
    id: 'rbac_security',
    name: 'Category RBAC Permission Matrix & Policy Enforcer',
    category: 'admin',
    clearanceLevel: 'LEVEL 4 (SYSADMIN & AI)',
    description: 'View and enforce category isolation boundaries, clearance rules, and security enforcement policies.',
    restrictedFrom: ['passenger', 'station_staff', 'control_room'],
    securityReason: 'Access Control Authority: Only system administrators have authority to govern security rules.'
  },
  {
    id: 'audit_ledger',
    name: 'Immutable Security & Action Audit Ledger',
    category: 'admin',
    clearanceLevel: 'LEVEL 4 (SYSADMIN & AI)',
    description: 'Cryptographic log of all role actions, scenario modifications, and unauthorized access attempts.',
    restrictedFrom: ['passenger', 'station_staff', 'control_room'],
    securityReason: 'Regulatory Compliance: System audit trails must be immutable and tamper-proof.'
  },
  {
    id: 'pipeline_health',
    name: 'Data Source Ingestion & System Recovery',
    category: 'admin',
    clearanceLevel: 'LEVEL 4 (SYSADMIN & AI)',
    description: 'Monitor live FOIS/NTES/COA feed latency, toggle synthetic streams, and trigger pipeline state recovery.',
    restrictedFrom: ['passenger', 'station_staff', 'control_room'],
    securityReason: 'Core system plumbing reserved for system engineers.'
  }
];

export function checkCategoryAccess(currentRole: UserRole, featureId: string): {
  allowed: boolean;
  feature?: CategoryFeatureMeta;
  reason?: string;
  requiredCategory?: UserRole;
  requiredClearance?: ClearanceLevel;
} {
  const feature = CATEGORY_EXCLUSIVE_FEATURES.find(f => f.id === featureId);
  if (!feature) {
    return { allowed: true };
  }

  if (feature.category === currentRole) {
    return { allowed: true, feature };
  }

  return {
    allowed: false,
    feature,
    reason: feature.securityReason,
    requiredCategory: feature.category,
    requiredClearance: feature.clearanceLevel
  };
}
