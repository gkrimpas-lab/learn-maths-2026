// pages/st-dimotikou/27-prosthesi-klasmaton-ask.js
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

function findGCD(a, b) {
  let x = Math.abs(a || 0);
  let y = Math.abs(b || 0);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function findLCM(a, b) {
  if (!a || !b) return 1;
  return Math.abs(a * b) / findGCD(a, b);
}

// Αυστηρή συνάρτηση αφαίρεσης τόνων για κεφαλαία (εξαιρείται το ΣΤ')
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

// Εγγύηση 4 μοναδικών επιλογών στα MCQ
function makeUniqueOptions(correctOption, wrongCandidates) {
  const unique = new Map();
  unique.set(String(correctOption.val), correctOption);
  for (const opt of wrongCandidates) {
    if (opt && opt.val !== undefined && opt.val !== null && opt.val !== '') {
      const key = String(opt.val);
      if (!unique.has(key)) {
        unique.set(key, opt);
      }
    }
    if (unique.size === 4) break;
  }
  return shuffle(Array.from(unique.values()));
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
    <span className={`inline-flex flex-col items-center justify-center align-middle font-mono leading-none px-0.5 sm:px-1 shrink-0 max-w-full ${className}`}>
      <span className={`${selected.numDen} pb-0.5 break-all text-center`}>{num}</span>
      <span className={`${selected.line} bg-current rounded-full my-0.5 min-w-[12px] max-w-full`} />
      <span className={`${selected.numDen} pt-0.5 break-all text-center`}>{den}</span>
    </span>
  );
}

// ---------------------------------------------------------
// ΛΕΞΙΚΟ i18n
// ---------------------------------------------------------

const TRANSLATIONS = {
  el: {
    pageTitle: "Ασκήσεις: Πρόσθεση Κλασμάτων - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην πρόσθεση ομώνυμων και ετερώνυμων κλασμάτων για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 27 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Πρόσθεση Κλασμάτων",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην πρόσθεση ομώνυμων και ετερώνυμων κλασμάτων, στην εύρεση Ε.Κ.Π. και στην απλοποίηση!",
    newQuestions: "Νέες Ασκήσεις",
    exercise: "Άσκηση",
    trueBtn: "Σωστό",
    falseBtn: "Λάθος",
    inputPlaceholder: "π.χ. 3/4",
    tableHeaderElement: "Στοιχείο",
    tableHeaderFormula: "Πράξη / Μέθοδος",
    tableHeaderValue: "Τιμή",
    feedbackSuccess: "🎯 Εξαιρετικά!",
    feedbackReview: "💡 Επεξήγηση:",
    checkBtn: "Έλεγχος Απαντήσεων",
    scoreBadge: "Σκορ",
    answeredBadge: "Απαντήθηκαν",
    percentage: "Ποσοστό",
    bottomHint: "Απάντησε και στις 10 ερωτήσεις και πάτησε «Έλεγχος Απαντήσεων»!",
    lcmLabel: "Ε.Κ.Π.",
    gcdLabel: "Μ.Κ.Δ."
  },
  en: {
    pageTitle: "Exercises: Adding Fractions - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on adding like and unlike fractions for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 27 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: Adding Fractions",
    desc: "Solve the 10 dynamic problems to practice adding like and unlike fractions, computing LCM, and simplifying sums!",
    newQuestions: "New Exercises",
    exercise: "Exercise",
    trueBtn: "True",
    falseBtn: "False",
    inputPlaceholder: "e.g. 3/4",
    tableHeaderElement: "Element",
    tableHeaderFormula: "Operation / Method",
    tableHeaderValue: "Value",
    feedbackSuccess: "🎯 Excellent!",
    feedbackReview: "💡 Explanation:",
    checkBtn: "Check Answers",
    scoreBadge: "Score",
    answeredBadge: "Answered",
    percentage: "Percentage",
    bottomHint: "Answer all 10 questions and press 'Check Answers'!",
    lcmLabel: "LCM",
    gcdLabel: "GCD"
  }
};

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 & Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'sp1',
    generate: (locale) => {
      const p1 = locale === 'en' ? 'Nikos' : 'Ο Νίκος';
      const p2 = locale === 'en' ? 'Petros' : 'ο Πέτρος';
      const n1 = 1;
      const d1 = 4;
      const n2 = 1;
      const d2 = 2;
      const resN = 3;
      const resD = 4;
      const correctVal = `${resN}/${resD}`;
      const correctOption = { val: correctVal, render: <Fraction num={resN} den={resD} size="md" /> };
      const wrongList = [
        { val: '2/6', render: <Fraction num="2" den="6" size="md" /> },
        { val: '3/8', render: <Fraction num="3" den="8" size="md" /> },
        { val: '2/4', render: <Fraction num="2" den="4" size="md" /> },
        { val: '1/4', render: <Fraction num="1" den="4" size="md" /> }
      ];

      return {
        title: locale === 'en' ? 'Pizza Consumption at a Party' : 'Κατανάλωση Πίτσας σε Πάρτι',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{p1}</span>
            <span>{locale === 'en' ? 'ate' : 'έφαγε το'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'of a pizza and' : 'μιας πίτσας και'}</span>
            <span>{p2}</span>
            <span>{locale === 'en' ? 'ate' : 'έφαγε το'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'of the same pizza. What fraction of the pizza was eaten in total?' : 'της ίδιας πίτσας. Ποιο μέρος της πίτσας καταναλώθηκε συνολικά;'}</span>
          </span>
        ),
        correctText: correctVal,
        options: makeUniqueOptions(correctOption, wrongList),
        tableData: [
          { item: locale === 'en' ? 'Slice of Nikos' : 'Κομμάτι Νίκου', formula: <Fraction num={n1} den={d1} size="sm" />, val: <Fraction num={n1} den={d1} size="sm" /> },
          {
            item: locale === 'en' ? 'Slice of Petros (Like)' : 'Κομμάτι Πέτρου (Ομώνυμο)',
            formula: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num={`${n2} · 2`} den={`${d2} · 2`} size="sm" />
              </span>
            ),
            val: <Fraction num="2" den={resD} size="sm" />
          },
          {
            item: locale === 'en' ? 'Total Sum' : 'Συνολικό Άθροισμα',
            formula: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num={n1} den={resD} size="sm" />
                <span>＋</span>
                <Fraction num="2" den={resD} size="sm" />
              </span>
            ),
            val: <Fraction num={resN} den={resD} size="sm" />
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <span>Convert to common denominator with LCM(4, 2) ＝ 4.</span>
                <Fraction num="1" den="2" size="sm" />
                <span>becomes</span>
                <Fraction num="2" den="4" size="sm" />
                <span>. Add numerators:</span>
                <Fraction num="1" den="4" size="sm" />
                <span>＋</span>
                <Fraction num="2" den="4" size="sm" />
                <span>＝</span>
                <Fraction num={resN} den={resD} size="sm" />
                <span>.</span>
              </>
            ) : (
              <>
                <span>Κάνουμε τα κλάσματα ομώνυμα με Ε.Κ.Π.(4, 2) ＝ 4. Το</span>
                <Fraction num="1" den="2" size="sm" />
                <span>γίνεται</span>
                <Fraction num="2" den="4" size="sm" />
                <span>. Προσθέτουμε τους αριθμητές:</span>
                <Fraction num="1" den="4" size="sm" />
                <span>＋</span>
                <Fraction num="2" den="4" size="sm" />
                <span>＝</span>
                <Fraction num={resN} den={resD} size="sm" />
                <span>.</span>
              </>
            )}
          </span>
        )
      };
    }
  },
  {
    id: 'sp2',
    generate: (locale) => {
      const p1 = locale === 'en' ? 'Eleni' : 'Η Ελένη';
      const p2 = locale === 'en' ? 'Maria' : 'η Μαρία';
      const n1 = 1;
      const d1 = 3;
      const n2 = 1;
      const d2 = 6;
      const correctVal = '1/2';
      const correctOption = {
        val: correctVal,
        render: (
          <span className="inline-flex items-center gap-1 flex-wrap justify-center">
            <Fraction num="1" den="2" size="md" />
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 3/6' : 'ή 3/6'})</span>
          </span>
        )
      };
      const wrongList = [
        { val: '2/9', render: <Fraction num="2" den="9" size="md" /> },
        { val: '2/6', render: <Fraction num="2" den="6" size="md" /> },
        { val: '2/3', render: <Fraction num="2" den="3" size="md" /> },
        { val: '5/6', render: <Fraction num="5" den="6" size="md" /> }
      ];

      return {
        title: locale === 'en' ? 'Orange and Apple Juice' : 'Χυμός Πορτοκαλιού και Μήλου',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{p1}</span>
            <span>{locale === 'en' ? 'drank' : 'ήπιε το'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'of a liter of juice and' : 'ενός λίτρου χυμού και'}</span>
            <span>{p2}</span>
            <span>{locale === 'en' ? 'drank' : 'ήπιε το'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'of the same liter. What fraction was consumed in total?' : 'του ίδιου λίτρου. Ποιο μέρος του λίτρου καταναλώθηκε συνολικά;'}</span>
          </span>
        ),
        correctText: correctVal,
        options: makeUniqueOptions(correctOption, wrongList),
        tableData: [
          {
            item: locale === 'en' ? '1st Part (Like)' : '1ο Μέρος (Ομώνυμο)',
            formula: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num={`${n1} · 2`} den={`${d1} · 2`} size="sm" />
              </span>
            ),
            val: <Fraction num="2" den="6" size="sm" />
          },
          { item: locale === 'en' ? '2nd Part' : '2ο Μέρος', formula: <Fraction num={n2} den={d2} size="sm" />, val: <Fraction num="1" den="6" size="sm" /> },
          {
            item: locale === 'en' ? 'Sum & Simplify' : 'Άθροισμα & Απλοποίηση',
            formula: (
              <span className="inline-flex items-center gap-1 font-mono flex-wrap">
                <Fraction num="2" den="6" size="sm" />
                <span>＋</span>
                <Fraction num="1" den="6" size="sm" />
                <span>＝</span>
                <Fraction num="3" den="6" size="sm" />
                <span className="text-xs">(: 3)</span>
              </span>
            ),
            val: <Fraction num="1" den="2" size="sm" />
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <span>LCM(3, 6) ＝ 6.</span>
                <Fraction num="1" den="3" size="sm" />
                <span>becomes</span>
                <Fraction num="2" den="6" size="sm" />
                <span>. Add:</span>
                <Fraction num="2" den="6" size="sm" />
                <span>＋</span>
                <Fraction num="1" den="6" size="sm" />
                <span>＝</span>
                <Fraction num="3" den="6" size="sm" />
                <span>. Simplifying by 3 gives</span>
                <Fraction num="1" den="2" size="sm" />
                <span>.</span>
              </>
            ) : (
              <>
                <span>Ε.Κ.Π.(3, 6) ＝ 6. Το</span>
                <Fraction num="1" den="3" size="sm" />
                <span>γίνεται</span>
                <Fraction num="2" den="6" size="sm" />
                <span>. Προσθέτουμε:</span>
                <Fraction num="2" den="6" size="sm" />
                <span>＋</span>
                <Fraction num="1" den="6" size="sm" />
                <span>＝</span>
                <Fraction num="3" den="6" size="sm" />
                <span>. Απλοποιώντας με το 3 παίρνουμε</span>
                <Fraction num="1" den="2" size="sm" />
                <span>.</span>
              </>
            )}
          </span>
        )
      };
    }
  },
  {
    id: 'sp3',
    generate: (locale) => {
      const p1 = locale === 'en' ? 'Kostas' : 'Ο Κώστας';
      const p2 = locale === 'en' ? 'George' : 'ο Γιώργος';
      const n1 = 2;
      const d1 = 5;
      const n2 = 3;
      const d2 = 10;
      const resN = 7;
      const resD = 10;
      const correctVal = `${resN}/${resD}`;
      const correctOption = { val: correctVal, render: <Fraction num={resN} den={resD} size="md" /> };
      const wrongList = [
        { val: '5/15', render: <Fraction num="5" den="15" size="md" /> },
        { val: '5/10', render: <Fraction num="5" den="10" size="md" /> },
        { val: '6/10', render: <Fraction num="6" den="10" size="md" /> },
        { val: '8/10', render: <Fraction num="8" den="10" size="md" /> }
      ];

      return {
        title: locale === 'en' ? 'School Garden Planting' : 'Φύτευση Σχολικού Κήπου',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{p1}</span>
            <span>{locale === 'en' ? 'planted' : 'φύτεψε τα'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'of a school garden and' : 'ενός σχολικού κήπου και'}</span>
            <span>{p2}</span>
            <span>{locale === 'en' ? 'planted' : 'φύτεψε τα'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'of the garden. What portion was planted in total?' : 'του κήπου. Ποιο μέρος του κήπου φυτεύτηκε συνολικά;'}</span>
          </span>
        ),
        correctText: correctVal,
        options: makeUniqueOptions(correctOption, wrongList),
        tableData: [
          {
            item: locale === 'en' ? 'Kostas (Like)' : 'Μέρος Κώστα (Ομώνυμο)',
            formula: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num={`${n1} · 2`} den={`${d1} · 2`} size="sm" />
              </span>
            ),
            val: <Fraction num="4" den={resD} size="sm" />
          },
          { item: locale === 'en' ? 'George' : 'Μέρος Γιώργου', formula: <Fraction num={n2} den={d2} size="sm" />, val: <Fraction num="3" den={resD} size="sm" /> },
          {
            item: locale === 'en' ? 'Total' : 'Σύνολο',
            formula: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num="4" den={resD} size="sm" />
                <span>＋</span>
                <Fraction num="3" den={resD} size="sm" />
              </span>
            ),
            val: <Fraction num={resN} den={resD} size="sm" />
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <span>LCM(5, 10) ＝ 10.</span>
                <Fraction num="2" den="5" size="sm" />
                <span>becomes</span>
                <Fraction num="4" den="10" size="sm" />
                <span>. Add:</span>
                <Fraction num="4" den="10" size="sm" />
                <span>＋</span>
                <Fraction num="3" den="10" size="sm" />
                <span>＝</span>
                <Fraction num={resN} den={resD} size="sm" />
                <span>.</span>
              </>
            ) : (
              <>
                <span>Κάνουμε τα κλάσματα ομώνυμα με Ε.Κ.Π.(5, 10) ＝ 10. Το</span>
                <Fraction num="2" den="5" size="sm" />
                <span>γίνεται</span>
                <Fraction num="4" den="10" size="sm" />
                <span>. Προσθέτουμε:</span>
                <Fraction num="4" den="10" size="sm" />
                <span>＋</span>
                <Fraction num="3" den="10" size="sm" />
                <span>＝</span>
                <Fraction num={resN} den={resD} size="sm" />
                <span>.</span>
              </>
            )}
          </span>
        )
      };
    }
  },
  {
    id: 'sp4',
    generate: (locale) => {
      const p1 = locale === 'en' ? 'Anna' : 'Η Άννα';
      const p2 = locale === 'en' ? 'Sofia' : 'η Σοφία';
      const n1 = 1;
      const d1 = 8;
      const n2 = 3;
      const d2 = 8;
      const correctVal = '1/2';
      const correctOption = {
        val: correctVal,
        render: (
          <span className="inline-flex items-center gap-1 flex-wrap justify-center">
            <Fraction num="1" den="2" size="md" />
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 4/8' : 'ή 4/8'})</span>
          </span>
        )
      };
      const wrongList = [
        { val: '4/16', render: <Fraction num="4" den="16" size="md" /> },
        { val: '3/16', render: <Fraction num="3" den="16" size="md" /> },
        { val: '2/8', render: <Fraction num="2" den="8" size="md" /> },
        { val: '5/8', render: <Fraction num="5" den="8" size="md" /> }
      ];

      return {
        title: locale === 'en' ? 'Reading Book Chapters' : 'Ανάγνωση Κεφαλαίων Βιβλίου',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{p1}</span>
            <span>{locale === 'en' ? 'read' : 'διάβασε το'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'of a book in the morning and' : 'ενός βιβλίου το πρωί και'}</span>
            <span>{p2}</span>
            <span>{locale === 'en' ? 'read' : 'διάβασε τα'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'in the afternoon. What part was read in total?' : 'του βιβλίου το απόγευμα. Ποιο μέρος του βιβλίου διαβάστηκε συνολικά;'}</span>
          </span>
        ),
        correctText: correctVal,
        options: makeUniqueOptions(correctOption, wrongList),
        tableData: [
          { item: locale === 'en' ? 'Morning read' : 'Πρωινό διάβασμα', formula: <Fraction num={n1} den={d1} size="sm" />, val: <Fraction num={n1} den={d1} size="sm" /> },
          { item: locale === 'en' ? 'Afternoon read' : 'Απογευματινό διάβασμα', formula: <Fraction num={n2} den={d2} size="sm" />, val: <Fraction num={n2} den={d2} size="sm" /> },
          {
            item: locale === 'en' ? 'Sum (Like)' : 'Άθροισμα (Ομώνυμα)',
            formula: (
              <span className="inline-flex items-center gap-1 font-mono flex-wrap">
                <Fraction num={`${n1} ＋ ${n2}`} den={d1} size="sm" />
                <span>＝</span>
                <Fraction num="4" den="8" size="sm" />
                <span className="text-xs">(: 4)</span>
              </span>
            ),
            val: <Fraction num="1" den="2" size="sm" />
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <span>Fractions are already like:</span>
                <Fraction num="1" den="8" size="sm" />
                <span>＋</span>
                <Fraction num="3" den="8" size="sm" />
                <span>＝</span>
                <Fraction num="4" den="8" size="sm" />
                <span>. Simplifying by 4 yields</span>
                <Fraction num="1" den="2" size="sm" />
                <span>.</span>
              </>
            ) : (
              <>
                <span>Τα κλάσματα είναι ήδη ομώνυμα:</span>
                <Fraction num="1" den="8" size="sm" />
                <span>＋</span>
                <Fraction num="3" den="8" size="sm" />
                <span>＝</span>
                <Fraction num="4" den="8" size="sm" />
                <span>. Απλοποιώντας διαιρώντας με το 4 παίρνουμε</span>
                <Fraction num="1" den="2" size="sm" />
                <span>.</span>
              </>
            )}
          </span>
        )
      };
    }
  },
  {
    id: 'sp5',
    generate: (locale) => {
      const p1 = locale === 'en' ? 'Alex' : 'Ο Αλέξανδρος';
      const p2 = locale === 'en' ? 'Dimitris' : 'ο Δημήτρης';
      const n1 = 1;
      const d1 = 4;
      const n2 = 3;
      const d2 = 8;
      const resN = 5;
      const resD = 8;
      const correctVal = `${resN}/${resD}`;
      const correctOption = { val: correctVal, render: <Fraction num={resN} den={resD} size="md" /> };
      const wrongList = [
        { val: '4/12', render: <Fraction num="4" den="12" size="md" /> },
        { val: '4/8', render: <Fraction num="4" den="8" size="md" /> },
        { val: '6/8', render: <Fraction num="6" den="8" size="md" /> },
        { val: '7/8', render: <Fraction num="7" den="8" size="md" /> }
      ];

      return {
        title: locale === 'en' ? 'Relay Race Course' : 'Κάλυψη Αθλητικής Διαδρομής',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{locale === 'en' ? 'In a relay race,' : 'Σε έναν αγώνα σκυταλοδρομίας,'}</span>
            <span>{p1}</span>
            <span>{locale === 'en' ? 'covered' : 'κάλυψε το'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'of the course and' : 'της διαδρομής και'}</span>
            <span>{p2}</span>
            <span>{locale === 'en' ? 'covered' : 'κάλυψε τα'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'of the course. What fraction was covered in total?' : 'της διαδρομής. Ποιο μέρος της διαδρομής καλύφθηκε συνολικά;'}</span>
          </span>
        ),
        correctText: correctVal,
        options: makeUniqueOptions(correctOption, wrongList),
        tableData: [
          {
            item: locale === 'en' ? '1st Leg (Like)' : '1ο Τμήμα (Ομώνυμο)',
            formula: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num={`${n1} · 2`} den={`${d1} · 2`} size="sm" />
              </span>
            ),
            val: <Fraction num="2" den={resD} size="sm" />
          },
          { item: locale === 'en' ? '2nd Leg' : '2ο Τμήμα', formula: <Fraction num={n2} den={d2} size="sm" />, val: <Fraction num="3" den={resD} size="sm" /> },
          {
            item: locale === 'en' ? 'Total Distance' : 'Συνολικό Μέρος',
            formula: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num="2" den={resD} size="sm" />
                <span>＋</span>
                <Fraction num="3" den={resD} size="sm" />
              </span>
            ),
            val: <Fraction num={resN} den={resD} size="sm" />
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <span>LCM(4, 8) ＝ 8.</span>
                <Fraction num="1" den="4" size="sm" />
                <span>becomes</span>
                <Fraction num="2" den="8" size="sm" />
                <span>. Add:</span>
                <Fraction num="2" den="8" size="sm" />
                <span>＋</span>
                <Fraction num="3" den="8" size="sm" />
                <span>＝</span>
                <Fraction num={resN} den={resD} size="sm" />
                <span>.</span>
              </>
            ) : (
              <>
                <span>Ε.Κ.Π.(4, 8) ＝ 8. Το</span>
                <Fraction num="1" den="4" size="sm" />
                <span>γίνεται</span>
                <Fraction num="2" den="8" size="sm" />
                <span>. Προσθέτουμε:</span>
                <Fraction num="2" den="8" size="sm" />
                <span>＋</span>
                <Fraction num="3" den="8" size="sm" />
                <span>＝</span>
                <Fraction num={resN} den={resD} size="sm" />
                <span>.</span>
              </>
            )}
          </span>
        )
      };
    }
  },
  {
    id: 'sp6',
    generate: (locale) => {
      const p1 = locale === 'en' ? 'Christina' : 'Η Χριστίνα';
      const p2 = locale === 'en' ? 'Katerina' : 'η Κατερίνα';
      const n1 = 2;
      const d1 = 7;
      const n2 = 3;
      const d2 = 7;
      const resN = 5;
      const resD = 7;
      const correctVal = `${resN}/${resD}`;
      const correctOption = { val: correctVal, render: <Fraction num={resN} den={resD} size="md" /> };
      const wrongList = [
        { val: '5/14', render: <Fraction num="5" den="14" size="md" /> },
        { val: '6/7', render: <Fraction num="6" den="7" size="md" /> },
        { val: '4/7', render: <Fraction num="4" den="7" size="md" /> },
        { val: '1/7', render: <Fraction num="1" den="7" size="md" /> }
      ];

      return {
        title: locale === 'en' ? 'Coloring a Drawing' : 'Χρωμάτισμα Μεγάλου Σχεδίου',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{locale === 'en' ? 'In art class,' : 'Σε ένα μάθημα Εικαστικών,'}</span>
            <span>{p1}</span>
            <span>{locale === 'en' ? 'colored' : 'χρωμάτισε τα'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'of a design and' : 'ενός σχεδίου και'}</span>
            <span>{p2}</span>
            <span>{locale === 'en' ? 'colored' : 'χρωμάτισε τα'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'of it. What fraction was colored in total?' : 'του σχεδίου. Ποιο μέρος του σχεδίου χρωματίστηκε συνολικά;'}</span>
          </span>
        ),
        correctText: correctVal,
        options: makeUniqueOptions(correctOption, wrongList),
        tableData: [
          { item: p1, formula: <Fraction num={n1} den={d1} size="sm" />, val: <Fraction num={n1} den={d1} size="sm" /> },
          { item: p2, formula: <Fraction num={n2} den={d2} size="sm" />, val: <Fraction num={n2} den={d2} size="sm" /> },
          {
            item: locale === 'en' ? 'Sum (Like)' : 'Σύνολο (Ομώνυμα)',
            formula: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num={`${n1} ＋ ${n2}`} den={d1} size="sm" />
              </span>
            ),
            val: <Fraction num={resN} den={resD} size="sm" />
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <span>Directly add numerators for like fractions:</span>
                <Fraction num="2" den="7" size="sm" />
                <span>＋</span>
                <Fraction num="3" den="7" size="sm" />
                <span>＝</span>
                <Fraction num={resN} den={resD} size="sm" />
                <span>.</span>
              </>
            ) : (
              <>
                <span>Προσθέτουμε κατευθείαν τους αριθμητές στα ομώνυμα:</span>
                <Fraction num="2" den="7" size="sm" />
                <span>＋</span>
                <Fraction num="3" den="7" size="sm" />
                <span>＝</span>
                <Fraction num={resN} den={resD} size="sm" />
                <span>.</span>
              </>
            )}
          </span>
        )
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    generate: (locale) => {
      const correctVal = '7/6';
      const correctOption = {
        val: correctVal,
        render: (
          <span className="break-words">
            {locale === 'en' ? '7/6 (greater than 1)' : '7/6 (μεγαλύτερο από το 1)'}
          </span>
        )
      };
      const wrongList = locale === 'en'
        ? [
            { val: '3/5', render: <span className="break-words">3/5 (less than 1)</span> },
            { val: '5/6', render: <span className="break-words">5/6 (less than 1)</span> },
            { val: '6/6', render: <span className="break-words">6/6 (equal to 1)</span> }
          ]
        : [
            { val: '3/5', render: <span className="break-words">3/5 (μικρότερο από το 1)</span> },
            { val: '5/6', render: <span className="break-words">5/6 (μικρότερο από το 1)</span> },
            { val: '6/6', render: <span className="break-words">6/6 (ίσο με τη μονάδα)</span> }
          ];

      return {
        title: locale === 'en' ? 'Sum Greater than 1 Whole (＞ 1)' : 'Άθροισμα Μεγαλύτερο από τη Μονάδα (＞ 1)',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{locale === 'en' ? 'Calculate the sum' : 'Υπολόγισε το άθροισμα'}</span>
            <Fraction num="1" den="2" size="sm" />
            <span>＋</span>
            <Fraction num="2" den="3" size="sm" />
            <span>{locale === 'en' ? '. What do you observe about the result compared to 1?' : '. Τι παρατηρείς για το τελικό αποτέλεσμα σε σχέση με τη μονάδα;'}</span>
          </span>
        ),
        correctText: correctVal,
        options: makeUniqueOptions(correctOption, wrongList),
        tableData: [
          {
            item: (
              <span className="inline-flex items-center gap-1">
                <Fraction num="1" den="2" size="sm" />
              </span>
            ),
            formula: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num="1 · 3" den="6" size="sm" />
              </span>
            ),
            val: <Fraction num="3" den="6" size="sm" />
          },
          {
            item: (
              <span className="inline-flex items-center gap-1">
                <Fraction num="2" den="3" size="sm" />
              </span>
            ),
            formula: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num="2 · 2" den="6" size="sm" />
              </span>
            ),
            val: <Fraction num="4" den="6" size="sm" />
          },
          {
            item: locale === 'en' ? 'Sum' : 'Άθροισμα',
            formula: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num="3" den="6" size="sm" />
                <span>＋</span>
                <Fraction num="4" den="6" size="sm" />
              </span>
            ),
            val: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num="7" den="6" size="sm" />
                <span>(＞ 1)</span>
              </span>
            )
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <span>LCM(2, 3) ＝ 6:</span>
                <Fraction num="3" den="6" size="sm" />
                <span>＋</span>
                <Fraction num="4" den="6" size="sm" />
                <span>＝</span>
                <Fraction num="7" den="6" size="sm" />
                <span>. Since numerator ＞ denominator (7 ＞ 6), the sum is greater than 1 (improper fraction ＝ 1</span>
                <Fraction num="1" den="6" size="sm" />
                <span>).</span>
              </>
            ) : (
              <>
                <span>Ε.Κ.Π.(2, 3) ＝ 6:</span>
                <Fraction num="3" den="6" size="sm" />
                <span>＋</span>
                <Fraction num="4" den="6" size="sm" />
                <span>＝</span>
                <Fraction num="7" den="6" size="sm" />
                <span>. Επειδή 7 ＞ 6, το άθροισμα είναι μεγαλύτερο από το 1 (καταχρηστικό κλάσμα ＝ 1 και</span>
                <Fraction num="1" den="6" size="sm" />
                <span>).</span>
              </>
            )}
          </span>
        )
      };
    }
  },
  {
    id: 'hp2',
    generate: (locale) => {
      const correctVal = '1';
      const correctOption = {
        val: correctVal,
        render: <span className="break-words">1 ({locale === 'en' ? 'or 6/6' : 'ή 6/6'})</span>
      };
      const wrongList = [
        { val: '3/11', render: <Fraction num="3" den="11" size="md" /> },
        { val: '5/6', render: <Fraction num="5" den="6" size="md" /> },
        { val: '7/6', render: <Fraction num="7" den="6" size="md" /> }
      ];

      return {
        title: locale === 'en' ? 'Adding Three Fractions' : 'Πρόσθεση Τριών Κλασμάτων',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{locale === 'en' ? 'Compute the sum of the three fractions:' : 'Υπολόγισε το άθροισμα των τριών κλασμάτων:'}</span>
            <Fraction num="1" den="2" size="sm" />
            <span>＋</span>
            <Fraction num="1" den="3" size="sm" />
            <span>＋</span>
            <Fraction num="1" den="6" size="sm" />
            <span>:</span>
          </span>
        ),
        correctText: correctVal,
        options: makeUniqueOptions(correctOption, wrongList),
        tableData: [
          { item: `${locale === 'en' ? 'LCM' : 'Ε.Κ.Π.'}(2, 3, 6)`, formula: locale === 'en' ? 'Common denominator' : 'Κοινός παρονομαστής', val: '6' },
          {
            item: locale === 'en' ? 'Convert to like' : 'Μετατροπή σε ομώνυμα',
            formula: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num="3" den="6" size="sm" />
                <span>＋</span>
                <Fraction num="2" den="6" size="sm" />
                <span>＋</span>
                <Fraction num="1" den="6" size="sm" />
              </span>
            ),
            val: <Fraction num="3 ＋ 2 ＋ 1" den="6" size="sm" />
          },
          {
            item: locale === 'en' ? 'Final Sum' : 'Τελικό Άθροισμα',
            formula: <Fraction num="6" den="6" size="sm" />,
            val: '1'
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <span>LCM(2, 3, 6) ＝ 6:</span>
                <Fraction num="3" den="6" size="sm" />
                <span>＋</span>
                <Fraction num="2" den="6" size="sm" />
                <span>＋</span>
                <Fraction num="1" den="6" size="sm" />
                <span>＝</span>
                <Fraction num="6" den="6" size="sm" />
                <span>＝ 1 whole unit.</span>
              </>
            ) : (
              <>
                <span>Ε.Κ.Π.(2, 3, 6) ＝ 6:</span>
                <Fraction num="3" den="6" size="sm" />
                <span>＋</span>
                <Fraction num="2" den="6" size="sm" />
                <span>＋</span>
                <Fraction num="1" den="6" size="sm" />
                <span>＝</span>
                <Fraction num="6" den="6" size="sm" />
                <span>＝ 1 ολόκληρη μονάδα.</span>
              </>
            )}
          </span>
        )
      };
    }
  },
  {
    id: 'hp3',
    generate: (locale) => {
      const kgLabel = locale === 'en' ? 'kg' : 'κιλά';
      const correctVal = '11/4';
      const correctOption = { val: correctVal, render: <Fraction num="11" den="4" size="md" /> };
      const wrongList = [
        { val: '7/4', render: <Fraction num="7" den="4" size="md" /> },
        { val: '9/4', render: <Fraction num="9" den="4" size="md" /> },
        { val: '2/6', render: <Fraction num="2" den="6" size="md" /> },
        { val: '5/4', render: <Fraction num="5" den="4" size="md" /> }
      ];

      return {
        title: locale === 'en' ? 'Adding Whole Number with Fractions' : 'Σύνθετη Πρόσθεση Ακέραιου με Κλάσματα',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{locale === 'en' ? 'A chef used 2 whole kg of flour, plus' : 'Ένας μάγειρας χρησιμοποίησε 2 ολόκληρα κιλά αλεύρι, επιπλέον'}</span>
            <Fraction num="1" den="4" size="sm" />
            <span>{locale === 'en' ? 'kg, and another' : 'του κιλού και ακόμη'}</span>
            <Fraction num="1" den="2" size="sm" />
            <span>{locale === 'en' ? 'kg. How many kg of flour did he use in total as a fraction?' : 'του κιλού. Πόσα κιλά αλεύρι χρησιμοποίησε συνολικά σε κλασματική μορφή;'}</span>
          </span>
        ),
        correctText: correctVal,
        options: makeUniqueOptions(correctOption, wrongList),
        tableData: [
          {
            item: locale === 'en' ? 'Fractions' : 'Κλάσματα αλευριού',
            formula: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num="1" den="4" size="sm" />
                <span>＋</span>
                <Fraction num="1" den="2" size="sm" />
                <span>＝</span>
                <Fraction num="1" den="4" size="sm" />
                <span>＋</span>
                <Fraction num="2" den="4" size="sm" />
              </span>
            ),
            val: (
              <span className="inline-flex items-center gap-1">
                <Fraction num="3" den="4" size="sm" />
                <span>{kgLabel}</span>
              </span>
            )
          },
          {
            item: locale === 'en' ? 'Whole number' : 'Ακέραιος σε τέταρτα',
            formula: (
              <span className="inline-flex items-center gap-1 font-mono">
                <span>2 ＝</span>
                <Fraction num="8" den="4" size="sm" />
              </span>
            ),
            val: (
              <span className="inline-flex items-center gap-1">
                <Fraction num="8" den="4" size="sm" />
                <span>{kgLabel}</span>
              </span>
            )
          },
          {
            item: locale === 'en' ? 'Total weight' : 'Συνολικό βάρος',
            formula: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num="8" den="4" size="sm" />
                <span>＋</span>
                <Fraction num="3" den="4" size="sm" />
              </span>
            ),
            val: (
              <span className="inline-flex items-center gap-1">
                <Fraction num="11" den="4" size="sm" />
                <span>{kgLabel}</span>
              </span>
            )
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <span>Fractions:</span>
                <Fraction num="1" den="4" size="sm" />
                <span>＋</span>
                <Fraction num="2" den="4" size="sm" />
                <span>＝</span>
                <Fraction num="3" den="4" size="sm" />
                <span>. Adding whole number 2 (</span>
                <Fraction num="8" den="4" size="sm" />
                <span>):</span>
                <Fraction num="8" den="4" size="sm" />
                <span>＋</span>
                <Fraction num="3" den="4" size="sm" />
                <span>＝</span>
                <Fraction num="11" den="4" size="sm" />
                <span>kg.</span>
              </>
            ) : (
              <>
                <span>Προσθέτουμε πρώτα τα κλάσματα:</span>
                <Fraction num="1" den="4" size="sm" />
                <span>＋</span>
                <Fraction num="2" den="4" size="sm" />
                <span>＝</span>
                <Fraction num="3" den="4" size="sm" />
                <span>. Μαζί με τα 2 ακέραια κιλά (</span>
                <Fraction num="8" den="4" size="sm" />
                <span>) έχουμε</span>
                <Fraction num="8" den="4" size="sm" />
                <span>＋</span>
                <Fraction num="3" den="4" size="sm" />
                <span>＝</span>
                <Fraction num="11" den="4" size="sm" />
                <span>κιλά.</span>
              </>
            )}
          </span>
        )
      };
    }
  },
  {
    id: 'hp4',
    generate: (locale) => {
      const correctVal = '1/2';
      const correctOption = {
        val: correctVal,
        render: (
          <span className="inline-flex items-center gap-1 flex-wrap justify-center">
            <Fraction num="1" den="2" size="md" />
            <span className="text-xs text-slate-500 font-sans">({locale === 'en' ? 'or 3/6' : 'ή 3/6'})</span>
          </span>
        )
      };
      const wrongList = [
        { val: '2/3', render: <Fraction num="2" den="3" size="md" /> },
        { val: '1/3', render: <Fraction num="1" den="3" size="md" /> },
        { val: '4/6', render: <Fraction num="4" den="6" size="md" /> },
        { val: '1/6', render: <Fraction num="1" den="6" size="md" /> }
      ];

      return {
        title: locale === 'en' ? 'Finding the Missing Addend Fraction' : 'Εύρεση Άγνωστου Κλάσματος',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{locale === 'en' ? 'Which fraction must be added to' : 'Ποιο κλάσμα πρέπει να προστεθεί στο'}</span>
            <Fraction num="1" den="3" size="sm" />
            <span>{locale === 'en' ? 'to get a sum of' : 'για να προκύψει άθροισμα ίσο με'}</span>
            <Fraction num="5" den="6" size="sm" />
            <span>;</span>
          </span>
        ),
        correctText: correctVal,
        options: makeUniqueOptions(correctOption, wrongList),
        tableData: [
          {
            item: <Fraction num="1" den="3" size="sm" />,
            formula: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num="1 · 2" den="6" size="sm" />
              </span>
            ),
            val: <Fraction num="2" den="6" size="sm" />
          },
          { item: locale === 'en' ? 'Target' : 'Στόχος', formula: <Fraction num="5" den="6" size="sm" />, val: <Fraction num="5" den="6" size="sm" /> },
          {
            item: locale === 'en' ? 'Difference' : 'Άγνωστο μέρος',
            formula: (
              <span className="inline-flex items-center gap-1 font-mono flex-wrap">
                <Fraction num="5" den="6" size="sm" />
                <span>－</span>
                <Fraction num="2" den="6" size="sm" />
                <span>＝</span>
                <Fraction num="3" den="6" size="sm" />
                <span className="text-xs">(: 3)</span>
              </span>
            ),
            val: <Fraction num="1" den="2" size="sm" />
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <Fraction num="1" den="3" size="sm" />
                <span>＝</span>
                <Fraction num="2" den="6" size="sm" />
                <span>. To reach</span>
                <Fraction num="5" den="6" size="sm" />
                <span>, we need</span>
                <Fraction num="5" den="6" size="sm" />
                <span>－</span>
                <Fraction num="2" den="6" size="sm" />
                <span>＝</span>
                <Fraction num="3" den="6" size="sm" />
                <span>, which simplifies to</span>
                <Fraction num="1" den="2" size="sm" />
                <span>.</span>
              </>
            ) : (
              <>
                <span>Το</span>
                <Fraction num="1" den="3" size="sm" />
                <span>είναι ίσο με</span>
                <Fraction num="2" den="6" size="sm" />
                <span>. Για να φτάσουμε στα</span>
                <Fraction num="5" den="6" size="sm" />
                <span>, χρειαζόμαστε</span>
                <Fraction num="5" den="6" size="sm" />
                <span>－</span>
                <Fraction num="2" den="6" size="sm" />
                <span>＝</span>
                <Fraction num="3" den="6" size="sm" />
                <span>, το οποίο απλοποιείται σε</span>
                <Fraction num="1" den="2" size="sm" />
                <span>.</span>
              </>
            )}
          </span>
        )
      };
    }
  },
  {
    id: 'hp5',
    generate: (locale) => {
      const correctVal = '11/30';
      const correctOption = { val: correctVal, render: <Fraction num="11" den="30" size="md" /> };
      const wrongList = [
        { val: '4/25', render: <Fraction num="4" den="25" size="md" /> },
        { val: '7/30', render: <Fraction num="7" den="30" size="md" /> },
        { val: '13/30', render: <Fraction num="13" den="30" size="md" /> },
        { val: '1/3', render: <Fraction num="1" den="3" size="md" /> }
      ];

      return {
        title: locale === 'en' ? 'Sum with Unlike Denominators' : 'Διπλή Απλοποίηση σε Άθροισμα',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{locale === 'en' ? 'Calculate the sum of unlike fractions:' : 'Υπολόγισε το άθροισμα των ετερώνυμων κλασμάτων:'}</span>
            <Fraction num="3" den="10" size="sm" />
            <span>＋</span>
            <Fraction num="1" den="15" size="sm" />
            <span>:</span>
          </span>
        ),
        correctText: correctVal,
        options: makeUniqueOptions(correctOption, wrongList),
        tableData: [
          { item: `${locale === 'en' ? 'LCM' : 'Ε.Κ.Π.'}(10, 15)`, formula: '30', val: '30' },
          {
            item: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num="3" den="10" size="sm" />
                <span>(· 3)</span>
              </span>
            ),
            formula: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num="3 · 3" den="30" size="sm" />
              </span>
            ),
            val: <Fraction num="9" den="30" size="sm" />
          },
          {
            item: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num="1" den="15" size="sm" />
                <span>(· 2)</span>
              </span>
            ),
            formula: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num="1 · 2" den="30" size="sm" />
              </span>
            ),
            val: <Fraction num="2" den="30" size="sm" />
          },
          {
            item: locale === 'en' ? 'Sum' : 'Άθροισμα',
            formula: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num="9" den="30" size="sm" />
                <span>＋</span>
                <Fraction num="2" den="30" size="sm" />
              </span>
            ),
            val: <Fraction num="11" den="30" size="sm" />
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <span>LCM(10, 15) ＝ 30:</span>
                <Fraction num="9" den="30" size="sm" />
                <span>＋</span>
                <Fraction num="2" den="30" size="sm" />
                <span>＝</span>
                <Fraction num="11" den="30" size="sm" />
                <span>.</span>
              </>
            ) : (
              <>
                <span>Ε.Κ.Π.(10, 15) ＝ 30:</span>
                <Fraction num="9" den="30" size="sm" />
                <span>＋</span>
                <Fraction num="2" den="30" size="sm" />
                <span>＝</span>
                <Fraction num="11" den="30" size="sm" />
                <span>.</span>
              </>
            )}
          </span>
        )
      };
    }
  },
  {
    id: 'hp6',
    generate: (locale) => {
      const correctVal = '3/8';
      const correctOption = { val: correctVal, render: <Fraction num="3" den="8" size="md" /> };
      const wrongList = [
        { val: '5/8', render: <Fraction num="5" den="8" size="md" /> },
        { val: '1/8', render: <Fraction num="1" den="8" size="md" /> },
        { val: '1/2', render: <Fraction num="1" den="2" size="md" /> },
        { val: '7/8', render: <Fraction num="7" den="8" size="md" /> }
      ];

      return {
        title: locale === 'en' ? 'Remaining Gap to 1 Whole' : 'Συμπλήρωση ως την Ακέραια Μονάδα (1)',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{locale === 'en' ? 'A student read' : 'Ένας μαθητής διάβασε τα'}</span>
            <Fraction num="3" den="8" size="sm" />
            <span>{locale === 'en' ? 'of a book on Monday and' : 'ενός βιβλίου τη Δευτέρα και το'}</span>
            <Fraction num="1" den="4" size="sm" />
            <span>{locale === 'en' ? 'on Tuesday. What fraction of the book remains to be read?' : 'την Τρίτη. Ποιο μέρος του βιβλίου του απομένει ακόμα να διαβάσει για να το τελειώσει ολόκληρο;'}</span>
          </span>
        ),
        correctText: correctVal,
        options: makeUniqueOptions(correctOption, wrongList),
        tableData: [
          {
            item: locale === 'en' ? 'Read so far' : 'Διάβασμα Δευτέρας & Τρίτης',
            formula: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num="3" den="8" size="sm" />
                <span>＋</span>
                <Fraction num="2" den="8" size="sm" />
              </span>
            ),
            val: <Fraction num="5" den="8" size="sm" />
          },
          {
            item: locale === 'en' ? 'Whole book (1)' : 'Ολόκληρο το βιβλίο (Μονάδα)',
            formula: <Fraction num="8" den="8" size="sm" />,
            val: <Fraction num="8" den="8" size="sm" />
          },
          {
            item: locale === 'en' ? 'Remaining' : 'Μέρος που απομένει',
            formula: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num="8" den="8" size="sm" />
                <span>－</span>
                <Fraction num="5" den="8" size="sm" />
              </span>
            ),
            val: <Fraction num="3" den="8" size="sm" />
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <span>Total read:</span>
                <Fraction num="3" den="8" size="sm" />
                <span>＋</span>
                <Fraction num="1" den="4" size="sm" />
                <span>＝</span>
                <Fraction num="3" den="8" size="sm" />
                <span>＋</span>
                <Fraction num="2" den="8" size="sm" />
                <span>＝</span>
                <Fraction num="5" den="8" size="sm" />
                <span>. Remaining to finish the whole book (</span>
                <Fraction num="8" den="8" size="sm" />
                <span>):</span>
                <Fraction num="8" den="8" size="sm" />
                <span>－</span>
                <Fraction num="5" den="8" size="sm" />
                <span>＝</span>
                <Fraction num="3" den="8" size="sm" />
                <span>.</span>
              </>
            ) : (
              <>
                <span>Συνολικά διάβασε</span>
                <Fraction num="3" den="8" size="sm" />
                <span>＋</span>
                <Fraction num="1" den="4" size="sm" />
                <span>＝</span>
                <Fraction num="3" den="8" size="sm" />
                <span>＋</span>
                <Fraction num="2" den="8" size="sm" />
                <span>＝</span>
                <Fraction num="5" den="8" size="sm" />
                <span>. Για να τελειώσει ολόκληρο το βιβλίο (</span>
                <Fraction num="8" den="8" size="sm" />
                <span>) απομένουν</span>
                <Fraction num="8" den="8" size="sm" />
                <span>－</span>
                <Fraction num="5" den="8" size="sm" />
                <span>＝</span>
                <Fraction num="3" den="8" size="sm" />
                <span>.</span>
              </>
            )}
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
  // Q1: Input - Πρόσθεση Ομώνυμων Κλασμάτων
  const q1Den = randInt(5, 12);
  const q1Num1 = randInt(1, Math.floor((q1Den - 1) / 2));
  const q1Num2 = randInt(1, q1Den - q1Num1 - 1);
  const q1SumNum = q1Num1 + q1Num2;
  const q1Gcd = findGCD(q1SumNum, q1Den);
  const q1CorrectRaw = `${q1SumNum}/${q1Den}`;
  const q1CorrectSimp = `${q1SumNum / q1Gcd}/${q1Den / q1Gcd}`;

  // Q2: Input - Πρόσθεση Ετερώνυμων Κλασμάτων
  const q2Pairs = [
    { n1: 1, d1: 2, n2: 1, d2: 4 },
    { n1: 1, d1: 3, n2: 1, d2: 6 },
    { n1: 2, d1: 5, n2: 3, d2: 10 },
    { n1: 1, d1: 4, n2: 3, d2: 8 },
    { n1: 2, d1: 3, n2: 1, d2: 6 },
    { n1: 1, d1: 2, n2: 1, d2: 3 }
  ];
  const q2Item = q2Pairs[randInt(0, q2Pairs.length - 1)];
  const q2Lcm = findLCM(q2Item.d1, q2Item.d2);
  const q2Equiv1 = q2Item.n1 * (q2Lcm / q2Item.d1);
  const q2Equiv2 = q2Item.n2 * (q2Lcm / q2Item.d2);
  const q2SumN = q2Equiv1 + q2Equiv2;
  const q2G = findGCD(q2SumN, q2Lcm);
  const q2CorrectRaw = `${q2SumN}/${q2Lcm}`;
  const q2CorrectSimp = `${q2SumN / q2G}/${q2Lcm / q2G}`;

  // Q3: MCQ - Εύρεση του Κοινού Παρονομαστή (Ε.Κ.Π.)
  const q3D1 = [2, 3, 4, 6][randInt(0, 3)];
  let q3D2 = [3, 4, 5, 8, 9][randInt(0, 4)];
  while (q3D1 === q3D2) q3D2 += 2;
  const q3Lcm = findLCM(q3D1, q3D2);
  const q3CorrectStr = String(q3Lcm);
  const q3CorrectOpt = { val: q3CorrectStr, render: <span>{q3CorrectStr}</span> };
  const q3Wrongs = [q3D1 * q3D2 + 2, Math.max(2, q3Lcm - 2), q3Lcm + q3D1, q3D1 * q3D2]
    .filter(w => w !== q3Lcm)
    .map(w => ({ val: String(w), render: <span>{String(w)}</span> }));
  const q3Options = makeUniqueOptions(q3CorrectOpt, q3Wrongs);

  // Q4: MCQ - Πρόσθεση Ακέραιου με Κλάσμα
  const q4Whole = randInt(1, 3);
  const q4Den = randInt(2, 5);
  const q4Num = randInt(1, q4Den - 1);
  const q4ResNum = q4Whole * q4Den + q4Num;
  const q4CorrectStr = `${q4ResNum}/${q4Den}`;
  const q4CorrectOpt = { val: q4CorrectStr, render: <Fraction num={q4ResNum} den={q4Den} size="md" /> };
  const q4Wrongs = [
    { num: q4ResNum + 1, den: q4Den },
    { num: q4Whole + q4Num, den: q4Den },
    { num: q4ResNum, den: q4Den + 1 },
    { num: q4ResNum + 2, den: q4Den }
  ].map(o => ({
    val: `${o.num}/${o.den}`,
    render: <Fraction num={o.num} den={o.den} size="md" />
  }));
  const q4Options = makeUniqueOptions(q4CorrectOpt, q4Wrongs);

  // Q5: True/False - Κανόνας ομωνύμων
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? (locale === 'en'
        ? 'When adding fractions with like denominators, we add only the numerators and keep the same denominator.'
        : 'Όταν προσθέτουμε ομώνυμα κλάσματα, προσθέτουμε μόνο τους αριθμητές και κρατάμε τον ίδιο παρονομαστή.')
    : (locale === 'en'
        ? 'When adding fractions with like denominators, we add numerators together and also add denominators together.'
        : 'Όταν προσθέτουμε ομώνυμα κλάσματα, προσθέτουμε τους αριθμητές και προσθέτουμε και τους παρονομαστές.');

  // Q6: True/False - Πρόσθεση ετερωνύμων
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? (locale === 'en'
        ? 'To add fractions with unlike denominators, we must first convert them to like denominators using the LCM.'
        : 'Για να προσθέσουμε ετερώνυμα κλάσματα, πρέπει πρώτα οπωσδήποτε να τα μετατρέψουμε σε ομώνυμα με το Ε.Κ.Π.')
    : (locale === 'en'
        ? 'We can directly add fractions with unlike denominators without changing their denominators.'
        : 'Μπορούμε να προσθέσουμε απευθείας ετερώνυμα κλάσματα χωρίς να αλλάξουμε τους παρονομαστές τους.');

  // Q7: Input - Εύρεση άγνωστου αριθμητή σε πρόσθεση
  const q7Den = randInt(6, 12);
  const q7Known = randInt(1, q7Den - 3);
  const q7Target = randInt(q7Known + 2, q7Den);
  const q7Correct = String(q7Target - q7Known);

  // Q8: MCQ - Απλοποίηση αθροίσματος
  const q8Pairs = [
    { n1: 2, d: 8, n2: 2, simpN: 1, simpD: 2 },
    { n1: 1, d: 9, n2: 2, simpN: 1, simpD: 3 },
    { n1: 3, d: 10, n2: 2, simpN: 1, simpD: 2 },
    { n1: 1, d: 6, n2: 3, simpN: 2, simpD: 3 }
  ];
  const q8Item = q8Pairs[randInt(0, q8Pairs.length - 1)];
  const q8CorrectStr = `${q8Item.simpN}/${q8Item.simpD}`;
  const q8CorrectOpt = {
    val: q8CorrectStr,
    render: <Fraction num={q8Item.simpN} den={q8Item.simpD} size="md" />
  };
  const q8Wrongs = [
    { num: 3, den: 4 },
    { num: 1, den: 4 },
    { num: 2, den: 5 },
    { num: 3, den: 5 }
  ].map(o => ({
    val: `${o.num}/${o.den}`,
    render: <Fraction num={o.num} den={o.den} size="md" />
  }));
  const q8Options = makeUniqueOptions(q8CorrectOpt, q8Wrongs);

  // Q9 & Q10: Problems from pools
  const spIndex = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q9Raw = STANDARD_PROBLEMS_POOL[spIndex].generate(locale);

  const hpIndex = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Raw = HARD_PROBLEMS_POOL[hpIndex].generate(locale);

  return [
    {
      id: 'q1',
      type: 'input',
      title: locale === 'en' ? 'Like Fractions Addition' : 'Ομώνυμα Κλάσματα',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
          <span>{locale === 'en' ? 'Calculate the sum of like fractions:' : 'Υπολόγισε το άθροισμα των ομώνυμων κλασμάτων:'}</span>
          <Fraction num={q1Num1} den={q1Den} size="sm" />
          <span>＋</span>
          <Fraction num={q1Num2} den={q1Den} size="sm" />
          <span>({locale === 'en' ? 'e.g. 3/7' : 'π.χ. 3/7'}):</span>
        </span>
      ),
      correct: q1CorrectRaw,
      altCorrect: q1CorrectSimp,
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <Fraction num={q1Num1} den={q1Den} size="sm" />
          <span>＋</span>
          <Fraction num={q1Num2} den={q1Den} size="sm" />
          <span>＝</span>
          <Fraction num={`${q1Num1} ＋ ${q1Num2}`} den={q1Den} size="sm" />
          <span>＝</span>
          <Fraction num={q1SumNum} den={q1Den} size="sm" />
          {q1Gcd > 1 && (
            <>
              <span>{locale === 'en' ? 'or simplified:' : 'ή απλοποιημένο:'}</span>
              <Fraction num={q1SumNum / q1Gcd} den={q1Den / q1Gcd} size="sm" />
            </>
          )}
          <span>.</span>
        </span>
      )
    },
    {
      id: 'q2',
      type: 'input',
      title: locale === 'en' ? 'Unlike Fractions Addition' : 'Ετερώνυμα Κλάσματα',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
          <span>{locale === 'en' ? 'Calculate the sum:' : 'Υπολόγισε το άθροισμα:'}</span>
          <Fraction num={q2Item.n1} den={q2Item.d1} size="sm" />
          <span>＋</span>
          <Fraction num={q2Item.n2} den={q2Item.d2} size="sm" />
          <span>({locale === 'en' ? 'e.g. 3/4' : 'π.χ. 3/4'}):</span>
        </span>
      ),
      correct: q2CorrectRaw,
      altCorrect: q2CorrectSimp,
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{locale === 'en' ? 'LCM' : 'Ε.Κ.Π.'}({q2Item.d1}, {q2Item.d2}) ＝ {q2Lcm}.</span>
          <Fraction num={q2Equiv1} den={q2Lcm} size="sm" />
          <span>＋</span>
          <Fraction num={q2Equiv2} den={q2Lcm} size="sm" />
          <span>＝</span>
          <Fraction num={q2SumN} den={q2Lcm} size="sm" />
          {q2G > 1 && (
            <>
              <span>＝</span>
              <Fraction num={q2SumN / q2G} den={q2Lcm / q2G} size="sm" />
            </>
          )}
          <span>.</span>
        </span>
      )
    },
    {
      id: 'q3',
      type: 'mcq',
      title: locale === 'en' ? 'Common Denominator (LCM)' : 'Κοινός Παρονομαστής (Ε.Κ.Π.)',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
          <span>{locale === 'en' ? 'What is the least common denominator (LCM) to add' : 'Ποιος είναι ο ελάχιστος κοινός παρονομαστής (Ε.Κ.Π.) για να προσθέσουμε τα κλάσματα'}</span>
          <Fraction num="1" den={q3D1} size="sm" />
          <span>{locale === 'en' ? 'and' : 'και'}</span>
          <Fraction num="1" den={q3D2} size="sm" />
          <span>;</span>
        </span>
      ),
      options: q3Options,
      correct: q3CorrectStr,
      explain: (
        <span>
          {locale === 'en' ? 'LCM' : 'Ε.Κ.Π.'}({q3D1}, {q3D2}) ＝ {q3Lcm}.
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'Whole Number ＋ Fraction' : 'Ακέραιος ＋ Κλάσμα',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
          <span>{locale === 'en' ? 'What is the sum of' : 'Ποιο είναι το αποτέλεσμα της πράξης'}</span>
          <span>{q4Whole} ＋</span>
          <Fraction num={q4Num} den={q4Den} size="sm" />
          <span>;</span>
        </span>
      ),
      options: q4Options,
      correct: q4CorrectStr,
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {locale === 'en' ? (
            <>
              <span>Write whole number as fraction: {q4Whole} ＝</span>
              <Fraction num={q4Whole * q4Den} den={q4Den} size="sm" />
              <span>. Add:</span>
            </>
          ) : (
            <>
              <span>Γράφουμε τον ακέραιο ως κλάσμα: {q4Whole} ＝</span>
              <Fraction num={q4Whole * q4Den} den={q4Den} size="sm" />
              <span>. Επομένως:</span>
            </>
          )}
          <Fraction num={q4Whole * q4Den} den={q4Den} size="sm" />
          <span>＋</span>
          <Fraction num={q4Num} den={q4Den} size="sm" />
          <span>＝</span>
          <Fraction num={q4ResNum} den={q4Den} size="sm" />
          <span>.</span>
        </span>
      )
    },
    {
      id: 'q5',
      type: 'tf',
      title: locale === 'en' ? 'Rule for Like Fractions' : 'Κανόνας Ομωνύμων',
      text: q5Text,
      correct: q5IsTrue,
      explain: (
        <span>
          {q5IsTrue
            ? (locale === 'en'
                ? 'Correct! For like fractions we add ONLY the numerators and keep the common denominator.'
                : 'Σωστά! Στα ομώνυμα κλάσματα προσθέτουμε ΜΟΝΟ τους αριθμητές.')
            : (locale === 'en'
                ? 'False! We NEVER add denominators together.'
                : 'Λάθος! ΠΟΤΕ δεν προσθέτουμε τους παρονομαστές μεταξύ τους.')}
        </span>
      )
    },
    {
      id: 'q6',
      type: 'tf',
      title: locale === 'en' ? 'Rule for Unlike Fractions' : 'Κανόνας Ετερωνύμων',
      text: q6Text,
      correct: q6IsTrue,
      explain: (
        <span>
          {q6IsTrue
            ? (locale === 'en'
                ? 'Correct! To add fractions with unlike denominators, we must first convert them to common denominators using LCM.'
                : 'Σωστά! Για να προσθέσουμε ετερώνυμα κλάσματα πρέπει πρώτα οπωσδήποτε να τα κάνουμε ομώνυμα με το Ε.Κ.Π.')
            : (locale === 'en'
                ? 'False! We cannot directly add unlike fractions without converting to a common denominator.'
                : 'Λάθος! Δεν μπορούμε να προσθέσουμε ετερώνυμα κλάσματα χωρίς να τα μετατρέψουμε πρώτα σε ομώνυμα.')}
        </span>
      )
    },
    {
      id: 'q7',
      type: 'input',
      title: locale === 'en' ? 'Finding Missing Numerator' : 'Εύρεση Άγνωστου Αριθμητή',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
          <span>{locale === 'en' ? 'Find numerator x in:' : 'Βρες τον αριθμητή x στην ισότητα:'}</span>
          <Fraction num={q7Known} den={q7Den} size="sm" />
          <span>＋</span>
          <Fraction num="x" den={q7Den} size="sm" />
          <span>＝</span>
          <Fraction num={q7Target} den={q7Den} size="sm" />
        </span>
      ),
      correct: q7Correct,
      explain: (
        <span>
          {q7Known} ＋ x ＝ {q7Target} ➔ x ＝ {q7Target} － {q7Known} ＝ {q7Correct}.
        </span>
      )
    },
    {
      id: 'q8',
      type: 'mcq',
      title: locale === 'en' ? 'Simplifying the Sum' : 'Απλοποίηση Αθροίσματος',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
          <span>{locale === 'en' ? 'What is the simplest irreducible fraction resulting from' : 'Ποιο είναι το απλούστερο ανάγωγο κλάσμα που προκύπτει από το άθροισμα'}</span>
          <Fraction num={q8Item.n1} den={q8Item.d} size="sm" />
          <span>＋</span>
          <Fraction num={q8Item.n2} den={q8Item.d} size="sm" />
          <span>;</span>
        </span>
      ),
      options: q8Options,
      correct: q8CorrectStr,
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <Fraction num={q8Item.n1} den={q8Item.d} size="sm" />
          <span>＋</span>
          <Fraction num={q8Item.n2} den={q8Item.d} size="sm" />
          <span>＝</span>
          <Fraction num={q8Item.n1 + q8Item.n2} den={q8Item.d} size="sm" />
          <span>＝</span>
          <Fraction num={q8Item.simpN} den={q8Item.simpD} size="sm" />
          <span>.</span>
        </span>
      )
    },
    {
      id: 'q9',
      type: 'mcq',
      title: `${locale === 'en' ? 'Problem' : 'Πρόβλημα'}: ${q9Raw.title}`,
      prompt: q9Raw.prompt,
      options: q9Raw.options,
      correct: q9Raw.correctText,
      tableData: q9Raw.tableData,
      explain: q9Raw.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `${locale === 'en' ? 'Challenge Problem' : 'Σύνθετο Πρόβλημα'}: ${q10Raw.title}`,
      prompt: q10Raw.prompt,
      options: q10Raw.options,
      correct: q10Raw.correctText,
      tableData: q10Raw.tableData,
      explain: q10Raw.explain
    }
  ];
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function ProsthesiKlasmatonExercisesPage() {
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
      let sanitized = String(rawValue).replace(/[^0-9/]/g, '');
      const parts = sanitized.split('/');
      if (parts.length > 2) {
        sanitized = parts[0] + '/' + parts.slice(1).join('');
      }
      if (sanitized.length > 10) {
        sanitized = sanitized.slice(0, 10);
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
      const cleanUser = userVal.replace(/\s+/g, '').trim().toLowerCase();
      const cleanTarget = q.correct.replace(/\s+/g, '').trim().toLowerCase();
      const cleanAlt = q.altCorrect ? q.altCorrect.replace(/\s+/g, '').trim().toLowerCase() : null;
      return cleanUser === cleanTarget || (cleanAlt && cleanUser === cleanAlt);
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

  const answeredCount = Object.values(answers).filter(
    val => val !== undefined && val !== null && String(val).trim() !== ''
  ).length;

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
          href="/st-dimotikou/27-prosthesi-klasmaton"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryNav)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-full 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 box-border">
        
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
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation"
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
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all min-w-0 ${getCardStyle(q)}`}
                >
                  <div className="min-w-0">
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-center mb-3 gap-2">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider break-words [overflow-wrap:anywhere]">
                        {toCleanUppercase(`${t.exercise} ${qNum}: ${q.title}`)}
                      </span>
                      {submitted && (
                        <span className="text-xl shrink-0">
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
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border text-center transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex items-center justify-center min-h-[52px] min-w-0 ${
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
                          type="text"
                          inputMode={q.id === 'q7' ? 'numeric' : 'text'}
                          autoComplete="off"
                          spellCheck="false"
                          maxLength={10}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                          placeholder={q.id === 'q7' ? (locale === 'en' ? 'e.g. 3' : 'π.χ. 3') : t.inputPlaceholder}
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
                          onClick={() => handleAnswerChange(q.id, false, 'tf')}
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

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3 min-w-0">
                      {q.tableData && q.tableData.length > 0 && (
                        <div className="w-full overflow-x-auto bg-white/90 p-2.5 rounded-2xl border border-slate-200 block">
                          <table className="w-full text-xs text-left text-slate-700">
                            <thead>
                              <tr className="border-b border-slate-200 font-black text-slate-500 uppercase">
                                <th className="p-1.5 whitespace-nowrap">{toCleanUppercase(t.tableHeaderElement)}</th>
                                <th className="p-1.5 whitespace-nowrap">{toCleanUppercase(t.tableHeaderFormula)}</th>
                                <th className="p-1.5 whitespace-nowrap">{toCleanUppercase(t.tableHeaderValue)}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
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
                        className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed break-words [overflow-wrap:anywhere] ${
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
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-base sm:text-lg font-black px-8 sm:px-10 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center gap-2.5 touch-manipulation"
              >
                <span className="text-xl">🎯</span>
                <span>{toCleanUppercase(t.checkBtn)}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
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
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation"
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