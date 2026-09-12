import { z } from "zod";

// 1. Regex Constants
export const NIK_REGEX = /^\d{16}$/;
export const ICD10_REGEX = /^[A-Z][0-9]{2}(\.[0-9]{1,2})?$/;
export const RECORD_NUMBER_REGEX = /^RM-FT-\d{4}-\d{4}$/;
export const BLOOD_PRESSURE_REGEX = /^\d{2,3}\/\d{2,3}\s*mmHg$/;

// 2. Patient Schemas
export const insuranceTypeSchema = z.enum(["BPJS", "UMUM", "ASURANSI_SWASTA"]);
export const genderSchema = z.enum(["M", "F"]);

export const patientSchema = z.object({
  id: z.string().min(1, "ID pasien wajib diisi"),
  recordNumber: z.string().min(1, "Nomor rekam medis wajib diisi"),
  nik: z.string().regex(NIK_REGEX, "NIK harus berupa 16 digit angka"),
  fullName: z.string().trim().min(1, "Nama lengkap pasien wajib diisi"),
  birthDate: z.string().min(1, "Tanggal lahir wajib diisi"),
  gender: genderSchema,
  phoneNumber: z.string().min(8, "Nomor telepon minimal 8 digit"),
  address: z.string().min(1, "Alamat wajib diisi"),
  insuranceType: insuranceTypeSchema,
  bpjsCardNumber: z.string().optional(),
  referralSource: z.string().optional(),
  satuSehatId: z.string().optional(),
  registeredAt: z.string().min(1, "Tanggal registrasi wajib diisi"),
});

export const newPatientInputSchema = z.object({
  fullName: z.string().trim().min(1, "Nama lengkap pasien wajib diisi"),
  nik: z.string().regex(NIK_REGEX, "NIK harus berupa 16 digit angka"),
  birthDate: z.string().optional(),
  gender: genderSchema.default("M"),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  insuranceType: insuranceTypeSchema.default("BPJS"),
  bpjsCardNumber: z.string().optional(),
  referralSource: z.string().optional(),
});

// 3. SOAP - S (Subjective)
export const painAssessmentSchema = z.object({
  vasRest: z.number().min(0, "VAS minimal 0").max(10, "VAS maksimal 10"),
  vasMotion: z.number().min(0, "VAS minimal 0").max(10, "VAS maksimal 10"),
  vasPressure: z.number().min(0, "VAS minimal 0").max(10, "VAS maksimal 10"),
  primaryPainRegion: z.string().min(1, "Area keluhan utama wajib diisi"),
  painCharacteristics: z.array(z.string()).default([]),
  aggravatingFactors: z.string().default(""),
  relievingFactors: z.string().default(""),
});

// 4. SOAP - O (Objective)
export const endFeelSchema = z.enum([
  "Soft (Normal)",
  "Firm (Normal)",
  "Hard (Normal)",
  "Empty (Nyeri/Spasme)",
  "Springy (Meniskus)",
]);

export const goniometryRomSchema = z
  .object({
    id: z.string().min(1),
    joint: z.string().min(1, "Sendi wajib diisi"),
    movement: z.string().min(1, "Gerakan wajib diisi"),
    side: z.enum(["Dextra", "Sinistra"]),
    activeDegrees: z.number().min(0, "Derajat aktif tidak boleh negatif"),
    passiveDegrees: z.number().min(0, "Derajat pasif tidak boleh negatif"),
    normalDegrees: z.number().positive("Derajat normal harus positif"),
    endFeel: endFeelSchema,
  })
  .refine((data) => data.activeDegrees <= data.passiveDegrees, {
    message: "ROM aktif tidak boleh melebihi ROM pasif secara fisiologis",
    path: ["activeDegrees"],
  });

export const muscleTestSchema = z.object({
  id: z.string().min(1),
  muscleGroup: z.string().min(1, "Grup otot wajib diisi"),
  side: z.enum(["Dextra", "Sinistra"]),
  grade: z.number().int().min(0, "Nilai MMT minimal 0").max(5, "Nilai MMT maksimal 5"),
});

export const specialTestSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Nama tes khusus wajib diisi"),
  targetJoint: z.string().min(1, "Sendi target wajib diisi"),
  result: z.enum(["Positif (+)", "Negatif (-)"]),
  clinicalIndication: z.string().min(1, "Indikasi klinis wajib diisi"),
});

export const vitalSignsSchema = z.object({
  bloodPressure: z.string().min(1, "Tekanan darah wajib diisi"),
  heartRate: z.number().int().min(30, "Heart rate minimal 30 bpm").max(250, "Heart rate maksimal 250 bpm"),
  respiratoryRate: z.number().int().min(8, "Respiratory rate minimal 8").max(60, "Respiratory rate maksimal 60"),
  temperature: z.number().min(30, "Suhu minimal 30 C").max(45, "Suhu maksimal 45 C"),
});

// 5. SOAP - A (Assessment)
export const clinicalDiagnosisSchema = z.object({
  physioDiagnosis: z.string().min(1, "Diagnosis fisioterapi wajib diisi"),
  icd10Code: z.string().regex(ICD10_REGEX, "Format ICD-10 tidak valid (contoh: M75.0, M54.5)"),
  icd10Description: z.string().min(1, "Deskripsi ICD-10 wajib diisi"),
  icd9Procedures: z.array(z.string()).default([]),
  icfImpairment: z.string().default(""),
  icfActivity: z.string().default(""),
  icfParticipation: z.string().default(""),
  shortTermGoal: z.string().min(1, "Target jangka pendek wajib diisi"),
  longTermGoal: z.string().min(1, "Target jangka panjang wajib diisi"),
});

// 6. SOAP - P (Plan)
export const modalityItemSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["TENS", "ULTRASOUND", "INFRARED", "SWD", "LASER", "CRYOTHERAPY", "ES_FARADIK"]),
  dose: z.string().min(1, "Dosis modalitas wajib diisi"),
  durationMinutes: z.number().positive("Durasi modalitas minimal 1 menit"),
  targetArea: z.string().min(1, "Area target modalitas wajib diisi"),
});

export const interventionPlanSchema = z.object({
  modalities: z.array(modalityItemSchema).default([]),
  manualTherapy: z.array(z.string()).default([]),
  exerciseTherapy: z.array(z.string()).default([]),
  homeProgram: z.string().default(""),
  ergonomicAdvice: z.string().default(""),
  nextSessionDate: z.string().optional(),
});

// 7. Full Therapy Session Schema
export const therapySessionSchema = z.object({
  id: z.string().min(1),
  patientId: z.string().min(1),
  sessionNumber: z.number().int().min(1, "Sesi minimal ke-1").max(20, "Sesi maksimal ke-20"),
  totalSessionsTarget: z.number().int().min(1).max(20),
  sessionDate: z.string().min(1, "Tanggal sesi wajib diisi"),
  therapistName: z.string().min(1, "Nama fisioterapis wajib diisi"),
  therapistSipf: z.string().min(1, "SIPF fisioterapis wajib diisi"),
  vitalSigns: vitalSignsSchema,
  pain: painAssessmentSchema,
  bodyRegions: z.array(z.string()).default([]),
  goniometry: z.array(goniometryRomSchema).default([]),
  muscleTests: z.array(muscleTestSchema).default([]),
  specialTests: z.array(specialTestSchema).default([]),
  diagnosis: clinicalDiagnosisSchema,
  intervention: interventionPlanSchema,
  notes: z.string().default(""),
  satuSehatSynced: z.boolean().default(false),
  satuSehatBundleId: z.string().optional(),
  billingStatus: z.enum(["LUNAS", "PENDING", "KLAIM_BPJS"]),
  totalCost: z.number().min(0),
});

// 8. Database Backup & Restore Schema
export const databaseBackupSchema = z.object({
  version: z.string().default("1.0"),
  exportedAt: z.string().min(1, "Waktu ekspor wajib ada"),
  app: z.literal("FISIOMEDIC").default("FISIOMEDIC"),
  patients: z.array(patientSchema).min(1, "Minimal 1 data pasien dalam backup"),
  sessions: z.array(therapySessionSchema).min(1, "Minimal 1 data sesi dalam backup"),
});

export type PatientValidation = z.infer<typeof patientSchema>;
export type NewPatientInput = z.infer<typeof newPatientInputSchema>;
export type TherapySessionValidation = z.infer<typeof therapySessionSchema>;
export type GoniometryRomValidation = z.infer<typeof goniometryRomSchema>;
export type PainAssessmentValidation = z.infer<typeof painAssessmentSchema>;
export type ClinicalDiagnosisValidation = z.infer<typeof clinicalDiagnosisSchema>;
export type DatabaseBackupValidation = z.infer<typeof databaseBackupSchema>;
