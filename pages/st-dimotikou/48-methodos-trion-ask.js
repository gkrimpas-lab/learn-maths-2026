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

// Component κατακόρυφου κλάσματος (πλήρως responsive χωρίς horizontal scroll)
function Fraction({ num, den, className = '' }) {
  return (
    <span
      className={`inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">
        {num}
      </span>
      <span className="pt-0.5 px-0.5 sm:px-1 break-all">
        {den}
      </span>
    </span>
  );
}

// Μορφοποίηση αριθμού βάσει locale (el-GR / en-US)
function formatNum(val, decimals = 2, locale = 'el') {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  const num = Number(val);
  const targetLocale = locale === 'en' ? 'en-US' : 'el-GR';
  return num.toLocaleString(targetLocale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
}

// Εγγύηση 4 μοναδικών επιλογών για ερωτήσεις MCQ
function makeUniqueOptions(correct, wrongCandidates) {
  const unique = new Set([correct]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && String(opt).trim() !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }
  return shuffle(Array.from(unique));
}

// ---------------------------------------------------------
// ΛΕΞΙΚΟ i18n
// ---------------------------------------------------------

const TRANSLATIONS = {
  el: {
    pageTitle: "Ασκήσεις: Η Απλή Μέθοδος των Τριών - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην απλή μέθοδο των τριών, στα ανάλογα και αντιστρόφως ανάλογα ποσά για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 48 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Η Απλή Μέθοδος των Τριών",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην κατάταξη ποσών, στη διάκριση ανάλογων και αντιστρόφως ανάλογων ποσών και στον υπολογισμό του αγνώστου!",
    newQuestions: "Νέες Ασκήσεις",
    exercise: "Άσκηση",
    inputPlaceholderDecimal: "π.χ. 4,5",
    inputPlaceholderNumber: "Απάντηση...",
    tableHeaderElement: "Στοιχείο",
    tableHeaderFormula: "Ανάλυση / Τύπος",
    tableHeaderValue: "Τιμή",
    feedbackSuccess: "🎯 Εξαιρετικά!",
    feedbackReview: "💡 Επεξήγηση:",
    checkBtn: "Έλεγχος Απαντήσεων",
    scoreBadge: "Σκορ",
    answeredBadge: "Απαντήθηκαν",
    percentage: "Ποσοστό",
    bottomHint: "Απάντησε και στις 10 ερωτήσεις και πάτησε «Έλεγχος Απαντήσεων»!"
  },
  en: {
    pageTitle: "Exercises: The Simple Rule of Three - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on the simple rule of three, direct and inverse proportion for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 48 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: The Simple Rule of Three",
    desc: "Solve the 10 dynamic problems to practice structured data alignment, distinguishing direct and inverse proportions, and solving for x!",
    newQuestions: "New Exercises",
    exercise: "Exercise",
    inputPlaceholderDecimal: "e.g. 4.5",
    inputPlaceholderNumber: "Type your answer...",
    tableHeaderElement: "Element",
    tableHeaderFormula: "Analysis / Formula",
    tableHeaderValue: "Value",
    feedbackSuccess: "🎯 Excellent!",
    feedbackReview: "💡 Explanation:",
    checkBtn: "Check Answers",
    scoreBadge: "Score",
    answeredBadge: "Answered",
    percentage: "Percentage",
    bottomHint: "Answer all 10 questions and press 'Check Answers'!"
  }
};

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q7, Q8, Q9, Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'm3_std_1',
    generate: (locale) => {
      const kg1 = randInt(3, 5);
      const unitCost = randInt(4, 8);
      const cost1 = kg1 * unitCost;
      const kg2 = kg1 + randInt(3, 6);
      const cost2 = kg2 * unitCost;
      const formattedCost1 = formatNum(cost1, 0, locale);
      const formattedCost2 = formatNum(cost2, 0, locale);
      return {
        title: locale === 'en' ? 'Cheese Purchase (Direct Proportion)' : 'Αγορά Τυριού (Ανάλογα Ποσά)',
        prompt: (
          <span>
            {locale === 'en'
              ? `For ${kg1} kg of cheese we paid ${formattedCost1} €. How many € will we pay for ${kg2} kg of the same cheese?`
              : `Για ${kg1} kg τυρί πληρώσαμε ${formattedCost1} €. Πόσα € θα πληρώσουμε για ${kg2} kg από το ίδιο τυρί;`}
          </span>
        ),
        unit: '€',
        correctVal: String(cost2),
        correctText: `${formattedCost2} €`,
        tableData: [
          {
            item: locale === 'en' ? 'First quantity' : 'Πρώτη ποσότητα',
            formula: `${kg1} kg → ${formattedCost1} €`,
            val: `${formattedCost1} €`
          },
          {
            item: locale === 'en' ? 'Second quantity' : 'Δεύτερη ποσότητα',
            formula: `${kg2} kg → x €`,
            val: 'x €'
          },
          {
            item: locale === 'en' ? 'Cross-multiplication' : 'Σταυρωτό γινόμενο (χιαστί)',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                x ＝ <Fraction num={`${formattedCost1} · ${kg2}`} den={kg1} />
              </span>
            ),
            val: `${formattedCost2} €`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Directly proportional quantities. Alignment: {kg1} kg → {formattedCost1} € and {kg2} kg → x €. Cross-multiplication: x ＝ <Fraction num={`${formattedCost1} · ${kg2}`} den={kg1} /> ＝ <Fraction num={cost1 * kg2} den={kg1} /> ＝ {formattedCost2} €.
              </>
            ) : (
              <>
                Τα ποσά είναι ανάλογα (περισσότερα κιλά → περισσότερα χρήματα). Κατάταξη: {kg1} kg → {formattedCost1} € και {kg2} kg → x €. Εφαρμόζουμε χιαστί πολλαπλασιασμό: x ＝ <Fraction num={`${formattedCost1} · ${kg2}`} den={kg1} /> ＝ <Fraction num={cost1 * kg2} den={kg1} /> ＝ {formattedCost2} €.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(cost2 + unitCost, 0, locale)} €`,
          `${formatNum(Math.max(1, cost2 - unitCost), 0, locale)} €`,
          `${formatNum(cost2 + 2 * unitCost, 0, locale)} €`,
          `${formatNum(cost2 + 3 * unitCost, 0, locale)} €`
        ]
      };
    }
  },
  {
    id: 'm3_std_2',
    generate: (locale) => {
      const w1 = randInt(2, 4);
      const d1 = randInt(6, 12);
      const totalWork = w1 * d1;
      const w2 = w1 + randInt(2, 4);
      const d2 = totalWork / w2;
      const cleanD2 = Number.isInteger(d2) ? d2 : Number(d2.toFixed(1));
      const dayUnit = locale === 'en' ? 'days' : 'ημέρες';
      const formattedAns = formatNum(cleanD2, 1, locale);
      return {
        title: locale === 'en' ? 'Machine Repair (Inverse Proportion)' : 'Επισκευή Μηχανήματος (Αντιστρόφως Ανάλογα)',
        prompt: (
          <span>
            {locale === 'en'
              ? `In a workshop, ${w1} mechanics repair a machine in ${d1} days. In how many days would ${w2} mechanics repair it working at the same rate?`
              : `Σε ένα συνεργείο ${w1} μηχανικοί επισκευάζουν ένα μηχάνημα σε ${d1} ημέρες. Σε πόσες ημέρες θα το επισκεύαζαν ${w2} μηχανικοί με τον ίδιο ρυθμό εργασίας;`}
          </span>
        ),
        unit: dayUnit,
        correctVal: formattedAns,
        correctText: `${formattedAns} ${dayUnit}`,
        tableData: [
          {
            item: locale === 'en' ? 'Initial mechanics' : 'Αρχικοί μηχανικοί',
            formula: `${w1} → ${d1} ${locale === 'en' ? 'days' : 'ημ.'}`,
            val: `${totalWork} ${locale === 'en' ? 'man-days' : 'μεροκάματα'}`
          },
          {
            item: locale === 'en' ? 'New mechanics' : 'Νέοι μηχανικοί',
            formula: `${w2} → x`,
            val: 'x'
          },
          {
            item: locale === 'en' ? 'Horizontal product' : 'Οριζόντιο γινόμενο',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                x ＝ <Fraction num={`${w1} · ${d1}`} den={w2} />
              </span>
            ),
            val: `${formattedAns} ${dayUnit}`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Inversely proportional quantities. Alignment: {w1} → {d1} and {w2} → x. Horizontal multiplication: x ＝ <Fraction num={`${w1} · ${d1}`} den={w2} /> ＝ <Fraction num={totalWork} den={w2} /> ＝ {formattedAns} days.
              </>
            ) : (
              <>
                Τα ποσά είναι αντιστρόφως ανάλογα (περισσότεροι μηχανικοί → λιγότερες ημέρες). Κατάταξη: {w1} → {d1} και {w2} → x. Εφαρμόζουμε οριζόντιο πολλαπλασιασμό: x ＝ <Fraction num={`${w1} · ${d1}`} den={w2} /> ＝ <Fraction num={totalWork} den={w2} /> ＝ {formattedAns} ημέρες.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(cleanD2 + 2, 1, locale)} ${dayUnit}`,
          `${formatNum(Math.max(1, cleanD2 - 2), 1, locale)} ${dayUnit}`,
          `${formatNum(cleanD2 + 4, 1, locale)} ${dayUnit}`,
          `${formatNum(cleanD2 + 1, 1, locale)} ${dayUnit}`
        ]
      };
    }
  },
  {
    id: 'm3_std_3',
    generate: (locale) => {
      const hours1 = randInt(2, 4);
      const speed = randInt(70, 95);
      const dist1 = hours1 * speed;
      const hours2 = hours1 + randInt(2, 3);
      const dist2 = hours2 * speed;
      const formattedDist1 = formatNum(dist1, 0, locale);
      const formattedDist2 = formatNum(dist2, 0, locale);
      return {
        title: locale === 'en' ? 'Vehicle Travel (Direct Proportion)' : 'Κίνηση Οχήματος (Ανάλογα Ποσά)',
        prompt: (
          <span>
            {locale === 'en'
              ? `A vehicle travels ${formattedDist1} km in ${hours1} hours at constant speed. How many km will it travel in ${hours2} hours?`
              : `Ένα όχημα διανύει ${formattedDist1} km σε ${hours1} ώρες με σταθερή ταχύτητα. Πόσα km θα διανύσει σε ${hours2} ώρες;`}
          </span>
        ),
        unit: 'km',
        correctVal: String(dist2),
        correctText: `${formattedDist2} km`,
        tableData: [
          {
            item: locale === 'en' ? 'Time 1' : 'Χρόνος 1',
            formula: `${hours1} h → ${formattedDist1} km`,
            val: `${formattedDist1} km`
          },
          {
            item: locale === 'en' ? 'Time 2' : 'Χρόνος 2',
            formula: `${hours2} h → x km`,
            val: 'x km'
          },
          {
            item: locale === 'en' ? 'Cross-multiplication' : 'Χιαστί υπολογισμός',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                x ＝ <Fraction num={`${formattedDist1} · ${hours2}`} den={hours1} />
              </span>
            ),
            val: `${formattedDist2} km`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Directly proportional quantities. Alignment: {hours1} h → ${formattedDist1} km and {hours2} h → x km. Cross-multiplication: x ＝ <Fraction num={`${formattedDist1} · ${hours2}`} den={hours1} /> ＝ <Fraction num={dist1 * hours2} den={hours1} /> ＝ {formattedDist2} km.
              </>
            ) : (
              <>
                Τα ποσά είναι ανάλογα. Κατάταξη: {hours1} h → {formattedDist1} km και {hours2} h → x km. Με χιαστί: x ＝ <Fraction num={`${formattedDist1} · ${hours2}`} den={hours1} /> ＝ <Fraction num={dist1 * hours2} den={hours1} /> ＝ {formattedDist2} km.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(dist2 + 25, 0, locale)} km`,
          `${formatNum(Math.max(20, dist2 - 30), 0, locale)} km`,
          `${formatNum(dist2 + 50, 0, locale)} km`,
          `${formatNum(dist2 + 15, 0, locale)} km`
        ]
      };
    }
  },
  {
    id: 'm3_std_4',
    generate: (locale) => {
      const speed1 = 60;
      const time1 = randInt(3, 5);
      const dist = speed1 * time1;
      const speed2 = 90;
      const time2 = dist / speed2;
      const cleanTime2 = Number.isInteger(time2) ? time2 : Number(time2.toFixed(1));
      const hourUnit = locale === 'en' ? 'hours' : 'ώρες';
      const formattedAns = formatNum(cleanTime2, 1, locale);
      return {
        title: locale === 'en' ? 'Train Speed & Time (Inverse Proportion)' : 'Ταχύτητα και Χρόνος Τρένου (Αντιστρόφως Ανάλογα)',
        prompt: (
          <span>
            {locale === 'en'
              ? `A train covers a distance in ${time1} hours at ${speed1} km/h. How many hours will it take if it increases speed to ${speed2} km/h?`
              : `Ένα τρένο καλύπτει μια διαδρομή σε ${time1} ώρες με ταχύτητα ${speed1} km/h. Πόσες ώρες θα χρειαστεί αν αυξήσει την ταχύτητά του στα ${speed2} km/h;`}
          </span>
        ),
        unit: hourUnit,
        correctVal: formattedAns,
        correctText: `${formattedAns} ${hourUnit}`,
        tableData: [
          {
            item: locale === 'en' ? 'Speed 1 → Time 1' : 'Ταχύτητα 1 → Χρόνος 1',
            formula: `${speed1} km/h → ${time1} h`,
            val: `${dist} km`
          },
          {
            item: locale === 'en' ? 'Speed 2 → Time 2' : 'Ταχύτητα 2 → Χρόνος 2',
            formula: `${speed2} km/h → x h`,
            val: 'x h'
          },
          {
            item: locale === 'en' ? 'Horizontal product' : 'Οριζόντιο γινόμενο',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                x ＝ <Fraction num={`${speed1} · ${time1}`} den={speed2} />
              </span>
            ),
            val: `${formattedAns} ${hourUnit}`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Speed and time are inversely proportional (higher speed → less time). Horizontal multiplication: x ＝ <Fraction num={`${speed1} · ${time1}`} den={speed2} /> ＝ <Fraction num={dist} den={speed2} /> ＝ {formattedAns} hours.
              </>
            ) : (
              <>
                Ταχύτητα και χρόνος είναι αντιστρόφως ανάλογα ποσά (μεγαλύτερη ταχύτητα → λιγότερος χρόνος). Οριζόντιος πολλαπλασιασμός: x ＝ <Fraction num={`${speed1} · ${time1}`} den={speed2} /> ＝ <Fraction num={dist} den={speed2} /> ＝ {formattedAns} ώρες.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(cleanTime2 + 1, 1, locale)} ${hourUnit}`,
          `${formatNum(Math.max(1, cleanTime2 - 1), 1, locale)} ${hourUnit}`,
          `${formatNum(cleanTime2 + 2, 1, locale)} ${hourUnit}`,
          `${formatNum(cleanTime2 + 0.5, 1, locale)} ${hourUnit}`
        ]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'm3_hard_1',
    generate: (locale) => {
      const speed1 = 80;
      const minutes1 = 150;
      const dist = (speed1 * minutes1) / 60;
      const targetMin = 100;
      const reqSpeed = (dist / targetMin) * 60;
      const formattedReqSpeed = formatNum(reqSpeed, 0, locale);
      return {
        title: locale === 'en' ? 'Speed & Time Conversion to Minutes' : 'Ταχύτητα και Μετατροπή Χρόνου σε Λεπτά',
        prompt: (
          <span>
            {locale === 'en'
              ? `A car covers a distance in 2 hours and 30 minutes at a constant speed of ${speed1} km/h. At what speed in km/h must it travel to cover the same distance in 1 hour and 40 minutes?`
              : `Ένα αυτοκίνητο καλύπτει μια διαδρομή σε 2 ώρες και 30 λεπτά με σταθερή ταχύτητα ${speed1} km/h. Με ποια ταχύτητα σε km/h πρέπει να κινηθεί για να καλύψει την ίδια διαδρομή σε 1 ώρα και 40 λεπτά;`}
          </span>
        ),
        unit: 'km/h',
        correctVal: String(reqSpeed),
        correctText: `${formattedReqSpeed} km/h`,
        tableData: [
          {
            item: locale === 'en' ? 'Convert times to minutes' : 'Μετατροπή χρόνων σε min',
            formula: '150 min και 100 min',
            val: locale === 'en' ? 'Constant distance' : 'Σταθερή απόσταση'
          },
          {
            item: locale === 'en' ? 'Horizontal calculation' : 'Οριζόντιος υπολογισμός',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                x ＝ <Fraction num={`${speed1} · 150`} den={100} />
              </span>
            ),
            val: `${formattedReqSpeed} km/h`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Convert time to minutes: 2 h 30 min ＝ 150 min and 1 h 40 min ＝ 100 min. Inversely proportional quantities. Horizontal calculation: x ＝ <Fraction num={`${speed1} · 150`} den={100} /> ＝ <Fraction num={formatNum(speed1 * 150, 0, locale)} den={100} /> ＝ {formattedReqSpeed} km/h.
              </>
            ) : (
              <>
                Μετατρέπουμε τον χρόνο σε λεπτά: 2 h 30 min ＝ 150 min και 1 h 40 min ＝ 100 min. Ταχύτητα και χρόνος είναι αντιστρόφως ανάλογα ποσά (σταθερή απόσταση). Οριζόντιος υπολογισμός: x ＝ <Fraction num={`${speed1} · 150`} den={100} /> ＝ <Fraction num={formatNum(speed1 * 150, 0, locale)} den={100} /> ＝ {formattedReqSpeed} km/h.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(reqSpeed + 15, 0, locale)} km/h`,
          `${formatNum(Math.max(20, reqSpeed - 20), 0, locale)} km/h`,
          `${formatNum(reqSpeed + 25, 0, locale)} km/h`,
          `${formatNum(reqSpeed + 10, 0, locale)} km/h`
        ]
      };
    }
  },
  {
    id: 'm3_hard_2',
    generate: (locale) => {
      const flourGrams = 800;
      const breadKg = 1.2;
      const targetFlourKg = 3;
      const targetFlourGrams = 3000;
      const resBread = (breadKg * targetFlourGrams) / flourGrams;
      const formattedResBread = formatNum(resBread, 2, locale);
      const formattedBreadKg = formatNum(breadKg, 1, locale);
      const formattedTargetGrams = formatNum(targetFlourGrams, 0, locale);
      return {
        title: locale === 'en' ? 'Bread Baking with Unit Conversion' : 'Παραγωγή Ψωμιού με Μετατροπή Μονάδων',
        prompt: (
          <span>
            {locale === 'en'
              ? `From ${flourGrams} g of flour, ${formattedBreadKg} kg of bread are baked. How many kg of bread will be baked using ${targetFlourKg} kg of the same flour?`
              : `Από ${flourGrams} g αλεύρι παρασκευάζονται ${formattedBreadKg} kg ψωμί. Πόσα kg ψωμί θα παρασκευαστούν χρησιμοποιώντας ${targetFlourKg} kg από το ίδιο αλεύρι;`}
          </span>
        ),
        unit: 'kg',
        correctVal: formattedResBread,
        correctText: `${formattedResBread} kg`,
        tableData: [
          {
            item: locale === 'en' ? 'Convert kg to grams' : 'Μετατροπή kg σε γραμμάρια',
            formula: `${targetFlourKg} kg · 1.000`,
            val: `${formattedTargetGrams} g`
          },
          {
            item: locale === 'en' ? 'Cross-multiplication' : 'Σταυρωτό γινόμενο (χιαστί)',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                x ＝ <Fraction num={`${formattedBreadKg} · ${formattedTargetGrams}`} den={flourGrams} />
              </span>
            ),
            val: `${formattedResBread} kg`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Convert {targetFlourKg} kg to grams: {formattedTargetGrams} g. Directly proportional quantities. Cross-multiplication: x ＝ <Fraction num={`${formattedBreadKg} · ${formattedTargetGrams}`} den={flourGrams} /> ＝ <Fraction num={formatNum(breadKg * targetFlourGrams, 0, locale)} den={flourGrams} /> ＝ {formattedResBread} kg.
              </>
            ) : (
              <>
                Μετατρέπουμε τα {targetFlourKg} kg σε γραμμάρια: {formattedTargetGrams} g. Τα ποσά είναι ανάλογα. Εφαρμόζουμε χιαστί: x ＝ <Fraction num={`${formattedBreadKg} · ${formattedTargetGrams}`} den={flourGrams} /> ＝ <Fraction num={formatNum(breadKg * targetFlourGrams, 0, locale)} den={flourGrams} /> ＝ {formattedResBread} kg.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(resBread + 1, 2, locale)} kg`,
          `${formatNum(Math.max(1, resBread - 1), 2, locale)} kg`,
          `${formatNum(resBread + 1.5, 2, locale)} kg`,
          `${formatNum(resBread + 0.5, 2, locale)} kg`
        ]
      };
    }
  },
  {
    id: 'm3_hard_3',
    generate: (locale) => {
      const initWorkers = 6;
      const initDays = 18;
      const doneDays = 3;
      const remDays = initDays - doneDays;
      const remWork = initWorkers * remDays;
      const addedWorkers = 3;
      const totalWorkers = initWorkers + addedWorkers;
      const finalDays = remWork / totalWorkers;
      const dayUnit = locale === 'en' ? 'days' : 'ημέρες';
      const formattedFinalDays = String(finalDays);
      return {
        title: locale === 'en' ? 'Remaining Work with Added Workers' : 'Υπόλοιπο Έργου με Προσθήκη Εργατών',
        prompt: (
          <span>
            {locale === 'en'
              ? `A crew of ${initWorkers} workers planned to finish a project in ${initDays} days. After working alone for ${doneDays} days, ${addedWorkers} more workers joined. In how many days will the remainder of the project be completed?`
              : `Μια ομάδα ${initWorkers} εργατών είχε προγραμματίσει να τελειώσει ένα έργο σε ${initDays} ημέρες. Αφού εργάστηκαν μόνοι τους για ${doneDays} ημέρες, προστέθηκαν στην ομάδα άλλοι ${addedWorkers} εργάτες. Σε πόσες ημέρες θα παραδοθεί το υπόλοιπο του έργου;`}
          </span>
        ),
        unit: dayUnit,
        correctVal: formattedFinalDays,
        correctText: `${formattedFinalDays} ${dayUnit}`,
        tableData: [
          {
            item: locale === 'en' ? 'Remaining work' : 'Έργο που απομένει',
            formula: `${initWorkers} · (${initDays} － ${doneDays})`,
            val: `${remWork} ${locale === 'en' ? 'man-days' : 'μεροκάματα'}`
          },
          {
            item: locale === 'en' ? 'New worker count' : 'Νέος αριθμός εργατών',
            formula: `${initWorkers} ＋ ${addedWorkers}`,
            val: `${totalWorkers} ${locale === 'en' ? 'workers' : 'εργάτες'}`
          },
          {
            item: locale === 'en' ? 'Horizontal product' : 'Οριζόντιο γινόμενο',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                x ＝ <Fraction num={`${initWorkers} · ${remDays}`} den={totalWorkers} />
              </span>
            ),
            val: `${formattedFinalDays} ${dayUnit}`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Remaining work corresponds to {initWorkers} workers for {remDays} days. Total workers now: {totalWorkers}. Inversely proportional quantities: x ＝ <Fraction num={`${initWorkers} · ${remDays}`} den={totalWorkers} /> ＝ <Fraction num={remWork} den={totalWorkers} /> ＝ {formattedFinalDays} days.
              </>
            ) : (
              <>
                Το έργο που απομένει αντιστοιχεί σε {initWorkers} εργάτες για {remDays} ημέρες. Τώρα οι εργάτες έγιναν {totalWorkers}. Ποσά αντιστρόφως ανάλογα: x ＝ <Fraction num={`${initWorkers} · ${remDays}`} den={totalWorkers} /> ＝ <Fraction num={remWork} den={totalWorkers} /> ＝ {formattedFinalDays} ημέρες.
              </>
            )}
          </span>
        ),
        distractors: [
          `${finalDays + 2} ${dayUnit}`,
          `${Math.max(1, finalDays - 2)} ${dayUnit}`,
          `${finalDays + 4} ${dayUnit}`,
          `${finalDays + 1} ${dayUnit}`
        ]
      };
    }
  },
  {
    id: 'm3_hard_4',
    generate: (locale) => {
      const olivesKg = 30;
      const oilLiters = 5;
      const targetMlLiters = 9000;
      const targetLiters = 9;
      const olivesNeeded = targetLiters * (olivesKg / oilLiters);
      const formattedTargetMl = formatNum(targetMlLiters, 0, locale);
      const formattedAns = String(olivesNeeded);
      return {
        title: locale === 'en' ? 'Olive Oil Yield with ml Conversion' : 'Υπολογισμός Ελαιολάδου με Μετατροπή ml',
        prompt: (
          <span>
            {locale === 'en'
              ? `From ${olivesKg} kg of olives, ${oilLiters} l of oil are produced. How many kg of olives are required to produce ${formattedTargetMl} ml of oil of the same quality?`
              : `Από ${olivesKg} kg ελιές παράγονται ${oilLiters} l λάδι. Πόσα kg ελιές απαιτούνται για να παραχθούν ${formattedTargetMl} ml ελαιόλαδο ίδιας ποιότητας;`}
          </span>
        ),
        unit: 'kg',
        correctVal: formattedAns,
        correctText: `${formattedAns} kg`,
        tableData: [
          {
            item: locale === 'en' ? 'Convert ml to liters' : 'Μετατροπή ml σε λίτρα',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={formattedTargetMl} den="1.000" />
              </span>
            ),
            val: `${targetLiters} l`
          },
          {
            item: locale === 'en' ? 'Cross-multiplication' : 'Αναλογία (χιαστί)',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                x ＝ <Fraction num={`${olivesKg} · ${targetLiters}`} den={oilLiters} />
              </span>
            ),
            val: `${formattedAns} kg`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Convert {formattedTargetMl} ml to liters: 9 l. Directly proportional quantities. Cross-multiplication: x ＝ <Fraction num={`${olivesKg} · 9`} den={oilLiters} /> ＝ <Fraction num={olivesKg * 9} den={oilLiters} /> ＝ {formattedAns} kg olives.
              </>
            ) : (
              <>
                Μετατρέπουμε τα {formattedTargetMl} ml σε λίτρα: 9 l. Τα ποσά είναι ανάλογα. Με χιαστί: x ＝ <Fraction num={`${olivesKg} · 9`} den={oilLiters} /> ＝ <Fraction num={olivesKg * 9} den={oilLiters} /> ＝ {formattedAns} kg ελιές.
              </>
            )}
          </span>
        ),
        distractors: [
          `${olivesNeeded + 6} kg`,
          `${Math.max(10, olivesNeeded - 6)} kg`,
          `${olivesNeeded + 10} kg`,
          `${olivesNeeded + 3} kg`
        ]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale = 'el') {
  // Q1: Input - Υπολογισμός x σε Ανάλογα Ποσά (Χιαστί)
  const q1A = randInt(3, 6);
  const q1B = randInt(12, 24);
  const q1C = q1A * randInt(2, 4);
  const q1D = (q1B * q1C) / q1A;

  // Q2: MCQ - Βήματα μεθόδου των τριών (4 μοναδικές επιλογές)
  const q2CorrectSeq = locale === 'en'
    ? '1. Align data in like columns, 2. Check proportion type (direct or inverse), 3. Apply the appropriate formula'
    : '1. Κατάταξη δεδομένων σε ομώνυμες στήλες, 2. Έλεγχος είδους ποσών (ανάλογα ή αντίστροφα), 3. Επιλογή σωστού τύπου επίλυσης';
  const q2WrongCandidates = [
    locale === 'en' ? '1. Multiply all numbers, 2. Divide by 100, 3. Subtract the smallest' : '1. Πολλαπλασιασμός όλων των αριθμών, 2. Διαίρεση με το 100, 3. Αφαίρεση του μικρότερου',
    locale === 'en' ? '1. Cross-multiply blindly, 2. Add columns, 3. Invert terms' : '1. Χιαστί πολλαπλασιασμός χωρίς έλεγχο, 2. Πρόσθεση των στηλών, 3. Αντιστροφή όρων',
    locale === 'en' ? '1. Convert numbers to decimals, 2. Draw coordinate graph, 3. Measure with ruler' : '1. Μετατροπή των αριθμών σε δεκαδικούς, 2. Σχεδίαση γραφικής παράστασης, 3. Μέτρηση με χάρακα'
  ];
  const q2Options = makeUniqueOptions(q2CorrectSeq, q2WrongCandidates).map((v) => ({
    val: v,
    render: <span>{v}</span>
  }));

  // Q3: Input - Υπολογισμός x σε Αντιστρόφως Ανάλογα (Οριζόντια)
  const q3W1 = randInt(2, 5);
  const q3D1 = randInt(8, 16);
  const q3Total = q3W1 * q3D1;
  const q3W2 = randInt(6, 10);
  const q3D2 = q3Total / q3W2;
  const q3CleanD2 = Number.isInteger(q3D2) ? q3D2 : Number(q3D2.toFixed(1));

  // Q4: MCQ - Ονομασία μεθόδου (4 μοναδικές επιλογές)
  const q4CorrectReason = locale === 'en'
    ? 'Because three known terms are given to solve for the fourth unknown term'
    : 'Επειδή γνωρίζουμε 3 όρους και αναζητούμε τον 4ο άγνωστο όρο';
  const q4WrongCandidates = [
    locale === 'en' ? 'Because it strictly involves 3 different quantities' : 'Επειδή περιλαμβάνει υποχρεωτικά 3 διαφορετικά ποσά',
    locale === 'en' ? 'Because it must always be solved in 3 minutes' : 'Επειδή λύνεται πάντοτε σε 3 λεπτά',
    locale === 'en' ? 'Because it requires 3 sequential tables' : 'Επειδή χρησιμοποιεί 3 διαδοχικούς πίνακες'
  ];
  const q4Options = makeUniqueOptions(q4CorrectReason, q4WrongCandidates).map((v) => ({
    val: v,
    render: <span>{v}</span>
  }));

  // Q5: Input - Πρόβλημα Αναγωγής στη Μονάδα
  const q5Items = randInt(4, 7);
  const q5UnitPrice = randInt(3, 6);
  const q5InitialCost = q5Items * q5UnitPrice;
  const q5TargetItems = q5Items + randInt(3, 5);
  const q5ExpectedCost = q5TargetItems * q5UnitPrice;

  // Q6: MCQ - Χιαστί ή Οριζόντια (4 μοναδικές επιλογές)
  const q6CorrectDiff = locale === 'en'
    ? 'In direct proportion we cross-multiply, while in inverse proportion we multiply horizontally'
    : 'Στα ανάλογα πολλαπλασιάζουμε διαγώνια (χιαστί), ενώ στα αντιστρόφως ανάλογα πολλαπλασιάζουμε οριζόντια';
  const q6WrongCandidates = [
    locale === 'en' ? 'In direct proportion we multiply horizontally and in inverse we cross-multiply' : 'Στα ανάλογα πολλαπλασιάζουμε οριζόντια και στα αντίστροφα διαγώνια',
    locale === 'en' ? 'In both types of quantities we perform the exact same cross-multiplication' : 'Και στα δύο είδη ποσών κάνουμε ακριβώς τον ίδιο χιαστί πολλαπλασιασμό',
    locale === 'en' ? 'In direct proportion we add and in inverse we subtract' : 'Στα ανάλογα κάνουμε πρόσθεση και στα αντίστροφα αφαίρεση'
  ];
  const q6Options = makeUniqueOptions(q6CorrectDiff, q6WrongCandidates).map((v) => ({
    val: v,
    render: <span>{v}</span>
  }));

  // Q7: Standard Problem (Input)
  const spIndex1 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q7Data = STANDARD_PROBLEMS_POOL[spIndex1].generate(locale);

  // Q8: Standard Problem (MCQ - 4 μοναδικές επιλογές)
  let spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  while (spIndex2 === spIndex1) spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q8Data = STANDARD_PROBLEMS_POOL[spIndex2].generate(locale);
  const q8Options = makeUniqueOptions(q8Data.correctText, q8Data.distractors).map((v) => ({
    val: v,
    render: <span>{v}</span>
  }));

  // Q9: Hard Problem (Input)
  const hpIndex1 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q9Data = HARD_PROBLEMS_POOL[hpIndex1].generate(locale);

  // Q10: Hard Problem (MCQ - 4 μοναδικές επιλογές)
  let hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  while (hpIndex2 === hpIndex1) hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Data = HARD_PROBLEMS_POOL[hpIndex2].generate(locale);
  const q10Options = makeUniqueOptions(q10Data.correctText, q10Data.distractors).map((v) => ({
    val: v,
    render: <span>{v}</span>
  }));

  return [
    {
      id: 'q1',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Direct Proportion Solving' : 'Επίλυση Ανάλογων Ποσών',
      prompt: locale === 'en'
        ? `In direct proportion: ${q1A} kg cost ${q1B} € and ${q1C} kg cost x €. How many € is x?`
        : `Στην κατάταξη ανάλογων ποσών: ${q1A} kg κοστίζουν ${q1B} € και ${q1C} kg κοστίζουν x €. Πόσα € είναι το x;`,
      correct: String(q1D),
      explain: (
        <span className="inline-flex items-center flex-wrap leading-relaxed">
          x ＝ <Fraction num={`${q1B} · ${q1C}`} den={q1A} /> ＝ <Fraction num={q1B * q1C} den={q1A} /> ＝ {q1D} €.
        </span>
      )
    },
    {
      id: 'q2',
      type: 'mcq',
      title: locale === 'en' ? 'Steps of the Rule of Three' : 'Τα Βήματα της Μεθόδου',
      prompt: locale === 'en'
        ? 'What core steps do we follow to solve a word problem using the rule of three?'
        : 'Ποια είναι τα βασικά βήματα που ακολουθούμε για τη λύση ενός προβλήματος με τη μέθοδο των τριών;',
      options: q2Options,
      correct: q2CorrectSeq,
      explain: (
        <span className="inline-flex items-center flex-wrap leading-relaxed">
          {locale === 'en'
            ? 'First align like quantities in columns, next verify whether they vary directly or inversely, and finally execute the matching formula (cross or horizontal).'
            : 'Πρώτα κατατάσσουμε τα ομοειδή ποσά το ένα κάτω από το άλλο, μετά ελέγχουμε αν είναι ανάλογα ή αντιστρόφως ανάλογα, και τέλος επιλέγουμε τον αντίστοιχο τύπο (χιαστί ή οριζόντιο).'}
        </span>
      )
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: locale === 'en' ? 'Inverse Proportion Solving' : 'Επίλυση Αντιστρόφως Ανάλογων Ποσών',
      prompt: locale === 'en'
        ? `In inverse proportion: ${q3W1} workers need ${q3D1} days and ${q3W2} workers need x days. How many days is x?`
        : `Στην κατάταξη αντιστρόφως ανάλογων ποσών: ${q3W1} εργάτες θέλουν ${q3D1} ημέρες και ${q3W2} εργάτες θέλουν x ημέρες. Πόσες ημέρες είναι το x;`,
      correct: formatNum(q3CleanD2, 1, locale),
      explain: (
        <span className="inline-flex items-center flex-wrap leading-relaxed">
          x ＝ <Fraction num={`${q3W1} · ${q3D1}`} den={q3W2} /> ＝ <Fraction num={q3Total} den={q3W2} /> ＝ {formatNum(q3CleanD2, 1, locale)}.
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'Method Name Rationale' : 'Ονομασία της Μεθόδου',
      prompt: locale === 'en'
        ? 'Why is this mathematical method named "The Simple Rule of Three"?'
        : 'Για ποιο λόγο η μέθοδος ονομάζεται «Απλή Μέθοδος των Τριών»;',
      options: q4Options,
      correct: q4CorrectReason,
      explain: (
        <span className="inline-flex items-center flex-wrap leading-relaxed">
          {locale === 'en'
            ? 'It is called so because three known terms are given across two quantities to calculate the fourth unknown term.'
            : 'Ονομάζεται έτσι επειδή δίνονται τρεις γνωστές τιμές ανάμεσα σε δύο ποσά και ζητείται ο υπολογισμός της τέταρτης άγνωστης τιμής.'}
        </span>
      )
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Unit Rate Reduction' : 'Αναγωγή στη Μονάδα',
      prompt: locale === 'en'
        ? `If ${q5Items} items of an article cost ${q5InitialCost} €, how many € do ${q5TargetItems} identical items cost?`
        : `Αν ${q5Items} τεμάχια ενός είδους κοστίζουν ${q5InitialCost} €, πόσα € κοστίζουν ${q5TargetItems} ίδια τεμάχια;`,
      correct: String(q5ExpectedCost),
      explain: (
        <span className="inline-flex items-center flex-wrap leading-relaxed">
          1 {locale === 'en' ? 'item' : 'τεμάχιο'} ＝ <Fraction num={q5InitialCost} den={q5Items} /> ＝ {q5UnitPrice} €. {q5TargetItems} · {q5UnitPrice} ＝ {q5ExpectedCost} €.
        </span>
      )
    },
    {
      id: 'q6',
      type: 'mcq',
      title: locale === 'en' ? 'Cross vs. Horizontal Multiplication' : 'Χιαστί ή Οριζόντια;',
      prompt: locale === 'en'
        ? 'How does solving for unknown x differ in direct proportion compared to inverse proportion?'
        : 'Πώς διαφέρει ο υπολογισμός του αγνώστου x στα ανάλογα σε σχέση με τα αντιστρόφως ανάλογα ποσά;',
      options: q6Options,
      correct: q6CorrectDiff,
      explain: (
        <span className="inline-flex items-center flex-wrap leading-relaxed">
          {locale === 'en'
            ? 'In directly proportional quantities cross products are equal, whereas in inversely proportional quantities horizontal products are equal.'
            : 'Στα ανάλογα ποσά ισχύει η ισότητα των σταυρωτών γινομένων (χιαστί), ενώ στα αντιστρόφως ανάλογα ποσά ισχύει η ισότητα των οριζόντιων γινομένων (σταθερό γινόμενο).'}
        </span>
      )
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
      title: `${locale === 'en' ? 'Problem' : 'Πρόβλημα'}: ${q7Data.title}`,
      prompt: q7Data.prompt,
      correct: q7Data.correctVal,
      tableData: q7Data.tableData,
      explain: q7Data.explain
    },
    {
      id: 'q8',
      type: 'mcq',
      title: `${locale === 'en' ? 'Problem' : 'Πρόβλημα'}: ${q8Data.title}`,
      prompt: q8Data.prompt,
      options: q8Options,
      correct: q8Data.correctText,
      tableData: q8Data.tableData,
      explain: q8Data.explain
    },
    {
      id: 'q9',
      type: 'input',
      inputType: 'decimal',
      title: `${locale === 'en' ? 'Challenge Problem' : 'Σύνθετο Πρόβλημα'}: ${q9Data.title}`,
      prompt: q9Data.prompt,
      correct: q9Data.correctVal,
      tableData: q9Data.tableData,
      explain: q9Data.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `${locale === 'en' ? 'Challenge Problem' : 'Σύνθετο Πρόβλημα'}: ${q10Data.title}`,
      prompt: q10Data.prompt,
      options: q10Options,
      correct: q10Data.correctText,
      tableData: q10Data.tableData,
      explain: q10Data.explain
    }
  ];
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function MethodosTrionExercisesPage() {
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
    qList.forEach((q) => {
      initialAnswers[q.id] = '';
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
      const q = questions.find((item) => item.id === id);
      let sanitized = String(rawValue);
      if (q?.inputType === 'number') {
        sanitized = sanitized.replace(/[^0-9]/g, '');
      } else if (q?.inputType === 'decimal') {
        sanitized = sanitized.replace(/\./g, ',').replace(/[^0-9,]/g, '');
        const parts = sanitized.split(',');
        if (parts.length > 2) sanitized = parts[0] + ',' + parts.slice(1).join('');
      }
      if (sanitized.length > 10) {
        sanitized = sanitized.slice(0, 10);
      }
      setAnswers((prev) => ({ ...prev, [id]: sanitized }));
    } else {
      setAnswers((prev) => ({ ...prev, [id]: rawValue }));
    }
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/^[xyψχ][=＝]/i, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').replace(/^[xyψχ][=＝]/i, '').trim().toLowerCase();

      if (cleanUser === cleanTarget) return true;

      if (q.inputType === 'decimal') {
        const numUser = parseFloat(cleanUser.replace(',', '.'));
        const numTarget = parseFloat(cleanTarget.replace(',', '.'));
        return !isNaN(numUser) && !isNaN(numTarget) && Math.abs(numUser - numTarget) < 0.05;
      }
      return false;
    }
    if (q.type === 'mcq') {
      return userVal === q.correct;
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted || questions.length === 0) return;

    let total = 0;
    questions.forEach((q) => {
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
    (val) => val !== undefined && val !== null && String(val).trim() !== ''
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
          href="/st-dimotikou/48-methodos-trion"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0 max-w-full"
        >
          <span>📖</span>
          <span className="truncate">{toCleanUppercase(t.theoryNav)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HERO BANNER */}
        <section className="w-full min-w-0 max-w-full bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 w-full min-w-0">
            <div className="space-y-2 max-w-3xl min-w-0 w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200 max-w-full">
                <span className="break-words [overflow-wrap:anywhere]">{t.badge}</span>
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
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation max-w-full"
            >
              <span>🔄</span>
              <span className="break-words [overflow-wrap:anywhere]">{toCleanUppercase(t.newQuestions)}</span>
            </button>
          </div>
        </section>

        {/* ΦΟΡΜΑ ΜΕ ΤΙΣ 10 ΕΡΩΤΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-8 w-full min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 2xl:gap-8 w-full min-w-0">
            {questions.map((q, idx) => {
              const qNum = idx + 1;
              return (
                <div
                  key={q.id}
                  className={`p-4 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all min-w-0 w-full overflow-hidden ${getCardStyle(q)}`}
                >
                  <div className="min-w-0 w-full">
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-start gap-2 mb-3 min-w-0 w-full">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider break-words [overflow-wrap:anywhere] max-w-full">
                        {toCleanUppercase(`${t.exercise} ${qNum}: ${q.title}`)}
                      </span>
                      {submitted && (
                        <span className="text-xl shrink-0">
                          {isQuestionCorrect(q) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* PROMPT (NO-GIVEAWAY: ΜΟΝΟ ΕΚΦΩΝΗΣΗ) */}
                    <div className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-4 break-words [overflow-wrap:anywhere] min-w-0">
                      {q.prompt}
                    </div>

                    {/* INPUTS / OPTIONS */}
                    {q.type === 'mcq' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3 w-full min-w-0">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = answers[q.id] === opt.val;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={submitted}
                              onClick={() => handleAnswerChange(q.id, opt.val, 'mcq')}
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border text-center transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex items-center justify-center min-h-[48px] w-full min-w-0 ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <span className="break-words [overflow-wrap:anywhere] max-w-full">
                                {opt.render}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'input' && (
                      <div className="space-y-2 mb-3 w-full min-w-0">
                        <input
                          key={`input-${q.id}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode={q.inputType === 'decimal' ? 'decimal' : 'numeric'}
                          maxLength={10}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                          placeholder={q.inputType === 'decimal' ? t.inputPlaceholderDecimal : t.inputPlaceholderNumber}
                          aria-label={`Answer for exercise ${qNum}`}
                          className="w-full min-w-0 p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner box-border"
                        />
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3 min-w-0 w-full">
                      {q.tableData && q.tableData.length > 0 && (
                        <div className="w-full min-w-0 bg-white/90 p-2.5 rounded-2xl border border-slate-200">
                          {/* Desktop & Tablet Table */}
                          <div className="hidden sm:block overflow-x-auto w-full">
                            <table className="w-full text-xs text-left text-slate-700">
                              <thead>
                                <tr className="border-b border-slate-200 font-black text-slate-500 uppercase">
                                  <th className="p-1.5 break-words">{toCleanUppercase(t.tableHeaderElement)}</th>
                                  <th className="p-1.5 break-words">{toCleanUppercase(t.tableHeaderFormula)}</th>
                                  <th className="p-1.5 break-words">{toCleanUppercase(t.tableHeaderValue)}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-mono">
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

                          {/* Mobile Stacked Card View (<640px) */}
                          <div className="sm:hidden flex flex-col gap-2 divide-y divide-slate-100">
                            {q.tableData.map((row, rIdx) => (
                              <div key={rIdx} className="pt-2 first:pt-0 text-xs flex flex-col gap-1 min-w-0">
                                <span className="font-sans font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
                                  {row.item}
                                </span>
                                <div className="flex items-center justify-between gap-2 font-mono flex-wrap">
                                  <span className="text-indigo-700 break-words [overflow-wrap:anywhere]">
                                    {row.formula}
                                  </span>
                                  <span className="font-black text-emerald-700 shrink-0">
                                    {row.val}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed break-words [overflow-wrap:anywhere] min-w-0 ${
                          isQuestionCorrect(q)
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                            : 'bg-rose-100 text-rose-950 border border-rose-200'
                        }`}
                      >
                        <p className="font-bold mb-1">
                          {isQuestionCorrect(q) ? t.feedbackSuccess : t.feedbackReview}
                        </p>
                        <div className="min-w-0 break-words [overflow-wrap:anywhere]">{q.explain}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="flex justify-center pt-4 w-full min-w-0">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-base sm:text-lg font-black px-8 sm:px-10 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center gap-2.5 touch-manipulation max-w-full"
              >
                <span className="text-xl">🎯</span>
                <span className="break-words [overflow-wrap:anywhere]">{toCleanUppercase(t.checkBtn)}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-3 sm:px-6">
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3 w-full min-w-0`}>
          
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap justify-center sm:justify-start">
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
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation max-w-full"
              >
                <span>🔄</span>
                <span className="break-words [overflow-wrap:anywhere]">{toCleanUppercase(t.newQuestions)}</span>
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