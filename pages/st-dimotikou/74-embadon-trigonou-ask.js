// pages/st-dimotikou/74-embadon-trigonou-ask.js
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

// POOL ΓΙΑ Q9: Υπολογισμός Εμβαδού Τριγώνου [Ε ＝ (β · υ) / 2]
const PROBLEM_POOL_Q9 = [
  // 1. Γενικό τρίγωνο με παγίδα την πλάγια πλευρά
  (locale) => {
    const isEn = locale === 'en';
    const b = randInt(6, 14) * 2;
    const h = randInt(6, 16);
    const slant = h + randInt(3, 8);
    const area = (b * h) / 2;
    const correct = `${formatNum(area, locale)} cm²`;
    return {
      title: isEn ? 'TRIANGLE AREA' : 'ΕΜΒΑΔΟΝ ΤΡΙΓΩΝΟΥ',
      prompt: isEn
        ? `In a triangle, the base is ${formatNum(b, locale)} cm, the corresponding perpendicular height is ${formatNum(h, locale)} cm, and the slanted side is ${formatNum(slant, locale)} cm. What is the area of the triangle?`
        : `Σε ένα τρίγωνο η βάση είναι ${formatNum(b, locale)} cm, το αντίστοιχο κάθετο ύψος είναι ${formatNum(h, locale)} cm και η πλάγια πλευρά είναι ${formatNum(slant, locale)} cm. Πόσο είναι το εμβαδόν του τριγώνου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(b * h, locale)} cm²`,
        `${formatNum(Math.round((b * slant) / 2), locale)} cm²`,
        `${formatNum(area + 15, locale)} cm²`,
        `${formatNum(area - 10 > 0 ? area - 10 : area + 25, locale)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Base (b)' : 'Βάση (β)', value: `${formatNum(b, locale)} cm` },
        { label: isEn ? 'Perpendicular height (h)' : 'Κάθετο ύψος (υ)', value: `${formatNum(h, locale)} cm` },
        { label: isEn ? 'Slanted side' : 'Πλάγια πλευρά', value: `${formatNum(slant, locale)} cm (${isEn ? 'not needed' : 'δεν χρειάζεται'})` },
        {
          label: isEn ? 'Formula & Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <span>{isEn ? 'A ＝ ' : 'Ε ＝ '}</span>
              <MathFraction num={`${formatNum(b, locale)} · ${formatNum(h, locale)}`} den="2" />
              <span>＝</span>
              <MathFraction num={formatNum(b * h, locale)} den="2" />
              <span>＝ {formatNum(area, locale)} cm²</span>
            </span>
          )
        }
      ],
      explanation: isEn
        ? `We apply the formula: A ＝ (b · h) : 2 ＝ (${formatNum(b, locale)} · ${formatNum(h, locale)}) : 2 ＝ ${formatNum(area, locale)} cm². The slanted side is not used in the area calculation.`
        : `Εφαρμόζουμε τον τύπο: Ε ＝ (β · υ) : 2 ＝ (${formatNum(b, locale)} · ${formatNum(h, locale)}) : 2 ＝ ${formatNum(area, locale)} cm². Η πλάγια πλευρά δεν χρησιμοποιείται στον υπολογισμό.`
    };
  },
  // 2. Τριγωνικό πανί σκάφους
  (locale) => {
    const isEn = locale === 'en';
    const b = randInt(2, 5) * 2;
    const h = randInt(8, 16);
    const area = (b * h) / 2;
    const correct = `${formatNum(area, locale)} m²`;
    return {
      title: isEn ? 'SAILBOAT SAIL' : 'ΠΑΝΙ ΙΣΤΙΟΦΟΡΟΥ',
      prompt: isEn
        ? `The triangular sail of a sailboat has a base of ${formatNum(b, locale)} m and a corresponding height of ${formatNum(h, locale)} m. How many square meters (m²) of canvas were needed to make it?`
        : `Το τριγωνικό πανί ενός ιστιοφόρου έχει βάση ${formatNum(b, locale)} m και αντίστοιχο ύψος ${formatNum(h, locale)} m. Πόσα τετραγωνικά μέτρα (m²) πανιού χρειάστηκαν για την κατασκευή του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(b * h, locale)} m²`,
        `${formatNum(area + 8, locale)} m²`,
        `${formatNum(area - 6 > 0 ? area - 6 : area + 12, locale)} m²`,
        `${formatNum(area * 2, locale)} m²`
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: isEn ? 'Base (b)' : 'Βάση (β)', value: `${formatNum(b, locale)} m` },
        { label: isEn ? 'Height (h)' : 'Ύψος (υ)', value: `${formatNum(h, locale)} m` },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num={`${formatNum(b, locale)} · ${formatNum(h, locale)}`} den="2" />
              <span>＝ {formatNum(area, locale)} m²</span>
            </span>
          )
        }
      ],
      explanation: `${isEn ? 'A ＝ (b · h) : 2' : 'Ε ＝ (β · υ) : 2'} ＝ (${formatNum(b, locale)} · ${formatNum(h, locale)}) : 2 ＝ ${formatNum(area, locale)} m².`
    };
  },
  // 3. Τριγωνικό παρτέρι
  (locale) => {
    const isEn = locale === 'en';
    const b = randInt(3, 7) * 2;
    const h = randInt(4, 10);
    const area = (b * h) / 2;
    const correct = `${formatNum(area, locale)} m²`;
    return {
      title: isEn ? 'TRIANGULAR FLOWER BED' : 'ΤΡΙΓΩΝΙΚΟ ΠΑΡΤΕΡΙ',
      prompt: isEn
        ? `A triangular flower bed in a park has a base of ${formatNum(b, locale)} m and its corresponding height is ${formatNum(h, locale)} m. What is its surface area?`
        : `Ένα τριγωνικό παρτέρι σε ένα πάρκο έχει μήκος βάσης ${formatNum(b, locale)} m και το αντίστοιχο ύψος του είναι ${formatNum(h, locale)} m. Ποια είναι η επιφάνειά του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(b * h, locale)} m²`,
        `${formatNum(area + 5, locale)} m²`,
        `${formatNum(area - 5 > 0 ? area - 5 : area + 10, locale)} m²`,
        `${formatNum(b + h, locale)} m²`
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: isEn ? 'Base' : 'Βάση', value: `${formatNum(b, locale)} m` },
        { label: isEn ? 'Height' : 'Ύψος', value: `${formatNum(h, locale)} m` },
        {
          label: isEn ? 'Area' : 'Εμβαδόν',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num={`${formatNum(b, locale)} · ${formatNum(h, locale)}`} den="2" />
              <span>＝ {formatNum(area, locale)} m²</span>
            </span>
          )
        }
      ],
      explanation: `${isEn ? 'A ＝ (b · h) : 2' : 'Ε ＝ (β · υ) : 2'} ＝ (${formatNum(b, locale)} · ${formatNum(h, locale)}) : 2 ＝ ${formatNum(area, locale)} m².`
    };
  },
  // 4. Μεταλλικό τρίγωνο
  (locale) => {
    const isEn = locale === 'en';
    const correct = '90 cm²';
    return {
      title: isEn ? 'METAL TRIANGLE' : 'ΜΕΤΑΛΛΙΚΟ ΤΡΙΓΩΝΟ',
      prompt: isEn
        ? 'A metallic triangle has a base of 18 cm and a height of 10 cm. What is its area?'
        : 'Ένα μεταλλικό τρίγωνο έχει βάση 18 cm και ύψος 10 cm. Πόσο είναι το εμβαδόν του;',
      options: ensureFourUniqueOptions(correct, () => ['180 cm²', '45 cm²', '100 cm²', '80 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Base' : 'Βάση', value: '18 cm' },
        { label: isEn ? 'Height' : 'Ύψος', value: '10 cm' },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num="18 · 10" den="2" />
              <span>＝</span>
              <MathFraction num="180" den="2" />
              <span>＝ 90 cm²</span>
            </span>
          )
        }
      ],
      explanation: '(18 · 10) : 2 ＝ 90 cm².'
    };
  },
  // 5. Τριγωνική πινακίδα
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '1,200 cm²' : '1.200 cm²';
    const prodStr = isEn ? '2,400' : '2.400';
    return {
      title: isEn ? 'TRIANGULAR SIGN' : 'ΤΡΙΓΩΝΙΚΗ ΠΙΝΑΚΙΔΑ',
      prompt: isEn
        ? 'A road sign has the shape of a triangle with a base of 60 cm and a height of 40 cm. What is its area in cm²?'
        : 'Μια πινακίδα σήμανσης έχει σχήμα τριγώνου με βάση 60 cm και ύψος 40 cm. Πόσο είναι το εμβαδόν της σε cm²;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '2,400 cm²' : '2.400 cm²',
        '600 cm²',
        isEn ? '1,000 cm²' : '1.000 cm²',
        isEn ? '1,800 cm²' : '1.800 cm²'
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Base' : 'Βάση', value: '60 cm' },
        { label: isEn ? 'Height' : 'Ύψος', value: '40 cm' },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num="60 · 40" den="2" />
              <span>＝</span>
              <MathFraction num={prodStr} den="2" />
              <span>＝ {correct}</span>
            </span>
          )
        }
      ],
      explanation: isEn ? '(60 · 40) : 2 ＝ 1,200 cm².' : '(60 · 40) : 2 ＝ 1.200 cm².'
    };
  },
  // 6. Τριγωνική σκεπή
  (locale) => {
    const isEn = locale === 'en';
    const correct = '35 m²';
    return {
      title: isEn ? 'ROOF GABLE' : 'ΤΡΙΓΩΝΙΚΗ ΜΕΤΩΠΗ ΣΚΕΠΗΣ',
      prompt: isEn
        ? 'The triangular gable of an attic has a base of 14 m and a height to the ridge of 5 m. How many square meters (m²) is its surface area?'
        : 'Η τριγωνική μετώπη μιας σοφίτας έχει βάση 14 m και ύψος στον κορφιά 5 m. Πόσα τετραγωνικά μέτρα (m²) είναι η επιφάνειά της;',
      options: ensureFourUniqueOptions(correct, () => ['70 m²', '40 m²', '30 m²', '45 m²']),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: isEn ? 'Base' : 'Βάση', value: '14 m' },
        { label: isEn ? 'Height' : 'Ύψος', value: '5 m' },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num="14 · 5" den="2" />
              <span>＝</span>
              <MathFraction num="70" den="2" />
              <span>＝ 35 m²</span>
            </span>
          )
        }
      ],
      explanation: '(14 · 5) : 2 ＝ 35 m².'
    };
  }
];

// POOL ΓΙΑ Q10: Ορθογώνια Τρίγωνα [Ε ＝ (α · β) / 2]
const PROBLEM_POOL_Q10 = [
  // 1. Ορθογώνιο τρίγωνο με υποτείνουσα ως παγίδα
  (locale) => {
    const isEn = locale === 'en';
    const correct = '24 cm²';
    return {
      title: isEn ? 'RIGHT TRIANGLE WITH 3 SIDES' : 'ΟΡΘΟΓΩΝΙΟ ΤΡΙΓΩΝΟ ΜΕ 3 ΠΛΕΥΡΕΣ',
      prompt: isEn
        ? 'A right-angled triangle has sides of 6 cm, 8 cm, and 10 cm (where 10 cm is the hypotenuse opposite the right angle). What is its area?'
        : 'Ένα ορθογώνιο τρίγωνο έχει πλευρές 6 cm, 8 cm και 10 cm (όπου η πλευρά των 10 cm είναι η μεγαλύτερη, απέναντι από την ορθή γωνία). Πόσο είναι το εμβαδόν του;',
      options: ensureFourUniqueOptions(correct, () => ['48 cm²', '30 cm²', '40 cm²', '60 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? '1st perpendicular leg (base)' : '1η κάθετη πλευρά (βάση)', value: '6 cm' },
        { label: isEn ? '2nd perpendicular leg (height)' : '2η κάθετη πλευρά (ύψος)', value: '8 cm' },
        { label: isEn ? 'Hypotenuse' : 'Υποτείνουσα', value: `10 cm (${isEn ? 'not needed' : 'δεν χρειάζεται'})` },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num="6 · 8" den="2" />
              <span>＝</span>
              <MathFraction num="48" den="2" />
              <span>＝ 24 cm²</span>
            </span>
          )
        }
      ],
      explanation: isEn
        ? 'In a right triangle the two perpendicular legs act as base and height: A ＝ (6 · 8) : 2 ＝ 24 cm². The longest side (hypotenuse) is not used.'
        : 'Στο ορθογώνιο τρίγωνο οι δύο κάθετες πλευρές δρουν ως βάση και ύψος: Ε ＝ (6 · 8) : 2 ＝ 24 cm². Η μεγαλύτερη πλευρά (υποτείνουσα) δεν χρησιμοποιείται.'
    };
  },
  // 2. Ορθογώνιο τρίγωνο 5, 12, 13
  (locale) => {
    const isEn = locale === 'en';
    const correct = '30 cm²';
    return {
      title: isEn ? 'AREA OF A RIGHT TRIANGLE' : 'ΕΜΒΑΔΟΝ ΟΡΘΟΓΩΝΙΟΥ ΤΡΙΓΩΝΟΥ',
      prompt: isEn
        ? 'In a right-angled triangle, the two perpendicular sides measure 5 cm and 12 cm. What is the area of the triangle?'
        : 'Σε ένα ορθογώνιο τρίγωνο οι δύο κάθετες πλευρές του μετρούν 5 cm και 12 cm. Πόσο είναι το εμβαδόν του τριγώνου;',
      options: ensureFourUniqueOptions(correct, () => ['60 cm²', '35 cm²', '25 cm²', '40 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Perpendicular legs' : 'Κάθετες πλευρές', value: '5 cm και 12 cm' },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num="5 · 12" den="2" />
              <span>＝</span>
              <MathFraction num="60" den="2" />
              <span>＝ 30 cm²</span>
            </span>
          )
        }
      ],
      explanation: isEn ? 'A ＝ (5 · 12) : 2 ＝ 30 cm².' : 'Ε ＝ (5 · 12) : 2 ＝ 30 cm².'
    };
  },
  // 3. Τριγωνικό οικόπεδο σε γωνία δρόμων (ορθογώνιο)
  (locale) => {
    const isEn = locale === 'en';
    const a = randInt(8, 15) * 2;
    const b = randInt(10, 25);
    const area = (a * b) / 2;
    const correct = `${formatNum(area, locale)} m²`;
    return {
      title: isEn ? 'CORNER PLOT' : 'ΓΩΝΙΑΚΟ ΟΙΚΟΠΕΔΟ',
      prompt: isEn
        ? `A corner lot has the shape of a right triangle. The two sides forming the right angle along the two streets measure ${formatNum(a, locale)} m and ${formatNum(b, locale)} m. What is the area of the lot?`
        : `Ένα γωνιακό οικόπεδο έχει σχήμα ορθογωνίου τριγώνου. Οι δύο πλευρές που σχηματίζουν την ορθή γωνία πάνω στις δύο οδούς έχουν μήκη ${formatNum(a, locale)} m και ${formatNum(b, locale)} m. Ποιο είναι το εμβαδόν του οικοπέδου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(a * b, locale)} m²`,
        `${formatNum(area + 25, locale)} m²`,
        `${formatNum(area - 20 > 0 ? area - 20 : area + 40, locale)} m²`,
        `${formatNum(area * 2, locale)} m²`
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: isEn ? '1st perpendicular leg' : '1η κάθετη πλευρά', value: `${formatNum(a, locale)} m` },
        { label: isEn ? '2nd perpendicular leg' : '2η κάθετη πλευρά', value: `${formatNum(b, locale)} m` },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num={`${formatNum(a, locale)} · ${formatNum(b, locale)}`} den="2" />
              <span>＝ {formatNum(area, locale)} m²</span>
            </span>
          )
        }
      ],
      explanation: `${isEn ? 'A ＝ (a · b) : 2' : 'Ε ＝ (α · β) : 2'} ＝ (${formatNum(a, locale)} · ${formatNum(b, locale)}) : 2 ＝ ${formatNum(area, locale)} m².`
    };
  },
  // 4. Ισοσκελές ορθογώνιο τρίγωνο
  (locale) => {
    const isEn = locale === 'en';
    const a = randInt(3, 7) * 2;
    const area = (a * a) / 2;
    const correct = `${formatNum(area, locale)} cm²`;
    return {
      title: isEn ? 'ISOSCELES RIGHT TRIANGLE' : 'ΙΣΟΣΚΕΛΕΣ ΟΡΘΟΓΩΝΙΟ ΤΡΙΓΩΝΟ',
      prompt: isEn
        ? `An isosceles right-angled triangle has two equal perpendicular legs measuring ${formatNum(a, locale)} cm each. What is its area?`
        : `Ένα ισοσκελές ορθογώνιο τρίγωνο έχει τις δύο κάθετες πλευρές του ίσες με ${formatNum(a, locale)} cm την καθεμία. Πόσο είναι το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(a * a, locale)} cm²`,
        `${formatNum(area + 10, locale)} cm²`,
        `${formatNum(area - 6 > 0 ? area - 6 : area + 15, locale)} cm²`,
        `${formatNum(a * 4, locale)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Perpendicular legs' : 'Κάθετες πλευρές', value: `${formatNum(a, locale)} cm (${isEn ? 'equal' : 'ίσες'})` },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num={`${formatNum(a, locale)} · ${formatNum(a, locale)}`} den="2" />
              <span>＝ {formatNum(area, locale)} cm²</span>
            </span>
          )
        }
      ],
      explanation: `${isEn ? 'A ＝ (a · a) : 2' : 'Ε ＝ (α · α) : 2'} ＝ (${formatNum(a, locale)} · ${formatNum(a, locale)}) : 2 ＝ ${formatNum(area, locale)} cm².`
    };
  },
  // 5. Διαχωρισμός ορθογωνίου σε 2 ορθογώνια τρίγωνα
  (locale) => {
    const isEn = locale === 'en';
    const correct = '150 cm²';
    return {
      title: isEn ? 'DIAGONAL DIVISION' : 'ΔΙΑΧΩΡΙΣΜΟΣ ΜΕ ΔΙΑΓΩΝΙΟ',
      prompt: isEn
        ? 'We divide a rectangle measuring 20 cm by 15 cm along its diagonal into two congruent right triangles. What is the area of each triangle?'
        : 'Χωρίζουμε ένα ορθογώνιο διαστάσεων 20 cm και 15 cm με τη διαγώνιό του σε δύο ίσα ορθογώνια τρίγωνα. Πόσο είναι το εμβαδόν καθενός από τα δύο τρίγωνα;',
      options: ensureFourUniqueOptions(correct, () => ['300 cm²', '100 cm²', '75 cm²', '200 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Rectangle area' : 'Εμβαδόν ορθογωνίου', value: '20 · 15 ＝ 300 cm²' },
        {
          label: isEn ? 'Each triangle' : 'Κάθε τρίγωνο',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num="300" den="2" />
              <span>＝ 150 cm²</span>
            </span>
          )
        }
      ],
      explanation: isEn ? 'Each triangle is half of the rectangle: (20 · 15) : 2 ＝ 150 cm².' : 'Κάθε τρίγωνο είναι το μισό του ορθογωνίου: (20 · 15) : 2 ＝ 150 cm².'
    };
  },
  // 6. Ορθογώνιο τρίγωνο 9 και 16
  (locale) => {
    const isEn = locale === 'en';
    const correct = '72 cm²';
    return {
      title: isEn ? 'RIGHT TRIANGLE CALCULATION' : 'ΥΠΟΛΟΓΙΣΜΟΣ ΟΡΘΟΓΩΝΙΟΥ ΤΡΙΓΩΝΟΥ',
      prompt: isEn
        ? 'In a right triangle, the perpendicular legs measure 9 cm and 16 cm. What is its area?'
        : 'Σε ένα ορθογώνιο τρίγωνο οι κάθετες πλευρές είναι 9 cm και 16 cm. Πόσο είναι το εμβαδόν του;',
      options: ensureFourUniqueOptions(correct, () => ['144 cm²', '64 cm²', '81 cm²', '50 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Perpendicular legs' : 'Κάθετες πλευρές', value: '9 cm και 16 cm' },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num="9 · 16" den="2" />
              <span>＝</span>
              <MathFraction num="144" den="2" />
              <span>＝ 72 cm²</span>
            </span>
          )
        }
      ],
      explanation: '(9 · 16) : 2 ＝ 72 cm².'
    };
  }
];

// POOL ΓΙΑ Q11: Εύρεση Βάσης ή Ύψους [β ＝ (2 · Ε) / υ / υ ＝ (2 · Ε) / β]
const PROBLEM_POOL_Q11 = [
  // 1. Εύρεση ύψους όταν γνωρίζουμε το εμβαδόν
  (locale) => {
    const isEn = locale === 'en';
    const b = randInt(10, 25);
    const h = randInt(6, 14);
    const area = (b * h) / 2;
    const correct = `${formatNum(h, locale)} cm`;
    return {
      title: isEn ? 'FINDING TRIANGLE HEIGHT' : 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΤΡΙΓΩΝΟΥ',
      prompt: isEn
        ? `A triangle has an area of ${formatNum(area, locale)} cm² and a base length of ${formatNum(b, locale)} cm. What is the corresponding height of the triangle?`
        : `Ένα τρίγωνο έχει εμβαδόν ${formatNum(area, locale)} cm² και μήκος βάσης ${formatNum(b, locale)} cm. Πόσο είναι το αντίστοιχο ύψος του τριγώνου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(h + 3, locale)} cm`,
        `${formatNum(h - 2 > 0 ? h - 2 : h + 4, locale)} cm`,
        `${formatNum(Math.round(area / b), locale)} cm`,
        `${formatNum(h * 2, locale)} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: isEn ? 'Area (A)' : 'Εμβαδόν (Ε)', value: `${formatNum(area, locale)} cm²` },
        { label: isEn ? 'Doubled area (2 · A)' : 'Διπλάσιο εμβαδόν (2 · Ε)', value: `${formatNum(2 * area, locale)} cm²` },
        { label: isEn ? 'Base (b)' : 'Βάση (β)', value: `${formatNum(b, locale)} cm` },
        {
          label: isEn ? 'Height calculation' : 'Πράξη ύψους',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num={formatNum(2 * area, locale)} den={formatNum(b, locale)} />
              <span>＝ {formatNum(h, locale)} cm</span>
            </span>
          )
        }
      ],
      explanation: isEn
        ? `First we double the area: 2 · ${formatNum(area, locale)} ＝ ${formatNum(2 * area, locale)} cm². Then we divide by the base: ${formatNum(2 * area, locale)} : ${formatNum(b, locale)} ＝ ${formatNum(h, locale)} cm.`
        : `Πρώτα διπλασιάζουμε το εμβαδόν: 2 · ${formatNum(area, locale)} ＝ ${formatNum(2 * area, locale)} cm². Έπειτα διαιρούμε με τη βάση: ${formatNum(2 * area, locale)} : ${formatNum(b, locale)} ＝ ${formatNum(h, locale)} cm.`
    };
  },
  // 2. Εύρεση βάσης όταν γνωρίζουμε το εμβαδόν
  (locale) => {
    const isEn = locale === 'en';
    const b = randInt(14, 28);
    const h = randInt(8, 16);
    const area = (b * h) / 2;
    const correct = `${formatNum(b, locale)} m`;
    return {
      title: isEn ? 'FINDING TRIANGLE BASE' : 'ΕΥΡΕΣΗ ΒΑΣΗΣ ΤΡΙΓΩΝΟΥ',
      prompt: isEn
        ? `In a triangular land lot, the area is ${formatNum(area, locale)} m² and the height is ${formatNum(h, locale)} m. How many meters (m) is the corresponding base?`
        : `Σε ένα τριγωνικό οικόπεδο το εμβαδόν είναι ${formatNum(area, locale)} m² και το ύψος είναι ${formatNum(h, locale)} m. Πόσα μέτρα (m) είναι η αντίστοιχη βάση του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(b + 4, locale)} m`,
        `${formatNum(b - 4 > 0 ? b - 4 : b + 6, locale)} m`,
        `${formatNum(Math.round(area / h), locale)} m`,
        `${formatNum(b * 2, locale)} m`
      ]),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: isEn ? 'Area (A)' : 'Εμβαδόν (Ε)', value: `${formatNum(area, locale)} m²` },
        { label: isEn ? 'Doubled area' : 'Διπλάσιο εμβαδόν', value: `${formatNum(2 * area, locale)} m²` },
        { label: isEn ? 'Height (h)' : 'Ύψος (υ)', value: `${formatNum(h, locale)} m` },
        {
          label: isEn ? 'Base calculation' : 'Πράξη βάσης',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num={formatNum(2 * area, locale)} den={formatNum(h, locale)} />
              <span>＝ {formatNum(b, locale)} m</span>
            </span>
          )
        }
      ],
      explanation: `${isEn ? 'b ＝ (2 · A) : h' : 'β ＝ (2 · Ε) : υ'} ＝ (2 · ${formatNum(area, locale)}) : ${formatNum(h, locale)} ＝ ${formatNum(b, locale)} m.`
    };
  },
  // 3. Εύρεση ύψους με Ε = 60 cm² και β = 12 cm
  (locale) => {
    const isEn = locale === 'en';
    const correct = '10 cm';
    return {
      title: isEn ? 'CALCULATING HEIGHT FROM AREA' : 'ΥΠΟΛΟΓΙΣΜΟΣ ΥΨΟΥΣ ΑΠΟ ΕΜΒΑΔΟΝ',
      prompt: isEn
        ? 'The area of a triangle is 60 cm² and its base is 12 cm. What is its height?'
        : 'Το εμβαδόν ενός τριγώνου είναι 60 cm² και η βάση του είναι 12 cm. Πόσο είναι το ύψος του;',
      options: ensureFourUniqueOptions(correct, () => ['5 cm', '15 cm', '8 cm', '20 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: isEn ? 'Area' : 'Εμβαδόν', value: '60 cm²' },
        { label: isEn ? 'Doubled area' : 'Διπλάσιο εμβαδόν', value: '2 · 60 ＝ 120 cm²' },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num="120" den="12" />
              <span>＝ 10 cm</span>
            </span>
          )
        }
      ],
      explanation: '(2 · 60) : 12 ＝ 120 : 12 ＝ 10 cm.'
    };
  },
  // 4. Εύρεση βάσης με Ε = 48 m² και υ = 8 m
  (locale) => {
    const isEn = locale === 'en';
    const correct = '12 m';
    return {
      title: isEn ? 'CALCULATING BASE FROM AREA' : 'ΥΠΟΛΟΓΙΣΜΟΣ ΒΑΣΗΣ ΑΠΟ ΕΜΒΑΔΟΝ',
      prompt: isEn
        ? 'A triangle has an area of 48 m² and a height of 8 m. What is the length of its base?'
        : 'Ένα τρίγωνο έχει εμβαδόν 48 m² και ύψος 8 m. Πόσο είναι το μήκος της βάσης του;',
      options: ensureFourUniqueOptions(correct, () => ['6 m', '16 m', '10 m', '14 m']),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: isEn ? 'Area' : 'Εμβαδόν', value: '48 m²' },
        { label: isEn ? 'Doubled area' : 'Διπλάσιο εμβαδόν', value: '2 · 48 ＝ 96 m²' },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num="96" den="8" />
              <span>＝ 12 m</span>
            </span>
          )
        }
      ],
      explanation: '(2 · 48) : 8 ＝ 96 : 8 ＝ 12 m.'
    };
  },
  // 5. Εύρεση κάθετης πλευράς σε ορθογώνιο τρίγωνο
  (locale) => {
    const isEn = locale === 'en';
    const correct = '10 cm';
    return {
      title: isEn ? 'FINDING PERPENDICULAR LEG' : 'ΕΥΡΕΣΗ ΚΑΘΕΤΗΣ ΠΛΕΥΡΑΣ',
      prompt: isEn
        ? 'In a right triangle, the area is 75 cm² and one of the perpendicular legs is 15 cm. What is the length of the other perpendicular leg?'
        : 'Σε ένα ορθογώνιο τρίγωνο το εμβαδόν είναι 75 cm² και η μία κάθετη πλευρά του είναι 15 cm. Πόσο είναι το μήκος της άλλης κάθετης πλευράς;',
      options: ensureFourUniqueOptions(correct, () => ['5 cm', '12 cm', '8 cm', '20 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: isEn ? 'Area' : 'Εμβαδόν', value: '75 cm²' },
        { label: isEn ? 'Doubled area' : 'Διπλάσιο εμβαδόν', value: '2 · 75 ＝ 150 cm²' },
        {
          label: isEn ? 'Other leg' : 'Άλλη κάθετη',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num="150" den="15" />
              <span>＝ 10 cm</span>
            </span>
          )
        }
      ],
      explanation: '(2 · 75) : 15 ＝ 150 : 15 ＝ 10 cm.'
    };
  },
  // 6. Εύρεση ύψους με Ε = 100 cm² και β = 20 cm
  (locale) => {
    const isEn = locale === 'en';
    const correct = '10 cm';
    return {
      title: isEn ? 'HEIGHT IN 100 CM² TRIANGLE' : 'ΥΨΟΣ ΣΕ ΤΡΙΓΩΝΟ 100 CM²',
      prompt: isEn
        ? 'A triangle has an area of 100 cm² and a base of 20 cm. What is its height?'
        : 'Ένα τρίγωνο έχει εμβαδόν 100 cm² και βάση 20 cm. Πόσο είναι το ύψος του;',
      options: ensureFourUniqueOptions(correct, () => ['5 cm', '15 cm', '20 cm', '8 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: isEn ? 'Area' : 'Εμβαδόν', value: '100 cm²' },
        { label: isEn ? 'Doubled area' : 'Διπλάσιο εμβαδόν', value: '2 · 100 ＝ 200 cm²' },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num="200" den="20" />
              <span>＝ 10 cm</span>
            </span>
          )
        }
      ],
      explanation: '(2 · 100) : 20 ＝ 200 : 20 ＝ 10 cm.'
    };
  }
];

// POOL ΓΙΑ Q12: Σύνθετα Προβλήματα, Μετατροπές Μονάδων & Σύγκριση Σχημάτων
const PROBLEM_POOL_Q12 = [
  // 1. Βάση σε m και ύψος σε cm
  (locale) => {
    const isEn = locale === 'en';
    const bM = 4;
    const hCm = 50;
    const bCm = bM * 100;
    const areaCm2 = (bCm * hCm) / 2;
    const correct = `${formatNum(areaCm2, locale)} cm²`;
    return {
      title: isEn ? 'MIXED UNITS (M AND CM)' : 'ΔΙΑΦΟΡΕΤΙΚΕΣ ΜΟΝΑΔΕΣ (M ΚΑΙ CM)',
      prompt: isEn
        ? `In a triangle the base is ${formatNum(bM, locale)} m and the corresponding height is ${formatNum(hCm, locale)} cm. What is its area in square centimeters (cm²)?`
        : `Σε ένα τρίγωνο η βάση είναι ${formatNum(bM, locale)} m και το αντίστοιχο ύψος είναι ${formatNum(hCm, locale)} cm. Πόσο είναι το εμβαδόν του σε τετραγωνικά εκατοστόμετρα (cm²);`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum((bM * hCm) / 2, locale)} cm²`,
        `${formatNum(areaCm2 / 10, locale)} cm²`,
        `${formatNum(areaCm2 * 2, locale)} cm²`,
        `${formatNum(areaCm2 + 1000, locale)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Base in cm (· 100)' : 'Βάση σε cm (· 100)', value: `${formatNum(bM, locale)} m ＝ ${formatNum(bCm, locale)} cm` },
        { label: isEn ? 'Height in cm' : 'Ύψος σε cm', value: `${formatNum(hCm, locale)} cm` },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num={`${formatNum(bCm, locale)} · ${formatNum(hCm, locale)}`} den="2" />
              <span>＝ {formatNum(areaCm2, locale)} cm²</span>
            </span>
          )
        }
      ],
      explanation: isEn
        ? `Convert meters to centimeters first: ${formatNum(bM, locale)} m ＝ ${formatNum(bCm, locale)} cm. Area: (${formatNum(bCm, locale)} · ${formatNum(hCm, locale)}) : 2 ＝ ${formatNum(areaCm2, locale)} cm² (or 1 m²).`
        : `Μετατρέπουμε τα μέτρα σε εκατοστά: ${formatNum(bM, locale)} m ＝ ${formatNum(bCm, locale)} cm. Εμβαδόν: (${formatNum(bCm, locale)} · ${formatNum(hCm, locale)}) : 2 ＝ ${formatNum(areaCm2, locale)} cm² (ή 1 m²).`
    };
  },
  // 2. Τρίγωνο και ισοδύναμο παραλληλόγραμμο
  (locale) => {
    const isEn = locale === 'en';
    const correct = '5 cm';
    return {
      title: isEn ? 'EQUIVALENT PARALLELOGRAM' : 'ΙΣΟΔΥΝΑΜΟ ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟ',
      prompt: isEn
        ? 'A triangle has a base of 16 cm and a height of 10 cm (area 80 cm²). A parallelogram has the same base of 16 cm and the same area (80 cm²). What is the height of the parallelogram?'
        : 'Ένα τρίγωνο έχει βάση 16 cm και ύψος 10 cm (εμβαδόν 80 cm²). Ένα παραλληλόγραμμο έχει την ίδια βάση 16 cm και το ίδιο εμβαδόν (80 cm²). Πόσο είναι το ύψος του παραλληλογράμμου;',
      options: ensureFourUniqueOptions(correct, () => ['10 cm', '20 cm', '8 cm', '4 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        {
          label: isEn ? 'Triangle area' : 'Εμβαδόν τριγώνου',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num="16 · 10" den="2" />
              <span>＝ 80 cm²</span>
            </span>
          )
        },
        { label: isEn ? 'Parallelogram area' : 'Εμβαδόν παραλληλογράμμου', value: isEn ? '80 cm² (equal)' : '80 cm² (ίσο)' },
        {
          label: isEn ? 'Parallelogram height' : 'Ύψος παραλληλογράμμου',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num="80" den="16" />
              <span>＝ 5 cm</span>
            </span>
          )
        }
      ],
      explanation: isEn
        ? 'The area of a parallelogram is b · h. With equal base and equal area, its height is half that of the triangle: 80 : 16 ＝ 5 cm.'
        : 'Το εμβαδόν του παραλληλογράμμου είναι β · υ. Αφού έχει την ίδια βάση και το ίδιο εμβαδόν, το ύψος του είναι το μισό του τριγώνου: 80 : 16 ＝ 5 cm.'
    };
  },
  // 3. Τριγωνικό οικόπεδο σε στρέμματα
  (locale) => {
    const isEn = locale === 'en';
    const correct = `${formatNum(3, locale)} ${isEn ? 'stremmata' : 'στρέμματα'}`;
    const prodStr = isEn ? '6,000' : '6.000';
    const areaStr = isEn ? '3,000' : '3.000';
    const divStr = isEn ? '1,000' : '1.000';
    return {
      title: isEn ? 'TRIANGULAR PLOT IN STREMMATA' : 'ΤΡΙΓΩΝΙΚΟΣ ΑΓΡΟΣ ΣΕ ΣΤΡΕΜΜΑΤΑ',
      prompt: isEn
        ? 'A triangular land plot has a base of 100 m and a corresponding height of 60 m. How many stremmata is its area?'
        : 'Ένας τριγωνικός αγρός έχει βάση 100 m και αντίστοιχο ύψος 60 m. Πόσα στρέμματα είναι η έκτασή του;',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(6, locale)} ${isEn ? 'stremmata' : 'στρέμματα'}`,
        `${formatNum(30, locale)} ${isEn ? 'stremmata' : 'στρέμματα'}`,
        `${formatNum(0.3, locale)} ${isEn ? 'stremmata' : 'στρέμματα'}`,
        `${formatNum(1.5, locale)} ${isEn ? 'stremmata' : 'στρέμματα'}`
      ]),
      correctAnswer: correct,
      unit: isEn ? 'stremmata' : 'στρέμματα',
      tableData: [
        {
          label: isEn ? 'Area in m²' : 'Εμβαδόν σε m²',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <MathFraction num="100 · 60" den="2" />
              <span>＝</span>
              <MathFraction num={prodStr} den="2" />
              <span>＝ {areaStr} m²</span>
            </span>
          )
        },
        {
          label: isEn ? 'Stremmata (: 1,000)' : 'Στρέμματα (: 1.000)',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num={areaStr} den={divStr} />
              <span>＝ {correct}</span>
            </span>
          )
        }
      ],
      explanation: isEn
        ? 'A ＝ (100 · 60) : 2 ＝ 3,000 m². Since 1 stremma ＝ 1,000 m²: 3,000 : 1,000 ＝ 3 stremmata.'
        : 'Ε ＝ (100 · 60) : 2 ＝ 3.000 m². Επειδή 1 στρέμμα ＝ 1.000 m², έχουμε: 3.000 : 1.000 ＝ 3 στρέμματα.'
    };
  },
  // 4. Εμβαδόν σε dm² και μετατροπή σε cm²
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '1,200 cm²' : '1.200 cm²';
    return {
      title: isEn ? 'CONVERT FROM DM² TO CM²' : 'ΜΕΤΑΤΡΟΠΗ ΑΠΟ DM² ΣΕ CM²',
      prompt: isEn
        ? 'A triangle has a base of 6 dm and a height of 4 dm (area 12 dm²). How many square centimeters (cm²) is its area?'
        : 'Ένα τρίγωνο έχει βάση 6 dm και ύψος 4 dm (εμβαδόν 12 dm²). Πόσα τετραγωνικά εκατοστόμετρα (cm²) είναι το εμβαδόν του;',
      options: ensureFourUniqueOptions(correct, () => [
        '120 cm²',
        isEn ? '12,000 cm²' : '12.000 cm²',
        isEn ? '2,400 cm²' : '2.400 cm²',
        '600 cm²'
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        {
          label: isEn ? 'Area in dm²' : 'Εμβαδόν σε dm²',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num="6 · 4" den="2" />
              <span>＝ 12 dm²</span>
            </span>
          )
        },
        { label: isEn ? 'dm² to cm² ratio' : 'Σχέση dm²/cm²', value: '1 dm² ＝ 100 cm²' },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: <span>12 · 100 ＝ {correct}</span>
        }
      ],
      explanation: isEn ? '1 dm² ＝ 100 cm². Therefore: 12 · 100 ＝ 1,200 cm².' : '1 dm² ＝ 100 cm². Άρα: 12 · 100 ＝ 1.200 cm².'
    };
  },
  // 5. Διπλασιασμός του ύψους
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? 'The area doubles' : 'Το εμβαδόν διπλασιάζεται';
    return {
      title: isEn ? 'SCALING TRIANGLE DIMENSIONS' : 'ΜΕΤΑΒΟΛΗ ΔΙΑΣΤΑΣΕΩΝ ΤΡΙΓΩΝΟΥ',
      prompt: isEn
        ? 'If we double the height of a triangle while keeping the base constant, how does its area change?'
        : 'Αν σε ένα τρίγωνο διπλασιάσουμε το ύψος του διατηρώντας τη βάση σταθερή, πώς θα αλλάξει το εμβαδόν του;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? 'The area quadruples' : 'Το εμβαδόν τετραπλασιάζεται',
        isEn ? 'The area remains unchanged' : 'Το εμβαδόν παραμένει το ίδιο',
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
              <MathFraction num={isEn ? 'b · h' : 'β · υ'} den="2" />
            </span>
          )
        },
        {
          label: isEn ? 'New area' : 'Νέο εμβαδόν',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <span>{isEn ? 'A₂ ＝ ' : 'Ε₂ ＝ '}</span>
              <MathFraction num={isEn ? 'b · 2h' : 'β · 2υ'} den="2" />
              <span>＝ 2 ·</span>
              <MathFraction num={isEn ? 'b · h' : 'β · υ'} den="2" />
              <span>＝ {isEn ? '2 · A₁' : '2 · Ε₁'}</span>
            </span>
          )
        }
      ],
      explanation: isEn
        ? 'Area is directly proportional to height. Doubling the height doubles the area.'
        : 'Το εμβαδόν είναι ανάλογο του ύψους. Αν διπλασιαστεί το ύψος με σταθερή βάση, το εμβαδόν διπλασιάζεται.'
    };
  },
  // 6. Διπλασιασμός και των δύο διαστάσεων
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? 'The area quadruples (4 times larger)' : 'Το εμβαδόν γίνεται 4 φορές μεγαλύτερο (τετραπλασιάζεται)';
    return {
      title: isEn ? 'DOUBLING BASE AND HEIGHT' : 'ΔΙΠΛΑΣΙΑΣΜΟΣ ΒΑΣΗΣ ΚΑΙ ΥΨΟΥΣ',
      prompt: isEn
        ? 'If we double both the base and the height of a triangle, how many times larger does its area become?'
        : 'Αν σε ένα τρίγωνο διπλασιάσουμε και τη βάση και το ύψος του, πόσες φορές μεγαλύτερο θα γίνει το εμβαδόν του;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '2 times larger' : '2 φορές μεγαλύτερο',
        isEn ? '8 times larger' : '8 φορές μεγαλύτερο',
        isEn ? 'Remains unchanged' : 'Παραμένει το ίδιο'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'answer' : 'απάντηση',
      tableData: [
        { label: isEn ? 'Base factor' : 'Συντελεστής βάσης', value: '2' },
        { label: isEn ? 'Height factor' : 'Συντελεστής ύψους', value: '2' },
        {
          label: isEn ? 'Total factor' : 'Συνολική μεταβολή',
          valueNode: <span>2 · 2 ＝ {isEn ? '4 times larger' : '4 φορές μεγαλύτερο'}</span>
        }
      ],
      explanation: isEn
        ? 'When both linear dimensions are doubled, the area scales by 2 · 2 ＝ 4 (quadruples).'
        : 'Όταν διπλασιάζονται και οι δύο διαστάσεις, το εμβαδόν πολλαπλασιάζεται επί 2 · 2 ＝ 4 (τετραπλασιάζεται).'
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 12 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet(locale = 'el') {
  const isEn = locale === 'en';
  const qs = [];

  // Q1: Τύπος εμβαδού τριγώνου (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: isEn ? 'TRIANGLE AREA FORMULA' : 'ΤΥΠΟΣ ΕΜΒΑΔΟΥ ΤΡΙΓΩΝΟΥ',
    prompt: isQ1True
      ? isEn
        ? 'The area of any triangle equals half the product of its base multiplied by the corresponding height: A ＝ (b · h) : 2.'
        : 'Το εμβαδόν κάθε τριγώνου ισούται με το μισό του γινομένου της βάσης του επί το αντίστοιχο ύψος: Ε ＝ (β · υ) : 2.'
      : isEn
        ? 'The area of any triangle is calculated simply by multiplying base by height (A ＝ b · h), without dividing by 2.'
        : 'Το εμβαδόν κάθε τριγώνου υπολογίζεται πολλαπλασιάζοντας απλώς τη βάση επί το ύψος (Ε ＝ β · υ), χωρίς διαίρεση με το 2.',
    correctAnswer: isQ1True,
    tableData: [
      {
        label: isEn ? 'Correct triangle formula' : 'Σωστός τύπος τριγώνου',
        valueNode: (
          <span className="inline-flex items-center">
            <span>{isEn ? 'A ＝ ' : 'Ε ＝ '}</span>
            <MathFraction num={isEn ? 'b · h' : 'β · υ'} den="2" />
          </span>
        )
      },
      {
        label: isEn ? 'Parallelogram formula' : 'Τύπος παραλληλογράμμου',
        valueNode: <span>{isEn ? 'A ＝ b · h (full figure)' : 'Ε ＝ β · υ (ολόκληρο το σχήμα)'}</span>
      }
    ],
    explanation: isQ1True
      ? isEn
        ? 'The area of any triangle is always strictly half that of the corresponding parallelogram: A ＝ (b · h) : 2.'
        : 'Το εμβαδόν κάθε τριγώνου είναι πάντοτε το μισό του αντίστοιχου παραλληλογράμμου: Ε ＝ (β · υ) : 2.'
      : isEn
        ? 'The formula A ＝ b · h gives the area of a parallelogram. A triangle is strictly half of it, so we always divide by 2: A ＝ (b · h) : 2.'
        : 'Ο τύπος Ε ＝ β · υ δίνει το εμβαδόν του παραλληλογράμμου. Το τρίγωνο είναι ακριβώς το μισό, άρα διαιρούμε πάντοτε με το 2: Ε ＝ (β · υ) : 2.'
  });

  // Q2: Γιατί διαιρούμε με το 2 (MCQ)
  const q2Correct = isEn
    ? 'Because two identical triangles join together to form a parallelogram with area b · h'
    : 'Επειδή δύο ολόιδια τρίγωνα ενώνονται και σχηματίζουν ένα παραλληλόγραμμο με εμβαδόν β · υ';
  qs.push({
    id: 2,
    type: 'mcq',
    title: isEn ? 'GEOMETRIC INTERPRETATION' : 'ΓΕΩΜΕΤΡΙΚΗ ΕΡΜΗΝΕΙΑ',
    prompt: isEn
      ? 'Why do we always divide by 2 in the triangle area formula?'
      : 'Γιατί στον τύπο του εμβαδού τριγώνου διαιρούμε πάντοτε με το 2;',
    options: ensureFourUniqueOptions(q2Correct, () => [
      isEn ? 'Because a triangle has 3 sides' : 'Επειδή το τρίγωνο έχει 3 πλευρές',
      isEn ? 'Because all triangles have right angles' : 'Επειδή όλα τα τρίγωνα έχουν ορθές γωνίες',
      isEn ? 'Because it was chosen arbitrarily' : 'Επειδή έτσι αποφασίστηκε τυχαία'
    ]),
    correctAnswer: q2Correct,
    tableData: [
      {
        label: isEn ? '2 triangles' : '2 τρίγωνα',
        valueNode: <span>{isEn ? 'Form a parallelogram (A ＝ b · h)' : 'Σχηματίζουν παραλληλόγραμμο (Ε ＝ β · υ)'}</span>
      },
      {
        label: isEn ? '1 triangle' : '1 τρίγωνο',
        valueNode: (
          <span className="inline-flex items-center">
            <span>{isEn ? 'Is exactly half: ' : 'Αποτελεί το μισό: '}</span>
            <MathFraction num={isEn ? 'b · h' : 'β · υ'} den="2" />
          </span>
        )
      }
    ],
    explanation: isEn
      ? 'Every triangle is strictly half of a parallelogram with the same base and height.'
      : 'Κάθε τρίγωνο είναι ακριβώς το μισό ενός παραλληλογράμμου με την ίδια βάση και το ίδιο ύψος.'
  });

  // Q3: Εμβαδόν ορθογωνίου τριγώνου (MCQ)
  const q3Correct = isEn
    ? 'We multiply the two perpendicular legs and divide by 2: A ＝ (a · b) : 2'
    : 'Πολλαπλασιάζουμε τις δύο κάθετες πλευρές του και διαιρούμε με το 2: Ε ＝ (α · β) : 2';
  qs.push({
    id: 3,
    type: 'mcq',
    title: isEn ? 'RIGHT TRIANGLE AREA' : 'ΟΡΘΟΓΩΝΙΟ ΤΡΙΓΩΝΟ',
    prompt: isEn
      ? 'How do we calculate the area of a right-angled triangle?'
      : 'Πώς υπολογίζουμε το εμβαδόν ενός ορθογωνίου τριγώνου;',
    options: ensureFourUniqueOptions(q3Correct, () => [
      isEn ? 'We multiply all three sides together' : 'Πολλαπλασιάζουμε και τις τρεις πλευρές του μαζί',
      isEn ? 'We add all sides and divide by 2' : 'Προσθέτουμε τις πλευρές του και διαιρούμε με το 2',
      isEn ? 'We multiply the hypotenuse by 2' : 'Πολλαπλασιάζουμε τη μεγαλύτερη πλευρά με το 2'
    ]),
    correctAnswer: q3Correct,
    tableData: [
      { label: isEn ? 'Property' : 'Ιδιότητα', value: isEn ? 'The two perpendicular legs act as base and height' : 'Οι δύο κάθετες πλευρές είναι η μία βάση και η άλλη ύψος' },
      {
        label: isEn ? 'Formula' : 'Τύπος',
        valueNode: (
          <span className="inline-flex items-center">
            <span>{isEn ? 'A ＝ ' : 'Ε ＝ '}</span>
            <MathFraction num={isEn ? 'leg₁ · leg₂' : 'κάθετη₁ · κάθετη₂'} den="2" />
          </span>
        )
      }
    ],
    explanation: isEn
      ? 'In a right triangle the two sides forming the 90° angle act as base and height: A ＝ (a · b) : 2.'
      : 'Στο ορθογώνιο τρίγωνο οι δύο πλευρές που σχηματίζουν τη γωνία 90° δρουν ως βάση και ύψος: Ε ＝ (α · β) : 2.'
  });

  // Q4: Οπτική αναγνώριση ύψους τριγώνου (SVG - No Giveaway)
  const q4Correct = isEn
    ? 'The yellow vertical dashed line (h) with the 90° right angle'
    : 'Η κίτρινη κατακόρυφη διακεκομμένη γραμμή (υ) με τη γωνία 90°';
  qs.push({
    id: 4,
    type: 'mcq',
    title: isEn ? 'IDENTIFYING TRIANGLE HEIGHT' : 'ΑΝΑΓΝΩΡΙΣΗ ΥΨΟΥΣ ΤΡΙΓΩΝΟΥ',
    prompt: isEn
      ? 'Observe the triangle below. Which line represents the true height (h) with respect to the bottom base?'
      : 'Παρατηρήστε το παρακάτω τρίγωνο. Ποια γραμμή εκφράζει το πραγματικό ύψος (υ) ως προς την κάτω βάση;',
    svg: (
      <svg viewBox="0 0 160 110" className="w-full max-w-[160px] h-auto mx-auto my-2 select-none drop-shadow-sm">
        <polygon points="30,85 130,85 60,25" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
        <line x1="60" y1="25" x2="60" y2="85" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
        <rect x="60" y="75" width="10" height="10" fill="none" stroke="#f59e0b" strokeWidth="1" />
        <circle cx="65" cy="80" r="1.5" fill="#f59e0b" />
        <text x="50" y="58" fill="#f59e0b" fontSize="11" fontWeight="bold">{isEn ? 'h' : 'υ'}</text>
        <text x="98" y="50" fill="#a855f7" fontSize="10" fontWeight="bold">{isEn ? 's' : 'π'}</text>
      </svg>
    ),
    options: ensureFourUniqueOptions(q4Correct, () => [
      isEn ? 'The purple slanted side (s) of the triangle' : 'Η μωβ πλάγια πλευρά (π) του τριγώνου',
      isEn ? 'The left slanted side of the triangle' : 'Η αριστερή πλάγια πλευρά του τριγώνου',
      isEn ? 'The triangle has no height' : 'Το τρίγωνο δεν έχει ύψος'
    ]),
    correctAnswer: q4Correct,
    tableData: [
      { label: isEn ? 'Yellow line (h)' : 'Κίτρινη γραμμή (υ)', value: isEn ? 'Perpendicular height (90°)' : 'Κάθετο ύψος (90°)' },
      { label: isEn ? 'Purple line (s)' : 'Μωβ πλευρά (π)', value: isEn ? 'Slanted side (not height)' : 'Πλάγια πλευρά (δεν είναι ύψος)' }
    ],
    explanation: isEn
      ? 'Height is strictly the line segment perpendicular to the base (the yellow dashed line with the right-angle square).'
      : 'Το ύψος είναι πάντοτε το ευθύγραμμο τμήμα που είναι κάθετο στη βάση (η κίτρινη γραμμή με το τετραγωνάκι της ορθής γωνίας).'
  });

  // Q5: Υπολογισμός εμβαδού (Input αριθμού)
  const b5 = randInt(3, 7) * 2;
  const h5 = randInt(4, 10);
  const area5 = (b5 * h5) / 2;
  qs.push({
    id: 5,
    type: 'input',
    title: isEn ? 'CALCULATING AREA IN CM²' : 'ΥΠΟΛΟΓΙΣΜΟΣ ΕΜΒΑΔΟΥ ΣΕ CM²',
    prompt: isEn
      ? `A triangle has a base of ${formatNum(b5, locale)} cm and a corresponding height of ${formatNum(h5, locale)} cm. How many cm² is its area? (Enter only the number)`
      : `Ένα τρίγωνο έχει βάση ${formatNum(b5, locale)} cm και αντίστοιχο ύψος ${formatNum(h5, locale)} cm. Πόσα cm² είναι το εμβαδόν του; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: formatNum(area5, locale),
    tableData: [
      { label: isEn ? 'Base (b)' : 'Βάση (β)', value: `${formatNum(b5, locale)} cm` },
      { label: isEn ? 'Height (h)' : 'Ύψος (υ)', value: `${formatNum(h5, locale)} cm` },
      {
        label: isEn ? 'Calculation' : 'Πράξη',
        valueNode: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <MathFraction num={`${formatNum(b5, locale)} · ${formatNum(h5, locale)}`} den="2" />
            <span>＝</span>
            <MathFraction num={formatNum(b5 * h5, locale)} den="2" />
            <span>＝ {formatNum(area5, locale)} cm²</span>
          </span>
        )
      }
    ],
    explanation: `${isEn ? 'A ＝ (b · h) : 2' : 'Ε ＝ (β · υ) : 2'} ＝ (${formatNum(b5, locale)} · ${formatNum(h5, locale)}) : 2 ＝ ${formatNum(area5, locale)} cm².`
  });

  // Q6: Εύρεση ύψους από το εμβαδόν (Input αριθμού)
  const area6 = 36;
  const b6 = 9;
  const h6 = (2 * area6) / b6;
  qs.push({
    id: 6,
    type: 'input',
    title: isEn ? 'FINDING HEIGHT FROM AREA' : 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΑΠΟ ΤΟ ΕΜΒΑΔΟΝ',
    prompt: isEn
      ? `The area of a triangle is ${formatNum(area6, locale)} m² and its base is ${formatNum(b6, locale)} m. How many meters (m) is its corresponding height? (Enter only the number)`
      : `Το εμβαδόν ενός τριγώνου είναι ${formatNum(area6, locale)} m² και η βάση του είναι ${formatNum(b6, locale)} m. Πόσα μέτρα (m) είναι το αντίστοιχο ύψος του; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(h6),
    tableData: [
      { label: isEn ? 'Area' : 'Εμβαδόν', value: `${formatNum(area6, locale)} m²` },
      {
        label: isEn ? 'Doubled area' : 'Διπλάσιο εμβαδόν',
        valueNode: <span>2 · {formatNum(area6, locale)} ＝ {formatNum(2 * area6, locale)} m²</span>
      },
      {
        label: isEn ? 'Height calculation' : 'Πράξη ύψους',
        valueNode: (
          <span className="inline-flex items-center">
            <MathFraction num={formatNum(2 * area6, locale)} den={formatNum(b6, locale)} />
            <span>＝ {formatNum(h6, locale)} m</span>
          </span>
        )
      }
    ],
    explanation: `${isEn ? 'h ＝ (2 · A) : b' : 'υ ＝ (2 · Ε) : β'} ＝ (2 · ${formatNum(area6, locale)}) : ${formatNum(b6, locale)} ＝ ${formatNum(2 * area6, locale)} : ${formatNum(b6, locale)} ＝ ${formatNum(h6, locale)} m.`
  });

  // Q7: Σχέση τριγώνου και παραλληλογράμμου (MCQ)
  const q7Correct = isEn
    ? 'The area of the triangle is strictly half that of the parallelogram'
    : 'Το εμβαδόν του τριγώνου είναι ακριβώς το μισό από το εμβαδόν του παραλληλογράμμου';
  qs.push({
    id: 7,
    type: 'mcq',
    title: isEn ? 'COMPARISON WITH PARALLELOGRAM' : 'ΣΥΓΚΡΙΣΗ ΜΕ ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟ',
    prompt: isEn
      ? 'A triangle and a parallelogram share the exact same base (b) and the same height (h). What is the relationship between their areas?'
      : 'Ένα τρίγωνο και ένα παραλληλόγραμμο έχουν την ίδια βάση (β) και το ίδιο ύψος (υ). Ποια σχέση έχουν τα εμβαδά τους;',
    options: ensureFourUniqueOptions(q7Correct, () => [
      isEn ? 'They have the exact same area' : 'Έχουν ακριβώς το ίδιο εμβαδόν',
      isEn ? 'The area of the triangle is twice as large' : 'Το εμβαδόν του τριγώνου είναι διπλάσιο',
      isEn ? 'There is no fixed relationship' : 'Δεν έχουν καμία σταθερή σχέση'
    ]),
    correctAnswer: q7Correct,
    tableData: [
      {
        label: isEn ? 'Parallelogram area' : 'Εμβαδόν παραλληλογράμμου',
        valueNode: <span>{isEn ? 'A ＝ b · h' : 'Ε ＝ β · υ'}</span>
      },
      {
        label: isEn ? 'Triangle area' : 'Εμβαδόν τριγώνου',
        valueNode: (
          <span className="inline-flex items-center">
            <span>{isEn ? 'A ＝ ' : 'Ε ＝ '}</span>
            <MathFraction num={isEn ? 'b · h' : 'β · υ'} den="2" />
            <span className="ml-1">{isEn ? '(half)' : '(το μισό)'}</span>
          </span>
        )
      }
    ],
    explanation: isEn
      ? 'Given the same base and height, the triangle area is always strictly half the parallelogram area.'
      : 'Με την ίδια βάση και το ίδιο ύψος, το τρίγωνο έχει πάντοτε ακριβώς το μισό εμβαδόν του παραλληλογράμμου.'
  });

  // Q8: Ύψος σε αμβλυγώνιο τρίγωνο (MCQ)
  const q8Correct = isEn
    ? 'Outside the triangle, on the extension of the opposite base'
    : 'Έξω από το τρίγωνο, στην προέκταση της απέναντι βάσης';
  qs.push({
    id: 8,
    type: 'mcq',
    title: isEn ? 'HEIGHT IN OBTUSE TRIANGLE' : 'ΥΨΟΣ ΣΕ ΑΜΒΛΥΓΩΝΙΟ ΤΡΙΓΩΝΟ',
    prompt: isEn
      ? 'In an obtuse triangle, where can the height drawn from an acute vertex land?'
      : 'Σε ένα αμβλυγώνιο τρίγωνο, πού μπορεί να «πέσει» το ύψος που φέρνουμε από μία οξεία κορυφή;',
    options: ensureFourUniqueOptions(q8Correct, () => [
      isEn ? 'Always strictly in the interior center of the triangle' : 'Πάντοτε αυστηρά στο κέντρο του τριγώνου',
      isEn ? 'Directly on one of its sides' : 'Πάνω σε μία από τις πλευρές του',
      isEn ? 'An obtuse triangle has no height' : 'Δεν υπάρχει ύψος στο αμβλυγώνιο τρίγωνο'
    ]),
    correctAnswer: q8Correct,
    tableData: [
      { label: isEn ? 'Obtuse triangle' : 'Αμβλυγώνιο τρίγωνο', value: isEn ? 'Contains an obtuse angle (＞ 90°)' : 'Περιέχει μία αμβλεία γωνία (＞ 90°)' },
      { label: isEn ? 'Height position' : 'Θέση ύψους', value: isEn ? 'Falls outside the shape, on the extension of the base' : 'Πέφτει έξω από το σχήμα, στην προέκταση της βάσης' }
    ],
    explanation: isEn
      ? 'In an obtuse triangle, two of the three heights lie outside the boundary of the triangle, intersecting the extension of the corresponding base.'
      : 'Στο αμβλυγώνιο τρίγωνο, δύο από τα τρία ύψη βρίσκονται έξω από το τρίγωνο, στην προέκταση της αντίστοιχης βάσης.'
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

export default function EmbadonTrigonouAskiseisPage() {
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
          ? "Exercises: Area of a Triangle - 6th Grade | LearnMaths.gr"
          : "Ασκήσεις: Εμβαδόν Τριγώνου - ΣΤ' Δημοτικού | LearnMaths.gr"
      }
      description={
        isEn
          ? "Interactive exercises on triangle area calculation with A ＝ (b · h) : 2, right-angled triangles, and solving for base or height for 6th Grade Math."
          : "Διαδραστικές ασκήσεις στον υπολογισμό εμβαδού τριγώνου με τον τύπο Ε ＝ (β · υ) : 2, ορθογώνια τρίγωνα και εύρεση βάσης ή ύψους για τη ΣΤ' Δημοτικού."
      }
      backUrl="/st-dimotikou/74-embadon-trigonou"
      backText={isEn ? "Chapter 74 Theory" : "Θεωρία Κεφ. 74"}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/74-embadon-trigonou"
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
              <span>{isEn ? "EXERCISES • CHAPTER 74 • 6TH GRADE" : "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 74 • ΣΤ' ΔΗΜΟΤΙΚΟΥ"}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(isEn ? "Exercises: Triangle Area" : "Ασκησεις: Εμβαδον Τριγωνου")}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl break-words [overflow-wrap:anywhere]">
              {isEn
                ? "Practice calculating area with A ＝ (b · h) : 2, right-angled triangles, and solving for unknown base or height across 12 dynamic interactive exercises."
                : "Εξασκηθείτε στον υπολογισμό εμβαδού με τον τύπο Ε ＝ (β · υ) : 2, στα ορθογώνια τρίγωνα και στην εύρεση άγνωστης βάσης ή ύψους μέσα από 12 δυναμικές ερωτήσεις."}
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