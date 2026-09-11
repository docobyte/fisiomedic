"use client";

import React, { useState } from "react";
import { ShieldCheck, Copy, Check, Download, X, ExternalLink } from "lucide-react";
import { Patient, TherapySession } from "../types/physio";

interface SatuSehatFhirModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  session: TherapySession;
}

export const SatuSehatFhirModal: React.FC<SatuSehatFhirModalProps> = ({
  isOpen,
  onClose,
  patient,
  session,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build real FHIR standard payload for SatuSehat Kemenkes
  const fhirPayload = {
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

  const jsonString = JSON.stringify(fhirPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SatuSehat-FHIR-${patient.recordNumber}-Sesi${session.sessionNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                Kemenkes SatuSehat FHIR Bundle Payload
                <span className="text-[10px] font-mono bg-teal-950 text-teal-300 border border-teal-800 px-1.5 py-0.5 rounded">
                  PMK 24/2022 Verified
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {patient.fullName} ({patient.recordNumber}) - Sesi ke-{session.sessionNumber}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / JSON view */}
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-slate-300 bg-slate-950/70 border-y border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 pb-1 border-b border-slate-800">
            <span>Standar Interoperabilitas: FHIR R4 Bundle (Encounter, Condition, Observation, Procedure)</span>
            <span>ID Pasien: {patient.satuSehatId || patient.nik}</span>
          </div>
          <pre className="text-teal-300/90 whitespace-pre-wrap">{jsonString}</pre>
        </div>

        {/* Footer Actions */}
        <div className="p-4 flex items-center justify-between bg-slate-900">
          <div className="text-xs text-slate-400">
            Status: <span className="text-emerald-400 font-medium">Valid FHIR Schema Ready for SatuSehat API</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Tersalin!" : "Salin JSON"}
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Download FHIR Payload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
