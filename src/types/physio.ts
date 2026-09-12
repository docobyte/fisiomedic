export type InsuranceType = "BPJS" | "UMUM" | "ASURANSI_SWASTA";
export type Gender = "M" | "F";
export type EndFeel = "Soft (Normal)" | "Firm (Normal)" | "Hard (Normal)" | "Empty (Nyeri/Spasme)" | "Springy (Meniskus)";

export interface Patient {
  id: string;
  recordNumber: string;
  nik: string;
  fullName: string;
  birthDate: string;
  gender: Gender;
  phoneNumber: string;
  address: string;
  insuranceType: InsuranceType;
  bpjsCardNumber?: string;
  referralSource?: string;
  satuSehatId?: string;
  registeredAt: string;
}

export interface PainAssessment {
  vasRest: number; // 0-10
  vasMotion: number; // 0-10
  vasPressure: number; // 0-10
  primaryPainRegion: string;
  painCharacteristics: string[];
  aggravatingFactors: string;
  relievingFactors: string;
}

export interface BodyRegion {
  id: string;
  name: string;
  side: "Kanan" | "Kiri" | "Tengah";
  x: number;
  y: number;
}

export interface GoniometryRom {
  id: string;
  joint: string;
  movement: string;
  side: "Dextra" | "Sinistra";
  activeDegrees: number;
  passiveDegrees: number;
  normalDegrees: number;
  endFeel: EndFeel;
}

export interface MuscleTest {
  id: string;
  muscleGroup: string;
  side: "Dextra" | "Sinistra";
  grade: number; // 0-5
}

export interface SpecialTest {
  id: string;
  name: string;
  targetJoint: string;
  result: "Positif (+)" | "Negatif (-)";
  clinicalIndication: string;
}

export interface ClinicalDiagnosis {
  physioDiagnosis: string;
  icd10Code: string;
  icd10Description: string;
  icd9Procedures: string[];
  icfImpairment: string;
  icfActivity: string;
  icfParticipation: string;
  shortTermGoal: string;
  longTermGoal: string;
}

export interface ModalityItem {
  id: string;
  type: "TENS" | "ULTRASOUND" | "INFRARED" | "SWD" | "LASER" | "CRYOTHERAPY" | "ES_FARADIK";
  dose: string;
  durationMinutes: number;
  targetArea: string;
}

export interface InterventionPlan {
  modalities: ModalityItem[];
  manualTherapy: string[];
  exerciseTherapy: string[];
  homeProgram: string;
  ergonomicAdvice: string;
  nextSessionDate?: string;
}

export interface TherapySession {
  id: string;
  patientId: string;
  sessionNumber: number;
  totalSessionsTarget: number;
  sessionDate: string;
  therapistName: string;
  therapistSipf: string;
  vitalSigns: {
    bloodPressure: string;
    heartRate: number;
    respiratoryRate: number;
    temperature: number;
  };
  pain: PainAssessment;
  bodyRegions: string[];
  goniometry: GoniometryRom[];
  muscleTests: MuscleTest[];
  specialTests: SpecialTest[];
  diagnosis: ClinicalDiagnosis;
  intervention: InterventionPlan;
  notes: string;
  satuSehatSynced: boolean;
  satuSehatBundleId?: string;
  billingStatus: "LUNAS" | "PENDING" | "KLAIM_BPJS";
  totalCost: number;
}

export interface ClinicalReference {
  icd10Code: string;
  name: string;
  category: "Muskuloskeletal" | "Neuromuskuler" | "Kardiopulmonal" | "Pediatri / Geriatri";
  typicalIcd9: string[];
  recommendedModalities: string[];
}

export interface AppointmentItem {
  id: string;
  patientId: string;
  patientName: string;
  recordNumber: string;
  insuranceType: InsuranceType;
  bpjsCardNumber?: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm WIB
  sessionNumber: number;
  totalQuota: number;
  therapistName: string;
  therapistSipf: string;
  room: string;
  diagnosisSnippet: string;
  status: "TERJADWAL" | "SELESAI" | "KONSULTASI_DOKTER";
}

