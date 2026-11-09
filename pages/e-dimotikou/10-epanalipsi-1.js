// pages/e-dimotikou/10-epanalipsi-1.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

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

function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono leading-none select-none ${className}`}>
      <span className="text-center px-1 pb-0.5 border-b-2 border-current w-full block text-[0.9em]">
        {num}
      </span>
      <span className="text-center px-1 pt-0.5 w-full block text-[0.9em]">
        {den}
      </span>
    </span>
  );
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return (a * b) / gcd(a, b);
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const TRANSLATIONS = {
  el: {
    metaTitle: "1ο Επαναληπτικό Τεστ (Κεφ. 1-9) - Ε' Δημοτικού | LearnMaths.gr",
    metaDesc: "Μεγάλο επαναληπτικό διαγώνισμα 18 ερωτήσεων στα κλάσματα, πολλαπλάσια, διαιρέτες, ΕΚΠ, ΜΚΔ και κριτήρια διαιρετότητας για την Ε' Δημοτικού.",
    backText: "Ε' Δημοτικού",
    headerBadge: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΠΑΝΑΛΗΨΗ 1",
    mainTitle: "🏆 1ο Επαναληπτικό Τεστ: Κεφάλαια 1 έως 9",
    mainSubtitle: "18 απαιτητικές ερωτήσεις (2 από κάθε ενότητα) επιλεγμένες τυχαία από τη δεξαμενή ασκήσεων!",
    newTestBtn: "Νέο Τεστ",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRateLabel: "Επιτυχία:",
    fillPromptBottom: "Απάντησε σε όλες τις ερωτήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctAnswerPrefix: "Η σωστή απάντηση είναι:",
    lcmSymbol: "ΕΚΠ",
    gcdSymbol: "ΜΚΔ",
    divisorsSymbol: "Δ",
    multiplesSymbol: "Π"
  },
  en: {
    metaTitle: "1st Revision Test (Ch. 1-9) - 5th Grade | LearnMaths.gr",
    metaDesc: "Comprehensive revision test with 18 questions covering fractions, multiples, divisors, LCM, GCD, and divisibility rules for 5th Grade.",
    backText: "5th Grade",
    headerBadge: "5TH GRADE • REVISION 1",
    mainTitle: "🏆 1st Revision Test: Chapters 1 to 9",
    mainSubtitle: "18 challenging questions (2 from each unit) randomly selected from the exercise bank!",
    newTestBtn: "New Test",
    submitBtn: "Check Answers",
    scoreLabel: "Score:",
    successRateLabel: "Success:",
    fillPromptBottom: "Answer all questions and click \"Check Answers\"!",
    correctAnswerPrefix: "The correct answer is:",
    lcmSymbol: "LCM",
    gcdSymbol: "GCD",
    divisorsSymbol: "D",
    multiplesSymbol: "M"
  }
};

// --- ΔΕΞΑΜΕΝΕΣ ΕΡΩΤΗΣΕΩΝ ΑΝΑ ΚΕΦΑΛΑΙΟ (el / en) --- //

// ΚΕΦΑΛΑΙΟ 1: Η Έννοια του Κλάσματος
const poolCh1 = [
  (loc) => {
    const den = [5, 6, 8, 10][getRandomInt(0, 3)];
    const num = getRandomInt(2, den - 1);
    const step = getRandomInt(6, 12);
    const total = den * step;
    const spent = num * step;
    const rem = total - spent;
    return {
      title: loc === 'el' ? 'ΚΕΦ. 1 • ΜΕΡΟΣ ΣΥΝΟΛΟΥ & ΥΠΟΛΟΙΠΟ' : 'CH. 1 • FRACTION OF SET & REMAINDER',
      type: 'input',
      correct: rem,
      unit: loc === 'el' ? 'τριαντάφυλλα' : 'roses',
      promptNode: (
        <span className="inline leading-relaxed">
          {loc === 'el' ? `Ένα ανθοπωλείο παρέλαβε ${total} τριαντάφυλλα. Πούλησε τα ` : `A florist received ${total} roses and sold `}
          <Fraction num={num} den={den} />
          {loc === 'el' ? ' των τριαντάφυλλων. Πόσα τριαντάφυλλα έμειναν απούλητα;' : ' of them. How many roses remained unsold?'}
        </span>
      ),
      explanation: (
        <span className="inline font-mono leading-relaxed">
          {loc === 'el' ? 'Το ' : 'The '}
          <Fraction num={1} den={den} />
          {loc === 'el' ? ` είναι: ${total} ： ${den} ＝ ${step}. Τα ` : ` is: ${total} ： ${den} ＝ ${step}. The `}
          <Fraction num={num} den={den} />
          {loc === 'el' ? ` είναι: ${step} · ${num} ＝ ${spent}. Απομένουν: ${total} － ${spent} ＝ ${rem}.` : ` is: ${step} · ${num} ＝ ${spent}. Remaining: ${total} － ${spent} ＝ ${rem}.`}
        </span>
      )
    };
  },
  (loc) => {
    const den = [4, 7, 9, 12][getRandomInt(0, 3)];
    const num = getRandomInt(2, den - 1);
    const step = getRandomInt(8, 15);
    const part = num * step;
    const total = den * step;
    return {
      title: loc === 'el' ? 'ΚΕΦ. 1 • ΑΝΑΣΤΡΟΦΟΣ ΥΠΟΛΟΓΙΣΜΟΣ' : 'CH. 1 • REVERSE FRACTION CALCULATION',
      type: 'input',
      correct: total,
      unit: loc === 'el' ? 'σελίδες' : 'pages',
      promptNode: (
        <span className="inline leading-relaxed">
          {loc === 'el' ? 'Ο Νίκος διάβασε τα ' : 'Nikos read '}
          <Fraction num={num} den={den} />
          {loc === 'el' ? ` ενός βιβλίου, δηλαδή ακριβώς ${part} σελίδες. Πόσες σελίδες έχει ολόκληρο το βιβλίο;` : ` of a book, which is exactly ${part} pages. How many pages does the whole book have?`}
        </span>
      ),
      explanation: (
        <span className="inline font-mono leading-relaxed">
          {loc === 'el' ? 'Το ' : 'The '}
          <Fraction num={1} den={den} />
          {loc === 'el' ? ` είναι: ${part} ： ${num} ＝ ${step} σελίδες. Ολόκληρο το βιβλίο (` : ` is: ${part} ： ${num} ＝ ${step} pages. The entire book (`}
          <Fraction num={den} den={den} />
          {loc === 'el' ? `) έχει: ${step} · ${den} ＝ ${total} σελίδες.` : `) has: ${step} · ${den} ＝ ${total} pages.`}
        </span>
      )
    };
  },
  (loc) => {
    const den = [3, 4, 5, 7, 8][getRandomInt(0, 4)];
    const whole = getRandomInt(3, 6);
    const rem = getRandomInt(1, den - 1);
    const num = whole * den + rem;
    return {
      title: loc === 'el' ? 'ΚΕΦ. 1 • ΚΑΤΑΧΡΗΣΤΙΚΟ ΣΕ ΜΕΙΚΤΟ' : 'CH. 1 • IMPROPER FRACTION TO MIXED',
      type: 'input',
      correct: whole,
      unit: loc === 'el' ? 'ακέραιες μονάδες' : 'whole units',
      promptNode: (
        <span className="inline leading-relaxed">
          {loc === 'el' ? 'Γράψε το καταχρηστικό κλάσμα ' : 'Convert the improper fraction '}
          <Fraction num={num} den={den} />
          {loc === 'el' ? ' ως μεικτό αριθμό. Πόσες είναι οι ακέραιες μονάδες του;' : ' into a mixed number. What is its whole number part?'}
        </span>
      ),
      explanation: (
        <span className="inline font-mono leading-relaxed">
          {loc === 'el' ? `Εκτελούμε τη διαίρεση ${num} ： ${den} ＝ ${whole} (υπόλοιπο ${rem}). Άρα ο μεικτός αριθμός έχει ${whole} ακέραιες μονάδες.` : `Dividing ${num} ： ${den} ＝ ${whole} (remainder ${rem}). Hence, the mixed number has ${whole} whole units.`}
        </span>
      )
    };
  },
  (loc) => {
    const den = [6, 8, 9, 11][getRandomInt(0, 3)];
    const targetWhole = getRandomInt(2, 4);
    const missing = getRandomInt(2, den - 2);
    const currentNum = targetWhole * den - missing;
    const distractors = [missing + 1, Math.max(1, missing - 1), den - missing].filter((d) => d !== missing);
    const rawOptions = [missing, ...distractors];
    const uniqueOptions = [...new Set(rawOptions.map(String))].slice(0, 4);
    return {
      title: loc === 'el' ? 'ΚΕΦ. 1 • ΣΥΜΠΛΗΡΩΣΗ ΑΚΕΡΑΙΟΥ' : 'CH. 1 • COMPLETING TO WHOLE NUMBER',
      type: 'mcq',
      correct: String(missing),
      options: shuffleArray(uniqueOptions),
      promptNode: (
        <span className="inline leading-relaxed">
          {loc === 'el' ? 'Έχουμε το κλάσμα ' : 'Given the fraction '}
          <Fraction num={currentNum} den={den} />
          {loc === 'el' ? '. Πόσα μέρη (κλάσματα ' : '. How many unit fractions '}
          <Fraction num={1} den={den} />
          {loc === 'el' ? `) λείπουν για να συμπληρωθεί ακριβώς ο ακέραιος ${targetWhole};` : `) are missing to complete exactly the whole number ${targetWhole}?`}
        </span>
      ),
      explanation: (
        <span className="inline font-mono leading-relaxed">
          {loc === 'el' ? `Ο ακέραιος ${targetWhole} γράφεται ως ` : `The whole number ${targetWhole} is written as `}
          <Fraction num={targetWhole * den} den={den} />
          {loc === 'el' ? `. Λείπουν: ${targetWhole * den} － ${currentNum} ＝ ${missing} μέρη.` : `. Missing: ${targetWhole * den} － ${currentNum} ＝ ${missing} parts.`}
        </span>
      )
    };
  }
];

// ΚΕΦΑΛΑΙΟ 2: Ισοδύναμα Κλάσματα
const poolCh2 = [
  (loc) => {
    const [num, den] = [[2, 3], [3, 4], [3, 5], [4, 7], [5, 6]][getRandomInt(0, 4)];
    const k = getRandomInt(4, 8);
    return {
      title: loc === 'el' ? 'ΚΕΦ. 2 • ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ ΑΡΙΘΜΗΤΗ' : 'CH. 2 • FIND MISSING NUMERATOR',
      type: 'input',
      correct: num * k,
      unit: loc === 'el' ? 'τιμή x' : 'value x',
      promptNode: (
        <span className="inline leading-relaxed">
          {loc === 'el' ? 'Αν ισχύει ' : 'If '}
          <span className="whitespace-nowrap inline-flex items-center">
            <Fraction num={num} den={den} /> ＝ <Fraction num="x" den={den * k} />
          </span>
          {loc === 'el' ? ', ποιος αριθμός είναι το x;' : ', what is the value of x?'}
        </span>
      ),
      explanation: (
        <span className="inline font-mono leading-relaxed">
          {loc === 'el' ? `Ο παρονομαστής πολλαπλασιάστηκε με το ${k}. Άρα και ο αριθμητής: x ＝ ${num} · ${k} ＝ ${num * k}.` : `The denominator is multiplied by ${k}. Thus the numerator: x ＝ ${num} · ${k} ＝ ${num * k}.`}
        </span>
      )
    };
  },
  (loc) => {
    const [num, den] = [[3, 8], [4, 9], [5, 7], [6, 11]][getRandomInt(0, 3)];
    const m = getRandomInt(3, 7);
    return {
      title: loc === 'el' ? 'ΚΕΦ. 2 • ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ ΠΑΡΟΝΟΜΑΣΤΗ' : 'CH. 2 • FIND MISSING DENOMINATOR',
      type: 'input',
      correct: den * m,
      unit: loc === 'el' ? 'τιμή y' : 'value y',
      promptNode: (
        <span className="inline leading-relaxed">
          {loc === 'el' ? 'Αν ισχύει ' : 'If '}
          <span className="whitespace-nowrap inline-flex items-center">
            <Fraction num={num} den={den} /> ＝ <Fraction num={num * m} den="y" />
          </span>
          {loc === 'el' ? ', ποιος αριθμός είναι το y;' : ', what is the value of y?'}
        </span>
      ),
      explanation: (
        <span className="inline font-mono leading-relaxed">
          {loc === 'el' ? `Ο αριθμητής πολλαπλασιάστηκε με το ${m}. Άρα και ο παρονομαστής: y ＝ ${den} · ${m} ＝ ${den * m}.` : `The numerator is multiplied by ${m}. Thus the denominator: y ＝ ${den} · ${m} ＝ ${den * m}.`}
        </span>
      )
    };
  },
  (loc) => {
    const correct = '18/30';
    const rawOptions = [correct, '15/20', '12/25', '16/30'];
    const uniqueOptions = [...new Set(rawOptions)];
    return {
      title: loc === 'el' ? 'ΚΕΦ. 2 • ΑΝΑΓΝΩΡΙΣΗ ΙΣΟΔΥΝΑΜΟΥ' : 'CH. 2 • EQUIVALENT FRACTION IDENTIFICATION',
      type: 'mcq',
      correct,
      options: shuffleArray(uniqueOptions),
      promptNode: (
        <span className="inline leading-relaxed">
          {loc === 'el' ? 'Ποιο από τα παρακάτω κλάσματα είναι ισοδύναμο με το ' : 'Which of the following fractions is equivalent to '}
          <Fraction num="3" den="5" />
          <span>;</span>
        </span>
      ),
      explanation: (
        <span className="inline font-mono leading-relaxed">
          {loc === 'el' ? 'Πολλαπλασιάζοντας και τους δύο όρους με το 6: ' : 'Multiplying both terms by 6: '}
          <span className="whitespace-nowrap inline-flex items-center">
            <Fraction num="3" den="5" /> ＝ <Fraction num="3 · 6" den="5 · 6" /> ＝ <Fraction num="18" den="30" />
          </span>
        </span>
      )
    };
  }
];

// ΚΕΦΑΛΑΙΟ 3: Απλοποίηση Κλάσματος & Ανάγωγη Μορφή
const poolCh3 = [
  (loc) => {
    const num = 18;
    const den = 24;
    const d = gcd(num, den);
    return {
      title: loc === 'el' ? 'ΚΕΦ. 3 • ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ (ΑΡΙΘΜΗΤΗΣ)' : 'CH. 3 • IRREDUCIBLE FRACTION (NUMERATOR)',
      type: 'input',
      correct: num / d,
      unit: loc === 'el' ? 'αριθμητής' : 'numerator',
      promptNode: (
        <span className="inline leading-relaxed">
          {loc === 'el' ? 'Απλοποίησε πλήρως το κλάσμα ' : 'Fully simplify the fraction '}
          <Fraction num={num} den={den} />
          {loc === 'el' ? ' στην ανάγωγη μορφή του. Ποιος είναι ο νέος αριθμητής;' : ' to lowest terms. What is the new numerator?'}
        </span>
      ),
      explanation: (
        <span className="inline font-mono leading-relaxed">
          {loc === 'el' ? `Ο ΜΚΔ(${num}, ${den}) είναι το ${d}. ` : `The GCD(${num}, ${den}) is ${d}. `}
          <span className="whitespace-nowrap inline-flex items-center">
            <Fraction num={num} den={den} /> ＝ <Fraction num={`${num} : ${d}`} den={`${den} : ${d}`} /> ＝ <Fraction num={num / d} den={den / d} />
          </span>
          {loc === 'el' ? ` (νέος αριθμητής: ${num / d}).` : ` (new numerator: ${num / d}).`}
        </span>
      )
    };
  },
  (loc) => {
    const num = 24;
    const den = 36;
    const d = gcd(num, den);
    return {
      title: loc === 'el' ? 'ΚΕΦ. 3 • ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ (ΠΑΡΟΝΟΜΑΣΤΗΣ)' : 'CH. 3 • IRREDUCIBLE FRACTION (DENOMINATOR)',
      type: 'input',
      correct: den / d,
      unit: loc === 'el' ? 'παρονομαστής' : 'denominator',
      promptNode: (
        <span className="inline leading-relaxed">
          {loc === 'el' ? 'Απλοποίησε πλήρως το κλάσμα ' : 'Fully simplify the fraction '}
          <Fraction num={num} den={den} />
          {loc === 'el' ? ' στην ανάγωγη μορφή του. Ποιος είναι ο νέος παρονομαστής;' : ' to lowest terms. What is the new denominator?'}
        </span>
      ),
      explanation: (
        <span className="inline font-mono leading-relaxed">
          {loc === 'el' ? `Ο ΜΚΔ(${num}, ${den}) είναι το ${d}. ` : `The GCD(${num}, ${den}) is ${d}. `}
          <span className="whitespace-nowrap inline-flex items-center">
            <Fraction num={num} den={den} /> ＝ <Fraction num={`${num} : ${d}`} den={`${den} : ${d}`} /> ＝ <Fraction num={num / d} den={den / d} />
          </span>
          {loc === 'el' ? ` (νέος παρονομαστής: ${den / d}).` : ` (new denominator: ${den / d}).`}
        </span>
      )
    };
  },
  (loc) => {
    const chosen = '7/15';
    const reds = ['6/18', '14/21', '15/25', '12/28'];
    const rawOptions = [chosen, ...reds.slice(0, 3)];
    const uniqueOptions = [...new Set(rawOptions)];
    return {
      title: loc === 'el' ? 'ΚΕΦ. 3 • ΑΝΑΓΝΩΡΙΣΗ ΑΝΑΓΩΓΟΥ' : 'CH. 3 • IDENTIFY IRREDUCIBLE FRACTION',
      type: 'mcq',
      correct: chosen,
      options: shuffleArray(uniqueOptions),
      promptNode: (
        <span className="inline leading-relaxed">
          {loc === 'el' ? 'Ποιο από τα παρακάτω κλάσματα είναι ΑΝΑΓΩΓΟ;' : 'Which of the following fractions is in IRREDUCIBLE form?'}
        </span>
      ),
      explanation: (
        <span className="inline font-mono leading-relaxed">
          {loc === 'el' ? `Το ${chosen} είναι ανάγωγο γιατί ο αριθμητής (7) και ο παρονομαστής (15) έχουν ΜΚΔ ＝ 1.` : `The fraction ${chosen} is irreducible because 7 and 15 have GCD ＝ 1.`}
        </span>
      )
    };
  }
];

// ΚΕΦΑΛΑΙΟ 4: Αναγωγή στην Κλασματική Μονάδα
const poolCh4 = [
  (loc) => {
    const num = 3;
    const den = 5;
    const unit = 24;
    const known = num * unit;
    return {
      title: loc === 'el' ? 'ΚΕΦ. 4 • ΚΛΑΣΜΑΤΙΚΗ ΜΟΝΑΔΑ' : 'CH. 4 • FRACTIONAL UNIT',
      type: 'input',
      correct: unit,
      unit: '€',
      promptNode: (
        <span className="inline leading-relaxed">
          {loc === 'el' ? 'Αν τα ' : 'If '}
          <Fraction num={num} den={den} />
          {loc === 'el' ? ` ενός ποσού κοστίζουν ${known} €, πόσο κοστίζει το ` : ` of an amount costs ${known} €, how much does `}
          <Fraction num={1} den={den} />
          <span>;</span>
        </span>
      ),
      explanation: (
        <span className="inline font-mono leading-relaxed">
          {loc === 'el' ? `Διαιρούμε με τον αριθμητή: ${known} ： ${num} ＝ ${unit} €.` : `Divide by the numerator: ${known} ： ${num} ＝ ${unit} €.`}
        </span>
      )
    };
  },
  (loc) => {
    const num = 4;
    const den = 7;
    const unit = 15;
    const known = num * unit;
    const total = den * unit;
    return {
      title: loc === 'el' ? 'ΚΕΦ. 4 • ΕΥΡΕΣΗ ΤΟΥ ΟΛΟΥ' : 'CH. 4 • FINDING THE WHOLE',
      type: 'input',
      correct: total,
      unit: '€',
      promptNode: (
        <span className="inline leading-relaxed">
          {loc === 'el' ? 'Αν τα ' : 'If '}
          <Fraction num={num} den={den} />
          {loc === 'el' ? ` ενός ποδηλάτου κοστίζουν ${known} €, πόσο κοστίζει ολόκληρο το ποδήλατο;` : ` of a bicycle costs ${known} €, what is the total price of the bicycle?`}
        </span>
      ),
      explanation: (
        <span className="inline font-mono leading-relaxed">
          {loc === 'el' ? 'Το ' : 'The '}
          <Fraction num={1} den={den} />
          {loc === 'el' ? ` είναι: ${known} ： ${num} ＝ ${unit} €. Ολόκληρο: ` : ` is: ${known} ： ${num} ＝ ${unit} €. Total: `}
          <Fraction num={den} den={den} />
          {loc === 'el' ? ` ＝ ${unit} · ${den} ＝ ${total} €.` : ` ＝ ${unit} · ${den} ＝ ${total} €.`}
        </span>
      )
    };
  }
];

// ΚΕΦΑΛΑΙΟ 5: Πολλαπλάσια ενός Αριθμού
const poolCh5 = [
  (loc) => {
    const base = 7;
    const threshold = 52;
    const correct = 56;
    return {
      title: loc === 'el' ? 'ΚΕΦ. 5 • ΕΠΟΜΕΝΟ ΠΟΛΛΑΠΛΑΣΙΟ' : 'CH. 5 • NEXT MULTIPLE',
      type: 'input',
      correct,
      unit: loc === 'el' ? 'αριθμός' : 'number',
      promptNode: (
        <span className="inline leading-relaxed">
          {loc === 'el' ? `Ποιο είναι το μικρότερο πολλαπλάσιο του ${base} που είναι μεγαλύτερο από το ${threshold};` : `What is the smallest multiple of ${base} that is greater than ${threshold}?`}
        </span>
      ),
      explanation: (
        <span className="inline font-mono leading-relaxed">
          {loc === 'el' ? `52 ： 7 ＝ 7 υπ. 3. Το αμέσως επόμενο πολλαπλάσιο είναι 7 · 8 ＝ ${correct}.` : `52 ： 7 ＝ 7 rem. 3. The next multiple is 7 · 8 ＝ ${correct}.`}
        </span>
      )
    };
  },
  (loc) => {
    const correct = '91';
    const rawOptions = [correct, '88', '93', '95'];
    const uniqueOptions = [...new Set(rawOptions)];
    return {
      title: loc === 'el' ? 'ΚΕΦ. 5 • ΕΛΕΓΧΟΣ ΠΟΛΛΑΠΛΑΣΙΟΥ' : 'CH. 5 • MULTIPLE CHECK',
      type: 'mcq',
      correct,
      options: shuffleArray(uniqueOptions),
      promptNode: (
        <span className="inline leading-relaxed">
          {loc === 'el' ? 'Ποιος από τους παρακάτω αριθμούς είναι πολλαπλάσιο του 7;' : 'Which of the following numbers is a multiple of 7?'}
        </span>
      ),
      explanation: (
        <span className="inline font-mono leading-relaxed">
          <span className="whitespace-nowrap inline-flex items-center">
            <Fraction num={91} den={7} /> ＝ 13
          </span>
          {loc === 'el' ? ' (υπόλοιπο 0). Οι υπόλοιποι αφήνουν υπόλοιπο.' : ' (remainder 0). The other numbers leave a non-zero remainder.'}
        </span>
      )
    };
  }
];

// ΚΕΦΑΛΑΙΟ 6: Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ)
const poolCh6 = [
  (loc) => {
    const sym = loc === 'el' ? 'ΕΚΠ' : 'LCM';
    return {
      title: loc === 'el' ? 'ΚΕΦ. 6 • ΕΚΠ ΔΥΟ ΑΡΙΘΜΩΝ' : 'CH. 6 • LCM OF TWO NUMBERS',
      type: 'input',
      correct: 36,
      unit: loc === 'el' ? 'αριθμός' : 'number',
      promptNode: (
        <span className="inline leading-relaxed">
          {loc === 'el' ? `Υπολόγισε το ${sym}(12, 18):` : `Calculate ${sym}(12, 18):`}
        </span>
      ),
      explanation: (
        <span className="inline font-mono leading-relaxed">
          {loc === 'el' ? `Τα πολλαπλάσια συναντώνται στο 36. Άρα ${sym}(12, 18) ＝ 36.` : `The multiples meet first at 36. Thus ${sym}(12, 18) ＝ 36.`}
        </span>
      )
    };
  },
  (loc) => {
    const sym = loc === 'el' ? 'ΕΚΠ' : 'LCM';
    return {
      title: loc === 'el' ? 'ΚΕΦ. 6 • ΚΟΙΝΟΣ ΠΑΡΟΝΟΜΑΣΤΗΣ' : 'CH. 6 • COMMON DENOMINATOR',
      type: 'input',
      correct: 24,
      unit: loc === 'el' ? 'ΕΚΠ παρονομαστών' : 'LCM of denominators',
      promptNode: (
        <span className="inline leading-relaxed">
          {loc === 'el' ? 'Ποιος είναι ο μικρότερος κοινός παρονομαστής για τα κλάσματα ' : 'What is the lowest common denominator for the fractions '}
          <Fraction num="5" den="6" />
          {loc === 'el' ? ' και ' : ' and '}
          <Fraction num="3" den="8" />
          <span>;</span>
        </span>
      ),
      explanation: (
        <span className="inline font-mono leading-relaxed">
          {loc === 'el' ? `Βρίσκουμε το ΕΚΠ των παρονομαστών: ${sym}(6, 8) ＝ 24.` : `Find the LCM of denominators: ${sym}(6, 8) ＝ 24.`}
        </span>
      )
    };
  }
];

// ΚΕΦΑΛΑΙΟ 7: Διαιρέτες ενός Αριθμού
const poolCh7 = [
  (loc) => {
    const sym = loc === 'el' ? 'Δ' : 'D';
    return {
      title: loc === 'el' ? 'ΚΕΦ. 7 • ΠΛΗΘΟΣ ΔΙΑΙΡΕΤΩΝ' : 'CH. 7 • NUMBER OF DIVISORS',
      type: 'input',
      correct: 6,
      unit: loc === 'el' ? 'διαιρέτες' : 'divisors',
      promptNode: (
        <span className="inline leading-relaxed">
          {loc === 'el' ? 'Πόσους διαιρέτες έχει συνολικά ο αριθμός 18;' : 'How many divisors does the number 18 have in total?'}
        </span>
      ),
      explanation: (
        <span className="inline font-mono leading-relaxed">
          {loc === 'el' ? `${sym}(18) ＝ {1, 2, 3, 6, 9, 18}, δηλαδή 6 διαιρέτες.` : `${sym}(18) ＝ {1, 2, 3, 6, 9, 18}, exactly 6 divisors.`}
        </span>
      )
    };
  },
  (loc) => {
    const rawOptions = ['29', '21', '25', '27'];
    const uniqueOptions = [...new Set(rawOptions)];
    return {
      title: loc === 'el' ? 'ΚΕΦ. 7 • ΠΡΩΤΟΣ ΑΡΙΘΜΟΣ' : 'CH. 7 • PRIME NUMBER',
      type: 'mcq',
      correct: '29',
      options: shuffleArray(uniqueOptions),
      promptNode: (
        <span className="inline leading-relaxed">
          {loc === 'el' ? 'Ποιος από τους παρακάτω αριθμούς είναι ΠΡΩΤΟΣ;' : 'Which of the following numbers is PRIME?'}
        </span>
      ),
      explanation: (
        <span className="inline font-mono leading-relaxed">
          {loc === 'el' ? 'Το 29 διαιρείται μόνο με το 1 και το 29.' : 'The number 29 is only divisible by 1 and itself.'}
        </span>
      )
    };
  }
];

// ΚΕΦΑΛΑΙΟ 8: Μέγιστος Κοινός Διαιρέτης (ΜΚΔ)
const poolCh8 = [
  (loc) => {
    const sym = loc === 'el' ? 'ΜΚΔ' : 'GCD';
    return {
      title: loc === 'el' ? 'ΚΕΦ. 8 • ΜΚΔ ΔΥΟ ΑΡΙΘΜΩΝ' : 'CH. 8 • GCD OF TWO NUMBERS',
      type: 'input',
      correct: 6,
      unit: loc === 'el' ? 'αριθμός' : 'number',
      promptNode: (
        <span className="inline leading-relaxed">
          {loc === 'el' ? `Υπολόγισε τον ${sym}(24, 30):` : `Calculate ${sym}(24, 30):`}
        </span>
      ),
      explanation: (
        <span className="inline font-mono leading-relaxed">
          {loc === 'el' ? `Κοινοί διαιρέτες των 24 και 30 είναι {1, 2, 3, 6}. Μέγιστος: 6.` : `Common divisors of 24 and 30 are {1, 2, 3, 6}. Greatest: 6.`}
        </span>
      )
    };
  },
  (loc) => {
    const sym = loc === 'el' ? 'ΜΚΔ' : 'GCD';
    const andW = loc === 'el' ? 'και' : 'and';
    const correctPair = `14 ${andW} 25`;
    const rawOptions = [correctPair, `18 ${andW} 27`, `15 ${andW} 35`, `24 ${andW} 32`];
    const uniqueOptions = [...new Set(rawOptions)];
    return {
      title: loc === 'el' ? 'ΚΕΦ. 8 • ΠΡΩΤΟΙ ΜΕΤΑΞΥ ΤΟΥΣ' : 'CH. 8 • RELATIVELY PRIME NUMBERS',
      type: 'mcq',
      correct: correctPair,
      options: shuffleArray(uniqueOptions),
      promptNode: (
        <span className="inline leading-relaxed">
          {loc === 'el' ? `Ποιο από τα παρακάτω ζευγάρια αποτελείται από αριθμούς πρώτους μεταξύ τους (${sym} ＝ 1);` : `Which of the following pairs consists of relatively prime numbers (${sym} ＝ 1)?`}
        </span>
      ),
      explanation: (
        <span className="inline font-mono leading-relaxed">
          {loc === 'el' ? `Το 14 και το 25 έχουν μοναδικό κοινό διαιρέτη το 1 (${sym} ＝ 1).` : `14 and 25 share only 1 as a common divisor (${sym} ＝ 1).`}
        </span>
      )
    };
  }
];

// ΚΕΦΑΛΑΙΟ 9: Κριτήρια Διαιρετότητας
const poolCh9 = [
  (loc) => {
    const formattedNumStr = loc === 'el' ? '3.4x4' : '3,4x4';
    return {
      title: loc === 'el' ? 'ΚΕΦ. 9 • ΑΓΝΩΣΤΟ ΨΗΦΙΟ (ΔΙΑΙΡΕΣΗ ΜΕ 9)' : 'CH. 9 • MISSING DIGIT (DIVISIBILITY BY 9)',
      type: 'input',
      correct: 7,
      unit: loc === 'el' ? 'ψηφίο x' : 'digit x',
      promptNode: (
        <span className="inline leading-relaxed">
          {loc === 'el' ? `Στον τετραψήφιο ${formattedNumStr}, ποιο ψηφίο πρέπει να είναι το x ώστε να διαιρείται ακριβώς με το 9;` : `In the four-digit number ${formattedNumStr}, which digit must x be so that it is divisible by 9?`}
        </span>
      ),
      explanation: (
        <span className="inline font-mono leading-relaxed">
          {loc === 'el' ? '3 ＋ 4 ＋ x ＋ 4 ＝ 11 ＋ x. Το επόμενο πολλαπλάσιο του 9 είναι 18, άρα x ＝ 18 － 11 ＝ 7 και ' : '3 ＋ 4 ＋ x ＋ 4 ＝ 11 ＋ x. Next multiple of 9 is 18, so x ＝ 18 － 11 ＝ 7 and '}
          <span className="whitespace-nowrap inline-flex items-center">
            <Fraction num="18" den="9" /> ＝ 2
          </span>.
        </span>
      )
    };
  },
  (loc) => {
    const rawOptions = ['528', '522', '526', '530'];
    const uniqueOptions = [...new Set(rawOptions)];
    return {
      title: loc === 'el' ? 'ΚΕΦ. 9 • ΚΡΙΤΗΡΙΟ ΤΟΥ 4' : 'CH. 9 • RULE FOR 4',
      type: 'mcq',
      correct: '528',
      options: shuffleArray(uniqueOptions),
      promptNode: (
        <span className="inline leading-relaxed">
          {loc === 'el' ? 'Ποιος από τους παρακάτω αριθμούς διαιρείται ακριβώς με το 4;' : 'Which of the following numbers is divisible by 4?'}
        </span>
      ),
      explanation: (
        <span className="inline font-mono leading-relaxed">
          {loc === 'el' ? 'Τα δύο τελευταία ψηφία 28 διαιρούνται με το 4: ' : 'The last two digits 28 are divisible by 4: '}
          <span className="whitespace-nowrap inline-flex items-center">
            <Fraction num="28" den="4" /> ＝ 7
          </span>.
        </span>
      )
    };
  }
];

function pickTwoFromPool(pool, locale) {
  const shuffled = shuffleArray(pool);
  return [shuffled[0](locale), shuffled[1](locale)];
}

function generateRevisionQuiz(locale = 'el') {
  const allPools = [
    poolCh1, poolCh2, poolCh3, poolCh4, poolCh5, poolCh6, poolCh7, poolCh8, poolCh9
  ];

  const questions = [];
  allPools.forEach((pool, chIdx) => {
    const [qA, qB] = pickTwoFromPool(pool, locale);
    questions.push({ ...qA, id: `q${chIdx * 2 + 1}`, chapterNum: chIdx + 1 });
    questions.push({ ...qB, id: `q${chIdx * 2 + 2}`, chapterNum: chIdx + 1 });
  });

  return questions;
}

export default function EpanalipsiOnePage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewTest = () => {
    const qList = generateRevisionQuiz(locale);
    setQuestions(qList);

    const initialAnswers = {};
    qList.forEach((q) => {
      initialAnswers[q.id] = '';
    });
    setAnswers(initialAnswers);
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewTest();
  }, [locale]);

  if (!questions) return null;

  const handleInputChange = (id, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [id]: val }));
  };

  const handleNumericInput = (id, rawVal) => {
    if (submitted) return;
    const clean = rawVal.replace(/[^0-9]/g, '').slice(0, 10);
    setAnswers((prev) => ({ ...prev, [id]: clean }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;
    questions.forEach((q) => {
      if (q.type === 'input') {
        if (parseInt(answers[q.id], 10) === q.correct) {
          currentScore += 1;
        }
      } else if (q.type === 'mcq') {
        if (answers[q.id] === q.correct) {
          currentScore += 1;
        }
      }
    });

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Component για Ερώτηση MCQ
  const renderMCQ = (q, index) => {
    const isCorrect = answers[q.id] === q.correct;
    return (
      <div
        key={q.id}
        className={`bg-white p-5 sm:p-7 2xl:p-9 rounded-3xl shadow-sm border transition-all min-w-0 ${
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-400 bg-rose-50/20'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-indigo-600 text-white font-black text-xs sm:text-sm 2xl:text-base w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {index + 1}
          </span>
          <div className="space-y-1 min-w-0">
            <span className="text-[11px] 2xl:text-xs font-black tracking-wider text-slate-400 block">
              {toCleanUppercase(q.title)}
            </span>
            <div className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug break-words [overflow-wrap:anywhere]">
              {q.promptNode}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11 2xl:pl-13">
          {q.options.map((opt, optIdx) => {
            const isSelected = answers[q.id] === opt;
            return (
              <label
                key={optIdx}
                className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition select-none text-sm sm:text-base 2xl:text-lg font-mono font-bold ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                } ${submitted ? 'cursor-default pointer-events-none' : ''}`}
              >
                <input
                  type="radio"
                  id={`${q.id}-opt-${optIdx}`}
                  name={q.id}
                  value={opt}
                  checked={isSelected}
                  onChange={() => handleInputChange(q.id, opt)}
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
                {q.explanation}
              </div>
            ) : (
              <div className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                {t.correctAnswerPrefix} <strong className="font-bold text-rose-950">{q.correct}</strong>. {q.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Component για Ερώτηση Input
  const renderInput = (q, index) => {
    const isCorrect = parseInt(answers[q.id], 10) === q.correct;
    return (
      <div
        key={q.id}
        className={`bg-white p-5 sm:p-7 2xl:p-9 rounded-3xl shadow-sm border transition-all min-w-0 ${
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-400 bg-rose-50/20'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-blue-600 text-white font-black text-xs sm:text-sm 2xl:text-base w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {index + 1}
          </span>
          <div className="space-y-1 min-w-0">
            <span className="text-[11px] 2xl:text-xs font-black tracking-wider text-slate-400 block">
              {toCleanUppercase(q.title)}
            </span>
            <div className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug break-words [overflow-wrap:anywhere]">
              {q.promptNode}
            </div>
          </div>
        </div>

        <div className="sm:pl-11 2xl:pl-13 space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${q.id}`}
              name={`input-${q.id}`}
              placeholder="?"
              maxLength={10}
              value={answers[q.id]}
              onChange={(e) => handleNumericInput(q.id, e.target.value)}
              disabled={submitted}
              className="w-32 sm:w-40 h-12 sm:h-14 p-3 text-center rounded-2xl border-2 border-slate-300 font-mono text-lg sm:text-xl 2xl:text-2xl font-black focus:border-indigo-600 focus:outline-none bg-slate-50/60 focus:bg-white text-slate-900 disabled:opacity-75"
            />
            <span className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-600">
              {q.unit}
            </span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 2xl:pl-13 text-xs sm:text-sm 2xl:text-base leading-relaxed">
            {isCorrect ? (
              <div className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {q.explanation}
              </div>
            ) : (
              <div className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                {t.correctAnswerPrefix} <strong className="font-bold text-rose-950">{q.correct} {q.unit}</strong>. {q.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/e-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <button
          type="button"
          onClick={loadNewTest}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl text-sm 2xl:text-base transition shadow-sm flex items-center gap-2 whitespace-nowrap active:scale-95"
        >
          <span>🔄</span> {t.newTestBtn}
        </button>
      }
    >
      {/* Container πλήρους εύρους για 2K & 4K και responsive για κινητά */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <span className="bg-white/10 border border-white/20 text-sky-200 text-xs 2xl:text-sm font-black px-3 py-1 rounded-full tracking-wider inline-block">
              {toCleanUppercase(t.headerBadge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black tracking-tight pt-1 break-words [overflow-wrap:anywhere]">
              {t.mainTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm md:text-base 2xl:text-lg">
              {t.mainSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={loadNewTest}
            className="bg-amber-400 text-slate-950 font-black px-4 py-2.5 sm:px-5 sm:py-3 2xl:px-7 2xl:py-4 rounded-2xl shadow-lg hover:bg-amber-300 transition active:scale-95 text-xs sm:text-sm 2xl:text-base whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 {t.newTestBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ 18 ΑΣΚΗΣΕΩΝ & PB SAFE AREA */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-36">
          {questions.map((q, idx) => (q.type === 'mcq' ? renderMCQ(q, idx) : renderInput(q, idx)))}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg 2xl:text-xl font-black px-10 py-4 2xl:px-14 2xl:py-5 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                🎯 {t.submitBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 2xl:py-5">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 2xl:px-5 2xl:py-2 rounded-xl text-base sm:text-lg 2xl:text-xl flex items-center gap-2 shadow-sm">
              <span>🏆 {t.scoreLabel}</span>
              <span className="text-xl sm:text-2xl 2xl:text-3xl font-mono">{score} / 18</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-300">
                {t.successRateLabel} <span className="text-emerald-400 font-black">{Math.round((score / 18) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewTest}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 2xl:px-7 2xl:py-2.5 rounded-xl shadow-md transition text-xs sm:text-sm 2xl:text-base flex items-center gap-2 active:scale-95"
              >
                <span>🔄</span> {t.newTestBtn}
              </button>
            ) : (
              <p className="text-xs 2xl:text-sm text-slate-400 hidden sm:block">
                {t.fillPromptBottom}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}