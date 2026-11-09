// pages/st-dimotikou/23-klasma-ask.js
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

// Component για κανονική κατακόρυφη μορφή κλάσματος (αριθμητής πάνω, γραμμή, παρονομαστής κάτω)
export function Fraction({ num, den, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: { numDen: 'text-xs sm:text-sm font-bold', line: 'w-full h-0.5' },
    md: { numDen: 'text-sm sm:text-base font-black', line: 'w-full h-0.5' },
    lg: { numDen: 'text-lg sm:text-xl font-black', line: 'w-full h-1' }
  };

  const selected = sizeClasses[size] || sizeClasses.md;

  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle font-mono leading-none px-1 shrink-0 max-w-full ${className}`}>
      <span className={`${selected.numDen} pb-0.5 break-all text-center`}>{num}</span>
      <span className={`${selected.line} bg-current rounded-full my-0.5 min-w-[12px]`} />
      <span className={`${selected.numDen} pt-0.5 break-all text-center`}>{den}</span>
    </span>
  );
}

// Εγγύηση 4 μοναδικών επιλογών για MCQ (αντικείμενα με val & render)
function buildFourOptions(correctObj, distractorObjs, fallbackFn) {
  const uniqueKeys = new Set();
  const result = [];

  if (correctObj && correctObj.val !== undefined && correctObj.val !== null) {
    uniqueKeys.add(String(correctObj.val));
    result.push(correctObj);
  }

  for (const item of distractorObjs) {
    if (item && item.val !== undefined && item.val !== null) {
      const key = String(item.val);
      if (!uniqueKeys.has(key)) {
        uniqueKeys.add(key);
        result.push(item);
      }
    }
    if (result.length === 4) break;
  }

  let safety = 1;
  while (result.length < 4 && safety < 30) {
    const fallback = fallbackFn ? fallbackFn(safety) : { val: `Επιλογή ${safety}`, render: <span>Επιλογή {safety}</span> };
    if (fallback && fallback.val !== undefined && fallback.val !== null) {
      const key = String(fallback.val);
      if (!uniqueKeys.has(key)) {
        uniqueKeys.add(key);
        result.push(fallback);
      }
    }
    safety++;
  }

  return shuffle(result);
}

// ---------------------------------------------------------
// ΛΕΞΙΚΟ i18n
// ---------------------------------------------------------

const TRANSLATIONS = {
  el: {
    pageTitle: "Ασκήσεις: Η Έννοια του Κλάσματος - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην έννοια του κλάσματος, στον αριθμητή και στον παρονομαστή για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 23 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Η Έννοια του Κλάσματος",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εμπεδώσεις τον αριθμητή, τον παρονομαστή, τα γνήσια και καταχρηστικά κλάσματα και τα οπτικά μοντέλα!",
    newQuestions: "Νέες Ασκήσεις",
    exercise: "Άσκηση",
    trueBtn: "Σωστό",
    falseBtn: "Λάθος",
    inputPlaceholder: "Γράψε την απάντησή σου...",
    tableHeaderElement: "Στοιχείο",
    tableHeaderFormula: "Ανάλυση / Τύπος",
    tableHeaderValue: "Τιμή",
    feedbackSuccess: "🎯 Εξαιρετικά!",
    feedbackReview: "💡 Επεξήγηση:",
    checkBtn: "Έλεγχος Απαντήσεων",
    scoreBadge: "Σκορ",
    answeredBadge: "Απαντήθηκαν",
    percentage: "Ποσοστό",
    bottomHint: "Απάντησε και στις 10 ερωτήσεις και πάτησε «Έλεγχος Απαντήσεων»!",
    properLabel: "Γνήσιο κλάσμα (＜ 1)",
    improperLabel: "Καταχρηστικό κλάσμα (＞ 1)",
    unitLabel: "Ίσο με τη μονάδα (＝ 1)",
    reciprocalLabel: "Μηδενικό κλάσμα (＝ 0)"
  },
  en: {
    pageTitle: "Exercises: Understanding Fractions - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on the concept of fractions, numerators, and denominators for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 23 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: Understanding Fractions",
    desc: "Solve the 10 dynamic questions to master numerators, denominators, proper/improper fractions, and visual models!",
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
    properLabel: "Proper fraction (＜ 1)",
    improperLabel: "Improper fraction (＞ 1)",
    unitLabel: "Equal to whole (＝ 1)",
    reciprocalLabel: "Zero fraction (＝ 0)"
  }
};

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 & Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'sp1',
    generate: (locale) => {
      const parts = 8;
      const eaten = randInt(3, 5);
      const remaining = parts - eaten;
      const correctObj = { val: `${remaining}/${parts}`, render: <Fraction num={remaining} den={parts} size="md" /> };
      const distractors = [
        { val: `${eaten}/${parts}`, render: <Fraction num={eaten} den={parts} size="md" /> },
        { val: `${parts}/${remaining}`, render: <Fraction num={parts} den={remaining} size="md" /> },
        { val: `${remaining + 1}/${parts}`, render: <Fraction num={remaining + 1} den={parts} size="md" /> }
      ];
      return {
        title: locale === 'en' ? 'Sharing Pizza with Friends' : 'Μοίρασμα Πίτσας στην Παρέα',
        prompt: (
          <span>
            {locale === 'en'
              ? `A large pizza was cut into ${parts} equal slices. A group of friends ate ${eaten} of them. What fraction of the pizza was left?`
              : `Μία μεγάλη πίτσα κόπηκε σε ${parts} ίσα κομμάτια. Μια παρέα φίλων κατανάλωσε τα ${eaten} από αυτά. Ποιο κλάσμα της πίτσας περίσσεψε;`}
          </span>
        ),
        correctText: `${remaining}/${parts}`,
        correctObj,
        distractors,
        tableData: [
          {
            item: locale === 'en' ? 'Total equal slices (Denominator)' : 'Συνολικά ίσα μέρη (Παρονομαστής)',
            formula: `${parts}`,
            val: `${parts}`
          },
          {
            item: locale === 'en' ? 'Slices consumed' : 'Κομμάτια που καταναλώθηκαν',
            formula: `${eaten}`,
            val: `${eaten}/${parts}`
          },
          {
            item: locale === 'en' ? 'Slices remaining (Numerator)' : 'Κομμάτια που περίσσεψαν (Αριθμητής)',
            formula: `${parts} － ${eaten} ＝ ${remaining}`,
            val: `${remaining}/${parts}`
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Out of ${parts} equal slices, ${remaining} slices remain. Thus, the remaining fraction is `
              : `Από τα ${parts} ίσα κομμάτια έμειναν τα ${remaining}. Επομένως, το μέρος που περίσσεψε είναι `}
            <Fraction num={remaining} den={parts} size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'sp2',
    generate: (locale) => {
      const parts = 12;
      const given = randInt(4, 7);
      const correctObj = { val: `${given}/${parts}`, render: <Fraction num={given} den={parts} size="md" /> };
      const distractors = [
        { val: `${parts}/${given}`, render: <Fraction num={parts} den={given} size="md" /> },
        { val: `${parts - given}/${parts}`, render: <Fraction num={parts - given} den={parts} size="md" /> },
        { val: `${given}/${parts - 2}`, render: <Fraction num={given} den={parts - 2} size="md" /> }
      ];
      return {
        title: locale === 'en' ? 'Chocolate Bar Squares' : 'Σοκολάτα με Ίσα Τετραγωνάκια',
        prompt: (
          <span>
            {locale === 'en'
              ? `A chocolate bar consists of ${parts} equal squares. Nick treated his friends to ${given} squares. What fraction of the chocolate did Nick share?`
              : `Μία πλάκα σοκολάτας αποτελείται από ${parts} ίσα τετραγωνάκια. Ο Νίκος κέρασε τους φίλους του τα ${given} τετραγωνάκια. Ποιο κλάσμα της σοκολάτας κέρασε ο Νίκος;`}
          </span>
        ),
        correctText: `${given}/${parts}`,
        correctObj,
        distractors,
        tableData: [
          {
            item: locale === 'en' ? 'Total equal parts' : 'Σύνολο ίσων μερών',
            formula: `${parts}`,
            val: `${parts}`
          },
          {
            item: locale === 'en' ? 'Parts shared' : 'Μέρη που μοιράστηκαν',
            formula: `${given}`,
            val: `${given}`
          },
          {
            item: locale === 'en' ? 'Fraction shared' : 'Κλάσμα Κεράσματος',
            formula: locale === 'en' ? 'Numerator / Denominator' : 'Αριθμητής / Παρονομαστής',
            val: `${given}/${parts}`
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Nick gave away ${given} out of ${parts} equal parts, so the fraction is `
              : `Ο Νίκος πήρε ${given} από τα ${parts} ίσα μέρη, άρα το κλάσμα είναι `}
            <Fraction num={given} den={parts} size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'sp3',
    generate: (locale) => {
      const totalPages = 100;
      const readPages = randInt(25, 65);
      const correctObj = { val: `${readPages}/${totalPages}`, render: <Fraction num={readPages} den={totalPages} size="md" /> };
      const distractors = [
        { val: `${totalPages}/${readPages}`, render: <Fraction num={totalPages} den={readPages} size="md" /> },
        { val: `${totalPages - readPages}/${totalPages}`, render: <Fraction num={totalPages - readPages} den={totalPages} size="md" /> },
        { val: `${readPages}/10`, render: <Fraction num={readPages} den="10" size="md" /> }
      ];
      return {
        title: locale === 'en' ? 'Pages in a Novel' : 'Σελίδες Εξωσχολικού Βιβλίου',
        prompt: (
          <span>
            {locale === 'en'
              ? `Maria is reading a ${totalPages}-page novel. So far, she has finished ${readPages} pages. What fraction of the novel has she read?`
              : `Η Μαρία διαβάζει ένα βιβλίο ${totalPages} σελίδων. Μέχρι σήμερα έχει ολοκληρώσει ${readPages} σελίδες. Ποιο κλάσμα του βιβλίου έχει διαβάσει;`}
          </span>
        ),
        correctText: `${readPages}/${totalPages}`,
        correctObj,
        distractors,
        tableData: [
          {
            item: locale === 'en' ? 'Total pages (Unit)' : 'Σύνολο σελίδων (Μονάδα)',
            formula: `${totalPages}`,
            val: `${totalPages}`
          },
          {
            item: locale === 'en' ? 'Pages read' : 'Σελίδες που διαβάστηκαν',
            formula: `${readPages}`,
            val: `${readPages}`
          },
          {
            item: locale === 'en' ? 'Fraction completed' : 'Κλάσμα Μελέτης',
            formula: `${readPages} : ${totalPages}`,
            val: `${readPages}/${totalPages}`
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `She read ${readPages} out of ${totalPages} pages: `
              : `Έχει διαβάσει ${readPages} από τις ${totalPages} σελίδες: `}
            <Fraction num={readPages} den={totalPages} size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'sp4',
    generate: (locale) => {
      const totalKm = 10;
      const doneKm = randInt(3, 7);
      const remainingKm = totalKm - doneKm;
      const correctObj = { val: `${remainingKm}/${totalKm}`, render: <Fraction num={remainingKm} den={totalKm} size="md" /> };
      const distractors = [
        { val: `${doneKm}/${totalKm}`, render: <Fraction num={doneKm} den={totalKm} size="md" /> },
        { val: `${totalKm}/${remainingKm}`, render: <Fraction num={totalKm} den={remainingKm} size="md" /> },
        { val: `${remainingKm}/12`, render: <Fraction num={remainingKm} den="12" size="md" /> }
      ];
      return {
        title: locale === 'en' ? 'Road Race Distance' : 'Διαδρομή Αγώνα Δρόμου',
        prompt: (
          <span>
            {locale === 'en'
              ? `A runner is in a ${totalKm} km race and has already covered the first ${doneKm} km. What fraction of the total course remains to be run?`
              : `Ένας δρομέας συμμετέχει σε αγώνα ${totalKm} χιλιομέτρων. Έχει ήδη καλύψει τα πρώτα ${doneKm} χιλιόμετρα. Ποιο κλάσμα της συνολικής διαδρομής του απομένει να διανύσει;`}
          </span>
        ),
        correctText: `${remainingKm}/${totalKm}`,
        correctObj,
        distractors,
        tableData: [
          {
            item: locale === 'en' ? 'Total distance' : 'Συνολική διαδρομή',
            formula: `${totalKm} km`,
            val: `${totalKm}`
          },
          {
            item: locale === 'en' ? 'Distance covered' : 'Διανυθείσα απόσταση',
            formula: `${doneKm} km`,
            val: `${doneKm}/${totalKm}`
          },
          {
            item: locale === 'en' ? 'Remaining distance' : 'Απομένουσα απόσταση',
            formula: `${totalKm} － ${doneKm} ＝ ${remainingKm}`,
            val: `${remainingKm}/${totalKm}`
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Remaining distance is ${totalKm} － ${doneKm} ＝ ${remainingKm} km out of ${totalKm} km: `
              : `Του απομένουν ${totalKm} － ${doneKm} ＝ ${remainingKm} χιλιόμετρα από τα ${totalKm}: `}
            <Fraction num={remainingKm} den={totalKm} size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'sp5',
    generate: (locale) => {
      const red = randInt(3, 6);
      const blue = randInt(4, 7);
      const total = red + blue;
      const correctObj = { val: `${red}/${total}`, render: <Fraction num={red} den={total} size="md" /> };
      const distractors = [
        { val: `${red}/${blue}`, render: <Fraction num={red} den={blue} size="md" /> },
        { val: `${blue}/${total}`, render: <Fraction num={blue} den={total} size="md" /> },
        { val: `${blue}/${red}`, render: <Fraction num={blue} den={red} size="md" /> }
      ];
      return {
        title: locale === 'en' ? 'Box of Colored Balls' : 'Κουτί με Χρωματιστές Μπάλες',
        prompt: (
          <span>
            {locale === 'en'
              ? `A box contains ${red} red balls and ${blue} blue balls. What fraction of the total balls are red?`
              : `Σε ένα κουτί υπάρχουν ${red} κόκκινες και ${blue} μπλε μπάλες. Ποιο κλάσμα του συνόλου των μπαλών αποτελούν οι κόκκινες μπάλες;`}
          </span>
        ),
        correctText: `${red}/${total}`,
        correctObj,
        distractors,
        tableData: [
          {
            item: locale === 'en' ? 'Red balls' : 'Κόκκινες μπάλες',
            formula: `${red}`,
            val: `${red}`
          },
          {
            item: locale === 'en' ? 'Blue balls' : 'Μπλε μπάλες',
            formula: `${blue}`,
            val: `${blue}`
          },
          {
            item: locale === 'en' ? 'Total balls (Denominator)' : 'Σύνολο μπαλών (Παρονομαστής)',
            formula: `${red} ＋ ${blue} ＝ ${total}`,
            val: `${total}`
          },
          {
            item: locale === 'en' ? 'Red ball fraction' : 'Κλάσμα κόκκινων',
            formula: `${red}/${total}`,
            val: `${red}/${total}`
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Total balls: ${red} ＋ ${blue} ＝ ${total}. Red balls are ${red}, representing `
              : `Το σύνολο των μπαλών είναι ${red} ＋ ${blue} ＝ ${total}. Οι κόκκινες είναι ${red}, άρα αποτελούν το `}
            <Fraction num={red} den={total} size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'sp6',
    generate: (locale) => {
      const parts = 6;
      const eaten = randInt(2, 4);
      const correctObj = { val: `${eaten}/${parts}`, render: <Fraction num={eaten} den={parts} size="md" /> };
      const distractors = [
        { val: `${parts}/${eaten}`, render: <Fraction num={parts} den={eaten} size="md" /> },
        { val: `${parts - eaten}/${parts}`, render: <Fraction num={parts - eaten} den={parts} size="md" /> },
        { val: `${eaten}/${parts + 2}`, render: <Fraction num={eaten} den={parts + 2} size="md" /> }
      ];
      return {
        title: locale === 'en' ? 'Homemade Pie Slices' : 'Κομμάτια Σπιτικής Πίτας',
        prompt: (
          <span>
            {locale === 'en'
              ? `A spinach pie was sliced into ${parts} equal pieces and ${eaten} pieces were served. What fraction of the pie was served?`
              : `Μία σπανακόπιτα κόπηκε σε ${parts} ίσα κομμάτια και σερβιρίστηκαν τα ${eaten} από αυτά. Ποιο κλάσμα της πίτας σερβιρίστηκε;`}
          </span>
        ),
        correctText: `${eaten}/${parts}`,
        correctObj,
        distractors,
        tableData: [
          {
            item: locale === 'en' ? 'Equal pie slices' : 'Ίσα κομμάτια πίτας',
            formula: `${parts}`,
            val: `${parts}`
          },
          {
            item: locale === 'en' ? 'Slices served' : 'Κομμάτια που σερβιρίστηκαν',
            formula: `${eaten}`,
            val: `${eaten}`
          },
          {
            item: locale === 'en' ? 'Fraction served' : 'Κλάσμα σερβιρίσματος',
            formula: `${eaten}/${parts}`,
            val: `${eaten}/${parts}`
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Served ${eaten} out of ${parts} equal pieces: `
              : `Σερβιρίστηκαν ${eaten} από τα ${parts} ίσα κομμάτια: `}
            <Fraction num={eaten} den={parts} size="sm" />.
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
      const partsPerPizza = 4;
      const totalSlices = randInt(9, 14);
      const tag = locale === 'en' ? 'Improper ＞ 1' : 'Καταχρηστικό ＞ 1';
      const properTag = locale === 'en' ? 'Proper ＜ 1' : 'Γνήσιο ＜ 1';
      const correctText = `${totalSlices}/${partsPerPizza} (${tag})`;
      const correctObj = {
        val: correctText,
        render: (
          <span className="flex items-center gap-1.5 flex-wrap justify-center">
            <Fraction num={totalSlices} den={partsPerPizza} size="md" />
            <span>({tag})</span>
          </span>
        )
      };
      const distractors = [
        {
          val: `${partsPerPizza}/${totalSlices} (${properTag})`,
          render: (
            <span className="flex items-center gap-1.5 flex-wrap justify-center">
              <Fraction num={partsPerPizza} den={totalSlices} size="md" />
              <span>({properTag})</span>
            </span>
          )
        },
        {
          val: `${totalSlices}/${partsPerPizza + 2} (${tag})`,
          render: (
            <span className="flex items-center gap-1.5 flex-wrap justify-center">
              <Fraction num={totalSlices} den={partsPerPizza + 2} size="md" />
              <span>({tag})</span>
            </span>
          )
        },
        {
          val: `${totalSlices}/${partsPerPizza + 1} (${tag})`,
          render: (
            <span className="flex items-center gap-1.5 flex-wrap justify-center">
              <Fraction num={totalSlices} den={partsPerPizza + 1} size="md" />
              <span>({tag})</span>
            </span>
          )
        }
      ];
      return {
        title: locale === 'en' ? 'Multiple Pizzas (Improper Fraction)' : 'Περισσότερες από Μία Πίτσες (Καταχρηστικό Κλάσμα)',
        prompt: (
          <span>
            {locale === 'en'
              ? `At a birthday party, each pizza is divided into ${partsPerPizza} equal slices. The kids consumed a total of ${totalSlices} slices. Which fraction represents the amount of pizza eaten and what type of fraction is it?`
              : `Σε ένα παιδικό πάρτι, κάθε πίτσα κόβεται σε ${partsPerPizza} ίσα κομμάτια. Τα παιδιά κατανάλωσαν συνολικά ${totalSlices} κομμάτια. Ποιο κλάσμα εκφράζει την ποσότητα πίτσας που φαγώθηκε και τι είδους κλάσμα είναι;`}
          </span>
        ),
        correctText,
        correctObj,
        distractors,
        tableData: [
          {
            item: locale === 'en' ? 'Slices per unit (Denominator)' : 'Μέρη ανά μονάδα (Παρονομαστής)',
            formula: `${partsPerPizza}`,
            val: `${partsPerPizza}`
          },
          {
            item: locale === 'en' ? 'Total slices (Numerator)' : 'Συνολικά κομμάτια (Αριθμητής)',
            formula: `${totalSlices}`,
            val: `${totalSlices}`
          },
          {
            item: locale === 'en' ? 'Type of fraction' : 'Είδος Κλάσματος',
            formula: `${totalSlices} ＞ ${partsPerPizza}`,
            val: locale === 'en' ? 'Improper (＞ 1)' : 'Καταχρηστικό (＞ 1)'
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Each whole pizza is split into ${partsPerPizza} slices and ${totalSlices} were eaten, giving `
              : `Επειδή κάθε μονάδα (πίτσα) χωρίζεται σε ${partsPerPizza} μέρη και καταναλώθηκαν ${totalSlices} κομμάτια, το κλάσμα είναι `}
            <Fraction num={totalSlices} den={partsPerPizza} size="sm" />.
            {locale === 'en'
              ? ` Because ${totalSlices} ＞ ${partsPerPizza}, it is an improper fraction (＞ 1).`
              : ` Επειδή ${totalSlices} ＞ ${partsPerPizza}, είναι καταχρηστικό κλάσμα (＞ 1).`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp2',
    generate: (locale) => {
      const den = 6;
      const num = randInt(13, 19);
      const unitLabel = locale === 'en' ? 'chocolate bars' : 'σοκολάτες';
      const correctText = `${num}/${den}`;
      const correctObj = {
        val: correctText,
        render: (
          <span className="flex items-center gap-1.5 flex-wrap justify-center">
            <Fraction num={num} den={den} size="md" />
            <span>{unitLabel}</span>
          </span>
        )
      };
      const distractors = [
        {
          val: `${den}/${num}`,
          render: (
            <span className="flex items-center gap-1.5 flex-wrap justify-center">
              <Fraction num={den} den={num} size="md" />
              <span>{unitLabel}</span>
            </span>
          )
        },
        {
          val: `${num - den}/${den}`,
          render: (
            <span className="flex items-center gap-1.5 flex-wrap justify-center">
              <Fraction num={num - den} den={den} size="md" />
              <span>{unitLabel}</span>
            </span>
          )
        },
        {
          val: `${num}/${den + 2}`,
          render: (
            <span className="flex items-center gap-1.5 flex-wrap justify-center">
              <Fraction num={num} den={den + 2} size="md" />
              <span>{unitLabel}</span>
            </span>
          )
        }
      ];
      return {
        title: locale === 'en' ? 'Chocolates for School Trip' : 'Σοκολάτες για την Εκδρομή',
        prompt: (
          <span>
            {locale === 'en'
              ? `On a school field trip, each chocolate bar consists of ${den} equal squares. A group of students ate ${num} such squares in total. Which fraction expresses the quantity of chocolate bars consumed?`
              : `Στην εκδρομή, κάθε σοκολάτα αποτελείται από ${den} ίσα μέρη. Μια ομάδα μαθητών κατανάλωσε συνολικά ${num} τέτοια μέρη. Ποιο κλάσμα εκφράζει την ποσότητα των σοκολατών που καταναλώθηκαν;`}
          </span>
        ),
        correctText,
        correctObj,
        distractors,
        tableData: [
          {
            item: locale === 'en' ? 'Parts per chocolate' : 'Ίσα μέρη ανά σοκολάτα',
            formula: `${den}`,
            val: `${den}`
          },
          {
            item: locale === 'en' ? 'Parts consumed' : 'Μέρη που καταναλώθηκαν',
            formula: `${num}`,
            val: `${num}`
          },
          {
            item: locale === 'en' ? 'Fraction of bars' : 'Κλάσμα Σοκολατών',
            formula: `${num}/${den}`,
            val: `${num}/${den}`
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `One whole unit corresponds to ${den} parts (denominator) and ${num} parts were eaten: `
              : `Η μία ακέραια μονάδα αντιστοιχεί σε ${den} μέρη (παρονομαστής) και καταναλώθηκαν ${num} μέρη: `}
            <Fraction num={num} den={den} size="sm" /> {unitLabel}.
          </span>
        )
      };
    }
  },
  {
    id: 'hp3',
    generate: (locale) => {
      const den = randInt(3, 5);
      const whole = randInt(3, 6);
      const num = den * whole;
      const bottleLabel = locale === 'en' ? 'whole bottles' : 'ολόκληρα μπουκάλια';
      const correctText = String(whole);
      const correctObj = {
        val: correctText,
        render: (
          <span className="flex items-center gap-1.5 flex-wrap justify-center">
            <Fraction num={num} den={den} size="md" />
            <span>＝ {whole} {bottleLabel}</span>
          </span>
        )
      };
      const distractors = [
        {
          val: String(whole + 1),
          render: (
            <span className="flex items-center gap-1.5 flex-wrap justify-center">
              <Fraction num={num} den={den} size="md" />
              <span>＝ {whole + 1} {bottleLabel}</span>
            </span>
          )
        },
        {
          val: String(whole - 1),
          render: (
            <span className="flex items-center gap-1.5 flex-wrap justify-center">
              <Fraction num={num} den={den} size="md" />
              <span>＝ {whole - 1} {bottleLabel}</span>
            </span>
          )
        },
        {
          val: String(whole + 2),
          render: (
            <span className="flex items-center gap-1.5 flex-wrap justify-center">
              <Fraction num={den} den={num} size="md" />
              <span>({whole + 2} {bottleLabel})</span>
            </span>
          )
        }
      ];
      return {
        title: locale === 'en' ? 'Whole Bottles of Juice' : 'Ακέραια Μερίδια Αναψυκτικού',
        prompt: (
          <span>
            {locale === 'en'
              ? `At a reception, ${num} glasses of juice were served. If each bottle holds exactly ${den} glasses, how many whole bottles of juice were consumed?`
              : `Σε μία δεξίωση σερβιρίστηκαν ${num} ποτήρια χυμού. Αν κάθε μπουκάλι χωράει ακριβώς ${den} ποτήρια, πόσα ολόκληρα μπουκάλια χυμού καταναλώθηκαν;`}
          </span>
        ),
        correctText,
        correctObj,
        distractors,
        tableData: [
          {
            item: locale === 'en' ? 'Glasses per bottle' : 'Ποτήρια ανά μπουκάλι',
            formula: `${den}`,
            val: `${den}`
          },
          {
            item: locale === 'en' ? 'Total glasses' : 'Συνολικά ποτήρια',
            formula: `${num}`,
            val: `${num}`
          },
          {
            item: locale === 'en' ? 'Division / Whole result' : 'Διαίρεση / Ακέραιο αποτέλεσμα',
            formula: `${num} : ${den}`,
            val: `${whole}`
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `The fraction is `
              : `Το κλάσμα είναι `}
            <Fraction num={num} den={den} size="sm" />.
            {locale === 'en'
              ? ` Since the fraction bar means division: ${num} : ${den} ＝ ${whole} whole bottles.`
              : ` Επειδή η γραμμή του κλάσματος σημαίνει διαίρεση: ${num} : ${den} ＝ ${whole} ολόκληρα μπουκάλια.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp4',
    generate: (locale) => {
      const den = randInt(5, 9);
      const properNum = den - 1;
      const improperNum = den + 2;
      const correctMsg = locale === 'en'
        ? 'A ＜ 1, B ＝ 1 and C ＞ 1'
        : 'Το Α ＜ 1, το Β ＝ 1 και το Γ ＞ 1';
      const correctObj = { val: correctMsg, render: <span>{correctMsg}</span> };
      const distractors = [
        {
          val: locale === 'en' ? 'All three fractions are less than 1' : 'Και τα τρία κλάσματα είναι μικρότερα από το 1',
          render: <span>{locale === 'en' ? 'All three fractions are less than 1' : 'Και τα τρία κλάσματα είναι μικρότερα από το 1'}</span>
        },
        {
          val: locale === 'en' ? 'A ＞ 1, B ＝ 1 and C ＜ 1' : 'Το Α ＞ 1, το Β ＝ 1 και το Γ ＜ 1',
          render: <span>{locale === 'en' ? 'A ＞ 1, B ＝ 1 and C ＜ 1' : 'Το Α ＞ 1, το Β ＝ 1 και το Γ ＜ 1'}</span>
        },
        {
          val: locale === 'en' ? 'All three fractions equal 1' : 'Και τα τρία κλάσματα είναι ίσα με τη μονάδα',
          render: <span>{locale === 'en' ? 'All three fractions equal 1' : 'Και τα τρία κλάσματα είναι ίσα με τη μονάδα'}</span>
        }
      ];
      return {
        title: locale === 'en' ? 'Comparing Fractions with 1 Whole' : 'Σύγκριση Μεριδίων με τη Μονάδα',
        prompt: (
          <span className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span>{locale === 'en' ? 'Given fractions:' : 'Δίνονται τα κλάσματα:'}</span>
            <span>Α ＝ <Fraction num={properNum} den={den} size="sm" />,</span>
            <span>Β ＝ <Fraction num={den} den={den} size="sm" />,</span>
            <span>Γ ＝ <Fraction num={improperNum} den={den} size="sm" />.</span>
            <span>{locale === 'en' ? 'Which statement is completely TRUE?' : 'Ποια πρόταση είναι απόλυτα ΣΩΣΤΗ;'}</span>
          </span>
        ),
        correctText: correctMsg,
        correctObj,
        distractors,
        tableData: [
          {
            item: `A (${properNum}/${den})`,
            formula: `${properNum} ＜ ${den}`,
            val: locale === 'en' ? 'Proper (＜ 1)' : 'Γνήσιο (＜ 1)'
          },
          {
            item: `B (${den}/${den})`,
            formula: `${den} ＝ ${den}`,
            val: locale === 'en' ? 'Unit (＝ 1)' : 'Ίσο με τη Μονάδα (＝ 1)'
          },
          {
            item: `C (${improperNum}/${den})`,
            formula: `${improperNum} ＞ ${den}`,
            val: locale === 'en' ? 'Improper (＞ 1)' : 'Καταχρηστικό (＞ 1)'
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `In A the numerator is smaller (${properNum} ＜ ${den}) ➔ A ＜ 1. In B they are equal ➔ B ＝ 1. In C the numerator is greater (${improperNum} ＞ ${den}) ➔ C ＞ 1.`
              : `Στο Α ο αριθμητής είναι μικρότερος (${properNum} ＜ ${den}) ➔ Α ＜ 1. Στο Β είναι ίσοι ➔ Β ＝ 1. Στο Γ ο αριθμητής είναι μεγαλύτερος (${improperNum} ＞ ${den}) ➔ Γ ＞ 1.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp5',
    generate: (locale) => {
      const quarters = 8;
      const wholeKg = 2;
      const correctText = String(wholeKg);
      const correctObj = { val: '2', render: <span>2 {locale === 'en' ? 'whole kg' : 'ολόκληρα κιλά'}</span> };
      const distractors = [
        { val: '4', render: <span>4 {locale === 'en' ? 'whole kg' : 'ολόκληρα κιλά'}</span> },
        { val: '1', render: <span>1 {locale === 'en' ? 'whole kg' : 'ολόκληρο κιλό'}</span> },
        { val: '8', render: <span>8 {locale === 'en' ? 'whole kg' : 'ολόκληρα κιλά'}</span> }
      ];
      return {
        title: locale === 'en' ? 'Baking & Flour Portions' : 'Ζαχαροπλαστική και Μερίδες Αλευριού',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>
              {locale === 'en'
                ? `A recipe requires 8 fourths (`
                : `Μία συνταγή απαιτεί 8 τέταρτα (δηλαδή `}
            </span>
            <Fraction num={quarters} den="4" size="sm" />
            <span>
              {locale === 'en'
                ? `) of a kilogram of flour. How many whole kilograms of flour do we need?`
                : `) του κιλού αλεύρι. Πόσα ολόκληρα κιλά αλεύρι χρειαζόμαστε;`}
            </span>
          </span>
        ),
        correctText,
        correctObj,
        distractors,
        tableData: [
          {
            item: locale === 'en' ? 'Quarters of kg' : 'Ποσότητα σε τέταρτα',
            formula: '8/4 kg',
            val: '8/4'
          },
          {
            item: locale === 'en' ? 'Whole kg computation' : 'Υπολογισμός Ακεραίου',
            formula: '8 : 4',
            val: '2 kg'
          }
        ],
        explain: (
          <span>
            <Fraction num="8" den="4" size="sm" /> ＝ 8 : 4 ＝ 2 {locale === 'en' ? 'whole kg of flour.' : 'ολόκληρα κιλά αλεύρι.'}
          </span>
        )
      };
    }
  },
  {
    id: 'hp6',
    generate: (locale) => {
      const pairs = [
        { num: 3, den: 4, mins: 45 },
        { num: 2, den: 4, mins: 30 },
        { num: 1, den: 4, mins: 15 },
        { num: 2, den: 3, mins: 40 }
      ];
      const p = pairs[randInt(0, pairs.length - 1)];
      const minUnit = locale === 'en' ? 'minutes' : 'λεπτά';
      const correctText = String(p.mins);
      const correctObj = { val: String(p.mins), render: <span>{p.mins} {minUnit}</span> };
      const distractors = [
        { val: String(p.mins + 10), render: <span>{p.mins + 10} {minUnit}</span> },
        { val: String(Math.max(10, p.mins - 15)), render: <span>{Math.max(10, p.mins - 15)} {minUnit}</span> },
        { val: String(p.mins + 5), render: <span>{p.mins + 5} {minUnit}</span> }
      ];
      return {
        title: locale === 'en' ? 'Study Time as Fraction of an Hour' : 'Χρόνος Μελέτης σε Κλάσμα της Ώρας',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Kostas studied math for' : 'Ο Κώστας διάβασε Μαθηματικά για τα'}</span>
            <Fraction num={p.num} den={p.den} size="sm" />
            <span>
              {locale === 'en'
                ? `of an hour. How many minutes did he study? (1 hour ＝ 60 minutes)`
                : `της ώρας. Πόσα λεπτά διήρκεσε η μελέτη του; (1 ώρα ＝ 60 λεπτά)`}
            </span>
          </span>
        ),
        correctText,
        correctObj,
        distractors,
        tableData: [
          {
            item: locale === 'en' ? '1 whole hour' : '1 ολόκληρη ώρα',
            formula: locale === 'en' ? '60 minutes' : '60 λεπτά',
            val: '60'
          },
          {
            item: `1/${p.den}`,
            formula: `60 : ${p.den}`,
            val: `${60 / p.den} ${minUnit}`
          },
          {
            item: `${p.num}/${p.den}`,
            formula: `${60 / p.den} · ${p.num}`,
            val: `${p.mins} ${minUnit}`
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `An hour has 60 minutes. Divide into ${p.den} parts: 60 : ${p.den} ＝ ${60 / p.den} min. Take ${p.num} parts: ${60 / p.den} · ${p.num} ＝ ${p.mins} min.`
              : `Η ώρα έχει 60 λεπτά. Χωρίζουμε σε ${p.den} ίσα μέρη: 60 : ${p.den} ＝ ${60 / p.den} λεπτά. Παίρνουμε ${p.num} μέρη: ${60 / p.den} · ${p.num} ＝ ${p.mins} λεπτά.`}
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
  const t = TRANSLATIONS[locale];

  // Q1: Input - Αναγνώριση όρων κλάσματος
  const q1Num = randInt(2, 9);
  const q1Den = randInt(q1Num + 1, 15);
  const q1AskNumerator = Math.random() > 0.5;
  const q1Correct = String(q1AskNumerator ? q1Num : q1Den);
  const q1Prompt = (
    <span className="flex items-center gap-1.5 flex-wrap">
      <span>
        {q1AskNumerator
          ? (locale === 'en' ? 'Which number is the numerator of the fraction' : 'Ποιος αριθμός είναι ο αριθμητής του κλάσματος')
          : (locale === 'en' ? 'Which number is the denominator of the fraction' : 'Ποιος αριθμός είναι ο παρονομαστής του κλάσματος')}
      </span>
      <Fraction num={q1Num} den={q1Den} size="sm" />
      <span>;</span>
    </span>
  );

  // Q2: MCQ - Κατηγορία κλάσματος (Αυστηρά 4 επιλογές)
  const q2Type = ['proper', 'improper', 'unit'][randInt(0, 2)];
  let q2Num, q2Den, q2CorrectVal;
  if (q2Type === 'proper') {
    q2Den = randInt(4, 12);
    q2Num = randInt(1, q2Den - 1);
    q2CorrectVal = t.properLabel;
  } else if (q2Type === 'improper') {
    q2Den = randInt(3, 8);
    q2Num = randInt(q2Den + 1, 15);
    q2CorrectVal = t.improperLabel;
  } else {
    q2Den = randInt(3, 10);
    q2Num = q2Den;
    q2CorrectVal = t.unitLabel;
  }
  const q2AllOptions = [
    { val: t.properLabel, render: <span>{t.properLabel}</span> },
    { val: t.improperLabel, render: <span>{t.improperLabel}</span> },
    { val: t.unitLabel, render: <span>{t.unitLabel}</span> },
    { val: t.reciprocalLabel, render: <span>{t.reciprocalLabel}</span> }
  ];
  const q2CorrectObj = q2AllOptions.find(o => o.val === q2CorrectVal);
  const q2Distractors = q2AllOptions.filter(o => o.val !== q2CorrectVal);
  const q2Options = buildFourOptions(q2CorrectObj, q2Distractors, (k) => ({ val: `Επιλογή ${k}`, render: <span>Επιλογή {k}</span> }));

  // Q3: Input - Οπτικό μοντέλο ορθογωνίου
  const q3Total = [4, 5, 6, 8, 10][randInt(0, 4)];
  const q3Filled = randInt(1, q3Total - 1);
  const q3Correct = `${q3Filled}/${q3Total}`;

  // Q4: MCQ - Ποιο κλάσμα ισούται με ακέραιο αριθμό
  const q4Whole = randInt(2, 5);
  const q4Den = randInt(2, 6);
  const q4Num = q4Whole * q4Den;
  const q4CorrectStr = `${q4Num}/${q4Den}`;
  const q4CorrectObj = {
    val: q4CorrectStr,
    render: <Fraction num={q4Num} den={q4Den} size="md" />
  };
  const q4Distractors = [
    { val: `${q4Num + 1}/${q4Den}`, render: <Fraction num={q4Num + 1} den={q4Den} size="md" /> },
    { val: `${q4Num - 1}/${q4Den}`, render: <Fraction num={q4Num - 1} den={q4Den} size="md" /> },
    { val: `${q4Num}/${q4Den + 1}`, render: <Fraction num={q4Num} den={q4Den + 1} size="md" /> }
  ];
  const q4Options = buildFourOptions(q4CorrectObj, q4Distractors, (k) => ({
    val: `${q4Num + k * 2}/${q4Den}`,
    render: <Fraction num={q4Num + k * 2} den={q4Den} size="md" />
  }));

  // Q5: True/False - Ο παρονομαστής δεν μπορεί να είναι 0
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? (locale === 'en'
        ? 'The denominator of a fraction can never equal zero (0).'
        : 'Ο παρονομαστής ενός κλάσματος δεν μπορεί ποτέ να είναι ίσος με το μηδέν (0).')
    : (locale === 'en'
        ? 'The numerator of a fraction can never equal zero (0).'
        : 'Ο αριθμητής ενός κλάσματος δεν μπορεί ποτέ να είναι ίσος με το μηδέν (0).');

  // Q6: True/False - Σχέση αριθμητή και παρονομαστή στα γνήσια κλάσματα
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? (locale === 'en'
        ? 'In a proper fraction, the numerator is always strictly less than the denominator (＜ 1).'
        : 'Σε ένα γνήσιο κλάσμα, ο αριθμητής είναι πάντοτε μικρότερος από τον παρονομαστή (＜ 1).')
    : (locale === 'en'
        ? 'In a proper fraction, the numerator is always strictly greater than the denominator (＞ 1).'
        : 'Σε ένα γνήσιο κλάσμα, ο αριθμητής είναι πάντοτε μεγαλύτερος από τον παρονομαστή (＞ 1).');

  // Q7: Input - Δεκαδική τιμή απλού κλάσματος
  const q7Pairs = [
    { num: 1, den: 2, decEl: '0,5', decEn: '0.5' },
    { num: 1, den: 4, decEl: '0,25', decEn: '0.25' },
    { num: 3, den: 4, decEl: '0,75', decEn: '0.75' },
    { num: 3, den: 10, decEl: '0,3', decEn: '0.3' },
    { num: 7, den: 10, decEl: '0,7', decEn: '0.7' },
    { num: 9, den: 100, decEl: '0,09', decEn: '0.09' }
  ];
  const q7Selected = q7Pairs[randInt(0, q7Pairs.length - 1)];
  const q7Target = locale === 'en' ? q7Selected.decEn : q7Selected.decEl;

  // Q8: MCQ - Σημασία της γραμμής του κλάσματος / Μηδενικός αριθμητής
  const q8Pool = [
    {
      prompt: (
        <span>
          {locale === 'en'
            ? 'Which mathematical operation is always represented by the fraction bar between numerator and denominator?'
            : 'Ποια μαθηματική πράξη συμβολίζει πάντοτε η γραμμή του κλάσματος ανάμεσα στον αριθμητή και τον παρονομαστή;'}
        </span>
      ),
      correct: locale === 'en' ? 'Division ( : )' : 'Τη διαίρεση ( : )',
      options: [
        { val: locale === 'en' ? 'Division ( : )' : 'Τη διαίρεση ( : )', render: <span>{locale === 'en' ? 'Division ( : )' : 'Τη διαίρεση ( : )'}</span> },
        { val: locale === 'en' ? 'Multiplication ( · )' : 'Τον πολλαπλασιασμό ( · )', render: <span>{locale === 'en' ? 'Multiplication ( · )' : 'Τον πολλαπλασιασμό ( · )'}</span> },
        { val: locale === 'en' ? 'Addition ( ＋ )' : 'Την πρόσθεση ( ＋ )', render: <span>{locale === 'en' ? 'Addition ( ＋ )' : 'Την πρόσθεση ( ＋ )'}</span> },
        { val: locale === 'en' ? 'Subtraction ( － )' : 'Την αφαίρεση ( － )', render: <span>{locale === 'en' ? 'Subtraction ( － )' : 'Την αφαίρεση ( － )'}</span> }
      ],
      explain: (
        <span>
          {locale === 'en'
            ? 'The fraction bar always denotes division: Numerator : Denominator.'
            : 'Η γραμμή του κλάσματος ισοδυναμεί πάντοτε με διαίρεση: Αριθμητής : Παρονομαστής.'}
        </span>
      )
    },
    {
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'If a fraction has a numerator of 0 and denominator of 8 (' : 'Αν ένα κλάσμα έχει αριθμητή 0 και παρονομαστή 8 ('}</span>
          <Fraction num="0" den="8" size="sm" />
          <span>{locale === 'en' ? '), what does it equal?' : '), με ποιον αριθμό ισούται;'}</span>
        </span>
      ),
      correct: '0',
      options: [
        { val: '0', render: <span>0 (0 : 8 ＝ 0)</span> },
        { val: '1', render: <span>1</span> },
        { val: '8', render: <span>8</span> },
        { val: locale === 'en' ? 'Undefined' : 'Δεν ορίζεται', render: <span>{locale === 'en' ? 'Undefined' : 'Δεν ορίζεται'}</span> }
      ],
      explain: (
        <span>
          {locale === 'en'
            ? 'When the numerator is 0 and the denominator is non-zero, the result is 0 (0 : 8 ＝ 0).'
            : 'Όταν ο αριθμητής είναι 0 και ο παρονομαστής διάφορος του μηδενός, το αποτέλεσμα είναι 0 (0 : 8 ＝ 0).'}
        </span>
      )
    }
  ];
  const q8Data = q8Pool[randInt(0, q8Pool.length - 1)];
  const q8CorrectObj = q8Data.options.find(o => o.val === q8Data.correct);
  const q8Distractors = q8Data.options.filter(o => o.val !== q8Data.correct);
  const q8Options = buildFourOptions(q8CorrectObj, q8Distractors, (k) => ({ val: `Επιλογή ${k}`, render: <span>Επιλογή {k}</span> }));

  // Q9 & Q10: Problems from pools
  const spIndex = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q9Raw = STANDARD_PROBLEMS_POOL[spIndex].generate(locale);
  const q9Options = buildFourOptions(q9Raw.correctObj, q9Raw.distractors, (k) => ({ val: `Επιλογή ${k}`, render: <span>Επιλογή {k}</span> }));

  const hpIndex = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Raw = HARD_PROBLEMS_POOL[hpIndex].generate(locale);
  const q10Options = buildFourOptions(q10Raw.correctObj, q10Raw.distractors, (k) => ({ val: `Επιλογή ${k}`, render: <span>Επιλογή {k}</span> }));

  return [
    {
      id: 'q1',
      type: 'input',
      title: locale === 'en' ? 'Identifying Fraction Terms' : 'Αναγνώριση Όρων Κλάσματος',
      prompt: q1Prompt,
      correct: q1Correct,
      explain: (
        <span>
          {q1AskNumerator
            ? (locale === 'en'
                ? <span>In the fraction <Fraction num={q1Num} den={q1Den} size="sm" />, the numerator (top number) is <strong>{q1Num}</strong>.</span>
                : <span>Στο κλάσμα <Fraction num={q1Num} den={q1Den} size="sm" />, ο αριθμητής (ο πάνω όρος) είναι το <strong>{q1Num}</strong>.</span>)
            : (locale === 'en'
                ? <span>In the fraction <Fraction num={q1Num} den={q1Den} size="sm" />, the denominator (bottom number) is <strong>{q1Den}</strong>.</span>
                : <span>Στο κλάσμα <Fraction num={q1Num} den={q1Den} size="sm" />, ο παρονομαστής (ο κάτω όρος) είναι το <strong>{q1Den}</strong>.</span>)}
        </span>
      )
    },
    {
      id: 'q2',
      type: 'mcq',
      title: locale === 'en' ? 'Fraction Classification' : 'Κατηγορία Κλάσματος',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'What kind of fraction is' : 'Τι είδους κλάσμα είναι το'}</span>
          <Fraction num={q2Num} den={q2Den} size="sm" />
          <span>;</span>
        </span>
      ),
      options: q2Options,
      correct: q2CorrectVal,
      explain: (
        <span>
          {q2Type === 'proper'
            ? (locale === 'en'
                ? <span>It is a proper fraction because numerator ({q2Num}) is less than denominator ({q2Den}).</span>
                : <span>Είναι γνήσιο κλάσμα επειδή ο αριθμητής ({q2Num}) είναι μικρότερος από τον παρονομαστή ({q2Den}).</span>)
            : q2Type === 'improper'
            ? (locale === 'en'
                ? <span>It is an improper fraction because numerator ({q2Num}) is greater than denominator ({q2Den}).</span>
                : <span>Είναι καταχρηστικό κλάσμα επειδή ο αριθμητής ({q2Num}) είναι μεγαλύτερος από τον παρονομαστή ({q2Den}).</span>)
            : (locale === 'en'
                ? <span>It equals 1 whole unit because numerator and denominator are equal ({q2Num}/{q2Den} ＝ 1).</span>
                : <span>Είναι ίσο με τη μονάδα επειδή αριθμητής και παρονομαστής είναι ίσοι ({q2Num}/{q2Den} ＝ 1).</span>)}
        </span>
      )
    },
    {
      id: 'q3',
      type: 'input',
      title: locale === 'en' ? 'Linear Strip Model' : 'Οπτικό Μοντέλο Ορθογωνίου',
      total: q3Total,
      filled: q3Filled,
      prompt: (
        <span>
          {locale === 'en'
            ? `Write the fraction representing the shaded parts of the bar below (e.g., ${q3Filled}/${q3Total}):`
            : `Γράψε το κλάσμα που αντιστοιχεί στα χρωματισμένα μέρη του παρακάτω σχήματος (π.χ. ${q3Filled}/${q3Total}):`}
        </span>
      ),
      correct: q3Correct,
      explain: (
        <span>
          {locale === 'en'
            ? `There are ${q3Filled} shaded parts out of ${q3Total} equal divisions: `
            : `Έχουν χρωματιστεί ${q3Filled} από τα ${q3Total} ίσα μέρη: `}
          <Fraction num={q3Filled} den={q3Total} size="sm" />.
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'Fraction to Whole Number' : 'Κλάσμα & Ακέραιος Αριθμός',
      prompt: (
        <span>
          {locale === 'en'
            ? `Which of the following fractions equals exactly the whole number ${q4Whole}?`
            : `Ποιο από τα παρακάτω κλάσματα ισούται ακριβώς με τον ακέραιο αριθμό ${q4Whole};`}
        </span>
      ),
      options: q4Options,
      correct: q4CorrectStr,
      explain: (
        <span>
          {locale === 'en'
            ? `The fraction bar signifies division: `
            : `Η γραμμή του κλάσματος σημαίνει διαίρεση: `}
          <Fraction num={q4Num} den={q4Den} size="sm" /> ＝ {q4Num} : {q4Den} ＝ {q4Whole}.
        </span>
      )
    },
    {
      id: 'q5',
      type: 'tf',
      title: locale === 'en' ? 'Denominator Property' : 'Ιδιότητα Παρονομαστή',
      text: q5Text,
      correct: q5IsTrue,
      explain: (
        <span>
          {q5IsTrue
            ? (locale === 'en'
                ? 'Correct! Division by zero is undefined, so the denominator can never equal 0.'
                : 'Σωστά! Η διαίρεση με το μηδέν δεν ορίζεται, άρα ο παρονομαστής δεν μπορεί ποτέ να είναι 0.')
            : (locale === 'en'
                ? 'False! The numerator CAN be 0 (0/5 ＝ 0). It is strictly the denominator that cannot be 0.'
                : 'Λάθος! Ο αριθμητής ΜΠΟΡΕΙ να είναι 0 (0/5 ＝ 0). Ο παρονομαστής είναι αυτός που απαγορεύεται να είναι 0.')}
        </span>
      )
    },
    {
      id: 'q6',
      type: 'tf',
      title: locale === 'en' ? 'Concept of Proper Fraction' : 'Έννοια Γνήσιου Κλάσματος',
      text: q6Text,
      correct: q6IsTrue,
      explain: (
        <span>
          {q6IsTrue
            ? (locale === 'en'
                ? 'Correct! In a proper fraction we take fewer parts than the whole is divided into (Numerator ＜ Denominator).'
                : 'Σωστά! Στα γνήσια κλάσματα παίρνουμε λιγότερα μέρη από όσα χωρίσαμε τη μονάδα (Αριθμητής ＜ Παρονομαστής).')
            : (locale === 'en'
                ? 'False! When the numerator is strictly greater than the denominator, it is called an improper fraction (＞ 1).'
                : 'Λάθος! Όταν ο αριθμητής είναι μεγαλύτερος από τον παρονομαστή, το κλάσμα ονομάζεται καταχρηστικό (＞ 1).')}
        </span>
      )
    },
    {
      id: 'q7',
      type: 'input',
      title: locale === 'en' ? 'Decimal Value of Fraction' : 'Δεκαδική Αξία Κλάσματος',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Enter the decimal value of' : 'Γράψε τη δεκαδική τιμή του κλάσματος'}</span>
          <Fraction num={q7Selected.num} den={q7Selected.den} size="sm" />
          <span>({locale === 'en' ? 'e.g. 0.5' : 'π.χ. 0,5'}):</span>
        </span>
      ),
      correct: q7Target,
      explain: (
        <span>
          <Fraction num={q7Selected.num} den={q7Selected.den} size="sm" /> ＝ {q7Selected.num} : {q7Selected.den} ＝ {q7Target}.
        </span>
      )
    },
    {
      id: 'q8',
      type: 'mcq',
      title: locale === 'en' ? 'Properties & Symbols of Fractions' : 'Ιδιότητες & Σύμβολα Κλάσματος',
      prompt: q8Data.prompt,
      options: q8Options,
      correct: q8Data.correct,
      explain: q8Data.explain
    },
    {
      id: 'q9',
      type: 'mcq',
      title: `${locale === 'en' ? 'Problem' : 'Πρόβλημα'}: ${q9Raw.title}`,
      prompt: q9Raw.prompt,
      options: q9Options,
      correct: q9Raw.correctText,
      tableData: q9Raw.tableData,
      explain: q9Raw.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `${locale === 'en' ? 'Challenge Problem' : 'Σύνθετο Πρόβλημα'}: ${q10Raw.title}`,
      prompt: q10Raw.prompt,
      options: q10Options,
      correct: q10Raw.correctText,
      tableData: q10Raw.tableData,
      explain: q10Raw.explain
    }
  ];
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function KlasmaExercisesPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
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

  const handleInputChange = (id, val) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
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
          href="/st-dimotikou/23-klasma"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryNav)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200 break-words [overflow-wrap:anywhere]">
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
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all min-w-0 max-w-full ${getCardStyle(q)}`}
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

                    {/* SVG ΟΠΤΙΚΟ ΜΟΝΤΕΛΟ (ΓΙΑ ΤΗΝ Q3) */}
                    {q.type === 'input' && q.id === 'q3' && (
                      <div className="w-full bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-4 flex gap-1 shadow-inner overflow-hidden">
                        {Array.from({ length: q.total }).map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 h-10 rounded-md border border-slate-300 transition-all ${
                              i < q.filled ? 'bg-amber-500 shadow-xs' : 'bg-white'
                            }`}
                          />
                        ))}
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
                              onClick={() => handleInputChange(q.id, opt.val)}
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border text-center transition touch-manipulation active:scale-95 break-words whitespace-normal leading-snug flex items-center justify-center min-h-[52px] w-full [overflow-wrap:anywhere] ${
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
                          inputMode={q.id === 'q3' ? 'text' : 'numeric'}
                          autoComplete="off"
                          spellCheck="false"
                          maxLength={10}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          placeholder={q.id === 'q3' ? (locale === 'en' ? 'e.g. 3/5' : 'π.χ. 3/5') : t.inputPlaceholder}
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}

                    {q.type === 'tf' && (
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleInputChange(q.id, true)}
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
                          onClick={() => handleInputChange(q.id, false)}
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
                        <div className="w-full overflow-x-auto block bg-white/90 p-2.5 rounded-2xl border border-slate-200">
                          <table className="w-full min-w-[280px] text-xs text-left text-slate-700">
                            <thead>
                              <tr className="border-b border-slate-200 font-black text-slate-500 uppercase">
                                <th className="p-1.5">{toCleanUppercase(t.tableHeaderElement)}</th>
                                <th className="p-1.5">{toCleanUppercase(t.tableHeaderFormula)}</th>
                                <th className="p-1.5">{toCleanUppercase(t.tableHeaderValue)}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {q.tableData.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="p-1.5 font-sans font-bold text-slate-900 break-words [overflow-wrap:anywhere]">{row.item}</td>
                                  <td className="p-1.5 text-indigo-700 break-words [overflow-wrap:anywhere]">{row.formula}</td>
                                  <td className="p-1.5 font-black text-emerald-700 break-words [overflow-wrap:anywhere]">{row.val}</td>
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
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3 min-w-0 max-w-full`}>
          
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap justify-center">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm shrink-0">
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
          <div className="flex items-center gap-3 shrink-0">
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