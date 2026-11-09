// pages/st-dimotikou/75-embadon-trapeziou-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// -------------------------------------------------------------
// DEFENSIVE UTILITY FUNCTIONS
// -------------------------------------------------------------

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

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatNum(val, locale = 'el') {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  return Number(val).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
}

// Component για κανονική κατακόρυφη μορφή κλάσματος (numerator πάνω, γραμμή, denominator κάτω)
function MathFraction({ num, den }) {
  return (
    <span className="inline-flex flex-col items-center justify-center align-middle mx-0.5 sm:mx-1 text-center font-mono leading-none text-[0.85em] sm:text-[0.9em] shrink-0 max-w-full">
      <span className="border-b border-current pb-0.5 px-0.5 sm:px-1 break-all">{num}</span>
      <span className="pt-0.5 px-0.5 sm:px-1 break-all">{den}</span>
    </span>
  );
}

// Διασφάλιση ακριβώς 4 μοναδικών επιλογών για ερωτήσεις MCQ
function ensureFourUniqueOptions(correctText, distractorsGen) {
  const optionsSet = new Set([String(correctText).trim()]);
  const candidates = distractorsGen();

  for (const c of candidates) {
    if (optionsSet.size >= 4) break;
    if (c !== undefined && c !== null && String(c).trim() !== '') {
      optionsSet.add(String(c).trim());
    }
  }

  let offset = 5;
  while (optionsSet.size < 4) {
    const numPart = parseInt(String(correctText).replace(/[^0-9]/g, ''), 10);
    if (!isNaN(numPart)) {
      const unit = String(correctText).replace(/[0-9.,\s]/g, '');
      const fakeNum = numPart + offset;
      const fakeOpt = unit ? `${fakeNum} ${unit}` : `${fakeNum}`;
      optionsSet.add(fakeOpt);
      offset += 5;
    } else {
      optionsSet.add(`${correctText} · ${optionsSet.size}`);
    }
  }

  return shuffle([...optionsSet]);
}

// -------------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (POOLS) ΓΙΑ Q9, Q10, Q11, Q12 ME I18N
// -------------------------------------------------------------

// POOL ΓΙΑ Q9: Υπολογισμός Εμβαδού Τραπεζίου [Ε ＝ [(Β ＋ b) · υ] / 2]
const PROBLEM_POOL_Q9 = [
  // 1. Τραπέζιο οικόπεδο με παγίδα τις πλάγιες πλευρές
  (locale) => {
    const isEn = locale === 'en';
    const bigB = randInt(20, 40);
    const smallB = randInt(10, bigB - 5);
    const h = randInt(6, 11) * 2;
    const slant = h + randInt(3, 7);
    const sum = bigB + smallB;
    const area = (sum * h) / 2;
    const correct = `${formatNum(area, locale)} m²`;
    return {
      title: isEn ? 'TRAPEZOIDAL LOT' : 'ΤΡΑΠΕΖΙΟ ΟΙΚΟΠΕΔΟ',
      prompt: isEn
        ? `A trapezoid-shaped plot of land has a major base of ${formatNum(bigB, locale)} m, a minor base of ${formatNum(smallB, locale)} m, a perpendicular height of ${formatNum(h, locale)} m, and lateral sides of ${formatNum(slant, locale)} m and ${formatNum(slant + 2, locale)} m. What is the area of the plot?`
        : `Ένα οικόπεδο σχήματος τραπεζίου έχει μεγάλη βάση ${formatNum(bigB, locale)} m, μικρή βάση ${formatNum(smallB, locale)} m, κάθετο ύψος ${formatNum(h, locale)} m και πλάγιες πλευρές ${formatNum(slant, locale)} m και ${formatNum(slant + 2, locale)} m. Ποιο είναι το εμβαδόν του οικοπέδου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(sum * h, locale)} m²`,
        `${formatNum(Math.round((sum * slant) / 2), locale)} m²`,
        `${formatNum(area + 30, locale)} m²`,
        `${formatNum(area - 30 > 0 ? area - 30 : area + 60, locale)} m²`
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: isEn ? 'Major base (B)' : 'Μεγάλη βάση (Β)', value: `${formatNum(bigB, locale)} m` },
        { label: isEn ? 'Minor base (b)' : 'Μικρή βάση (b)', value: `${formatNum(smallB, locale)} m` },
        { label: isEn ? 'Perpendicular height (h)' : 'Κάθετο ύψος (υ)', value: `${formatNum(h, locale)} m` },
        { label: isEn ? 'Lateral sides' : 'Πλάγιες πλευρές', value: isEn ? 'Not used in the area formula' : 'Δεν χρησιμοποιούνται στον τύπο εμβαδού' },
        {
          label: isEn ? 'Formula & Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <span>{isEn ? 'A ＝ ' : 'Ε ＝ '}</span>
              <MathFraction num={`(${formatNum(bigB, locale)} ＋ ${formatNum(smallB, locale)}) · ${formatNum(h, locale)}`} den="2" />
              <span>＝</span>
              <MathFraction num={`${formatNum(sum, locale)} · ${formatNum(h, locale)}`} den="2" />
              <span>＝ {formatNum(area, locale)} m²</span>
            </span>
          )
        }
      ],
      explanation: isEn
        ? `First we add the two bases: ${formatNum(bigB, locale)} ＋ ${formatNum(smallB, locale)} ＝ ${formatNum(sum, locale)} m. Multiply by height and divide by 2: (${formatNum(sum, locale)} · ${formatNum(h, locale)}) : 2 ＝ ${formatNum(area, locale)} m². The lateral sides are not needed.`
        : `Προσθέτουμε πρώτα τις δύο βάσεις: ${formatNum(bigB, locale)} ＋ ${formatNum(smallB, locale)} ＝ ${formatNum(sum, locale)} m. Πολλαπλασιάζουμε με το ύψος και διαιρούμε με το 2: (${formatNum(sum, locale)} · ${formatNum(h, locale)}) : 2 ＝ ${formatNum(area, locale)} m². Οι πλάγιες πλευρές δεν χρειάζονται.`
    };
  },
  // 2. Μεταλλική τραπεζοειδής πλάκα
  (locale) => {
    const isEn = locale === 'en';
    const bigB = randInt(16, 26);
    const smallB = randInt(8, bigB - 4);
    const h = randInt(3, 7) * 2;
    const sum = bigB + smallB;
    const area = (sum * h) / 2;
    const correct = `${formatNum(area, locale)} cm²`;
    return {
      title: isEn ? 'TRAPEZOIDAL PLATE' : 'ΤΡΑΠΕΖΟΕΙΔΗΣ ΠΛΑΚΑ',
      prompt: isEn
        ? `A trapezoid-shaped metal plate has bases of ${formatNum(bigB, locale)} cm and ${formatNum(smallB, locale)} cm, and the distance between them (height) is ${formatNum(h, locale)} cm. What is its surface area?`
        : `Μια μεταλλική πλάκα σε σχήμα τραπεζίου έχει βάσεις ${formatNum(bigB, locale)} cm και ${formatNum(smallB, locale)} cm και απόσταση ανάμεσά τους (ύψος) ${formatNum(h, locale)} cm. Πόσο είναι το εμβαδόν της επιφάνειάς της;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(sum * h, locale)} cm²`,
        `${formatNum(area + 15, locale)} cm²`,
        `${formatNum(area - 15 > 0 ? area - 15 : area + 25, locale)} cm²`,
        `${formatNum(area * 2, locale)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Sum of bases (B ＋ b)' : 'Άθροισμα βάσεων (Β ＋ b)', value: `${formatNum(bigB, locale)} ＋ ${formatNum(smallB, locale)} ＝ ${formatNum(sum, locale)} cm` },
        { label: isEn ? 'Height (h)' : 'Ύψος (υ)', value: `${formatNum(h, locale)} cm` },
        {
          label: isEn ? 'Area' : 'Εμβαδόν',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num={`${formatNum(sum, locale)} · ${formatNum(h, locale)}`} den="2" />
              <span>＝ {formatNum(area, locale)} cm²</span>
            </span>
          )
        }
      ],
      explanation: `${isEn ? 'A ＝ [(B ＋ b) · h] : 2' : 'Ε ＝ [(Β ＋ b) · υ] : 2'} ＝ [(${formatNum(bigB, locale)} ＋ ${formatNum(smallB, locale)}) · ${formatNum(h, locale)}] : 2 ＝ ${formatNum(area, locale)} cm².`
    };
  },
  // 3. Τραπεζοειδές παρτέρι
  (locale) => {
    const isEn = locale === 'en';
    const correct = '72 m²';
    return {
      title: isEn ? 'TRAPEZOIDAL FLOWER BED' : 'ΠΑΡΤΕΡΙ ΣΧΗΜΑΤΟΣ ΤΡΑΠΕΖΙΟΥ',
      prompt: isEn
        ? 'A garden flower bed is shaped as a trapezoid with bases of 15 m and 9 m and a height of 6 m. How many square meters (m²) does it cover?'
        : 'Σε έναν κήπο κατασκευάζεται παρτέρι σε σχήμα τραπεζίου με βάσεις 15 m και 9 m και ύψος 6 m. Πόσα τετραγωνικά μέτρα (m²) καλύπτει;',
      options: ensureFourUniqueOptions(correct, () => ['144 m²', '60 m²', '80 m²', '54 m²']),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: isEn ? 'Bases' : 'Βάσεις', value: '15 m και 9 m' },
        { label: isEn ? 'Height' : 'Ύψος', value: '6 m' },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num="(15 ＋ 9) · 6" den="2" />
              <span>＝</span>
              <MathFraction num="24 · 6" den="2" />
              <span>＝</span>
              <MathFraction num="144" den="2" />
              <span>＝ 72 m²</span>
            </span>
          )
        }
      ],
      explanation: '[(15 ＋ 9) · 6] : 2 ＝ (24 · 6) : 2 ＝ 144 : 2 ＝ 72 m².'
    };
  },
  // 4. Επιφάνεια τραπεζιού γραφείου
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '6,000 cm²' : '6.000 cm²';
    const prodStr = isEn ? '12,000' : '12.000';
    return {
      title: isEn ? 'DESK SURFACE' : 'ΕΠΙΦΑΝΕΙΑ ΓΡΑΦΕΙΟΥ',
      prompt: isEn
        ? 'A desk surface has the shape of a trapezoid with parallel sides of 120 cm and 80 cm and a height of 60 cm. What is its area in cm²?'
        : 'Το καπάκι ενός γραφείου έχει σχήμα τραπεζίου με παράλληλες πλευρές 120 cm και 80 cm και ύψος 60 cm. Πόσο είναι το εμβαδόν του σε cm²;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '12,000 cm²' : '12.000 cm²',
        isEn ? '4,800 cm²' : '4.800 cm²',
        isEn ? '7,200 cm²' : '7.200 cm²',
        isEn ? '9,600 cm²' : '9.600 cm²'
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Bases' : 'Βάσεις', value: '120 cm και 80 cm' },
        { label: isEn ? 'Height' : 'Ύψος', value: '60 cm' },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num="(120 ＋ 80) · 60" den="2" />
              <span>＝</span>
              <MathFraction num="200 · 60" den="2" />
              <span>＝</span>
              <MathFraction num={prodStr} den="2" />
              <span>＝ {correct}</span>
            </span>
          )
        }
      ],
      explanation: isEn ? '[(120 ＋ 80) · 60] : 2 ＝ 6,000 cm².' : '[(120 ＋ 80) · 60] : 2 ＝ 6.000 cm².'
    };
  },
  // 5. Μετώπη γέφυρας
  (locale) => {
    const isEn = locale === 'en';
    const correct = '160 m²';
    return {
      title: isEn ? 'BRIDGE ABUTMENT' : 'ΜΕΤΩΠΗ ΓΕΦΥΡΑΣ',
      prompt: isEn
        ? 'The concrete abutment face of a bridge is trapezoidal with bases of 25 m and 15 m and a height of 8 m. What is its surface area?'
        : 'Η τσιμεντένια μετώπη μιας γέφυρας έχει σχήμα τραπεζίου με βάσεις 25 m και 15 m και ύψος 8 m. Πόσο είναι το εμβαδόν της μετώπης;',
      options: ensureFourUniqueOptions(correct, () => ['320 m²', '180 m²', '150 m²', '200 m²']),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: isEn ? 'Bases' : 'Βάσεις', value: '25 m και 15 m' },
        { label: isEn ? 'Height' : 'Ύψος', value: '8 m' },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num="(25 ＋ 15) · 8" den="2" />
              <span>＝</span>
              <MathFraction num="40 · 8" den="2" />
              <span>＝</span>
              <MathFraction num="320" den="2" />
              <span>＝ 160 m²</span>
            </span>
          )
        }
      ],
      explanation: '[(25 ＋ 15) · 8] : 2 ＝ 160 m².'
    };
  },
  // 6. Τζαμαρία στέγης
  (locale) => {
    const isEn = locale === 'en';
    const correct = '32 m²';
    return {
      title: isEn ? 'ROOF SKYLIGHT' : 'ΤΖΑΜΑΡΙΑ ΣΤΕΓΗΣ',
      prompt: isEn
        ? 'A glass skylight on a building roof is in the shape of a trapezoid with bases of 10 m and 6 m and a height of 4 m. How many square meters (m²) of glass are needed?'
        : 'Μια γυάλινη επιφάνεια στην οροφή ενός κτιρίου έχει σχήμα τραπεζίου με βάσεις 10 m και 6 m και ύψος 4 m. Πόσα τετραγωνικά μέτρα (m²) γυαλιού χρειάζονται;',
      options: ensureFourUniqueOptions(correct, () => ['64 m²', '40 m²', '24 m²', '48 m²']),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: isEn ? 'Bases' : 'Βάσεις', value: '10 m και 6 m' },
        { label: isEn ? 'Height' : 'Ύψος', value: '4 m' },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num="(10 ＋ 6) · 4" den="2" />
              <span>＝</span>
              <MathFraction num="16 · 4" den="2" />
              <span>＝</span>
              <MathFraction num="64" den="2" />
              <span>＝ 32 m²</span>
            </span>
          )
        }
      ],
      explanation: '[(10 ＋ 6) · 4] : 2 ＝ 32 m².'
    };
  }
];

// POOL ΓΙΑ Q10: Ορθογώνια Τραπέζια (Η κάθετη πλευρά είναι το ύψος)
const PROBLEM_POOL_Q10 = [
  // 1. Ορθογώνιο τραπέζιο με 4 πλευρές
  (locale) => {
    const isEn = locale === 'en';
    const correct = '120 cm²';
    return {
      title: isEn ? 'RIGHT TRAPEZOID' : 'ΟΡΘΟΓΩΝΙΟ ΤΡΑΠΕΖΙΟ',
      prompt: isEn
        ? 'In a right-angled trapezoid, the parallel bases are 18 cm and 12 cm. The side perpendicular to the bases measures 8 cm and the other slanted side measures 10 cm. What is its area?'
        : 'Σε ένα ορθογώνιο τραπέζιο οι παράλληλες βάσεις είναι 18 cm και 12 cm. Η πλευρά που είναι κάθετη στις βάσεις μετράει 8 cm και η άλλη πλάγια πλευρά μετράει 10 cm. Πόσο είναι το εμβαδόν του;',
      options: ensureFourUniqueOptions(correct, () => ['240 cm²', '150 cm²', '100 cm²', '96 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Bases (B, b)' : 'Βάσεις (Β, b)', value: '18 cm και 12 cm' },
        { label: isEn ? 'Perpendicular side (height h)' : 'Κάθετη πλευρά (ύψος υ)', value: '8 cm' },
        { label: isEn ? 'Slanted side' : 'Πλάγια πλευρά', value: isEn ? '10 cm (not needed)' : '10 cm (δεν χρειάζεται)' },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num="(18 ＋ 12) · 8" den="2" />
              <span>＝</span>
              <MathFraction num="30 · 8" den="2" />
              <span>＝</span>
              <MathFraction num="240" den="2" />
              <span>＝ 120 cm²</span>
            </span>
          )
        }
      ],
      explanation: isEn
        ? 'In a right trapezoid, the side perpendicular to the bases is the height itself (h ＝ 8 cm). Therefore: [(18 ＋ 12) · 8] : 2 ＝ 120 cm².'
        : 'Στο ορθογώνιο τραπέζιο η πλευρά που είναι κάθετη στις βάσεις είναι το ίδιο το ύψος (υ ＝ 8 cm). Επομένως: [(18 ＋ 12) · 8] : 2 ＝ 120 cm².'
    };
  },
  // 2. Οικόπεδο ορθογώνιο τραπέζιο
  (locale) => {
    const isEn = locale === 'en';
    const bigB = randInt(25, 45);
    const smallB = randInt(15, bigB - 6);
    const h = randInt(7, 12) * 2;
    const sum = bigB + smallB;
    const area = (sum * h) / 2;
    const correct = `${formatNum(area, locale)} m²`;
    return {
      title: isEn ? 'RIGHT-TRAPEZOIDAL PLOT' : 'ΟΡΘΟΓΩΝΙΟ ΤΡΑΠΕΖΟΕΙΔΕΣ ΟΙΚΟΠΕΔΟ',
      prompt: isEn
        ? `A land lot is in the shape of a right-angled trapezoid with bases of ${formatNum(bigB, locale)} m and ${formatNum(smallB, locale)} m. The side forming right angles with the bases has a length of ${formatNum(h, locale)} m. What is the area of the plot?`
        : `Ένα οικόπεδο έχει σχήμα ορθογωνίου τραπεζίου με βάσεις ${formatNum(bigB, locale)} m και ${formatNum(smallB, locale)} m. Η πλευρά που σχηματίζει ορθές γωνίες με τις βάσεις έχει μήκος ${formatNum(h, locale)} m. Πόσο είναι το εμβαδόν του οικοπέδου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(sum * h, locale)} m²`,
        `${formatNum(area + 40, locale)} m²`,
        `${formatNum(area - 30 > 0 ? area - 30 : area + 80, locale)} m²`,
        `${formatNum(area * 2, locale)} m²`
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: isEn ? 'Sum of bases' : 'Άθροισμα βάσεων', value: `${formatNum(bigB, locale)} ＋ ${formatNum(smallB, locale)} ＝ ${formatNum(sum, locale)} m` },
        { label: isEn ? 'Height (perpendicular side)' : 'Ύψος (κάθετη πλευρά)', value: `${formatNum(h, locale)} m` },
        {
          label: isEn ? 'Area' : 'Εμβαδόν',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num={`${formatNum(sum, locale)} · ${formatNum(h, locale)}`} den="2" />
              <span>＝ {formatNum(area, locale)} m²</span>
            </span>
          )
        }
      ],
      explanation: isEn
        ? `The perpendicular leg serves as the height of the trapezoid. A ＝ [(${formatNum(bigB, locale)} ＋ ${formatNum(smallB, locale)}) · ${formatNum(h, locale)}] : 2 ＝ ${formatNum(area, locale)} m².`
        : `Η κάθετη πλευρά αποτελεί το ύψος του τραπεζίου. Ε ＝ [(${formatNum(bigB, locale)} ＋ ${formatNum(smallB, locale)}) · ${formatNum(h, locale)}] : 2 ＝ ${formatNum(area, locale)} m².`
    };
  },
  // 3. Ορθογώνιο τραπέζιο 20 και 10 με ύψος 12
  (locale) => {
    const isEn = locale === 'en';
    const correct = '180 m²';
    return {
      title: isEn ? 'AREA WITH PERPENDICULAR LEG' : 'ΕΜΒΑΔΟΝ ΜΕ ΚΑΘΕΤΗ ΠΛΕΥΡΑ',
      prompt: isEn
        ? 'A right trapezoid has bases of 20 m and 10 m, while its perpendicular side is 12 m. What is its area?'
        : 'Ένα ορθογώνιο τραπέζιο έχει βάσεις 20 m και 10 m, ενώ η κάθετη πλευρά του είναι 12 m. Πόσο είναι το εμβαδόν του;',
      options: ensureFourUniqueOptions(correct, () => ['360 m²', '120 m²', '200 m²', '150 m²']),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: isEn ? 'Bases' : 'Βάσεις', value: '20 m και 10 m' },
        { label: isEn ? 'Height' : 'Ύψος', value: '12 m' },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num="(20 ＋ 10) · 12" den="2" />
              <span>＝</span>
              <MathFraction num="30 · 12" den="2" />
              <span>＝</span>
              <MathFraction num="360" den="2" />
              <span>＝ 180 m²</span>
            </span>
          )
        }
      ],
      explanation: '[(20 ＋ 10) · 12] : 2 ＝ 180 m².'
    };
  },
  // 4. Χωρισμός ορθογωνίου τραπεζίου σε ορθογώνιο και τρίγωνο
  (locale) => {
    const isEn = locale === 'en';
    const correct = '104 cm²';
    return {
      title: isEn ? 'PARTITION INTO RECTANGLE AND TRIANGLE' : 'ΧΩΡΙΣΜΟΣ ΣΕ ΟΡΘΟΓΩΝΙΟ ΚΑΙ ΤΡΙΓΩΝΟ',
      prompt: isEn
        ? 'A right trapezoid has bases of 16 cm and 10 cm and a perpendicular height of 8 cm. What is its area?'
        : 'Ένα ορθογώνιο τραπέζιο έχει βάσεις 16 cm και 10 cm και κάθετη πλευρά (ύψος) 8 cm. Πόσο είναι το εμβαδόν του;',
      options: ensureFourUniqueOptions(correct, () => ['208 cm²', '80 cm²', '128 cm²', '96 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Bases' : 'Βάσεις', value: isEn ? '16 cm and 10 cm (sum 26 cm)' : '16 cm και 10 cm (άθροισμα 26 cm)' },
        { label: isEn ? 'Height' : 'Ύψος', value: '8 cm' },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num="26 · 8" den="2" />
              <span>＝</span>
              <MathFraction num="208" den="2" />
              <span>＝ 104 cm²</span>
            </span>
          )
        }
      ],
      explanation: isEn
        ? '(26 · 8) : 2 ＝ 104 cm². (Also: rectangle 10 · 8 ＝ 80 cm² ＋ triangle (6 · 8) : 2 ＝ 24 cm², total 80 ＋ 24 ＝ 104 cm²).'
        : '(26 · 8) : 2 ＝ 104 cm². (Επίσης: ορθογώνιο 10 · 8 ＝ 80 cm² ＋ τρίγωνο (6 · 8) : 2 ＝ 24 cm², σύνολο 80 ＋ 24 ＝ 104 cm²).'
    };
  },
  // 5. Ορθογώνιο τραπέζιο 14 και 6 με ύψος 10
  (locale) => {
    const isEn = locale === 'en';
    const correct = '100 cm²';
    return {
      title: isEn ? 'AREA OF 100 CM²' : 'ΕΜΒΑΔΟΝ 100 CM²',
      prompt: isEn
        ? 'In a right trapezoid, the major base is 14 cm, the minor base is 6 cm, and the height is 10 cm. What is its area?'
        : 'Σε ένα ορθογώνιο τραπέζιο η μεγάλη βάση είναι 14 cm, η μικρή βάση είναι 6 cm και το ύψος είναι 10 cm. Πόσο είναι το εμβαδόν του;',
      options: ensureFourUniqueOptions(correct, () => ['200 cm²', '140 cm²', '60 cm²', '120 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Bases' : 'Βάσεις', value: '14 cm και 6 cm' },
        { label: isEn ? 'Height' : 'Ύψος', value: '10 cm' },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num="(14 ＋ 6) · 10" den="2" />
              <span>＝</span>
              <MathFraction num="20 · 10" den="2" />
              <span>＝</span>
              <MathFraction num="200" den="2" />
              <span>＝ 100 cm²</span>
            </span>
          )
        }
      ],
      explanation: '[(14 ＋ 6) · 10] : 2 ＝ 100 cm².'
    };
  },
  // 6. Πινακίδα ορθογώνιου τραπεζίου
  (locale) => {
    const isEn = locale === 'en';
    const correct = '375 cm²';
    return {
      title: isEn ? 'TRAPEZOIDAL SIGN' : 'ΤΡΑΠΕΖΟΕΙΔΗΣ ΠΙΝΑΚΙΔΑ',
      prompt: isEn
        ? 'A signpost is in the shape of a right trapezoid with bases of 30 cm and 20 cm and a perpendicular leg of 15 cm. What is its area?'
        : 'Μια πινακίδα έχει σχήμα ορθογωνίου τραπεζίου με βάσεις 30 cm και 20 cm και κάθετη πλευρά 15 cm. Πόσο είναι το εμβαδόν της;',
      options: ensureFourUniqueOptions(correct, () => ['750 cm²', '300 cm²', '450 cm²', '350 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Bases' : 'Βάσεις', value: '30 cm και 20 cm' },
        { label: isEn ? 'Height' : 'Ύψος', value: '15 cm' },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num="(30 ＋ 20) · 15" den="2" />
              <span>＝</span>
              <MathFraction num="50 · 15" den="2" />
              <span>＝</span>
              <MathFraction num="750" den="2" />
              <span>＝ 375 cm²</span>
            </span>
          )
        }
      ],
      explanation: '[(30 ＋ 20) · 15] : 2 ＝ 375 cm².'
    };
  }
];

// POOL ΓΙΑ Q11: Αντίστροφο Πρόβλημα [υ ＝ (2 · Ε) / (Β ＋ b) ή (Β ＋ b) ＝ (2 · Ε) / υ]
const PROBLEM_POOL_Q11 = [
  // 1. Εύρεση ύψους όταν δίνονται οι βάσεις και το εμβαδόν
  (locale) => {
    const isEn = locale === 'en';
    const bigB = randInt(18, 30);
    const smallB = randInt(8, 16);
    const h = randInt(8, 16);
    const sum = bigB + smallB;
    const area = (sum * h) / 2;
    const correct = `${formatNum(h, locale)} cm`;
    return {
      title: isEn ? 'FINDING TRAPEZOID HEIGHT' : 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΤΡΑΠΕΖΙΟΥ',
      prompt: isEn
        ? `A trapezoid has an area of ${formatNum(area, locale)} cm² and its bases are ${formatNum(bigB, locale)} cm and ${formatNum(smallB, locale)} cm. What is the height of the trapezoid?`
        : `Ένα τραπέζιο έχει εμβαδόν ${formatNum(area, locale)} cm² και οι βάσεις του είναι ${formatNum(bigB, locale)} cm και ${formatNum(smallB, locale)} cm. Πόσο είναι το ύψος του τραπεζίου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(h + 3, locale)} cm`,
        `${formatNum(h - 2 > 0 ? h - 2 : h + 4, locale)} cm`,
        `${formatNum(Math.round(area / sum), locale)} cm`,
        `${formatNum(h * 2, locale)} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: isEn ? 'Area (A)' : 'Εμβαδόν (Ε)', value: `${formatNum(area, locale)} cm²` },
        { label: isEn ? 'Doubled area (2 · A)' : 'Διπλάσιο εμβαδόν (2 · Ε)', value: `${formatNum(2 * area, locale)} cm²` },
        { label: isEn ? 'Sum of bases (B ＋ b)' : 'Άθροισμα βάσεων (Β ＋ b)', value: `${formatNum(bigB, locale)} ＋ ${formatNum(smallB, locale)} ＝ ${formatNum(sum, locale)} cm` },
        {
          label: isEn ? 'Height calculation' : 'Πράξη ύψους',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num={formatNum(2 * area, locale)} den={formatNum(sum, locale)} />
              <span>＝ {formatNum(h, locale)} cm</span>
            </span>
          )
        }
      ],
      explanation: isEn
        ? `First we double the area: 2 · ${formatNum(area, locale)} ＝ ${formatNum(2 * area, locale)} cm². Then we divide by the sum of bases: ${formatNum(2 * area, locale)} : ${formatNum(sum, locale)} ＝ ${formatNum(h, locale)} cm.`
        : `Διπλασιάζουμε πρώτα το εμβαδόν: 2 · ${formatNum(area, locale)} ＝ ${formatNum(2 * area, locale)} cm². Έπειτα διαιρούμε με το άθροισμα των βάσεων: ${formatNum(2 * area, locale)} : ${formatNum(sum, locale)} ＝ ${formatNum(h, locale)} cm.`
    };
  },
  // 2. Εύρεση της μικρής βάσης
  (locale) => {
    const isEn = locale === 'en';
    const correct = '14 cm';
    return {
      title: isEn ? 'FINDING MINOR BASE' : 'ΕΥΡΕΣΗ ΜΙΚΡΗΣ ΒΑΣΗΣ',
      prompt: isEn
        ? 'A trapezoid has an area of 180 cm² and a height of 10 cm. If its major base is 22 cm, what is the length of the minor base?'
        : 'Ένα τραπέζιο έχει εμβαδόν 180 cm² και ύψος 10 cm. Αν η μεγάλη βάση του είναι 22 cm, πόσο είναι το μήκος της μικρής βάσης;',
      options: ensureFourUniqueOptions(correct, () => ['12 cm', '16 cm', '10 cm', '18 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: isEn ? 'Doubled area' : 'Διπλάσιο εμβαδόν', value: '2 · 180 ＝ 360 cm²' },
        {
          label: isEn ? 'Sum of bases (B ＋ b)' : 'Άθροισμα βάσεων (Β ＋ b)',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num="360" den="10" />
              <span>＝ 36 cm</span>
            </span>
          )
        },
        { label: isEn ? 'Minor base (b)' : 'Μικρή βάση (b)', value: '36 － 22 ＝ 14 cm' }
      ],
      explanation: isEn
        ? 'Find the sum of the bases: (2 · 180) : 10 ＝ 36 cm. Subtract the major base: 36 － 22 ＝ 14 cm.'
        : 'Βρίσκουμε το άθροισμα των βάσεων: (2 · 180) : 10 ＝ 36 cm. Αφαιρούμε τη μεγάλη βάση: 36 － 22 ＝ 14 cm.'
    };
  },
  // 3. Εύρεση ύψους με Ε = 150 m² και βάσεις 20 και 10
  (locale) => {
    const isEn = locale === 'en';
    const correct = '10 m';
    return {
      title: isEn ? 'CALCULATING LOT HEIGHT' : 'ΥΠΟΛΟΓΙΣΜΟΣ ΥΨΟΥΣ ΟΙΚΟΠΕΔΟΥ',
      prompt: isEn
        ? 'A trapezoidal plot of land has an area of 150 m² and bases of 20 m and 10 m. What is the height of the plot?'
        : 'Ένα τραπεζοειδές οικόπεδο έχει εμβαδόν 150 m² και βάσεις 20 m και 10 m. Πόσο είναι το ύψος του οικοπέδου;',
      options: ensureFourUniqueOptions(correct, () => ['5 m', '15 m', '8 m', '12 m']),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: isEn ? 'Area' : 'Εμβαδόν', value: '150 m²' },
        { label: isEn ? 'Doubled area' : 'Διπλάσιο εμβαδόν', value: '2 · 150 ＝ 300 m²' },
        { label: isEn ? 'Sum of bases' : 'Άθροισμα βάσεων', value: '20 ＋ 10 ＝ 30 m' },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num="300" den="30" />
              <span>＝ 10 m</span>
            </span>
          )
        }
      ],
      explanation: '(2 · 150) : (20 ＋ 10) ＝ 300 : 30 ＝ 10 m.'
    };
  },
  // 4. Εύρεση μεγάλης βάσης
  (locale) => {
    const isEn = locale === 'en';
    const correct = '18 cm';
    return {
      title: isEn ? 'FINDING MAJOR BASE' : 'ΕΥΡΕΣΗ ΜΕΓΑΛΗΣ ΒΑΣΗΣ',
      prompt: isEn
        ? 'In a trapezoid with an area of 112 cm² and a height of 8 cm, the minor base is 10 cm. What is the length of the major base?'
        : 'Σε ένα τραπέζιο με εμβαδόν 112 cm² και ύψος 8 cm, η μικρή βάση είναι 10 cm. Πόσο είναι το μήκος της μεγάλης βάσης;',
      options: ensureFourUniqueOptions(correct, () => ['16 cm', '20 cm', '14 cm', '22 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        {
          label: isEn ? 'Sum of bases' : 'Άθροισμα βάσεων',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num="2 · 112" den="8" />
              <span>＝</span>
              <MathFraction num="224" den="8" />
              <span>＝ 28 cm</span>
            </span>
          )
        },
        { label: isEn ? 'Major base (B)' : 'Μεγάλη βάση (Β)', value: '28 － 10 ＝ 18 cm' }
      ],
      explanation: isEn
        ? '(2 · 112) : 8 ＝ 28 cm. Major base: 28 － 10 ＝ 18 cm.'
        : '(2 · 112) : 8 ＝ 28 cm. Μεγάλη βάση: 28 － 10 ＝ 18 cm.'
    };
  },
  // 5. Εύρεση ύψους με Ε = 80 cm² και βάσεις 12 και 8
  (locale) => {
    const isEn = locale === 'en';
    const correct = '8 cm';
    return {
      title: isEn ? 'TRAPEZOID HEIGHT' : 'ΥΨΟΣ ΤΡΑΠΕΖΙΟΥ',
      prompt: isEn
        ? 'A trapezoid has an area of 80 cm² and the sum of its bases is 20 cm. What is its height?'
        : 'Ένα τραπέζιο έχει εμβαδόν 80 cm² και το άθροισμα των βάσεών του είναι 20 cm. Πόσο είναι το ύψος του;',
      options: ensureFourUniqueOptions(correct, () => ['4 cm', '10 cm', '16 cm', '6 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: isEn ? 'Doubled area' : 'Διπλάσιο εμβαδόν', value: '2 · 80 ＝ 160 cm²' },
        {
          label: isEn ? 'Calculation' : 'Πράξη ύψους',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num="160" den="20" />
              <span>＝ 8 cm</span>
            </span>
          )
        }
      ],
      explanation: '(2 · 80) : 20 ＝ 8 cm.'
    };
  },
  // 6. Εύρεση άθροισμα βάσεων με Ε = 240 m² και υ = 12 m
  (locale) => {
    const isEn = locale === 'en';
    const correct = '40 m';
    return {
      title: isEn ? 'SUM OF BASES' : 'ΑΘΡΟΙΣΜΑ ΒΑΣΕΩΝ ΤΡΑΠΕΖΙΟΥ',
      prompt: isEn
        ? 'In a trapezoidal field the area is 240 m² and the height is 12 m. What is the sum of its two parallel sides (B ＋ b)?'
        : 'Σε ένα τραπεζοειδές χωράφι το εμβαδόν είναι 240 m² και το ύψος είναι 12 m. Πόσο είναι το άθροισμα των δύο παράλληλων πλευρών του (Β ＋ b);',
      options: ensureFourUniqueOptions(correct, () => ['20 m', '30 m', '50 m', '24 m']),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: isEn ? 'Doubled area' : 'Διπλάσιο εμβαδόν', value: '2 · 240 ＝ 480 m²' },
        {
          label: isEn ? 'Sum of bases' : 'Άθροισμα βάσεων',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num="480" den="12" />
              <span>＝ 40 m</span>
            </span>
          )
        }
      ],
      explanation: '(2 · 240) : 12 ＝ 480 : 12 ＝ 40 m.'
    };
  }
];

// POOL ΓΙΑ Q12: Σύνθετα Προβλήματα, Στρέμματα & Μετατροπές Μονάδων
const PROBLEM_POOL_Q12 = [
  // 1. Αγροτεμάχιο σε στρέμματα
  (locale) => {
    const isEn = locale === 'en';
    const correct = `${formatNum(3, locale)} ${isEn ? 'stremmata' : 'στρέμματα'}`;
    const areaStr = isEn ? '3,000' : '3.000';
    const prodStr = isEn ? '6,000' : '6.000';
    const divStr = isEn ? '1,000' : '1.000';
    return {
      title: isEn ? 'TRAPEZOIDAL FIELD IN STREMMATA' : 'ΤΡΑΠΕΖΟΕΙΔΗΣ ΑΓΡΟΣ ΣΕ ΣΤΡΕΜΜΑΤΑ',
      prompt: isEn
        ? 'A farm field is in the shape of a trapezoid with bases of 80 m and 40 m and a perpendicular distance between them (height) of 50 m. How many stremmata is the area of the field?'
        : 'Ένας αγρός έχει σχήμα τραπεζίου με βάσεις 80 m και 40 m και κάθετη απόσταση μεταξύ τους (ύψος) 50 m. Πόσα στρέμματα είναι η έκταση του αγρού;',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(6, locale)} ${isEn ? 'stremmata' : 'στρέμματα'}`,
        `${formatNum(30, locale)} ${isEn ? 'stremmata' : 'στρέμματα'}`,
        `${formatNum(1.5, locale)} ${isEn ? 'stremmata' : 'στρέμματα'}`,
        `${formatNum(0.3, locale)} ${isEn ? 'stremmata' : 'στρέμματα'}`
      ]),
      correctAnswer: correct,
      unit: isEn ? 'stremmata' : 'στρέμματα',
      tableData: [
        {
          label: isEn ? 'Area in m²' : 'Εμβαδόν σε m²',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num="(80 ＋ 40) · 50" den="2" />
              <span>＝</span>
              <MathFraction num="120 · 50" den="2" />
              <span>＝</span>
              <MathFraction num={prodStr} den="2" />
              <span>＝ {areaStr} m²</span>
            </span>
          )
        },
        {
          label: isEn ? 'Conversion to stremmata (: 1,000)' : 'Μετατροπή σε στρέμματα (: 1.000)',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num={areaStr} den={divStr} />
              <span>＝ {correct}</span>
            </span>
          )
        }
      ],
      explanation: isEn
        ? 'A ＝ [(80 ＋ 40) · 50] : 2 ＝ 3,000 m². Since 1 stremma ＝ 1,000 m²: 3,000 : 1,000 ＝ 3 stremmata.'
        : 'Ε ＝ [(80 ＋ 40) · 50] : 2 ＝ 3.000 m². Επειδή 1 στρέμμα ＝ 1.000 m², έχουμε: 3.000 : 1.000 ＝ 3 στρέμματα.'
    };
  },
  // 2. Βάσεις σε m και ύψος σε cm
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '9,000 cm²' : '9.000 cm²';
    const prodStr = isEn ? '18,000' : '18.000';
    return {
      title: isEn ? 'MIXED UNITS (M AND CM)' : 'ΔΙΑΦΟΡΕΤΙΚΕΣ ΜΟΝΑΔΕΣ (M ΚΑΙ CM)',
      prompt: isEn
        ? 'In a trapezoid the major base is 2 m, the minor base is 1 m, and the height is 60 cm. What is its area in square centimeters (cm²)?'
        : 'Σε ένα τραπέζιο η μεγάλη βάση είναι 2 m, η μικρή βάση είναι 1 m και το ύψος είναι 60 cm. Πόσο είναι το εμβαδόν του σε τετραγωνικά εκατοστόμετρα (cm²);',
      options: ensureFourUniqueOptions(correct, () => [
        '90 cm²',
        isEn ? '18,000 cm²' : '18.000 cm²',
        '900 cm²',
        isEn ? '4,500 cm²' : '4.500 cm²'
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Bases in cm' : 'Βάσεις σε cm', value: isEn ? '2 m ＝ 200 cm, 1 m ＝ 100 cm (sum 300 cm)' : '2 m ＝ 200 cm, 1 m ＝ 100 cm (άθροισμα 300 cm)' },
        { label: isEn ? 'Height' : 'Ύψος', value: '60 cm' },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num="300 · 60" den="2" />
              <span>＝</span>
              <MathFraction num={prodStr} den="2" />
              <span>＝ {correct}</span>
            </span>
          )
        }
      ],
      explanation: isEn
        ? 'Convert meters to centimeters: B ＝ 200 cm, b ＝ 100 cm. Area: [(200 ＋ 100) · 60] : 2 ＝ 9,000 cm².'
        : 'Μετατρέπουμε τα μέτρα σε εκατοστά: Β ＝ 200 cm, b ＝ 100 cm. Εμβαδόν: [(200 ＋ 100) · 60] : 2 ＝ 9.000 cm².'
    };
  },
  // 3. Εμβαδόν σε dm² και μετατροπή σε cm²
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '2,000 cm²' : '2.000 cm²';
    return {
      title: isEn ? 'CONVERT FROM DM² TO CM²' : 'ΜΕΤΑΤΡΟΠΗ ΑΠΟ DM² ΣΕ CM²',
      prompt: isEn
        ? 'A trapezoid has bases of 7 dm and 3 dm and a height of 4 dm (area 20 dm²). How many square centimeters (cm²) is its area?'
        : 'Ένα τραπέζιο έχει βάσεις 7 dm και 3 dm και ύψος 4 dm (εμβαδόν 20 dm²). Πόσα τετραγωνικά εκατοστόμετρα (cm²) είναι το εμβαδόν του;',
      options: ensureFourUniqueOptions(correct, () => [
        '200 cm²',
        isEn ? '20,000 cm²' : '20.000 cm²',
        isEn ? '4,000 cm²' : '4.000 cm²',
        isEn ? '1,000 cm²' : '1.000 cm²'
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        {
          label: isEn ? 'Area in dm²' : 'Εμβαδόν σε dm²',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num="(7 ＋ 3) · 4" den="2" />
              <span>＝ 20 dm²</span>
            </span>
          )
        },
        { label: isEn ? 'dm² to cm² ratio' : 'Σχέση dm²/cm²', value: '1 dm² ＝ 100 cm²' },
        {
          label: isEn ? 'Operation (· 100)' : 'Πράξη (· 100)',
          valueNode: <span>20 · 100 ＝ {correct}</span>
        }
      ],
      explanation: isEn ? 'A ＝ 20 dm². 1 dm² ＝ 100 cm², so 20 · 100 ＝ 2,000 cm².' : 'Ε ＝ 20 dm². 1 dm² ＝ 100 cm², άρα 20 · 100 ＝ 2.000 cm².'
    };
  },
  // 4. Αξία πώλησης τραπεζοειδούς οικοπέδου
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '60,000 €' : '60.000 €';
    return {
      title: isEn ? 'PLOT SALE VALUE' : 'ΑΞΙΑ ΠΩΛΗΣΗΣ ΟΙΚΟΠΕΔΟΥ',
      prompt: isEn
        ? 'A trapezoid-shaped plot of land with bases of 30 m and 20 m and a height of 16 m is sold for 150 € per square meter (m²). What is the total selling price?'
        : 'Ένα οικόπεδο σχήματος τραπεζίου με βάσεις 30 m και 20 m και ύψος 16 m πωλείται προς 150 € το τετραγωνικό μέτρο (m²). Ποια είναι η συνολική αξία πώλησης;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '120,000 €' : '120.000 €',
        isEn ? '30,000 €' : '30.000 €',
        isEn ? '6,000 €' : '6.000 €',
        isEn ? '80,000 €' : '80.000 €'
      ]),
      correctAnswer: correct,
      unit: '€',
      tableData: [
        {
          label: isEn ? 'Area in m²' : 'Εμβαδόν σε m²',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num="(30 ＋ 20) · 16" den="2" />
              <span>＝ 400 m²</span>
            </span>
          )
        },
        { label: isEn ? 'Price per m²' : 'Τιμή ανά m²', value: '150 €' },
        {
          label: isEn ? 'Total cost' : 'Συνολικό κόστος',
          valueNode: <span>400 · 150 € ＝ {correct}</span>
        }
      ],
      explanation: isEn ? 'Area: 400 m². Total value: 400 · 150 € ＝ 60,000 €.' : 'Εμβαδόν: 400 m². Συνολική αξία: 400 · 150 € ＝ 60.000 €.'
    };
  },
  // 5. Ισοδύναμο παραλληλόγραμμο και τραπέζιο
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn
      ? 'The parallelogram has twice the area'
      : 'Το παραλληλόγραμμο έχει το διπλάσιο εμβαδόν';
    return {
      title: isEn ? 'COMPARISON WITH PARALLELOGRAM' : 'ΣΥΓΚΡΙΣΗ ΜΕ ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟ',
      prompt: isEn
        ? 'We have a trapezoid with bases B and b and height h, and a parallelogram that has a base equal to (B ＋ b) and the same height h. What is the relationship between their areas?'
        : 'Έχουμε ένα τραπέζιο με βάσεις Β και b και ύψος υ, και ένα παραλληλόγραμμο που έχει βάση ίση με (Β ＋ b) και το ίδιο ύψος υ. Ποια είναι η σχέση των εμβαδών τους;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? 'They have the exact same area' : 'Έχουν ακριβώς το ίδιο εμβαδόν',
        isEn ? 'The trapezoid has a larger area' : 'Το τραπέζιο έχει μεγαλύτερο εμβαδόν',
        isEn ? 'The parallelogram has four times the area' : 'Το παραλληλόγραμμο έχει το τετραπλάσιο εμβαδόν'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'answer' : 'απάντηση',
      tableData: [
        {
          label: isEn ? 'Parallelogram area' : 'Εμβαδόν παραλληλογράμμου',
          valueNode: <span>{isEn ? 'A ＝ (B ＋ b) · h' : 'Ε ＝ (Β ＋ b) · υ'}</span>
        },
        {
          label: isEn ? 'Trapezoid area' : 'Εμβαδόν τραπεζίου',
          valueNode: (
            <span className="inline-flex items-center">
              <span>{isEn ? 'A ＝ ' : 'Ε ＝ '}</span>
              <MathFraction num={isEn ? '(B ＋ b) · h' : '(Β ＋ b) · υ'} den="2" />
              <span className="ml-1">{isEn ? '(half)' : '(το μισό)'}</span>
            </span>
          )
        }
      ],
      explanation: isEn
        ? 'The trapezoid is strictly half of the parallelogram that has a base of (B ＋ b) and the same height.'
        : 'Το τραπέζιο είναι ακριβώς το μισό του παραλληλογράμμου που έχει βάση (Β ＋ b) και το ίδιο ύψος.'
    };
  },
  // 6. Διπλασιασμός του ύψους
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? 'The area doubles' : 'Το εμβαδόν διπλασιάζεται';
    return {
      title: isEn ? 'SCALING TRAPEZOID HEIGHT' : 'ΜΕΤΑΒΟΛΗ ΔΙΑΣΤΑΣΕΩΝ ΤΡΑΠΕΖΙΟΥ',
      prompt: isEn
        ? 'If we double the height of a trapezoid while keeping both bases constant, how does its area change?'
        : 'Αν σε ένα τραπέζιο διπλασιάσουμε το ύψος του διατηρώντας τις δύο βάσεις σταθερές, πώς θα αλλάξει το εμβαδόν του;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? 'The area quadruples' : 'Το εμβαδόν τετραπλασιάζεται',
        isEn ? 'The area remains unchanged' : 'Το εμβαδόν παραμένει ίδιο',
        isEn ? 'The area is halved' : 'Το εμβαδόν υποδιπλασιάζεται'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'answer' : 'απάντηση',
      tableData: [
        {
          label: isEn ? 'Initial area' : 'Αρχικό εμβαδόν',
          valueNode: (
            <span className="inline-flex items-center">
              <span>{isEn ? 'A₁ ＝ ' : 'Ε₁ ＝ '}</span>
              <MathFraction num={isEn ? '(B ＋ b) · h' : '(Β ＋ b) · υ'} den="2" />
            </span>
          )
        },
        {
          label: isEn ? 'New area' : 'Νέο εμβαδόν',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <span>{isEn ? 'A₂ ＝ ' : 'Ε₂ ＝ '}</span>
              <MathFraction num={isEn ? '(B ＋ b) · 2h' : '(Β ＋ b) · 2υ'} den="2" />
              <span>＝ 2 ·</span>
              <MathFraction num={isEn ? '(B ＋ b) · h' : '(Β ＋ b) · υ'} den="2" />
              <span>＝ {isEn ? '2 · A₁' : '2 · Ε₁'}</span>
            </span>
          )
        }
      ],
      explanation: isEn
        ? 'Area is directly proportional to height. When height doubles with fixed bases, area doubles.'
        : 'Το εμβαδόν είναι ανάλογο του ύψους. Όταν το ύψος διπλασιάζεται με σταθερές βάσεις, το εμβαδόν διπλασιάζεται.'
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 12 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet(locale = 'el') {
  const isEn = locale === 'en';
  const qs = [];

  // Q1: Τύπος εμβαδού τραπεζίου (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: isEn ? 'TRAPEZOID AREA FORMULA' : 'ΤΥΠΟΣ ΕΜΒΑΔΟΥ ΤΡΑΠΕΖΙΟΥ',
    prompt: isQ1True
      ? isEn
        ? 'The area of a trapezoid equals the sum of its bases multiplied by height, divided by 2: A ＝ [(B ＋ b) · h] : 2.'
        : 'Το εμβαδόν του τραπεζίου ισούται με το άθροισμα των βάσεών του επί το ύψος, διά 2: Ε ＝ [(Β ＋ b) · υ] : 2.'
      : isEn
        ? 'The area of a trapezoid is obtained simply by multiplying the major base by the height: A ＝ B · h.'
        : 'Το εμβαδόν του τραπεζίου ισούται πολλαπλασιάζοντας απλώς τη μεγάλη βάση με το ύψος: Ε ＝ Β · υ.',
    correctAnswer: isQ1True,
    tableData: [
      {
        label: isEn ? 'Correct formula' : 'Σωστός τύπος',
        valueNode: (
          <span className="inline-flex items-center">
            <span>{isEn ? 'A ＝ ' : 'Ε ＝ '}</span>
            <MathFraction num={isEn ? '(B ＋ b) · h' : '(Β ＋ b) · υ'} den="2" />
          </span>
        )
      },
      { label: isEn ? 'Bases rule' : 'Βάσεις', value: isEn ? 'Always sum both bases first (B ＋ b)' : 'Προσθέτουμε πάντα και τις δύο βάσεις (Β ＋ b)' }
    ],
    explanation: isQ1True
      ? isEn
        ? 'The area of a trapezoid is always given by A ＝ [(B ＋ b) · h] : 2.'
        : 'Το εμβαδόν του τραπεζίου δίνεται πάντοτε από τον τύπο Ε ＝ [(Β ＋ b) · υ] : 2.'
      : isEn
        ? 'In a trapezoid we must add both bases before multiplying by height and dividing by 2: A ＝ [(B ＋ b) · h] : 2.'
        : 'Στο τραπέζιο πρέπει να προσθέσουμε και τις δύο βάσεις πριν πολλαπλασιάσουμε με το ύψος και διαιρέσουμε με το 2: Ε ＝ [(Β ＋ b) · υ] : 2.'
  });

  // Q2: Γιατί διαιρούμε με το 2 (MCQ)
  const q2Correct = isEn
    ? 'Because two identical trapezoids join together to form a parallelogram with area (B ＋ b) · h'
    : 'Επειδή δύο ίδια τραπέζια ενώνονται και σχηματίζουν ένα παραλληλόγραμμο με εμβαδόν (Β ＋ b) · υ';
  qs.push({
    id: 2,
    type: 'mcq',
    title: isEn ? 'GEOMETRIC INTERPRETATION' : 'ΓΕΩΜΕΤΡΙΚΗ ΕΡΜΗΝΕΙΑ',
    prompt: isEn
      ? 'Why do we divide by 2 in the trapezoid area formula?'
      : 'Γιατί στον τύπο του εμβαδού τραπεζίου διαιρούμε με το 2;',
    options: ensureFourUniqueOptions(q2Correct, () => [
      isEn ? 'Because a trapezoid has 4 sides' : 'Επειδή το τραπέζιο έχει 4 πλευρές',
      isEn ? 'Because it has 2 bases' : 'Επειδή έχει 2 βάσεις',
      isEn ? 'Because it is always right-angled' : 'Επειδή είναι πάντοτε ορθογώνιο'
    ]),
    correctAnswer: q2Correct,
    tableData: [
      {
        label: isEn ? '2 trapezoids' : '2 τραπέζια',
        valueNode: <span>{isEn ? 'Form a parallelogram with base (B ＋ b) and height h' : 'Φτιάχνουν παραλληλόγραμμο με βάση (Β ＋ b) και ύψος υ'}</span>
      },
      {
        label: isEn ? '1 trapezoid' : '1 τραπέζιο',
        valueNode: (
          <span className="inline-flex items-center">
            <span>{isEn ? 'Is exactly half: ' : 'Είναι ακριβώς το μισό: '}</span>
            <MathFraction num={isEn ? '(B ＋ b) · h' : '(Β ＋ b) · υ'} den="2" />
          </span>
        )
      }
    ],
    explanation: isEn
      ? 'Two identical trapezoids form a parallelogram, so one trapezoid is strictly half the area.'
      : 'Δύο ολόιδια τραπέζια σχηματίζουν ένα παραλληλόγραμμο, άρα το ένα τραπέζιο έχει ακριβώς το μισό εμβαδόν.'
  });

  // Q3: Ύψος σε ορθογώνιο τραπέζιο (MCQ)
  const q3Correct = isEn
    ? 'The side that is perpendicular (90°) to the two parallel bases'
    : 'Η πλευρά του που είναι κάθετη (90°) στις δύο παράλληλες βάσεις';
  qs.push({
    id: 3,
    type: 'mcq',
    title: isEn ? 'HEIGHT IN A RIGHT TRAPEZOID' : 'ΥΨΟΣ ΣΕ ΟΡΘΟΓΩΝΙΟ ΤΡΑΠΕΖΙΟ',
    prompt: isEn
      ? 'What acts as the height in a right-angled trapezoid?'
      : 'Ποιο είναι το ύψος σε ένα ορθογώνιο τραπέζιο;',
    options: ensureFourUniqueOptions(q3Correct, () => [
      isEn ? 'Its slanted lateral leg' : 'Η πλάγια κεκλιμένη πλευρά του',
      isEn ? 'Its longer diagonal' : 'Η μεγαλύτερη διαγώνιος του',
      isEn ? 'The sum of both bases' : 'Το άθροισμα των δύο βάσεων'
    ]),
    correctAnswer: q3Correct,
    tableData: [
      { label: isEn ? 'Right trapezoid property' : 'Ιδιότητα ορθογωνίου τραπεζίου', value: isEn ? 'Has a leg perpendicular to the bases' : 'Έχει μία πλευρά κάθετη στις βάσεις' },
      { label: isEn ? 'Role of this leg' : 'Ρόλος πλευράς', value: isEn ? 'Serves directly as the height of the figure' : 'Αποτελεί ταυτόχρονα και το ύψος του σχήματος' }
    ],
    explanation: isEn
      ? 'In a right trapezoid the perpendicular side connects the two bases at a 90° angle, so it is the height itself.'
      : 'Στο ορθογώνιο τραπέζιο η κάθετη πλευρά συνδέει τις δύο βάσεις με γωνία 90°, άρα είναι το ίδιο το ύψος.'
  });

  // Q4: Οπτική αναγνώριση διαστάσεων τραπεζίου (SVG - No Giveaway)
  const q4Correct = isEn
    ? 'The yellow vertical dashed line (h) with the 90° right angle'
    : 'Η κίτρινη κατακόρυφη διακεκομμένη γραμμή (υ) με τη γωνία 90°';
  qs.push({
    id: 4,
    type: 'mcq',
    title: isEn ? 'IDENTIFYING TRAPEZOID ELEMENTS' : 'ΑΝΑΓΝΩΡΙΣΗ ΣΤΟΙΧΕΙΩΝ ΤΡΑΠΕΖΙΟΥ',
    prompt: isEn
      ? 'Observe the trapezoid below. Which element corresponds to the perpendicular height (h)?'
      : 'Παρατηρήστε το παρακάτω τραπέζιο. Ποιο στοιχείο αντιστοιχεί στο κάθετο ύψος (υ);',
    svg: (
      <svg viewBox="0 0 180 110" className="w-full max-w-[176px] h-auto mx-auto my-2 select-none drop-shadow-sm">
        <polygon points="30,85 150,85 110,25 50,25" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
        <line x1="50" y1="25" x2="50" y2="85" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
        <rect x="50" y="75" width="10" height="10" fill="none" stroke="#f59e0b" strokeWidth="1" />
        <circle cx="55" cy="80" r="1.5" fill="#f59e0b" />
        <text x="40" y="58" fill="#f59e0b" fontSize="11" fontWeight="bold">{isEn ? 'h' : 'υ'}</text>
        <text x="138" y="55" fill="#a855f7" fontSize="10" fontWeight="bold">{isEn ? 's' : 'π'}</text>
      </svg>
    ),
    options: ensureFourUniqueOptions(q4Correct, () => [
      isEn ? 'The purple slanted side (s) of the trapezoid' : 'Η μωβ πλάγια πλευρά (π) του τραπεζίου',
      isEn ? 'The upper minor base' : 'Η επάνω μικρή βάση',
      isEn ? 'The lower major base' : 'Η κάτω μεγάλη βάση'
    ]),
    correctAnswer: q4Correct,
    tableData: [
      { label: isEn ? 'Yellow line (h)' : 'Κίτρινη γραμμή (υ)', value: isEn ? 'Perpendicular height between the two bases' : 'Κάθετο ύψος ανάμεσα στις δύο βάσεις' },
      { label: isEn ? 'Purple line (s)' : 'Μωβ πλευρά (π)', value: isEn ? 'Slanted lateral leg (not height)' : 'Πλάγια πλευρά (δεν είναι ύψος)' }
    ],
    explanation: isEn
      ? 'Height is strictly the perpendicular distance between the two parallel bases (the yellow dashed line).'
      : 'Το ύψος είναι πάντοτε η κάθετη απόσταση ανάμεσα στις δύο βάσεις (η κίτρινη διακεκομμένη γραμμή).'
  });

  // Q5: Υπολογισμός εμβαδού (Input αριθμού)
  const bigB5 = 12;
  const smallB5 = 8;
  const h5 = 5;
  const area5 = ((bigB5 + smallB5) * h5) / 2;
  qs.push({
    id: 5,
    type: 'input',
    title: isEn ? 'CALCULATING AREA IN CM²' : 'ΥΠΟΛΟΓΙΣΜΟΣ ΕΜΒΑΔΟΥ ΣΕ CM²',
    prompt: isEn
      ? `A trapezoid has a major base of ${formatNum(bigB5, locale)} cm, a minor base of ${formatNum(smallB5, locale)} cm, and a height of ${formatNum(h5, locale)} cm. How many cm² is its area? (Enter only the number)`
      : `Ένα τραπέζιο έχει μεγάλη βάση ${formatNum(bigB5, locale)} cm, μικρή βάση ${formatNum(smallB5, locale)} cm και ύψος ${formatNum(h5, locale)} cm. Πόσα cm² είναι το εμβαδόν του; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(area5),
    tableData: [
      { label: isEn ? 'Bases' : 'Βάσεις', value: `${formatNum(bigB5, locale)} cm και ${formatNum(smallB5, locale)} cm (${isEn ? 'sum' : 'άθροισμα'} 20 cm)` },
      { label: isEn ? 'Height' : 'Ύψος', value: `${formatNum(h5, locale)} cm` },
      {
        label: isEn ? 'Calculation' : 'Πράξη',
        valueNode: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <MathFraction num={`(${formatNum(bigB5, locale)} ＋ ${formatNum(smallB5, locale)}) · ${formatNum(h5, locale)}`} den="2" />
            <span>＝</span>
            <MathFraction num={`20 · ${formatNum(h5, locale)}`} den="2" />
            <span>＝ {formatNum(area5, locale)} cm²</span>
          </span>
        )
      }
    ],
    explanation: `${isEn ? 'A' : 'Ε'} ＝ [(12 ＋ 8) · 5] : 2 ＝ (20 · 5) : 2 ＝ 50 cm².`
  });

  // Q6: Εύρεση ύψους από το εμβαδόν (Input αριθμού)
  const area6 = 60;
  const sum6 = 20;
  const h6 = (2 * area6) / sum6;
  qs.push({
    id: 6,
    type: 'input',
    title: isEn ? 'FINDING HEIGHT FROM AREA' : 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΑΠΟ ΤΟ ΕΜΒΑΔΟΝ',
    prompt: isEn
      ? `In a trapezoid the area is ${formatNum(area6, locale)} m² and the sum of the two bases is ${formatNum(sum6, locale)} m. How many meters (m) is its height? (Enter only the number)`
      : `Σε ένα τραπέζιο το εμβαδόν είναι ${formatNum(area6, locale)} m² και το άθροισμα των δύο βάσεων είναι ${formatNum(sum6, locale)} m. Πόσα μέτρα (m) είναι το ύψος του; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(h6),
    tableData: [
      { label: isEn ? 'Area' : 'Εμβαδόν', value: `${formatNum(area6, locale)} m²` },
      {
        label: isEn ? 'Doubled area' : 'Διπλάσιο εμβαδόν',
        valueNode: <span>2 · {formatNum(area6, locale)} ＝ {formatNum(2 * area6, locale)} m²</span>
      },
      { label: isEn ? 'Sum of bases' : 'Άθροισμα βάσεων', value: `${formatNum(sum6, locale)} m` },
      {
        label: isEn ? 'Height calculation' : 'Πράξη ύψους',
        valueNode: (
          <span className="inline-flex items-center">
            <MathFraction num={formatNum(2 * area6, locale)} den={formatNum(sum6, locale)} />
            <span>＝ {formatNum(h6, locale)} m</span>
          </span>
        )
      }
    ],
    explanation: `${isEn ? 'h ＝ (2 · A) : (B ＋ b)' : 'υ ＝ (2 · Ε) : (Β ＋ b)'} ＝ (2 · 60) : 20 ＝ 120 : 20 ＝ 6 m.`
  });

  // Q7: Σειρά πράξεων στον τύπο (MCQ)
  const q7Correct = isEn
    ? 'First add the bases (B ＋ b), then multiply by h, and finally divide by 2'
    : 'Πρώτα προσθέτουμε τις βάσεις (Β ＋ b), μετά πολλαπλασιάζουμε με το υ και τέλος διαιρούμε με το 2';
  qs.push({
    id: 7,
    type: 'mcq',
    title: isEn ? 'ORDER OF OPERATIONS IN FORMULA' : 'ΣΕΙΡΑ ΠΡΑΞΕΩΝ ΣΤΟΝ ΤΥΠΟ',
    prompt: isEn
      ? 'What is the correct order of operations when applying A ＝ [(B ＋ b) · h] : 2?'
      : 'Ποια είναι η σωστή σειρά των πράξεων όταν εφαρμόζουμε τον τύπο Ε ＝ [(Β ＋ b) · υ] : 2;',
    options: ensureFourUniqueOptions(q7Correct, () => [
      isEn ? 'First multiply major base by height, then add minor base' : 'Πρώτα πολλαπλασιάζουμε τη μεγάλη βάση με το ύψος και μετά προσθέτουμε τη μικρή',
      isEn ? 'First divide height by 2, then multiply only by major base' : 'Πρώτα διαιρούμε το ύψος με το 2 και μετά πολλαπλασιάζουμε μόνο με τη μεγάλη βάση',
      isEn ? 'Perform operations in any order without brackets' : 'Κάνουμε τις πράξεις με όποια σειρά θέλουμε χωρίς παρενθέσεις'
    ]),
    correctAnswer: q7Correct,
    tableData: [
      { label: isEn ? '1st step' : '1ο βήμα', value: isEn ? 'Sum of bases (B ＋ b)' : 'Άθροισμα των βάσεων (Β ＋ b)' },
      { label: isEn ? '2nd step' : '2ο βήμα', value: isEn ? 'Multiplication by height · h' : 'Πολλαπλασιασμός επί το ύψος · υ' },
      { label: isEn ? '3rd step' : '3ο βήμα', value: isEn ? 'Division by 2 (: 2)' : 'Διαίρεση με το 2 (: 2)' }
    ],
    explanation: isEn
      ? 'Brackets take priority: first compute the sum (B ＋ b), then multiply by height, and finally divide by 2.'
      : 'Οι παρενθέσεις έχουν προτεραιότητα: πρώτα υπολογίζουμε το άθροισμα (Β ＋ b), μετά πολλαπλασιάζουμε με το ύψος και τέλος διαιρούμε διά 2.'
  });

  // Q8: Μετατροπή μονάδων dm² σε cm² (MCQ)
  const q8Correct = isEn ? '1,500 cm²' : '1.500 cm²';
  qs.push({
    id: 8,
    type: 'mcq',
    title: isEn ? 'AREA UNIT CONVERSION' : 'ΜΕΤΑΤΡΟΠΗ ΜΟΝΑΔΩΝ ΕΠΙΦΑΝΕΙΑΣ',
    prompt: isEn
      ? 'A trapezoid has an area of 15 dm². What is its area in square centimeters (cm²)?'
      : 'Ένα τραπέζιο έχει εμβαδόν 15 dm². Πόσα τετραγωνικά εκατοστόμετρα (cm²) είναι το εμβαδόν του;',
    options: ensureFourUniqueOptions(q8Correct, () => [
      '150 cm²',
      isEn ? '15,000 cm²' : '15.000 cm²',
      isEn ? '150,000 cm²' : '150.000 cm²'
    ]),
    correctAnswer: q8Correct,
    tableData: [
      { label: isEn ? 'Initial value' : 'Αρχική τιμή', value: '15 dm²' },
      { label: isEn ? 'dm² to cm² ratio' : 'Σχέση dm²/cm²', value: '1 dm² ＝ 100 cm²' },
      {
        label: isEn ? 'Calculation' : 'Πράξη',
        valueNode: <span>15 · 100 ＝ {q8Correct}</span>
      }
    ],
    explanation: isEn ? '1 dm² ＝ 100 cm², so: 15 · 100 ＝ 1,500 cm².' : '1 dm² ＝ 100 cm², άρα: 15 · 100 ＝ 1.500 cm².'
  });

  // Q9: Πρόβλημα από PROBLEM_POOL_Q9
  const p9 = PROBLEM_POOL_Q9[randInt(0, PROBLEM_POOL_Q9.length - 1)](locale);
  qs.push({ id: 9, type: 'mcq', ...p9 });

  // Q10: Πρόβλημα από PROBLEM_POOL_Q10
  const p10 = PROBLEM_POOL_Q10[randInt(0, PROBLEM_POOL_Q10.length - 1)](locale);
  qs.push({ id: 10, type: 'mcq', ...p10 });

  // Q11: Πρόβλημα από PROBLEM_POOL_Q11
  const p11 = PROBLEM_POOL_Q11[randInt(0, PROBLEM_POOL_Q11.length - 1)](locale);
  qs.push({ id: 11, type: 'mcq', ...p11 });

  // Q12: Πρόβλημα από PROBLEM_POOL_Q12
  const p12 = PROBLEM_POOL_Q12[randInt(0, PROBLEM_POOL_Q12.length - 1)](locale);
  qs.push({ id: 12, type: 'mcq', ...p12 });

  return qs;
}

// -------------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΑΣΚΗΣΕΩΝ
// -------------------------------------------------------------

export default function EmbadonTrapeziouAskiseisPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const isEn = locale === 'en';

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadNewSet();
  }, [locale]);

  function loadNewSet() {
    const newQs = generateQuestionsSet(locale);
    setQuestions(newQs);
    setUserAnswers({});
    setSubmitted(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleAnswerChange(id, rawValue) {
    if (submitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [id]: rawValue
    }));
  }

  function isQuestionCorrect(q) {
    const userAns = userAnswers[q.id];
    if (userAns === undefined || userAns === null) return false;

    if (q.type === 'boolean') {
      return userAns === q.correctAnswer;
    }

    if (q.type === 'mcq') {
      return String(userAns).trim() === String(q.correctAnswer).trim();
    }

    if (q.type === 'input') {
      const cleanUser = String(userAns).trim().replace(/\./g, ',');
      const cleanCorrect = String(q.correctAnswer).trim().replace(/\./g, ',');

      if (cleanUser === cleanCorrect) return true;

      const numUser = parseFloat(cleanUser.replace(',', '.'));
      const numCorrect = parseFloat(cleanCorrect.replace(',', '.'));
      if (!isNaN(numUser) && !isNaN(numCorrect)) {
        return Math.abs(numUser - numCorrect) <= 0.05;
      }
      return false;
    }

    return false;
  }

  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] !== undefined && userAnswers[k] !== ''
  ).length;

  const score = questions.reduce((acc, q) => (isQuestionCorrect(q) ? acc + 1 : acc), 0);
  const totalCount = questions.length || 12;
  const percentage = Math.round((score / totalCount) * 100);

  return (
    <Layout
      title={
        isEn
          ? "Exercises: Area of a Trapezoid - 6th Grade | LearnMaths.gr"
          : "Ασκήσεις: Εμβαδόν Τραπεζίου - ΣΤ' Δημοτικού | LearnMaths.gr"
      }
      description={
        isEn
          ? "Interactive exercises on trapezoid area calculation with A ＝ [(B ＋ b) · h] : 2, right trapezoids, and solving for height for 6th Grade Math."
          : "Διαδραστικές ασκήσεις στον υπολογισμό εμβαδού τραπεζίου με τον τύπο Ε ＝ [(Β ＋ b) · υ] : 2, ορθογώνια τραπέζια και εύρεση ύψους για τη ΣΤ' Δημοτικού."
      }
      backUrl="/st-dimotikou/75-embadon-trapeziou"
      backText={isEn ? "Chapter 75 Theory" : "Θεωρία Κεφ. 75"}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/75-embadon-trapeziou"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{isEn ? "📖 Theory" : "📖 Θεωρία"}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden">

        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden mb-8 sm:mb-12">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{isEn ? "EXERCISES • CHAPTER 75 • 6TH GRADE" : "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 75 • ΣΤ' ΔΗΜΟΤΙΚΟΥ"}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(isEn ? "Exercises: Trapezoid Area" : "Ασκησεις: Εμβαδον Τραπεζιου")}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl break-words [overflow-wrap:anywhere]">
              {isEn
                ? "Practice calculating trapezoid area with A ＝ [(B ＋ b) · h] : 2, right trapezoids, and solving for unknown bases or height across 12 dynamic interactive exercises."
                : "Εξασκηθείτε στον υπολογισμό εμβαδού τραπεζίου με τον τύπο Ε ＝ [(Β ＋ b) · υ] : 2, στα ορθογώνια τραπέζια και στην εύρεση άγνωστων βάσεων ή ύψους μέσα από 12 δυναμικές ερωτήσεις."}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="break-words">
                {isEn
                  ? "12 Dynamic Questions with Instant Feedback & Detailed Solutions"
                  : "12 Δυναμικές Ασκήσεις με Αυτόματη Αξιολόγηση & Αναλυτική Επεξήγηση"}
              </span>
            </div>
            <button
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base shrink-0"
            >
              <span>🔄 {toCleanUppercase(isEn ? "New Questions" : "Νεες Ασκησεις")}</span>
            </button>
          </div>
        </section>

        {/* ΛΙΣΤΑ ΕΡΩΤΗΣΕΩΝ (12 ΕΡΩΤΗΣΕΙΣ) */}
        <div className="space-y-6 sm:space-y-8">
          {questions.map((q, index) => {
            const isCorrect = isQuestionCorrect(q);
            const userAns = userAnswers[q.id];

            return (
              <div
                key={q.id}
                className={`bg-white rounded-3xl p-5 sm:p-8 shadow-sm border transition-all ${
                  submitted
                    ? isCorrect
                      ? 'border-emerald-300 ring-1 ring-emerald-200'
                      : 'border-rose-300 ring-1 ring-rose-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* ΚΕΦΑΛΙΔΑ ΕΡΩΤΗΣΗΣ */}
                <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-sm sm:text-base border border-indigo-150 shrink-0">
                      {index + 1}
                    </span>
                    <h2 className="text-xs sm:text-sm font-black text-slate-800 tracking-wider truncate">
                      {toCleanUppercase(q.title || (isEn ? `QUESTION ${index + 1}` : `ΕΡΩΤΗΣΗ ${index + 1}`))}
                    </h2>
                  </div>

                  {submitted && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black tracking-wider shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect
                        ? toCleanUppercase(isEn ? 'CORRECT' : 'ΣΩΣΤΟ')
                        : toCleanUppercase(isEn ? 'WRONG' : 'ΛΑΘΟΣ')}
                    </span>
                  )}
                </div>

                {/* ΕΚΦΩΝΗΣΗ & SVG (NO-GIVEAWAY: ΟΥΔΕΙΣ ΠΙΝΑΚΑΣ ΕΔΩ) */}
                <div className="mb-6 space-y-3">
                  <p className="text-slate-800 text-sm sm:text-base font-semibold leading-relaxed break-words [overflow-wrap:anywhere]">
                    {q.prompt}
                  </p>
                  {q.svg && <div className="py-2 flex justify-center max-w-full overflow-hidden">{q.svg}</div>}
                </div>

                {/* ΔΙΑΔΡΑΣΤΙΚΑ ΧΕΙΡΙΣΤΗΡΙΑ ΑΠΑΝΤΗΣΗΣ */}
                <div className="mb-4">
                  {/* ΤΥΠΟΣ 1: BOOLEAN */}
                  {q.type === 'boolean' && (
                    <div className="grid grid-cols-2 gap-3 max-w-md">
                      {[true, false].map((val) => {
                        const isSelected = userAns === val;
                        return (
                          <button
                            key={String(val)}
                            type="button"
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, val)}
                            className={`py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all border ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {val
                              ? toCleanUppercase(isEn ? 'TRUE' : 'ΣΩΣΤΟ')
                              : toCleanUppercase(isEn ? 'FALSE' : 'ΛΑΘΟΣ')}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* ΤΥΠΟΣ 2: MCQ (4 ΜΟΝΑΔΙΚΑ ΚΟΥΜΠΙΑ ΧΩΡΙΣ TRUNCATE) */}
                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAns === opt;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`text-left p-3.5 sm:p-4 rounded-2xl border font-semibold text-xs sm:text-sm transition-all flex items-start gap-3 ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                                isSelected
                                  ? 'bg-white text-indigo-700'
                                  : 'bg-white text-slate-500 border border-slate-200'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="break-words whitespace-normal leading-snug flex-1 [overflow-wrap:anywhere]">
                              {opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* ΤΥΠΟΣ 3: INPUT */}
                  {q.type === 'input' && (
                    <div className="max-w-xs">
                      <input
                        type="text"
                        inputMode="decimal"
                        maxLength={10}
                        disabled={submitted}
                        placeholder={isEn ? "Answer..." : "Απάντηση..."}
                        value={userAns || ''}
                        onChange={(e) => {
                          const cleaned = e.target.value
                            .replace(/[^0-9.,]/g, '')
                            .replace(/\./g, ',');
                          handleAnswerChange(q.id, cleaned);
                        }}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-80"
                      />
                    </div>
                  )}
                </div>

                {/* FEEDBACK & EXPLANATION (ΑΠΟΚΛΕΙΣΤΙΚΑ ΜΕΤΑ ΤΗΝ ΥΠΟΒΟΛΗ) */}
                {submitted && (
                  <div className="mt-6 pt-5 border-t border-slate-150 space-y-4">
                    {/* ΠΙΝΑΚΑΣ ΔΕΔΟΜΕΝΩΝ (TABLEDATA) ΜΟΝΟ ΕΔΩ */}
                    {q.tableData && q.tableData.length > 0 && (
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/60 p-1 w-full block">
                        <table className="w-full text-left text-xs sm:text-sm">
                          <tbody>
                            {q.tableData.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className={rIdx !== q.tableData.length - 1 ? 'border-b border-slate-200/60' : ''}
                              >
                                <td className="py-2.5 px-3 font-bold text-slate-600 bg-slate-100/70 w-1/3 break-words">
                                  {row.label}
                                </td>
                                <td className="py-2.5 px-3 font-semibold text-slate-800 break-words">
                                  {row.valueNode || row.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* ΑΝΑΛΥΤΙΚΗ ΕΠΕΞΗΓΗΣΗ */}
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed break-words [overflow-wrap:anywhere] ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                          : 'bg-rose-50 text-rose-950 border border-rose-200'
                      }`}
                    >
                      <p className="font-bold mb-1">
                        {isCorrect
                          ? isEn
                            ? '✓ Correct answer!'
                            : '✓ Σωστή απάντηση!'
                          : isEn
                            ? `✗ Incorrect. The correct answer is: ${
                                q.type === 'boolean'
                                  ? q.correctAnswer
                                    ? 'True'
                                    : 'False'
                                  : q.correctAnswer
                              }`
                            : `✗ Λάθος. Η σωστή απάντηση είναι: ${
                                q.type === 'boolean'
                                  ? q.correctAnswer
                                    ? 'Σωστό'
                                    : 'Λάθος'
                                  : q.correctAnswer
                              }`}
                      </p>
                      <p className="text-slate-700">{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* STICKY BOTTOM SCORE FOOTER (12 ΕΡΩΤΗΣΕΙΣ) */}
        <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6">
          <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-8">
              {!submitted ? (
                <div className="text-xs sm:text-sm font-semibold text-slate-300">
                  <span>{toCleanUppercase(isEn ? 'ANSWERED:' : 'ΑΠΑΝΤΗΘΗΚΑΝ:')} </span>
                  <span className="font-black text-indigo-400 text-sm sm:text-base">
                    {answeredCount} / {totalCount}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    <span>{toCleanUppercase(isEn ? 'SCORE:' : 'ΣΚΟΡ:')} </span>
                    <span className="font-black text-emerald-400 text-sm sm:text-base">
                      {score} / {totalCount}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    <span>{toCleanUppercase(isEn ? 'PERCENTAGE:' : 'ΠΟΣΟΣΤΟ:')} </span>
                    <span className="font-black text-amber-400 text-sm sm:text-base">
                      {percentage}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!submitted ? (
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(true);
                    if (typeof window !== 'undefined') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/25 transition-all text-xs sm:text-sm shrink-0"
                >
                  {toCleanUppercase(isEn ? 'CHECK ANSWERS' : 'ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={loadNewSet}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-xs sm:text-sm flex items-center gap-2 shrink-0"
                >
                  <span>🔄</span>
                  <span>{toCleanUppercase(isEn ? 'NEW QUESTIONS' : 'ΝΕΕΣ ΑΣΚΗΣΕΙΣ')}</span>
                </button>
              )}
            </div>
          </div>
        </footer>

      </div>
    </Layout>
  );
}