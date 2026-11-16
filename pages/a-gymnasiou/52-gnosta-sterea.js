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

// 3D Μαθηματική περιστροφή σημείου (x, y, z) γύρω από μεντεσέ (hinge) A -> B κατά γωνία theta (Rodrigues)
function rotateAroundEdge(pt, A, B, theta) {
  const [px, py, pz] = pt;
  const [ax, ay, az] = A;
  const [bx, by, bz] = B;

  const ux = bx - ax;
  const uy = by - ay;
  const uz = bz - az;
  const len = Math.hypot(ux, uy, uz) || 1;
  const nx = ux / len;
  const ny = uy / len;
  const nz = uz / len;

  const vx = px - ax;
  const vy = py - ay;
  const vz = pz - az;

  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  const dot = nx * vx + ny * vy + nz * vz;

  const cx = ny * vz - nz * vy;
  const cy = nz * vx - nx * vz;
  const cz = nx * vy - ny * vx;

  return [
    ax + vx * cosT + cx * sinT + nx * dot * (1 - cosT),
    ay + vy * cosT + cy * sinT + ny * dot * (1 - cosT),
    az + vz * cosT + cz * sinT + nz * dot * (1 - cosT)
  ];
}

// Κατασκευή και προβολή 3D εδρών αναπτύγματος (u in [0, 1]: 0 = κλειστό 3D, 1 = επίπεδο ανάπτυγμα)
// Κάθε μεντεσές έχει προσανατολιστεί αυστηρά ώστε οι έδρες να ανοίγουν ΠΡΟΣ ΤΑ ΕΞΩ στο επίπεδο y = 0
function buildUnfoldingPolygons(solidKey, unfoldRatio, yawDeg, pitchDeg) {
  const u = Math.max(0, Math.min(1, unfoldRatio));
  const faces = [];
  let centerShiftZ = 0;

  if (solidKey === 'cube' || solidKey === 'box') {
    const w = solidKey === 'cube' ? 0.92 : 1.24;
    const d = solidKey === 'cube' ? 0.92 : 0.78;
    const h = solidKey === 'cube' ? 0.92 : 0.66;
    const hw = w / 2;
    const hd = d / 2;
    const theta = u * (Math.PI / 2);

    // Μετατόπιση κέντρου προς τα εμπρός όσο ανοίγει το πίσω καπάκι ώστε το ανάπτυγμα να μένει κεντραρισμένο
    centerShiftZ = u * (d * 0.45);

    // 1. Κάτω βάση (σταθερή στο επίπεδο y = 0)
    const b0 = [-hw, 0, -hd];
    const b1 = [hw, 0, -hd];
    const b2 = [hw, 0, hd];
    const b3 = [-hw, 0, hd];
    faces.push({ id: 'base', pts: [b0, b1, b2, b3], fill: '#4f46e5', opacity: 0.95 });

    // 2. Μπροστινή έδρα: άξονας b3 -> b2 (+X), ανοίγει προς +Z
    const fFront = [
      b3,
      b2,
      rotateAroundEdge([hw, h, hd], b3, b2, theta),
      rotateAroundEdge([-hw, h, hd], b3, b2, theta)
    ];
    faces.push({ id: 'front', pts: fFront, fill: '#10b981', opacity: 0.88 });

    // 3. Πίσω έδρα: άξονας b1 -> b0 (-X), ανοίγει προς -Z
    const fBack = [
      b0,
      b1,
      rotateAroundEdge([hw, h, -hd], b1, b0, theta),
      rotateAroundEdge([-hw, h, -hd], b1, b0, theta)
    ];
    faces.push({ id: 'back', pts: fBack, fill: '#059669', opacity: 0.88 });

    // 4. Δεξιά έδρα: άξονας b2 -> b1 (-Z), ανοίγει προς +X
    const fRight = [
      b1,
      b2,
      rotateAroundEdge([hw, h, hd], b2, b1, theta),
      rotateAroundEdge([hw, h, -hd], b2, b1, theta)
    ];
    faces.push({ id: 'right', pts: fRight, fill: '#0ea5e9', opacity: 0.88 });

    // 5. Αριστερή έδρα: άξονας b0 -> b3 (+Z), ανοίγει προς -X
    const fLeft = [
      b3,
      b0,
      rotateAroundEdge([-hw, h, -hd], b0, b3, theta),
      rotateAroundEdge([-hw, h, hd], b0, b3, theta)
    ];
    faces.push({ id: 'left', pts: fLeft, fill: '#0284c7', opacity: 0.88 });

    // 6. Πάνω καπάκι: συνδεδεμένο στην πάνω ακμή της πίσω έδρας
    const topHingeA = [hw, h, -hd];
    const topHingeB = [-hw, h, -hd];
    const lidClosed = [
      [-hw, h, -hd],
      [hw, h, -hd],
      [hw, h, hd],
      [-hw, h, hd]
    ];
    const lidPts = lidClosed.map((p) => {
      const p1 = rotateAroundEdge(p, topHingeA, topHingeB, theta);
      return rotateAroundEdge(p1, b1, b0, theta);
    });
    faces.push({ id: 'top', pts: lidPts, fill: '#f59e0b', opacity: 0.92 });
  } else if (solidKey === 'pyramid') {
    const s = 1.12;
    const hs = s / 2;
    const hPyr = 1.05;
    const alphaClosed = Math.atan2(hPyr, hs);
    const foldAngle = u * (Math.PI - alphaClosed);

    const b0 = [-hs, 0, -hs];
    const b1 = [hs, 0, -hs];
    const b2 = [hs, 0, hs];
    const b3 = [-hs, 0, hs];
    const apex = [0, hPyr, 0];

    faces.push({ id: 'base', pts: [b0, b1, b2, b3], fill: '#4f46e5', opacity: 0.95 });

    faces.push({
      id: 'tFront',
      pts: [b3, b2, rotateAroundEdge(apex, b3, b2, foldAngle)],
      fill: '#10b981',
      opacity: 0.88
    });
    faces.push({
      id: 'tBack',
      pts: [b0, b1, rotateAroundEdge(apex, b1, b0, foldAngle)],
      fill: '#059669',
      opacity: 0.88
    });
    faces.push({
      id: 'tRight',
      pts: [b1, b2, rotateAroundEdge(apex, b2, b1, foldAngle)],
      fill: '#f59e0b',
      opacity: 0.88
    });
    faces.push({
      id: 'tLeft',
      pts: [b3, b0, rotateAroundEdge(apex, b0, b3, foldAngle)],
      fill: '#0ea5e9',
      opacity: 0.88
    });
  } else if (solidKey === 'tetra') {
    const a = 1.32;
    const r = a / Math.sqrt(3);
    const inr = r / 2;
    const hTet = a * Math.sqrt(2 / 3);

    const v0 = [0, 0, -r];
    const v1 = [a / 2, 0, inr];
    const v2 = [-a / 2, 0, inr];
    const apex = [0, hTet, 0];

    const dihedral = Math.acos(1 / 3);
    const foldAngle = u * (Math.PI - dihedral);

    faces.push({ id: 'base', pts: [v0, v1, v2], fill: '#4f46e5', opacity: 0.95 });

    faces.push({
      id: 'f1',
      pts: [v2, v1, rotateAroundEdge(apex, v2, v1, foldAngle)],
      fill: '#10b981',
      opacity: 0.88
    });
    faces.push({
      id: 'f2',
      pts: [v1, v0, rotateAroundEdge(apex, v1, v0, foldAngle)],
      fill: '#f59e0b',
      opacity: 0.88
    });
    faces.push({
      id: 'f3',
      pts: [v0, v2, rotateAroundEdge(apex, v0, v2, foldAngle)],
      fill: '#0ea5e9',
      opacity: 0.88
    });
  }

  // 3D Προβολή σε 2D SVG
  const yaw = (yawDeg * Math.PI) / 180;
  const pitch = (pitchDeg * Math.PI) / 180;
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);

  // Δυναμική κλίμακα ώστε ολόκληρο το ανοιχτό ανάπτυγμα να χωράει άνετα στον καμβά
  const scale = solidKey === 'cube' || solidKey === 'box' ? 76 - u * 35 : 74 - u * 28;
  const centerX = 165;
  const centerY = 114;

  const projectPt = ([x, y, z]) => {
    const yc = y - 0.38 * (1 - u);
    const zc = z + centerShiftZ;
    const x1 = x * cosY + zc * sinY;
    const z1 = -x * sinY + zc * cosY;
    const y2 = yc * cosP - z1 * sinP;
    const z2 = yc * sinP + z1 * cosP;
    return {
      sx: centerX + x1 * scale,
      sy: centerY - y2 * scale,
      depth: z2
    };
  };

  const projected = faces.map((f) => {
    const p2d = f.pts.map(projectPt);
    const avgDepth = p2d.reduce((acc, p) => acc + p.depth, 0) / p2d.length;
    return {
      id: f.id,
      points: p2d.map((p) => `${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' '),
      fill: f.fill,
      opacity: f.opacity,
      depth: avgDepth
    };
  });

  projected.sort((a, b) => a.depth - b.depth);
  return projected;
}

// Συγκεντρωτικό Λεξικό i18n
const translations = {
  el: {
    pageTitle: "Κύβος, Ορθογώνιο Παραλληλεπίπεδο, Πυραμίδα & Κανονικό Τετράεδρο | Θεωρία Α' Γυμνασίου",
    pageDesc: "Θεωρία Μαθηματικών Α' Γυμνασίου: κύβος και διαγώνιοι κύβου, ορθογώνιο παραλληλεπίπεδο, πυραμίδα, στοιχεία πυραμίδας, κανονικό τετράεδρο και διαδραστικό άνοιγμα αναπτυγμάτων.",
    backNav: "Α' Γυμνασίου",
    heroBadge: "ΚΕΦΑΛΑΙΟ 14 • Α' ΓΥΜΝΑΣΙΟΥ",
    heroTitle: "Γνωστά Στερεά: Κύβος, Ορθογώνιο Παραλληλεπίπεδο & Πυραμίδα",
    heroDesc: "Εξερευνήστε τον κύβο και τις διαγωνίους του, το ορθογώνιο παραλληλεπίπεδο, την πυραμίδα, το κανονικό τετράεδρο και ξεδιπλώστε διαδραστικά τα αναπτύγματά τους!",
    btnExercises: "ΑΣΚΗΣΕΙΣ",
    btnGoExercises: "ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ",

    // Card 1: Κύβος & Διαγώνιοι Κύβου
    card1Badge: "1",
    card1Title: "Κύβος και Διαγώνιοι του Κύβου",
    card1Desc: "Ο κύβος (κανονικό εξάεδρο) είναι ορθό πρίσμα που έχει 6 ίσες τετραγωνικές έδρες, 12 ίσες ακμές (μήκους α) και 8 κορυφές:",
    card1List1: "• Διαγώνιοι Εδρών: Κάθε τετραγωνική έδρα έχει 2 διαγωνίους, άρα ο κύβος έχει συνολικά 6 · 2 ＝ 12 ίσες διαγωνίους εδρών (π.χ. ΑΓ, ΒΔ).",
    card1List2: "• Διαγώνιοι Κύβου (Εσωτερικές): Τα ευθύγραμμα τμήματα που ενώνουν δύο απέναντι κορυφές που δεν ανήκουν στην ίδια έδρα. Ο κύβος έχει 4 ίσες διαγωνίους (ΑΗ, ΒΘ, ΓΕ, ΔΖ), που τέμνονται στο μέσο τους.",
    card1Formula: "6 Έδρες • 12 Ακμές • 8 Κορυφές • 12 Διαγώνιοι Εδρών • 4 Διαγώνιοι Κύβου",

    // Card 2: Ορθογώνιο Παραλληλεπίπεδο
    card2Badge: "2",
    card2Title: "Ορθογώνιο Παραλληλεπίπεδο",
    card2Desc: "Ορθογώνιο παραλληλεπίπεδο είναι το ορθό πρίσμα του οποίου όλες οι έδρες (6 συνολικά) είναι ορθογώνια παραλληλόγραμμα:",
    card2List1: "• Διαστάσεις: Προσδιορίζεται από το μήκος (α), το πλάτος (β) και το ύψος (γ).",
    card2List2: "• Ανά 2 απέναντι έδρες είναι ίσες και παράλληλες (3 ζεύγη ίσων ορθογωνίων).",
    card2List3: "• Έχει 12 ακμές (ανά 4 ίσες: 4α, 4β, 4γ), 8 κορυφές και 4 ίσες διαγωνίους που τέμνονται στο μέσο τους.",

    // Card 3: Πυραμίδα & Στοιχεία Πυραμίδας
    card3Badge: "3",
    card3Title: "Πυραμίδα και Στοιχεία Πυραμίδας",
    card3Desc: "Πυραμίδα ονομάζεται το πολύεδρο που έχει μία πολυγωνική έδρα (τη βάση) και όλες οι υπόλοιπες έδρες του (οι παράπλευρες έδρες) είναι τρίγωνα με κοινή κορυφή (την κορυφή της πυραμίδας):",
    card3List1: "• Ύψος (υ): Η απόσταση της κορυφής της πυραμίδας από το επίπεδο της βάσης (κάθετο τμήμα).",
    card3List2: "• Πυραμίδα με βάση n-γωνο: Έχει n ＋ 1 έδρες, 2 · n ακμές και n ＋ 1 κορυφές.",
    card3List3: "• Κανονική Πυραμίδα: Έχει βάση κανονικό πολύγωνο και ίσες παράπλευρες ακμές (οι παράπλευρες έδρες είναι ίσα ισοσκελή τρίγωνα).",

    // Card 4: Κανονικό Τετράεδρο & Αναπτύγματα
    card4Badge: "4",
    card4Title: "Κανονικό Τετράεδρο & Αναπτύγματα Στερεών",
    card4Desc: "Κανονικό τετράεδρο είναι η τριγωνική πυραμίδα της οποίας και οι 4 έδρες (βάση και 3 παράπλευρες) είναι ίσα ισόπλευρα τρίγωνα:",
    card4List1: "• Στοιχεία Κανονικού Τετραέδρου: 4 έδρες (ισόπλευρα τρίγωνα), 6 ίσες ακμές, 4 κορυφές.",
    card4List2: "• Ανάπτυγμα Στερεού: Το επίπεδο σχήμα που προκύπτει αν κόψουμε το στερεό κατά μήκος ορισμένων ακμών και απλώσουμε όλες τις έδρες του στο ίδιο επίπεδο χωρίς να επικαλύπτονται.",

    // Interactive Lab
    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΑΝΑΠΤΥΓΜΑΤΩΝ",
    labTitle: "Μέρος Α: 3D Άνοιγμα Αναπτυγμάτων (0%–100%) • Μέρος Β: Στοιχεία Πυραμίδας & Κύβου",

    labPartATitle: "ΜΕΡΟΣ Α: ΣΥΡΕΤΕ ΤΗ ΜΠΑΡΑ ΓΙΑ ΝΑ ΑΝΟΙΞΕΤΕ ΤΟ ΣΤΕΡΕΟ ΣΕ ΑΝΑΠΤΥΓΜΑ",
    labSelectSolid: "1. ΕΠΙΛΕΞΤΕ ΓΝΩΣΤΟ ΣΤΕΡΕΟ:",
    labSolidCube: "Κύβος (6 τετράγωνα)",
    labSolidBox: "Ορθ. Παραλληλεπίπεδο",
    labSolidPyramid: "Τετραγωνική Πυραμίδα",
    labSolidTetra: "Κανονικό Τετράεδρο",
    labUnfoldSlider: "2. ΜΠΑΡΑ ΑΝΟΙΓΜΑΤΟΣ ΑΝΑΠΤΥΓΜΑΤΟΣ (0% ΚΛΕΙΣΤΟ ──▶ 100% ΕΠΙΠΕΔΟ)",
    labYawSlider: "Οριζόντια περιστροφή 3D προβολής",
    labPitchSlider: "Κατακόρυφη κλίση 3D προβολής",
    labDragHint: "💡 Σύρετε πάνω στο σχήμα με το ποντίκι ή το δάχτυλο για ελεύθερη 3D περιστροφή!",
    labStatusClosed: "Κλειστό 3D στερεό (0%) — Σύρετε τη μπάρα δεξιά για να ξεδιπλώσετε τις έδρες!",
    labStatusMid: "Ξεδιπλώνει τις έδρες προς τα έξω κατά μήκος των ακμών...",
    labStatusOpen: "✓ Πλήρες Επίπεδο Ανάπτυγμα (100%)! Όλες οι έδρες βρίσκονται απλωμένες στο επίπεδο.",

    labPartBTitle: "ΜΕΡΟΣ Β: ΕΞΕΡΕΥΝΗΤΗΣ ΣΤΟΙΧΕΙΩΝ ΠΥΡΑΜΙΔΑΣ (ΒΑΣΗ n-ΓΩΝΟ)",
    labSelectPyrBase: "1. ΕΠΙΛΕΞΤΕ ΒΑΣΗ ΠΥΡΑΜΙΔΑΣ (n ΠΛΕΥΡΕΣ):",
    labPyr3: "Τρίγωνο (n＝3 • Τετράεδρο)",
    labPyr4: "Τετράγωνο (n＝4)",
    labPyr5: "Πεντάγωνο (n＝5)",
    labPyr6: "Εξάγωνο (n＝6)",
    labPyrCaption: "Κορυφή πυραμίδας ενώνεται με τις n κορυφές της βάσης",
    labPyrFaces: "Έδρες (n＋1)",
    labPyrEdges: "Ακμές (2n)",
    labPyrVerts: "Κορυφές (n＋1)",
    labPyrLatTri: "Παράπλευρα τρίγωνα",

    // Solved Problems
    solvedTitle: "Λυμένα Προβλήματα Εφαρμογής",
    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΟΡΘΟΓΩΝΙΟ ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟ & ΔΙΑΓΩΝΙΟΙ",
    prob1Title: "Υπολογισμός αθροίσματος ακμών και εμβαδού ανάπτυγματος",
    prob1DescPre: "Ένα ορθογώνιο παραλληλεπίπεδο έχει διαστάσεις μήκος α ＝ 6 cm, πλάτος β ＝ 4 cm και ύψος γ ＝ 3 cm. Να βρεθούν: α) το συνολικό μήκος όλων των ακμών του, β) το εμβαδόν του αναπτύγματός του (ολική επιφάνεια) και γ) πόσες διαγωνίους εδρών και πόσες εσωτερικές διαγωνίους έχει.",
    prob1DiagramCaption: "Ορθογώνιο παραλληλεπίπεδο (6 × 4 × 3 cm) και μία εσωτερική διαγώνιος",
    prob1ColPart: "Ερώτημα",
    prob1ColRule: "Μαθηματική Σχέση",
    prob1ColCalc: "Υπολογισμός & Απάντηση",
    prob1Row1Q: "α) Άθροισμα 12 ακμών",
    prob1Row1R: "4α ＋ 4β ＋ 4γ ＝ 4(α ＋ β ＋ γ)",
    prob1Row1C: "4 · (6 ＋ 4 ＋ 3) ＝ 4 · 13 ＝ 52 cm",
    prob1Row2Q: "β) Εμβαδόν αναπτύγματος",
    prob1Row2R: "2·(α·β) ＋ 2·(α·γ) ＋ 2·(β·γ)",
    prob1Row2C: "2·24 ＋ 2·18 ＋ 2·12 ＝ 108 cm²",
    prob1Row3Q: "γ) Πλήθος διαγωνίων",
    prob1Row3R: "2 ανά έδρα (6 έδρες) & 4 εσωτερικές",
    prob1Row3C: "12 διαγώνιοι εδρών και 4 διαγώνιοι στερεού",
    prob1ResSummary: "Απάντηση:",
    prob1ResText: "α) 52 cm, β) 108 cm², γ) 12 διαγώνιοι εδρών και 4 διαγώνιοι στερεού.",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΠΥΡΑΜΙΔΑ & ΚΑΝΟΝΙΚΟ ΤΕΤΡΑΕΔΡΟ",
    prob2Title: "Προσδιορισμός στοιχείων πυραμίδας και ακμής κανονικού τετραέδρου",
    prob2DescPre: "α) Μια πυραμίδα έχει συνολικά 10 ακμές. Πόσες έδρες και πόσες κορυφές έχει; β) Αν ένα κανονικό τετράεδρο έχει άθροισμα μηκών όλων των ακμών του ίσο με 42 cm, πόσο είναι το μήκος κάθε ακμής του και ποιο είναι το είδος κάθε έδρας του;",
    prob2DiagramCaption: "Πενταγωνική πυραμίδα (10 ακμές) και Κανονικό Τετράεδρο (6 ίσες ακμές)",
    prob2ColPart: "Ερώτημα",
    prob2ColRule: "Μαθηματική Σχέση",
    prob2ColCalc: "Υπολογισμός & Απάντηση",
    prob2Row1Q: "α) Βάση πυραμίδας (n)",
    prob2Row1R: "Ακμές πυραμίδας ＝ 2 · n ＝ 10",
    prob2Row1C: "n ＝ 5 (Πενταγωνική πυραμίδα)",
    prob2Row2Q: "α) Έδρες & Κορυφές",
    prob2Row2R: "Έδρες ＝ n ＋ 1, Κορυφές ＝ n ＋ 1",
    prob2Row2C: "6 έδρες και 6 κορυφές",
    prob2Row3Q: "β) Κανονικό τετράεδρο",
    prob2Row3R: "Έχει 6 ίσες ακμές (ισόπλευρα τρίγωνα)",
    prob2Row3C: "Μήκος ακμής ＝ 7 cm, Έδρες: ισόπλευρα τρίγωνα",
    prob2ResSummary: "Απάντηση:",
    prob2ResText: "α) 6 έδρες και 6 κορυφές. β) Κάθε ακμή έχει μήκος 7 cm και οι 4 έδρες είναι ίσα ισόπλευρα τρίγωνα.",

    // Alerts
    alertTitle: "ΠΡΟΣΟΧΗ: ΚΛΑΣΙΚΑ ΛΑΘΗ ΣΕ ΚΥΒΟ, ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟ & ΠΥΡΑΜΙΔΑ",
    alert1Title: "Διαγώνιοι έδρας vs Διαγώνιοι κύβου:",
    alert1Desc: "Οι διαγώνιοι έδρας (12 συνολικά) βρίσκονται πάνω στις επιφάνειες των εδρών, ενώ οι διαγώνιοι του κύβου (4 συνολικά) περνούν από το εσωτερικό του στερεού.",
    alert2Title: "Ακμές πυραμίδας (2n) vs Ακμές πρίσματος (3n):",
    alert2Desc: "Η πυραμίδα έχει μόνο 1 βάση (n ακμές) και n παράπλευρες ακμές, άρα 2n ακμές συνολικά — όχι 3n όπως το πρίσμα.",
    alert3Title: "Κανονικό τετράεδρο:",
    alert3Desc: "Δεν αρκεί η βάση να είναι ισόπλευρο τρίγωνο: στο κανονικό τετράεδρο ΚΑΙ οι 4 έδρες (βάση + 3 παράπλευρες) είναι ίσα ισόπλευρα τρίγωνα (6 ίσες ακμές).",

    // Bottom
    bottomTitle: "Εξασκηθείτε στα Γνωστά Στερεά & τα Αναπτύγματα!",
    bottomDesc: "Δοκιμάστε τις γνώσεις σας στον κύβο, τις διαγωνίους, το ορθογώνιο παραλληλεπίπεδο, την πυραμίδα, το κανονικό τετράεδρο και τα αναπτύγματα με 12 διαδραστικές ασκήσεις.",
    bottomBtn: "ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ"
  },
  en: {
    pageTitle: "Cube, Rectangular Parallelepiped, Pyramid & Regular Tetrahedron | Grade 7 Theory",
    pageDesc: "Grade 7 geometry theory: cube and cube diagonals, rectangular parallelepiped, pyramid, pyramid elements, regular tetrahedron, and interactive net unfolding.",
    backNav: "Grade 7",
    heroBadge: "CHAPTER 14 • GRADE 7",
    heroTitle: "Familiar Solids: Cube, Rectangular Parallelepiped & Pyramid",
    heroDesc: "Explore the cube and its diagonals, rectangular parallelepipeds, pyramids, the regular tetrahedron, and interactively unfold their nets!",
    btnExercises: "EXERCISES",
    btnGoExercises: "GO TO EXERCISES",

    // Card 1
    card1Badge: "1",
    card1Title: "Cube and Diagonals of a Cube",
    card1Desc: "A cube (regular hexahedron) is a right prism with 6 congruent square faces, 12 equal edges (of length a), and 8 vertices:",
    card1List1: "• Face Diagonals: Each square face has 2 diagonals, giving 6 · 2 ＝ 12 equal face diagonals in total (e.g., AC, BD).",
    card1List2: "• Space (Internal) Diagonals: Line segments joining two opposite vertices not on the same face. A cube has 4 equal space diagonals (AH, BG, CE, DF) bisecting each other.",
    card1Formula: "6 Faces • 12 Edges • 8 Vertices • 12 Face Diagonals • 4 Space Diagonals",

    // Card 2
    card2Badge: "2",
    card2Title: "Rectangular Parallelepiped (Cuboid)",
    card2Desc: "A rectangular parallelepiped is a right prism whose 6 faces are all rectangles:",
    card2List1: "• Dimensions: Defined by length (a), width (b), and height (c).",
    card2List2: "• Opposite faces are congruent and parallel (3 pairs of congruent rectangles).",
    card2List3: "• It has 12 edges (3 groups of 4 equal edges: 4a, 4b, 4c), 8 vertices, and 4 equal space diagonals bisecting each other.",

    // Card 3
    card3Badge: "3",
    card3Title: "Pyramid and Elements of a Pyramid",
    card3Desc: "A pyramid is a polyhedron with one polygonal face (the base) and triangular lateral faces meeting at a single common vertex (the apex):",
    card3List1: "• Height (h): The perpendicular distance from the apex to the plane of the base.",
    card3List2: "• Pyramid with an n-gon base: Has n ＋ 1 faces, 2 · n edges, and n ＋ 1 vertices.",
    card3List3: "• Regular Pyramid: Has a regular polygon base and equal lateral edges (its lateral faces are congruent isosceles triangles).",

    // Card 4
    card4Badge: "4",
    card4Title: "Regular Tetrahedron & Nets of Solids",
    card4Desc: "A regular tetrahedron is a triangular pyramid whose 4 faces (base and 3 lateral faces) are all congruent equilateral triangles:",
    card4List1: "• Elements of a Regular Tetrahedron: 4 faces (equilateral triangles), 6 equal edges, 4 vertices.",
    card4List2: "• Net of a Solid: The flat 2D figure formed when a 3D solid is cut along selected edges and unfolded onto a single plane without overlapping.",

    // Interactive Lab
    labBadge: "INTERACTIVE NETS LAB",
    labTitle: "Part A: 3D Net Unfolding (0%–100%) • Part B: Pyramid & Cube Explorer",

    labPartATitle: "PART A: DRAG THE SLIDER TO UNFOLD THE 3D SOLID INTO ITS NET",
    labSelectSolid: "1. SELECT FAMILIAR SOLID:",
    labSolidCube: "Cube (6 squares)",
    labSolidBox: "Rectangular Box",
    labSolidPyramid: "Square Pyramid",
    labSolidTetra: "Regular Tetrahedron",
    labUnfoldSlider: "2. NET UNFOLDING SLIDER (0% CLOSED ──▶ 100% FLAT)",
    labYawSlider: "Horizontal 3D rotation",
    labPitchSlider: "Vertical 3D tilt",
    labDragHint: "💡 Drag on the shape with mouse or finger for free 3D rotation!",
    labStatusClosed: "Closed 3D solid (0%) — Drag the slider right to unfold its faces!",
    labStatusMid: "Unfolding faces outward along the edges...",
    labStatusOpen: "✓ Complete Flat Net (100%)! All faces lie flat on the plane.",

    labPartBTitle: "PART B: PYRAMID ELEMENTS EXPLORER (n-GON BASE)",
    labSelectPyrBase: "1. SELECT PYRAMID BASE (n SIDES):",
    labPyr3: "Triangle (n＝3 • Tetrahedron)",
    labPyr4: "Square (n＝4)",
    labPyr5: "Pentagon (n＝5)",
    labPyr6: "Hexagon (n＝6)",
    labPyrCaption: "The apex connects to all n vertices of the base",
    labPyrFaces: "Faces (n＋1)",
    labPyrEdges: "Edges (2n)",
    labPyrVerts: "Vertices (n＋1)",
    labPyrLatTri: "Lateral triangles",

    // Solved Problems
    solvedTitle: "Solved Practice Problems",
    prob1Badge: "PROBLEM 1: RECTANGULAR PARALLELEPIPED & DIAGONALS",
    prob1Title: "Calculating total edge length and net surface area",
    prob1DescPre: "A rectangular parallelepiped has length a ＝ 6 cm, width b ＝ 4 cm, and height c ＝ 3 cm. Find: (a) the total length of all its edges, (b) the area of its net (total surface area), and (c) how many face diagonals and space diagonals it has.",
    prob1DiagramCaption: "Rectangular parallelepiped (6 × 4 × 3 cm) and an internal space diagonal",
    prob1ColPart: "Question",
    prob1ColRule: "Mathematical Relation",
    prob1ColCalc: "Calculation & Answer",
    prob1Row1Q: "(a) Sum of 12 edges",
    prob1Row1R: "4a ＋ 4b ＋ 4c ＝ 4(a ＋ b ＋ c)",
    prob1Row1C: "4 · (6 ＋ 4 ＋ 3) ＝ 4 · 13 ＝ 52 cm",
    prob1Row2Q: "(b) Area of net",
    prob1Row2R: "2·(a·b) ＋ 2·(a·c) ＋ 2·(b·c)",
    prob1Row2C: "2·24 ＋ 2·18 ＋ 2·12 ＝ 108 cm²",
    prob1Row3Q: "(c) Number of diagonals",
    prob1Row3R: "2 per face (6 faces) & 4 internal",
    prob1Row3C: "12 face diagonals and 4 space diagonals",
    prob1ResSummary: "Answer:",
    prob1ResText: "(a) 52 cm, (b) 108 cm², (c) 12 face diagonals and 4 space diagonals.",

    prob2Badge: "PROBLEM 2: PYRAMID & REGULAR TETRAHEDRON",
    prob2Title: "Finding pyramid elements and edge length of a regular tetrahedron",
    prob2DescPre: "(a) A pyramid has 10 edges in total. How many faces and vertices does it have? (b) If a regular tetrahedron has a total edge length sum of 42 cm, what is the length of each edge and what shape is each face?",
    prob2DiagramCaption: "Pentagonal pyramid (10 edges) and Regular Tetrahedron (6 equal edges)",
    prob2ColPart: "Question",
    prob2ColRule: "Mathematical Relation",
    prob2ColCalc: "Calculation & Answer",
    prob2Row1Q: "(a) Pyramid base (n)",
    prob2Row1R: "Pyramid edges ＝ 2 · n ＝ 10",
    prob2Row1C: "n ＝ 5 (Pentagonal pyramid)",
    prob2Row2Q: "(a) Faces & Vertices",
    prob2Row2R: "Faces ＝ n ＋ 1, Vertices ＝ n ＋ 1",
    prob2Row2C: "6 faces and 6 vertices",
    prob2Row3Q: "(b) Regular tetrahedron",
    prob2Row3R: "Has 6 equal edges (equilateral triangles)",
    prob2Row3C: "Edge length ＝ 7 cm, Faces: equilateral triangles",
    prob2ResSummary: "Answer:",
    prob2ResText: "(a) 6 faces and 6 vertices. (b) Each edge is 7 cm long and all 4 faces are congruent equilateral triangles.",

    // Alerts
    alertTitle: "CAUTION: CLASSIC PITFALLS WITH CUBES, BOXES & PYRAMIDS",
    alert1Title: "Face diagonals vs. Cube (space) diagonals:",
    alert1Desc: "Face diagonals (12 total) lie on the outer square faces, whereas space diagonals (4 total) pass through the interior of the cube.",
    alert2Title: "Pyramid edges (2n) vs. Prism edges (3n):",
    alert2Desc: "A pyramid has only 1 base (n edges) plus n lateral edges, giving 2n edges in total — not 3n like a prism.",
    alert3Title: "Regular tetrahedron:",
    alert3Desc: "Having an equilateral triangle base is not enough: in a regular tetrahedron ALL 4 faces (base + 3 lateral faces) are congruent equilateral triangles (6 equal edges).",

    // Bottom
    bottomTitle: "Master Familiar Solids & Nets!",
    bottomDesc: "Practice cube diagonals, rectangular parallelepipeds, pyramids, regular tetrahedra, and solid nets with 12 interactive exercises.",
    bottomBtn: "START EXERCISES"
  }
};

export default function GnostaStereaTheory() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';
  const t = translations[isEl ? 'el' : 'en'];

  // State Μέρος Α: Άνοιγμα Αναπτυγμάτων (0% - 100%)
  const [solidKey, setSolidKey] = useState('cube');
  const [unfoldPercent, setUnfoldPercent] = useState(0);
  const [yawDeg, setYawDeg] = useState(-32);
  const [pitchDeg, setPitchDeg] = useState(32);
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0 });

  // State Μέρος Β: Εξερευνητής Πυραμίδας (n = 3..6)
  const [pyrN, setPyrN] = useState(4);

  const unfoldedPolys = buildUnfoldingPolygons(solidKey, unfoldPercent / 100, yawDeg, pitchDeg);

  const handleSelectSolid = (key) => {
    setSolidKey(key);
    setUnfoldPercent(0);
  };

  // Handlers ελεύθερης 3D περιστροφής με ποντίκι & touch πάνω στον καμβά
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

  // Υπολογισμός 2.5D Πυραμίδας για το Μέρος Β
  const pyrCx = 165;
  const pyrBaseCy = 148;
  const pyrApex = { x: 165, y: 34 };
  const pyrRx = 66;
  const pyrRy = 22;

  const pyrBasePts = [];
  for (let i = 0; i < pyrN; i++) {
    const theta = -Math.PI / 2 + (2 * Math.PI * i) / pyrN + (pyrN === 4 ? Math.PI / 4 : 0);
    pyrBasePts.push({
      x: Number((pyrCx + pyrRx * Math.cos(theta)).toFixed(1)),
      y: Number((pyrBaseCy + pyrRy * Math.sin(theta)).toFixed(1))
    });
  }

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/52-gnosta-sterea-ask"
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
                href="/a-gymnasiou/52-gnosta-sterea-ask"
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
          
          {/* ΚΑΡΤΑ 1: ΚΥΒΟΣ ΚΑΙ ΔΙΑΓΩΝΙΟΙ ΤΟΥ ΚΥΒΟΥ */}
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

              <div className="bg-indigo-900 text-white rounded-xl p-2.5 text-center font-mono text-xs sm:text-sm font-bold">
                {t.card1Formula}
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 2: ΟΡΘΟΓΩΝΙΟ ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟ */}
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

          {/* ΚΑΡΤΑ 3: ΠΥΡΑΜΙΔΑ & ΣΤΟΙΧΕΙΑ ΠΥΡΑΜΙΔΑΣ */}
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

              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs sm:text-sm text-indigo-950 space-y-1.5 leading-relaxed">
                <div>{t.card3List1}</div>
                <div>{t.card3List2}</div>
                <div>{t.card3List3}</div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 4: ΚΑΝΟΝΙΚΟ ΤΕΤΡΑΕΔΡΟ & ΑΝΑΠΤΥΓΜΑΤΑ */}
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

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 space-y-1.5 leading-relaxed">
                <div>{t.card4List1}</div>
                <div>{t.card4List2}</div>
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE LAB */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200 shadow-md mb-8 sm:mb-12 w-full min-w-0">
          <div className="mb-6 pb-5 border-b border-slate-100">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
              📦 {toCleanUppercase(t.labBadge)}
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.labTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full min-w-0">
            
            {/* ΜΕΡΟΣ Α: 3D ΑΝΟΙΓΜΑ ΑΝΑΠΤΥΓΜΑΤΩΝ ΜΕ ΜΠΑΡΑ ΚΥΛΙΣΗΣ */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 min-w-0">
              <div className="space-y-3">
                <span className="text-xs font-black text-indigo-900 uppercase tracking-wider block">
                  {toCleanUppercase(t.labPartATitle)}
                </span>

                {/* 1. Επιλογή γνωστού στερεού */}
                <div>
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">
                    {toCleanUppercase(t.labSelectSolid)}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { key: 'cube', label: t.labSolidCube },
                      { key: 'box', label: t.labSolidBox },
                      { key: 'pyramid', label: t.labSolidPyramid },
                      { key: 'tetra', label: t.labSolidTetra }
                    ].map((s) => (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => handleSelectSolid(s.key)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          solidKey === s.key
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white hover:bg-indigo-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Μπάρα Ανοίγματος Αναπτύγματος (0% - 100%, διατηρεί την τρέχουσα γωνία θέασης) */}
                <CustomSlider
                  label={t.labUnfoldSlider}
                  min={0}
                  max={100}
                  step={2}
                  value={unfoldPercent}
                  onChange={setUnfoldPercent}
                  unit="%"
                  color="#e11d48"
                  locale={locale}
                />

                {/* 3. Sliders γωνίας παρατήρησης */}
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

                {/* Διαδραστικός 3D SVG Καμβάς Αναπτύγματος (με Mouse & Touch περιστροφή) */}
                <div
                  onMouseDown={handleSvgMouseDown}
                  onTouchStart={handleSvgTouchStart}
                  className="bg-slate-950 rounded-2xl p-3 flex flex-col items-center justify-center shadow-inner overflow-hidden cursor-grab active:cursor-grabbing touch-none"
                >
                  <svg viewBox="0 0 330 225" className="w-full max-w-sm h-52 select-none">
                    {unfoldedPolys.map((poly) => (
                      <polygon
                        key={poly.id}
                        points={poly.points}
                        fill={poly.fill}
                        fillOpacity={poly.opacity}
                        stroke="#0f172a"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    ))}
                    <text x="165" y="216" textAnchor="middle" className="text-[9.5px] font-bold fill-slate-400">
                      {t.labDragHint}
                    </text>
                  </svg>
                </div>
              </div>

              {/* Μήνυμα κατάστασης ανοίγματος */}
              <div
                className={`p-3 rounded-xl border text-xs font-bold leading-snug ${
                  unfoldPercent === 100
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-950'
                }`}
              >
                {unfoldPercent === 0
                  ? t.labStatusClosed
                  : unfoldPercent < 100
                  ? `${t.labStatusMid} (${unfoldPercent}%)`
                  : t.labStatusOpen}
              </div>
            </div>

            {/* ΜΕΡΟΣ Β: ΕΞΕΡΕΥΝΗΤΗΣ ΣΤΟΙΧΕΙΩΝ ΠΥΡΑΜΙΔΑΣ */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 min-w-0">
              <div className="space-y-3">
                <span className="text-xs font-black text-indigo-900 uppercase tracking-wider block">
                  {toCleanUppercase(t.labPartBTitle)}
                </span>

                {/* Επιλογή βάσης πυραμίδας */}
                <div>
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">
                    {toCleanUppercase(t.labSelectPyrBase)}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { n: 3, label: t.labPyr3 },
                      { n: 4, label: t.labPyr4 },
                      { n: 5, label: t.labPyr5 },
                      { n: 6, label: t.labPyr6 }
                    ].map((item) => (
                      <button
                        key={item.n}
                        type="button"
                        onClick={() => setPyrN(item.n)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          pyrN === item.n
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white hover:bg-indigo-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG 2.5D Πυραμίδα */}
                <div className="bg-slate-950 rounded-2xl p-3 flex flex-col items-center justify-center shadow-inner overflow-hidden">
                  <svg viewBox="0 0 330 205" className="w-full max-w-sm h-48 select-none">
                    {/* Βάση πυραμίδας */}
                    <polygon
                      points={pyrBasePts.map((p) => `${p.x},${p.y}`).join(' ')}
                      fill="rgba(16, 185, 129, 0.25)"
                      stroke="#34d399"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />

                    {/* Παράπλευρα τρίγωνα */}
                    {pyrBasePts.map((bp, idx) => {
                      const bpNext = pyrBasePts[(idx + 1) % pyrN];
                      return (
                        <polygon
                          key={`tri-${idx}`}
                          points={`${pyrApex.x},${pyrApex.y} ${bp.x},${bp.y} ${bpNext.x},${bpNext.y}`}
                          fill="rgba(99, 102, 241, 0.16)"
                          stroke="#818cf8"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                      );
                    })}

                    {/* Κορυφές βάσης & κορυφή πυραμίδας */}
                    {pyrBasePts.map((p, idx) => (
                      <circle key={`bv-${idx}`} cx={p.x} cy={p.y} r="3.4" fill="#34d399" />
                    ))}
                    <circle cx={pyrApex.x} cy={pyrApex.y} r="4.5" fill="#fbbf24" />

                    <text x="165" y="194" textAnchor="middle" className="text-[10px] font-bold fill-slate-300">
                      {t.labPyrCaption}
                    </text>
                  </svg>
                </div>
              </div>

              {/* Κάρτες Στοιχείων Πυραμίδας */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-indigo-900 text-white rounded-xl">
                  <span className="text-[10px] text-indigo-200 block font-sans font-bold">{t.labPyrFaces}</span>
                  <strong>{pyrN + 1}</strong>
                </div>
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl">
                  <span className="text-[10px] text-emerald-800 block font-sans font-bold">{t.labPyrEdges}</span>
                  <strong>{2 * pyrN}</strong>
                </div>
                <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-950 rounded-xl">
                  <span className="text-[10px] text-amber-800 block font-sans font-bold">{t.labPyrVerts}</span>
                  <strong>{pyrN + 1}</strong>
                </div>
                <div className="p-2.5 bg-slate-800 text-white rounded-xl">
                  <span className="text-[10px] text-slate-300 block font-sans font-bold">{t.labPyrLatTri}</span>
                  <strong>{pyrN}</strong>
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
                    {/* Πίσω έδρα */}
                    <rect x="115" y="34" width="120" height="72" fill="none" stroke="#475569" strokeWidth="1.4" strokeDasharray="3 3" />
                    {/* Μπροστινή έδρα */}
                    <rect x="75" y="64" width="120" height="72" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2" />
                    {/* Ακμές βάθους */}
                    <line x1="75" y1="64" x2="115" y2="34" stroke="#818cf8" strokeWidth="2" />
                    <line x1="195" y1="64" x2="235" y2="34" stroke="#818cf8" strokeWidth="2" />
                    <line x1="195" y1="136" x2="235" y2="106" stroke="#818cf8" strokeWidth="2" />
                    <line x1="75" y1="136" x2="115" y2="106" stroke="#475569" strokeWidth="1.4" strokeDasharray="3 3" />
                    {/* Εσωτερική διαγώνιος */}
                    <line x1="75" y1="136" x2="235" y2="34" stroke="#fbbf24" strokeWidth="2.2" strokeDasharray="5 3" />

                    <text x="135" y="150" textAnchor="middle" className="text-[9px] font-mono font-bold fill-emerald-300">α ＝ 6 cm</text>
                    <text x="224" y="128" textAnchor="start" className="text-[9px] font-mono font-bold fill-emerald-300">β ＝ 4 cm</text>
                    <text x="243" y="72" textAnchor="start" className="text-[9px] font-mono font-bold fill-amber-300">γ ＝ 3 cm</text>
                  </svg>
                  <span className="text-[11px] text-slate-300 font-medium text-center mt-1">
                    {t.prob1DiagramCaption}
                  </span>
                </div>

                {/* Mobile View: Stacked Cards */}
                <div className="block sm:hidden space-y-2 mb-4 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob1Row1Q}</div>
                    <div className="text-slate-600 font-mono">{t.prob1Row1R}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob1Row1C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob1Row2Q}</div>
                    <div className="text-slate-600 font-mono">{t.prob1Row2R}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob1Row2C}</div>
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
                        <th className="p-2.5 border-b w-[36%]">{t.prob1ColRule}</th>
                        <th className="p-2.5 border-b w-[36%]">{t.prob1ColCalc}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob1Row1Q}</td>
                        <td className="p-2.5 font-mono break-words">{t.prob1Row1R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700 break-words">{t.prob1Row1C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob1Row2Q}</td>
                        <td className="p-2.5 font-mono break-words">{t.prob1Row2R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700 break-words">{t.prob1Row2C}</td>
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
                    {/* Πενταγωνική πυραμίδα αριστερά */}
                    <polygon points="85,112 122,120 112,144 58,144 48,120" fill="rgba(16, 185, 129, 0.25)" stroke="#34d399" strokeWidth="1.8" />
                    <line x1="85" y1="36" x2="85" y2="112" stroke="#818cf8" strokeWidth="1.4" strokeDasharray="3 3" />
                    <line x1="85" y1="36" x2="122" y2="120" stroke="#818cf8" strokeWidth="1.8" />
                    <line x1="85" y1="36" x2="112" y2="144" stroke="#818cf8" strokeWidth="1.8" />
                    <line x1="85" y1="36" x2="58" y2="144" stroke="#818cf8" strokeWidth="1.8" />
                    <line x1="85" y1="36" x2="48" y2="120" stroke="#818cf8" strokeWidth="1.8" />
                    <circle cx="85" cy="36" r="3.5" fill="#fbbf24" />
                    <text x="85" y="164" textAnchor="middle" className="text-[8px] font-bold fill-emerald-300">
                      {isEl ? 'Πενταγ. Πυραμίδα' : 'Pentag. Pyramid'}
                    </text>

                    {/* Κανονικό τετράεδρο δεξιά */}
                    <polygon points="235,38 192,134 278,134" fill="rgba(99, 102, 241, 0.25)" stroke="#818cf8" strokeWidth="2" />
                    <line x1="235" y1="38" x2="244" y2="112" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 3" />
                    <line x1="192" y1="134" x2="244" y2="112" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 3" />
                    <line x1="278" y1="134" x2="244" y2="112" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 3" />
                    <text x="235" y="164" textAnchor="middle" className="text-[8px] font-bold fill-amber-300">
                      {isEl ? 'Κανονικό Τετράεδρο' : 'Regular Tetrahedron'}
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
                      <Frac num="10" den="2" />
                      <span>＝ 5</span>
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
                    <div className="text-slate-600 font-mono flex flex-wrap items-center gap-x-1.5 gap-y-1">
                      <span>α ＝</span>
                      <Frac num="42" den="6" />
                      <span>＝ 7 cm</span>
                    </div>
                    <div className="font-bold text-indigo-700">{t.prob2Row3C}</div>
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
                        <td className="p-2.5 break-words">
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono">
                            <span>n ＝</span>
                            <Frac num="10" den="2" />
                            <span>＝ 5</span>
                          </div>
                        </td>
                        <td className="p-2.5 font-bold text-indigo-700 break-words">{t.prob2Row1C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob2Row2Q}</td>
                        <td className="p-2.5 break-words">{t.prob2Row2R}</td>
                        <td className="p-2.5 font-bold text-indigo-700 break-words">{t.prob2Row2C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob2Row3Q}</td>
                        <td className="p-2.5 break-words">
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono">
                            <span>α ＝</span>
                            <Frac num="42" den="6" />
                            <span>＝ 7 cm</span>
                          </div>
                        </td>
                        <td className="p-2.5 font-bold text-indigo-700 break-words">{t.prob2Row3C}</td>
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
            href="/a-gymnasiou/52-gnosta-sterea-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase(t.bottomBtn)}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}