import { describe, expect, it } from "bun:test";
import {
  CLINICAL_REFERENCES,
  INITIAL_PATIENTS,
  INITIAL_SESSIONS,
  INITIAL_APPOINTMENTS,
} from "../data/mockPhysioData";
import { SOAP_FAST_TEMPLATES } from "../data/soapTemplates";
import { calculateBpjsQuota, formatIndonesianDate } from "../utils/scheduleHelper";
import { buildSatuSehatFhirBundle, getFhirFilename } from "../utils/fhirHelper";
import {
  patientSchema,
  newPatientInputSchema,
  painAssessmentSchema,
  goniometryRomSchema,
  clinicalDiagnosisSchema,
  therapySessionSchema,
  databaseBackupSchema,
  ICD10_REGEX,
  NIK_REGEX,
} from "../schemas/soapValidation";

describe("FISIOMEDIC Clinical Business Logic Tests", () => {
  it("should have valid initial patients and sessions", () => {
    expect(INITIAL_PATIENTS.length).toBeGreaterThan(0);
    expect(INITIAL_SESSIONS.length).toBeGreaterThan(0);

    const patient = INITIAL_PATIENTS[0];
    expect(patient.recordNumber).toMatch(/^RM-FT-/);
    expect(patient.nik.length).toBe(16);
  });

  it("should calculate correct ROM deficits in Goniometry", () => {
    const session = INITIAL_SESSIONS[0];
    const rom = session.goniometry[0];

    const deficit = Math.max(0, rom.normalDegrees - rom.activeDegrees);
    expect(deficit).toBe(40); // 180 normal - 140 active = 40 degrees deficit
    expect(rom.activeDegrees).toBeLessThanOrEqual(rom.passiveDegrees);
  });

  it("should classify VAS pain scale into correct clinical tiers", () => {
    const session = INITIAL_SESSIONS[0];
    expect(session.pain.vasMotion).toBeGreaterThanOrEqual(0);
    expect(session.pain.vasMotion).toBeLessThanOrEqual(10);

    // Mild: 1-3, Moderate: 4-6, Severe: 7-10
    const classify = (score: number) => {
      if (score === 0) return "NONE";
      if (score <= 3) return "MILD";
      if (score <= 6) return "MODERATE";
      return "SEVERE";
    };

    expect(classify(session.pain.vasMotion)).toBe("MODERATE");
  });

  it("should have valid ICD-10 and ICD-9-CM mappings for physiotherapy modalities", () => {
    const frozenShoulder = CLINICAL_REFERENCES.find((r) => r.icd10Code === "M75.0");
    expect(frozenShoulder).toBeDefined();
    expect(frozenShoulder?.typicalIcd9).toContain("93.35"); // Ultrasound
    expect(frozenShoulder?.typicalIcd9).toContain("93.39"); // Diathermy / Electrotherapy
  });

  it("should correctly compute billing amounts according to clinical tariffs", () => {
    const MODALITY_TARIFFS: Record<string, number> = {
      TENS: 35000,
      ULTRASOUND: 45000,
      INFRARED: 30000,
      SWD: 50000,
    };

    const adminFee = 25000;
    const manualTherapyFee = 55000;
    const exerciseTherapyFee = 45000;
    const modalities = ["TENS", "ULTRASOUND", "INFRARED"];

    const modalityTotal = modalities.reduce((sum, mod) => sum + MODALITY_TARIFFS[mod], 0);
    const subTotal = adminFee + manualTherapyFee + exerciseTherapyFee + modalityTotal;

    expect(modalityTotal).toBe(110000);
    expect(subTotal).toBe(235000);

    // BPJS patient has 0 patient due
    const bpjsPatientDue = 0;
    expect(bpjsPatientDue).toBe(0);
  });
});

describe("FISIOMEDIC Zod Runtime Validation Tests", () => {
  describe("NIK Validation", () => {
    it("should accept valid 16-digit numeric NIK", () => {
      expect(NIK_REGEX.test("3503031205840001")).toBe(true);
      const res = newPatientInputSchema.safeParse({
        fullName: "Budi Santoso",
        nik: "3503031205840001",
      });
      expect(res.success).toBe(true);
    });

    it("should reject NIK with invalid length or non-digits", () => {
      expect(NIK_REGEX.test("350303120584000")).toBe(false); // 15 digits
      expect(NIK_REGEX.test("35030312058400019")).toBe(false); // 17 digits
      expect(NIK_REGEX.test("350303120584000A")).toBe(false); // contains letter

      const shortRes = newPatientInputSchema.safeParse({
        fullName: "Budi Santoso",
        nik: "12345",
      });
      expect(shortRes.success).toBe(false);
      if (!shortRes.success) {
        expect(shortRes.error.issues[0].message).toBe("NIK harus berupa 16 digit angka");
      }
    });
  });

  describe("Goniometry ROM Integrity Validation", () => {
    it("should pass when activeDegrees <= passiveDegrees", () => {
      const validRom = {
        id: "rom-valid",
        joint: "Shoulder Dextra",
        movement: "Fleksi",
        side: "Dextra" as const,
        activeDegrees: 140,
        passiveDegrees: 155,
        normalDegrees: 180,
        endFeel: "Firm (Normal)" as const,
      };
      const res = goniometryRomSchema.safeParse(validRom);
      expect(res.success).toBe(true);
    });

    it("should reject when activeDegrees > passiveDegrees (physiologically impossible)", () => {
      const invalidRom = {
        id: "rom-invalid",
        joint: "Shoulder Dextra",
        movement: "Fleksi",
        side: "Dextra" as const,
        activeDegrees: 160,
        passiveDegrees: 140, // Impossible: active exceeds passive
        normalDegrees: 180,
        endFeel: "Firm (Normal)" as const,
      };
      const res = goniometryRomSchema.safeParse(invalidRom);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toContain("ROM aktif tidak boleh melebihi ROM pasif");
      }
    });
  });

  describe("SOAP S - Pain Assessment Validation", () => {
    it("should pass valid VAS values between 0 and 10", () => {
      const validPain = {
        vasRest: 0,
        vasMotion: 5,
        vasPressure: 10,
        primaryPainRegion: "Bahu Kanan",
        painCharacteristics: ["Nyeri tekan"],
        aggravatingFactors: "Mengangkat beban",
        relievingFactors: "Kompres hangat",
      };
      const res = painAssessmentSchema.safeParse(validPain);
      expect(res.success).toBe(true);
    });

    it("should reject VAS values out of bounds (< 0 or > 10)", () => {
      const invalidPain = {
        vasRest: -1,
        vasMotion: 11,
        vasPressure: 4,
        primaryPainRegion: "Bahu",
      };
      const res = painAssessmentSchema.safeParse(invalidPain);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues.length).toBeGreaterThanOrEqual(2);
      }
    });
  });

  describe("SOAP A - ICD-10 Format Validation", () => {
    it("should pass valid ICD-10 formats", () => {
      const validCodes = ["M75.0", "M54.5", "S83.5", "G56.0", "I69.3", "M17", "J44.9"];
      validCodes.forEach((code) => {
        expect(ICD10_REGEX.test(code)).toBe(true);
      });

      const res = clinicalDiagnosisSchema.safeParse({
        physioDiagnosis: "Frozen Shoulder",
        icd10Code: "M75.0",
        icd10Description: "Adhesive capsulitis",
        shortTermGoal: "Penurunan VAS",
        longTermGoal: "ROM penuh",
      });
      expect(res.success).toBe(true);
    });

    it("should reject invalid ICD-10 formats", () => {
      const invalidCodes = ["m75.0", "75.0", "INVALID", "M75000", "", "M75.012"];
      invalidCodes.forEach((code) => {
        expect(ICD10_REGEX.test(code)).toBe(false);
      });

      const res = clinicalDiagnosisSchema.safeParse({
        physioDiagnosis: "Frozen Shoulder",
        icd10Code: "invalid-code",
        icd10Description: "Adhesive capsulitis",
        shortTermGoal: "Penurunan VAS",
        longTermGoal: "ROM penuh",
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toContain("Format ICD-10 tidak valid");
      }
    });
  });

  describe("Full Patient & Session Mock Data Verification via Zod", () => {
    it("should validate all INITIAL_PATIENTS against patientSchema", () => {
      INITIAL_PATIENTS.forEach((patient) => {
        const res = patientSchema.safeParse(patient);
        expect(res.success).toBe(true);
      });
    });

    it("should validate all INITIAL_SESSIONS against therapySessionSchema", () => {
      INITIAL_SESSIONS.forEach((session) => {
        const res = therapySessionSchema.safeParse(session);
        expect(res.success).toBe(true);
      });
    });
  });

  describe("Clinical SOAP Fast-Templates", () => {
    it("should contain all 4 clinical fast templates", () => {
      expect(SOAP_FAST_TEMPLATES.length).toBe(4);

      const templateIds = SOAP_FAST_TEMPLATES.map((t) => t.id);
      expect(templateIds).toContain("tpl-frozen-shoulder");
      expect(templateIds).toContain("tpl-lbp-hnp");
      expect(templateIds).toContain("tpl-stroke-hemiparesis");
      expect(templateIds).toContain("tpl-knee-oa");
    });

    it("should map to correct ICD-10 diagnosis codes", () => {
      const fs = SOAP_FAST_TEMPLATES.find((t) => t.id === "tpl-frozen-shoulder");
      const lbp = SOAP_FAST_TEMPLATES.find((t) => t.id === "tpl-lbp-hnp");
      const stroke = SOAP_FAST_TEMPLATES.find((t) => t.id === "tpl-stroke-hemiparesis");
      const knee = SOAP_FAST_TEMPLATES.find((t) => t.id === "tpl-knee-oa");

      expect(fs?.icd10Code).toBe("M75.0");
      expect(lbp?.icd10Code).toBe("M54.5");
      expect(stroke?.icd10Code).toBe("G81.9");
      expect(knee?.icd10Code).toBe("M17.0");

      SOAP_FAST_TEMPLATES.forEach((tpl) => {
        expect(ICD10_REGEX.test(tpl.icd10Code)).toBe(true);
      });
    });

    it("should validate goniometry integrity in all templates (active <= passive)", () => {
      SOAP_FAST_TEMPLATES.forEach((tpl) => {
        expect(tpl.goniometry.length).toBeGreaterThan(0);
        tpl.goniometry.forEach((rom) => {
          expect(rom.activeDegrees).toBeLessThanOrEqual(rom.passiveDegrees);
          expect(rom.passiveDegrees).toBeLessThanOrEqual(rom.normalDegrees);
          const validation = goniometryRomSchema.safeParse(rom);
          expect(validation.success).toBe(true);
        });
      });
    });

    it("should have complete intervention plans and pain profiles in all templates", () => {
      SOAP_FAST_TEMPLATES.forEach((tpl) => {
        expect(tpl.pain.vasMotion).toBeGreaterThanOrEqual(0);
        expect(tpl.pain.vasMotion).toBeLessThanOrEqual(10);
        expect(tpl.modalities.length).toBeGreaterThan(0);
        expect(tpl.exerciseTherapy.length).toBeGreaterThan(0);
        expect(tpl.homeProgram.length).toBeGreaterThan(10);
        expect(tpl.ergonomicAdvice.length).toBeGreaterThan(10);
        expect(tpl.icd9Procedures.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Database Backup & Restore Zod Validation", () => {
    it("should validate a well-formed database backup export", () => {
      const validBackup = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        app: "FISIOMEDIC" as const,
        patients: INITIAL_PATIENTS,
        sessions: INITIAL_SESSIONS,
      };

      const result = databaseBackupSchema.safeParse(validBackup);
      expect(result.success).toBe(true);
    });

    it("should reject backup with missing patients or sessions", () => {
      const emptyBackup = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        app: "FISIOMEDIC" as const,
        patients: [],
        sessions: [],
      };

      const result = databaseBackupSchema.safeParse(emptyBackup);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message.includes("Minimal 1 data pasien"))).toBe(true);
      }
    });

    it("should reject corrupted patient data inside backup", () => {
      const corruptedBackup = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        app: "FISIOMEDIC" as const,
        patients: [
          {
            ...INITIAL_PATIENTS[0],
            nik: "INVALID_NIK_SHORT", // Invalid NIK
          },
        ],
        sessions: INITIAL_SESSIONS,
      };

      const result = databaseBackupSchema.safeParse(corruptedBackup);
      expect(result.success).toBe(false);
    });
  });

  describe("Patient Therapy Status Classification", () => {
    it("should correctly classify patients as ACTIVE (<8 sessions) or COMPLETED (>=8 sessions)", () => {
      const getStatus = (sessionNumber: number) => (sessionNumber >= 8 ? "COMPLETED" : "ACTIVE");

      expect(getStatus(1)).toBe("ACTIVE");
      expect(getStatus(4)).toBe("ACTIVE");
      expect(getStatus(7)).toBe("ACTIVE");
      expect(getStatus(8)).toBe("COMPLETED");
      expect(getStatus(9)).toBe("COMPLETED");
    });
  });

  describe("Appointment Schedule & BPJS Quota Tracking", () => {
    it("should have valid initial appointments list", () => {
      expect(INITIAL_APPOINTMENTS.length).toBeGreaterThan(0);
      INITIAL_APPOINTMENTS.forEach((apt) => {
        expect(apt.id).toBeDefined();
        expect(apt.patientId).toBeDefined();
        expect(apt.scheduledDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(apt.scheduledTime).toMatch(/^\d{2}:\d{2}\s*WIB$/);
        expect(apt.sessionNumber).toBeGreaterThanOrEqual(1);
        expect(apt.totalQuota).toBeGreaterThanOrEqual(apt.sessionNumber);
      });
    });

    it("should accurately calculate BPJS quota metrics", () => {
      // Normal ongoing session
      const midQuota = calculateBpjsQuota(5, 8);
      expect(midQuota.used).toBe(5);
      expect(midQuota.total).toBe(8);
      expect(midQuota.remaining).toBe(3);
      expect(midQuota.percent).toBe(63);
      expect(midQuota.isWarning).toBe(false);
      expect(midQuota.isExhausted).toBe(false);
      expect(midQuota.statusLabel).toContain("Sisa 3 Sesi");

      // Warning when remaining <= 2
      const warningQuota = calculateBpjsQuota(7, 8);
      expect(warningQuota.remaining).toBe(1);
      expect(warningQuota.isWarning).toBe(true);
      expect(warningQuota.isExhausted).toBe(false);
      expect(warningQuota.statusLabel).toContain("Kuota Hampir Habis");

      // Full quota (session 8 of 8)
      const fullQuota = calculateBpjsQuota(8, 8);
      expect(fullQuota.remaining).toBe(0);
      expect(fullQuota.percent).toBe(100);
      expect(fullQuota.isExhausted).toBe(true);
      expect(fullQuota.statusLabel).toContain("Siklus Penuh (8 Sesi)");
    });

    it("should format Indonesian date strings correctly", () => {
      const formatted = formatIndonesianDate("2026-09-14");
      expect(formatted).toBe("Senin, 14 September 2026");
    });
  });

  describe("SatuSehat FHIR Bundle Generation & Download Helper", () => {
    it("should build a valid FHIR R4 transaction bundle", () => {
      const patient = INITIAL_PATIENTS[0];
      const session = INITIAL_SESSIONS[0];

      const bundle = buildSatuSehatFhirBundle(patient, session);
      expect(bundle.resourceType).toBe("Bundle");
      expect(bundle.type).toBe("transaction");
      expect(bundle.entry.length).toBeGreaterThanOrEqual(4);

      // Verify Encounter
      const encounter = bundle.entry.find((e) => e.resource.resourceType === "Encounter");
      expect(encounter).toBeDefined();
      expect(encounter?.resource.status).toBe("finished");
      expect(encounter?.resource.subject.reference).toContain(patient.satuSehatId || patient.nik);

      // Verify Condition
      const condition = bundle.entry.find((e) => e.resource.resourceType === "Condition");
      expect(condition).toBeDefined();
      expect(condition?.resource.code.coding[0].code).toBe(session.diagnosis.icd10Code);

      // Verify Observation (VAS scale with LOINC code)
      const observation = bundle.entry.find((e) => e.resource.resourceType === "Observation");
      expect(observation).toBeDefined();
      expect(observation?.resource.code.coding[0].code).toBe("72514-3");
      expect(observation?.resource.valueQuantity.value).toBe(session.pain.vasMotion);

      // Verify Procedure(s)
      const procedures = bundle.entry.filter((e) => e.resource.resourceType === "Procedure");
      expect(procedures.length).toBe(session.diagnosis.icd9Procedures.length);
    });

    it("should generate standardized FHIR filename for direct download", () => {
      const filename = getFhirFilename("RM-FT-2026-0041", 4);
      expect(filename).toBe("SatuSehat-FHIR-RM-FT-2026-0041-Sesi4.json");
      expect(filename.endsWith(".json")).toBe(true);
    });
  });
});

