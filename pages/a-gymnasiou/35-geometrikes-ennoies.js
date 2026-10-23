import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// ============================================================================
// ΕΠΑΝΑΧΡΗΣΙΜΟΠΟΙΗΣΙΜΟ COMPONENT ΚΛΑΣΜΑΤΟΣ (Πρόσημο πάντα μπροστά από τη γραμμή)
// ============================================================================
function Frac({ num, den, isNeg = false, className = '' }) {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;

  const displayNum = numStr.replace(/^-/, '');
  const displayDen = denStr.replace(/^-/, '');

  return (
    <span className={`inline-flex items-center gap-0.5 align-middle mx-1 font-mono ${className}`}>
      {hasMinus && <span className="font-bold">－</span>}
      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
        <span className="pb-0.5 px-1.5 border-b-2 w-full text-center" style={{ borderColor: 'currentColor' }}>
          {displayNum}
        </span>
        <span className="pt-0.5 px-1.5 w-full text-center">
          {displayDen}
        </span>
      </span>
    </span>
  );
}

export default function GeometrikesEnnoiesTheoria() {
  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 1: Σημείο, Ευθεία, Ημιευθεία, Ευθύγραμμο Τμήμα, Επίπεδο
  // --------------------------------------------------------------------------
  const [geoMode, setGeoMode] = useState('segment');

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 2: Απόσταση, Μέσο M & Σύγκριση Ευθυγράμμων Τμημάτων
  // --------------------------------------------------------------------------
  const [posA, setPosA] = useState(2);
  const [posB, setPosB] = useState(10);
  const [lenCD, setLenCD] = useState(8);

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 3: Διαδοχικά Τμήματα & Τεθλασμένες Γραμμές
  // --------------------------------------------------------------------------
  // modes: 'openPoly' | 'closedPoly' | 'collinear' | 'shortestPath'
  const [polyMode, setPolyMode] = useState('openPoly');
  const [seg1, setSeg1] = useState(5); // Μήκος ΑΒ
  const [seg2, setSeg2] = useState(4); // Μήκος ΒΓ
  const [seg3, setSeg3] = useState(6); // Μήκος ΓΔ

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 2
  const lenAB = useMemo(() => posB - posA, [posA, posB]);
  const posM = useMemo(() => (posA + posB) / 2, [posA, posB]);
  const halfLen = useMemo(() => lenAB / 2, [lenAB]);

  // Υπολογισμοί Εργαστηρίου 3 (Δυναμική Γεωμετρία SVG)
  const totalPolyLen = useMemo(() => seg1 + seg2 + seg3, [seg1, seg2, seg3]);

  const polyGeometry = useMemo(() => {
    // 1. Ανοιχτή Τεθλασμένη & Συντομότερη Οδός
    // Σταθερές γωνίες κλίσης για καθαρή απεικόνιση: ΑΒ (-38°), ΒΓ (+28°), ΓΔ (-18°)
    const degToRad = (deg) => (deg * Math.PI) / 180;
    const rawA = { x: 0, y: 0 };
    const rawB = {
      x: rawA.x + seg1 * Math.cos(degToRad(-38)),
      y: rawA.y + seg1 * Math.sin(degToRad(-38)),
    };
    const rawC = {
      x: rawB.x + seg2 * Math.cos(degToRad(28)),
      y: rawB.y + seg2 * Math.sin(degToRad(28)),
    };
    const rawD = {
      x: rawC.x + seg3 * Math.cos(degToRad(-18)),
      y: rawC.y + seg3 * Math.sin(degToRad(-18)),
    };

    // Πραγματική ευθύγραμμη απόσταση ΑΔ (σε μέτρα)
    const directAD = Number(
      Math.hypot(rawD.x - rawA.x, rawD.y - rawA.y).toFixed(1)
    );

    // Κλιμάκωση και κεντράρισμα στον καμβά 520x200
    const xs = [rawA.x, rawB.x, rawC.x, rawD.x];
    const ys = [rawA.y, rawB.y, rawC.y, rawD.y];
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const spanX = Math.max(maxX - minX, 1);
    const spanY = Math.max(maxY - minY, 1);
    // Σταθερή κλίμακα ~18px ανά μέτρο (με αυτόματη προσαρμογή αν μεγαλώσει πολύ)
    const scaleOpen = Math.min(380 / spanX, 115 / spanY, 21);

    const offsetX = 260 - ((minX + maxX) / 2) * scaleOpen;
    const offsetY = 98 - ((minY + maxY) / 2) * scaleOpen;

    const toSvgOpen = (pt) => ({
      x: Math.round(pt.x * scaleOpen + offsetX),
      y: Math.round(pt.y * scaleOpen + offsetY),
    });

    const openPts = {
      A: toSvgOpen(rawA),
      B: toSvgOpen(rawB),
      C: toSvgOpen(rawC),
      D: toSvgOpen(rawD),
    };

    // 2. Συνευθειακά Τμήματα (Πάνω στην ίδια ευθεία)
    // Κλίμακα: 14px ανά μέτρο, κεντραρισμένο στο x = 260
    const colScale = Math.min(400 / totalPolyLen, 18);
    const totalPx = totalPolyLen * colScale;
    const startColX = Math.round(260 - totalPx / 2);
    const colPts = {
      xA: startColX,
      xB: Math.round(startColX + seg1 * colScale),
      xC: Math.round(startColX + (seg1 + seg2) * colScale),
      xD: Math.round(startColX + totalPx),
    };

    // 3. Κλειστή Τεθλασμένη (Τρίγωνο με πλευρές seg1, seg2, seg3)
    // Έλεγχος τριγωνικής ανισότητας
    const canClose =
      seg1 + seg2 > seg3 && seg1 + seg3 > seg2 && seg2 + seg3 > seg1;

    let closedPts = null;
    if (canClose) {
      // Βάζουμε τη βάση ΓΑ = seg3 οριζόντια, και βρίσκουμε την κορυφή Β με τον νόμο των συνημιτόνων
      const cBase = seg3;
      const aSide = seg1; // ΑΒ
      const bSide = seg2; // ΒΓ
      const cosA = (aSide * aSide + cBase * cBase - bSide * bSide) / (2 * aSide * cBase);
      const clampedCos = Math.max(-1, Math.min(1, cosA));
      const sinA = Math.sqrt(Math.max(0, 1 - clampedCos * clampedCos));

      const triA = { x: 0, y: 0 };
      const triC = { x: cBase, y: 0 };
      const triB = { x: aSide * clampedCos, y: -aSide * sinA };

      const tXs = [triA.x, triB.x, triC.x];
      const tYs = [triA.y, triB.y, triC.y];
      const tMinX = Math.min(...tXs);
      const tMaxX = Math.max(...tXs);
      const tMinY = Math.min(...tYs);
      const tMaxY = Math.max(...tYs);

      const scaleTri = Math.min(
        340 / Math.max(tMaxX - tMinX, 1),
        125 / Math.max(tMaxY - tMinY, 1),
        22
      );
      const offTriX = 260 - ((tMinX + tMaxX) / 2) * scaleTri;
      const offTriY = 105 - ((tMinY + tMaxY) / 2) * scaleTri;

      closedPts = {
        A: {
          x: Math.round(triA.x * scaleTri + offTriX),
          y: Math.round(triA.y * scaleTri + offTriY),
        },
        B: {
          x: Math.round(triB.x * scaleTri + offTriX),
          y: Math.round(triB.y * scaleTri + offTriY),
        },
        C: {
          x: Math.round(triC.x * scaleTri + offTriX),
          y: Math.round(triC.y * scaleTri + offTriY),
        },
      };
    }

    return {
      openPts,
      directAD,
      colPts,
      canClose,
      closedPts,
    };
  }, [seg1, seg2, seg3, totalPolyLen]);

  return (
    <Layout
      title="Βασικές Γεωμετρικές Έννοιες | Α' Γυμνασίου"
      description="Σημείο, ευθεία, ημιευθεία, ευθύγραμμο τμήμα, μέσο τμήματος, απόσταση σημείων, επίπεδο, διαδοχικά τμήματα και τεθλασμένες γραμμές με διαδραστικά εργαστήρια."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/35-geometrikes-ennoies-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md"
        >
          <span>🎯</span>
          <span>ΑΣΚΗΣΕΙΣ</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-10 sm:space-y-16">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ ΓΕΩΜΕΤΡΙΑΣ • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Βασικές Γεωμετρικές Έννοιες & Σχήματα
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Εξερευνούμε διαδραστικά τα θεμέλια της Ευκλείδειας Γεωμετρίας: το σημείο, την ευθεία, την ημιευθεία, το ευθύγραμμο τμήμα, το μέσο τμήματος, το επίπεδο και τις τεθλασμένες γραμμές.
            </p>
          </div>
        </section>

        {/* ====================================================================
            1. ΣΗΜΕΙΟ, ΕΥΘΕΙΑ, ΗΜΙΕΥΘΕΙΑ, ΕΥΘΥΓΡΑΜΜΟ ΤΜΗΜΑ & ΕΠΙΠΕΔΟ + ΕΡΓΑΣΤΗΡΙΟ 1
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Σημείο, Ευθεία, Ημιευθεία, Ευθύγραμμο Τμήμα & Επίπεδο
            </h2>
          </div>

          {/* Κάρτες Θεωρίας */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs sm:text-sm leading-relaxed text-slate-700">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                1. ΣΗΜΕΙΟ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Αδιάστατο</h3>
              <p className="text-slate-600">
                Δεν έχει μήκος, πλάτος ή ύψος. Συμβολίζεται με κεφαλαία ελληνικά γράμματα (<strong>Α, Β, Γ, Μ...</strong>). Σημεία που ανήκουν στην ίδια ευθεία λέγονται <strong>συνευθειακά</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded inline-block">
                2. ΕΥΘΕΙΑ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Χωρίς Αρχή & Τέλος</h3>
              <p className="text-slate-600">
                Εκτείνεται απεριόριστα και προς τις δύο κατευθύνσεις. Από <strong>δύο σημεία Α και Β</strong> διέρχεται <strong>μία και μοναδική ευθεία</strong> (συμβολίζεται <strong>ε</strong> ή <strong>ΑΒ</strong>).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block">
                3. ΗΜΙΕΥΘΕΙΑ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Έχει Αρχή, όχι Τέλος</h3>
              <p className="text-slate-600">
                Ένα σημείο Ο πάνω σε μια ευθεία τη χωρίζει σε <strong>δύο αντικείμενες ημιευθείες</strong> (<strong>Οx</strong> και <strong>Οy</strong>) που έχουν κοινή αρχή το Ο.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                4. ΕΥΘ. ΤΜΗΜΑ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Έχει Αρχή & Τέλος</h3>
              <p className="text-slate-600">
                Το κομμάτι της ευθείας ανάμεσα σε δύο σημεία <strong>Α</strong> και <strong>Β</strong> (τα <strong>άκρα</strong> του). Είναι η <strong>συντομότερη οδός</strong> που ενώνει το Α με το Β.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded inline-block">
                5. ΕΠΙΠΕΔΟ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Επιφάνεια (π)</h3>
              <p className="text-slate-600">
                Μια λεία επιφάνεια που εκτείνεται απεριόριστα προς κάθε κατεύθυνση. Το παριστάνουμε με ένα παραλληλόγραμμο και το συμβολίζουμε με <strong>π, ρ, σ</strong>.
              </p>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΟΣ ΕΞΕΡΕΥΝΗΤΗΣ ΕΝΝΟΙΩΝ */}
          <div className="pt-2 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 1: Πάτησε σε κάθε έννοια για να τη δεις να ζωντανεύει πάνω στο Επίπεδο π
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {[
                  { id: 'point', label: '1. ΣΗΜΕΙΑ (Α, Ο, Β)', desc: 'Συνευθειακά σημεία' },
                  { id: 'line', label: '2. ΕΥΘΕΙΑ (ε ή ΑΒ)', desc: 'Απεριόριστη και στις 2 μεριές' },
                  { id: 'rayRight', label: '3. ΗΜΙΕΥΘΕΙΑ Οx', desc: 'Αρχή το Ο, προς τα δεξιά' },
                  { id: 'rayLeft', label: '4. ΗΜΙΕΥΘΕΙΑ Οy', desc: 'Αντικείμενη της Οx (αριστερά)' },
                  { id: 'segment', label: '5. ΕΥΘ. ΤΜΗΜΑ ΑΒ', desc: 'Περιορίζεται στα άκρα Α, Β' },
                  { id: 'plane', label: '6. ΕΠΙΠΕΔΟ (π)', desc: 'Ολόκληρη η επιφάνεια' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGeoMode(item.id)}
                    className={`p-3 rounded-xl text-left border transition-all active:scale-95 ${
                      geoMode === item.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-black tracking-wide">{item.label}</div>
                    <div
                      className={`text-[11px] mt-0.5 ${
                        geoMode === item.id ? 'text-indigo-100' : 'text-slate-500'
                      }`}
                    >
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΟΠΤΙΚΟΠΟΙΗΣΗ ΣΤΟ ΕΠΙΠΕΔΟ π
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 font-sans">
                    {geoMode === 'point' && 'ΣΗΜΕΙΑ Α, Ο, Β'}
                    {geoMode === 'line' && 'ΕΥΘΕΙΑ ε (ΑΒ)'}
                    {geoMode === 'rayRight' && 'ΗΜΙΕΥΘΕΙΑ Οx'}
                    {geoMode === 'rayLeft' && 'ΗΜΙΕΥΘΕΙΑ Οy (ΑΝΤΙΚΕΙΜΕΝΗ)'}
                    {geoMode === 'segment' && 'ΕΥΘΥΓΡΑΜΜΟ ΤΜΗΜΑ ΑΒ'}
                    {geoMode === 'plane' && 'ΕΠΙΠΕΔΟ π'}
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-3 flex justify-center">
                  <svg viewBox="0 0 540 210" className="w-full max-w-[520px] h-auto">
                    <polygon
                      points="50,25 510,25 480,185 20,185"
                      fill={geoMode === 'plane' ? '#312e81' : '#0f172a'}
                      stroke={geoMode === 'plane' ? '#818cf8' : '#334155'}
                      strokeWidth={geoMode === 'plane' ? '3' : '2'}
                      className="transition-all duration-300"
                    />
                    <text x="45" y="170" fill="#a5b4fc" fontSize="16" fontWeight="bold" fontStyle="italic">
                      π
                    </text>

                    <line
                      x1="45"
                      y1="105"
                      x2="495"
                      y2="105"
                      stroke="#334155"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                    />
                    <text x="55" y="92" fill="#64748b" fontSize="13" fontWeight="bold">
                      y
                    </text>
                    <text x="480" y="92" fill="#64748b" fontSize="13" fontWeight="bold">
                      x
                    </text>

                    {geoMode === 'line' && (
                      <g>
                        <line x1="45" y1="105" x2="495" y2="105" stroke="#38bdf8" strokeWidth="4" />
                        <polygon points="40,105 55,98 55,112" fill="#38bdf8" />
                        <polygon points="500,105 485,98 485,112" fill="#38bdf8" />
                        <text x="270" y="75" fill="#38bdf8" fontSize="14" fontWeight="bold" textAnchor="middle">
                          Ευθεία ε (χωρίς αρχή και χωρίς τέλος)
                        </text>
                      </g>
                    )}

                    {geoMode === 'rayRight' && (
                      <g>
                        <line x1="270" y1="105" x2="495" y2="105" stroke="#f59e0b" strokeWidth="4.5" />
                        <polygon points="500,105 485,98 485,112" fill="#f59e0b" />
                        <text x="380" y="75" fill="#fde68a" fontSize="14" fontWeight="bold" textAnchor="middle">
                          Ημιευθεία Οx (αρχή το Ο)
                        </text>
                      </g>
                    )}

                    {geoMode === 'rayLeft' && (
                      <g>
                        <line x1="270" y1="105" x2="45" y2="105" stroke="#f43f5e" strokeWidth="4.5" />
                        <polygon points="40,105 55,98 55,112" fill="#f43f5e" />
                        <text x="160" y="75" fill="#fda4af" fontSize="14" fontWeight="bold" textAnchor="middle">
                          Αντικείμενη Ημιευθεία Οy (αρχή το Ο)
                        </text>
                      </g>
                    )}

                    {geoMode === 'segment' && (
                      <g>
                        <line x1="140" y1="105" x2="400" y2="105" stroke="#10b981" strokeWidth="5" />
                        <text x="270" y="75" fill="#6ee7b7" fontSize="14" fontWeight="bold" textAnchor="middle">
                          Ευθύγραμμο Τμήμα ΑΒ (άκρα Α και Β)
                        </text>
                      </g>
                    )}

                    <circle
                      cx="140"
                      cy="105"
                      r={geoMode === 'point' || geoMode === 'segment' ? '6.5' : '5'}
                      fill={geoMode === 'segment' ? '#10b981' : '#38bdf8'}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text x="140" y="132" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">
                      Α
                    </text>

                    <circle
                      cx="270"
                      cy="105"
                      r={geoMode === 'rayRight' || geoMode === 'rayLeft' || geoMode === 'point' ? '6.5' : '5'}
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text x="270" y="132" fill="#fde68a" fontSize="14" fontWeight="bold" textAnchor="middle">
                      Ο
                    </text>

                    <circle
                      cx="400"
                      cy="105"
                      r={geoMode === 'point' || geoMode === 'segment' ? '6.5' : '5'}
                      fill={geoMode === 'segment' ? '#10b981' : '#38bdf8'}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text x="400" y="132" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">
                      Β
                    </text>
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed">
                  {geoMode === 'point' && (
                    <div>
                      <strong>Σημεία Α, Ο, Β:</strong> Επειδή βρίσκονται όλα πάνω στην ίδια ευθεία ε, ονομάζονται <strong>συνευθειακά σημεία</strong>.
                    </div>
                  )}
                  {geoMode === 'line' && (
                    <div>
                      <strong>Ευθεία ε (ή ΑΒ):</strong> Τα βέλη στα δύο άκρα δείχνουν ότι η ευθεία προεκτείνεται απεριόριστα και προς τις δύο κατευθύνσεις (δεν έχει μήκος).
                    </div>
                  )}
                  {geoMode === 'rayRight' && (
                    <div>
                      <strong>Ημιευθεία Οx:</strong> Ξεκινά από το σημείο <strong>Ο (αρχή)</strong>, περνά από το Β και προεκτείνεται απεριόριστα προς το x.
                    </div>
                  )}
                  {geoMode === 'rayLeft' && (
                    <div>
                      <strong>Ημιευθεία Οy:</strong> Έχει την ίδια αρχή <strong>Ο</strong> με την Οx, αποτελεί προέκτασή της προς την αντίθετη κατεύθυνση και μαζί σχηματίζουν ολόκληρη την ευθεία. Οι Οx και Οy λέγονται <strong>αντικείμενες ημιευθείες</strong>.
                    </div>
                  )}
                  {geoMode === 'segment' && (
                    <div>
                      <strong>Ευθύγραμμο Τμήμα ΑΒ:</strong> Περιλαμβάνει μόνο τα σημεία της ευθείας που βρίσκονται ανάμεσα στα άκρα <strong>Α</strong> και <strong>Β</strong>. Έχει συγκεκριμένο μήκος που μπορεί να μετρηθεί!
                    </div>
                  )}
                  {geoMode === 'plane' && (
                    <div>
                      <strong>Επίπεδο π:</strong> Περιέχει όλα τα σημεία, τις ευθείες και τα ευθύγραμμα τμήματα του σχήματος. Από τρία μη συνευθειακά σημεία διέρχεται ένα και μοναδικό επίπεδο.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            2. ΑΠΟΣΤΑΣΗ 2 ΣΗΜΕΙΩΝ, ΜΕΣΟ ΤΜΗΜΑΤΟΣ & ΣΥΓΚΡΙΣΗ + ΕΡΓΑΣΤΗΡΙΟ 2
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Απόσταση Σημείων, Μέσο Τμήματος & Σύγκριση Ευθυγράμμων Τμημάτων
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                ΑΠΟΣΤΑΣΗ ΣΗΜΕΙΩΝ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Μήκος Τμήματος ΑΒ</h3>
              <p className="text-slate-600">
                <strong>Απόσταση δύο σημείων Α και Β</strong> ονομάζεται το μήκος του ευθύγραμμου τμήματος ΑΒ (μετράται με τον βαθμονομημένο κανόνα/χάρακα σε cm, m, km κτλ.).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block">
                ΜΕΣΟ ΤΜΗΜΑΤΟΣ (Μ)
              </span>
              <h3 className="font-bold text-slate-900 text-base">Χωρισμός σε 2 Ίσα Μέρη</h3>
              <p className="text-slate-600">
                <strong>Μέσο</strong> ενός ευθύγραμμου τμήματος ΑΒ ονομάζεται το εσωτερικό του σημείο <strong>Μ</strong> που ισαπέχει από τα άκρα του:
              </p>
              <div className="p-1.5 bg-white rounded-xl border border-amber-200 font-mono text-center font-bold text-amber-950 flex items-center justify-center">
                <span>ΑΜ ＝ ΜΒ ＝ </span>
                <Frac num="ΑΒ" den="2" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                ΣΥΓΚΡΙΣΗ ΤΜΗΜΑΤΩΝ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Μεταφορά ή Μέτρηση</h3>
              <p className="text-slate-600">
                Για να συγκρίνουμε δύο τμήματα <strong>ΑΒ</strong> και <strong>ΓΔ</strong>, είτε μετράμε τα μήκη τους με χάρακα είτε μεταφέρουμε με διαβήτη το ένα πάνω στο άλλο ώστε να συμπέσουν οι αρχές τους.
              </p>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΧΑΡΑΚΑΣ, ΜΕΣΟ Μ & ΣΥΓΚΡΙΣΗ ΜΕ ΓΔ */}
          <div className="pt-2 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 2: Μέτρηση Απόστασης ΑΒ, Αυτόματο Μέσο Μ & Σύγκριση με το ΓΔ
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-indigo-900 uppercase block">ΘΕΣΗ Α (cm)</label>
                  <div className="grid grid-cols-[28px_1fr_28px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPosA, -1, 0, posB - 2, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-indigo-50 rounded-lg border border-indigo-200 font-bold text-sm font-mono text-indigo-950">
                      {posA}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPosA, 1, 0, posB - 2, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-indigo-900 uppercase block">ΘΕΣΗ Β (cm)</label>
                  <div className="grid grid-cols-[28px_1fr_28px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPosB, -1, posA + 2, 14, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-indigo-50 rounded-lg border border-indigo-200 font-bold text-sm font-mono text-indigo-950">
                      {posB}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPosB, 1, posA + 2, 14, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-amber-800 uppercase block">ΜΗΚΟΣ ΓΔ (cm)</label>
                  <div className="grid grid-cols-[28px_1fr_28px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setLenCD, -1, 2, 14, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-sm font-mono text-amber-950">
                      {lenCD}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setLenCD, 1, 2, 14, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-3 p-3.5 bg-white rounded-xl border border-slate-200 text-xs font-mono space-y-1.5 text-slate-700">
                  <div>
                    • <strong>Απόσταση ΑΒ:</strong> {posB} － {posA} ＝ <strong>{lenAB} cm</strong>
                  </div>
                  <div className="flex items-center flex-wrap">
                    <span>• <strong>Μέσο Μ:</strong> Χωρίζει το ΑΒ σε ΑΜ ＝ ΜΒ ＝ </span>
                    <Frac num={lenAB} den={2} />
                    <span>＝ <strong>{halfLen.toString().replace('.', ',')} cm</strong></span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΒΑΘΜΟΝΟΜΗΜΕΝΟΣ ΧΑΡΑΚΑΣ & ΣΥΓΚΡΙΣΗ
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans ${
                      lenAB === lenCD
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                        : lenAB > lenCD
                        ? 'bg-sky-500/20 text-sky-300 border-sky-400/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                    }`}
                  >
                    {lenAB === lenCD && 'ΑΒ ＝ ΓΔ (ΙΣΑ ΤΜΗΜΑΤΑ)'}
                    {lenAB > lenCD && 'ΑΒ ＞ ΓΔ (ΑΒ ΜΕΓΑΛΥΤΕΡΟ)'}
                    {lenAB < lenCD && 'ΑΒ ＜ ΓΔ (ΑΒ ΜΙΚΡΟΤΕΡΟ)'}
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-3 flex justify-center">
                  <svg viewBox="0 0 560 210" className="w-full max-w-[540px] h-auto">
                    <rect x="25" y="135" width="510" height="50" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                    {Array.from({ length: 15 }).map((_, cm) => {
                      const xPos = 42 + cm * 34;
                      return (
                        <g key={cm}>
                          <line x1={xPos} y1="135" x2={xPos} y2="152" stroke="#94a3b8" strokeWidth="2" />
                          <text x={xPos} y="172" fill="#cbd5e1" fontSize="11" fontWeight="bold" textAnchor="middle">
                            {cm}
                          </text>
                        </g>
                      );
                    })}

                    <g>
                      <line
                        x1={42 + posA * 34}
                        y1="95"
                        x2={42 + posB * 34}
                        y2="95"
                        stroke="#38bdf8"
                        strokeWidth="5"
                      />
                      <circle cx={42 + posA * 34} cy="95" r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                      <text x={42 + posA * 34} y="78" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">
                        Α
                      </text>

                      <circle cx={42 + posM * 34} cy="95" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                      <text x={42 + posM * 34} y="78" fill="#6ee7b7" fontSize="12" fontWeight="bold" textAnchor="middle">
                        Μ (Μέσο)
                      </text>
                      <text
                        x={42 + ((posA + posM) / 2) * 34}
                        y="115"
                        fill="#7dd3fc"
                        fontSize="10"
                        textAnchor="middle"
                      >
                        {halfLen.toString().replace('.', ',')} cm
                      </text>
                      <text
                        x={42 + ((posM + posB) / 2) * 34}
                        y="115"
                        fill="#7dd3fc"
                        fontSize="10"
                        textAnchor="middle"
                      >
                        {halfLen.toString().replace('.', ',')} cm
                      </text>

                      <circle cx={42 + posB * 34} cy="95" r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                      <text x={42 + posB * 34} y="78" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">
                        Β
                      </text>
                    </g>

                    <g>
                      <line
                        x1={42 + posA * 34}
                        y1="40"
                        x2={42 + Math.min(14.5, posA + lenCD) * 34}
                        y2="40"
                        stroke="#f59e0b"
                        strokeWidth="5"
                      />
                      <circle cx={42 + posA * 34} cy="40" r="5.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                      <text x={42 + posA * 34} y="25" fill="#fde68a" fontSize="12" fontWeight="bold" textAnchor="middle">
                        Γ
                      </text>
                      <circle
                        cx={42 + Math.min(14.5, posA + lenCD) * 34}
                        cy="40"
                        r="5.5"
                        fill="#f59e0b"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <text
                        x={42 + Math.min(14.5, posA + lenCD) * 34}
                        y="25"
                        fill="#fde68a"
                        fontSize="12"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        Δ ({lenCD} cm)
                      </text>
                    </g>
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200">
                  Για να συγκρίνουμε τα τμήματα <strong>ΑΒ ({lenAB} cm)</strong> και <strong>ΓΔ ({lenCD} cm)</strong>, τοποθετήσαμε την αρχή <strong>Γ</strong> πάνω από την αρχή <strong>Α</strong>: επειδή το Δ πέφτει{' '}
                  {lenAB === lenCD ? (
                    <strong className="text-emerald-300">ακριβώς πάνω στο Β, ισχύει ΑΒ ＝ ΓΔ!</strong>
                  ) : lenAB > lenCD ? (
                    <strong className="text-sky-300">πριν από το Β (εσωτερικά του ΑΒ), ισχύει ΑΒ ＞ ΓΔ!</strong>
                  ) : (
                    <strong className="text-amber-300">πέρα από το Β (εξωτερικά του ΑΒ), ισχύει ΑΒ ＜ ΓΔ!</strong>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            3. ΔΙΑΔΟΧΙΚΑ ΕΥΘΥΓΡΑΜΜΑ ΤΜΗΜΑΤΑ & ΤΕΘΛΑΣΜΕΝΕΣ ΓΡΑΜΜΕΣ + ΕΡΓΑΣΤΗΡΙΟ 3
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Διαδοχικά Ευθύγραμμα Τμήματα & Τεθλασμένες Γραμμές
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                ΔΙΑΔΟΧΙΚΑ ΤΜΗΜΑΤΑ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Το τέλος του 1ου = Αρχή του 2ου</h3>
              <p className="text-slate-600">
                Δύο ή περισσότερα ευθύγραμμα τμήματα (π.χ. <strong>ΑΒ, ΒΓ, ΓΔ</strong>) λέγονται <strong>διαδοχικά</strong> αν το τέλος του καθενός είναι η αρχή του επόμενου και δεν έχουν άλλα κοινά σημεία.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block">
                ΤΕΘΛΑΣΜΕΝΗ ΓΡΑΜΜΗ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Ανοιχτή ή Κλειστή</h3>
              <p className="text-slate-600">
                Το σχήμα που σχηματίζουν διαδοχικά τμήματα όταν <strong>δεν βρίσκονται στην ίδια ευθεία</strong> λέγεται <strong>τεθλασμένη γραμμή</strong>. Αν το τέλος του τελευταίου συμπίπτει με την αρχή του πρώτου, λέγεται <strong>κλειστή τεθλασμένη (πολύγωνο)</strong>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                ΘΕΜΕΛΙΩΔΗΣ ΙΔΙΟΤΗΤΑ
              </span>
              <h3 className="font-bold text-slate-900 text-base">Η Συντομότερη Διαδρομή</h3>
              <p className="text-slate-600">
                Το μήκος του ευθύγραμμου τμήματος <strong>ΑΔ</strong> που ενώνει απευθείας τα άκρα μιας τεθλασμένης γραμμής ΑΒΓΔ είναι <strong>πάντα μικρότερο</strong> από το συνολικό μήκος της τεθλασμένης:
              </p>
              <div className="p-1.5 bg-white rounded-lg border border-slate-200 font-mono text-center font-bold text-emerald-700">
                ΑΔ ＜ ΑΒ ＋ ΒΓ ＋ ΓΔ
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 3: ΔΥΝΑΜΙΚΟ SVG ΜΕ ΑΝΑΛΟΓΙΚΑ ΜΗΚΗ ΤΜΗΜΑΤΩΝ */}
          <div className="pt-2 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 3: Πειραματίσου με Διαδοχικά Τμήματα & Τεθλασμένες Γραμμές
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Χειριστήρια (5 cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'openPoly', label: 'ΑΝΟΙΧΤΗ ΤΕΘΛΑΣΜΕΝΗ' },
                    { id: 'closedPoly', label: 'ΚΛΕΙΣΤΗ (ΠΟΛΥΓΩΝΟ)' },
                    { id: 'collinear', label: 'ΣΥΝΕΥΘΕΙΑΚΑ (ΕΥΘΕΙΑ)' },
                    { id: 'shortestPath', label: 'ΣΥΝΤΟΜΟΤΕΡΗ ΟΔΟΣ' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPolyMode(m.id)}
                      className={`py-2.5 px-3 rounded-xl font-black text-xs border transition-all active:scale-95 ${
                        polyMode === m.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Steppers για τα μήκη ΑΒ, ΒΓ, ΓΔ */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-sky-800 uppercase block">ΑΒ (m)</label>
                    <div className="grid grid-cols-[24px_1fr_24px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setSeg1, -1, 2, 10, e)}
                        className="w-full h-full flex items-center justify-center rounded bg-white border border-slate-300 font-bold text-xs active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-sky-50 rounded border border-sky-200 font-bold text-xs font-mono text-sky-950">
                        {seg1}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setSeg1, 1, 2, 10, e)}
                        className="w-full h-full flex items-center justify-center rounded bg-white border border-slate-300 font-bold text-xs active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-amber-800 uppercase block">ΒΓ (m)</label>
                    <div className="grid grid-cols-[24px_1fr_24px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setSeg2, -1, 2, 10, e)}
                        className="w-full h-full flex items-center justify-center rounded bg-white border border-slate-300 font-bold text-xs active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-amber-50 rounded border border-amber-200 font-bold text-xs font-mono text-amber-950">
                        {seg2}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setSeg2, 1, 2, 10, e)}
                        className="w-full h-full flex items-center justify-center rounded bg-white border border-slate-300 font-bold text-xs active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-emerald-800 uppercase block">ΓΔ (m)</label>
                    <div className="grid grid-cols-[24px_1fr_24px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setSeg3, -1, 2, 10, e)}
                        className="w-full h-full flex items-center justify-center rounded bg-white border border-slate-300 font-bold text-xs active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-emerald-50 rounded border border-emerald-200 font-bold text-xs font-mono text-emerald-950">
                        {seg3}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setSeg3, 1, 2, 10, e)}
                        className="w-full h-full flex items-center justify-center rounded bg-white border border-slate-300 font-bold text-xs active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-700">
                  Συνολικό μήκος διαδοχικών τμημάτων:
                  <div className="font-bold text-indigo-700 text-sm pt-1">
                    L ＝ ΑΒ ＋ ΒΓ ＋ ΓΔ ＝ {seg1} ＋ {seg2} ＋ {seg3} ＝ {totalPolyLen} m
                  </div>
                </div>
              </div>

              {/* Δυναμικό SVG Απεικόνισης Τεθλασμένης (7 cols) */}
              <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΜΟΡΦΗ ΓΡΑΜΜΗΣ (ΔΥΝΑΜΙΚΗ ΚΛΙΜΑΚΑ)
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-sans">
                    ΜΗΚΟΣ: {totalPolyLen} M
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-3 flex justify-center">
                  <svg viewBox="0 0 520 205" className="w-full max-w-[500px] h-auto">
                    {polyMode === 'collinear' ? (
                      /* Διαδοχικά Συνευθειακά Τμήματα με δυναμικά μήκη */
                      <g>
                        <line
                          x1={polyGeometry.colPts.xA}
                          y1="100"
                          x2={polyGeometry.colPts.xB}
                          y2="100"
                          stroke="#38bdf8"
                          strokeWidth="5"
                        />
                        <line
                          x1={polyGeometry.colPts.xB}
                          y1="100"
                          x2={polyGeometry.colPts.xC}
                          y2="100"
                          stroke="#f59e0b"
                          strokeWidth="5"
                        />
                        <line
                          x1={polyGeometry.colPts.xC}
                          y1="100"
                          x2={polyGeometry.colPts.xD}
                          y2="100"
                          stroke="#10b981"
                          strokeWidth="5"
                        />

                        <circle cx={polyGeometry.colPts.xA} cy="100" r="6" fill="#ffffff" />
                        <text x={polyGeometry.colPts.xA} y="130" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
                          Α
                        </text>

                        <circle cx={polyGeometry.colPts.xB} cy="100" r="6" fill="#ffffff" />
                        <text x={polyGeometry.colPts.xB} y="130" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
                          Β
                        </text>

                        <circle cx={polyGeometry.colPts.xC} cy="100" r="6" fill="#ffffff" />
                        <text x={polyGeometry.colPts.xC} y="130" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
                          Γ
                        </text>

                        <circle cx={polyGeometry.colPts.xD} cy="100" r="6" fill="#ffffff" />
                        <text x={polyGeometry.colPts.xD} y="130" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
                          Δ
                        </text>

                        <text
                          x={(polyGeometry.colPts.xA + polyGeometry.colPts.xB) / 2}
                          y="78"
                          fill="#38bdf8"
                          fontSize="12"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {seg1} m
                        </text>
                        <text
                          x={(polyGeometry.colPts.xB + polyGeometry.colPts.xC) / 2}
                          y="78"
                          fill="#f59e0b"
                          fontSize="12"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {seg2} m
                        </text>
                        <text
                          x={(polyGeometry.colPts.xC + polyGeometry.colPts.xD) / 2}
                          y="78"
                          fill="#10b981"
                          fontSize="12"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {seg3} m
                        </text>
                      </g>
                    ) : polyMode === 'closedPoly' ? (
                      /* Κλειστή Τεθλασμένη (Τρίγωνο με δυναμικές πλευρές) */
                      polyGeometry.canClose && polyGeometry.closedPts ? (
                        <g>
                          <polygon
                            points={`${polyGeometry.closedPts.A.x},${polyGeometry.closedPts.A.y} ${polyGeometry.closedPts.B.x},${polyGeometry.closedPts.B.y} ${polyGeometry.closedPts.C.x},${polyGeometry.closedPts.C.y}`}
                            fill="#1e1b4b"
                            fillOpacity="0.6"
                          />
                          <line
                            x1={polyGeometry.closedPts.A.x}
                            y1={polyGeometry.closedPts.A.y}
                            x2={polyGeometry.closedPts.B.x}
                            y2={polyGeometry.closedPts.B.y}
                            stroke="#38bdf8"
                            strokeWidth="4.5"
                          />
                          <line
                            x1={polyGeometry.closedPts.B.x}
                            y1={polyGeometry.closedPts.B.y}
                            x2={polyGeometry.closedPts.C.x}
                            y2={polyGeometry.closedPts.C.y}
                            stroke="#f59e0b"
                            strokeWidth="4.5"
                          />
                          <line
                            x1={polyGeometry.closedPts.C.x}
                            y1={polyGeometry.closedPts.C.y}
                            x2={polyGeometry.closedPts.A.x}
                            y2={polyGeometry.closedPts.A.y}
                            stroke="#10b981"
                            strokeWidth="4.5"
                          />

                          <circle cx={polyGeometry.closedPts.A.x} cy={polyGeometry.closedPts.A.y} r="6" fill="#ffffff" />
                          <text
                            x={polyGeometry.closedPts.A.x - 10}
                            y={polyGeometry.closedPts.A.y + 18}
                            fill="#ffffff"
                            fontSize="13"
                            fontWeight="bold"
                            textAnchor="end"
                          >
                            Α (＝Δ)
                          </text>

                          <circle cx={polyGeometry.closedPts.B.x} cy={polyGeometry.closedPts.B.y} r="6" fill="#ffffff" />
                          <text
                            x={polyGeometry.closedPts.B.x}
                            y={polyGeometry.closedPts.B.y - 12}
                            fill="#ffffff"
                            fontSize="13"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            Β
                          </text>

                          <circle cx={polyGeometry.closedPts.C.x} cy={polyGeometry.closedPts.C.y} r="6" fill="#ffffff" />
                          <text
                            x={polyGeometry.closedPts.C.x + 12}
                            y={polyGeometry.closedPts.C.y + 18}
                            fill="#ffffff"
                            fontSize="13"
                            fontWeight="bold"
                          >
                            Γ
                          </text>

                          {/* Ετικέτες πλευρών στο μέσο κάθε πλευράς */}
                          <text
                            x={(polyGeometry.closedPts.A.x + polyGeometry.closedPts.B.x) / 2 - 14}
                            y={(polyGeometry.closedPts.A.y + polyGeometry.closedPts.B.y) / 2 - 6}
                            fill="#38bdf8"
                            fontSize="12"
                            fontWeight="bold"
                            textAnchor="end"
                          >
                            {seg1} m
                          </text>
                          <text
                            x={(polyGeometry.closedPts.B.x + polyGeometry.closedPts.C.x) / 2 + 14}
                            y={(polyGeometry.closedPts.B.y + polyGeometry.closedPts.C.y) / 2 - 6}
                            fill="#f59e0b"
                            fontSize="12"
                            fontWeight="bold"
                          >
                            {seg2} m
                          </text>
                          <text
                            x={(polyGeometry.closedPts.A.x + polyGeometry.closedPts.C.x) / 2}
                            y={polyGeometry.closedPts.A.y + 22}
                            fill="#10b981"
                            fontSize="12"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {seg3} m
                          </text>
                        </g>
                      ) : (
                        /* Όταν τα μήκη δεν μπορούν να κλείσουν σε τρίγωνο */
                        <g>
                          <text x="260" y="90" fill="#fda4af" fontSize="14" fontWeight="bold" textAnchor="middle">
                            ⚠️ Τα τμήματα ({seg1} m, {seg2} m, {seg3} m) δεν μπορούν να κλείσουν!
                          </text>
                          <text x="260" y="118" fill="#cbd5e1" fontSize="12" textAnchor="middle">
                            Το μεγαλύτερο τμήμα πρέπει να είναι μικρότερο από το άθροισμα των δύο άλλων.
                          </text>
                        </g>
                      )
                    ) : (
                      /* Ανοιχτή Τεθλασμένη ΑΒΓΔ (+ Συντομότερη Διαδρομή ΑΔ) με δυναμικές συντεταγμένες */
                      <g>
                        {polyMode === 'shortestPath' && (
                          <g>
                            <line
                              x1={polyGeometry.openPts.A.x}
                              y1={polyGeometry.openPts.A.y}
                              x2={polyGeometry.openPts.D.x}
                              y2={polyGeometry.openPts.D.y}
                              stroke="#f43f5e"
                              strokeWidth="3.5"
                              strokeDasharray="7 5"
                            />
                            <text
                              x={(polyGeometry.openPts.A.x + polyGeometry.openPts.D.x) / 2}
                              y={Math.max(polyGeometry.openPts.A.y, polyGeometry.openPts.D.y) + 28}
                              fill="#fda4af"
                              fontSize="12"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              ΑΔ ≈ {polyGeometry.directAD.toString().replace('.', ',')} m (＜ {totalPolyLen} m)
                            </text>
                          </g>
                        )}

                        <line
                          x1={polyGeometry.openPts.A.x}
                          y1={polyGeometry.openPts.A.y}
                          x2={polyGeometry.openPts.B.x}
                          y2={polyGeometry.openPts.B.y}
                          stroke="#38bdf8"
                          strokeWidth="4.5"
                        />
                        <line
                          x1={polyGeometry.openPts.B.x}
                          y1={polyGeometry.openPts.B.y}
                          x2={polyGeometry.openPts.C.x}
                          y2={polyGeometry.openPts.C.y}
                          stroke="#f59e0b"
                          strokeWidth="4.5"
                        />
                        <line
                          x1={polyGeometry.openPts.C.x}
                          y1={polyGeometry.openPts.C.y}
                          x2={polyGeometry.openPts.D.x}
                          y2={polyGeometry.openPts.D.y}
                          stroke="#10b981"
                          strokeWidth="4.5"
                        />

                        {/* Κορυφές Α, Β, Γ, Δ */}
                        <circle cx={polyGeometry.openPts.A.x} cy={polyGeometry.openPts.A.y} r="6" fill="#ffffff" />
                        <text
                          x={polyGeometry.openPts.A.x - 14}
                          y={polyGeometry.openPts.A.y + 5}
                          fill="#ffffff"
                          fontSize="13"
                          fontWeight="bold"
                          textAnchor="end"
                        >
                          Α
                        </text>

                        <circle cx={polyGeometry.openPts.B.x} cy={polyGeometry.openPts.B.y} r="6" fill="#ffffff" />
                        <text
                          x={polyGeometry.openPts.B.x}
                          y={polyGeometry.openPts.B.y - 12}
                          fill="#ffffff"
                          fontSize="13"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          Β
                        </text>

                        <circle cx={polyGeometry.openPts.C.x} cy={polyGeometry.openPts.C.y} r="6" fill="#ffffff" />
                        <text
                          x={polyGeometry.openPts.C.x}
                          y={polyGeometry.openPts.C.y + 20}
                          fill="#ffffff"
                          fontSize="13"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          Γ
                        </text>

                        <circle cx={polyGeometry.openPts.D.x} cy={polyGeometry.openPts.D.y} r="6" fill="#ffffff" />
                        <text
                          x={polyGeometry.openPts.D.x + 14}
                          y={polyGeometry.openPts.D.y + 5}
                          fill="#ffffff"
                          fontSize="13"
                          fontWeight="bold"
                        >
                          Δ
                        </text>

                        {/* Δυναμικές ετικέτες μηκών στο κέντρο κάθε πλευράς */}
                        <text
                          x={(polyGeometry.openPts.A.x + polyGeometry.openPts.B.x) / 2 - 10}
                          y={(polyGeometry.openPts.A.y + polyGeometry.openPts.B.y) / 2 - 8}
                          fill="#38bdf8"
                          fontSize="12"
                          fontWeight="bold"
                          textAnchor="end"
                        >
                          {seg1} m
                        </text>
                        <text
                          x={(polyGeometry.openPts.B.x + polyGeometry.openPts.C.x) / 2 + 8}
                          y={(polyGeometry.openPts.B.y + polyGeometry.openPts.C.y) / 2 - 8}
                          fill="#f59e0b"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          {seg2} m
                        </text>
                        <text
                          x={(polyGeometry.openPts.C.x + polyGeometry.openPts.D.x) / 2}
                          y={(polyGeometry.openPts.C.y + polyGeometry.openPts.D.y) / 2 - 10}
                          fill="#10b981"
                          fontSize="12"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {seg3} m
                        </text>
                      </g>
                    )}
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed">
                  {polyMode === 'openPoly' && (
                    <div>
                      <strong>Ανοιχτή Τεθλασμένη Γραμμή ΑΒΓΔ:</strong> Τα τμήματα ΑΒ ({seg1} m), ΒΓ ({seg2} m) και ΓΔ ({seg3} m) μεταβάλλονται ζωντανά στο σχήμα! Τα σημεία Α, Β, Γ, Δ λέγονται <strong>κορυφές</strong> και τα ΑΒ, ΒΓ, ΓΔ <strong>πλευρές</strong> της τεθλασμένης.
                    </div>
                  )}
                  {polyMode === 'closedPoly' && (
                    <div>
                      <strong>Κλειστή Τεθλασμένη Γραμμή (Πολύγωνο):</strong>{' '}
                      {polyGeometry.canClose
                        ? 'Το τέλος του τρίτου τμήματος συμπίπτει με την αρχή Α του πρώτου τμήματος, σχηματίζοντας ένα τρίγωνο!'
                        : 'Δοκίμασε να αυξήσεις τα μικρά τμήματα ή να μειώσεις το μεγάλο ώστε να μπορέσει να κλείσει η τεθλασμένη γραμμή!'}
                    </div>
                  )}
                  {polyMode === 'collinear' && (
                    <div>
                      <strong>Διαδοχικά Συνευθειακά Τμήματα:</strong> Όταν τα διαδοχικά τμήματα βρίσκονται πάνω στην ίδια ευθεία, <strong>ΔΕΝ σχηματίζουν τεθλασμένη γραμμή</strong>, αλλά ένα ενιαίο ευθύγραμμο τμήμα ΑΔ μήκους <strong>{totalPolyLen} m</strong>!
                    </div>
                  )}
                  {polyMode === 'shortestPath' && (
                    <div>
                      <strong>Συντομότερη Διαδρομή:</strong> Το ευθύγραμμο τμήμα <strong>ΑΔ (≈ {polyGeometry.directAD.toString().replace('.', ',')} m)</strong> που ενώνει απευθείας το Α με το Δ είναι μικρότερο από το μήκος της τεθλασμένης <strong>ΑΒ ＋ ΒΓ ＋ ΓΔ ({totalPolyLen} m)</strong>.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            4. ΠΑΡΑΔΕΙΓΜΑΤΑ ΜΕ ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                4
              </span>
              Παραδείγματα με Προβλήματα
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Πρόβλημα 1 */}
            <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded inline-block">
                ΠΡΟΒΛΗΜΑ 1: ΜΕΣΟ ΕΥΘΥΓΡΑΜΜΟΥ ΤΜΗΜΑΤΟΣ
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Σταθμός Ανεφοδιασμού σε Αυτοκινητόδρομο
              </h3>
              <p className="text-slate-600">
                Πάνω σε έναν ευθύγραμμο αυτοκινητόδρομο βρίσκονται με τη σειρά οι πόλεις <strong>Α, Β</strong> και <strong>Γ</strong>. Η απόσταση ΑΒ είναι <strong>80 km</strong> και η ΒΓ είναι <strong>40 km</strong>. Αν στο μέσο <strong>Μ</strong> της συνολικής διαδρομής ΑΓ κατασκευαστεί ένας σταθμός ανεφοδιασμού, πόσο απέχει ο σταθμός Μ από την πόλη Β;
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-indigo-100 font-mono text-xs sm:text-sm space-y-2 text-slate-800">
                <div className="font-sans font-bold text-indigo-950">Αναλυτική Λύση:</div>
                <div>1. Συνολική απόσταση: ΑΓ ＝ ΑΒ ＋ ΒΓ ＝ 80 ＋ 40 ＝ <strong>120 km</strong>.</div>
                <div className="flex items-center flex-wrap">
                  <span>2. Επειδή το Μ είναι το μέσο του ΑΓ: ΑΜ ＝ </span>
                  <Frac num="120" den="2" />
                  <span> ＝ <strong>60 km</strong>.</span>
                </div>
                <div className="text-emerald-700 font-bold">
                  3. Απόσταση από την πόλη Β: ΜΒ ＝ ΑΒ － ΑΜ ＝ 80 － 60 ＝ 20 km.
                </div>
              </div>
            </div>

            {/* Πρόβλημα 2 */}
            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded inline-block">
                ΠΡΟΒΛΗΜΑ 2: ΤΕΘΛΑΣΜΕΝΗ VS ΕΥΘΥΓΡΑΜΜΟ ΤΜΗΜΑ
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Εξοικονόμηση Καλωδίου Οπτικής Ίνας
              </h3>
              <p className="text-slate-600">
                Για να συνδεθεί το κτίριο Α με το κτίριο Δ, μια εταιρεία μπορεί είτε να ακολουθήσει την τεθλασμένη διαδρομή των δρόμων <strong>ΑΒ ＝ 120 m, ΒΓ ＝ 90 m, ΓΔ ＝ 140 m</strong>, είτε να περάσει απευθείας υπόγειο καλώδιο κατά μήκος του ευθύγραμμου τμήματος <strong>ΑΔ ＝ 260 m</strong>. Αν κάθε μέτρο καλωδίου κοστίζει <strong>8 €</strong>, πόσα ευρώ εξοικονομεί με την απευθείας σύνδεση;
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-amber-100 font-mono text-xs sm:text-sm space-y-2 text-slate-800">
                <div className="font-sans font-bold text-amber-950">Αναλυτική Λύση:</div>
                <div>1. Μήκος τεθλασμένης: L ＝ 120 ＋ 90 ＋ 140 ＝ <strong>350 m</strong>.</div>
                <div>2. Μήκος που εξοικονομείται: 350 － 260 ＝ <strong>90 m</strong>.</div>
                <div className="text-emerald-700 font-bold">
                  3. Οικονομικό όφελος: 90 · 8 ＝ 720 €.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
