import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// ==========================================
// ΡΥΘΜΙΣΕΙΣ & ΟΡΙΑ ΕΡΓΑΣΤΗΡΙΩΝ
// ==========================================
export const LAB_CONFIG = {
  lab1: {
    defaultVal: '4500000',
    samples: [
      { labelEl: '4.500.000 (Μεγάλος)', labelEn: '4,500,000 (Large)', val: '4500000' },
      { labelEl: '0,00045 (Μικρός)', labelEn: '0.00045 (Small)', val: '0,00045' },
      { labelEl: '380.000.000', labelEn: '380,000,000', val: '380000000' },
      { labelEl: '0,0000072', labelEn: '0.0000072', val: '0,0000072' },
      { labelEl: '-78.000 (Αρνητικός)', labelEn: '-78,000 (Negative)', val: '-78000' },
      { labelEl: '105', labelEn: '105', val: '105' },
      { labelEl: '6', labelEn: '6', val: '6' }
    ]
  },
  lab2: {
    presets: [
      {
        nameEl: 'Διάμετρος ατόμου υδρογόνου',
        nameEn: 'Diameter of hydrogen atom',
        valueStrEl: '0,0000000001 m',
        valueStrEn: '0.0000000001 m',
        a: 1,
        exp: -10,
        unitEl: 'm',
        unitEn: 'm',
        type: 'micro'
      },
      {
        nameEl: 'Μέγεθος ιού γρίπης',
        nameEn: 'Size of influenza virus',
        valueStrEl: '0,00000012 m',
        valueStrEn: '0.00000012 m',
        a: 1.2,
        exp: -7,
        unitEl: 'm',
        unitEn: 'm',
        type: 'micro'
      },
      {
        nameEl: 'Ερυθρό αιμοσφαίριο',
        nameEn: 'Red blood cell',
        valueStrEl: '0,0000075 m',
        valueStrEn: '0.0000075 m',
        a: 7.5,
        exp: -6,
        unitEl: 'm',
        unitEn: 'm',
        type: 'micro'
      },
      {
        nameEl: 'Πληθυσμός Ελλάδας',
        nameEn: 'Population of Greece',
        valueStrEl: '10.400.000 κάτοικοι',
        valueStrEn: '10,400,000 inhabitants',
        a: 1.04,
        exp: 7,
        unitEl: 'κάτοικοι',
        unitEn: 'inhabitants',
        type: 'macro'
      },
      {
        nameEl: 'Ταχύτητα του φωτός',
        nameEn: 'Speed of light',
        valueStrEl: '300.000.000 m/s',
        valueStrEn: '300,000,000 m/s',
        a: 3,
        exp: 8,
        unitEl: 'm/s',
        unitEn: 'm/s',
        type: 'macro'
      },
      {
        nameEl: 'Απόσταση Γης - Ήλιου',
        nameEn: 'Distance Earth - Sun',
        valueStrEl: '150.000.000.000 m',
        valueStrEn: '150,000,000,000 m',
        a: 1.5,
        exp: 11,
        unitEl: 'm',
        unitEn: 'm',
        type: 'macro'
      }
    ]
  }
};

// Καθαρισμός κεφαλαίων ελληνικών με διατήρηση μόνο του Β'
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Β')/g);
  return parts
    .map((part) => {
      if (part === "Β'") return "Β'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Component Frac με υποστήριξη responsive rendering και μηδενικό overflow
const Frac = ({ num, den, className = "" }) => {
  const numStr = String(num).trim();
  const denStr = String(den).trim();

  const isNumNeg = numStr.startsWith('-');
  const isDenNeg = denStr.startsWith('-');
  const isNegative = (isNumNeg && !isDenNeg) || (!isNumNeg && isDenNeg);

  const cleanNum = numStr.replace('-', '');
  const cleanDen = denStr.replace('-', '');

  return (
    <span className={`inline-flex items-center align-middle mx-0.5 sm:mx-1 font-mono shrink-0 max-w-full ${className}`}>
      {isNegative && <span className="mr-0.5 text-sm sm:text-base font-bold select-none">－</span>}
      <span className="inline-flex flex-col text-center leading-none text-[0.85em] sm:text-[0.9em]">
        <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">{cleanNum}</span>
        <span className="pt-0.5 px-0.5 sm:px-1 break-all">{cleanDen}</span>
      </span>
    </span>
  );
};

// Component Power: σκούρο χρώμα, παρένθεση ΜΟΝΟ σε αρνητικό εκθέτη με HTML <sup>
const Power = ({ base, exp, className = "" }) => {
  const expNum = typeof exp === 'number' ? exp : parseInt(String(exp).replace(/[()]/g, ''), 10);
  const isNeg = !isNaN(expNum) ? expNum < 0 : String(exp).startsWith('-');
  const absExp = !isNaN(expNum) ? Math.abs(expNum) : String(exp).replace('-', '');
  const formattedExp = isNeg ? `(－${absExp})` : `${exp}`;

  return (
    <span className={`inline-flex items-baseline font-mono shrink-0 ${className}`}>
      <span>{base}</span>
      <sup className="text-slate-900 font-bold ml-0.5 text-xs sm:text-sm">
        {formattedExp}
      </sup>
    </span>
  );
};

// Component Power για σκούρο φόντο με tag <sup>
const DarkPower = ({ base, exp, className = "" }) => {
  const expNum = typeof exp === 'number' ? exp : parseInt(String(exp).replace(/[()]/g, ''), 10);
  const isNeg = !isNaN(expNum) ? expNum < 0 : String(exp).startsWith('-');
  const absExp = !isNaN(expNum) ? Math.abs(expNum) : String(exp).replace('-', '');
  const formattedExp = isNeg ? `(－${absExp})` : `${exp}`;

  return (
    <span className={`inline-flex items-baseline font-mono shrink-0 ${className}`}>
      <span>{base}</span>
      <sup className="text-amber-400 font-bold ml-0.5 text-[0.75em] leading-none">
        {formattedExp}
      </sup>
    </span>
  );
};

export default function TipopoiimeniMorfiTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  // --- Συγκεντρωτικό Λεξικό i18n (el / en) ---
  const t = {
    el: {
      pageTitle: "Τυποποιημένη Μορφή Αριθμών | Β' Γυμνασίου",
      pageDesc: "Θεωρία, κανόνες και διαδραστικά εργαστήρια για την τυποποιημένη (επιστημονική) μορφή ρητών αριθμών για τη Β' Γυμνασίου.",
      backText: "Β' Γυμνασίου",
      actionBtn: "ΑΣΚΗΣΕΙΣ",
      badgeUnit: "Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 2",
      headerTitle: "ΤΥΠΟΠΟΙΗΜΕΝΗ ΜΟΡΦΗ ΡΗΤΩΝ ΑΡΙΘΜΩΝ",
      headerDesc: "Μάθε πώς γράφουμε εξαιρετικά μεγάλους ή εξαιρετικά μικρούς αριθμούς με σύντομο, κομψό και τυποποιημένο τρόπο, αξιοποιώντας τις δυνάμεις του 10 με ακέραιο εκθέτη.",

      // Ενότητα 1
      sec1Num: "1",
      sec1Title: "Τι Είναι η Τυποποιημένη Μορφή;",
      sec1Intro: "Στην καθημερινή ζωή και τις επιστήμες συναντάμε συχνά αριθμούς με πάρα πολλά ψηφία:",
      sample1Label: "Απόσταση Γης - Ήλιου:",
      sample1Val: "150.000.000.000 m",
      sample2Label: "Μάζα μορίου νερού:",
      sample2Val: "0,00000000000000000000003 g",
      sec1Explain: "Για να διαβάζονται εύκολα και να αποφεύγονται λάθη στα μηδενικά, γράφουμε τους αριθμούς στην τυποποιημένη (ή επιστημονική) μορφή:",
      rulesHeading: "ΟΙ ΔΥΟ ΑΠΑΡΑΒΙΑΣΤΟΙ ΚΑΝΟΝΕΣ",
      rule1Title: "ΚΑΝΟΝΑΣ 1: Ο ΣΥΝΤΕΛΕΣΤΗΣ α",
      rule1Math: "1 ≤ |α| ＜ 10",
      rule1Desc: "Το α έχει ακριβώς ένα μη μηδενικό ψηφίο αριστερά από την υποδιαστολή (δηλαδή από 1 έως 9,999...).",
      rule2Title: "ΚΑΝΟΝΑΣ 2: Ο ΕΚΘΕΤΗΣ κ",
      rule2Math: "κ ∈ ℤ (Ακέραιος Αριθμός)",
      rule2DescPos: "• Αν ο αρχικός αριθμός είναι μεγάλος (≥ 10), ο εκθέτης είναι θετικός (κ ＞ 0).",
      rule2DescNeg: "• Αν ο αρχικός αριθμός είναι μικρός (＜ 1), ο εκθέτης είναι αρνητικός (κ ＜ 0).",

      // Ενότητα 2
      sec2Num: "2",
      sec2Title: "Μέθοδος Μετατροπής: Μετακίνηση της Υποδιαστολής",
      caseATag: "ΠΕΡΙΠΤΩΣΗ Α",
      caseATitle: "Μεγάλοι Αριθμοί (Αριστερή Μετακίνηση)",
      caseADesc: "Μετακινούμε την υποδιαστολή προς τα αριστερά μέχρι να μείνει μόνο ένα ψηφίο πριν από αυτήν. Το πλήθος των θέσεων που μετακινηθήκαμε είναι ο θετικός εκθέτης.",
      caseAExampleLabel: "Παράδειγμα: 5.400.000",
      caseAMathText: "5.400.000 ＝ 5,4 · ",
      caseAShiftNote: "Μετακίνηση 6 θέσεις αριστερά → κ ＝ ＋6",
      caseBTag: "ΠΕΡΙΠΤΩΣΗ Β",
      caseBTitle: "Μικροί Δεκαδικοί (Δεξιά Μετακίνηση)",
      caseBDesc: "Μετακινούμε την υποδιαστολή προς τα δεξιά μέχρι να συναντήσουμε το πρώτο μη μηδενικό ψηφίο. Το πλήθος των θέσεων που μετακινηθήκαμε είναι ο αρνητικός εκθέτης.",
      caseBExampleLabel: "Παράδειγμα: 0,00038",
      caseBMathText: "0,00038 ＝ 3,8 · ",
      caseBShiftNote: "Μετακίνηση 4 θέσεις δεξιά → κ ＝ －4",

      // Εργαστήριο 1
      lab1Heading: "🛠️ Εργαστήριο 1: Μετατροπέας Συνηθισμένου Αριθμού σε Τυποποιημένη Μορφή",
      lab1Subheading: "Πληκτρολόγησε οποιονδήποτε αριθμό ή διάλεξε ένα έτοιμο παράδειγμα",
      tryLabel: "ΔΟΚΙΜΑΣΕ:",
      inputLabel: "ΑΡΧΙΚΟΣ ΑΡΙΘΜΟΣ (ΚΑΝΟΝΙΚΗ ΓΡΑΦΗ):",
      inputPlaceholder: "π.χ. 4500000 ή 0,00045 ή -78000",
      clearBtn: "ΚΑΘΑΡΙΣΜΟΣ",
      inputFootnote: "* Επιτρέπονται μόνο αριθμοί, υποδιαστολή (κόμμα) και πρόσημο μείον (－) στην αρχή.",
      errInvalidInput: "Πληκτρολόγησε έναν έγκυρο αριθμό.",
      errInvalidNumber: "Μη έγκυρος αριθμός.",
      warnZero: "ℹ️ Το 0 δεν έχει τυποποιημένη μορφή (απαιτείται συντελεστής |α| ≥ 1).",
      originalNumLabel: "ΑΡΧΙΚΟΣ ΑΡΙΘΜΟΣ",
      scientificFormLabel: "ΤΥΠΟΠΟΙΗΜΕΝΗ ΜΟΡΦΗ",
      stepsHeader: "ΒΗΜΑΤΑ ΜΕΤΑΤΡΟΠΗΣ:",
      stepNone: "✓ Ο αριθμός είναι ήδη μεταξύ 1 και 10, οπότε ο εκθέτης είναι 0:",
      stepLarge1: "1. Ο αριθμός είναι μεγάλος (≥ 10).",
      stepLarge2: "2. Μετακινούμε την υποδιαστολή",
      stepLarge2b: "θέσεις προς τα αριστερά για να σχηματιστεί ο συντελεστής",
      stepLarge3: "3. Επειδή πήγαμε αριστερά, ο εκθέτης του 10 είναι θετικός",
      stepSmall1: "1. Ο αριθμός είναι μικρός δεκαδικός (＜ 1).",
      stepSmall2: "2. Μετακινούμε την υποδιαστολή",
      stepSmall2b: "θέσεις προς τα δεξιά μέχρι το πρώτο μη μηδενικό ψηφίο για να πάρουμε",
      stepSmall3: "3. Επειδή πήγαμε δεξιά, ο εκθέτης του 10 είναι αρνητικός",

      // Ενότητα 3
      sec3Num: "3",
      sec3Title: "🛠️ Διαδραστικό Εργαστήριο 2: Από το Άτομο στο Σύμπαν",
      sec3Intro: "Επίλεξε ένα από τα παρακάτω φυσικά μεγέθη για να δεις πώς η τυποποιημένη μορφή απλοποιεί τη γραφή και επιτρέπει την άμεση σύγκριση τεράστιων και μικροσκοπικών διαστάσεων.",
      microTag: "ΜΙΚΡΟΚΟΣΜΟΣ",
      macroTag: "ΜΑΚΡΟΚΟΣΜΟΣ",
      physicalQuantityLabel: "ΦΥΣΙΚΟ ΜΕΓΕΘΟΣ",
      microBadge: "ΜΙΚΡΟΣΚΟΠΙΚΟ ΜΕΓΕΘΟΣ",
      macroBadge: "ΑΣΤΡΟΝΟΜΙΚΟ ΜΕΓΕΘΟΣ",
      classicNotationLabel: "Κλασική Γραφή (με όλα τα μηδενικά):",
      scientificNotationLabel: "Τυποποιημένη (Επιστημονική) Μορφή:",

      // Ενότητα 4
      sec4Num: "4",
      sec4Title: "Πράξεις με Αριθμούς σε Τυποποιημένη Μορφή",
      sec4Intro: "Για να εκτελέσουμε πολλαπλασιασμό ή διαίρεση αριθμών σε τυποποιημένη μορφή, ομαδοποιούμε τους συντελεστές και τις δυνάμεις του 10 χωριστά, εφαρμόζοντας τις γνωστές ιδιότητες:",
      multTag: "ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ",
      multTitle: "Γινόμενο Τυποποιημένων Αριθμών",
      multDesc: "Πολλαπλασιάζουμε τους συντελεστές και προσθέτουμε τους εκθέτες του 10:",
      divTag: "ΔΙΑΙΡΕΣΗ",
      divTitle: "Πηλίκο Τυποποιημένων Αριθμών",
      divDesc: "Διαιρούμε τους συντελεστές και αφαιρούμε τους εκθέτες του 10:"
    },
    en: {
      pageTitle: "Scientific Notation of Numbers | Grade 8",
      pageDesc: "Theory, rules, and interactive laboratories for standard (scientific) notation of rational numbers for 8th Grade.",
      backText: "Grade 8",
      actionBtn: "EXERCISES",
      badgeUnit: "GRADE 8 • UNIT 2",
      headerTitle: "SCIENTIFIC NOTATION OF RATIONAL NUMBERS",
      headerDesc: "Learn how to write extremely large or extremely small numbers in a concise, elegant, and standardized way using powers of 10 with integer exponents.",

      // Section 1
      sec1Num: "1",
      sec1Title: "What is Scientific Notation?",
      sec1Intro: "In everyday life and science, we frequently encounter numbers with numerous digits:",
      sample1Label: "Earth - Sun Distance:",
      sample1Val: "150,000,000,000 m",
      sample2Label: "Mass of a water molecule:",
      sample2Val: "0.00000000000000000000003 g",
      sec1Explain: "To make them easier to read and avoid errors counting zeros, we write numbers in standard (scientific) notation:",
      rulesHeading: "THE TWO FUNDAMENTAL RULES",
      rule1Title: "RULE 1: THE COEFFICIENT a",
      rule1Math: "1 ≤ |a| ＜ 10",
      rule1Desc: "Coefficient a has exactly one non-zero digit to the left of the decimal point (from 1 to 9.999...).",
      rule2Title: "RULE 2: THE EXPONENT k",
      rule2Math: "k ∈ ℤ (Integer Number)",
      rule2DescPos: "• If the original number is large (≥ 10), the exponent is positive (k ＞ 0).",
      rule2DescNeg: "• If the original number is small (＜ 1), the exponent is negative (k ＜ 0).",

      // Section 2
      sec2Num: "2",
      sec2Title: "Conversion Method: Moving the Decimal Point",
      caseATag: "CASE A",
      caseATitle: "Large Numbers (Leftward Shift)",
      caseADesc: "Move the decimal point to the left until only one non-zero digit remains before it. The number of places moved is the positive exponent.",
      caseAExampleLabel: "Example: 5,400,000",
      caseAMathText: "5,400,000 ＝ 5.4 · ",
      caseAShiftNote: "Moved 6 places left → k ＝ ＋6",
      caseBTag: "CASE B",
      caseBTitle: "Small Decimals (Rightward Shift)",
      caseBDesc: "Move the decimal point to the right until you encounter the first non-zero digit. The number of places moved is the negative exponent.",
      caseBExampleLabel: "Example: 0.00038",
      caseBMathText: "0.00038 ＝ 3.8 · ",
      caseBShiftNote: "Moved 4 places right → k ＝ －4",

      // Lab 1
      lab1Heading: "🛠️ Lab 1: Standard Number to Scientific Notation Converter",
      lab1Subheading: "Type any number or pick one of the presets below",
      tryLabel: "TRY:",
      inputLabel: "ORIGINAL NUMBER (STANDARD FORM):",
      inputPlaceholder: "e.g. 4500000 or 0.00045 or -78000",
      clearBtn: "CLEAR",
      inputFootnote: "* Only numbers, decimal separator (comma/dot), and a leading minus (－) are accepted.",
      errInvalidInput: "Please type a valid number.",
      errInvalidNumber: "Invalid number.",
      warnZero: "ℹ️ Zero has no scientific notation (requires coefficient |a| ≥ 1).",
      originalNumLabel: "ORIGINAL NUMBER",
      scientificFormLabel: "SCIENTIFIC NOTATION",
      stepsHeader: "CONVERSION STEPS:",
      stepNone: "✓ The number is already between 1 and 10, so the exponent is 0:",
      stepLarge1: "1. The number is large (≥ 10).",
      stepLarge2: "2. Move the decimal point",
      stepLarge2b: "places to the left to obtain coefficient",
      stepLarge3: "3. Because we moved left, the exponent of 10 is positive",
      stepSmall1: "1. The number is a small decimal (＜ 1).",
      stepSmall2: "2. Move the decimal point",
      stepSmall2b: "places to the right until the first non-zero digit to get",
      stepSmall3: "3. Because we moved right, the exponent of 10 is negative",

      // Section 3
      sec3Num: "3",
      sec3Title: "🛠️ Interactive Lab 2: From the Atom to the Cosmos",
      sec3Intro: "Select one of the physical quantities below to see how scientific notation simplifies notation and enables direct comparison across macroscopic and microscopic scales.",
      microTag: "MICROCOSM",
      macroTag: "MACROCOSM",
      physicalQuantityLabel: "PHYSICAL QUANTITY",
      microBadge: "MICROSCOPIC SCALE",
      macroBadge: "ASTRONOMICAL SCALE",
      classicNotationLabel: "Standard Notation (with all zeros):",
      scientificNotationLabel: "Standard (Scientific) Notation:",

      // Section 4
      sec4Num: "4",
      sec4Title: "Operations with Numbers in Scientific Notation",
      sec4Intro: "To multiply or divide numbers in scientific notation, group the coefficients and powers of 10 separately, applying the standard exponent laws:",
      multTag: "MULTIPLICATION",
      multTitle: "Product of Numbers in Scientific Notation",
      multDesc: "Multiply the coefficients and add the exponents of 10:",
      divTag: "DIVISION",
      divTitle: "Quotient of Numbers in Scientific Notation",
      divDesc: "Divide the coefficients and subtract the exponents of 10:"
    }
  };

  const cur = t[locale] || t.el;

  const [inputVal, setInputVal] = useState(LAB_CONFIG.lab1.defaultVal);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const inputRef = useRef(null);

  // Συγχρονισμός αρχικής τιμής
  useEffect(() => {
    setInputVal(LAB_CONFIG.lab1.defaultVal);
    if (inputRef.current) {
      inputRef.current.value = LAB_CONFIG.lab1.defaultVal;
    }
  }, []);

  // Αυστηρό φιλτράρισμα εισόδου: αριθμοί, μία υποδιαστολή, και ένα μείον μόνο στην αρχή
  const handleNumericInput = (rawVal) => {
    let clean = rawVal.replace(/[^0-9,\.\-]/g, '');

    // Μόνο ένα '-' και μόνο στην αρχή
    if (clean.includes('-')) {
      const hasMinusAtStart = clean.startsWith('-');
      clean = clean.replace(/-/g, '');
      if (hasMinusAtStart) clean = '-' + clean;
    }

    // Μόνο μία υποδιαστολή
    let sepCount = 0;
    let formatted = '';
    const targetSep = locale === 'el' ? ',' : '.';
    for (let i = 0; i < clean.length; i++) {
      const ch = clean[i];
      if (ch === ',' || ch === '.') {
        if (sepCount === 0) {
          formatted += targetSep;
          sepCount++;
        }
      } else {
        formatted += ch;
      }
    }

    setInputVal(formatted);
  };

  // Ανάλυση Μετατροπής σε Τυποποιημένη Μορφή (α · 10^κ)
  const analysis = useMemo(() => {
    const rawClean = inputVal.trim().replace(/\./g, '').replace(',', '.');
    if (!rawClean || rawClean === '-') return { error: cur.errInvalidInput };

    const num = parseFloat(rawClean);
    if (isNaN(num)) return { error: cur.errInvalidNumber };
    if (num === 0) return { isZero: true };

    const isNeg = num < 0;
    const absNum = Math.abs(num);

    let k = Math.floor(Math.log10(absNum));
    let a = absNum / Math.pow(10, k);

    a = Number(a.toFixed(6));
    if (a >= 10) {
      a = 1;
      k += 1;
    }

    const decSep = locale === 'el' ? ',' : '.';
    const signedA = (isNeg ? -a : a).toString().replace('.', decSep);

    let shiftType = 'none';
    let shiftCount = Math.abs(k);
    if (k > 0) shiftType = 'left';
    else if (k < 0) shiftType = 'right';

    return {
      originalFormatted: inputVal,
      num,
      a: signedA,
      rawA: isNeg ? -a : a,
      k,
      shiftType,
      shiftCount,
      isNeg
    };
  }, [inputVal, locale, cur]);

  const preset = LAB_CONFIG.lab2.presets[selectedPreset];

  return (
    <Layout
      title={cur.pageTitle}
      description={cur.pageDesc}
      backUrl="/b-gymnasiou"
      backText={cur.backText}
      showAds={true}
      actionButton={
        <Link
          href="/b-gymnasiou/02-tipopoiimeni-morfi-ask"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm md:text-base transition-all shadow-md shrink-0"
        >
          <span>🎯</span>
          <span>{cur.actionBtn}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-10 sm:space-y-16 box-border">
        
        {/* Banner Header - Indigo Theme */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50 w-full min-w-0">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 uppercase break-words">
              {toCleanUppercase(cur.badgeUnit)}
            </span>
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(cur.headerTitle)}
            </h1>
            <p className="text-xs sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {cur.headerDesc}
            </p>
          </div>
        </section>

        {/* 1. ΕΝΝΟΙΑ & ΟΡΙΣΜΟΣ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 w-full min-w-0">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                {cur.sec1Num}
              </span>
              <span>{cur.sec1Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4 min-w-0">
              <p className="break-words [overflow-wrap:anywhere]">
                {cur.sec1Intro}
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm sm:text-base">
                <li className="break-words [overflow-wrap:anywhere]">
                  {cur.sample1Label} <strong className="text-slate-900 font-mono">{cur.sample1Val}</strong>
                </li>
                <li className="break-words [overflow-wrap:anywhere]">
                  {cur.sample2Label} <strong className="text-slate-900 font-mono">{cur.sample2Val}</strong>
                </li>
              </ul>
              <p className="break-words [overflow-wrap:anywhere]">
                {cur.sec1Explain}
              </p>
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-indigo-950 font-bold text-center text-lg sm:text-2xl font-mono shadow-inner flex items-center justify-center gap-1.5 flex-wrap">
                <span>{locale === 'el' ? 'α' : 'a'} · </span>
                <Power base={10} exp={locale === 'el' ? 'κ' : 'k'} className="text-indigo-950" />
              </div>
            </div>

            {/* Κανόνες για το α και το κ */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4 min-w-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 break-words">
                {toCleanUppercase(cur.rulesHeading)}
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-xs uppercase font-bold tracking-wider text-indigo-600 break-words">
                    {toCleanUppercase(cur.rule1Title)}
                  </div>
                  <div className="text-base sm:text-lg font-bold font-mono text-slate-900 break-all">
                    {cur.rule1Math}
                  </div>
                  <p className="text-xs text-slate-500 font-sans break-words [overflow-wrap:anywhere]">
                    {cur.rule1Desc}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-xs uppercase font-bold tracking-wider text-indigo-600 break-words">
                    {toCleanUppercase(cur.rule2Title)}
                  </div>
                  <div className="text-base sm:text-lg font-bold font-mono text-slate-900 break-all">
                    {cur.rule2Math}
                  </div>
                  <div className="text-xs text-slate-500 font-sans space-y-1 break-words [overflow-wrap:anywhere]">
                    <div>{cur.rule2DescPos}</div>
                    <div>{cur.rule2DescNeg}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΠΩΣ ΜΕΤΑΤΡΕΠΟΥΜΕ ΕΝΑΝ ΑΡΙΘΜΟ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8 w-full min-w-0">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 font-extrabold text-base sm:text-lg shrink-0">
                {cur.sec2Num}
              </span>
              <span>{cur.sec2Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 min-w-0">
              <div className="text-xs uppercase font-bold tracking-wider text-amber-700 break-words">
                {toCleanUppercase(cur.caseATag)}
              </div>
              <h3 className="font-bold text-slate-900 text-lg sm:text-xl break-words">
                {cur.caseATitle}
              </h3>
              <p className="text-sm text-slate-600 break-words [overflow-wrap:anywhere]">
                {cur.caseADesc}
              </p>
              <div className="p-4 bg-white rounded-xl border border-slate-200 font-mono text-center space-y-1 min-w-0">
                <div className="text-slate-500 text-xs font-sans break-words">
                  {cur.caseAExampleLabel}
                </div>
                <div className="text-base sm:text-lg font-bold text-slate-900 flex items-center justify-center flex-wrap gap-1">
                  <span>{cur.caseAMathText}</span>
                  <Power base={10} exp={6} />
                </div>
                <div className="text-xs text-indigo-600 font-sans break-words">
                  {cur.caseAShiftNote}
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 min-w-0">
              <div className="text-xs uppercase font-bold tracking-wider text-indigo-700 break-words">
                {toCleanUppercase(cur.caseBTag)}
              </div>
              <h3 className="font-bold text-slate-900 text-lg sm:text-xl break-words">
                {cur.caseBTitle}
              </h3>
              <p className="text-sm text-slate-600 break-words [overflow-wrap:anywhere]">
                {cur.caseBDesc}
              </p>
              <div className="p-4 bg-white rounded-xl border border-slate-200 font-mono text-center space-y-1 min-w-0">
                <div className="text-slate-500 text-xs font-sans break-words">
                  {cur.caseBExampleLabel}
                </div>
                <div className="text-base sm:text-lg font-bold text-slate-900 flex items-center justify-center flex-wrap gap-1">
                  <span>{cur.caseBMathText}</span>
                  <Power base={10} exp={-4} />
                </div>
                <div className="text-xs text-indigo-600 font-sans break-words">
                  {cur.caseBShiftNote}
                </div>
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1 */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-6 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-base sm:text-xl font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
                {cur.lab1Heading}
              </h3>
              <span className="text-xs font-mono text-slate-500 break-words">
                {cur.lab1Subheading}
              </span>
            </div>

            {/* Έτοιμα Παραδείγματα */}
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="text-xs font-bold text-slate-500 uppercase self-center mr-1 break-words">
                {toCleanUppercase(cur.tryLabel)}
              </span>
              {LAB_CONFIG.lab1.samples.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInputVal(item.val)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-all touch-manipulation font-mono break-words"
                >
                  {locale === 'el' ? item.labelEl : item.labelEn}
                </button>
              ))}
            </div>

            {/* Πεδίο Εισαγωγής Αριθμού */}
            <div className="space-y-2 min-w-0">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider break-words">
                {toCleanUppercase(cur.inputLabel)}
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  key="scientific-converter-input"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={inputVal}
                  onChange={(e) => handleNumericInput(e.target.value)}
                  placeholder={cur.inputPlaceholder}
                  className="w-full h-14 px-4 sm:px-5 pr-28 rounded-2xl border-2 border-indigo-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 font-mono text-base sm:text-xl font-bold text-slate-900 transition-all outline-none box-border"
                />
                {inputVal && (
                  <button
                    type="button"
                    onClick={() => setInputVal('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all touch-manipulation"
                  >
                    {toCleanUppercase(cur.clearBtn)}
                  </button>
                )}
              </div>
              <div className="text-[11px] text-slate-400 font-sans break-words">
                {cur.inputFootnote}
              </div>
            </div>

            {/* Οθόνη Ανάλυσης & Αποτελέσματος */}
            <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-5 sm:p-8 rounded-3xl text-white space-y-6 shadow-inner font-mono min-w-0">
              {analysis.error ? (
                <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm font-sans font-semibold break-words">
                  ⚠️ {analysis.error}
                </div>
              ) : analysis.isZero ? (
                <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-sans font-semibold break-words">
                  {cur.warnZero}
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3 min-w-0">
                    <div className="min-w-0">
                      <span className="text-xs uppercase tracking-widest text-indigo-300 font-semibold font-sans block mb-1 break-words">
                        {toCleanUppercase(cur.originalNumLabel)}
                      </span>
                      <div className="text-xl sm:text-2xl font-bold text-white break-all">
                        {analysis.originalFormatted}
                      </div>
                    </div>
                    <div className="text-left sm:text-right min-w-0">
                      <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold font-sans block mb-1 break-words">
                        {toCleanUppercase(cur.scientificFormLabel)}
                      </span>
                      <div className="text-xl sm:text-3xl md:text-4xl font-black text-amber-300 flex items-center sm:justify-end gap-1.5 flex-wrap break-all">
                        <span>＝</span>
                        <span>{analysis.a} · </span>
                        <DarkPower base={10} exp={analysis.k} />
                      </div>
                    </div>
                  </div>

                  {/* Επεξήγηση Μετακίνησης Υποδιαστολής */}
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 space-y-2 text-xs sm:text-sm text-slate-200 font-sans min-w-0">
                    <div className="text-xs text-indigo-200 uppercase font-bold break-words">
                      {toCleanUppercase(cur.stepsHeader)}
                    </div>
                    {analysis.shiftType === 'none' ? (
                      <div className="text-emerald-300 font-semibold flex items-center flex-wrap gap-1">
                        <span>{cur.stepNone}</span>
                        <span className="font-mono">{analysis.a} · </span>
                        <DarkPower base={10} exp={0} />
                      </div>
                    ) : analysis.shiftType === 'left' ? (
                      <div className="space-y-1 break-words [overflow-wrap:anywhere]">
                        <div>{cur.stepLarge1}</div>
                        <div>
                          {cur.stepLarge2} <strong>{analysis.shiftCount} {cur.stepLarge2b}</strong> <span className="font-mono font-bold text-amber-300">{analysis.a}</span> ({locale === 'el' ? '1 ≤ |α| ＜ 10' : '1 ≤ |a| ＜ 10'}).
                        </div>
                        <div>
                          {cur.stepLarge3} <strong>(＋{analysis.shiftCount})</strong>.
                        </div>
                        <div className="pt-1 text-emerald-300 font-mono font-bold flex items-center flex-wrap gap-1">
                          <span>➔ {analysis.originalFormatted} ＝ {analysis.a} · </span>
                          <DarkPower base={10} exp={analysis.k} />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 break-words [overflow-wrap:anywhere]">
                        <div>{cur.stepSmall1}</div>
                        <div>
                          {cur.stepSmall2} <strong>{analysis.shiftCount} {cur.stepSmall2b}</strong> <span className="font-mono font-bold text-amber-300">{analysis.a}</span>.
                        </div>
                        <div>
                          {cur.stepSmall3} <strong>(－{analysis.shiftCount})</strong>.
                        </div>
                        <div className="pt-1 text-emerald-300 font-mono font-bold flex items-center flex-wrap gap-1">
                          <span>➔ {analysis.originalFormatted} ＝ {analysis.a} · </span>
                          <DarkPower base={10} exp={analysis.k} />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: Η ΚΛΙΜΑΚΑ ΤΟΥ ΣΥΜΠΑΝΤΟΣ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 w-full min-w-0">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 font-extrabold text-base sm:text-lg shrink-0">
                {cur.sec3Num}
              </span>
              <span>{cur.sec3Title}</span>
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed break-words [overflow-wrap:anywhere]">
            {cur.sec3Intro}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 min-w-0">
            {LAB_CONFIG.lab2.presets.map((item, idx) => {
              const isSelected = idx === selectedPreset;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedPreset(idx)}
                  className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all touch-manipulation flex flex-col items-center justify-between gap-1.5 sm:gap-2 min-w-0 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-400'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider opacity-75 break-words">
                    {toCleanUppercase(item.type === 'micro' ? cur.microTag : cur.macroTag)}
                  </span>
                  <span className="text-xs sm:text-sm font-bold break-words line-clamp-2">
                    {locale === 'el' ? item.nameEl : item.nameEn}
                  </span>
                  <span className={`text-[10px] sm:text-xs font-mono font-semibold ${isSelected ? 'text-amber-300' : 'text-indigo-600'}`}>
                    <Power base={10} exp={item.exp} className={isSelected ? 'text-amber-300' : 'text-indigo-600'} />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 text-white space-y-4 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2 min-w-0">
              <div className="min-w-0">
                <span className="text-xs text-indigo-400 uppercase font-bold tracking-wider block break-words">
                  {toCleanUppercase(cur.physicalQuantityLabel)}
                </span>
                <h3 className="text-lg sm:text-2xl font-bold text-white break-words">
                  {locale === 'el' ? preset.nameEl : preset.nameEn}
                </h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit shrink-0 break-words ${
                preset.type === 'micro' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {toCleanUppercase(preset.type === 'micro' ? cur.microBadge : cur.macroBadge)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1 min-w-0">
                <span className="text-xs text-slate-400 block break-words">{cur.classicNotationLabel}</span>
                <div className="font-mono text-sm sm:text-lg font-bold text-slate-100 break-all">
                  {locale === 'el' ? preset.valueStrEl : preset.valueStrEn}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-indigo-600/20 border border-indigo-500/40 space-y-1 min-w-0">
                <span className="text-xs text-indigo-300 block break-words">{cur.scientificNotationLabel}</span>
                <div className="font-mono text-lg sm:text-2xl font-black text-amber-400 flex items-center flex-wrap gap-1">
                  <span>{String(preset.a).replace('.', locale === 'el' ? ',' : '.')} · </span>
                  <DarkPower base={10} exp={preset.exp} />
                  <span className="ml-1 text-white text-sm sm:text-base">{locale === 'el' ? preset.unitEl : preset.unitEn}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ΠΡΑΞΕΙΣ & ΣΥΓΚΡΙΣΕΙΣ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 w-full min-w-0">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 font-extrabold text-base sm:text-lg shrink-0">
                {cur.sec4Num}
              </span>
              <span>{cur.sec4Title}</span>
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed break-words [overflow-wrap:anywhere]">
            {cur.sec4Intro}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 min-w-0">
              <div className="text-xs uppercase font-bold tracking-wider text-emerald-600 break-words">
                {toCleanUppercase(cur.multTag)}
              </div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg break-words">{cur.multTitle}</h3>
              <p className="text-sm text-slate-600 break-words [overflow-wrap:anywhere]">{cur.multDesc}</p>
              <div className="p-3 sm:p-4 rounded-xl bg-white border border-slate-200 font-mono text-sm sm:text-base font-bold text-emerald-900 space-y-1.5 min-w-0">
                <div className="flex items-center flex-wrap gap-1">
                  <span>(2 · <Power base={10} exp={4} />) · (3 · <Power base={10} exp={5} />) ＝ (2 · 3) · </span>
                  <Power base={10} exp="4 ＋ 5" />
                </div>
                <div className="text-emerald-600 flex items-center gap-1">
                  <span>＝ 6 · </span>
                  <Power base={10} exp={9} />
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 min-w-0">
              <div className="text-xs uppercase font-bold tracking-wider text-emerald-600 break-words">
                {toCleanUppercase(cur.divTag)}
              </div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg break-words">{cur.divTitle}</h3>
              <p className="text-sm text-slate-600 break-words [overflow-wrap:anywhere]">{cur.divDesc}</p>
              <div className="p-3 sm:p-4 rounded-xl bg-white border border-slate-200 font-mono text-sm sm:text-base font-bold text-emerald-900 space-y-1.5 min-w-0">
                <div className="flex items-center flex-wrap gap-1">
                  <span>(8 · <Power base={10} exp={7} />) : (4 · <Power base={10} exp={3} />) ＝ (8 : 4) · </span>
                  <Power base={10} exp="7 － 3" />
                </div>
                <div className="text-emerald-600 flex items-center gap-1">
                  <span>＝ 2 · </span>
                  <Power base={10} exp={4} />
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}