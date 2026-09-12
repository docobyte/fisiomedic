import { GoniometryRom, ModalityItem, PainAssessment } from "../types/physio";

export interface SoapFastTemplate {
  id: string;
  name: string;
  category: string;
  icd10Code: string;
  icd10Description: string;
  physioDiagnosis: string;
  bodyRegions: string[];
  pain: PainAssessment;
  goniometry: GoniometryRom[];
  modalities: Omit<ModalityItem, "id">[];
  manualTherapy: string[];
  exerciseTherapy: string[];
  homeProgram: string;
  ergonomicAdvice: string;
  icd9Procedures: string[];
  shortTermGoal: string;
  longTermGoal: string;
}

export const SOAP_FAST_TEMPLATES: SoapFastTemplate[] = [
  {
    id: "tpl-frozen-shoulder",
    name: "Frozen Shoulder / Capsulitis Adhesiva (M75.0)",
    category: "Muskuloskeletal Bahu",
    icd10Code: "M75.0",
    icd10Description: "Adhesive capsulitis of shoulder",
    physioDiagnosis:
      "Keterbatasan lingkup gerak sendi dan nyeri bahu dekstra et causa Capsulitis Adhesiva fase freezing/thawing",
    bodyRegions: ["Bahu Kanan"],
    pain: {
      vasRest: 2,
      vasMotion: 6,
      vasPressure: 4,
      primaryPainRegion: "Bahu Kanan (Glenohumeral)",
      painCharacteristics: ["Kaku pagi hari", "Nyeri tumpul tajam saat rotasi eksternal & abduksi"],
      aggravatingFactors: "Mengangkat tangan ke atas kepala, menyisir, dan mengaitkan pakaian",
      relievingFactors: "Istirahat dan kompres hangat",
    },
    goniometry: [
      {
        id: "tpl-rom-fs-1",
        joint: "Shoulder Dextra",
        movement: "Fleksi",
        side: "Dextra",
        activeDegrees: 110,
        passiveDegrees: 130,
        normalDegrees: 180,
        endFeel: "Firm (Normal)",
      },
      {
        id: "tpl-rom-fs-2",
        joint: "Shoulder Dextra",
        movement: "Abduksi",
        side: "Dextra",
        activeDegrees: 90,
        passiveDegrees: 110,
        normalDegrees: 180,
        endFeel: "Firm (Normal)",
      },
      {
        id: "tpl-rom-fs-3",
        joint: "Shoulder Dextra",
        movement: "Eksternal Rotasi",
        side: "Dextra",
        activeDegrees: 30,
        passiveDegrees: 45,
        normalDegrees: 90,
        endFeel: "Firm (Normal)",
      },
    ],
    modalities: [
      {
        type: "ULTRASOUND",
        dose: "1 MHz, continuous 1.2 W/cm2",
        durationMinutes: 7,
        targetArea: "Kapsul anterior & posterior bahu kanan",
      },
      {
        type: "TENS",
        dose: "Konvensional 100 Hz, 150 us",
        durationMinutes: 15,
        targetArea: "Regio deltoideus & periscapular",
      },
      {
        type: "INFRARED",
        dose: "Jarak 45 cm perpendicular",
        durationMinutes: 10,
        targetArea: "Sendi glenohumeral kanan",
      },
    ],
    manualTherapy: [
      "Mobilisasi Sendi Maitland Grade III (Gliding posterior & inferior)",
      "Scapulothoracic mobilization",
      "Capsular anterior gentle stretching",
    ],
    exerciseTherapy: [
      "Codman Pendulum Exercise (10 repetisi x 3 set)",
      "Finger Ladder / Wall Climbing Exercise",
      "Wand / Stick Assisted Flexion Exercise",
    ],
    homeProgram: "Latihan wand exercise mandiri 2x sehari, kompres hangat 15 menit sebelum latihan.",
    ergonomicAdvice: "Hindari tidur bertumpu pada bahu yang sakit, hindari menjinjing beban berat di bahu kanan.",
    icd9Procedures: ["93.11 (Assisting exercise)", "93.35 (Ultrasound)", "93.39 (Diathermy / electrotherapy)"],
    shortTermGoal: "Penurunan VAS gerak <= 3 dan peningkatan ROM fleksi ke 140 derajat dalam 2 minggu",
    longTermGoal: "ROM bahu fungsional penuh dan mandiri dalam berpakaian serta menyisir rambut tanpa nyeri",
  },
  {
    id: "tpl-lbp-hnp",
    name: "Low Back Pain Kronis / HNP (M54.5)",
    category: "Muskuloskeletal Tulang Belakang",
    icd10Code: "M54.5",
    icd10Description: "Low back pain",
    physioDiagnosis:
      "Nyeri punggung bawah mekanik kronis disertai spasme m. erector spinae et causa suspect Hernia Nucleus Pulposus L4-L5",
    bodyRegions: ["Lumbal / Pinggang"],
    pain: {
      vasRest: 3,
      vasMotion: 7,
      vasPressure: 5,
      primaryPainRegion: "Lumbal / Pinggang Bawah (L4-S1)",
      painCharacteristics: ["Menjalar ke bokong & paha belakang", "Rasa kaku dan pegal berat"],
      aggravatingFactors: "Duduk lama > 30 menit, membungkuk mengambil barang di lantai",
      relievingFactors: "Posisi berbaring telentang dengan bantal di bawah lutut",
    },
    goniometry: [
      {
        id: "tpl-rom-lbp-1",
        joint: "Lumbar Spine",
        movement: "Fleksi Lumbal (Schober Test)",
        side: "Dextra",
        activeDegrees: 3.0,
        passiveDegrees: 3.5,
        normalDegrees: 5.0,
        endFeel: "Empty (Nyeri/Spasme)",
      },
    ],
    modalities: [
      {
        type: "SWD",
        dose: "Sub-thermal, continuous 100 W",
        durationMinutes: 15,
        targetArea: "Paravertebral lumbal L3 - S1",
      },
      {
        type: "TENS",
        dose: "Burst mode 2 Hz, 200 us",
        durationMinutes: 15,
        targetArea: "Lumbal L4-L5 & n. ischiadicus",
      },
    ],
    manualTherapy: [
      "Myofascial Release Quadratus Lumborum & Piriformis",
      "Nerve Flossing / Sciatic Nerve Mobilization",
    ],
    exerciseTherapy: [
      "McKenzie Extension in Prone (Sphinx pose)",
      "Pelvic Tilting & Bridge Exercise",
      "Knee to Chest gentle stretch",
    ],
    homeProgram: "Latihan ekstensi McKenzie 5 kali tiap 2 jam saat jeda duduk; hindari membungkuk mendadak.",
    ergonomicAdvice: "Gunakan lumbar roll di kursi kerja, ubah posisi tiap 30 menit, tekuk lutut saat mengangkat barang.",
    icd9Procedures: ["93.11", "93.39"],
    shortTermGoal: "Sentralisasi nyeri radikuler dan penurunan VAS gerak ke <= 4",
    longTermGoal: "Penguatan core stability trunk dan pencegahan kekambuhan saat aktivitas kerja",
  },
  {
    id: "tpl-stroke-hemiparesis",
    name: "Post-Stroke Hemiparesis (G81.9)",
    category: "Neuromuskuler",
    icd10Code: "G81.9",
    icd10Description: "Hemiplegia, unspecified",
    physioDiagnosis:
      "Gangguan kontrol motorik, keseimbangan dan pola jalan et causa Post-Stroke Hemiparesis Dekstra kronis",
    bodyRegions: ["Bahu Kanan", "Lutut Kanan (Genu Dextra)"],
    pain: {
      vasRest: 0,
      vasMotion: 3,
      vasPressure: 2,
      primaryPainRegion: "Ekstremitas Kanan (Lengan & Tungkai Dekstra)",
      painCharacteristics: ["Spastisitas sinergi fleksor", "Kelemahan motorik"],
      aggravatingFactors: "Berdiri lama dan berjalan tanpa topangan",
      relievingFactors: "Posisi berbaring menyangga sisi hemi",
    },
    goniometry: [
      {
        id: "tpl-rom-stroke-1",
        joint: "Elbow Dextra",
        movement: "Fleksi",
        side: "Dextra",
        activeDegrees: 100,
        passiveDegrees: 135,
        normalDegrees: 145,
        endFeel: "Firm (Normal)",
      },
      {
        id: "tpl-rom-stroke-2",
        joint: "Knee Dextra",
        movement: "Fleksi",
        side: "Dextra",
        activeDegrees: 90,
        passiveDegrees: 120,
        normalDegrees: 135,
        endFeel: "Firm (Normal)",
      },
    ],
    modalities: [
      {
        type: "ES_FARADIK",
        dose: "Surged faradic untuk stimulasi dorsofleksor",
        durationMinutes: 15,
        targetArea: "m. Tibialis anterior & ekstensor carpi",
      },
      {
        type: "INFRARED",
        dose: "Jarak 45 cm",
        durationMinutes: 10,
        targetArea: "Area spastik m. gastrocnemius & biceps",
      },
    ],
    manualTherapy: [
      "Bobath / Neurodevelopmental Treatment (NDT)",
      "Inhibisi pola sinergi spastik fleksi lengan dan ekstensi tungkai",
      "Passive prolonged stretching",
    ],
    exerciseTherapy: [
      "Weight bearing exercise pada sisi paresis",
      "Sit-to-stand functional training",
      "Gait training dengan parallel bar / cane",
    ],
    homeProgram: "Latihan weight bearing tangan kanan bertumpu di meja dan latihan melangkah mandiri didampingi keluarga.",
    ergonomicAdvice: "Atur posisi tidur miring dengan sisi paresis disangga bantal untuk mencegah subluksasi sendi bahu.",
    icd9Procedures: ["93.11", "93.22", "93.05"],
    shortTermGoal: "Inhibisi spastisitas dan perbaikan transfer duduk ke berdiri mandiri dalam 4 sesi",
    longTermGoal: "Pola jalan fungsional mandiri dengan quadripod tanpa risiko jatuh",
  },
  {
    id: "tpl-knee-oa",
    name: "Osteoarthritis Genu / Knee OA (M17.0)",
    category: "Muskuloskeletal Lutut",
    icd10Code: "M17.0",
    icd10Description: "Primary gonarthrosis, bilateral",
    physioDiagnosis:
      "Gangguan fungsi weight bearing, krepitasi dan penurunan ROM lutut et causa Osteoarthritis Genu Bilateral Grade II",
    bodyRegions: ["Lutut Kanan (Genu Dextra)", "Lutut Kiri (Genu Sinistra)"],
    pain: {
      vasRest: 1,
      vasMotion: 6,
      vasPressure: 5,
      primaryPainRegion: "Lutut Kanan & Kiri (Genu Bilateral)",
      painCharacteristics: ["Krepitasi", "Kaku pagi hari < 30 menit", "Nyeri saat menumpu beban / naik tangga"],
      aggravatingFactors: "Naik-turun tangga, berjalan jauh, dan posisi jongkok",
      relievingFactors: "Duduk istirahat dan kompres hangat",
    },
    goniometry: [
      {
        id: "tpl-rom-oa-1",
        joint: "Knee Dextra",
        movement: "Fleksi",
        side: "Dextra",
        activeDegrees: 105,
        passiveDegrees: 120,
        normalDegrees: 135,
        endFeel: "Firm (Normal)",
      },
      {
        id: "tpl-rom-oa-2",
        joint: "Knee Sinistra",
        movement: "Fleksi",
        side: "Sinistra",
        activeDegrees: 110,
        passiveDegrees: 125,
        normalDegrees: 135,
        endFeel: "Firm (Normal)",
      },
    ],
    modalities: [
      {
        type: "ULTRASOUND",
        dose: "1 MHz, continuous 1.0 W/cm2",
        durationMinutes: 7,
        targetArea: "Joint line medial & lateral lutut bilateral",
      },
      {
        type: "TENS",
        dose: "Konvensional 100 Hz, 150 us",
        durationMinutes: 15,
        targetArea: "Para-patellar medial & lateral bilateral",
      },
    ],
    manualTherapy: [
      "Patellar mobilization (Superior-inferior & medial-lateral)",
      "Transverse friction massage tendon patella & pes anserinus",
    ],
    exerciseTherapy: [
      "Isometric Quadriceps Exercise (Straight Leg Raise)",
      "Closed Kinetic Chain Mini-Squat (sudut 0 - 30 derajat)",
      "Hamstring & Gastrocnemius gentle stretch",
    ],
    homeProgram: "Latihan isometric quadriceps dengan handuk gulung di bawah lutut 3 set x 10 repetisi sehari.",
    ergonomicAdvice: "Hindari posisi jongkok atau duduk bersila di lantai; gunakan alas kaki dengan bantalan empuk.",
    icd9Procedures: ["93.11", "93.35", "93.39"],
    shortTermGoal: "Mengurangi nyeri gerak saat berdiri dan meningkatkan kekuatan m. quadriceps ke grade 4",
    longTermGoal: "Mampu berjalan kaki 500 meter tanpa nyeri dan mandiri menaiki tangga rumah",
  },
];
