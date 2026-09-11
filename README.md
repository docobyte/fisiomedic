# FISIOMEDIC — SIMRS & EMR Fisioterapi Indonesia

Sistem Informasi Manajemen Klinik & Praktik Mandiri Fisioterapi Indonesia (SIMRS / EMR Fisioterapi) berbasis standar **Permenkes No. 65 Tahun 2015**, **PMK No. 24 Tahun 2022 (RME Kemenkes SatuSehat)**, dan panduan klinis **Ikatan Fisioterapi Indonesia (IFI)**.

---

## Modul & Fitur Klinis

### 1. Manajemen Rekam Medis Pasien (EMR)
- Registrasi identitas: NIK (16 digit), No. Rekam Medis (RM), Tanggal Lahir, Gender, Alamat, No Telepon.
- Penjamin: BPJS Kesehatan (Bridging VClaim / PCare), Pasien Umum, dan Asuransi Swasta.
- Pelacakan kuota rujukan BPJS (maksimal 2x/minggu atau 8x/bulan sesuai ketentuan rehabilitasi medik).

### 2. SOAP Assessment & Pemeriksaan Klinis Fisioterapi
- **S (Subjective)**:
  - Anamnesis: Keluhan utama, onset, riwayat trauma/operasi, faktor pemberat & peringan.
  - **Skala Nyeri VAS / NRS (Visual Analog Scale)**: Evaluasi terpisah untuk Nyeri Diam (Rest), Nyeri Gerak (Motion), dan Nyeri Tekan (Pressure) skala 0-10.
  - **Body Chart Anatomi Interaktif**: Peta anatomi (Anterior & Posterior) untuk menandai lokasi nyeri secara visual.
- **O (Objective)**:
  - Tanda Vital: Tekanan Darah, Heart Rate, Frekuensi Napas, Suhu.
  - **Goniometri Digital (Range of Motion / ROM)**: Derajat gerak aktif vs pasif vs normal sendi (Shoulder, Elbow, Wrist, Hip, Knee, Ankle, Spine) disertai analisis defisit dan end-feel.
  - **Manual Muscle Testing (MMT)**: Pengujian kekuatan otot skala 0 s/d 5 (Oxford Scale).
  - Tes Khusus Fisioterapi: Lachman, Drawer, Phalen, Tinel, Lasegue/SLR, Neer, Patrick/FABER.
- **A (Assessment & Diagnosis)**:
  - Diagnosis Fisioterapi IFI & ICD-10 (M75.0 Frozen Shoulder, M54.5 LBP, S83.5 ACL, G56.0 CTS, I69.3 Pasca Stroke, M17.0 OA Genu).
  - Kerangka ICF (International Classification of Functioning): Impairment tubuh, Activity limitation, dan Participation restriction.
  - Target Fungsional Jangka Pendek & Jangka Panjang.
- **P (Plan & Intervensi)**:
  - Modalitas Elektro-Fisika: TENS, Ultrasound (US), Infrared (IRR), Short Wave Diathermy (SWD), Cryotherapy, ES Faradik.
  - Manual Therapy: Mobilisasi Sendi Maitland, Scapulothoracic mobilization, Myofascial Release.
  - Terapi Latihan: McKenzie, PNF, Codman Pendulum, Core Stability, Strengthening.
  - Home Program & Ergonomi kerja.

### 3. Interoperabilitas Kemenkes SatuSehat (PMK 24/2022)
- Auto-generate FHIR Bundle R4 payload:
  - `Encounter`: Rawat jalan fisioterapi (AMB class).
  - `Condition`: ICD-10 Diagnosis.
  - `Observation`: Skala Nyeri VAS (LOINC code 72514-3) & Pengukuran Goniometri.
  - `Procedure`: Tindakan Fisioterapi (ICD-9-CM: 93.11, 93.35, 93.39).
- Format valid JSON siap bridging ke API SatuSehat Kemenkes RI.

### 4. Resume Medis & Pelaporan
- Dokumen Resume Pelayanan Fisioterapi siap cetak / ekspor PDF.
- Dilengkapi Nomor SIPF (Surat Izin Praktik Fisioterapis) penanggung jawab.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19
- **Bahasa**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Icon**: Lucide React (Vector Font Icons, 0 Unicode Emoji)
- **Validation**: Zod
- **Runtime & Package Manager**: Bun

---

## Menjalankan Proyek Lokal

```bash
# Masuk ke direktori
cd fisiomedic

# Install dependensi via Bun
bun install

# Menjalankan unit tests
bun test

# Menjalankan development server
bun dev

# Build produksi
bun run build
```

---

## Agentic AI Workflow (`.agents/` & `.claude/`)

Repositori ini telah terintegrasi dengan WorldFlowAI / Everything Claude Code toolkit:
- **9 Subagents** (`.agents/agents/`): planner, architect, tdd-guide, code-reviewer, security-reviewer, build-error-resolver, e2e-runner, refactor-cleaner, doc-updater.
- **15 Slash Commands** (`.agents/commands/`): `/plan`, `/tdd`, `/verify`, `/code-review`, `/checkpoint`, `/learn`, dll.
- **Rules & Skills** (`.agents/rules/`, `.agents/skills/`): Enforce clean architecture, testing gates, dan token optimization.
- Panduan lengkap: `docs/WORLDFLOWAI.md`.

---

## Lisensi & Hak Cipta
Hak Cipta (c) 2026 DocoByte. Dikembangkan oleh **Sugeng Sulistiyawan** untuk ekosistem faskes dan fisioterapi Indonesia.
