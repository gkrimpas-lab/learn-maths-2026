// pages/e-dimotikou/02-isodinama-ask.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';

// --- ΤΥΠΟΓΡΑΦΙΑ & ΣΥΜΒΟΛΑ --- //

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Ε')/g);
  return parts
    .map((part) => {
      if (part === "Ε'") return "Ε'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Επαναχρησιμοποιήσιμο component για κανονική κατακόρυφη μορφή κλάσματος
function Fraction({ num, den, className = '', size = 'md' }) {
  const sizeClasses = {
    xs: 'text-[11px] 2xl:text-xs',
    sm: 'text-xs 2xl:text-sm',
    md: 'text-sm sm:text-base 2xl:text-lg',
    lg: 'text-base sm:text-lg 2xl:text-xl'
  };

  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono font-bold leading-none select-none ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      <span className="px-1 text-center leading-tight">{num}</span>
      <span className="w-full min-w-[0.85em] h-[1.5px] bg-current my-[1px] rounded-full"></span>
      <span className="px-1 text-center leading-tight">{den}</span>
    </span>
  );
}

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --- ΔΗΜΙΟΥΡΓΙΑ ΕΡΩΤΗΣΕΩΝ ΜΕ i18n (8 ΕΡΩΤΗΣΕΙΣ) --- //

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Εύρεση Άγνωστου Όρου (Αριθμητής ή Παρονομαστής)
function makeUnknownTermQuestion(findDenominator = false, locale = 'el') {
  const isEl = locale === 'el';

  if (!findDenominator) {
    // q1: Εύρεση άγνωστου αριθμητή x (π.χ. 3/7 = x/35)
    const basePairs = [
      [2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [3, 7], [5, 6], [5, 8]
    ];
    const [num, den] = basePairs[getRandomInt(0, basePairs.length - 1)];
    const k = getRandomInt(3, 8);
    const targetDen = den * k;
    const correctX = num * k;

    return {
      type: 'input',
      correct: correctX,
      unit: isEl ? 'τιμή του x' : 'value of x',
      renderPrompt: () => (
        <span className="inline leading-relaxed">
          {isEl ? (
            <>
              Στην ισότητα ισοδύναμων κλασμάτων{' '}
              <span className="whitespace-nowrap inline-flex items-center">
                <Fraction num={num} den={den} size="md" /> ＝ <Fraction num="x" den={targetDen} size="md" />
              </span>
              , ποιος αριθμός είναι το x;
            </>
          ) : (
            <>
              In the equivalent fraction equality{' '}
              <span className="whitespace-nowrap inline-flex items-center">
                <Fraction num={num} den={den} size="md" /> ＝ <Fraction num="x" den={targetDen} size="md" />
              </span>
              , what is the value of x?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="inline font-mono leading-relaxed">
          {isEl ? (
            <>
              Ο παρονομαστής {den} πολλαπλασιάστηκε με το {k} για να γίνει {targetDen}{' '}
              <span className="whitespace-nowrap">({den} · {k} ＝ {targetDen})</span>. Επομένως και ο αριθμητής πολλαπλασιάζεται με το {k}:{' '}
              <span className="whitespace-nowrap font-bold text-emerald-950">{num} · {k} ＝ {correctX}</span>.
            </>
          ) : (
            <>
              The denominator {den} was multiplied by {k} to become {targetDen}{' '}
              <span className="whitespace-nowrap">({den} · {k} ＝ {targetDen})</span>. Therefore, the numerator is also multiplied by {k}:{' '}
              <span className="whitespace-nowrap font-bold text-emerald-950">{num} · {k} ＝ {correctX}</span>.
            </>
          )}
        </span>
      )
    };
  } else {
    // q2: Εύρεση άγνωστου παρονομαστή y (π.χ. 4/9 = 28/y)
    const basePairs = [
      [3, 8], [4, 7], [5, 9], [7, 10], [6, 11], [5, 12], [4, 9], [7, 12]
    ];
    const [num, den] = basePairs[getRandomInt(0, basePairs.length - 1)];
    const m = getRandomInt(3, 7);
    const targetNum = num * m;
    const correctY = den * m;

    return {
      type: 'input',
      correct: correctY,
      unit: isEl ? 'τιμή του y' : 'value of y',
      renderPrompt: () => (
        <span className="inline leading-relaxed">
          {isEl ? (
            <>
              Στην ισότητα ισοδύναμων κλασμάτων{' '}
              <span className="whitespace-nowrap inline-flex items-center">
                <Fraction num={num} den={den} size="md" /> ＝ <Fraction num={targetNum} den="y" size="md" />
              </span>
              , ποιος αριθμός είναι το y;
            </>
          ) : (
            <>
              In the equivalent fraction equality{' '}
              <span className="whitespace-nowrap inline-flex items-center">
                <Fraction num={num} den={den} size="md" /> ＝ <Fraction num={targetNum} den="y" size="md" />
              </span>
              , what is the value of y?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="inline font-mono leading-relaxed">
          {isEl ? (
            <>
              Ο αριθμητής {num} πολλαπλασιάστηκε με το {m} για να γίνει {targetNum}{' '}
              <span className="whitespace-nowrap">({num} · {m} ＝ {targetNum})</span>. Επομένως και ο παρονομαστής πολλαπλασιάζεται με το {m}:{' '}
              <span className="whitespace-nowrap font-bold text-emerald-950">{den} · {m} ＝ {correctY}</span>.
            </>
          ) : (
            <>
              The numerator {num} was multiplied by {m} to become {targetNum}{' '}
              <span className="whitespace-nowrap">({num} · {m} ＝ {targetNum})</span>. Therefore, the denominator is also multiplied by {m}:{' '}
              <span className="whitespace-nowrap font-bold text-emerald-950">{den} · {m} ＝ {correctY}</span>.
            </>
          )}
        </span>
      )
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Απλοποίηση σε Ανάγωγο Κλάσμα (Input)
function makeIrreducibleFractionQuestion(askForNumerator = false, locale = 'el') {
  const isEl = locale === 'el';

  const irreduciblePairs = [
    [2, 3], [3, 4], [3, 5], [4, 7], [5, 6], [5, 8], [7, 9], [7, 12]
  ];
  const [irrNum, irrDen] = irreduciblePairs[getRandomInt(0, irreduciblePairs.length - 1)];
  const commonDivisor = [4, 6, 8, 9, 12][getRandomInt(0, 4)];
  const bigNum = irrNum * commonDivisor;
  const bigDen = irrDen * commonDivisor;

  if (askForNumerator) {
    // q3: Ζητείται ο νέος αριθμητής
    return {
      type: 'input',
      correct: irrNum,
      unit: isEl ? 'αριθμητής' : 'numerator',
      renderPrompt: () => (
        <span className="inline leading-relaxed">
          {isEl ? (
            <>
              Απλοποίησε πλήρως το κλάσμα <Fraction num={bigNum} den={bigDen} size="md" /> ώστε να γίνει ανάγωγο. Ποιος είναι ο αριθμητής του ανάγωγου κλάσματος;
            </>
          ) : (
            <>
              Simplify the fraction <Fraction num={bigNum} den={bigDen} size="md" /> to its irreducible form. What is the numerator of the simplified fraction?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="inline font-mono leading-relaxed">
          {isEl ? (
            <>
              Ο Μ.Κ.Δ. των {bigNum} και {bigDen} είναι το {commonDivisor}. Διαιρούμε και τους δύο όρους:{' '}
              <span className="whitespace-nowrap">{bigNum} : {commonDivisor} ＝ {irrNum}</span> και{' '}
              <span className="whitespace-nowrap">{bigDen} : {commonDivisor} ＝ {irrDen}</span>. Το ανάγωγο κλάσμα είναι <Fraction num={irrNum} den={irrDen} size="sm" />, άρα ο αριθμητής είναι{' '}
              <strong className="text-emerald-950 font-bold">{irrNum}</strong>.
            </>
          ) : (
            <>
              The GCD of {bigNum} and {bigDen} is {commonDivisor}. Divide both terms:{' '}
              <span className="whitespace-nowrap">{bigNum} : {commonDivisor} ＝ {irrNum}</span> and{' '}
              <span className="whitespace-nowrap">{bigDen} : {commonDivisor} ＝ {irrDen}</span>. The irreducible fraction is <Fraction num={irrNum} den={irrDen} size="sm" />, so the numerator is{' '}
              <strong className="text-emerald-950 font-bold">{irrNum}</strong>.
            </>
          )}
        </span>
      )
    };
  } else {
    // q4: Ζητείται ο νέος παρονομαστής
    return {
      type: 'input',
      correct: irrDen,
      unit: isEl ? 'παρονομαστής' : 'denominator',
      renderPrompt: () => (
        <span className="inline leading-relaxed">
          {isEl ? (
            <>
              Απλοποίησε πλήρως το κλάσμα <Fraction num={bigNum} den={bigDen} size="md" /> ώστε να γίνει ανάγωγο. Ποιος είναι ο παρονομαστής του ανάγωγου κλάσματος;
            </>
          ) : (
            <>
              Simplify the fraction <Fraction num={bigNum} den={bigDen} size="md" /> to its irreducible form. What is the denominator of the simplified fraction?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="inline font-mono leading-relaxed">
          {isEl ? (
            <>
              Ο Μ.Κ.Δ. των {bigNum} και {bigDen} είναι το {commonDivisor}. Διαιρούμε και τους δύο όρους:{' '}
              <span className="whitespace-nowrap">{bigNum} : {commonDivisor} ＝ {irrNum}</span> και{' '}
              <span className="whitespace-nowrap">{bigDen} : {commonDivisor} ＝ {irrDen}</span>. Το ανάγωγο κλάσμα είναι <Fraction num={irrNum} den={irrDen} size="sm" />, άρα ο παρονομαστής είναι{' '}
              <strong className="text-emerald-950 font-bold">{irrDen}</strong>.
            </>
          ) : (
            <>
              The GCD of {bigNum} and {bigDen} is {commonDivisor}. Divide both terms:{' '}
              <span className="whitespace-nowrap">{bigNum} : {commonDivisor} ＝ {irrNum}</span> and{' '}
              <span className="whitespace-nowrap">{bigDen} : {commonDivisor} ＝ {irrDen}</span>. The irreducible fraction is <Fraction num={irrNum} den={irrDen} size="sm" />, so the denominator is{' '}
              <strong className="text-emerald-950 font-bold">{irrDen}</strong>.
            </>
          )}
        </span>
      )
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Έλεγχος & Αναγνώριση Ισοδυναμίας (MCQ)
function makeEquivalenceCheckQuestion(isFindingNonEquivalent = false, locale = 'el') {
  const isEl = locale === 'el';

  if (!isFindingNonEquivalent) {
    // q5: Ποιο από τα 4 κλάσματα είναι ισοδύναμο με το δοθέν
    const basePairs = [
      [3, 4], [2, 5], [5, 6], [3, 8], [4, 9]
    ];
    const [num, den] = basePairs[getRandomInt(0, basePairs.length - 1)];
    const correctMult = getRandomInt(3, 6);
    const correctFraction = `${num * correctMult}/${den * correctMult}`;

    const rawOptions = [
      correctFraction,
      `${num * correctMult + 1}/${den * correctMult}`,
      `${num * correctMult}/${den * correctMult + 1}`,
      `${num * (correctMult + 1)}/${den * correctMult}`
    ];
    const uniqueOptions = [...new Set(rawOptions)];
    while (uniqueOptions.length < 4) {
      uniqueOptions.push(`${num * 2 + 1}/${den * 2}`);
    }
    const options = shuffleArray(uniqueOptions.slice(0, 4));

    return {
      type: 'mcq',
      correct: correctFraction,
      options,
      isFractionOptions: true,
      renderPrompt: () => (
        <span className="inline leading-relaxed">
          {isEl ? (
            <>
              Ποιο από τα παρακάτω κλάσματα είναι ισοδύναμο με το κλάσμα <Fraction num={num} den={den} size="md" />;
            </>
          ) : (
            <>
              Which of the following fractions is equivalent to the fraction <Fraction num={num} den={den} size="md" />?
            </>
          )}
        </span>
      ),
      renderExplanation: () => {
        const [cNum, cDen] = correctFraction.split('/');
        return (
          <span className="inline font-mono leading-relaxed">
            {isEl ? (
              <>
                Πολλαπλασιάζοντας τον αριθμητή και τον παρονομαστή του <Fraction num={num} den={den} size="sm" /> με το {correctMult}, προκύπτει:{' '}
                <span className="whitespace-nowrap inline-flex items-center">
                  ({num} · {correctMult}) / ({den} · {correctMult}) ＝ <Fraction num={cNum} den={cDen} size="sm" />
                </span>
                . Επίσης τα χιαστί γινόμενα είναι απολύτως ίσα.
              </>
            ) : (
              <>
                Multiplying both numerator and denominator of <Fraction num={num} den={den} size="sm" /> by {correctMult} gives:{' '}
                <span className="whitespace-nowrap inline-flex items-center">
                  ({num} · {correctMult}) / ({den} · {correctMult}) ＝ <Fraction num={cNum} den={cDen} size="sm" />
                </span>
                . Their cross products are also equal.
              </>
            )}
          </span>
        );
      }
    };
  } else {
    // q6: Ποιο από τα 4 κλάσματα ΔΕΝ είναι ισοδύναμο με τα υπόλοιπα (MCQ)
    const basePairs = [
      [2, 3], [3, 5], [3, 4], [5, 8]
    ];
    const [num, den] = basePairs[getRandomInt(0, basePairs.length - 1)];

    const f1 = `${num * 2}/${den * 2}`;
    const f2 = `${num * 4}/${den * 4}`;
    const f3 = `${num * 5}/${den * 5}`;
    const fake = `${num * 3 + 1}/${den * 3}`; // Μη ισοδύναμο

    const rawOptions = [f1, f2, f3, fake];
    const options = shuffleArray([...new Set(rawOptions)]);

    return {
      type: 'mcq',
      correct: fake,
      options,
      isFractionOptions: true,
      renderPrompt: () => (
        <span className="inline leading-relaxed">
          {isEl ? (
            <>
              Ποιο από τα παρακάτω κλάσματα ΔΕΝ είναι ισοδύναμο με το <Fraction num={num} den={den} size="md" />;
            </>
          ) : (
            <>
              Which of the following fractions is NOT equivalent to <Fraction num={num} den={den} size="md" />?
            </>
          )}
        </span>
      ),
      renderExplanation: () => {
        const [fakeNum, fakeDen] = fake.split('/');
        return (
          <span className="inline font-mono leading-relaxed">
            {isEl ? (
              <>
                Όλα τα άλλα κλάσματα προκύπτουν με διαπλάτυνση του <Fraction num={num} den={den} size="sm" />. Το κλάσμα <Fraction num={fakeNum} den={fakeDen} size="sm" /> δεν προκύπτει με πολλαπλασιασμό των δύο όρων με τον ίδιο αριθμό (τα χιαστί γινόμενα δεν είναι ίσα).
              </>
            ) : (
              <>
                All other fractions result from expanding <Fraction num={num} den={den} size="sm" />. The fraction <Fraction num={fakeNum} den={fakeDen} size="sm" /> does not equal <Fraction num={num} den={den} size="sm" /> because its cross products do not match.
              </>
            )}
          </span>
        );
      }
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Χιαστί Γινόμενα & Σύνθετο Πρόβλημα Κατανόησης
function makeAdvancedEquivQuestion(isWordProblem = false, locale = 'el') {
  const isEl = locale === 'el';

  if (!isWordProblem) {
    // q7: Έλεγχος ισότητας χιαστί γινομένων (MCQ)
    const a = getRandomInt(3, 7);
    const b = getRandomInt(8, 12);
    const mult = getRandomInt(2, 4);
    const c = a * mult;
    const d = b * mult;
    const crossProduct = a * d;

    const rawDistractors = [
      crossProduct + a,
      crossProduct - b,
      (a + 1) * d,
      crossProduct + 10
    ].filter((val) => val !== crossProduct);

    const rawOptions = [crossProduct, ...rawDistractors.slice(0, 3)];
    const options = shuffleArray([...new Set(rawOptions)]).map(String);

    return {
      type: 'mcq',
      correct: String(crossProduct),
      options,
      renderPrompt: () => (
        <span className="inline leading-relaxed">
          {isEl ? (
            <>
              Για τα ισοδύναμα κλάσματα{' '}
              <span className="whitespace-nowrap inline-flex items-center">
                <Fraction num={a} den={b} size="md" /> ＝ <Fraction num={c} den={d} size="md" />
              </span>
              , πόσο ισούται το κοινό χιαστί γινόμενο ({a} · {d} και {b} · {c});
            </>
          ) : (
            <>
              For the equivalent fractions{' '}
              <span className="whitespace-nowrap inline-flex items-center">
                <Fraction num={a} den={b} size="md" /> ＝ <Fraction num={c} den={d} size="md" />
              </span>
              , what is the common cross product ({a} · {d} and {b} · {c})?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="inline font-mono leading-relaxed">
          {isEl ? (
            <>
              Σε κάθε ζεύγος ισοδύναμων κλασμάτων τα χιαστί γινόμενα είναι απολύτως ίσα:{' '}
              <span className="whitespace-nowrap">{a} · {d} ＝ {crossProduct}</span> και{' '}
              <span className="whitespace-nowrap">{b} · {c} ＝ {crossProduct}</span>.
            </>
          ) : (
            <>
              In any pair of equivalent fractions, the cross products are equal:{' '}
              <span className="whitespace-nowrap">{a} · {d} ＝ {crossProduct}</span> and{' '}
              <span className="whitespace-nowrap">{b} · {c} ＝ {crossProduct}</span>.
            </>
          )}
        </span>
      )
    };
  } else {
    // q8: Σύνθετο πρόβλημα ισοδυναμίας με αναλογίες (MCQ)
    const baseNum = getRandomInt(3, 6);
    const baseDen = getRandomInt(7, 10);
    const factor1 = getRandomInt(2, 3);
    const factor2 = factor1 * 2;

    const containerA_num = baseNum * factor1;
    const containerA_den = baseDen * factor1;
    const containerB_den = baseDen * factor2;
    const containerB_num = baseNum * factor2;

    const unitWord = isEl ? 'μέρη' : 'parts';

    const rawDistractors = [
      containerB_num + factor1,
      containerB_num - factor1,
      containerA_num + factor2
    ].filter((val) => val !== containerB_num);

    const rawOptions = [containerB_num, ...rawDistractors.slice(0, 3)];
    const options = shuffleArray([...new Set(rawOptions)]).map((val) => `${val} ${unitWord}`);

    return {
      type: 'mcq',
      correct: `${containerB_num} ${unitWord}`,
      options,
      renderPrompt: () => (
        <span className="inline leading-relaxed">
          {isEl ? (
            <>
              Μια δεξαμενή είναι γεμάτη κατά τα <Fraction num={containerA_num} den={containerA_den} size="md" /> της χωρητικότητάς της. Μια δεύτερη πανομοιότυπη δεξαμενή έχει χωριστεί σε {containerB_den} ίσα μέρη. Πόσα από τα μέρη της δεύτερης δεξαμενής πρέπει να γεμίσουν ώστε να περιέχει ακριβώς την ίδια ποσότητα νερού;
            </>
          ) : (
            <>
              A tank is filled to <Fraction num={containerA_num} den={containerA_den} size="md" /> of its capacity. A second identical tank is divided into {containerB_den} equal parts. How many parts of the second tank must be filled to hold the exact same amount of water?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="inline font-mono leading-relaxed">
          {isEl ? (
            <>
              Αναζητούμε ισοδύναμο κλάσμα:{' '}
              <span className="whitespace-nowrap inline-flex items-center">
                <Fraction num={containerA_num} den={containerA_den} size="sm" /> ＝ <Fraction num="x" den={containerB_den} size="sm" />
              </span>
              . Επειδή <span className="whitespace-nowrap">{containerA_den} · 2 ＝ {containerB_den}</span>, πολλαπλασιάζουμε και τον αριθμητή:{' '}
              <span className="whitespace-nowrap font-bold text-emerald-950">{containerA_num} · 2 ＝ {containerB_num} {unitWord}</span>.
            </>
          ) : (
            <>
              We look for an equivalent fraction:{' '}
              <span className="whitespace-nowrap inline-flex items-center">
                <Fraction num={containerA_num} den={containerA_den} size="sm" /> ＝ <Fraction num="x" den={containerB_den} size="sm" />
              </span>
              . Since <span className="whitespace-nowrap">{containerA_den} · 2 ＝ {containerB_den}</span>, we multiply the numerator:{' '}
              <span className="whitespace-nowrap font-bold text-emerald-950">{containerA_num} · 2 ＝ {containerB_num} {unitWord}</span>.
            </>
          )}
        </span>
      )
    };
  }
}

function generateQuestions(locale) {
  return {
    q1: makeUnknownTermQuestion(false, locale),
    q2: makeUnknownTermQuestion(true, locale),
    q3: makeIrreducibleFractionQuestion(true, locale),
    q4: makeIrreducibleFractionQuestion(false, locale),
    q5: makeEquivalenceCheckQuestion(false, locale),
    q6: makeEquivalenceCheckQuestion(true, locale),
    q7: makeAdvancedEquivQuestion(false, locale),
    q8: makeAdvancedEquivQuestion(true, locale)
  };
}

const translations = {
  el: {
    pageTitle: "Ασκήσεις: Ισοδύναμα Κλάσματα - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στα ισοδύναμα κλάσματα: εύρεση αγνώστου όρου, απλοποίηση σε ανάγωγο, χιαστί γινόμενα.",
    backText: "Ε' Δημοτικού",
    theoryBtn: "Θεωρία",
    badgeChapter: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    headerTitle: "📝 Ασκήσεις: Ισοδύναμα Κλάσματα",
    headerDesc: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!",
    newQuestionsBtn: "🔄 Νέες Ασκήσεις",
    checkBtn: "🎯 Έλεγχος Απαντήσεων",
    scoreText: "Σκορ:",
    successRate: "Επιτυχία:",
    fillPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctLabel: "Η σωστή απάντηση είναι:",
    titles: {
      q1: "ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ ΑΡΙΘΜΗΤΗ",
      q2: "ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ ΠΑΡΟΝΟΜΑΣΤΗ",
      q3: "ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ ( ΑΡΙΘΜΗΤΗΣ )",
      q4: "ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ ( ΠΑΡΟΝΟΜΑΣΤΗΣ )",
      q5: "ΑΝΑΓΝΩΡΙΣΗ ΙΣΟΔΥΝΑΜΟΥ ΚΛΑΣΜΑΤΟΣ",
      q6: "ΕΝΤΟΠΙΣΜΟΣ ΜΗ ΙΣΟΔΥΝΑΜΟΥ",
      q7: "ΕΛΕΓΧΟΣ ΜΕ ΧΙΑΣΤΙ ΓΙΝΟΜΕΝΑ",
      q8: "ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΑΝΑΛΟΓΙΑΣ"
    }
  },
  en: {
    pageTitle: "Exercises: Equivalent Fractions - Grade 5 | LearnMaths.gr",
    pageDesc: "Challenging Grade 5 math practice on equivalent fractions: finding unknown terms, simplifying to irreducible form, and cross products.",
    backText: "Grade 5",
    theoryBtn: "Theory",
    badgeChapter: "GRADE 5 • PRACTICE",
    headerTitle: "📝 Exercises: Equivalent Fractions",
    headerDesc: "Every time you click 'New Exercises', fresh randomized numbers are generated from our problem bank!",
    newQuestionsBtn: "🔄 New Exercises",
    checkBtn: "🎯 Check Answers",
    scoreText: "Score:",
    successRate: "Success Rate:",
    fillPrompt: "Complete all questions and click 'Check Answers'!",
    correctLabel: "The correct answer is:",
    titles: {
      q1: "FINDING UNKNOWN NUMERATOR",
      q2: "FINDING UNKNOWN DENOMINATOR",
      q3: "IRREDUCIBLE FRACTION ( NUMERATOR )",
      q4: "IRREDUCIBLE FRACTION ( DENOMINATOR )",
      q5: "RECOGNIZING EQUIVALENT FRACTIONS",
      q6: "IDENTIFYING NON-EQUIVALENT FRACTION",
      q7: "CHECK WITH CROSS PRODUCTS",
      q8: "MULTI-STEP PROPORTION PROBLEM"
    }
  }
};

export default function IsodinamaAskPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions(locale));
    setAnswers({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewQuestions();
  }, [locale]);

  if (!questions) return null;

  const handleInputChange = (key, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleNumericInput = (key, rawVal) => {
    if (submitted) return;
    const clean = rawVal.replace(/[^0-9]/g, '').slice(0, 10);
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;

    if (parseInt(answers.q1, 10) === questions.q1.correct) currentScore += 1;
    if (parseInt(answers.q2, 10) === questions.q2.correct) currentScore += 1;
    if (parseInt(answers.q3, 10) === questions.q3.correct) currentScore += 1;
    if (parseInt(answers.q4, 10) === questions.q4.correct) currentScore += 1;
    if (answers.q5 === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Βοηθητική μέθοδος για εμφάνιση επιλογής (με κανονικό κλάσμα εφόσον περιέχει '/')
  const renderOptionContent = (opt, isFractionOptions) => {
    if (isFractionOptions && typeof opt === 'string' && opt.includes('/')) {
      const [n, d] = opt.split('/');
      return <Fraction num={n} den={d} size="md" />;
    }
    return <span>{opt}</span>;
  };

  // Render Component για Ερωτήσεις MCQ
  const renderMCQ = (qKey, qData, numLabel, badgeTitle, accentColor) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div
        className={`bg-white p-5 sm:p-7 2xl:p-9 rounded-3xl shadow-sm border transition-all ${
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-400 bg-rose-50/20'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span
            className={`${accentColor} text-white font-black text-xs sm:text-sm 2xl:text-base w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm`}
          >
            {numLabel}
          </span>
          <div className="space-y-1">
            <span className="text-[11px] 2xl:text-xs font-black tracking-wider text-slate-400">
              {toCleanUppercase(badgeTitle)}
            </span>
            <h3 className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug">
              {qData.renderPrompt()}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11 2xl:pl-13">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt;
            return (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition select-none text-sm sm:text-base 2xl:text-lg font-mono font-bold ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                } ${submitted ? 'cursor-default pointer-events-none' : ''}`}
              >
                <input
                  type="radio"
                  id={`${qKey}-opt-${idx}`}
                  name={qKey}
                  value={opt}
                  checked={isSelected}
                  onChange={() => handleInputChange(qKey, opt)}
                  disabled={submitted}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 shrink-0"
                />
                <span className="break-words whitespace-normal leading-snug flex-1">
                  {renderOptionContent(opt, qData.isFractionOptions)}
                </span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 2xl:pl-13 text-xs sm:text-sm 2xl:text-base leading-relaxed">
            {isCorrect ? (
              <div className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {qData.renderExplanation()}
              </div>
            ) : (
              <div className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                <div className="mb-1 flex items-center gap-1.5 flex-wrap">
                  <span>{t.correctLabel}</span>
                  <strong className="font-bold text-rose-950 inline-flex items-center">
                    {renderOptionContent(qData.correct, qData.isFractionOptions)}
                  </strong>
                </div>
                {qData.renderExplanation()}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Component για Ερωτήσεις Input
  const renderInput = (qKey, qData, numLabel, badgeTitle, accentColor) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div
        className={`bg-white p-5 sm:p-7 2xl:p-9 rounded-3xl shadow-sm border transition-all ${
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-400 bg-rose-50/20'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span
            className={`${accentColor} text-white font-black text-xs sm:text-sm 2xl:text-base w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm`}
          >
            {numLabel}
          </span>
          <div className="space-y-1">
            <span className="text-[11px] 2xl:text-xs font-black tracking-wider text-slate-400">
              {toCleanUppercase(badgeTitle)}
            </span>
            <h3 className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug">
              {qData.renderPrompt()}
            </h3>
          </div>
        </div>

        <div className="sm:pl-11 2xl:pl-13 space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="?"
              maxLength={10}
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-32 sm:w-40 h-12 sm:h-14 p-3 text-center rounded-2xl border-2 border-slate-300 font-mono text-lg sm:text-xl 2xl:text-2xl font-black focus:border-indigo-600 focus:outline-none bg-slate-50/60 focus:bg-white text-slate-900 disabled:opacity-75"
            />
            <span className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-600">
              {qData.unit}
            </span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 2xl:pl-13 text-xs sm:text-sm 2xl:text-base leading-relaxed">
            {isCorrect ? (
              <div className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {qData.renderExplanation()}
              </div>
            ) : (
              <div className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                <div className="mb-1">
                  {t.correctLabel} <strong className="font-bold text-rose-950">{qData.correct} {qData.unit}</strong>.
                </div>
                {qData.renderExplanation()}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/e-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/02-isodinama"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl text-sm 2xl:text-base transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      {/* Full-width container για 2K / 4K */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 space-y-8 overflow-x-hidden">
        
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <span className="bg-white/10 border border-white/20 text-sky-200 text-xs 2xl:text-sm font-black px-3 py-1 rounded-full tracking-wider inline-block">
              {toCleanUppercase(t.badgeChapter)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black tracking-tight pt-1">
              {t.headerTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm md:text-base 2xl:text-lg">
              {t.headerDesc}
            </p>
          </div>

          <button
            type="button"
            onClick={loadNewQuestions}
            className="bg-amber-400 text-slate-950 font-black px-4 py-2.5 sm:px-5 sm:py-3 2xl:px-7 2xl:py-4 rounded-2xl shadow-lg hover:bg-amber-300 transition active:scale-95 text-xs sm:text-sm 2xl:text-base whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            {t.newQuestionsBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΑΣΚΗΣΕΩΝ (8 ΕΡΩΤΗΣΕΙΣ) */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderInput('q1', questions.q1, 1, t.titles.q1, 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, t.titles.q2, 'bg-blue-600')}

          {renderInput('q3', questions.q3, 3, t.titles.q3, 'bg-indigo-600')}
          {renderInput('q4', questions.q4, 4, t.titles.q4, 'bg-indigo-600')}

          {renderMCQ('q5', questions.q5, 5, t.titles.q5, 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, t.titles.q6, 'bg-teal-600')}

          {renderMCQ('q7', questions.q7, 7, t.titles.q7, 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, t.titles.q8, 'bg-purple-600')}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg 2xl:text-xl font-black px-10 py-4 2xl:px-14 2xl:py-5 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                {t.checkBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <footer className="fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 2xl:py-5 z-50">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 2xl:px-5 2xl:py-2 rounded-xl text-base sm:text-lg 2xl:text-xl flex items-center gap-2 shadow-sm">
              <span>🏆 {t.scoreText}</span>
              <span className="text-xl sm:text-2xl 2xl:text-3xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-300">
                {t.successRate} <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 2xl:px-7 2xl:py-2.5 rounded-xl shadow-md transition text-xs sm:text-sm 2xl:text-base flex items-center gap-2 active:scale-95"
              >
                {t.newQuestionsBtn}
              </button>
            ) : (
              <p className="text-xs 2xl:text-sm text-slate-400 hidden sm:block">
                {t.fillPrompt}
              </p>
            )}
          </div>
        </div>
      </footer>
    </Layout>
  );
}