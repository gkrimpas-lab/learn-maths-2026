import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- Βοηθητική Συνάρτηση για Άτονα Κεφαλαία (διατηρεί το Β') ---
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = String(str).split(/(Β')/g);
  return parts
    .map((part) => {
      if (part === "Β'") return "Β'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

function extractPlainText(node) {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractPlainText).join(' ');
  if (React.isValidElement(node)) {
    return extractPlainText(node.props?.children);
  }
  return '';
}

// --- Custom Μαθηματικά Components ---
function Angle({ children, className = '' }) {
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

function Arc({ children, className = '' }) {
  return (
    <span className={`relative inline-block leading-none mx-[1px] ${className}`}>
      <svg
        viewBox="0 0 16 6"
        className="w-[0.95em] h-[0.36em] absolute -top-[0.4em] left-1/2 -translate-x-1/2 text-current overflow-visible pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 5 Q8 0.5 15 5" />
      </svg>
      <span>{children}</span>
    </span>
  );
}

function Frac({ num, den, small = false, className = '' }) {
  return (
    <span
      className={`inline-grid grid-rows-[1fr_auto_1fr] items-center justify-items-center whitespace-nowrap align-middle font-mono ${
        small ? 'text-[0.8em] mx-0.5' : 'text-[0.86em] mx-1'
      } leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="px-1 pb-0.5 whitespace-nowrap font-semibold">{num}</span>
      <span className="w-full border-t border-current leading-none" />
      <span className="px-1 pt-0.5 whitespace-nowrap font-semibold">{den}</span>
    </span>
  );
}

function ComplexFrac({ num, den, className = '' }) {
  return (
    <span
      className={`inline-grid grid-rows-[1fr_auto_1fr] items-center justify-items-center whitespace-nowrap align-middle font-mono text-[0.9em] mx-1.5 leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="px-1.5 pb-0.5 whitespace-nowrap font-semibold">{num}</span>
      <span className="w-full border-t-[2.4px] border-current leading-none" />
      <span className="px-1.5 pt-0.5 whitespace-nowrap font-semibold">{den}</span>
    </span>
  );
}

function Radical({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-stretch align-middle font-mono shrink-0 select-none mx-0.5 ${className}`}
    >
      <svg
        viewBox="0 0 14 24"
        className="w-[0.6em] self-stretch shrink-0 text-current overflow-visible"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        aria-hidden="true"
      >
        <path d="M 1 13.5 L 4 13.5 L 7.5 22.8 L 13.6 0.8" />
      </svg>
      <span className="border-t-[1.9px] border-current pl-0.5 pr-1 pt-0.5 pb-[1px] leading-none inline-flex items-center text-[0.95em] font-semibold">
        {children}
      </span>
    </span>
  );
}

function Pow({ base, exp, parens = false, className = '' }) {
  return (
    <span className={`inline-flex items-baseline font-mono leading-none mx-[1px] ${className}`}>
      {parens ? (
        <span className="inline-flex items-center">
          <span>(</span>
          {base}
          <span>)</span>
        </span>
      ) : (
        <span>{base}</span>
      )}
      <sup className="text-[0.72em] font-bold leading-none ml-[1px] -top-[0.45em] relative">
        {exp}
      </sup>
    </span>
  );
}

// --- Custom Slider με πλήρη υποστήριξη Mouse & Touch ---
const CustomSlider = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  accentColor = 'indigo',
  ariaLabel = 'Slider',
}) => {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const updateFromClientX = (clientX) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = min + ratio * (max - min);
    const snapped = Math.round(raw / step) * step;
    const clamped = Math.max(min, Math.min(max, Number(snapped.toFixed(4))));
    onChange(clamped);
  };

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateFromClientX(clientX);
    };
    const handleUp = () => setDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [dragging, min, max, step]);

  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
  const fillClass =
    accentColor === 'emerald'
      ? 'bg-emerald-600'
      : accentColor === 'amber'
      ? 'bg-amber-600'
      : accentColor === 'sky'
      ? 'bg-sky-600'
      : 'bg-indigo-600';
  const ringClass =
    accentColor === 'emerald'
      ? 'border-emerald-600 focus:ring-emerald-300'
      : accentColor === 'amber'
      ? 'border-amber-600 focus:ring-amber-300'
      : accentColor === 'sky'
      ? 'border-sky-600 focus:ring-sky-300'
      : 'border-indigo-600 focus:ring-indigo-300';

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      onMouseDown={(e) => {
        setDragging(true);
        updateFromClientX(e.clientX);
      }}
      onTouchStart={(e) => {
        setDragging(true);
        updateFromClientX(e.touches[0].clientX);
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          onChange(Math.min(max, Number((value + step).toFixed(4))));
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          onChange(Math.max(min, Number((value - step).toFixed(4))));
        }
      }}
      className="relative w-full h-8 flex items-center cursor-pointer select-none touch-none"
    >
      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${fillClass} transition-all duration-75`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div
        className={`absolute w-6 h-6 rounded-full bg-white border-4 ${ringClass} shadow-md transform -translate-x-1/2 transition-transform ${
          dragging ? 'scale-110' : 'hover:scale-105'
        }`}
        style={{ left: `${pct}%` }}
      />
    </div>
  );
};

function gcdInt(a, b) {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function fmtSignedOp(val) {
  if (val >= 0) return `＋ ${val}`;
  return `－ ${Math.abs(val)}`;
}

function fmtParensIfNeg(val) {
  return val < 0 ? `(${val})` : `${val}`;
}

const I18N = {
  el: {
    pageTitle: "Εξίσωση Πρώτου Βαθμού & Αντίθετες Πράξεις | Κεφ. 10 (Αρχείο 11) | Β' Γυμνασίου",
    metaDesc:
      "Η έννοια της εξίσωσης πρώτου βαθμού στη Β' Γυμνασίου και επίλυση με αντίθετες πράξεις, διαδραστικό εργαστήριο και λυμένα προβλήματα.",
    chapterBadge: "ΚΕΦΑΛΑΙΟ 10 • Β' ΓΥΜΝΑΣΙΟΥ",
    backText: "Β' Γυμνασίου",
    exercisesBtn: "ΑΣΚΗΣΕΙΣ",
    solve12Btn: "ΛΥΣΕ 12 ΑΣΚΗΣΕΙΣ",
    labBtn: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    heroTitle: "Έννοια Εξίσωσης Πρώτου Βαθμού & Επίλυση με Αντίθετες Πράξεις",
    heroDesc:
      "Κατανόησε τι σημαίνει ισότητα με άγνωστο και πώς λύνουμε εξισώσεις πρώτου βαθμού κάνοντας τις αντίθετες πράξεις με αντίστροφη σειρά (πρόσθεση ↔ αφαίρεση, πολλαπλασιασμός ↔ διαίρεση), πριν τη γενική μεθοδολογία του Κεφαλαίου 12.",
    card1Title: "Τι Είναι η Εξίσωση Πρώτου Βαθμού & Λύση της",
    card1BodyPart1:
      "Εξίσωση λέγεται μια ισότητα στην οποία περιέχεται ένας άγνωστος (π.χ. x) με εκθέτη 1 (όχι ",
    card1BodyPart2:
      "). Λύση της εξίσωσης είναι η τιμή του αγνώστου που κάνει την ισότητα αληθή.",
    card1Tip: "Η ισότητα λειτουργεί σαν ζυγαριά σε ισορροπία: ό,τι βρίσκεται στον αριστερό δίσκο ισούται με ό,τι βρίσκεται στον δεξιό δίσκο.",
    card1SvgAria: "Ζυγαριά ισορροπίας με το 2x + 3 στον αριστερό δίσκο και το 11 στον δεξιό δίσκο",
    card2Title: "Αντίθετες Πράξεις: Πρόσθεση ↔ Αφαίρεση",
    card2Body:
      "Όταν στον άγνωστο προστίθεται ή αφαιρείται ένας αριθμός, «αναιρούμε» την πράξη με την αντίθετή της:",
    card2AddRule: "Αν x ＋ α ＝ β → αναιρούμε το ＋ α με － α",
    card2SubRule: "Αν x － α ＝ β → αναιρούμε το － α με ＋ α",
    card3Title: "Αντίθετες Πράξεις: Πολλαπλασιασμός ↔ Διαίρεση",
    card3Body:
      "Όταν ο άγνωστος πολλαπλασιάζεται ή διαιρείται με έναν αριθμό (διάφορο του μηδενός), εφαρμόζουμε την αντίθετη πράξη:",
    card3MulRule: "Αν α · x ＝ β (α ≠ 0) → x ＝",
    card3DivRule: "Αν x : δ ＝ β (δ ≠ 0) → x ＝ β · δ",
    card4Title: "Διαδοχικές Αντίθετες Πράξεις & Επαλήθευση",
    card4Body:
      "Όταν στην εξίσωση γίνονται δύο διαδοχικές πράξεις, τις «ξετυλίγουμε» ανάποδα (πρώτα πρόσθεση/αφαίρεση, έπειτα διαίρεση/πολλαπλασιασμό) και πάντα επαληθεύουμε αντικαθιστώντας στην αρχική εξίσωση.",
    card4VerifyLabel: "Επαλήθευση: 3·5 ＋ 2 ＝ 17",
    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΕΞΕΡΕΥΝΗΣΗΣ",
    labTitle: "Εργαστήριο «Ξετυλίγματος» Εξίσωσης με Αντίθετες Πράξεις",
    labDesc:
      "Ρύθμισε τους συντελεστές (θετικούς ή αρνητικούς) και τον σταθερό όρο μετά το ίσον για να παρακολουθήσεις βήμα-βήμα πώς βρίσκουμε τον άγνωστο x με αντίθετες πράξεις.",
    tab1Label: "1. Πολλαπλασιασμός & Πρόσθεση (αx ＋ β ＝ γ)",
    tab2Label: "2. Διαίρεση & Αφαίρεση ((x : δ) － γ ＝ κ)",
    tab3Label: "3. Κλασματική Πράξη (x : δ ＝ μ)",
    sliderALabel: "Συντελεστής α (α ≠ 0):",
    sliderBLabel: "Όρος β:",
    sliderRhs1Label: "Σταθερός όρος μετά το ίσον (γ):",
    sliderDLabel: "Διαιρέτης δ (δ ≠ 0):",
    sliderGLabel: "Όρος γ:",
    sliderRhs2Label: "Σταθερός όρος μετά το ίσον (κ):",
    sliderRhs3Label: "Σταθερός όρος μετά το ίσον (μ):",
    stepByStepTitle: "Βήμα προς βήμα επίλυση με αντίθετες πράξεις",
    fracStepTitle: "Κλασματική πράξη & αντίθετος πολλαπλασιασμός",
    fracHint:
      "Η διαίρεση x : δ ＝ μ γράφεται και ως κλάσμα με αριθμητή x και παρονομαστή δ. Αναιρούμε τη διαίρεση με δ πολλαπλασιάζοντας το μ επί δ (προσέχοντας τα πρόσημα)!",
    labSvgAria: "Διάγραμμα αντίθετων πράξεων για την εύρεση του x",
    problemsHeading: "Λυμένα Προβλήματα Εφαρμογής",
    prob1Badge: "ΠΡΟΒΛΗΜΑ 1",
    prob1Title:
      "Η Ελένη αγόρασε 3 τετράδια στην ίδια τιμή x € και ένα στυλό αξίας 4 €. Αν πλήρωσε συνολικά 19 €, ποια είναι η τιμή x του κάθε τετραδίου;",
    prob1SvgAria: "Σχήμα κατανομής κόστους για την εξίσωση 3x + 4 = 19",
    prob1SvgTotal: "Σύνολο ＝ 19 €",
    prob1Step1Title: "1. Διατύπωση εξίσωσης",
    prob1Step2Title: "2. Αντίθετη πράξη (+4 ↔ −4)",
    prob1Step3Title: "3. Αντίθετη πράξη (·3 ↔ :3)",
    prob1Step4Title: "4. Επαλήθευση",
    prob1Final: "Τελική Απάντηση: Η τιμή κάθε τετραδίου είναι x ＝ 5 €.",
    prob2Badge: "ΠΡΟΒΛΗΜΑ 2",
    prob2Title:
      "Μια δεξαμενή με x λίτρα νερό μοιράζεται εξίσου σε 6 ίσες ποσότητες και από κάθε ποσότητα αφαιρούνται 3 λίτρα. Αν απομένουν 7 λίτρα, πόσα λίτρα x είχε αρχικά η δεξαμενή;",
    prob2SvgAria: "Σχήμα διαίρεσης και αφαίρεσης για την εξίσωση (x : 6) - 3 = 7",
    prob2SvgRem: "Απόμειναν ＝ 7 L",
    prob2Step1Title: "1. Διατύπωση εξίσωσης",
    prob2Step2Title: "2. Αντίθετη πράξη (−3 ↔ +3)",
    prob2Step3Title: "3. Αντίθετη πράξη (:6 ↔ ·6)",
    prob2Step4Title: "4. Επαλήθευση",
    prob2Final: "Τελική Απάντηση: Η δεξαμενή είχε αρχικά x ＝ 60 λίτρα.",
    colStep: "Βήμα",
    colAnalysis: "Ανάλυση / Αντίθετη Πράξη",
    alertTitle: "Προσοχή! Τα 3 πιο Κλασικά Λάθη στις Αντίθετες Πράξεις",
    err1Bold: "Λάθος φορά πράξης στο τέλος:",
    err1Text: "Στην εξίσωση 4x ＝ 2 κάποιοι γράφουν x ＝ 4 : 2 ＝ 2 αντί για το σωστό πηλίκο",
    err2Bold: "Ανάποδη σειρά «ξετυλίγματος»:",
    err2Text: "Στην 2x ＋ 6 ＝ 14 ξεχνούν να αφαιρέσουν πρώτα το 6 και μπερδεύουν τους όρους.",
    err3Bold: "Λάθος πρόσημο στην αντίθετη πράξη:",
    err3Text: "Στην x － 7 ＝ 10 κάνουν αφαίρεση 10 − 7 ＝ 3 αντί για πρόσθεση 10 ＋ 7 ＝ 17.",
    bottomTitle: "Έτοιμος να εξασκηθείς στις εξισώσεις με αντίθετες πράξεις;",
    bottomDesc:
      "Λύσε 12 δυναμικά παραγόμενες ασκήσεις με άμεσο έλεγχο, επεξηγήσεις και πίνακες βημάτων.",
    bottomBtn: "ΞΕΚΙΝΑ ΤΙΣ ΑΣΚΗΣΕΙΣ",
    schemaName: "Έννοια Εξίσωσης Πρώτου Βαθμού & Επίλυση με Αντίθετες Πράξεις",
  },
  en: {
    pageTitle: "First-Degree Equations & Inverse Operations | Ch. 10 (File 11) | 8th Grade",
    metaDesc:
      "Understand first-degree equations in Grade 8 and how to solve them with inverse operations, an interactive lab, and worked problems.",
    chapterBadge: "CHAPTER 10 • 8TH GRADE",
    backText: "Grade 8",
    exercisesBtn: "EXERCISES",
    solve12Btn: "SOLVE 12 EXERCISES",
    labBtn: "INTERACTIVE LAB",
    heroTitle: "First-Degree Equations & Solving with Inverse Operations",
    heroDesc:
      "Understand what an equality with an unknown means and how to solve first-degree equations in reverse order using inverse operations (addition ↔ subtraction, multiplication ↔ division) before Chapter 12.",
    card1Title: "What Is a First-Degree Equation & Its Solution",
    card1BodyPart1:
      "An equation is a statement of equality containing an unknown (such as x) with exponent 1 (not ",
    card1BodyPart2:
      "). A solution is the value of the unknown that makes the equality true.",
    card1Tip: "An equality acts like a balanced scale: what sits on the left pan equals what sits on the right pan.",
    card1SvgAria: "Balanced scale with 2x + 3 on the left pan and 11 on the right pan",
    card2Title: "Inverse Operations: Addition ↔ Subtraction",
    card2Body:
      "When a number is added to or subtracted from the unknown, undo the operation with its inverse:",
    card2AddRule: "If x ＋ a ＝ b → undo ＋ a with － a",
    card2SubRule: "If x － a ＝ b → undo － a with ＋ a",
    card3Title: "Inverse Operations: Multiplication ↔ Division",
    card3Body:
      "When the unknown is multiplied or divided by a non-zero number, apply the inverse operation:",
    card3MulRule: "If a · x ＝ b (a ≠ 0) → x ＝",
    card3DivRule: "If x : d ＝ b (d ≠ 0) → x ＝ b · d",
    card4Title: "Successive Inverse Operations & Verification",
    card4Body:
      "When two operations act on x in sequence, unwrap them in reverse order (addition/subtraction first, then division/multiplication) and always check in the original equation.",
    card4VerifyLabel: "Check: 3·5 ＋ 2 ＝ 17",
    labBadge: "INTERACTIVE EXPLORATION LAB",
    labTitle: "Equation Unwrapping Lab with Inverse Operations",
    labDesc:
      "Adjust the signed coefficients and the constant term after the equals sign to see step by step how we solve for unknown x using inverse operations.",
    tab1Label: "1. Multiply & Add (ax ＋ b ＝ c)",
    tab2Label: "2. Divide & Subtract ((x : d) － g ＝ k)",
    tab3Label: "3. Fractional Operation (x : d ＝ m)",
    sliderALabel: "Coefficient a (a ≠ 0):",
    sliderBLabel: "Term b:",
    sliderRhs1Label: "Constant term after equals (c):",
    sliderDLabel: "Divisor d (d ≠ 0):",
    sliderGLabel: "Term g:",
    sliderRhs2Label: "Constant term after equals (k):",
    sliderRhs3Label: "Constant term after equals (m):",
    stepByStepTitle: "Step-by-step solution with inverse operations",
    fracStepTitle: "Fractional division & inverse multiplication",
    fracHint:
      "Dividing x by d equals m, which can be written as a fraction with numerator x and denominator d. Undo division by d by multiplying m by d (watching the signs)!",
    labSvgAria: "Inverse operations flow diagram for finding x",
    problemsHeading: "Solved Application Problems",
    prob1Badge: "PROBLEM 1",
    prob1Title:
      "Eleni bought 3 notebooks at the same price x € and a pen costing 4 €. If she paid 19 € in total, what is the price x of each notebook?",
    prob1SvgAria: "Cost breakdown diagram for equation 3x + 4 = 19",
    prob1SvgTotal: "Total ＝ 19 €",
    prob1Step1Title: "1. Set up equation",
    prob1Step2Title: "2. Inverse of (+4 ↔ −4)",
    prob1Step3Title: "3. Inverse of (·3 ↔ :3)",
    prob1Step4Title: "4. Verification",
    prob1Final: "Final Answer: The price of each notebook is x ＝ 5 €.",
    prob2Badge: "PROBLEM 2",
    prob2Title:
      "A tank holding x liters of water is split into 6 equal parts, and 3 liters are removed from each part. If 7 liters remain, how many liters x did the tank have initially?",
    prob2SvgAria: "Division and subtraction diagram for equation (x : 6) - 3 = 7",
    prob2SvgRem: "Remaining ＝ 7 L",
    prob2Step1Title: "1. Set up equation",
    prob2Step2Title: "2. Inverse of (−3 ↔ +3)",
    prob2Step3Title: "3. Inverse of (:6 ↔ ·6)",
    prob2Step4Title: "4. Verification",
    prob2Final: "Final Answer: The tank initially held x ＝ 60 liters.",
    colStep: "Step",
    colAnalysis: "Analysis / Inverse Operation",
    alertTitle: "Watch Out! Top 3 Classic Mistakes with Inverse Operations",
    err1Bold: "Flipped division order:",
    err1Text: "In 4x ＝ 2 some write x ＝ 4 : 2 ＝ 2 instead of the fraction",
    err2Bold: "Wrong unwrapping order:",
    err2Text: "In 2x ＋ 6 ＝ 14 some divide before subtracting 6 and mix up the terms.",
    err3Bold: "Wrong inverse sign:",
    err3Text: "In x － 7 ＝ 10 some subtract 10 − 7 ＝ 3 instead of adding 10 ＋ 7 ＝ 17.",
    bottomTitle: "Ready to practice solving equations with inverse operations?",
    bottomDesc:
      "Solve 12 dynamically generated exercises with instant feedback, explanations, and step tables.",
    bottomBtn: "START EXERCISES",
    schemaName: "First-Degree Equations & Solving with Inverse Operations",
  },
};

export default function EksisosiTheoryPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = I18N[locale];

  const [labTab, setLabTab] = useState('mulAdd'); // 'mulAdd' | 'divSub' | 'fracOp'

  // Tab 1: αx + β = γ (όλα μπορούν να είναι αρνητικά, μόνο α ≠ 0)
  const [coefA, setCoefA] = useState(4);
  const [addB, setAddB] = useState(8);
  const [rhs1, setRhs1] = useState(20);

  // Tab 2: (x : δ) - γ = κ (όλα μπορούν να είναι αρνητικά, μόνο δ ≠ 0)
  const [divD, setDivD] = useState(3);
  const [subG, setSubG] = useState(2);
  const [rhs2, setRhs2] = useState(4);

  // Tab 3: x : δ = μ (όλα μπορούν να είναι αρνητικά, μόνο δ ≠ 0)
  const [fracD, setFracD] = useState(5);
  const [rhs3, setRhs3] = useState(-4);

  // Υπολογισμοί Tab 1 με σωστή μεταφορά προσήμου
  const safeA = coefA === 0 ? 1 : coefA;
  const diff1 = rhs1 - addB;
  const isExact1 = diff1 % safeA === 0;
  const rawG1 = gcdInt(diff1, safeA);
  const sign1 = (diff1 < 0) !== (safeA < 0) && diff1 !== 0 ? -1 : 1;
  const simpNum1 = sign1 * (Math.abs(diff1) / rawG1);
  const simpDen1 = Math.abs(safeA) / rawG1;
  const exactVal1 = diff1 / safeA;

  // Υπολογισμοί Tab 2
  const safeD = divD === 0 ? 1 : divD;
  const sum2 = rhs2 + subG;
  const xSol2 = sum2 * safeD;

  // Υπολογισμοί Tab 3
  const safeFracD = fracD === 0 ? 1 : fracD;
  const xSol3 = rhs3 * safeFracD;

  const baseUrl = locale === 'en' ? 'https://learnmaths.gr/en' : 'https://learnmaths.gr';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: extractPlainText(t.schemaName),
    description: extractPlainText(t.metaDesc),
    inLanguage: locale,
    educationalLevel: "Β' ΓΥΜΝΑΣΙΟΥ",
    typicalAgeRange: '13-14',
    isAccessibleForFree: true,
    url: `${baseUrl}/b-gymnasiou/11-eksisosi`,
    provider: {
      '@id': 'https://learnmaths.gr/#organization',
    },
  };

  const actionButton = (
    <Link
      href="/b-gymnasiou/11-eksisosi-ask"
      locale={locale}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-sm transition-colors"
    >
      <span aria-hidden="true">🎯</span>
      <span>{toCleanUppercase(t.exercisesBtn)}</span>
    </Link>
  );

  return (
    <Layout
      title={t.pageTitle}
      description={t.metaDesc}
      jsonLd={jsonLd}
      actionButton={actionButton}
      backUrl="/b-gymnasiou"
      backText={t.backText}
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] 8k:max-w-[5120px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 8k:px-32 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border">
        {/* 1. HERO BANNER */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-6 sm:p-8 lg:p-10 2xl:p-12 shadow-xl mb-8 min-w-0">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 min-w-0">
            <div className="max-w-3xl min-w-0">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-indigo-100 text-xs sm:text-sm font-extrabold tracking-wider mb-4">
                <span>{toCleanUppercase(t.chapterBadge)}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-3 break-words [overflow-wrap:anywhere]">
                {t.heroTitle}
              </h1>
              <p className="text-indigo-100 text-sm sm:text-base lg:text-lg leading-relaxed break-words [overflow-wrap:anywhere]">
                {t.heroDesc}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                href="/b-gymnasiou/11-eksisosi-ask"
                locale={locale}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base shadow-lg transition-all"
              >
                <span>{toCleanUppercase(t.solve12Btn)}</span>
                <span aria-hidden="true">→</span>
              </Link>
              <a
                href="#interactive-lab"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 transition-all"
              >
                <span>{toCleanUppercase(t.labBtn)}</span>
              </a>
            </div>
          </div>
        </section>

        {/* 2. 4 MODULAR CARDS ΘΕΩΡΙΑΣ */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-10 min-w-0">
          {/* ΚΑΡΤΑ 1 */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  1
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
                  {t.card1Title}
                </h2>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-3 break-words [overflow-wrap:anywhere]">
                {t.card1BodyPart1}
                <Pow base="x" exp="2" />
                {t.card1BodyPart2}
              </p>

              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs sm:text-sm font-semibold text-indigo-950 mb-4 break-words [overflow-wrap:anywhere]">
                {t.card1Tip}
              </div>

              <div className="w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 p-3">
                <svg
                  viewBox="0 0 420 148"
                  className="w-full h-auto max-w-full block select-none"
                  role="img"
                  aria-label={t.card1SvgAria}
                >
                  <rect x="48" y="18" width="128" height="36" rx="10" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2.2" />
                  <text x="112" y="41" textAnchor="middle" fontSize="14.5" fontWeight="900" fill="#1e1b4b" fontFamily="monospace">
                    2x ＋ 3
                  </text>
                  <path d="M 38 56 Q 112 68 186 56" fill="none" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="112" y1="62" x2="112" y2="76" stroke="#334155" strokeWidth="3" />

                  <rect x="244" y="18" width="128" height="36" rx="10" fill="#ecfdf5" stroke="#059669" strokeWidth="2.2" />
                  <text x="308" y="41" textAnchor="middle" fontSize="14.5" fontWeight="900" fill="#064e3b" fontFamily="monospace">
                    11
                  </text>
                  <path d="M 234 56 Q 308 68 382 56" fill="none" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="308" y1="62" x2="308" y2="76" stroke="#334155" strokeWidth="3" />

                  <line x1="76" y1="76" x2="344" y2="76" stroke="#475569" strokeWidth="4.5" strokeLinecap="round" />
                  <circle cx="112" cy="76" r="4" fill="#1e293b" />
                  <circle cx="308" cy="76" r="4" fill="#1e293b" />

                  <polygon points="210,48 204,66 216,66" fill="#059669" />
                  <circle cx="210" cy="76" r="6.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
                  <rect x="205" y="82" width="10" height="44" rx="3" fill="#334155" />

                  <polygon points="168,136 252,136 238,124 182,124" fill="#1e293b" />
                  <rect x="156" y="135" width="108" height="6" rx="3" fill="#0f172a" />
                </svg>
              </div>
            </div>
          </article>

          {/* ΚΑΡΤΑ 2 */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  2
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
                  {t.card2Title}
                </h2>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4 break-words [overflow-wrap:anywhere]">
                {t.card2Body}
              </p>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <div className="font-mono font-black text-emerald-950 break-words [overflow-wrap:anywhere]">
                    {t.card2AddRule}
                  </div>
                  <div className="font-mono text-slate-700">
                    x ＋ 5 ＝ 12 → x ＝ 12 － 5 ＝ 7
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 space-y-1">
                  <div className="font-mono font-black text-sky-950 break-words [overflow-wrap:anywhere]">
                    {t.card2SubRule}
                  </div>
                  <div className="font-mono text-slate-700">
                    x － 4 ＝ 9 → x ＝ 9 ＋ 4 ＝ 13
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* ΚΑΡΤΑ 3 */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-amber-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  3
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
                  {t.card3Title}
                </h2>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4 break-words [overflow-wrap:anywhere]">
                {t.card3Body}
              </p>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono font-black text-amber-950 inline-flex flex-wrap items-center gap-1">
                    <span>{t.card3MulRule}</span>
                    <Frac num="β" den="α" small />
                  </span>
                  <span className="font-mono text-slate-800 inline-flex items-center gap-1">
                    <span>3x ＝ 15 → x ＝</span>
                    <Frac num="15" den="3" small />
                    <span>＝ 5</span>
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono font-black text-orange-950 break-words [overflow-wrap:anywhere]">
                    {t.card3DivRule}
                  </span>
                  <span className="font-mono text-slate-800">
                    x : 4 ＝ 6 → x ＝ 6 · 4 ＝ 24
                  </span>
                </div>
              </div>
            </div>
          </article>

          {/* ΚΑΡΤΑ 4 */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  4
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
                  {t.card4Title}
                </h2>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4 break-words [overflow-wrap:anywhere]">
                {t.card4Body}
              </p>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 font-mono text-xs sm:text-sm text-purple-950 space-y-2">
                <div className="font-bold text-sm sm:text-base">3x ＋ 2 ＝ 17</div>
                <div>1) 3x ＝ 17 － 2 ＝ 15</div>
                <div className="inline-flex flex-wrap items-center gap-1.5 font-black text-emerald-800">
                  <span>2) x ＝</span>
                  <Frac num="15" den="3" small />
                  <span>＝ 5 &nbsp;|&nbsp; {t.card4VerifyLabel}</span>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ (INTERACTIVE LAB) */}
        <section
          id="interactive-lab"
          className="bg-white rounded-3xl border-2 border-indigo-200 shadow-lg p-5 sm:p-8 mb-10 min-w-0"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="min-w-0">
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-extrabold tracking-wide mb-2">
                {toCleanUppercase(t.labBadge)}
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
                {t.labTitle}
              </h2>
              <p className="text-sm text-slate-600 mt-1 break-words [overflow-wrap:anywhere]">
                {t.labDesc}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl shrink-0">
              <button
                type="button"
                onClick={() => setLabTab('mulAdd')}
                className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                  labTab === 'mulAdd'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-700 hover:bg-white/70'
                }`}
              >
                {t.tab1Label}
              </button>
              <button
                type="button"
                onClick={() => setLabTab('divSub')}
                className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                  labTab === 'divSub'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-700 hover:bg-white/70'
                }`}
              >
                {t.tab2Label}
              </button>
              <button
                type="button"
                onClick={() => setLabTab('fracOp')}
                className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                  labTab === 'fracOp'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-700 hover:bg-white/70'
                }`}
              >
                {t.tab3Label}
              </button>
            </div>
          </div>

          {labTab === 'mulAdd' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-6 items-center min-w-0">
              <div className="lg:col-span-5 space-y-5 min-w-0">
                <div>
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>{t.sliderALabel}</span>
                    <span className="text-emerald-700 font-black font-mono text-base">
                      α ＝ {safeA}
                    </span>
                  </div>
                  <CustomSlider
                    min={-6}
                    max={6}
                    step={1}
                    value={safeA}
                    onChange={(v) => setCoefA(v === 0 ? 1 : v)}
                    accentColor="emerald"
                    ariaLabel={t.sliderALabel}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>{t.sliderBLabel}</span>
                    <span className="text-amber-700 font-black font-mono text-base">
                      β ＝ {addB}
                    </span>
                  </div>
                  <CustomSlider
                    min={-12}
                    max={12}
                    step={1}
                    value={addB}
                    onChange={setAddB}
                    accentColor="amber"
                    ariaLabel={t.sliderBLabel}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>{t.sliderRhs1Label}</span>
                    <span className="text-indigo-700 font-black font-mono text-base">
                      γ ＝ {rhs1}
                    </span>
                  </div>
                  <CustomSlider
                    min={-25}
                    max={25}
                    step={1}
                    value={rhs1}
                    onChange={setRhs1}
                    accentColor="indigo"
                    ariaLabel={t.sliderRhs1Label}
                  />
                </div>
              </div>

              <div className="lg:col-span-7 min-w-0 space-y-4">
                <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-7 shadow-md space-y-4">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 border-b border-white/15 pb-2.5">
                    {t.stepByStepTitle}
                  </div>
                  <div className="font-mono text-base sm:text-xl font-black text-amber-300 break-words [overflow-wrap:anywhere]">
                    {safeA}x {fmtSignedOp(addB)} ＝ {rhs1}
                  </div>
                  <div className="font-mono text-sm sm:text-base text-indigo-100 space-y-1.5">
                    <div>
                      1) {safeA}x ＝ {rhs1} {fmtSignedOp(-addB)} ＝ {diff1}
                    </div>
                    <div className="inline-flex flex-wrap items-center gap-1.5 text-emerald-300 font-extrabold">
                      <span>2) x ＝</span>
                      <Frac num={diff1} den={safeA} small />
                      <span>＝</span>
                      {isExact1 ? (
                        <span>{exactVal1}</span>
                      ) : (
                        <Frac num={simpNum1} den={simpDen1} small />
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 p-3">
                  <svg
                    viewBox="0 0 460 88"
                    className="w-full h-auto max-w-full block select-none"
                    role="img"
                    aria-label={t.labSvgAria}
                  >
                    <rect x="12" y="18" width="136" height="48" rx="10" fill="#eef2ff" stroke="#4f46e5" strokeWidth="1.8" />
                    <text x="80" y="47" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#1e1b4b" fontFamily="monospace">
                      {safeA}x {fmtSignedOp(addB)} ＝ {rhs1}
                    </text>
                    <line x1="152" y1="42" x2="178" y2="42" stroke="#d97706" strokeWidth="2.4" />
                    <polygon points="178,37 186,42 178,47" fill="#d97706" />
                    <rect x="190" y="18" width="122" height="48" rx="10" fill="#fef3c7" stroke="#d97706" strokeWidth="1.8" />
                    <text x="251" y="47" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#78350f" fontFamily="monospace">
                      {safeA}x ＝ {diff1}
                    </text>
                    <line x1="316" y1="42" x2="342" y2="42" stroke="#059669" strokeWidth="2.4" />
                    <polygon points="342,37 350,42 342,47" fill="#059669" />
                    <rect x="354" y="18" width="94" height="48" rx="10" fill="#ecfdf5" stroke="#059669" strokeWidth="2" />
                    {isExact1 ? (
                      <text x="401" y="47" textAnchor="middle" fontSize="13.5" fontWeight="900" fill="#064e3b" fontFamily="monospace">
                        x ＝ {exactVal1}
                      </text>
                    ) : (
                      <g fontFamily="monospace" fontWeight="900" fill="#064e3b">
                        <text x="380" y="47" textAnchor="middle" fontSize="13">
                          x ＝
                        </text>
                        <text x="422" y="36" textAnchor="middle" fontSize="12">
                          {simpNum1}
                        </text>
                        <line x1="406" y1="42" x2="438" y2="42" stroke="#064e3b" strokeWidth="1.8" />
                        <text x="422" y="56" textAnchor="middle" fontSize="12">
                          {simpDen1}
                        </text>
                      </g>
                    )}
                  </svg>
                </div>
              </div>
            </div>
          )}

          {labTab === 'divSub' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-6 items-center min-w-0">
              <div className="lg:col-span-5 space-y-5 min-w-0">
                <div>
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>{t.sliderDLabel}</span>
                    <span className="text-emerald-700 font-black font-mono text-base">
                      δ ＝ {safeD}
                    </span>
                  </div>
                  <CustomSlider
                    min={-6}
                    max={6}
                    step={1}
                    value={safeD}
                    onChange={(v) => setDivD(v === 0 ? 1 : v)}
                    accentColor="emerald"
                    ariaLabel={t.sliderDLabel}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>{t.sliderGLabel}</span>
                    <span className="text-amber-700 font-black font-mono text-base">
                      γ ＝ {subG}
                    </span>
                  </div>
                  <CustomSlider
                    min={-10}
                    max={10}
                    step={1}
                    value={subG}
                    onChange={setSubG}
                    accentColor="amber"
                    ariaLabel={t.sliderGLabel}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>{t.sliderRhs2Label}</span>
                    <span className="text-indigo-700 font-black font-mono text-base">
                      κ ＝ {rhs2}
                    </span>
                  </div>
                  <CustomSlider
                    min={-15}
                    max={15}
                    step={1}
                    value={rhs2}
                    onChange={setRhs2}
                    accentColor="indigo"
                    ariaLabel={t.sliderRhs2Label}
                  />
                </div>
              </div>

              <div className="lg:col-span-7 min-w-0 space-y-4">
                <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-7 shadow-md space-y-4">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 border-b border-white/15 pb-2.5">
                    {t.stepByStepTitle}
                  </div>
                  <div className="font-mono text-base sm:text-xl font-black text-amber-300 break-words [overflow-wrap:anywhere]">
                    (x : {fmtParensIfNeg(safeD)}) {fmtSignedOp(-subG)} ＝ {rhs2}
                  </div>
                  <div className="font-mono text-sm sm:text-base text-indigo-100 space-y-1.5">
                    <div>
                      1) x : {fmtParensIfNeg(safeD)} ＝ {rhs2} {fmtSignedOp(subG)} ＝ {sum2}
                    </div>
                    <div className="text-emerald-300 font-extrabold">
                      2) x ＝ {sum2} · {fmtParensIfNeg(safeD)} ＝ {xSol2}
                    </div>
                  </div>
                </div>

                <div className="w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 p-3">
                  <svg
                    viewBox="0 0 460 88"
                    className="w-full h-auto max-w-full block select-none"
                    role="img"
                    aria-label={t.labSvgAria}
                  >
                    <rect x="12" y="18" width="144" height="48" rx="10" fill="#eef2ff" stroke="#4f46e5" strokeWidth="1.8" />
                    <text x="84" y="47" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1e1b4b" fontFamily="monospace">
                      (x:{fmtParensIfNeg(safeD)}){fmtSignedOp(-subG)}＝{rhs2}
                    </text>
                    <line x1="160" y1="42" x2="184" y2="42" stroke="#d97706" strokeWidth="2.4" />
                    <polygon points="184,37 192,42 184,47" fill="#d97706" />
                    <rect x="196" y="18" width="122" height="48" rx="10" fill="#fef3c7" stroke="#d97706" strokeWidth="1.8" />
                    <text x="257" y="47" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#78350f" fontFamily="monospace">
                      x:{fmtParensIfNeg(safeD)} ＝ {sum2}
                    </text>
                    <line x1="322" y1="42" x2="346" y2="42" stroke="#059669" strokeWidth="2.4" />
                    <polygon points="346,37 354,42 346,47" fill="#059669" />
                    <rect x="358" y="18" width="90" height="48" rx="10" fill="#ecfdf5" stroke="#059669" strokeWidth="2" />
                    <text x="403" y="47" textAnchor="middle" fontSize="13.5" fontWeight="900" fill="#064e3b" fontFamily="monospace">
                      x ＝ {xSol2}
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {labTab === 'fracOp' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-6 items-center min-w-0">
              <div className="lg:col-span-5 space-y-5 min-w-0">
                <div>
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>{t.sliderDLabel}</span>
                    <span className="text-emerald-700 font-black font-mono text-base">
                      δ ＝ {safeFracD}
                    </span>
                  </div>
                  <CustomSlider
                    min={-9}
                    max={9}
                    step={1}
                    value={safeFracD}
                    onChange={(v) => setFracD(v === 0 ? 1 : v)}
                    accentColor="emerald"
                    ariaLabel={t.sliderDLabel}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>{t.sliderRhs3Label}</span>
                    <span className="text-indigo-700 font-black font-mono text-base">
                      μ ＝ {rhs3}
                    </span>
                  </div>
                  <CustomSlider
                    min={-15}
                    max={15}
                    step={1}
                    value={rhs3}
                    onChange={setRhs3}
                    accentColor="indigo"
                    ariaLabel={t.sliderRhs3Label}
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs sm:text-sm text-sky-950 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {t.fracHint}
                </div>
              </div>

              <div className="lg:col-span-7 min-w-0 space-y-4">
                <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-7 shadow-md space-y-4">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 border-b border-white/15 pb-2.5">
                    {t.fracStepTitle}
                  </div>
                  <div className="font-mono text-base sm:text-xl font-black text-amber-300 flex flex-wrap items-center gap-1.5">
                    <span>x : {fmtParensIfNeg(safeFracD)} ＝ {rhs3}</span>
                    <span className="text-sky-300 inline-flex items-center gap-1">
                      <span>⇔</span>
                      <Frac num="x" den={safeFracD} small />
                      <span>＝ {rhs3}</span>
                    </span>
                  </div>
                  <div className="font-mono text-sm sm:text-base text-indigo-100 space-y-1.5">
                    <div>
                      1) {locale === 'en'
                        ? `Inverse of (: ${fmtParensIfNeg(safeFracD)}) is multiplying by ${fmtParensIfNeg(safeFracD)}:`
                        : `Αντίθετη πράξη του (: ${fmtParensIfNeg(safeFracD)}) είναι ο πολλαπλασιασμός με ${fmtParensIfNeg(safeFracD)}:`}
                    </div>
                    <div className="text-emerald-300 font-extrabold">
                      2) x ＝ {rhs3} · {fmtParensIfNeg(safeFracD)} ＝ {xSol3}
                    </div>
                  </div>
                </div>

                <div className="w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 p-3">
                  <svg
                    viewBox="0 0 460 88"
                    className="w-full h-auto max-w-full block select-none"
                    role="img"
                    aria-label={t.labSvgAria}
                  >
                    <rect x="12" y="18" width="132" height="48" rx="10" fill="#eef2ff" stroke="#4f46e5" strokeWidth="1.8" />
                    <g fontFamily="monospace" fontWeight="800" fill="#1e1b4b">
                      <text x="54" y="36" textAnchor="middle" fontSize="12">
                        x
                      </text>
                      <line x1="40" y1="42" x2="68" y2="42" stroke="#1e1b4b" strokeWidth="1.8" />
                      <text x="54" y="56" textAnchor="middle" fontSize="12">
                        {safeFracD}
                      </text>
                      <text x="102" y="47" textAnchor="middle" fontSize="13">
                        ＝ {rhs3}
                      </text>
                    </g>
                    <line x1="148" y1="42" x2="178" y2="42" stroke="#0284c7" strokeWidth="2.4" />
                    <polygon points="178,37 186,42 178,47" fill="#0284c7" />
                    <rect x="190" y="18" width="134" height="48" rx="10" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.8" />
                    <text x="257" y="47" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#0c4a6e" fontFamily="monospace">
                      x ＝ {rhs3} · {fmtParensIfNeg(safeFracD)}
                    </text>
                    <line x1="328" y1="42" x2="354" y2="42" stroke="#059669" strokeWidth="2.4" />
                    <polygon points="354,37 362,42 354,47" fill="#059669" />
                    <rect x="366" y="18" width="82" height="48" rx="10" fill="#ecfdf5" stroke="#059669" strokeWidth="2" />
                    <text x="407" y="47" textAnchor="middle" fontSize="13.5" fontWeight="900" fill="#064e3b" fontFamily="monospace">
                      x ＝ {xSol3}
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 4. 2 ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΕΦΑΡΜΟΓΗΣ */}
        <section className="space-y-8 mb-10 min-w-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
            {t.problemsHeading}
          </h2>

          {/* ΠΡΟΒΛΗΜΑ 1 */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-extrabold mb-3">
              <span>{toCleanUppercase(t.prob1Badge)}</span>
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-5 leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.prob1Title}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start min-w-0">
              <div className="md:col-span-5 min-w-0">
                <div className="w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 p-3">
                  <svg
                    viewBox="0 0 360 130"
                    className="w-full h-auto max-w-full block select-none"
                    role="img"
                    aria-label={t.prob1SvgAria}
                  >
                    <rect x="20" y="20" width="210" height="36" rx="8" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2" />
                    <text x="125" y="43" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1e1b4b" fontFamily="monospace">
                      3 · x
                    </text>
                    <rect x="230" y="20" width="110" height="36" rx="8" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
                    <text x="285" y="43" textAnchor="middle" fontSize="13" fontWeight="800" fill="#78350f" fontFamily="monospace">
                      ＋ 4 €
                    </text>
                    <rect x="20" y="66" width="320" height="36" rx="8" fill="#ecfdf5" stroke="#059669" strokeWidth="2" />
                    <text x="180" y="89" textAnchor="middle" fontSize="13.5" fontWeight="900" fill="#064e3b" fontFamily="monospace">
                      {t.prob1SvgTotal}
                    </text>
                  </svg>
                </div>
              </div>

              <div className="md:col-span-7 min-w-0 space-y-4">
                <div className="hidden sm:block overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full table-fixed text-sm text-left">
                    <thead className="bg-slate-100 text-slate-800 font-extrabold">
                      <tr>
                        <th className="w-1/3 px-4 py-3 break-words [overflow-wrap:anywhere]">{t.colStep}</th>
                        <th className="w-2/3 px-4 py-3 break-words [overflow-wrap:anywhere]">{t.colAnalysis}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono">
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800 break-words [overflow-wrap:anywhere]">
                          {t.prob1Step1Title}
                        </td>
                        <td className="px-4 py-3 break-words [overflow-wrap:anywhere]">3x ＋ 4 ＝ 19</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800 break-words [overflow-wrap:anywhere]">
                          {t.prob1Step2Title}
                        </td>
                        <td className="px-4 py-3 break-words [overflow-wrap:anywhere]">3x ＝ 19 － 4 ＝ 15</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800 break-words [overflow-wrap:anywhere]">
                          {t.prob1Step3Title}
                        </td>
                        <td className="px-4 py-3 break-words [overflow-wrap:anywhere]">
                          <span className="inline-flex flex-wrap items-center gap-1.5">
                            <span>x ＝</span>
                            <Frac num="15" den="3" small />
                            <span>＝ 5</span>
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800 break-words [overflow-wrap:anywhere]">
                          {t.prob1Step4Title}
                        </td>
                        <td className="px-4 py-3 break-words [overflow-wrap:anywhere]">3 · 5 ＋ 4 ＝ 15 ＋ 4 ＝ 19</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="sm:hidden space-y-2.5 text-sm">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-indigo-800 mb-1">{t.prob1Step1Title}</div>
                    <div className="font-mono">3x ＋ 4 ＝ 19</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-indigo-800 mb-1">{t.prob1Step2Title}</div>
                    <div className="font-mono">3x ＝ 19 － 4 ＝ 15</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-indigo-800 mb-1">{t.prob1Step3Title}</div>
                    <div className="font-mono inline-flex flex-wrap items-center gap-1.5">
                      <span>x ＝</span>
                      <Frac num="15" den="3" small />
                      <span>＝ 5</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-sm sm:text-base break-words [overflow-wrap:anywhere]">
                  {t.prob1Final}
                </div>
              </div>
            </div>
          </div>

          {/* ΠΡΟΒΛΗΜΑ 2 */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold mb-3">
              <span>{toCleanUppercase(t.prob2Badge)}</span>
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-5 leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.prob2Title}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start min-w-0">
              <div className="md:col-span-5 min-w-0">
                <div className="w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 p-3">
                  <svg
                    viewBox="0 0 360 130"
                    className="w-full h-auto max-w-full block select-none"
                    role="img"
                    aria-label={t.prob2SvgAria}
                  >
                    <rect x="20" y="20" width="210" height="36" rx="8" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
                    <text x="125" y="43" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0c4a6e" fontFamily="monospace">
                      x : 6
                    </text>
                    <rect x="230" y="20" width="110" height="36" rx="8" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
                    <text x="285" y="43" textAnchor="middle" fontSize="13" fontWeight="800" fill="#7f1d1d" fontFamily="monospace">
                      － 3 L
                    </text>
                    <rect x="20" y="66" width="320" height="36" rx="8" fill="#ecfdf5" stroke="#059669" strokeWidth="2" />
                    <text x="180" y="89" textAnchor="middle" fontSize="13.5" fontWeight="900" fill="#064e3b" fontFamily="monospace">
                      {t.prob2SvgRem}
                    </text>
                  </svg>
                </div>
              </div>

              <div className="md:col-span-7 min-w-0 space-y-4">
                <div className="hidden sm:block overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full table-fixed text-sm text-left">
                    <thead className="bg-slate-100 text-slate-800 font-extrabold">
                      <tr>
                        <th className="w-1/3 px-4 py-3 break-words [overflow-wrap:anywhere]">{t.colStep}</th>
                        <th className="w-2/3 px-4 py-3 break-words [overflow-wrap:anywhere]">{t.colAnalysis}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono">
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800 break-words [overflow-wrap:anywhere]">
                          {t.prob2Step1Title}
                        </td>
                        <td className="px-4 py-3 break-words [overflow-wrap:anywhere]">(x : 6) － 3 ＝ 7</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800 break-words [overflow-wrap:anywhere]">
                          {t.prob2Step2Title}
                        </td>
                        <td className="px-4 py-3 break-words [overflow-wrap:anywhere]">x : 6 ＝ 7 ＋ 3 ＝ 10</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800 break-words [overflow-wrap:anywhere]">
                          {t.prob2Step3Title}
                        </td>
                        <td className="px-4 py-3 break-words [overflow-wrap:anywhere]">x ＝ 10 · 6 ＝ 60</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800 break-words [overflow-wrap:anywhere]">
                          {t.prob2Step4Title}
                        </td>
                        <td className="px-4 py-3 break-words [overflow-wrap:anywhere]">(60 : 6) － 3 ＝ 10 － 3 ＝ 7</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="sm:hidden space-y-2.5 text-sm">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-amber-800 mb-1">{t.prob2Step1Title}</div>
                    <div className="font-mono">(x : 6) － 3 ＝ 7</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-amber-800 mb-1">{t.prob2Step2Title}</div>
                    <div className="font-mono">x : 6 ＝ 7 ＋ 3 ＝ 10</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-amber-800 mb-1">{t.prob2Step3Title}</div>
                    <div className="font-mono">x ＝ 10 · 6 ＝ 60</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-sm sm:text-base break-words [overflow-wrap:anywhere]">
                  {t.prob2Final}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. YELLOW ALERT BOX */}
        <section className="rounded-3xl bg-amber-50 border-2 border-amber-300 p-5 sm:p-8 mb-10 shadow-sm min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-2xl bg-amber-500 text-white font-black flex items-center justify-center text-xl shrink-0">
              !
            </span>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-amber-950 break-words [overflow-wrap:anywhere]">
              {t.alertTitle}
            </h2>
          </div>

          <ul className="space-y-3 text-sm sm:text-base text-amber-950">
            <li className="flex items-start gap-2.5">
              <span className="font-black text-amber-600 mt-0.5">✕</span>
              <div className="break-words [overflow-wrap:anywhere]">
                <strong>{t.err1Bold}</strong> {t.err1Text}{' '}
                <span className="inline-flex flex-wrap items-center gap-1.5 font-mono font-bold text-emerald-800">
                  <span>x ＝</span>
                  <Frac num="2" den="4" small />
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    ＝ <Frac num="1" den="2" small />
                  </span>
                </span>
                .
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="font-black text-amber-600 mt-0.5">✕</span>
              <div className="break-words [overflow-wrap:anywhere]">
                <strong>{t.err2Bold}</strong> {t.err2Text}
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="font-black text-amber-600 mt-0.5">✕</span>
              <div className="break-words [overflow-wrap:anywhere]">
                <strong>{t.err3Bold}</strong> {t.err3Text}
              </div>
            </li>
          </ul>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER */}
        <section className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 lg:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 min-w-0">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-2 break-words [overflow-wrap:anywhere]">
              {t.bottomTitle}
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base break-words [overflow-wrap:anywhere]">
              {t.bottomDesc}
            </p>
          </div>

          <Link
            href="/b-gymnasiou/11-eksisosi-ask"
            locale={locale}
            className="shrink-0 inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-black text-sm sm:text-base shadow-md transition-all"
          >
            <span>{toCleanUppercase(t.bottomBtn)}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
    </Layout>
  );
}