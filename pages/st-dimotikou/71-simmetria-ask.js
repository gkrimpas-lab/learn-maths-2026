// pages/st-dimotikou/71-simmetria-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// -------------------------------------------------------------
// DEFENSIVE UTILITY FUNCTIONS
// -------------------------------------------------------------

function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
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

function formatNum(val) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  return Number(val).toLocaleString('el-GR');
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

  let counter = 1;
  while (optionsSet.size < 4) {
    optionsSet.add(`${correctText} (${counter})`);
    counter++;
  }

  return shuffle([...optionsSet]);
}

// -------------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (POOLS) ΓΙΑ Q9, Q10, Q11, Q12
// -------------------------------------------------------------

// POOL ΓΙΑ Q9: Απόσταση Συμμετρικών Σημείων από Άξονα
const PROBLEM_POOL_Q9 = [
  // 1. Συνολική απόσταση ΑΑ'
  () => {
    const d = randInt(3, 9) + 0.5; // π.χ. 3.5, 4.5 κ.λπ.
    const total = 2 * d;
    const correct = `${formatNum(total)} cm`;
    return {
      title: 'ΑΠΟΣΤΑΣΗ ΣΥΜΜΕΤΡΙΚΩΝ ΣΗΜΕΙΩΝ',
      prompt: `Ένα σημείο Α απέχει από έναν κατακόρυφο άξονα συμμετρίας (ε) απόσταση ${formatNum(d)} cm. Πόση είναι η συνολική ευθεία απόσταση ανάμεσα στο σημείο Α και στο συμμετρικό του σημείο Α';`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(d)} cm`,
        `${formatNum(total + 2)} cm`,
        `${formatNum(total - 1.5 > 0 ? total - 1.5 : total + 3)} cm`,
        `${formatNum(total * 2)} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Απόσταση Α από άξονα (d₁)', value: `${formatNum(d)} cm` },
        { label: 'Απόσταση Α\' από άξονα (d₂)', value: `${formatNum(d)} cm (ίση)` },
        { label: 'Πράξη', value: `2 · ${formatNum(d)} cm` },
        { label: 'Συνολική απόσταση ΑΑ\'', value: `${formatNum(total)} cm` }
      ],
      explanation: `Το συμμετρικό σημείο Α' απέχει την ίδια απόσταση ${formatNum(d)} cm από την άλλη πλευρά του άξονα. Άρα: ${formatNum(d)} ＋ ${formatNum(d)} ＝ ${formatNum(total)} cm.`
    };
  },
  // 2. Εύρεση απόστασης από τον άξονα όταν δίνεται το τμήμα ΑΑ'
  () => {
    const total = randInt(6, 18);
    const d = total / 2;
    const correct = `${formatNum(d)} cm`;
    return {
      title: 'ΑΠΟΣΤΑΣΗ ΑΠΟ ΤΟΝ ΑΞΟΝΑ',
      prompt: `Δύο σημεία Α και Α' είναι συμμετρικά ως προς ευθεία (ε) και η μεταξύ τους απόσταση είναι ${total} cm. Πόσο απέχει το σημείο Α από τον άξονα συμμετρίας;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${total} cm`,
        `${formatNum(d + 2)} cm`,
        `${formatNum(d - 1 > 0 ? d - 1 : d + 3)} cm`,
        `${formatNum(total * 2)} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Συνολικό μήκος ΑΑ\'', value: `${total} cm` },
        { label: 'Ιδιότητα άξονα', value: 'Διέρχεται από το μέσο του τμήματος ΑΑ\'' },
        { label: 'Πράξη', value: `${total} : 2` },
        { label: 'Απόσταση από τον άξονα', value: `${formatNum(d)} cm` }
      ],
      explanation: `Ο άξονας συμμετρίας είναι η μεσοκάθετος του τμήματος ΑΑ', επομένως το σημείο Α απέχει το μισό της συνολικής απόστασης: ${total} : 2 ＝ ${formatNum(d)} cm.`
    };
  },
  // 3. Σημείο πάνω στον άξονα
  () => {
    const correct = '0 cm (βρίσκεται πάνω στον άξονα)';
    return {
      title: 'ΣΗΜΕΙΟ ΠΑΝΩ ΣΤΟΝ ΑΞΟΝΑ',
      prompt: `Ένα σημείο Β βρίσκεται ακριβώς πάνω στον άξονα συμμετρίας (ε). Πόση είναι η απόσταση ανάμεσα στο σημείο Β και στο συμμετρικό του σημείο Β';`,
      options: ensureFourUniqueOptions(correct, () => [
        '1 cm',
        '2 cm',
        'Άπειρη απόσταση',
        'Δεν υπάρχει συμμετρικό σημείο'
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Θέση σημείου Β', value: 'Πάνω στον άξονα' },
        { label: 'Συμμετρικό σημείο Β\'', value: 'Ταυτίζεται με το σημείο Β' },
        { label: 'Απόσταση ΒΒ\'', value: '0 cm' }
      ],
      explanation: `Όταν ένα σημείο ανήκει στον άξονα συμμετρίας, το συμμετρικό του ταυτίζεται με τον εαυτό του, άρα η απόσταση μεταξύ τους είναι 0 cm.`
    };
  },
  // 4. Απόσταση σε mm
  () => {
    const d = randInt(25, 65); // mm
    const total = 2 * d;
    const correct = `${total} mm`;
    return {
      title: 'ΑΠΟΣΤΑΣΗ ΣΕ ΧΙΛΙΟΣΤΑ',
      prompt: `Σε ένα τεχνικό σχέδιο, ένα σημείο απέχει ${d} mm από τον άξονα συμμετρίας. Πόσα χιλιοστά (mm) απέχουν μεταξύ τους τα δύο συμμετρικά σημεία;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${d} mm`,
        `${total + 10} mm`,
        `${total - 10} mm`,
        `${total * 2} mm`
      ]),
      correctAnswer: correct,
      unit: 'mm',
      tableData: [
        { label: 'Απόσταση από άξονα', value: `${d} mm` },
        { label: 'Πράξη', value: `2 · ${d} mm` },
        { label: 'Συνολική απόσταση', value: `${total} mm` }
      ],
      explanation: `2 · ${d} mm ＝ ${total} mm.`
    };
  },
  // 5. Μετακίνηση σημείου
  () => {
    const d1 = randInt(3, 6);
    const step = 2;
    const d2 = d1 + step;
    const total = 2 * d2;
    const correct = `${total} cm`;
    return {
      title: 'ΑΠΟΜΑΚΡΥΝΣΗ ΑΠΟ ΤΟΝ ΑΞΟΝΑ',
      prompt: `Ένα σημείο Α απέχει αρχικά ${d1} cm από τον άξονα. Αν το μετακινήσουμε κάθετα κατά ${step} cm πιο μακριά από τον άξονα, πόση θα είναι η νέα απόσταση ανάμεσα στο σημείο και στο συμμετρικό του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${2 * d1} cm`,
        `${total + 2} cm`,
        `${total - 2} cm`,
        `${d2} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Νέα απόσταση από άξονα', value: `${d1} ＋ ${step} ＝ ${d2} cm` },
        { label: 'Νέα απόσταση μεταξύ τους', value: `2 · ${d2} ＝ ${total} cm` }
      ],
      explanation: `Η νέα απόσταση από τον άξονα είναι ${d2} cm, άρα τα δύο σημεία απέχουν 2 · ${d2} ＝ ${total} cm.`
    };
  },
  // 6. Πρόβλημα με δέντρα εκατέρωθεν δρόμου
  () => {
    const d = randInt(4, 9);
    const total = 2 * d;
    const correct = `${total} m`;
    return {
      title: 'ΣΥΜΜΕΤΡΙΚΗ ΔΕΝΔΡΟΦΥΤΕΥΣΗ',
      prompt: `Κατά μήκος ενός ευθύγραμμου δρόμου φυτεύονται δέντρα συμμετρικά ως προς τη μεσαία γραμμή του δρόμου. Αν ένα δέντρο απέχει ${d} m από τη μεσαία γραμμή, πόση είναι η απόσταση ανάμεσα σε αυτό και στο απέναντι συμμετρικό του δέντρο;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${d} m`,
        `${total + 2} m`,
        `${total - 2} m`,
        `${total * 2} m`
      ]),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: 'Άξονας συμμετρίας', value: 'Μεσαία γραμμή δρόμου' },
        { label: 'Απόσταση δέντρου', value: `${d} m` },
        { label: 'Πράξη', value: `2 · ${d} m` },
        { label: 'Συνολική απόσταση', value: `${total} m` }
      ],
      explanation: `2 · ${d} m ＝ ${total} m.`
    };
  }
];

// POOL ΓΙΑ Q10: Άξονες Συμμετρίας Κανονικών Πολυγώνων
const PROBLEM_POOL_Q10 = [
  // 1. Κανονικό οκτάγωνο
  () => {
    const correct = '8 άξονες συμμετρίας';
    return {
      title: 'ΑΞΟΝΕΣ ΚΑΝΟΝΙΚΟΥ ΟΚΤΑΓΩΝΟΥ',
      prompt: `Πόσους άξονες συμμετρίας έχει ένα κανονικό οκτάγωνο (όλες οι πλευρές και όλες οι γωνίες του είναι ίσες);`,
      options: ensureFourUniqueOptions(correct, () => [
        '4 άξονες συμμετρίας',
        '6 άξονες συμμετρίας',
        '2 άξονες συμμετρίας',
        'Άπειρους άξονες'
      ]),
      correctAnswer: correct,
      unit: 'άξονες',
      tableData: [
        { label: 'Σχήμα', value: 'Κανονικό οκτάγωνο (ν ＝ 8)' },
        { label: 'Κανόνας κανονικών πολυγώνων', value: 'Κάθε κανονικό ν-γωνο έχει ν άξονες συμμετρίας' },
        { label: 'Αποτέλεσμα', value: '8 άξονες συμμετρίας' }
      ],
      explanation: `Κάθε κανονικό πολύγωνο με ν πλευρές έχει ακριβώς ν άξονες συμμετρίας. Για το κανονικό οκτάγωνο: 8 άξονες.`
    };
  },
  // 2. Κανονικό δεκάγωνο
  () => {
    const correct = '10 άξονες συμμετρίας';
    return {
      title: 'ΑΞΟΝΕΣ ΚΑΝΟΝΙΚΟΥ ΔΕΚΑΓΩΝΟΥ',
      prompt: `Πόσους άξονες συμμετρίας έχει ένα κανονικό δεκάγωνο;`,
      options: ensureFourUniqueOptions(correct, () => [
        '5 άξονες συμμετρίας',
        '8 άξονες συμμετρίας',
        '2 άξονες συμμετρίας',
        '20 άξονες συμμετρίας'
      ]),
      correctAnswer: correct,
      unit: 'άξονες',
      tableData: [
        { label: 'Σχήμα', value: 'Κανονικό δεκάγωνο (ν ＝ 10)' },
        { label: 'Πλήθος αξόνων', value: '10 άξονες' }
      ],
      explanation: `Το κανονικό δεκάγωνο έχει 10 ίσες πλευρές και 10 ίσες γωνίες, άρα έχει ακριβώς 10 άξονες συμμετρίας.`
    };
  },
  // 3. Κανονικό πεντάγωνο
  () => {
    const correct = '5 άξονες συμμετρίας';
    return {
      title: 'ΑΞΟΝΕΣ ΚΑΝΟΝΙΚΟΥ ΠΕΝΤΑΓΩΝΟΥ',
      prompt: `Πόσους άξονες συμμετρίας έχει ένα κανονικό πεντάγωνο;`,
      options: ensureFourUniqueOptions(correct, () => [
        '1 άξονα συμμετρίας',
        '3 άξονες συμμετρίας',
        '10 άξονες συμμετρίας',
        'Κανέναν άξονα'
      ]),
      correctAnswer: correct,
      unit: 'άξονες',
      tableData: [
        { label: 'Σχήμα', value: 'Κανονικό πεντάγωνο (ν ＝ 5)' },
        { label: 'Πλήθος αξόνων', value: '5 άξονες (διέρχονται από κάθε κορυφή και το μέσο της απέναντι πλευράς)' }
      ],
      explanation: `Κάθε κανονικό πεντάγωνο έχει ακριβώς 5 άξονες συμμετρίας.`
    };
  },
  // 4. Κανονικό εξάγωνο
  () => {
    const correct = '6 άξονες συμμετρίας';
    return {
      title: 'ΑΞΟΝΕΣ ΚΑΝΟΝΙΚΟΥ ΕΞΑΓΩΝΟΥ',
      prompt: `Πόσους άξονες συμμετρίας έχει ένα κανονικό εξάγωνο;`,
      options: ensureFourUniqueOptions(correct, () => [
        '3 άξονες συμμετρίας',
        '4 άξονες συμμετρίας',
        '12 άξονες συμμετρίας',
        '2 άξονες συμμετρίας'
      ]),
      correctAnswer: correct,
      unit: 'άξονες',
      tableData: [
        { label: 'Σχήμα', value: 'Κανονικό εξάγωνο (ν ＝ 6)' },
        { label: 'Ανάλυση αξόνων', value: '3 διαγώνιοι κορυφών ＋ 3 μεσοκάθετοι απέναντι πλευρών ＝ 6 άξονες' }
      ],
      explanation: `Το κανονικό εξάγωνο έχει 6 άξονες συμμετρίας (3 που ενώνουν απέναντι κορυφές και 3 που ενώνουν μέσα απέναντι πλευρών).`
    };
  },
  // 5. Ισόπλευρο τρίγωνο vs Ισοσκελές
  () => {
    const correct = '3 άξονες το ισόπλευρο και 1 άξονα το ισοσκελές';
    return {
      title: 'ΣΥΓΚΡΙΣΗ ΑΞΟΝΩΝ ΤΡΙΓΩΝΩΝ',
      prompt: `Πόσους άξονες συμμετρίας έχουν αντίστοιχα ένα ισόπλευρο τρίγωνο και ένα ισοσκελές τρίγωνο (με 2 μόνο ίσες πλευρές);`,
      options: ensureFourUniqueOptions(correct, () => [
        '3 άξονες και τα δύο',
        '1 άξονα το ισόπλευρο και 3 το ισοσκελές',
        '2 άξονες το ισόπλευρο και 1 το ισοσκελές',
        'Κανέναν άξονα και τα δύο'
      ]),
      correctAnswer: correct,
      unit: 'άξονες',
      tableData: [
        { label: 'Ισόπλευρο τρίγωνο', value: '3 άξονες συμμετρίας (κανονικό 3-γωνο)' },
        { label: 'Ισοσκελές τρίγωνο', value: '1 άξονας συμμετρίας (η μεσοκάθετος της βάσης)' }
      ],
      explanation: `Το ισόπλευρο έχει 3 άξονες συμμετρίας, ενώ το απλό ισοσκελές τρίγωνο έχει μόνο 1 άξονα (αυτόν που ξεκινά από την κορυφή προς τη βάση).`
    };
  },
  // 6. Κύκλος
  () => {
    const correct = 'Άπειρους άξονες συμμετρίας';
    return {
      title: 'ΑΞΟΝΕΣ ΣΥΜΜΕΤΡΙΑΣ ΚΥΚΛΟΥ',
      prompt: `Πόσους άξονες συμμετρίας έχει ένας κύκλος;`,
      options: ensureFourUniqueOptions(correct, () => [
        '360 άξονες συμμετρίας',
        '4 άξονες συμμετρίας',
        '2 άξονες συμμετρίας',
        '1 άξονα συμμετρίας'
      ]),
      correctAnswer: correct,
      unit: 'άξονες',
      tableData: [
        { label: 'Σχήμα', value: 'Κύκλος' },
        { label: 'Άξονες συμμετρίας', value: 'Κάθε ευθεία που περνά από το κέντρο του (κάθε διάμετρος)' },
        { label: 'Πλήθος', value: 'Άπειροι' }
      ],
      explanation: `Κάθε ευθεία που διέρχεται από το κέντρο του κύκλου (κάθε διάμετρος) είναι άξονας συμμετρίας, επομένως ο κύκλος έχει άπειρους άξονες.`
    };
  }
];

// POOL ΓΙΑ Q11: Διατήρηση Περιμέτρου & Εμβαδού σε Συμμετρικά Σχήματα
const PROBLEM_POOL_Q11 = [
  // 1. Περίμετρος συμμετρικού ορθογωνίου
  () => {
    const a = randInt(4, 8);
    const b = randInt(6, 12);
    const p = 2 * (a + b);
    const correct = `${p} cm`;
    return {
      title: 'ΠΕΡΙΜΕΤΡΟΣ ΣΥΜΜΕΤΡΙΚΟΥ ΟΡΘΟΓΩΝΙΟΥ',
      prompt: `Ένα ορθογώνιο παραλληλόγραμμο έχει πλευρές ${a} cm και ${b} cm (περίμετρος ${p} cm). Σχεδιάζουμε το συμμετρικό του ως προς έναν άξονα (ε). Πόση είναι η περίμετρος του νέου σχήματος;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${2 * p} cm`,
        `${p + 4} cm`,
        `${p - 4} cm`,
        `${a * b} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Αρχική περίμετρος', value: `${p} cm` },
        { label: 'Ιδιότητα αξονικής συμμετρίας', value: 'Διατήρηση μηκών πλευρών' },
        { label: 'Νέα περίμετρος', value: `${p} cm (ακριβώς ίση)` }
      ],
      explanation: `Η αξονική συμμετρία διατηρεί τα μήκη των πλευρών αναλλοίωτα, επομένως η περίμετρος παραμένει ακριβώς η ίδια: ${p} cm.`
    };
  },
  // 2. Εμβαδόν συμμετρικού τριγώνου
  () => {
    const base = randInt(6, 10);
    const height = randInt(4, 8);
    const area = (base * height) / 2;
    const correct = `${area} cm²`;
    return {
      title: 'ΕΜΒΑΔΟΝ ΣΥΜΜΕΤΡΙΚΟΥ ΤΡΙΓΩΝΟΥ',
      prompt: `Ένα τρίγωνο έχει εμβαδόν ${area} cm². Κατασκευάζουμε το συμμετρικό του τρίγωνο ως προς έναν άξονα (ε). Πόσο είναι το εμβαδόν του νέου τριγώνου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${2 * area} cm²`,
        `${area / 2} cm²`,
        `${area + 4} cm²`,
        `${area * 4} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Αρχικό εμβαδόν', value: `${area} cm²` },
        { label: 'Ιδιότητα συμμετρίας', value: 'Τα συμμετρικά σχήματα είναι απολύτως ίσα' },
        { label: 'Νέο εμβαδόν', value: `${area} cm²` }
      ],
      explanation: `Δύο συμμετρικά σχήματα έχουν ίσα εμβαδά, άρα το νέο τρίγωνο έχει εμβαδόν ${area} cm².`
    };
  },
  // 3. Περίμετρος σύνθετου σχήματος από δύο συμμετρικά τρίγωνα
  () => {
    const s1 = randInt(5, 9);
    const s2 = randInt(6, 10);
    // Δύο ισοσκελή τρίγωνα ενωμένα στη βάση τους: εξωτερικές πλευρές 2*s1 + 2*s2
    const totalP = 2 * (s1 + s2);
    const correct = `${totalP} cm`;
    return {
      title: 'ΣΥΝΘΕΤΟ ΣΥΜΜΕΤΡΙΚΟ ΣΧΗΜΑ',
      prompt: `Σχεδιάζουμε ένα τρίγωνο με εξωτερικές πλευρές ${s1} cm και ${s2} cm και το συμμετρικό του ως προς τη βάση του, σχηματίζοντας έναν χαρταετό (δελτοειδές). Πόση είναι η συνολική περίμετρος του νέου σχήματος;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${s1 + s2} cm`,
        `${totalP + 6} cm`,
        `${totalP - 4} cm`,
        `${totalP * 2} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Εξωτερικές πλευρές', value: `2 πλευρές των ${s1} cm και 2 πλευρές των ${s2} cm` },
        { label: 'Πράξη', value: `2 · (${s1} ＋ ${s2}) ＝ 2 · ${s1 + s2}` },
        { label: 'Συνολική περίμετρος', value: `${totalP} cm` }
      ],
      explanation: `Λόγω συμμετρίας οι απέναντι πλευρές είναι ίσες: 2 · ${s1} ＋ 2 · ${s2} ＝ ${totalP} cm.`
    };
  },
  // 4. Γωνία συμμετρικού σχήματος
  () => {
    const deg = randInt(35, 75);
    const correct = `${deg}°`;
    return {
      title: 'ΓΩΝΙΑ ΣΕ ΣΥΜΜΕΤΡΙΚΟ ΣΧΗΜΑ',
      prompt: `Μια γωνία Â ενός σχήματος έχει μέτρο ${deg}°. Πόσο είναι το μέτρο της αντίστοιχης γωνίας Â' στο συμμετρικό σχήμα;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${180 - deg}°`,
        `${90 - deg > 0 ? 90 - deg : deg + 20}°`,
        `${2 * deg}°`,
        `${deg + 15}°`
      ]),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Αρχική γωνία Â', value: `${deg}°` },
        { label: 'Ιδιότητα συμμετρίας', value: 'Διατήρηση μέτρου γωνιών' },
        { label: 'Συμμετρική γωνία Â\'', value: `${deg}° (ακριβώς ίση)` }
      ],
      explanation: `Η αξονική συμμετρία διατηρεί τις γωνίες απολύτως αμετάβλητες: ${deg}°.`
    };
  },
  // 5. Εμβαδόν τετραγώνου και συμμετρικού
  () => {
    const s = randInt(4, 8);
    const area = s * s;
    const correct = `${area} cm²`;
    return {
      title: 'ΕΜΒΑΔΟΝ ΣΥΜΜΕΤΡΙΚΟΥ ΤΕΤΡΑΓΩΝΟΥ',
      prompt: `Ένα τετράγωνο έχει πλευρά ${s} cm (εμβαδόν ${area} cm²). Πόσο είναι το εμβαδόν του συμμετρικού του τετραγώνου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${2 * area} cm²`,
        `${4 * s} cm²`,
        `${area + 8} cm²`,
        `${area * 4} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Αρχικό εμβαδόν', value: `${s} · ${s} ＝ ${area} cm²` },
        { label: 'Συμμετρικό εμβαδόν', value: `${area} cm²` }
      ],
      explanation: `Τα συμμετρικά σχήματα έχουν ίσα εμβαδά: ${area} cm².`
    };
  },
  // 6. Διπλασιασμός εμβαδού από ένωση δύο συμμετρικών
  () => {
    const a = randInt(15, 30);
    const total = 2 * a;
    const correct = `${total} cm²`;
    return {
      title: 'ΕΝΩΣΗ ΔΥΟ ΣΥΜΜΕΤΡΙΚΩΝ ΜΙΣΩΝ',
      prompt: `Ένα σχέδιο πεταλούδας αποτελείται από δύο συμμετρικά φτερά. Αν το αριστερό φτερό έχει εμβαδόν ${a} cm², πόσο είναι το συνολικό εμβαδόν ολόκληρης της πεταλούδας;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${a} cm²`,
        `${total + 10} cm²`,
        `${total - 5} cm²`,
        `${a * a} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Εμβαδόν αριστερού φτερού', value: `${a} cm²` },
        { label: 'Εμβαδόν δεξιού φτερού (συμμετρικό)', value: `${a} cm²` },
        { label: 'Συνολικό εμβαδόν', value: `2 · ${a} ＝ ${total} cm²` }
      ],
      explanation: `Λόγω συμμετρίας και τα δύο φτερά είναι ίσα: ${a} ＋ ${a} ＝ ${total} cm².`
    };
  }
];

// POOL ΓΙΑ Q12: Σύνθετα Προβλήματα Συμμετρίας & Γεωμετρικών Κατασκευών
const PROBLEM_POOL_Q12 = [
  // 1. Ορθογώνιο και διαγώνιος (Σύνηθες Λάθος)
  () => {
    const correct = 'Όχι, γιατί αν διπλώσουμε κατά μήκος της διαγωνίου οι κορυφές δεν εφαρμόζουν';
    return {
      title: 'ΔΙΑΓΩΝΙΟΣ ΟΡΘΟΓΩΝΙΟΥ ΚΑΙ ΣΥΜΜΕΤΡΙΑ',
      prompt: `Είναι η διαγώνιος ενός ορθογωνίου παραλληλογράμμου (με άνισες πλευρές) άξονας συμμετρίας του;`,
      options: ensureFourUniqueOptions(correct, () => [
        'Ναι, γιατί χωρίζει το ορθογώνιο σε 2 ίσα τρίγωνα',
        'Ναι, σε κάθε παραλληλόγραμμο οι διαγώνιοι είναι άξονες',
        'Ναι, μόνο αν το ορθογώνιο είναι πολύ μεγάλο'
      ]),
      correctAnswer: correct,
      unit: 'απάντηση',
      tableData: [
        { label: 'Γεγονός 1', value: 'Η διαγώνιος χωρίζει το ορθογώνιο σε 2 ίσα τρίγωνα' },
        { label: 'Γεγονός 2 (Αναδίπλωση)', value: 'Όταν διπλωθούν, οι γωνίες εξέχουν και ΔΕΝ ταυτίζονται' },
        { label: 'Συμπέρασμα', value: 'Η διαγώνιος του ορθογωνίου ΔΕΝ είναι άξονας συμμετρίας' }
      ],
      explanation: `Παρόλο που η διαγώνιος χωρίζει το ορθογώνιο σε 2 ίσα τρίγωνα, κατά την αναδίπλωση τα τρίγωνα δεν εφαρμόζουν το ένα πάνω στο άλλο, άρα δεν είναι άξονας συμμετρίας.`
    };
  },
  // 2. Πλάγιο παραλληλόγραμμο
  () => {
    const correct = '0 άξονες συμμετρίας (κανέναν)';
    return {
      title: 'ΑΞΟΝΕΣ ΠΛΑΓΙΟΥ ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟΥ',
      prompt: `Πόσους άξονες αξονικής συμμετρίας έχει ένα γενικό πλάγιο παραλληλόγραμμο (που δεν είναι ορθογώνιο ούτε ρόμβος);`,
      options: ensureFourUniqueOptions(correct, () => [
        '2 άξονες συμμετρίας',
        '1 άξονα συμμετρίας',
        '4 άξονες συμμετρίας',
        'Άπειρους άξονες'
      ]),
      correctAnswer: correct,
      unit: 'άξονες',
      tableData: [
        { label: 'Σχήμα', value: 'Πλάγιο παραλληλόγραμμο' },
        { label: 'Αξονική συμμετρία', value: 'Καμία ευθεία δεν διπλώνει το σχήμα ώστε να ταυτιστεί' },
        { label: 'Αποτέλεσμα', value: '0 άξονες συμμετρίας' }
      ],
      explanation: `Το πλάγιο παραλληλόγραμμο έχει κεντρική συμμετρία (ως προς το κέντρο του), αλλά δεν έχει κανέναν άξονα αξονικής συμμετρίας.`
    };
  },
  // 3. Τετράγωνο vs Ρόμβος
  () => {
    const correct = '4 άξονες το τετράγωνο και 2 άξονες ο ρόμβος';
    return {
      title: 'ΣΥΓΚΡΙΣΗ ΑΞΟΝΩΝ ΤΕΤΡΑΓΩΝΟΥ ΚΑΙ ΡΟΜΒΟΥ',
      prompt: `Πόσους άξονες συμμετρίας έχουν αντίστοιχα ένα τετράγωνο και ένας ρόμβος (μη τετράγωνος);`,
      options: ensureFourUniqueOptions(correct, () => [
        '4 άξονες και τα δύο',
        '2 άξονες και τα δύο',
        '4 άξονες ο ρόμβος και 2 το τετράγωνο',
        'Άπειρους άξονες και τα δύο'
      ]),
      correctAnswer: correct,
      unit: 'άξονες',
      tableData: [
        { label: 'Τετράγωνο', value: '4 άξονες (2 μεσοκάθετες ＋ 2 διαγώνιοι)' },
        { label: 'Ρόμβος', value: '2 άξονες (μόνο οι 2 διαγώνιοι)' }
      ],
      explanation: `Το τετράγωνο έχει 4 άξονες συμμετρίας, ενώ ο ρόμβος έχει μόνο 2 άξονες (τις δύο διαγωνίους του).`
    };
  },
  // 4. Τραπέζιο ισοσκελές
  () => {
    const correct = '1 άξονα συμμετρίας (τη μεσοκάθετο των βάσεων)';
    return {
      title: 'ΑΞΟΝΑΣ ΙΣΟΣΚΕΛΟΥΣ ΤΡΑΠΕΖΙΟΥ',
      prompt: `Πόσους άξονες συμμετρίας έχει ένα ισοσκελές τραπέζιο;`,
      options: ensureFourUniqueOptions(correct, () => [
        '2 άξονες συμμετρίας',
        '4 άξονες συμμετρίας',
        'Κανέναν άξονα συμμετρίας',
        '3 άξονες συμμετρίας'
      ]),
      correctAnswer: correct,
      unit: 'άξονες',
      tableData: [
        { label: 'Σχήμα', value: 'Ισοσκελές τραπέζιο' },
        { label: 'Άξονας', value: 'Η ευθεία που ενώνει τα μέσα των δύο παράλληλων βάσεων' },
        { label: 'Πλήθος', value: '1 άξονας συμμετρίας' }
      ],
      explanation: `Το ισοσκελές τραπέζιο έχει ακριβώς 1 άξονα συμμετρίας, τη μεσοκάθετο των δύο παράλληλων βάσεών του.`
    };
  },
  // 5. Συντεταγμένες συμμετρικού σημείου
  () => {
    const x = randInt(2, 7);
    const y = randInt(3, 8);
    const correct = `(-${x}, ${y})`;
    return {
      title: 'ΣΥΜΜΕΤΡΙΑ ΩΣ ΠΡΟΣ ΤΟΝ ΑΞΟΝΑ Y',
      prompt: `Σε ένα σύστημα αξόνων, το σημείο Α έχει συντεταγμένες (${x}, ${y}). Ποιες είναι οι συντεταγμένες του συμμετρικού του σημείου Α' ως προς τον κατακόρυφο άξονα y;`,
      options: ensureFourUniqueOptions(correct, () => [
        `(${x}, -${y})`,
        `(-${x}, -${y})`,
        `(${y}, ${x})`,
        `(${x + 2}, ${y})`
      ]),
      correctAnswer: correct,
      unit: 'συντεταγμένες',
      tableData: [
        { label: 'Αρχικό σημείο', value: `(${x}, ${y})` },
        { label: 'Άξονας συμμετρίας', value: 'Κατακόρυφος άξονας y (x ＝ 0)' },
        { label: 'Μεταβολή συντεταγμένων', value: 'Το x αλλάζει πρόσημο, το y μένει ίδιο' },
        { label: 'Συμμετρικό σημείο', value: `(-${x}, ${y})` }
      ],
      explanation: `Στη συμμετρία ως προς τον κατακόρυφο άξονα y, η τετμημένη x αλλάζει πρόσημο ενώ η τεταγμένη y παραμένει ίδια: (-${x}, ${y}).`
    };
  },
  // 6. Γράμματα της αλφαβήτου με άξονα συμμετρίας
  () => {
    const correct = 'Το γράμμα Α (έχει 1 κατακόρυφο άξονα συμμετρίας)';
    return {
      title: 'ΣΥΜΜΕΤΡΙΑ ΣΤΑ ΚΕΦΑΛΑΙΑ ΓΡΑΜΜΑΤΑ',
      prompt: `Ποιο από τα παρακάτω κεφαλαία γράμματα έχει άξονα συμμετρίας;`,
      options: ensureFourUniqueOptions(correct, () => [
        'Το γράμμα Γ',
        'Το γράμμα Ρ',
        'Το γράμμα Σ',
        'Το γράμμα F'
      ]),
      correctAnswer: correct,
      unit: 'γράμμα',
      tableData: [
        { label: 'Γράμμα Α', value: 'Έχει κατακόρυφο άξονα συμμετρίας στο μέσο του' },
        { label: 'Γράμματα Γ, Ρ, Σ', value: 'Δεν έχουν κανέναν άξονα συμμετρίας' }
      ],
      explanation: `Το κεφαλαίο γράμμα Α χωρίζεται από έναν κατακόρυφο άξονα στο μέσο του σε δύο απόλυτα συμμετρικά μισά.`
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 12 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet() {
  const qs = [];

  // Q1: Ορισμός άξονα συμμετρίας (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: 'ΟΡΙΣΜΟΣ ΑΞΟΝΑ ΣΥΜΜΕΤΡΙΑΣ',
    prompt: isQ1True
      ? 'Αν διπλώσουμε ένα σχήμα κατά μήκος ενός άξονα συμμετρίας του, τα δύο μέρη εφαρμόζουν απόλυτα το ένα πάνω στο άλλο.'
      : 'Κάθε ευθεία γραμμή που χωρίζει ένα σχήμα σε δύο ίσα μέρη είναι υποχρεωτικά και άξονας συμμετρίας του.',
    correctAnswer: isQ1True,
    tableData: [
      { label: 'Κανόνας αναδίπλωσης', value: 'Τα δύο μέρη πρέπει να ταυτίζονται απόλυτα κατά το δίπλωμα' },
      { label: 'Αντιπαράδειγμα', value: 'Η διαγώνιος του ορθογωνίου χωρίζει σε 2 ίσα τρίγωνα, αλλά ΔΕΝ είναι άξονας συμμετρίας' }
    ],
    explanation: isQ1True
      ? 'ΣΩΣΤΟ: Αυτός είναι ο θεμελιώδης ορισμός του άξονα συμμετρίας: η τέλεια εφαρμογή κατά την αναδίπλωση.'
      : 'ΛΑΘΟΣ: Δεν αρκεί να έχουν ίσο εμβαδόν. Πρέπει τα δύο μέρη να ταυτίζονται ακριβώς όταν διπλωθούν (π.χ. η διαγώνιος του ορθογωνίου δεν είναι άξονας).'
  });

  // Q2: Κάθετη απόσταση συμμετρικών σημείων (MCQ)
  qs.push({
    id: 2,
    type: 'mcq',
    title: 'ΙΔΙΟΤΗΤΑ ΣΥΜΜΕΤΡΙΚΩΝ ΣΗΜΕΙΩΝ',
    prompt: 'Πώς συνδέονται δύο συμμετρικά σημεία Α και Α\' με τον άξονα συμμετρίας (ε);',
    options: ensureFourUniqueOptions(
      'Ο άξονας είναι η μεσοκάθετος του τμήματος ΑΑ\' (κάθετος και περνά από το μέσο)',
      () => [
        'Ο άξονας σχηματίζει οποιαδήποτε τυχαία γωνία με το τμήμα ΑΑ\'',
        'Το σημείο Α είναι πάντα πιο κοντά στον άξονα από το Α\'',
        'Τα δύο σημεία βρίσκονται πάντα πάνω στον ίδιο τον άξονα'
      ]
    ),
    correctAnswer: 'Ο άξονας είναι η μεσοκάθετος του τμήματος ΑΑ\' (κάθετος και περνά από το μέσο)',
    tableData: [
      { label: 'Γωνία με τον άξονα', value: 'Αυστηρά 90° (κάθετη)' },
      { label: 'Αποστάσεις', value: 'd₁ ＝ d₂ (ισαπέχουν)' },
      { label: 'Συμπέρασμα', value: 'Μεσοκάθετος του ευθύγραμμου τμήματος' }
    ],
    explanation: 'Ο άξονας συμμετρίας είναι πάντοτε η μεσοκάθετος του τμήματος που ενώνει τα δύο συμμετρικά σημεία.'
  });

  // Q3: Άξονες συμμετρίας τετραγώνου (MCQ)
  qs.push({
    id: 3,
    type: 'mcq',
    title: 'ΑΞΟΝΕΣ ΣΥΜΜΕΤΡΙΑΣ ΤΕΤΡΑΓΩΝΟΥ',
    prompt: 'Πόσους άξονες συμμετρίας έχει συνολικά ένα τετράγωνο;',
    options: ensureFourUniqueOptions('4 άξονες συμμετρίας', () => [
      '2 άξονες συμμετρίας',
      '1 άξονα συμμετρίας',
      '8 άξονες συμμετρίας'
    ]),
    correctAnswer: '4 άξονες συμμετρίας',
    tableData: [
      { label: '2 μεσοκάθετοι', value: 'Κατακόρυφη και οριζόντια μεσοκάθετος πλευρών' },
      { label: '2 διαγώνιοι', value: 'Οι δύο διαγώνιοι του τετραγώνου' },
      { label: 'Σύνολο', value: '4 άξονες συμμετρίας' }
    ],
    explanation: 'Το τετράγωνο έχει 4 άξονες συμμετρίας: τις 2 μεσοκάθετες των απέναντι πλευρών και τις 2 διαγωνίους του.'
  });

  // Q4: Οπτική αναγνώριση άξονα συμμετρίας (SVG - No Giveaway)
  qs.push({
    id: 4,
    type: 'mcq',
    title: 'ΑΝΑΓΝΩΡΙΣΗ ΑΞΟΝΑ ΣΕ ΙΣΟΣΚΕΛΕΣ ΤΡΙΓΩΝΟ',
    prompt: 'Στο παρακάτω ισοσκελές τρίγωνο, ποια γραμμή αποτελεί τον πραγματικό άξονα συμμετρίας του;',
    svg: (
      <svg viewBox="0 0 160 120" className="w-40 h-28 mx-auto my-2 select-none drop-shadow-sm">
        <polygon points="80,20 30,100 130,100" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2.5" />
        <line x1="80" y1="10" x2="80" y2="110" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="80" cy="20" r="3" fill="#e11d48" />
        <text x="88" y="15" fill="#f59e0b" fontSize="9" fontWeight="bold">(ε)</text>
      </svg>
    ),
    options: ensureFourUniqueOptions(
      'Η κατακόρυφη γραμμή (ε) από την κορυφή προς τη βάση',
      () => [
        'Η οριζόντια γραμμή της κάτω βάσης',
        'Μία από τις πλάγιες πλευρές του τριγώνου',
        'Το ισοσκελές τρίγωνο δεν έχει κανέναν άξονα'
      ]
    ),
    correctAnswer: 'Η κατακόρυφη γραμμή (ε) από την κορυφή προς τη βάση',
    tableData: [
      { label: 'Σχήμα', value: 'Ισοσκελές τρίγωνο' },
      { label: 'Άξονας συμμετρίας', value: 'Η μεσοκάθετος της βάσης που διέρχεται από την κορυφή' }
    ],
    explanation: 'Στο ισοσκελές τρίγωνο ο μοναδικός άξονας συμμετρίας είναι η κατακόρυφη ευθεία που ξεκινά από την κορυφή και χωρίζει τη βάση στη μέση.'
  });

  // Q5: Υπολογισμός απόστασης σημείου (Input αριθμού)
  const d5 = randInt(4, 9);
  const total5 = 2 * d5;
  qs.push({
    id: 5,
    type: 'input',
    title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΑΠΟΣΤΑΣΗΣ ΣΗΜΕΙΟΥ ΑΠΟ ΑΞΟΝΑ',
    prompt: `Δύο συμμετρικά σημεία Α και Α' απέχουν μεταξύ τους συνολικά ${total5} cm. Πόσα εκατοστά (cm) απέχει το σημείο Α από τον άξονα συμμετρίας; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(d5),
    tableData: [
      { label: 'Συνολικό μήκος ΑΑ\'', value: `${total5} cm` },
      { label: 'Πράξη', value: `${total5} : 2` },
      { label: 'Απόσταση από άξονα', value: `${d5} cm` }
    ],
    explanation: `Ο άξονας περνάει ακριβώς από τη μέση του τμήματος ΑΑ': ${total5} : 2 ＝ ${d5} cm.`
  });

  // Q6: Άξονες συμμετρίας ορθογωνίου (Input αριθμού)
  qs.push({
    id: 6,
    type: 'input',
    title: 'ΠΛΗΘΟΣ ΑΞΟΝΩΝ ΟΡΘΟΓΩΝΙΟΥ',
    prompt: 'Πόσους άξονες συμμετρίας έχει ένα ορθογώνιο παραλληλόγραμμο (με άνισες πλευρές); (Γράψτε μόνο τον αριθμό)',
    correctAnswer: '2',
    tableData: [
      { label: 'Σχήμα', value: 'Ορθογώνιο παραλληλόγραμμο' },
      { label: 'Άξονες', value: '2 (οι μεσοκάθετες των απέναντι πλευρών)' }
    ],
    explanation: 'Το ορθογώνιο έχει ακριβώς 2 άξονες συμμετρίας (την κατακόρυφη και την οριζόντια μεσοκάθετο). Οι διαγώνιοί του δεν είναι άξονες.'
  });

  // Q7: Ιδιότητες συμμετρικών σχημάτων (MCQ)
  qs.push({
    id: 7,
    type: 'mcq',
    title: 'ΙΣΟΤΗΤΑ ΣΥΜΜΕΤΡΙΚΩΝ ΣΧΗΜΑΤΩΝ',
    prompt: 'Ποια από τις παρακάτω προτάσεις ισχύει για δύο συμμετρικά γεωμετρικά σχήματα;',
    options: ensureFourUniqueOptions(
      'Είναι απολύτως ίσα μεταξύ τους σε πλευρές, γωνίες, περίμετρο και εμβαδόν',
      () => [
        'Το συμμετρικό σχήμα είναι πάντα διπλάσιο σε μέγεθος',
        'Το συμμετρικό σχήμα έχει διαφορετικές γωνίες',
        'Έχουν ίση περίμετρο αλλά διαφορετικό εμβαδόν'
      ]
    ),
    correctAnswer: 'Είναι απολύτως ίσα μεταξύ τους σε πλευρές, γωνίες, περίμετρο και εμβαδόν',
    tableData: [
      { label: 'Αξονική συμμετρία', value: 'Ισομετρία (διατήρηση όλων των μεγεθών)' },
      { label: 'Σχέση σχημάτων', value: 'Απολύτως ίσα σχήματα' }
    ],
    explanation: 'Η αξονική συμμετρία διατηρεί τα μήκη, τις γωνίες και τα εμβαδά, άρα τα δύο σχήματα είναι απολύτως ίσα.'
  });

  // Q8: Άξονες κανονικού εξαγώνου (MCQ)
  qs.push({
    id: 8,
    type: 'mcq',
    title: 'ΑΞΟΝΕΣ ΚΑΝΟΝΙΚΟΥ ΕΞΑΓΩΝΟΥ',
    prompt: 'Πόσους άξονες συμμετρίας έχει ένα κανονικό εξάγωνο;',
    options: ensureFourUniqueOptions('6 άξονες συμμετρίας', () => [
      '3 άξονες συμμετρίας',
      '4 άξονες συμμετρίας',
      '12 άξονες συμμετρίας'
    ]),
    correctAnswer: '6 άξονες συμμετρίας',
    tableData: [
      { label: 'Κανόνας', value: 'Κάθε κανονικό ν-γωνο έχει ν άξονες συμμετρίας' },
      { label: 'Κανονικό εξάγωνο', value: 'ν ＝ 6, άρα 6 άξονες' }
    ],
    explanation: 'Κάθε κανονικό πολύγωνο με ν πλευρές έχει ν άξονες συμμετρίας: το κανονικό εξάγωνο έχει 6 άξονες.'
  });

  // Q9: Πρόβλημα από PROBLEM_POOL_Q9
  const p9 = PROBLEM_POOL_Q9[randInt(0, PROBLEM_POOL_Q9.length - 1)]();
  qs.push({ id: 9, type: 'mcq', ...p9 });

  // Q10: Πρόβλημα από PROBLEM_POOL_Q10
  const p10 = PROBLEM_POOL_Q10[randInt(0, PROBLEM_POOL_Q10.length - 1)]();
  qs.push({ id: 10, type: 'mcq', ...p10 });

  // Q11: Πρόβλημα από PROBLEM_POOL_Q11
  const p11 = PROBLEM_POOL_Q11[randInt(0, PROBLEM_POOL_Q11.length - 1)]();
  qs.push({ id: 11, type: 'mcq', ...p11 });

  // Q12: Πρόβλημα από PROBLEM_POOL_Q12
  const p12 = PROBLEM_POOL_Q12[randInt(0, PROBLEM_POOL_Q12.length - 1)]();
  qs.push({ id: 12, type: 'mcq', ...p12 });

  return qs;
}

// -------------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΑΣΚΗΣΕΩΝ
// -------------------------------------------------------------

export default function SimmetriaAskiseisPage() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadNewSet();
  }, []);

  function loadNewSet() {
    const newQs = generateQuestionsSet();
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

  return (
    <Layout
      title="Ασκήσεις: Αξονική Συμμετρία &amp; Άξονας Συμμετρίας - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις στην αξονική συμμετρία, τους άξονες συμμετρίας και τα συμμετρικά σχήματα για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou/71-simmetria"
      backText="Θεωρία Κεφ. 71"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/71-simmetria"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>📖 Θεωρία</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden">

        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden mb-8 sm:mb-12">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 71 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {toCleanUppercase('Ασκησεις: Αξονικη Συμμετρια και Αξονες')}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Εξασκηθείτε στους άξονες συμμετρίας των γεωμετρικών σχημάτων, τις αποστάσεις συμμετρικών σημείων και τις ιδιότητες της αναδίπλωσης μέσα από 12 δυναμικές ερωτήσεις.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>12 Δυναμικές Ασκήσεις με Αυτόματη Αξιολόγηση &amp; Αναλυτική Επεξήγηση</span>
            </div>
            <button
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>🔄 {toCleanUppercase('Νεες Ασκησεις')}</span>
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
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-sm sm:text-base border border-indigo-150">
                      {index + 1}
                    </span>
                    <h2 className="text-xs sm:text-sm font-black text-slate-800 tracking-wider">
                      {toCleanUppercase(q.title || `ΕΡΩΤΗΣΗ ${index + 1}`)}
                    </h2>
                  </div>

                  {submitted && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black tracking-wider ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? toCleanUppercase('ΣΩΣΤΟ') : toCleanUppercase('ΛΑΘΟΣ')}
                    </span>
                  )}
                </div>

                {/* ΕΚΦΩΝΗΣΗ & SVG (NO-GIVEAWAY: ΟΥΔΕΙΣ ΠΙΝΑΚΑΣ ΕΔΩ) */}
                <div className="mb-6 space-y-3">
                  <p className="text-slate-800 text-sm sm:text-base font-semibold leading-relaxed">
                    {q.prompt}
                  </p>
                  {q.svg && <div className="py-2">{q.svg}</div>}
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
                            {val ? toCleanUppercase('ΣΩΣΤΟ') : toCleanUppercase('ΛΑΘΟΣ')}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* ΤΥΠΟΣ 2: MCQ (4 ΜΟΝΑΔΙΚΑ ΚΟΥΜΠΙΑ) */}
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
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                isSelected
                                  ? 'bg-white text-indigo-700'
                                  : 'bg-white text-slate-500 border border-slate-200'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="break-words whitespace-normal leading-snug flex-1">
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
                        placeholder="Απάντηση..."
                        value={userAns || ''}
                        onChange={(e) => {
                          const cleaned = e.target.value
                            .replace(/[^0-9.,]/g, '')
                            .replace(/\./g, ',');
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
                    {/* ΠΙΝΑΚΑΣ ΔΕΔΟΜΕΝΩΝ (TABLEDATA) ΜΟΝΟ ΕΔΩ */}
                    {q.tableData && q.tableData.length > 0 && (
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/60 p-1">
                        <table className="w-full text-left text-xs sm:text-sm">
                          <tbody>
                            {q.tableData.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className={rIdx !== q.tableData.length - 1 ? 'border-b border-slate-200/60' : ''}
                              >
                                <td className="py-2.5 px-3 font-bold text-slate-600 bg-slate-100/70 w-1/3">
                                  {row.label}
                                </td>
                                <td className="py-2.5 px-3 font-semibold text-slate-800">
                                  {row.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* ΑΝΑΛΥΤΙΚΗ ΕΠΕΞΗΓΗΣΗ */}
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                          : 'bg-rose-50 text-rose-950 border border-rose-200'
                      }`}
                    >
                      <p className="font-bold mb-1">
                        {isCorrect
                          ? '✓ Μπράβο! Σωστή απάντηση.'
                          : `✗ Λάθος. Η σωστή απάντηση είναι: ${
                              q.type === 'boolean'
                                ? q.correctAnswer
                                  ? 'Σωστό'
                                  : 'Λάθος'
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
        <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6">
          <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-8">
              {!submitted ? (
                <div className="text-xs sm:text-sm font-semibold text-slate-300">
                  <span>{toCleanUppercase('ΑΠΑΝΤΗΘΗΚΑΝ:')} </span>
                  <span className="font-black text-indigo-400 text-sm sm:text-base">
                    {answeredCount} / {totalCount}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    <span>{toCleanUppercase('ΣΚΟΡ:')} </span>
                    <span className="font-black text-emerald-400 text-sm sm:text-base">
                      {score} / {totalCount}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    <span>{toCleanUppercase('ΠΟΣΟΣΤΟ:')} </span>
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
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/25 transition-all text-xs sm:text-sm"
                >
                  {toCleanUppercase('ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={loadNewSet}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-xs sm:text-sm flex items-center gap-2"
                >
                  <span>🔄</span>
                  <span>{toCleanUppercase('ΝΕΕΣ ΑΣΚΗΣΕΙΣ')}</span>
                </button>
              )}
            </div>
          </div>
        </footer>

      </div>
    </Layout>
  );
}
