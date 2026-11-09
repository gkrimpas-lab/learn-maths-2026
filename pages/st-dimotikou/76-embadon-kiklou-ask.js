// pages/st-dimotikou/76-embadon-kiklou-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// -------------------------------------------------------------
// DEFENSIVE UTILITY FUNCTIONS & TYPOGRAPHY
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
  const loc = locale === 'el' ? 'el-GR' : 'en-US';
  return Number(val).toLocaleString(loc, { maximumFractionDigits: 4 });
}

// Visual Fraction component: αριθμητής πάνω, κλασματική γραμμή, παρονομαστής κάτω
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-0.5 sm:mx-1 text-center font-mono leading-none text-[0.85em] sm:text-[0.9em] shrink-0 max-w-full ${className}`}>
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

  let offset = 6.28;
  while (optionsSet.size < 4) {
    const numPart = parseFloat(String(correctText).replace(/[^0-9.,]/g, '').replace(',', '.'));
    if (!isNaN(numPart)) {
      const unit = String(correctText).replace(/[0-9.,\s]/g, '');
      const fakeNum = (numPart + offset).toFixed(2).replace('.', ',');
      const fakeOpt = unit ? `${fakeNum} ${unit}` : `${fakeNum}`;
      optionsSet.add(fakeOpt);
      offset += 6.28;
    } else {
      optionsSet.add(`${correctText} · ${optionsSet.size}`);
    }
  }

  return shuffle([...optionsSet]);
}

// -------------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (POOLS) ΓΙΑ Q9, Q10, Q11, Q12
// -------------------------------------------------------------

// POOL ΓΙΑ Q9: Υπολογισμός Εμβαδού από Ακτίνα ή Διάμετρο (Ε ＝ π · ρ²)
const PROBLEM_POOL_Q9 = [
  // 1. Στρογγυλό τραπέζι με διάμετρο
  (locale) => {
    const isEl = locale === 'el';
    const r = randInt(2, 6);
    const d = 2 * r;
    const rSquared = r * r;
    const area = 3.14 * rSquared;
    const correct = `${formatNum(area, locale)} m²`;
    const rSym = isEl ? 'ρ' : 'r';
    const dSym = isEl ? 'δ' : 'd';
    return {
      title: isEl ? 'ΣΤΡΟΓΓΥΛΟ ΤΡΑΠΕΖΙ' : 'ROUND TABLE',
      prompt: isEl
        ? `Ένα στρογγυλό τραπέζι έχει διάμετρο ${formatNum(d, locale)} m. Πόσο είναι το εμβαδόν της επιφάνειάς του σε m²; (Χρησιμοποιήστε π ＝ 3,14)`
        : `A round table has a diameter of ${formatNum(d, locale)} m. What is the area of its surface in m²? (Use π ＝ 3.14)`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(3.14 * d * d, locale)} m²`,
        `${formatNum(2 * 3.14 * r, locale)} m²`,
        `${formatNum(area + 5.25, locale)} m²`,
        `${formatNum(area > 6 ? area - 6.28 : area + 12.56, locale)} m²`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? `Διάμετρος (${dSym})` : `Diameter (${dSym})`, value: `${formatNum(d, locale)} m` },
        {
          label: isEl ? `Ακτίνα (${rSym})` : `Radius (${rSym})`,
          valueNode: (
            <span className="inline-flex items-center">
              <span>{rSym} ＝ </span>
              <Fraction num={formatNum(d, locale)} den="2" />
              <span>＝ {formatNum(r, locale)} m</span>
            </span>
          )
        },
        {
          label: isEl ? 'Τετράγωνο ακτίνας' : 'Radius squared',
          valueNode: (
            <span>
              {rSym}<sup>2</sup> ＝ {formatNum(r, locale)} · {formatNum(r, locale)} ＝ {formatNum(rSquared, locale)} m²
            </span>
          )
        },
        {
          label: isEl ? 'Υπολογισμός Εμβαδού' : 'Area Calculation',
          valueNode: (
            <span>
              {isEl ? 'Ε' : 'A'} ＝ {isEl ? '3,14' : '3.14'} · {formatNum(rSquared, locale)} ＝ {formatNum(area, locale)} m²
            </span>
          )
        }
      ],
      explanation: isEl
        ? `Βρίσκουμε πρώτα την ακτίνα: ${rSym} ＝ ${d} : 2 ＝ ${r} m. Εμβαδόν: Ε ＝ π · ${rSym}² ＝ 3,14 · ${r} · ${r} ＝ ${formatNum(area, locale)} m².`
        : `First find the radius: ${rSym} ＝ ${d} : 2 ＝ ${r} m. Area: A ＝ π · ${rSym}² ＝ 3.14 · ${r} · ${r} ＝ ${formatNum(area, locale)} m².`
    };
  },
  // 2. Κυκλικό σιντριβάνι με ακτίνα
  (locale) => {
    const isEl = locale === 'el';
    const r = randInt(3, 8);
    const rSquared = r * r;
    const area = 3.14 * rSquared;
    const correct = `${formatNum(area, locale)} m²`;
    const rSym = isEl ? 'ρ' : 'r';
    return {
      title: isEl ? 'ΚΥΚΛΙΚΟ ΣΙΝΤΡΙΒΑΝΙ' : 'CIRCULAR FOUNTAIN',
      prompt: isEl
        ? `Ένα κυκλικό σιντριβάνι έχει ακτίνα ${formatNum(r, locale)} m. Ποια είναι η επιφάνεια που καταλαμβάνει στην πλατεία; (π ＝ 3,14)`
        : `A circular fountain has a radius of ${formatNum(r, locale)} m. What is the surface area it occupies in the square? (π ＝ 3.14)`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(2 * 3.14 * r, locale)} m²`,
        `${formatNum(area + 12.56, locale)} m²`,
        `${formatNum(area > 15 ? area - 12.56 : area + 25.12, locale)} m²`,
        `${formatNum(area / 2, locale)} m²`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? `Ακτίνα (${rSym})` : `Radius (${rSym})`, value: `${formatNum(r, locale)} m` },
        {
          label: isEl ? 'Τετράγωνο ακτίνας' : 'Radius squared',
          valueNode: (
            <span>
              {rSym}<sup>2</sup> ＝ {formatNum(r, locale)} · {formatNum(r, locale)} ＝ {formatNum(rSquared, locale)}
            </span>
          )
        },
        {
          label: isEl ? 'Εμβαδόν' : 'Area',
          valueNode: (
            <span>
              {isEl ? '3,14' : '3.14'} · {formatNum(rSquared, locale)} ＝ {formatNum(area, locale)} m²
            </span>
          )
        }
      ],
      explanation: isEl
        ? `Ε ＝ π · ${rSym}² ＝ 3,14 · ${r} · ${r} ＝ ${formatNum(area, locale)} m².`
        : `A ＝ π · ${rSym}² ＝ 3.14 · ${r} · ${r} ＝ ${formatNum(area, locale)} m².`
    };
  },
  // 3. Στρογγυλό ρολόι τοίχου
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(314, locale)} cm²`;
    const rSym = isEl ? 'ρ' : 'r';
    return {
      title: isEl ? 'ΡΟΛΟΙ ΤΟΙΧΟΥ' : 'WALL CLOCK',
      prompt: isEl
        ? 'Ένα στρογγυλό ρολόι τοίχου έχει ακτίνα 10 cm. Πόσο είναι το εμβαδόν του καντράν του; (π ＝ 3,14)'
        : 'A circular wall clock has a radius of 10 cm. What is the area of its face? (π ＝ 3.14)',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(62.8, locale)} cm²`,
        `${formatNum(31.4, locale)} cm²`,
        `${formatNum(628, locale)} cm²`,
        `${formatNum(157, locale)} cm²`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? `Ακτίνα (${rSym})` : `Radius (${rSym})`, value: '10 cm' },
        {
          label: isEl ? 'Τετράγωνο ακτίνας' : 'Radius squared',
          valueNode: (
            <span>
              {rSym}<sup>2</sup> ＝ 10 · 10 ＝ 100 cm²
            </span>
          )
        },
        {
          label: isEl ? 'Υπολογισμός' : 'Calculation',
          valueNode: (
            <span>
              {isEl ? '3,14' : '3.14'} · 100 ＝ {formatNum(314, locale)} cm²
            </span>
          )
        }
      ],
      explanation: isEl
        ? 'Ε ＝ 3,14 · 10 · 10 ＝ 3,14 · 100 ＝ 314 cm².'
        : 'A ＝ 3.14 · 10 · 10 ＝ 3.14 · 100 ＝ 314 cm².'
    };
  },
  // 4. Κυκλική πίτσα
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(706.5, locale)} cm²`;
    const rSym = isEl ? 'ρ' : 'r';
    const dSym = isEl ? 'δ' : 'd';
    return {
      title: isEl ? 'ΕΠΙΦΑΝΕΙΑ ΠΙΤΣΑΣ' : 'PIZZA SURFACE',
      prompt: isEl
        ? 'Μια οικογενειακή πίτσα έχει διάμετρο 30 cm. Πόσο είναι το εμβαδόν της επιφάνειάς της; (π ＝ 3,14)'
        : 'A large pizza has a diameter of 30 cm. What is its surface area? (π ＝ 3.14)',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(2826, locale)} cm²`,
        `${formatNum(94.2, locale)} cm²`,
        `${formatNum(353.25, locale)} cm²`,
        `${formatNum(450, locale)} cm²`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? `Διάμετρος (${dSym})` : `Diameter (${dSym})`, value: '30 cm' },
        {
          label: isEl ? `Ακτίνα (${rSym})` : `Radius (${rSym})`,
          valueNode: (
            <span className="inline-flex items-center">
              <span>{rSym} ＝ </span>
              <Fraction num="30" den="2" />
              <span>＝ 15 cm</span>
            </span>
          )
        },
        {
          label: isEl ? 'Πράξη' : 'Calculation',
          valueNode: (
            <span>
              {isEl ? '3,14' : '3.14'} · 15 · 15 ＝ {isEl ? '3,14' : '3.14'} · 225 ＝ {formatNum(706.5, locale)} cm²
            </span>
          )
        }
      ],
      explanation: isEl
        ? 'Ακτίνα: ρ ＝ 30 : 2 ＝ 15 cm. Ε ＝ 3,14 · 15 · 15 ＝ 706,5 cm².'
        : 'Radius: r ＝ 30 : 2 ＝ 15 cm. A ＝ 3.14 · 15 · 15 ＝ 706.5 cm².'
    };
  }
];

// POOL ΓΙΑ Q10: Ημικύκλιο και Τέταρτο Κύκλου
const PROBLEM_POOL_Q10 = [
  // 1. Ημικύκλιο με δοσμένη ακτίνα
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(157, locale)} cm²`;
    const rSym = isEl ? 'ρ' : 'r';
    return {
      title: isEl ? 'ΕΜΒΑΔΟΝ ΗΜΙΚΥΚΛΙΟΥ' : 'SEMICIRCLE AREA',
      prompt: isEl
        ? 'Μια διακοσμητική βεντάλια έχει σχήμα ημικυκλίου με ακτίνα 10 cm. Πόσο είναι το εμβαδόν της επιφάνειάς της; (π ＝ 3,14)'
        : 'A decorative fan is semicircular with a radius of 10 cm. What is its surface area? (π ＝ 3.14)',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(314, locale)} cm²`,
        `${formatNum(62.8, locale)} cm²`,
        `${formatNum(78.5, locale)} cm²`,
        `${formatNum(100, locale)} cm²`
      ]),
      correctAnswer: correct,
      tableData: [
        {
          label: isEl ? 'Εμβαδόν ολόκληρου κύκλου' : 'Full circle area',
          valueNode: (
            <span>
              {isEl ? '3,14' : '3.14'} · 10 · 10 ＝ {formatNum(314, locale)} cm²
            </span>
          )
        },
        {
          label: isEl ? 'Εμβαδόν ημικυκλίου' : 'Semicircle area',
          valueNode: (
            <span className="inline-flex items-center">
              <Fraction num="314" den="2" />
              <span>＝ {formatNum(157, locale)} cm²</span>
            </span>
          )
        }
      ],
      explanation: isEl
        ? `Το ημικύκλιο είναι το μισό του κύκλου: (3,14 · 10 · 10) : 2 ＝ 314 : 2 ＝ 157 cm².`
        : `The semicircle is half the circle: (3.14 · 10 · 10) : 2 ＝ 314 : 2 ＝ 157 cm².`
    };
  },
  // 2. Ημικυκλική σήραγγα
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(56.52, locale)} m²`;
    const rSym = isEl ? 'ρ' : 'r';
    const dSym = isEl ? 'δ' : 'd';
    return {
      title: isEl ? 'ΗΜΙΚΥΚΛΙΚΗ ΣΗΡΑΓΓΑ' : 'SEMICIRCULAR TUNNEL',
      prompt: isEl
        ? 'Το άνοιγμα μιας σήραγγας έχει σχήμα ημικυκλίου με διάμετρο 12 m. Πόσο είναι το εμβαδόν του ανοίγματος; (π ＝ 3,14)'
        : 'A tunnel entrance is semicircular with a diameter of 12 m. What is the entrance area? (π ＝ 3.14)',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(113.04, locale)} m²`,
        `${formatNum(226.08, locale)} m²`,
        `${formatNum(37.68, locale)} m²`,
        `${formatNum(72, locale)} m²`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? `Διάμετρος (${dSym})` : `Diameter (${dSym})`, value: '12 m' },
        {
          label: isEl ? `Ακτίνα (${rSym})` : `Radius (${rSym})`,
          valueNode: (
            <span className="inline-flex items-center">
              <span>{rSym} ＝ </span>
              <Fraction num="12" den="2" />
              <span>＝ 6 m</span>
            </span>
          )
        },
        {
          label: isEl ? 'Εμβαδόν ημικυκλίου' : 'Semicircle area',
          valueNode: (
            <span className="inline-flex flex-wrap items-center gap-1">
              <Fraction num={`${isEl ? '3,14' : '3.14'} · 6 · 6`} den="2" />
              <span>＝</span>
              <Fraction num="113,04" den="2" />
              <span>＝ {formatNum(56.52, locale)} m²</span>
            </span>
          )
        }
      ],
      explanation: isEl
        ? 'ρ ＝ 6 m. Εημικ ＝ (3,14 · 36) : 2 ＝ 56,52 m².'
        : 'r ＝ 6 m. Asemi ＝ (3.14 · 36) : 2 ＝ 56.52 m².'
    };
  },
  // 3. Τέταρτο του κύκλου
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(314, locale)} cm²`;
    const num1256 = isEl ? '1.256' : '1,256';
    return {
      title: isEl ? 'ΤΕΤΑΡΤΟ ΚΥΚΛΟΥ' : 'CIRCLE QUADRANT',
      promptNode: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>{isEl ? 'Ένα κομμάτι πίτας αποτελεί το ένα τέταρτο (' : 'A pie slice forms one fourth ('}</span>
          <Fraction num="1" den="4" />
          <span>{isEl ? ') ενός κυκλικού δίσκου με ακτίνα 20 cm. Πόσο είναι το εμβαδόν του κομματιού; (π ＝ 3,14)' : ') of a circular disk with radius 20 cm. What is the area of the slice? (π ＝ 3.14)'}</span>
        </span>
      ),
      prompt: isEl
        ? 'Ένα κομμάτι πίτας αποτελεί το ένα τέταρτο (1/4) ενός κυκλικού δίσκου με ακτίνα 20 cm. Πόσο είναι το εμβαδόν του κομματιού; (π ＝ 3,14)'
        : 'A pie slice forms one fourth (1/4) of a circular disk with radius 20 cm. What is the area of the slice? (π ＝ 3.14)',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(628, locale)} cm²`,
        `${formatNum(157, locale)} cm²`,
        `${formatNum(1256, locale)} cm²`,
        `${formatNum(31.4, locale)} cm²`
      ]),
      correctAnswer: correct,
      tableData: [
        {
          label: isEl ? 'Ολόκληρος κύκλος' : 'Full circle',
          valueNode: (
            <span>
              {isEl ? '3,14' : '3.14'} · 20 · 20 ＝ {formatNum(1256, locale)} cm²
            </span>
          )
        },
        {
          label: isEl ? 'Τέταρτο κύκλου' : 'Quadrant',
          valueNode: (
            <span className="inline-flex items-center">
              <Fraction num={num1256} den="4" />
              <span>＝ {formatNum(314, locale)} cm²</span>
            </span>
          )
        }
      ],
      explanation: isEl
        ? '(3,14 · 20 · 20) : 4 ＝ 1.256 : 4 ＝ 314 cm².'
        : '(3.14 · 20 · 20) : 4 ＝ 1,256 : 4 ＝ 314 cm².'
    };
  }
];

// POOL ΓΙΑ Q11: Κυκλικός Δακτύλιος (Ροδέλα / Διάδρομος γύρω από Κύκλο)
const PROBLEM_POOL_Q11 = [
  // 1. Διάδρομος γύρω από πισίνα
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(50.24, locale)} m²`;
    const rSym = isEl ? 'ρ' : 'r';
    return {
      title: isEl ? 'ΔΙΑΔΡΟΜΟΣ ΓΥΡΩ ΑΠΟ ΠΙΣΙΝΑ' : 'WALKWAY AROUND POOL',
      prompt: isEl
        ? 'Γύρω από μια κυκλική πισίνα ακτίνας 3 m κατασκευάζεται διάδρομος, ώστε ο εξωτερικός κύκλος να έχει ακτίνα 5 m. Πόσο είναι το εμβαδόν μόνο του διαδρόμου; (π ＝ 3,14)'
        : 'Around a circular pool with radius 3 m, a walkway is paved so the outer circle has radius 5 m. What is the walkway area alone? (π ＝ 3.14)',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(78.5, locale)} m²`,
        `${formatNum(28.26, locale)} m²`,
        `${formatNum(106.76, locale)} m²`,
        `${formatNum(12.56, locale)} m²`
      ]),
      correctAnswer: correct,
      tableData: [
        {
          label: isEl ? `Εμβαδόν μεγάλου κύκλου (${rSym} ＝ 5)` : `Outer circle area (${rSym} ＝ 5)`,
          valueNode: (
            <span>
              {isEl ? '3,14' : '3.14'} · 5 · 5 ＝ {formatNum(78.5, locale)} m²
            </span>
          )
        },
        {
          label: isEl ? `Εμβαδόν πισίνας (${rSym} ＝ 3)` : `Pool area (${rSym} ＝ 3)`,
          valueNode: (
            <span>
              {isEl ? '3,14' : '3.14'} · 3 · 3 ＝ {formatNum(28.26, locale)} m²
            </span>
          )
        },
        {
          label: isEl ? 'Εμβαδόν διαδρόμου (αφαίρεση)' : 'Walkway area (subtraction)',
          valueNode: (
            <span>
              {formatNum(78.5, locale)} － {formatNum(28.26, locale)} ＝ {formatNum(50.24, locale)} m²
            </span>
          )
        }
      ],
      explanation: isEl
        ? 'Αφαιρούμε το εμβαδόν του εσωτερικού κύκλου από το εμβαδόν του εξωτερικού: 78,5 － 28,26 ＝ 50,24 m².'
        : 'Subtract the inner circle area from the outer circle area: 78.5 － 28.26 ＝ 50.24 m².'
    };
  },
  // 2. Μεταλλική ροδέλα
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(200.96, locale)} cm²`;
    const rSym = isEl ? 'ρ' : 'r';
    return {
      title: isEl ? 'ΜΕΤΑΛΛΙΚΗ ΡΟΔΕΛΑ' : 'METAL WASHER',
      prompt: isEl
        ? 'Μια μεταλλική ροδέλα έχει εξωτερική ακτίνα 10 cm και μία κυκλική τρύπα στο κέντρο με ακτίνα 6 cm. Πόσο είναι το εμβαδόν της μεταλλικής επιφάνειας; (π ＝ 3,14)'
        : 'A metal washer has an outer radius of 10 cm and a central hole of radius 6 cm. What is the area of the metal surface? (π ＝ 3.14)',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(314, locale)} cm²`,
        `${formatNum(113.04, locale)} cm²`,
        `${formatNum(50.24, locale)} cm²`,
        `${formatNum(250, locale)} cm²`
      ]),
      correctAnswer: correct,
      tableData: [
        {
          label: isEl ? `Εξωτερικός κύκλος (${rSym} ＝ 10)` : `Outer circle (${rSym} ＝ 10)`,
          valueNode: (
            <span>
              {isEl ? '3,14' : '3.14'} · 10 · 10 ＝ {formatNum(314, locale)} cm²
            </span>
          )
        },
        {
          label: isEl ? `Εσωτερική τρύπα (${rSym} ＝ 6)` : `Inner hole (${rSym} ＝ 6)`,
          valueNode: (
            <span>
              {isEl ? '3,14' : '3.14'} · 6 · 6 ＝ {formatNum(113.04, locale)} cm²
            </span>
          )
        },
        {
          label: isEl ? 'Επιφάνεια ροδέλας' : 'Washer surface',
          valueNode: (
            <span>
              {formatNum(314, locale)} － {formatNum(113.04, locale)} ＝ {formatNum(200.96, locale)} cm²
            </span>
          )
        }
      ],
      explanation: isEl
        ? '314 － 113,04 ＝ 200,96 cm².'
        : '314 － 113.04 ＝ 200.96 cm².'
    };
  },
  // 3. Στίβος τρεξίματος
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(1570, locale)} m²`;
    const rSym = isEl ? 'ρ' : 'r';
    return {
      title: isEl ? 'ΚΥΚΛΙΚΟΣ ΣΤΙΒΟΣ' : 'RUNNING TRACK',
      prompt: isEl
        ? 'Ένας κυκλικός στίβος έχει εσωτερική ακτίνα 20 m και εξωτερική ακτίνα 30 m. Πόσο είναι το εμβαδόν της ζώνης του στίβου; (π ＝ 3,14)'
        : 'A circular track has an inner radius of 20 m and an outer radius of 30 m. What is the area of the track ring? (π ＝ 3.14)',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(2826, locale)} m²`,
        `${formatNum(1256, locale)} m²`,
        `${formatNum(3140, locale)} m²`,
        `${formatNum(1000, locale)} m²`
      ]),
      correctAnswer: correct,
      tableData: [
        {
          label: isEl ? `Μεγάλος κύκλος (${rSym} ＝ 30)` : `Outer circle (${rSym} ＝ 30)`,
          valueNode: (
            <span>
              {isEl ? '3,14' : '3.14'} · 30 · 30 ＝ {formatNum(2826, locale)} m²
            </span>
          )
        },
        {
          label: isEl ? `Μικρός κύκλος (${rSym} ＝ 20)` : `Inner circle (${rSym} ＝ 20)`,
          valueNode: (
            <span>
              {isEl ? '3,14' : '3.14'} · 20 · 20 ＝ {formatNum(1256, locale)} m²
            </span>
          )
        },
        {
          label: isEl ? 'Δακτύλιος' : 'Annulus',
          valueNode: (
            <span>
              {formatNum(2826, locale)} － {formatNum(1256, locale)} ＝ {formatNum(1570, locale)} m²
            </span>
          )
        }
      ],
      explanation: isEl
        ? '2.826 － 1.256 ＝ 1.570 m².'
        : '2,826 － 1,256 ＝ 1,570 m².'
    };
  }
];

// POOL ΓΙΑ Q12: Σύγκριση Σχημάτων & Μεταβολή Ακτίνας ρ
const PROBLEM_POOL_Q12 = [
  // 1. Διπλασιασμός ακτίνας
  (locale) => {
    const isEl = locale === 'el';
    const correct = isEl ? '4 φορές μεγαλύτερο (τετραπλασιάζεται)' : '4 times larger (quadruples)';
    const rSym = isEl ? 'ρ' : 'r';
    return {
      title: isEl ? 'ΔΙΠΛΑΣΙΑΣΜΟΣ ΑΚΤΙΝΑΣ' : 'DOUBLING RADIUS',
      prompt: isEl
        ? `Αν διπλασιάσουμε την ακτίνα ενός κύκλου (από ${rSym} σε 2${rSym}), πόσες φορές μεγαλύτερο θα γίνει το εμβαδόν του;`
        : `If we double the radius of a circle (from ${rSym} to 2${rSym}), how many times larger does its area become?`,
      options: ensureFourUniqueOptions(correct, () => [
        isEl ? '2 φορές μεγαλύτερο (διπλασιάζεται)' : '2 times larger (doubles)',
        isEl ? '8 φορές μεγαλύτερο' : '8 times larger',
        isEl ? 'Παραμένει το ίδιο' : 'Remains unchanged'
      ]),
      correctAnswer: correct,
      tableData: [
        {
          label: isEl ? 'Αρχικό εμβαδόν' : 'Initial area',
          valueNode: (
            <span>
              {isEl ? 'Ε₁' : 'A₁'} ＝ π · {rSym}<sup>2</sup>
            </span>
          )
        },
        {
          label: isEl ? 'Νέο εμβαδόν' : 'New area',
          valueNode: (
            <span>
              {isEl ? 'Ε₂' : 'A₂'} ＝ π · (2{rSym})<sup>2</sup> ＝ π · 4{rSym}<sup>2</sup> ＝ 4 · {isEl ? 'Ε₁' : 'A₁'}
            </span>
          )
        }
      ],
      explanation: isEl
        ? `Επειδή η ακτίνα υψώνεται στο τετράγωνο (${rSym}²), ο διπλασιασμός της ακτίνας τετραπλασιάζει το εμβαδόν: 2 · 2 ＝ 4 φορές μεγαλύτερο.`
        : `Because radius is squared (${rSym}²), doubling the radius quadruples the area: 2 · 2 ＝ 4 times larger.`
    };
  },
  // 2. Τριπλασιασμός ακτίνας
  (locale) => {
    const isEl = locale === 'el';
    const correct = isEl ? '9 φορές μεγαλύτερο' : '9 times larger';
    return {
      title: isEl ? 'ΤΡΙΠΛΑΣΙΑΣΜΟΣ ΑΚΤΙΝΑΣ' : 'TRIPLING RADIUS',
      prompt: isEl
        ? 'Αν τριπλασιάσουμε την ακτίνα ενός κύκλου, πόσες φορές μεγαλύτερο θα γίνει το εμβαδόν του;'
        : 'If we triple the radius of a circle, how many times larger does its area become?',
      options: ensureFourUniqueOptions(correct, () => [
        isEl ? '3 φορές μεγαλύτερο' : '3 times larger',
        isEl ? '6 φορές μεγαλύτερο' : '6 times larger',
        isEl ? '27 φορές μεγαλύτερο' : '27 times larger'
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Συντελεστής ακτίνας' : 'Radius factor', value: '3' },
        {
          label: isEl ? 'Συντελεστής εμβαδού' : 'Area factor',
          valueNode: <span>3 · 3 ＝ {isEl ? '9 φορές μεγαλύτερο' : '9 times larger'}</span>
        }
      ],
      explanation: isEl
        ? '3 · 3 ＝ 9 φορές μεγαλύτερο.'
        : '3 · 3 ＝ 9 times larger.'
    };
  },
  // 3. Κύκλος εγγεγραμμένος σε τετράγωνο
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(21.5, locale)} cm²`;
    const rSym = isEl ? 'ρ' : 'r';
    return {
      title: isEl ? 'ΚΥΚΛΟΣ ΜΕΣΑ ΣΕ ΤΕΤΡΑΓΩΝΟ' : 'CIRCLE IN SQUARE',
      prompt: isEl
        ? `Μέσα σε ένα τετράγωνο πλευράς 10 cm σχεδιάζουμε τον μεγαλύτερο δυνατό κύκλο (διάμετρος 10 cm, ακτίνα ${rSym} ＝ 5 cm). Πόσο εμβαδόν μένει έξω από τον κύκλο (στις 4 γωνίες); (π ＝ 3,14)`
        : `Inside a square of side 10 cm we draw the largest possible circle (diameter 10 cm, radius ${rSym} ＝ 5 cm). How much area remains outside the circle (in the 4 corners)? (π ＝ 3.14)`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(78.5, locale)} cm²`,
        `${formatNum(100, locale)} cm²`,
        `${formatNum(31.4, locale)} cm²`,
        `${formatNum(15, locale)} cm²`
      ]),
      correctAnswer: correct,
      tableData: [
        {
          label: isEl ? 'Εμβαδόν τετραγώνου' : 'Square area',
          valueNode: <span>10 · 10 ＝ 100 cm²</span>
        },
        {
          label: isEl ? `Εμβαδόν κύκλου (${rSym} ＝ 5)` : `Circle area (${rSym} ＝ 5)`,
          valueNode: (
            <span>
              {isEl ? '3,14' : '3.14'} · 25 ＝ {formatNum(78.5, locale)} cm²
            </span>
          )
        },
        {
          label: isEl ? 'Εμβαδόν που περισσεύει' : 'Remaining area',
          valueNode: (
            <span>
              100 － {formatNum(78.5, locale)} ＝ {formatNum(21.5, locale)} cm²
            </span>
          )
        }
      ],
      explanation: isEl
        ? '100 － 78,5 ＝ 21,5 cm².'
        : '100 － 78.5 ＝ 21.5 cm².'
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 12 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet(locale = 'el') {
  const isEl = locale === 'el';
  const rSym = isEl ? 'ρ' : 'r';
  const dSym = isEl ? 'δ' : 'd';
  const qs = [];

  // Q1: Τύπος εμβαδού κύκλου (Boolean)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: isEl ? 'ΤΥΠΟΣ ΕΜΒΑΔΟΥ ΚΥΚΛΟΥ' : 'CIRCLE AREA FORMULA',
    prompt: isEl
      ? (isQ1True
          ? `Το εμβαδόν του κύκλου υπολογίζεται με τον τύπο Ε ＝ π · ${rSym}², δηλαδή 3,14 επί την ακτίνα επί την ακτίνα.`
          : `Το εμβαδόν του κύκλου υπολογίζεται πολλαπλασιάζοντας την ακτίνα επί 2 και μετά επί 3,14: Ε ＝ 2 · π · ${rSym}.`)
      : (isQ1True
          ? `The area of a circle is calculated with the formula A ＝ π · ${rSym}², which means 3.14 times radius times radius.`
          : `The area of a circle is calculated by multiplying radius times 2 and then by 3.14: A ＝ 2 · π · ${rSym}.`),
    correctAnswer: isQ1True,
    tableData: [
      {
        label: isEl ? 'Τύπος Εμβαδού' : 'Area Formula',
        valueNode: (
          <span>
            {isEl ? 'Ε' : 'A'} ＝ π · {rSym}<sup>2</sup> ({isEl ? 'επιφάνεια' : 'surface'})
          </span>
        )
      },
      {
        label: isEl ? 'Τύπος Περιφέρειας' : 'Circumference Formula',
        valueNode: (
          <span>
            L ＝ 2 · π · {rSym} ({isEl ? 'μήκος γραμμής' : 'outline length'})
          </span>
        )
      }
    ],
    explanation: isEl
      ? (isQ1True
          ? `Το εμβαδόν του κύκλου είναι πάντοτε Ε ＝ π · ${rSym}² (3,14 · ${rSym} · ${rSym}).`
          : `Ο τύπος 2 · π · ${rSym} δίνει το μήκος της περιφέρειας (περίμετρο). Το εμβαδόν δίνεται από τον τύπο Ε ＝ π · ${rSym}².`)
      : (isQ1True
          ? `The area of a circle is always A ＝ π · ${rSym}² (3.14 · ${rSym} · ${rSym}).`
          : `The formula 2 · π · ${rSym} gives circumference (perimeter). Area is given by A ＝ π · ${rSym}².`)
  });

  // Q2: Τι σημαίνει ρ² / r² (MCQ)
  const q2Correct = isEl
    ? `Η ακτίνα πολλαπλασιασμένη με τον εαυτό της: ${rSym} · ${rSym}`
    : `The radius multiplied by itself: ${rSym} · ${rSym}`;
  qs.push({
    id: 2,
    type: 'mcq',
    title: isEl ? `Η ΕΝΝΟΙΑ ΤΟΥ ${toCleanUppercase(rSym)}²` : `THE MEANING OF ${rSym.toUpperCase()}²`,
    prompt: isEl
      ? `Τι σημαίνει το σύμβολο ${rSym}² στον τύπο του εμβαδού κύκλου;`
      : `What does the symbol ${rSym}² represent in the circle area formula?`,
    options: ensureFourUniqueOptions(q2Correct, () => [
      isEl ? `Η ακτίνα πολλαπλασιασμένη επί 2: ${rSym} · 2` : `The radius multiplied by 2: ${rSym} · 2`,
      isEl ? 'Η διάμετρος του κύκλου' : 'The diameter of the circle',
      isEl ? `Η ακτίνα συν 2: ${rSym} ＋ 2` : `The radius plus 2: ${rSym} ＋ 2`
    ]),
    correctAnswer: q2Correct,
    tableData: [
      {
        label: isEl ? 'Τετράγωνο ακτίνας' : 'Radius squared',
        valueNode: (
          <span>
            {rSym}<sup>2</sup> ＝ {rSym} · {rSym}
          </span>
        )
      },
      {
        label: isEl ? 'Σύνηθες λάθος' : 'Common pitfall',
        value: `${rSym} · 2 (${isEl ? `αυτό είναι η διάμετρος ${dSym}` : `that is diameter ${dSym}`})`
      }
    ],
    explanation: isEl
      ? `Το ${rSym}² είναι δύναμη και σημαίνει ${rSym} · ${rSym} (π.χ. αν ${rSym} ＝ 5, τότε ${rSym}² ＝ 5 · 5 ＝ 25).`
      : `${rSym}² is an exponent and means ${rSym} · ${rSym} (e.g., if ${rSym} ＝ 5, then ${rSym}² ＝ 5 · 5 ＝ 25).`
  });

  // Q3: Σχέση διαμέτρου και ακτίνας (MCQ)
  const q3Correct = isEl
    ? `Να διαιρέσουμε τη διάμετρο με το 2 για να βρούμε την ακτίνα (${rSym} ＝ ${dSym} : 2)`
    : `Divide diameter by 2 to find radius (${rSym} ＝ ${dSym} : 2)`;
  qs.push({
    id: 3,
    type: 'mcq',
    title: isEl ? 'ΥΠΟΛΟΓΙΣΜΟΣ ΑΠΟ ΤΗ ΔΙΑΜΕΤΡΟ' : 'CALCULATION FROM DIAMETER',
    prompt: isEl
      ? `Αν σε ένα πρόβλημα γνωρίζουμε τη διάμετρο (${dSym}) ενός κύκλου, τι πρέπει να κάνουμε πρώτα για να βρούμε το εμβαδόν;`
      : `If a problem gives the diameter (${dSym}) of a circle, what must we do first to find its area?`,
    options: ensureFourUniqueOptions(q3Correct, () => [
      isEl ? `Να βάλουμε απευθείας τη διάμετρο στον τύπο: 3,14 · ${dSym} · ${dSym}` : `Plug diameter directly into formula: 3.14 · ${dSym} · ${dSym}`,
      isEl ? 'Να πολλαπλασιάσουμε τη διάμετρο με το 2' : 'Multiply diameter by 2',
      isEl ? 'Δεν μπορούμε να βρούμε το εμβαδόν από τη διάμετρο' : 'Cannot compute area from diameter'
    ]),
    correctAnswer: q3Correct,
    tableData: [
      {
        label: isEl ? 'Σχέση' : 'Relation',
        valueNode: (
          <span className="inline-flex items-center">
            <span>{dSym} ＝ 2 · {rSym}, {isEl ? 'άρα' : 'so'} {rSym} ＝ </span>
            <Fraction num={dSym} den="2" />
          </span>
        )
      },
      {
        label: isEl ? 'Βήμα υπολογισμού' : 'Procedure',
        valueNode: (
          <span>
            {isEl ? `Πρώτα βρίσκουμε την ακτίνα ${rSym} και μετά υπολογίζουμε το π · ` : `First compute radius ${rSym}, then calculate π · `}
            {rSym}<sup>2</sup>
          </span>
        )
      }
    ],
    explanation: isEl
      ? `Ο τύπος του εμβαδού απαιτεί την ακτίνα (${rSym}), επομένως διαιρούμε πάντοτε πρώτα τη διάμετρο διά 2.`
      : `The area formula requires radius (${rSym}), so we always divide diameter by 2 first.`
  });

  // Q4: Οπτική αναγνώριση ακτίνας ρ (SVG - No Giveaway)
  const q4Correct = isEl
    ? `Την κίτρινη ακτίνα (${rSym}) από το κέντρο προς την περιφέρεια`
    : `The yellow radius (${rSym}) from center to circumference`;
  qs.push({
    id: 4,
    type: 'mcq',
    title: isEl ? 'ΑΝΑΓΝΩΡΙΣΗ ΣΤΟΙΧΕΙΩΝ ΚΥΚΛΟΥ' : 'CIRCLE ELEMENTS IDENTIFICATION',
    prompt: isEl
      ? 'Παρατηρήστε τον παρακάτω κύκλο. Ποιο ευθύγραμμο τμήμα πρέπει να υψώσουμε στο τετράγωνο για να υπολογίσουμε το εμβαδόν του;'
      : 'Look at the circle below. Which line segment must be squared to calculate its area?',
    svg: (
      <svg viewBox="0 0 160 120" className="w-full max-w-[160px] h-auto mx-auto my-2 select-none drop-shadow-sm">
        <circle cx="80" cy="60" r="45" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
        <line x1="80" y1="60" x2="125" y2="60" stroke="#f59e0b" strokeWidth="2.5" />
        <circle cx="80" cy="60" r="3" fill="#ffffff" />
        <text x="102" y="52" fill="#f59e0b" fontSize="11" fontWeight="bold">{rSym}</text>
      </svg>
    ),
    options: ensureFourUniqueOptions(q4Correct, () => [
      isEl ? 'Ολόκληρη τη διάμετρο του κύκλου' : 'The entire circle diameter',
      isEl ? 'Το μήκος της περιφέρειας' : 'The circumference length',
      isEl ? 'Οποιοδήποτε σημείο του κύκλου' : 'Any point on the circle'
    ]),
    correctAnswer: q4Correct,
    tableData: [
      { label: isEl ? `Κίτρινο τμήμα (${rSym})` : `Yellow segment (${rSym})`, value: isEl ? 'Ακτίνα του κύκλου' : 'Radius of the circle' },
      {
        label: isEl ? 'Τύπος εμβαδού' : 'Area formula',
        valueNode: (
          <span>
            {isEl ? 'Ε' : 'A'} ＝ π · {rSym}<sup>2</sup>
          </span>
        )
      }
    ],
    explanation: isEl
      ? `Για το εμβαδόν υψώνουμε στο τετράγωνο την ακτίνα (${rSym}).`
      : `For area, we square the radius (${rSym}).`
  });

  // Q5: Υπολογισμός εμβαδού με ρ = 10 (Input)
  qs.push({
    id: 5,
    type: 'input',
    title: isEl ? `ΥΠΟΛΟΓΙΣΜΟΣ ΕΜΒΑΔΟΥ ΜΕ ${toCleanUppercase(rSym)} ＝ 10 CM` : `AREA CALCULATION WITH ${rSym.toUpperCase()} ＝ 10 CM`,
    prompt: isEl
      ? `Ένας κύκλος έχει ακτίνα ${rSym} ＝ 10 cm. Πόσα cm² είναι το εμβαδόν του; (Χρησιμοποιήστε π ＝ 3,14 - Γράψτε μόνο τον αριθμό)`
      : `A circle has radius ${rSym} ＝ 10 cm. What is its area in cm²? (Use π ＝ 3.14 - Enter number only)`,
    correctAnswer: '314',
    tableData: [
      { label: isEl ? `Ακτίνα (${rSym})` : `Radius (${rSym})`, value: '10 cm' },
      {
        label: isEl ? 'Τετράγωνο ακτίνας' : 'Radius squared',
        valueNode: (
          <span>
            {rSym}<sup>2</sup> ＝ 10 · 10 ＝ 100 cm²
          </span>
        )
      },
      {
        label: isEl ? 'Υπολογισμός' : 'Calculation',
        valueNode: (
          <span>
            {isEl ? '3,14' : '3.14'} · 100 ＝ {formatNum(314, locale)} cm²
          </span>
        )
      }
    ],
    explanation: isEl ? 'Ε ＝ 3,14 · 10 · 10 ＝ 314 cm².' : 'A ＝ 3.14 · 10 · 10 ＝ 314 cm².'
  });

  // Q6: Υπολογισμός εμβαδού με ρ = 2 cm (Input)
  qs.push({
    id: 6,
    type: 'input',
    title: isEl ? `ΥΠΟΛΟΓΙΣΜΟΣ ΕΜΒΑΔΟΥ ΜΕ ${toCleanUppercase(rSym)} ＝ 2 CM` : `AREA CALCULATION WITH ${rSym.toUpperCase()} ＝ 2 CM`,
    prompt: isEl
      ? `Ένας κύκλος έχει ακτίνα ${rSym} ＝ 2 cm. Πόσα cm² είναι το εμβαδόν του; (Χρησιμοποιήστε π ＝ 3,14)`
      : `A circle has radius ${rSym} ＝ 2 cm. What is its area in cm²? (Use π ＝ 3.14)`,
    correctAnswer: isEl ? '12,56' : '12.56',
    tableData: [
      { label: isEl ? `Ακτίνα (${rSym})` : `Radius (${rSym})`, value: '2 cm' },
      {
        label: isEl ? 'Τετράγωνο ακτίνας' : 'Radius squared',
        valueNode: (
          <span>
            {rSym}<sup>2</sup> ＝ 2 · 2 ＝ 4 cm²
          </span>
        )
      },
      {
        label: isEl ? 'Υπολογισμός' : 'Calculation',
        valueNode: (
          <span>
            {isEl ? '3,14' : '3.14'} · 4 ＝ {isEl ? '12,56' : '12.56'} cm²
          </span>
        )
      }
    ],
    explanation: isEl ? 'Ε ＝ 3,14 · 2 · 2 ＝ 3,14 · 4 ＝ 12,56 cm².' : 'A ＝ 3.14 · 2 · 2 ＝ 3.14 · 4 ＝ 12.56 cm².'
  });

  // Q7: Εμβαδόν ημικυκλίου (MCQ)
  const q7Correct = isEl
    ? `Υπολογίζουμε το εμβαδόν ολόκληρου του κύκλου και διαιρούμε με το 2: (π · ${rSym}²) : 2`
    : `Calculate the full circle area and divide by 2: (π · ${rSym}²) : 2`;
  qs.push({
    id: 7,
    type: 'mcq',
    title: isEl ? 'ΕΜΒΑΔΟΝ ΗΜΙΚΥΚΛΙΟΥ' : 'SEMICIRCLE AREA',
    prompt: isEl
      ? 'Πώς υπολογίζουμε το εμβαδόν ενός ημικυκλίου;'
      : 'How do we calculate the area of a semicircle?',
    options: ensureFourUniqueOptions(q7Correct, () => [
      isEl ? 'Πολλαπλασιάζουμε την ακτίνα με το 2' : 'Multiply radius by 2',
      isEl ? 'Διαιρούμε την ακτίνα με το 2 και μετά πολλαπλασιάζουμε με το 3,14' : 'Divide radius by 2 and multiply by 3.14',
      isEl ? 'Έχει ακριβώς το ίδιο εμβαδόν με τον κύκλο' : 'It has the exact same area as full circle'
    ]),
    correctAnswer: q7Correct,
    tableData: [
      {
        label: isEl ? 'Ολόκληρος κύκλος' : 'Full circle',
        valueNode: (
          <span>
            {isEl ? 'Ε' : 'A'} ＝ π · {rSym}<sup>2</sup>
          </span>
        )
      },
      {
        label: isEl ? 'Ημικύκλιο' : 'Semicircle',
        valueNode: (
          <span className="inline-flex items-center">
            <span>{isEl ? 'Εημικ ＝ ' : 'Asemi ＝ '}</span>
            <Fraction num={<span>π · {rSym}<sup>2</sup></span>} den="2" />
          </span>
        )
      }
    ],
    explanation: isEl
      ? 'Το ημικύκλιο είναι το μισό του κύκλου, άρα διαιρούμε το εμβαδόν με το 2.'
      : 'A semicircle is half of a full circle, so we divide circle area by 2.'
  });

  // Q8: Περίμετρος vs Εμβαδόν (MCQ)
  const q8Correct = isEl
    ? `Η περίμετρος είναι μήκος γραμμής (2 · π · ${rSym} σε cm), ενώ το εμβαδόν είναι επιφάνεια (π · ${rSym}² σε cm²)`
    : `Perimeter is line length (2 · π · ${rSym} in cm), while area is flat surface (π · ${rSym}² in cm²)`;
  qs.push({
    id: 8,
    type: 'mcq',
    title: isEl ? 'ΠΕΡΙΜΕΤΡΟΣ ΕΝΑΝΤΙ ΕΜΒΑΔΟΥ' : 'PERIMETER VS AREA',
    prompt: isEl
      ? 'Ποια είναι η διαφορά ανάμεσα στην περίμετρο (μήκος κύκλου) και στο εμβαδόν του κύκλου;'
      : 'What is the key difference between circle perimeter and circle area?',
    options: ensureFourUniqueOptions(q8Correct, () => [
      isEl ? 'Είναι ακριβώς το ίδιο πράγμα με άλλο όνομα' : 'They are the exact same thing with different names',
      isEl ? 'Η περίμετρος μετριέται σε cm² και το εμβαδόν σε cm' : 'Perimeter is measured in cm² and area in cm',
      isEl ? 'Το εμβαδόν είναι πάντοτε μικρότερο από την περίμετρο' : 'Area is always less than perimeter'
    ]),
    correctAnswer: q8Correct,
    tableData: [
      {
        label: isEl ? 'Περίμετρος' : 'Perimeter',
        valueNode: (
          <span>
            L ＝ 2 · π · {rSym} ({isEl ? 'μήκος σε cm, m' : 'length in cm, m'})
          </span>
        )
      },
      {
        label: isEl ? 'Εμβαδόν' : 'Area',
        valueNode: (
          <span>
            {isEl ? 'Ε' : 'A'} ＝ π · {rSym}<sup>2</sup> ({isEl ? 'επιφάνεια σε cm², m²' : 'surface in cm², m²'})
          </span>
        )
      }
    ],
    explanation: isEl
      ? 'Η περίμετρος μετράει το εξωτερικό μήκος της γραμμής, ενώ το εμβαδόν μετράει ολόκληρη την εσωτερική επιφάνεια.'
      : 'Perimeter measures boundary length, while area measures the enclosed surface region.'
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

export default function EmbadonKiklouAskiseisPage() {
  const router = useRouter();
  const { locale = 'el' } = router;
  const isEl = locale === 'el';

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

  // Στατικά μεταφραστικά strings UI
  const ui = {
    metaTitle: isEl
      ? "Ασκήσεις: Εμβαδόν Κύκλου - ΣΤ' Δημοτικού | LearnMaths.gr"
      : "Exercises: Circle Area - 6th Grade | LearnMaths.gr",
    metaDesc: isEl
      ? "Διαδραστικές ασκήσεις στον υπολογισμό εμβαδού κύκλου (Ε ＝ π · ρ²), διαμέτρου, ημικυκλίου και κυκλικού δακτυλίου για τη ΣΤ' Δημοτικού."
      : "Interactive exercises on circle area (A ＝ π · r²), diameter, semicircles, and circular rings for 6th Grade.",
    backText: isEl ? "Θεωρία Κεφ. 76" : "Theory Ch. 76",
    actionTheory: isEl ? "📖 Θεωρία" : "📖 Theory",
    chapterBadge: isEl ? "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 76 • ΣΤ' ΔΗΜΟΤΙΚΟΥ" : "EXERCISES • CHAPTER 76 • 6TH GRADE",
    heroTitle: isEl ? "Ασκήσεις: Εμβαδόν Κύκλου" : "Exercises: Circle Area",
    heroDesc: isEl
      ? "Εξασκηθείτε στον υπολογισμό εμβαδού με τον τύπο Ε ＝ π · ρ², στις σχέσεις ακτίνας-διαμέτρου και στα ημικύκλια μέσα από 12 δυναμικές ερωτήσεις."
      : "Practice circle area calculation with A ＝ π · r², radius-diameter relationships, and semicircles through 12 dynamic questions.",
    heroFeature: isEl
      ? "12 Δυναμικές Ασκήσεις με Αυτόματη Αξιολόγηση & Αναλυτική Επεξήγηση"
      : "12 Dynamic Exercises with Automatic Grading & Detailed Explanation",
    btnNewSet: isEl ? "Νέες Ασκήσεις" : "New Exercises",
    btnSubmit: isEl ? "Έλεγχος Απαντήσεων" : "Check Answers",
    lblTrue: isEl ? "ΣΩΣΤΟ" : "TRUE",
    lblFalse: isEl ? "ΛΑΘΟΣ" : "FALSE",
    lblCorrectBadge: isEl ? "ΣΩΣΤΟ" : "CORRECT",
    lblWrongBadge: isEl ? "ΛΑΘΟΣ" : "INCORRECT",
    inputPlaceholder: isEl ? "Απάντηση..." : "Answer...",
    answered: isEl ? "ΑΠΑΝΤΗΘΗΚΑΝ:" : "ANSWERED:",
    score: isEl ? "ΣΚΟΡ:" : "SCORE:",
    percentage: isEl ? "ΠΟΣΟΣΤΟ:" : "PERCENTAGE:",
    feedbackCorrect: isEl ? "✓ Σωστή απάντηση!" : "✓ Correct answer!",
    feedbackWrongPrefix: isEl ? "✗ Λάθος. Η σωστή απάντηση είναι: " : "✗ Incorrect. The correct answer is: "
  };

  return (
    <Layout
      title={ui.metaTitle}
      description={ui.metaDesc}
      backUrl="/st-dimotikou/76-embadon-kiklou"
      backText={ui.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/76-embadon-kiklou"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0"
        >
          <span>{ui.actionTheory}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden">

        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden mb-8 sm:mb-12">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{ui.chapterBadge}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(ui.heroTitle)}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl break-words [overflow-wrap:anywhere]">
              {ui.heroDesc}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="break-words">{ui.heroFeature}</span>
            </div>
            <button
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base shrink-0"
            >
              <span>🔄 {toCleanUppercase(ui.btnNewSet)}</span>
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
                      {toCleanUppercase(q.title || `${isEl ? 'ΕΡΩΤΗΣΗ' : 'QUESTION'} ${index + 1}`)}
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
                      {isCorrect ? toCleanUppercase(ui.lblCorrectBadge) : toCleanUppercase(ui.lblWrongBadge)}
                    </span>
                  )}
                </div>

                {/* ΕΚΦΩΝΗΣΗ & SVG (NO-GIVEAWAY: ΟΥΔΕΙΣ ΠΙΝΑΚΑΣ ΕΔΩ) */}
                <div className="mb-6 space-y-3">
                  <div className="text-slate-800 text-sm sm:text-base font-semibold leading-relaxed break-words [overflow-wrap:anywhere]">
                    {q.promptNode ? q.promptNode : q.prompt}
                  </div>
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
                            {val ? toCleanUppercase(ui.lblTrue) : toCleanUppercase(ui.lblFalse)}
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
                        placeholder={ui.inputPlaceholder}
                        value={userAns || ''}
                        onChange={(e) => {
                          const cleaned = e.target.value
                            .replace(/[^0-9.,]/g, '')
                            .replace(/\./g, isEl ? ',' : '.');
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
                    {/* ΠΙΝΑΚΑΣ ΔΕΔΟΜΕΝΩΝ (TABLEDATA) ΜΟΝΟ ΣΤΟ FEEDBACK */}
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
                          ? ui.feedbackCorrect
                          : `${ui.feedbackWrongPrefix}${
                              q.type === 'boolean'
                                ? q.correctAnswer
                                  ? (isEl ? 'Σωστό' : 'True')
                                  : (isEl ? 'Λάθος' : 'False')
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
                  <span>{toCleanUppercase(ui.answered)} </span>
                  <span className="font-black text-indigo-400 text-sm sm:text-base">
                    {answeredCount} / {totalCount}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    <span>{toCleanUppercase(ui.score)} </span>
                    <span className="font-black text-emerald-400 text-sm sm:text-base">
                      {score} / {totalCount}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    <span>{toCleanUppercase(ui.percentage)} </span>
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
                  {toCleanUppercase(ui.btnSubmit)}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={loadNewSet}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-xs sm:text-sm flex items-center gap-2 shrink-0"
                >
                  <span>🔄</span>
                  <span>{toCleanUppercase(ui.btnNewSet)}</span>
                </button>
              )}
            </div>
          </div>
        </footer>

      </div>
    </Layout>
  );
}