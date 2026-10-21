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

// ============================================================================
// ΜΑΘΗΜΑΤΙΚΕΣ ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ (ΜΚΔ, ΕΚΠ & ΑΝΑΛΥΤΗΣ ΕΞΙΣΩΣΕΩΝ)
// ============================================================================
const gcd = (a, b) => {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    let t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
};

const lcm = (a, b) => {
  if (a === 0 || b === 0) return 1;
  return Math.abs(Math.round((a * b) / gcd(a, b)));
};

const lcmArray = (arr) => arr.reduce((acc, val) => lcm(acc, val), 1);

/**
 * Αναλύει και επιλύει βήμα-βήμα γραμμικές εξισώσεις 1ου βαθμού με:
 * - Πολλαπλά x και στα δύο μέλη
 * - Παρενθέσεις π.χ. 2(x+3) ή -3(2x-1)
 * - Κλάσματα π.χ. x/2 + (2x-1)/3 = 5
 */
function solveLinearEquationStepByStep(rawInput) {
  if (!rawInput || !rawInput.trim()) {
    return { error: 'Πληκτρολόγησε μια εξίσωση για να ξεκινήσει η επίλυση.' };
  }

  // Κανονικοποίηση εισόδου
  let str = rawInput
    .trim()
    .replace(/\s+/g, '')
    .replace(/χ/gi, 'x')
    .replace(/Χ/g, 'x')
    .replace(/X/g, 'x')
    .replace(/·/g, '*')
    .replace(/−/g, '-')
    .replace(/－/g, '-')
    .replace(/＋/g, '+')
    .replace(/＝/g, '=')
    .replace(/,/g, '.');

  // 1. Έλεγχος χαρακτήρων
  if (/[^0-9x+\-*/().=]/.test(str)) {
    return { error: 'Η εξίσωση περιέχει μη έγκυρους χαρακτήρες. Χρησιμοποίησε αριθμούς, το x, +, -, *, /, ( ) και =.' };
  }

  // 2. Έλεγχος συμβόλου '='
  const eqParts = str.split('=');
  if (eqParts.length !== 2 || !eqParts[0] || !eqParts[1]) {
    return { error: 'Η εξίσωση πρέπει να περιέχει ακριβώς ένα σύμβολο «=» με παραστάσεις και στα δύο μέλη.' };
  }

  // 3. Έλεγχος ύπαρξης αγνώστου x
  if (!str.includes('x')) {
    return { error: 'Η εξίσωση πρέπει να περιέχει τον άγνωστο «x».' };
  }

  // 4. Έλεγχος ισορροπίας παρενθέσεων
  let openCount = 0;
  for (const ch of str) {
    if (ch === '(') openCount++;
    if (ch === ')') openCount--;
    if (openCount < 0) return { error: 'Λάθος στις παρενθέσεις: έκλεισε παρένθεση χωρίς να έχει ανοίξει.' };
  }
  if (openCount !== 0) {
    return { error: 'Ανοιχτή παρένθεση: βεβαιώσου ότι όλες οι παρενθέσεις κλείνουν σωστά.' };
  }

  // 5. Έλεγχος διαίρεσης με το 0
  if (/\/0(?![0-9.])/.test(str)) {
    return { error: 'Δεν επιτρέπεται η διαίρεση με το μηδέν (παρονομαστής 0).' };
  }

  // Βοηθητικός Parser ενός μέλους σε λίστα όρων: { coeffX, constVal, den, raw }
  // Υποστηρίζει όρους της μορφής: a*x, c, (ax+b)/d, k*(ax+b), k*(ax+b)/d
  const parseSide = (sideStr) => {
    let s = sideStr.replace(/^\+/, '');
    let hasParens = s.includes('(');

    // Επέκταση απλών παρενθέσεων k*(ax+b) ή (ax+b)*k ή -(ax+b)
    // Για ασφαλή αλγεβρική ανάλυση, μετατρέπουμε κάθε μέλος σε άθροισμα κλασματικών ή ακεραίων όρων
    // Χωρίζουμε σε top-level + και - (εκτός παρενθέσεων)
    const tokens = [];
    let current = '';
    let depth = 0;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === '(') depth++;
      if (c === ')') depth--;
      if ((c === '+' || c === '-') && depth === 0 && i > 0) {
        tokens.push(current);
        current = c;
      } else {
        current += c;
      }
    }
    if (current) tokens.push(current);

    let denominators = [];
    let expandedTerms = []; // Κάθε στοιχείο: { xNum, cNum, den }

    for (let tok of tokens) {
      let sign = 1;
      if (tok.startsWith('+')) tok = tok.slice(1);
      else if (tok.startsWith('-')) {
        sign = -1;
        tok = tok.slice(1);
      }
      if (!tok) return { error: 'Ελλιπής όρος στην εξίσωση.' };

      // Έλεγχος αν υπάρχει παρονομαστής στο top-level του όρου
      let slashIdx = -1;
      let d = 0;
      for (let i = 0; i < tok.length; i++) {
        if (tok[i] === '(') d++;
        if (tok[i] === ')') d--;
        if (tok[i] === '/' && d === 0) {
          if (slashIdx !== -1) return { error: 'Απόφυγε τα διαδοχικά σύμβολα «/» στον ίδιο όρο.' };
          slashIdx = i;
        }
      }

      let numPart = tok;
      let denVal = 1;
      if (slashIdx !== -1) {
        numPart = tok.slice(0, slashIdx);
        const denStr = tok.slice(slashIdx + 1).replace(/^\((.*)\)$/, '$1');
        denVal = Number(denStr);
        if (!Number.isFinite(denVal) || denVal === 0 || denStr.includes('x')) {
          return { error: 'Ο παρονομαστής πρέπει να είναι μη μηδενικός αριθμός (όχι μεταβλητή x).' };
        }
        if (!Number.isInteger(denVal)) {
          return { error: 'Χρησιμοποίησε ακέραιους παρονομαστές στα κλάσματα.' };
        }
        if (denVal < 0) {
          sign = -sign;
          denVal = -denVal;
        }
      }
      denominators.push(denVal);

      // Ανάλυση του αριθμητή numPart (μπορεί να είναι: ax, c, (ax+b), k(ax+b), k*(ax+b))
      let mult = 1;
      let inner = numPart;

      const parenMatch = numPart.match(/^([0-9.]*)\*?\(([^()]+)\)$/);
      const bareParenMatch = numPart.match(/^\(([^()]+)\)$/);

      if (parenMatch) {
        mult = parenMatch[1] === '' ? 1 : Number(parenMatch[1]);
        inner = parenMatch[2];
      } else if (bareParenMatch) {
        mult = 1;
        inner = bareParenMatch[1];
      }

      if (!Number.isFinite(mult)) return { error: 'Μη έγκυρος συντελεστής μπροστά από παρένθεση.' };

      // Τώρα το inner είναι γραμμικό άθροισμα χωρίς παρενθέσεις π.χ. 2x-3
      let innerNorm = inner.replace(/^\+/, '');
      const subTokens = [];
      let curSub = '';
      for (let i = 0; i < innerNorm.length; i++) {
        const ch = innerNorm[i];
        if ((ch === '+' || ch === '-') && i > 0) {
          subTokens.push(curSub);
          curSub = ch;
        } else {
          curSub += ch;
        }
      }
      if (curSub) subTokens.push(curSub);

      for (let st of subTokens) {
        let subSign = 1;
        if (st.startsWith('+')) st = st.slice(1);
        else if (st.startsWith('-')) {
          subSign = -1;
          st = st.slice(1);
        }
        st = st.replace(/\*/g, '');
        if (!st) return { error: 'Συντακτικό λάθος μέσα στην παρένθεση.' };

        if (st.includes('x')) {
          if (st.indexOf('x') !== st.lastIndexOf('x')) {
            return { error: 'Η εξίσωση πρέπει να είναι 1ου βαθμού (όχι x·x ή x²).' };
          }
          const cStr = st.replace('x', '');
          const cVal = cStr === '' ? 1 : Number(cStr);
          if (!Number.isFinite(cVal)) return { error: `Μη έγκυρος όρος «${st}».` };
          expandedTerms.push({
            isX: true,
            coeff: sign * subSign * mult * cVal,
            den: denVal,
          });
        } else {
          const val = Number(st);
          if (!Number.isFinite(val)) return { error: `Μη έγκυρος αριθμός «${st}».` };
          expandedTerms.push({
            isX: false,
            coeff: sign * subSign * mult * val,
            den: denVal,
          });
        }
      }
    }

    return { expandedTerms, denominators, hasParens };
  };

  const leftParsed = parseSide(eqParts[0]);
  if (leftParsed.error) return { error: leftParsed.error };

  const rightParsed = parseSide(eqParts[1]);
  if (rightParsed.error) return { error: rightParsed.error };

  const allDenominators = [...leftParsed.denominators, ...rightParsed.denominators];
  const hasFractions = allDenominators.some((d) => d > 1);
  const commonLCM = hasFractions ? lcmArray(allDenominators) : 1;
  const hasParensOverall = leftParsed.hasParens || rightParsed.hasParens;

  // Πολλαπλασιασμός όλων των όρων με το Ε.Κ.Π. (commonLCM) ώστε να έχουμε ακέραιους/καθαρούς όρους
  const scaleTerm = (t) => {
    const factor = commonLCM / t.den;
    return {
      isX: t.isX,
      val: Math.round(t.coeff * factor * 1000) / 1000,
    };
  };

  const leftScaled = leftParsed.expandedTerms.map(scaleTerm);
  const rightScaled = rightParsed.expandedTerms.map(scaleTerm);

  // Βοηθητική μορφοποίηση λίστας όρων σε string
  const formatTermsList = (terms) => {
    if (terms.length === 0) return '0';
    return terms
      .map((t, idx) => {
        const v = t.val;
        const absV = Math.abs(v);
        const signStr = v < 0 ? (idx === 0 ? '－' : ' － ') : idx === 0 ? '' : ' ＋ ';
        if (t.isX) {
          const coeffPart = absV === 1 ? 'x' : `${absV}x`;
          return `${signStr}${coeffPart}`;
        } else {
          return `${signStr}${absV}`;
        }
      })
      .join('');
  };

  const steps = [];

  // ΒΗΜΑ 1: Αρχική Εξίσωση
  steps.push({
    title: 'ΑΡΧΙΚΗ ΕΞΙΣΩΣΗ',
    desc: 'Καταγράφουμε την εξίσωση που θέλουμε να επιλύσουμε:',
    math: `${eqParts[0]} ＝ ${eqParts[1]}`,
  });

  // ΒΗΜΑ 2 (Προαιρετικό): Απαλοιφή Παρονομαστών ή Παρενθέσεων
  if (hasFractions) {
    steps.push({
      title: `ΑΠΑΛΟΙΦΗ ΠΑΡΟΝΟΜΑΣΤΩΝ (Ε.Κ.Π. ＝ ${commonLCM})`,
      desc: `Πολλαπλασιάζουμε όλους τους όρους και των δύο μελών με το Ε.Κ.Π. των παρονομαστών (${commonLCM}) και εκτελούμε τις επιμεριστικές πράξεις:`,
      math: `${formatTermsList(leftScaled)} ＝ ${formatTermsList(rightScaled)}`,
    });
  } else if (hasParensOverall) {
    steps.push({
      title: 'ΑΠΑΛΟΙΦΗ ΠΑΡΕΝΘΕΣΕΩΝ (ΕΠΙΜΕΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ)',
      desc: 'Εφαρμόζουμε την επιμεριστική ιδιότητα για να ανοίξουμε τις παρενθέσεις:',
      math: `${formatTermsList(leftScaled)} ＝ ${formatTermsList(rightScaled)}`,
    });
  }

  // ΒΗΜΑ 3: Χωρισμός Γνωστών από Αγνώστους
  // Όλοι οι όροι με x πηγαίνουν στο 1ο μέλος, όλοι οι σταθεροί στο 2ο μέλος
  const xTermsOnLeft = [
    ...leftScaled.filter((t) => t.isX),
    ...rightScaled.filter((t) => t.isX).map((t) => ({ isX: true, val: -t.val })),
  ];

  const constTermsOnRight = [
    ...rightScaled.filter((t) => !t.isX),
    ...leftScaled.filter((t) => !t.isX).map((t) => ({ isX: false, val: -t.val })),
  ];

  steps.push({
    title: 'ΧΩΡΙΣΜΟΣ ΓΝΩΣΤΩΝ ΑΠΟ ΑΓΝΩΣΤΟΥΣ',
    desc: 'Μεταφέρουμε τους όρους με τον άγνωστο x στο 1ο μέλος και τους σταθερούς αριθμούς στο 2ο μέλος (αλλάζοντας το πρόσημο όσων όρων μετακινούνται):',
    math: `${formatTermsList(xTermsOnLeft.length ? xTermsOnLeft : [{ isX: true, val: 0 }])} ＝ ${formatTermsList(
      constTermsOnRight.length ? constTermsOnRight : [{ isX: false, val: 0 }]
    )}`,
  });

  // ΒΗΜΑ 4: Αναγωγή Ομοίων Όρων
  const totalX = Math.round(xTermsOnLeft.reduce((acc, t) => acc + t.val, 0) * 1000) / 1000;
  const totalConst = Math.round(constTermsOnRight.reduce((acc, t) => acc + t.val, 0) * 1000) / 1000;

  steps.push({
    title: 'ΑΝΑΓΩΓΗ ΟΜΟΙΩΝ ΟΡΩΝ',
    desc: 'Προσθέτουμε τους ομοίους όρους με x στο 1ο μέλος και τους αριθμούς στο 2ο μέλος:',
    math: `${totalX === 1 ? 'x' : totalX === -1 ? '－x' : `${totalX} · x`} ＝ ${totalConst}`,
  });

  // ΒΗΜΑ 5: Διερεύνηση / Διαίρεση με τον συντελεστή σε ΜΟΡΦΗ ΚΛΑΣΜΑΤΟΣ
  if (totalX === 0) {
    if (totalConst === 0) {
      steps.push({
        title: ' ΤΑΥΤΟΤΗΤΑ (ΑΟΡΙΣΤΗ ΕΞΙΣΩΣΗ)',
        desc: 'Ο συντελεστής του x είναι 0 και το 2ο μέλος είναι 0. Η ισότητα 0 · x ＝ 0 αληθεύει για κάθε αριθμό x!',
        math: 'Άπειρες Λύσεις (Ταυτότητα)',
        isSpecial: true,
        status: 'identity',
      });
    } else {
      steps.push({
        title: 'ΑΔΥΝΑΤΗ ΕΞΙΣΩΣΗ',
        desc: `Ο συντελεστής του x είναι 0, αλλά το 2ο μέλος είναι ${totalConst} ≠ 0. Κανένας αριθμός πολλαπλασιαζόμενος με το 0 δεν δίνει ${totalConst}.`,
        math: 'Καμία Λύση (Αδύνατη)',
        isSpecial: true,
        status: 'impossible',
      });
    }
  } else {
    // Κανονική λύση x = totalConst / totalX
    const isNegativeResult = (totalConst < 0 && totalX > 0) || (totalConst > 0 && totalX < 0);
    const absNum = Math.abs(totalConst);
    const absDen = Math.abs(totalX);

    // Έλεγχος αν είναι ακέραιοι για απλοποίηση κλάσματος
    let simplifiedNum = absNum;
    let simplifiedDen = absDen;
    if (Number.isInteger(absNum) && Number.isInteger(absDen)) {
      const commonDiv = gcd(absNum, absDen);
      simplifiedNum = absNum / commonDiv;
      simplifiedDen = absDen / commonDiv;
    }

    const isExactInteger = simplifiedDen === 1 || totalConst === 0;
    const finalIntValue = totalConst === 0 ? 0 : isNegativeResult ? -simplifiedNum : simplifiedNum;

    steps.push({
      title: 'ΔΙΑΙΡΕΣΗ ΜΕ ΤΟΝ ΣΥΝΤΕΛΕΣΤΗ ΤΟΥ ΑΓΝΩΣΤΟΥ',
      desc: `Διαιρούμε και τα δύο μέλη με τον συντελεστή του αγνώστου (${totalX}) γράφοντας το πηλίκο σε μορφή κλάσματος:`,
      fractionData: {
        rawNum: totalConst,
        rawDen: totalX,
        isNeg: totalConst !== 0 && isNegativeResult,
        simplifiedNum,
        simplifiedDen,
        isExactInteger,
        finalIntValue,
      },
      status: 'solved',
    });
  }

  return { steps };
}

export default function LiseisEksisoseonTheoria() {
  // State για Εργαστήριο 1: Custom Αναλυτής Εξισώσεων
  const [equationInput, setEquationInput] = useState('2(x + 3) + x = 21');
  const [visibleStepsCount, setVisibleStepsCount] = useState(99); // Προεπιλογή: εμφάνιση όλων ή βήμα-βήμα

  // State για Εργαστήριο 2: Προσομοιωτής αx + β = γ
  const [simA, setSimA] = useState(4);
  const [simB, setSimB] = useState(-5);
  const [simC, setSimC] = useState(15);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Αποτέλεσμα επίλυσης Εργαστηρίου 1
  const solverResult = useMemo(() => solveLinearEquationStepByStep(equationInput), [equationInput]);

  // Προεπιλεγμένα παραδείγματα για γρήγορη δοκιμή
  const presetEquations = [
    { label: 'ΑΠΛΗ (αx＋β＝γ)', eq: '3x - 4 = 11' },
    { label: 'ΠΟΛΛΑ x', eq: '5x - 3 + 2x = 4x + 9' },
    { label: 'ΜΕ ΠΑΡΕΝΘΕΣΕΙΣ', eq: '2(x + 3) - 4 = 10' },
    { label: 'ΜΕ ΚΛΑΣΜΑΤΑ', eq: 'x/2 + x/3 = 5' },
    { label: 'ΣΥΝΘΕΤΟ ΚΛΑΣΜΑ', eq: '(2x + 1)/3 - x/2 = 1' },
    { label: 'ΑΔΥΝΑΤΗ', eq: '2(x + 1) = 2x + 5' },
  ];

  const loadPreset = (eqStr) => {
    setEquationInput(eqStr);
    setVisibleStepsCount(1); // Ξεκινά από το 1ο βήμα για διαδραστική αποκάλυψη!
  };

  // Υπολογισμοί Εργαστηρίου 2
  const simRightAfterMove = useMemo(() => simC - simB, [simC, simB]);
  const simGcd = useMemo(() => gcd(simRightAfterMove, simA), [simRightAfterMove, simA]);
  const simSimpNum = useMemo(() => Math.abs(simRightAfterMove) / simGcd, [simRightAfterMove, simGcd]);
  const simSimpDen = useMemo(() => Math.abs(simA) / simGcd, [simA, simGcd]);
  const simIsNeg = useMemo(
    () => (simRightAfterMove < 0 && simA > 0) || (simRightAfterMove > 0 && simA < 0),
    [simRightAfterMove, simA]
  );

  return (
    <Layout
      title="Επίλυση Εξισώσεων αx + β = γ | Α' Γυμνασίου"
      description="Αναλυτική θεωρία και αυτόματος διαδραστικός επιλυτής εξισώσεων βήμα-βήμα (με κλάσματα, παρενθέσεις και πολλαπλά x) για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/33-liseis-eksisoseon-ask"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 31 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Επίλυση Εξισώσεων της Μορφής α·x ＋ β ＝ γ
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μαθαίνουμε τη γενική μέθοδο επίλυσης εξισώσεων 1ου βαθμού, πώς απαλείφουμε παρενθέσεις και κλάσματα, και πώς χρησιμοποιούμε εξισώσεις για να λύσουμε ρεαλιστικά προβλήματα.
            </p>
          </div>
        </section>

        {/* 1. ΜΕΘΟΔΟΛΟΓΙΑ ΕΠΙΛΥΣΗΣ αx + β = γ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Πώς Λύνουμε την Εξίσωση α·x ＋ β ＝ γ
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Βήμα 1 */}
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded inline-block">
                  ΒΗΜΑ 1
                </span>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  Χωρισμός Γνωστών από Αγνώστους
                </h3>
                <p className="text-slate-600">
                  Μεταφέρουμε τους όρους που έχουν τον άγνωστο <strong>x</strong> στο 1ο μέλος (αριστερά) και τους σταθερούς αριθμούς στο 2ο μέλος (δεξιά), <strong>αλλάζοντας το πρόσημο</strong> κάθε όρου που αλλάζει μέλος:
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100 font-mono text-center font-bold text-indigo-950 text-sm">
                α · x ＝ γ － β
              </div>
            </div>

            {/* Βήμα 2 */}
            <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded inline-block">
                  ΒΗΜΑ 2
                </span>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  Αναγωγή Ομοίων Όρων
                </h3>
                <p className="text-slate-600">
                  Εκτελούμε τις πράξεις σε κάθε μέλος ξεχωριστά (προσθέτουμε ή αφαιρούμε τους συντελεστές του x στο 1ο μέλος και τους αριθμούς στο 2ο μέλος), ώστε η εξίσωση να πάρει την απλή μορφή:
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-sky-100 font-mono text-center font-bold text-sky-950 text-sm">
                Α · x ＝ Β
              </div>
            </div>

            {/* Βήμα 3 */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded inline-block">
                  ΒΗΜΑ 3
                </span>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  Διαίρεση σε Μορφή Κλάσματος
                </h3>
                <p className="text-slate-600">
                  Αν ο συντελεστής Α ≠ 0, διαιρούμε και τα δύο μέλη με το Α. Γράφουμε τη λύση <strong>πάντα σε μορφή κλάσματος</strong> και απλοποιούμε:
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-amber-100 font-mono text-center font-bold text-amber-950 text-sm flex items-center justify-center">
                <span>x ＝ </span>
                <Frac num="Β" den="Α" />
              </div>
            </div>
          </div>

          {/* Ειδικές Περιπτώσεις & Σύνθετες Εξισώσεις */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs sm:text-sm">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-base">
                Τι κάνουμε αν υπάρχουν Παρενθέσεις ή Κλάσματα;
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-slate-600">
                <li>
                  <strong>Παρενθέσεις:</strong> Εφαρμόζουμε πρώτα την επιμεριστική ιδιότητα α·(β ＋ γ) ＝ α·β ＋ α·γ.
                </li>
                <li>
                  <strong>Κλάσματα:</strong> Βρίσκουμε το <strong>Ε.Κ.Π.</strong> όλων των παρονομαστών και πολλαπλασιάζουμε <em>όλους</em> τους όρους της εξίσωσης με αυτό, ώστε να φύγουν οι παρονομαστές.
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
              <div className="font-bold text-rose-950 text-base">
                Ειδικές Περιπτώσεις (Όταν ο συντελεστής του x μηδενίζεται)
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                <li>
                  <strong>0 · x ＝ 0 (Ταυτότητα / Αόριστη):</strong> Επαληθεύεται για <strong>κάθε αριθμό x</strong> (έχει άπειρες λύσεις).
                </li>
                <li>
                  <strong>0 · x ＝ Β (όπου Β ≠ 0, Αδύνατη):</strong> Δεν επαληθεύεται για <strong>κανέναν αριθμό x</strong> (δεν έχει λύση).
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. ΕΡΓΑΣΤΗΡΙΟ 1: ΑΥΤΟΜΑΤΟΣ ΕΠΙΛΥΤΗΣ ΕΞΙΣΩΣΕΩΝ ΒΗΜΑ-ΒΗΜΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              🛠️ Εργαστήριο 1: Αυτόματος Επιλυτής Εξισώσεων Βήμα-Βήμα
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 self-start sm:self-auto">
              ΥΠΟΣΤΗΡΙΞΗ ΚΛΑΣΜΑΤΩΝ & ΠΑΡΕΝΘΕΣΕΩΝ
            </span>
          </div>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Γράψε οποιαδήποτε εξίσωση 1ου βαθμού στο παρακάτω πλαίσιο (π.χ. <code>3x - 5 = x + 7</code>, <code>2(x + 3) = 14</code>, ή με κλάσματα <code>x/2 + x/3 = 5</code>) ή επίλεξε ένα από τα έτοιμα παραδείγματα. Μπορείς να βλέπεις τα βήματα ένα-ένα!
          </p>

          {/* Έτοιμα Κουμπιά Παραδειγμάτων */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ ΠΡΟΣ ΔΟΚΙΜΗ:
            </div>
            <div className="flex flex-wrap gap-2">
              {presetEquations.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => loadPreset(p.eq)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition active:scale-95 border ${
                    equationInput === p.eq
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p.label}: <span className="font-mono ml-1">{p.eq}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Πεδίο Εισαγωγής Εξίσωσης & Κουμπιά Ελέγχου Βημάτων */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
            <div className="lg:col-span-7 space-y-1">
              <label className="text-[11px] font-bold text-indigo-900 uppercase block">
                ΠΛΗΚΤΡΟΛΟΓΗΣΕ ΤΗΝ ΕΞΙΣΩΣΗ ΣΟΥ:
              </label>
              <input
                type="text"
                value={equationInput}
                onChange={(e) => {
                  setEquationInput(e.target.value);
                  setVisibleStepsCount(99);
                }}
                placeholder="π.χ. 2(x + 3) + x = 21 ή x/2 + x/3 = 5"
                className="w-full h-12 px-4 rounded-xl bg-white border-2 border-indigo-200 focus:border-indigo-600 outline-none font-mono font-bold text-base sm:text-lg text-slate-900 shadow-sm"
              />
            </div>

            <div className="lg:col-span-5 flex flex-wrap items-center gap-2 pt-2 lg:pt-5">
              <button
                type="button"
                onClick={() => setVisibleStepsCount(1)}
                disabled={!!solverResult.error}
                className="px-3.5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 disabled:opacity-40 text-slate-800 font-bold text-xs transition active:scale-95"
              >
                ⏮️ ΑΠΟ ΤΗΝ ΑΡΧΗ (ΒΗΜΑ 1)
              </button>
              <button
                type="button"
                onClick={() =>
                  setVisibleStepsCount((prev) =>
                    solverResult.steps ? Math.min(solverResult.steps.length, prev + 1) : prev
                  )
                }
                disabled={
                  !!solverResult.error ||
                  (solverResult.steps && visibleStepsCount >= solverResult.steps.length)
                }
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs transition active:scale-95 shadow-sm"
              >
                ▶️ ΕΠΟΜΕΝΟ ΒΗΜΑ
              </button>
              <button
                type="button"
                onClick={() => setVisibleStepsCount(99)}
                disabled={
                  !!solverResult.error ||
                  (solverResult.steps && visibleStepsCount >= solverResult.steps.length)
                }
                className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition active:scale-95 shadow-sm"
              >
                ⏭️ ΟΛΑ ΤΑ ΒΗΜΑΤΑ
              </button>
            </div>
          </div>

          {/* Προβολή Βημάτων ή Μηνύματος Ελέγχου */}
          {solverResult.error ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm font-semibold flex items-center gap-3">
              <span className="text-lg">⚠️</span>
              <span>{solverResult.error}</span>
            </div>
          ) : (
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  ΑΝΑΛΥΤΙΚΗ ΠΟΡΕΙΑ ΕΠΙΛΥΣΗΣ ({Math.min(visibleStepsCount, solverResult.steps.length)} /{' '}
                  {solverResult.steps.length} ΒΗΜΑΤΑ)
                </span>
              </div>

              <div className="space-y-3">
                {solverResult.steps.slice(0, visibleStepsCount).map((st, sIdx) => (
                  <div
                    key={sIdx}
                    className={`p-4 rounded-xl border transition-all ${
                      st.status === 'solved' || st.status === 'identity'
                        ? 'bg-emerald-500/15 border-emerald-400/40'
                        : st.status === 'impossible'
                        ? 'bg-rose-500/15 border-rose-400/40'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-500/30 text-indigo-200">
                        ΒΗΜΑ {sIdx + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-amber-300">
                        {st.title}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mb-2">{st.desc}</p>

                    {/* Αν είναι το τελικό βήμα με κλάσμα, χρησιμοποιούμε το Frac component */}
                    {st.fractionData ? (
                      <div className="font-mono text-base sm:text-xl font-black text-emerald-400 flex items-center flex-wrap gap-2 pt-1">
                        <span>x ＝</span>
                        <Frac
                          num={Math.abs(st.fractionData.rawNum)}
                          den={Math.abs(st.fractionData.rawDen)}
                          isNeg={st.fractionData.isNeg}
                        />
                        {/* Αν απλοποιείται το κλάσμα αλλά παραμένει κλάσμα */}
                        {!st.fractionData.isExactInteger &&
                          (st.fractionData.simplifiedNum !== Math.abs(st.fractionData.rawNum) ||
                            st.fractionData.simplifiedDen !== Math.abs(st.fractionData.rawDen)) && (
                            <>
                              <span>＝</span>
                              <Frac
                                num={st.fractionData.simplifiedNum}
                                den={st.fractionData.simplifiedDen}
                                isNeg={st.fractionData.isNeg}
                              />
                            </>
                          )}
                        {/* Αν διαιρείται ακριβώς σε ακέραιο */}
                        {st.fractionData.isExactInteger && (
                          <span>＝ {st.fractionData.finalIntValue}</span>
                        )}
                      </div>
                    ) : (
                      <div className="font-mono text-base sm:text-xl font-black text-white break-words">
                        {st.math}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 3. ΠΑΡΑΔΕΙΓΜΑΤΑ ΜΕ ΠΡΟΒΛΗΜΑΤΑ & ΕΡΓΑΣΤΗΡΙΟ 2 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Επίλυση Προβλημάτων με Εξισώσεις
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Πρόβλημα 1 */}
            <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded inline-block">
                ΠΑΡΑΔΕΙΓΜΑ 1: ΟΙΚΟΝΟΜΙΚΟ ΠΡΟΒΛΗΜΑ
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Συνδρομή & Μαθήματα Κολύμβησης
              </h3>
              <p className="text-slate-600">
                Ένα κολυμβητήριο χρεώνει <strong>15 €</strong> για την ετήσια εγγραφή και <strong>4 €</strong> για κάθε προπόνηση. Αν ένας αθλητής πλήρωσε συνολικά <strong>63 €</strong>, πόσες προπονήσεις έκανε;
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-indigo-100 font-mono text-xs sm:text-sm space-y-1.5 text-slate-800">
                <div className="font-sans font-bold text-indigo-950">Βήματα Επίλυσης:</div>
                <div>• Έστω <strong>x</strong> ο αριθμός των προπονήσεων.</div>
                <div>• Εξίσωση: <strong>4 · x ＋ 15 ＝ 63</strong></div>
                <div>• Χωρισμός: 4 · x ＝ 63 － 15 ➔ 4 · x ＝ 48</div>
                <div className="flex items-center font-bold text-emerald-700">
                  <span>• Λύση: x ＝ </span>
                  <Frac num="48" den="4" />
                  <span> ＝ 12 προπονήσεις.</span>
                </div>
              </div>
            </div>

            {/* Πρόβλημα 2 */}
            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded inline-block">
                ΠΑΡΑΔΕΙΓΜΑ 2: ΓΕΩΜΕΤΡΙΚΟ ΠΡΟΒΛΗΜΑ
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Περίμετρος Ορθογωνίου Κήπου
              </h3>
              <p className="text-slate-600">
                Το μήκος ενός ορθογωνίου κήπου είναι <strong>κατά 5 μέτρα μεγαλύτερο</strong> από το πλάτος του. Αν η περίμετρος του κήπου είναι <strong>50 μέτρα</strong>, ποιες είναι οι διαστάσεις του;
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-amber-100 font-mono text-xs sm:text-sm space-y-1.5 text-slate-800">
                <div className="font-sans font-bold text-amber-950">Βήματα Επίλυσης:</div>
                <div>• Έστω <strong>x</strong> το πλάτος, άρα το μήκος είναι <strong>x ＋ 5</strong>.</div>
                <div>• Εξίσωση: 2·x ＋ 2·(x ＋ 5) ＝ 50</div>
                <div>• Απλοποίηση: 2x ＋ 2x ＋ 10 ＝ 50 ➔ 4x ＝ 40</div>
                <div className="flex items-center font-bold text-emerald-700">
                  <span>• Λύση: x ＝ </span>
                  <Frac num="40" den="4" />
                  <span> ＝ 10 m (πλάτος) και 15 m (μήκος).</span>
                </div>
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΓΡΗΓΟΡΟΣ ΠΡΟΣΟΜΟΙΩΤΗΣ αx + β = γ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 2: Διαδραστικός Προσομοιωτής α·x ＋ β ＝ γ με Κλασματική Λύση
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-indigo-900 uppercase block">ΣΥΝΤΕΛΕΣΤΗΣ (α)</label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setSimA, -1, -10, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-indigo-50 rounded-lg border border-indigo-200 font-bold text-sm font-mono text-indigo-950">
                      {simA}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setSimA, 1, -10, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">ΣΤΑΘΕΡΟΣ (β)</label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setSimB, -1, -20, 20, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono">
                      {simB > 0 ? `＋${simB}` : simB}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setSimB, 1, -20, 20, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-amber-700 uppercase block">2Ο ΜΕΛΟΣ (γ)</label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setSimC, -1, -25, 25, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-sm font-mono text-amber-950">
                      {simC}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setSimC, 1, -25, 25, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-3 shadow-md font-mono">
                <div className="text-base sm:text-xl font-black text-amber-300">
                  Εξίσωση: {simA}x {simB >= 0 ? `＋ ${simB}` : `－ ${Math.abs(simB)}`} ＝ {simC}
                </div>

                <div className="text-xs sm:text-sm text-indigo-200">
                  1. Μεταφορά σταθερού όρου: {simA}x ＝ {simC} {simB >= 0 ? `－ ${simB}` : `＋ ${Math.abs(simB)}`} ➔{' '}
                  <strong>
                    {simA}x ＝ {simRightAfterMove}
                  </strong>
                </div>

                {simA === 0 ? (
                  <div className="text-sm font-bold text-rose-400 pt-1">
                    {simRightAfterMove === 0
                      ? 'Ταυτότητα (0x ＝ 0): Αληθεύει για κάθε x!'
                      : `Αδύνατη εξίσωση (0x ＝ ${simRightAfterMove}): Δεν έχει λύση!`}
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-800 flex items-center flex-wrap gap-2 text-base sm:text-2xl font-black text-emerald-400">
                    <span>2. Λύση: x ＝</span>
                    <Frac
                      num={Math.abs(simRightAfterMove)}
                      den={Math.abs(simA)}
                      isNeg={simRightAfterMove !== 0 && simIsNeg}
                    />
                    {simSimpDen === 1 || simRightAfterMove === 0 ? (
                      <span>
                        ＝ {simRightAfterMove === 0 ? 0 : simIsNeg ? `－${simSimpNum}` : simSimpNum}
                      </span>
                    ) : (
                      simGcd > 1 && (
                        <>
                          <span>＝</span>
                          <Frac num={simSimpNum} den={simSimpDen} isNeg={simIsNeg} />
                        </>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
