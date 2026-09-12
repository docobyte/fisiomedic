import { Patient, TherapySession } from "../types/physio";

export function buildSatuSehatFhirBundle(patient: Patient, session: TherapySession) {
  return {
    resourceType: "Bundle",
    type: "transaction",
    timestamp: new Date().toISOString(),
    entry: [
      {
        fullUrl: `urn:uuid:encounter-${session.id}`,
        resource: {
          resourceType: "Encounter",
          status: "finished",
          class: {
            system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
            code: "AMB",
            display: "ambulatory",
          },
          subject: {
            reference: `Patient/${patient.satuSehatId || patient.nik}`,
            display: patient.fullName,
          },
          participant: [
            {
              type: [
                {
                  coding: [
                    {
                      system: "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
                      code: "ATND",
                      display: "attender",
                    },
                  ],
                },
              ],
              individual: {
                reference: `Practitioner/${session.therapistSipf}`,
                display: session.therapistName,
              },
            },
          ],
          period: {
            start: `${session.sessionDate}T08:30:00+07:00`,
            end: `${session.sessionDate}T09:30:00+07:00`,
          },
          serviceProvider: {
            display: "Unit Fisioterapi & Rehabilitasi Medik",
          },
        },
        request: { method: "POST", url: "Encounter" },
      },
      {
        fullUrl: `urn:uuid:condition-${session.id}`,
        resource: {
          resourceType: "Condition",
          clinicalStatus: {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
                code: "active",
              },
            ],
          },
          category: [
            {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/condition-category",
                  code: "encounter-diagnosis",
                  display: "Encounter Diagnosis",
                },
              ],
            },
          ],
          code: {
            coding: [
              {
                system: "http://hl7.org/fhir/sid/icd-10",
                code: session.diagnosis.icd10Code,
                display: session.diagnosis.icd10Description,
              },
            ],
            text: session.diagnosis.physioDiagnosis,
          },
          subject: {
            reference: `Patient/${patient.satuSehatId || patient.nik}`,
          },
          encounter: {
            reference: `urn:uuid:encounter-${session.id}`,
          },
        },
        request: { method: "POST", url: "Condition" },
      },
      {
        fullUrl: `urn:uuid:obs-vas-${session.id}`,
        resource: {
          resourceType: "Observation",
          status: "final",
          category: [
            {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/observation-category",
                  code: "vital-signs",
                },
              ],
            },
          ],
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: "72514-3",
                display: "Pain severity - 0-10 verbal numeric rating scale",
              },
            ],
            text: "Skala Nyeri VAS Fisioterapi (Rest / Motion)",
          },
          subject: {
            reference: `Patient/${patient.satuSehatId || patient.nik}`,
          },
          valueQuantity: {
            value: session.pain.vasMotion,
            unit: "{score}",
            system: "http://unitsofmeasure.org",
            code: "{score}",
          },
          component: [
            {
              code: { text: "VAS Nyeri Diam" },
              valueQuantity: { value: session.pain.vasRest, unit: "{score}" },
            },
            {
              code: { text: "VAS Nyeri Gerak" },
              valueQuantity: { value: session.pain.vasMotion, unit: "{score}" },
            },
            {
              code: { text: "VAS Nyeri Tekan" },
              valueQuantity: { value: session.pain.vasPressure, unit: "{score}" },
            },
          ],
        },
        request: { method: "POST", url: "Observation" },
      },
      ...session.diagnosis.icd9Procedures.map((proc, idx) => ({
        fullUrl: `urn:uuid:procedure-${session.id}-${idx}`,
        resource: {
          resourceType: "Procedure",
          status: "completed",
          code: {
            coding: [
              {
                system: "http://hl7.org/fhir/sid/icd-9-cm",
                code: proc.split(" ")[0],
                display: proc,
              },
            ],
            text: `Tindakan Fisioterapi: ${proc}`,
          },
          subject: {
            reference: `Patient/${patient.satuSehatId || patient.nik}`,
          },
          performer: [
            {
              actor: {
                reference: `Practitioner/${session.therapistSipf}`,
                display: session.therapistName,
              },
            },
          ],
        },
        request: { method: "POST", url: "Procedure" },
      })),
    ],
  };
}

export function getFhirFilename(recordNumber: string, sessionNumber: number): string {
  const cleanRm = recordNumber.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `SatuSehat-FHIR-${cleanRm}-Sesi${sessionNumber}.json`;
}
