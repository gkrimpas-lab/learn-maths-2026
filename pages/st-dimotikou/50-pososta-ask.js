// pages/st-dimotikou/50-pososta-ask.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Συναρτηση αφαιρεσης τονων για κεφαλαια (εξαιρειται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

// Τυχαιος ακεραιος στο [min, max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Τυχαια επιλογη απο πινακα
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Μορφοποιηση αριθμου
function formatNum(val, decimals = 2) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// Δεξαμενη Κανονικων Προβληματων Ποσοστων
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'pct_std_1',
    generate: () => {
      const preset = pickRandom([
        { num: 1, den: 4, pct: 25 },
        { num: 3, den: 4, pct: 75 },
        { num: 1, den: 2, pct: 50 },
        { num: 2, den: 5, pct: 40 },
        { num: 3, den: 5, pct: 60 },
        { num: 7, den: 10, pct: 70 },
        { num: 9, den: 20, pct: 45 }
      ]);
      return {
        text: `Σε ποιο ποσοστό στα εκατό (%) αντιστοιχεί το κλάσμα ${preset.num}/${preset.den};`,
        correctVal: preset.pct,
        correctStr: String(preset.pct),
        explanation: `(${preset.num} : ${preset.den}) · 100 ＝ ${preset.pct} %.`
      };
    }
  },
  {
    id: 'pct_std_2',
    generate: () => {
      const dec = pickRandom([0.15, 0.35, 0.48, 0.62, 0.05, 0.8]);
      const pct = Number((dec * 100).toFixed(0));
      return {
        text: `Ποιο ποσοστό στα εκατό (%) αντιπροσωπεύει ο δεκαδικός αριθμός ${formatNum(dec, 2)};`,
        correctVal: pct,
        correctStr: String(pct),
        explanation: `${formatNum(dec, 2)} · 100 ＝ ${pct} %.`
      };
    }
  },
  {
    id: 'pct_std_3',
    generate: () => {
      const totalStudents = pickRandom([20, 25, 50]);
      const boys = pickRandom([8, 10, 12, 15]);
      const pct = (boys / totalStudents) * 100;
      return {
        text: `Σε μια τάξη ${totalStudents} μαθητών, τα ${boys} είναι αγόρια. Τι ποσοστό (%) των μαθητών της τάξης είναι αγόρια;`,
        correctVal: pct,
        correctStr: String(pct),
        explanation: `(${boys} : ${totalStudents}) · 100 ＝ ${pct} %.`
      };
    }
  },
  {
    id: 'pct_std_4',
    generate: () => {
      const pct = pickRandom([12, 25, 40, 75]);
      const permille = pct * 10;
      return {
        text: `Σε πόσα στα χίλια (‰) αντιστοιχεί το ποσοστό ${pct} %;`,
        correctVal: permille,
        correctStr: String(permille),
        explanation: `1 % ＝ 10 ‰. Άρα: ${pct} · 10 ＝ ${permille} ‰.`
      };
    }
  },
  {
    id: 'pct_std_5',
    generate: () => {
      const totalCapacity = 200;
      const filled = 150;
      const pct = (filled / totalCapacity) * 100; // 75%
      return {
        text: `Μια δεξαμενή 200 l περιέχει 150 l νερό. Ποιο είναι το ποσοστό (%) πληρότητας της δεξαμενής;`,
        correctVal: pct,
        correctStr: String(pct),
        explanation: `(150 : 200) · 100 ＝ 0,75 · 100 ＝ 75 %.`
      };
    }
  },
  {
    id: 'pct_std_6',
    generate: () => {
      const correctRatio = '25/100 (δηλαδή 1/4)';
      return {
        text: `Ποιο ανάγωγο κλάσμα αντιστοιχεί στο ποσοστό 25 %;`,
        options: [
          { text: '1/4', isCorrect: true },
          { text: '1/2', isCorrect: false },
          { text: '1/5', isCorrect: false },
          { text: '2/5', isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        correctText: '1/4',
        explanation: `25 % ＝ 25/100 ＝ 1/4.`
      };
    }
  },
  {
    id: 'pct_std_7',
    generate: () => {
      const totalPages = 200;
      const read = 80;
      const pct = (read / totalPages) * 100;
      return {
        text: `Ένας μαθητής διάβασε 80 από τις 200 σελίδες ενός βιβλίου. Τι ποσοστό (%) του βιβλίου διάβασε;`,
        correctVal: pct,
        correctStr: String(pct),
        explanation: `(80 : 200) · 100 ＝ 40 %.`
      };
    }
  },
  {
    id: 'pct_std_8',
    generate: () => {
      return {
        text: `Ποιος δεκαδικός αριθμός αντιστοιχεί στο ποσοστό 8 %;`,
        correctVal: 0.08,
        correctStr: '0,08',
        explanation: `8 % ＝ 8 : 100 ＝ 0,08.`
      };
    }
  },
  {
    id: 'pct_std_9',
    generate: () => {
      const saltGrams = 35; // 35 g σε 1.000 g νερό = 35 ‰
      return {
        text: `Σε 1.000 g θαλασσινού νερού περιέχονται 35 g αλάτι. Ποια είναι η περιεκτικότητα σε αλάτι στα χίλια (‰);`,
        correctVal: saltGrams,
        correctStr: String(saltGrams),
        explanation: `(35 : 1.000) ＝ 35 ‰.`
      };
    }
  },
  {
    id: 'pct_std_10',
    generate: () => {
      return {
        text: `Αν σε έναν αγώνα μπάσκετ μια ομάδα ευστόχησε σε 18 από τα 30 σουτ, ποιο ήταν το ποσοστό ευστοχίας (%);`,
        correctVal: 60,
        correctStr: '60',
        explanation: `(18 : 30) · 100 ＝ 0,60 · 100 ＝ 60 %.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας
const HARD_PROBLEMS_POOL = [
  {
    id: 'pct_hard_1',
    generate: () => {
      return {
        text: `Σε ένα σχολείο 250 μαθητών, το 40 % είναι αγόρια. Πόσα είναι τα κορίτσια στο σχολείο;`,
        correctVal: 150,
        correctStr: '150',
        explanation: `Ποσοστό κοριτσιών: 100 % － 40 % ＝ 60 %. Πλήθος κοριτσιών: (250 · 60) : 100 ＝ 150.`
      };
    }
  },
  {
    id: 'pct_hard_2',
    generate: () => {
      return {
        text: `Ένα κράμα βάρους 500 g περιέχει 120 g χαλκό, 180 g κασσίτερο και το υπόλοιπο είναι ψευδάργυρος. Ποιο είναι το ποσοστό (%) του ψευδαργύρου στο κράμα;`,
        correctVal: 40,
        correctStr: '40',
        explanation: `Βάρος ψευδαργύρου: 500 － (120 ＋ 180) ＝ 200 g. Ποσοστό: (200 : 500) · 100 ＝ 40 %.`
      };
    }
  },
  {
    id: 'pct_hard_3',
    generate: () => {
      return {
        text: `Σε μια αποθήκη υπάρχουν 800 κιβώτια. Το 25 % περιέχει μήλα, το 35 % πορτοκάλια και τα υπόλοιπα αχλάδια. Πόσα είναι τα κιβώτια με αχλάδια;`,
        correctVal: 320,
        correctStr: '320',
        explanation: `Ποσοστό αχλαδιών: 100 % － (25 % ＋ 35 %) ＝ 40 %. Κιβώτια: (800 · 40) : 100 ＝ 320.`
      };
    }
  },
  {
    id: 'pct_hard_4',
    generate: () => {
      return {
        text: `Σε έναν έλεγχο 400 οχημάτων, βρέθηκαν 16 οχήματα με τεχνικά προβλήματα. Ποιο ήταν το ποσοστό (%) των προβληματικών οχημάτων;`,
        correctVal: 4,
        correctStr: '4',
        explanation: `(16 : 400) · 100 ＝ 4 %.`
      };
    }
  },
  {
    id: 'pct_hard_5',
    generate: () => {
      return {
        text: `Ένας εργαζόμενος αποταμιεύει 300 € από τον μηνιαίο μισθό των 1.500 €. Τι ποσοστό (%) του μισθού του αποταμιεύει;`,
        correctVal: 20,
        correctStr: '20',
        explanation: `(300 : 1.500) · 100 ＝ 20 %.`
      };
    }
  },
  {
    id: 'pct_hard_6',
    generate: () => {
      return {
        text: `Ποιο ποσοστό (%) είναι μεγαλύτερο: το 3/5 ή το 0,55;`,
        options: [
          { text: 'Το 3/5 (γιατί ισούται με 60 % έναντι 55 %)', isCorrect: true },
          { text: 'Το 0,55 (γιατί είναι δεκαδικός αριθμός)', isCorrect: false },
          { text: 'Είναι ίσα', isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        correctText: 'Το 3/5 (γιατί ισούται με 60 % έναντι 55 %)',
        explanation: `3/5 ＝ 60/100 ＝ 60 %, ενώ 0,55 ＝ 55 %.`
      };
    }
  },
  {
    id: 'pct_hard_7',
    generate: () => {
      return {
        text: `Σε ένα διαγώνισμα 50 ερωτήσεων, ένας μαθητής είχε 90 % επιτυχία. Πόσες ερωτήσεις απάντησε σωστά;`,
        correctVal: 45,
        correctStr: '45',
        explanation: `(50 · 90) : 100 ＝ 45 ερωτήσεις.`
      };
    }
  },
  {
    id: 'pct_hard_8',
    generate: () => {
      return {
        text: `Αν το 15 ‰ των κατοίκων μιας πόλης 20.000 κατοίκων είναι αλλοδαποί, πόσοι είναι οι αλλοδαποί κάτοικοι;`,
        correctVal: 300,
        correctStr: '300',
        explanation: `(20.000 · 15) : 1.000 ＝ 300 κάτοικοι.`
      };
    }
  },
  {
    id: 'pct_hard_9',
    generate: () => {
      return {
        text: `Ένα κατάστημα είχε 120 πελάτες το πρωί και 80 πελάτες το απόγευμα. Τι ποσοστό (%) του συνολικού πλήθους πελατών επισκέφθηκε το κατάστημα το πρωί;`,
        correctVal: 60,
        correctStr: '60',
        explanation: `Σύνολο πελατών: 120 ＋ 80 ＝ 200. Πρωινοί πελάτες: (120 : 200) · 100 ＝ 60 %.`
      };
    }
  },
  {
    id: 'pct_hard_10',
    generate: () => {
      return {
        text: `Σε ένα δάσος 1.500 δέντρων, το 45 % είναι πεύκα, το 35 % είναι έλατα και τα υπόλοιπα είναι βελανιδιές. Πόσες είναι οι βελανιδιές;`,
        correctVal: 300,
        correctStr: '300',
        explanation: `Ποσοστό βελανιδιών: 100 % － (45 % ＋ 35 %) ＝ 20 %. Πλήθος: (1.500 · 20) : 100 ＝ 300 δέντρα.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Μετατροπή κλάσματος σε ποσοστό
  {
    const preset = pickRandom([
      { num: 1, den: 4, pct: 25 },
      { num: 3, den: 4, pct: 75 },
      { num: 2, den: 5, pct: 40 },
      { num: 7, den: 10, pct: 70 }
    ]);

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΜΕΤΑΤΡΟΠΗ ΚΛΑΣΜΑΤΟΣ ΣΕ ΠΟΣΟΣΤΟ',
      instruction: 'Υπολογίστε το ποσοστό στα εκατό (%):',
      prompt: `Σε ποιο ποσοστό στα εκατό (%) αντιστοιχεί το κλάσμα ${preset.num}/${preset.den};`,
      correctVal: preset.pct,
      correctStr: String(preset.pct),
      explanation: `(${preset.num} : ${preset.den}) · 100 ＝ ${preset.pct} %.`
    });
  }

  // Q2 (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE
  {
    const correctConcept = 'Ένας λόγος ή ένα κλάσμα με σταθερό παρονομαστή το 100';
    const options = [
      { text: correctConcept, isCorrect: true },
      { text: 'Το γινόμενο δύο τυχαίων ακεραίων αριθμών', isCorrect: false },
      { text: 'Ένα κλάσμα που έχει πάντοτε αριθμητή το 100', isCorrect: false },
      { text: 'Η διαφορά ανάμεσα σε δύο δεκαδικούς', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • ΟΡΙΣΜΟΣ ΠΟΣΟΣΤΟΥ',
      instruction: 'Επιλέξτε τον σωστό ορισμό:',
      prompt: `Τι ονομάζουμε ποσοστό στα εκατό (%) στα Μαθηματικά;`,
      options,
      correctText: correctConcept,
      explanation: `Ποσοστό στα εκατό (%) είναι το κλάσμα που συγκρίνει ένα μέγεθος με βάση το 100 (παρονομαστής 100).`
    });
  }

  // Q3 (Input - Decimal): Μετατροπή δεκαδικού σε ποσοστό
  {
    const dec = pickRandom([0.35, 0.45, 0.6, 0.08, 0.72]);
    const pct = Number((dec * 100).toFixed(0));

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΑΠΟ ΔΕΚΑΔΙΚΟ ΣΕ ΠΟΣΟΣΤΟ',
      instruction: 'Μετατρέψτε τον δεκαδικό αριθμό σε ποσοστό (%):',
      prompt: `Ποιο ποσοστό στα εκατό (%) αντιπροσωπεύει ο δεκαδικός αριθμός ${formatNum(dec, 2)};`,
      correctVal: pct,
      correctStr: String(pct),
      explanation: `${formatNum(dec, 2)} · 100 ＝ ${pct} %.`
    });
  }

  // Q4 (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE
  {
    const correctRelation = '1 % ＝ 10 ‰ (το ποσοστό στα εκατό ισούται με 10 στα χίλια)';
    const options = [
      { text: correctRelation, isCorrect: true },
      { text: '1 % ＝ 100 ‰', isCorrect: false },
      { text: '10 % ＝ 1 ‰', isCorrect: false },
      { text: 'Δεν έχουν καμία μαθηματική σχέση μεταξύ τους', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΣΧΕΣΗ ΣΤΑ ΕΚΑΤΟ ΚΑΙ ΣΤΑ ΧΙΛΙΑ',
      instruction: 'Επιλέξτε τη σωστή ισοδυναμία:',
      prompt: `Ποια είναι η σχέση ανάμεσα στο ποσοστό στα εκατό (%) και στο ποσοστό στα χίλια (‰);`,
      options,
      correctText: correctRelation,
      explanation: `1/100 ＝ 10/1.000, επομένως 1 % ＝ 10 ‰.`
    });
  }

  // Q5 (Input - Decimal): Υπολογισμός ποσοστού από μέγεθος
  {
    const total = 50;
    const part = pickRandom([15, 20, 25, 30]);
    const pct = (part / total) * 100;

    qList.push({
      id: 5,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 5 • ΥΠΟΛΟΓΙΣΜΟΣ ΠΟΣΟΣΤΟΥ ΕΠΙ ΤΟΥ ΣΥΝΟΛΟΥ',
      instruction: 'Βρείτε το ποσοστό (%):',
      prompt: `Σε μια ομάδα 50 ατόμων, τα ${part} άτομα ασχολούνται με το τρέξιμο. Τι ποσοστό (%) της ομάδας ασχολείται με το τρέξιμο;`,
      correctVal: pct,
      correctStr: String(pct),
      explanation: `(${part} : 50) · 100 ＝ ${pct} %.`
    });
  }

  // Q6 (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE
  {
    const correctFrac = '1/2 (ένα δεύτερο)';
    const options = [
      { text: correctFrac, isCorrect: true },
      { text: '1/4', isCorrect: false },
      { text: '1/5', isCorrect: false },
      { text: '3/4', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ ΤΟΥ 50%',
      instruction: 'Επιλέξτε το σωστό κλάσμα:',
      prompt: `Ποιο ανάγωγο κλάσμα αντιστοιχεί ακριβώς στο ποσοστό 50 %;`,
      options,
      correctText: correctFrac,
      explanation: `50 % ＝ 50/100 ＝ 1/2 (το μισό του όλου).`
    });
  }

  // Q7 & Q8: Κανονικά Προβλήματα από τη δεξαμενή
  {
    const shuffledStd = [...STANDARD_PROBLEMS_POOL].sort(() => Math.random() - 0.5);
    const stdProb1 = shuffledStd[0].generate();
    const stdProb2 = shuffledStd[1].generate();

    // Q7 (Input - Decimal)
    qList.push({
      id: 7,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΠΟΣΟΣΤΩΝ',
      instruction: 'Υπολογίστε το τελικό αποτέλεσμα:',
      prompt: stdProb1.text,
      correctVal: stdProb1.correctVal,
      correctStr: stdProb1.correctStr,
      explanation: stdProb1.explanation
    });

    // Q8 (MCQ)
    const val8 = stdProb2.correctVal !== undefined ? stdProb2.correctVal : stdProb2.correctText;
    let optionsQ8 = stdProb2.options;
    if (!optionsQ8 && typeof val8 === 'number') {
      const fake8A = formatNum(val8 + randInt(5, 15));
      const fake8B = formatNum(Math.max(2, val8 - randInt(5, 10)));
      const fake8C = formatNum(val8 * 1.5);
      optionsQ8 = [
        { text: `${stdProb2.correctStr} %`, isCorrect: true },
        { text: `${fake8A} %`, isCorrect: false },
        { text: `${fake8B} %`, isCorrect: false },
        { text: `${fake8C} %`, isCorrect: false }
      ].sort(() => Math.random() - 0.5);
    }

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΗΣ ΕΦΑΡΜΟΓΗΣ',
      instruction: 'Επιλέξτε τη σωστή τιμή:',
      prompt: stdProb2.text,
      options: optionsQ8,
      correctText: stdProb2.correctText || `${stdProb2.correctStr} %`,
      explanation: stdProb2.explanation
    });
  }

  // Q9 & Q10: Προβλήματα Αυξημένης Δυσκολίας
  {
    const shuffledHard = [...HARD_PROBLEMS_POOL].sort(() => Math.random() - 0.5);
    const hardProb1 = shuffledHard[0].generate();
    const hardProb2 = shuffledHard[1].generate();

    // Q9 (Input - Decimal)
    qList.push({
      id: 9,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 9 • ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΠΟΣΟΣΤΩΝ',
      instruction: 'Υπολογίστε με ακρίβεια και εισαγάγετε το αποτέλεσμα:',
      prompt: hardProb1.text,
      correctVal: hardProb1.correctVal,
      correctStr: hardProb1.correctStr,
      explanation: hardProb1.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας)
    const val10 = hardProb2.correctVal !== undefined ? hardProb2.correctVal : hardProb2.correctText;
    let optionsQ10 = hardProb2.options;
    if (!optionsQ10 && typeof val10 === 'number') {
      const fake10A = formatNum(val10 + randInt(5, 15));
      const fake10B = formatNum(Math.max(2, val10 - randInt(5, 10)));
      const fake10C = formatNum(val10 * 1.4);
      optionsQ10 = [
        { text: `${hardProb2.correctStr}`, isCorrect: true },
        { text: `${fake10A}`, isCorrect: false },
        { text: `${fake10B}`, isCorrect: false },
        { text: `${fake10C}`, isCorrect: false }
      ].sort(() => Math.random() - 0.5);
    }

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΠΟΣΟΣΤΙΑΙΑΣ ΚΑΤΑΝΟΜΗΣ',
      instruction: 'Επιλέξτε τη σωστή απάντηση:',
      prompt: hardProb2.text,
      options: optionsQ10,
      correctText: hardProb2.correctText || `${hardProb2.correctStr}`,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

export default function PosostaExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const q = generateQuestions();
    setQuestions(q);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
  }, []);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  const handleInputChange = (fieldKey, rawValue) => {
    if (isSubmitted) return;
    let sanitized = rawValue.replace(/\./g, ',');
    sanitized = sanitized.replace(/[^0-9,]/g, '');
    const parts = sanitized.split(',');
    if (parts.length > 2) {
      sanitized = parts[0] + ',' + parts.slice(1).join('');
    }
    if (sanitized.length > 10) {
      sanitized = sanitized.slice(0, 10);
    }
    setAnswers((prev) => ({
      ...prev,
      [fieldKey]: sanitized
    }));
  };

  const handleSelectMCQ = (qId, optionText) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: optionText
    }));
  };

  const handleCheckAnswers = () => {
    let currentScore = 0;

    questions.forEach((q) => {
      if (q.type === 'mcq') {
        const userChoice = answers[`q_${q.id}`];
        if (userChoice === q.correctText) {
          currentScore += 1;
        }
      } else if (q.type === 'decimal_input') {
        const userValStr = (answers[`q_${q.id}`] || '').trim().replace(',', '.');
        const userVal = parseFloat(userValStr);
        if (!isNaN(userVal) && Math.abs(userVal - q.correctVal) < 0.05) {
          currentScore += 1;
        }
      }
    });

    setScore(currentScore);
    setIsSubmitted(true);
  };

  return (
    <Layout
      title="Ασκήσεις: Ποσοστά (Έννοια & Μετατροπές) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στα ποσοστά στα εκατό (%) και στα χίλια (‰), μετατροπές κλασμάτων και δεκαδικών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/50-pososta"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>📖 Θεωρία</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-8 pb-32 overflow-x-hidden">
        
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-14 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
              <span>ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Ασκήσεις: Ποσοστά στα Εκατό (%) &amp; στα Χίλια (‰)
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες με 4 ρεαλιστικά προβλήματα (2 βασικά &amp; 2 αυξημένης δυσκολίας). Μετατρέψτε κλάσματα και δεκαδικούς σε ποσοστά και ελέγξτε τις επιδόσεις σας.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between">
            <span className="text-xs sm:text-sm text-sky-200">
              ⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίες παραμέτρους.
            </span>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3.5 sm:px-4 py-2 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm"
            >
              <span>🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
            </button>
          </div>
        </section>

        {/* Λιστα 10 Ασκησεων */}
        <div className="space-y-6">
          {questions.map((q, idx) => {
            let isCorrect = false;
            if (isSubmitted) {
              if (q.type === 'mcq') {
                isCorrect = answers[`q_${q.id}`] === q.correctText;
              } else if (q.type === 'decimal_input') {
                const uv = parseFloat((answers[`q_${q.id}`] || '').replace(',', '.'));
                isCorrect = !isNaN(uv) && Math.abs(uv - q.correctVal) < 0.05;
              }
            }

            return (
              <article
                key={`q-${q.id}-${idx}`}
                className={`bg-white rounded-3xl border p-4 sm:p-7 shadow-sm transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Επικεφαλιδα Ερωτησης */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-3">
                  <span className="text-xs font-black tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
                    {toCleanUppercase(q.title)}
                  </span>
                  {isSubmitted && (
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? '✓ ΣΩΣΤΟ' : '✗ ΛΑΘΟΣ'}
                    </span>
                  )}
                </div>

                {/* Εκφωνηση */}
                <div className="space-y-2 mb-2">
                  <p className="text-xs sm:text-sm font-semibold text-slate-500">
                    {q.instruction}
                  </p>
                  <p className="text-sm sm:text-lg font-bold text-slate-900 leading-relaxed">
                    {q.prompt}
                  </p>
                </div>

                {/* Περιοχη Απαντησης */}
                <div className="py-2 pt-2.5">
                  
                  {/* Decimal / Number Input */}
                  {q.type === 'decimal_input' && (
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder="Απάντηση..."
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(`q_${q.id}`, e.target.value)}
                        className="w-32 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs text-slate-500">
                        (Ακέραιος η δεκαδικός με κόμμα)
                      </span>
                    </div>
                  )}

                  {/* Multiple Choice (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE / ΑΠΟΣΙΩΠΗΤΙΚΑ */}
                  {q.type === 'mcq' && (
                    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2.5 sm:gap-3 max-w-3xl">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[`q_${q.id}`] === opt.text;
                        return (
                          <button
                            key={`opt-${q.id}-${oIdx}`}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleSelectMCQ(q.id, opt.text)}
                            className={`p-3.5 sm:p-4 rounded-2xl border text-left font-semibold text-xs sm:text-sm md:text-base transition active:scale-98 touch-manipulation flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            } disabled:cursor-not-allowed`}
                          >
                            <span className="break-words whitespace-normal leading-snug flex-1">
                              {opt.text}
                            </span>
                            <span
                              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center text-[10px] sm:text-xs shrink-0 mt-0.5 ${
                                isSelected
                                  ? 'border-white bg-white text-blue-600 font-bold'
                                  : 'border-slate-400 bg-transparent'
                              }`}
                            >
                              {isSelected ? '●' : ''}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                </div>

                {/* Feedback μετα την υποβολη */}
                {isSubmitted && (
                  <div
                    className={`mt-3.5 p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-1.5 ${
                      isCorrect
                        ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950'
                        : 'bg-rose-100/60 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{isCorrect ? '🎉 Εξαιρετικά!' : '💡 Μαθηματική Επεξήγηση:'}</span>
                    </div>
                    <div>{q.explanation}</div>
                    {!isCorrect && (
                      <div className="font-semibold pt-1 text-slate-800">
                        Σωστή απάντηση:{' '}
                        <span className="font-mono font-bold text-blue-900">
                          {q.correctStr || q.correctText}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Κουμπι Ελεγχου στο τελος της φορμας */}
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={handleCheckAnswers}
            disabled={isSubmitted}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base sm:text-lg px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation"
          >
            <span>🎯 Έλεγχος Απαντήσεων</span>
          </button>
        </div>

      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 sm:py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div>
              <span className="text-[11px] sm:text-xs text-slate-400 font-semibold block">
                ΣΚΟΡ
              </span>
              <span className="font-mono font-black text-base sm:text-2xl text-amber-300">
                {score} <span className="text-slate-500 text-sm sm:text-base">/ 10</span>
              </span>
            </div>

            <div className="hidden xs:block border-l border-slate-700 pl-4 sm:pl-8">
              <span className="text-[11px] sm:text-xs text-slate-400 font-semibold block">
                ΠΟΣΟΣΤΟ
              </span>
              <span className="font-mono font-black text-base sm:text-2xl text-emerald-400">
                {Math.round((score / 10) * 100)} %
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleCheckAnswers}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95 touch-manipulation"
              >
                ΕΛΕΓΧΟΣ
              </button>
            ) : (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95 touch-manipulation"
              >
                🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ
              </button>
            )}
          </div>

        </div>
      </footer>
    </Layout>
  );
}
