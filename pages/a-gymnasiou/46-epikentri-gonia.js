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

// Επαναχρησιμοποιήσιμο Component Τόξου Κύκλου (Το τόξο τοποθετείται πάνω από τα γράμματα)
function Arc({ children, className = "" }) {
  return (
    <span className={`relative inline-block leading-none mx-[1px] ${className}`}>
      <svg
        viewBox="0 0 24 6"
        className="w-[0.95em] h-[0.32em] absolute -top-[0.35em] left-1/2 -translate-x-1/2 text-current overflow-visible pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 5 Q12 -1 23 5" />
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
      <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">
        {num}
      </span>
      <span className="pt-0.5 break-all">
        {den}
      </span>
    </span>
  );
}

// Custom Interactive Slider για το Διαδραστικό Εργαστήριο
function CustomSlider({ label, min, max, step = 1, value, onChange, unit = "°", color = "#4f46e5", locale = "el" }) {
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

// Συγκεντρωτικό Λεξικό i18n
const translations = {
  el: {
    pageTitle: "Επίκεντρη Γωνία, Κυκλικός Τομέας & Σχετικές Θέσεις Ευθείας-Κύκλου | Θεωρία Α' Γυμνασίου",
    pageDesc: "Θεωρία Α' Γυμνασίου για την επίκεντρη γωνία, το μέτρο τόξου σε μοίρες, τον κυκλικό τομέα, τις ίσες και άνισες επίκεντρες γωνίες και τις σχετικές θέσεις ευθείας και κύκλου.",
    backNav: "Α' Γυμνασίου",
    heroBadge: "ΚΕΦΑΛΑΙΟ 10 • Α' ΓΥΜΝΑΣΙΟΥ",
    heroTitle: "Επίκεντρη Γωνία, Κυκλικός Τομέας & Σχετικές Θέσεις Ευθείας – Κύκλου",
    heroDesc: "Μάθετε πώς μετράμε τα τόξα ενός κύκλου σε μοίρες μέσω της επίκεντρης γωνίας, γνωρίστε τον κυκλικό τομέα, συγκρίνετε ίσες και άνισες επίκεντρες γωνίες και εξερευνήστε τις τρεις σχετικές θέσεις ευθείας και κύκλου.",
    btnExercises: "ΑΣΚΗΣΕΙΣ",
    btnGoExercises: "ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ",

    // Card 1: Επίκεντρη Γωνία & Μέτρο Τόξου
    card1Badge: "1",
    card1Title: "Επίκεντρη Γωνία & Μέτρο Τόξου (σε μοίρες)",
    card1Desc: (
      <>
        <strong>Επίκεντρη γωνία</strong> ενός κύκλου (Ο, ρ) ονομάζεται κάθε γωνία Α<Angle>Ο</Angle>Β που έχει κορυφή το κέντρο Ο του κύκλου (και πλευρές τις ακτίνες ΟΑ και ΟΒ).
      </>
    ),
    card1ArcTitle: "Αντίστοιχο Τόξο & Μέτρο Τόξου:",
    card1ArcDesc: (
      <>
        Το τόξο <Arc>ΑΒ</Arc> που βρίσκεται στο εσωτερικό της επίκεντρης γωνίας Α<Angle>Ο</Angle>Β λέγεται <strong>αντίστοιχο τόξο</strong> της. Ως <strong>μέτρο τόξου (σε μοίρες)</strong> ορίζουμε το μέτρο της αντίστοιχης επίκεντρης γωνίας του:
      </>
    ),
    card1Formula: (
      <span>
        Μέτρο <Arc>ΑΒ</Arc> ＝ Α<Angle>Ο</Angle>Β
      </span>
    ),
    card1Specials: "Ολόκληρος κύκλος ＝ 360° • Ημικύκλιο ＝ 180° • Τεταρτοκύκλιο ＝ 90°",

    // Card 2: Κυκλικός Τομέας
    card2Badge: "2",
    card2Title: "Ο Κυκλικός Τομέας",
    card2Desc: (
      <>
        <strong>Κυκλικός τομέας</strong> ονομάζεται το μέρος του κυκλικού δίσκου (Ο, ρ) που περιέχεται ανάμεσα σε δύο ακτίνες ΟΑ, ΟΒ και στο αντίστοιχο τόξο <Arc>ΑΒ</Arc> (μοιάζει με ένα «κομμάτι πίτσας» ή «κομμάτι τούρτας»).
      </>
    ),
    card2Prop1Title: "Γωνία Κυκλικού Τομέα:",
    card2Prop1Desc: (
      <>
        Η επίκεντρη γωνία ω ＝ Α<Angle>Ο</Angle>Β ονομάζεται <strong>γωνία του κυκλικού τομέα</strong> και καθορίζει το μέγεθός του.
      </>
    ),
    card2Prop2Title: "Ειδικές Περιπτώσεις Τομέων:",
    card2Prop2Desc: "Για ω ＝ 180° έχουμε ημικυκλικό δίσκο (το μισό του δίσκου), ενώ για ω ＝ 90° έχουμε το τέταρτο του κυκλικού δίσκου.",

    // Card 3: Ίσες και Άνισες Επίκεντρες Γωνίες
    card3Badge: "3",
    card3Title: "Ίσες & Άνισες Επίκεντρες Γωνίες",
    card3Desc: "Στον ίδιο κύκλο (Ο, ρ) ή σε ίσους κύκλους ισχύουν οι παρακάτω βασικές αντιστοιχίες ανάμεσα στις επίκεντρες γωνίες, τα τόξα και τις χορδές:",
    card3EqualTitle: "1. Ίσες Επίκεντρες Γωνίες:",
    card3EqualDesc: (
      <>
        Αν δύο επίκεντρες γωνίες είναι ίσες (Α<Angle>Ο</Angle>Β ＝ Γ<Angle>Ο</Angle>Δ), τότε αντιστοιχούν σε <strong>ίσα τόξα</strong> (<Arc>ΑΒ</Arc> ＝ <Arc>ΓΔ</Arc>) και υποτείνουν <strong>ίσες χορδές</strong> (ΑΒ ＝ ΓΔ) — και αντίστροφα!
      </>
    ),
    card3UnequalTitle: "2. Άνισες Επίκεντρες Γωνίες:",
    card3UnequalDesc: (
      <>
        Αν δύο επίκεντρες γωνίες είναι άνισες (Α<Angle>Ο</Angle>Β ＞ Γ<Angle>Ο</Angle>Δ), τότε στη <strong>μεγαλύτερη επίκεντρη γωνία</strong> αντιστοιχεί <strong>μεγαλύτερο τόξο</strong> (<Arc>ΑΒ</Arc> ＞ <Arc>ΓΔ</Arc>) και (για γωνίες ≤ 180°) <strong>μεγαλύτερη χορδή</strong> (ΑΒ ＞ ΓΔ).
      </>
    ),

    // Card 4: Σχετικές Θέσεις Ευθείας & Κύκλου
    card4Badge: "4",
    card4Title: "Σχετικές Θέσεις Ευθείας & Κύκλου",
    card4Desc: "Έστω κύκλος (Ο, ρ) και μια ευθεία (ε) του επιπέδου. Αν δ είναι η κάθετη απόσταση του κέντρου Ο από την ευθεία (ε), διακρίνουμε 3 περιπτώσεις:",
    card4Case1Title: "1. Εξωτερική Ευθεία (δ ＞ ρ):",
    card4Case1Desc: "Η ευθεία (ε) και ο κύκλος δεν έχουν κανένα κοινό σημείο (0 κοινά σημεία).",
    card4Case2Title: "2. Εφαπτόμενη Ευθεία (δ ＝ ρ):",
    card4Case2Desc: "Η ευθεία (ε) και ο κύκλος έχουν ακριβώς 1 κοινό σημείο Α (σημείο επαφής), και η ακτίνα επαφής είναι κάθετη στην εφαπτομένη (ΟΑ ⊥ ε).",
    card4Case3Title: "3. Τέμνουσα Ευθεία (δ ＜ ρ):",
    card4Case3Desc: "Η ευθεία (ε) τέμνει τον κύκλο σε 2 διαφορετικά σημεία Α και Β (το τμήμα ΑΒ είναι χορδή του κύκλου).",

    // Interactive Lab
    labBadge: "ΕΡΓΑΣΤΗΡΙΟ ΚΥΚΛΟΥ & ΕΥΘΕΙΑΣ",
    labTitle: "Διαδραστική Εξερεύνηση Επίκεντρης Γωνίας & Ευθείας – Κύκλου",
    labModeArc: "ΜΕΡΟΣ Α: ΕΠΙΚΕΝΤΡΗ ΓΩΝΙΑ & ΚΥΚΛΙΚΟΣ ΤΟΜΕΑΣ",
    labModeLine: "ΜΕΡΟΣ Β: ΣΧΕΤΙΚΕΣ ΘΕΣΕΙΣ ΕΥΘΕΙΑΣ & ΚΥΚΛΟΥ",
    labSliderAngle: "Επίκεντρη γωνία ω ＝ ΑΟΒ",
    labArcMeasureLabel: "ΜΕΤΡΟ ΤΟΞΟΥ ΑΒ:",
    labSectorTypeLabel: "ΚΥΚΛΙΚΟΣ ΤΟΜΕΑΣ:",
    sectorAcute: "Οξύς κυκλικός τομέας (ω ＜ 90°)",
    sectorQuarter: "Τεταρτοκύκλιο (ω ＝ 90°)",
    sectorObtuse: "Αμβλύς κυκλικός τομέας (90° ＜ ω ＜ 180°)",
    sectorSemi: "Ημικυκλικός δίσκος (ω ＝ 180°)",
    sectorReflex: "Μείζων κυκλικός τομέας (ω ＞ 180°)",
    labSliderDist: "Απόσταση δ του κέντρου Ο από την ευθεία (ε) (για ακτίνα ρ ＝ 70)",
    labLineStatusLabel: "ΣΧΕΤΙΚΗ ΘΕΣΗ:",
    labCommonPtsLabel: "ΚΟΙΝΑ ΣΗΜΕΙΑ:",
    statusSecant: "Τέμνουσα ευθεία (δ ＜ ρ)",
    statusTangent: "Εφαπτόμενη ευθεία (δ ＝ ρ & ΟΑ ⊥ ε)",
    statusExterior: "Εξωτερική ευθεία (δ ＞ ρ)",
    ptsTwo: "2 κοινά σημεία (Α και Β)",
    ptsOne: "1 κοινό σημείο (σημείο επαφής Α)",
    ptsZero: "0 κοινά σημεία",

    // Solved Problems
    solvedTitle: "Λυμένα Προβλήματα Εφαρμογής",
    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΕΠΙΚΕΝΤΡΕΣ ΓΩΝΙΕΣ, ΤΟΞΑ & ΧΟΡΔΕΣ",
    prob1Title: "Υπολογισμός τόξων και σύγκριση χορδών στον ίδιο κύκλο",
    prob1DescPre: (
      <>
        Σε κύκλο (Ο, ρ) παίρνουμε διαδοχικά τόξα <Arc>ΑΒ</Arc>, <Arc>ΒΓ</Arc> και <Arc>ΓΔ</Arc> τέτοια ώστε οι αντίστοιχες επίκεντρες γωνίες να είναι Α<Angle>Ο</Angle>Β ＝ 65°, Β<Angle>Ο</Angle>Γ ＝ 65° και Γ<Angle>Ο</Angle>Δ ＝ 110°. Να βρεθούν: α) το μέτρο σε μοίρες του τόξου <Arc>ΑΔ</Arc>, β) ποια σχέση συνδέει τις χορδές ΑΒ και ΒΓ, και γ) ποια είναι μεγαλύτερη χορδή, η ΒΓ ή η ΓΔ;
      </>
    ),
    prob1DiagramCaption: "Διαδοχικές επίκεντρες γωνίες 65°, 65° και 110° (σύνολο 240°)",
    prob1ColPart: "Ερώτημα",
    prob1ColRule: "Θεώρημα / Ιδιότητα",
    prob1ColCalc: "Υπολογισμός / Απάντηση",
    prob1Row1Q: (
      <>
        α) Μέτρο τόξου <Arc>ΑΔ</Arc>
      </>
    ),
    prob1Row1R: (
      <>
        Α<Angle>Ο</Angle>Δ ＝ Α<Angle>Ο</Angle>Β ＋ Β<Angle>Ο</Angle>Γ ＋ Γ<Angle>Ο</Angle>Δ
      </>
    ),
    prob1Row1C: (
      <>
        <Arc>ΑΔ</Arc> ＝ 65° ＋ 65° ＋ 110° ＝ 240°
      </>
    ),
    prob1Row2Q: "β) Σύγκριση χορδών ΑΒ & ΒΓ",
    prob1Row2R: (
      <>
        Ίσες επίκεντρες γωνίες (Α<Angle>Ο</Angle>Β ＝ Β<Angle>Ο</Angle>Γ ＝ 65°)
      </>
    ),
    prob1Row2C: "Οι χορδές είναι ίσες: ΑΒ ＝ ΒΓ",
    prob1Row3Q: "γ) Σύγκριση χορδών ΒΓ & ΓΔ",
    prob1Row3R: (
      <>
        Άνισες επίκεντρες γωνίες (110° ＞ 65°, ≤ 180°)
      </>
    ),
    prob1Row3C: "Μεγαλύτερη η ΓΔ (ΓΔ ＞ ΒΓ)",
    prob1ResSummary: "Απάντηση:",
    prob1ResText: (
      <>
        α) Το τόξο <Arc>ΑΔ</Arc> είναι 240°, β) ΑΒ ＝ ΒΓ και γ) ΓΔ ＞ ΒΓ.
      </>
    ),

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΣΧΕΤΙΚΕΣ ΘΕΣΕΙΣ ΕΥΘΕΙΑΣ & ΚΥΚΛΟΥ",
    prob2Title: "Προσδιορισμός θέσης ευθείας και ιδιότητα εφαπτομένης",
    prob2DescPre: (
      <>
        α) Ένας κύκλος (Ο, ρ) έχει διάμετρο 18 cm. Τρεις ευθείες (ε₁), (ε₂) και (ε₃) απέχουν από το κέντρο Ο αποστάσεις δ₁ ＝ 6 cm, δ₂ ＝ 9 cm και δ₃ ＝ 12 cm αντίστοιχα. Να βρεθεί η σχετική θέση καθεμιάς ευθείας ως προς τον κύκλο. <br />
        β) Αν (ε₂) εφάπτεται στον κύκλο στο σημείο Α, πόσες μοίρες είναι η γωνία Ο<Angle>Α</Angle>Μ (όπου Μ σημείο της ε₂);
      </>
    ),
    prob2DiagramCaption: "Κύκλος ακτίνας ρ ＝ 9 cm με τέμνουσα (ε₁), εφαπτόμενη (ε₂) και εξωτερική (ε₃)",
    prob2ColPart: "Ερώτημα",
    prob2ColRule: "Κριτήριο Απόστασης (ρ ＝ 9 cm)",
    prob2ColCalc: "Απάντηση",
    prob2Row1Q: "α) Ευθεία (ε₁) με δ₁ ＝ 6 cm",
    prob2Row1R: "δ₁ ＜ ρ (6 cm ＜ 9 cm)",
    prob2Row1C: "Τέμνουσα ευθεία (2 κοινά σημεία)",
    prob2Row2Q: "α) Ευθείες (ε₂) & (ε₃)",
    prob2Row2R: "δ₂ ＝ ρ ＝ 9 cm και δ₃ ＝ 12 cm ＞ 9 cm",
    prob2Row2C: "Η (ε₂) εφαπτόμενη, η (ε₃) εξωτερική",
    prob2Row3Q: (
      <>
        β) Γωνία Ο<Angle>Α</Angle>Μ
      </>
    ),
    prob2Row3R: "Η ακτίνα επαφής ΟΑ είναι κάθετη στην εφαπτομένη (ΟΑ ⊥ ε₂)",
    prob2Row3C: (
      <>
        Ο<Angle>Α</Angle>Μ ＝ 90°
      </>
    ),
    prob2ResSummary: "Συμπέρασμα:",
    prob2ResText: (
      <>
        Η (ε₁) είναι τέμνουσα, η (ε₂) εφαπτόμενη, η (ε₃) εξωτερική και Ο<Angle>Α</Angle>Μ ＝ 90°.
      </>
    ),

    // Alerts
    alertTitle: "ΠΡΟΣΟΧΗ: ΚΛΑΣΙΚΑ ΛΑΘΗ ΣΕ ΕΠΙΚΕΝΤΡΕΣ ΓΩΝΙΕΣ & ΕΥΘΕΙΕΣ",
    alert1Title: "Το μέτρο τόξου σε μοίρες ΔΕΝ εξαρτάται από την ακτίνα ρ:",
    alert1Desc: "Δύο τόξα σε διαφορετικούς κύκλους μπορεί να έχουν το ίδιο μέτρο σε μοίρες (π.χ. 90°), παρόλο που έχουν διαφορετικό μήκος σε εκατοστά!",
    alert2Title: "Η σύγκριση άνισων χορδών ισχύει για γωνίες έως 180°:",
    alert2Desc: "Για επίκεντρες γωνίες μικρότερες ή ίσες των 180°, η μεγαλύτερη επίκεντρη γωνία υποτείνει μεγαλύτερη χορδή. Για γωνίες > 180° η χορδή αρχίζει να μικραίνει ξανά.",
    alert3Title: "Σύγκριση της απόστασης δ με την ακτίνα ρ (όχι με τη διάμετρο!):",
    alert3Desc: "Για να βρούμε αν μια ευθεία είναι τέμνουσα, εφαπτόμενη ή εξωτερική, συγκρίνουμε την απόσταση δ του κέντρου με την ακτίνα ρ (αν δίνεται διάμετρος, πρώτα διαιρούμε διά 2).",
    alert4Title: "Η εφαπτομένη είναι πάντα κάθετη στην ακτίνα επαφής:",
    alert4Desc: "Αν ευθεία (ε) εφάπτεται στον κύκλο (Ο, ρ) στο σημείο Α, τότε υποχρεωτικά ΟΑ ⊥ (ε) (σχηματίζει γωνία 90°).",

    // Bottom
    bottomTitle: "Εμπεδώστε τις Επίκεντρες Γωνίες & τις Εφαπτόμενες στην Πράξη!",
    bottomDesc: "Εξασκηθείτε στις επίκεντρες γωνίες, στα τόξα, στους κυκλικούς τομείς και στις σχετικές θέσεις ευθείας και κύκλου με 12 διαδραστικές ασκήσεις.",
    bottomBtn: "ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ"
  },
  en: {
    pageTitle: "Central Angle, Circular Sector & Line-Circle Positions | Grade 7 Theory",
    pageDesc: "Grade 7 geometry theory on central angles, degree measure of an arc, circular sector, equal and unequal central angles, and relative positions of a line and a circle.",
    backNav: "Grade 7",
    heroBadge: "CHAPTER 10 • GRADE 7",
    heroTitle: "Central Angle, Circular Sector & Line – Circle Positions",
    heroDesc: "Learn how to measure circular arcs in degrees via central angles, explore circular sectors, compare equal and unequal central angles, and examine the three relative positions of a line and a circle.",
    btnExercises: "EXERCISES",
    btnGoExercises: "GO TO EXERCISES",

    // Card 1
    card1Badge: "1",
    card1Title: "Central Angle & Arc Degree Measure",
    card1Desc: "A central angle of a circle (O, ρ) is any angle ∠AOB whose vertex is the center O of the circle (with sides along radii OA and OB).",
    card1ArcTitle: "Intercepted Arc & Degree Measure:",
    card1ArcDesc: (
      <>
        The arc <Arc>AB</Arc> lying inside central angle ∠AOB is called its <strong>intercepted arc</strong>. The <strong>degree measure of an arc</strong> is defined as the measure of its corresponding central angle:
      </>
    ),
    card1Formula: (
      <span>
        Measure of <Arc>AB</Arc> ＝ ∠AOB
      </span>
    ),
    card1Specials: "Full circle ＝ 360° • Semicircle ＝ 180° • Quarter circle ＝ 90°",

    // Card 2
    card2Badge: "2",
    card2Title: "The Circular Sector",
    card2Desc: (
      <>
        A <strong>circular sector</strong> is the region of a circular disk (O, ρ) bounded by two radii OA, OB and their intercepted arc <Arc>AB</Arc> (resembling a slice of pizza or pie).
      </>
    ),
    card2Prop1Title: "Sector Angle:",
    card2Prop1Desc: "The central angle ω ＝ ∠AOB is called the angle of the circular sector and determines its size.",
    card2Prop2Title: "Special Sectors:",
    card2Prop2Desc: "When ω ＝ 180° the sector is a semicircular disk (half the disk), and when ω ＝ 90° it is a quarter-circle sector.",

    // Card 3
    card3Badge: "3",
    card3Title: "Equal & Unequal Central Angles",
    card3Desc: "In the same circle (O, ρ) or congruent circles, the following fundamental relationships hold between central angles, arcs, and chords:",
    card3EqualTitle: "1. Equal Central Angles:",
    card3EqualDesc: (
      <>
        If two central angles are equal (∠AOB ＝ ∠COD), they intercept <strong>equal arcs</strong> (<Arc>AB</Arc> ＝ <Arc>CD</Arc>) and subtend <strong>equal chords</strong> (AB ＝ CD) — and conversely!
      </>
    ),
    card3UnequalTitle: "2. Unequal Central Angles:",
    card3UnequalDesc: (
      <>
        If two central angles are unequal (∠AOB ＞ ∠COD), the <strong>larger central angle</strong> intercepts a <strong>larger arc</strong> (<Arc>AB</Arc> ＞ <Arc>CD</Arc>) and (for angles ≤ 180°) subtends a <strong>longer chord</strong> (AB ＞ CD).
      </>
    ),

    // Card 4
    card4Badge: "4",
    card4Title: "Relative Positions of a Line & a Circle",
    card4Desc: "Let (O, ρ) be a circle and (l) be a line in the same plane. If d is the perpendicular distance from center O to line (l), there are 3 cases:",
    card4Case1Title: "1. Exterior Line (d ＞ ρ):",
    card4Case1Desc: "Line (l) and the circle have no points in common (0 common points).",
    card4Case2Title: "2. Tangent Line (d ＝ ρ):",
    card4Case2Desc: "Line (l) touches the circle at exactly 1 point A (point of tangency), and the radius to A is perpendicular to the tangent (OA ⊥ l).",
    card4Case3Title: "3. Secant Line (d ＜ ρ):",
    card4Case3Desc: "Line (l) intersects the circle at 2 distinct points A and B (segment AB is a chord of the circle).",

    // Interactive Lab
    labBadge: "CIRCLE & LINE LAB",
    labTitle: "Interactive Central Angle & Line – Circle Explorer",
    labModeArc: "PART A: CENTRAL ANGLE & CIRCULAR SECTOR",
    labModeLine: "PART B: RELATIVE POSITIONS OF LINE & CIRCLE",
    labSliderAngle: "Central angle ω ＝ ∠AOB",
    labArcMeasureLabel: "ARC AB MEASURE:",
    labSectorTypeLabel: "CIRCULAR SECTOR:",
    sectorAcute: "Acute circular sector (ω ＜ 90°)",
    sectorQuarter: "Quarter-circle sector (ω ＝ 90°)",
    sectorObtuse: "Obtuse circular sector (90° ＜ ω ＜ 180°)",
    sectorSemi: "Semicircular disk (ω ＝ 180°)",
    sectorReflex: "Major circular sector (ω ＞ 180°)",
    labSliderDist: "Distance d from center O to line (l) (for radius ρ ＝ 70)",
    labLineStatusLabel: "RELATIVE POSITION:",
    labCommonPtsLabel: "COMMON POINTS:",
    statusSecant: "Secant line (d ＜ ρ)",
    statusTangent: "Tangent line (d ＝ ρ & OA ⊥ l)",
    statusExterior: "Exterior line (d ＞ ρ)",
    ptsTwo: "2 common points (A and B)",
    ptsOne: "1 common point (point of tangency A)",
    ptsZero: "0 common points",

    // Solved Problems
    solvedTitle: "Solved Practice Problems",
    prob1Badge: "PROBLEM 1: CENTRAL ANGLES, ARCS & CHORDS",
    prob1Title: "Computing arc degree measures and comparing chords in a circle",
    prob1DescPre: (
      <>
        In circle (O, ρ), consecutive arcs <Arc>AB</Arc>, <Arc>BC</Arc>, and <Arc>CD</Arc> have central angles ∠AOB ＝ 65°, ∠BOC ＝ 65°, and ∠COD ＝ 110°. Find: (a) the degree measure of arc <Arc>AD</Arc>, (b) the relationship between chords AB and BC, and (c) which chord is longer, BC or CD?
      </>
    ),
    prob1DiagramCaption: "Consecutive central angles 65°, 65°, and 110° (total 240°)",
    prob1ColPart: "Question",
    prob1ColRule: "Theorem / Property",
    prob1ColCalc: "Calculation / Answer",
    prob1Row1Q: (
      <>
        (a) Measure of arc <Arc>AD</Arc>
      </>
    ),
    prob1Row1R: "∠AOD ＝ ∠AOB ＋ ∠BOC ＋ ∠COD",
    prob1Row1C: (
      <>
        <Arc>AD</Arc> ＝ 65° ＋ 65° ＋ 110° ＝ 240°
      </>
    ),
    prob1Row2Q: "(b) Comparing chords AB & BC",
    prob1Row2R: "Equal central angles (∠AOB ＝ ∠BOC ＝ 65°)",
    prob1Row2C: "The chords are equal: AB ＝ BC",
    prob1Row3Q: "(c) Comparing chords BC & CD",
    prob1Row3R: "Unequal central angles (110° ＞ 65°, ≤ 180°)",
    prob1Row3C: "Chord CD is longer (CD ＞ BC)",
    prob1ResSummary: "Answer:",
    prob1ResText: (
      <>
        (a) Arc <Arc>AD</Arc> measures 240°, (b) AB ＝ BC, and (c) CD ＞ BC.
      </>
    ),

    prob2Badge: "PROBLEM 2: LINE & CIRCLE RELATIVE POSITIONS",
    prob2Title: "Determining line-circle positions and tangent perpendicularity",
    prob2DescPre: (
      <>
        (a) A circle (O, ρ) has diameter 18 cm. Three lines (l₁), (l₂), and (l₃) lie at distances d₁ ＝ 6 cm, d₂ ＝ 9 cm, and d₃ ＝ 12 cm from center O. Determine the relative position of each line. <br />
        (b) If (l₂) is tangent to the circle at point A, how many degrees is angle ∠OAM (where M is on l₂)?
      </>
    ),
    prob2DiagramCaption: "Circle of radius ρ ＝ 9 cm with secant (l₁), tangent (l₂), and exterior line (l₃)",
    prob2ColPart: "Question",
    prob2ColRule: "Distance Criterion (ρ ＝ 9 cm)",
    prob2ColCalc: "Answer",
    prob2Row1Q: "(a) Line (l₁) with d₁ ＝ 6 cm",
    prob2Row1R: "d₁ ＜ ρ (6 cm ＜ 9 cm)",
    prob2Row1C: "Secant line (2 common points)",
    prob2Row2Q: "(a) Lines (l₂) & (l₃)",
    prob2Row2R: "d₂ ＝ ρ ＝ 9 cm and d₃ ＝ 12 cm ＞ 9 cm",
    prob2Row2C: "(l₂) is tangent, (l₃) is exterior",
    prob2Row3Q: "(b) Angle ∠OAM",
    prob2Row3R: "Radius to point of tangency is perpendicular (OA ⊥ l₂)",
    prob2Row3C: "∠OAM ＝ 90°",
    prob2ResSummary: "Conclusion:",
    prob2ResText: "(l₁) is secant, (l₂) is tangent, (l₃) is exterior, and ∠OAM ＝ 90°.",

    // Alerts
    alertTitle: "CAUTION: CLASSIC PITFALLS WITH CENTRAL ANGLES & TANGENTS",
    alert1Title: "Arc degree measure does NOT depend on radius ρ:",
    alert1Desc: "Two arcs in circles of different radii can have the exact same degree measure (e.g., 90°), even though their lengths in centimeters differ!",
    alert2Title: "Unequal chord comparison holds for angles up to 180°:",
    alert2Desc: "For central angles ≤ 180°, a larger central angle subtends a longer chord. Beyond 180°, chord length decreases again.",
    alert3Title: "Compare distance d with radius ρ (not the diameter!):",
    alert3Desc: "To classify a line as secant, tangent, or exterior, compare distance d from center O with radius ρ (if diameter is given, divide by 2 first).",
    alert4Title: "A tangent is always perpendicular to the radius of contact:",
    alert4Desc: "If line (l) is tangent to circle (O, ρ) at point A, then necessarily OA ⊥ (l) (forming a 90° angle).",

    // Bottom
    bottomTitle: "Master Central Angles & Tangents in Practice!",
    bottomDesc: "Practice central angles, arc degree measures, circular sectors, and line-circle relative positions with 12 interactive exercises.",
    bottomBtn: "START EXERCISES"
  }
};

export default function EpikentriGoniaTheory() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';
  const t = translations[isEl ? 'el' : 'en'];

  // State Μέρος Α (Επίκεντρη Γωνία & Τομέας) & Μέρος Β (Σχετικές Θέσεις Ευθείας & Κύκλου)
  const [omega, setOmega] = useState(75);
  const [lineDist, setLineDist] = useState(70); // ρ = 70 -> default εφαπτόμενη

  const vLbl = isEl
    ? { O: 'Ο', A: 'Α', B: 'Β', C: 'Γ', D: 'Δ', M: 'Μ' }
    : { O: 'O', A: 'A', B: 'B', C: 'C', D: 'D', M: 'M' };

  // Υπολογισμοί SVG για Επίκεντρη Γωνία ω (κέντρο (165, 115), ακτίνα R = 78)
  const cx = 165;
  const cy = 115;
  const R = 78;
  const radOmega = (omega * Math.PI) / 180;
  const Ax = cx + R;
  const Ay = cy;
  const Bx = cx + R * Math.cos(-radOmega);
  const By = cy + R * Math.sin(-radOmega);
  const largeArcFlag = omega > 180 ? 1 : 0;
  const sectorPath = `M ${cx},${cy} L ${Ax},${Ay} A ${R},${R} 0 ${largeArcFlag},0 ${Bx.toFixed(1)},${By.toFixed(1)} Z`;
  const arcPath = `M ${Ax},${Ay} A ${R},${R} 0 ${largeArcFlag},0 ${Bx.toFixed(1)},${By.toFixed(1)}`;

  let sectorTypeText = t.sectorAcute;
  if (omega === 90) sectorTypeText = t.sectorQuarter;
  else if (omega > 90 && omega < 180) sectorTypeText = t.sectorObtuse;
  else if (omega === 180) sectorTypeText = t.sectorSemi;
  else if (omega > 180) sectorTypeText = t.sectorReflex;

  // Υπολογισμοί SVG για Σχετικές Θέσεις Ευθείας & Κύκλου (κέντρο (165, 105), ακτίνα R2 = 70)
  const cx2 = 165;
  const cy2 = 105;
  const R2 = 70;
  const lineY = cy2 + lineDist;
  const isSecant = lineDist < R2;
  const isTangent = lineDist === R2;
  const dxChord = isSecant ? Math.sqrt(Math.max(0, R2 * R2 - lineDist * lineDist)) : 0;

  const lineStatusText = isSecant ? t.statusSecant : isTangent ? t.statusTangent : t.statusExterior;
  const commonPtsText = isSecant ? t.ptsTwo : isTangent ? t.ptsOne : t.ptsZero;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/46-epikentri-gonia-ask"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>🎯 {toCleanUppercase(t.btnExercises)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-32 overflow-x-hidden text-slate-800 box-border">
        
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
                href="/a-gymnasiou/46-epikentri-gonia-ask"
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
          
          {/* ΚΑΡΤΑ 1: ΕΠΙΚΕΝΤΡΗ ΓΩΝΙΑ & ΜΕΤΡΟ ΤΟΞΟΥ */}
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

              {/* Εποπτικό Σχήμα Επίκεντρης Γωνίας */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3 flex flex-col sm:flex-row items-center gap-4">
                <svg viewBox="0 0 180 140" className="w-40 h-32 shrink-0">
                  <circle cx="90" cy="72" r="50" fill="rgba(99, 102, 241, 0.08)" stroke="#4f46e5" strokeWidth="2" />
                  <path d="M 140,72 A 50,50 0 0,0 115,28.7" fill="none" stroke="#d97706" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="90" y1="72" x2="140" y2="72" stroke="#4f46e5" strokeWidth="2.2" />
                  <line x1="90" y1="72" x2="115" y2="28.7" stroke="#4f46e5" strokeWidth="2.2" />
                  <path d="M 106,72 A 16,16 0 0,0 98,58.1" fill="none" stroke="#059669" strokeWidth="2" />
                  <circle cx="90" cy="72" r="3.5" fill="#1e1b4b" />
                  <circle cx="140" cy="72" r="3.5" fill="#d97706" />
                  <circle cx="115" cy="28.7" r="3.5" fill="#d97706" />
                  <text x="81" y="76" textAnchor="end" className="text-[11px] font-black fill-indigo-950">{vLbl.O}</text>
                  <text x="148" y="75" textAnchor="start" className="text-[11px] font-black fill-amber-800">{vLbl.A}</text>
                  <text x="120" y="22" textAnchor="start" className="text-[11px] font-black fill-amber-800">{vLbl.B}</text>
                  <text x="112" y="65" textAnchor="start" className="text-[10px] font-bold fill-emerald-700">ω</text>
                </svg>
                <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <div>
                    <strong className="text-indigo-900 block">{t.card1ArcTitle}</strong>
                    {t.card1ArcDesc}
                  </div>
                </div>
              </div>

              <div className="bg-indigo-900 text-white rounded-xl p-2.5 text-center font-mono text-xs sm:text-sm font-bold mb-2">
                {t.card1Formula}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 font-semibold text-center">
                {t.card1Specials}
              </p>
            </div>
          </div>

          {/* ΚΑΡΤΑ 2: ΚΥΚΛΙΚΟΣ ΤΟΜΕΑΣ */}
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

              {/* Εποπτικό Σχήμα Κυκλικού Τομέα */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3 flex flex-col sm:flex-row items-center gap-4">
                <svg viewBox="0 0 180 140" className="w-40 h-32 shrink-0">
                  <circle cx="90" cy="72" r="50" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.8" strokeDasharray="3 2" />
                  <path d="M 90,72 L 140,72 A 50,50 0 0,0 107.1,25 Z" fill="rgba(16, 185, 129, 0.25)" stroke="#059669" strokeWidth="2.4" strokeLinejoin="round" />
                  <circle cx="90" cy="72" r="3.5" fill="#1e1b4b" />
                  <circle cx="140" cy="72" r="3.5" fill="#059669" />
                  <circle cx="107.1" cy="25" r="3.5" fill="#059669" />
                  <text x="81" y="76" textAnchor="end" className="text-[11px] font-black fill-indigo-950">{vLbl.O}</text>
                  <text x="148" y="75" textAnchor="start" className="text-[11px] font-black fill-emerald-800">{vLbl.A}</text>
                  <text x="111" y="18" textAnchor="start" className="text-[11px] font-black fill-emerald-800">{vLbl.B}</text>
                  <text x="113" y="61" textAnchor="middle" className="text-[11px] font-bold fill-emerald-900">ω</text>
                </svg>
                <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <div>
                    <strong className="text-emerald-900 block">{t.card2Prop1Title}</strong>
                    {t.card2Prop1Desc}
                  </div>
                  <div>
                    <strong className="text-indigo-900 block">{t.card2Prop2Title}</strong>
                    {t.card2Prop2Desc}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 3: ΙΣΕΣ & ΑΝΙΣΕΣ ΕΠΙΚΕΝΤΡΕΣ ΓΩΝΙΕΣ */}
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

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-950 leading-relaxed">
                  <strong className="text-emerald-900 block mb-0.5">{t.card3EqualTitle}</strong>
                  {t.card3EqualDesc}
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-indigo-900 block mb-0.5">{t.card3UnequalTitle}</strong>
                  {t.card3UnequalDesc}
                </div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 4: ΣΧΕΤΙΚΕΣ ΘΕΣΕΙΣ ΕΥΘΕΙΑΣ & ΚΥΚΛΟΥ */}
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

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-rose-800">{t.card4Case1Title}</strong> {t.card4Case1Desc}
                </div>
                <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-950 leading-relaxed">
                  <strong className="text-amber-900">{t.card4Case2Title}</strong> {t.card4Case2Desc}
                </div>
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-950 leading-relaxed">
                  <strong className="text-emerald-900">{t.card4Case3Title}</strong> {t.card4Case3Desc}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE LAB (2 ΜΕΡΗ: ΕΠΙΚΕΝΤΡΗ ΓΩΝΙΑ & ΣΧΕΤΙΚΕΣ ΘΕΣΕΙΣ ΕΥΘΕΙΑΣ-ΚΥΚΛΟΥ) */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200 shadow-md mb-8 sm:mb-12 w-full min-w-0">
          <div className="mb-6 pb-5 border-b border-slate-100">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
              🧭 {toCleanUppercase(t.labBadge)}
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.labTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full min-w-0">
            
            {/* ΜΕΡΟΣ Α: ΕΠΙΚΕΝΤΡΗ ΓΩΝΙΑ & ΚΥΚΛΙΚΟΣ ΤΟΜΕΑΣ */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 min-w-0">
              <div className="space-y-4">
                <span className="text-xs font-black text-indigo-900 uppercase tracking-wider block">
                  {toCleanUppercase(t.labModeArc)}
                </span>

                <CustomSlider
                  label={t.labSliderAngle}
                  min={20}
                  max={300}
                  step={5}
                  value={omega}
                  onChange={setOmega}
                  unit="°"
                  color="#059669"
                  locale={locale}
                />

                {/* SVG Επίκεντρης γωνίας & Κυκλικού τομέα */}
                <div className="bg-slate-950 rounded-2xl p-3 flex items-center justify-center shadow-inner overflow-hidden">
                  <svg viewBox="0 0 330 230" className="w-full max-w-sm h-52 select-none">
                    <circle cx={cx} cy={cy} r={R} fill="rgba(99, 102, 241, 0.12)" stroke="#64748b" strokeWidth="2" />
                    <path d={sectorPath} fill="rgba(16, 185, 129, 0.28)" stroke="#34d399" strokeWidth="2" strokeLinejoin="round" />
                    <path d={arcPath} fill="none" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />

                    <circle cx={cx} cy={cy} r="4" fill="#ffffff" />
                    <circle cx={Ax} cy={Ay} r="4.5" fill="#fbbf24" />
                    <circle cx={Bx} cy={By} r="4.5" fill="#fbbf24" />

                    <text x={cx - 10} y={cy + 4} textAnchor="end" className="text-[12px] font-black fill-white">{vLbl.O}</text>
                    <text x={Ax + 10} y={Ay + 4} textAnchor="start" className="text-[12px] font-black fill-amber-300">{vLbl.A}</text>
                    <text
                      x={Bx + (Bx >= cx ? 10 : -10)}
                      y={By + (By >= cy ? 14 : -8)}
                      textAnchor={Bx >= cx ? 'start' : 'end'}
                      className="text-[12px] font-black fill-amber-300"
                    >
                      {vLbl.B}
                    </text>
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-indigo-900 text-white rounded-xl">
                  <span className="font-bold text-indigo-200 block mb-0.5 text-[10px]">
                    {toCleanUppercase(t.labArcMeasureLabel)}
                  </span>
                  <div className="font-mono font-black text-sm">{omega}°</div>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="font-bold text-emerald-700 block mb-0.5 text-[10px]">
                    {toCleanUppercase(t.labSectorTypeLabel)}
                  </span>
                  <div className="font-bold text-emerald-950 leading-snug">{sectorTypeText}</div>
                </div>
              </div>
            </div>

            {/* ΜΕΡΟΣ Β: ΣΧΕΤΙΚΕΣ ΘΕΣΕΙΣ ΕΥΘΕΙΑΣ & ΚΥΚΛΟΥ */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 min-w-0">
              <div className="space-y-4">
                <span className="text-xs font-black text-indigo-900 uppercase tracking-wider block">
                  {toCleanUppercase(t.labModeLine)}
                </span>

                <CustomSlider
                  label={t.labSliderDist}
                  min={20}
                  max={105}
                  step={5}
                  value={lineDist}
                  onChange={setLineDist}
                  unit=""
                  color="#d97706"
                  locale={locale}
                />

                {/* SVG Σχετικών Θέσεων Ευθείας & Κύκλου */}
                <div className="bg-slate-950 rounded-2xl p-3 flex items-center justify-center shadow-inner overflow-hidden">
                  <svg viewBox="0 0 330 230" className="w-full max-w-sm h-52 select-none">
                    <circle cx={cx2} cy={cy2} r={R2} fill="rgba(99, 102, 241, 0.14)" stroke="#818cf8" strokeWidth="2.4" />
                    <line x1={cx2} y1={cy2} x2={cx2 - R2} y2={cy2} stroke="#818cf8" strokeWidth="1.6" strokeDasharray="3 2" />
                    <text x={cx2 - 35} y={cy2 - 6} textAnchor="middle" className="text-[10px] font-bold fill-indigo-300">ρ ＝ 70</text>

                    <line
                      x1="35"
                      y1={lineY}
                      x2="295"
                      y2={lineY}
                      stroke={isSecant ? '#34d399' : isTangent ? '#fbbf24' : '#fb7185'}
                      strokeWidth="2.5"
                    />
                    <text x="302" y={lineY + 4} className="text-[11px] font-black fill-white">({isEl ? 'ε' : 'l'})</text>

                    <line x1={cx2} y1={cy2} x2={cx2} y2={lineY} stroke="#ffffff" strokeWidth="1.6" strokeDasharray="3 2" />
                    <polyline points={`${cx2},${lineY - 9} ${cx2 + 9},${lineY - 9} ${cx2 + 9},${lineY}`} fill="none" stroke="#ffffff" strokeWidth="1.5" />
                    <text x={cx2 + 12} y={(cy2 + lineY) / 2 + 4} className="text-[10px] font-mono font-bold fill-white">
                      {isEl ? 'δ' : 'd'} ＝ {lineDist}
                    </text>

                    <circle cx={cx2} cy={cy2} r="4" fill="#ffffff" />
                    <text x={cx2} y={cy2 - 9} textAnchor="middle" className="text-[12px] font-black fill-white">{vLbl.O}</text>

                    {isSecant && (
                      <>
                        <circle cx={cx2 - dxChord} cy={lineY} r="4.5" fill="#34d399" />
                        <circle cx={cx2 + dxChord} cy={lineY} r="4.5" fill="#34d399" />
                        <text x={cx2 - dxChord - 8} y={lineY + 15} textAnchor="end" className="text-[11px] font-black fill-emerald-300">{vLbl.A}</text>
                        <text x={cx2 + dxChord + 8} y={lineY + 15} textAnchor="start" className="text-[11px] font-black fill-emerald-300">{vLbl.B}</text>
                      </>
                    )}
                    {isTangent && (
                      <>
                        <circle cx={cx2} cy={lineY} r="4.5" fill="#fbbf24" />
                        <text x={cx2} y={lineY + 16} textAnchor="middle" className="text-[11px] font-black fill-amber-300">{vLbl.A}</text>
                      </>
                    )}
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="font-bold text-amber-800 block mb-0.5 text-[10px]">
                    {toCleanUppercase(t.labLineStatusLabel)}
                  </span>
                  <div className="font-bold text-amber-950 leading-snug">{lineStatusText}</div>
                </div>
                <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-600 block mb-0.5 text-[10px]">
                    {toCleanUppercase(t.labCommonPtsLabel)}
                  </span>
                  <div className="font-bold text-slate-900 leading-snug">{commonPtsText}</div>
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

                {/* Εποπτικό Σχήμα Προβλήματος 1 (Διαδοχικά τόξα 65°, 65°, 110° & χορδές ΑΒ, ΒΓ, ΓΔ) */}
                <div className="bg-slate-950 rounded-2xl p-3 mb-4 flex flex-col items-center justify-center shadow-inner overflow-hidden">
                  <svg viewBox="0 0 320 205" className="w-full max-w-[300px] h-44 select-none">
                    {/* Βασικός κύκλος */}
                    <circle cx="160" cy="96" r="68" fill="rgba(99, 102, 241, 0.12)" stroke="#64748b" strokeWidth="1.8" />
                    {/* Συνολικό τόξο ΑΔ = 240° (από 0° έως 240° αριστερόστροφα) */}
                    <path
                      d="M 228,96 A 68,68 0 1,0 126,154.9"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    {/* Ακτίνες ΟΑ (0°), ΟΒ (65°), ΟΓ (130°), ΟΔ (240°) */}
                    <line x1="160" y1="96" x2="228" y2="96" stroke="#818cf8" strokeWidth="1.6" strokeDasharray="3 2" />
                    <line x1="160" y1="96" x2="188.7" y2="34.4" stroke="#818cf8" strokeWidth="1.6" strokeDasharray="3 2" />
                    <line x1="160" y1="96" x2="116.3" y2="43.9" stroke="#818cf8" strokeWidth="1.6" strokeDasharray="3 2" />
                    <line x1="160" y1="96" x2="126" y2="154.9" stroke="#818cf8" strokeWidth="1.6" strokeDasharray="3 2" />

                    {/* Χορδές ΑΒ & ΒΓ (ίσες - πράσινες) και ΓΔ (μεγαλύτερη - πορτοκαλί) */}
                    <line x1="228" y1="96" x2="188.7" y2="34.4" stroke="#34d399" strokeWidth="2.2" />
                    <line x1="188.7" y1="34.4" x2="116.3" y2="43.9" stroke="#34d399" strokeWidth="2.2" />
                    <line x1="116.3" y1="43.9" x2="126" y2="154.9" stroke="#fbbf24" strokeWidth="2.6" />

                    {/* Ετικέτες γωνιών στο εσωτερικό */}
                    <text x="193" y="83" textAnchor="middle" className="text-[9px] font-mono font-bold fill-emerald-300">65°</text>
                    <text x="156" y="65" textAnchor="middle" className="text-[9px] font-mono font-bold fill-emerald-300">65°</text>
                    <text x="132" y="102" textAnchor="middle" className="text-[9px] font-mono font-bold fill-amber-300">110°</text>

                    {/* Σημεία */}
                    <circle cx="160" cy="96" r="3.5" fill="#ffffff" />
                    <circle cx="228" cy="96" r="3.8" fill="#34d399" />
                    <circle cx="188.7" cy="34.4" r="3.8" fill="#34d399" />
                    <circle cx="116.3" cy="43.9" r="3.8" fill="#fbbf24" />
                    <circle cx="126" cy="154.9" r="3.8" fill="#fbbf24" />

                    <text x="169" y="107" textAnchor="start" className="text-[11px] font-black fill-white">{vLbl.O}</text>
                    <text x="237" y="100" textAnchor="start" className="text-[11px] font-black fill-emerald-300">{vLbl.A}</text>
                    <text x="194" y="25" textAnchor="start" className="text-[11px] font-black fill-emerald-300">{vLbl.B}</text>
                    <text x="108" y="36" textAnchor="end" className="text-[11px] font-black fill-amber-300">{vLbl.C}</text>
                    <text x="119" y="170" textAnchor="end" className="text-[11px] font-black fill-amber-300">{vLbl.D}</text>
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
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5 border-b">{t.prob1ColPart}</th>
                        <th className="p-2.5 border-b">{t.prob1ColRule}</th>
                        <th className="p-2.5 border-b">{t.prob1ColCalc}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob1Row1Q}</td>
                        <td className="p-2.5 font-mono">{t.prob1Row1R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700">{t.prob1Row1C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob1Row2Q}</td>
                        <td className="p-2.5">{t.prob1Row2R}</td>
                        <td className="p-2.5 font-bold text-indigo-700">{t.prob1Row2C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob1Row3Q}</td>
                        <td className="p-2.5">{t.prob1Row3R}</td>
                        <td className="p-2.5 font-bold text-indigo-700">{t.prob1Row3C}</td>
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

                {/* Εποπτικό Σχήμα Προβλήματος 2 (Κύκλος ρ = 9 cm με ε₁ τέμνουσα, ε₂ εφαπτόμενη στο Α, ε₃ εξωτερική) */}
                <div className="bg-slate-950 rounded-2xl p-3 mb-4 flex flex-col items-center justify-center shadow-inner overflow-hidden">
                  <svg viewBox="0 0 320 205" className="w-full max-w-[300px] h-44 select-none">
                    {/* Κύκλος (Ο, ρ = 9 cm) -> R = 56 */}
                    <circle cx="155" cy="84" r="56" fill="rgba(99, 102, 241, 0.14)" stroke="#818cf8" strokeWidth="2.2" />

                    {/* Ευθεία (ε₁) τέμνουσα (δ₁ = 6 -> 37px κάτω από Ο) */}
                    <line x1="42" y1="121" x2="268" y2="121" stroke="#34d399" strokeWidth="2" />
                    <text x="274" y="124" className="text-[10px] font-black fill-emerald-300">({isEl ? 'ε₁' : 'l₁'})</text>

                    {/* Ευθεία (ε₂) εφαπτόμενη στο Α (δ₂ = 9 -> 56px κάτω από Ο, y = 140) */}
                    <line x1="42" y1="140" x2="268" y2="140" stroke="#fbbf24" strokeWidth="2.2" />
                    <text x="274" y="143" className="text-[10px] font-black fill-amber-300">({isEl ? 'ε₂' : 'l₂'})</text>

                    {/* Ευθεία (ε₃) εξωτερική (δ₃ = 12 -> 75px κάτω από Ο, y = 159) */}
                    <line x1="42" y1="159" x2="268" y2="159" stroke="#fb7185" strokeWidth="2" strokeDasharray="4 3" />
                    <text x="274" y="162" className="text-[10px] font-black fill-rose-300">({isEl ? 'ε₃' : 'l₃'})</text>

                    {/* Ακτίνα επαφής ΟΑ κάθετη στην ε₂ */}
                    <line x1="155" y1="84" x2="155" y2="140" stroke="#ffffff" strokeWidth="1.8" strokeDasharray="3 2" />
                    <polyline points="155,130 165,130 165,140" fill="none" stroke="#fbbf24" strokeWidth="1.6" />
                    <text x="148" y="110" textAnchor="end" className="text-[9px] font-mono font-bold fill-indigo-200">ρ ＝ 9</text>

                    {/* Σημεία Ο, Α, Μ */}
                    <circle cx="155" cy="84" r="3.5" fill="#ffffff" />
                    <circle cx="155" cy="140" r="3.8" fill="#fbbf24" />
                    <circle cx="225" cy="140" r="3" fill="#fbbf24" />
                    <text x="155" y="74" textAnchor="middle" className="text-[11px] font-black fill-white">{vLbl.O}</text>
                    <text x="147" y="152" textAnchor="end" className="text-[11px] font-black fill-amber-300">{vLbl.A}</text>
                    <text x="225" y="152" textAnchor="middle" className="text-[10px] font-black fill-amber-300">{vLbl.M}</text>
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
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5 border-b">{t.prob2ColPart}</th>
                        <th className="p-2.5 border-b">{t.prob2ColRule}</th>
                        <th className="p-2.5 border-b">{t.prob2ColCalc}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob2Row1Q}</td>
                        <td className="p-2.5">{t.prob2Row1R}</td>
                        <td className="p-2.5 font-bold text-indigo-700">{t.prob2Row1C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob2Row2Q}</td>
                        <td className="p-2.5">{t.prob2Row2R}</td>
                        <td className="p-2.5 font-bold text-indigo-700">{t.prob2Row2C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob2Row3Q}</td>
                        <td className="p-2.5">{t.prob2Row3R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700">{t.prob2Row3C}</td>
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
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{t.alert4Title}</strong> {t.alert4Desc}
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
            href="/a-gymnasiou/46-epikentri-gonia-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase(t.bottomBtn)}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}