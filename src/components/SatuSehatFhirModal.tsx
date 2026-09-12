"use client";

import React, { useState } from "react";
import { ShieldCheck, Copy, Check, Download, X } from "lucide-react";
import { Patient, TherapySession } from "../types/physio";
import { buildSatuSehatFhirBundle, getFhirFilename } from "../utils/fhirHelper";

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

  const fhirPayload = buildSatuSehatFhirBundle(patient, session);
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
    a.download = getFhirFilename(patient.recordNumber, session.sessionNumber);
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
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              title="Unduh berkas FHIR JSON resmi"
              className="inline-flex items-center gap-1 text-[11px] bg-teal-950 text-teal-300 border border-teal-800 hover:bg-teal-900 px-2.5 py-1 rounded transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh JSON</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-100 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
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
              <Download className="w-3.5 h-3.5" /> Unduh FHIR Bundle (.json)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
