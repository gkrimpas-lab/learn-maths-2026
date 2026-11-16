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

// 3D Κατασκευή και προβολή Αναπτύγματος Κυλίνδρου, Κώνου & Σφαίρας
function buildCurvedSolidPolygons(solidKey, unfoldRatio, yawDeg, pitchDeg) {
  const u = Math.max(0, Math.min(1, unfoldRatio));
  const faces = [];

  if (solidKey === 'cylinder') {
    const r = 0.46;
    const h = 0.92;
    const segs = 32;
    const thetaOpen = u * (Math.PI / 2);

    // 1. Παράπλευρη επιφάνεια:
    // Κρατάμε την πίσω γενέτειρα x = 0, z = -r (από y = 0 έως y = h) σταθερή.
    // Όσο u: 0 -> 1, η παράπλευρη επιφάνεια ξετυλίγεται συμμετρικά δεξιά/αριστερά στο επίπεδο z = -r.
    const arcTotal = 2 * Math.PI * r;
    const stripPts = [];
    for (let i = 0; i <= segs; i++) {
      const frac = i / segs - 0.5; // [-0.5, 0.5]
      if (u < 0.999) {
        const curR = r / (1 - u);
        const phi = frac * 2 * Math.PI * (1 - u);
        stripPts.push({
          x: curR * Math.sin(phi),
          z: -r + curR * (1 - Math.cos(phi))
        });
      } else {
        stripPts.push({
          x: frac * arcTotal,
          z: -r
        });
      }
    }

    for (let i = 0; i < segs; i++) {
      const p0 = stripPts[i];
      const p1 = stripPts[i + 1];
      faces.push({
        id: `cyl-lat-${i}`,
        pts: [
          [p0.x, 0, p0.z],
          [p1.x, 0, p1.z],
          [p1.x, h, p1.z],
          [p0.x, h, p0.z]
        ],
        fill: i % 2 === 0 ? '#10b981' : '#059669',
        opacity: 0.88,
        stroke: '#064e3b'
      });
    }

    // 2. Κυκλικές βάσεις (πάντα εφαπτόμενες στα σημεία (0, 0, -r) και (0, h, -r))
    const botPts = [];
    const topPts = [];
    const cSegs = 32;
    const sinT = Math.sin(thetaOpen);
    const cosT = Math.cos(thetaOpen);

    for (let i = 0; i < cSegs; i++) {
      const a = (2 * Math.PI * i) / cSegs;
      const bx = r * Math.sin(a);
      const dist = r * (1 + Math.cos(a)); // 0 στο πίσω σημείο επαφής (a = π), 2r στο μπροστινό (a = 0)

      botPts.push([bx, -dist * sinT, -r + dist * cosT]);
      topPts.push([bx, h + dist * sinT, -r + dist * cosT]);
    }

    faces.push({
      id: 'cyl-bot',
      pts: botPts,
      fill: '#4f46e5',
      opacity: 0.95,
      stroke: '#1e1b4b'
    });
    faces.push({
      id: 'cyl-top',
      pts: topPts,
      fill: '#f59e0b',
      opacity: 0.95,
      stroke: '#78350f'
    });
  } else if (solidKey === 'cone') {
    const r = 0.48;
    const hCone = 1.02;
    const slant = Math.hypot(r, hCone); // γενέτειρα λ
    const segs = 32;

    // 1. Παράπλευρη επιφάνεια κώνου:
    // Το πίσω σημείο επαφής P_back = (0, 0, -r) παραμένει απολύτως ακίνητο.
    const alpha0 = Math.atan2(r, hCone);
    const curTilt = (1 - u) * alpha0;
    const cosTilt = Math.cos(curTilt);
    const sinTilt = Math.sin(curTilt);

    const apexPt = [0, slant * cosTilt, -r + slant * sinTilt];

    const sectorHalfAngle = (Math.PI * r) / slant;
    const rimPts = [];
    for (let i = 0; i <= segs; i++) {
      const frac = i / segs - 0.5; // [-0.5, 0.5]
      if (u < 0.999) {
        const baseTilt = curTilt - alpha0;
        const curR = r / (1 - u);
        const phi = frac * 2 * Math.PI * (1 - u);
        const lx = curR * Math.sin(phi);
        const lForward = curR * (1 - Math.cos(phi));

        rimPts.push([
          lx,
          lForward * Math.sin(baseTilt),
          -r + lForward * Math.cos(baseTilt)
        ]);
      } else {
        const phi = frac * 2 * sectorHalfAngle;
        const px = slant * Math.sin(phi);
        const py = slant - slant * Math.cos(phi);
        rimPts.push([px, py, -r]);
      }
    }

    for (let i = 0; i < segs; i++) {
      faces.push({
        id: `cone-lat-${i}`,
        pts: [apexPt, rimPts[i], rimPts[i + 1]],
        fill: i % 2 === 0 ? '#10b981' : '#059669',
        opacity: 0.88,
        stroke: '#064e3b'
      });
    }

    // 2. Κυκλική βάση κώνου (πάντα κολλημένη στο σημείο επαφής (0, 0, -r))
    const cSegs = 32;
    const thetaOpen = u * (Math.PI / 2);
    const sinT = Math.sin(thetaOpen);
    const cosT = Math.cos(thetaOpen);
    const botPts = [];

    for (let i = 0; i < cSegs; i++) {
      const a = (2 * Math.PI * i) / cSegs;
      const bx = r * Math.sin(a);
      const dist = r * (1 + Math.cos(a));
      botPts.push([bx, -dist * sinT, -r + dist * cosT]);
    }

    faces.push({
      id: 'cone-bot',
      pts: botPts,
      fill: '#4f46e5',
      opacity: 0.95,
      stroke: '#1e1b4b'
    });
  } else if (solidKey === 'sphere') {
    const R = 0.82;
    const latSteps = 10;
    const lonSteps = 18;

    const sphPt = (lat, lon) => [
      R * Math.cos(lat) * Math.sin(lon),
      R * Math.sin(lat) + 0.50,
      R * Math.cos(lat) * Math.cos(lon)
    ];

    for (let i = 0; i < latSteps; i++) {
      const lat0 = -Math.PI / 2 + (Math.PI * i) / latSteps;
      const lat1 = -Math.PI / 2 + (Math.PI * (i + 1)) / latSteps;
      for (let j = 0; j < lonSteps; j++) {
        const lon0 = (2 * Math.PI * j) / lonSteps;
        const lon1 = (2 * Math.PI * (j + 1)) / lonSteps;

        const isSphericalTriangle = lat0 >= -0.01 && lon0 >= -0.01 && lon1 <= Math.PI / 2 + 0.05;
        const isEquator = Math.abs(lat0) < 0.05 || Math.abs(lat1) < 0.05;

        faces.push({
          id: `sph-${i}-${j}`,
          pts: [sphPt(lat0, lon0), sphPt(lat0, lon1), sphPt(lat1, lon1), sphPt(lat1, lon0)],
          fill: isSphericalTriangle ? '#f59e0b' : isEquator ? '#10b981' : '#4f46e5',
          opacity: isSphericalTriangle ? 0.92 : 0.72,
          stroke: isSphericalTriangle ? '#78350f' : '#1e1b4b'
        });
      }
    }
  }

  // 3D Προβολή σε 2D SVG
  const yaw = (yawDeg * Math.PI) / 180;
  const pitch = (pitchDeg * Math.PI) / 180;
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);

  const scale = solidKey === 'sphere' ? 88 : 74 - u * 34;
  const centerX = 165;
  const centerY = 112;

  const projectPt = ([x, y, z]) => {
    const yc = y - 0.48;
    const zc = z + (solidKey === 'sphere' ? 0 : u * 0.46);
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
      stroke: f.stroke || '#0f172a',
      depth: avgDepth
    };
  });

  projected.sort((a, b) => a.depth - b.depth);
  return projected;
}

// Συγκεντρωτικό Λεξικό i18n
const translations = {
  el: {
    pageTitle: "Κύλινδρος, Κώνος και Σφαίρα • Μέγιστος Κύκλος & Σφαιρικό Τρίγωνο | Θεωρία Α' Γυμνασίου",
    pageDesc: "Θεωρία Μαθηματικών Α' Γυμνασίου: κύλινδρος και στοιχεία κυλίνδρου, κώνος και στοιχεία κώνου, σφαίρα, μέγιστος κύκλος, σφαιρικό τρίγωνο και διαδραστικά αναπτύγματα.",
    backNav: "Α' Γυμνασίου",
    heroBadge: "ΚΕΦΑΛΑΙΟ 15 • Α' ΓΥΜΝΑΣΙΟΥ",
    heroTitle: "Σώματα εκ Περιστροφής: Κύλινδρος, Κώνος και Σφαίρα",
    heroDesc: "Γνωρίστε τον κύλινδρο, τον κώνο και τη σφαίρα, μελετήστε τα βασικά στοιχεία τους (βάση, ύψος, γενέτειρα, ακτίνα ρ), ξεδιπλώστε διαδραστικά τα αναπτύγματα κυλίνδρου και κώνου και ανακαλύψτε τον μέγιστο κύκλο και το σφαιρικό τρίγωνο!",
    btnExercises: "ΑΣΚΗΣΕΙΣ",
    btnGoExercises: "ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ",

    // Card 1: Ορθός Κύλινδρος & Στοιχεία Κυλίνδρου
    card1Badge: "1",
    card1Title: "Κύλινδρος και Στοιχεία του Κυλίνδρου",
    card1Desc: "Ορθός κύλινδρος είναι το στερεό που δημιουργείται όταν περιστραφεί ένα ορθογώνιο γύρω από μία πλευρά του κατά 360°:",
    card1List1: "• Βάσεις: Δύο ίσοι και παράλληλοι κύκλοι (Ο, ρ) και (Ο', ρ).",
    card1List2: "• Άξονας & Ύψος (υ): Το ευθύγραμμο τμήμα ΟΟ' που ενώνει τα κέντρα των βάσεων είναι κάθετο σε αυτές και ίσο με το ύψος υ.",
    card1List3: "• Γενέτειρα (γ): Κάθε τμήμα της παράπλευρης επιφάνειας παράλληλο στον άξονα ΟΟ' (στο ορθό κύλινδρο γ ＝ υ). Το ανάπτυγμα της παράπλευρης επιφάνειας είναι ορθογώνιο διαστάσεων 2πρ × υ.",

    // Card 2: Ορθός Κώνος & Στοιχεία Κώνου
    card2Badge: "2",
    card2Title: "Κώνος και Στοιχεία του Κώνου",
    card2Desc: "Ορθός κώνος είναι το στερεό που δημιουργείται όταν περιστραφεί ένα ορθογώνιο τρίγωνο γύρω από μία κάθετη πλευρά του κατά 360°:",
    card2List1: "• Βάση & Κορυφή: Ένας κύκλος (Ο, ρ) και ένα σημείο Κ (η κορυφή του κώνου) έξω από το επίπεδο της βάσης.",
    card2List2: "• Ύψος (υ): Η απόσταση ΚΟ της κορυφής από το κέντρο Ο της βάσης (κάθετο στη βάση).",
    card2List3: "• Γενέτειρα (λ): Κάθε ευθύγραμμο τμήμα που ενώνει την κορυφή Κ με ένα σημείο της περιφέρειας της βάσης. Το ανάπτυγμα της παράπλευρης επιφάνειας είναι κυκλικός τομέας ακτίνας λ και μήκους τόξου 2πρ.",

    // Card 3: Σφαίρα & Μέγιστος Κύκλος
    card3Badge: "3",
    card3Title: "Σφαίρα (Ο, ρ) και Μέγιστος Κύκλος",
    card3Desc: "Σφαίρα (Ο, ρ) ονομάζεται το σύνολο όλων των σημείων του χώρου που έχουν απόσταση από ένα σταθερό σημείο Ο (κέντρο) μικρότερη ή ίση από ένα θετικό αριθμό ρ (ακτίνα):",
    card3List1: "• Σφαιρική Επιφάνεια: Το σύνολο των σημείων του χώρου που απέχουν από το Ο απόσταση ακριβώς ίση με ρ.",
    card3List2: "• Μέγιστος Κύκλος: Κάθε τομή της σφαίρας με επίπεδο που περνά από το κέντρο Ο της σφαίρας. Έχει κέντρο το Ο και ακτίνα ρ (π.χ. ο Ισημερινός και οι Μεσημβρινοί της Γης).",
    card3Note: "Η σφαίρα ΔΕΝ έχει επίπεδο ανάπτυγμα (δεν μπορεί να απλωθεί στο επίπεδο χωρίς παραμόρφωση).",

    // Card 4: Σφαιρικό Τρίγωνο
    card4Badge: "4",
    card4Title: "Σφαιρικό Τρίγωνο",
    card4Desc: "Πάνω στη σφαιρική επιφάνεια, τον ρόλο των ευθειών παίζουν τα τόξα μεγίστων κύκλων (οι συντομότερες διαδρομές ανάμεσα σε δύο σημεία της σφαίρας):",
    card4List1: "• Σφαιρικό Τρίγωνο ΑΒΓ: Το τμήμα της σφαιρικής επιφάνειας που περικλείεται από τρία τόξα μεγίστων κύκλων ΑΒ, ΒΓ, ΓΑ (μικρότερα από ημικύκλιο).",
    card4List2: "• Ιδιότητα Γωνιών: Σε αντίθεση με το επίπεδο τρίγωνο (όπου Α ＋ Β ＋ Γ ＝ 180°), σε κάθε σφαιρικό τρίγωνο το άθροισμα των γωνιών είναι ΜΕΓΑΛΥΤΕΡΟ από 180° (180° < Α ＋ Β ＋ Γ < 540°).",

    // Interactive Lab
    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Μέρος Α: 3D Αναπτύγματα Κυλίνδρου, Κώνου & Σφαίρα • Μέρος Β: Στοιχεία (ρ, υ)",

    labPartATitle: "ΜΕΡΟΣ Α: ΣΥΡΕΤΕ ΤΗ ΜΠΑΡΑ ΓΙΑ ΝΑ ΑΝΟΙΞΕΤΕ ΚΥΛΙΝΔΡΟ & ΚΩΝΟ (ΚΑΙ ΔΕΙΤΕ ΤΗ ΣΦΑΙΡΑ)",
    labSelectSolid: "1. ΕΠΙΛΕΞΤΕ ΣΤΕΡΕΟ:",
    labSolidCylinder: "Ορθός Κύλινδρος",
    labSolidCone: "Ορθός Κώνος",
    labSolidSphere: "Σφαίρα & Σφαιρικό Τρίγωνο",
    labUnfoldSlider: "2. ΜΠΑΡΑ ΑΝΟΙΓΜΑΤΟΣ ΑΝΑΠΤΥΓΜΑΤΟΣ (0% ΚΛΕΙΣΤΟ ──▶ 100% ΕΠΙΠΕΔΟ)",
    labYawSlider: "Οριζόντια περιστροφή 3D προβολής",
    labPitchSlider: "Κατακόρυφη κλίση 3D προβολής",
    labDragHint: "💡 Σύρετε πάνω στο σχήμα με το ποντίκι ή το δάχτυλο για ελεύθερη 3D περιστροφή!",
    labStatusClosed: "Κλειστό 3D στερεό (0%) — Σύρετε τη μπάρα δεξιά για να ξεδιπλώσετε την επιφάνεια!",
    labStatusMid: "Ξετυλίγει την καμπύλη επιφάνεια και ανοίγει τις κυκλικές βάσεις...",
    labStatusOpenCyl: "✓ Ανάπτυγμα Κυλίνδρου (100%): 1 ορθογώνιο (2πρ × υ) και 2 ίσοι κύκλοι (Ο, ρ)!",
    labStatusOpenCone: "✓ Ανάπτυγμα Κώνου (100%): 1 κυκλικός τομέας (ακτίνας λ) και 1 κύκλος βάσης (Ο, ρ)!",
    labStatusSphere: "🌐 Σφαίρα (Ο, ρ): Το πράσινο τόξο είναι Μέγιστος Κύκλος και το πορτοκαλί είναι Σφαιρικό Τρίγωνο (χωρίς ανάπτυγμα).",

    labPartBTitle: "ΜΕΡΟΣ Β: ΕΞΕΡΕΥΝΗΤΗΣ ΣΤΟΙΧΕΙΩΝ ΚΥΛΙΝΔΡΟΥ & ΚΩΝΟΥ (ΑΚΤΙΝΑ ρ, ΥΨΟΣ υ)",
    labModeCyl: "Ορθός Κύλινδρος",
    labModeCone: "Ορθός Κώνος",
    labRadiusSlider: "Ακτίνα βάσης (ρ)",
    labHeightSlider: "Ύψος στερεού (υ)",
    labPrismCaptionCyl: "Γενέτειρα γ ＝ υ • Περιφέρεια βάσης ＝ 2πρ",
    labPrismCaptionCone: "Ύψος ΚΟ ＝ υ ⊥ βάση • Γενέτειρα λ > υ",
    labStatBases: "Κυκλικές Βάσεις",
    labStatGen: "Γενέτειρα",
    labStatNet: "Είδος Αναπτύγματος",
    labStatCircum: "Περιφέρεια Βάσης",

    // Solved Problems
    solvedTitle: "Λυμένα Προβλήματα Εφαρμογής",
    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΑΝΑΠΤΥΓΜΑ ΟΡΘΟΥ ΚΥΛΙΝΔΡΟΥ",
    prob1Title: "Υπολογισμός διαστάσεων ορθογωνίου στο ανάπτυγμα κυλίνδρου",
    prob1DescPre: "Ένας ορθός κύλινδρος έχει βάση κύκλο ακτίνας ρ ＝ 5 cm και ύψος υ ＝ 8 cm. Αν θεωρήσουμε π ≈ 3,14, να βρεθούν: α) το μήκος και το πλάτος του ορθογωνίου που σχηματίζει η παράπλευρη επιφάνεια στο ανάπτυγμά του και β) το εμβαδόν της παράπλευρης επιφάνειας του κυλίνδρου.",
    prob1DiagramCaption: "Ορθός κύλινδρος (ρ ＝ 5 cm, υ ＝ 8 cm) και το ορθογώνιο ανάπτυγμά του",
    prob1ColPart: "Ερώτημα",
    prob1ColRule: "Μαθηματική Σχέση",
    prob1ColCalc: "Υπολογισμός & Απάντηση",
    prob1Row1Q: "α) Μήκος ορθογωνίου",
    prob1Row1R: "Ίσο με την περιφέρεια βάσης: 2 · π · ρ",
    prob1Row1C: "2 · 3,14 · 5 ＝ 31,4 cm",
    prob1Row2Q: "α) Πλάτος ορθογωνίου",
    prob1Row2R: "Ίσο με το ύψος του κυλίνδρου (υ)",
    prob1Row2C: "υ ＝ 8 cm",
    prob1Row3Q: "β) Παράπλευρο εμβαδόν",
    prob1Row3R: "Ε ＝ μήκος · πλάτος ＝ (2πρ) · υ",
    prob1Row3C: "31,4 · 8 ＝ 251,2 cm²",
    prob1ResSummary: "Απάντηση:",
    prob1ResText: "α) Το ορθογώνιο έχει μήκος 31,4 cm και πλάτος 8 cm. β) Το παράπλευρο εμβαδόν είναι 251,2 cm².",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΚΩΝΟΣ, ΣΦΑΙΡΑ & ΣΦΑΙΡΙΚΟ ΤΡΙΓΩΝΟ",
    prob2Title: "Σύγκριση γενέτειρας-ύψους στον κώνο και ιδιότητες σφαίρας",
    prob2DescPre: "α) Ένας ορθός κώνος έχει ακτίνα βάσης ρ ＝ 6 cm, ύψος υ ＝ 8 cm και γενέτειρα λ ＝ 10 cm. Πόσο είναι το μήκος του τόξου του κυκλικού τομέα στο ανάπτυγμά του (π ≈ 3,14) και γιατί ισχύει λ > υ; β) Αν ένα σφαιρικό τρίγωνο έχει δύο γωνίες ίσες με 90° και μία γωνία ίση με 60°, πόσο είναι το άθροισμα των γωνιών του;",
    prob2DiagramCaption: "Ορθός κώνος (ρ ＝ 6, υ ＝ 8, λ ＝ 10 cm) και σφαιρικό τρίγωνο (240°)",
    prob2ColPart: "Ερώτημα",
    prob2ColRule: "Μαθηματική Σχέση",
    prob2ColCalc: "Υπολογισμός & Απάντηση",
    prob2Row1Q: "α) Μήκος τόξου τομέα",
    prob2Row1R: "Ίσο με την περιφέρεια βάσης: 2 · π · ρ",
    prob2Row1C: "2 · 3,14 · 6 ＝ 37,68 cm",
    prob2Row2Q: "α) Σύγκριση λ και υ",
    prob2Row2R: "Ορθογώνιο τρίγωνο ΚΟΑ (υποτείνουσα λ)",
    prob2Row2C: "λ ＝ 10 cm > υ ＝ 8 cm (η υποτείνουσα > κάθετη)",
    prob2Row3Q: "β) Άθροισμα σφαιρικού △",
    prob2Row3R: "90° ＋ 90° ＋ 60° (πάντα > 180°)",
    prob2Row3C: "240° (μεγαλύτερο από 180° κατά 60°)",
    prob2ResSummary: "Απάντηση:",
    prob2ResText: "α) Μήκος τόξου 37,68 cm και λ > υ επειδή η γενέτειρα είναι υποτείνουσα. β) Άθροισμα γωνιών 240°.",

    // Alerts
    alertTitle: "ΠΡΟΣΟΧΗ: ΚΛΑΣΙΚΑ ΛΑΘΗ ΣΕ ΚΥΛΙΝΔΡΟ, ΚΩΝΟ & ΣΦΑΙΡΑ",
    alert1Title: "Ύψος κώνου (υ) vs Γενέτειρα κώνου (λ):",
    alert1Desc: "Στον κύλινδρο η γενέτειρα ισούται με το ύψος (γ ＝ υ). Στον κώνο όμως η γενέτειρα είναι πλάγια (υποτείνουσα) και είναι ΠΑΝΤΑ μεγαλύτερη από το ύψος (λ > υ).",
    alert2Title: "Ακτίνα του κυκλικού τομέα στο ανάπτυγμα του κώνου:",
    alert2Desc: "Στο ανάπτυγμα του κώνου, η ακτίνα του κυκλικού τομέα ΔΕΝ είναι η ακτίνα βάσης ρ, αλλά η γενέτειρα λ του κώνου!",
    alert3Title: "Σφαιρικό τρίγωνο vs Επίπεδο τρίγωνο:",
    alert3Desc: "Οι πλευρές ενός σφαιρικού τριγώνου είναι τόξα μεγίστων κύκλων και το άθροισμα των γωνιών του είναι πάντα μεγαλύτερο από 180° (μπορεί να έχει ακόμη και τρεις ορθές γωνίες, 270°!).",

    // Bottom
    bottomTitle: "Εξασκηθείτε στον Κύλινδρο, τον Κώνο και τη Σφαίρα!",
    bottomDesc: "Δοκιμάστε τις γνώσεις σας στα στοιχεία κυλίνδρου και κώνου, στα αναπτύγματα, στον μέγιστο κύκλο και στο σφαιρικό τρίγωνο με 12 διαδραστικές ασκήσεις.",
    bottomBtn: "ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ"
  },
  en: {
    pageTitle: "Cylinder, Cone and Sphere • Great Circle & Spherical Triangle | Grade 7 Theory",
    pageDesc: "Grade 7 geometry theory: cylinder and its elements, cone and its elements, sphere, great circle, spherical triangle, and interactive net unfolding.",
    backNav: "Grade 7",
    heroBadge: "CHAPTER 15 • GRADE 7",
    heroTitle: "Solids of Revolution: Cylinder, Cone and Sphere",
    heroDesc: "Explore the cylinder, cone, and sphere, study their key elements (base, height, slant height, radius ρ), interactively unfold cylinder and cone nets, and discover great circles and spherical triangles!",
    btnExercises: "EXERCISES",
    btnGoExercises: "GO TO EXERCISES",

    // Card 1
    card1Badge: "1",
    card1Title: "Cylinder and Elements of a Cylinder",
    card1Desc: "A right circular cylinder is generated by rotating a rectangle 360° around one of its sides:",
    card1List1: "• Bases: Two congruent, parallel circles (O, ρ) and (O', ρ).",
    card1List2: "• Axis & Height (h): Segment OO' joining the base centers is perpendicular to both bases and equals the height h.",
    card1List3: "• Generator (g): Any segment on the lateral surface parallel to axis OO' (in a right cylinder g ＝ h). Its lateral net is a rectangle of dimensions 2πρ × h.",

    // Card 2
    card2Badge: "2",
    card2Title: "Cone and Elements of a Cone",
    card2Desc: "A right circular cone is generated by rotating a right triangle 360° around one of its legs:",
    card2List1: "• Base & Apex: A circle (O, ρ) and a point K (the apex) outside the plane of the base.",
    card2List2: "• Height (h): The perpendicular distance KO from the apex K to the center O of the base.",
    card2List3: "• Slant Height / Generator (l): Any line segment joining the apex K to a point on the base circle. Its lateral net is a circular sector of radius l and arc length 2πρ.",

    // Card 3
    card3Badge: "3",
    card3Title: "Sphere (O, ρ) and Great Circle",
    card3Desc: "A sphere (O, ρ) is the set of all points in space whose distance from a fixed center O is less than or equal to a positive radius ρ:",
    card3List1: "• Spherical Surface: The set of points in space at distance exactly equal to ρ from center O.",
    card3List2: "• Great Circle: Any intersection of a sphere with a plane passing through its center O. It has center O and radius ρ (e.g., Earth's Equator and Meridians).",
    card3Note: "A sphere has NO flat 2D net (it cannot be flattened onto a plane without stretching or tearing).",

    // Card 4
    card4Badge: "4",
    card4Title: "Spherical Triangle",
    card4Desc: "On a spherical surface, arcs of great circles play the role of straight lines (representing the shortest paths between two points on the sphere):",
    card4List1: "• Spherical Triangle ABC: The region of a spherical surface bounded by three great circle arcs AB, BC, CA (each shorter than a semicircle).",
    card4List2: "• Angle Sum Property: Unlike a planar triangle (A ＋ B ＋ C ＝ 180°), the angle sum of any spherical triangle is strictly GREATER than 180° (180° < A ＋ B ＋ C < 540°).",

    // Interactive Lab
    labBadge: "INTERACTIVE LAB",
    labTitle: "Part A: 3D Nets of Cylinder, Cone & Sphere • Part B: Elements (ρ, h)",

    labPartATitle: "PART A: DRAG THE SLIDER TO UNFOLD CYLINDER & CONE (AND EXPLORE SPHERE)",
    labSelectSolid: "1. SELECT SOLID:",
    labSolidCylinder: "Right Cylinder",
    labSolidCone: "Right Cone",
    labSolidSphere: "Sphere & Spherical Triangle",
    labUnfoldSlider: "2. NET UNFOLDING SLIDER (0% CLOSED ──▶ 100% FLAT)",
    labYawSlider: "Horizontal 3D rotation",
    labPitchSlider: "Vertical 3D tilt",
    labDragHint: "💡 Drag on the shape with mouse or finger for free 3D rotation!",
    labStatusClosed: "Closed 3D solid (0%) — Drag the slider right to unroll its surface!",
    labStatusMid: "Unrolling the curved surface and opening the circular bases...",
    labStatusOpenCyl: "✓ Cylinder Net (100%): 1 rectangle (2πρ × h) and 2 congruent circles (O, ρ)!",
    labStatusOpenCone: "✓ Cone Net (100%): 1 circular sector (radius l) and 1 base circle (O, ρ)!",
    labStatusSphere: "🌐 Sphere (O, ρ): The green arc is a Great Circle and the orange region is a Spherical Triangle (no flat net).",

    labPartBTitle: "PART B: CYLINDER & CONE ELEMENTS EXPLORER (RADIUS ρ, HEIGHT h)",
    labModeCyl: "Right Cylinder",
    labModeCone: "Right Cone",
    labRadiusSlider: "Base radius (ρ)",
    labHeightSlider: "Solid height (h)",
    labPrismCaptionCyl: "Generator g ＝ h • Base circumference ＝ 2πρ",
    labPrismCaptionCone: "Height KO ＝ h ⊥ base • Slant height l > h",
    labStatBases: "Circular Bases",
    labStatGen: "Generator",
    labStatNet: "Lateral Net Shape",
    labStatCircum: "Base Circumference",

    // Solved Problems
    solvedTitle: "Solved Practice Problems",
    prob1Badge: "PROBLEM 1: NET OF A RIGHT CYLINDER",
    prob1Title: "Finding rectangle dimensions in the net of a cylinder",
    prob1DescPre: "A right cylinder has a circular base of radius ρ ＝ 5 cm and height h ＝ 8 cm. Using π ≈ 3.14, find: (a) the length and width of the rectangle formed by its lateral surface in its net, and (b) the lateral surface area of the cylinder.",
    prob1DiagramCaption: "Right cylinder (ρ ＝ 5 cm, h ＝ 8 cm) and its rectangular net",
    prob1ColPart: "Question",
    prob1ColRule: "Mathematical Relation",
    prob1ColCalc: "Calculation & Answer",
    prob1Row1Q: "(a) Rectangle length",
    prob1Row1R: "Equal to base circumference: 2 · π · ρ",
    prob1Row1C: "2 · 3.14 · 5 ＝ 31.4 cm",
    prob1Row2Q: "(a) Rectangle width",
    prob1Row2R: "Equal to cylinder height (h)",
    prob1Row2C: "h ＝ 8 cm",
    prob1Row3Q: "(b) Lateral surface area",
    prob1Row3R: "A ＝ length · width ＝ (2πρ) · h",
    prob1Row3C: "31.4 · 8 ＝ 251.2 cm²",
    prob1ResSummary: "Answer:",
    prob1ResText: "(a) The rectangle has length 31.4 cm and width 8 cm. (b) Lateral surface area is 251.2 cm².",

    prob2Badge: "PROBLEM 2: CONE, SPHERE & SPHERICAL TRIANGLE",
    prob2Title: "Comparing slant height vs. height in a cone and sphere properties",
    prob2DescPre: "(a) A right cone has base radius ρ ＝ 6 cm, height h ＝ 8 cm, and slant height l ＝ 10 cm. What is the arc length of the circular sector in its net (π ≈ 3.14) and why is l > h? (b) If a spherical triangle has two angles equal to 90° and one angle equal to 60°, what is its angle sum?",
    prob2DiagramCaption: "Right cone (ρ ＝ 6, h ＝ 8, l ＝ 10 cm) and spherical triangle (240°)",
    prob2ColPart: "Question",
    prob2ColRule: "Mathematical Relation",
    prob2ColCalc: "Calculation & Answer",
    prob2Row1Q: "(a) Sector arc length",
    prob2Row1R: "Equal to base circumference: 2 · π · ρ",
    prob2Row1C: "2 · 3.14 · 6 ＝ 37.68 cm",
    prob2Row2Q: "(a) Comparing l and h",
    prob2Row2R: "Right triangle KOA (hypotenuse l)",
    prob2Row2C: "l ＝ 10 cm > h ＝ 8 cm (hypotenuse > leg)",
    prob2Row3Q: "(b) Spherical △ sum",
    prob2Row3R: "90° ＋ 90° ＋ 60° (always > 180°)",
    prob2Row3C: "240° (exceeds 180° by 60°)",
    prob2ResSummary: "Answer:",
    prob2ResText: "(a) Arc length 37.68 cm and l > h because slant height is the hypotenuse. (b) Angle sum 240°.",

    // Alerts
    alertTitle: "CAUTION: CLASSIC PITFALLS WITH CYLINDERS, CONES & SPHERES",
    alert1Title: "Cone height (h) vs. Slant height (l):",
    alert1Desc: "In a right cylinder, generator equals height (g ＝ h). In a right cone, slant height l is slanted (hypotenuse) and is ALWAYS greater than height (l > h).",
    alert2Title: "Radius of the circular sector in a cone's net:",
    alert2Desc: "In a cone's net, the radius of the circular sector is NOT the base radius ρ — it is the slant height l of the cone!",
    alert3Title: "Spherical triangle vs. Planar triangle:",
    alert3Desc: "The sides of a spherical triangle are arcs of great circles and its angle sum is always greater than 180° (it can even have three right angles, 270°!).",

    // Bottom
    bottomTitle: "Master the Cylinder, Cone and Sphere!",
    bottomDesc: "Practice cylinder and cone elements, solid nets, great circles, and spherical triangles with 12 interactive exercises.",
    bottomBtn: "START EXERCISES"
  }
};

export default function KilindrosKonosSfairaTheory() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';
  const locCode = isEl ? 'el-GR' : 'en-US';
  const t = translations[isEl ? 'el' : 'en'];

  // State Μέρος Α: Άνοιγμα Αναπτυγμάτων Κυλίνδρου, Κώνου & Σφαίρας
  const [solidKey, setSolidKey] = useState('cylinder');
  const [unfoldPercent, setUnfoldPercent] = useState(0);
  const [yawDeg, setYawDeg] = useState(-24);
  const [pitchDeg, setPitchDeg] = useState(22);
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0 });

  // State Μέρος Β: Εξερευνητής Στοιχείων Κυλίνδρου & Κώνου (ρ, υ)
  const [elemSolid, setElemSolid] = useState('cylinder');
  const [radVal, setRadVal] = useState(4);
  const [heightVal, setHeightVal] = useState(6);

  const solidPolys = buildCurvedSolidPolygons(solidKey, unfoldPercent / 100, yawDeg, pitchDeg);

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

  // Υπολογισμοί για Μέρος Β
  const circumApprox = Number((2 * 3.14 * radVal).toFixed(2));
  const slantApprox = Number(Math.hypot(radVal, heightVal).toFixed(2));
  const svgRx = 26 + radVal * 7;
  const svgRy = 10 + radVal * 2.2;
  const svgBotY = 152;
  const svgTopY = svgBotY - (42 + heightVal * 7.5);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/53-kilindros-konos-sfaira-ask"
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
                href="/a-gymnasiou/53-kilindros-konos-sfaira-ask"
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
          
          {/* ΚΑΡΤΑ 1: ΚΥΛΙΝΔΡΟΣ ΚΑΙ ΣΤΟΙΧΕΙΑ ΚΥΛΙΝΔΡΟΥ */}
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

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 space-y-1.5 leading-relaxed">
                <div>{t.card1List1}</div>
                <div>{t.card1List2}</div>
                <div>{t.card1List3}</div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 2: ΚΩΝΟΣ ΚΑΙ ΣΤΟΙΧΕΙΑ ΚΩΝΟΥ */}
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

          {/* ΚΑΡΤΑ 3: ΣΦΑΙΡΑ ΚΑΙ ΜΕΓΙΣΤΟΣ ΚΥΚΛΟΣ */}
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

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 space-y-1.5 mb-3 leading-relaxed">
                <div>{t.card3List1}</div>
                <div>{t.card3List2}</div>
              </div>

              <div className="bg-indigo-900 text-white rounded-xl p-2.5 text-xs sm:text-sm font-medium leading-relaxed">
                {t.card3Note}
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 4: ΣΦΑΙΡΙΚΟ ΤΡΙΓΩΝΟ */}
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

              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs sm:text-sm text-indigo-950 space-y-1.5 leading-relaxed">
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
              🌐 {toCleanUppercase(t.labBadge)}
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.labTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full min-w-0">
            
            {/* ΜΕΡΟΣ Α: 3D ΑΝΟΙΓΜΑ ΑΝΑΠΤΥΓΜΑΤΩΝ (ΚΥΛΙΝΔΡΟΣ, ΚΩΝΟΣ) & ΣΦΑΙΡΑ */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 min-w-0">
              <div className="space-y-3">
                <span className="text-xs font-black text-indigo-900 uppercase tracking-wider block">
                  {toCleanUppercase(t.labPartATitle)}
                </span>

                {/* 1. Επιλογή στερεού */}
                <div>
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">
                    {toCleanUppercase(t.labSelectSolid)}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { key: 'cylinder', label: t.labSolidCylinder },
                      { key: 'cone', label: t.labSolidCone },
                      { key: 'sphere', label: t.labSolidSphere }
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

                {/* 2. Μπάρα Ανοίγματος Αναπτύγματος (μόνο για Κύλινδρο & Κώνο) */}
                {solidKey !== 'sphere' && (
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
                )}

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

                {/* Διαδραστικός 3D SVG Καμβάς (με Mouse & Touch περιστροφή) */}
                <div
                  onMouseDown={handleSvgMouseDown}
                  onTouchStart={handleSvgTouchStart}
                  className="bg-slate-950 rounded-2xl p-3 flex flex-col items-center justify-center shadow-inner overflow-hidden cursor-grab active:cursor-grabbing touch-none"
                >
                  <svg viewBox="0 0 330 225" className="w-full max-w-sm h-52 select-none">
                    {solidPolys.map((poly) => (
                      <polygon
                        key={poly.id}
                        points={poly.points}
                        fill={poly.fill}
                        fillOpacity={poly.opacity}
                        stroke={poly.stroke}
                        strokeWidth="1.1"
                        strokeLinejoin="round"
                      />
                    ))}
                    <text x="165" y="216" textAnchor="middle" className="text-[9.5px] font-bold fill-slate-400">
                      {t.labDragHint}
                    </text>
                  </svg>
                </div>
              </div>

              {/* Μήνυμα κατάστασης */}
              <div
                className={`p-3 rounded-xl border text-xs font-bold leading-snug ${
                  solidKey === 'sphere'
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : unfoldPercent === 100
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-950'
                }`}
              >
                {solidKey === 'sphere'
                  ? t.labStatusSphere
                  : unfoldPercent === 0
                  ? t.labStatusClosed
                  : unfoldPercent < 100
                  ? `${t.labStatusMid} (${unfoldPercent}%)`
                  : solidKey === 'cylinder'
                  ? t.labStatusOpenCyl
                  : t.labStatusOpenCone}
              </div>
            </div>

            {/* ΜΕΡΟΣ Β: ΕΞΕΡΕΥΝΗΤΗΣ ΣΤΟΙΧΕΙΩΝ ΚΥΛΙΝΔΡΟΥ & ΚΩΝΟΥ */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 min-w-0">
              <div className="space-y-3">
                <span className="text-xs font-black text-indigo-900 uppercase tracking-wider block">
                  {toCleanUppercase(t.labPartBTitle)}
                </span>

                {/* Επιλογή Κυλίνδρου / Κώνου */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { key: 'cylinder', label: t.labModeCyl },
                    { key: 'cone', label: t.labModeCone }
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setElemSolid(item.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        elemSolid === item.key
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white hover:bg-indigo-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Sliders ακτίνας ρ και ύψους υ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CustomSlider
                    label={t.labRadiusSlider}
                    min={2}
                    max={6}
                    step={1}
                    value={radVal}
                    onChange={setRadVal}
                    unit=" cm"
                    color="#4f46e5"
                    locale={locale}
                  />
                  <CustomSlider
                    label={t.labHeightSlider}
                    min={3}
                    max={9}
                    step={1}
                    value={heightVal}
                    onChange={setHeightVal}
                    unit=" cm"
                    color="#059669"
                    locale={locale}
                  />
                </div>

                {/* SVG Τεχνικό Σχήμα Κυλίνδρου / Κώνου με ρ, υ, γενέτειρα */}
                <div className="bg-slate-950 rounded-2xl p-3 flex flex-col items-center justify-center shadow-inner overflow-hidden">
                  <svg viewBox="0 0 330 205" className="w-full max-w-sm h-48 select-none">
                    {elemSolid === 'cylinder' ? (
                      <>
                        {/* Κάτω βάση */}
                        <ellipse cx="165" cy={svgBotY} rx={svgRx} ry={svgRy} fill="rgba(16, 185, 129, 0.25)" stroke="#34d399" strokeWidth="2" />
                        {/* Πάνω βάση */}
                        <ellipse cx="165" cy={svgTopY} rx={svgRx} ry={svgRy} fill="rgba(99, 102, 241, 0.34)" stroke="#818cf8" strokeWidth="2" />
                        {/* Γενέτειρες αριστερά & δεξιά */}
                        <line x1={165 - svgRx} y1={svgTopY} x2={165 - svgRx} y2={svgBotY} stroke="#818cf8" strokeWidth="2" />
                        <line x1={165 + svgRx} y1={svgTopY} x2={165 + svgRx} y2={svgBotY} stroke="#818cf8" strokeWidth="2" />
                        {/* Άξονας / Ύψος υ */}
                        <line x1="165" y1={svgTopY} x2="165" y2={svgBotY} stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="4 3" />
                        {/* Ακτίνα ρ */}
                        <line x1="165" y1={svgBotY} x2={165 + svgRx} y2={svgBotY} stroke="#34d399" strokeWidth="2" />
                        {/* Ορθή γωνία */}
                        <polyline points={`165,${svgBotY - 8} 173,${svgBotY - 8} 173,${svgBotY}`} fill="none" stroke="#fbbf24" strokeWidth="1.4" />

                        <circle cx="165" cy={svgBotY} r="3.2" fill="#fbbf24" />
                        <text x={165 + svgRx / 2} y={svgBotY - 4} textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-300">
                          ρ ＝ {radVal}
                        </text>
                        <text x="157" y={(svgTopY + svgBotY) / 2} textAnchor="end" className="text-[10px] font-mono font-bold fill-amber-300">
                          {isEl ? `υ ＝ ${heightVal}` : `h ＝ ${heightVal}`}
                        </text>
                      </>
                    ) : (
                      <>
                        {/* Βάση κώνου */}
                        <ellipse cx="165" cy={svgBotY} rx={svgRx} ry={svgRy} fill="rgba(16, 185, 129, 0.25)" stroke="#34d399" strokeWidth="2" />
                        {/* Γενέτειρες λ */}
                        <line x1="165" y1={svgTopY} x2={165 - svgRx} y2={svgBotY} stroke="#818cf8" strokeWidth="2" />
                        <line x1="165" y1={svgTopY} x2={165 + svgRx} y2={svgBotY} stroke="#818cf8" strokeWidth="2" />
                        {/* Ύψος υ */}
                        <line x1="165" y1={svgTopY} x2="165" y2={svgBotY} stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="4 3" />
                        {/* Ακτίνα ρ */}
                        <line x1="165" y1={svgBotY} x2={165 + svgRx} y2={svgBotY} stroke="#34d399" strokeWidth="2" />
                        {/* Ορθή γωνία */}
                        <polyline points={`165,${svgBotY - 8} 173,${svgBotY - 8} 173,${svgBotY}`} fill="none" stroke="#fbbf24" strokeWidth="1.4" />

                        <circle cx="165" cy={svgTopY} r="4" fill="#fbbf24" />
                        <circle cx="165" cy={svgBotY} r="3.2" fill="#34d399" />
                        <text x={165 + svgRx / 2} y={svgBotY - 4} textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-300">
                          ρ ＝ {radVal}
                        </text>
                        <text x="157" y={(svgTopY + svgBotY) / 2 + 4} textAnchor="end" className="text-[10px] font-mono font-bold fill-amber-300">
                          {isEl ? `υ ＝ ${heightVal}` : `h ＝ ${heightVal}`}
                        </text>
                        <text x={172 + svgRx / 2} y={(svgTopY + svgBotY) / 2 - 4} textAnchor="start" className="text-[10px] font-mono font-bold fill-indigo-300">
                          {isEl ? 'λ' : 'l'}
                        </text>
                      </>
                    )}

                    <text x="165" y="194" textAnchor="middle" className="text-[10px] font-bold fill-slate-300">
                      {elemSolid === 'cylinder' ? t.labPrismCaptionCyl : t.labPrismCaptionCone}
                    </text>
                  </svg>
                </div>
              </div>

              {/* Κάρτες Στοιχείων */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-indigo-900 text-white rounded-xl">
                  <span className="text-[10px] text-indigo-200 block font-sans font-bold">{t.labStatBases}</span>
                  <strong>{elemSolid === 'cylinder' ? (isEl ? '2 κύκλοι' : '2 circles') : (isEl ? '1 κύκλος' : '1 circle')}</strong>
                </div>
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl">
                  <span className="text-[10px] text-emerald-800 block font-sans font-bold">{t.labStatGen}</span>
                  <strong>
                    {elemSolid === 'cylinder'
                      ? `${heightVal} cm`
                      : `≈ ${slantApprox.toLocaleString(locCode)} cm`}
                  </strong>
                </div>
                <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-950 rounded-xl">
                  <span className="text-[10px] text-amber-800 block font-sans font-bold">{t.labStatCircum}</span>
                  <strong>≈ {circumApprox.toLocaleString(locCode)} cm</strong>
                </div>
                <div className="p-2.5 bg-slate-800 text-white rounded-xl">
                  <span className="text-[10px] text-slate-300 block font-sans font-bold">{t.labStatNet}</span>
                  <strong className="font-sans">
                    {elemSolid === 'cylinder' ? (isEl ? 'Ορθογώνιο' : 'Rectangle') : (isEl ? 'Κυκλ. τομέας' : 'Sector')}
                  </strong>
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
                    {/* Κύλινδρος αριστερά */}
                    <ellipse cx="75" cy="134" rx="34" ry="11" fill="rgba(16, 185, 129, 0.25)" stroke="#34d399" strokeWidth="1.8" />
                    <ellipse cx="75" cy="48" rx="34" ry="11" fill="rgba(99, 102, 241, 0.35)" stroke="#818cf8" strokeWidth="1.8" />
                    <line x1="41" y1="48" x2="41" y2="134" stroke="#818cf8" strokeWidth="1.8" />
                    <line x1="109" y1="48" x2="109" y2="134" stroke="#818cf8" strokeWidth="1.8" />
                    <line x1="75" y1="134" x2="109" y2="134" stroke="#34d399" strokeWidth="1.8" />
                    <text x="92" y="130" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-emerald-300">ρ＝5</text>
                    <text x="34" y="94" textAnchor="end" className="text-[8.5px] font-mono font-bold fill-amber-300">υ＝8</text>

                    {/* Ορθογώνιο ανάπτυγμα δεξιά */}
                    <rect x="148" y="56" width="142" height="68" fill="rgba(16, 185, 129, 0.24)" stroke="#34d399" strokeWidth="1.8" />
                    <text x="219" y="138" textAnchor="middle" className="text-[9px] font-mono font-bold fill-emerald-300">2πρ ≈ 31,4 cm</text>
                    <text x="295" y="94" textAnchor="start" className="text-[9px] font-mono font-bold fill-amber-300">8</text>
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
                    <div className="font-bold text-indigo-700 font-mono">{t.prob1Row1C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob1Row2Q}</div>
                    <div className="text-slate-600">{t.prob1Row2R}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob1Row2C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob1Row3Q}</div>
                    <div className="text-slate-600 font-mono">{t.prob1Row3R}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob1Row3C}</div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full table-fixed text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5 border-b w-[28%]">{t.prob1ColPart}</th>
                        <th className="p-2.5 border-b w-[38%]">{t.prob1ColRule}</th>
                        <th className="p-2.5 border-b w-[34%]">{t.prob1ColCalc}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob1Row1Q}</td>
                        <td className="p-2.5 break-words">{t.prob1Row1R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700 break-words">{t.prob1Row1C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob1Row2Q}</td>
                        <td className="p-2.5 break-words">{t.prob1Row2R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700 break-words">{t.prob1Row2C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob1Row3Q}</td>
                        <td className="p-2.5 font-mono break-words">{t.prob1Row3R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700 break-words">{t.prob1Row3C}</td>
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
                    {/* Κώνος αριστερά */}
                    <ellipse cx="82" cy="136" rx="38" ry="12" fill="rgba(16, 185, 129, 0.25)" stroke="#34d399" strokeWidth="1.8" />
                    <line x1="82" y1="36" x2="44" y2="136" stroke="#818cf8" strokeWidth="1.8" />
                    <line x1="82" y1="36" x2="120" y2="136" stroke="#818cf8" strokeWidth="1.8" />
                    <line x1="82" y1="36" x2="82" y2="136" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 3" />
                    <line x1="82" y1="136" x2="120" y2="136" stroke="#34d399" strokeWidth="1.8" />
                    <text x="101" y="132" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-emerald-300">ρ＝6</text>
                    <text x="77" y="92" textAnchor="end" className="text-[8.5px] font-mono font-bold fill-amber-300">υ＝8</text>
                    <text x="108" y="84" textAnchor="start" className="text-[8.5px] font-mono font-bold fill-indigo-300">λ＝10</text>

                    {/* Σφαίρα με καμπύλο σφαιρικό τρίγωνο δεξιά */}
                    <circle cx="232" cy="92" r="52" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="1.8" />
                    <ellipse cx="232" cy="92" rx="52" ry="16" fill="none" stroke="#34d399" strokeWidth="1.6" />
                    <path
                      d="M 232,40 Q 218,74 232,108 A 52,16 0 0,0 276,99 Q 264,62 232,40 Z"
                      fill="rgba(245, 158, 11, 0.42)"
                      stroke="#fbbf24"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <circle cx="232" cy="40" r="2.5" fill="#fbbf24" />
                    <circle cx="232" cy="108" r="2.5" fill="#fbbf24" />
                    <circle cx="276" cy="99" r="2.5" fill="#fbbf24" />
                    <text x="232" y="162" textAnchor="middle" className="text-[8.5px] font-bold fill-amber-300">
                      {isEl ? 'Σφαιρικό △ (240°)' : 'Spherical △ (240°)'}
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
                    <div className="text-slate-600">{t.prob2Row1R}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob2Row1C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob2Row2Q}</div>
                    <div className="text-slate-600">{t.prob2Row2R}</div>
                    <div className="font-bold text-indigo-700">{t.prob2Row2C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob2Row3Q}</div>
                    <div className="text-slate-600 font-mono">{t.prob2Row3R}</div>
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
                        <td className="p-2.5 break-words">{t.prob2Row1R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700 break-words">{t.prob2Row1C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob2Row2Q}</td>
                        <td className="p-2.5 break-words">{t.prob2Row2R}</td>
                        <td className="p-2.5 font-bold text-indigo-700 break-words">{t.prob2Row2C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob2Row3Q}</td>
                        <td className="p-2.5 font-mono break-words">{t.prob2Row3R}</td>
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
            href="/a-gymnasiou/53-kilindros-konos-sfaira-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase(t.bottomBtn)}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}