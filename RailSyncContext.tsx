import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  UserRole,
  Train,
  Disruption,
  Booking,
  AlertItem,
  NetworkHealth,
  WhatIfParams,
  WhatIfResult,
  ModelMetrics,
  PredictionHistoryRecord,
  AuditLogItem,
  SmsAlertSubscription,
  PlatformAssignment,
  PAAnnouncement,
  PorterRequest,
  PrecedenceOrder,
  CautionOrder,
  TelemetrySensor,
  SecurityPolicy
} from '../types/railway';
import {
  INITIAL_TRAINS,
  INITIAL_DISRUPTIONS,
  INITIAL_BOOKINGS,
  INITIAL_ALERTS,
  MODEL_VERSIONS,
  INITIAL_PREDICTION_HISTORY,
  INITIAL_AUDIT_LOGS,
  CORRIDOR_SECTIONS
} from '../data/mockRailwayData';
import { ETAPredictionProvider } from '../services/etaEngine';

export interface AccessGuardState {
  isOpen: boolean;
  targetFeatureId: string;
  targetFeatureName: string;
  requiredRole: UserRole | null;
  reason: string;
}

interface RailSyncContextType {
  activeScreen: 'home' | 'category_select' | 'workspace';
  setActiveScreen: (screen: 'home' | 'category_select' | 'workspace') => void;
  navigateToRole: (role: UserRole) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  trains: Train[];
  selectedTrainId: string;
  setSelectedTrainId: (id: string) => void;
  selectedTrain: Train;
  selectedStationCode: string;
  setSelectedStationCode: (code: string) => void;
  disruptions: Disruption[];
  networkHealth: NetworkHealth;
  activeScenario: string;
  applyScenario: (scenario: 'normal' | 'signal_delay' | 'heavy_congestion' | 'unscheduled_stoppage' | 'weather_disruption') => void;
  whatIfParams: WhatIfParams;
  setWhatIfParams: (params: Partial<WhatIfParams>) => void;
  whatIfResult: WhatIfResult;
  runWhatIf: (customParams?: WhatIfParams) => void;
  triggerDisruption: (type: Disruption['type'], title: string, location: string, stationCode: string, impactMin: number) => void;
  resetCorridor: () => void;
  bookings: Booking[];
  createBooking: (booking: Omit<Booking, 'id' | 'pnr' | 'status'>) => Booking;
  alerts: AlertItem[];
  dismissAlert: (id: string) => void;
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  voiceModalOpen: boolean;
  setVoiceModalOpen: (open: boolean) => void;
  sihModalOpen: boolean;
  setSihModalOpen: (open: boolean) => void;
  walkthroughOpen?: boolean;
  setWalkthroughOpen?: (open: boolean) => void;
  sihStep: number;
  setSihStep: (step: number) => void;
  nextSihStep: () => void;
  prevSihStep: () => void;
  modelMetrics: ModelMetrics;
  predictionHistory: PredictionHistoryRecord[];
  auditLogs: AuditLogItem[];
  activeModelVersion: string;
  setActiveModelVersion: (v: string) => void;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;

  // RBAC & Category Access Guard
  accessGuardState: AccessGuardState;
  triggerAccessGuard: (featureId: string, featureName: string, requiredRole: UserRole, reason: string) => void;
  closeAccessGuard: () => void;

  // Active Category sub-tabs
  passengerTab: 'home' | 'details' | 'map' | 'bookings' | 'alerts' | 'amenities' | 'sms';
  setPassengerTab: (tab: 'home' | 'details' | 'map' | 'bookings' | 'alerts' | 'amenities' | 'sms') => void;
  stationTab: 'overview' | 'platforms' | 'dwell' | 'crowd' | 'pa' | 'porter';
  setStationTab: (tab: 'overview' | 'platforms' | 'dwell' | 'crowd' | 'pa' | 'porter') => void;
  controlTab: 'network' | 'precedence' | 'tsr' | 'propagation' | 'whatif' | 'blocks';
  setControlTab: (tab: 'network' | 'precedence' | 'tsr' | 'propagation' | 'whatif' | 'blocks') => void;
  adminTab: 'metrics' | 'tuning' | 'drift' | 'sensors' | 'rbac' | 'audit' | 'pipeline';
  setAdminTab: (tab: 'metrics' | 'tuning' | 'drift' | 'sensors' | 'rbac' | 'audit' | 'pipeline') => void;

  // Category Exclusive: Passenger
  smsSubscriptions: SmsAlertSubscription[];
  subscribeSmsAlert: (trainNumber: string, trainName: string, phone: string, thresholdMin: number, channel: 'SMS' | 'WHATSAPP') => void;
  removeSmsAlert: (id: string) => void;

  // Category Exclusive: Station Staff
  platformAssignments: PlatformAssignment[];
  reassignPlatform: (trainNumber: string, newPlatform: number, reason: string) => void;
  paAnnouncements: PAAnnouncement[];
  broadcastPA: (trainNumber: string, platform: number, message: string, lang: 'EN' | 'HI' | 'TA' | 'KN') => void;
  gateFlowStatus: { concourseNorth: 'NORMAL' | 'THROTTLED' | 'HEAVY'; concourseSouth: 'NORMAL' | 'THROTTLED' | 'HEAVY' };
  setGateFlowStatus: (gate: 'concourseNorth' | 'concourseSouth', status: 'NORMAL' | 'THROTTLED' | 'HEAVY') => void;
  porterRequests: PorterRequest[];
  dispatchPorter: (trainNumber: string, coach: string, seat: string, assistanceType: PorterRequest['assistanceType']) => void;

  // Category Exclusive: Control Room
  precedenceOrders: PrecedenceOrder[];
  issuePrecedenceOrder: (priorityTrain: string, yieldTrain: string, junction: string, reason: string, action: PrecedenceOrder['action']) => void;
  cautionOrders: CautionOrder[];
  issueCautionOrder: (sectionId: string, speedLimitKmH: number, reason: string) => void;
  revokeCautionOrder: (id: string) => void;

  // Category Exclusive: Admin
  modelWeights: { xgboost: number; gnn: number; physics: number };
  setModelWeights: (weights: { xgboost: number; gnn: number; physics: number }) => void;
  telemetrySensors: TelemetrySensor[];
  securityPolicies: SecurityPolicy[];
  toggleSecurityPolicy: (policyId: string) => void;
}

const RailSyncContext = createContext<RailSyncContextType | undefined>(undefined);

export const RailSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<'home' | 'category_select' | 'workspace'>('home');
  const [currentRole, setCurrentRole] = useState<UserRole>('passenger');

  const navigateToRole = (role: UserRole) => {
    setCurrentRole(role);
    setActiveScreen('workspace');
  };
  const [trains, setTrains] = useState<Train[]>(INITIAL_TRAINS);
  const [selectedTrainId, setSelectedTrainId] = useState<string>('12627');
  const [selectedStationCode, setSelectedStationCode] = useState<string>('MAS');
  const [disruptions, setDisruptions] = useState<Disruption[]>(INITIAL_DISRUPTIONS);
  const [activeScenario, setActiveScenario] = useState<string>('signal_delay');
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [copilotOpen, setCopilotOpen] = useState<boolean>(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState<boolean>(false);
  const [sihModalOpen, setSihModalOpen] = useState<boolean>(false);
  const [sihStep, setSihStep] = useState<number>(0);
  const [activeModelVersion, setActiveModelVersion] = useState<string>('v1.4');
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [predictionHistory, setPredictionHistory] = useState<PredictionHistoryRecord[]>(INITIAL_PREDICTION_HISTORY);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  // Active Category sub-tabs
  const [passengerTab, setPassengerTab] = useState<'home' | 'details' | 'map' | 'bookings' | 'alerts' | 'amenities' | 'sms'>('home');
  const [stationTab, setStationTab] = useState<'overview' | 'platforms' | 'dwell' | 'crowd' | 'pa' | 'porter'>('overview');
  const [controlTab, setControlTab] = useState<'network' | 'precedence' | 'tsr' | 'propagation' | 'whatif' | 'blocks'>('network');
  const [adminTab, setAdminTab] = useState<'metrics' | 'tuning' | 'drift' | 'sensors' | 'rbac' | 'audit' | 'pipeline'>('metrics');

  // RBAC Category Access Guard state
  const [accessGuardState, setAccessGuardState] = useState<AccessGuardState>({
    isOpen: false,
    targetFeatureId: '',
    targetFeatureName: '',
    requiredRole: null,
    reason: ''
  });

  const triggerAccessGuard = (featureId: string, featureName: string, requiredRole: UserRole, reason: string) => {
    // Record security access barrier violation in the system audit log
    const violationLog: AuditLogItem = {
      id: `SEC_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      userRole: currentRole,
      action: `RBAC_VIOLATION_BLOCKED: ${featureName}`,
      resource: `Category Boundary [${requiredRole.toUpperCase()}]`,
      result: 'FAILED',
      details: `User in '${currentRole}' role attempted to invoke '${featureName}' restricted to '${requiredRole}'. Access denied.`
    };
    setAuditLogs(prev => [violationLog, ...prev]);

    setAccessGuardState({
      isOpen: true,
      targetFeatureId: featureId,
      targetFeatureName: featureName,
      requiredRole,
      reason
    });
  };

  const closeAccessGuard = () => {
    setAccessGuardState(prev => ({ ...prev, isOpen: false }));
  };

  // Passenger Category State
  const [smsSubscriptions, setSmsSubscriptions] = useState<SmsAlertSubscription[]>([
    {
      id: 'SUB_01',
      trainNumber: '12627',
      trainName: 'Karnataka Express',
      phone: '+91 98450 12345',
      thresholdMin: 5,
      channel: 'WHATSAPP',
      status: 'ACTIVE'
    },
    {
      id: 'SUB_02',
      trainNumber: '12028',
      trainName: 'Shatabdi Express',
      phone: '+91 98450 12345',
      thresholdMin: 10,
      channel: 'SMS',
      status: 'ACTIVE'
    }
  ]);

  const subscribeSmsAlert = (trainNumber: string, trainName: string, phone: string, thresholdMin: number, channel: 'SMS' | 'WHATSAPP') => {
    const newSub: SmsAlertSubscription = {
      id: `SUB_${Date.now()}`,
      trainNumber,
      trainName,
      phone,
      thresholdMin,
      channel,
      status: 'ACTIVE'
    };
    setSmsSubscriptions(prev => [newSub, ...prev]);

    const newLog: AuditLogItem = {
      id: `LOG_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      userRole: 'passenger',
      action: `SMS/WhatsApp Alert Subscribed: Train ${trainNumber}`,
      resource: `Alert Service (${channel})`,
      result: 'SUCCESS',
      details: `Threshold: +${thresholdMin} min for ${phone}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const removeSmsAlert = (id: string) => {
    setSmsSubscriptions(prev => prev.filter(s => s.id !== id));
  };

  // Station Staff Category State
  const [platformAssignments, setPlatformAssignments] = useState<PlatformAssignment[]>([
    {
      trainNumber: '12627',
      trainName: 'Karnataka Express',
      platform: 1,
      originalPlatform: 1,
      isReassigned: false,
      eta: '08:29 PM',
      dwellMin: 4,
      conflictStatus: 'NOMINAL'
    },
    {
      trainNumber: '12028',
      trainName: 'Shatabdi Express',
      platform: 2,
      originalPlatform: 2,
      isReassigned: false,
      eta: '08:35 PM',
      dwellMin: 3,
      conflictStatus: 'NOMINAL'
    },
    {
      trainNumber: '16528',
      trainName: 'Yesvantpur Intercity',
      platform: 3,
      originalPlatform: 3,
      isReassigned: false,
      eta: '08:50 PM',
      dwellMin: 2,
      conflictStatus: 'NOMINAL'
    },
    {
      trainNumber: '22691',
      trainName: 'Rajdhani Express',
      platform: 4,
      originalPlatform: 4,
      isReassigned: false,
      eta: '09:05 PM',
      dwellMin: 5,
      conflictStatus: 'NOMINAL'
    }
  ]);

  const reassignPlatform = (trainNumber: string, newPlatform: number, reason: string) => {
    setPlatformAssignments(prev => prev.map(p => {
      if (p.trainNumber === trainNumber) {
        return {
          ...p,
          platform: newPlatform,
          isReassigned: true,
          conflictStatus: 'RESOLVED',
          reassignedBy: 'Station Master (SM-SBC)'
        };
      }
      return p;
    }));

    // Update train object platform
    setTrains(prev => prev.map(t => {
      if (t.number === trainNumber) {
        return { ...t, platform: newPlatform };
      }
      return t;
    }));

    const newLog: AuditLogItem = {
      id: `LOG_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      userRole: 'station_staff',
      action: `Platform Reassigned: Train ${trainNumber} -> PF ${newPlatform}`,
      resource: `Station Track Controller`,
      result: 'SUCCESS',
      details: reason
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const [paAnnouncements, setPaAnnouncements] = useState<PAAnnouncement[]>([
    {
      id: 'PA_01',
      timestamp: '07:28 PM',
      trainNumber: '12627',
      platform: 1,
      language: 'EN',
      message: 'Attention please. Train number 12627 Karnataka Express from Chennai to Bengaluru is arriving on Platform 1. Expected delay 9 minutes.',
      status: 'COMPLETED'
    },
    {
      id: 'PA_02',
      timestamp: '07:31 PM',
      trainNumber: '12627',
      platform: 1,
      language: 'KN',
      message: 'Dayavittu gamanisi. Gadi sankhye 12627 Karnataka Express nildana 1 kke baralide.',
      status: 'COMPLETED'
    }
  ]);

  const broadcastPA = (trainNumber: string, platform: number, message: string, language: 'EN' | 'HI' | 'TA' | 'KN') => {
    const newPA: PAAnnouncement = {
      id: `PA_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      trainNumber,
      platform,
      language,
      message,
      status: 'BROADCASTING'
    };
    setPaAnnouncements(prev => [newPA, ...prev]);

    setTimeout(() => {
      setPaAnnouncements(prev => prev.map(pa => pa.id === newPA.id ? { ...pa, status: 'COMPLETED' } : pa));
    }, 4000);

    const newLog: AuditLogItem = {
      id: `LOG_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      userRole: 'station_staff',
      action: `PA Broadcast Dispatched [${language}]: Train ${trainNumber}`,
      resource: `Platform ${platform} Public Address System`,
      result: 'SUCCESS'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const [gateFlowStatus, setGateFlowStatusState] = useState<{ concourseNorth: 'NORMAL' | 'THROTTLED' | 'HEAVY'; concourseSouth: 'NORMAL' | 'THROTTLED' | 'HEAVY' }>({
    concourseNorth: 'NORMAL',
    concourseSouth: 'THROTTLED'
  });

  const setGateFlowStatus = (gate: 'concourseNorth' | 'concourseSouth', status: 'NORMAL' | 'THROTTLED' | 'HEAVY') => {
    setGateFlowStatusState(prev => ({ ...prev, [gate]: status }));
    const newLog: AuditLogItem = {
      id: `LOG_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      userRole: 'station_staff',
      action: `Crowd Gate Control: ${gate} set to ${status}`,
      resource: `Station Concourse Sensors`,
      result: 'SUCCESS'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const [porterRequests, setPorterRequests] = useState<PorterRequest[]>([
    {
      id: 'REQ_01',
      timestamp: '07:22 PM',
      trainNumber: '12627',
      coach: 'B4',
      seat: '24 (Lower)',
      assistanceType: 'WHEELCHAIR',
      status: 'DISPATCHED'
    },
    {
      id: 'REQ_02',
      timestamp: '07:15 PM',
      trainNumber: '12028',
      coach: 'C2',
      seat: '12',
      assistanceType: 'BATTERY_BUGGY',
      status: 'COMPLETED'
    }
  ]);

  const dispatchPorter = (trainNumber: string, coach: string, seat: string, assistanceType: PorterRequest['assistanceType']) => {
    const newReq: PorterRequest = {
      id: `REQ_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      trainNumber,
      coach,
      seat,
      assistanceType,
      status: 'DISPATCHED'
    };
    setPorterRequests(prev => [newReq, ...prev]);

    const newLog: AuditLogItem = {
      id: `LOG_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      userRole: 'station_staff',
      action: `Porter/Accessibility Dispatched: ${assistanceType}`,
      resource: `Train ${trainNumber} Coach ${coach}`,
      result: 'SUCCESS'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Control Room Category State
  const [precedenceOrders, setPrecedenceOrders] = useState<PrecedenceOrder[]>([
    {
      id: 'PREC_01',
      priorityTrain: '12028 (Shatabdi Express)',
      yieldTrain: '16528 (Intercity)',
      junction: 'Jolarpettai Jn (JTJ)',
      reason: 'Shatabdi High-Speed Premium Corridor Protocol',
      action: 'GREEN_WAVE',
      timestamp: '07:14 PM',
      status: 'ACTIVE'
    }
  ]);

  const issuePrecedenceOrder = (priorityTrain: string, yieldTrain: string, junction: string, reason: string, action: PrecedenceOrder['action']) => {
    const newOrder: PrecedenceOrder = {
      id: `PREC_${Date.now()}`,
      priorityTrain,
      yieldTrain,
      junction,
      reason,
      action,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'ACTIVE'
    };
    setPrecedenceOrders(prev => [newOrder, ...prev]);

    const newLog: AuditLogItem = {
      id: `LOG_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      userRole: 'control_room',
      action: `Precedence Order Issued: ${priorityTrain} over ${yieldTrain}`,
      resource: `Interlocking Junction: ${junction}`,
      result: 'SUCCESS',
      details: reason
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const [cautionOrders, setCautionOrders] = useState<CautionOrder[]>([
    {
      id: 'TSR_01',
      sectionId: 'SEC_AJJ_KPD',
      sectionName: 'Arakkonam Jn - Katpadi Jn',
      speedLimitKmH: 60,
      normalSpeedKmH: 110,
      reason: 'Monsoon track drainage maintenance between km 88 and 92',
      issuedAt: '06:30 PM',
      status: 'ACTIVE'
    }
  ]);

  const issueCautionOrder = (sectionId: string, speedLimitKmH: number, reason: string) => {
    const section = CORRIDOR_SECTIONS.find(s => s.id === sectionId);
    const newCaution: CautionOrder = {
      id: `TSR_${Date.now()}`,
      sectionId,
      sectionName: section ? `${section.fromName} - ${section.toName}` : sectionId,
      speedLimitKmH,
      normalSpeedKmH: 110,
      reason,
      issuedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'ACTIVE'
    };
    setCautionOrders(prev => [newCaution, ...prev]);

    // Recalculate ETA with speed restriction
    setTrains(prev => prev.map(t => ({
      ...t,
      currentSpeedKmH: Math.min(t.currentSpeedKmH, speedLimitKmH),
      predictedDelayMin: t.predictedDelayMin + 3
    })));

    const newLog: AuditLogItem = {
      id: `LOG_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      userRole: 'control_room',
      action: `TSR Caution Order Issued: ${speedLimitKmH} km/h`,
      resource: newCaution.sectionName,
      result: 'SUCCESS',
      details: reason
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const revokeCautionOrder = (id: string) => {
    setCautionOrders(prev => prev.map(c => c.id === id ? { ...c, status: 'REVOKED' } : c));
    const newLog: AuditLogItem = {
      id: `LOG_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      userRole: 'control_room',
      action: `TSR Caution Order Revoked: ${id}`,
      resource: 'Corridor Signaling',
      result: 'SUCCESS'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Admin Category State
  const [modelWeights, setModelWeightsState] = useState<{ xgboost: number; gnn: number; physics: number }>({
    xgboost: 45,
    gnn: 35,
    physics: 20
  });

  const setModelWeights = (weights: { xgboost: number; gnn: number; physics: number }) => {
    setModelWeightsState(weights);
    const newLog: AuditLogItem = {
      id: `LOG_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      userRole: 'admin',
      action: `Model Weights Rebalanced: XGBoost ${weights.xgboost}% | GNN ${weights.gnn}% | Physics ${weights.physics}%`,
      resource: 'Ensemble Meta-Learner v1.4',
      result: 'SUCCESS'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const [telemetrySensors, setTelemetrySensors] = useState<TelemetrySensor[]>([
    {
      id: 'SEN_01',
      name: 'Katpadi Outer Axle Counter 42B',
      location: 'Katpadi Jn Approach km 122',
      type: 'AXLE_COUNTER',
      healthPercent: 99.8,
      latencyMs: 14,
      status: 'ONLINE'
    },
    {
      id: 'SEN_02',
      name: 'Loco GPS Telemetry Unit #12627',
      location: 'Active Engine WAP-7',
      type: 'GPS_LOCO',
      healthPercent: 98.6,
      latencyMs: 18,
      status: 'ONLINE'
    },
    {
      id: 'SEN_03',
      name: 'Arakkonam Signal Interlock Relay Matrix',
      location: 'Arakkonam Cabin North',
      type: 'SIGNAL_CIRCUIT',
      healthPercent: 99.2,
      latencyMs: 22,
      status: 'ONLINE'
    },
    {
      id: 'SEN_04',
      name: 'Kuppam Ghat Anemometer & Rail Wetness',
      location: 'Ghat Section km 245',
      type: 'WEATHER_ANEMOMETER',
      healthPercent: 95.4,
      latencyMs: 38,
      status: 'ONLINE'
    }
  ]);

  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>([
    {
      id: 'POL_01',
      name: 'Passenger Isolation Policy',
      category: 'passenger',
      enforced: true,
      rule: 'Passengers strictly prohibited from dispatch controls, platform switching, or ML configuration.'
    },
    {
      id: 'POL_02',
      name: 'Station Master Track Gate Protocol',
      category: 'station_staff',
      enforced: true,
      rule: 'Only verified Station Staff can execute platform reassignments and local PA broadcasts.'
    },
    {
      id: 'POL_03',
      name: 'Section Traffic Command Authority',
      category: 'control_room',
      enforced: true,
      rule: 'Precedence orders, Caution Orders (TSR), and track blocks strictly restricted to licensed controllers.'
    },
    {
      id: 'POL_04',
      name: 'AI Model & Infrastructure Governance',
      category: 'admin',
      enforced: true,
      rule: 'Ensemble model hyperparameters, telemetry sensor rates, and audit logs restricted to Level 4 Administrators.'
    }
  ]);

  const toggleSecurityPolicy = (policyId: string) => {
    setSecurityPolicies(prev => prev.map(p => p.id === policyId ? { ...p, enforced: !p.enforced } : p));
    const newLog: AuditLogItem = {
      id: `LOG_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      userRole: 'admin',
      action: `Security Policy Toggled: ${policyId}`,
      resource: 'RBAC Access Controller',
      result: 'WARNING'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const [whatIfParams, setWhatIfParamsState] = useState<WhatIfParams>({
    additionalStoppageMin: 10,
    speedRestrictionPercent: 20,
    congestionLevel: 'HIGH',
    weatherCondition: 'RAIN'
  });

  const selectedTrain = useMemo(() => {
    return trains.find(t => t.id === selectedTrainId) || trains[0];
  }, [trains, selectedTrainId]);

  // Derived What-If results
  const whatIfResult = useMemo(() => {
    return ETAPredictionProvider.runWhatIfSimulation(selectedTrain, trains, disruptions, whatIfParams);
  }, [selectedTrain, trains, disruptions, whatIfParams]);

  // Derived dynamic Network Health score
  const networkHealth = useMemo<NetworkHealth>(() => {
    let score = 88;
    const activeCount = disruptions.filter(d => d.isActive).length;
    score -= activeCount * 4;

    const delayedTrains = trains.filter(t => t.predictedDelayMin > 5).length;
    score -= delayedTrains * 2;

    const clampedScore = Math.max(45, Math.min(99, score));
    return {
      overallScore: clampedScore,
      etaStability: clampedScore >= 80 ? 86 : 72,
      congestionIndex: activeCount > 1 ? 74 : 45,
      disruptionLoad: activeCount * 22,
      predictionConfidence: Math.round(trains.reduce((acc, t) => acc + t.confidence, 0) / trains.length),
      activeTrainsCount: 1248,
      onTimePercentage: Math.max(68, Math.min(94, 94 - delayedTrains * 4)),
      atRiskCount: delayedTrains * 3 + activeCount * 2,
      activeDisruptionsCount: activeCount,
      highRiskConnectionsCount: 8 + activeCount * 2
    };
  }, [disruptions, trains]);

  const setWhatIfParams = (params: Partial<WhatIfParams>) => {
    setWhatIfParamsState(prev => ({ ...prev, ...params }));
  };

  const runWhatIf = (customParams?: WhatIfParams) => {
    if (customParams) {
      setWhatIfParamsState(customParams);
    }
  };

  const applyScenario = (scenario: 'normal' | 'signal_delay' | 'heavy_congestion' | 'unscheduled_stoppage' | 'weather_disruption') => {
    setActiveScenario(scenario);

    if (scenario === 'normal') {
      const clearedDisruptions = disruptions.map(d => ({ ...d, isActive: false }));
      setDisruptions(clearedDisruptions);
      setTrains(prev => prev.map(t => {
        if (t.id === '12627') {
          return {
            ...t,
            currentDelayMin: 0,
            predictedDelayMin: 0,
            predictedArrival: '8:20 PM',
            confidence: 96,
            primaryCause: 'Nominal corridor operations'
          };
        }
        return t;
      }));
    } else if (scenario === 'signal_delay') {
      const active = disruptions.map(d => d.id === 'DISR_01' ? { ...d, isActive: true } : d);
      setDisruptions(active);
      setTrains(prev => prev.map(t => {
        if (t.id === '12627') {
          return ETAPredictionProvider.recalculateTrainETA(t, active);
        }
        return t;
      }));
    } else if (scenario === 'heavy_congestion') {
      const active = disruptions.map(d => ({ ...d, isActive: true }));
      setDisruptions(active);
      setTrains(prev => prev.map(t => ETAPredictionProvider.recalculateTrainETA(t, active, {
        additionalStoppageMin: 5,
        speedRestrictionPercent: 30,
        congestionLevel: 'HIGH',
        weatherCondition: 'RAIN'
      })));
    } else if (scenario === 'unscheduled_stoppage') {
      triggerDisruption('UNSCHEDULED_STOP', 'Unscheduled Stoppage at Mukundarayapuram', 'Between AJJ and KPD', 'KPD', 12);
    } else if (scenario === 'weather_disruption') {
      triggerDisruption('WEATHER', 'Severe Monsoon Track Adhesion Loss', 'Katpadi-Jolarpettai Section', 'JTJ', 8);
    }

    // Add audit log
    const newLog: AuditLogItem = {
      id: `LOG_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      userRole: currentRole,
      action: `Applied Corridor Scenario: ${scenario.toUpperCase()}`,
      resource: 'Corridor MAS-SBC',
      result: 'SUCCESS'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const triggerDisruption = (
    type: Disruption['type'],
    title: string,
    location: string,
    stationCode: string,
    impactMin: number
  ) => {
    const newDisr: Disruption = {
      id: `DISR_${Date.now()}`,
      type,
      title,
      location,
      stationCode,
      severity: impactMin > 10 ? 'CRITICAL' : 'HIGH',
      impactMin,
      affectedTrainNumbers: ['12627', '12028'],
      description: `Dynamic operational disruption flagged: ${title} causing approx +${impactMin} min delay.`,
      timestamp: new Date().toLocaleTimeString(),
      source: 'SIMULATION',
      isActive: true
    };

    const updatedDisruptions = [newDisr, ...disruptions];
    setDisruptions(updatedDisruptions);

    // Recalculate trains
    setTrains(prev => prev.map(t => ETAPredictionProvider.recalculateTrainETA(t, updatedDisruptions)));

    // Emit alert
    const newAlert: AlertItem = {
      id: `ALT_${Date.now()}`,
      type: 'ETA_CHANGED',
      title: `Disruption: ${title}`,
      message: `${title} at ${location} (+${impactMin} min). ETA recalculated across corridor.`,
      timeAgo: 'Just now',
      severity: impactMin > 10 ? 'CRITICAL' : 'WARNING',
      trainNumber: '12627'
    };
    setAlerts(prev => [newAlert, ...prev]);

    // Record prediction event
    const newPrediction: PredictionHistoryRecord = {
      id: `PRD_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      trainNumber: '12627',
      stationCode: 'SBC',
      scheduledETA: '08:20 PM',
      predictedETA: '08:34 PM',
      actualETA: 'Pending',
      errorMin: 0.9,
      confidence: 82,
      modelVersion: activeModelVersion,
      primaryFactor: title
    };
    setPredictionHistory(prev => [newPrediction, ...prev]);
  };

  const resetCorridor = () => {
    setTrains(INITIAL_TRAINS);
    setDisruptions(INITIAL_DISRUPTIONS);
    setActiveScenario('signal_delay');
    setAlerts(INITIAL_ALERTS);
    setSelectedTrainId('12627');
    setSelectedStationCode('MAS');
  };

  const createBooking = (data: Omit<Booking, 'id' | 'pnr' | 'status'>): Booking => {
    const pnr = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const newBkg: Booking = {
      ...data,
      id: `BKG_${Date.now()}`,
      pnr,
      status: 'CONFIRMED'
    };
    setBookings(prev => [newBkg, ...prev]);

    const newAlert: AlertItem = {
      id: `ALT_${Date.now()}`,
      type: 'JOURNEY_REMINDER',
      title: `Booking Confirmed: PNR ${pnr}`,
      message: `Confirmed in ${newBkg.seatClass}, Coach ${newBkg.coach} for ${newBkg.trainNumber} ${newBkg.trainName}.`,
      timeAgo: 'Just now',
      severity: 'INFO',
      trainNumber: newBkg.trainNumber
    };
    setAlerts(prev => [newAlert, ...prev]);

    return newBkg;
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  // Interactive 12-Step Guided Walkthrough state machine
  const nextSihStep = () => {
    if (sihStep < 11) {
      applySihStepAction(sihStep + 1);
    }
  };

  const prevSihStep = () => {
    if (sihStep > 0) {
      applySihStepAction(sihStep - 1);
    }
  };

  const applySihStepAction = (step: number) => {
    setSihStep(step);
    switch (step) {
      case 0: // Step 1: Passenger dashboard baseline
        setCurrentRole('passenger');
        break;
      case 1: // Step 2: Live Map
        setCurrentRole('passenger');
        break;
      case 2: // Step 3: Trigger signal stoppage +10 min
        triggerDisruption('SIGNAL_CONGESTION', 'Signal Interlock Stoppage at Katpadi', 'Katpadi Jn Approach', 'KPD', 10);
        setCurrentRole('passenger');
        break;
      case 3: // Step 4: ETA recalculated automatically
        setCurrentRole('passenger');
        break;
      case 4: // Step 5: Why did ETA change?
        setCurrentRole('passenger');
        break;
      case 5: // Step 6: Delay Propagation
        setCurrentRole('control_room');
        break;
      case 6: // Step 7: Station Staff dashboard
        setCurrentRole('station_staff');
        setSelectedStationCode('SBC');
        break;
      case 7: // Step 8: Control Room network view
        setCurrentRole('control_room');
        break;
      case 8: // Step 9: What-If simulator
        setCurrentRole('control_room');
        break;
      case 9: // Step 10: AI Copilot question
        setCopilotOpen(true);
        break;
      case 10: // Step 11: Admin / AI Analytics
        setCopilotOpen(false);
        setCurrentRole('admin');
        break;
      case 11: // Step 12: Voice Assistant query
        setVoiceModalOpen(true);
        break;
      default:
        break;
    }
  };

  const modelMetrics: ModelMetrics = {
    maeMin: 8.7,
    baselineMaeMin: 14.2,
    rmseMin: 12.4,
    baselineRmseMin: 19.4,
    coveragePercent: 94.2,
    avgConfidencePercent: 87.4,
    activeVersion: activeModelVersion,
    totalPredictions24h: 38420,
    latencyMs: 38
  };

  return (
    <RailSyncContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        navigateToRole,
        currentRole,
        setCurrentRole,
        trains,
        selectedTrainId,
        setSelectedTrainId,
        selectedTrain,
        selectedStationCode,
        setSelectedStationCode,
        disruptions,
        networkHealth,
        activeScenario,
        applyScenario,
        whatIfParams,
        setWhatIfParams,
        whatIfResult,
        runWhatIf,
        triggerDisruption,
        resetCorridor,
        bookings,
        createBooking,
        alerts,
        dismissAlert,
        searchModalOpen,
        setSearchModalOpen,
        notificationsOpen,
        setNotificationsOpen,
        sidebarOpen,
        setSidebarOpen,
        copilotOpen,
        setCopilotOpen,
        voiceModalOpen,
        setVoiceModalOpen,
        sihModalOpen,
        setSihModalOpen,
        walkthroughOpen: sihModalOpen,
        setWalkthroughOpen: setSihModalOpen,
        sihStep,
        setSihStep: applySihStepAction,
        nextSihStep,
        prevSihStep,
        modelMetrics,
        predictionHistory,
        auditLogs,
        activeModelVersion,
        setActiveModelVersion,
        demoMode,
        setDemoMode,

        // RBAC & Category Access Guard
        accessGuardState,
        triggerAccessGuard,
        closeAccessGuard,

        // Active Category sub-tabs
        passengerTab,
        setPassengerTab,
        stationTab,
        setStationTab,
        controlTab,
        setControlTab,
        adminTab,
        setAdminTab,

        // Category Exclusive: Passenger
        smsSubscriptions,
        subscribeSmsAlert,
        removeSmsAlert,

        // Category Exclusive: Station Staff
        platformAssignments,
        reassignPlatform,
        paAnnouncements,
        broadcastPA,
        gateFlowStatus,
        setGateFlowStatus,
        porterRequests,
        dispatchPorter,

        // Category Exclusive: Control Room
        precedenceOrders,
        issuePrecedenceOrder,
        cautionOrders,
        issueCautionOrder,
        revokeCautionOrder,

        // Category Exclusive: Admin
        modelWeights,
        setModelWeights,
        telemetrySensors,
        securityPolicies,
        toggleSecurityPolicy
      }}
    >
      {children}
    </RailSyncContext.Provider>
  );
};

export const useRailSync = () => {
  const context = useContext(RailSyncContext);
  if (!context) {
    throw new Error('useRailSync must be used within a RailSyncProvider');
  }
  return context;
};
