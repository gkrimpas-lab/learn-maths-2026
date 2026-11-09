import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση για άτονα κεφαλαία (διατηρεί μόνο το Γ')
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Γ')/g);
  return parts
    .map((part) => {
      if (part === "Γ'") return "Γ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας (Inline SVG + Vinculum) - Responsive
function Radical({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center align-middle font-mono shrink-0 mx-0.5 ${className}`}>
      <svg
        viewBox="0 0 12 24"
        className="w-[0.52em] h-[1.12em] shrink-0 text-current overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 13 L3.5 13 L6.5 21 L12 2" />
      </svg>
      <span className="border-t-[1.8px] border-current pl-0.5 pr-1 py-0 leading-none text-[0.95em]">
        {children}
      </span>
    </span>
  );
}

// Επαναχρησιμοποιήσιμο Component Κλάσματος (Fraction) - Responsive
function Frac({ num, den, className = "" }) {
  return (
    <span className={`inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}>
      <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">{num}</span>
      <span className="pt-0.5 break-all">{den}</span>
    </span>
  );
}

// Κομψή απόδοση της γραμμής περιόδου πάνω από τα ψηφία (Vinculum)
function Overline({ children }) {
  return (
    <span className="relative inline-block border-t-2 border-current px-0.5 leading-none">
      {children}
    </span>
  );
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

function ensureFourUniqueOptions(correct, distractorsGen) {
  const set = new Set([String(correct).trim()]);
  let attempts = 0;
  while (set.size < 4 && attempts < 100) {
    attempts++;
    const cand = distractorsGen();
    if (cand !== undefined && cand !== null && cand !== '') {
      set.add(String(cand).trim());
    }
  }
  let fallbackCount = 1;
  while (set.size < 4) {
    set.add(`${correct} (${fallbackCount++})`);
  }
  return shuffle(Array.from(set));
}

const translations = {
  el: {
    pageTitle: "Επαναληπτικό Σετ 1 (Κεφ. 1–6) | Γ' Γυμνασίου",
    pageDesc: "Ολοκληρωμένο επαναληπτικό διαγώνισμα 18 ερωτήσεων και προβλημάτων για τα Κεφάλαια 1 έως 6 των Μαθηματικών της Γ' Γυμνασίου.",
    backNav: "Γ' Γυμνασίου",
    navTheoryBtn: "ΥΛΗ",
    headerBadge: "ΕΠΑΝΑΛΗΨΗ 1 • ΚΕΦ. 1 ΕΩΣ 6 • Γ' ΓΥΜΝΑΣΙΟΥ",
    headerTitle: "Επαναληπτικό Σετ Ασκήσεων & Προβλημάτων",
    headerDesc: "18 δυναμικές ερωτήσεις (12 βασικές και 6 σύνθετα προβλήματα) με τυχαίες παραμέτρους και πλήρη ανατροφοδότηση.",
    btnNewSet: "ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
    resultTitle: "Αποτέλεσμα:",
    feedbackHigh: "Εξαιρετική επίδοση! Κατέχετε πλήρως όλες τις έννοιες των πρώτων έξι κεφαλαίων.",
    feedbackMid: "Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα παρακάτω στα σημεία που δυσκολευτήκατε.",
    feedbackLow: "Χρειάζεται επανάληψη στη θεωρία των κεφαλαίων πριν δοκιμάσετε ξανά.",
    btnRetry: "ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ",
    badgeCorrect: "✓ Σωστό",
    badgeIncorrect: "✗ Λάθος",
    placeholderInput: "Απάντηση...",
    tableColStep: "Στοιχείο / Βήμα",
    tableColDetails: "Ανάλυση Δεδομένων",
    correctAnswerLabel: "Σωστή Απάντηση:",
    footerAnswered: "ΑΠΑΝΤΗΘΗΚΑΝ",
    footerScore: "ΣΚΟΡ",
    btnCheck: "ΕΛΕΓΧΟΣ",
    chap1: "ΚΕΦ. 1",
    chap2: "ΚΕΦ. 2",
    chap3: "ΚΕΦ. 3",
    chap4: "ΚΕΦ. 4",
    chap5: "ΚΕΦ. 5",
    chap6: "ΚΕΦ. 6",
    probChap: "ΠΡΟΒΛΗΜΑ ΚΕΦ."
  },
  en: {
    pageTitle: "Revision Set 1 (Ch. 1–6) | Grade 9",
    pageDesc: "Comprehensive revision test of 18 questions and problems for Chapters 1 to 6 of Grade 9 Mathematics.",
    backNav: "Grade 9",
    navTheoryBtn: "MATERIAL",
    headerBadge: "REVISION 1 • CH. 1 TO 6 • GRADE 9",
    headerTitle: "Revision Exercises & Problems Set",
    headerDesc: "18 dynamic questions (12 basic and 6 complex problems) with random parameters and full feedback.",
    btnNewSet: "NEW EXERCISES",
    resultTitle: "Result:",
    feedbackHigh: "Excellent performance! You fully master all concepts of the first six chapters.",
    feedbackMid: "Great effort! Study the detailed steps below for the points you found difficult.",
    feedbackLow: "Theory revision of the chapters is needed before trying again.",
    btnRetry: "TRY NEW SET",
    badgeCorrect: "✓ Correct",
    badgeIncorrect: "✗ Incorrect",
    placeholderInput: "Answer...",
    tableColStep: "Element / Step",
    tableColDetails: "Data Analysis",
    correctAnswerLabel: "Correct Answer:",
    footerAnswered: "ANSWERED",
    footerScore: "SCORE",
    btnCheck: "CHECK",
    chap1: "CH. 1",
    chap2: "CH. 2",
    chap3: "CH. 3",
    chap4: "CH. 4",
    chap5: "CH. 5",
    chap6: "CH. 6",
    probChap: "PROBLEM CH."
  }
};

// =========================================================================
// ΔΕΞΑΜΕΝΕΣ ΒΑΣΙΚΩΝ ΕΡΩΤΗΣΕΩΝ (2 ΑΠΟ ΚΑΘΕ ΚΕΦΑΛΑΙΟ = 12 ΕΡΩΤΗΣΕΙΣ)
// =========================================================================

const POOLS_BASIC = {
  // ΚΕΦΑΛΑΙΟ 1: Δεκαδική μορφή ρητών
  chap1: [
    (locale) => {
      const d = randInt(1, 8);
      const distractorsList = [`${d}/10`, `${d}/99`, `${d}/8`, `${d}/90`, `${d}/100`];
      return {
        title: locale === 'el' ? 'Γεννήτρια Απλού Περιοδικού' : 'Generator of Simple Periodic',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            {locale === 'el' ? `Ποιο κλάσμα παριστάνει τον αριθμό 0,${d}${d}${d}... (περίοδος ${d});` : `Which fraction represents the number 0.${d}${d}${d}... (period ${d})?`}
          </span>
        ),
        type: 'mcq',
        correct: `${d}/9`,
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        renderOption: (opt) => {
          const p = String(opt).split('/');
          return p.length === 2 ? <Frac num={p[0]} den={p[1]} /> : opt;
        },
        explanation: (
          <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
            <span>{locale === 'el' ? 'Ένα επαναλαμβανόμενο ψηφίο αντιστοιχεί σε παρονομαστή 9, άρα' : 'One repeating digit corresponds to denominator 9, so'}</span>
            <span className="inline-flex items-center whitespace-nowrap"><Frac num={d} den="9" />.</span>
          </span>
        )
      };
    },
    (locale) => {
      const dens = [8, 16, 20, 25, 40, 50];
      const d = dens[randInt(0, dens.length - 1)];
      const c = locale === 'el' ? 'Πεπερασμένο (τερματιζόμενο) δεκαδικό' : 'Finite (terminating) decimal';
      const distractorsList = locale === 'el'
        ? ['Απλό περιοδικό δεκαδικό', 'Μικτό περιοδικό δεκαδικό', 'Άρρητο αριθμό', 'Ακέραιο αριθμό', 'Μη πραγματικό αριθμό']
        : ['Simple periodic decimal', 'Mixed periodic decimal', 'Irrational number', 'Integer number', 'Non-real number'];
      return {
        title: locale === 'el' ? 'Αναγνώριση Πεπερασμένου Δεκαδικού' : 'Identifying Finite Decimal',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            {locale === 'el' ? 'Το ανάγωγο κλάσμα' : 'The irreducible fraction'} <Frac num="3" den={d} /> {locale === 'el' ? 'παράγει:' : 'produces:'}
          </span>
        ),
        type: 'mcq',
        correct: c,
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        explanation: locale === 'el'
          ? `Ο παρονομαστής ${d} περιέχει μόνο πρώτους παράγοντες 2 ή/και 5, επομένως ο δεκαδικός τερματίζεται.`
          : `Denominator ${d} contains only prime factors 2 and/or 5, so the decimal terminates.`
      };
    },
    (locale) => {
      const p = randInt(12, 85);
      const distractorsList = [`${p}/100`, `${p}/9`, `${p}/90`, `${p}/990`, `${p}/10`];
      return {
        title: locale === 'el' ? 'Γεννήτρια Διψήφιου Περιοδικού' : 'Generator of Two-Digit Periodic',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            {locale === 'el' ? `Ποιο κλάσμα παριστάνει τον αριθμό 0,${p}${p}... (περίοδος ${p});` : `Which fraction represents the number 0.${p}${p}... (period ${p})?`}
          </span>
        ),
        type: 'mcq',
        correct: `${p}/99`,
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        renderOption: (opt) => {
          const parts = String(opt).split('/');
          return parts.length === 2 ? <Frac num={parts[0]} den={parts[1]} /> : opt;
        },
        explanation: (
          <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
            <span>{locale === 'el' ? 'Δύο ψηφία περιόδου αντιστοιχούν σε 99 στον παρονομαστή:' : 'Two periodic digits correspond to 99 in denominator:'}</span>
            <span className="inline-flex items-center whitespace-nowrap"><Frac num={p} den="99" />.</span>
          </span>
        )
      };
    },
    (locale) => ({
      title: locale === 'el' ? 'Ισότητα Περιοδικού με 1' : 'Equality of Periodic with 1',
      prompt: locale === 'el' ? 'Σε ποιον ακέραιο αριθμό ισούται ακριβώς ο περιοδικός δεκαδικός 0,999...;' : 'To which integer is the periodic decimal 0.999... exactly equal?',
      type: 'input',
      correct: 1,
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          {locale === 'el' ? '0,999...' : '0.999...'} ＝ <Frac num="9" den="9" /> ＝ 1.
        </span>
      )
    }),
    (locale) => {
      const k = randInt(3, 7);
      return {
        title: locale === 'el' ? 'Πλήθος Δυνατών Υπολοίπων' : 'Number of Possible Remainders',
        prompt: locale === 'el' ? `Στη διαίρεση με παρονομαστή ${k}, ποιο είναι το μέγιστο πλήθος ψηφίων της περιόδου;` : `In division by denominator ${k}, what is the maximum number of digits in the period?`,
        type: 'input',
        correct: k - 1,
        explanation: locale === 'el' ? `Τα μη μηδενικά υπόλοιπα είναι το πολύ ${k - 1}, άρα και η περίοδος έχει το πολύ ${k - 1} ψηφία.` : `Non-zero remainders are at most ${k - 1}, so period has at most ${k - 1} digits.`
      };
    },
    (locale) => ({
      title: locale === 'el' ? 'Δεκαδική Μορφή 1/4' : 'Decimal Form of 1/4',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποια είναι η δεκαδική μορφή του κλάσματος' : 'What is the decimal form of fraction'} <Frac num="1" den="4" /> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: locale === 'el' ? '0,25' : '0.25',
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          <Frac num="1" den="4" /> ＝ {locale === 'el' ? '0,25' : '0.25'}.
        </span>
      )
    }),
    (locale) => ({
      title: locale === 'el' ? 'Μη Περιοδικό Μέρος' : 'Non-Periodic Part',
      prompt: locale === 'el' ? 'Ποιο είναι το μη περιοδικό μέρος του αριθμού 0,1666...;' : 'What is the non-periodic part of number 0.1666...?',
      type: 'input',
      correct: 1,
      explanation: locale === 'el' ? 'Το ψηφίο 1 βρίσκεται πριν την περίοδο 6.' : 'Digit 1 is before the period 6.'
    }),
    (locale) => {
      const distractorsList = locale === 'el' ? ['0,3', '0,31', '0,25', '0,34', '0,33'] : ['0.3', '0.31', '0.25', '0.34', '0.33'];
      return {
        title: locale === 'el' ? 'Κλάσμα 1/3' : 'Fraction 1/3',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            {locale === 'el' ? 'Ποιος δεκαδικός αριθμός αντιστοιχεί στο κλάσμα' : 'Which decimal number corresponds to fraction'} <Frac num="1" den="3" /> {locale === 'el' ? '；' : '?'}
          </span>
        ),
        type: 'mcq',
        correct: locale === 'el' ? '0,333...' : '0.333...',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        explanation: (
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            <Frac num="1" den="3" /> ＝ {locale === 'el' ? '0,333...' : '0.333...'}.
          </span>
        )
      };
    },
    (locale) => ({
      title: locale === 'el' ? 'Κλάσμα 1/11' : 'Fraction 1/11',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποια είναι η περίοδος του κλάσματος' : 'What is the period of fraction'} <Frac num="1" den="11" /> {locale === 'el' ? '(0,0909...)；' : '(0.0909...)?'}
        </span>
      ),
      type: 'input',
      correct: 9,
      explanation: locale === 'el' ? 'Η περίοδος είναι το 09 (αριθμητική τιμή 9).' : 'The period is 09 (numerical value 9).'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Δεκαδική Μορφή 3/5' : 'Decimal Form of 3/5',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποια είναι η δεκαδική μορφή του κλάσματος' : 'What is the decimal form of fraction'} <Frac num="3" den="5" /> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: locale === 'el' ? '0,6' : '0.6',
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          <Frac num="3" den="5" /> ＝ <Frac num="6" den="10" /> ＝ {locale === 'el' ? '0,6' : '0.6'}.
        </span>
      )
    })
  ],

  // ΚΕΦΑΛΑΙΟ 2: Δεκαδική μορφή άρρητων
  chap2: [
    (locale) => {
      const k = randInt(2, 6);
      const n = k * k + randInt(1, 2 * k);
      const distractorsList = locale === 'el'
        ? [`${k - 1} και ${k}`, `${k + 1} και ${k + 2}`, `${k - 2} και ${k - 1}`, `${k + 2} και ${k + 3}`, `${k} και ${k + 2}`]
        : [`${k - 1} and ${k}`, `${k + 1} and ${k + 2}`, `${k - 2} and ${k - 1}`, `${k + 2} and ${k + 3}`, `${k} and ${k + 2}`];
      return {
        title: locale === 'el' ? 'Ακέραιος Εγκλωβισμός Ρίζας' : 'Integer Bounding of Root',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            {locale === 'el' ? 'Ανάμεσα σε ποιους δύο διαδοχικούς ακεραίους βρίσκεται ο αριθμός' : 'Between which two consecutive integers is the number'} <Radical>{n}</Radical> {locale === 'el' ? '；' : '?'}
          </span>
        ),
        type: 'mcq',
        correct: locale === 'el' ? `${k} και ${k + 1}` : `${k} and ${k + 1}`,
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        explanation: (
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            {k}<sup>2</sup> ＝ {k * k} ＜ {n} ＜ {(k + 1) * (k + 1)} ＝ ({k + 1})<sup>2</sup>.
          </span>
        )
      };
    },
    (locale) => {
      const distractorsList = locale === 'el'
        ? ['Ρητός αριθμός', 'Ακέραιος αριθμός', 'Περιοδικός δεκαδικός', 'Φυσικός αριθμός', 'Μιγαδικός αριθμός']
        : ['Rational number', 'Integer number', 'Periodic decimal', 'Natural number', 'Complex number'];
      return {
        title: locale === 'el' ? 'Φύση του π' : 'Nature of π',
        prompt: locale === 'el' ? 'Ο αριθμός π είναι:' : 'The number π is:',
        type: 'mcq',
        correct: locale === 'el' ? 'Άρρητος αριθμός' : 'Irrational number',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        explanation: locale === 'el' ? 'Ο αριθμός π έχει άπειρα δεκαδικά ψηφία χωρίς περίοδο.' : 'Number π has infinite decimal digits without period.'
      };
    },
    (locale) => ({
      title: locale === 'el' ? 'Προσέγγιση του √2' : 'Approximation of √2',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποια είναι η προσέγγιση δεκάτου με έλλειψη του' : 'What is the tenth approximation by defect of'} <Radical>2</Radical> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: locale === 'el' ? '1,4' : '1.4',
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          {locale === 'el' ? '1,4' : '1.4'}<sup>2</sup> ＝ {locale === 'el' ? '1,96' : '1.96'} ＜ 2 ＜ {locale === 'el' ? '2,25' : '2.25'} ＝ ({locale === 'el' ? '1,5' : '1.5'})<sup>2</sup>.
        </span>
      )
    }),
    (locale) => ({
      title: locale === 'el' ? 'Προσέγγιση του √3' : 'Approximation of √3',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποια είναι η προσέγγιση δεκάτου με έλλειψη του' : 'What is the tenth approximation by defect of'} <Radical>3</Radical> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: locale === 'el' ? '1,7' : '1.7',
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          {locale === 'el' ? '1,7' : '1.7'}<sup>2</sup> ＝ {locale === 'el' ? '2,89' : '2.89'} ＜ 3 ＜ {locale === 'el' ? '3,24' : '3.24'} ＝ ({locale === 'el' ? '1,8' : '1.8'})<sup>2</sup>.
        </span>
      )
    }),
    (locale) => {
      const distractorsList = locale === 'el'
        ? ['Άρρητος περίπου 7,1', 'Μη πραγματικός', 'Περιοδικός δεκαδικός', 'Αρνητικός ακέραιος', 'Κλασματικός μη ακέραιος']
        : ['Irrational about 7.1', 'Non-real', 'Periodic decimal', 'Negative integer', 'Fractional non-integer'];
      return {
        title: locale === 'el' ? 'Χαρακτηρισμός Ρίζας Τέλειου Τετραγώνου' : 'Characterization of Perfect Square Root',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            {locale === 'el' ? 'Ο αριθμός' : 'The number'} <Radical>49</Radical> {locale === 'el' ? 'είναι:' : 'is:'}
          </span>
        ),
        type: 'mcq',
        correct: locale === 'el' ? 'Ρητός (φυσικός) ίσος με 7' : 'Rational (natural) equal to 7',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        explanation: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>49</Radical> ＝ 7 ∈ ℕ.</span>
      };
    },
    (locale) => ({
      title: locale === 'el' ? 'Ακέραιο Μέρος Ρίζας' : 'Integer Part of Root',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποιο είναι το ακέραιο μέρος του' : 'What is the integer part of'} <Radical>10</Radical> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: 3,
      explanation: <span className="inline-flex items-center whitespace-nowrap gap-1">3<sup>2</sup> ＝ 9 ＜ 10 ＜ 16 ＝ 4<sup>2</sup>.</span>
    }),
    (locale) => ({
      title: locale === 'el' ? 'Ακέραιο Μέρος του √15' : 'Integer Part of √15',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποιο είναι το ακέραιο μέρος του' : 'What is the integer part of'} <Radical>15</Radical> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: 3,
      explanation: <span className="inline-flex items-center whitespace-nowrap gap-1">3<sup>2</sup> ＝ 9 ＜ 15 ＜ 16 ＝ 4<sup>2</sup>.</span>
    }),
    (locale) => {
      const distractorsList = locale === 'el'
        ? ['Πεπερασμένα ψηφία', 'Άπειρα ψηφία με περίοδο', 'Μηδενικό δεκαδικό μέρος', 'Περιοδικότητα ανά 2 ψηφία', 'Μόνο άρτιους αριθμούς']
        : ['Finite digits', 'Infinite digits with period', 'Zero decimal part', 'Periodicity every 2 digits', 'Only even numbers'];
      return {
        title: locale === 'el' ? 'Χαρακτηριστικό Άρρητου' : 'Characteristic of Irrational',
        prompt: locale === 'el' ? 'Ποιο είναι το κύριο χαρακτηριστικό του δεκαδικού αναπτύγματος ενός άρρητου;' : 'What is the main characteristic of the decimal expansion of an irrational?',
        type: 'mcq',
        correct: locale === 'el' ? 'Άπειρα ψηφία χωρίς περίοδο' : 'Infinite digits without period',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        explanation: locale === 'el' ? 'Οι άρρητοι έχουν άπειρα μη περιοδικά δεκαδικά ψηφία.' : 'Irrationals have infinite non-periodic decimal digits.'
      };
    },
    (locale) => ({
      title: locale === 'el' ? 'Προσέγγιση του √5' : 'Approximation of √5',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποια είναι η προσέγγιση δεκάτου με έλλειψη του' : 'What is the tenth approximation by defect of'} <Radical>5</Radical> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: locale === 'el' ? '2,2' : '2.2',
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          {locale === 'el' ? '2,2' : '2.2'}<sup>2</sup> ＝ {locale === 'el' ? '4,84' : '4.84'} ＜ 5 ＜ {locale === 'el' ? '5,29' : '5.29'} ＝ ({locale === 'el' ? '2,3' : '2.3'})<sup>2</sup>.
        </span>
      )
    }),
    (locale) => ({
      title: locale === 'el' ? 'Σφάλμα στο Εκατοστό' : 'Error at Hundredth',
      prompt: locale === 'el' ? 'Στην προσέγγιση άρρητου στο εκατοστό (0,01), ποιο είναι το μέγιστο σφάλμα;' : 'In irrational approximation to the hundredth (0.01), what is the maximum error?',
      type: 'input',
      correct: locale === 'el' ? '0,01' : '0.01',
      explanation: locale === 'el' ? 'Το εύρος μεταξύ ελλιπούς και υπερβολικής προσέγγισης είναι 0,01.' : 'The range between defect and excess approximation is 0.01.'
    })
  ],

  // ΚΕΦΑΛΑΙΟ 3: Πραγματικοί αριθμοί (Σύνολα & Διάταξη)
  chap3: [
    (locale) => {
      const distractorsList = ['ℤ ⊆ ℕ ⊆ ℚ ⊆ ℝ', 'ℕ ⊆ ℚ ⊆ ℤ ⊆ ℝ', 'ℚ ⊆ ℤ ⊆ ℕ ⊆ ℝ', 'ℕ ⊆ ℤ ⊆ ℝ ⊆ ℚ', 'ℤ ⊆ ℚ ⊆ ℕ ⊆ ℝ'];
      return {
        title: locale === 'el' ? 'Σχέση Υποσυνόλων' : 'Subset Relation',
        prompt: locale === 'el' ? 'Ποια είναι η σωστή ιεραρχία εγκλεισμού των συνόλων;' : 'What is the correct inclusion hierarchy of sets?',
        type: 'mcq',
        correct: 'ℕ ⊆ ℤ ⊆ ℚ ⊆ ℝ',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        explanation: locale === 'el' ? 'Φυσικοί ⊆ Ακέραιοι ⊆ Ρητοί ⊆ Πραγματικοί.' : 'Naturals ⊆ Integers ⊆ Rationals ⊆ Reals.'
      };
    },
    (locale) => {
      const distractorsList = locale === 'el'
        ? ['Ισούται με －2', 'Ισούται με 2', 'Είναι άρρητος αριθμός', 'Ισούται με 0', 'Ισούται με 4']
        : ['Equals －2', 'Equals 2', 'Is irrational number', 'Equals 0', 'Equals 4'];
      return {
        title: locale === 'el' ? 'Ρίζα Αρνητικού Αριθμού' : 'Root of Negative Number',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            {locale === 'el' ? 'Η παράσταση' : 'The expression'} <Radical>－4</Radical> {locale === 'el' ? 'στο σύνολο ℝ:' : 'in set ℝ:'}
          </span>
        ),
        type: 'mcq',
        correct: locale === 'el' ? 'Δεν ορίζεται' : 'Is not defined',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        explanation: locale === 'el' ? 'Δεν υπάρχει πραγματικός αριθμός με αρνητικό τετράγωνο.' : 'There is no real number with a negative square.'
      };
    },
    (locale) => {
      const a = randInt(4, 8);
      return {
        title: locale === 'el' ? 'Απόλυτη Τιμή Αρνητικού' : 'Absolute Value of Negative',
        prompt: locale === 'el' ? `Πόσο ισούται η απόλυτη τιμή |－${a}|;` : `What is the absolute value |－${a}|?`,
        type: 'input',
        correct: a,
        explanation: `|－${a}| ＝ ${a}.`
      };
    },
    (locale) => {
      const distractorsList = locale === 'el'
        ? ['－3 ＞ －1,5', '－3 ＝ －1,5', 'Δεν συγκρίνονται', '－3 ≥ －1,5', '－1,5 ＜ －3']
        : ['－3 ＞ －1.5', '－3 ＝ －1.5', 'Not comparable', '－3 ≥ －1.5', '－1.5 ＜ －3'];
      return {
        title: locale === 'el' ? 'Σύγκριση Αρνητικών Αριθμών' : 'Comparison of Negative Numbers',
        prompt: locale === 'el' ? 'Ποια είναι η σωστή σχέση ανάμεσα στο －3 και στο －1,5;' : 'What is the correct relation between －3 and －1.5?',
        type: 'mcq',
        correct: locale === 'el' ? '－3 ＜ －1,5' : '－3 ＜ －1.5',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        explanation: locale === 'el' ? 'Στον άξονα το －3 βρίσκεται αριστερότερα του －1,5.' : 'On the axis, －3 is to the left of －1.5.'
      };
    },
    (locale) => {
      const distractorsList = locale === 'el'
        ? ['Το σύνολο ℕ', 'Το μηδέν {0}', 'Όλο το ℝ', 'Το σύνολο ℤ', 'Το σύνολο ℚ']
        : ['Set ℕ', 'Zero {0}', 'All of ℝ', 'Set ℤ', 'Set ℚ'];
      return {
        title: locale === 'el' ? 'Τομή Ρητών και Άρρητων' : 'Intersection of Rationals and Irrationals',
        prompt: locale === 'el' ? 'Ποια είναι η τομή ℚ ∩ Άρρητοι;' : 'What is the intersection ℚ ∩ Irrationals?',
        type: 'mcq',
        correct: locale === 'el' ? 'Το κενό σύνολο (∅)' : 'The empty set (∅)',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        explanation: locale === 'el' ? 'Ένας αριθμός δεν μπορεί να είναι ταυτόχρονα ρητός και άρρητος.' : 'A number cannot be both rational and irrational.'
      };
    },
    (locale) => ({
      title: locale === 'el' ? 'Τετράγωνο Ρίζας' : 'Square of Root',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Πόσο ισούται η παράσταση' : 'What is the value of'} (<Radical>7</Radical>)<sup>2</sup> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: 7,
      explanation: <span className="inline-flex items-center whitespace-nowrap gap-1">(<Radical>7</Radical>)<sup>2</sup> ＝ 7.</span>
    }),
    (locale) => {
      const distractorsList = locale === 'el'
        ? ['Μόνο στο ℤ', 'Μόνο στο ℚ', 'Στους Άρρητους', 'Μόνο στο ℝ', 'Σε κανένα σύνολο']
        : ['Only in ℤ', 'Only in ℚ', 'In Irrationals', 'Only in ℝ', 'In no set'];
      return {
        title: locale === 'el' ? 'Σύνολο του 0' : 'Set of 0',
        prompt: locale === 'el' ? 'Ποιο είναι το μικρότερο αριθμητικό σύνολο στο οποίο ανήκει το 0;' : 'What is the smallest numerical set that 0 belongs to?',
        type: 'mcq',
        correct: locale === 'el' ? 'ℕ (Φυσικοί αριθμοί)' : 'ℕ (Natural numbers)',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        explanation: '0 ∈ ℕ.'
      };
    },
    (locale) => {
      const distractorsList = locale === 'el'
        ? ['√7 ＜ 2,6', '√7 ＝ 2,6', 'Δεν συγκρίνονται', '√7 ≤ 2,6', '2,6 ＞ √7']
        : ['√7 ＜ 2.6', '√7 ＝ 2.6', 'Not comparable', '√7 ≤ 2.6', '2.6 ＞ √7'];
      return {
        title: locale === 'el' ? 'Σύγκριση Ρίζας με Ρητό' : 'Comparison of Root with Rational',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            {locale === 'el' ? 'Ποια είναι η σχέση ανάμεσα στο' : 'What is the relation between'} <Radical>7</Radical> {locale === 'el' ? 'και στο 2,6;' : 'and 2.6?'}
          </span>
        ),
        type: 'mcq',
        correct: locale === 'el' ? '√7 ＞ 2,6' : '√7 ＞ 2.6',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        renderOption: (opt) => {
          if (opt === '√7 ＞ 2,6' || opt === '√7 ＞ 2.6') return <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>7</Radical> ＞ {locale === 'el' ? '2,6' : '2.6'}</span>;
          if (opt === '√7 ＜ 2,6' || opt === '√7 ＜ 2.6') return <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>7</Radical> ＜ {locale === 'el' ? '2,6' : '2.6'}</span>;
          if (opt === '√7 ＝ 2,6' || opt === '√7 ＝ 2.6') return <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>7</Radical> ＝ {locale === 'el' ? '2,6' : '2.6'}</span>;
          return opt;
        },
        explanation: (
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            7 ＞ ({locale === 'el' ? '2,6' : '2.6'})<sup>2</sup> ＝ {locale === 'el' ? '6,76' : '6.76'}.
          </span>
        )
      };
    },
    (locale) => {
      const distractorsList = locale === 'el'
        ? ['Μόνο ρητούς αριθμούς', 'Δύο αριθμούς', 'Άπειρα κενά', 'Μόνο ακέραιους αριθμούς', 'Μόνο άρρητους αριθμούς']
        : ['Only rational numbers', 'Two numbers', 'Infinite gaps', 'Only integer numbers', 'Only irrational numbers'];
      return {
        title: locale === 'el' ? 'Πληρότητα Άξονα' : 'Axis Completeness',
        prompt: locale === 'el' ? 'Κάθε σημείο του άξονα των πραγματικών αριθμών παριστάνει:' : 'Every point on the real number axis represents:',
        type: 'mcq',
        correct: locale === 'el' ? 'Έναν μοναδικό πραγματικό αριθμό' : 'A unique real number',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        explanation: locale === 'el' ? 'Η αντιστοιχία σημείων και πραγματικών αριθμών είναι 1-προς-1.' : 'The correspondence between points and real numbers is 1-to-1.'
      };
    },
    (locale) => ({
      title: locale === 'el' ? 'Απόσταση Σημείων' : 'Distance of Points',
      prompt: locale === 'el' ? 'Πόση είναι η απόσταση ανάμεσα στα σημεία －2 και 5 στον άξονα;' : 'What is the distance between points －2 and 5 on the axis?',
      type: 'input',
      correct: 7,
      explanation: '|5 － (－2)| ＝ 7.'
    })
  ],

  // ΚΕΦΑΛΑΙΟ 4: Πράξεις πραγματικών αριθμών
  chap4: [
    (locale) => {
      const a = randInt(2, 5);
      const b = randInt(2, 4);
      return {
        title: locale === 'el' ? 'Γινόμενο Αρνητικών Αριθμών' : 'Product of Negative Numbers',
        prompt: locale === 'el' ? `Πόσο ισούται το γινόμενο (－${a}) · (－${b});` : `What is the product (－${a}) · (－${b})?`,
        type: 'input',
        correct: a * b,
        explanation: `(－) · (－) ＝ ＋, άρα ${a * b}.`
      };
    },
    (locale) => {
      const distractorsList = ['4/3', '3/4', '－3/4', '－1/3', '3/1'];
      return {
        title: locale === 'el' ? 'Αντίστροφος Αριθμός' : 'Reciprocal Number',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            {locale === 'el' ? 'Ποιος είναι ο αντίστροφος του αριθμού' : 'What is the reciprocal of number'} －<Frac num="3" den="4" /> {locale === 'el' ? '；' : '?'}
          </span>
        ),
        type: 'mcq',
        correct: '－4/3',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        renderOption: (opt) => {
          const parts = String(opt).split('/');
          return parts.length === 2 ? (
            <span className="inline-flex items-center whitespace-nowrap gap-0.5">
              {opt.startsWith('－') && '－'}<Frac num={parts[0].replace('－','')} den={parts[1]} />
            </span>
          ) : opt;
        },
        explanation: (
          <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
            <span>{locale === 'el' ? 'Ο αντίστροφος διατηρεί το πρόσημο:' : 'The reciprocal keeps the sign:'}</span>
            <span className="inline-flex items-center whitespace-nowrap gap-1">
              (－<Frac num="3" den="4" />) · (－<Frac num="4" den="3" />) ＝ 1.
            </span>
          </span>
        )
      };
    },
    (locale) => {
      const k = randInt(3, 7);
      const distractorsList = [`${k + 2}·√4`, `${k * 2}·√2`, `${k + 2}`, `${k + 1}·√2`, `${k + 4}·√2`];
      return {
        title: locale === 'el' ? 'Πρόσθεση Ομοίων Ριζών' : 'Addition of Like Radicals',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            {locale === 'el' ? 'Πόσο ισούται το άθροισμα' : 'What is the sum'} {k} · <Radical>2</Radical> ＋ 2 · <Radical>2</Radical> {locale === 'el' ? '；' : '?'}
          </span>
        ),
        type: 'mcq',
        correct: `${k + 2}·√2`,
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        renderOption: (opt) => {
          if (opt === `${k + 2}·√2`) return <span className="inline-flex items-center whitespace-nowrap gap-1">{k + 2} · <Radical>2</Radical></span>;
          if (opt === `${k + 2}·√4`) return <span className="inline-flex items-center whitespace-nowrap gap-1">{k + 2} · <Radical>4</Radical></span>;
          if (opt === `${k * 2}·√2`) return <span className="inline-flex items-center whitespace-nowrap gap-1">{k * 2} · <Radical>2</Radical></span>;
          if (opt === `${k + 1}·√2`) return <span className="inline-flex items-center whitespace-nowrap gap-1">{k + 1} · <Radical>2</Radical></span>;
          if (opt === `${k + 4}·√2`) return <span className="inline-flex items-center whitespace-nowrap gap-1">{k + 4} · <Radical>2</Radical></span>;
          return opt;
        },
        explanation: (
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            ({k} ＋ 2) · <Radical>2</Radical> ＝ {k + 2} · <Radical>2</Radical>.
          </span>
        )
      };
    },
    (locale) => ({
      title: locale === 'el' ? 'Ουδέτερο Στοιχείο Πολλαπλασιασμού' : 'Multiplicative Identity Element',
      prompt: locale === 'el' ? 'Ποιο είναι το ουδέτερο στοιχείο του πολλαπλασιασμού στο ℝ;' : 'What is the multiplicative identity element in ℝ?',
      type: 'input',
      correct: 1,
      explanation: 'α · 1 ＝ α.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Ουδέτερο Στοιχείο Πρόσθεσης' : 'Additive Identity Element',
      prompt: locale === 'el' ? 'Ποιο είναι το ουδέτερο στοιχείο της πρόσθεσης στο ℝ;' : 'What is the additive identity element in ℝ?',
      type: 'input',
      correct: 0,
      explanation: 'α ＋ 0 ＝ α.'
    }),
    (locale) => {
      const distractorsList = locale === 'el'
        ? ['Ισούται με √5', 'Ισούται με √6', 'Ισούται με 5', 'Ισούται με 2·√5', 'Ισούται με 1']
        : ['Equals √5', 'Equals √6', 'Equals 5', 'Equals 2·√5', 'Equals 1'];
      return {
        title: locale === 'el' ? 'Πρόσθεση Μη Όμοιων Ριζών' : 'Addition of Unlike Radicals',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            {locale === 'el' ? 'Η έκφραση' : 'The expression'} <Radical>2</Radical> ＋ <Radical>3</Radical> {locale === 'el' ? ':' : ':'}
          </span>
        ),
        type: 'mcq',
        correct: locale === 'el' ? 'Δεν απλοποιείται (δεν ισούται με √5)' : 'Cannot be simplified (not equal to √5)',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        explanation: locale === 'el' ? 'Προσθέτουμε αποκλειστικά όμοιες ρίζες.' : 'We only add like radicals.'
      };
    },
    (locale) => {
      const v = randInt(4, 9);
      return {
        title: locale === 'el' ? 'Άθροισμα Αντιθέτων' : 'Sum of Opposites',
        prompt: locale === 'el' ? `Πόσο ισούται η παράσταση ${v} ＋ (－${v});` : `What is the value of ${v} ＋ (－${v})?`,
        type: 'input',
        correct: 0,
        explanation: 'α ＋ (－α) ＝ 0.'
      };
    },
    (locale) => {
      const distractorsList = ['3x ＋ 2', 'x ＋ 6', '3x ＋ 5', '3x － 6', '6x ＋ 3'];
      return {
        title: locale === 'el' ? 'Επιμεριστική Ιδιότητα' : 'Distributive Property',
        prompt: locale === 'el' ? 'Ποιο είναι το ανάπτυγμα του 3 · (x ＋ 2);' : 'What is the expansion of 3 · (x ＋ 2)?',
        type: 'mcq',
        correct: '3x ＋ 6',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        explanation: '3 · x ＋ 3 · 2 ＝ 3x ＋ 6.'
      };
    },
    (locale) => {
      const distractorsList = ['－x － 4', 'x ＋ 4', 'x － 4', '－x ＋ 2', '－x － 2'];
      return {
        title: locale === 'el' ? 'Απαλοιφή με Μείον' : 'Elimination with Minus',
        prompt: locale === 'el' ? 'Ποια είναι η απλοποίηση της έκφρασης －(x － 4);' : 'What is the simplification of －(x － 4)?',
        type: 'mcq',
        correct: '－x ＋ 4',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        explanation: locale === 'el' ? 'Το μείον αντιστρέφει όλα τα πρόσημα εντός της παρένθεσης.' : 'The minus sign reverses all signs inside the parenthesis.'
      };
    },
    (locale) => ({
      title: locale === 'el' ? 'Γινόμενο με Αντίστροφο' : 'Product with Reciprocal',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Πόσο ισούται το γινόμενο' : 'What is the product'} <Radical>5</Radical> · <Frac num="1" den={<Radical>5</Radical>} /> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: 1,
      explanation: 'α · (1/α) ＝ 1.'
    })
  ],

  // ΚΕΦΑΛΑΙΟ 5: Δυνάμεις πραγματικών αριθμών
  chap5: [
    (locale) => {
      const n = randInt(2, 4);
      const p = Math.pow(2, n);
      const distractorsList = [`－${p}`, `1/${2 * n}`, `－${2 * n}`, `1/${p * 2}`, `${p}`];
      return {
        title: locale === 'el' ? 'Αρνητικός Εκθέτης' : 'Negative Exponent',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            {locale === 'el' ? 'Ποιο είναι το αποτέλεσμα της δύναμης' : 'What is the result of'} 2<sup>－{n}</sup> {locale === 'el' ? '；' : '?'}
          </span>
        ),
        type: 'mcq',
        correct: `1/${p}`,
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        renderOption: (opt) => {
          const parts = String(opt).split('/');
          return parts.length === 2 ? <Frac num={parts[0]} den={parts[1]} /> : opt;
        },
        explanation: (
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            2<sup>－{n}</sup> ＝ <Frac num="1" den={<>2<sup>{n}</sup></>} /> ＝ <Frac num="1" den={p} />.
          </span>
        )
      };
    },
    (locale) => ({
      title: locale === 'el' ? 'Μηδενικός Εκθέτης' : 'Zero Exponent',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Πόσο ισούται η δύναμη 7' : 'What is 7'}<sup>0</sup> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: 1,
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          α<sup>0</sup> ＝ 1 {locale === 'el' ? 'για κάθε α ≠ 0.' : 'for any a ≠ 0.'}
        </span>
      )
    }),
    (locale) => ({
      title: locale === 'el' ? 'Δύναμη με και χωρίς Παρένθεση' : 'Power with and without Parenthesis',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποιο είναι το αποτέλεσμα της παράστασης －4' : 'What is the result of －4'}<sup>2</sup> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: -16,
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          －4<sup>2</sup> ＝ －(4 · 4) ＝ －16.
        </span>
      )
    }),
    (locale) => ({
      title: locale === 'el' ? 'Άρτιος Εκθέτης σε Αρνητική Βάση' : 'Even Exponent on Negative Base',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποιο είναι το αποτέλεσμα της δύναμης (－3)' : 'What is the result of (－3)'}<sup>2</sup> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: 9,
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          (－3)<sup>2</sup> ＝ ＋9.
        </span>
      )
    }),
    (locale) => ({
      title: locale === 'el' ? 'Γινόμενο Δυνάμεων' : 'Product of Powers',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποιος είναι ο εκθέτης του 2 στο γινόμενο 2' : 'What is the exponent of 2 in 2'}<sup>3</sup> · 2<sup>4</sup> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: 7,
      explanation: '3 ＋ 4 ＝ 7.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Πηλίκο Δυνάμεων' : 'Quotient of Powers',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποιος είναι ο εκθέτης του 3 στο πηλίκο' : 'What is the exponent of 3 in quotient'} <Frac num={<>3<sup>6</sup></>} den={<>3<sup>2</sup></>} /> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: 4,
      explanation: '6 － 2 ＝ 4.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Δύναμη Δύναμης' : 'Power of a Power',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποιος είναι ο εκθέτης του 5 στην παράσταση (5' : 'What is exponent of 5 in (5'}<sup>2</sup>)<sup>3</sup> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: 6,
      explanation: '2 · 3 ＝ 6.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Τυποποιημένη Μορφή' : 'Standard Form',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποιος είναι ο εκθέτης k στην τυποποιημένη μορφή του 500.000 ＝ 5 · 10' : 'What is exponent k in standard form 500,000 ＝ 5 · 10'}<sup>k</sup> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: 5,
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          {locale === 'el' ? '500.000' : '500,000'} ＝ 5 · 10<sup>5</sup>.
        </span>
      )
    }),
    (locale) => {
      const distractorsList = ['4 · 10⁻³', '40 · 10⁻⁵', '0,4 · 10⁻³', '4 · 10⁻⁵', '0,04 · 10⁻²'];
      return {
        title: locale === 'el' ? 'Τυποποιημένη Μικρού Αριθμού' : 'Standard Form of Small Number',
        prompt: locale === 'el' ? 'Ποια είναι η τυποποιημένη μορφή του 0,0004;' : 'What is the standard form of 0.0004?',
        type: 'mcq',
        correct: '4 · 10⁻⁴',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        renderOption: (opt) => {
          if (opt === '4 · 10⁻⁴') return <span>4 · 10<sup>－4</sup></span>;
          if (opt === '4 · 10⁻³') return <span>4 · 10<sup>－3</sup></span>;
          if (opt === '40 · 10⁻⁵') return <span>40 · 10<sup>－5</sup></span>;
          if (opt === '0,4 · 10⁻³') return <span>0,4 · 10<sup>－3</sup></span>;
          if (opt === '4 · 10⁻⁵') return <span>4 · 10<sup>－5</sup></span>;
          return opt;
        },
        explanation: (
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            4 · 10<sup>－4</sup>.
          </span>
        )
      };
    },
    (locale) => ({
      title: locale === 'el' ? 'Δύναμη του (－1)' : 'Power of (－1)',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Πόσο ισούται η παράσταση (－1)' : 'What is (－1)'}<sup>99</sup> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: -1,
      explanation: locale === 'el' ? 'Περιττός εκθέτης ⇒ －1.' : 'Odd exponent ⇒ －1.'
    })
  ],

  // ΚΕΦΑΛΑΙΟ 6: Ιδιότητες τετραγωνικών ριζών
  chap6: [
    (locale) => ({
      title: locale === 'el' ? 'Τετράγωνο Αρνητικού υπό Ρίζα' : 'Square of Negative under Root',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Πόσο ισούται η παράσταση' : 'What is'} <Radical>(－8)<sup>2</sup></Radical> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: 8,
      explanation: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>(－8)<sup>2</sup></Radical> ＝ |－8| ＝ 8.</span>
    }),
    (locale) => ({
      title: locale === 'el' ? 'Γινόμενο Ριζών' : 'Product of Roots',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Πόσο ισούται το γινόμενο' : 'What is'} <Radical>3</Radical> · <Radical>12</Radical> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: 6,
      explanation: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>3 · 12</Radical> ＝ <Radical>36</Radical> ＝ 6.</span>
    }),
    (locale) => ({
      title: locale === 'el' ? 'Πηλίκο Ριζών' : 'Quotient of Roots',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Πόσο ισούται το πηλίκο' : 'What is'} <Frac num={<Radical>32</Radical>} den={<Radical>2</Radical>} /> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: 4,
      explanation: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical><Frac num="32" den="2" /></Radical> ＝ <Radical>16</Radical> ＝ 4.</span>
    }),
    (locale) => {
      const distractorsList = ['3·√2', '4·√3', '6·√2', '2·√6', '6·√3'];
      return {
        title: locale === 'el' ? 'Εξαγωγή Παράγοντα από το √12' : 'Extracting Factor from √12',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            {locale === 'el' ? 'Ποια είναι η απλοποιημένη μορφή του' : 'What is simplified form of'} <Radical>12</Radical> {locale === 'el' ? '；' : '?'}
          </span>
        ),
        type: 'mcq',
        correct: '2·√3',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        renderOption: (opt) => {
          if (opt === '2·√3') return <span className="inline-flex items-center whitespace-nowrap gap-1">2 · <Radical>3</Radical></span>;
          if (opt === '3·√2') return <span className="inline-flex items-center whitespace-nowrap gap-1">3 · <Radical>2</Radical></span>;
          if (opt === '4·√3') return <span className="inline-flex items-center whitespace-nowrap gap-1">4 · <Radical>3</Radical></span>;
          if (opt === '6·√2') return <span className="inline-flex items-center whitespace-nowrap gap-1">6 · <Radical>2</Radical></span>;
          if (opt === '2·√6') return <span className="inline-flex items-center whitespace-nowrap gap-1">2 · <Radical>6</Radical></span>;
          return opt;
        },
        explanation: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>4 · 3</Radical> ＝ 2 · <Radical>3</Radical>.</span>
      };
    },
    (locale) => ({
      title: locale === 'el' ? 'Εξαγωγή Παράγοντα από το √50' : 'Extracting Factor from √50',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποιος είναι ο συντελεστής α αν' : 'What is coefficient a if'} <Radical>50</Radical> ＝ {locale === 'el' ? 'α' : 'a'} · <Radical>2</Radical> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: 5,
      explanation: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>25 · 2</Radical> ＝ 5 · <Radical>2</Radical>.</span>
    }),
    (locale) => {
      const distractorsList = ['3·√2', '2', '6·√3', '2·√2', '3·√3'];
      return {
        title: locale === 'el' ? 'Ρητοποίηση Παρονομαστή' : 'Rationalizing Denominator',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            {locale === 'el' ? 'Πόσο ισούται το κλάσμα' : 'What is'} <Frac num="6" den={<Radical>3</Radical>} /> {locale === 'el' ? 'μετά από ρητοποίηση;' : 'after rationalization?'}
          </span>
        ),
        type: 'mcq',
        correct: '2·√3',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        renderOption: (opt) => {
          if (opt === '2·√3') return <span className="inline-flex items-center whitespace-nowrap gap-1">2 · <Radical>3</Radical></span>;
          if (opt === '3·√2') return <span className="inline-flex items-center whitespace-nowrap gap-1">3 · <Radical>2</Radical></span>;
          if (opt === '6·√3') return <span className="inline-flex items-center whitespace-nowrap gap-1">6 · <Radical>3</Radical></span>;
          if (opt === '2·√2') return <span className="inline-flex items-center whitespace-nowrap gap-1">2 · <Radical>2</Radical></span>;
          return opt;
        },
        explanation: (
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            <Frac num={<span className="inline-flex items-center gap-0.5 whitespace-nowrap">6 · <Radical>3</Radical></span>} den="3" /> ＝ 2 · <Radical>3</Radical>.
          </span>
        )
      };
    },
    (locale) => {
      const distractorsList = ['2/√2', '1/2', '√2/4', '2/4', '1/√2'];
      return {
        title: locale === 'el' ? 'Ρητοποίηση του 1/√2' : 'Rationalization of 1/√2',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            {locale === 'el' ? 'Σε ποιο κλάσμα ισούται το' : 'What fraction equals'} <Frac num="1" den={<Radical>2</Radical>} /> {locale === 'el' ? '；' : '?'}
          </span>
        ),
        type: 'mcq',
        correct: '√2/2',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        renderOption: (opt) => {
          if (opt === '√2/2') return <Frac num={<Radical>2</Radical>} den="2" />;
          if (opt === '2/√2') return <Frac num="2" den={<Radical>2</Radical>} />;
          if (opt === '1/2') return <Frac num="1" den="2" />;
          if (opt === '√2/4') return <Frac num={<Radical>2</Radical>} den="4" />;
          if (opt === '1/√2') return <Frac num="1" den={<Radical>2</Radical>} />;
          return opt;
        },
        explanation: (
          <span className="inline-flex items-center whitespace-nowrap">
            <Frac num={<Radical>2</Radical>} den="2" />.
          </span>
        )
      };
    },
    (locale) => {
      const distractorsList = ['√21', '3·√3', '2·√3', '4·√3', '√15'];
      return {
        title: locale === 'el' ? 'Απλοποίηση Διαφοράς Ριζών' : 'Simplifying Difference of Roots',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            {locale === 'el' ? 'Πόσο ισούται η διαφορά' : 'What is the difference'} <Radical>48</Radical> － <Radical>27</Radical> {locale === 'el' ? '；' : '?'}
          </span>
        ),
        correct: '√3',
        type: 'mcq',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        renderOption: (opt) => {
          if (opt === '√3') return <Radical>3</Radical>;
          if (opt === '√21') return <Radical>21</Radical>;
          if (opt === '3·√3') return <span className="inline-flex items-center whitespace-nowrap gap-1">3 · <Radical>3</Radical></span>;
          if (opt === '2·√3') return <span className="inline-flex items-center whitespace-nowrap gap-1">2 · <Radical>3</Radical></span>;
          if (opt === '4·√3') return <span className="inline-flex items-center whitespace-nowrap gap-1">4 · <Radical>3</Radical></span>;
          return opt;
        },
        explanation: (
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            4 · <Radical>3</Radical> － 3 · <Radical>3</Radical> ＝ <Radical>3</Radical>.
          </span>
        )
      };
    },
    (locale) => ({
      title: locale === 'el' ? 'Γινόμενο Ριζών' : 'Product of Roots',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Πόσο ισούται το γινόμενο' : 'What is'} <Radical>5</Radical> · <Radical>20</Radical> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: 10,
      explanation: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>100</Radical> ＝ 10.</span>
    }),
    (locale) => ({
      title: locale === 'el' ? 'Ρίζα Αθροίσματος' : 'Root of Sum',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Πόσο ισούται η παράσταση' : 'What is'} <Radical>16 ＋ 9</Radical> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: 5,
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          <Radical>25</Radical> ＝ 5 {locale === 'el' ? '(και όχι 4 ＋ 3 ＝ 7).' : '(and not 4 ＋ 3 ＝ 7).'}
        </span>
      )
    })
  ]
};

// =========================================================================
// ΔΕΞΑΜΕΝΕΣ ΣΥΝΘΕΤΩΝ ΠΡΟΒΛΗΜΑΤΩΝ (1 ΑΠΟ ΚΑΘΕ ΚΕΦΑΛΑΙΟ = 6 ΠΡΟΒΛΗΜΑΤΑ)
// =========================================================================

const POOLS_PROBLEMS = {
  // ΠΡΟΒΛΗΜΑ ΚΕΦΑΛΑΙΟΥ 1 (Q13)
  prob1: [
    (locale) => ({
      title: locale === 'el' ? 'Μετατροπή Περιοδικού σε Ανάγωγο Κλάσμα' : 'Converting Periodic to Irreducible Fraction',
      prompt: locale === 'el' ? 'Ποιο είναι το άθροισμα αριθμητή και παρονομαστή του ανάγωγου κλάσματος που ισούται με τον περιοδικό δεκαδικό 0,444...;' : 'What is the sum of numerator and denominator of the irreducible fraction equal to 0.444...?',
      type: 'input',
      correct: 13,
      tableData: [
        { label: locale === 'el' ? 'Κλασματική μορφή' : 'Fraction form', details: <span className="inline-flex items-center whitespace-nowrap gap-1">{locale === 'el' ? '0,444...' : '0.444...'} ＝ <Frac num="4" den="9" /></span> },
        { label: locale === 'el' ? 'Άθροισμα όρων' : 'Sum of terms', details: <span className="inline-flex items-center whitespace-nowrap">4 ＋ 9 ＝ 13</span> }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span>{locale === 'el' ? 'Το ανάγωγο κλάσμα είναι' : 'Irreducible fraction is'}</span>
          <span className="inline-flex items-center whitespace-nowrap"><Frac num="4" den="9" />.</span>
          <span>{locale === 'el' ? 'Άρα 4 ＋ 9 ＝ 13.' : 'So 4 ＋ 9 ＝ 13.'}</span>
        </span>
      )
    }),
    (locale) => ({
      title: locale === 'el' ? 'Γεννήτρια Μορφή του 0,1666...' : 'Generating Form of 0.1666...',
      prompt: locale === 'el' ? 'Ποιος είναι ο παρονομαστής του ανάγωγου κλάσματος που ισούται με τον μικτό περιοδικό 0,1666...;' : 'What is the denominator of the irreducible fraction equal to 0.1666...?',
      type: 'input',
      correct: 6,
      tableData: [
        { label: locale === 'el' ? 'Υπολογισμός 90x' : 'Calculate 90x', details: <span className="inline-flex items-center whitespace-nowrap">100x － 10x ＝ 15 ⇒ 90x ＝ 15</span> },
        { label: locale === 'el' ? 'Ανάγωγο κλάσμα' : 'Irreducible fraction', details: <span className="inline-flex items-center whitespace-nowrap"><Frac num="15" den="90" /> ＝ <Frac num="1" den="6" /></span> }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span>{locale === 'el' ? '0,1666... ＝' : '0.1666... ＝'}</span>
          <span className="inline-flex items-center whitespace-nowrap"><Frac num="1" den="6" />,</span>
          <span>{locale === 'el' ? 'άρα ο παρονομαστής είναι 6.' : 'so denominator is 6.'}</span>
        </span>
      )
    }),
    (locale) => ({
      title: locale === 'el' ? 'Άθροισμα Περιοδικών Δεκαδικών' : 'Sum of Periodic Decimals',
      prompt: locale === 'el' ? 'Ποιο είναι το αποτέλεσμα της πρόσθεσης 0,333... ＋ 0,666...;' : 'What is 0.333... ＋ 0.666...?',
      type: 'input',
      correct: 1,
      tableData: [
        { label: locale === 'el' ? 'Κλάσματα' : 'Fractions', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Frac num="1" den="3" /> ＋ <Frac num="2" den="3" /> ＝ <Frac num="3" den="3" /> ＝ 1</span> }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          <Frac num="1" den="3" /> ＋ <Frac num="2" den="3" /> ＝ 1.
        </span>
      )
    }),
    (locale) => ({
      title: locale === 'el' ? 'Κλάσμα του 0,8333...' : 'Fraction of 0.8333...',
      prompt: locale === 'el' ? 'Ποιος είναι ο αριθμητής του ανάγωγου κλάσματος του αριθμού 0,8333...;' : 'What is the numerator of irreducible fraction of 0.8333...?',
      type: 'input',
      correct: 5,
      tableData: [
        { label: locale === 'el' ? 'Υπολογισμός' : 'Calculation', details: <span className="inline-flex items-center whitespace-nowrap gap-1">90x ＝ 75 ⇒ x ＝ <Frac num="75" den="90" /> ＝ <Frac num="5" den="6" /></span> }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span>{locale === 'el' ? 'Το ανάγωγο κλάσμα είναι' : 'Irreducible fraction is'}</span>
          <span className="inline-flex items-center whitespace-nowrap"><Frac num="5" den="6" />,</span>
          <span>{locale === 'el' ? 'άρα ο αριθμητής είναι 5.' : 'so numerator is 5.'}</span>
        </span>
      )
    }),
    (locale) => ({
      title: locale === 'el' ? 'Διαίρεση 2 Πιτσών σε 3 Παιδιά' : 'Dividing 2 Pizzas to 3 Kids',
      prompt: locale === 'el' ? 'Δύο πίτσες μοιράζονται ισόποσα σε 3 παιδιά. Ποια είναι η περίοδος στον δεκαδικό αριθμό του μεριδίου;' : 'Two pizzas shared equally among 3 kids. What is the period in the decimal share?',
      type: 'input',
      correct: 6,
      tableData: [
        { label: locale === 'el' ? 'Κλάσμα' : 'Fraction', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Frac num="2" den="3" /> ＝ {locale === 'el' ? '0,666...' : '0.666...'}</span> },
        { label: locale === 'el' ? 'Περίοδος' : 'Period', details: '6' }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap gap-1"><Frac num="2" den="3" /> ＝ {locale === 'el' ? '0,666...' : '0.666...'},</span>
          <span>{locale === 'el' ? 'άρα η περίοδος είναι 6.' : 'so period is 6.'}</span>
        </span>
      )
    }),
    (locale) => ({
      title: locale === 'el' ? 'Ισοδύναμο του 1,999...' : 'Equivalent of 1.999...',
      prompt: locale === 'el' ? 'Σε ποιον ακέραιο ισούται ο περιοδικός δεκαδικός αριθμός 1,999...;' : 'Which integer is equal to 1.999...?',
      type: 'input',
      correct: 2,
      tableData: [
        { label: locale === 'el' ? 'Ανάλυση' : 'Analysis', details: <span className="inline-flex items-center whitespace-nowrap gap-1">1 ＋ {locale === 'el' ? '0,999...' : '0.999...'} ＝ 1 ＋ 1 ＝ 2</span> }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          1 ＋ <Frac num="9" den="9" /> ＝ 2.
        </span>
      )
    }),
    (locale) => ({
      title: locale === 'el' ? 'Γεννήτρια του 0,4545...' : 'Generating 0.4545...',
      prompt: locale === 'el' ? 'Ποιος είναι ο παρονομαστής του ανάγωγου κλάσματος του αριθμού 0,4545...;' : 'What is the denominator of irreducible fraction of 0.4545...?',
      type: 'input',
      correct: 11,
      tableData: [
        { label: locale === 'el' ? 'Απλοποίηση' : 'Simplification', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Frac num="45" den="99" /> ＝ <Frac num="5" den="11" /></span> }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap gap-1"><Frac num="45" den="99" /> ＝ <Frac num="5" den="11" />,</span>
          <span>{locale === 'el' ? 'άρα ο παρονομαστής είναι 11.' : 'so denominator is 11.'}</span>
        </span>
      )
    }),
    (locale) => {
      const distractorsList = ['1/30', '1/3', '3/100', '1/3000', '1/100'];
      return {
        title: locale === 'el' ? 'Σύγκριση Περιοδικού με Δεκαδικό' : 'Comparing Periodic with Decimal',
        prompt: locale === 'el' ? 'Πόσο είναι το αποτέλεσμα της αφαίρεσης 0,333... － 0,33 σε μορφή κλάσματος;' : 'What is 0.333... － 0.33 as a fraction?',
        type: 'mcq',
        correct: '1/300',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        renderOption: (opt) => {
          const parts = String(opt).split('/');
          return parts.length === 2 ? <Frac num={parts[0]} den={parts[1]} /> : opt;
        },
        tableData: [
          { label: locale === 'el' ? 'Πράξη' : 'Operation', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Frac num="1" den="3" /> － <Frac num="33" den="100" /> ＝ <Frac num="1" den="300" /></span> }
        ],
        explanation: (
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            <Frac num="1" den="3" /> － <Frac num="33" den="100" /> ＝ <Frac num="1" den="300" />.
          </span>
        )
      };
    },
    (locale) => ({
      title: locale === 'el' ? 'Γεννήτρια του 0,0909...' : 'Generating 0.0909...',
      prompt: locale === 'el' ? 'Ποιος είναι ο παρονομαστής του ανάγωγου κλάσματος του αριθμού 0,0909...;' : 'What is the denominator of irreducible fraction of 0.0909...?',
      type: 'input',
      correct: 11,
      tableData: [
        { label: locale === 'el' ? 'Απλοποίηση' : 'Simplification', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Frac num="9" den="99" /> ＝ <Frac num="1" den="11" /></span> }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap gap-1"><Frac num="9" den="99" /> ＝ <Frac num="1" den="11" />,</span>
          <span>{locale === 'el' ? 'άρα ο παρονομαστής είναι 11.' : 'so denominator is 11.'}</span>
        </span>
      )
    }),
    (locale) => {
      const distractorsList = ['3/10', '3/99', '1/9', '3/100', '2/9'];
      return {
        title: locale === 'el' ? 'Άθροισμα 0,111... και 0,222...' : 'Sum of 0.111... and 0.222...',
        prompt: locale === 'el' ? 'Ποιο κλάσμα εκφράζει το άθροισμα 0,111... ＋ 0,222...;' : 'Which fraction expresses 0.111... ＋ 0.222...?',
        type: 'mcq',
        correct: '1/3',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        renderOption: (opt) => {
          const parts = String(opt).split('/');
          return parts.length === 2 ? <Frac num={parts[0]} den={parts[1]} /> : opt;
        },
        tableData: [
          { label: locale === 'el' ? 'Άθροισμα' : 'Sum', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Frac num="1" den="9" /> ＋ <Frac num="2" den="9" /> ＝ <Frac num="3" den="9" /> ＝ <Frac num="1" den="3" /></span> }
        ],
        explanation: (
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            <Frac num="1" den="9" /> ＋ <Frac num="2" den="9" /> ＝ <Frac num="3" den="9" /> ＝ <Frac num="1" den="3" />.
          </span>
        )
      };
    }
  ],

  // ΠΡΟΒΛΗΜΑ ΚΕΦΑΛΑΙΟΥ 2 (Q14)
  prob2: [
    (locale) => ({
      title: locale === 'el' ? 'Διαγώνιος Τετραγώνου Οικοπέδου' : 'Diagonal of Square Plot',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ένα τετράγωνο οικόπεδο έχει εμβαδόν 50 m' : 'A square plot has area 50 m'}<sup>2</sup>. {locale === 'el' ? 'Πόσο είναι το ακριβές μήκος της διαγωνίου του d σε μέτρα;' : 'What is its exact diagonal length d in meters?'}
        </span>
      ),
      correct: 10,
      type: 'input',
      unit: 'm',
      tableData: [
        { label: locale === 'el' ? 'Πλευρά s' : 'Side s', details: <span className="inline-flex items-center whitespace-nowrap">s<sup>2</sup> ＝ 50</span> },
        { label: locale === 'el' ? 'Πυθαγόρειο d²' : 'Pythagorean d²', details: <span className="inline-flex items-center whitespace-nowrap">d<sup>2</sup> ＝ s<sup>2</sup> ＋ s<sup>2</sup> ＝ 50 ＋ 50 ＝ 100</span> },
        { label: locale === 'el' ? 'Διαγώνιος d' : 'Diagonal d', details: <span className="inline-flex items-center whitespace-nowrap gap-1">d ＝ <Radical>100</Radical> ＝ 10 m</span> }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          d<sup>2</sup> ＝ 50 ＋ 50 ＝ 100 ⇒ d ＝ 10 m.
        </span>
      )
    }),
    (locale) => ({
      title: locale === 'el' ? 'Υποτείνουσα με Κάθετες 2 και 4' : 'Hypotenuse with Legs 2 and 4',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Σε ορθογώνιο τρίγωνο οι κάθετες πλευρές είναι 2 m και 4 m. Πόσο είναι το τετράγωνο της υποτείνουσάς του (c' : 'In right triangle, legs are 2 m and 4 m. What is square of hypotenuse (c'}<sup>2</sup>)；
        </span>
      ),
      correct: 20,
      type: 'input',
      tableData: [
        { label: locale === 'el' ? 'Πυθαγόρειο' : 'Pythagorean', details: <span className="inline-flex items-center whitespace-nowrap">c<sup>2</sup> ＝ 2<sup>2</sup> ＋ 4<sup>2</sup> ＝ 4 ＋ 16 ＝ 20</span> }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          c<sup>2</sup> ＝ 4 ＋ 16 ＝ 20.
        </span>
      )
    }),
    (locale) => ({
      title: locale === 'el' ? 'Ακέραιο Μέρος του √30' : 'Integer Part of √30',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποιος είναι ο ακέραιος k αν k ＜' : 'What is integer k if k ＜'} <Radical>30</Radical> ＜ k ＋ 1 {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: 5,
      tableData: [
        { label: locale === 'el' ? 'Τετράγωνα' : 'Squares', details: <span className="inline-flex items-center whitespace-nowrap">5<sup>2</sup> ＝ 25 ＜ 30 ＜ 36 ＝ 6<sup>2</sup></span> }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          5<sup>2</sup> ＝ 25 ＜ 30 ＜ 36 ＝ 6<sup>2</sup> ⇒ k ＝ 5.
        </span>
      )
    }),
    (locale) => ({
      title: locale === 'el' ? 'Περίμετρος Κύκλου με π ≈ 3,14' : 'Circle Perimeter with π ≈ 3.14',
      prompt: locale === 'el' ? 'Κυκλικός στίβος έχει διάμετρο d ＝ 20 m. Ποια είναι η περίμετρός του για π ≈ 3,14 σε m;' : 'Circular track has diameter d ＝ 20 m. What is perimeter for π ≈ 3.14 in m?',
      correct: locale === 'el' ? '62,8' : '62.8',
      type: 'input',
      unit: 'm',
      tableData: [
        { label: locale === 'el' ? 'Τύπος' : 'Formula', details: <span className="inline-flex items-center whitespace-nowrap">L ＝ π · d ＝ {locale === 'el' ? '3,14 · 20 ＝ 62,8 m' : '3.14 · 20 ＝ 62.8 m'}</span> }
      ],
      explanation: locale === 'el' ? '3,14 · 20 ＝ 62,8 m.' : '3.14 · 20 ＝ 62.8 m.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Εγκλωβισμός του √40' : 'Bounding √40',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποιος είναι ο μικρότερος ακέραιος που είναι ΜΕΓΑΛΥΤΕΡΟΣ από το' : 'What is the smallest integer GREATER than'} <Radical>40</Radical> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: 7,
      tableData: [
        { label: locale === 'el' ? 'Τετράγωνα' : 'Squares', details: <span className="inline-flex items-center whitespace-nowrap">6<sup>2</sup> ＝ 36 ＜ 40 ＜ 49 ＝ 7<sup>2</sup></span> }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap gap-1">6 ＜ <Radical>40</Radical> ＜ 7,</span>
          <span>{locale === 'el' ? 'άρα ο μικρότερος ακέραιος είναι το 7.' : 'so smallest integer is 7.'}</span>
        </span>
      )
    }),
    (locale) => ({
      title: locale === 'el' ? 'Εμβαδόν από Διαγώνιο' : 'Area from Diagonal',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Η διαγώνιος τετραγώνου είναι' : 'Square diagonal is'} <Radical>18</Radical> m. {locale === 'el' ? 'Πόσο είναι το εμβαδόν του σε m' : 'What is its area in m'}<sup>2</sup>；
        </span>
      ),
      correct: 9,
      type: 'input',
      unit: locale === 'el' ? 'm²' : 'm²',
      tableData: [
        { label: locale === 'el' ? 'Τύπος' : 'Formula', details: <span className="inline-flex items-center whitespace-nowrap gap-1">{locale === 'el' ? 'Ε' : 'A'} ＝ <Frac num={<>(<Radical>18</Radical>)<sup>2</sup></>} den="2" /> ＝ <Frac num="18" den="2" /> ＝ 9 m<sup>2</sup></span> }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          {locale === 'el' ? 'Ε' : 'A'} ＝ <Frac num="18" den="2" /> ＝ 9 m<sup>2</sup>.
        </span>
      )
    }),
    (locale) => ({
      title: locale === 'el' ? 'Διαγώνιος Ορθογωνίου με πλευρές 1 και 7' : 'Rectangle Diagonal with sides 1 and 7',
      prompt: locale === 'el' ? 'Ποιο είναι το τετράγωνο της διαγωνίου ορθογωνίου με πλευρές 1 cm και 7 cm;' : 'What is the square of diagonal of rectangle with sides 1 cm and 7 cm?',
      correct: 50,
      type: 'input',
      tableData: [
        { label: locale === 'el' ? 'Υπολογισμός' : 'Calculation', details: <span className="inline-flex items-center whitespace-nowrap">1<sup>2</sup> ＋ 7<sup>2</sup> ＝ 1 ＋ 49 ＝ 50</span> }
      ],
      explanation: '1 ＋ 49 ＝ 50.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Υποτείνουσα Ισοσκελούς με πλευρά 3' : 'Isosceles Hypotenuse with side 3',
      prompt: locale === 'el' ? 'Ποιο είναι το τετράγωνο της υποτείνουσας ισοσκελούς ορθογωνίου τριγώνου με πλευρά 3 cm;' : 'What is the square of hypotenuse of isosceles right triangle with side 3 cm?',
      correct: 18,
      type: 'input',
      tableData: [
        { label: locale === 'el' ? 'Πυθαγόρειο' : 'Pythagorean', details: <span className="inline-flex items-center whitespace-nowrap">3<sup>2</sup> ＋ 3<sup>2</sup> ＝ 9 ＋ 9 ＝ 18</span> }
      ],
      explanation: '9 ＋ 9 ＝ 18.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Προσέγγιση του √10' : 'Approximation of √10',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποια είναι η προσέγγιση δεκάτου με έλλειψη του' : 'What is the tenth approximation by defect of'} <Radical>10</Radical> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: locale === 'el' ? '3,1' : '3.1',
      tableData: [
        { label: locale === 'el' ? 'Έλεγχος' : 'Check', details: <span className="inline-flex items-center whitespace-nowrap">({locale === 'el' ? '3,1' : '3.1'})<sup>2</sup> ＝ {locale === 'el' ? '9,61' : '9.61'} ＜ 10</span> }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          ({locale === 'el' ? '3,1' : '3.1'})<sup>2</sup> ＝ {locale === 'el' ? '9,61' : '9.61'} ＜ 10.
        </span>
      )
    }),
    (locale) => ({
      title: locale === 'el' ? 'Ακέραιο Μέρος του √60' : 'Integer Part of √60',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποιο είναι το ακέραιο μέρος του' : 'What is the integer part of'} <Radical>60</Radical> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      type: 'input',
      correct: 7,
      tableData: [
        { label: locale === 'el' ? 'Τετράγωνα' : 'Squares', details: <span className="inline-flex items-center whitespace-nowrap">7<sup>2</sup> ＝ 49 ＜ 60 ＜ 64 ＝ 8<sup>2</sup></span> }
      ],
      explanation: locale === 'el' ? '7² ＝ 49 ＜ 60, άρα ακέραιο μέρος 7.' : '7² ＝ 49 ＜ 60, so integer part is 7.'
    })
  ],

  // ΠΡΟΒΛΗΜΑ ΚΕΦΑΛΑΙΟΥ 3 (Q15)
  prob3: [
    (locale) => ({
      title: locale === 'el' ? 'Πλήθος Ακεραίων σε Διάστημα Ριζών' : 'Number of Integers in Root Interval',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Πόσοι ακέραιοι αριθμοί x ικανοποιούν την ανισότητα －' : 'How many integers x satisfy inequality －'}<Radical>10</Radical> ＜ x ＜ <Radical>10</Radical> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      correct: 7,
      type: 'input',
      tableData: [
        { label: locale === 'el' ? 'Τιμή του √10' : 'Value of √10', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>10</Radical> ≈ {locale === 'el' ? '3,16' : '3.16'}</span> },
        { label: locale === 'el' ? 'Ακέραιοι' : 'Integers', details: '－3, －2, －1, 0, 1, 2, 3 (συνολικά 7)' }
      ],
      explanation: locale === 'el' ? 'Από το －3 έως το 3 υπάρχουν 7 ακέραιοι.' : 'From －3 to 3 there are 7 integers.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Μέσο Διαστήματος στον Άξονα' : 'Midpoint on the Axis',
      prompt: locale === 'el' ? 'Ποιο είναι το μέσο του ευθύγραμμου τμήματος με άκρα τα σημεία －5 και 3 στον πραγματικό άξονα;' : 'What is the midpoint of segment with endpoints －5 and 3 on real axis?',
      correct: -1,
      type: 'input',
      tableData: [
        { label: locale === 'el' ? 'Τύπος μέσου M' : 'Midpoint M formula', details: <span className="inline-flex items-center whitespace-nowrap"><Frac num="α ＋ β" den="2" /></span> },
        { label: locale === 'el' ? 'Υπολογισμός' : 'Calculation', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Frac num="－5 ＋ 3" den="2" /> ＝ <Frac num="－2" den="2" /> ＝ －1</span> }
      ],
      explanation: <span className="inline-flex items-center whitespace-nowrap gap-1"><Frac num="－5 ＋ 3" den="2" /> ＝ －1.</span>
    }),
    (locale) => ({
      title: locale === 'el' ? 'Φυσικοί Αριθμοί Μικρότεροι από Ρίζα' : 'Natural Numbers Less than Root',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Πόσοι ΦΥΣΙΚΟΙ αριθμοί είναι αυστηρά μικρότεροι από το' : 'How many NATURAL numbers are strictly less than'} <Radical>26</Radical> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      correct: 6,
      type: 'input',
      tableData: [
        { label: '√26', details: <span className="inline-flex items-center whitespace-nowrap gap-1">5<sup>2</sup> ＝ 25 ＜ 26 ＜ 36 ＝ 6<sup>2</sup> ⇒ <Radical>26</Radical> ≈ {locale === 'el' ? '5,1' : '5.1'}</span> },
        { label: locale === 'el' ? 'Φυσικοί (ℕ)' : 'Naturals (ℕ)', details: '0, 1, 2, 3, 4, 5 (συνολικά 6)' }
      ],
      explanation: locale === 'el' ? 'Οι φυσικοί αριθμοί είναι οι 0, 1, 2, 3, 4, 5 (συνολικά 6).' : 'Natural numbers are 0, 1, 2, 3, 4, 5 (total 6).'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Απόσταση Σημείων στον Άξονα' : 'Distance of Points on Axis',
      prompt: locale === 'el' ? 'Πόση είναι η απόσταση ανάμεσα στα σημεία Α(－6) και Β(4) στον πραγματικό άξονα;' : 'What is distance between points A(－6) and B(4) on real axis?',
      correct: 10,
      type: 'input',
      unit: locale === 'el' ? 'μονάδες' : 'units',
      tableData: [
        { label: locale === 'el' ? 'Τύπος' : 'Formula', details: <span className="inline-flex items-center whitespace-nowrap">|4 － (－6)| ＝ 10</span> }
      ],
      explanation: '|4 ＋ 6| ＝ 10.'
    }),
    (locale) => {
      const distractorsList = ['－4 － √3', '4 ＋ √3', '√3 ＋ 4', '4 － √3', '－4 ＋ √3'];
      return {
        title: locale === 'el' ? 'Αντίθετος Παράστασης με Ρίζα' : 'Opposite of Expression with Root',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            {locale === 'el' ? 'Ποιος είναι ο αντίθετος του αριθμού 4 －' : 'What is the opposite of 4 －'} <Radical>3</Radical> {locale === 'el' ? '；' : '?'}
          </span>
        ),
        correct: '√3 － 4',
        type: 'mcq',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        renderOption: (opt) => {
          if (opt === '√3 － 4') return <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>3</Radical> － 4</span>;
          if (opt === '－4 － √3') return <span className="inline-flex items-center whitespace-nowrap gap-1">－4 － <Radical>3</Radical></span>;
          if (opt === '4 ＋ √3') return <span className="inline-flex items-center whitespace-nowrap gap-1">4 ＋ <Radical>3</Radical></span>;
          if (opt === '√3 ＋ 4') return <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>3</Radical> ＋ 4</span>;
          return opt;
        },
        tableData: [
          { label: locale === 'el' ? 'Αντίθετος' : 'Opposite', details: <span className="inline-flex items-center whitespace-nowrap gap-1">－(4 － <Radical>3</Radical>) ＝ <Radical>3</Radical> － 4</span> }
        ],
        explanation: <span className="inline-flex items-center whitespace-nowrap gap-1">－(4 － <Radical>3</Radical>) ＝ <Radical>3</Radical> － 4.</span>
      };
    },
    (locale) => {
      const distractorsList = ['√5 － 3', '√5 ＋ 3', '3', '－√5', '5 － 3'];
      return {
        title: locale === 'el' ? 'Απόλυτη Τιμή Διαφοράς' : 'Absolute Value of Difference',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            {locale === 'el' ? 'Πόσο ισούται η παράσταση |' : 'What is |'}<Radical>5</Radical> － 3| {locale === 'el' ? '；' : '?'}
          </span>
        ),
        correct: '3 － √5',
        type: 'mcq',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        renderOption: (opt) => {
          if (opt === '3 － √5') return <span className="inline-flex items-center whitespace-nowrap gap-1">3 － <Radical>5</Radical></span>;
          if (opt === '√5 － 3') return <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>5</Radical> － 3</span>;
          if (opt === '√5 ＋ 3') return <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>5</Radical> ＋ 3</span>;
          return opt;
        },
        tableData: [
          { label: locale === 'el' ? 'Πρόσημο' : 'Sign', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>5</Radical> ≈ {locale === 'el' ? '2,24' : '2.24'} ＜ 3 ⇒ <Radical>5</Radical> － 3 ＜ 0</span> },
          { label: locale === 'el' ? 'Απόλυτο' : 'Absolute', details: <span className="inline-flex items-center whitespace-nowrap gap-1">－(<Radical>5</Radical> － 3) ＝ 3 － <Radical>5</Radical></span> }
        ],
        explanation: (
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            |<Radical>5</Radical> － 3| ＝ 3 － <Radical>5</Radical>.
          </span>
        )
      };
    },
    (locale) => ({
      title: locale === 'el' ? 'Ακέραιοι ανάμεσα σε －√3 και √3' : 'Integers between －√3 and √3',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Πόσοι ακέραιοι βρίσκονται ανάμεσα στο －' : 'How many integers are between －'}<Radical>3</Radical> {locale === 'el' ? 'και στο' : 'and'} <Radical>3</Radical> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      correct: 3,
      type: 'input',
      tableData: [
        { label: '√3', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>3</Radical> ≈ {locale === 'el' ? '1,73' : '1.73'}</span> },
        { label: locale === 'el' ? 'Ακέραιοι' : 'Integers', details: '－1, 0, 1 (συνολικά 3)' }
      ],
      explanation: '－1, 0, 1.'
    }),
    (locale) => {
      const distractorsList = ['1/3 ＞ 1/√3', '1/3 ＝ 1/√3', 'Δεν συγκρίνονται', '1/3 ≥ 1/√3', '1/√3 ＜ 1/3'];
      return {
        title: locale === 'el' ? 'Σύγκριση Αντίστροφων με Ρίζα' : 'Comparing Reciprocals with Root',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            {locale === 'el' ? 'Ποια είναι η σχέση ανάμεσα στο' : 'What is the relation between'} <Frac num="1" den="3" /> {locale === 'el' ? 'και στο' : 'and'} <Frac num="1" den={<Radical>3</Radical>} /> {locale === 'el' ? '；' : '?'}
          </span>
        ),
        correct: '1/3 ＜ 1/√3',
        type: 'mcq',
        distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
        renderOption: (opt) => {
          if (opt === '1/3 ＜ 1/√3') return <span className="inline-flex items-center whitespace-nowrap gap-1"><Frac num="1" den="3" /> ＜ <Frac num="1" den={<Radical>3</Radical>} /></span>;
          if (opt === '1/3 ＞ 1/√3') return <span className="inline-flex items-center whitespace-nowrap gap-1"><Frac num="1" den="3" /> ＞ <Frac num="1" den={<Radical>3</Radical>} /></span>;
          if (opt === '1/3 ＝ 1/√3') return <span className="inline-flex items-center whitespace-nowrap gap-1"><Frac num="1" den="3" /> ＝ <Frac num="1" den={<Radical>3</Radical>} /></span>;
          return opt;
        },
        tableData: [
          { label: locale === 'el' ? 'Παρονομαστές' : 'Denominators', details: <span className="inline-flex items-center whitespace-nowrap gap-1">3 ＞ <Radical>3</Radical> ⇒ <Frac num="1" den="3" /> ＜ <Frac num="1" den={<Radical>3</Radical>} /></span> }
        ],
        explanation: locale === 'el' ? 'Μεγαλύτερος θετικός παρονομαστής δίνει μικρότερο κλάσμα.' : 'Larger positive denominator gives smaller fraction.'
      };
    },
    (locale) => ({
      title: locale === 'el' ? 'Διαφορά Θερμοκρασίας' : 'Temperature Difference',
      prompt: locale === 'el' ? 'Αν η θερμοκρασία από －4,5 °C ανέλθει σε 2,5 °C, πόσους βαθμούς αυξήθηκε;' : 'If temp rises from －4.5 °C to 2.5 °C, how many degrees did it increase?',
      correct: 7,
      type: 'input',
      unit: '°C',
      tableData: [
        { label: locale === 'el' ? 'Διαφορά' : 'Difference', details: locale === 'el' ? '2,5 － (－4,5) ＝ 7 °C' : '2.5 － (－4.5) ＝ 7 °C' }
      ],
      explanation: locale === 'el' ? '2,5 ＋ 4,5 ＝ 7 °C.' : '2.5 ＋ 4.5 ＝ 7 °C.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Πλησιέστερος Ακέραιος στο √17' : 'Nearest Integer to √17',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποιος είναι ο πλησιέστερος ακέραιος στον αριθμό' : 'What is the nearest integer to'} <Radical>17</Radical> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      correct: 4,
      type: 'input',
      tableData: [
        { label: locale === 'el' ? 'Έλεγχος' : 'Check', details: <span className="inline-flex items-center whitespace-nowrap">4<sup>2</sup> ＝ 16, 5<sup>2</sup> ＝ 25. 17 ≈ 16</span> }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          <Radical>17</Radical> ≈ {locale === 'el' ? '4,12 ⇒ 4.' : '4.12 ⇒ 4.'}
        </span>
      )
    })
  ],

  // ΠΡΟΒΛΗΜΑ ΚΕΦΑΛΑΙΟΥ 4 (Q16)
  prob4: [
    (locale) => {
      const mult = randInt(3, 6);
      const target = 5 * mult;
      return {
        title: locale === 'el' ? 'Αναλογίες με Ρίζες √2 και √5' : 'Proportions with Roots √2 and √5',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            {locale === 'el' ? 'Οι αριθμοί x, y, z είναι ανάλογοι προς τους 2,' : 'Numbers x, y, z are proportional to 2,'} <Radical>2</Radical> {locale === 'el' ? 'και' : 'and'} <Radical>5</Radical>, {locale === 'el' ? 'και ισχύει: x － y ·' : 'and: x － y ·'} <Radical>2</Radical> ＋ z · <Radical>5</Radical> ＝ {target}. {locale === 'el' ? 'Ποια είναι η τιμή του x;' : 'What is value of x?'}
          </span>
        ),
        correct: 2 * mult,
        type: 'input',
        tableData: [
          { label: locale === 'el' ? 'Αναλογία' : 'Proportion', details: <span className="inline-flex items-center whitespace-nowrap gap-1">x ＝ 2λ, y ＝ λ·<Radical>2</Radical>, z ＝ λ·<Radical>5</Radical></span> },
          { label: locale === 'el' ? 'Αντικατάσταση' : 'Substitution', details: <span className="inline-flex items-center whitespace-nowrap">2λ － 2λ ＋ 5λ ＝ {target} ⇒ 5λ ＝ {target} ⇒ λ ＝ {mult}</span> },
          { label: locale === 'el' ? 'Υπολογισμός x' : 'Calculate x', details: <span className="inline-flex items-center whitespace-nowrap">x ＝ 2 · {mult} ＝ {2 * mult}</span> }
        ],
        explanation: (
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            5λ ＝ {target} ⇒ λ ＝ {mult} ⇒ x ＝ {2 * mult}.
          </span>
        )
      };
    },
    (locale) => ({
      title: locale === 'el' ? 'Επίλυση Εξίσωσης με Ρίζες' : 'Solving Equation with Roots',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποια είναι η λύση της εξίσωσης' : 'What is the solution of'} <Radical>5</Radical> · x ＝ <Radical>80</Radical> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      correct: 4,
      type: 'input',
      tableData: [
        { label: locale === 'el' ? 'Επίλυση' : 'Solution', details: <span className="inline-flex items-center whitespace-nowrap gap-1">x ＝ <Radical><Frac num="80" den="5" /></Radical> ＝ <Radical>16</Radical> ＝ 4</span> }
      ],
      explanation: <span className="inline-flex items-center whitespace-nowrap gap-1">x ＝ <Radical>16</Radical> ＝ 4.</span>
    }),
    (locale) => ({
      title: locale === 'el' ? 'Υποτείνουσα από Κάθετες Πλευρές' : 'Hypotenuse from Legs',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Σε ορθογώνιο τρίγωνο οι κάθετες πλευρές είναι' : 'In right triangle legs are'} <Radical>5</Radical> － 1 {locale === 'el' ? 'και' : 'and'} <Radical>5</Radical> ＋ 1. {locale === 'el' ? 'Πόσο είναι το τετράγωνο της υποτείνουσας c' : 'What is c'}<sup>2</sup>；
        </span>
      ),
      correct: 12,
      type: 'input',
      tableData: [
        { label: 'c²', details: <span className="inline-flex items-center whitespace-nowrap gap-1">(<Radical>5</Radical> － 1)<sup>2</sup> ＋ (<Radical>5</Radical> ＋ 1)<sup>2</sup> ＝ 12</span> }
      ],
      explanation: '6 － 2√5 ＋ 6 ＋ 2√5 ＝ 12.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Εμβαδόν Ορθογωνίου Τριγώνου' : 'Right Triangle Area',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποιο είναι το εμβαδόν ορθογωνίου τριγώνου με κάθετες πλευρές 2 ·' : 'What is area of right triangle with legs 2 ·'} <Radical>3</Radical> cm {locale === 'el' ? 'και 4 ·' : 'and 4 ·'} <Radical>3</Radical> cm {locale === 'el' ? 'σε cm' : 'in cm'}<sup>2</sup>；
        </span>
      ),
      correct: 12,
      type: 'input',
      unit: locale === 'el' ? 'cm²' : 'cm²',
      tableData: [
        { label: locale === 'el' ? 'Εμβαδόν' : 'Area', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Frac num={<span className="inline-flex items-center gap-0.5 whitespace-nowrap">2·<Radical>3</Radical> · 4·<Radical>3</Radical></span>} den="2" /> ＝ <Frac num="24" den="2" /> ＝ 12 cm<sup>2</sup></span> }
      ],
      explanation: <span className="inline-flex items-center whitespace-nowrap">12 cm<sup>2</sup>.</span>
    }),
    (locale) => ({
      title: locale === 'el' ? 'Παράσταση με Γνωστό Άθροισμα' : 'Expression with Known Sum',
      prompt: locale === 'el' ? 'Αν x ＋ y ＝ －6, ποια είναι η τιμή της παράστασης Α ＝ 5x － (4x － y) ＋ 10;' : 'If x ＋ y ＝ －6, what is value of A ＝ 5x － (4x － y) ＋ 10?',
      correct: 4,
      type: 'input',
      tableData: [
        { label: locale === 'el' ? 'Απλοποίηση' : 'Simplification', details: <span className="inline-flex items-center whitespace-nowrap">x ＋ y ＋ 10 ＝ －6 ＋ 10 ＝ 4</span> }
      ],
      explanation: 'x ＋ y ＋ 10 ＝ －6 ＋ 10 ＝ 4.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Ένθετες Ρίζες' : 'Nested Roots',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Πόσο ισούται η τιμή της παράστασης' : 'What is the value of'} <Radical><span className="inline-flex items-center gap-0.5">13 ＋ <Radical><span className="inline-flex items-center gap-0.5">7 ＋ <Radical>4</Radical></span></Radical></span></Radical> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      correct: 4,
      type: 'input',
      tableData: [
        { label: locale === 'el' ? 'Υπολογισμός' : 'Calculation', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>4</Radical> ＝ 2, 7 ＋ 2 ＝ 9, <Radical>9</Radical> ＝ 3, 13 ＋ 3 ＝ 16, <Radical>16</Radical> ＝ 4</span> }
      ],
      explanation: locale === 'el' ? 'Υπολογισμός από μέσα προς τα έξω: √16 ＝ 4.' : 'Calculation from inside out: √16 ＝ 4.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Εξίσωση με Δύναμη Ρίζας' : 'Equation with Root Power',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Να λυθεί η εξίσωση:' : 'Solve:'} (<Radical>3</Radical>)<sup>－2</sup> · x ＝ 6.
        </span>
      ),
      correct: 18,
      type: 'input',
      tableData: [
        { label: locale === 'el' ? 'Επίλυση' : 'Solution', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Frac num="1" den="3" /> · x ＝ 6 ⇒ x ＝ 18</span> }
      ],
      explanation: <span className="inline-flex items-center whitespace-nowrap gap-1"><Frac num="1" den="3" /> · x ＝ 6 ⇒ x ＝ 18.</span>
    }),
    (locale) => ({
      title: locale === 'el' ? 'Περίμετρος Τετραγώνου με Ρίζα' : 'Square Perimeter with Root',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Τετράγωνο έχει πλευρά s ＝' : 'Square has side s ＝'} <Radical>18</Radical> ＋ <Radical>2</Radical> m. {locale === 'el' ? 'Πόσο είναι το εμβαδόν του σε m' : 'What is its area in m'}<sup>2</sup>；
        </span>
      ),
      correct: 32,
      type: 'input',
      unit: locale === 'el' ? 'm²' : 'm²',
      tableData: [
        { label: locale === 'el' ? 'Πλευρά s' : 'Side s', details: <span className="inline-flex items-center whitespace-nowrap gap-1">s ＝ 3·<Radical>2</Radical> ＋ <Radical>2</Radical> ＝ 4·<Radical>2</Radical> m</span> },
        { label: locale === 'el' ? 'Εμβαδόν s²' : 'Area s²', details: <span className="inline-flex items-center whitespace-nowrap gap-1">(4·<Radical>2</Radical>)<sup>2</sup> ＝ 16 · 2 ＝ 32 m<sup>2</sup></span> }
      ],
      explanation: <span className="inline-flex items-center whitespace-nowrap gap-1">(4·<Radical>2</Radical>)<sup>2</sup> ＝ 32 m<sup>2</sup>.</span>
    }),
    (locale) => ({
      title: locale === 'el' ? 'Απλοποίηση Διαφοράς Κλασμάτων' : 'Simplifying Fraction Difference',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Πόσο ισούται η παράσταση' : 'What is'} (1 － <Frac num="3" den="2" />) · (2 － <Frac num="5" den="2" />) {locale === 'el' ? '；' : '?'}
        </span>
      ),
      correct: locale === 'el' ? '0,25' : '0.25',
      type: 'input',
      tableData: [
        { label: locale === 'el' ? 'Υπολογισμός' : 'Calculation', details: <span className="inline-flex items-center whitespace-nowrap gap-1">(－<Frac num="1" den="2" />) · (－<Frac num="1" den="2" />) ＝ <Frac num="1" den="4" /> ＝ {locale === 'el' ? '0,25' : '0.25'}</span> }
      ],
      explanation: locale === 'el' ? '(－1/2) · (－1/2) ＝ 0,25.' : '(－1/2) · (－1/2) ＝ 0.25.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Υποτείνουσα Ισοσκελούς Τριγώνου' : 'Isosceles Triangle Hypotenuse',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ισοσκελές ορθογώνιο τρίγωνο έχει κάθετη πλευρά 5 ·' : 'Isosceles right triangle has leg 5 ·'} <Radical>2</Radical> m. {locale === 'el' ? 'Πόσο είναι το τετράγωνο της υποτείνουσας c' : 'What is square of hypotenuse c'}<sup>2</sup>；
        </span>
      ),
      correct: 100,
      type: 'input',
      tableData: [
        { label: 'c²', details: <span className="inline-flex items-center whitespace-nowrap gap-1">(5·<Radical>2</Radical>)<sup>2</sup> ＋ (5·<Radical>2</Radical>)<sup>2</sup> ＝ 50 ＋ 50 ＝ 100</span> }
      ],
      explanation: '50 ＋ 50 ＝ 100.'
    })
  ],

  // ΠΡΟΒΛΗΜΑ ΚΕΦΑΛΑΙΟΥ 5 (Q17)
  prob5: [
    (locale) => ({
      title: locale === 'el' ? 'Χρόνος Διάδοσης Φωτός' : 'Light Travel Time',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Απόσταση 6 · 10' : 'Distance 6 · 10'}<sup>8</sup> km {locale === 'el' ? 'διανύεται με ταχύτητα φωτός 3 · 10' : 'is traveled at light speed 3 · 10'}<sup>5</sup> km/s. {locale === 'el' ? 'Πόσα δευτερόλεπτα απαιτούνται;' : 'How many seconds?'}
        </span>
      ),
      correct: 2000,
      type: 'input',
      unit: 's',
      tableData: [
        { label: locale === 'el' ? 'Τύπος' : 'Formula', details: <span className="inline-flex items-center whitespace-nowrap gap-1">t ＝ <Frac num={<>6 · 10<sup>8</sup></>} den={<>3 · 10<sup>5</sup></>} /> ＝ 2 · 10<sup>3</sup> ＝ {locale === 'el' ? '2.000 s' : '2,000 s'}</span> }
      ],
      explanation: locale === 'el' ? '2.000 δευτερόλεπτα.' : '2,000 seconds.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Αύξηση Όγκου Κύβου' : 'Cube Volume Increase',
      prompt: locale === 'el' ? 'Αν τριπλασιάσουμε την ακμή ενός κύβου, πόσες φορές αυξάνεται ο όγκος του;' : 'If we triple cube edge, how many times does volume increase?',
      correct: 27,
      type: 'input',
      unit: locale === 'el' ? 'φορές' : 'times',
      tableData: [
        { label: locale === 'el' ? 'Όγκος' : 'Volume', details: <span className="inline-flex items-center whitespace-nowrap">(3α)<sup>3</sup> ＝ 27 · α<sup>3</sup></span> }
      ],
      explanation: locale === 'el' ? '3³ ＝ 27 φορές.' : '3³ ＝ 27 times.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Αύξηση Εμβαδού Κύβου' : 'Cube Area Increase',
      prompt: locale === 'el' ? 'Αν τετραπλασιάσουμε την ακμή ενός κύβου, πόσες φορές αυξάνεται το εμβαδόν της επιφάνειάς του;' : 'If we quadruple cube edge, how many times does surface area increase?',
      correct: 16,
      type: 'input',
      unit: locale === 'el' ? 'φορές' : 'times',
      tableData: [
        { label: locale === 'el' ? 'Εμβαδόν' : 'Area', details: <span className="inline-flex items-center whitespace-nowrap">6 · (4α)<sup>2</sup> ＝ 16 · (6α<sup>2</sup>)</span> }
      ],
      explanation: locale === 'el' ? '4² ＝ 16 φορές.' : '4² ＝ 16 times.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Εκθετική Αύξηση Βακτηρίων' : 'Exponential Bacteria Growth',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Πληθυσμός βακτηρίων τριπλασιάζεται κάθε ώρα (3' : 'Bacteria population triples every hour (3'}<sup>n</sup>). {locale === 'el' ? 'Πόσα βακτήρια θα υπάρχουν μετά από 3 ώρες (ξεκινώντας από 1);' : 'How many after 3 hours (starting with 1)?'}
        </span>
      ),
      correct: 27,
      type: 'input',
      unit: locale === 'el' ? 'βακτήρια' : 'bacteria',
      tableData: [
        { label: locale === 'el' ? 'Υπολογισμός' : 'Calculation', details: <span className="inline-flex items-center whitespace-nowrap">3<sup>3</sup> ＝ 27</span> }
      ],
      explanation: '3³ ＝ 27.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Σύγκριση Μεγεθών σε Τυποποιημένη Μορφή' : 'Comparing in Standard Form',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Πόσες φορές μεγαλύτερος είναι ο αριθμός 8 · 10' : 'How many times larger is 8 · 10'}<sup>9</sup> {locale === 'el' ? 'από τον αριθμό 4 · 10' : 'than 4 · 10'}<sup>6</sup>；
        </span>
      ),
      correct: 2000,
      type: 'input',
      unit: locale === 'el' ? 'φορές' : 'times',
      tableData: [
        { label: locale === 'el' ? 'Πηλίκο' : 'Quotient', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Frac num={<>8 · 10<sup>9</sup></>} den={<>4 · 10<sup>6</sup></>} /> ＝ 2 · 10<sup>3</sup> ＝ {locale === 'el' ? '2.000' : '2,000'}</span> }
      ],
      explanation: locale === 'el' ? '2.000 φορές.' : '2,000 times.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Απλοποίηση Δυνάμεων του 2' : 'Simplifying Powers of 2',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Πόσο ισούται η παράσταση' : 'What is'} <Frac num={<span className="inline-flex items-center gap-0.5 whitespace-nowrap">2<sup>8</sup> · 2<sup>－3</sup></span>} den={<>2<sup>3</sup></>} /> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      correct: 4,
      type: 'input',
      tableData: [
        { label: locale === 'el' ? 'Υπολογισμός' : 'Calculation', details: <span className="inline-flex items-center whitespace-nowrap">2<sup>8 － 3 － 3</sup> ＝ 2<sup>2</sup> ＝ 4</span> }
      ],
      explanation: '2² ＝ 4.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Τετράγωνο σε Τυποποιημένη Μορφή' : 'Square in Standard Form',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποιος είναι ο εκθέτης k αν (3 · 10' : 'What is exponent k if (3 · 10'}<sup>4</sup>)<sup>2</sup> ＝ 9 · 10<sup>k</sup>；
        </span>
      ),
      correct: 8,
      type: 'input',
      tableData: [
        { label: locale === 'el' ? 'Υπολογισμός' : 'Calculation', details: <span className="inline-flex items-center whitespace-nowrap">10<sup>4 · 2</sup> ＝ 10<sup>8</sup></span> }
      ],
      explanation: 'k ＝ 8.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Πρόσθεση Τυποποιημένων Αριθμών' : 'Adding Standard Form Numbers',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Πόσο ισούται το άθροισμα 4 · 10' : 'What is the sum 4 · 10'}<sup>3</sup> ＋ 6 · 10<sup>3</sup> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      correct: 10000,
      type: 'input',
      tableData: [
        { label: locale === 'el' ? 'Άθροισμα' : 'Sum', details: <span className="inline-flex items-center whitespace-nowrap">(4 ＋ 6) · 10<sup>3</sup> ＝ 10 · 10<sup>3</sup> ＝ {locale === 'el' ? '10.000' : '10,000'}</span> }
      ],
      explanation: locale === 'el' ? '10.000.' : '10,000.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Εξίσωση με Δύναμη' : 'Equation with Power',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Αν 5' : 'If 5'}<sup>x</sup> ＝ 125, {locale === 'el' ? 'ποια είναι η τιμή του x;' : 'what is x?'}
        </span>
      ),
      correct: 3,
      type: 'input',
      tableData: [
        { label: '125', details: <span className="inline-flex items-center whitespace-nowrap">5<sup>3</sup></span> }
      ],
      explanation: 'x ＝ 3.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Υπολογισμός (1/3)⁻³' : 'Calculation of (1/3)⁻³',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Πόσο ισούται η δύναμη (' : 'What is ('}<Frac num="1" den="3" />)<sup>－3</sup> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      correct: 27,
      type: 'input',
      tableData: [
        { label: locale === 'el' ? 'Αντιστροφή' : 'Inversion', details: <span className="inline-flex items-center whitespace-nowrap">3<sup>3</sup> ＝ 27</span> }
      ],
      explanation: '3³ ＝ 27.'
    })
  ],

  // ΠΡΟΒΛΗΜΑ ΚΕΦΑΛΑΙΟΥ 6 (Q18)
  prob6: [
    (locale) => ({
      title: locale === 'el' ? 'Εμβαδόν Ορθογωνίου με Ρίζες' : 'Rectangle Area with Roots',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ορθογώνιο έχει μήκος L ＝' : 'Rectangle has length L ＝'} <Radical>32</Radical> m {locale === 'el' ? 'και πλάτος W ＝' : 'and width W ＝'} <Radical>2</Radical> m. {locale === 'el' ? 'Πόσο είναι το εμβαδόν του σε m' : 'What is its area in m'}<sup>2</sup>；
        </span>
      ),
      correct: 8,
      type: 'input',
      unit: locale === 'el' ? 'm²' : 'm²',
      tableData: [
        { label: locale === 'el' ? 'Εμβαδόν' : 'Area', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>32</Radical> · <Radical>2</Radical> ＝ <Radical>64</Radical> ＝ 8 m<sup>2</sup></span> }
      ],
      explanation: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>64</Radical> ＝ 8 m<sup>2</sup>.</span>
    }),
    (locale) => ({
      title: locale === 'el' ? 'Περίμετρος Τετραγώνου από Εμβαδόν' : 'Square Perimeter from Area',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Τετράγωνο έχει εμβαδόν 50 m' : 'Square has area 50 m'}<sup>2</sup>. {locale === 'el' ? 'Ποιος είναι ο συντελεστής α στην περίμετρό του Π ＝ α · ' : 'What is coefficient a in perimeter P ＝ a · '}<Radical>2</Radical> m;
        </span>
      ),
      correct: 20,
      type: 'input',
      tableData: [
        { label: locale === 'el' ? 'Πλευρά s' : 'Side s', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>50</Radical> ＝ 5·<Radical>2</Radical> m</span> },
        { label: locale === 'el' ? 'Περίμετρος' : 'Perimeter', details: <span className="inline-flex items-center whitespace-nowrap gap-1">4 · (5·<Radical>2</Radical>) ＝ 20·<Radical>2</Radical> m</span> }
      ],
      explanation: <span className="inline-flex items-center whitespace-nowrap gap-1">20·<Radical>2</Radical> m.</span>
    }),
    (locale) => ({
      title: locale === 'el' ? 'Διαγώνιος Ορθογωνίου με Ριζική Πλευρά' : 'Rectangle Diagonal with Root Side',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ορθογώνιο έχει πλευρές' : 'Rectangle has sides'} <Radical>27</Radical> cm {locale === 'el' ? 'και 3 cm. Πόσο είναι το μήκος της διαγωνίου του d σε cm;' : 'and 3 cm. What is diagonal length d in cm?'}
        </span>
      ),
      correct: 6,
      type: 'input',
      unit: 'cm',
      tableData: [
        { label: 'd²', details: <span className="inline-flex items-center whitespace-nowrap gap-1">(<Radical>27</Radical>)<sup>2</sup> ＋ 3<sup>2</sup> ＝ 27 ＋ 9 ＝ 36 ⇒ d ＝ 6 cm</span> }
      ],
      explanation: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>36</Radical> ＝ 6 cm.</span>
    }),
    (locale) => ({
      title: locale === 'el' ? 'Λόγος Εμβαδών Τετραγώνων' : 'Ratio of Square Areas',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Δύο τετράγωνα έχουν πλευρές' : 'Two squares have sides'} <Radical>18</Radical> cm {locale === 'el' ? 'και' : 'and'} <Radical>2</Radical> cm. {locale === 'el' ? 'Πόσες φορές μεγαλύτερο είναι το εμβαδόν του 1ου;' : 'How many times larger is 1st area?'}
        </span>
      ),
      correct: 9,
      type: 'input',
      unit: locale === 'el' ? 'φορές' : 'times',
      tableData: [
        { label: locale === 'el' ? 'Λόγος' : 'Ratio', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Frac num={<>(<Radical>18</Radical>)<sup>2</sup></>} den={<>(<Radical>2</Radical>)<sup>2</sup></>} /> ＝ <Frac num="18" den="2" /> ＝ 9</span> }
      ],
      explanation: locale === 'el' ? '18 / 2 ＝ 9 φορές.' : '18 / 2 ＝ 9 times.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Υποτείνουσα Ισοσκελούς Ορθογωνίου' : 'Isosceles Right Hypotenuse',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ισοσκελές ορθογώνιο τρίγωνο έχει κάθετες πλευρές' : 'Isosceles right triangle has legs'} <Radical>50</Radical> m. {locale === 'el' ? 'Πόσο είναι το μήκος της υποτείνουσάς του σε μέτρα;' : 'What is its hypotenuse length in m?'}
        </span>
      ),
      correct: 10,
      type: 'input',
      unit: 'm',
      tableData: [
        { label: 'c²', details: <span className="inline-flex items-center whitespace-nowrap gap-1">50 ＋ 50 ＝ 100 ⇒ c ＝ <Radical>100</Radical> ＝ 10 m</span> }
      ],
      explanation: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>100</Radical> ＝ 10 m.</span>
    }),
    (locale) => ({
      title: locale === 'el' ? 'Εμβαδόν Ρόμβου με Ρίζες' : 'Rhombus Area with Roots',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ρόμβος έχει διαγωνίους d₁ ＝' : 'Rhombus has diagonals d₁ ＝'} <Radical>72</Radical> cm {locale === 'el' ? 'και d₂ ＝' : 'and d₂ ＝'} <Radical>2</Radical> cm. {locale === 'el' ? 'Πόσο είναι το εμβαδόν του σε cm' : 'What is its area in cm'}<sup>2</sup>；
        </span>
      ),
      correct: 6,
      type: 'input',
      unit: locale === 'el' ? 'cm²' : 'cm²',
      tableData: [
        { label: locale === 'el' ? 'Εμβαδόν' : 'Area', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Frac num={<span className="inline-flex items-center gap-0.5 whitespace-nowrap"><Radical>72</Radical> · <Radical>2</Radical></span>} den="2" /> ＝ <Frac num={<Radical>144</Radical>} den="2" /> ＝ <Frac num="12" den="2" /> ＝ 6 cm<sup>2</sup></span> }
      ],
      explanation: <span className="inline-flex items-center whitespace-nowrap">6 cm<sup>2</sup>.</span>
    }),
    (locale) => ({
      title: locale === 'el' ? 'Άθροισμα μετά από Ρητοποίηση' : 'Sum after Rationalization',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποιος είναι ο συντελεστής του' : 'What is coefficient of'} <Radical>3</Radical> {locale === 'el' ? 'στην παράσταση' : 'in expression'} <Radical>3</Radical> ＋ <Frac num="6" den={<Radical>3</Radical>} /> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      correct: 3,
      type: 'input',
      tableData: [
        { label: locale === 'el' ? 'Ρητοποίηση' : 'Rationalization', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Frac num="6" den={<Radical>3</Radical>} /> ＝ 2·<Radical>3</Radical></span> },
        { label: locale === 'el' ? 'Άθροισμα' : 'Sum', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>3</Radical> ＋ 2·<Radical>3</Radical> ＝ 3·<Radical>3</Radical></span> }
      ],
      explanation: '1 ＋ 2 ＝ 3.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Εμβαδόν Τριγώνου με Ρίζες' : 'Triangle Area with Roots',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ορθογώνιο τρίγωνο έχει κάθετες πλευρές' : 'Right triangle has legs'} <Radical>8</Radical> cm {locale === 'el' ? 'και' : 'and'} <Radical>18</Radical> cm. {locale === 'el' ? 'Πόσο είναι το εμβαδόν του σε cm' : 'What is its area in cm'}<sup>2</sup>；
        </span>
      ),
      correct: 6,
      type: 'input',
      unit: locale === 'el' ? 'cm²' : 'cm²',
      tableData: [
        { label: locale === 'el' ? 'Εμβαδόν' : 'Area', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Frac num={<span className="inline-flex items-center gap-0.5 whitespace-nowrap"><Radical>8</Radical> · <Radical>18</Radical></span>} den="2" /> ＝ <Frac num={<Radical>144</Radical>} den="2" /> ＝ 6 cm<sup>2</sup></span> }
      ],
      explanation: <span className="inline-flex items-center whitespace-nowrap">6 cm<sup>2</sup>.</span>
    }),
    (locale) => ({
      title: locale === 'el' ? 'Απλοποίηση Παράστασης Ριζών' : 'Simplifying Root Expression',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Πόσο ισούται η τιμή της παράστασης' : 'What is'} <Radical>20</Radical> · <Radical>5</Radical> － <Radical>16</Radical> {locale === 'el' ? '；' : '?'}
        </span>
      ),
      correct: 6,
      type: 'input',
      tableData: [
        { label: locale === 'el' ? 'Υπολογισμός' : 'Calculation', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>100</Radical> － 4 ＝ 10 － 4 ＝ 6</span> }
      ],
      explanation: '10 － 4 ＝ 6.'
    }),
    (locale) => ({
      title: locale === 'el' ? 'Πλευρά Τετραγώνου από Εμβαδόν' : 'Square Side from Area',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Τετράγωνο έχει εμβαδόν 108 m' : 'Square has area 108 m'}<sup>2</sup>. {locale === 'el' ? 'Ποιος είναι ο συντελεστής α αν η πλευρά του είναι α · ' : 'What is coefficient a if side is a · '}<Radical>3</Radical> m;
        </span>
      ),
      correct: 6,
      type: 'input',
      tableData: [
        { label: locale === 'el' ? 'Πλευρά' : 'Side', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>108</Radical> ＝ <Radical>36 · 3</Radical> ＝ 6·<Radical>3</Radical> m</span> }
      ],
      explanation: <span className="inline-flex items-center whitespace-nowrap gap-1">6·<Radical>3</Radical> m.</span>
    })
  ]
};

export default function Epanalipsi1Exercises() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = () => {
    const qList = [];

    // Helper για επιλογή k μοναδικών στοιχείων από δεξαμενή
    const pickUnique = (pool, count) => {
      const shuffledIndices = shuffle(pool.map((_, i) => i));
      return shuffledIndices.slice(0, count).map(idx => pool[idx](locale));
    };

    // 12 Βασικές Ερωτήσεις: Ακριβώς 2 από κάθε κεφάλαιο (Κεφ. 1 έως 6)
    const basicPools = [
      POOLS_BASIC.chap1,
      POOLS_BASIC.chap2,
      POOLS_BASIC.chap3,
      POOLS_BASIC.chap4,
      POOLS_BASIC.chap5,
      POOLS_BASIC.chap6
    ];

    let currentId = 1;
    basicPools.forEach((pool, cIdx) => {
      const picked = pickUnique(pool, 2);
      picked.forEach(item => {
        let options = undefined;
        if (item.type === 'mcq') {
          options = ensureFourUniqueOptions(item.correct, item.distractors);
        }
        qList.push({
          id: currentId++,
          chapterBadge: `${t[`chap${cIdx + 1}`]}`,
          title: item.title,
          prompt: item.prompt,
          type: item.type,
          correct: item.correct,
          options,
          renderOption: item.renderOption,
          unit: item.unit,
          tableData: item.tableData,
          explanation: item.explanation
        });
      });
    });

    // 6 Σύνθετα Προβλήματα: Ακριβώς 1 από κάθε κεφάλαιο (Κεφ. 1 έως 6)
    const probPools = [
      POOLS_PROBLEMS.prob1,
      POOLS_PROBLEMS.prob2,
      POOLS_PROBLEMS.prob3,
      POOLS_PROBLEMS.prob4,
      POOLS_PROBLEMS.prob5,
      POOLS_PROBLEMS.prob6
    ];

    probPools.forEach((pool, pIdx) => {
      const picked = pickUnique(pool, 1)[0];
      let options = undefined;
      if (picked.type === 'mcq') {
        options = ensureFourUniqueOptions(picked.correct, picked.distractors);
      }
      qList.push({
        id: currentId++,
        chapterBadge: `${t.probChap} ${pIdx + 1}`,
        title: picked.title,
        prompt: picked.prompt,
        type: picked.type,
        correct: picked.correct,
        options,
        renderOption: picked.renderOption,
        unit: picked.unit,
        tableData: picked.tableData,
        explanation: picked.explanation
      });
    });

    setQuestions(qList);
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    loadNewSet();
  }, [locale]);

  const handleAnswerChange = (qId, rawVal) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: rawVal }));
  };

  const sanitizeInput = (val) => {
    let sanitized = val.replace('.', ',').replace(/[^0-9,]/g, '');
    const parts = sanitized.split(',');
    if (parts.length > 2) {
      sanitized = parts[0] + ',' + parts.slice(1).join('');
    }
    return sanitized.slice(0, 10);
  };

  const handleSubmit = () => {
    let s = 0;
    questions.forEach(q => {
      const uAns = userAnswers[q.id];
      if (uAns === undefined || uAns === null || uAns === '') return;

      if (q.type === 'input') {
        const parsedUser = parseFloat(String(uAns).replace(',', '.').trim());
        const parsedCorrect = parseFloat(String(q.correct).replace(',', '.').trim());
        if (!isNaN(parsedUser) && Math.abs(parsedUser - parsedCorrect) <= 0.05) {
          s += 1;
        }
      } else {
        if (String(uAns).trim() === String(q.correct).trim()) {
          s += 1;
        }
      }
    });

    setScore(s);
    setSubmitted(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] !== '' && userAnswers[k] !== undefined).length;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/g-gymnasiou"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>📚 {toCleanUppercase(t.navTheoryBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border">
        
        {/* Header Banner - Responsive */}
        <section className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-blue-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 mb-6 sm:mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-1 bg-white/10 rounded-full text-indigo-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-white/10">
                {toCleanUppercase(t.headerBadge)}
              </span>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black mt-2 leading-tight break-words [overflow-wrap:anywhere]">
                {t.headerTitle}
              </h1>
              <p className="text-indigo-200 text-xs sm:text-base mt-1">
                {t.headerDesc}
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={loadNewSet}
                className="w-full sm:w-auto px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-xl shadow transition-all duration-150 text-xs sm:text-sm whitespace-nowrap"
              >
                🔄 {toCleanUppercase(t.btnNewSet)}
              </button>
            </div>
          </div>
        </section>

        {/* Results Banner */}
        {submitted && (
          <section className="p-5 sm:p-8 bg-white border-2 border-indigo-200 rounded-2xl sm:rounded-3xl shadow-lg mb-6 sm:mb-8 text-center animate-fade-in">
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-2">
              {t.resultTitle} {score} / 18 ({Math.round((score / 18) * 100)}%)
            </h2>
            <p className="text-slate-600 text-xs sm:text-base max-w-xl mx-auto mb-4">
              {score >= 15
                ? t.feedbackHigh
                : score >= 10
                ? t.feedbackMid
                : t.feedbackLow}
            </p>
            <button
              type="button"
              onClick={loadNewSet}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl sm:rounded-2xl shadow transition text-xs sm:text-sm"
            >
              🔄 {toCleanUppercase(t.btnRetry)}
            </button>
          </section>
        )}

        {/* Λίστα Ερωτήσεων */}
        <div className="space-y-4 sm:space-y-6">
          {questions.map((q, idx) => {
            let isCorrect = false;
            if (submitted) {
              if (q.type === 'input') {
                const u = parseFloat(String(userAnswers[q.id]).replace(',', '.').trim());
                const c = parseFloat(String(q.correct).replace(',', '.').trim());
                isCorrect = !isNaN(u) && Math.abs(u - c) <= 0.05;
              } else {
                isCorrect = String(userAnswers[q.id]).trim() === String(q.correct).trim();
              }
            }

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border transition-all min-w-0 ${
                  submitted
                    ? isCorrect
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-rose-300 bg-rose-50/20'
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                {/* Header Ερώτησης */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                        {q.chapterBadge}
                      </span>
                      <h3 className="font-bold text-sm sm:text-lg text-slate-900 leading-snug">
                        {q.title}
                      </h3>
                    </div>
                  </div>
                  {submitted && (
                    <span
                      className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold shrink-0 ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? t.badgeCorrect : t.badgeIncorrect}
                    </span>
                  )}
                </div>

                {/* Εκφώνηση - No Giveaway */}
                <div className="text-slate-800 text-xs sm:text-base leading-relaxed mb-4 sm:mb-6 font-medium break-words [overflow-wrap:anywhere]">
                  {q.prompt}
                </div>

                {/* Πεδία Απάντησης */}
                <div className="mb-2">
                  {q.type === 'tf' && (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-xs sm:max-w-md">
                      {q.options.map(opt => {
                        const isSelected = userAnswers[q.id] === opt;
                        return (
                          <button
                            type="button"
                            key={opt}
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm border transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {q.options.map(opt => {
                        const isSelected = userAnswers[q.id] === opt;
                        return (
                          <button
                            type="button"
                            key={opt}
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl text-left border flex items-center gap-2.5 transition-all min-h-[48px] sm:min-h-[56px] min-w-0 ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-white bg-white' : 'border-slate-400'
                              }`}
                            >
                              {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                            </span>
                            <span className="break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex-1 font-semibold text-xs sm:text-sm">
                              {q.renderOption ? q.renderOption(opt) : opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'input' && (
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full sm:max-w-xs">
                      <input
                        type="text"
                        disabled={submitted}
                        value={userAnswers[q.id] || ''}
                        onChange={(e) => {
                          const sanitized = sanitizeInput(e.target.value);
                          handleAnswerChange(q.id, sanitized);
                        }}
                        placeholder={t.placeholderInput}
                        className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-slate-900 text-xs sm:text-sm"
                      />
                      {q.unit && (
                        <span className="text-xs sm:text-sm font-bold text-slate-500 whitespace-nowrap">
                          {q.unit}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* FEEDBACK SECTION - SAFE SCROLL TABLES */}
                {submitted && (
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200 space-y-3 animate-fade-in">
                    {q.tableData && q.tableData.length > 0 && (
                      <div className="w-full overflow-x-auto block -mx-1 sm:mx-0 rounded-xl border border-slate-200 bg-white">
                        <table className="w-full text-xs text-left min-w-[280px]">
                          <thead className="bg-slate-100 text-slate-700 font-bold">
                            <tr>
                              <th className="p-2 border-b">{t.tableColStep}</th>
                              <th className="p-2 border-b">{t.tableColDetails}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-[11px] sm:text-xs">
                            {q.tableData.map((row, rIdx) => (
                              <tr key={rIdx}>
                                <td className="p-2 font-semibold text-slate-800">{row.label}</td>
                                <td className="p-2 font-mono text-indigo-900 break-words [overflow-wrap:anywhere]">{row.details}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="p-3 sm:p-4 bg-slate-100/70 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed">
                      <div className="font-bold text-slate-900 mb-1 flex flex-wrap items-center gap-1.5">
                        <span>{t.correctAnswerLabel}</span>
                        <span className="font-mono text-emerald-700 font-bold inline-flex items-center whitespace-nowrap gap-1">
                          {q.renderOption ? q.renderOption(q.correct) : q.correct} {q.unit || ''}
                        </span>
                      </div>
                      <div className="mt-1 break-words [overflow-wrap:anywhere]">{q.explanation}</div>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* STICKY BOTTOM SCORE BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white px-3 sm:px-6 py-2.5 sm:py-3.5 shadow-2xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
            <div className="min-w-0">
              {!submitted ? (
                <div className="text-[11px] sm:text-sm font-bold text-slate-300 truncate">
                  {toCleanUppercase(t.footerAnswered)}: <span className="text-indigo-400 font-black">{answeredCount}</span> / 18
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[11px] sm:text-sm font-black">
                  <span className="text-emerald-400">{toCleanUppercase(t.footerScore)}: {score} / 18</span>
                  <span className="hidden xs:inline text-slate-500">|</span>
                  <span className="text-indigo-300">{Math.round((score / 18) * 100)}%</span>
                </div>
              )}
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {!submitted ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={answeredCount === 0}
                  className={`px-3.5 py-2 sm:px-6 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                    answeredCount > 0
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {toCleanUppercase(t.btnCheck)}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={loadNewSet}
                  className="px-3.5 py-2 sm:px-6 sm:py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition whitespace-nowrap"
                >
                  {toCleanUppercase(t.btnNewSet)}
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}