// pages/st-dimotikou/26-sigkrisi-klasmaton-ask.js
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

function gcd(a, b) {
  let x = Math.abs(a || 0);
  let y = Math.abs(b || 0);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function lcm(a, b) {
  if (!a || !b) return 1;
  return Math.abs(a * b) / gcd(a, b);
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
    pageTitle: "Ασκήσεις: Σύγκριση Κλασμάτων - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στη σύγκριση ομώνυμων, ετερώνυμων και ισοδύναμων κλασμάτων για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 26 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Σύγκριση Κλασμάτων",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στη σύγκριση ομώνυμων, ετερώνυμων κλασμάτων, στη μέθοδο χιαστί και στη σύγκριση με τη μονάδα!",
    newQuestions: "Νέες Ασκήσεις",
    exercise: "Άσκηση",
    trueBtn: "Σωστό",
    falseBtn: "Λάθος",
    inputPlaceholder: "Γράψε την απάντησή σου...",
    tableHeaderElement: "Στοιχείο",
    tableHeaderFormula: "Ανάλυση / Μέθοδος",
    tableHeaderValue: "Τιμή",
    feedbackSuccess: "🎯 Εξαιρετικά!",
    feedbackReview: "💡 Επεξήγηση:",
    checkBtn: "Έλεγχος Απαντήσεων",
    scoreBadge: "Σκορ",
    answeredBadge: "Απαντήθηκαν",
    percentage: "Ποσοστό",
    bottomHint: "Απάντησε και στις 10 ερωτήσεις και πάτησε «Έλεγχος Απαντήσεων»!",
    comparePrompt: "Σύγκρινε τα κλάσματα επιλέγοντας το σωστό σύμβολο:",
    lcmLabel: "Ε.Κ.Π.",
    gcdLabel: "Μ.Κ.Δ."
  },
  en: {
    pageTitle: "Exercises: Comparing Fractions - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on comparing like, unlike, and equivalent fractions for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 26 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: Comparing Fractions",
    desc: "Solve the 10 dynamic problems to practice comparing like and unlike fractions, the cross-multiplication method, and benchmarking against 1 whole!",
    newQuestions: "New Exercises",
    exercise: "Exercise",
    trueBtn: "True",
    falseBtn: "False",
    inputPlaceholder: "Type your answer...",
    tableHeaderElement: "Element",
    tableHeaderFormula: "Formula / Step",
    tableHeaderValue: "Value",
    feedbackSuccess: "🎯 Excellent!",
    feedbackReview: "💡 Explanation:",
    checkBtn: "Check Answers",
    scoreBadge: "Score",
    answeredBadge: "Answered",
    percentage: "Percentage",
    bottomHint: "Answer all 10 questions and press 'Check Answers'!",
    comparePrompt: "Compare the fractions by selecting the correct symbol:",
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
      const n1 = 3;
      const d1 = 5;
      const n2 = 4;
      const d2 = 7;
      const p1 = locale === 'en' ? 'Nikos' : 'Ο Νίκος';
      const p2 = locale === 'en' ? 'Eleni' : 'Η Ελένη';
      const correctVal = p1;
      const wrongList = [
        { val: p2, render: <span className="break-words">{p2}</span> },
        {
          val: locale === 'en' ? 'Both covered the same distance' : 'Και οι δύο την ίδια απόσταση',
          render: <span className="break-words">{locale === 'en' ? 'Both covered the same distance' : 'Και οι δύο την ίδια απόσταση'}</span>
        },
        {
          val: locale === 'en' ? 'Cannot be determined' : 'Δεν μπορούμε να γνωρίζουμε',
          render: <span className="break-words">{locale === 'en' ? 'Cannot be determined' : 'Δεν μπορούμε να γνωρίζουμε'}</span>
        }
      ];
      const correctOption = { val: correctVal, render: <span className="break-words">{correctVal}</span> };

      return {
        title: locale === 'en' ? 'Comparing Runners Distances' : 'Σύγκριση Αποστάσεων Δρομέων',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{p1}</span>
            <span>{locale === 'en' ? 'ran' : 'διάνυσε τα'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'of a track, while' : 'μιας διαδρομής, ενώ'}</span>
            <span>{p2}</span>
            <span>{locale === 'en' ? 'ran' : 'διάνυσε τα'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'of the same track. Who ran the greater distance?' : 'της ίδιας διαδρομής. Ποιος διάνυσε τη μεγαλύτερη απόσταση;'}</span>
          </span>
        ),
        correctText: correctVal,
        options: makeUniqueOptions(correctOption, wrongList),
        tableData: [
          {
            item: p1,
            formula: (
              <span className="inline-flex flex-wrap items-center gap-1 font-mono">
                <Fraction num={n1} den={d1} size="sm" />
                <span>＝</span>
                <Fraction num={`${n1} · 7`} den="35" size="sm" />
              </span>
            ),
            val: <Fraction num="21" den="35" size="sm" />
          },
          {
            item: p2,
            formula: (
              <span className="inline-flex flex-wrap items-center gap-1 font-mono">
                <Fraction num={n2} den={d2} size="sm" />
                <span>＝</span>
                <Fraction num={`${n2} · 5`} den="35" size="sm" />
              </span>
            ),
            val: <Fraction num="20" den="35" size="sm" />
          },
          {
            item: locale === 'en' ? 'Comparison' : 'Σύγκριση',
            formula: (
              <span className="inline-flex flex-wrap items-center gap-1 font-mono">
                <Fraction num="21" den="35" size="sm" />
                <span>＞</span>
                <Fraction num="20" den="35" size="sm" />
              </span>
            ),
            val: `${p1} ＞ ${p2}`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <span>Convert to common denominator with LCM(5, 7) ＝ 35. {p1}:</span>
                <Fraction num="21" den="35" size="sm" />
                <span>, {p2}:</span>
                <Fraction num="20" den="35" size="sm" />
                <span>. Since</span>
                <Fraction num="21" den="35" size="sm" />
                <span>＞</span>
                <Fraction num="20" den="35" size="sm" />
                <span>, {p1} covered the greater distance.</span>
              </>
            ) : (
              <>
                <span>Κάνουμε τα κλάσματα ομώνυμα με Ε.Κ.Π.(5, 7) ＝ 35. {p1} διάνυσε τα</span>
                <Fraction num="21" den="35" size="sm" />
                <span>, ενώ {p2} τα</span>
                <Fraction num="20" den="35" size="sm" />
                <span>. Επειδή</span>
                <Fraction num="21" den="35" size="sm" />
                <span>＞</span>
                <Fraction num="20" den="35" size="sm" />
                <span>, {p1} διάνυσε τη μεγαλύτερη απόσταση.</span>
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
      const n1 = 2;
      const d1 = 3;
      const n2 = 5;
      const d2 = 8;
      const p1 = locale === 'en' ? 'George' : 'Ο Γιώργος';
      const p2 = locale === 'en' ? 'Maria' : 'Η Μαρία';
      const correctVal = p1;
      const wrongList = [
        { val: p2, render: <span className="break-words">{p2}</span> },
        {
          val: locale === 'en' ? 'Both read the same portion' : 'Και οι δύο το ίδιο μέρος',
          render: <span className="break-words">{locale === 'en' ? 'Both read the same portion' : 'Και οι δύο το ίδιο μέρος'}</span>
        },
        {
          val: locale === 'en' ? 'Neither of them' : 'Κανένας από τους δύο',
          render: <span className="break-words">{locale === 'en' ? 'Neither of them' : 'Κανένας από τους δύο'}</span>
        }
      ];
      const correctOption = { val: correctVal, render: <span className="break-words">{correctVal}</span> };

      return {
        title: locale === 'en' ? 'Book Reading Progress' : 'Μελέτη Βιβλίου',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{p1}</span>
            <span>{locale === 'en' ? 'read' : 'διάβασε τα'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'of a book, while' : 'ενός βιβλίου, ενώ'}</span>
            <span>{p2}</span>
            <span>{locale === 'en' ? 'read' : 'διάβασε τα'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'of the same book. Who read the larger portion?' : 'του ίδιου βιβλίου. Ποιος διάβασε το μεγαλύτερο μέρος;'}</span>
          </span>
        ),
        correctText: correctVal,
        options: makeUniqueOptions(correctOption, wrongList),
        tableData: [
          {
            item: p1,
            formula: (
              <span className="inline-flex flex-wrap items-center gap-1 font-mono">
                <Fraction num={n1} den={d1} size="sm" />
                <span>＝</span>
                <Fraction num={`${n1} · 8`} den="24" size="sm" />
              </span>
            ),
            val: <Fraction num="16" den="24" size="sm" />
          },
          {
            item: p2,
            formula: (
              <span className="inline-flex flex-wrap items-center gap-1 font-mono">
                <Fraction num={n2} den={d2} size="sm" />
                <span>＝</span>
                <Fraction num={`${n2} · 3`} den="24" size="sm" />
              </span>
            ),
            val: <Fraction num="15" den="24" size="sm" />
          },
          {
            item: locale === 'en' ? 'Comparison' : 'Σύγκριση',
            formula: (
              <span className="inline-flex flex-wrap items-center gap-1 font-mono">
                <Fraction num="16" den="24" size="sm" />
                <span>＞</span>
                <Fraction num="15" den="24" size="sm" />
              </span>
            ),
            val: `${p1} ＞ ${p2}`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <span>LCM(3, 8) ＝ 24. {p1} read</span>
                <Fraction num="16" den="24" size="sm" />
                <span>, while {p2} read</span>
                <Fraction num="15" den="24" size="sm" />
                <span>. Thus {p1} read more.</span>
              </>
            ) : (
              <>
                <span>Μετατρέπουμε σε ομώνυμα με Ε.Κ.Π.(3, 8) ＝ 24. {p1} διάβασε τα</span>
                <Fraction num="16" den="24" size="sm" />
                <span>και {p2} τα</span>
                <Fraction num="15" den="24" size="sm" />
                <span>. Άρα {p1} διάβασε περισσότερο.</span>
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
      const n1 = 3;
      const d1 = 8;
      const n2 = 2;
      const d2 = 5;
      const p1 = locale === 'en' ? 'Peter' : 'Ο Πέτρος';
      const p2 = locale === 'en' ? 'Anna' : 'Η Άννα';
      const correctVal = p2;
      const wrongList = [
        { val: p1, render: <span className="break-words">{p1}</span> },
        {
          val: locale === 'en' ? 'Both ate the same amount' : 'Και οι δύο το ίδιο μέρος',
          render: <span className="break-words">{locale === 'en' ? 'Both ate the same amount' : 'Και οι δύο το ίδιο μέρος'}</span>
        },
        {
          val: locale === 'en' ? 'Insufficient data' : 'Δεν επαρκούν τα δεδομένα',
          render: <span className="break-words">{locale === 'en' ? 'Insufficient data' : 'Δεν επαρκούν τα δεδομένα'}</span>
        }
      ];
      const correctOption = { val: correctVal, render: <span className="break-words">{correctVal}</span> };

      return {
        title: locale === 'en' ? 'Pizza Consumption' : 'Κατανάλωση Πίτσας',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{p1}</span>
            <span>{locale === 'en' ? 'ate' : 'έφαγε τα'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'of a pizza, while' : 'μιας πίτσας, ενώ'}</span>
            <span>{p2}</span>
            <span>{locale === 'en' ? 'ate' : 'έφαγε τα'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'of an identical pizza. Who ate more?' : 'μιας ίδιας πίτσας. Ποιος έφαγε το μεγαλύτερο μέρος;'}</span>
          </span>
        ),
        correctText: correctVal,
        options: makeUniqueOptions(correctOption, wrongList),
        tableData: [
          {
            item: p1,
            formula: (
              <span className="inline-flex flex-wrap items-center gap-1 font-mono">
                <Fraction num={n1} den={d1} size="sm" />
                <span>＝</span>
                <Fraction num={`${n1} · 5`} den="40" size="sm" />
              </span>
            ),
            val: <Fraction num="15" den="40" size="sm" />
          },
          {
            item: p2,
            formula: (
              <span className="inline-flex flex-wrap items-center gap-1 font-mono">
                <Fraction num={n2} den={d2} size="sm" />
                <span>＝</span>
                <Fraction num={`${n2} · 8`} den="40" size="sm" />
              </span>
            ),
            val: <Fraction num="16" den="40" size="sm" />
          },
          {
            item: locale === 'en' ? 'Comparison' : 'Σύγκριση',
            formula: (
              <span className="inline-flex flex-wrap items-center gap-1 font-mono">
                <Fraction num="16" den="40" size="sm" />
                <span>＞</span>
                <Fraction num="15" den="40" size="sm" />
              </span>
            ),
            val: `${p2} ＞ ${p1}`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <span>LCM(8, 5) ＝ 40:</span>
                <Fraction num="3" den="8" size="sm" />
                <span>＝</span>
                <Fraction num="15" den="40" size="sm" />
                <span>and</span>
                <Fraction num="2" den="5" size="sm" />
                <span>＝</span>
                <Fraction num="16" den="40" size="sm" />
                <span>. Because</span>
                <Fraction num="16" den="40" size="sm" />
                <span>＞</span>
                <Fraction num="15" den="40" size="sm" />
                <span>, {p2} ate more.</span>
              </>
            ) : (
              <>
                <span>Μετατρέπουμε σε ομώνυμα με Ε.Κ.Π.(8, 5) ＝ 40:</span>
                <Fraction num="3" den="8" size="sm" />
                <span>＝</span>
                <Fraction num="15" den="40" size="sm" />
                <span>και</span>
                <Fraction num="2" den="5" size="sm" />
                <span>＝</span>
                <Fraction num="16" den="40" size="sm" />
                <span>. Επειδή</span>
                <Fraction num="16" den="40" size="sm" />
                <span>＞</span>
                <Fraction num="15" den="40" size="sm" />
                <span>, {p2} έφαγε περισσότερο.</span>
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
      const n1 = 4;
      const d1 = 7;
      const n2 = 3;
      const d2 = 5;
      const p1 = locale === 'en' ? 'Kostas' : 'Ο Κώστας';
      const p2 = locale === 'en' ? 'Sofia' : 'Η Σοφία';
      const correctVal = p2;
      const wrongList = [
        { val: p1, render: <span className="break-words">{p1}</span> },
        {
          val: locale === 'en' ? 'Both planted the same amount' : 'Και οι δύο το ίδιο μέρος',
          render: <span className="break-words">{locale === 'en' ? 'Both planted the same amount' : 'Και οι δύο το ίδιο μέρος'}</span>
        },
        {
          val: locale === 'en' ? 'Neither of them' : 'Κανένας από τους δύο',
          render: <span className="break-words">{locale === 'en' ? 'Neither of them' : 'Κανένας από τους δύο'}</span>
        }
      ];
      const correctOption = { val: correctVal, render: <span className="break-words">{correctVal}</span> };

      return {
        title: locale === 'en' ? 'Garden Planting' : 'Φύτευση Κήπου',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{p1}</span>
            <span>{locale === 'en' ? 'planted' : 'φύτεψε τα'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'of a garden, while' : 'ενός κήπου, ενώ'}</span>
            <span>{p2}</span>
            <span>{locale === 'en' ? 'planted' : 'φύτεψε τα'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'of the same garden. Who planted more?' : 'του ίδιου κήπου. Ποιος φύτεψε το μεγαλύτερο μέρος;'}</span>
          </span>
        ),
        correctText: correctVal,
        options: makeUniqueOptions(correctOption, wrongList),
        tableData: [
          {
            item: p1,
            formula: (
              <span className="inline-flex flex-wrap items-center gap-1 font-mono">
                <Fraction num={n1} den={d1} size="sm" />
                <span>＝</span>
                <Fraction num={`${n1} · 5`} den="35" size="sm" />
              </span>
            ),
            val: <Fraction num="20" den="35" size="sm" />
          },
          {
            item: p2,
            formula: (
              <span className="inline-flex flex-wrap items-center gap-1 font-mono">
                <Fraction num={n2} den={d2} size="sm" />
                <span>＝</span>
                <Fraction num={`${n2} · 7`} den="35" size="sm" />
              </span>
            ),
            val: <Fraction num="21" den="35" size="sm" />
          },
          {
            item: locale === 'en' ? 'Comparison' : 'Σύγκριση',
            formula: (
              <span className="inline-flex flex-wrap items-center gap-1 font-mono">
                <Fraction num="21" den="35" size="sm" />
                <span>＞</span>
                <Fraction num="20" den="35" size="sm" />
              </span>
            ),
            val: `${p2} ＞ ${p1}`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <span>Like fractions:</span>
                <Fraction num="4" den="7" size="sm" />
                <span>＝</span>
                <Fraction num="20" den="35" size="sm" />
                <span>and</span>
                <Fraction num="3" den="5" size="sm" />
                <span>＝</span>
                <Fraction num="21" den="35" size="sm" />
                <span>. Therefore {p2} planted the greater portion.</span>
              </>
            ) : (
              <>
                <span>Με ομώνυμα κλάσματα:</span>
                <Fraction num="4" den="7" size="sm" />
                <span>＝</span>
                <Fraction num="20" den="35" size="sm" />
                <span>και</span>
                <Fraction num="3" den="5" size="sm" />
                <span>＝</span>
                <Fraction num="21" den="35" size="sm" />
                <span>. Άρα {p2} φύτεψε το μεγαλύτερο μέρος.</span>
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
      const n1 = 5;
      const d1 = 6;
      const n2 = 4;
      const d2 = 5;
      const p1 = locale === 'en' ? 'Dimitris' : 'Ο Δημήτρης';
      const p2 = locale === 'en' ? 'Katerina' : 'Η Κατερίνα';
      const correctVal = p1;
      const wrongList = [
        { val: p2, render: <span className="break-words">{p2}</span> },
        {
          val: locale === 'en' ? 'Both drank the same quantity' : 'Και οι δύο την ίδια ποσότητα',
          render: <span className="break-words">{locale === 'en' ? 'Both drank the same quantity' : 'Και οι δύο την ίδια ποσότητα'}</span>
        },
        {
          val: locale === 'en' ? 'Cannot be determined' : 'Δεν μπορούμε να γνωρίζουμε',
          render: <span className="break-words">{locale === 'en' ? 'Cannot be determined' : 'Δεν μπορούμε να γνωρίζουμε'}</span>
        }
      ];
      const correctOption = { val: correctVal, render: <span className="break-words">{correctVal}</span> };

      return {
        title: locale === 'en' ? 'Juice Drinking' : 'Κατανάλωση Χυμού',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{p1}</span>
            <span>{locale === 'en' ? 'drank' : 'ήπιε τα'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'of a bottle, while' : 'ενός μπουκαλιού χυμού, ενώ'}</span>
            <span>{p2}</span>
            <span>{locale === 'en' ? 'drank' : 'ήπιε τα'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'of an identical bottle. Who drank more?' : 'ενός ίδιου μπουκαλιού. Ποιος ήπιε τη μεγαλύτερη ποσότητα;'}</span>
          </span>
        ),
        correctText: correctVal,
        options: makeUniqueOptions(correctOption, wrongList),
        tableData: [
          {
            item: p1,
            formula: (
              <span className="inline-flex flex-wrap items-center gap-1 font-mono">
                <Fraction num={n1} den={d1} size="sm" />
                <span>＝</span>
                <Fraction num={`${n1} · 5`} den="30" size="sm" />
              </span>
            ),
            val: <Fraction num="25" den="30" size="sm" />
          },
          {
            item: p2,
            formula: (
              <span className="inline-flex flex-wrap items-center gap-1 font-mono">
                <Fraction num={n2} den={d2} size="sm" />
                <span>＝</span>
                <Fraction num={`${n2} · 6`} den="30" size="sm" />
              </span>
            ),
            val: <Fraction num="24" den="30" size="sm" />
          },
          {
            item: locale === 'en' ? 'Comparison' : 'Σύγκριση',
            formula: (
              <span className="inline-flex flex-wrap items-center gap-1 font-mono">
                <Fraction num="25" den="30" size="sm" />
                <span>＞</span>
                <Fraction num="24" den="30" size="sm" />
              </span>
            ),
            val: `${p1} ＞ ${p2}`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <span>LCM(6, 5) ＝ 30:</span>
                <Fraction num="5" den="6" size="sm" />
                <span>＝</span>
                <Fraction num="25" den="30" size="sm" />
                <span>and</span>
                <Fraction num="4" den="5" size="sm" />
                <span>＝</span>
                <Fraction num="24" den="30" size="sm" />
                <span>. Thus, {p1} drank more.</span>
              </>
            ) : (
              <>
                <span>Μετατρέπουμε σε ομώνυμα με Ε.Κ.Π.(6, 5) ＝ 30:</span>
                <Fraction num="5" den="6" size="sm" />
                <span>＝</span>
                <Fraction num="25" den="30" size="sm" />
                <span>και</span>
                <Fraction num="4" den="5" size="sm" />
                <span>＝</span>
                <Fraction num="24" den="30" size="sm" />
                <span>. Επομένως, {p1} ήπιε περισσότερο.</span>
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
      const n1 = 3;
      const d1 = 4;
      const n2 = 7;
      const d2 = 10;
      const p1 = locale === 'en' ? 'Manos' : 'Ο Μάνος';
      const p2 = locale === 'en' ? 'Despoina' : 'Η Δέσποινα';
      const correctVal = p1;
      const wrongList = [
        { val: p2, render: <span className="break-words">{p2}</span> },
        {
          val: locale === 'en' ? 'Both saved the same portion' : 'Και οι δύο το ίδιο μέρος',
          render: <span className="break-words">{locale === 'en' ? 'Both saved the same portion' : 'Και οι δύο το ίδιο μέρος'}</span>
        },
        {
          val: locale === 'en' ? 'Neither of them' : 'Κανένας από τους δύο',
          render: <span className="break-words">{locale === 'en' ? 'Neither of them' : 'Κανένας από τους δύο'}</span>
        }
      ];
      const correctOption = { val: correctVal, render: <span className="break-words">{correctVal}</span> };

      return {
        title: locale === 'en' ? 'Pocket Money Savings' : 'Αποταμίευση Χαρτζιλικιού',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{p1}</span>
            <span>{locale === 'en' ? 'saved' : 'αποταμίευσε τα'}</span>
            <Fraction num={n1} den={d1} size="sm" />
            <span>{locale === 'en' ? 'of his allowance, while' : 'του χαρτζιλικιού του, ενώ'}</span>
            <span>{p2}</span>
            <span>{locale === 'en' ? 'saved' : 'αποταμίευσε τα'}</span>
            <Fraction num={n2} den={d2} size="sm" />
            <span>{locale === 'en' ? 'of the same amount. Who saved more?' : 'του ίδιου ποσού χαρτζιλικιού. Ποιος αποταμίευσε το μεγαλύτερο μέρος;'}</span>
          </span>
        ),
        correctText: correctVal,
        options: makeUniqueOptions(correctOption, wrongList),
        tableData: [
          {
            item: p1,
            formula: (
              <span className="inline-flex flex-wrap items-center gap-1 font-mono">
                <Fraction num={n1} den={d1} size="sm" />
                <span>＝</span>
                <Fraction num={`${n1} · 5`} den="20" size="sm" />
              </span>
            ),
            val: <Fraction num="15" den="20" size="sm" />
          },
          {
            item: p2,
            formula: (
              <span className="inline-flex flex-wrap items-center gap-1 font-mono">
                <Fraction num={n2} den={d2} size="sm" />
                <span>＝</span>
                <Fraction num={`${n2} · 2`} den="20" size="sm" />
              </span>
            ),
            val: <Fraction num="14" den="20" size="sm" />
          },
          {
            item: locale === 'en' ? 'Comparison' : 'Σύγκριση',
            formula: (
              <span className="inline-flex flex-wrap items-center gap-1 font-mono">
                <Fraction num="15" den="20" size="sm" />
                <span>＞</span>
                <Fraction num="14" den="20" size="sm" />
              </span>
            ),
            val: `${p1} ＞ ${p2}`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <span>LCM(4, 10) ＝ 20:</span>
                <Fraction num="3" den="4" size="sm" />
                <span>＝</span>
                <Fraction num="15" den="20" size="sm" />
                <span>and</span>
                <Fraction num="7" den="10" size="sm" />
                <span>＝</span>
                <Fraction num="14" den="20" size="sm" />
                <span>. Since</span>
                <Fraction num="15" den="20" size="sm" />
                <span>＞</span>
                <Fraction num="14" den="20" size="sm" />
                <span>, {p1} saved more.</span>
              </>
            ) : (
              <>
                <span>Ε.Κ.Π.(4, 10) ＝ 20:</span>
                <Fraction num="3" den="4" size="sm" />
                <span>＝</span>
                <Fraction num="15" den="20" size="sm" />
                <span>και</span>
                <Fraction num="7" den="10" size="sm" />
                <span>＝</span>
                <Fraction num="14" den="20" size="sm" />
                <span>. Επειδή</span>
                <Fraction num="15" den="20" size="sm" />
                <span>＞</span>
                <Fraction num="14" den="20" size="sm" />
                <span>, {p1} αποταμίευσε το μεγαλύτερο μέρος.</span>
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
      const correctVal = locale === 'en' ? 'A ＜ B ＜ C' : 'Α ＜ Β ＜ Γ';
      const correctOption = { val: correctVal, render: <span className="break-words">{correctVal}</span> };
      const wrongList = locale === 'en'
        ? [
            { val: 'C ＜ B ＜ A', render: <span className="break-words">C ＜ B ＜ A</span> },
            { val: 'B ＜ A ＜ C', render: <span className="break-words">B ＜ A ＜ C</span> },
            { val: 'A ＜ C ＜ B', render: <span className="break-words">A ＜ C ＜ B</span> }
          ]
        : [
            { val: 'Γ ＜ Β ＜ Α', render: <span className="break-words">Γ ＜ Β ＜ Α</span> },
            { val: 'Β ＜ Α ＜ Γ', render: <span className="break-words">Β ＜ Α ＜ Γ</span> },
            { val: 'Α ＜ Γ ＜ Β', render: <span className="break-words">Α ＜ Γ ＜ Β</span> }
          ];

      return {
        title: locale === 'en' ? 'Ordering Three Fractions' : 'Σύγκριση Τριών Κλασμάτων',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{locale === 'en' ? 'Given fractions:' : 'Δίνονται τα κλάσματα:'}</span>
            <span className="inline-flex items-center gap-1">Α ＝ <Fraction num="1" den="2" size="sm" />,</span>
            <span className="inline-flex items-center gap-1">Β ＝ <Fraction num="2" den="3" size="sm" />,</span>
            <span className="inline-flex items-center gap-1">Γ ＝ <Fraction num="3" den="4" size="sm" />.</span>
            <span>{locale === 'en' ? 'What is the correct ascending order?' : 'Ποια είναι η σωστή σειρά διάταξης από το μικρότερο προς το μεγαλύτερο;'}</span>
          </span>
        ),
        correctText: correctVal,
        options: makeUniqueOptions(correctOption, wrongList),
        tableData: [
          {
            item: (
              <span className="inline-flex items-center gap-1">
                <span>Α</span>
                <span>(</span>
                <Fraction num="1" den="2" size="sm" />
                <span>)</span>
              </span>
            ),
            formula: `${locale === 'en' ? 'LCM' : 'Ε.Κ.Π.'} ＝ 12`,
            val: <Fraction num="6" den="12" size="sm" />
          },
          {
            item: (
              <span className="inline-flex items-center gap-1">
                <span>Β</span>
                <span>(</span>
                <Fraction num="2" den="3" size="sm" />
                <span>)</span>
              </span>
            ),
            formula: `${locale === 'en' ? 'LCM' : 'Ε.Κ.Π.'} ＝ 12`,
            val: <Fraction num="8" den="12" size="sm" />
          },
          {
            item: (
              <span className="inline-flex items-center gap-1">
                <span>Γ</span>
                <span>(</span>
                <Fraction num="3" den="4" size="sm" />
                <span>)</span>
              </span>
            ),
            formula: `${locale === 'en' ? 'LCM' : 'Ε.Κ.Π.'} ＝ 12`,
            val: <Fraction num="9" den="12" size="sm" />
          },
          {
            item: locale === 'en' ? 'Order' : 'Σειρά Διάταξης',
            formula: (
              <span className="inline-flex flex-wrap items-center gap-1 font-mono">
                <Fraction num="6" den="12" size="sm" />
                <span>＜</span>
                <Fraction num="8" den="12" size="sm" />
                <span>＜</span>
                <Fraction num="9" den="12" size="sm" />
              </span>
            ),
            val: correctVal
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <span>Common denominator 12:</span>
                <Fraction num="1" den="2" size="sm" />
                <span>＝</span>
                <Fraction num="6" den="12" size="sm" />
                <span>,</span>
                <Fraction num="2" den="3" size="sm" />
                <span>＝</span>
                <Fraction num="8" den="12" size="sm" />
                <span>,</span>
                <Fraction num="3" den="4" size="sm" />
                <span>＝</span>
                <Fraction num="9" den="12" size="sm" />
                <span>. Ascending order: A ＜ B ＜ C.</span>
              </>
            ) : (
              <>
                <span>Με κοινό παρονομαστή το 12:</span>
                <Fraction num="1" den="2" size="sm" />
                <span>＝</span>
                <Fraction num="6" den="12" size="sm" />
                <span>,</span>
                <Fraction num="2" den="3" size="sm" />
                <span>＝</span>
                <Fraction num="8" den="12" size="sm" />
                <span>,</span>
                <Fraction num="3" den="4" size="sm" />
                <span>＝</span>
                <Fraction num="9" den="12" size="sm" />
                <span>. Άρα η σωστή σειρά είναι Α ＜ Β ＜ Γ.</span>
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
      const proper = { num: 7, den: 9 };
      const improper = { num: 9, den: 7 };
      const correctVal = 'A ＜ B';
      const correctOption = {
        val: 'A ＜ B',
        render: (
          <span className="break-words">
            {locale === 'en' ? 'A ＜ B (A ＜ 1 and B ＞ 1)' : 'Α ＜ Β (το Α ＜ 1 και το Β ＞ 1)'}
          </span>
        )
      };
      const wrongList = locale === 'en'
        ? [
            { val: 'A ＞ B', render: <span className="break-words">A ＞ B (A ＞ 1 and B ＜ 1)</span> },
            { val: 'A ＝ B', render: <span className="break-words">A ＝ B</span> },
            { val: 'Cannot compare without LCM', render: <span className="break-words">Cannot compare without LCM</span> }
          ]
        : [
            { val: 'A ＞ B', render: <span className="break-words">Α ＞ Β (το Α ＞ 1 και το Β ＜ 1)</span> },
            { val: 'A ＝ B', render: <span className="break-words">Α ＝ Β (είναι ίσα)</span> },
            { val: 'Cannot compare without LCM', render: <span className="break-words">Δεν μπορούμε να συγκρίνουμε χωρίς Ε.Κ.Π.</span> }
          ];

      return {
        title: locale === 'en' ? 'Benchmarking Against 1 Whole' : 'Σύγκριση με Αναφορά τη Μονάδα (1)',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{locale === 'en' ? 'Without dividing or finding LCM, what is the relationship between' : 'Χωρίς να κάνεις διαίρεση ή πράξεις με Ε.Κ.Π., ποια σχέση συνδέει τα κλάσματα'}</span>
            <span className="inline-flex items-center gap-1">Α ＝ <Fraction num={proper.num} den={proper.den} size="sm" /></span>
            <span>{locale === 'en' ? 'and' : 'και'}</span>
            <span className="inline-flex items-center gap-1">Β ＝ <Fraction num={improper.num} den={improper.den} size="sm" /></span>
            <span>;</span>
          </span>
        ),
        correctText: correctVal,
        options: makeUniqueOptions(correctOption, wrongList),
        tableData: [
          {
            item: (
              <span className="inline-flex items-center gap-1">
                <span>Α</span>
                <span>(</span>
                <Fraction num={proper.num} den={proper.den} size="sm" />
                <span>)</span>
              </span>
            ),
            formula: locale === 'en' ? 'Numerator ＜ Denominator' : 'Αριθμητής ＜ Παρονομαστή',
            val: locale === 'en' ? 'Proper (＜ 1)' : 'Γνήσιο (＜ 1)'
          },
          {
            item: (
              <span className="inline-flex items-center gap-1">
                <span>Β</span>
                <span>(</span>
                <Fraction num={improper.num} den={improper.den} size="sm" />
                <span>)</span>
              </span>
            ),
            formula: locale === 'en' ? 'Numerator ＞ Denominator' : 'Αριθμητής ＞ Παρονομαστή',
            val: locale === 'en' ? 'Improper (＞ 1)' : 'Καταχρηστικό (＞ 1)'
          },
          {
            item: locale === 'en' ? 'Benchmark with 1' : 'Σύγκριση με μονάδα',
            formula: 'A ＜ 1 ＜ B',
            val: 'A ＜ B'
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <Fraction num="7" den="9" size="sm" />
                <span>is a proper fraction (＜ 1), while</span>
                <Fraction num="9" den="7" size="sm" />
                <span>is improper (＞ 1). Thus,</span>
                <Fraction num="7" den="9" size="sm" />
                <span>＜</span>
                <Fraction num="9" den="7" size="sm" />
                <span>.</span>
              </>
            ) : (
              <>
                <span>Το</span>
                <Fraction num="7" den="9" size="sm" />
                <span>είναι γνήσιο κλάσμα (＜ 1), ενώ το</span>
                <Fraction num="9" den="7" size="sm" />
                <span>καταχρηστικό (＞ 1). Επομένως,</span>
                <Fraction num="7" den="9" size="sm" />
                <span>＜</span>
                <Fraction num="9" den="7" size="sm" />
                <span>.</span>
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
      const n1 = 6;
      const d1 = 8;
      const n2 = 9;
      const d2 = 12;
      const cross = n1 * d2;
      const correctVal = 'Cross products are equal (A ＝ B)';
      const correctOption = {
        val: correctVal,
        render: (
          <span className="break-words">
            {locale === 'en'
              ? `Cross products are equal (${cross} ＝ ${cross}), so A ＝ B`
              : `Τα χιαστί γινόμενα είναι ίσα (${cross} ＝ ${cross}), άρα Α ＝ Β`}
          </span>
        )
      };
      const wrongList = locale === 'en'
        ? [
            { val: 'A is greater', render: <span className="break-words">{`A is greater (${cross} ＞ ${cross - 6})`}</span> },
            { val: 'B is greater', render: <span className="break-words">{`B is greater (${cross + 6} ＞ ${cross})`}</span> },
            { val: 'Cross products do not apply', render: <span className="break-words">Cross products do not apply</span> }
          ]
        : [
            { val: 'A is greater', render: <span className="break-words">{`Το Α είναι μεγαλύτερο από το Β (${cross} ＞ ${cross - 6})`}</span> },
            { val: 'B is greater', render: <span className="break-words">{`Το Β είναι μεγαλύτερο από το Α (${cross + 6} ＞ ${cross})`}</span> },
            { val: 'Cross products do not apply', render: <span className="break-words">Τα χιαστί γινόμενα δεν εφαρμόζονται</span> }
          ];

      return {
        title: locale === 'en' ? 'Cross-Multiplication Equivalence Check' : 'Έλεγχος Ισοδυναμίας με Χιαστί Γινόμενα',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{locale === 'en' ? 'Comparing fractions' : 'Συγκρίνουμε τα κλάσματα'}</span>
            <span className="inline-flex items-center gap-1">Α ＝ <Fraction num={n1} den={d1} size="sm" /></span>
            <span>{locale === 'en' ? 'and' : 'και'}</span>
            <span className="inline-flex items-center gap-1">Β ＝ <Fraction num={n2} den={d2} size="sm" />.</span>
            <span>{locale === 'en' ? 'What do we observe by checking cross products?' : 'Τι παρατηρούμε υπολογίζοντας τα χιαστί γινόμενα;'}</span>
          </span>
        ),
        correctText: correctVal,
        options: makeUniqueOptions(correctOption, wrongList),
        tableData: [
          { item: locale === 'en' ? 'Left cross product' : 'Αριστερό γινόμενο', formula: `${n1} · ${d2}`, val: `${cross}` },
          { item: locale === 'en' ? 'Right cross product' : 'Δεξί γινόμενο', formula: `${n2} · ${d1}`, val: `${cross}` },
          { item: locale === 'en' ? 'Relation' : 'Σχέση κλασμάτων', formula: `${cross} ＝ ${cross}`, val: 'A ＝ B' }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <span>Cross products: {n1} · {d2} ＝ {cross} and {n2} · {d1} ＝ {cross}. Equal products mean the fractions are equivalent (</span>
                <Fraction num="6" den="8" size="sm" />
                <span>＝</span>
                <Fraction num="9" den="12" size="sm" />
                <span>＝</span>
                <Fraction num="3" den="4" size="sm" />
                <span>).</span>
              </>
            ) : (
              <>
                <span>Τα χιαστί γινόμενα είναι {n1} · ${d2} ＝ {cross} και {n2} · {d1} ＝ {cross}. Επειδή είναι ίσα, τα κλάσματα είναι ισοδύναμα (</span>
                <Fraction num="6" den="8" size="sm" />
                <span>＝</span>
                <Fraction num="9" den="12" size="sm" />
                <span>＝</span>
                <Fraction num="3" den="4" size="sm" />
                <span>).</span>
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
      const correctVal = '7/8 ＞ 5/6';
      const correctOption = {
        val: correctVal,
        render: (
          <span className="break-words">
            {locale === 'en'
              ? '7/8 ＞ 5/6 (smaller piece missing to reach 1)'
              : '7/8 ＞ 5/6 (λείπει μικρότερο μέρος για να φτάσει τη μονάδα)'}
          </span>
        )
      };
      const wrongList = [
        { val: '5/6 ＞ 7/8', render: <span className="break-words">5/6 ＞ 7/8</span> },
        { val: '5/6 ＝ 7/8', render: <span className="break-words">5/6 ＝ 7/8</span> },
        {
          val: locale === 'en' ? 'Cannot compare' : 'Δεν μπορούμε να συγκρίνουμε',
          render: <span className="break-words">{locale === 'en' ? 'Cannot compare' : 'Δεν μπορούμε να συγκρίνουμε'}</span>
        }
      ];

      return {
        title: locale === 'en' ? 'Comparing by Gap to 1 Whole' : 'Σύγκριση με Ίδιο Συμπλήρωμα ως τη Μονάδα',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{locale === 'en' ? 'Which fraction is greater:' : 'Ποιο από τα δύο κλάσματα είναι μεγαλύτερο:'}</span>
            <Fraction num="5" den="6" size="sm" />
            <span>{locale === 'en' ? 'or' : 'ή το'}</span>
            <Fraction num="7" den="8" size="sm" />
            <span>;</span>
          </span>
        ),
        correctText: correctVal,
        options: makeUniqueOptions(correctOption, wrongList),
        tableData: [
          {
            item: (
              <span className="inline-flex items-center gap-1 font-mono">
                <span>1 －</span>
                <Fraction num="5" den="6" size="sm" />
              </span>
            ),
            formula: locale === 'en' ? 'Gap to 1' : 'Συμπλήρωμα στη μονάδα',
            val: <Fraction num="1" den="6" size="sm" />
          },
          {
            item: (
              <span className="inline-flex items-center gap-1 font-mono">
                <span>1 －</span>
                <Fraction num="7" den="8" size="sm" />
              </span>
            ),
            formula: locale === 'en' ? 'Gap to 1' : 'Συμπλήρωμα στη μονάδα',
            val: <Fraction num="1" den="8" size="sm" />
          },
          {
            item: locale === 'en' ? 'Comparison' : 'Σύγκριση',
            formula: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num="1" den="8" size="sm" />
                <span>＜</span>
                <Fraction num="1" den="6" size="sm" />
              </span>
            ),
            val: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num="7" den="8" size="sm" />
                <span>＞</span>
                <Fraction num="5" den="6" size="sm" />
              </span>
            )
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <Fraction num="5" den="6" size="sm" />
                <span>is missing</span>
                <Fraction num="1" den="6" size="sm" />
                <span>to reach 1, whereas</span>
                <Fraction num="7" den="8" size="sm" />
                <span>is missing only</span>
                <Fraction num="1" den="8" size="sm" />
                <span>. Because</span>
                <Fraction num="1" den="8" size="sm" />
                <span>＜</span>
                <Fraction num="1" den="6" size="sm" />
                <span>,</span>
                <Fraction num="7" den="8" size="sm" />
                <span>is closer to 1 (</span>
                <Fraction num="7" den="8" size="sm" />
                <span>＞</span>
                <Fraction num="5" den="6" size="sm" />
                <span>).</span>
              </>
            ) : (
              <>
                <span>Από το</span>
                <Fraction num="5" den="6" size="sm" />
                <span>λείπει το</span>
                <Fraction num="1" den="6" size="sm" />
                <span>για να φτάσει το 1, ενώ από το</span>
                <Fraction num="7" den="8" size="sm" />
                <span>λείπει μόνο το</span>
                <Fraction num="1" den="8" size="sm" />
                <span>. Επειδή</span>
                <Fraction num="1" den="8" size="sm" />
                <span>＜</span>
                <Fraction num="1" den="6" size="sm" />
                <span>, το</span>
                <Fraction num="7" den="8" size="sm" />
                <span>είναι πιο κοντά στη μονάδα, άρα</span>
                <Fraction num="7" den="8" size="sm" />
                <span>＞</span>
                <Fraction num="5" den="6" size="sm" />
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
      const correctVal = '5/8 ＞ 4/10';
      const correctOption = {
        val: correctVal,
        render: (
          <span className="break-words">
            {locale === 'en'
              ? '5/8 ＞ 4/10 (5/8 ＞ 1/2 while 4/10 ＜ 1/2)'
              : '5/8 ＞ 4/10 (το 5/8 ＞ 1/2 ενώ το 4/10 ＜ 1/2)'}
          </span>
        )
      };
      const wrongList = [
        { val: '4/10 ＞ 5/8', render: <span className="break-words">4/10 ＞ 5/8</span> },
        { val: '4/10 ＝ 5/8', render: <span className="break-words">4/10 ＝ 5/8</span> },
        {
          val: locale === 'en' ? 'Both ＞ 1/2' : 'Και τα δύο ＞ 1/2',
          render: <span className="break-words">{locale === 'en' ? 'Both ＞ 1/2' : 'Και τα δύο ＞ 1/2'}</span>
        }
      ];

      return {
        title: locale === 'en' ? 'Benchmarking Against Half (1/2)' : 'Σύγκριση Κλασμάτων με το Μισό (1/2)',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{locale === 'en' ? 'Comparing' : 'Συγκρίνοντας τα κλάσματα'}</span>
            <Fraction num="4" den="10" size="sm" />
            <span>{locale === 'en' ? 'and' : 'και'}</span>
            <Fraction num="5" den="8" size="sm" />
            <span>{locale === 'en' ? 'with one half (1/2), which is greater?' : 'με το μισό (1/2), ποιο είναι το μεγαλύτερο;'}</span>
          </span>
        ),
        correctText: correctVal,
        options: makeUniqueOptions(correctOption, wrongList),
        tableData: [
          {
            item: <Fraction num="4" den="10" size="sm" />,
            formula: locale === 'en' ? 'Half of 10 is 5 (4 ＜ 5)' : 'Το μισό του 10 είναι το 5 (4 ＜ 5)',
            val: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num="4" den="10" size="sm" />
                <span>＜</span>
                <Fraction num="1" den="2" size="sm" />
              </span>
            )
          },
          {
            item: <Fraction num="5" den="8" size="sm" />,
            formula: locale === 'en' ? 'Half of 8 is 4 (5 ＞ 4)' : 'Το μισό του 8 είναι το 4 (5 ＞ 4)',
            val: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num="5" den="8" size="sm" />
                <span>＞</span>
                <Fraction num="1" den="2" size="sm" />
              </span>
            )
          },
          {
            item: locale === 'en' ? 'Comparison' : 'Σύγκριση',
            formula: (
              <span className="inline-flex flex-wrap items-center gap-1 font-mono">
                <Fraction num="4" den="10" size="sm" />
                <span>＜</span>
                <Fraction num="1" den="2" size="sm" />
                <span>＜</span>
                <Fraction num="5" den="8" size="sm" />
              </span>
            ),
            val: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num="5" den="8" size="sm" />
                <span>＞</span>
                <Fraction num="4" den="10" size="sm" />
              </span>
            )
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <span>Half of tenths is</span>
                <Fraction num="5" den="10" size="sm" />
                <span>(</span>
                <Fraction num="4" den="10" size="sm" />
                <span>＜</span>
                <Fraction num="1" den="2" size="sm" />
                <span>). Half of eighths is</span>
                <Fraction num="4" den="8" size="sm" />
                <span>(</span>
                <Fraction num="5" den="8" size="sm" />
                <span>＞</span>
                <Fraction num="1" den="2" size="sm" />
                <span>). Thus,</span>
                <Fraction num="5" den="8" size="sm" />
                <span>＞</span>
                <Fraction num="4" den="10" size="sm" />
                <span>.</span>
              </>
            ) : (
              <>
                <span>Το μισό των δεκάτων είναι</span>
                <Fraction num="5" den="10" size="sm" />
                <span>(</span>
                <Fraction num="4" den="10" size="sm" />
                <span>＜</span>
                <Fraction num="1" den="2" size="sm" />
                <span>). Το μισό των ογδόων είναι</span>
                <Fraction num="4" den="8" size="sm" />
                <span>(</span>
                <Fraction num="5" den="8" size="sm" />
                <span>＞</span>
                <Fraction num="1" den="2" size="sm" />
                <span>). Επομένως,</span>
                <Fraction num="5" den="8" size="sm" />
                <span>＞</span>
                <Fraction num="4" den="10" size="sm" />
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
      const correctVal = '3';
      const correctOption = { val: correctVal, render: <span className="break-words font-mono">x ＝ 3</span> };
      const wrongList = [
        { val: '4', render: <span className="break-words font-mono">x ＝ 4</span> },
        { val: '2', render: <span className="break-words font-mono">x ＝ 2</span> },
        { val: '5', render: <span className="break-words font-mono">x ＝ 5</span> }
      ];

      return {
        title: locale === 'en' ? 'Largest Natural Number in Inequality' : 'Εύρεση Αριθμητή σε Ανισότητα',
        prompt: (
          <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
            <span>{locale === 'en' ? 'What is the LARGEST natural number x satisfying:' : 'Ποιος είναι ο ΜΕΓΑΛΥΤΕΡΟΣ φυσικός αριθμός x για τον οποίο ισχύει:'}</span>
            <Fraction num="x" den="12" size="sm" />
            <span>＜</span>
            <Fraction num="1" den="3" size="sm" />
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
                <Fraction num="1 · 4" den="3 · 4" size="sm" />
              </span>
            ),
            val: <Fraction num="4" den="12" size="sm" />
          },
          {
            item: locale === 'en' ? 'Inequality' : 'Ανισότητα',
            formula: (
              <span className="inline-flex items-center gap-1 font-mono">
                <Fraction num="x" den="12" size="sm" />
                <span>＜</span>
                <Fraction num="4" den="12" size="sm" />
              </span>
            ),
            val: 'x ＜ 4'
          },
          {
            item: locale === 'en' ? 'Max integer x' : 'Μέγιστος x',
            formula: 'x ＜ 4',
            val: 'x ＝ 3'
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
            {locale === 'en' ? (
              <>
                <span>Convert</span>
                <Fraction num="1" den="3" size="sm" />
                <span>to twelfths:</span>
                <Fraction num="1" den="3" size="sm" />
                <span>＝</span>
                <Fraction num="4" den="12" size="sm" />
                <span>. For</span>
                <Fraction num="x" den="12" size="sm" />
                <span>＜</span>
                <Fraction num="4" den="12" size="sm" />
                <span>, we must have x ＜ 4. The largest natural number is 3.</span>
              </>
            ) : (
              <>
                <span>Μετατρέπουμε το</span>
                <Fraction num="1" den="3" size="sm" />
                <span>σε δωδέκατα:</span>
                <Fraction num="1" den="3" size="sm" />
                <span>＝</span>
                <Fraction num="4" den="12" size="sm" />
                <span>. Για να ισχύει</span>
                <Fraction num="x" den="12" size="sm" />
                <span>＜</span>
                <Fraction num="4" den="12" size="sm" />
                <span>, πρέπει x ＜ 4. Ο μεγαλύτερος φυσικός αριθμός είναι το 3.</span>
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
  // Q1: Compare Buttons (>, <, =) - Ομώνυμα κλάσματα
  const q1Den = randInt(4, 12);
  const q1Num1 = randInt(1, q1Den - 1);
  let q1Num2 = randInt(1, q1Den - 1);
  if (q1Num1 === q1Num2) q1Num2 = (q1Num1 % (q1Den - 1)) + 1;
  const q1Correct = q1Num1 > q1Num2 ? '＞' : '＜';

  // Q2: Compare Buttons (>, <, =) - Ίδιοι Αριθμητές
  const q2Num = randInt(2, 6);
  const q2Den1 = randInt(q2Num + 1, 10);
  let q2Den2 = randInt(q2Num + 1, 10);
  if (q2Den1 === q2Den2) q2Den2 = q2Den1 + 1;
  const q2Correct = q2Den1 < q2Den2 ? '＞' : '＜';

  // Q3: Compare Buttons (>, <, =) - Ετερώνυμα κλάσματα (Χιαστί)
  const q3Num1 = randInt(2, 5);
  const q3Den1 = randInt(q3Num1 + 1, 8);
  const q3Num2 = randInt(2, 5);
  const q3Den2 = randInt(q3Num2 + 1, 8);
  const cross1 = q3Num1 * q3Den2;
  const cross2 = q3Num2 * q3Den1;
  const q3Correct = cross1 > cross2 ? '＞' : cross1 < cross2 ? '＜' : '＝';

  // Q4: MCQ - Ποιο κλάσμα είναι το ΜΕΓΑΛΥΤΕΡΟ (Εγγύηση 4 μοναδικών επιλογών)
  const q4List = [
    { n: 1, d: 2, val: 0.5 },
    { n: 3, d: 4, val: 0.75 },
    { n: 2, d: 5, val: 0.4 },
    { n: 5, d: 8, val: 0.625 }
  ];
  const q4MaxItem = q4List.reduce((max, item) => (item.val > max.val ? item : max), q4List[0]);
  const q4CorrectVal = `${q4MaxItem.n}/${q4MaxItem.d}`;
  const q4CorrectOpt = {
    val: q4CorrectVal,
    render: <Fraction num={q4MaxItem.n} den={q4MaxItem.d} size="md" />
  };
  const q4WrongOpts = q4List
    .filter(item => `${item.n}/${item.d}` !== q4CorrectVal)
    .map(item => ({
      val: `${item.n}/${item.d}`,
      render: <Fraction num={item.n} den={item.d} size="md" />
    }));
  const q4Options = makeUniqueOptions(q4CorrectOpt, q4WrongOpts);

  // Q5: True / False - Κανόνας Ίδιων Αριθμητών
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? (locale === 'en'
        ? 'Between two fractions with the same numerator, the one with the smaller denominator is greater.'
        : 'Ανάμεσα σε δύο κλάσματα με τον ίδιο αριθμητή, μεγαλύτερο είναι εκείνο με τον μικρότερο παρονομαστή.')
    : (locale === 'en'
        ? 'Between two fractions with the same numerator, the one with the larger denominator is greater.'
        : 'Ανάμεσα σε δύο κλάσματα με τον ίδιο αριθμητή, μεγαλύτερο είναι εκείνο με τον μεγαλύτερο παρονομαστή.');

  // Q6: True / False - Γνήσια vs Καταχρηστικά
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? (locale === 'en'
        ? 'Every improper fraction (numerator ＞ denominator) is greater than any proper fraction (numerator ＜ denominator).'
        : 'Κάθε καταχρηστικό κλάσμα (αριθμητής ＞ παρονομαστή) είναι μεγαλύτερο από οποιοδήποτε γνήσιο κλάσμα (αριθμητής ＜ παρονομαστή).')
    : (locale === 'en'
        ? 'A proper fraction can be greater than an improper fraction.'
        : 'Ένα γνήσιο κλάσμα μπορεί να είναι μεγαλύτερο από ένα καταχρηστικό κλάσμα.');

  // Q7: Input - Υπολογισμός χιαστί γινομένου
  const q7Num1 = randInt(2, 4);
  const q7Den1 = randInt(5, 7);
  const q7Num2 = randInt(3, 5);
  const q7Den2 = randInt(6, 9);
  const q7CrossLeft = q7Num1 * q7Den2;
  const q7Correct = String(q7CrossLeft);

  // Q8: MCQ - Ποιο κλάσμα είναι ισοδύναμο (Εγγύηση 4 μοναδικών επιλογών)
  const q8BaseN = randInt(2, 3);
  const q8BaseD = randInt(4, 5);
  const q8Mult = randInt(2, 4);
  const q8CorrectObj = { num: q8BaseN * q8Mult, den: q8BaseD * q8Mult };
  const q8CorrectVal = `${q8CorrectObj.num}/${q8CorrectObj.den}`;
  const q8CorrectOption = {
    val: q8CorrectVal,
    render: <Fraction num={q8CorrectObj.num} den={q8CorrectObj.den} size="md" />
  };
  const q8WrongList = [
    { num: q8BaseN * q8Mult + 1, den: q8BaseD * q8Mult },
    { num: q8BaseN * q8Mult, den: q8BaseD * q8Mult + 1 },
    { num: q8BaseN + 2, den: q8BaseD + 2 },
    { num: q8BaseN * q8Mult + 2, den: q8BaseD * q8Mult + 3 }
  ].map(o => ({
    val: `${o.num}/${o.den}`,
    render: <Fraction num={o.num} den={o.den} size="md" />
  }));
  const q8Options = makeUniqueOptions(q8CorrectOption, q8WrongList);

  // Q9 & Q10: Problems from pools
  const spIndex = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q9Raw = STANDARD_PROBLEMS_POOL[spIndex].generate(locale);

  const hpIndex = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Raw = HARD_PROBLEMS_POOL[hpIndex].generate(locale);

  return [
    {
      id: 'q1',
      type: 'compare',
      title: locale === 'en' ? 'Like Fractions' : 'Ομώνυμα Κλάσματα',
      f1Num: q1Num1,
      f1Den: q1Den,
      f2Num: q1Num2,
      f2Den: q1Den,
      correct: q1Correct,
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {locale === 'en' ? (
            <>
              <span>Like denominators ({q1Den}). Since {q1Num1} {q1Correct} {q1Num2},</span>
              <Fraction num={q1Num1} den={q1Den} size="sm" />
              <span>{q1Correct}</span>
              <Fraction num={q1Num2} den={q1Den} size="sm" />
              <span>.</span>
            </>
          ) : (
            <>
              <span>Ίδιος παρονομαστής ({q1Den}). Επειδή {q1Num1} {q1Correct} {q1Num2},</span>
              <Fraction num={q1Num1} den={q1Den} size="sm" />
              <span>{q1Correct}</span>
              <Fraction num={q1Num2} den={q1Den} size="sm" />
              <span>.</span>
            </>
          )}
        </span>
      )
    },
    {
      id: 'q2',
      type: 'compare',
      title: locale === 'en' ? 'Same Numerators' : 'Ίδιοι Αριθμητές',
      f1Num: q2Num,
      f1Den: q2Den1,
      f2Num: q2Num,
      f2Den: q2Den2,
      correct: q2Correct,
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {locale === 'en' ? (
            <>
              <span>Same numerator ({q2Num}). The smaller denominator yields the larger piece:</span>
              <Fraction num={q2Num} den={q2Den1} size="sm" />
              <span>{q2Correct}</span>
              <Fraction num={q2Num} den={q2Den2} size="sm" />
              <span>.</span>
            </>
          ) : (
            <>
              <span>Ίδιος αριθμητής ({q2Num}). Μεγαλύτερο είναι εκείνο με τον μικρότερο παρονομαστή:</span>
              <Fraction num={q2Num} den={q2Den1} size="sm" />
              <span>{q2Correct}</span>
              <Fraction num={q2Num} den={q2Den2} size="sm" />
              <span>.</span>
            </>
          )}
        </span>
      )
    },
    {
      id: 'q3',
      type: 'compare',
      title: locale === 'en' ? 'Unlike Fractions (Cross-Multiply)' : 'Ετερώνυμα Κλάσματα (Χιαστί)',
      f1Num: q3Num1,
      f1Den: q3Den1,
      f2Num: q3Num2,
      f2Den: q3Den2,
      correct: q3Correct,
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {locale === 'en'
            ? `Cross products: ${q3Num1} · ${q3Den2} ＝ ${cross1} and ${q3Num2} · ${q3Den1} ＝ ${cross2}. Since ${cross1} ${q3Correct} ${cross2}: `
            : `Χιαστί γινόμενα: ${q3Num1} · ${q3Den2} ＝ ${cross1} και ${q3Num2} · ${q3Den1} ＝ ${cross2}. Επειδή ${cross1} ${q3Correct} ${cross2}: `}
          <Fraction num={q3Num1} den={q3Den1} size="sm" />
          <span>{q3Correct}</span>
          <Fraction num={q3Num2} den={q3Den2} size="sm" />
          <span>.</span>
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'Finding the Largest' : 'Εύρεση Μεγαλύτερου',
      prompt: (
        <span>
          {locale === 'en'
            ? 'Which of the following fractions is the LARGEST?'
            : 'Ποιο από τα παρακάτω κλάσματα είναι το μεγαλύτερο;'}
        </span>
      ),
      options: q4Options,
      correct: q4CorrectVal,
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {locale === 'en' ? (
            <>
              <span>Converting to decimals or common denominators,</span>
              <Fraction num={q4MaxItem.n} den={q4MaxItem.d} size="sm" />
              <span>({q4MaxItem.val.toLocaleString('en-US')}) is the largest.</span>
            </>
          ) : (
            <>
              <span>Μετατρέποντας σε ομώνυμα ή δεκαδικούς, το</span>
              <Fraction num={q4MaxItem.n} den={q4MaxItem.d} size="sm" />
              <span>({q4MaxItem.val.toLocaleString('el-GR')}) είναι το μεγαλύτερο.</span>
            </>
          )}
        </span>
      )
    },
    {
      id: 'q5',
      type: 'tf',
      title: locale === 'en' ? 'Rule of Equal Numerators' : 'Κανόνας Ίδιων Αριθμητών',
      text: q5Text,
      correct: q5IsTrue,
      explain: (
        <span>
          {q5IsTrue
            ? (locale === 'en'
                ? 'Correct! Smaller denominator means fewer and thus larger equal slices.'
                : 'Σωστά! Όσο μικρότερος είναι ο παρονομαστής, σε τόσο λιγότερα και μεγαλύτερα κομμάτια χωρίζεται η μονάδα.')
            : (locale === 'en'
                ? 'False! The fraction with the SMALLER denominator is larger.'
                : 'Λάθος! Μεγαλύτερο είναι εκείνο με τον ΜΙΚΡΟΤΕΡΟ παρονομαστή.')}
        </span>
      )
    },
    {
      id: 'q6',
      type: 'tf',
      title: locale === 'en' ? 'Benchmarking Against 1 Whole' : 'Σύγκριση με τη Μονάδα',
      text: q6Text,
      correct: q6IsTrue,
      explain: (
        <span>
          {q6IsTrue
            ? (locale === 'en'
                ? 'Correct! Proper fractions are ＜ 1, while improper fractions are ＞ 1.'
                : 'Σωστά! Τα γνήσια κλάσματα είναι ＜ 1, ενώ τα καταχρηστικά είναι ＞ 1.')
            : (locale === 'en'
                ? 'False! No proper fraction (＜ 1) can exceed an improper fraction (＞ 1).'
                : 'Λάθος! Κανένα γνήσιο κλάσμα (＜ 1) δεν μπορεί να ξεπεράσει ένα καταχρηστικό κλάσμα (＞ 1).')}
        </span>
      )
    },
    {
      id: 'q7',
      type: 'input',
      title: locale === 'en' ? 'Cross Product Calculation' : 'Υπολογισμός Χιαστί',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
          <span>{locale === 'en' ? 'Comparing' : 'Στη σύγκριση των'}</span>
          <Fraction num={q7Num1} den={q7Den1} size="sm" />
          <span>{locale === 'en' ? 'and' : 'και'}</span>
          <Fraction num={q7Num2} den={q7Den2} size="sm" />
          <span>{locale === 'en' ? `, what is the left cross product (${q7Num1} · ${q7Den2})?` : `, ποιο είναι το αριστερό χιαστί γινόμενο (${q7Num1} · ${q7Den2});`}</span>
        </span>
      ),
      correct: q7Correct,
      explain: (
        <span>
          {q7Num1} · {q7Den2} ＝ {q7Correct}.
        </span>
      )
    },
    {
      id: 'q8',
      type: 'mcq',
      title: locale === 'en' ? 'Equivalent Fraction' : 'Ισοδύναμο Κλάσμα',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1.5 max-w-full">
          <span>{locale === 'en' ? 'Which fraction is equivalent to' : 'Ποιο από τα παρακάτω κλάσματα είναι ίσο (ισοδύναμο) με το'}</span>
          <Fraction num={q8BaseN} den={q8BaseD} size="sm" />
          <span>;</span>
        </span>
      ),
      options: q8Options,
      correct: q8CorrectVal,
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {locale === 'en'
            ? `Multiplying terms by ${q8Mult} yields `
            : `Πολλαπλασιάζοντας τους όρους επί ${q8Mult} παίρνουμε το `}
          <Fraction num={q8CorrectObj.num} den={q8CorrectObj.den} size="sm" />
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

export default function SigkrisiKlasmatonExercisesPage() {
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
      let sanitized = String(rawValue).replace(/[^0-9]/g, '');
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
    if (q.type === 'compare') {
      return userVal === q.correct;
    }
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.replace(/\s+/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\s+/g, '').trim().toLowerCase();
      return cleanUser === cleanTarget;
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
          href="/st-dimotikou/26-sigkrisi-klasmaton"
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
                    {q.type === 'compare' ? (
                      <div className="space-y-4 mb-4">
                        <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold text-center break-words [overflow-wrap:anywhere]">
                          {t.comparePrompt}
                        </p>
                        <div className="flex items-center justify-center gap-2 sm:gap-4 font-mono text-xl sm:text-2xl font-black flex-wrap">
                          <Fraction num={q.f1Num} den={q.f1Den} size="lg" className="text-blue-700 bg-blue-50 px-3 py-2 rounded-2xl border border-blue-200" />
                          <span className="text-amber-500 text-3xl font-black min-w-[32px] text-center">
                            {answers[q.id] || '?'}
                          </span>
                          <Fraction num={q.f2Num} den={q.f2Den} size="lg" className="text-orange-700 bg-orange-50 px-3 py-2 rounded-2xl border border-orange-200" />
                        </div>
                        <div className="grid grid-cols-3 gap-2.5">
                          {['＞', '＜', '＝'].map((sym) => (
                            <button
                              key={sym}
                              type="button"
                              disabled={submitted}
                              onClick={() => handleAnswerChange(q.id, sym, 'compare')}
                              className={`py-3 rounded-2xl font-mono font-black text-xl border transition touch-manipulation active:scale-95 ${
                                answers[q.id] === sym
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50'
                              }`}
                            >
                              {sym}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-4 break-words [overflow-wrap:anywhere]">
                        {q.type === 'tf' ? `«${q.text}»` : q.prompt}
                      </div>
                    )}

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
                          inputMode="numeric"
                          autoComplete="off"
                          spellCheck="false"
                          maxLength={10}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
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