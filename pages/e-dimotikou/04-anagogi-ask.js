// pages/e-dimotikou/04-anagogi-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Υπολογισμός Κλασματικής Μονάδας ( 1/β ) & Ολόκληρου Ποσού (Input)
function makeUnitAndTotalQuestion(findTotal = false, locale = 'el') {
  const isEl = locale === 'el';
  const denList = [4, 5, 6, 7, 8, 9, 10];
  const den = denList[getRandomInt(0, denList.length - 1)];
  const num = getRandomInt(2, den - 1);
  const unitVal = getRandomInt(12, 35) * 5;
  const knownVal = num * unitVal;
  const totalVal = den * unitVal;

  if (!findTotal) {
    // q1: Εύρεση κλασματικής μονάδας 1/β
    return {
      type: 'input',
      correct: unitVal,
      unit: '€',
      renderPrompt: () => (
        <span className="inline leading-relaxed">
          {isEl ? (
            <>
              Τα <Fraction num={num} den={den} size="md" /> ενός υπολογιστή κοστίζουν {knownVal} €. Πόσο κοστίζει η κλασματική μονάδα (το <Fraction num={1} den={den} size="md" />) του υπολογιστή;
            </>
          ) : (
            <>
              <Fraction num={num} den={den} size="md" /> of a computer costs €{knownVal}. How much does the unit fraction (<Fraction num={1} den={den} size="md" />) cost?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="inline font-mono leading-relaxed">
          {isEl ? (
            <>
              Για να βρούμε την αξία του <Fraction num={1} den={den} size="sm" />, διαιρούμε τη γνωστή τιμή με τον αριθμητή:{' '}
              <span className="whitespace-nowrap font-bold text-emerald-950">{knownVal} : {num} ＝ {unitVal} €</span>.
            </>
          ) : (
            <>
              To find the value of <Fraction num={1} den={den} size="sm" />, divide the known value by the numerator:{' '}
              <span className="whitespace-nowrap font-bold text-emerald-950">{knownVal} : {num} ＝ €{unitVal}</span>.
            </>
          )}
        </span>
      )
    };
  } else {
    // q2: Εύρεση ολόκληρου ποσού
    return {
      type: 'input',
      correct: totalVal,
      unit: '€',
      renderPrompt: () => (
        <span className="inline leading-relaxed">
          {isEl ? (
            <>
              Αν τα <Fraction num={num} den={den} size="md" /> ενός ποδηλάτου κοστίζουν {knownVal} €, ποια είναι η συνολική τιμή ολόκληρου του ποδηλάτου;
            </>
          ) : (
            <>
              If <Fraction num={num} den={den} size="md" /> of a bicycle costs €{knownVal}, what is the total price of the whole bicycle?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="inline font-mono leading-relaxed">
          {isEl ? (
            <>
              Πρώτα βρίσκουμε το <Fraction num={1} den={den} size="sm" />:{' '}
              <span className="whitespace-nowrap">{knownVal} : {num} ＝ {unitVal} €</span>. Στη συνέχεια πολλαπλασιάζουμε με τον παρονομαστή για να βρούμε το όλο (<Fraction num={den} den={den} size="sm" />):{' '}
              <span className="whitespace-nowrap font-bold text-emerald-950">{unitVal} · {den} ＝ {totalVal} €</span>.
            </>
          ) : (
            <>
              First find <Fraction num={1} den={den} size="sm" />:{' '}
              <span className="whitespace-nowrap">{knownVal} : {num} ＝ €{unitVal}</span>. Then multiply by the denominator to find the whole (<Fraction num={den} den={den} size="sm" />):{' '}
              <span className="whitespace-nowrap font-bold text-emerald-950">{unitVal} · {den} ＝ €{totalVal}</span>.
            </>
          )}
        </span>
      )
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Μεταβάσεις Μήκους & Βάρους (MCQ)
function makeQuantityProblem(isWeight = false, locale = 'el') {
  const isEl = locale === 'el';

  if (!isWeight) {
    // q3: Μήκος διαδρομής σε km
    const den = [5, 6, 8, 10][getRandomInt(0, 3)];
    const num = getRandomInt(2, den - 1);
    const unitKm = getRandomInt(8, 25);
    const knownKm = num * unitKm;
    const totalKm = den * unitKm;

    const rawDistractors = [
      totalKm + unitKm,
      Math.max(10, totalKm - unitKm),
      totalKm + 2 * unitKm
    ].filter((v) => v !== totalKm);

    const rawOptions = [totalKm, ...rawDistractors.slice(0, 3)];
    const options = shuffleArray([...new Set(rawOptions)]).map((v) => `${v} km`);

    return {
      type: 'mcq',
      correct: `${totalKm} km`,
      options,
      renderPrompt: () => (
        <span className="inline leading-relaxed">
          {isEl ? (
            <>
              Ένας ποδηλάτης διένυσε τα <Fraction num={num} den={den} size="md" /> μιας διαδρομής, δηλαδή {knownKm} km. Πόσα χιλιόμετρα είναι ολόκληρη η διαδρομή;
            </>
          ) : (
            <>
              A cyclist covered <Fraction num={num} den={den} size="md" /> of a route, which is {knownKm} km. How many kilometers is the entire route?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="inline font-mono leading-relaxed">
          {isEl ? (
            <>
              Το <Fraction num={1} den={den} size="sm" /> της διαδρομής είναι:{' '}
              <span className="whitespace-nowrap">{knownKm} : {num} ＝ {unitKm} km</span>. Ολόκληρη η διαδρομή (<Fraction num={den} den={den} size="sm" />) είναι:{' '}
              <span className="whitespace-nowrap font-bold text-emerald-950">{unitKm} · {den} ＝ {totalKm} km</span>.
            </>
          ) : (
            <>
              <Fraction num={1} den={den} size="sm" /> of the route is:{' '}
              <span className="whitespace-nowrap">{knownKm} : {num} ＝ {unitKm} km</span>. The whole route (<Fraction num={den} den={den} size="sm" />) is:{' '}
              <span className="whitespace-nowrap font-bold text-emerald-950">{unitKm} · {den} ＝ {totalKm} km</span>.
            </>
          )}
        </span>
      )
    };
  } else {
    // q4: Βάρος φορτίου σε kg
    const den = [4, 6, 7, 9][getRandomInt(0, 3)];
    const num = getRandomInt(2, den - 1);
    const unitKg = getRandomInt(15, 40);
    const knownKg = num * unitKg;
    const totalKg = den * unitKg;

    const rawDistractors = [
      totalKg + unitKg,
      Math.max(20, totalKg - unitKg),
      totalKg + unitKg * 2
    ].filter((v) => v !== totalKg);

    const rawOptions = [totalKg, ...rawDistractors.slice(0, 3)];
    const options = shuffleArray([...new Set(rawOptions)]).map((v) => `${v} kg`);

    return {
      type: 'mcq',
      correct: `${totalKg} kg`,
      options,
      renderPrompt: () => (
        <span className="inline leading-relaxed">
          {isEl ? (
            <>
              Ένα φορτηγό ξεφόρτωσε τα <Fraction num={num} den={den} size="md" /> ενός φορτίου σιταριού, δηλαδή {knownKg} kg. Πόσα κιλά ζύγιζε αρχικά ολόκληρο το φορτίο;
            </>
          ) : (
            <>
              A truck unloaded <Fraction num={num} den={den} size="md" /> of a wheat load, which is {knownKg} kg. How many kilograms did the whole load weigh originally?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="inline font-mono leading-relaxed">
          {isEl ? (
            <>
              Το <Fraction num={1} den={den} size="sm" /> του φορτίου ζυγίζει:{' '}
              <span className="whitespace-nowrap">{knownKg} : {num} ＝ {unitKg} kg</span>. Ολόκληρο το φορτίο (<Fraction num={den} den={den} size="sm" />) ζυγίζει:{' '}
              <span className="whitespace-nowrap font-bold text-emerald-950">{unitKg} · {den} ＝ {totalKg} kg</span>.
            </>
          ) : (
            <>
              <Fraction num={1} den={den} size="sm" /> of the load weighs:{' '}
              <span className="whitespace-nowrap">{knownKg} : {num} ＝ {unitKg} kg</span>. The entire load (<Fraction num={den} den={den} size="sm" />) weighs:{' '}
              <span className="whitespace-nowrap font-bold text-emerald-950">{unitKg} · {den} ＝ {totalKg} kg</span>.
            </>
          )}
        </span>
      )
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Από το Μέρος στο... Άλλο Μέρος (Input & MCQ)
function makePartToPartQuestion(isMCQ = false, locale = 'el') {
  const isEl = locale === 'el';
  const den = [6, 7, 8, 9, 10, 12][getRandomInt(0, 5)];
  const num1 = getRandomInt(2, 4);
  let num2 = getRandomInt(3, den - 1);
  if (num2 === num1) num2 = num1 + 1;

  const unitVal = getRandomInt(12, 30);
  const knownVal = num1 * unitVal;
  const targetVal = num2 * unitVal;

  if (!isMCQ) {
    // q5: Input
    return {
      type: 'input',
      correct: targetVal,
      unit: isEl ? 'σελίδες' : 'pages',
      renderPrompt: () => (
        <span className="inline leading-relaxed">
          {isEl ? (
            <>
              Αν τα <Fraction num={num1} den={den} size="md" /> ενός παραμυθιού είναι {knownVal} σελίδες, πόσες σελίδες είναι τα <Fraction num={num2} den={den} size="md" /> του ίδιου παραμυθιού;
            </>
          ) : (
            <>
              If <Fraction num={num1} den={den} size="md" /> of a storybook is {knownVal} pages, how many pages are <Fraction num={num2} den={den} size="md" /> of the same storybook?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="inline font-mono leading-relaxed">
          {isEl ? (
            <>
              Βρίσκουμε πρώτα την κλασματική μονάδα <Fraction num={1} den={den} size="sm" />:{' '}
              <span className="whitespace-nowrap">{knownVal} : {num1} ＝ {unitVal} σελίδες</span>. Στη συνέχεια υπολογίζουμε τα <Fraction num={num2} den={den} size="sm" />:{' '}
              <span className="whitespace-nowrap font-bold text-emerald-950">{unitVal} · {num2} ＝ {targetVal} σελίδες</span>.
            </>
          ) : (
            <>
              First find the unit fraction <Fraction num={1} den={den} size="sm" />:{' '}
              <span className="whitespace-nowrap">{knownVal} : {num1} ＝ {unitVal} pages</span>. Next calculate <Fraction num={num2} den={den} size="sm" />:{' '}
              <span className="whitespace-nowrap font-bold text-emerald-950">{unitVal} · {num2} ＝ {targetVal} pages</span>.
            </>
          )}
        </span>
      )
    };
  } else {
    // q6: MCQ
    const rawDistractors = [
      targetVal + unitVal,
      Math.max(10, targetVal - unitVal),
      targetVal + 2 * unitVal
    ].filter((v) => v !== targetVal);

    const rawOptions = [targetVal, ...rawDistractors.slice(0, 3)];
    const options = shuffleArray([...new Set(rawOptions)]).map((v) => `${v} €`);

    return {
      type: 'mcq',
      correct: `${targetVal} €`,
      options,
      renderPrompt: () => (
        <span className="inline leading-relaxed">
          {isEl ? (
            <>
              Τα <Fraction num={num1} den={den} size="md" /> ενός χρηματικού επάθλου ισούνται με {knownVal} €. Πόσα ευρώ αντιστοιχούν στα <Fraction num={num2} den={den} size="md" /> του ίδιου επάθλου;
            </>
          ) : (
            <>
              <Fraction num={num1} den={den} size="md" /> of a monetary prize equals €{knownVal}. How much money corresponds to <Fraction num={num2} den={den} size="md" /> of the same prize?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="inline font-mono leading-relaxed">
          {isEl ? (
            <>
              Το <Fraction num={1} den={den} size="sm" /> του επάθλου είναι:{' '}
              <span className="whitespace-nowrap">{knownVal} : {num1} ＝ {unitVal} €</span>. Επομένως τα <Fraction num={num2} den={den} size="sm" /> ισούνται με:{' '}
              <span className="whitespace-nowrap font-bold text-emerald-950">{unitVal} · {num2} ＝ {targetVal} €</span>.
            </>
          ) : (
            <>
              <Fraction num={1} den={den} size="sm" /> of the prize is:{' '}
              <span className="whitespace-nowrap">{knownVal} : {num1} ＝ €{unitVal}</span>. Therefore <Fraction num={num2} den={den} size="sm" /> equals:{' '}
              <span className="whitespace-nowrap font-bold text-emerald-950">{unitVal} · {num2} ＝ €{targetVal}</span>.
            </>
          )}
        </span>
      )
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα με Υπόλοιπο (MCQ & Input)
function makeComplexWordProblem(isInput = false, locale = 'el') {
  const isEl = locale === 'el';

  if (!isInput) {
    // q7: Υπολογισμός υπολοίπου από γνωστό μέρος (MCQ)
    const den = [5, 6, 8, 10][getRandomInt(0, 3)];
    const num = getRandomInt(2, den - 2);
    const remParts = den - num;
    const unitEuro = getRandomInt(15, 45);
    const spentVal = num * unitEuro;
    const remainingVal = remParts * unitEuro;

    const rawDistractors = [
      remainingVal + unitEuro,
      Math.max(20, remainingVal - unitEuro),
      spentVal
    ].filter((v) => v !== remainingVal);

    const rawOptions = [remainingVal, ...rawDistractors.slice(0, 3)];
    const options = shuffleArray([...new Set(rawOptions)]).map((v) => `${v} €`);

    return {
      type: 'mcq',
      correct: `${remainingVal} €`,
      options,
      renderPrompt: () => (
        <span className="inline leading-relaxed">
          {isEl ? (
            <>
              Η Μαρία ξόδεψε τα <Fraction num={num} den={den} size="md" /> των χρημάτων της για να αγοράσει μια τσάντα που κόστιζε {spentVal} €. Πόσα χρήματα της περίσσεψαν;
            </>
          ) : (
            <>
              Maria spent <Fraction num={num} den={den} size="md" /> of her money to buy a handbag costing €{spentVal}. How much money did she have left?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="inline font-mono leading-relaxed">
          {isEl ? (
            <>
              Το <Fraction num={1} den={den} size="sm" /> των χρημάτων της είναι:{' '}
              <span className="whitespace-nowrap">{spentVal} : {num} ＝ {unitEuro} €</span>. Τα χρήματα που περίσσεψαν αντιστοιχούν στα υπόλοιπα <Fraction num={remParts} den={den} size="sm" />:{' '}
              <span className="whitespace-nowrap font-bold text-emerald-950">{unitEuro} · {remParts} ＝ {remainingVal} €</span>.
            </>
          ) : (
            <>
              <Fraction num={1} den={den} size="sm" /> of her money is:{' '}
              <span className="whitespace-nowrap">{spentVal} : {num} ＝ €{unitEuro}</span>. The remaining money corresponds to <Fraction num={remParts} den={den} size="sm" />:{' '}
              <span className="whitespace-nowrap font-bold text-emerald-950">{unitEuro} · {remParts} ＝ €{remainingVal}</span>.
            </>
          )}
        </span>
      )
    };
  } else {
    // q8: Σύνθετη δεξαμενή νερού (Input)
    const den = [6, 7, 8, 9, 12][getRandomInt(0, 4)];
    const filledParts = getRandomInt(3, den - 2);
    const missingParts = den - filledParts;
    const unitLiters = getRandomInt(20, 60);
    const currentLiters = filledParts * unitLiters;
    const litersNeeded = missingParts * unitLiters;

    return {
      type: 'input',
      correct: litersNeeded,
      unit: 'L',
      renderPrompt: () => (
        <span className="inline leading-relaxed">
          {isEl ? (
            <>
              Μια δεξαμενή περιέχει {currentLiters} L νερού, τα οποία αντιστοιχούν ακριβώς στα <Fraction num={filledParts} den={den} size="md" /> της συνολικής χωρητικότητάς της. Πόσα επιπλέον λίτρα (L) νερού απαιτούνται για να γεμίσει πλήρως η δεξαμενή;
            </>
          ) : (
            <>
              A tank contains {currentLiters} L of water, corresponding to <Fraction num={filledParts} den={den} size="md" /> of its total capacity. How many additional liters (L) are required to fill the tank completely?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="inline font-mono leading-relaxed">
          {isEl ? (
            <>
              Το <Fraction num={1} den={den} size="sm" /> της δεξαμενής χωράει:{' '}
              <span className="whitespace-nowrap">{currentLiters} : {filledParts} ＝ {unitLiters} L</span>. Για να γεμίσει απομένουν <Fraction num={missingParts} den={den} size="sm" />. Επομένως χρειάζονται ακόμη:{' '}
              <span className="whitespace-nowrap font-bold text-emerald-950">{unitLiters} · {missingParts} ＝ {litersNeeded} L</span>.
            </>
          ) : (
            <>
              <Fraction num={1} den={den} size="sm" /> of the tank holds:{' '}
              <span className="whitespace-nowrap">{currentLiters} : {filledParts} ＝ {unitLiters} L</span>. To fill it, <Fraction num={missingParts} den={den} size="sm" /> remains. Therefore needed:{' '}
              <span className="whitespace-nowrap font-bold text-emerald-950">{unitLiters} · {missingParts} ＝ {litersNeeded} L</span>.
            </>
          )}
        </span>
      )
    };
  }
}

function generateQuestions(locale) {
  return {
    q1: makeUnitAndTotalQuestion(false, locale),
    q2: makeUnitAndTotalQuestion(true, locale),
    q3: makeQuantityProblem(false, locale),
    q4: makeQuantityProblem(true, locale),
    q5: makePartToPartQuestion(false, locale),
    q6: makePartToPartQuestion(true, locale),
    q7: makeComplexWordProblem(false, locale),
    q8: makeComplexWordProblem(true, locale)
  };
}

const translations = {
  el: {
    pageTitle: "Ασκήσεις: Αναγωγή στην Κλασματική Μονάδα - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στην αναγωγή στην κλασματική μονάδα: εύρεση συνολικού ποσού, μεταβάσεις μερών και προβλήματα υπολοίπου.",
    backText: "Ε' Δημοτικού",
    theoryBtn: "Θεωρία",
    badgeChapter: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    headerTitle: "📝 Ασκήσεις: Αναγωγή στην Κλασματική Μονάδα",
    headerDesc: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα τυχαιοποιημένα δεδομένα από τη δεξαμενή προβλημάτων!",
    newQuestionsBtn: "🔄 Νέες Ασκήσεις",
    checkBtn: "🎯 Έλεγχος Απαντήσεων",
    scoreText: "Σκορ:",
    successRate: "Επιτυχία:",
    fillPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctLabel: "Η σωστή απάντηση είναι:",
    titles: {
      q1: "ΥΠΟΛΟΓΙΣΜΟΣ ΚΛΑΣΜΑΤΙΚΗΣ ΜΟΝΑΔΑΣ",
      q2: "ΕΥΡΕΣΗ ΣΥΝΟΛΙΚΗΣ ΤΙΜΗΣ",
      q3: "ΣΥΝΟΛΙΚΟ ΜΗΚΟΣ ΔΙΑΔΡΟΜΗΣ",
      q4: "ΣΥΝΟΛΙΚΟ ΒΑΡΟΣ ΦΟΡΤΙΟΥ",
      q5: "ΑΠΟ ΤΟ ΜΕΡΟΣ ΣΤΟ ΑΛΛΟ ΜΕΡΟΣ ( ΣΕΛΙΔΕΣ )",
      q6: "ΑΠΟ ΤΟ ΜΕΡΟΣ ΣΤΟ ΑΛΛΟ ΜΕΡΟΣ ( ΧΡΗΜΑΤΑ )",
      q7: "ΠΡΟΒΛΗΜΑ ΥΠΟΛΟΙΠΟΥ ΧΡΗΜΑΤΩΝ",
      q8: "ΠΛΗΡΩΣΗ ΔΕΞΑΜΕΝΗΣ ΝΕΡΟΥ"
    }
  },
  en: {
    pageTitle: "Exercises: Unitary Method with Fractions - Grade 5 | LearnMaths.gr",
    pageDesc: "Challenging Grade 5 math practice on the unitary method with fractions: finding whole totals, part-to-part transitions, and remainder problems.",
    backText: "Grade 5",
    theoryBtn: "Theory",
    badgeChapter: "GRADE 5 • PRACTICE",
    headerTitle: "📝 Exercises: Unitary Method with Fractions",
    headerDesc: "Every time you click 'New Exercises', fresh randomized numbers are generated from our problem bank!",
    newQuestionsBtn: "🔄 New Exercises",
    checkBtn: "🎯 Check Answers",
    scoreText: "Score:",
    successRate: "Success Rate:",
    fillPrompt: "Complete all questions and click 'Check Answers'!",
    correctLabel: "The correct answer is:",
    titles: {
      q1: "UNIT FRACTION VALUE CALCULATION",
      q2: "FINDING TOTAL VALUE",
      q3: "TOTAL ROUTE DISTANCE",
      q4: "TOTAL LOAD WEIGHT",
      q5: "PART TO ANOTHER PART ( PAGES )",
      q6: "PART TO ANOTHER PART ( MONEY )",
      q7: "REMAINING MONEY WORD PROBLEM",
      q8: "FILLING A WATER TANK"
    }
  }
};

export default function AnagogiAskPage() {
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
    if (answers.q3 === questions.q3.correct) currentScore += 1;
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    if (parseInt(answers.q5, 10) === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (parseInt(answers.q8, 10) === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
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
                  {opt}
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
                <div className="mb-1">
                  {t.correctLabel} <strong className="font-bold text-rose-950">{qData.correct}</strong>.
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
          href="/e-dimotikou/04-anagogi"
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

          {renderMCQ('q3', questions.q3, 3, t.titles.q3, 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, t.titles.q4, 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, t.titles.q5, 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, t.titles.q6, 'bg-teal-600')}

          {renderMCQ('q7', questions.q7, 7, t.titles.q7, 'bg-purple-600')}
          {renderInput('q8', questions.q8, 8, t.titles.q8, 'bg-purple-600')}

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