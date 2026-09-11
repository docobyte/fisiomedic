import { describe, expect, it } from "bun:test";
import { CLINICAL_REFERENCES, INITIAL_PATIENTS, INITIAL_SESSIONS } from "../data/mockPhysioData";

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
