export type UserRole = 'passenger' | 'station_staff' | 'control_room' | 'admin';

export type DataSourceType = 'LIVE DATA' | 'AI PREDICTION' | 'HISTORICAL DATA' | 'DEMO DATA' | 'SIMULATION';

export interface RouteSection {
  id: string;
  fromCode: string;
  toCode: string;
  fromName: string;
  toName: string;
  distanceKm: number;
  normalRuntimeMin: number;
  currentSpeedKmH: number;
  maxSpeedKmH: number;
  congestionLevel: 'LOW' | 'NORMAL' | 'MODERATE' | 'HIGH';
  signalStatus: 'CLEAR' | 'CAUTION' | 'RESTRICTED' | 'BLOCKED';
  weatherFactor: 'CLEAR' | 'RAIN' | 'FOG' | 'STORM';
  recoveryBufferMin: number;
  speedRestrictionKmH?: number;
}

export interface StationStop {
  stationCode: string;
  stationName: string;
  km: number;
  scheduledArrival: string;
  scheduledDeparture: string;
  predictedArrival: string;
  predictedDeparture: string;
  delayMin: number;
  platform: number;
  confidence: number;
  status: 'DEPARTED' | 'CURRENT' | 'UPCOMING';
  crowdDensity: number; // 0-100%
  platformConflictRisk?: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  alternativePlatform?: number;
}

export interface ETAEvolutionPoint {
  timeLabel: string;
  minutesAgo: number;
  predictedDelayMin: number;
  confidence: number;
  eventNote?: string;
}

export interface DelayFactor {
  category: string;
  name: string;
  delayMin: number; // positive is delay, negative is recovery
  percentage: number;
  isRecovery?: boolean;
}

export interface SectionRecovery {
  sectionName: string;
  recoveryMin: number;
  sectionDistanceKm: number;
  speedHeadroomKmH: number;
}

export interface Train {
  id: string;
  number: string;
  name: string;
  type: 'EXPRESS' | 'SUPERFAST' | 'SHATABDI' | 'RAJDHANI' | 'INTERCITY';
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  currentStation: string;
  currentStationCode: string;
  nextStation: string;
  nextStationCode: string;
  progressKm: number;
  totalKm: number;
  currentSpeedKmH: number;
  status: 'RUNNING' | 'HALTED' | 'APPROACHING' | 'DELAYED' | 'ON_TIME';
  scheduledDeparture: string;
  scheduledArrival: string;
  currentDelayMin: number;
  predictedDelayMin: number;
  predictedArrival: string;
  confidence: number; // 0-100%
  bestCaseArrival: string;
  worstCaseArrival: string;
  probDelayExceeds5Min: number; // 0-100%
  probDelayExceeds10Min: number; // 0-100%
  expectedRecoveryMin: number;
  platform: number;
  primaryCause: string;
  stops: StationStop[];
  whyETAChanged: DelayFactor[];
  recoveryBreakdown: SectionRecovery[];
  evolution: ETAEvolutionPoint[];
  downstreamAffectedTrains: string[];
  passengerConnectionRisksCount: number;
  coordinates: { x: number; y: number }; // normalized 0-100 for corridor schematic
}

export interface Disruption {
  id: string;
  type: 'SIGNAL_CONGESTION' | 'PLATFORM_CONFLICT' | 'UNSCHEDULED_STOP' | 'WEATHER' | 'SPEED_RESTRICTION';
  title: string;
  location: string;
  stationCode?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  impactMin: number;
  affectedTrainNumbers: string[];
  description: string;
  timestamp: string;
  source: DataSourceType;
  isActive: boolean;
}

export interface Booking {
  id: string;
  pnr: string;
  trainNumber: string;
  trainName: string;
  from: string;
  to: string;
  date: string;
  seatClass: string;
  coach: string;
  berth: string;
  status: 'CONFIRMED' | 'RAC' | 'WAITLIST';
  passengerName: string;
  fare: number;
  scheduledArrival: string;
  predictedArrival: string;
}

export interface AlertItem {
  id: string;
  type: 'ETA_CHANGED' | 'PLATFORM_CHANGE' | 'DELAY_WARNING' | 'CONNECTION_RISK' | 'JOURNEY_REMINDER';
  title: string;
  message: string;
  timeAgo: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  trainNumber?: string;
  read?: boolean;
}

export interface NetworkHealth {
  overallScore: number;
  etaStability: number;
  congestionIndex: number;
  disruptionLoad: number;
  predictionConfidence: number;
  activeTrainsCount: number;
  onTimePercentage: number;
  atRiskCount: number;
  activeDisruptionsCount: number;
  highRiskConnectionsCount: number;
}

export interface WhatIfParams {
  additionalStoppageMin: number;
  speedRestrictionPercent: number;
  congestionLevel: 'LOW' | 'NORMAL' | 'HIGH' | 'EXTREME';
  weatherCondition: 'CLEAR' | 'RAIN' | 'FOG' | 'STORM';
}

export interface WhatIfResult {
  simulatedDestinationETA: string;
  additionalDelayMin: number;
  affectedTrainsCount: number;
  affectedStationsCount: number;
  connectionRisksCount: number;
  networkHealthDrop: number;
  affectedTrainNumbers: string[];
}

export interface ModelMetrics {
  maeMin: number;
  baselineMaeMin: number;
  rmseMin: number;
  baselineRmseMin: number;
  coveragePercent: number;
  avgConfidencePercent: number;
  activeVersion: string;
  totalPredictions24h: number;
  latencyMs: number;
}

export interface PredictionHistoryRecord {
  id: string;
  timestamp: string;
  trainNumber: string;
  stationCode: string;
  scheduledETA: string;
  predictedETA: string;
  actualETA: string;
  errorMin: number;
  confidence: number;
  modelVersion: string;
  primaryFactor: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userRole: UserRole;
  action: string;
  resource: string;
  result: 'SUCCESS' | 'WARNING' | 'FAILED';
  details?: string;
}

export type ClearanceLevel = 'LEVEL 1 (PUBLIC)' | 'LEVEL 2 (STATION OPERATIONAL)' | 'LEVEL 3 (TRAFFIC CONTROL)' | 'LEVEL 4 (SYSADMIN & AI)';

export interface CategoryFeatureMeta {
  id: string;
  name: string;
  category: UserRole;
  clearanceLevel: ClearanceLevel;
  description: string;
  restrictedFrom: UserRole[];
  securityReason: string;
}

// Category-exclusive feature records
export interface SmsAlertSubscription {
  id: string;
  trainNumber: string;
  trainName: string;
  phone: string;
  thresholdMin: number;
  channel: 'SMS' | 'WHATSAPP';
  status: 'ACTIVE' | 'PAUSED';
}

export interface PlatformAssignment {
  trainNumber: string;
  trainName: string;
  platform: number;
  originalPlatform: number;
  isReassigned: boolean;
  eta: string;
  dwellMin: number;
  conflictStatus: 'NOMINAL' | 'CONFLICT' | 'RESOLVED';
  reassignedBy?: string;
}

export interface PAAnnouncement {
  id: string;
  timestamp: string;
  trainNumber: string;
  platform: number;
  language: 'EN' | 'HI' | 'TA' | 'KN';
  message: string;
  status: 'BROADCASTING' | 'QUEUED' | 'COMPLETED';
}

export interface PorterRequest {
  id: string;
  timestamp: string;
  trainNumber: string;
  coach: string;
  seat: string;
  assistanceType: 'WHEELCHAIR' | 'BATTERY_BUGGY' | 'LUGGAGE_PORTER';
  status: 'ASSIGNED' | 'DISPATCHED' | 'COMPLETED';
}

export interface PrecedenceOrder {
  id: string;
  priorityTrain: string;
  yieldTrain: string;
  junction: string;
  reason: string;
  action: 'OVERTAKE_LOOP' | 'GREEN_WAVE' | 'HOLD_AT_SIGNAL';
  timestamp: string;
  status: 'ACTIVE' | 'EXECUTED';
}

export interface CautionOrder {
  id: string;
  sectionId: string;
  sectionName: string;
  speedLimitKmH: number;
  normalSpeedKmH: number;
  reason: string;
  issuedAt: string;
  status: 'ACTIVE' | 'REVOKED';
}

export interface TelemetrySensor {
  id: string;
  name: string;
  location: string;
  type: 'AXLE_COUNTER' | 'GPS_LOCO' | 'SIGNAL_CIRCUIT' | 'WEATHER_ANEMOMETER';
  healthPercent: number;
  latencyMs: number;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
}

export interface SecurityPolicy {
  id: string;
  name: string;
  category: UserRole;
  enforced: boolean;
  rule: string;
}

