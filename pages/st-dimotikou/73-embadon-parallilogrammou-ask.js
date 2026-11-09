// pages/st-dimotikou/73-embadon-parallilogrammou-ask.js
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

// POOL ΓΙΑ Q9: Υπολογισμός Εμβαδού με Παγίδα την Πλάγια Πλευρά
const PROBLEM_POOL_Q9 = [
  // 1. Παραλληλόγραμμο οικόπεδο
  (locale) => {
    const isEn = locale === 'en';
    const b = randInt(15, 30);
    const h = randInt(8, 16);
    const slant = h + randInt(3, 7);
    const area = b * h;
    const correct = `${formatNum(area, locale)} m²`;
    return {
      title: isEn ? 'PARALLELOGRAM PLOT' : 'ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟ ΟΙΚΟΠΕΔΟ',
      prompt: isEn
        ? `A land lot in the shape of a parallelogram has a base of ${formatNum(b, locale)} m, a perpendicular height of ${formatNum(h, locale)} m, and a slanted side of ${formatNum(slant, locale)} m. What is the area of the lot?`
        : `Ένα οικόπεδο σχήματος παραλληλογράμμου έχει βάση ${formatNum(b, locale)} m, κάθετο ύψος ${formatNum(h, locale)} m και πλάγια πλευρά ${formatNum(slant, locale)} m. Ποιο είναι το εμβαδόν του οικοπέδου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(b * slant, locale)} m²`,
        `${formatNum(area + 30, locale)} m²`,
        `${formatNum(area - 20 > 0 ? area - 20 : area + 50, locale)} m²`,
        `${formatNum(2 * (b + slant), locale)} m²`
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: isEn ? 'Base (b)' : 'Βάση (β)', value: `${formatNum(b, locale)} m` },
        { label: isEn ? 'Perpendicular height (h)' : 'Κάθετο ύψος (υ)', value: `${formatNum(h, locale)} m` },
        { label: isEn ? 'Slanted side' : 'Πλάγια πλευρά', value: `${formatNum(slant, locale)} m (${isEn ? 'not used in area' : 'δεν χρησιμοποιείται στο εμβαδόν'})` },
        {
          label: isEn ? 'Formula & Calculation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <span>{isEn ? 'A ＝ b · h ＝' : 'Ε ＝ β · υ ＝'}</span>
              <span>{formatNum(b, locale)} · {formatNum(h, locale)} ＝ {formatNum(area, locale)} m²</span>
            </span>
          )
        }
      ],
      explanation: isEn
        ? `In the area formula we always multiply the base by the perpendicular height: A ＝ b · h ＝ ${formatNum(b, locale)} · ${formatNum(h, locale)} ＝ ${formatNum(area, locale)} m². The slanted side is not used for area calculation.`
        : `Στον τύπο του εμβαδού πολλαπλασιάζουμε πάντοτε τη βάση με το κάθετο ύψος: Ε ＝ β · υ ＝ ${formatNum(b, locale)} · ${formatNum(h, locale)} ＝ ${formatNum(area, locale)} m². Η πλάγια πλευρά δεν χρειάζεται στον υπολογισμό του εμβαδού.`
    };
  },
  // 2. Μεταλλική πλάκα
  (locale) => {
    const isEn = locale === 'en';
    const b = randInt(12, 25);
    const h = randInt(6, 12);
    const slant = h + 4;
    const area = b * h;
    const correct = `${formatNum(area, locale)} cm²`;
    return {
      title: isEn ? 'METAL PLATE' : 'ΜΕΤΑΛΛΙΚΗ ΠΛΑΚΑ',
      prompt: isEn
        ? `A parallelogram-shaped metal plate has a base length of ${formatNum(b, locale)} cm, a corresponding height of ${formatNum(h, locale)} cm, and a slanted side of ${formatNum(slant, locale)} cm. What is the area of the plate?`
        : `Μια παραλληλόγραμμη μεταλλική πλάκα έχει μήκος βάσης ${formatNum(b, locale)} cm και αντίστοιχο ύψος ${formatNum(h, locale)} cm, ενώ η πλάγια πλευρά της είναι ${formatNum(slant, locale)} cm. Πόσο είναι το εμβαδόν της πλάκας;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(b * slant, locale)} cm²`,
        `${formatNum(area + 15, locale)} cm²`,
        `${formatNum(area - 15 > 0 ? area - 15 : area + 30, locale)} cm²`,
        `${formatNum(2 * b + 2 * h, locale)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Base (b)' : 'Βάση (β)', value: `${formatNum(b, locale)} cm` },
        { label: isEn ? 'Height (h)' : 'Ύψος (υ)', value: `${formatNum(h, locale)} cm` },
        {
          label: isEn ? 'Calculation' : 'Πράξη',
          valueNode: <span>{formatNum(b, locale)} · {formatNum(h, locale)} ＝ {formatNum(area, locale)} cm²</span>
        }
      ],
      explanation: isEn
        ? `A ＝ b · h ＝ ${formatNum(b, locale)} · ${formatNum(h, locale)} ＝ ${formatNum(area, locale)} cm². The slanted side is ignored.`
        : `Ε ＝ β · υ ＝ ${formatNum(b, locale)} · ${formatNum(h, locale)} ＝ ${formatNum(area, locale)} cm². Αγνοούμε την πλάγια πλευρά.`
    };
  },
  // 3. Ξύλινο ράφι
  (locale) => {
    const isEn = locale === 'en';
    const b = randInt(40, 80);
    const h = randInt(20, 35);
    const area = b * h;
    const correct = `${formatNum(area, locale)} cm²`;
    return {
      title: isEn ? 'WOODEN SHELF' : 'ΞΥΛΙΝΟ ΡΑΦΙ',
      prompt: isEn
        ? `A wooden shelf is in the shape of a parallelogram with a base of ${formatNum(b, locale)} cm and a perpendicular distance between the bases of ${formatNum(h, locale)} cm. What is its surface area?`
        : `Ένα ξύλινο ράφι έχει σχήμα παραλληλογράμμου με βάση ${formatNum(b, locale)} cm και κάθετη απόσταση ανάμεσα στις βάσεις ${formatNum(h, locale)} cm. Ποιο είναι το εμβαδόν της επιφάνειάς του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(area + 100, locale)} cm²`,
        `${formatNum(area - 100 > 0 ? area - 100 : area + 200, locale)} cm²`,
        `${formatNum(b * 10, locale)} cm²`,
        `${formatNum(area * 2, locale)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Base (b)' : 'Βάση (β)', value: `${formatNum(b, locale)} cm` },
        { label: isEn ? 'Height (h)' : 'Ύψος (υ)', value: `${formatNum(h, locale)} cm` },
        {
          label: isEn ? 'Area' : 'Εμβαδόν',
          valueNode: <span>{formatNum(b, locale)} · {formatNum(h, locale)} ＝ {formatNum(area, locale)} cm²</span>
        }
      ],
      explanation: `${isEn ? 'A ＝ b · h' : 'Ε ＝ β · υ'} ＝ ${formatNum(b, locale)} · ${formatNum(h, locale)} ＝ ${formatNum(area, locale)} cm².`
    };
  },
  // 4. Παρτέρι λουλουδιών
  (locale) => {
    const isEn = locale === 'en';
    const b = randInt(6, 14);
    const h = randInt(3, 8);
    const area = b * h;
    const correct = `${formatNum(area, locale)} m²`;
    return {
      title: isEn ? 'FLOWER BED' : 'ΠΑΡΤΕΡΙ ΛΟΥΛΟΥΔΙΩΝ',
      prompt: isEn
        ? `A flower bed shaped as a parallelogram has a base of ${formatNum(b, locale)} m and a corresponding height of ${formatNum(h, locale)} m. How many square meters (m²) does it cover?`
        : `Ένα παρτέρι σε σχήμα παραλληλογράμμου έχει βάση ${formatNum(b, locale)} m και αντίστοιχο ύψος ${formatNum(h, locale)} m. Πόσα τετραγωνικά μέτρα (m²) καλύπτει;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(area + 4, locale)} m²`,
        `${formatNum(area - 4 > 0 ? area - 4 : area + 8, locale)} m²`,
        `${formatNum(2 * (b + h), locale)} m²`,
        `${formatNum(area * 2, locale)} m²`
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: isEn ? 'Base' : 'Βάση', value: `${formatNum(b, locale)} m` },
        { label: isEn ? 'Height' : 'Ύψος', value: `${formatNum(h, locale)} m` },
        {
          label: isEn ? 'Operation' : 'Πράξη',
          valueNode: <span>{formatNum(b, locale)} · {formatNum(h, locale)} ＝ ${formatNum(area, locale)} m²</span>
        }
      ],
      explanation: `${isEn ? 'A ＝ b · h' : 'Ε ＝ β · υ'} ＝ ${formatNum(b, locale)} · ${formatNum(h, locale)} ＝ ${formatNum(area, locale)} m².`
    };
  },
  // 5. Διακοσμητικό πλακάκι
  (locale) => {
    const isEn = locale === 'en';
    const correct = '120 cm²';
    return {
      title: isEn ? 'DECORATIVE TILE' : 'ΔΙΑΚΟΣΜΗΤΙΚΟ ΠΛΑΚΑΚΙ',
      prompt: isEn
        ? 'A decorative tile is shaped as a parallelogram with a base of 15 cm, a height of 8 cm, and a slanted side of 10 cm. What is its area?'
        : 'Ένα διακοσμητικό πλακάκι έχει σχήμα παραλληλογράμμου με βάση 15 cm, ύψος 8 cm και πλάγια πλευρά 10 cm. Πόσο είναι το εμβαδόν του;',
      options: ensureFourUniqueOptions(correct, () => ['150 cm²', '100 cm²', '50 cm²', '240 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Base' : 'Βάση', value: '15 cm' },
        { label: isEn ? 'Height' : 'Ύψος', value: '8 cm' },
        {
          label: isEn ? 'Operation' : 'Πράξη',
          valueNode: <span>15 · 8 ＝ 120 cm²</span>
        }
      ],
      explanation: isEn
        ? 'A ＝ b · h ＝ 15 · 8 ＝ 120 cm². The slanted side of 10 cm is not used.'
        : 'Ε ＝ β · υ ＝ 15 · 8 ＝ 120 cm². Η πλάγια πλευρά των 10 cm δεν χρησιμοποιείται.'
    };
  },
  // 6. Πινακίδα σήμανσης
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '1,200 cm²' : '1.200 cm²';
    return {
      title: isEn ? 'SIGNPOST' : 'ΠΙΝΑΚΙΔΑ ΣΗΜΑΝΣΗΣ',
      prompt: isEn
        ? 'A signpost is in the shape of a parallelogram with a base of 50 cm and a height of 24 cm. What is its area in cm²?'
        : 'Μια πινακίδα έχει σχήμα παραλληλογράμμου με βάση 50 cm και ύψος 24 cm. Πόσο είναι το εμβαδόν της σε cm²;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '1,500 cm²' : '1.500 cm²',
        isEn ? '1,000 cm²' : '1.000 cm²',
        '600 cm²',
        isEn ? '2,400 cm²' : '2.400 cm²'
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Base' : 'Βάση', value: '50 cm' },
        { label: isEn ? 'Height' : 'Ύψος', value: '24 cm' },
        {
          label: isEn ? 'Operation' : 'Πράξη',
          valueNode: <span>50 · 24 ＝ {correct}</span>
        }
      ],
      explanation: isEn ? '50 · 24 ＝ 1,200 cm².' : '50 · 24 ＝ 1.200 cm².'
    };
  }
];

// POOL ΓΙΑ Q10: Εύρεση Ύψους ή Βάσης (Αντίστροφο Πρόβλημα με Κλασματική Μορφή)
const PROBLEM_POOL_Q10 = [
  // 1. Εύρεση ύψους σε οικόπεδο
  (locale) => {
    const isEn = locale === 'en';
    const b = randInt(15, 30);
    const h = randInt(10, 20);
    const area = b * h;
    const correct = `${formatNum(h, locale)} m`;
    return {
      title: isEn ? 'FINDING PLOT HEIGHT' : 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΟΙΚΟΠΕΔΟΥ',
      prompt: isEn
        ? `A parallelogram lot has an area of ${formatNum(area, locale)} m² and a base length of ${formatNum(b, locale)} m. What is the corresponding height of the lot?`
        : `Ένα παραλληλόγραμμο οικόπεδο έχει εμβαδόν ${formatNum(area, locale)} m² και μήκος βάσης ${formatNum(b, locale)} m. Πόσο είναι το αντίστοιχο ύψος του οικοπέδου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(h + 3, locale)} m`,
        `${formatNum(h - 2 > 0 ? h - 2 : h + 5, locale)} m`,
        `${formatNum(Math.round(area / 2), locale)} m`,
        `${formatNum(h + 6, locale)} m`
      ]),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: isEn ? 'Area (A)' : 'Εμβαδόν (Ε)', value: `${formatNum(area, locale)} m²` },
        { label: isEn ? 'Base (b)' : 'Βάση (β)', value: `${formatNum(b, locale)} m` },
        {
          label: isEn ? 'Height formula' : 'Τύπος ύψους',
          valueNode: (
            <span className="inline-flex items-center">
              <span>{isEn ? 'h ＝ ' : 'υ ＝ '}</span>
              <MathFraction num={isEn ? 'A' : 'Ε'} den={isEn ? 'b' : 'β'} />
            </span>
          )
        },
        {
          label: isEn ? 'Operation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num={formatNum(area, locale)} den={formatNum(b, locale)} />
              <span>＝ {formatNum(h, locale)} m</span>
            </span>
          )
        }
      ],
      explanation: isEn
        ? `To find the height, we divide the area by the base: h ＝ ${formatNum(area, locale)} : ${formatNum(b, locale)} ＝ ${formatNum(h, locale)} m.`
        : `Για να βρούμε το ύψος, διαιρούμε το εμβαδόν με τη βάση: υ ＝ ${formatNum(area, locale)} : ${formatNum(b, locale)} ＝ ${formatNum(h, locale)} m.`
    };
  },
  // 2. Εύρεση βάσης σε πλάκα
  (locale) => {
    const isEn = locale === 'en';
    const b = randInt(20, 40);
    const h = randInt(8, 15);
    const area = b * h;
    const correct = `${formatNum(b, locale)} cm`;
    return {
      title: isEn ? 'FINDING BASE OF PARALLELOGRAM' : 'ΕΥΡΕΣΗ ΒΑΣΗΣ ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟΥ',
      prompt: isEn
        ? `In a parallelogram, the area is ${formatNum(area, locale)} cm² and the height is ${formatNum(h, locale)} cm. What is the length of the corresponding base?`
        : `Σε ένα παραλληλόγραμμο το εμβαδόν είναι ${formatNum(area, locale)} cm² και το ύψος είναι ${formatNum(h, locale)} cm. Πόσο είναι το μήκος της αντίστοιχης βάσης;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(b + 4, locale)} cm`,
        `${formatNum(b - 4 > 0 ? b - 4 : b + 8, locale)} cm`,
        `${formatNum(Math.round(area / 4), locale)} cm`,
        `${formatNum(b * 2, locale)} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: isEn ? 'Area (A)' : 'Εμβαδόν (Ε)', value: `${formatNum(area, locale)} cm²` },
        { label: isEn ? 'Height (h)' : 'Ύψος (υ)', value: `${formatNum(h, locale)} cm` },
        {
          label: isEn ? 'Base formula' : 'Τύπος βάσης',
          valueNode: (
            <span className="inline-flex items-center">
              <span>{isEn ? 'b ＝ ' : 'β ＝ '}</span>
              <MathFraction num={isEn ? 'A' : 'Ε'} den={isEn ? 'h' : 'υ'} />
            </span>
          )
        },
        {
          label: isEn ? 'Operation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num={formatNum(area, locale)} den={formatNum(h, locale)} />
              <span>＝ {formatNum(b, locale)} cm</span>
            </span>
          )
        }
      ],
      explanation: `${isEn ? 'b ＝ A : h' : 'β ＝ Ε : υ'} ＝ ${formatNum(area, locale)} : ${formatNum(h, locale)} ＝ ${formatNum(b, locale)} cm.`
    };
  },
  // 3. Εύρεση ύψους με διαίρεση
  (locale) => {
    const isEn = locale === 'en';
    const correct = '20 m';
    return {
      title: isEn ? 'CALCULATING PERPENDICULAR HEIGHT' : 'ΥΠΟΛΟΓΙΣΜΟΣ ΚΑΘΕΤΟΥ ΥΨΟΥΣ',
      prompt: isEn
        ? 'The area of a parallelogram is 480 m² and its base is 24 m. What is its height?'
        : 'Το εμβαδόν ενός παραλληλογράμμου είναι 480 m² και η βάση του είναι 24 m. Πόσο είναι το ύψος του;',
      options: ensureFourUniqueOptions(correct, () => ['25 m', '18 m', '15 m', '30 m']),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: isEn ? 'Area' : 'Εμβαδόν', value: '480 m²' },
        { label: isEn ? 'Base' : 'Βάση', value: '24 m' },
        {
          label: isEn ? 'Operation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num="480" den="24" />
              <span>＝ 20 m</span>
            </span>
          )
        }
      ],
      explanation: '480 : 24 ＝ 20 m.'
    };
  },
  // 4. Εύρεση βάσης με εμβαδόν 350 cm²
  (locale) => {
    const isEn = locale === 'en';
    const correct = '25 cm';
    return {
      title: isEn ? 'CALCULATING BASE LENGTH' : 'ΥΠΟΛΟΓΙΣΜΟΣ ΜΗΚΟΥΣ ΒΑΣΗΣ',
      prompt: isEn
        ? 'A parallelogram has an area of 350 cm² and a height of 14 cm. How many centimeters (cm) is its base?'
        : 'Ένα παραλληλόγραμμο έχει εμβαδόν 350 cm² και ύψος 14 cm. Πόσα εκατοστόμετρα (cm) είναι η βάση του;',
      options: ensureFourUniqueOptions(correct, () => ['20 cm', '30 cm', '28 cm', '35 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: isEn ? 'Area' : 'Εμβαδόν', value: '350 cm²' },
        { label: isEn ? 'Height' : 'Ύψος', value: '14 cm' },
        {
          label: isEn ? 'Operation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num="350" den="14" />
              <span>＝ 25 cm</span>
            </span>
          )
        }
      ],
      explanation: '350 : 14 ＝ 25 cm.'
    };
  },
  // 5. Αγροτεμάχιο με στρέμματα
  (locale) => {
    const isEn = locale === 'en';
    const correct = '50 m';
    const areaStr = isEn ? '3,000' : '3.000';
    return {
      title: isEn ? 'FARM LOT HEIGHT IN STREMMATA' : 'ΥΨΟΣ ΑΓΡΟΤΕΜΑΧΙΟΥ ΣΕ ΣΤΡΕΜΜΑΤΑ',
      prompt: isEn
        ? 'A parallelogram field has an area of 3 stremmata (3,000 m²) and a frontage length (base) of 60 m. What is the depth (height) of the field?'
        : 'Ένα παραλληλόγραμμο χωράφι έχει έκταση 3 στρέμματα (3.000 m²) και μήκος πρόσοψης (βάση) 60 m. Πόσο είναι το βάθος (ύψος) του χωραφιού;',
      options: ensureFourUniqueOptions(correct, () => ['40 m', '60 m', '55 m', '30 m']),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: isEn ? 'Area in m²' : 'Έκταση σε m²', value: isEn ? '3 stremmata ＝ 3,000 m²' : '3 στρέμματα ＝ 3.000 m²' },
        { label: isEn ? 'Base' : 'Βάση', value: '60 m' },
        {
          label: isEn ? 'Operation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num={areaStr} den="60" />
              <span>＝ 50 m</span>
            </span>
          )
        }
      ],
      explanation: isEn ? '3 stremmata ＝ 3,000 m². 3,000 : 60 ＝ 50 m.' : '3 στρέμματα ＝ 3.000 m². 3.000 : 60 ＝ 50 m.'
    };
  },
  // 6. Εύρεση ύψους σε μικρή επιφάνεια
  (locale) => {
    const isEn = locale === 'en';
    const correct = '8 cm';
    return {
      title: isEn ? 'FINDING HEIGHT IN CM' : 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΣΕ CM',
      prompt: isEn
        ? 'A parallelogram has an area of 72 cm² and a base of 9 cm. What is its height?'
        : 'Ένα παραλληλόγραμμο έχει εμβαδόν 72 cm² και βάση 9 cm. Πόσο είναι το ύψος του;',
      options: ensureFourUniqueOptions(correct, () => ['9 cm', '7 cm', '6 cm', '12 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: isEn ? 'Area' : 'Εμβαδόν', value: '72 cm²' },
        { label: isEn ? 'Base' : 'Βάση', value: '9 cm' },
        {
          label: isEn ? 'Operation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num="72" den="9" />
              <span>＝ 8 cm</span>
            </span>
          )
        }
      ],
      explanation: '72 : 9 ＝ 8 cm.'
    };
  }
];

// POOL ΓΙΑ Q11: Μετατροπές Μονάδων Επιφάνειας στο Παραλληλόγραμμο (dm², cm², m²)
const PROBLEM_POOL_Q11 = [
  // 1. Βάση σε m και ύψος σε cm
  (locale) => {
    const isEn = locale === 'en';
    const bM = 3;
    const hCm = 40;
    const bCm = bM * 100;
    const areaCm2 = bCm * hCm;
    const correct = `${formatNum(areaCm2, locale)} cm²`;
    return {
      title: isEn ? 'MIXED UNITS (M AND CM)' : 'ΔΙΑΦΟΡΕΤΙΚΕΣ ΜΟΝΑΔΕΣ (M ΚΑΙ CM)',
      prompt: isEn
        ? `In a parallelogram the base is ${formatNum(bM, locale)} m and the corresponding height is ${formatNum(hCm, locale)} cm. What is its area in square centimeters (cm²)?`
        : `Σε ένα παραλληλόγραμμο η βάση είναι ${formatNum(bM, locale)} m και το αντίστοιχο ύψος είναι ${formatNum(hCm, locale)} cm. Πόσο είναι το εμβαδόν του σε τετραγωνικά εκατοστόμετρα (cm²);`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(bM * hCm, locale)} cm²`,
        `${formatNum(areaCm2 / 10, locale)} cm²`,
        `${formatNum(areaCm2 + 1000, locale)} cm²`,
        `${formatNum(areaCm2 * 2, locale)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Base in cm (· 100)' : 'Βάση σε cm (· 100)', value: `${formatNum(bM, locale)} m ＝ ${formatNum(bCm, locale)} cm` },
        { label: isEn ? 'Height in cm' : 'Ύψος σε cm', value: `${formatNum(hCm, locale)} cm` },
        {
          label: isEn ? 'Operation' : 'Πράξη',
          valueNode: <span>{formatNum(bCm, locale)} · {formatNum(hCm, locale)} ＝ {formatNum(areaCm2, locale)} cm²</span>
        }
      ],
      explanation: isEn
        ? `Before multiplying, convert meters to centimeters: ${formatNum(bM, locale)} m ＝ ${formatNum(bCm, locale)} cm. Area: ${formatNum(bCm, locale)} · ${formatNum(hCm, locale)} ＝ ${formatNum(areaCm2, locale)} cm².`
        : `Πριν τον πολλαπλασιασμό μετατρέπουμε τα μέτρα σε εκατοστά: ${formatNum(bM, locale)} m ＝ ${formatNum(bCm, locale)} cm. Εμβαδόν: ${formatNum(bCm, locale)} · ${formatNum(hCm, locale)} ＝ ${formatNum(areaCm2, locale)} cm².`
    };
  },
  // 2. Εμβαδόν σε dm² και μετατροπή σε cm²
  (locale) => {
    const isEn = locale === 'en';
    const bDm = randInt(4, 9);
    const hDm = randInt(3, 6);
    const areaDm2 = bDm * hDm;
    const areaCm2 = areaDm2 * 100;
    const correct = `${formatNum(areaCm2, locale)} cm²`;
    return {
      title: isEn ? 'FROM DM² TO CM²' : 'ΑΠΟ DM² ΣΕ CM²',
      prompt: isEn
        ? `A parallelogram has a base of ${formatNum(bDm, locale)} dm and a height of ${formatNum(hDm, locale)} dm (area ${formatNum(areaDm2, locale)} dm²). How many square centimeters (cm²) is its area?`
        : `Ένα παραλληλόγραμμο έχει βάση ${formatNum(bDm, locale)} dm και ύψος ${formatNum(hDm, locale)} dm (εμβαδόν ${formatNum(areaDm2, locale)} dm²). Πόσα τετραγωνικά εκατοστόμετρα (cm²) είναι το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(areaDm2 * 10, locale)} cm²`,
        `${formatNum(areaCm2 + 50, locale)} cm²`,
        `${formatNum(areaCm2 - 50 > 0 ? areaCm2 - 50 : areaCm2 + 100, locale)} cm²`,
        `${formatNum(areaDm2, locale)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Area in dm²' : 'Εμβαδόν σε dm²', value: `${formatNum(areaDm2, locale)} dm²` },
        { label: isEn ? 'dm² to cm² ratio' : 'Σχέση dm²/cm²', value: '1 dm² ＝ 100 cm²' },
        {
          label: isEn ? 'Operation (· 100)' : 'Πράξη (· 100)',
          valueNode: <span>{formatNum(areaDm2, locale)} · 100 ＝ {formatNum(areaCm2, locale)} cm²</span>
        }
      ],
      explanation: isEn
        ? `1 dm² ＝ 100 cm². Therefore: ${formatNum(areaDm2, locale)} · 100 ＝ ${formatNum(areaCm2, locale)} cm².`
        : `1 dm² ＝ 100 cm². Άρα: ${formatNum(areaDm2, locale)} · 100 ＝ ${formatNum(areaCm2, locale)} cm².`
    };
  },
  // 3. Βάση σε dm και ύψος σε cm
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '1,000 cm²' : '1.000 cm²';
    return {
      title: isEn ? 'CONVERT DM TO CM' : 'ΜΕΤΑΤΡΟΠΗ DM ΣΕ CM',
      prompt: isEn
        ? 'A parallelogram has a base of 5 dm and a height of 20 cm. How many cm² is its area?'
        : 'Ένα παραλληλόγραμμο έχει βάση 5 dm και ύψος 20 cm. Πόσα cm² είναι το εμβαδόν του;',
      options: ensureFourUniqueOptions(correct, () => ['100 cm²', isEn ? '10,000 cm²' : '10.000 cm²', '500 cm²', '200 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Base in cm' : 'Βάση σε cm', value: '5 dm ＝ 50 cm' },
        { label: isEn ? 'Height in cm' : 'Ύψος σε cm', value: '20 cm' },
        {
          label: isEn ? 'Operation' : 'Πράξη',
          valueNode: <span>50 · 20 ＝ {correct}</span>
        }
      ],
      explanation: isEn ? '5 dm ＝ 50 cm. A ＝ 50 · 20 ＝ 1,000 cm².' : '5 dm ＝ 50 cm. Ε ＝ 50 · 20 ＝ 1.000 cm².'
    };
  },
  // 4. Εμβαδόν σε cm² και ζητείται σε dm²
  (locale) => {
    const isEn = locale === 'en';
    const correct = '25 dm²';
    const areaStr = isEn ? '2,500' : '2.500';
    return {
      title: isEn ? 'FROM CM² TO DM²' : 'ΑΠΟ CM² ΣΕ DM²',
      prompt: isEn
        ? 'The area of a parallelogram is 2,500 cm². How many square decimeters (dm²) is that?'
        : 'Το εμβαδόν ενός παραλληλογράμμου είναι 2.500 cm². Πόσα τετραγωνικά δεκατόμετρα (dm²) είναι;',
      options: ensureFourUniqueOptions(correct, () => ['250 dm²', isEn ? '2.5 dm²' : '2,5 dm²', isEn ? '25,000 dm²' : '25.000 dm²', '50 dm²']),
      correctAnswer: correct,
      unit: 'dm²',
      tableData: [
        { label: isEn ? 'Area in cm²' : 'Εμβαδόν σε cm²', value: `${areaStr} cm²` },
        {
          label: isEn ? 'Operation (: 100)' : 'Πράξη (: 100)',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num={areaStr} den="100" />
              <span>＝ 25 dm²</span>
            </span>
          )
        }
      ],
      explanation: isEn ? 'Moving up 1 step: 2,500 : 100 ＝ 25 dm².' : 'Ανεβαίνουμε 1 σκαλοπάτι: 2.500 : 100 ＝ 25 dm².'
    };
  },
  // 5. Βάση σε m και αποτέλεσμα σε dm²
  (locale) => {
    const isEn = locale === 'en';
    const correct = '300 dm²';
    return {
      title: isEn ? 'AREA IN DM²' : 'ΕΜΒΑΔΟΝ ΣΕ DM²',
      prompt: isEn
        ? 'In a parallelogram the base is 2 m and the height is 15 dm. How many dm² is its area?'
        : 'Σε ένα παραλληλόγραμμο η βάση είναι 2 m και το ύψος είναι 15 dm. Πόσα dm² είναι το εμβαδόν του;',
      options: ensureFourUniqueOptions(correct, () => ['30 dm²', isEn ? '3,000 dm²' : '3.000 dm²', '150 dm²', '300 m²']),
      correctAnswer: correct,
      unit: 'dm²',
      tableData: [
        { label: isEn ? 'Base in dm' : 'Βάση σε dm', value: '2 m ＝ 20 dm' },
        { label: isEn ? 'Height in dm' : 'Ύψος σε dm', value: '15 dm' },
        {
          label: isEn ? 'Operation' : 'Πράξη',
          valueNode: <span>20 · 15 ＝ 300 dm²</span>
        }
      ],
      explanation: isEn ? '2 m ＝ 20 dm. A ＝ 20 · 15 ＝ 300 dm².' : '2 m ＝ 20 dm. Ε ＝ 20 · 15 ＝ 300 dm².'
    };
  },
  // 6. Εμβαδόν σε m² και μετατροπή σε στρέμματα
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '4 stremmata' : '4 στρέμματα';
    const areaStr = isEn ? '4,000' : '4.000';
    const divStr = isEn ? '1,000' : '1.000';
    return {
      title: isEn ? 'FARM LOT IN STREMMATA' : 'ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟΣ ΑΓΡΟΣ ΣΕ ΣΤΡΕΜΜΑΤΑ',
      prompt: isEn
        ? 'A parallelogram field has a base of 80 m and a height of 50 m. How many stremmata is its area?'
        : 'Ένας παραλληλόγραμμος αγρός έχει βάση 80 m και ύψος 50 m. Πόσα στρέμματα είναι η έκτασή του;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '40 stremmata' : '40 στρέμματα',
        isEn ? '0.4 stremmata' : '0,4 στρέμματα',
        isEn ? '400 stremmata' : '400 στρέμματα',
        isEn ? '8 stremmata' : '8 στρέμματα'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'stremmata' : 'στρέμματα',
      tableData: [
        {
          label: isEn ? 'Area in m²' : 'Εμβαδόν σε m²',
          valueNode: <span>80 · 50 ＝ {areaStr} m²</span>
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
      explanation: isEn ? '80 · 50 ＝ 4,000 m². 4,000 : 1,000 ＝ 4 stremmata.' : '80 · 50 ＝ 4.000 m². 4.000 : 1.000 ＝ 4 στρέμματα.'
    };
  }
];

// POOL ΓΙΑ Q12: Ισοδύναμα Σχήματα & Δύο Ύψη (β₁ · υ₁ ＝ β₂ · υ₂)
const PROBLEM_POOL_Q12 = [
  // 1. Εύρεση του 2ου ύψους
  (locale) => {
    const isEn = locale === 'en';
    const b1 = 20;
    const h1 = 12;
    const b2 = 15;
    const h2 = (b1 * h1) / b2;
    const correct = `${formatNum(h2, locale)} cm`;
    return {
      title: isEn ? 'CALCULATING SECOND HEIGHT' : 'ΥΠΟΛΟΓΙΣΜΟΣ ΔΕΥΤΕΡΟΥ ΥΨΟΥΣ',
      prompt: isEn
        ? `A parallelogram has sides of 20 cm and 15 cm. The height corresponding to the 20 cm side is 12 cm. What is the height corresponding to the other side of 15 cm?`
        : `Ένα παραλληλόγραμμο έχει πλευρές 20 cm και 15 cm. Το ύψος που αντιστοιχεί στην πλευρά των 20 cm είναι 12 cm. Πόσο είναι το ύψος που αντιστοιχεί στην άλλη πλευρά των 15 cm;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(h2 + 2, locale)} cm`,
        `${formatNum(h2 - 2 > 0 ? h2 - 2 : h2 + 6, locale)} cm`,
        `${formatNum(h1, locale)} cm`,
        `${formatNum(h2 + 4, locale)} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        {
          label: isEn ? 'Area (b₁ · h₁)' : 'Εμβαδόν (β₁ · υ₁)',
          valueNode: <span>20 · 12 ＝ 240 cm²</span>
        },
        {
          label: isEn ? 'Formula for h₂' : 'Τύπος για το υ₂',
          valueNode: (
            <span className="inline-flex items-center">
              <span>{isEn ? 'h₂ ＝ ' : 'υ₂ ＝ '}</span>
              <MathFraction num={isEn ? 'A' : 'Ε'} den={isEn ? 'b₂' : 'β₂'} />
            </span>
          )
        },
        {
          label: isEn ? 'Operation' : 'Πράξη',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num="240" den="15" />
              <span>＝ 16 cm</span>
            </span>
          )
        }
      ],
      explanation: isEn
        ? 'The area is invariant: A ＝ 20 · 12 ＝ 240 cm². The second height is: h₂ ＝ 240 : 15 ＝ 16 cm.'
        : 'Το εμβαδόν είναι σταθερό: Ε ＝ 20 · 12 ＝ 240 cm². Το δεύτερο ύψος υπολογίζεται ως: υ₂ ＝ 240 : 15 ＝ 16 cm.'
    };
  },
  // 2. Εύρεση 2ου ύψους με διαστάσεις 30 και 20
  (locale) => {
    const isEn = locale === 'en';
    const correct = '15 cm';
    return {
      title: isEn ? 'TWO HEIGHTS RELATION' : 'ΣΧΕΣΗ ΔΥΟ ΥΨΩΝ',
      prompt: isEn
        ? 'In a parallelogram with sides of 30 cm and 20 cm, the height to the longer side is 10 cm. What is the height to the shorter side?'
        : 'Σε ένα παραλληλόγραμμο με πλευρές 30 cm και 20 cm, το ύψος προς τη μεγάλη πλευρά είναι 10 cm. Πόσο είναι το ύψος προς τη μικρή πλευρά;',
      options: ensureFourUniqueOptions(correct, () => ['12 cm', '18 cm', '20 cm', '10 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        {
          label: isEn ? 'Area' : 'Εμβαδόν',
          valueNode: <span>30 · 10 ＝ 300 cm²</span>
        },
        {
          label: isEn ? 'Second height' : 'Δεύτερο ύψος',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num="300" den="20" />
              <span>＝ 15 cm</span>
            </span>
          )
        }
      ],
      explanation: '30 · 10 ＝ 300 cm². 300 : 20 ＝ 15 cm.'
    };
  },
  // 3. Ισοδύναμο ορθογώνιο και παραλληλόγραμμο
  (locale) => {
    const isEn = locale === 'en';
    const correct = '8 cm';
    return {
      title: isEn ? 'EQUIVALENT FIGURES' : 'ΙΣΟΔΥΝΑΜΑ ΣΧΗΜΑΤΑ',
      prompt: isEn
        ? 'A parallelogram has the same area as a rectangle measuring 16 cm by 9 cm. If the base of the parallelogram is 18 cm, what is its height?'
        : 'Ένα παραλληλόγραμμο έχει το ίδιο εμβαδόν με ένα ορθογώνιο διαστάσεων 16 cm και 9 cm. Αν η βάση του παραλληλογράμμου είναι 18 cm, πόσο είναι το ύψος του;',
      options: ensureFourUniqueOptions(correct, () => ['10 cm', '6 cm', '9 cm', '12 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        {
          label: isEn ? 'Rectangle area' : 'Εμβαδόν ορθογωνίου',
          valueNode: <span>16 · 9 ＝ 144 cm²</span>
        },
        { label: isEn ? 'Parallelogram area' : 'Εμβαδόν παραλληλογράμμου', value: isEn ? '144 cm² (equal)' : '144 cm² (ίσο)' },
        {
          label: isEn ? 'Parallelogram height' : 'Ύψος παραλληλογράμμου',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num="144" den="18" />
              <span>＝ 8 cm</span>
            </span>
          )
        }
      ],
      explanation: isEn
        ? 'The rectangle area is 16 · 9 ＝ 144 cm². Parallelogram height: 144 : 18 ＝ 8 cm.'
        : 'Το εμβαδόν του ορθογωνίου είναι 16 · 9 ＝ 144 cm². Το ύψος του παραλληλογράμμου είναι: 144 : 18 ＝ 8 cm.'
    };
  },
  // 4. Ισοδύναμο τετράγωνο και παραλληλόγραμμο
  (locale) => {
    const isEn = locale === 'en';
    const correct = '6 cm';
    return {
      title: isEn ? 'EQUIVALENT TO A SQUARE' : 'ΙΣΟΔΥΝΑΜΟ ΜΕ ΤΕΤΡΑΓΩΝΟ',
      prompt: isEn
        ? 'A parallelogram has an area equal to a square with a side length of 12 cm. If the base of the parallelogram is 24 cm, what is its height?'
        : 'Ένα παραλληλόγραμμο έχει ίσο εμβαδόν με ένα τετράγωνο πλευράς 12 cm. Αν η βάση του παραλληλογράμμου είναι 24 cm, πόσο είναι το ύψος του;',
      options: ensureFourUniqueOptions(correct, () => ['8 cm', '12 cm', '4 cm', '10 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        {
          label: isEn ? 'Square area' : 'Εμβαδόν τετραγώνου',
          valueNode: <span>12 · 12 ＝ 144 cm²</span>
        },
        { label: isEn ? 'Parallelogram base' : 'Βάση παραλληλογράμμου', value: '24 cm' },
        {
          label: isEn ? 'Parallelogram height' : 'Ύψος παραλληλογράμμου',
          valueNode: (
            <span className="inline-flex items-center">
              <MathFraction num="144" den="24" />
              <span>＝ 6 cm</span>
            </span>
          )
        }
      ],
      explanation: isEn ? 'A ＝ 12 · 12 ＝ 144 cm². h ＝ 144 : 24 ＝ 6 cm.' : 'Ε ＝ 12 · 12 ＝ 144 cm². υ ＝ 144 : 24 ＝ 6 cm.'
    };
  },
  // 5. Διπλασιασμός της βάσης
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? 'The area doubles' : 'Το εμβαδόν διπλασιάζεται';
    return {
      title: isEn ? 'DIMENSION SCALING' : 'ΜΕΤΑΒΟΛΗ ΔΙΑΣΤΑΣΕΩΝ',
      prompt: isEn
        ? 'If we double the base length of a parallelogram while keeping its height constant, how will its area change?'
        : 'Αν σε ένα παραλληλόγραμμο διπλασιάσουμε το μήκος της βάσης του κρατώντας το ύψος σταθερό, πώς θα αλλάξει το εμβαδόν του;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? 'The area quadruples' : 'Το εμβαδόν τετραπλασιάζεται',
        isEn ? 'The area remains unchanged' : 'Το εμβαδόν παραμένει το ίδιο',
        isEn ? 'The area triples' : 'Το εμβαδόν τριπλασιάζεται'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'answer' : 'απάντηση',
      tableData: [
        { label: isEn ? 'Initial area' : 'Αρχικό εμβαδόν', value: isEn ? 'A₁ ＝ b · h' : 'Ε₁ ＝ β · υ' },
        { label: isEn ? 'New area' : 'Νέο εμβαδόν', value: isEn ? 'A₂ ＝ (2 · b) · h ＝ 2 · (b · h) ＝ 2 · A₁' : 'Ε₂ ＝ (2 · β) · υ ＝ 2 · (β · υ) ＝ 2 · Ε₁' }
      ],
      explanation: isEn
        ? 'Area is directly proportional to base. Doubling base with constant height doubles the area.'
        : 'Το εμβαδόν είναι ανάλογο της βάσης. Αν διπλασιαστεί η βάση με σταθερό ύψος, το εμβαδόν διπλασιάζεται.'
    };
  },
  // 6. Σύγκριση δύο υψών
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn
      ? 'The height corresponding to the shorter side is always greater'
      : 'Το ύψος προς τη μικρή πλευρά είναι πάντοτε μεγαλύτερο';
    return {
      title: isEn ? 'COMPARING HEIGHT SIZES' : 'ΣΥΓΚΡΙΣΗ ΜΕΓΕΘΟΥΣ ΥΨΩΝ',
      prompt: isEn
        ? 'In a parallelogram with unequal sides, which of the two heights is larger?'
        : 'Σε ένα παραλληλόγραμμο με δύο άνισες πλευρές, ποιο από τα δύο ύψη είναι μεγαλύτερο;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? 'The height to the longer side is greater' : 'Το ύψος προς τη μεγάλη πλευρά είναι μεγαλύτερο',
        isEn ? 'Both heights are always equal' : 'Και τα δύο ύψη είναι πάντα ίσα',
        isEn ? 'It depends on the total area of the shape' : 'Εξαρτάται από το εμβαδόν του σχήματος'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'answer' : 'απάντηση',
      tableData: [
        { label: isEn ? 'Relationship' : 'Σχέση', value: isEn ? 'b₁ · h₁ ＝ b₂ · h₂' : 'β₁ · υ₁ ＝ β₂ · υ₂' },
        { label: isEn ? 'Rule' : 'Κανόνας', value: isEn ? 'The shorter base corresponds to the larger height' : 'Στη μικρότερη βάση αντιστοιχεί το μεγαλύτερο ύψος' }
      ],
      explanation: isEn
        ? 'Because the product b · h is constant, the shorter side must correspond to the longer perpendicular height.'
        : 'Επειδή το γινόμενο β · υ είναι σταθερό, στη μικρότερη πλευρά αντιστοιχεί υποχρεωτικά το μεγαλύτερο ύψος.'
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 12 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet(locale = 'el') {
  const isEn = locale === 'en';
  const qs = [];

  // Q1: Τύπος εμβαδού παραλληλογράμμου (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: isEn ? 'PARALLELOGRAM AREA FORMULA' : 'ΤΥΠΟΣ ΕΜΒΑΔΟΥ ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟΥ',
    prompt: isQ1True
      ? isEn
        ? 'The area of a parallelogram equals the product of its base multiplied by the corresponding perpendicular height (A ＝ b · h).'
        : 'Το εμβαδόν ενός παραλληλογράμμου ισούται με το γινόμενο της βάσης του επί το αντίστοιχο κάθετο ύψος (Ε ＝ β · υ).'
      : isEn
        ? 'The area of a parallelogram always equals the product of its two adjacent sides, exactly like a rectangle.'
        : 'Το εμβαδόν ενός παραλληλογράμμου ισούται πάντοτε με το γινόμενο των δύο διαδοχικών πλευρών του, όπως στο ορθογώνιο.',
    correctAnswer: isQ1True,
    tableData: [
      { label: isEn ? 'Correct formula' : 'Σωστός τύπος', value: isEn ? 'A ＝ b · h (Base · Perpendicular Height)' : 'Ε ＝ β · υ (Βάση · Κάθετο Ύψος)' },
      { label: isEn ? 'Slanted side' : 'Πλάγια πλευρά', value: isEn ? 'Not multiplied by the base because it is inclined' : 'Δεν πολλαπλασιάζεται με τη βάση γιατί είναι κεκλιμένη' }
    ],
    explanation: isQ1True
      ? isEn
        ? 'The area of every parallelogram is given by A ＝ b · h, where h is the perpendicular height to base b.'
        : 'Το εμβαδόν κάθε παραλληλογράμμου δίνεται από τον τύπο Ε ＝ β · υ, όπου υ είναι το κάθετο ύψος στη βάση β.'
      : isEn
        ? 'In a slanted parallelogram we never multiply the two sides; we multiply the base by the perpendicular height (A ＝ b · h).'
        : 'Στο πλάγιο παραλληλόγραμμο δεν πολλαπλασιάζουμε τις δύο πλευρές, αλλά τη βάση με το κάθετο ύψος (Ε ＝ β · υ).'
  });

  // Q2: Επιλογή ύψους (MCQ)
  const q2Correct = isEn
    ? 'The perpendicular line segment (90° angle) between the base and the opposite parallel side'
    : 'Το κάθετο ευθύγραμμο τμήμα (γωνία 90°) ανάμεσα στη βάση και την απέναντι πλευρά';
  qs.push({
    id: 2,
    type: 'mcq',
    title: isEn ? 'CONCEPT OF HEIGHT' : 'ΕΝΝΟΙΑ ΤΟΥ ΥΨΟΥΣ',
    prompt: isEn
      ? 'What is the height of a parallelogram with respect to a chosen base?'
      : 'Τι είναι το ύψος ενός παραλληλογράμμου ως προς μία βάση του;',
    options: ensureFourUniqueOptions(q2Correct, () => [
      isEn ? 'The length of the slanted side of the shape' : 'Το μήκος της πλάγιας πλευράς του σχήματος',
      isEn ? 'The length of the diagonal of the parallelogram' : 'Το μήκος της διαγωνίου του παραλληλογράμμου',
      isEn ? 'The sum of all its sides' : 'Το άθροισμα όλων των πλευρών του'
    ]),
    correctAnswer: q2Correct,
    tableData: [
      { label: isEn ? 'Definition of height' : 'Ορισμός ύψους', value: isEn ? 'Perpendicular distance (90°) between parallel sides' : 'Κάθετη απόσταση (90°) μεταξύ παραλλήλων πλευρών' }
    ],
    explanation: isEn
      ? 'Height is always perpendicular (90°) to the base and measures the straight distance between the two parallel sides.'
      : 'Το ύψος είναι πάντοτε κάθετο (90°) στη βάση και εκφράζει την απόσταση ανάμεσα στις δύο παράλληλες πλευρές.'
  });

  // Q3: Μετατροπή σε ορθογώνιο (MCQ)
  const q3Correct = isEn
    ? 'Because cutting the right triangle from one side and attaching it to the other forms an identical rectangle'
    : 'Γιατί κόβοντας το ορθογώνιο τρίγωνο από τη μία πλευρά και κολλώντας το στην άλλη, σχηματίζεται τέλειο ορθογώνιο';
  qs.push({
    id: 3,
    type: 'mcq',
    title: isEn ? 'TRANSFORMATION INTO RECTANGLE' : 'ΜΕΤΑΤΡΟΠΗ ΣΕ ΟΡΘΟΓΩΝΙΟ',
    prompt: isEn
      ? 'Why is the area of a parallelogram calculated using the same base-times-height principle as a rectangle (A ＝ b · h)?'
      : 'Γιατί το εμβαδόν του παραλληλογράμμου υπολογίζεται με τον ίδιο τύπο όπως το ορθογώνιο (Ε ＝ β · υ);',
    options: ensureFourUniqueOptions(q3Correct, () => [
      isEn ? 'Because all parallelograms have 4 right angles' : 'Γιατί όλα τα παραλληλόγραμμα έχουν 4 ορθές γωνίες',
      isEn ? 'Because they always have equal sides' : 'Γιατί έχουν πάντοτε ίσες πλευρές',
      isEn ? 'Because it was agreed without geometric proof' : 'Επειδή έτσι συμφωνήθηκε χωρίς απόδειξη'
    ]),
    correctAnswer: q3Correct,
    tableData: [
      { label: isEn ? 'Dissection' : 'Αποκοπή', value: isEn ? 'Right triangle cut from left' : 'Αφαιρείται το ορθογώνιο τρίγωνο από αριστερά' },
      { label: isEn ? 'Composition' : 'Σύνθεση', value: isEn ? 'Attached to right side to form a rectangle of length b and width h' : 'Προστίθεται στα δεξιά και δημιουργεί ορθογώνιο με μήκος β και πλάτος υ' }
    ],
    explanation: isEn
      ? 'The parallelogram transforms via rearrangement into an equivalent rectangle with dimensions b and h.'
      : 'Το παραλληλόγραμμο μετασχηματίζεται με αναδιάταξη σε ισοδύναμο ορθογώνιο με διαστάσεις β και υ.'
  });

  // Q4: Οπτική αναγνώριση ύψους (SVG - No Giveaway)
  const q4Correct = isEn
    ? 'The yellow vertical dashed line (h) with the 90° right angle'
    : 'Η κίτρινη κατακόρυφη διακεκομμένη γραμμή (υ) με τη γωνία 90°';
  qs.push({
    id: 4,
    type: 'mcq',
    title: isEn ? 'IDENTIFYING THE TRUE HEIGHT' : 'ΑΝΑΓΝΩΡΙΣΗ ΣΩΣΤΟΥ ΥΨΟΥΣ',
    prompt: isEn
      ? 'Observe the parallelogram below. Which line represents the true height (h) corresponding to the bottom base?'
      : 'Παρατηρήστε το παρακάτω παραλληλόγραμμο. Ποια γραμμή εκφράζει το πραγματικό ύψος (υ) που αντιστοιχεί στην κάτω βάση;',
    svg: (
      <svg viewBox="0 0 180 110" className="w-full max-w-[176px] h-auto mx-auto my-2 select-none drop-shadow-sm">
        <polygon points="40,85 140,85 165,25 65,25" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
        <line x1="65" y1="25" x2="65" y2="85" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
        <rect x="65" y="75" width="10" height="10" fill="none" stroke="#f59e0b" strokeWidth="1" />
        <circle cx="70" cy="80" r="1.5" fill="#f59e0b" />
        <text x="56" y="58" fill="#f59e0b" fontSize="11" fontWeight="bold">{isEn ? 'h' : 'υ'}</text>
        <text x="25" y="55" fill="#a855f7" fontSize="10" fontWeight="bold">{isEn ? 's' : 'π'}</text>
      </svg>
    ),
    options: ensureFourUniqueOptions(q4Correct, () => [
      isEn ? 'The purple slanted side (s) of the shape' : 'Η μωβ πλάγια πλευρά (π) του σχήματος',
      isEn ? 'The top horizontal side of the parallelogram' : 'Η επάνω πλευρά του παραλληλογράμμου',
      isEn ? 'The diagonal of the shape' : 'Η διαγώνιος του σχήματος'
    ]),
    correctAnswer: q4Correct,
    tableData: [
      { label: isEn ? 'Yellow line (h)' : 'Κίτρινη γραμμή (υ)', value: isEn ? 'Perpendicular height (forms right angle with base)' : 'Κάθετο ύψος (σχηματίζει ορθή γωνία με τη βάση)' },
      { label: isEn ? 'Purple line (s)' : 'Μωβ πλευρά (π)', value: isEn ? 'Slanted side (not height)' : 'Πλάγια πλευρά (δεν είναι ύψος)' }
    ],
    explanation: isEn
      ? 'Height is strictly the perpendicular distance (the yellow dashed segment with the right-angle square).'
      : 'Το ύψος είναι πάντοτε η κάθετη απόσταση (η κίτρινη διακεκομμένη γραμμή με το τετραγωνάκι της ορθής γωνίας).'
  });

  // Q5: Υπολογισμός εμβαδού (Input αριθμού)
  const b5 = randInt(7, 14);
  const h5 = randInt(4, 9);
  const area5 = b5 * h5;
  qs.push({
    id: 5,
    type: 'input',
    title: isEn ? 'CALCULATING AREA IN CM²' : 'ΥΠΟΛΟΓΙΣΜΟΣ ΕΜΒΑΔΟΥ ΣΕ CM²',
    prompt: isEn
      ? `A parallelogram has a base of ${formatNum(b5, locale)} cm and a corresponding height of ${formatNum(h5, locale)} cm. How many cm² is its area? (Enter only the number)`
      : `Ένα παραλληλόγραμμο έχει βάση ${formatNum(b5, locale)} cm και αντίστοιχο ύψος ${formatNum(h5, locale)} cm. Πόσα cm² είναι το εμβαδόν του; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(area5),
    tableData: [
      { label: isEn ? 'Base (b)' : 'Βάση (β)', value: `${formatNum(b5, locale)} cm` },
      { label: isEn ? 'Height (h)' : 'Ύψος (υ)', value: `${formatNum(h5, locale)} cm` },
      {
        label: isEn ? 'Operation' : 'Πράξη',
        valueNode: <span>{formatNum(b5, locale)} · {formatNum(h5, locale)} ＝ {formatNum(area5, locale)} cm²</span>
      }
    ],
    explanation: `${isEn ? 'A ＝ b · h' : 'Ε ＝ β · υ'} ＝ ${formatNum(b5, locale)} · ${formatNum(h5, locale)} ＝ ${formatNum(area5, locale)} cm².`
  });

  // Q6: Εύρεση ύψους (Input αριθμού με κλασματική μορφή στο tableData)
  const area6 = 96;
  const b6 = 12;
  const h6 = area6 / b6;
  qs.push({
    id: 6,
    type: 'input',
    title: isEn ? 'FINDING HEIGHT FROM AREA' : 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΑΠΟ ΤΟ ΕΜΒΑΔΟΝ',
    prompt: isEn
      ? `The area of a parallelogram is ${formatNum(area6, locale)} m² and its base is ${formatNum(b6, locale)} m. How many meters (m) is its height? (Enter only the number)`
      : `Το εμβαδόν ενός παραλληλογράμμου είναι ${formatNum(area6, locale)} m² και η βάση του είναι ${formatNum(b6, locale)} m. Πόσα μέτρα (m) είναι το ύψος του; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(h6),
    tableData: [
      { label: isEn ? 'Area' : 'Εμβαδόν', value: `${formatNum(area6, locale)} m²` },
      { label: isEn ? 'Base' : 'Βάση', value: `${formatNum(b6, locale)} m` },
      {
        label: isEn ? 'Operation' : 'Πράξη',
        valueNode: (
          <span className="inline-flex items-center">
            <MathFraction num={formatNum(area6, locale)} den={formatNum(b6, locale)} />
            <span>＝ {formatNum(h6, locale)} m</span>
          </span>
        )
      }
    ],
    explanation: `${isEn ? 'h ＝ A : b' : 'υ ＝ Ε : β'} ＝ ${formatNum(area6, locale)} : ${formatNum(b6, locale)} ＝ ${formatNum(h6, locale)} m.`
  });

  // Q7: Μετατροπή dm² σε cm² (MCQ)
  const q7Correct = '100 cm²';
  qs.push({
    id: 7,
    type: 'mcq',
    title: isEn ? 'RELATION BETWEEN DM² AND CM²' : 'ΣΧΕΣΗ DM² ΚΑΙ CM²',
    prompt: isEn
      ? 'How many square centimeters (cm²) are contained in 1 square decimeter (1 dm²)?'
      : 'Πόσα τετραγωνικά εκατοστόμετρα (cm²) περιέχει 1 τετραγωνικό δεκατόμετρο (1 dm²);',
    options: ensureFourUniqueOptions(q7Correct, () => [
      '10 cm²',
      isEn ? '1,000 cm²' : '1.000 cm²',
      isEn ? '10,000 cm²' : '10.000 cm²'
    ]),
    correctAnswer: q7Correct,
    tableData: [
      { label: '1 dm', value: '10 cm' },
      {
        label: '1 dm²',
        valueNode: <span>10 cm · 10 cm ＝ 100 cm²</span>
      }
    ],
    explanation: '1 dm² ＝ 10 cm · 10 cm ＝ 100 cm².'
  });

  // Q8: Δύο βάσεις και δύο ύψη (MCQ)
  const q8Correct = isEn
    ? 'b₁ · h₁ ＝ b₂ · h₂ (area remains unchanged)'
    : 'β₁ · υ₁ ＝ β₂ · υ₂ (το εμβαδόν μένει ίδιο)';
  qs.push({
    id: 8,
    type: 'mcq',
    title: isEn ? 'TWO HEIGHTS EQUALITY' : 'ΣΧΕΣΗ ΔΥΟ ΥΨΩΝ',
    prompt: isEn
      ? 'If in a parallelogram we know the two different sides b₁ and b₂ and their corresponding heights h₁ and h₂, which relationship always holds true?'
      : 'Αν σε ένα παραλληλόγραμμο γνωρίζουμε τις δύο διαφορετικές πλευρές του β₁ και β₂ και τα αντίστοιχα ύψη τους υ₁ και υ₂, ποια σχέση ισχύει πάντοτε;',
    options: ensureFourUniqueOptions(q8Correct, () => [
      isEn ? 'b₁ · b₂ ＝ h₁ · h₂' : 'β₁ · β₂ ＝ υ₁ · υ₂',
      isEn ? 'b₁ ＋ h₁ ＝ b₂ ＋ h₂' : 'β₁ ＋ υ₁ ＝ β₂ ＋ υ₂',
      isEn ? 'h₁ ＝ h₂ always' : 'υ₁ ＝ υ₂ πάντοτε'
    ]),
    correctAnswer: q8Correct,
    tableData: [
      { label: isEn ? 'Area via 1st base' : 'Εμβαδόν με 1η βάση', value: isEn ? 'A ＝ b₁ · h₁' : 'Ε ＝ β₁ · υ₁' },
      { label: isEn ? 'Area via 2nd base' : 'Εμβαδόν με 2η βάση', value: isEn ? 'A ＝ b₂ · h₂' : 'Ε ＝ β₂ · υ₂' },
      { label: isEn ? 'Equality' : 'Ισότητα', value: isEn ? 'b₁ · h₁ ＝ b₂ · h₂' : 'β₁ · υ₁ ＝ β₂ · υ₂' }
    ],
    explanation: isEn
      ? 'The area of the figure is unique, so the product of any base with its corresponding height is identical.'
      : 'Το εμβαδόν του σχήματος είναι μοναδικό, επομένως το γινόμενο οποιασδήποτε βάσης με το αντίστοιχο ύψος της είναι ίσο.'
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

export default function EmbadonParallilogrammouAskiseisPage() {
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
          ? "Exercises: Area of a Parallelogram - 6th Grade | LearnMaths.gr"
          : "Ασκήσεις: Εμβαδόν Παραλληλογράμμου - ΣΤ' Δημοτικού | LearnMaths.gr"
      }
      description={
        isEn
          ? "Interactive exercises on calculating parallelogram area, finding base and height, and area unit conversions for 6th Grade Math."
          : "Διαδραστικές ασκήσεις στον υπολογισμό εμβαδού παραλληλογράμμου, εύρεση βάσης και ύψους και μετατροπές μονάδων επιφάνειας για τη ΣΤ' Δημοτικού."
      }
      backUrl="/st-dimotikou/73-embadon-parallilogrammou"
      backText={isEn ? "Chapter 73 Theory" : "Θεωρία Κεφ. 73"}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/73-embadon-parallilogrammou"
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
              <span>{isEn ? "EXERCISES • CHAPTER 73 • 6TH GRADE" : "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 73 • ΣΤ' ΔΗΜΟΤΙΚΟΥ"}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(isEn ? "Exercises: Parallelogram Area" : "Ασκησεις: Εμβαδον Παραλληλογραμμου")}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl break-words [overflow-wrap:anywhere]">
              {isEn
                ? "Practice calculating area using A ＝ b · h, finding unknown base or height, and converting surface units across 12 dynamic interactive exercises."
                : "Εξασκηθείτε στον υπολογισμό εμβαδού με τον τύπο Ε ＝ β · υ, στην εύρεση άγνωστης βάσης ή ύψους και στις μετατροπές μονάδων επιφάνειας μέσα από 12 δυναμικές ερωτήσεις."}
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
                            ? '✓ Great job! Correct answer.'
                            : '✓ Μπράβο! Σωστή απάντηση.'
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