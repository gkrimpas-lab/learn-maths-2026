// pages/st-dimotikou/41-analogia-ask.js
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

// ---------------------------------------------------------
// ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ & DEFENSIVE CHECKS
// ---------------------------------------------------------

function randInt(min, max) {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

function shuffle(array) {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getGCD(a, b) {
  let x = Math.abs(Math.round(a || 0));
  let y = Math.abs(Math.round(b || 0));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

// Αυστηρή συνάρτηση αφαίρεσης τόνων για κεφαλαία (εξαιρείται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = String(str).split(/(ΣΤ')/g);
  return parts
    .map((part) => {
      if (part === "ΣΤ'") return "ΣΤ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Μορφοποίηση αριθμού βάσει locale
function formatNum(val, decimals = 2, locale = 'el') {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  if (Number.isInteger(Number(val))) return String(val);
  const rounded = Number(Number(val).toFixed(decimals));
  const dotStr = String(rounded);
  return locale === 'el' ? dotStr.replace('.', ',') : dotStr;
}

// Helper για εξασφάλιση ακριβώς 4 μοναδικών επιλογών MCQ
function makeUniqueMCQ(correctObj, candidates) {
  const seen = new Set([correctObj.val]);
  const result = [correctObj];
  for (const cand of candidates) {
    if (cand && !seen.has(cand.val)) {
      seen.add(cand.val);
      result.push(cand);
    }
    if (result.length === 4) break;
  }
  return shuffle(result);
}

// Component για κανονική κατακόρυφη μορφή κλάσματος
export function Fraction({ num, den, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: { numDen: 'text-xs sm:text-sm font-bold', line: 'w-full h-0.5' },
    md: { numDen: 'text-sm sm:text-base font-black', line: 'w-full h-0.5' },
    lg: { numDen: 'text-lg sm:text-xl font-black', line: 'w-full h-1' }
  };

  const selected = sizeClasses[size] || sizeClasses.md;

  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle font-mono leading-none px-1 ${className}`}>
      <span className={`${selected.numDen} pb-0.5`}>{num}</span>
      <span className={`${selected.line} bg-current rounded-full my-0.5 min-w-[12px]`} />
      <span className={`${selected.numDen} pt-0.5`}>{den}</span>
    </span>
  );
}

// ---------------------------------------------------------
// ΛΕΞΙΚΟ i18n
// ---------------------------------------------------------

const TRANSLATIONS = {
  el: {
    pageTitle: "Ασκήσεις: Αναλογίες - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στις αναλογίες, τα σταυρωτά γινόμενα (χιαστί) και τα πρακτικά προβλήματα για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 41 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Αναλογίες",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην εύρεση αγνώστων όρων, στα σταυρωτά γινόμενα (χιαστί), στους όρους αναλογίας και στα ρεαλιστικά προβλήματα!",
    newQuestions: "Νέες Ασκήσεις",
    exercise: "Άσκηση",
    trueBtn: "Σωστό",
    falseBtn: "Λάθος",
    inputPlaceholderNumber: "x ＝ ...",
    inputPlaceholderFraction: "π.χ. 6/18 ή 6:18",
    tableHeaderElement: "Στοιχείο",
    tableHeaderFormula: "Ανάλυση / Τύπος",
    tableHeaderValue: "Τιμή",
    feedbackSuccess: "🎯 Εξαιρετικά!",
    feedbackReview: "💡 Επεξήγηση:",
    checkBtn: "Έλεγχος Απαντήσεων",
    scoreBadge: "Σκορ",
    answeredBadge: "Απαντήθηκαν",
    percentage: "Ποσοστό",
    bottomHint: "Απάντησε και στις 10 ερωτήσεις και πάτησε «Έλεγχος Απαντήσεων»!"
  },
  en: {
    pageTitle: "Exercises: Proportions - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on proportions, cross-multiplication, and practical problems for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 41 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: Proportions",
    desc: "Solve the 10 dynamic problems to practice finding unknown terms, cross-multiplication, identifying extremes/means, and real-life proportion problems!",
    newQuestions: "New Exercises",
    exercise: "Exercise",
    trueBtn: "True",
    falseBtn: "False",
    inputPlaceholderNumber: "x ＝ ...",
    inputPlaceholderFraction: "e.g. 6/18 or 6:18",
    tableHeaderElement: "Element",
    tableHeaderFormula: "Analysis / Formula",
    tableHeaderValue: "Value",
    feedbackSuccess: "🎯 Excellent!",
    feedbackReview: "💡 Explanation:",
    checkBtn: "Check Answers",
    scoreBadge: "Score",
    answeredBadge: "Answered",
    percentage: "Percentage",
    bottomHint: "Answer all 10 questions and press 'Check Answers'!"
  }
};

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 & Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_std_1',
    generate: (locale) => {
      const pCount1 = randInt(3, 6);
      const pricePerItem = randInt(2, 5);
      const cost1 = pCount1 * pricePerItem;
      const pCount2 = randInt(7, 12);
      const cost2 = pCount2 * pricePerItem;
      const candidateWrongs = [cost2 + 4, Math.max(1, cost2 - 3), cost2 + 6, cost2 - 2].filter(v => v !== cost2 && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(cost2), render: <span>{cost2} €</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>{v} €</span> }))
      );
      return {
        title: locale === 'en' ? 'Buying Notebooks' : 'Αγορά Τετραδίων',
        prompt: (
          <span>
            {locale === 'en'
              ? `If ${pCount1} identical notebooks cost ${cost1} €, how much will we pay to buy ${pCount2} of the same notebooks?`
              : `Αν ${pCount1} ίδια τετράδια κοστίζουν ${cost1} €, πόσα € θα πληρώσουμε για να αγοράσουμε ${pCount2} τέτοια τετράδια;`}
          </span>
        ),
        correctVal: String(cost2),
        correctText: `${cost2} €`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'First purchase' : 'Πρώτη αγορά', formula: `${pCount1}`, val: `${cost1} €` },
          { item: locale === 'en' ? 'Second purchase' : 'Δεύτερη αγορά', formula: `${pCount2}`, val: 'x €' },
          { item: locale === 'en' ? 'Cross-multiplication' : 'Αναλογία (σταυρωτά γινόμενα)', formula: `(${cost1} · ${pCount2}) : ${pCount1}`, val: `${cost2} €` }
        ],
        explain: (
          <span>
            {`${pCount1} : ${cost1} ＝ ${pCount2} : x ➔ x ＝ (${cost1} · ${pCount2}) : ${pCount1} ＝ ${cost1 * pCount2} : ${pCount1} ＝ ${cost2} €.`}
          </span>
        )
      };
    }
  },
  {
    id: 'p_std_2',
    generate: (locale) => {
      const kg1 = randInt(2, 5);
      const rate = randInt(4, 8) * 10;
      const juice1 = kg1 * rate;
      const kg2 = randInt(6, 10);
      const juice2 = kg2 * rate;
      const candidateWrongs = [juice2 + 40, Math.max(10, juice2 - 50), juice2 + 80, juice2 - 30].filter(v => v !== juice2 && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(juice2), render: <span>{juice2} ml</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>{v} ml</span> }))
      );
      return {
        title: locale === 'en' ? 'Orange Juice Production' : 'Παραγωγή Χυμού από Πορτοκάλια',
        prompt: (
          <span>
            {locale === 'en'
              ? `From ${kg1} kg of oranges we yield ${juice1} ml of juice. How many ml of juice will we yield from ${kg2} kg of oranges of the same quality?`
              : `Από ${kg1} kg πορτοκάλια παίρνουμε ${juice1} ml χυμό. Πόσα ml χυμό θα πάρουμε από ${kg2} kg πορτοκάλια ίδιας ποιότητας;`}
          </span>
        ),
        correctVal: String(juice2),
        correctText: `${juice2} ml`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Initial quantity' : 'Αρχική ποσότητα', formula: `${kg1} kg`, val: `${juice1} ml` },
          { item: locale === 'en' ? 'New quantity' : 'Νέα ποσότητα', formula: `${kg2} kg`, val: 'x ml' },
          { item: locale === 'en' ? 'Solving proportion' : 'Επίλυση αναλογίας', formula: `(${juice1} · ${kg2}) : ${kg1}`, val: `${juice2} ml` }
        ],
        explain: (
          <span>
            {`${kg1} : ${juice1} ＝ ${kg2} : x ➔ x ＝ (${juice1} · ${kg2}) : ${kg1} ＝ ${juice1 * kg2} : ${kg1} ＝ ${juice2} ml.`}
          </span>
        )
      };
    }
  },
  {
    id: 'p_std_3',
    generate: (locale) => {
      const km1 = randInt(3, 6) * 40;
      const hours1 = randInt(2, 3);
      const speed = km1 / hours1;
      const hours2 = hours1 + randInt(2, 4);
      const km2 = speed * hours2;
      const candidateWrongs = [km2 + 30, Math.max(20, km2 - 40), km2 + 60, km2 - 20].filter(v => v !== km2 && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(km2), render: <span>{km2} km</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>{v} km</span> }))
      );
      return {
        title: locale === 'en' ? 'Travel at Constant Speed' : 'Διαδρομή με Σταθερή Ταχύτητα',
        prompt: (
          <span>
            {locale === 'en'
              ? `A car moving at constant speed covers ${km1} km in ${hours1} hours. How many km will it cover in ${hours2} hours?`
              : `Ένα αυτοκίνητο κινούμενο με σταθερή ταχύτητα διανύει ${km1} km σε ${hours1} ώρες. Πόσα km θα διανύσει σε ${hours2} ώρες;`}
          </span>
        ),
        correctVal: String(km2),
        correctText: `${km2} km`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'First trip' : 'Πρώτη διαδρομή', formula: `${hours1} h`, val: `${km1} km` },
          { item: locale === 'en' ? 'Second trip' : 'Δεύτερη διαδρομή', formula: `${hours2} h`, val: 'x km' },
          { item: locale === 'en' ? 'Proportion' : 'Αναλογία', formula: `(${km1} · ${hours2}) : ${hours1}`, val: `${km2} km` }
        ],
        explain: (
          <span>
            {`${km1} : ${hours1} ＝ x : ${hours2} ➔ x ＝ (${km1} · ${hours2}) : ${hours1} ＝ ${km2} km.`}
          </span>
        )
      };
    }
  },
  {
    id: 'p_std_4',
    generate: (locale) => {
      const eggs1 = randInt(2, 4);
      const flour1 = eggs1 * 125;
      const eggs2 = eggs1 + randInt(2, 4);
      const flour2 = eggs2 * 125;
      const candidateWrongs = [flour2 + 100, Math.max(50, flour2 - 125), flour2 + 150, flour2 - 50].filter(v => v !== flour2 && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(flour2), render: <span>{flour2} g</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>{v} g</span> }))
      );
      return {
        title: locale === 'en' ? 'Recipe Ingredients Proportion' : 'Αναλογία Υλικών σε Συνταγή',
        prompt: (
          <span>
            {locale === 'en'
              ? `A cake recipe requires ${eggs1} eggs and ${flour1} g of flour. If ${eggs2} eggs are used in the exact same proportion, how many grams of flour will be needed?`
              : `Για ένα κέικ χρειάζονται ${eggs1} αυγά και ${flour1} g αλεύρι. Αν χρησιμοποιηθούν ${eggs2} αυγά με την ίδια αναλογία, πόσα g αλεύρι θα χρειαστούν;`}
          </span>
        ),
        correctVal: String(flour2),
        correctText: `${flour2} g`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Eggs' : 'Αυγά', formula: `${eggs1} ➔ ${eggs2}`, val: locale === 'en' ? 'Scale up' : 'Αύξηση' },
          { item: locale === 'en' ? 'Proportion' : 'Αναλογία', formula: `${eggs1} : ${flour1} ＝ ${eggs2} : x`, val: `x ＝ (${flour1} · ${eggs2}) : ${eggs1}` },
          { item: locale === 'en' ? 'Final flour' : 'Τελικό αλεύρι', formula: `${flour1 * eggs2} : ${eggs1}`, val: `${flour2} g` }
        ],
        explain: (
          <span>
            {`${eggs1} : ${flour1} ＝ ${eggs2} : x ➔ x ＝ (${flour1} · ${eggs2}) : ${eggs1} ＝ ${flour2} g.`}
          </span>
        )
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_hard_1',
    generate: (locale) => {
      const scaleVal = randInt(2, 5) * 50;
      const mapCm = randInt(3, 7);
      const realMeters = (mapCm * scaleVal) / 100;
      const candidateWrongs = [
        formatNum(realMeters + 2, 2, locale),
        formatNum(Math.max(1, realMeters - 3), 2, locale),
        formatNum(realMeters * 2, 2, locale),
        formatNum(realMeters + 5, 2, locale)
      ].filter(v => v !== formatNum(realMeters, 2, locale));
      const optionsRaw = makeUniqueMCQ(
        { val: String(realMeters), render: <span>{formatNum(realMeters, 2, locale)} m</span> },
        candidateWrongs.map(v => ({ val: v.replace(',', '.'), render: <span>{v} m</span> }))
      );
      return {
        title: locale === 'en' ? 'Real Distance from Map Scale' : 'Υπολογισμός Πραγματικής Απόστασης από Κλίμακα',
        prompt: (
          <span>
            {locale === 'en'
              ? `On a map with scale 1 : ${scaleVal}, the distance between two buildings is drawn as ${mapCm} cm. How many meters is the actual real-world distance between them?`
              : `Σε έναν χάρτη με κλίμακα 1 : ${scaleVal}, η απόσταση δύο κτηρίων σχεδιάστηκε ίση με ${mapCm} cm. Πόσα m είναι η πραγματική απόσταση μεταξύ των δύο κτηρίων;`}
          </span>
        ),
        correctVal: String(realMeters),
        correctText: `${formatNum(realMeters, 2, locale)} m`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Scale' : 'Κλίμακα', formula: `1 : ${scaleVal}`, val: `1 cm ➔ ${scaleVal} cm` },
          { item: locale === 'en' ? 'Map distance' : 'Απόσταση στον χάρτη', formula: `${mapCm} cm`, val: `${mapCm * scaleVal} cm` },
          { item: locale === 'en' ? 'Convert to meters' : 'Μετατροπή σε μέτρα', formula: `(${mapCm} · ${scaleVal}) : 100`, val: `${formatNum(realMeters, 2, locale)} m` }
        ],
        explain: (
          <span>
            {`1 : ${scaleVal} ＝ ${mapCm} : x ➔ x ＝ ${mapCm} · ${scaleVal} ＝ ${mapCm * scaleVal} cm ＝ ${formatNum(realMeters, 2, locale)} m.`}
          </span>
        )
      };
    }
  },
  {
    id: 'p_hard_2',
    generate: (locale) => {
      const ratioA = 3;
      const ratioB = 5;
      const k = randInt(12, 28);
      const partA = ratioA * k;
      const partB = ratioB * k;
      const total = partA + partB;
      const candidateWrongs = [partB - k, partB + k, partA, partB + 20].filter(v => v !== partB && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(partB), render: <span>{partB} €</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>{v} €</span> }))
      );
      return {
        title: locale === 'en' ? 'Sharing Earnings by Proportion' : 'Μοιρασιά Αμοιβής με Αναλογία',
        prompt: (
          <span>
            {locale === 'en'
              ? `Two technicians shared a payment of ${total} € so that the ratio of their shares equals ${ratioA} : ${ratioB}. How many € did the technician with the larger share receive?`
              : `Δύο τεχνίτες μοιράστηκαν αμοιβή ${total} € έτσι ώστε ο λόγος των χρημάτων τους να είναι ίσος με ${ratioA} : ${ratioB}. Πόσα € έλαβε ο τεχνίτης που πήρε το μεγαλύτερο ποσό;`}
          </span>
        ),
        correctVal: String(partB),
        correctText: `${partB} €`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Total parts' : 'Σύνολο μερών', formula: `${ratioA} ＋ ${ratioB}`, val: `${ratioA + ratioB}` },
          { item: locale === 'en' ? 'Value of 1 part' : 'Αξία 1 μέρους', formula: `${total} : ${ratioA + ratioB}`, val: `${k} €` },
          { item: locale === 'en' ? 'Larger share' : 'Μεγαλύτερο μερίδιο', formula: `${ratioB} · ${k}`, val: `${partB} €` }
        ],
        explain: (
          <span>
            {`${ratioA} ＋ ${ratioB} ＝ ${ratioA + ratioB} ➔ 1 μέρος ＝ ${total} : ${ratioA + ratioB} ＝ ${k} €. ${ratioB} · ${k} ＝ ${partB} €.`}
          </span>
        )
      };
    }
  },
  {
    id: 'p_hard_3',
    generate: (locale) => {
      const rL = randInt(3, 5);
      const rW = randInt(2, 3);
      const mult = randInt(6, 12);
      const len = rL * mult;
      const wid = rW * mult;
      const perimeter = 2 * (len + wid);
      const area = len * wid;
      const candidateWrongs = [area - 30, area + 40, (len + wid) * mult, area - 20].filter(v => v !== area && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(area), render: <span>{area} m²</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>{v} m²</span> }))
      );
      return {
        title: locale === 'en' ? 'Rectangle Area with Dimension Ratio' : 'Εμβαδόν Ορθογωνίου με Αναλογία Διαστάσεων',
        prompt: (
          <span>
            {locale === 'en'
              ? `In a rectangular field, the ratio of length to width is ${rL} : ${rW} and its perimeter is ${perimeter} m. How many m² is its area?`
              : `Σε ένα ορθογώνιο αγροτεμάχιο ο λόγος του μήκους προς το πλάτος είναι ${rL} : ${rW} και η περίμετρος ισούται με ${perimeter} m. Πόσα m² είναι το εμβαδόν του;`}
          </span>
        ),
        correctVal: String(area),
        correctText: `${area} m²`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Semi-perimeter' : 'Ημιπερίμετρος (μήκος ＋ πλάτος)', formula: `${perimeter} : 2`, val: `${len + wid} m` },
          { item: locale === 'en' ? 'Value of 1 part' : 'Τιμή 1 μέρους', formula: `${len + wid} : (${rL} ＋ ${rW})`, val: `${mult} m` },
          { item: locale === 'en' ? 'Dimensions & Area' : 'Διαστάσεις & Εμβαδόν', formula: `${len} m · ${wid} m`, val: `${area} m²` }
        ],
        explain: (
          <span>
            {`${perimeter} : 2 ＝ ${len + wid} m. 1 μέρος ＝ ${len + wid} : (${rL} ＋ ${rW}) ＝ ${mult} m. Εμβαδόν ＝ ${len} · ${wid} ＝ ${area} m².`}
          </span>
        )
      };
    }
  },
  {
    id: 'p_hard_4',
    generate: (locale) => {
      const rGold = 18;
      const rTotal = 24;
      const totalWeight = randInt(4, 9) * 12;
      const pureGold = (totalWeight * rGold) / rTotal;
      const candidateWrongs = [pureGold + 6, Math.max(1, pureGold - 6), totalWeight - pureGold, pureGold + 12].filter(v => v !== pureGold && v > 0);
      const optionsRaw = makeUniqueMCQ(
        { val: String(pureGold), render: <span>{pureGold} g</span> },
        candidateWrongs.map(v => ({ val: String(v), render: <span>{v} g</span> }))
      );
      return {
        title: locale === 'en' ? 'Gold Jewelry Karat Ratio' : 'Χρυσό Κόσμημα και Καράτια',
        prompt: (
          <span>
            {locale === 'en'
              ? `An 18-karat gold jewel contains 18 parts pure gold out of 24 parts total mass. If the jewel weighs ${totalWeight} g, how many grams of pure gold does it contain?`
              : `Ένα χρυσό κόσμημα 18 καρατίων περιέχει 18 μέρη καθαρού χρυσού στα 24 μέρη συνολικής μάζας. Αν το κόσμημα ζυγίζει ${totalWeight} g, πόσα g καθαρού χρυσού περιέχει;`}
          </span>
        ),
        correctVal: String(pureGold),
        correctText: `${pureGold} g`,
        optionsRaw,
        tableData: [
          { item: locale === 'en' ? 'Karat proportion' : 'Αναλογία καρατίων', formula: '18 / 24', val: '18/24 ＝ 3/4' },
          { item: locale === 'en' ? 'Proportion equation' : 'Εξίσωση αναλογίας', formula: `18 : 24 ＝ x : ${totalWeight}`, val: `x ＝ (18 · ${totalWeight}) : 24` },
          { item: locale === 'en' ? 'Pure gold mass' : 'Καθαρός χρυσός', formula: `(3 · ${totalWeight}) : 4`, val: `${pureGold} g` }
        ],
        explain: (
          <span>
            {`18 : 24 ＝ x : ${totalWeight} ➔ x ＝ (18 · ${totalWeight}) : 24 ＝ ${pureGold} g.`}
          </span>
        )
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale = 'el') {
  // Q1: Input - Εύρεση άγνωστου όρου x (a : b = c : x)
  const q1A = randInt(2, 6);
  const q1B = randInt(3, 8);
  const q1Mult = randInt(2, 5);
  const q1C = q1A * q1Mult;
  const q1D = q1B * q1Mult;

  // Q2: MCQ - Έλεγχος αν δύο λόγοι σχηματίζουν αναλογία
  const q2A = randInt(2, 5);
  const q2B = randInt(3, 7);
  const q2M = randInt(2, 4);
  const q2CTrue = q2A * q2M;
  const q2DTrue = q2B * q2M;
  const q2OptTrue = `${q2CTrue} : ${q2DTrue}`;
  const q2CandidateWrongs = [
    `${q2CTrue + 1} : ${q2DTrue}`,
    `${q2CTrue} : ${q2DTrue + 2}`,
    `${q2A + 2} : ${q2B + 3}`,
    `${q2DTrue} : ${q2CTrue}`
  ].filter(v => v !== q2OptTrue);
  const q2Options = makeUniqueMCQ(
    { val: q2OptTrue, render: <span>{q2OptTrue}</span> },
    q2CandidateWrongs.map(v => ({ val: v, render: <span>{v}</span> }))
  );

  // Q3: Input - Άγνωστος όρος σε άκρα θέση (x : b = c : d)
  const q3B = randInt(3, 7);
  const q3C = randInt(2, 5);
  const q3M = randInt(2, 4);
  const q3D = q3B * q3M;
  const q3XVal = q3C;
  const q3Top = q3C * q3M;

  // Q4: MCQ - Αναγνώριση άκρων και μέσων όρων
  const q4N1 = randInt(3, 8);
  const q4N2 = randInt(4, 9);
  const q4N3 = randInt(5, 11);
  const q4N4 = randInt(6, 12);
  const q4CorrectAns = locale === 'en'
    ? `Extremes: ${q4N1} and ${q4N4} | Means: ${q4N2} and ${q4N3}`
    : `Άκροι: ${q4N1} και ${q4N4} | Μέσοι: ${q4N2} και ${q4N3}`;
  const q4CandidateWrongs = [
    locale === 'en'
      ? `Extremes: ${q4N2} and ${q4N3} | Means: ${q4N1} and ${q4N4}`
      : `Άκροι: ${q4N2} και ${q4N3} | Μέσοι: ${q4N1} και ${q4N4}`,
    locale === 'en'
      ? `Extremes: ${q4N1} and ${q4N2} | Means: ${q4N3} and ${q4N4}`
      : `Άκροι: ${q4N1} και ${q4N2} | Μέσοι: ${q4N3} και ${q4N4}`,
    locale === 'en'
      ? `Extremes: ${q4N1} and ${q4N3} | Means: ${q4N2} and ${q4N4}`
      : `Άκροι: ${q4N1} και ${q4N3} | Μέσοι: ${q4N2} και ${q4N4}`
  ];
  const q4Options = makeUniqueMCQ(
    { val: q4CorrectAns, render: <span>{q4CorrectAns}</span> },
    q4CandidateWrongs.map(v => ({ val: v, render: <span>{v}</span> }))
  );

  // Q5: Input - Συμπλήρωση ισοδύναμου κλάσματος
  const q5Num = randInt(2, 5);
  const q5Den = randInt(6, 9);
  const q5K = randInt(2, 4);
  const q5EqNum = q5Num * q5K;
  const q5EqDen = q5Den * q5K;

  // Q6: MCQ - Βασική Ιδιότητα
  const q6X = randInt(3, 7);
  const q6Y = randInt(4, 8);
  const q6Z = randInt(5, 9);
  const q6W = randInt(6, 10);
  const q6CorrectEq = `${q6X} · ${q6W} ＝ ${q6Y} · ${q6Z}`;
  const q6CandidateWrongs = [
    `${q6X} · ${q6Y} ＝ ${q6Z} · ${q6W}`,
    `${q6X} · ${q6Z} ＝ ${q6Y} · ${q6W}`,
    `${q6X} ＋ ${q6W} ＝ ${q6Y} ＋ ${q6Z}`
  ];
  const q6Options = makeUniqueMCQ(
    { val: q6CorrectEq, render: <span>{q6CorrectEq}</span> },
    q6CandidateWrongs.map(v => ({ val: v, render: <span>{v}</span> }))
  );

  // Q7: Standard Problem (Input)
  const spIndex1 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q7Data = STANDARD_PROBLEMS_POOL[spIndex1].generate(locale);

  // Q8: MCQ - Επαλήθευση ισότητας αναλογίας
  const q8A = randInt(2, 5);
  const q8B = randInt(3, 7);
  const q8Mult = randInt(3, 6);
  const q8C = q8A * q8Mult;
  const q8D = q8B * q8Mult;
  const q8CandidateWrongs = [
    String(q8D + 2),
    String(Math.max(1, q8D - 3)),
    String(q8D + 5),
    String(q8D - 1)
  ].filter(v => v !== String(q8D));
  const q8Options = makeUniqueMCQ(
    { val: String(q8D), render: <span>{q8D}</span> },
    q8CandidateWrongs.map(v => ({ val: v, render: <span>{v}</span> }))
  );

  // Q9: Hard Problem (MCQ)
  const hpIndex1 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q9Data = HARD_PROBLEMS_POOL[hpIndex1].generate(locale);
  const q9Options = q9Data.optionsRaw;

  // Q10: True/False - Βασική θεωρία αναλογιών
  const q10IsTrue = Math.random() > 0.5;
  const q10Text = q10IsTrue
    ? (locale === 'en'
        ? 'In every true proportion, the product of the extremes always equals the product of the means.'
        : 'Σε κάθε αληθή αναλογία, το γινόμενο των άκρων όρων ισούται πάντοτε με το γινόμενο των μέσων όρων.')
    : (locale === 'en'
        ? 'In every proportion, the sum of the extremes always equals the sum of the means.'
        : 'Σε κάθε αναλογία, το άθροισμα των άκρων όρων ισούται πάντοτε με το άθροισμα των μέσων όρων.');

  return [
    {
      id: 'q1',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Finding the Unknown Term' : 'Εύρεση Αγνώστου Όρου',
      prompt: locale === 'en'
        ? `In proportion ${q1A} : ${q1B} ＝ ${q1C} : x, what is the value of x?`
        : `Στην αναλογία ${q1A} : ${q1B} ＝ ${q1C} : x, ποια είναι η τιμή του x;`,
      correct: String(q1D),
      explain: `${q1A} · x ＝ ${q1B} · ${q1C} ➔ x ＝ (${q1B} · ${q1C}) : ${q1A} ＝ ${q1B * q1C} : ${q1A} ＝ ${q1D}.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: locale === 'en' ? 'Testing Proportion' : 'Έλεγχος Αναλογίας',
      prompt: locale === 'en'
        ? `Which of the following ratios forms a true proportion with ratio ${q2A} : ${q2B}?`
        : `Ποιος από τους παρακάτω λόγους σχηματίζει αναλογία με τον λόγο ${q2A} : ${q2B};`,
      options: q2Options,
      correct: q2OptTrue,
      explain: `${q2A} · ${q2DTrue} ＝ ${q2A * q2DTrue} ＝ ${q2B} · ${q2CTrue} ＝ ${q2B * q2CTrue}.`
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Unknown in Extreme Position' : 'Άγνωστος σε Άκρα Θέση',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'In the equation of fractions' : 'Στην ισότητα κλασμάτων'}</span>
          <Fraction num="x" den={q3B} size="sm" />
          <span>＝</span>
          <Fraction num={q3Top} den={q3D} size="sm" />
          <span>{locale === 'en' ? ', what is x?' : ', ποια είναι η τιμή του x;'}</span>
        </span>
      ),
      correct: String(q3XVal),
      explain: (
        <span>
          x · {q3D} ＝ {q3B} · {q3Top} ➔ x ＝ ({q3B} · {q3Top}) : {q3D} ＝ {q3XVal}.
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'Proportion Terms' : 'Όροι Αναλογίας',
      prompt: locale === 'en'
        ? `In proportion ${q4N1} : ${q4N2} ＝ ${q4N3} : ${q4N4}, which terms are extremes and which are means?`
        : `Στην αναλογία ${q4N1} : ${q4N2} ＝ ${q4N3} : ${q4N4}, ποιοι είναι οι άκροι και ποιοι οι μέσοι όροι;`,
      options: q4Options,
      correct: q4CorrectAns,
      explain: locale === 'en'
        ? `In a : b ＝ c : d, the outer terms (${q4N1}, ${q4N4}) are extremes and inner terms (${q4N2}, ${q4N3}) are means.`
        : `Στη γραφή α : β ＝ γ : δ, άκροι όροι ονομάζονται οι εξωτερικοί (${q4N1} και ${q4N4}) και μέσοι όροι οι εσωτερικοί (${q4N2} και ${q4N3}).`
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'fraction',
      title: locale === 'en' ? 'Forming a Proportion' : 'Σχηματισμός Αναλογίας',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? `Find the equivalent fraction with numerator ${q5EqNum} so that` : `Βρες το ισοδύναμο κλάσμα με αριθμητή ${q5EqNum} ώστε`}</span>
          <Fraction num={q5Num} den={q5Den} size="sm" />
          <span>＝</span>
          <Fraction num={q5EqNum} den="x" size="sm" />
          <span>({locale === 'en' ? `write as ${q5EqNum}/${q5EqDen}` : `γράψε ως ${q5EqNum}/${q5EqDen}`}):</span>
        </span>
      ),
      correct: `${q5EqNum}/${q5EqDen}`,
      altCorrect: `${q5EqNum}:${q5EqDen}`,
      explain: (
        <span>
          {q5Num} · {q5K} ＝ {q5EqNum} ➔ {q5Den} · {q5K} ＝ {q5EqDen} ➔ <Fraction num={q5EqNum} den={q5EqDen} size="sm" />.
        </span>
      )
    },
    {
      id: 'q6',
      type: 'mcq',
      title: locale === 'en' ? 'Cross Products' : 'Σταυρωτά Γινόμενα',
      prompt: locale === 'en'
        ? `If proportion ${q6X} : ${q6Y} ＝ ${q6Z} : ${q6W} holds, which equality is always true?`
        : `Αν ισχύει η αναλογία ${q6X} : ${q6Y} ＝ ${q6Z} : ${q6W}, ποια ισότητα είναι πάντοτε αληθής;`,
      options: q6Options,
      correct: q6CorrectEq,
      explain: locale === 'en'
        ? `By the cross-multiplication property, product of extremes equals product of means: ${q6CorrectEq}.`
        : `Σύμφωνα με τη βασική ιδιότητα των αναλογιών, το γινόμενο των άκρων ισούται με το γινόμενο των μέσων: ${q6CorrectEq}.`
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
      title: `${locale === 'en' ? 'Problem' : 'Πρόβλημα'}: ${q7Data.title}`,
      prompt: q7Data.prompt,
      correct: q7Data.correctVal,
      tableData: q7Data.tableData,
      explain: q7Data.explain
    },
    {
      id: 'q8',
      type: 'mcq',
      title: locale === 'en' ? 'Calculating Unknown Term' : 'Υπολογισμός Άγνωστου Όρου',
      prompt: locale === 'en' ? `If ${q8A} : ${q8B} ＝ ${q8C} : x, what is x?` : `Αν ${q8A} : ${q8B} ＝ ${q8C} : x, ποια είναι η τιμή του x;`,
      options: q8Options,
      correct: String(q8D),
      explain: `x ＝ (${q8B} · ${q8C}) : ${q8A} ＝ ${q8B * q8C} : ${q8A} ＝ ${q8D}.`
    },
    {
      id: 'q9',
      type: 'mcq',
      title: `${locale === 'en' ? 'Challenge Problem' : 'Σύνθετο Πρόβλημα'}: ${q9Data.title}`,
      prompt: q9Data.prompt,
      options: q9Options,
      correct: q9Data.correctVal,
      tableData: q9Data.tableData,
      explain: q9Data.explain
    },
    {
      id: 'q10',
      type: 'tf',
      title: locale === 'en' ? 'Fundamental Proportion Property' : 'Βασική Ιδιότητα Αναλογιών',
      text: q10Text,
      correct: q10IsTrue,
      explain: (
        <span>
          {q10IsTrue
            ? (locale === 'en'
                ? 'Correct! In every proportion a : b ＝ c : d, it always holds that a · d ＝ b · c.'
                : 'Σωστά! Η θεμελιώδης ιδιότητα ορίζει ότι σε κάθε αναλογία α : β ＝ γ : δ ισχύει πάντοτε α · δ ＝ β · γ.')
            : (locale === 'en'
                ? 'False! Cross-products are equal (a · d ＝ b · c), not sums.'
                : 'Λάθος! Στις αναλογίες ισχύει η ισότητα των γινομένων (α · δ ＝ β · γ) και όχι των αθροισμάτων.')}
        </span>
      )
    }
  ];
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function AnalogiaExercisesPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateQuestions(locale);
    setQuestions(qList);
    const initialAnswers = {};
    qList.forEach(q => {
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
    loadNewSet();
  }, [loadNewSet]);

  const handleAnswerChange = (id, rawValue, type) => {
    if (submitted) return;
    if (type === 'input') {
      const q = questions.find(item => item.id === id);
      let sanitized = String(rawValue);
      if (q?.inputType === 'number') {
        sanitized = sanitized.replace(/[^0-9]/g, '');
      } else if (q?.inputType === 'decimal') {
        sanitized = sanitized.replace(/\./g, ',').replace(/[^0-9,]/g, '');
        const parts = sanitized.split(',');
        if (parts.length > 2) sanitized = parts[0] + ',' + parts.slice(1).join('');
      } else if (q?.inputType === 'fraction') {
        sanitized = sanitized.replace(/[^0-9/:]/g, '');
        const parts = sanitized.split(/[/:]/);
        if (parts.length > 2) {
          sanitized = parts[0] + '/' + parts.slice(1).join('');
        }
      }
      if (sanitized.length > 12) {
        sanitized = sanitized.slice(0, 12);
      }
      setAnswers(prev => ({ ...prev, [id]: sanitized }));
    } else {
      setAnswers(prev => ({ ...prev, [id]: rawValue }));
    }
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.replace(/\s+/g, '').replace(':', '/').replace(/^x[=＝]/i, '').trim().toLowerCase();
      const cleanTarget = q.correct.replace(/\s+/g, '').replace(':', '/').replace(/^x[=＝]/i, '').trim().toLowerCase();
      const cleanAlt = q.altCorrect ? q.altCorrect.replace(/\s+/g, '').replace(':', '/').replace(/^x[=＝]/i, '').trim().toLowerCase() : null;

      if (cleanUser === cleanTarget || (cleanAlt && cleanUser === cleanAlt)) return true;

      if (q.inputType === 'decimal') {
        const numUser = parseFloat(cleanUser.replace(',', '.'));
        const numTarget = parseFloat(cleanTarget.replace(',', '.'));
        return !isNaN(numUser) && !isNaN(numTarget) && Math.abs(numUser - numTarget) < 0.05;
      }
      return false;
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
    questions.forEach(q => {
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

  const answeredCount = Object.values(answers).filter(val => val !== undefined && val !== null && String(val).trim() !== '').length;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/41-analogia"
          locale={locale}
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryNav)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 box-border">
        
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
                <span>{t.badge}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
                {t.title}
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
                {t.desc}
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewSet}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation cursor-pointer"
            >
              <span>🔄</span>
              <span>{toCleanUppercase(t.newQuestions)}</span>
            </button>
          </div>
        </section>

        {/* ΦΟΡΜΑ ΜΕ ΤΙΣ 10 ΕΡΩΤΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 2xl:gap-8">
            {questions.map((q, idx) => {
              const qNum = idx + 1;
              return (
                <div
                  key={q.id}
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all overflow-hidden ${getCardStyle(q)}`}
                >
                  <div>
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider break-words">
                        {toCleanUppercase(`${t.exercise} ${qNum}: ${q.title}`)}
                      </span>
                      {submitted && (
                        <span className="text-xl">
                          {isQuestionCorrect(q) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* PROMPT (NO-GIVEAWAY: ΜΟΝΟ ΕΚΦΩΝΗΣΗ) */}
                    <div className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-4 break-words [overflow-wrap:anywhere]">
                      {q.type === 'tf' ? `«${q.text}»` : q.prompt}
                    </div>

                    {/* INPUTS / OPTIONS */}
                    {q.type === 'mcq' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = answers[q.id] === opt.val;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={submitted}
                              onClick={() => handleAnswerChange(q.id, opt.val, 'mcq')}
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border text-center transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex items-center justify-center min-h-[48px] cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {opt.render}
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
                          inputMode={q.inputType === 'fraction' ? 'text' : q.inputType === 'decimal' ? 'decimal' : 'numeric'}
                          maxLength={12}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                          placeholder={q.inputType === 'fraction' ? t.inputPlaceholderFraction : t.inputPlaceholderNumber}
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}

                    {q.type === 'tf' && (
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleAnswerChange(q.id, true, 'tf')}
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 cursor-pointer ${
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
                          onClick={() => handleAnswerChange(q.id, false, 'tf')}
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 cursor-pointer ${
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

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3">
                      {q.tableData && q.tableData.length > 0 && (
                        <div className="overflow-x-auto bg-white/90 p-2.5 rounded-2xl border border-slate-200 block w-full max-w-full">
                          <table className="w-full text-xs text-left text-slate-700 min-w-[240px]">
                            <thead>
                              <tr className="border-b border-slate-200 font-black text-slate-500 uppercase">
                                <th className="p-1.5 break-words">{toCleanUppercase(t.tableHeaderElement)}</th>
                                <th className="p-1.5 break-words">{toCleanUppercase(t.tableHeaderFormula)}</th>
                                <th className="p-1.5 break-words">{toCleanUppercase(t.tableHeaderValue)}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {q.tableData.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="p-1.5 font-sans font-bold text-slate-900 break-words">{row.item}</td>
                                  <td className="p-1.5 text-indigo-700 break-words">{row.formula}</td>
                                  <td className="p-1.5 font-black text-emerald-700 break-words">{row.val}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                          isQuestionCorrect(q)
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                            : 'bg-rose-100 text-rose-950 border border-rose-200'
                        }`}
                      >
                        <p className="font-bold mb-1">
                          {isQuestionCorrect(q) ? t.feedbackSuccess : t.feedbackReview}
                        </p>
                        <div className="break-words [overflow-wrap:anywhere]">{q.explain}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-base sm:text-lg font-black px-8 sm:px-10 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center gap-2.5 touch-manipulation cursor-pointer"
              >
                <span className="text-xl">🎯</span>
                <span>{toCleanUppercase(t.checkBtn)}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3`}>
          
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>{submitted ? toCleanUppercase(t.scoreBadge) : toCleanUppercase(t.answeredBadge)}:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">
                {submitted ? `${score} / 10` : `${answeredCount} / 10`}
              </span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase(t.percentage)}:{' '}
                <span className="text-emerald-400 font-black text-sm sm:text-base">
                  {Math.round((score / 10) * 100)}%
                </span>
              </span>
            )}
          </div>

          {/* GUIDANCE OR RESTART */}
          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation cursor-pointer"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(t.newQuestions)}</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.bottomHint}
              </p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}