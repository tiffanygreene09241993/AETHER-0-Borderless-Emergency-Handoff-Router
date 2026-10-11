import { TelemetryClassification } from '../types/router.ts';

export interface TelemetryPreset {
  id: TelemetryClassification;
  label: string;
  sourceNodeId: string;
  targetNodeId: string;
  priority: 'EMERGENCY_CRITICAL' | 'HIGH_ALERT' | 'ROUTINE_METRIC';
  defaultPayload: Record<string, unknown>;
  description: string;
}

export const TELEMETRY_PRESETS: TelemetryPreset[] = [
  {
    id: 'MASS-CASUALTY',
    label: 'Mass Casualty Field Triage (START Protocol)',
    sourceNodeId: 'UAV-PERIMETER-SWARM',
    targetNodeId: 'HOSPITAL-TRAUMA-CENTER',
    priority: 'EMERGENCY_CRITICAL',
    description: 'High-urgency biometric vitals, blood type, SpO2, and immediate surgical triage priority.',
    defaultPayload: {
      incident_code: 'MCI-ALPHA-09',
      triage_level: 'RED_IMMEDIATE',
      patient_id: 'CAS-8419',
      vitals: {
        heart_rate_bpm: 138,
        systolic_bp_mmhg: 82,
        spo2_percent: 86.4,
        respiratory_rate: 34,
        glasgow_coma_scale: 9,
      },
      injuries: ['Blunt chest trauma', 'Compound femur fracture', 'Tension pneumothorax suspected'],
      gps_fix: {
        lat: 37.7749,
        lng: -122.4194,
        alt_meters: 142.5,
      },
      transport_eta_minutes: 6,
    },
  },
  {
    id: 'SEISMIC-FAULT',
    label: 'Seismic Subduction Fault & Dam Rupture Early Warning',
    sourceNodeId: 'SUBTERRANEAN-VAULT-2',
    targetNodeId: 'METRO-CELL-01',
    priority: 'EMERGENCY_CRITICAL',
    description: 'Subterranean P-wave acceleration vector, hydrostatic pressure spike, and evacuation alert.',
    defaultPayload: {
      sensor_id: 'VLF-FAULT-ACCEL-04',
      primary_wave_velocity_kms: 6.84,
      estimated_magnitude: 7.2,
      epicentral_distance_km: 12.8,
      dam_crest_displacement_mm: 48.2,
      piezometric_head_kpa: 1420.5,
      liquefaction_risk_score: 'CRITICAL_92%',
      recommended_action: 'IMMEDIATE_CREST_EVACUATION_STAGE_3',
      broadcast_ttl_ms: 1200,
    },
  },
  {
    id: 'WILDFIRE-PERIMETER',
    label: 'Wildfire Thermal Front & Drone Infrared Beacon',
    sourceNodeId: 'ALPINE-RF-3',
    targetNodeId: 'METRO-CELL-01',
    priority: 'HIGH_ALERT',
    description: 'Autonomous airborne UAV infrared thermal hotspot centroid, wind shear, and escape corridor breach.',
    defaultPayload: {
      mission_id: 'FIRE-FLIGHT-604',
      thermal_peak_celsius: 742.6,
      rate_of_spread_m_min: 18.4,
      wind_direction_degrees: 285,
      wind_speed_knots: 38.5,
      flame_length_meters: 12.0,
      corridor_alpha_status: 'BREACHED_COMPROMISED',
      safe_egress_azimuth: 142,
      spotting_distance_km: 1.6,
    },
  },
  {
    id: 'GRID-COLLAPSE',
    label: 'Regional Power Grid Substation Blackout Cascade',
    sourceNodeId: 'SUBTERRANEAN-VAULT-2',
    targetNodeId: 'ALPINE-RF-3',
    priority: 'EMERGENCY_CRITICAL',
    description: 'Frequency decay curve, phase angle divergence, and islanding breaker isolation trigger.',
    defaultPayload: {
      substation_id: 'SUB-500KV-CASCADE',
      grid_frequency_hz: 58.74,
      frequency_decay_rate_hz_s: -0.42,
      phase_angle_delta_deg: 44.8,
      bus_voltage_kv: 442.1,
      breaker_trips: ['BKR-501A', 'BKR-502B', 'TIE-01-OPEN'],
      black_start_diesel_status: 'ARMED_SYNC_REQUIRED',
    },
  },
  {
    id: 'MARITIME-SOS',
    label: 'Offshore Vessel Hull Ingress & SOLAS Mayday',
    sourceNodeId: 'MARITIME-BUOY-7',
    targetNodeId: 'SAT-LEO-09',
    priority: 'EMERGENCY_CRITICAL',
    description: 'Acoustic beacon telemetry, bilge ingress rate, raft deployment, and EPIRB coordinates.',
    defaultPayload: {
      mmsi: '338294000',
      vessel_name: 'PACIFIC DEFENDER',
      souls_on_board: 18,
      hull_compartment_ingress_l_min: 650,
      list_angle_degrees: 22.4,
      raft_deployed_count: 2,
      epirb_status: 'ACTIVE_HOMING_406MHZ',
      coordinates: '36°42.12\'N 122°18.45\'W',
      sea_state: 'FORCE_7_GALE',
    },
  },
];
