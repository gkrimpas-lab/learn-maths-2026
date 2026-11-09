// pages/st-dimotikou/66-epanalipsi-4.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// ---------------------------------------------------------
// ΒΟΗΘΗΤΙΚΑ COMPONENTS & ΣΥΝΑΡΤΗΣΕΙΣ
// ---------------------------------------------------------

// Εμφάνιση κλάσματος με οριζόντια κλασματική γραμμή (καθαρό JSX) - Mobile Safe
function Fraction({ num, den, className = '' }) {
  return (
    <span
      className={`inline-flex flex-col items-center justify-center align-middle mx-1 text-center font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="font-bold border-b border-current px-1 pb-0.5 break-all">
        {num}
      </span>
      <span className="font-bold px-1 pt-0.5 break-all">
        {den}
      </span>
    </span>
  );
}

function randInt(min, max) {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

function shuffleArray(array) {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Εγγύηση ακριβώς 4 μοναδικών επιλογών για MCQ
function makeUniqueOptions(correct, wrongCandidates) {
  const unique = new Set();
  if (correct !== undefined && correct !== null && correct !== '') {
    unique.add(String(correct));
  }
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && opt !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }
  let fallbackCounter = 1;
  while (unique.size < 4) {
    unique.add(`${correct} (${fallbackCounter})`);
    fallbackCounter++;
  }
  return shuffleArray(Array.from(unique));
}

// Αφαίρεση τόνων για κεφαλαία (εξαιρείται αυστηρά το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(ΣΤ')/g);
  return parts
    .map((part) => {
      if (part === "ΣΤ'") return "ΣΤ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Μορφοποίηση αριθμού ανάλογα με το locale
function formatNum(val, locale = 'el', decimals = 0) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  const loc = locale === 'en' ? 'en-US' : 'el-GR';
  const num = Number(val);
  if (Number.isInteger(num) && decimals === 0) {
    return num.toLocaleString(loc);
  }
  return num.toLocaleString(loc, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// ---------------------------------------------------------
// ΔΙΕΘΝΟΠΟΙΗΣΗ (i18n) & ΛΕΞΙΚΟ
// ---------------------------------------------------------

const I18N = {
  el: {
    metaTitle: "4η Επανάληψη: Κεφάλαια 55 έως 65 - ΣΤ' Δημοτικού | LearnMaths.gr",
    metaDesc: "Μεγάλο επαναληπτικό διαγώνισμα 22 ερωτήσεων στα Κεφάλαια 55 έως 65 (Μονάδες Μέτρησης, Χρόνος, Χρήματα, Γεωμετρικά & Αριθμητικά Μοτίβα) για τη ΣΤ' Δημοτικού.",
    backLinkText: "ΣΤ' Δημοτικού",
    badgeHeader: "🏆 4Η ΜΕΓΑΛΗ ΕΠΑΝΑΛΗΨΗ • ΚΕΦΑΛΑΙΑ 55 - 65 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Επαναληπτικό Διαγώνισμα: Μετρήσεις, Μοτίβα & Χρήματα",
    heroDesc: "22 δυναμικές ερωτήσεις (2 από κάθε ενότητα 55-65) που καλύπτουν πλήρως τις Μονάδες Μέτρησης (Μήκος, Επιφάνεια, Όγκος, Βάρος, Χρόνος), την Κλίμακα, το Ευρώ & τον Τόκο, καθώς και τα Γεωμετρικά, Αριθμητικά και Σύνθετα Μοτίβα!",
    newTestBtn: "Νέο Διαγώνισμα",
    questionsBadge: "22 Ερωτήσεις",
    questionLabel: "Ερώτηση",
    trueBtn: "Σωστό",
    falseBtn: "Λάθος",
    inputPlaceholder: "Γράψε την απάντηση...",
    finishBtn: "Ολοκλήρωση & Βαθμολόγηση Διαγωνίσματος",
    finalScoreLabel: "Τελικό Σκορ",
    answeredLabel: "Απαντήθηκαν",
    percentageLabel: "Ποσοστό",
    footerPrompt: "Απάντησε και στις 22 ερωτήσεις και πάτησε «Ολοκλήρωση & Βαθμολόγηση»!",
    newTestWithDifferentBtn: "Νέο Διαγώνισμα με διαφορετικές ασκήσεις!",
    feedbackCorrect: "🎯 Εξαιρετικά!",
    feedbackExplain: "💡 Επεξήγηση:"
  },
  en: {
    metaTitle: "4th General Review: Chapters 55 to 65 - 6th Grade | LearnMaths.gr",
    metaDesc: "Comprehensive 22-question review test covering Chapters 55 to 65 (Measurement Units, Time, Money, Geometric & Arithmetic Patterns) for 6th Grade.",
    backLinkText: "6th Grade",
    badgeHeader: "🏆 4TH COMPREHENSIVE REVIEW • CHAPTERS 55 - 65 • 6TH GRADE",
    heroTitle: "Review Exam: Measurements, Patterns & Money",
    heroDesc: "22 dynamic questions (2 from each unit 55-65) thoroughly reviewing Units of Measurement (Length, Area, Volume, Weight, Time), Scale, Euro & Interest, as well as Geometric, Arithmetic, and Compound Patterns!",
    newTestBtn: "New Exam",
    questionsBadge: "22 Questions",
    questionLabel: "Question",
    trueBtn: "True",
    falseBtn: "False",
    inputPlaceholder: "Write the answer...",
    finishBtn: "Complete & Grade Exam",
    finalScoreLabel: "Final Score",
    answeredLabel: "Answered",
    percentageLabel: "Percentage",
    footerPrompt: "Answer all 22 questions and press 'Complete & Grade'!",
    newTestWithDifferentBtn: "New Exam with different questions!",
    feedbackCorrect: "🎯 Excellent!",
    feedbackExplain: "💡 Explanation:"
  }
};

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΕΡΩΤΗΣΕΩΝ ΑΝΑ ΕΝΟΤΗΤΑ (ΚΕΦ. 55 ΕΩΣ 65)
// ---------------------------------------------------------

// ΚΕΦΑΛΑΙΟ 55: ΜΟΝΑΔΕΣ ΜΕΤΡΗΣΗΣ ΜΗΚΟΥΣ & ΜΕΤΑΤΡΟΠΕΣ
const POOL_CH55 = [
  (locale) => {
    const isEn = locale === 'en';
    const m = randInt(3, 15);
    const cm = m * 100;
    return {
      title: isEn ? 'Ch. 55 • Length (m to cm)' : 'Κεφ. 55 • Μήκος (m σε cm)',
      prompt: isEn ? `How many centimeters (cm) are in ${m} meters (m)?` : `Πόσα εκατοστά (cm) είναι τα ${m} μέτρα (m);`,
      type: 'input',
      correct: String(cm),
      explain: (
        <span>
          {isEn ? `1 m ＝ 100 cm. Thus: ${m} · 100 ＝ ${cm} cm.` : `1 m ＝ 100 cm. Άρα: ${m} · 100 ＝ ${cm} cm.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const km = randInt(2, 8);
    const m = km * 1000;
    const formatThousand = formatNum(m, locale, 0);
    return {
      title: isEn ? 'Ch. 55 • Length (km to m)' : 'Κεφ. 55 • Μήκος (km σε m)',
      prompt: isEn ? `How many meters (m) are in ${km} kilometers (km)?` : `Πόσα μέτρα (m) είναι τα ${km} χιλιόμετρα (km);`,
      type: 'input',
      correct: String(m),
      explain: (
        <span>
          {isEn ? `1 km ＝ 1,000 m. Thus: ${km} · 1,000 ＝ ${formatThousand} m.` : `1 km ＝ 1.000 m. Άρα: ${km} · 1.000 ＝ ${formatThousand} m.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const mm = randInt(250, 850);
    const cmVal = mm / 10;
    const cm = formatNum(cmVal, locale, 1);
    return {
      title: isEn ? 'Ch. 55 • Length (mm to cm)' : 'Κεφ. 55 • Μήκος (mm σε cm)',
      prompt: isEn ? `Convert ${mm} millimeters (mm) into centimeters (cm):` : `Μετάτρεψε τα ${mm} χιλιοστά (mm) σε εκατοστά (cm):`,
      type: 'input',
      correct: cm,
      explain: (
        <span>
          {isEn ? `1 cm ＝ 10 mm. Divide by 10: ` : `1 cm ＝ 10 mm. Διαιρούμε με το 10: `}
          <Fraction num={String(mm)} den="10" />
          {` ＝ ${cm} cm.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const m = randInt(4, 9);
    const cm = randInt(15, 85);
    const totalCm = m * 100 + cm;
    return {
      title: isEn ? 'Ch. 55 • Compound Length' : 'Κεφ. 55 • Σύνθετο Μήκος',
      prompt: isEn ? `How many total centimeters (cm) are in ${m} m and ${cm} cm?` : `Πόσα εκατοστά (cm) είναι συνολικά τα ${m} m και ${cm} cm;`,
      type: 'input',
      correct: String(totalCm),
      explain: (
        <span>
          {isEn
            ? `(${m} · 100) ＋ ${cm} ＝ ${m * 100} ＋ ${cm} ＝ ${totalCm} cm.`
            : `(${m} · 100) ＋ ${cm} ＝ ${m * 100} ＋ ${cm} ＝ ${totalCm} cm.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const isTrue = Math.random() > 0.5;
    return {
      title: isEn ? 'Ch. 55 • Length Theory' : 'Κεφ. 55 • Θεωρία Μήκους',
      prompt: isEn
        ? (isTrue
            ? 'The decimeter (dm) is 10 times smaller than the meter (1 m ＝ 10 dm).'
            : 'The decimeter (dm) is 100 times larger than the meter.')
        : (isTrue
            ? 'Το δεκατόμετρο (dm) είναι 10 φορές μικρότερο από το μέτρο (1 m ＝ 10 dm).'
            : 'Το δεκατόμετρο (dm) είναι 100 φορές μεγαλύτερο από το μέτρο.'),
      type: 'tf',
      correct: isTrue,
      explain: (
        <span>
          {isEn
            ? (isTrue ? 'Correct! 1 m ＝ 10 dm ＝ 100 cm.' : 'False! 1 m ＝ 10 dm (the decimeter is a subdivision of the meter).')
            : (isTrue ? 'Σωστά! 1 m ＝ 10 dm ＝ 100 cm.' : 'Λάθος! 1 m ＝ 10 dm (το δεκατόμετρο είναι υποδιαίρεση του μέτρου).')}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const m = randInt(350, 850);
    const km = formatNum(m / 1000, locale, 3);
    return {
      title: isEn ? 'Ch. 55 • Meters to Kilometers' : 'Κεφ. 55 • Μέτρα σε Χιλιόμετρα',
      prompt: isEn ? `How many kilometers (km) are in ${m} meters?` : `Πόσα χιλιόμετρα (km) είναι τα ${m} μέτρα;`,
      type: 'input',
      correct: km,
      explain: (
        <span>
          {isEn ? `Divide by 1,000: ` : `Διαιρούμε με το 1.000: `}
          <Fraction num={String(m)} den="1.000" />
          {` ＝ ${km} km.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const dm = randInt(15, 60);
    const cm = dm * 10;
    return {
      title: isEn ? 'Ch. 55 • Decimeters to Centimeters' : 'Κεφ. 55 • Δεκατόμετρα σε Εκατοστά',
      prompt: isEn ? `How many centimeters (cm) are in ${dm} decimeters (dm)?` : `Πόσα εκατοστά (cm) είναι τα ${dm} δεκατόμετρα (dm);`,
      type: 'input',
      correct: String(cm),
      explain: (
        <span>
          {isEn ? `1 dm ＝ 10 cm. Thus: ${dm} · 10 ＝ ${cm} cm.` : `1 dm ＝ 10 cm. Άρα: ${dm} · 10 ＝ ${cm} cm.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const a = randInt(12, 35);
    const b = randInt(8, 25);
    const peri = 2 * (a + b);
    return {
      title: isEn ? 'Ch. 55 • Rectangle Perimeter' : 'Κεφ. 55 • Περίμετρος Ορθογωνίου',
      prompt: isEn ? `A rectangle has length ${a} m and width ${b} m. What is its perimeter (in m)?` : `Ένα ορθογώνιο έχει μήκος ${a} m και πλάτος ${b} m. Πόση είναι η περίμετρός του (σε m);`,
      type: 'input',
      correct: String(peri),
      explain: (
        <span>
          {isEn
            ? `P ＝ 2 · (${a} ＋ ${b}) ＝ 2 · ${a + b} ＝ ${peri} m.`
            : `Π ＝ 2 · (${a} ＋ ${b}) ＝ 2 · ${a + b} ＝ ${peri} m.`}
        </span>
      )
    };
  }
];

// ΚΕΦΑΛΑΙΟ 56: ΜΟΝΑΔΕΣ ΜΕΤΡΗΣΗΣ ΕΠΙΦΑΝΕΙΑΣ (ΕΜΒΑΔΟΝ)
const POOL_CH56 = [
  (locale) => {
    const isEn = locale === 'en';
    const sqm = randInt(2, 8);
    const sqcm = sqm * 10000;
    const formatArea = formatNum(sqcm, locale, 0);
    return {
      title: isEn ? 'Ch. 56 • Area (m² to cm²)' : 'Κεφ. 56 • Επιφάνεια (τ.μ. σε τ.εκ.)',
      prompt: isEn
        ? (
            <span>
              How many square centimeters (cm<sup>2</sup>) are in {sqm} square meters (m<sup>2</sup>)?
            </span>
          )
        : (
            <span>
              Πόσα τετραγωνικά εκατοστά (τ.εκ. / cm<sup>2</sup>) είναι τα {sqm} τετραγωνικά μέτρα (τ.μ. / m<sup>2</sup>);
            </span>
          ),
      type: 'input',
      correct: String(sqcm),
      explain: (
        <span>
          {isEn
            ? <span>1 m<sup>2</sup> ＝ 100 · 100 ＝ 10,000 cm<sup>2</sup>. Thus: {sqm} · 10,000 ＝ {formatArea} cm<sup>2</sup>.</span>
            : <span>1 m<sup>2</sup> ＝ 100 · 100 ＝ 10.000 cm<sup>2</sup>. Άρα: {sqm} · 10.000 ＝ {formatArea} cm<sup>2</sup>.</span>}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const stremma = randInt(3, 12);
    const sqm = stremma * 1000;
    const formatSqm = formatNum(sqm, locale, 0);
    return {
      title: isEn ? 'Ch. 56 • Stremmata to m²' : 'Κεφ. 56 • Στρέμματα σε τ.μ.',
      prompt: isEn
        ? (
            <span>
              How many square meters (m<sup>2</sup>) are in {stremma} stremmata (decares)?
            </span>
          )
        : (
            <span>
              Πόσα τετραγωνικά μέτρα (τ.μ. / m<sup>2</sup>) είναι τα {stremmma ?? stremma} στρέμματα;
            </span>
          ),
      type: 'input',
      correct: String(sqm),
      explain: (
        <span>
          {isEn
            ? <span>1 stremma ＝ 1,000 m<sup>2</sup>. Thus: {stremma} · 1,000 ＝ {formatSqm} m<sup>2</sup>.</span>
            : <span>1 στρέμμα ＝ 1.000 τ.μ. Άρα: {stremma} · 1.000 ＝ {formatSqm} τ.μ.</span>}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const a = randInt(6, 15);
    const area = a * a;
    return {
      title: isEn ? 'Ch. 56 • Square Area' : 'Κεφ. 56 • Εμβαδόν Τετραγώνου',
      prompt: isEn
        ? (
            <span>
              A square plot has a side of {a} m. What is its area in m<sup>2</sup>?
            </span>
          )
        : (
            <span>
              Ένα τετράγωνο οικόπεδο έχει πλευρά {a} m. Πόσο είναι το εμβαδόν του σε τ.μ. (m<sup>2</sup>);
            </span>
          ),
      type: 'input',
      correct: String(area),
      explain: (
        <span>
          {isEn
            ? <span>A ＝ a · a ＝ {a} · {a} ＝ {area} m<sup>2</sup>.</span>
            : <span>Ε ＝ α · α ＝ {a} · {a} ＝ {area} τ.μ.</span>}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const a = randInt(10, 25);
    const b = randInt(4, 12);
    const area = a * b;
    return {
      title: isEn ? 'Ch. 56 • Rectangle Area' : 'Κεφ. 56 • Εμβαδόν Ορθογωνίου',
      prompt: isEn
        ? (
            <span>
              A rectangular room measures {a} m by {b} m. What is its area in m<sup>2</sup>?
            </span>
          )
        : (
            <span>
              Ένα ορθογώνιο δωμάτιο έχει διαστάσεις {a} m επί {b} m. Πόσο είναι το εμβαδόν του σε τ.μ.;
            </span>
          ),
      type: 'input',
      correct: String(area),
      explain: (
        <span>
          {isEn
            ? <span>A ＝ length · width ＝ {a} · {b} ＝ {area} m<sup>2</sup>.</span>
            : <span>Ε ＝ μήκος · πλάτος ＝ {a} · {b} ＝ {area} τ.μ.</span>}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const isTrue = Math.random() > 0.5;
    return {
      title: isEn ? 'Ch. 56 • Area Scale Factor' : 'Κεφ. 56 • Σχέση Μονάδων Επιφάνειας',
      prompt: isEn
        ? (isTrue
            ? 'In area measurement units, each unit is 100 times larger than the immediately smaller unit (e.g. 1 m² ＝ 100 dm²).'
            : 'In area measurement units, each unit is 10 times larger than the immediately smaller unit.')
        : (isTrue
            ? 'Στις μονάδες επιφάνειας, κάθε μονάδα είναι 100 φορές μεγαλύτερη από την αμέσως μικρότερή της (π.χ. 1 m² ＝ 100 dm²).'
            : 'Στις μονάδες επιφάνειας, κάθε μονάδα είναι 10 φορές μεγαλύτερη από την αμέσως μικρότερή της.'),
      type: 'tf',
      correct: isTrue,
      explain: (
        <span>
          {isEn
            ? (isTrue ? 'Correct! Area involves two dimensions: 10 · 10 ＝ 100.' : 'False! In area measurements conversions use factor 100 (1 m² ＝ 100 dm²).')
            : (isTrue ? 'Σωστά! Επειδή μετράμε δύο διαστάσεις: 10 · 10 ＝ 100.' : 'Λάθος! Στις επιφάνειες οι μετατροπές γίνονται με το 100 (1 m² ＝ 100 dm²).')}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const sqm = randInt(2500, 7500);
    const str = formatNum(sqm / 1000, locale, 1);
    return {
      title: isEn ? 'Ch. 56 • m² to Stremmata' : 'Κεφ. 56 • τ.μ. σε Στρέμματα',
      prompt: isEn
        ? (
            <span>
              A field has an area of {formatNum(sqm, locale, 0)} m<sup>2</sup>. How many stremmata (decares) is it?
            </span>
          )
        : (
            <span>
              Ένα αγροτεμάχιο έχει εμβαδόν {formatNum(sqm, locale, 0)} τ.μ. Πόσα στρέμματα είναι;
            </span>
          ),
      type: 'input',
      correct: str,
      explain: (
        <span>
          {isEn ? `Divide by 1,000: ` : `Διαιρούμε με το 1.000: `}
          <Fraction num={String(sqm)} den="1.000" />
          {` ＝ ${str} ${isEn ? 'stremmata' : 'στρέμματα'}.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const base = randInt(8, 16);
    const height = randInt(5, 12);
    const area = (base * height) / 2;
    return {
      title: isEn ? 'Ch. 56 • Triangle Area' : 'Κεφ. 56 • Εμβαδόν Τριγώνου',
      prompt: isEn
        ? (
            <span>
              A triangle has a base of {base} cm and a corresponding height of {height} cm. What is its area (in cm<sup>2</sup>)?
            </span>
          )
        : (
            <span>
              Ένα τρίγωνο έχει βάση {base} cm και αντίστοιχο ύψος {height} cm. Πόσο είναι το εμβαδόν του (σε cm<sup>2</sup>);
            </span>
          ),
      type: 'input',
      correct: String(area),
      explain: (
        <span>
          {isEn ? `A ＝ ` : `Ε ＝ `}
          <Fraction num={`${base} · ${height}`} den="2" />
          {` ＝ ${base * height} : 2 ＝ ${area} cm².`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const sqdm = randInt(4, 15);
    const sqcm = sqdm * 100;
    return {
      title: isEn ? 'Ch. 56 • dm² to cm²' : 'Κεφ. 56 • dm² σε cm²',
      prompt: isEn
        ? (
            <span>
              How many square centimeters (cm<sup>2</sup>) are in {sqdm} square decimeters (dm<sup>2</sup>)?
            </span>
          )
        : (
            <span>
              Πόσα τετραγωνικά εκατοστά (cm<sup>2</sup>) είναι τα {sqdm} τετραγωνικά δεκατόμετρα (dm<sup>2</sup>);
            </span>
          ),
      type: 'input',
      correct: String(sqcm),
      explain: (
        <span>
          {isEn
            ? <span>1 dm<sup>2</sup> ＝ 100 cm<sup>2</sup>. Thus: {sqdm} · 100 ＝ {sqcm} cm<sup>2</sup>.</span>
            : <span>1 dm<sup>2</sup> ＝ 100 cm<sup>2</sup>. Άρα: {sqdm} · 100 ＝ {sqcm} cm<sup>2</sup>.</span>}
        </span>
      )
    };
  }
];

// ΚΕΦΑΛΑΙΟ 57: ΟΓΚΟΣ & ΧΩΡΗΤΙΚΟΤΗΤΑ
const POOL_CH57 = [
  (locale) => {
    const isEn = locale === 'en';
    const l = randInt(2, 9);
    const ml = l * 1000;
    const formatMl = formatNum(ml, locale, 0);
    return {
      title: isEn ? 'Ch. 57 • Liters to ml' : 'Κεφ. 57 • Λίτρα σε ml',
      prompt: isEn ? `How many milliliters (ml) are in ${l} liters (L)?` : `Πόσα χιλιοστόλιτρα (ml) είναι τα ${l} λίτρα (L);`,
      type: 'input',
      correct: String(ml),
      explain: (
        <span>
          {isEn ? `1 L ＝ 1,000 ml. Thus: ${l} · 1,000 ＝ ${formatMl} ml.` : `1 L ＝ 1.000 ml. Άρα: ${l} · 1.000 ＝ ${formatMl} ml.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const a = randInt(3, 7);
    const vol = a * a * a;
    return {
      title: isEn ? 'Ch. 57 • Cube Volume' : 'Κεφ. 57 • Όγκος Κύβου',
      prompt: isEn
        ? (
            <span>
              A cube has an edge of {a} cm. What is its volume in cubic centimeters (cm<sup>3</sup>)?
            </span>
          )
        : (
            <span>
              Ένας κύβος έχει ακμή {a} cm. Πόσος είναι ο όγκος του σε κυβικά εκατοστά (cm<sup>3</sup>);
            </span>
          ),
      type: 'input',
      correct: String(vol),
      explain: (
        <span>
          {isEn
            ? <span>V ＝ a · a · a ＝ {a} · {a} · {a} ＝ {vol} cm<sup>3</sup>.</span>
            : <span>V ＝ α · α · α ＝ {a} · {a} · {a} ＝ {vol} cm<sup>3</sup>.</span>}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const a = randInt(4, 8);
    const b = randInt(3, 5);
    const c = randInt(2, 4);
    const vol = a * b * c;
    return {
      title: isEn ? 'Ch. 57 • Rectangular Prism Volume' : 'Κεφ. 57 • Ορθογώνιο Παραλληλεπίπεδο',
      prompt: isEn
        ? (
            <span>
              A box measures {a} cm in length, {b} cm in width, and {c} cm in height. What is its volume (in cm<sup>3</sup>)?
            </span>
          )
        : (
            <span>
              Ένα κουτί έχει μήκος {a} cm, πλάτος {b} cm και ύψος {c} cm. Πόσος είναι ο όγκος του (σε cm<sup>3</sup>);
            </span>
          ),
      type: 'input',
      correct: String(vol),
      explain: (
        <span>
          {isEn
            ? <span>V ＝ length · width · height ＝ {a} · {b} · {c} ＝ {vol} cm<sup>3</sup>.</span>
            : <span>V ＝ μήκος · πλάτος · ύψος ＝ {a} · {b} · {c} ＝ {vol} cm<sup>3</sup>.</span>}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const isTrue = Math.random() > 0.5;
    return {
      title: isEn ? 'Ch. 57 • Volume & Capacity' : 'Κεφ. 57 • Σχέση Όγκου & Χωρητικότητας',
      prompt: isEn
        ? (isTrue
            ? '1 cubic decimeter (1 dm³) of water holds exactly 1 liter (1 L).'
            : '1 cubic meter (1 m³) holds exactly 1 liter of water.')
        : (isTrue
            ? '1 κυβικό δεκατόμετρο (1 dm³) καθαρού νερού χωράει ακριβώς 1 λίτρο (1 L).'
            : '1 κυβικό μέτρο (1 m³) χωράει ακριβώς 1 λίτρο νερού.'),
      type: 'tf',
      correct: isTrue,
      explain: (
        <span>
          {isEn
            ? (isTrue ? 'Correct! 1 dm³ ＝ 1 L and 1 m³ ＝ 1,000 L.' : 'False! 1 m³ holds 1,000 liters (1 dm³ ＝ 1 L).')
            : (isTrue ? 'Σωστά! 1 dm³ ＝ 1 L και 1 m³ ＝ 1.000 L.' : 'Λάθος! 1 m³ χωράει 1.000 λίτρα (1 dm³ ＝ 1 L).')}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const cbm = randInt(2, 6);
    const liters = cbm * 1000;
    const formatL = formatNum(liters, locale, 0);
    return {
      title: isEn ? 'Ch. 57 • m³ to Liters' : 'Κεφ. 57 • Κυβικά Μέτρα σε Λίτρα',
      prompt: isEn
        ? (
            <span>
              How many liters (L) of water fit in a tank of volume {cbm} m<sup>3</sup>?
            </span>
          )
        : (
            <span>
              Πόσα λίτρα (L) νερού χωράει μια δεξαμενή όγκου {cbm} m<sup>3</sup>;
            </span>
          ),
      type: 'input',
      correct: String(liters),
      explain: (
        <span>
          {isEn
            ? <span>1 m<sup>3</sup> ＝ 1,000 L. Thus: {cbm} · 1,000 ＝ {formatL} L.</span>
            : <span>1 m<sup>3</sup> ＝ 1.000 L. Άρα: {cbm} · 1.000 ＝ {formatL} L.</span>}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const ml = randInt(1500, 4500);
    const l = formatNum(ml / 1000, locale, 2);
    return {
      title: isEn ? 'Ch. 57 • ml to Liters' : 'Κεφ. 57 • ml σε Λίτρα',
      prompt: isEn ? `Convert ${ml} ml into liters (L):` : `Μετάτρεψε τα ${ml} ml σε λίτρα (L):`,
      type: 'input',
      correct: l,
      explain: (
        <span>
          {isEn ? `Divide by 1,000: ` : `Διαιρούμε με το 1.000: `}
          <Fraction num={String(ml)} den="1.000" />
          {` ＝ ${l} L.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const cbdm = randInt(3, 10);
    const cbcm = cbdm * 1000;
    const formatCm = formatNum(cbcm, locale, 0);
    return {
      title: isEn ? 'Ch. 57 • dm³ to cm³' : 'Κεφ. 57 • dm³ σε cm³',
      prompt: isEn
        ? (
            <span>
              How many cubic centimeters (cm<sup>3</sup>) are in {cbdm} cubic decimeters (dm<sup>3</sup>)?
            </span>
          )
        : (
            <span>
              Πόσα κυβικά εκατοστά (cm<sup>3</sup>) είναι τα {cbdm} κυβικά δεκατόμετρα (dm<sup>3</sup>);
            </span>
          ),
      type: 'input',
      correct: String(cbcm),
      explain: (
        <span>
          {isEn
            ? <span>1 dm<sup>3</sup> ＝ 1,000 cm<sup>3</sup>. Thus: {cbdm} · 1,000 ＝ {formatCm} cm<sup>3</sup>.</span>
            : <span>1 dm<sup>3</sup> ＝ 1.000 cm<sup>3</sup>. Άρα: {cbdm} · 1.000 ＝ {formatCm} cm<sup>3</sup>.</span>}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const correctAns = isEn ? '1,000 times larger' : '1.000 φορές μεγαλύτερη';
    const distractors = isEn
      ? ['100 times larger', '10 times larger', '10,000 times larger']
      : ['100 φορές μεγαλύτερη', '10 φορές μεγαλύτερη', '10.000 φορές μεγαλύτερη'];
    return {
      title: isEn ? 'Ch. 57 • Volume Units Ratio' : 'Κεφ. 57 • Κλίμακα Μονάδων Όγκου',
      prompt: isEn ? 'In volume units, each unit compared to the immediately smaller unit is:' : 'Στις μονάδες μέτρησης όγκου, κάθε μονάδα είναι από την αμέσως μικρότερή της:',
      type: 'mcq',
      options: makeUniqueOptions(correctAns, distractors),
      correct: correctAns,
      explain: (
        <span>
          {isEn ? 'Because we multiply 3 dimensions: 10 · 10 · 10 ＝ 1,000.' : 'Επειδή έχουμε 3 διαστάσεις: 10 · 10 · 10 ＝ 1.000.'}
        </span>
      )
    };
  }
];

// ΚΕΦΑΛΑΙΟ 58: ΚΛΙΜΑΚΑ ΣΕ ΧΑΡΤΕΣ & ΣΧΕΔΙΑ
const POOL_CH58 = [
  (locale) => {
    const isEn = locale === 'en';
    const cm = randInt(3, 8);
    const scale = 100000;
    const realKm = (cm * scale) / 100000;
    return {
      title: isEn ? 'Ch. 58 • Map Scale 1:100,000' : 'Κεφ. 58 • Κλίμακα Χάρτη 1:100.000',
      prompt: isEn ? `On a map with scale 1:100,000, the distance between two towns is ${cm} cm. How many kilometers (km) is the real distance?` : `Σε έναν χάρτη με κλίμακα 1:100.000, η απόσταση δύο πόλεων είναι ${cm} cm. Πόσα χιλιόμετρα (km) είναι η πραγματική απόσταση;`,
      type: 'input',
      correct: String(realKm),
      explain: (
        <span>
          {isEn
            ? `${cm} cm on map ＝ ${cm} · 100,000 cm ＝ ${formatNum(cm * 100000, locale, 0)} cm ＝ ${realKm} km.`
            : `${cm} cm στον χάρτη ＝ ${cm} · 100.000 cm ＝ ${formatNum(cm * 100000, locale, 0)} cm ＝ ${realKm} km.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const realM = randInt(15, 45);
    const planCm = realM;
    return {
      title: isEn ? 'Ch. 58 • Architectural Plan Scale 1:100' : 'Κεφ. 58 • Κλίμακα Κατόψεως 1:100',
      prompt: isEn ? `On a floor plan with scale 1:100, a wall has an actual length of ${realM} m. How many centimeters (cm) will it measure on paper?` : `Σε σχέδιο κτιρίου με κλίμακα 1:100, ένας τοίχος έχει πραγματικό μήκος ${realM} m. Πόσα εκατοστά (cm) θα σχεδιαστεί στο χαρτί;`,
      type: 'input',
      correct: String(planCm),
      explain: (
        <span>
          {isEn
            ? `${realM} m ＝ ${realM * 100} cm. Divide by 100: ${realM * 100} : 100 ＝ ${planCm} cm.`
            : `${realM} m ＝ ${realM * 100} cm. Διαιρούμε με το 100: ${realM * 100} : 100 ＝ ${planCm} cm.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const realKm = randInt(40, 120);
    const mapCm = realKm / 20;
    return {
      title: isEn ? 'Ch. 58 • Actual Distance & Map' : 'Κεφ. 58 • Πραγματική Απόσταση & Χάρτης',
      prompt: isEn ? `On a map with scale 1:2,000,000 (1 cm ＝ 20 km), two islands are ${realKm} km apart. How many cm apart are they on the map?` : `Σε χάρτη κλίμακας 1:2.000.000 (1 cm ＝ 20 km), δύο νησιά απέχουν ${realKm} km. Πόσα cm απέχουν στον χάρτη;`,
      type: 'input',
      correct: String(mapCm),
      explain: (
        <span>
          {isEn
            ? `Each 1 cm corresponds to 20 km. Thus: ${realKm} : 20 ＝ ${mapCm} cm.`
            : `Κάθε 1 cm αντιστοιχεί σε 20 km. Άρα: ${realKm} : 20 ＝ ${mapCm} cm.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const correctAns = isEn ? '1 cm on map ＝ 50,000 cm in reality' : '1 cm στο σχέδιο ＝ 50.000 cm στην πραγματικότητα';
    const distractors = isEn
      ? ['1 m on map ＝ 50 km in reality', 'Reality is 500 times larger', 'The drawing is 50,000 times larger than reality']
      : ['1 m στο σχέδιο ＝ 50 km στην πραγματικότητα', 'Η πραγματικότητα είναι 500 φορές μεγαλύτερη', 'Το σχέδιο είναι 50.000 φορές μεγαλύτερο από την πραγματικότητα'];
    return {
      title: isEn ? 'Ch. 58 • Meaning of Scale 1:50,000' : 'Κεφ. 58 • Σημασία Κλίμακας 1:50.000',
      prompt: isEn ? 'What does it mean when a map has a scale of 1:50,000?' : 'Τι σημαίνει ότι ένας χάρτης έχει κλίμακα 1:50.000;',
      type: 'mcq',
      options: makeUniqueOptions(correctAns, distractors),
      correct: correctAns,
      explain: (
        <span>
          {isEn
            ? 'The scale indicates that 1 unit on the map represents 50,000 of the same units in real life.'
            : 'Η κλίμακα δηλώνει ότι 1 μονάδα μήκους στον χάρτη αντιστοιχεί σε 50.000 ίδιες μονάδες στην πραγματικότητα.'}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const isTrue = Math.random() > 0.5;
    return {
      title: isEn ? 'Ch. 58 • Scale Definition' : 'Κεφ. 58 • Θεωρία Κλίμακας',
      prompt: isEn
        ? (isTrue
            ? 'Scale is the ratio of drawing length to actual length: Scale ＝ Map length : Real length.'
            : 'Scale is the product of the drawing length multiplied by actual distance.')
        : (isTrue
            ? 'Η κλίμακα είναι ο λόγος του μήκους στο σχέδιο προς το πραγματικό μήκος: Κλίμακα ＝ Μήκος σχεδίου : Πραγματικό μήκος.'
            : 'Η κλίμακα είναι το γινόμενο του σχεδίου επί την πραγματική απόσταση.'),
      type: 'tf',
      correct: isTrue,
      explain: (
        <span>
          {isEn
            ? (isTrue ? 'Correct! Scale ＝ (map length) : (real length).' : 'False! Scale is a ratio (fraction/division), not a product.')
            : (isTrue ? 'Σωστά! Κλίμακα ＝ (μήκος σχεδίου) : (πραγματικό μήκος).' : 'Λάθος! Η κλίμακα είναι λόγος (διαίρεση/κλάσμα), όχι γινόμενο.')}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const cm = randInt(4, 9);
    const realM = cm * 5;
    return {
      title: isEn ? 'Ch. 58 • Scale 1:500' : 'Κεφ. 58 • Κλίμακα 1:500',
      prompt: isEn ? `On a topographical plan of scale 1:500 (1 cm ＝ 5 m), a yard is drawn with length ${cm} cm. What is its real length in meters?` : `Σε ένα τοπογραφικό διάγραμμα κλίμακας 1:500 (1 cm ＝ 5 m), μια αυλή σχεδιάστηκε με μήκος ${cm} cm. Πόσα μέτρα είναι το πραγματικό της μήκος;`,
      type: 'input',
      correct: String(realM),
      explain: (
        <span>
          {isEn ? `1 cm represents 5 m. Thus: ${cm} · 5 ＝ ${realM} m.` : `1 cm αντιστοιχεί σε 5 m. Άρα: ${cm} · 5 ＝ ${realM} m.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const realKm = randInt(15, 60);
    const mapCm = realKm / 5;
    return {
      title: isEn ? 'Ch. 58 • Scale 1:500,000' : 'Κεφ. 58 • Κλίμακα 1:500.000',
      prompt: isEn ? `On a map of scale 1:500,000 (1 cm ＝ 5 km), two villages are realistically ${realKm} km apart. How many cm apart are they on the map?` : `Σε χάρτη κλίμακας 1:500.000 (1 cm ＝ 5 km), δύο χωριά απέχουν πραγματικά ${realKm} km. Πόσα εκατοστά απέχουν στον χάρτη;`,
      type: 'input',
      correct: String(mapCm),
      explain: (
        <span>
          {isEn ? `${realKm} : 5 ＝ ${mapCm} cm on the map.` : `${realKm} : 5 ＝ ${mapCm} cm στον χάρτη.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const correctAns = isEn ? '1 : 10,000' : '1 : 10.000';
    const distractors = isEn
      ? ['1 : 100,000', '1 : 1,000,000', '1 : 500,000']
      : ['1 : 100.000', '1 : 1.000.000', '1 : 500.000'];
    return {
      title: isEn ? 'Ch. 58 • Greater Scale (Detail)' : 'Κεφ. 58 • Μεγαλύτερη Κλίμακα (Λεπτομέρεια)',
      prompt: isEn ? 'Which of the following scales depicts a map with the greatest detail (largest scale)?' : 'Ποια από τις παρακάτω κλίμακες δείχνει έναν χάρτη με τη μεγαλύτερη λεπτομέρεια (μεγαλύτερη κλίμακα);',
      type: 'mcq',
      options: makeUniqueOptions(correctAns, distractors),
      correct: correctAns,
      explain: (
        <span>
          {isEn
            ? 'The smaller the denominator (1 : 10,000), the larger the scale and the greater the depicted detail.'
            : 'Όσο μικρότερος είναι ο παρονομαστής (1 : 10.000), τόσο μεγαλύτερη είναι η κλίμακα και τόσο περισσότερη λεπτομέρεια απεικονίζεται.'}
        </span>
      )
    };
  }
];

// ΚΕΦΑΛΑΙΟ 59: ΜΕΓΕΘΥΝΣΗ & ΣΜΙΚΡΥΝΣΗ ΣΧΗΜΑΤΩΝ
const POOL_CH59 = [
  (locale) => {
    const isEn = locale === 'en';
    const side = randInt(4, 9);
    const factor = 3;
    const newSide = side * factor;
    return {
      title: isEn ? 'Ch. 59 • Square Enlargement' : 'Κεφ. 59 • Μεγέθυνση Τετραγώνου',
      prompt: isEn ? `A square has side ${side} cm. If we enlarge it by factor 3, what will be its new side in cm?` : `Ένα τετράγωνο έχει πλευρά ${side} cm. Αν το μεγεθύνουμε με συντελεστή 3 (τριπλασιασμός διαστάσεων), πόση θα είναι η νέα πλευρά του σε cm;`,
      type: 'input',
      correct: String(newSide),
      explain: (
        <span>
          {isEn ? `Multiply side length by 3: ${side} · 3 ＝ ${newSide} cm.` : `Πολλαπλασιάζουμε το μήκος της πλευράς επί 3: ${side} · 3 ＝ ${newSide} cm.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const side = randInt(16, 40);
    const newSide = side / 2;
    return {
      title: isEn ? 'Ch. 59 • Reduction by Half' : 'Κεφ. 59 • Σμίκρυνση στο Μισό',
      prompt: isEn ? `A photo has a width of ${side} cm. If we reduce it by half (factor 1/2), what will be its new width?` : `Μια φωτογραφία έχει πλάτος ${side} cm. Αν τη σμικρύνουμε στο μισό (συντελεστής 1/2), πόσο θα είναι το νέο πλάτος της;`,
      type: 'input',
      correct: String(newSide),
      explain: (
        <span>
          {isEn ? `Divide by 2: ${side} : 2 ＝ ${newSide} cm.` : `Διαιρούμε με το 2: ${side} : 2 ＝ ${newSide} cm.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const correctAns = isEn ? 'Quadruples (2 · 2 ＝ 4 times)' : 'Τετραπλασιάζεται (2 · 2 ＝ 4 φορές)';
    const distractors = isEn
      ? ['Doubles (2 times)', 'Remains unchanged', 'Octuples (8 times)']
      : ['Διπλασιάζεται (2 φορές)', 'Παραμένει το ίδιο', 'Οκταπλασιάζεται (8 φορές)'];
    return {
      title: isEn ? 'Ch. 59 • Area upon Doubling Dimensions' : 'Κεφ. 59 • Εμβαδόν σε Διπλασιασμό Διαστάσεων',
      prompt: isEn ? 'If we double both dimensions of a rectangle (length and width times 2), how many times does its area increase?' : 'Αν διπλασιάσουμε όλες τις διαστάσεις ενός ορθογωνίου (μήκος και πλάτος επί 2), πόσες φορές μεγαλώνει το εμβαδόν του;',
      type: 'mcq',
      options: makeUniqueOptions(correctAns, distractors),
      correct: correctAns,
      explain: (
        <span>
          {isEn ? 'Area increases by the square of the linear scale factor: 2 · 2 ＝ 4 times.' : 'Το εμβαδόν μεγαλώνει κατά το τετράγωνο του συντελεστή: 2 · 2 ＝ 4 φορές μεγαλύτερο.'}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const isTrue = Math.random() > 0.5;
    return {
      title: isEn ? 'Ch. 59 • Angles in Scaling' : 'Κεφ. 59 • Γωνίες σε Μεγέθυνση',
      prompt: isEn
        ? (isTrue
            ? 'When enlarging or reducing a shape, its angles remain completely unchanged.'
            : 'When enlarging a triangle, its internal angles grow proportionally.')
        : (isTrue
            ? 'Κατά τη μεγέθυνση ή σμίκρυνση ενός σχήματος, οι γωνίες του παραμένουν ακριβώς οι ίδιες.'
            : 'Κατά τη μεγέθυνση ενός τριγώνου, οι γωνίες του μεγαλώνουν ανάλογα.'),
      type: 'tf',
      correct: isTrue,
      explain: (
        <span>
          {isEn
            ? (isTrue ? 'Correct! In similar shapes angles stay identical; only side lengths change.' : 'False! Angles never change during scaling.')
            : (isTrue ? 'Σωστά! Στα όμοια σχήματα οι γωνίες παραμένουν ίσες, μόνο τα μήκη των πλευρών αλλάζουν.' : 'Λάθος! Οι γωνίες δεν αλλάζουν ποτέ κατά τη μεγέθυνση ή σμίκρυνση.')}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const a = randInt(5, 10);
    const b = randInt(3, 7);
    const origPeri = 2 * (a + b);
    const newPeri = origPeri * 2;
    return {
      title: isEn ? 'Ch. 59 • Perimeter in Scaling' : 'Κεφ. 59 • Περίμετρος σε Μεγέθυνση',
      prompt: isEn ? `A rectangle has dimensions ${a} cm and ${b} cm (perimeter ${origPeri} cm). If we double its dimensions, what will be the new perimeter?` : `Ένα ορθογώνιο έχει διαστάσεις ${a} cm και ${b} cm (περίμετρος ${origPeri} cm). Αν διπλασιάσουμε τις διαστάσεις του, πόση θα είναι η νέα περίμετρος;`,
      type: 'input',
      correct: String(newPeri),
      explain: (
        <span>
          {isEn ? `Perimeter doubles: ${origPeri} · 2 ＝ ${newPeri} cm.` : `Η περίμετρος διπλασιάζεται: ${origPeri} · 2 ＝ ${newPeri} cm.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const origL = randInt(20, 50);
    const newL = origL * 4;
    return {
      title: isEn ? 'Ch. 59 • Quadrupling Length' : 'Κεφ. 59 • Τετραπλασιασμός Μήκους',
      prompt: isEn ? `A segment of length ${origL} cm is enlarged by a factor of 4. What is its new length in cm?` : `Μια γραμμή μήκους ${origL} cm μεγεθύνεται με συντελεστή 4. Πόσο είναι το νέο μήκος της σε cm;`,
      type: 'input',
      correct: String(newL),
      explain: (
        <span>
          {isEn ? `${origL} · 4 ＝ ${newL} cm.` : `${origL} · 4 ＝ ${newL} cm.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const correctAns = isEn ? 'Remains 60°' : 'Παραμένει 60°';
    const distractors = isEn
      ? ['Becomes 120°', 'Becomes 180°', 'Becomes 30°']
      : ['Γίνεται 120°', 'Γίνεται 180°', 'Γίνεται 30°'];
    return {
      title: isEn ? 'Ch. 59 • Equilateral Triangle & Scaling' : 'Κεφ. 59 • Ισόπλευρο Τρίγωνο & Μεγέθυνση',
      prompt: isEn ? 'An equilateral triangle has internal angles of 60°. If we double its sides, what will each angle of the new triangle measure?' : 'Ένα ισόπλευρο τρίγωνο έχει γωνίες 60°. Αν διπλασιάσουμε τις πλευρές του, πόση θα είναι κάθε γωνία του νέου τριγώνου;',
      type: 'mcq',
      options: makeUniqueOptions(correctAns, distractors),
      correct: correctAns,
      explain: (
        <span>
          {isEn ? 'Angles of an equilateral triangle are always 60°, irrespective of scale.' : 'Οι γωνίες ενός ισόπλευρου τριγώνου είναι πάντα 60°, ανεξάρτητα από το μέγεθός του.'}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const origSide = randInt(24, 60);
    const newSide = origSide / 3;
    return {
      title: isEn ? 'Ch. 59 • Reduction by 1/3' : 'Κεφ. 59 • Σμίκρυνση στο 1/3',
      prompt: isEn ? `A square of side ${origSide} cm is reduced by factor 1/3. What is its new side length?` : `Ένα τετράγωνο πλευράς ${origSide} cm σμικρύνεται με συντελεστή 1/3. Πόση είναι η νέα πλευρά του;`,
      type: 'input',
      correct: String(newSide),
      explain: (
        <span>
          {isEn ? `${origSide} : 3 ＝ ${newSide} cm.` : `${origSide} : 3 ＝ ${newSide} cm.`}
        </span>
      )
    };
  }
];

// ΚΕΦΑΛΑΙΟ 60: ΜΟΝΑΔΕΣ ΜΕΤΡΗΣΗΣ ΒΑΡΟΥΣ (ΜΑΖΑΣ)
const POOL_CH60 = [
  (locale) => {
    const isEn = locale === 'en';
    const t = randInt(2, 7);
    const kg = t * 1000;
    const formatKg = formatNum(kg, locale, 0);
    return {
      title: isEn ? 'Ch. 60 • Tonnes to Kilograms' : 'Κεφ. 60 • Τόνοι σε Κιλά',
      prompt: isEn ? `How many kilograms (kg) are in ${t} tonnes (t)?` : `Πόσα κιλά (kg) είναι οι ${t} τόνοι (t);`,
      type: 'input',
      correct: String(kg),
      explain: (
        <span>
          {isEn ? `1 t ＝ 1,000 kg. Thus: ${t} · 1,000 ＝ ${formatKg} kg.` : `1 t ＝ 1.000 kg. Άρα: ${t} · 1.000 ＝ ${formatKg} kg.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const kg = randInt(3, 12);
    const g = kg * 1000;
    const formatG = formatNum(g, locale, 0);
    return {
      title: isEn ? 'Ch. 60 • Kilograms to Grams' : 'Κεφ. 60 • Κιλά σε Γραμμάρια',
      prompt: isEn ? `How many grams (g) are in ${kg} kilograms (kg)?` : `Πόσα γραμμάρια (g) είναι τα ${kg} κιλά (kg);`,
      type: 'input',
      correct: String(g),
      explain: (
        <span>
          {isEn ? `1 kg ＝ 1,000 g. Thus: ${kg} · 1,000 ＝ ${formatG} g.` : `1 kg ＝ 1.000 g. Άρα: ${kg} · 1.000 ＝ ${formatG} g.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const gross = randInt(18, 25);
    const tare = 2;
    const net = gross - tare;
    return {
      title: isEn ? 'Ch. 60 • Net Weight' : 'Κεφ. 60 • Καθαρό Βάρος',
      prompt: isEn ? `A crate of apples has gross weight ${gross} kg. If the empty crate (tare) weighs ${tare} kg, what is the net weight of the apples?` : `Ένα τελάρο με μήλα έχει μικτό βάρος ${gross} kg. Αν το άδειο τελάρο (απόβαρο) ζυγίζει ${tare} kg, ποιο είναι το καθαρό βάρος των μήλων;`,
      type: 'input',
      correct: String(net),
      explain: (
        <span>
          {isEn
            ? `Net Weight ＝ Gross Weight － Tare ＝ ${gross} － ${tare} ＝ ${net} kg.`
            : `Καθαρό Βάρος ＝ Μικτό Βάρος － Απόβαρο ＝ ${gross} － ${tare} ＝ ${net} kg.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const isTrue = Math.random() > 0.5;
    return {
      title: isEn ? 'Ch. 60 • Gross Weight Definition' : 'Κεφ. 60 • Ορισμός Μικτού Βάρους',
      prompt: isEn
        ? (isTrue
            ? 'Gross weight refers to the total weight of the goods together with packaging (Net ＋ Tare).'
            : 'Gross weight refers only to the weight of packaging without contents.')
        : (isTrue
            ? 'Μικτό βάρος ονομάζεται το συνολικό βάρος του εμπορεύματος μαζί με τη συσκευασία του (Καθαρό ＋ Απόβαρο).'
            : 'Μικτό βάρος είναι το βάρος μόνο της συσκευασίας χωρίς το περιεχόμενο.'),
      type: 'tf',
      correct: isTrue,
      explain: (
        <span>
          {isEn
            ? (isTrue ? 'Correct! Gross ＝ Net ＋ Tare.' : 'False! The weight of packaging alone is called tare.')
            : (isTrue ? 'Σωστά! Μικτό ＝ Καθαρό ＋ Απόβαρο.' : 'Λάθος! Το βάρος μόνο της συσκευασίας ονομάζεται απόβαρο (τάρα).')}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const g = randInt(1500, 6500);
    const kg = formatNum(g / 1000, locale, 2);
    return {
      title: isEn ? 'Ch. 60 • Grams to Kilograms' : 'Κεφ. 60 • Γραμμάρια σε Κιλά',
      prompt: isEn ? `Convert ${g} grams (g) into kilograms (kg):` : `Μετάτρεψε τα ${g} γραμμάρια (g) σε κιλά (kg):`,
      type: 'input',
      correct: kg,
      explain: (
        <span>
          {isEn ? `Divide by 1,000: ` : `Διαιρούμε με το 1.000: `}
          <Fraction num={String(g)} den="1.000" />
          {` ＝ ${kg} kg.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const g = randInt(3, 15);
    const mg = g * 1000;
    const formatMg = formatNum(mg, locale, 0);
    return {
      title: isEn ? 'Ch. 60 • Grams to Milligrams' : 'Κεφ. 60 • Γραμμάρια σε Χιλιοστόγραμμα',
      prompt: isEn ? `How many milligrams (mg) are in ${g} grams (g)?` : `Πόσα χιλιοστόγραμμα (mg) είναι τα ${g} γραμμάρια (g);`,
      type: 'input',
      correct: String(mg),
      explain: (
        <span>
          {isEn ? `1 g ＝ 1,000 mg. Thus: ${g} · 1,000 ＝ ${formatMg} mg.` : `1 g ＝ 1.000 mg. Άρα: ${g} · 1.000 ＝ ${formatMg} mg.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const net = randInt(15, 30);
    const tare = 3;
    const gross = net + tare;
    return {
      title: isEn ? 'Ch. 60 • Gross Weight Calculation' : 'Κεφ. 60 • Υπολογισμός Μικτού Βάρους',
      prompt: isEn ? `The net weight of a cargo is ${net} kg and the tare is ${tare} kg. What is the gross weight in kg?` : `Το καθαρό βάρος ενός φορτίου είναι ${net} kg και το απόβαρο είναι ${tare} kg. Πόσο είναι το μικτό βάρος σε kg;`,
      type: 'input',
      correct: String(gross),
      explain: (
        <span>
          {isEn ? `Gross ＝ Net ＋ Tare ＝ ${net} ＋ ${tare} ＝ ${gross} kg.` : `Μικτό ＝ Καθαρό ＋ Απόβαρο ＝ ${net} ＋ ${tare} ＝ ${gross} kg.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const correctAns = isEn ? 'The kilogram (kg)' : 'Το χιλιόγραμμο (κιλό - kg)';
    const distractors = isEn
      ? ['The gram (g)', 'The tonne (t)', 'The milligram (mg)']
      : ['Το γραμμάριο (g)', 'Ο τόνος (t)', 'Το χιλιοστόγραμμο (mg)'];
    return {
      title: isEn ? 'Ch. 60 • Base Weight Unit' : 'Κεφ. 60 • Βασική Μονάδα Βάρους',
      prompt: isEn ? 'Which is the base unit of weight (mass) measurement in daily life?' : 'Ποια είναι η βασική μονάδα μέτρησης του βάρους (μάζας) στην καθημερινή μας ζωή;',
      type: 'mcq',
      options: makeUniqueOptions(correctAns, distractors),
      correct: correctAns,
      explain: (
        <span>
          {isEn ? 'The base unit of measurement is the kilogram (kg).' : 'Βασική μονάδα μέτρησης είναι το χιλιόγραμμο (κιλό - kg).'}
        </span>
      )
    };
  }
];

// ΚΕΦΑΛΑΙΟ 61: ΜΟΝΑΔΕΣ ΜΕΤΡΗΣΗΣ ΧΡΟΝΟΥ
const POOL_CH61 = [
  (locale) => {
    const isEn = locale === 'en';
    const h = randInt(2, 5);
    const m = h * 60;
    return {
      title: isEn ? 'Ch. 61 • Hours to Minutes' : 'Κεφ. 61 • Ώρες σε Λεπτά',
      prompt: isEn ? `How many minutes (min) are in ${h} hours (h)?` : `Πόσα λεπτά (min) είναι οι ${h} ώρες (h);`,
      type: 'input',
      correct: String(m),
      explain: (
        <span>
          {isEn ? `1 h ＝ 60 min. Thus: ${h} · 60 ＝ ${m} min.` : `1 h ＝ 60 min. Άρα: ${h} · 60 ＝ ${m} min.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const m = randInt(5, 25);
    const s = m * 60;
    return {
      title: isEn ? 'Ch. 61 • Minutes to Seconds' : 'Κεφ. 61 • Λεπτά σε Δευτερόλεπτα',
      prompt: isEn ? `How many seconds (s) are in ${m} minutes (min)?` : `Πόσα δευτερόλεπτα (s) είναι τα ${m} λεπτά (min);`,
      type: 'input',
      correct: String(s),
      explain: (
        <span>
          {isEn ? `1 min ＝ 60 s. Thus: ${m} · 60 ＝ ${s} s.` : `1 min ＝ 60 s. Άρα: ${m} · 60 ＝ ${s} s.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const isTrue = Math.random() > 0.5;
    return {
      title: isEn ? 'Ch. 61 • Decimal Hours' : 'Κεφ. 61 • Δεκαδική Ώρα',
      prompt: isEn
        ? (isTrue
            ? '1.5 hours is equivalent to 1 hour and 30 minutes (not 1 hour and 50 minutes).'
            : '1.5 hours is equivalent to 1 hour and 50 minutes because 5 represents 50 minutes.')
        : (isTrue
            ? 'Ο χρόνος 1,5 ώρα ισοδυναμεί με 1 ώρα και 30 λεπτά (και όχι 1 ώρα και 50 λεπτά).'
            : 'Ο χρόνος 1,5 ώρα ισοδυναμεί με 1 ώρα και 50 λεπτά επειδή το 5 σημαίνει 50 λεπτά.'),
      type: 'tf',
      correct: isTrue,
      explain: (
        <span>
          {isEn
            ? (isTrue ? 'Correct! 0.5 of an hour is half of 60 minutes (30 min).' : 'False! 1.5 h ＝ 1 h 30 min (one hour and a half).')
            : (isTrue ? 'Σωστά! Το 0,5 της ώρας είναι τα μισά των 60 λεπτών (30 min).' : 'Λάθος! 1,5 h ＝ 1 h 30 min (μισή ώρα).')}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const yearPool = [
      { y: 1821, c: 19 },
      { y: 1453, c: 15 },
      { y: 1940, c: 20 },
      { y: 2024, c: 21 },
      { y: 1789, c: 18 }
    ];
    const item = yearPool[randInt(0, yearPool.length - 1)];
    return {
      title: isEn ? 'Ch. 61 • Determining Century' : 'Κεφ. 61 • Εύρεση Αιώνα',
      prompt: isEn ? `In which century does year ${item.y} belong? (Type the century number only, e.g. ${item.c}):` : `Σε ποιον αιώνα ανήκει το έτος ${item.y}; (Γράψε μόνο τον αριθμό του αιώνα, π.χ. ${item.c}):`,
      type: 'input',
      correct: String(item.c),
      explain: (
        <span>
          {isEn
            ? `For year ${item.y}, add 1 to leading digits (${Math.floor(item.y / 100)} ＋ 1) ➔ ${item.c}th century.`
            : `Για το έτος ${item.y}, προσθέτουμε 1 στα πρώτα ψηφία (${Math.floor(item.y / 100)} ＋ 1) ➔ ${item.c}ος αιώνας.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const gmt = randInt(9, 14);
    const athens = gmt + 2;
    const correctAns = `${athens}:00`;
    const distractors = [
      `${gmt}:00`,
      `${(gmt - 2 + 24) % 24}:00`,
      `${(athens + 2) % 24}:00`
    ];
    return {
      title: isEn ? 'Ch. 61 • Greenwich & Athens Time' : 'Κεφ. 61 • Ώρα Greenwich & Αθήνα',
      prompt: isEn ? `When it is ${gmt}:00 at Greenwich (UTC 0), what time is it in Athens (UTC＋2)?` : `Όταν στο Greenwich (UTC 0) είναι ${gmt}:00, τι ώρα είναι στην Αθήνα (UTC＋2);`,
      type: 'mcq',
      options: makeUniqueOptions(correctAns, distractors),
      correct: correctAns,
      explain: (
        <span>
          {isEn
            ? `Athens is 2 hours ahead of Greenwich: ${gmt}:00 ＋ 2 hours ＝ ${athens}:00.`
            : `Η Αθήνα είναι 2 ώρες μπροστά από το Greenwich: ${gmt}:00 ＋ 2 ώρες ＝ ${athens}:00.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const correctAns = isEn ? '3,600 seconds' : '3.600 δευτερόλεπτα';
    const distractors = isEn
      ? ['600 seconds', '6,000 seconds', '60 seconds']
      : ['600 δευτερόλεπτα', '6.000 δευτερόλεπτα', '60 δευτερόλεπτα'];
    return {
      title: isEn ? 'Ch. 61 • Seconds in an Hour' : 'Κεφ. 61 • Δευτερόλεπτα μίας Ώρας',
      prompt: isEn ? 'How many seconds (s) are in 1 full hour (h)?' : 'Πόσα δευτερόλεπτα (s) περιέχει 1 ολόκληρη ώρα (h);',
      type: 'mcq',
      options: makeUniqueOptions(correctAns, distractors),
      correct: correctAns,
      explain: (
        <span>
          {isEn ? '1 h ＝ 60 min ＝ 60 · 60 s ＝ 3,600 s.' : '1 h ＝ 60 min ＝ 60 · 60 s ＝ 3.600 s.'}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const isTrue = Math.random() > 0.5;
    return {
      title: isEn ? 'Ch. 61 • Leap Year' : 'Κεφ. 61 • Δίσεκτο Έτος',
      prompt: isEn
        ? (isTrue
            ? 'A leap year has 366 days and occurs every 4 years.'
            : 'A leap year has 365 days and February has 28 days.')
        : (isTrue
            ? 'Το δίσεκτο έτος έχει 366 ημέρες και συμβαίνει κάθε 4 χρόνια.'
            : 'Το δίσεκτο έτος έχει 365 ημέρες και ο Φεβρουάριος έχει 28 ημέρες.'),
      type: 'tf',
      correct: isTrue,
      explain: (
        <span>
          {isEn
            ? (isTrue ? 'Correct! In a leap year February has 29 days.' : 'False! A leap year has 366 days.')
            : (isTrue ? 'Σωστά! Στο δίσεκτο έτος ο Φεβρουάριος έχει 29 ημέρες.' : 'Λάθος! Το δίσεκτο έτος έχει 366 ημέρες.')}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const d = randInt(2, 6);
    const h = d * 24;
    return {
      title: isEn ? 'Ch. 61 • Days to Hours' : 'Κεφ. 61 • Ημέρες σε Ώρες',
      prompt: isEn ? `How many hours are in ${d} days (24-hour periods)?` : `Πόσες ώρες περιέχονται σε ${d} ημέρες (24ωρα);`,
      type: 'input',
      correct: String(h),
      explain: (
        <span>
          {isEn ? `${d} · 24 ＝ ${h} hours.` : `${d} · 24 ＝ ${h} ώρες.`}
        </span>
      )
    };
  }
];

// ΚΕΦΑΛΑΙΟ 62: ΤΟ ΕΥΡΩ, ΜΕΤΑΤΡΟΠΕΣ, ΤΟΚΟΣ & ΕΠΙΤΟΚΙΟ
const POOL_CH62 = [
  (locale) => {
    const isEn = locale === 'en';
    const e = randInt(3, 9);
    const c = 50;
    const totalC = e * 100 + c;
    const euroStr = isEn ? `${e}.50` : `${e},50`;
    return {
      title: isEn ? 'Ch. 62 • Euros to Cents' : 'Κεφ. 62 • Ευρώ σε Λεπτά',
      prompt: isEn ? `How many cents are in ${euroStr} €?` : `Πόσα λεπτά είναι το χρηματικό ποσό των ${euroStr} €;`,
      type: 'input',
      correct: String(totalC),
      explain: (
        <span>
          {isEn ? `${euroStr} · 100 ＝ ${totalC} cents.` : `${euroStr} · 100 ＝ ${totalC} λεπτά.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const cents = randInt(350, 850);
    const euros = formatNum(cents / 100, locale, 2);
    return {
      title: isEn ? 'Ch. 62 • Cents to Euros' : 'Κεφ. 62 • Λεπτά σε Ευρώ',
      prompt: isEn ? `Write ${cents} cents as a decimal euro amount (€):` : `Γράψε τα ${cents} λεπτά σε δεκαδική μορφή ευρώ (€):`,
      type: 'input',
      correct: euros,
      explain: (
        <span>
          {isEn ? `Divide by 100: ` : `Διαιρούμε με το 100: `}
          <Fraction num={String(cents)} den="100" />
          {` ＝ ${euros} €.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const paid = 10;
    const cost = randInt(4, 8) + 0.4;
    const changeVal = Number((paid - cost).toFixed(2));
    const change = formatNum(changeVal, locale, 2);
    const costStr = formatNum(cost, locale, 2);
    return {
      title: isEn ? 'Ch. 62 • Change from 10€' : 'Κεφ. 62 • Ρέστα από 10€',
      prompt: isEn ? `We bought goods worth ${costStr} € and paid with a ${paid} € banknote. How much change will we receive?` : `Αγοράσαμε προϊόντα αξίας ${costStr} € και πληρώσαμε με χαρτονόμισμα των ${paid} €. Πόσα ρέστα θα πάρουμε;`,
      type: 'input',
      correct: change,
      explain: (
        <span>
          {isEn ? `${paid}.00 － ${costStr} ＝ ${change} €.` : `${paid},00 － ${costStr} ＝ ${change} €.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const cap = 1000;
    const r = randInt(2, 5);
    const interest = (cap * r) / 100;
    return {
      title: isEn ? 'Ch. 62 • Annual Interest Calculation' : 'Κεφ. 62 • Υπολογισμός Ετήσιου Τόκου',
      prompt: isEn ? `A capital of ${formatNum(cap, locale, 0)} € is deposited for 1 year at rate ${r}%. How much interest (in €) will it yield?` : `Ένα κεφάλαιο ${formatNum(cap, locale, 0)} € κατατίθεται για 1 έτος με επιτόκιο ${r}%. Πόσο τόκο (σε €) θα αποδώσει;`,
      type: 'input',
      correct: String(interest),
      explain: (
        <span>
          {isEn ? `I ＝ ` : `Τ ＝ `}
          <Fraction num={`${formatNum(cap, locale, 0)} · ${r}`} den="100" />
          {` ＝ ${interest} €.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const correctAns = isEn ? 'I ＝ (C · R · t) : 100' : 'Τ ＝ (Κ · Ε · χ) : 100';
    const distractors = isEn
      ? ['I ＝ (C ＋ R ＋ t) : 100', 'I ＝ (C · 100) : R', 'I ＝ (C · R) : t']
      : ['Τ ＝ (Κ ＋ Ε ＋ χ) : 100', 'Τ ＝ (Κ · 100) : Ε', 'Τ ＝ (Κ · Ε) : χ'];
    return {
      title: isEn ? 'Ch. 62 • Interest Formula' : 'Κεφ. 62 • Τύπος Τόκου',
      prompt: isEn ? 'Which is the correct formula to calculate simple interest?' : 'Ποιος είναι ο σωστός τύπος για τον υπολογισμό του απλού τόκου;',
      type: 'mcq',
      options: makeUniqueOptions(correctAns, distractors),
      correct: correctAns,
      explain: (
        <span>
          {isEn
            ? 'Simple interest is computed as I ＝ (C · R · t) : 100.'
            : 'Ο τόκος υπολογίζεται ως Τ ＝ (Κ · Ε · χ) : 100.'}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const isTrue = Math.random() > 0.5;
    return {
      title: isEn ? 'Ch. 62 • Interest Rate Definition' : 'Κεφ. 62 • Έννοια Επιτοκίου',
      prompt: isEn
        ? (isTrue
            ? 'Interest rate is the annual interest earned on 100 € over a period of 1 year.'
            : 'Interest rate is the total principal deposited in the bank.')
        : (isTrue
            ? 'Επιτόκιο είναι ο τόκος που αποδίδουν 100 € για χρονικό διάστημα 1 έτους.'
            : 'Επιτόκιο είναι το συνολικό ποσό που καταθέτουμε στην τράπεζα.'),
      type: 'tf',
      correct: isTrue,
      explain: (
        <span>
          {isEn
            ? (isTrue ? 'Correct! Interest rate is expressed as a percentage per hundred.' : 'False! The initial deposited sum is called principal.')
            : (isTrue ? 'Σωστά! Το επιτόκιο εκφράζεται ως ποσοστό στα 100.' : 'Λάθος! Το αρχικό ποσό ονομάζεται κεφάλαιο.')}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const cap = 2000;
    const r = 3;
    const intVal = (cap * r) / 100;
    const total = cap + intVal;
    return {
      title: isEn ? 'Ch. 62 • Total Balance' : 'Κεφ. 62 • Τελικό Ποσό',
      prompt: isEn ? `We deposit ${formatNum(cap, locale, 0)} € at rate ${r}% for 1 year (interest ${intVal} €). How much money will we have in total at year end?` : `Καταθέτουμε ${formatNum(cap, locale, 0)} € με επιτόκιο ${r}% για 1 έτος (τόκος ${intVal} €). Πόσα χρήματα θα έχουμε συνολικά στο τέλος του έτους;`,
      type: 'input',
      correct: String(total),
      explain: (
        <span>
          {isEn
            ? `Total Balance ＝ Principal ＋ Interest ＝ ${formatNum(cap, locale, 0)} ＋ ${intVal} ＝ ${formatNum(total, locale, 0)} €.`
            : `Τελικό Ποσό ＝ Κεφάλαιο ＋ Τόκος ＝ ${formatNum(cap, locale, 0)} ＋ ${intVal} ＝ ${formatNum(total, locale, 0)} €.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const isTrue = Math.random() > 0.5;
    return {
      title: isEn ? 'Ch. 62 • Decimal Cents' : 'Κεφ. 62 • Δεκαδικά Λεπτά',
      prompt: isEn
        ? (isTrue
            ? '3.05 € represents 3 euros and 5 cents (not 50 cents).'
            : '3.05 € represents 3 euros and 50 cents.')
        : (isTrue
            ? 'Το ποσό 3,05 € σημαίνει 3 ευρώ και 5 λεπτά (και όχι 50 λεπτά).'
            : 'Το ποσό 3,05 € σημαίνει 3 ευρώ και 50 λεπτά.'),
      type: 'tf',
      correct: isTrue,
      explain: (
        <span>
          {isEn
            ? (isTrue ? 'Correct! 0.05 € ＝ 5 cents. Fifty cents is written as 0.50 €.' : 'False! 3.05 € denotes 3 euros and 5 cents.')
            : (isTrue ? 'Σωστά! 0,05 € ＝ 5 λεπτά. Τα 50 λεπτά γράφονται 0,50 €.' : 'Λάθος! 3,05 € σημαίνει 3 ευρώ και 5 λεπτά.')}
        </span>
      )
    };
  }
];

// ΚΕΦΑΛΑΙΟ 63: ΓΕΩΜΕΤΡΙΚΑ ΜΟΤΙΒΑ & ΠΛΑΚΟΣΤΡΩΣΕΙΣ
const POOL_CH63 = [
  (locale) => {
    const isEn = locale === 'en';
    const n = randInt(5, 12);
    const count = n * n;
    return {
      title: isEn ? 'Ch. 63 • Square Pattern (n²)' : 'Κεφ. 63 • Τετραγωνικό Μοτίβο (n²)',
      prompt: isEn ? `In a square dot pattern of dimensions ${n} by ${n}, how many total dots are there?` : `Σε ένα τετραγωνικό μοτίβο τελειών διαστάσεων ${n} επί ${n}, πόσες τελείες υπάρχουν συνολικά;`,
      type: 'input',
      correct: String(count),
      explain: (
        <span>
          {isEn ? `Rule n · n: ${n} · ${n} ＝ ${count} dots.` : `Κανόνας n · n: ${n} · ${n} ＝ ${count} τελείες.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const correctAns = isEn ? 'Equilateral triangles, squares, and regular hexagons' : 'Ισόπλευρα τρίγωνα, τετράγωνα και κανονικά εξάγωνα';
    const distractors = isEn
      ? ['Squares and circles only', 'Regular pentagons and octagons', 'All regular polygons']
      : ['Μόνο τετράγωνα και κύκλοι', 'Κανονικά πεντάγωνα και οκτάγωνα', 'Όλα τα κανονικά πολύγωνα'];
    return {
      title: isEn ? 'Ch. 63 • Regular Tessellations' : 'Κεφ. 63 • Κανονικές Πλακοστρώσεις',
      prompt: isEn ? 'Which regular polygons can tile the plane on their own without leaving gaps?' : 'Ποια κανονικά πολύγωνα μπορούν μόνα τους να πλακοστρώσουν το επίπεδο χωρίς να αφήνουν καθόλου κενά;',
      type: 'mcq',
      options: makeUniqueOptions(correctAns, distractors),
      correct: correctAns,
      explain: (
        <span>
          {isEn
            ? 'Only these 3 regular polygons have angles dividing 360° exactly (60°, 90°, 120°).'
            : 'Μόνο αυτά τα 3 κανονικά πολύγωνα έχουν γωνίες που διαιρούν ακριβώς τις 360° (60°, 90°, 120°).'}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const isTrue = Math.random() > 0.5;
    return {
      title: isEn ? 'Ch. 63 • Tessellation Angles' : 'Κεφ. 63 • Γωνίες Πλακόστρωσης',
      prompt: isEn
        ? (isTrue
            ? 'In a gapless tessellation, the sum of angles meeting at each shared vertex always equals 360°.'
            : 'In a tessellation, the sum of angles meeting at each shared vertex equals 180°.')
        : (isTrue
            ? 'Σε μια πλακόστρωση χωρίς κενά, το άθροισμα των γωνιών γύρω από κάθε κοινή κορυφή ισούται πάντα με 360°.'
            : 'Σε μια πλακόστρωση, το άθροισμα των γωνιών γύρω από κάθε κοινή κορυφή ισούται με 180°.'),
      type: 'tf',
      correct: isTrue,
      explain: (
        <span>
          {isEn
            ? (isTrue ? 'Correct! A full 360° angle must be completed.' : 'False! It must be exactly 360°.')
            : (isTrue ? 'Σωστά! Πρέπει να καλύπτεται πλήρης γωνία 360°.' : 'Λάθος! Πρέπει να είναι ακριβώς 360°.')}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const n = randInt(6, 12);
    const matches = 3 * n + 1;
    return {
      title: isEn ? 'Ch. 63 • Matchstick Pattern (3n ＋ 1)' : 'Κεφ. 63 • Μοτίβο με Σπίρτα (3n ＋ 1)',
      prompt: isEn ? `In a row of connected squares using matchsticks, the count is given by 3 · n ＋ 1. How many matchsticks are needed for n ＝ ${n} squares?` : `Σε μια σειρά ενωμένων τετραγώνων με σπίρτα, ο αριθμός των σπίρτων δίνεται από τον τύπο 3 · n ＋ 1. Πόσα σπίρτα χρειάζονται για n ＝ ${n} τετράγωνα;`,
      type: 'input',
      correct: String(matches),
      explain: (
        <span>
          {isEn ? `(3 · ${n}) ＋ 1 ＝ ${3 * n} ＋ 1 ＝ ${matches} matchsticks.` : `(3 · ${n}) ＋ 1 ＝ ${3 * n} ＋ 1 ＝ ${matches} σπίρτα.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const isTrue = Math.random() > 0.5;
    return {
      title: isEn ? 'Ch. 63 • Bee Honeycomb' : 'Κεφ. 63 • Κηρήθρα Μελισσών',
      prompt: isEn
        ? (isTrue
            ? 'Bees construct honeycombs with regular hexagons because they provide maximum volume with minimum wax.'
            : 'Bees construct honeycombs with regular pentagons.')
        : (isTrue
            ? 'Οι μέλισσες κατασκευάζουν τις κηρήθρες με κανονικά εξάγωνα επειδή εξασφαλίζουν μέγιστο χώρο με ελάχιστο κερί.'
            : 'Οι μέλισσες κατασκευάζουν κηρήθρες με κανονικά πεντάγωνα.'),
      type: 'tf',
      correct: isTrue,
      explain: (
        <span>
          {isEn
            ? (isTrue ? 'Correct! The regular hexagon is nature\'s most efficient structure.' : 'False! They use regular hexagons.')
            : (isTrue ? 'Σωστά! Το εξάγωνο είναι η πιο αποδοτική δομή της φύσης.' : 'Λάθος! Χρησιμοποιούν κανονικά εξάγωνα.')}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const pos = randInt(41, 69);
    const rem = pos % 4;
    const shapes = isEn ? ['Triangle', 'Circle', 'Square', 'Rhombus'] : ['Τρίγωνο', 'Κύκλος', 'Τετράγωνο', 'Ρόμβος'];
    const ans = shapes[rem === 0 ? 3 : rem - 1];
    const distractors = shapes.filter((s) => s !== ans);
    return {
      title: isEn ? 'Ch. 63 • 4-Shape Repeating Pattern' : 'Κεφ. 63 • Κυκλικό Μοτίβο 4 Σχημάτων',
      prompt: isEn ? `In a repeating pattern: Triangle, Circle, Square, Rhombus (core length 4), which shape appears at position ${pos}?` : `Σε ένα επαναλαμβανόμενο μοτίβο: Τρίγωνο, Κύκλος, Τετράγωνο, Ρόμβος (πυρήνας 4 σχημάτων), ποιο σχήμα βρίσκεται στην ${pos}η θέση;`,
      type: 'mcq',
      options: makeUniqueOptions(ans, distractors),
      correct: ans,
      explain: (
        <span>
          {isEn
            ? `${pos} : 4 ＝ ${Math.floor(pos / 4)} with remainder ${rem}. Thus it is the ${ans}.`
            : `${pos} : 4 ＝ ${Math.floor(pos / 4)} με υπόλοιπο ${rem}. Άρα είναι το ${ans}.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const n = randInt(8, 14);
    const res = 2 * n + 1;
    return {
      title: isEn ? 'Ch. 63 • Growing Pattern (2n ＋ 1)' : 'Κεφ. 63 • Αυξανόμενο Μοτίβο (2n ＋ 1)',
      prompt: isEn ? `A pattern grows with rule: Quantity ＝ 2 · n ＋ 1. How many elements does it have for n ＝ ${n}?` : `Ένα γεωμετρικό μοτίβο αυξάνεται με τον κανόνα: Πλήθος ＝ 2 · n ＋ 1. Πόσα στοιχεία έχει για n ＝ ${n};`,
      type: 'input',
      correct: String(res),
      explain: (
        <span>
          {isEn ? `(2 · ${n}) ＋ 1 ＝ ${2 * n} ＋ 1 ＝ ${res}.` : `(2 · ${n}) ＋ 1 ＝ ${2 * n} ＋ 1 ＝ ${res}.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const correctAns = isEn ? 'Continuous line folded at right angles' : 'Συνεχής γραμμή που διπλώνει σε ορθές γωνίες';
    const distractors = isEn
      ? ['Series of concentric circles', 'Random triangle placement', 'Curves without corners']
      : ['Σειρά από ομόκεντρους κύκλους', 'Τυχαία τοποθέτηση τριγώνων', 'Καμπύλες χωρίς γωνίες'];
    return {
      title: isEn ? 'Ch. 63 • Ancient Greek Meander' : 'Κεφ. 63 • Αρχαιοελληνικός Μαίανδρος',
      prompt: isEn ? 'What is the characteristic feature of the ancient Greek meander?' : 'Ποιο είναι το χαρακτηριστικό γνώρισμα του αρχαιοελληνικού μαιάνδρου;',
      type: 'mcq',
      options: makeUniqueOptions(correctAns, distractors),
      correct: correctAns,
      explain: (
        <span>
          {isEn
            ? 'The meander is a continuous decorative pattern folded at 90° right angles.'
            : 'Ο μαίανδρος είναι συνεχής διακοσμητική ταινία με ορθές γωνίες.'}
        </span>
      )
    };
  }
];

// ΚΕΦΑΛΑΙΟ 64: ΑΡΙΘΜΗΤΙΚΑ ΜΟΤΙΒΑ & ΑΚΟΛΟΥΘΙΕΣ
const POOL_CH64 = [
  (locale) => {
    const isEn = locale === 'en';
    const start = randInt(3, 7);
    const step = randInt(4, 7);
    const nextVal = start + 4 * step;
    return {
      title: isEn ? 'Ch. 64 • Next Term (+)' : 'Κεφ. 64 • Επόμενος Όρος (+)',
      prompt: isEn
        ? `Find the next term of the sequence: ${start}, ${start + step}, ${start + 2 * step}, ${start + 3 * step}, ...`
        : `Βρες τον επόμενο όρο της ακολουθίας: ${start}, ${start + step}, ${start + 2 * step}, ${start + 3 * step}, ...`,
      type: 'input',
      correct: String(nextVal),
      explain: (
        <span>
          {isEn
            ? `We add ${step} at each step. Thus: ${start + 3 * step} ＋ ${step} ＝ ${nextVal}.`
            : `Σε κάθε βήμα προσθέτουμε ${step}. Άρα: ${start + 3 * step} ＋ ${step} ＝ ${nextVal}.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const start = randInt(60, 90);
    const step = randInt(5, 8);
    const nextVal = start - 4 * step;
    return {
      title: isEn ? 'Ch. 64 • Next Term (－)' : 'Κεφ. 64 • Επόμενος Όρος (－)',
      prompt: isEn
        ? `Find the next term of the sequence: ${start}, ${start - step}, ${start - 2 * step}, ${start - 3 * step}, ...`
        : `Βρες τον επόμενο όρο της ακολουθίας: ${start}, ${start - step}, ${start - 2 * step}, ${start - 3 * step}, ...`,
      type: 'input',
      correct: String(nextVal),
      explain: (
        <span>
          {isEn
            ? `We subtract ${step} at each step. Thus: ${start - 3 * step} － ${step} ＝ ${nextVal}.`
            : `Σε κάθε βήμα αφαιρούμε ${step}. Άρα: ${start - 3 * step} － ${step} ＝ ${nextVal}.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const n = randInt(6, 12);
    const val = 5 * n - 2;
    return {
      title: isEn ? 'Ch. 64 • Formula 5n － 2' : 'Κεφ. 64 • Τύπος 5ν － 2',
      prompt: isEn ? `An arithmetic sequence follows rule: 5 · n － 2. What is the value for n ＝ ${n}?` : `Ένα αριθμητικό μοτίβο έχει κανόνα: 5 · ν － 2. Ποια είναι η τιμή για ν ＝ ${n};`,
      type: 'input',
      correct: String(val),
      explain: (
        <span>
          {isEn
            ? `(5 · ${n}) － 2 ＝ ${5 * n} － 2 ＝ ${val}.`
            : `(5 · ${n}) － 2 ＝ ${5 * n} － 2 ＝ ${val}.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const a = randInt(2, 4);
    const nextVal = a * 16;
    const distractors = [
      String(nextVal - 4),
      String(nextVal + 8),
      String(a * 12)
    ];
    return {
      title: isEn ? 'Ch. 64 • Doubling (· 2)' : 'Κεφ. 64 • Διπλασιασμός (· 2)',
      prompt: isEn
        ? `What is the next term in sequence: ${a}, ${a * 2}, ${a * 4}, ${a * 8}, ...?`
        : `Ποιος είναι ο επόμενος όρος της ακολουθίας: ${a}, ${a * 2}, ${a * 4}, ${a * 8}, ...;`,
      type: 'mcq',
      options: makeUniqueOptions(String(nextVal), distractors),
      correct: String(nextVal),
      explain: (
        <span>
          {isEn ? `Each term doubles: ${a * 8} · 2 ＝ ${nextVal}.` : `Κάθε όρος διπλασιάζεται: ${a * 8} · 2 ＝ ${nextVal}.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const isTrue = Math.random() > 0.5;
    return {
      title: isEn ? 'Ch. 64 • Term Definition' : 'Κεφ. 64 • Έννοια Όρου Ακολουθίας',
      prompt: isEn
        ? (isTrue
            ? 'Each number in a sequence is called a term and its position index is usually denoted by n (1st, 2nd, ... nth).'
            : 'In a sequence, term refers solely to the sum of all numbers together.')
        : (isTrue
            ? 'Κάθε αριθμός σε μια ακολουθία ονομάζεται όρος και η θέση του συμβολίζεται συνήθως με ν (1ος, 2ος, ... ν-οστός).'
            : 'Σε μια ακολουθία όρος ονομάζεται μόνο το άθροισμα όλων των αριθμών μαζί.'),
      type: 'tf',
      correct: isTrue,
      explain: (
        <span>
          {isEn
            ? (isTrue ? 'Correct! Each individual number is a term.' : 'False! Every single number of the sequence is a term.')
            : (isTrue ? 'Σωστά! Κάθε μεμονωμένος αριθμός είναι ένας όρος.' : 'Λάθος! Κάθε αριθμός της ακολουθίας είναι όρος.')}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const mult = randInt(3, 6);
    const res = mult * 20;
    return {
      title: isEn ? 'Ch. 64 • Calculating 20th Term' : 'Κεφ. 64 • Υπολογισμός 20ού Όρου',
      prompt: isEn
        ? `In the sequence of multiples of ${mult} (${mult}, ${mult * 2}, ${mult * 3}, ...), what is the 20th term (n ＝ 20)?`
        : `Στην ακολουθία των πολλαπλασίων του ${mult} (${mult}, ${mult * 2}, ${mult * 3}, ...), ποιος είναι ο 20ός όρος (ν ＝ 20);`,
      type: 'input',
      correct: String(res),
      explain: (
        <span>
          {isEn ? `${mult} · 20 ＝ ${res}.` : `${mult} · 20 ＝ ${res}.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const correctAns = isEn ? 'Each term is the sum of the two preceding terms' : 'Κάθε όρος είναι το άθροισμα των δύο προηγούμενων';
    const distractors = isEn
      ? ['At each step we add 10', 'Each term doubles', 'All terms are identical']
      : ['Σε κάθε βήμα προσθέτουμε 10', 'Κάθε όρος διπλασιάζεται', 'Όλοι οι όροι είναι ίσοι'];
    return {
      title: isEn ? 'Ch. 64 • Fibonacci Sequence' : 'Κεφ. 64 • Ακολουθία Fibonacci',
      prompt: isEn ? 'What is the rule of the Fibonacci sequence (1, 1, 2, 3, 5, 8, 13, ...)?' : 'Ποιος είναι ο κανόνας της ακολουθίας Fibonacci (1, 1, 2, 3, 5, 8, 13, ...);',
      type: 'mcq',
      options: makeUniqueOptions(correctAns, distractors),
      correct: correctAns,
      explain: (
        <span>
          {isEn
            ? 'Each term equals the sum of the two immediately preceding terms (e.g. 5 ＋ 8 ＝ 13).'
            : 'Κάθε αριθμός ισούται με το άθροισμα των δύο προηγούμενων (π.χ. 5 ＋ 8 ＝ 13).'}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const isTrue = Math.random() > 0.5;
    return {
      title: isEn ? 'Ch. 64 • Finding Constant Step' : 'Κεφ. 64 • Εύρεση Βήματος',
      prompt: isEn
        ? (isTrue
            ? 'To find the constant step in an arithmetic sequence, we subtract two consecutive terms: (2nd term) － (1st term).'
            : 'The constant step is always calculated by multiplying the 1st term by the 2nd term.')
        : (isTrue
            ? 'Για να βρούμε το σταθερό βήμα μιας αριθμητικής ακολουθίας, αφαιρούμε δύο διαδοχικούς όρους: (2ος όρος) － (1ος όρος).'
            : 'Το σταθερό βήμα υπολογίζεται πάντοτε με πολλαπλασιασμό του 1ου με τον 2ο όρο.'),
      type: 'tf',
      correct: isTrue,
      explain: (
        <span>
          {isEn
            ? (isTrue ? 'Correct! Step ＝ a(n) － a(n-1).' : 'False! The step is calculated by subtraction.')
            : (isTrue ? 'Σωστά! Βήμα ＝ α(ν) － α(ν-1).' : 'Λάθος! Το βήμα υπολογίζεται με αφαίρεση.')}
        </span>
      )
    };
  }
];

// ΚΕΦΑΛΑΙΟ 65: ΣΥΝΘΕΤΑ ΜΟΤΙΒΑ & ΣΧΕΣΕΙΣ ΜΕΓΕΘΩΝ
const POOL_CH65 = [
  (locale) => {
    const isEn = locale === 'en';
    const a = randInt(2, 4);
    const b = a * 2 + 1;
    const c = b * 2 + 1;
    const d = c * 2 + 1;
    const nextVal = d * 2 + 1;
    return {
      title: isEn ? 'Ch. 65 • Compound Rule (· 2 ＋ 1)' : 'Κεφ. 65 • Σύνθετος Κανόνας (· 2 ＋ 1)',
      prompt: isEn ? `Find the next term of the sequence: ${a}, ${b}, ${c}, ${d}, ...` : `Βρες τον επόμενο όρο της ακολουθίας: ${a}, ${b}, ${c}, ${d}, ...`,
      type: 'input',
      correct: String(nextVal),
      explain: (
        <span>
          {isEn ? `At each step we double and add 1: (${d} · 2) ＋ 1 ＝ ${nextVal}.` : `Σε κάθε βήμα διπλασιάζουμε και προσθέτουμε 1: (${d} · 2) ＋ 1 ＝ ${nextVal}.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const start = randInt(5, 9);
    const n1 = start;
    const n2 = n1 + 4;
    const n3 = n2 - 1;
    const n4 = n3 + 4;
    const n5 = n4 - 1;
    const nextVal = n5 + 4;
    return {
      title: isEn ? 'Ch. 65 • Alternating Pattern (＋4, －1)' : 'Κεφ. 65 • Εναλλασσόμενο Μοτίβο (＋4, －1)',
      prompt: isEn ? `Find the next number of the sequence: ${n1}, ${n2}, ${n3}, ${n4}, ${n5}, ...` : `Βρες τον επόμενο αριθμό της ακολουθίας: ${n1}, ${n2}, ${n3}, ${n4}, ${n5}, ...`,
      type: 'input',
      correct: String(nextVal),
      explain: (
        <span>
          {isEn ? `Operations alternate: ＋4 and then －1. Thus: ${n5} ＋ 4 ＝ ${nextVal}.` : `Οι πράξεις εναλλάσσονται: ＋4 και μετά －1. Άρα: ${n5} ＋ 4 ＝ ${nextVal}.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const n = randInt(7, 14);
    const res = 3 * n + 4;
    return {
      title: isEn ? 'Ch. 65 • Formula 3n ＋ 4' : 'Κεφ. 65 • Τύπος 3ν ＋ 4',
      prompt: isEn ? `A compound pattern follows rule: 3 · n ＋ 4. What is the value for position n ＝ ${n}?` : `Ένα σύνθετο μοτίβο έχει γενικό τύπο: 3 · ν ＋ 4. Ποια είναι η τιμή για θέση ν ＝ ${n};`,
      type: 'input',
      correct: String(res),
      explain: (
        <span>
          {isEn ? `(3 · ${n}) ＋ 4 ＝ ${3 * n} ＋ 4 ＝ ${res}.` : `(3 · ${n}) ＋ 4 ＝ ${3 * n} ＋ 4 ＝ ${res}.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const correctAns = isEn ? 'Multiply by 2 and add 1' : 'Πολλαπλασιάζουμε επί 2 και προσθέτουμε 1';
    const distractors = isEn
      ? ['Steadily add 4', 'Multiply by 3', 'Subtract 2 at each step']
      : ['Προσθέτουμε σταθερά 4', 'Πολλαπλασιάζουμε επί 3', 'Αφαιρούμε 2 σε κάθε βήμα'];
    return {
      title: isEn ? 'Ch. 65 • Compound Rule Recognition' : 'Κεφ. 65 • Αναγνώριση Σύνθετου Κανόνα',
      prompt: isEn ? 'What is the rule of sequence: 3, 7, 15, 31, 63, ...?' : 'Ποιος είναι ο κανόνας της ακολουθίας: 3, 7, 15, 31, 63, ...;',
      type: 'mcq',
      options: makeUniqueOptions(correctAns, distractors),
      correct: correctAns,
      explain: (
        <span>
          {isEn
            ? '3 · 2 ＋ 1 ＝ 7, 7 · 2 ＋ 1 ＝ 15, 15 · 2 ＋ 1 ＝ 31. The rule is · 2 ＋ 1.'
            : '3 · 2 ＋ 1 ＝ 7, 7 · 2 ＋ 1 ＝ 15, 15 · 2 ＋ 1 ＝ 31. Ο κανόνας είναι · 2 ＋ 1.'}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const isTrue = Math.random() > 0.5;
    return {
      title: isEn ? 'Ch. 65 • Compound Patterns Theory' : 'Κεφ. 65 • Θεωρία Σύνθετων Μοτίβων',
      prompt: isEn
        ? (isTrue
            ? 'In a compound pattern, the rule can combine two operations (e.g. multiplication and addition together).'
            : 'In every pattern, the difference between two consecutive terms is strictly a constant number.')
        : (isTrue
            ? 'Σε ένα σύνθετο μοτίβο ο κανόνας μπορεί να συνδυάζει δύο πράξεις (π.χ. πολλαπλασιασμό και πρόσθεση μαζί).'
            : 'Σε κάθε μοτίβο η διαφορά ανάμεσα σε δύο διαδοχικούς όρους είναι πάντα ένας σταθερός αριθμός.'),
      type: 'tf',
      correct: isTrue,
      explain: (
        <span>
          {isEn
            ? (isTrue ? 'Correct! Compound patterns have dual or alternating rules.' : 'False! In compound patterns the step may vary.')
            : (isTrue ? 'Σωστά! Τα σύνθετα μοτίβα έχουν διπλούς ή εναλλασσόμενους κανόνες.' : 'Λάθος! Στα σύνθετα μοτίβα το βήμα μπορεί να μεταβάλλεται.')}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const n = randInt(8, 15);
    const res = 4 * n + 5;
    return {
      title: isEn ? 'Ch. 65 • Fee (4n ＋ 5)' : 'Κεφ. 65 • Χρέωση (4ν ＋ 5)',
      prompt: isEn ? `A service charges with formula: Cost ＝ 4 · n ＋ 5. What is the cost for n ＝ ${n} usages?` : `Μια συνδρομητική υπηρεσία χρεώνει με τον τύπο: Κόστος ＝ 4 · ν ＋ 5. Πόσο είναι το κόστος για ν ＝ ${n} χρήσεις;`,
      type: 'input',
      correct: String(res),
      explain: (
        <span>
          {isEn ? `(4 · ${n}) ＋ 5 ＝ ${4 * n} ＋ 5 ＝ ${res} €.` : `(4 · ${n}) ＋ 5 ＝ ${4 * n} ＋ 5 ＝ ${res} €.`}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const correctAns = isEn ? '4 · n ＋ 1' : '4 · ν ＋ 1';
    const distractors = isEn
      ? ['3 · n ＋ 2', '5 · n － 1', '2 · n ＋ 3']
      : ['3 · ν ＋ 2', '5 · ν － 1', '2 · ν ＋ 3'];
    return {
      title: isEn ? 'Ch. 65 • Formula from Table' : 'Κεφ. 65 • Εύρεση Τύπου από Πίνακα',
      prompt: isEn ? 'For n ＝ 1 value is 5, for n ＝ 2 it is 9, for n ＝ 3 it is 13. What is the general formula?' : 'Για ν ＝ 1 η τιμή είναι 5, για ν ＝ 2 είναι 9, για ν ＝ 3 είναι 13. Ποιος είναι ο γενικός τύπος;',
      type: 'mcq',
      options: makeUniqueOptions(correctAns, distractors),
      correct: correctAns,
      explain: (
        <span>
          {isEn
            ? 'The step is 4. For n ＝ 1: 4 · 1 ＋ 1 ＝ 5. Thus the formula is 4 · n ＋ 1.'
            : 'Το βήμα είναι 4. Για ν ＝ 1: 4 · 1 ＋ 1 ＝ 5. Άρα ο τύπος είναι 4 · ν ＋ 1.'}
        </span>
      )
    };
  },
  (locale) => {
    const isEn = locale === 'en';
    const isTrue = Math.random() > 0.5;
    return {
      title: isEn ? 'Ch. 65 • Two-Quantity Value Tables' : 'Κεφ. 65 • Πίνακες Δύο Μεγεθών',
      prompt: isEn
        ? (isTrue
            ? 'A value table of two quantities helps us observe how one quantity changes relative to another (e.g. time and height).'
            : 'In two-quantity tables, the quantities are never connected by any mathematical rule.')
        : (isTrue
            ? 'Ένας πίνακας τιμών δύο μεγεθών μάς βοηθά να παρατηρήσουμε πώς μεταβάλλεται ένα μέγεθος καθώς αλλάζει ένα άλλο (π.χ. χρόνος και ύψος).'
            : 'Στους πίνακες δύο μεγεθών τα δύο μεγέθη δεν συνδέονται ποτέ μεταξύ τους με μαθηματικό κανόνα.'),
      type: 'tf',
      correct: isTrue,
      explain: (
        <span>
          {isEn
            ? (isTrue ? 'Correct! It portrays the mathematical relationship connecting two variables.' : 'False! The table is built specifically to reveal the rule connecting them.')
            : (isTrue ? 'Σωστά! Αποτυπώνει τη μαθηματική σχέση ανάμεσα σε δύο μεταβλητές.' : 'Λάθος! Ο πίνακας κατασκευάζεται ακριβώς για να ανακαλύψουμε τον κανόνα που τα συνδέει.')}
        </span>
      )
    };
  }
];

// ---------------------------------------------------------
// ΣΥΝΘΕΣΗ ΤΩΝ 22 ΕΡΩΤΗΣΕΩΝ (11 ΕΝΟΤΗΤΕΣ x 2 ΕΡΩΤΗΣΕΙΣ)
// ---------------------------------------------------------

function generate22Questions(locale) {
  const chapterPools = [
    { pool: POOL_CH55, ch: 55 },
    { pool: POOL_CH56, ch: 56 },
    { pool: POOL_CH57, ch: 57 },
    { pool: POOL_CH58, ch: 58 },
    { pool: POOL_CH59, ch: 59 },
    { pool: POOL_CH60, ch: 60 },
    { pool: POOL_CH61, ch: 61 },
    { pool: POOL_CH62, ch: 62 },
    { pool: POOL_CH63, ch: 63 },
    { pool: POOL_CH64, ch: 64 },
    { pool: POOL_CH65, ch: 65 }
  ];

  const questionsList = [];
  let qCounter = 1;

  chapterPools.forEach(({ pool }) => {
    const shuffledPool = shuffleArray(pool);
    const qA = shuffledPool[0](locale);
    const qB = shuffledPool[1] ? shuffledPool[1](locale) : shuffledPool[0](locale);

    [qA, qB].forEach((qData) => {
      let finalOptions = qData.options;
      if (qData.type === 'mcq' && Array.isArray(qData.options)) {
        finalOptions = makeUniqueOptions(qData.correct, qData.options);
      }

      questionsList.push({
        id: `q${qCounter}`,
        ...qData,
        options: finalOptions
      });
      qCounter += 1;
    });
  });

  return questionsList;
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function Epanalipsi4Page() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = useMemo(() => I18N[locale] || I18N.el, [locale]);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewTest = useCallback(() => {
    const qList = generate22Questions(locale);
    setQuestions(qList);
    const initialAnswers = {};
    qList.forEach((q) => {
      initialAnswers[q.id] = q.type === 'tf' ? null : '';
    });
    setAnswers(initialAnswers);
    setSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [locale]);

  useEffect(() => {
    loadNewTest();
  }, [loadNewTest]);

  const handleInputChange = (id, val, type) => {
    if (submitted) return;
    if (type === 'input') {
      let sanitized = String(val).replace(/\./g, ',').replace(/[^0-9,]/g, '');
      const parts = sanitized.split(',');
      if (parts.length > 2) sanitized = parts[0] + ',' + parts.slice(1).join('');
      if (sanitized.length > 10) sanitized = sanitized.slice(0, 10);
      setAnswers((prev) => ({ ...prev, [id]: sanitized }));
    } else {
      setAnswers((prev) => ({ ...prev, [id]: val }));
    }
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
      const cleanAlt = q.altCorrect ? String(q.altCorrect).replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase() : null;

      if (cleanUser === cleanTarget || (cleanAlt && cleanUser === cleanAlt)) return true;

      const numUser = parseFloat(cleanUser.replace(',', '.'));
      const numTarget = parseFloat(cleanTarget.replace(',', '.'));
      return !isNaN(numUser) && !isNaN(numTarget) && Math.abs(numUser - numTarget) < 0.05;
    }
    if (q.type === 'mcq') {
      return userVal === q.correct;
    }
    if (q.type === 'tf') {
      return userVal === q.correct;
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted || questions.length === 0) return;

    let total = 0;
    questions.forEach((q) => {
      if (isQuestionCorrect(q)) total += 1;
    });

    setScore(total);
    setSubmitted(true);
  };

  const getCardStyle = (q) => {
    if (!submitted) return 'bg-white border-slate-200 shadow-sm';
    return isQuestionCorrect(q)
      ? 'bg-emerald-50/70 border-emerald-400 shadow-md ring-1 ring-emerald-400'
      : 'bg-rose-50/70 border-rose-400 shadow-md ring-1 ring-rose-400';
  };

  const answeredCount = Object.values(answers).filter((val) => val !== null && val !== '').length;

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/st-dimotikou"
      backText={t.backLinkText}
      showAds={false}
      hideFooter={true}
      actionButton={
        <span className="hidden sm:inline-block bg-indigo-50 border border-indigo-200 text-indigo-700 px-3.5 py-1.5 rounded-xl text-xs font-black">
          📝 {toCleanUppercase(t.questionsBadge)}
        </span>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 sm:space-y-10 min-w-0">
        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-3 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
                <span>{toCleanUppercase(t.badgeHeader)}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                {t.heroTitle}
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewTest}
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-lg transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation"
            >
              <span>🔄</span>
              <span>{toCleanUppercase(t.newTestBtn)}</span>
            </button>
          </div>
        </section>

        {/* 2. ΦΟΡΜΑ ΜΕ ΤΙΣ 22 ΕΡΩΤΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 2xl:gap-8">
            {questions.map((q, idx) => {
              const qNum = idx + 1;
              return (
                <div
                  key={q.id}
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all min-w-0 ${getCardStyle(
                    q
                  )}`}
                >
                  <div>
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider">
                        {toCleanUppercase(`${t.questionLabel} ${qNum}: ${q.title}`)}
                      </span>
                      {submitted && (
                        <span className="text-xl">
                          {isQuestionCorrect(q) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* PROMPT (NO-GIVEAWAY) */}
                    <div className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-4 break-words [overflow-wrap:anywhere]">
                      {q.type === 'tf' ? (
                        <span>«{q.prompt}»</span>
                      ) : (
                        <span>{q.prompt}</span>
                      )}
                    </div>

                    {/* INPUTS / OPTIONS */}
                    {q.type === 'mcq' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = answers[q.id] === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={submitted}
                              onClick={() => handleInputChange(q.id, opt, 'mcq')}
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-mono font-bold border text-center transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex-1 flex items-center justify-center min-h-[48px] ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'input' && (
                      <div className="space-y-2 mb-3">
                        <input
                          key={`input-${q.id}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode="text"
                          maxLength={10}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleInputChange(q.id, e.target.value, 'input')}
                          placeholder={t.inputPlaceholder}
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}

                    {q.type === 'tf' && (
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleInputChange(q.id, true, 'tf')}
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] ${
                            answers[q.id] === true
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                          }`}
                        >
                          👍 {toCleanUppercase(t.trueBtn)}
                        </button>
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleInputChange(q.id, false, 'tf')}
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] ${
                            answers[q.id] === false
                              ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                          }`}
                        >
                          👎 {toCleanUppercase(t.falseBtn)}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3 min-w-0">
                      <div
                        className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed break-words [overflow-wrap:anywhere] ${
                          isQuestionCorrect(q)
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                            : 'bg-rose-100 text-rose-950 border border-rose-200'
                        }`}
                      >
                        <p className="font-bold mb-1">
                          {isQuestionCorrect(q) ? t.feedbackCorrect : t.feedbackExplain}
                        </p>
                        <div>{q.explain}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="flex justify-center pt-4 sm:pt-6">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-base md:text-lg font-black px-10 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 touch-manipulation"
              >
                <span className="text-2xl">🎯</span>
                <span>{toCleanUppercase(t.finishBtn)}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* 3. FIXED BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* ΑΡΙΣΤΕΡΑ: SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>
                {submitted ? toCleanUppercase(t.finalScoreLabel) : toCleanUppercase(t.answeredLabel)}:
              </span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">
                {submitted ? `${score} / 22` : `${answeredCount} / 22`}
              </span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase(t.percentageLabel)}:{' '}
                <span className="text-emerald-400 font-black text-sm sm:text-base">
                  {Math.round((score / 22) * 100)}%
                </span>
              </span>
            )}
          </div>

          {/* ΔΕΞΙΑ: GUIDANCE OR RESTART */}
          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewTest}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(t.newTestWithDifferentBtn)}</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.footerPrompt}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}