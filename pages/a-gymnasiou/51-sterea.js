import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση για άτονα κεφαλαία (διατηρεί μόνο το Α')
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Α')/g);
  return parts
    .map((part) => {
      if (part === "Α'") return "Α'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Επαναχρησιμοποιήσιμο Component Γωνίας (Το γράμμα μένει στη γραμμή, το ^ τοποθετείται από πάνω)
function Angle({ children, className = "" }) {
  return (
    <span className={`relative inline-block leading-none mx-[1px] ${className}`}>
      <svg
        viewBox="0 0 12 6"
        className="w-[0.75em] h-[0.36em] absolute -top-[0.38em] left-1/2 -translate-x-1/2 text-current overflow-visible pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 5 L6 1 L11 5" />
      </svg>
      <span>{children}</span>
    </span>
  );
}

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας (Inline SVG + Vinculum) - Responsive
function Radical({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center align-middle font-mono shrink-0 select-none mx-0.5 ${className}`}>
      <svg
        viewBox="0 0 12 24"
        className="w-[0.52em] h-[1.12em] shrink-0 text-current overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 13 L3.5 13 L6.5 21 L12 2" />
      </svg>
      <span className="border-t-[1.8px] border-current pl-0.5 pr-1 py-0 leading-none text-[0.95em]">
        {children}
      </span>
    </span>
  );
}

// Επαναχρησιμοποιήσιμο Component Κλάσματος (Fraction) - Responsive
function Frac({ num, den, className = "" }) {
  return (
    <span
      className={`inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 whitespace-nowrap">
        {num}
      </span>
      <span className="pt-0.5 whitespace-nowrap">
        {den}
      </span>
    </span>
  );
}

// Custom Interactive Slider για το Διαδραστικό Εργαστήριο
function CustomSlider({ label, min, max, step = 1, value, onChange, unit = "", color = "#4f46e5", locale = "el" }) {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const locCode = locale === 'en' ? 'en-US' : 'el-GR';

  const formatNum = (n) => {
    if (n < 0) return `－${Math.abs(n).toLocaleString(locCode)}`;
    return n.toLocaleString(locCode);
  };

  const updateFromPosition = useCallback((clientX) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const ratio = clickX / rect.width;
    const rawVal = min + ratio * (max - min);
    const steppedVal = Math.round(rawVal / step) * step;
    const clamped = Math.max(min, Math.min(max, Number(steppedVal.toFixed(2))));
    onChange(clamped);
  }, [min, max, step, onChange]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    updateFromPosition(e.clientX);

    const onMouseMove = (moveEvent) => {
      updateFromPosition(moveEvent.clientX);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    if (e.touches[0]) updateFromPosition(e.touches[0].clientX);

    const onTouchMove = (moveEvent) => {
      if (moveEvent.touches[0]) updateFromPosition(moveEvent.touches[0].clientX);
    };

    const onTouchEnd = () => {
      setIsDragging(false);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  };

  return (
    <div className="space-y-1.5 select-none">
      <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
        <span className="break-words">{label}</span>
        <span
          className="font-mono font-bold px-2 py-0.5 rounded border text-xs sm:text-sm bg-white shadow-xs shrink-0 ml-2"
          style={{ color }}
        >
          {formatNum(value)}{unit}
        </span>
      </div>

      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="relative h-6 flex items-center cursor-pointer group"
      >
        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden relative">
          <div
            className="h-full transition-all duration-75"
            style={{ width: `${percentage}%`, backgroundColor: color }}
          />
        </div>

        <div
          className={`absolute w-5 h-5 bg-white border-2 rounded-full shadow-md transition-transform duration-75 -translate-x-1/2 flex items-center justify-center ${
            isDragging ? 'scale-125 ring-2 ring-indigo-300' : 'group-hover:scale-110'
          }`}
          style={{
            left: `${percentage}%`,
            borderColor: color
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        </div>
      </div>

      <div className="flex justify-between text-[10px] text-slate-400 font-mono px-0.5">
        <span>{formatNum(min)}{unit}</span>
        <span>{formatNum(Math.round((min + max) / 2))}{unit}</span>
        <span>{formatNum(max)}{unit}</span>
      </div>
    </div>
  );
}

// Συνθέσεις 3D Μοναδιαίων Κύβων (Voxels: [x, y, z, colorGroup])
const VOXEL_MODELS = {
  stairs: [
    [-1, 0, -1, 0], [0, 0, -1, 0], [1, 0, -1, 0],
    [-1, 0, 0, 0],  [0, 0, 0, 0],
    [-1, 0, 1, 0],
    [-1, 1, -1, 1], [0, 1, -1, 1],
    [-1, 1, 0, 1],
    [-1, 2, -1, 2]
  ],
  tower: [
    [-1, 0, -1, 0], [0, 0, -1, 0], [1, 0, -1, 0],
    [-1, 0, 0, 0],  [0, 0, 0, 0],  [1, 0, 0, 0],
    [-1, 1, -1, 1], [1, 1, -1, 1],
    [-1, 1, 0, 1],
    [-1, 2, -1, 2]
  ],
  bridge: [
    [-1, 0, 0, 0], [1, 0, 0, 0],
    [-1, 0, 1, 0],
    [-1, 1, 0, 1], [1, 1, 0, 1],
    [-1, 2, 0, 2], [0, 2, 0, 2], [1, 2, 0, 2]
  ]
};

// 3D Μαθηματική προβολή κύβων σε 2D SVG (Painter's Algorithm με ταξινόμηση βάθους)
function projectVoxels(voxels, yawDeg, pitchDeg, centerX = 165, centerY = 122, scale = 34) {
  const yaw = (yawDeg * Math.PI) / 180;
  const pitch = (pitchDeg * Math.PI) / 180;

  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);

  const rot = (x, y, z) => {
    const yc = y - 1.0;
    const x1 = x * cosY + z * sinY;
    const z1 = -x * sinY + z * cosY;
    const y2 = yc * cosP - z1 * sinP;
    const z2 = yc * sinP + z1 * cosP;
    return {
      sx: centerX + x1 * scale,
      sy: centerY - y2 * scale,
      depth: z2
    };
  };

  const faceDefs = [
    { name: 'top', normal: [0, 1, 0], corners: [[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]], shade: 1.08 },
    { name: 'bottom', normal: [0, -1, 0], corners: [[0, 0, 1], [1, 0, 1], [1, 0, 0], [0, 0, 0]], shade: 0.65 },
    { name: 'front', normal: [0, 0, 1], corners: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]], shade: 0.94 },
    { name: 'back', normal: [0, 0, -1], corners: [[1, 0, 0], [0, 0, 0], [0, 1, 0], [1, 1, 0]], shade: 0.78 },
    { name: 'right', normal: [1, 0, 0], corners: [[1, 0, 1], [1, 0, 0], [1, 1, 0], [1, 1, 1]], shade: 0.85 },
    { name: 'left', normal: [-1, 0, 0], corners: [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]], shade: 0.72 }
  ];

  const palettes = [
    { r: 79, g: 70, b: 229 },
    { r: 16, g: 185, b: 129 },
    { r: 245, g: 158, b: 11 }
  ];

  const polygons = [];

  voxels.forEach(([vx, vy, vz, level], vIdx) => {
    const baseColor = palettes[level % palettes.length];
    faceDefs.forEach((face, fIdx) => {
      const [nx, ny, nz] = face.normal;
      const nz1 = -nx * sinY + nz * cosY;
      const nz2 = ny * sinP + nz1 * cosP;

      if (nz2 > -0.02) {
        const pts = face.corners.map(([cx, cy, cz]) =>
          rot(vx - 0.5 + cx, vy + cy, vz - 0.5 + cz)
        );
        const avgDepth = pts.reduce((acc, p) => acc + p.depth, 0) / 4;
        const r = Math.min(255, Math.round(baseColor.r * face.shade));
        const g = Math.min(255, Math.round(baseColor.g * face.shade));
        const b = Math.min(255, Math.round(baseColor.b * face.shade));

        polygons.push({
          key: `${vIdx}-${fIdx}`,
          points: pts.map((p) => `${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' '),
          fill: `rgb(${r}, ${g}, ${b})`,
          depth: avgDepth
        });
      }
    });
  });

  polygons.sort((a, b) => a.depth - b.depth);
  return polygons;
}

// Συγκεντρωτικό Λεξικό i18n
const translations = {
  el: {
    pageTitle: "Στερεά Γεωμετρικά Σχήματα, Όψεις Στερεών & Ορθό Πρίσμα | Θεωρία Α' Γυμνασίου",
    pageDesc: "Θεωρία Μαθηματικών Α' Γυμνασίου: στερεά γεωμετρικά σχήματα (πολύεδρα και μη πολύεδρα), διαφορετική θέα / όψεις στερεών, πρίσμα, ορθό πρίσμα και τα στοιχεία του (βάσεις, παράπλευρες έδρες, κορυφές, ακμές).",
    backNav: "Α' Γυμνασίου",
    heroBadge: "ΚΕΦΑΛΑΙΟ 13 • Α' ΓΥΜΝΑΣΙΟΥ",
    heroTitle: "Στερεά Γεωμετρικά Σχήματα, Όψεις Στερεών & Ορθό Πρίσμα",
    heroDesc: "Γνωρίστε τα γεωμετρικά σχήματα στον χώρο, περιστρέψτε τρισδιάστατες συνθέσεις κύβων για να ανακαλύψετε τη μπροστινή, πλαϊνή και κάτοψή τους, και εξερευνήστε τα στοιχεία του ορθού πρίσματος!",
    btnExercises: "ΑΣΚΗΣΕΙΣ",
    btnGoExercises: "ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ",

    // Card 1: Στερεά Γεωμετρικά Σχήματα
    card1Badge: "1",
    card1Title: "Στερεά Γεωμετρικά Σχήματα (Πολύεδρα & Μη Πολύεδρα)",
    card1Desc: "Τα στερεά γεωμετρικά σχήματα έχουν τρεις διαστάσεις (μήκος, πλάτος, ύψος) και χωρίζονται σε δύο μεγάλες κατηγορίες:",
    card1List1: "• Πολύεδρα: Στερεά που περιορίζονται αποκλειστικά από επίπεδες πολυγωνικές επιφάνειες (έδρες). Παραδείγματα: κύβος, ορθογώνιο παραλληλεπίπεδο, πρίσμα, πυραμίδα.",
    card1List2: "• Μη Πολύεδρα (Σώματα εκ περιστροφής): Στερεά που έχουν και καμπύλες επιφάνειες. Παραδείγματα: κύλινδρος, κώνος, σφαίρα.",
    card1Note: "Στα πολύεδρα διακρίνουμε: Έδρες (τα πολύγωνα), Ακμές (τα ευθύγραμμα τμήματα τομής δύο εδρών) και Κορυφές (τα σημεία συνάντησης των ακμών).",

    // Card 2: Διαφορετική Θέα (Όψεις) των Στερεών
    card2Badge: "2",
    card2Title: "Διαφορετική Θέα (Όψεις) των Στερεών",
    card2Desc: "Ένα τρισδιάστατο αντικείμενο εμφανίζεται διαφορετικό ανάλογα με τη θέση από την οποία το παρατηρούμε. Για να το περιγράψουμε πλήρως στο επίπεδο χρησιμοποιούμε τρεις βασικές όψεις:",
    card2List1: "• Μπροστινή όψη (Πρόσοψη): Αυτό που βλέπουμε κοιτάζοντας το στερεό ακριβώς από μπροστά.",
    card2List2: "• Πλαϊνή όψη: Αυτό που βλέπουμε κοιτάζοντας το στερεό ακριβώς από τα αριστερά ή τα δεξιά.",
    card2List3: "• Κάτοψη (Όψη από πάνω): Αυτό που βλέπουμε κοιτάζοντας το στερεό κατακόρυφα από ψηλά.",

    // Card 3: Πρίσμα & Ορθό Πρίσμα
    card3Badge: "3",
    card3Title: "Πρίσμα & Ορθό Πρίσμα",
    card3Desc: "Πρίσμα ονομάζεται το πολύεδρο που έχει δύο ίσες και παράλληλες πολυγωνικές έδρες (τις βάσεις) και όλες οι υπόλοιπες έδρες του (οι παράπλευρες έδρες) είναι παραλληλόγραμμα.",
    card3Formula: "Ορθό Πρίσμα ＝ Πρίσμα με παράπλευρες ακμές κάθετες στις βάσεις",
    card3List1: "• Στο ορθό πρίσμα, όλες οι παράπλευρες έδρες είναι ορθογώνια παραλληλόγραμμα.",
    card3List2: "• Το ύψος (υ) του ορθού πρίσματος είναι ίσο με το μήκος κάθε παράπλευρης ακμής του.",
    card3List3: "• Ανάλογα με τη βάση, ονομάζεται: τριγωνικό, τετραγωνικό, πενταγωνικό, εξαγωνικό πρίσμα κ.λπ.",

    // Card 4: Τα Στοιχεία του Ορθού Πρίσματος
    card4Badge: "4",
    card4Title: "Τα Στοιχεία του Ορθού Πρίσματος (Βάση n-γωνο)",
    card4Desc: "Αν η βάση ενός ορθού πρίσματος είναι πολύγωνο με n πλευρές (π.χ. τρίγωνο n＝3, τετράπλευρο n＝4, πεντάγωνο n＝5), ισχύουν πάντα οι παρακάτω σχέσεις:",
    card4Row1: "• Σύνολο Εδρών: n ＋ 2 (2 βάσεις ＋ n παράπλευρες έδρες)",
    card4Row2: "• Σύνολο Ακμών: 3 · n (n ακμές στην κάτω βάση ＋ n στην πάνω βάση ＋ n παράπλευρες)",
    card4Row3: "• Σύνολο Κορυφών: 2 · n (n κορυφές στην κάτω βάση ＋ n στην πάνω βάση)",
    card4Euler: "Τύπος του Euler για κάθε κυρτό πολύεδρο: Ε ＋ Κ － Α ＝ 2",

    // Interactive Lab
    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ 3D ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Μέρος Α: 3D Περιστροφή & Όψεις Κύβων • Μέρος Β: Στοιχεία Ορθού Πρίσματος",

    labPartATitle: "ΜΕΡΟΣ Α: 3D ΣΥΝΘΕΣΗ ΚΥΒΩΝ — ΣΥΡΕΤΕ ΓΙΑ ΝΑ ΠΕΡΙΣΤΡΕΨΕΤΕ ΣΤΟΝ ΧΩΡΟ",
    labSelectModel: "1. ΕΠΙΛΕΞΤΕ 3D ΚΑΤΑΣΚΕΥΗ:",
    labModelStairs: "Σκάλα (10 κύβοι)",
    labModelTower: "Πύργος (10 κύβοι)",
    labModelBridge: "Αψίδα (8 κύβοι)",
    labPresetViews: "2. ΓΡΗΓΟΡΗ ΘΕΑ (ΟΨΕΙΣ):",
    labViewIso: "3D Προοπτική",
    labViewFront: "Μπροστά (Front)",
    labViewSide: "Πλάι (Side)",
    labViewTop: "Από Πάνω (Top)",
    labYawSlider: "Οριζόντια περιστροφή (Yaw)",
    labPitchSlider: "Κατακόρυφη κλίση (Pitch)",
    labDragHint: "💡 Σύρετε με το ποντίκι ή το δάχτυλο πάνω στο 3D σχήμα για ελεύθερη περιστροφή!",
    labFrontCard: "Μπροστινή Όψη",
    labSideCard: "Πλαϊνή Όψη (Δεξιά)",
    labTopCard: "Κάτοψη (Από Πάνω)",

    labPartBTitle: "ΜΕΡΟΣ Β: ΕΞΕΡΕΥΝΗΤΗΣ ΣΤΟΙΧΕΙΩΝ ΟΡΘΟΥ ΠΡΙΣΜΑΤΟΣ",
    labSelectBase: "1. ΕΠΙΛΕΞΤΕ ΠΟΛΥΓΩΝΟ ΒΑΣΗΣ (n ΠΛΕΥΡΕΣ):",
    labBase3: "Τρίγωνο (n＝3)",
    labBase4: "Τετράγωνο (n＝4)",
    labBase5: "Πεντάγωνο (n＝5)",
    labBase6: "Εξάγωνο (n＝6)",
    labHeightSlider: "Ύψος ορθού πρίσματος (υ)",
    labPrismCaption: "Οι παράπλευρες ακμές είναι κάθετες στις βάσεις (90°)",
    labStatFaces: "Έδρες (n＋2)",
    labStatEdges: "Ακμές (3n)",
    labStatVertices: "Κορυφές (2n)",
    labStatEuler: "Έλεγχος Euler",

    // Solved Problems
    solvedTitle: "Λυμένα Προβλήματα Εφαρμογής",
    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΑΝΑΓΝΩΡΙΣΗ ΟΨΕΩΝ ΣΤΕΡΕΟΥ ΑΠΟ ΚΥΒΟΥΣ",
    prob1Title: "Προσδιορισμός μπροστινής, πλαϊνής όψης και κάτοψης κατασκευής",
    prob1DescPre: "Η διπλανή κατασκευή αποτελείται από 5 ίσους μοναδιαίους κύβους κολλημένους μεταξύ τους (βάση 3 κύβων σε σχήμα Γ και 2 κύβοι καθ' ύψος στην πίσω αριστερή γωνία). Πόσα τετραγωνάκια φαίνονται: α) στη μπροστινή όψη, β) στη δεξιά πλαϊνή όψη και γ) στην κάτοψη;",
    prob1DiagramCaption: "3D Κατασκευή 5 κύβων και οι τρεις επίπεδες όψεις της",
    prob1ColPart: "Όψη / Θέα",
    prob1ColRule: "Τρόπος Παρατήρησης",
    prob1ColCalc: "Αποτέλεσμα",
    prob1Row1Q: "α) Μπροστινή όψη",
    prob1Row1R: "Αριστερή στήλη ύψους 3 ＋ δεξί τετράγωνο ύψους 1",
    prob1Row1C: "4 τετραγωνάκια (σχήμα L)",
    prob1Row2Q: "β) Δεξιά πλαϊνή όψη",
    prob1Row2R: "Πίσω στήλη ύψους 3 ＋ μπροστινό τετράγωνο ύψους 1",
    prob1Row2C: "4 τετραγωνάκια (σχήμα L)",
    prob1Row3Q: "γ) Κάτοψη (Από πάνω)",
    prob1Row3R: "Βλέπουμε μόνο τα 3 τετράγωνα της βάσης σε σχήμα Γ",
    prob1Row3C: "3 τετραγωνάκια (σχήμα Γ)",
    prob1ResSummary: "Συμπέρασμα:",
    prob1ResText: "Η κάτοψη δείχνει 3 τετραγωνάκια (όσα η επιφάνεια κάλυψης στο έδαφος), παρότι το στερεό αποτελείται συνολικά από 5 κύβους.",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΥΠΟΛΟΓΙΣΜΟΣ ΣΤΟΙΧΕΙΩΝ ΟΡΘΟΥ ΠΡΙΣΜΑΤΟΣ",
    prob2Title: "Εύρεση βάσης, κορυφών, εδρών και μήκους ακμών ορθού πρίσματος",
    prob2DescPre: "Ένα ορθό πρίσμα έχει συνολικά 18 ακμές. Κάθε πλευρά της βάσης του έχει μήκος 4 cm και το ύψος του πρίσματος είναι 7 cm. Να βρείτε: α) τι είδους πολύγωνο είναι η βάση του, β) πόσες κορυφές και πόσες έδρες έχει, και γ) το συνολικό άθροισμα των μηκών όλων των ακμών του.",
    prob2DiagramCaption: "Ορθό εξαγωνικό πρίσμα (n ＝ 6, 18 ακμές, 12 κορυφές, 8 έδρες)",
    prob2ColPart: "Ερώτημα",
    prob2ColRule: "Μαθηματική Σχέση",
    prob2ColCalc: "Υπολογισμός & Απάντηση",
    prob2Row1Q: "α) Είδος βάσης (n)",
    prob2Row1R: "Σύνολο ακμών ＝ 3 · n ＝ 18",
    prob2Row1C: "n ＝ 6 (Κανονικό/Εξαγωνικό πρίσμα)",
    prob2Row2Q: "β) Κορυφές & Έδρες",
    prob2Row2R: "Κορυφές ＝ 2n, Έδρες ＝ n ＋ 2",
    prob2Row2C: "12 κορυφές και 8 έδρες",
    prob2Row3Q: "γ) Άθροισμα ακμών",
    prob2Row3R: "12 ακμές βάσεων (×4 cm) ＋ 6 παράπλευρες (×7 cm)",
    prob2Row3C: "12·4 ＋ 6·7 ＝ 48 ＋ 42 ＝ 90 cm",
    prob2ResSummary: "Απάντηση:",
    prob2ResText: "α) Εξάγωνο (n ＝ 6), β) 12 κορυφές και 8 έδρες, γ) Συνολικό μήκος ακμών 90 cm.",

    // Alerts
    alertTitle: "ΠΡΟΣΟΧΗ: ΚΛΑΣΙΚΑ ΛΑΘΗ ΣΤΑ ΣΤΕΡΕΑ & ΤΑ ΠΡΙΣΜΑΤΑ",
    alert1Title: "Μην συγχέετε τον αριθμό κύβων με τα τετραγωνάκια της κάτοψης:",
    alert1Desc: "Στην κάτοψη (από πάνω) βλέπουμε μόνο την κορυφή κάθε στήλης. Μια στήλη 3 κύβων φαίνεται στην κάτοψη ως 1 μόνο τετραγωνάκι.",
    alert2Title: "Το πρίσμα έχει ΔΥΟ βάσεις, όχι μία:",
    alert2Desc: "Σε αντίθεση με την πυραμίδα που έχει 1 βάση, το πρίσμα έχει 2 ίσες και παράλληλες βάσεις (κάτω και πάνω). Γι' αυτό οι έδρες είναι n ＋ 2 και οι ακμές 3n.",
    alert3Title: "Παράπλευρες έδρες ορθού πρίσματος:",
    alert3Desc: "Σε κάθε ορθό πρίσμα οι παράπλευρες έδρες είναι ΠΑΝΤΑ ορθογώνια (ακόμη κι αν η βάση είναι τρίγωνο, πεντάγωνο ή εξάγωνο).",

    // Bottom
    bottomTitle: "Εξασκηθείτε στα Στερεά, τις Όψεις και τα Ορθά Πρίσματα!",
    bottomDesc: "Δοκιμάστε τις γνώσεις σας στην αναγνώριση όψεων 3D κατασκευών, στα πολύεδρα και στον υπολογισμό στοιχείων ορθών πρισμάτων με 12 διαδραστικές ασκήσεις.",
    bottomBtn: "ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ"
  },
  en: {
    pageTitle: "3D Geometric Solids, Views of Solids & Right Prism | Grade 7 Theory",
    pageDesc: "Grade 7 geometry theory: 3D geometric solids (polyhedra and non-polyhedra), different views of solids (front, side, top), prism, right prism, and its elements (bases, lateral faces, vertices, edges).",
    backNav: "Grade 7",
    heroBadge: "CHAPTER 13 • GRADE 7",
    heroTitle: "3D Geometric Solids, Views of Solids & Right Prism",
    heroDesc: "Explore three-dimensional geometric solids, rotate 3D cube assemblies to inspect their front, side, and top views, and investigate the elements of a right prism!",
    btnExercises: "EXERCISES",
    btnGoExercises: "GO TO EXERCISES",

    // Card 1
    card1Badge: "1",
    card1Title: "3D Geometric Solids (Polyhedra & Non-Polyhedra)",
    card1Desc: "Three-dimensional geometric solids have length, width, and height, and are divided into two main categories:",
    card1List1: "• Polyhedra: Solids bounded exclusively by flat polygonal faces. Examples: cube, rectangular parallelepiped, prism, pyramid.",
    card1List2: "• Non-Polyhedra (Solids of Revolution): Solids that include curved surfaces. Examples: cylinder, cone, sphere.",
    card1Note: "In polyhedra we identify: Faces (polygons), Edges (line segments where two faces meet), and Vertices (points where edges meet).",

    // Card 2
    card2Badge: "2",
    card2Title: "Different Views of 3D Solids",
    card2Desc: "A three-dimensional object looks different depending on the angle from which we observe it. To represent it on a 2D plane we use three standard views:",
    card2List1: "• Front View: What we see when looking straight at the solid from the front.",
    card2List2: "• Side View: What we see when looking straight at the solid from the left or right.",
    card2List3: "• Top View (Plan): What we see when looking vertically down from above.",

    // Card 3
    card3Badge: "3",
    card3Title: "Prism & Right Prism",
    card3Desc: "A prism is a polyhedron with two congruent, parallel polygonal faces (the bases) whose remaining faces (lateral faces) are parallelograms.",
    card3Formula: "Right Prism ＝ Prism with lateral edges perpendicular to the bases",
    card3List1: "• In a right prism, all lateral faces are rectangles.",
    card3List2: "• The height (h) of a right prism equals the length of each lateral edge.",
    card3List3: "• Named after its base polygon: triangular, rectangular, pentagonal, hexagonal prism, etc.",

    // Card 4
    card4Badge: "4",
    card4Title: "Elements of a Right Prism (n-gon Base)",
    card4Desc: "If the base of a right prism is an n-sided polygon (e.g., triangle n＝3, quadrilateral n＝4, pentagon n＝5), the following formulas always hold:",
    card4Row1: "• Total Faces: n ＋ 2 (2 bases ＋ n lateral faces)",
    card4Row2: "• Total Edges: 3 · n (n bottom base edges ＋ n top base edges ＋ n lateral edges)",
    card4Row3: "• Total Vertices: 2 · n (n bottom vertices ＋ n top vertices)",
    card4Euler: "Euler's Formula for any convex polyhedron: F ＋ V － E ＝ 2",

    // Interactive Lab
    labBadge: "INTERACTIVE 3D LAB",
    labTitle: "Part A: 3D Rotation & Cube Views • Part B: Right Prism Explorer",

    labPartATitle: "PART A: 3D CUBE ASSEMBLY — DRAG TO ROTATE IN 3D SPACE",
    labSelectModel: "1. SELECT 3D STRUCTURE:",
    labModelStairs: "Stairs (10 cubes)",
    labModelTower: "Tower (10 cubes)",
    labModelBridge: "Arch (8 cubes)",
    labPresetViews: "2. PRESET VIEWS:",
    labViewIso: "3D Perspective",
    labViewFront: "Front View",
    labViewSide: "Side View",
    labViewTop: "Top View",
    labYawSlider: "Horizontal rotation (Yaw)",
    labPitchSlider: "Vertical tilt (Pitch)",
    labDragHint: "💡 Drag with mouse or finger directly on the 3D shape to rotate freely!",
    labFrontCard: "Front View",
    labSideCard: "Right Side View",
    labTopCard: "Top View (Plan)",

    labPartBTitle: "PART B: RIGHT PRISM ELEMENTS EXPLORER",
    labSelectBase: "1. SELECT BASE POLYGON (n SIDES):",
    labBase3: "Triangle (n＝3)",
    labBase4: "Square (n＝4)",
    labBase5: "Pentagon (n＝5)",
    labBase6: "Hexagon (n＝6)",
    labHeightSlider: "Height of right prism (h)",
    labPrismCaption: "Lateral edges are perpendicular to the bases (90°)",
    labStatFaces: "Faces (n＋2)",
    labStatEdges: "Edges (3n)",
    labStatVertices: "Vertices (2n)",
    labStatEuler: "Euler Check",

    // Solved Problems
    solvedTitle: "Solved Practice Problems",
    prob1Badge: "PROBLEM 1: IDENTIFYING VIEWS OF A CUBE SOLID",
    prob1Title: "Finding the front, side, and top views of a 3D block assembly",
    prob1DescPre: "The adjacent structure consists of 5 identical unit cubes glued together (an L-shaped base of 3 cubes plus 2 cubes stacked vertically at the back-left corner). How many squares appear in: (a) the front view, (b) the right side view, and (c) the top view?",
    prob1DiagramCaption: "3D Assembly of 5 cubes and its three 2D orthographic views",
    prob1ColPart: "View",
    prob1ColRule: "Observation Method",
    prob1ColCalc: "Result",
    prob1Row1Q: "(a) Front view",
    prob1Row1R: "Left column of height 3 ＋ right square of height 1",
    prob1Row1C: "4 squares (L-shape)",
    prob1Row2Q: "(b) Right side view",
    prob1Row2R: "Back column of height 3 ＋ front square of height 1",
    prob1Row2C: "4 squares (L-shape)",
    prob1Row3Q: "(c) Top view (Plan)",
    prob1Row3R: "Only the 3 base footprints are visible from above",
    prob1Row3C: "3 squares (L-footprint)",
    prob1ResSummary: "Conclusion:",
    prob1ResText: "The top view shows 3 squares (the ground footprint), even though the solid contains 5 unit cubes in total.",

    prob2Badge: "PROBLEM 2: COMPUTING ELEMENTS OF A RIGHT PRISM",
    prob2Title: "Finding the base, vertices, faces, and total edge length of a right prism",
    prob2DescPre: "A right prism has 18 edges in total. Each side of its base has length 4 cm and the height of the prism is 7 cm. Find: (a) what polygon forms its base, (b) how many vertices and faces it has, and (c) the total sum of the lengths of all its edges.",
    prob2DiagramCaption: "Right hexagonal prism (n ＝ 6, 18 edges, 12 vertices, 8 faces)",
    prob2ColPart: "Question",
    prob2ColRule: "Mathematical Relation",
    prob2ColCalc: "Calculation & Answer",
    prob2Row1Q: "(a) Base polygon (n)",
    prob2Row1R: "Total edges ＝ 3 · n ＝ 18",
    prob2Row1C: "n ＝ 6 (Hexagonal prism)",
    prob2Row2Q: "(b) Vertices & Faces",
    prob2Row2R: "Vertices ＝ 2n, Faces ＝ n ＋ 2",
    prob2Row2C: "12 vertices and 8 faces",
    prob2Row3Q: "(c) Sum of all edges",
    prob2Row3R: "12 base edges (×4 cm) ＋ 6 lateral edges (×7 cm)",
    prob2Row3C: "12·4 ＋ 6·7 ＝ 48 ＋ 42 ＝ 90 cm",
    prob2ResSummary: "Answer:",
    prob2ResText: "(a) Hexagon (n ＝ 6), (b) 12 vertices and 8 faces, (c) Total edge length 90 cm.",

    // Alerts
    alertTitle: "CAUTION: CLASSIC PITFALLS WITH 3D SOLIDS & PRISMS",
    alert1Title: "Do not confuse total cube count with top-view squares:",
    alert1Desc: "In the top view we only see the top face of each stack. A vertical stack of 3 cubes appears as just 1 square from above.",
    alert2Title: "A prism has TWO bases, not one:",
    alert2Desc: "Unlike a pyramid (1 base), a prism has 2 congruent parallel bases (bottom and top). Therefore faces ＝ n ＋ 2 and edges ＝ 3n.",
    alert3Title: "Lateral faces of a right prism:",
    alert3Desc: "In every right prism, all lateral faces are ALWAYS rectangles (even when the base is a triangle, pentagon, or hexagon).",

    // Bottom
    bottomTitle: "Master 3D Solids, Views & Right Prisms!",
    bottomDesc: "Practice identifying 3D solid views, classifying polyhedra, and computing right prism elements with 12 interactive exercises.",
    bottomBtn: "START EXERCISES"
  }
};

export default function StereaKaiOrthoprismaTheory() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';
  const t = translations[isEl ? 'el' : 'en'];

  // State Μέρος Α: 3D Voxel Assembly Rotation
  const [modelKey, setModelKey] = useState('stairs');
  const [yawDeg, setYawDeg] = useState(-36);
  const [pitchDeg, setPitchDeg] = useState(26);
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0 });

  // State Μέρος Β: Right Prism Explorer (n = 3..6, height = 3..8)
  const [prismN, setPrismN] = useState(5);
  const [prismH, setPrismH] = useState(6);

  const activeVoxels = VOXEL_MODELS[modelKey] || VOXEL_MODELS.stairs;
  const projectedFaces = projectVoxels(activeVoxels, yawDeg, pitchDeg);

  // Υπολογισμός 2D προβολών (Front: (x, y), Side: (z, y), Top: (x, z))
  const frontCells = [];
  const sideCells = [];
  const topCells = [];
  activeVoxels.forEach(([x, y, z, lvl]) => {
    const fKey = `${x},${y}`;
    if (!frontCells.some((c) => c.key === fKey)) frontCells.push({ key: fKey, col: x + 1, row: 2 - y, lvl });
    const sKey = `${z},${y}`;
    if (!sideCells.some((c) => c.key === sKey)) sideCells.push({ key: sKey, col: 1 - z, row: 2 - y, lvl });
    const tKey = `${x},${z}`;
    if (!topCells.some((c) => c.key === tKey)) topCells.push({ key: tKey, col: x + 1, row: z + 1, lvl });
  });

  // Handlers ελεύθερης περιστροφής 3D πάνω στο SVG (Mouse & Touch)
  const handleSvgMouseDown = (e) => {
    e.preventDefault();
    dragRef.current = { active: true, lastX: e.clientX, lastY: e.clientY };
    const onMove = (ev) => {
      if (!dragRef.current.active) return;
      const dx = ev.clientX - dragRef.current.lastX;
      const dy = ev.clientY - dragRef.current.lastY;
      dragRef.current.lastX = ev.clientX;
      dragRef.current.lastY = ev.clientY;
      setYawDeg((prev) => {
        let next = Math.round(prev + dx * 0.8);
        if (next > 180) next -= 360;
        if (next < -180) next += 360;
        return next;
      });
      setPitchDeg((prev) => Math.max(-85, Math.min(85, Math.round(prev + dy * 0.6))));
    };
    const onUp = () => {
      dragRef.current.active = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const handleSvgTouchStart = (e) => {
    if (!e.touches[0]) return;
    dragRef.current = { active: true, lastX: e.touches[0].clientX, lastY: e.touches[0].clientY };
    const onMove = (ev) => {
      if (!dragRef.current.active || !ev.touches[0]) return;
      const dx = ev.touches[0].clientX - dragRef.current.lastX;
      const dy = ev.touches[0].clientY - dragRef.current.lastY;
      dragRef.current.lastX = ev.touches[0].clientX;
      dragRef.current.lastY = ev.touches[0].clientY;
      setYawDeg((prev) => {
        let next = Math.round(prev + dx * 0.8);
        if (next > 180) next -= 360;
        if (next < -180) next += 360;
        return next;
      });
      setPitchDeg((prev) => Math.max(-85, Math.min(85, Math.round(prev + dy * 0.6))));
    };
    const onEnd = () => {
      dragRef.current.active = false;
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
  };

  // Υπολογισμός κορυφών Ορθού Πρίσματος (2.5D προβολή)
  const prismCx = 165;
  const topCy = 132 - prismH * 11;
  const botCy = 158;
  const rx = 64;
  const ry = 22;

  const getBasePoints = (centerY) => {
    const pts = [];
    for (let i = 0; i < prismN; i++) {
      const theta = -Math.PI / 2 + (2 * Math.PI * i) / prismN + (prismN === 4 ? Math.PI / 4 : 0);
      pts.push({
        x: Number((prismCx + rx * Math.cos(theta)).toFixed(1)),
        y: Number((centerY + ry * Math.sin(theta)).toFixed(1))
      });
    }
    return pts;
  };

  const topPts = getBasePoints(topCy);
  const botPts = getBasePoints(botCy);

  const levelFill = ['#6366f1', '#10b981', '#f59e0b'];

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/51-sterea-ask"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>🎯 {toCleanUppercase(t.btnExercises)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border">
        
        {/* HERO BANNER */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-5 sm:p-8 lg:p-12 mb-6 sm:mb-10 shadow-xl w-full min-w-0">
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 border border-white/20">
              {toCleanUppercase(t.heroBadge)}
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 text-white leading-tight break-words [overflow-wrap:anywhere]">
              {t.heroTitle}
            </h1>
            <p className="text-xs sm:text-base lg:text-lg text-indigo-100 font-medium leading-relaxed mb-5 max-w-3xl">
              {t.heroDesc}
            </p>
            <div>
              <Link
                href="/a-gymnasiou/51-sterea-ask"
                className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>🎯 {toCleanUppercase(t.btnGoExercises)}</span>
              </Link>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* 4 MODULAR CARDS ΘΕΩΡΙΑΣ */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 w-full min-w-0">
          
          {/* ΚΑΡΤΑ 1: ΣΤΕΡΕΑ ΓΕΩΜΕΤΡΙΚΑ ΣΧΗΜΑΤΑ */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors min-w-0">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  {t.card1Badge}
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug break-words [overflow-wrap:anywhere]">
                  {t.card1Title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                {t.card1Desc}
              </p>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 space-y-1.5 mb-3">
                <div>{t.card1List1}</div>
                <div>{t.card1List2}</div>
              </div>

              <div className="bg-indigo-900 text-white rounded-xl p-3 text-xs sm:text-sm font-medium leading-relaxed">
                {t.card1Note}
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 2: ΔΙΑΦΟΡΕΤΙΚΗ ΘΕΑ (ΟΨΕΙΣ) ΤΩΝ ΣΤΕΡΕΩΝ */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors min-w-0">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  {t.card2Badge}
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug break-words [overflow-wrap:anywhere]">
                  {t.card2Title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                {t.card2Desc}
              </p>

              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-950 space-y-1.5 leading-relaxed">
                <div>{t.card2List1}</div>
                <div>{t.card2List2}</div>
                <div>{t.card2List3}</div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 3: ΠΡΙΣΜΑ & ΟΡΘΟ ΠΡΙΣΜΑ */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors min-w-0">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  {t.card3Badge}
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug break-words [overflow-wrap:anywhere]">
                  {t.card3Title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                {t.card3Desc}
              </p>

              <div className="bg-emerald-800 text-white rounded-xl p-2.5 text-center font-mono text-xs sm:text-sm font-bold mb-3">
                {t.card3Formula}
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 space-y-1.5">
                <div>{t.card3List1}</div>
                <div>{t.card3List2}</div>
                <div>{t.card3List3}</div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 4: ΤΑ ΣΤΟΙΧΕΙΑ ΤΟΥ ΟΡΘΟΥ ΠΡΙΣΜΑΤΟΣ */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors min-w-0">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  {t.card4Badge}
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug break-words [overflow-wrap:anywhere]">
                  {t.card4Title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                {t.card4Desc}
              </p>

              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs sm:text-sm text-indigo-950 space-y-1.5 leading-relaxed mb-3">
                <div>{t.card4Row1}</div>
                <div>{t.card4Row2}</div>
                <div>{t.card4Row3}</div>
              </div>

              <div className="bg-indigo-900 text-white rounded-xl p-2.5 text-center font-mono text-xs sm:text-sm font-bold">
                {t.card4Euler}
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE LAB */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200 shadow-md mb-8 sm:mb-12 w-full min-w-0">
          <div className="mb-6 pb-5 border-b border-slate-100">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
              🧊 {toCleanUppercase(t.labBadge)}
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.labTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full min-w-0">
            
            {/* ΜΕΡΟΣ Α: 3D ΠΕΡΙΣΤΡΟΦΗ ΣΥΝΘΕΣΗΣ ΚΥΒΩΝ & ΟΨΕΙΣ */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 min-w-0">
              <div className="space-y-3">
                <span className="text-xs font-black text-indigo-900 uppercase tracking-wider block">
                  {toCleanUppercase(t.labPartATitle)}
                </span>

                {/* 1. Επιλογή 3D κατασκευής */}
                <div>
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">
                    {toCleanUppercase(t.labSelectModel)}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { key: 'stairs', label: t.labModelStairs },
                      { key: 'tower', label: t.labModelTower },
                      { key: 'bridge', label: t.labModelBridge }
                    ].map((m) => (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setModelKey(m.key)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          modelKey === m.key
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white hover:bg-indigo-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Γρήγορη θέα (Όψεις) */}
                <div>
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">
                    {toCleanUppercase(t.labPresetViews)}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: t.labViewIso, yaw: -36, pitch: 26 },
                      { label: t.labViewFront, yaw: 0, pitch: 0 },
                      { label: t.labViewSide, yaw: -90, pitch: 0 },
                      { label: t.labViewTop, yaw: 0, pitch: 85 }
                    ].map((v, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setYawDeg(v.yaw);
                          setPitchDeg(v.pitch);
                        }}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold border bg-white hover:bg-emerald-50 text-slate-700 border-slate-200 transition-all"
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sliders 3D Περιστροφής */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CustomSlider
                    label={t.labYawSlider}
                    min={-180}
                    max={180}
                    step={2}
                    value={yawDeg}
                    onChange={setYawDeg}
                    unit="°"
                    color="#4f46e5"
                    locale={locale}
                  />
                  <CustomSlider
                    label={t.labPitchSlider}
                    min={-85}
                    max={85}
                    step={2}
                    value={pitchDeg}
                    onChange={setPitchDeg}
                    unit="°"
                    color="#059669"
                    locale={locale}
                  />
                </div>

                {/* Διαδραστικός 3D SVG Καμβάς */}
                <div
                  onMouseDown={handleSvgMouseDown}
                  onTouchStart={handleSvgTouchStart}
                  className="bg-slate-950 rounded-2xl p-3 flex flex-col items-center justify-center shadow-inner overflow-hidden cursor-grab active:cursor-grabbing touch-none"
                >
                  <svg viewBox="0 0 330 220" className="w-full max-w-sm h-52 select-none">
                    <ellipse cx="165" cy="175" rx="92" ry="18" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="4 4" />

                    {projectedFaces.map((poly) => (
                      <polygon
                        key={poly.key}
                        points={poly.points}
                        fill={poly.fill}
                        stroke="#0f172a"
                        strokeWidth="1.3"
                        strokeLinejoin="round"
                      />
                    ))}

                    <text x="165" y="210" textAnchor="middle" className="text-[10px] font-bold fill-slate-400">
                      {t.labDragHint}
                    </text>
                  </svg>
                </div>
              </div>

              {/* Τρεις Επίπεδες Όψεις (Front, Side, Top) */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-white border border-slate-200 rounded-xl flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-600 mb-1.5">{t.labFrontCard}</span>
                  <svg viewBox="0 0 66 66" className="w-14 h-14 bg-slate-950 rounded-lg p-1">
                    {frontCells.map((c) => (
                      <rect
                        key={c.key}
                        x={3 + c.col * 20}
                        y={3 + c.row * 20}
                        width="18"
                        height="18"
                        rx="2"
                        fill={levelFill[c.lvl]}
                        stroke="#0f172a"
                        strokeWidth="1.5"
                      />
                    ))}
                  </svg>
                </div>

                <div className="p-2 bg-white border border-slate-200 rounded-xl flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-600 mb-1.5">{t.labSideCard}</span>
                  <svg viewBox="0 0 66 66" className="w-14 h-14 bg-slate-950 rounded-lg p-1">
                    {sideCells.map((c) => (
                      <rect
                        key={c.key}
                        x={3 + c.col * 20}
                        y={3 + c.row * 20}
                        width="18"
                        height="18"
                        rx="2"
                        fill={levelFill[c.lvl]}
                        stroke="#0f172a"
                        strokeWidth="1.5"
                      />
                    ))}
                  </svg>
                </div>

                <div className="p-2 bg-white border border-slate-200 rounded-xl flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-600 mb-1.5">{t.labTopCard}</span>
                  <svg viewBox="0 0 66 66" className="w-14 h-14 bg-slate-950 rounded-lg p-1">
                    {topCells.map((c) => (
                      <rect
                        key={c.key}
                        x={3 + c.col * 20}
                        y={3 + c.row * 20}
                        width="18"
                        height="18"
                        rx="2"
                        fill={levelFill[c.lvl]}
                        stroke="#0f172a"
                        strokeWidth="1.5"
                      />
                    ))}
                  </svg>
                </div>
              </div>
            </div>

            {/* ΜΕΡΟΣ Β: ΕΞΕΡΕΥΝΗΤΗΣ ΣΤΟΙΧΕΙΩΝ ΟΡΘΟΥ ΠΡΙΣΜΑΤΟΣ */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 min-w-0">
              <div className="space-y-3">
                <span className="text-xs font-black text-indigo-900 uppercase tracking-wider block">
                  {toCleanUppercase(t.labPartBTitle)}
                </span>

                {/* 1. Επιλογή πολυγώνου βάσης */}
                <div>
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">
                    {toCleanUppercase(t.labSelectBase)}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { n: 3, label: t.labBase3 },
                      { n: 4, label: t.labBase4 },
                      { n: 5, label: t.labBase5 },
                      { n: 6, label: t.labBase6 }
                    ].map((item) => (
                      <button
                        key={item.n}
                        type="button"
                        onClick={() => setPrismN(item.n)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          prismN === item.n
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white hover:bg-indigo-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Slider ύψους */}
                <CustomSlider
                  label={t.labHeightSlider}
                  min={3}
                  max={8}
                  step={1}
                  value={prismH}
                  onChange={setPrismH}
                  unit=" cm"
                  color="#059669"
                  locale={locale}
                />

                {/* SVG 2.5D Ορθό Πρίσμα */}
                <div className="bg-slate-950 rounded-2xl p-3 flex flex-col items-center justify-center shadow-inner overflow-hidden">
                  <svg viewBox="0 0 330 205" className="w-full max-w-sm h-48 select-none">
                    {/* Κάτω βάση */}
                    <polygon
                      points={botPts.map((p) => `${p.x},${p.y}`).join(' ')}
                      fill="rgba(16, 185, 129, 0.22)"
                      stroke="#34d399"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />

                    {/* Παράπλευρες έδρες */}
                    {topPts.map((tp, idx) => {
                      const nextIdx = (idx + 1) % prismN;
                      const tpNext = topPts[nextIdx];
                      const bp = botPts[idx];
                      const bpNext = botPts[nextIdx];
                      return (
                        <polygon
                          key={`side-${idx}`}
                          points={`${tp.x},${tp.y} ${tpNext.x},${tpNext.y} ${bpNext.x},${bpNext.y} ${bp.x},${bp.y}`}
                          fill="rgba(99, 102, 241, 0.14)"
                          stroke="#818cf8"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                      );
                    })}

                    {/* Πάνω βάση */}
                    <polygon
                      points={topPts.map((p) => `${p.x},${p.y}`).join(' ')}
                      fill="rgba(16, 185, 129, 0.34)"
                      stroke="#34d399"
                      strokeWidth="2.2"
                      strokeLinejoin="round"
                    />

                    {/* Κορυφές */}
                    {[...topPts, ...botPts].map((pt, idx) => (
                      <circle key={`v-${idx}`} cx={pt.x} cy={pt.y} r="3.4" fill="#fbbf24" />
                    ))}

                    <text x="165" y="196" textAnchor="middle" className="text-[10px] font-bold fill-slate-300">
                      {t.labPrismCaption}
                    </text>
                  </svg>
                </div>
              </div>

              {/* Κάρτες Στοιχείων Ορθού Πρίσματος */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-indigo-900 text-white rounded-xl">
                  <span className="text-[10px] text-indigo-200 block font-sans font-bold">{t.labStatFaces}</span>
                  <strong>{prismN + 2}</strong>
                </div>
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl">
                  <span className="text-[10px] text-emerald-800 block font-sans font-bold">{t.labStatEdges}</span>
                  <strong>{3 * prismN}</strong>
                </div>
                <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-950 rounded-xl">
                  <span className="text-[10px] text-amber-800 block font-sans font-bold">{t.labStatVertices}</span>
                  <strong>{2 * prismN}</strong>
                </div>
                <div className="p-2.5 bg-slate-800 text-white rounded-xl">
                  <span className="text-[10px] text-slate-300 block font-sans font-bold">{t.labStatEuler}</span>
                  <strong>{(prismN + 2) + (2 * prismN) - (3 * prismN)} ＝ 2</strong>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ (ΜΕ ΣΧΗΜΑΤΑ) */}
        <section className="mb-8 sm:mb-12 w-full min-w-0">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2.5 sm:w-3 h-6 sm:h-8 bg-indigo-600 rounded-full shrink-0" />
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.solvedTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full min-w-0">
            
            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between min-w-0">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] sm:text-xs rounded-full uppercase">
                    {toCleanUppercase(t.prob1Badge)}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug">
                  {t.prob1Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 break-words">
                  {t.prob1DescPre}
                </p>

                {/* Εποπτικό Σχήμα Προβλήματος 1 */}
                <div className="bg-slate-950 rounded-2xl p-3 mb-4 flex flex-col items-center justify-center shadow-inner overflow-hidden">
                  <svg viewBox="0 0 320 185" className="w-full max-w-[300px] h-40 select-none">
                    <g transform="translate(18, 12)">
                      <polygon points="55,112 77,100 99,112 77,124" fill="#6366f1" stroke="#0f172a" strokeWidth="1.2" />
                      <polygon points="55,112 77,124 77,148 55,136" fill="#4338ca" stroke="#0f172a" strokeWidth="1.2" />
                      <polygon points="77,124 99,112 99,136 77,148" fill="#4f46e5" stroke="#0f172a" strokeWidth="1.2" />

                      <polygon points="99,88 121,76 143,88 121,100" fill="#6366f1" stroke="#0f172a" strokeWidth="1.2" />
                      <polygon points="99,88 121,100 121,124 99,112" fill="#4338ca" stroke="#0f172a" strokeWidth="1.2" />
                      <polygon points="121,100 143,88 143,112 121,124" fill="#4f46e5" stroke="#0f172a" strokeWidth="1.2" />

                      <polygon points="77,100 99,112 99,136 77,124" fill="#4338ca" stroke="#0f172a" strokeWidth="1.2" />
                      <polygon points="77,76 99,88 99,112 77,100" fill="#059669" stroke="#0f172a" strokeWidth="1.2" />
                      <polygon points="99,88 121,76 121,100 99,112" fill="#10b981" stroke="#0f172a" strokeWidth="1.2" />

                      <polygon points="77,40 99,28 121,40 99,52" fill="#fbbf24" stroke="#0f172a" strokeWidth="1.2" />
                      <polygon points="77,40 99,52 99,76 77,64" fill="#d97706" stroke="#0f172a" strokeWidth="1.2" />
                      <polygon points="99,52 121,40 121,64 99,76" fill="#f59e0b" stroke="#0f172a" strokeWidth="1.2" />

                      <text x="95" y="164" textAnchor="middle" className="text-[9px] font-bold fill-slate-300">
                        {isEl ? '3D (5 κύβοι)' : '3D (5 cubes)'}
                      </text>
                    </g>

                    {/* Μπροστινή Όψη */}
                    <g transform="translate(185, 36)">
                      <rect x="0" y="0" width="20" height="20" fill="#f59e0b" stroke="#0f172a" strokeWidth="1.5" />
                      <rect x="0" y="20" width="20" height="20" fill="#10b981" stroke="#0f172a" strokeWidth="1.5" />
                      <rect x="0" y="40" width="20" height="20" fill="#6366f1" stroke="#0f172a" strokeWidth="1.5" />
                      <rect x="20" y="40" width="20" height="20" fill="#6366f1" stroke="#0f172a" strokeWidth="1.5" />
                      <text x="20" y="76" textAnchor="middle" className="text-[8px] font-bold fill-amber-300">{isEl ? 'Μπροστά (4)' : 'Front (4)'}</text>
                    </g>

                    {/* Κάτοψη */}
                    <g transform="translate(252, 46)">
                      <rect x="0" y="0" width="20" height="20" fill="#f59e0b" stroke="#0f172a" strokeWidth="1.5" />
                      <rect x="20" y="0" width="20" height="20" fill="#6366f1" stroke="#0f172a" strokeWidth="1.5" />
                      <rect x="0" y="20" width="20" height="20" fill="#6366f1" stroke="#0f172a" strokeWidth="1.5" />
                      <text x="20" y="66" textAnchor="middle" className="text-[8px] font-bold fill-emerald-300">{isEl ? 'Κάτοψη (3)' : 'Top (3)'}</text>
                    </g>
                  </svg>
                  <span className="text-[11px] text-slate-300 font-medium text-center mt-1">
                    {t.prob1DiagramCaption}
                  </span>
                </div>

                {/* Mobile View: Stacked Cards */}
                <div className="block sm:hidden space-y-2 mb-4 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob1Row1Q}</div>
                    <div className="text-slate-600">{t.prob1Row1R}</div>
                    <div className="font-bold text-indigo-700">{t.prob1Row1C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob1Row2Q}</div>
                    <div className="text-slate-600">{t.prob1Row2R}</div>
                    <div className="font-bold text-indigo-700">{t.prob1Row2C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob1Row3Q}</div>
                    <div className="text-slate-600">{t.prob1Row3R}</div>
                    <div className="font-bold text-indigo-700">{t.prob1Row3C}</div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full table-fixed text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5 border-b w-[28%]">{t.prob1ColPart}</th>
                        <th className="p-2.5 border-b w-[40%]">{t.prob1ColRule}</th>
                        <th className="p-2.5 border-b w-[32%]">{t.prob1ColCalc}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob1Row1Q}</td>
                        <td className="p-2.5 break-words">{t.prob1Row1R}</td>
                        <td className="p-2.5 font-bold text-indigo-700 break-words">{t.prob1Row1C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob1Row2Q}</td>
                        <td className="p-2.5 break-words">{t.prob1Row2R}</td>
                        <td className="p-2.5 font-bold text-indigo-700 break-words">{t.prob1Row2C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob1Row3Q}</td>
                        <td className="p-2.5 break-words">{t.prob1Row3R}</td>
                        <td className="p-2.5 font-bold text-indigo-700 break-words">{t.prob1Row3C}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800">
                  <strong>{t.prob1ResSummary}</strong> {t.prob1ResText}
                </div>
              </div>
            </div>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between min-w-0">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] sm:text-xs rounded-full uppercase">
                    {toCleanUppercase(t.prob2Badge)}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug">
                  {t.prob2Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 break-words">
                  {t.prob2DescPre}
                </p>

                {/* Εποπτικό Σχήμα Προβλήματος 2 */}
                <div className="bg-slate-950 rounded-2xl p-3 mb-4 flex flex-col items-center justify-center shadow-inner overflow-hidden">
                  <svg viewBox="0 0 320 185" className="w-full max-w-[300px] h-40 select-none">
                    <polygon
                      points="160,122 212,132 212,152 160,162 108,152 108,132"
                      fill="rgba(16, 185, 129, 0.22)"
                      stroke="#34d399"
                      strokeWidth="1.8"
                    />
                    <line x1="160" y1="30" x2="160" y2="122" stroke="#818cf8" strokeWidth="1.4" strokeDasharray="3 3" />
                    <line x1="212" y1="40" x2="212" y2="132" stroke="#818cf8" strokeWidth="1.8" />
                    <line x1="212" y1="60" x2="212" y2="152" stroke="#818cf8" strokeWidth="1.8" />
                    <line x1="160" y1="70" x2="160" y2="162" stroke="#818cf8" strokeWidth="1.8" />
                    <line x1="108" y1="60" x2="108" y2="152" stroke="#818cf8" strokeWidth="1.8" />
                    <line x1="108" y1="40" x2="108" y2="132" stroke="#818cf8" strokeWidth="1.8" />

                    <polygon
                      points="160,30 212,40 212,60 160,70 108,60 108,40"
                      fill="rgba(99, 102, 241, 0.35)"
                      stroke="#818cf8"
                      strokeWidth="2"
                    />

                    <text x="186" y="167" textAnchor="middle" className="text-[9px] font-mono font-bold fill-emerald-300">4 cm</text>
                    <text x="224" y="106" textAnchor="start" className="text-[9px] font-mono font-bold fill-amber-300">
                      {isEl ? 'υ ＝ 7 cm' : 'h ＝ 7 cm'}
                    </text>
                  </svg>
                  <span className="text-[11px] text-slate-300 font-medium text-center mt-1">
                    {t.prob2DiagramCaption}
                  </span>
                </div>

                {/* Mobile View: Stacked Cards */}
                <div className="block sm:hidden space-y-2 mb-4 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob2Row1Q}</div>
                    <div className="text-slate-600 font-mono flex flex-wrap items-center gap-x-1.5 gap-y-1">
                      <span>n ＝</span>
                      <Frac num="18" den="3" />
                      <span>＝ 6</span>
                    </div>
                    <div className="font-bold text-indigo-700">{t.prob2Row1C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob2Row2Q}</div>
                    <div className="text-slate-600">{t.prob2Row2R}</div>
                    <div className="font-bold text-indigo-700">{t.prob2Row2C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob2Row3Q}</div>
                    <div className="text-slate-600">{t.prob2Row3R}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob2Row3C}</div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full table-fixed text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5 border-b w-[28%]">{t.prob2ColPart}</th>
                        <th className="p-2.5 border-b w-[36%]">{t.prob2ColRule}</th>
                        <th className="p-2.5 border-b w-[36%]">{t.prob2ColCalc}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob2Row1Q}</td>
                        <td className="p-2.5 break-words">{t.prob2Row1R}</td>
                        <td className="p-2.5 font-bold text-indigo-700 break-words">
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                            <span>n ＝</span>
                            <Frac num="18" den="3" />
                            <span>＝ 6</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob2Row2Q}</td>
                        <td className="p-2.5 break-words">{t.prob2Row2R}</td>
                        <td className="p-2.5 font-bold text-indigo-700 break-words">{t.prob2Row2C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob2Row3Q}</td>
                        <td className="p-2.5 break-words">{t.prob2Row3R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700 break-words">{t.prob2Row3C}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800">
                  <strong>{t.prob2ResSummary}</strong> {t.prob2ResText}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* YELLOW ALERT BOX */}
        <section className="bg-amber-50 border-2 border-amber-300 rounded-2xl sm:rounded-3xl p-4 sm:p-7 mb-8 sm:mb-12 shadow-sm min-w-0">
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="text-2xl sm:text-3xl shrink-0">⚠️</span>
            <div className="space-y-2.5 min-w-0">
              <h3 className="text-base sm:text-xl font-black text-amber-950 leading-tight">
                {toCleanUppercase(t.alertTitle)}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{t.alert1Title}</strong> {t.alert1Desc}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{t.alert2Title}</strong> {t.alert2Desc}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{t.alert3Title}</strong> {t.alert3Desc}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM CALLOUT BANNER */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white text-center shadow-xl flex flex-col items-center justify-center min-w-0">
          <h2 className="text-xl sm:text-3xl font-black mb-2 sm:mb-3 leading-snug break-words [overflow-wrap:anywhere]">
            {t.bottomTitle}
          </h2>
          <p className="text-emerald-100 max-w-2xl text-xs sm:text-base mb-5 sm:mb-6">
            {t.bottomDesc}
          </p>
          <Link
            href="/a-gymnasiou/51-sterea-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase(t.bottomBtn)}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}