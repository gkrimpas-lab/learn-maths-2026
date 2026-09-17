import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[j], arr[i]] = [arr[i], arr[j]];
  }
  return arr;
};

const makeUniqueOptions = (correct, wrongCandidates) => {
  const unique = new Set([correct]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && opt !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }
  return shuffleArray(Array.from(unique));
};

// ========================================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΠΡΑΞΕΩΝ ΚΑΙ ΘΕΩΡΙΑΣ ΑΦΑΙΡΕΣΗΣ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Θετικός μείον Θετικός με θετικό αποτέλεσμα (Input)
  () => {
    const b = randInt(4, 15);
    const a = b + randInt(3, 18);
    const ans = a - b;
    return {
      type: 'input',
      topic: 'ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ',
      question: `Υπολόγισε τη διαφορά: (＋${a}) － (＋${b})`,
      correctAnswer: ans.toString(),
      solution: `Μετατρέπουμε σε πρόσθεση του αντιθέτου: (＋${a}) ＋ (－${b}) ＝ ＋(${a} － ${b}) ＝ ＋${ans}.`,
    };
  },

  // 2. Θετικός μείον Θετικός με αρνητικό αποτέλεσμα (Input)
  () => {
    const a = randInt(3, 12);
    const b = a + randInt(4, 16);
    const ans = a - b;
    return {
      type: 'input',
      topic: 'ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ',
      question: `Υπολόγισε τη διαφορά: (＋${a}) － (＋${b})`,
      correctAnswer: ans.toString(),
      solution: `(＋${a}) ＋ (－${b}) ＝ －(${b} － ${a}) ＝ ${ans}.`,
    };
  },

  // 3. Θετικός μείον Αρνητικός (Input)
  () => {
    const a = randInt(5, 20);
    const b = randInt(4, 18);
    const ans = a + b;
    return {
      type: 'input',
      topic: 'ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ',
      question: `Υπολόγισε τη διαφορά: (＋${a}) － (－${b})`,
      correctAnswer: ans.toString(),
      solution: `Ο αντίθετος του －${b} είναι το ＋${b}: (＋${a}) ＋ (＋${b}) ＝ ＋(${a} ＋ ${b}) ＝ ＋${ans}.`,
    };
  },

  // 4. Αρνητικός μείον Θετικός (Input)
  () => {
    const a = randInt(6, 22);
    const b = randInt(5, 18);
    const ans = -a - b;
    return {
      type: 'input',
      topic: 'ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ',
      question: `Υπολόγισε τη διαφορά: (－${a}) － (＋${b})`,
      correctAnswer: ans.toString(),
      solution: `(－${a}) ＋ (－${b}) ＝ －(${a} ＋ ${b}) ＝ ${ans}.`,
    };
  },

  // 5. Αρνητικός μείον Αρνητικός με θετικό αποτέλεσμα (Input)
  () => {
    const a = randInt(3, 12);
    const b = a + randInt(4, 15);
    const ans = -a + b;
    return {
      type: 'input',
      topic: 'ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ',
      question: `Υπολόγισε τη διαφορά: (－${a}) － (－${b})`,
      correctAnswer: ans.toString(),
      solution: `Ο αντίθετος του －${b} είναι το ＋${b}: (－${a}) ＋ (＋${b}) ＝ ＋(${b} － ${a}) ＝ ＋${ans}.`,
    };
  },

  // 6. Αρνητικός μείον Αρνητικός με αρνητικό αποτέλεσμα (Input)
  () => {
    const b = randInt(3, 12);
    const a = b + randInt(4, 16);
    const ans = -a + b;
    return {
      type: 'input',
      topic: 'ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ',
      question: `Υπολόγισε τη διαφορά: (－${a}) － (－${b})`,
      correctAnswer: ans.toString(),
      solution: `(－${a}) ＋ (＋${b}) ＝ －(${a} － ${b}) ＝ ${ans}.`,
    };
  },

  // 7. Αφαίρεση ίσων αριθμών (Input)
  () => {
    const n = randInt(10, 80);
    return {
      type: 'input',
      topic: 'ΑΦΑΙΡΕΣΗ ΑΚΕΡΑΙΩΝ',
      question: `Υπολόγισε: (－${n}) － (－${n})`,
      correctAnswer: '0',
      solution: `(－${n}) ＋ (＋${n}) ＝ 0. Η διαφορά δύο ίσων αριθμών ισούται πάντοτε με 0.`,
    };
  },

  // 8. Αφαίρεση του μηδενός (Input)
  () => {
    const n = randInt(7, 45);
    return {
      type: 'input',
      topic: 'ΙΔΙΟΤΗΤΕΣ ΑΦΑΙΡΕΣΗΣ',
      question: `Υπολόγισε: (－${n}) － 0`,
      correctAnswer: `-${n}`,
      solution: `Η αφαίρεση του 0 δεν μεταβάλλει τον αριθμό: (－${n}) － 0 ＝ －${n}.`,
    };
  },

  // 9. Αφαίρεση από το μηδέν (Input)
  () => {
    const n = randInt(8, 50);
    return {
      type: 'input',
      topic: 'ΙΔΙΟΤΗΤΕΣ ΑΦΑΙΡΕΣΗΣ',
      question: `Υπολόγισε: 0 － (＋${n})`,
      correctAnswer: `-${n}`,
      solution: `0 ＋ (－${n}) ＝ －${n}.`,
    };
  },

  // 10. Αφαίρεση αρνητικού από το μηδέν (Input)
  () => {
    const n = randInt(9, 60);
    return {
      type: 'input',
      topic: 'ΙΔΙΟΤΗΤΕΣ ΑΦΑΙΡΕΣΗΣ',
      question: `Υπολόγισε: 0 － (－${n})`,
      correctAnswer: n.toString(),
      solution: `0 ＋ (＋${n}) ＝ ＋${n}.`,
    };
  },

  // 11. Απλοποιημένη μορφή χωρίς παρενθέσεις (Input)
  () => {
    const a = randInt(8, 20);
    const b = randInt(12, 30);
    const ans = a - b;
    return {
      type: 'input',
      topic: 'ΑΠΛΟΠΟΙΗΜΕΝΗ ΓΡΑΦΗ',
      question: `Υπολόγισε: ${a} － ${b}`,
      correctAnswer: ans.toString(),
      solution: `${a} － ${b} ＝ －(${b} － ${a}) ＝ ${ans}.`,
    };
  },

  // 12. Δύο αρνητικοί σε απλοποιημένη γραφή (Input)
  () => {
    const a = randInt(5, 18);
    const b = randInt(6, 22);
    const ans = -a - b;
    return {
      type: 'input',
      topic: 'ΑΠΛΟΠΟΙΗΜΕΝΗ ΓΡΑΦΗ',
      question: `Υπολόγισε: －${a} － ${b}`,
      correctAnswer: ans.toString(),
      solution: `－${a} － ${b} ＝ －(${a} ＋ ${b}) ＝ ${ans}.`,
    };
  },

  // 13. Κανόνας μετατροπής σε πρόσθεση (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΘΕΩΡΙΑ ΑΦΑΙΡΕΣΗΣ',
      question: `Ποια ισότητα εκφράζει τον βασικό κανόνα της αφαίρεσης ακεραίων;`,
      options: makeUniqueOptions(
        'α － β ＝ α ＋ (－β)',
        ['α － β ＝ α － (－β)', 'α － β ＝ (－α) ＋ β', 'α － β ＝ β － α']
      ),
      correctAnswer: 'α － β ＝ α ＋ (－β)',
      solution: `Για να αφαιρέσουμε έναν αριθμό β από τον α, προσθέτουμε στον α τον αντίθετο του β: α － β ＝ α ＋ (－β).`,
    };
  },

  // 14. Απαλοιφή διπλού αρνητικού προσήμου (MCQ)
  () => {
    const n = randInt(12, 40);
    return {
      type: 'mcq',
      topic: 'ΑΠΑΛΟΙΦΗ ΠΑΡΕΝΘΕΣΕΩΝ',
      question: `Πώς απλοποιείται η έκφραση －(－${n});`,
      options: makeUniqueOptions(`＋${n}`, [`－${n}`, '0', `＋1`]),
      correctAnswer: `＋${n}`,
      solution: `Το πρόσημο πλην έξω από την παρένθεση αλλάζει το πρόσημο του εσωτερικού όρου στον αντίθετό του: －(－${n}) ＝ ＋${n}.`,
    };
  },

  // 15. Παράσταση τριών όρων με αφαιρέσεις (Input)
  () => {
    const a = randInt(10, 25);
    const b = randInt(4, 15);
    const c = randInt(5, 18);
    const ans = a - b + c;
    return {
      type: 'input',
      topic: 'ΣΥΝΘΕΤΕΣ ΠΑΡΑΣΤΑΣΕΙΣ',
      question: `Υπολόγισε: (＋${a}) － (＋${b}) － (－${c})`,
      correctAnswer: ans.toString(),
      solution: `Μετατρέπουμε σε προσθέσεις: (＋${a}) ＋ (－${b}) ＋ (＋${c}) ＝ ${a} － ${b} ＋ ${c} ＝ ${ans}.`,
    };
  },

  // 16. Εύρεση άγνωστου μειωτέου: x - (-b) = c (Input)
  () => {
    const b = randInt(4, 12);
    const c = randInt(15, 30);
    // x - (-b) = c <=> x + b = c <=> x = c - b
    const x = c - b;
    return {
      type: 'input',
      topic: 'ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ',
      question: `Βρες τον ακέραιο x ώστε: x － (－${b}) ＝ ${c}`,
      correctAnswer: x.toString(),
      solution: `x － (－${b}) ＝ ${c} ⇔ x ＋ ${b} ＝ ${c} ⇔ x ＝ ${c} － ${b} ＝ ${x}.`,
    };
  },

  // 17. Εύρεση άγνωστου αφαιρετέου: a - x = b (Input)
  () => {
    const a = randInt(5, 15);
    const target = randInt(16, 25);
    // a - x = target <=> x = a - target
    const x = a - target;
    return {
      type: 'input',
      topic: 'ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ',
      question: `Βρες τον ακέραιο x ώστε: (＋${a}) － x ＝ ${target}`,
      correctAnswer: x.toString(),
      solution: `x ＝ (＋${a}) － ${target} ＝ ${a} － ${target} ＝ ${x}.`,
    };
  },

  // 18. Αντιμεταθετική ιδιότητα στην αφαίρεση (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΘΕΩΡΙΑ ΑΦΑΙΡΕΣΗΣ',
      question: `Ισχύει η αντιμεταθετική ιδιότητα στην αφαίρεση ακεραίων (δηλαδή α － β ＝ β － α);`,
      options: makeUniqueOptions(
        'Όχι, γενικά δεν ισχύει (ισχύει μόνο αν α ＝ β)',
        ['Ναι, ισχύει πάντοτε', 'Ισχύει μόνο για θετικούς αριθμούς', 'Ισχύει μόνο για αρνητικούς αριθμούς']
      ),
      correctAnswer: 'Όχι, γενικά δεν ισχύει (ισχύει μόνο αν α ＝ β)',
      solution: `Στην αφαίρεση δεν ισχύει η αντιμεταθετική ιδιότητα. Τα αποτελέσματα α － β και β － α είναι αντίθετοι αριθμοί.`,
    };
  },

  // 19. Διαφορά απολύτων τιμών με αφαίρεση (Input)
  () => {
    const a = randInt(10, 20);
    const b = randInt(2, 8);
    const inside = -a - b; // -a - (+b) = -a - b
    const ans = Math.abs(inside);
    return {
      type: 'input',
      topic: 'ΑΠΟΛΥΤΗ ΤΙΜΗ & ΑΦΑΙΡΕΣΗ',
      question: `Υπολόγισε την τιμή: |(－${a}) － (＋${b})|`,
      correctAnswer: ans.toString(),
      solution: `Μέσα στην απόλυτη τιμή: (－${a}) ＋ (－${b}) ＝ －${a + b}. Άρα |－${a + b}| ＝ ${ans}.`,
    };
  },

  // 20. Αφαίρεση με αντίθετους όρους (Input)
  () => {
    const a = randInt(12, 35);
    const b = randInt(4, 16);
    const ans = -b;
    return {
      type: 'input',
      topic: 'ΕΞΥΠΝΟΣ ΥΠΟΛΟΓΙΣΜΟΣ',
      question: `Υπολόγισε έξυπνα: (＋${a}) － (＋${b}) － (＋${a})`,
      correctAnswer: ans.toString(),
      solution: `(＋${a}) ＋ (－${b}) ＋ (－${a}). Οι όροι ＋${a} και －${a} είναι αντίθετοι και δίνουν άθροισμα 0, άρα απομένει το －${b}.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΑΦΑΙΡΕΣΗΣ & ΔΙΑΦΟΡΑΣ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Θερμοκρασιακό εύρος (διαφορά μέγιστης - ελάχιστης)
  () => {
    const minT = randInt(3, 8);
    const maxT = randInt(6, 15);
    const ans = maxT - (-minT);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question: `Στην Τρίπολη η ελάχιστη θερμοκρασία της ημέρας ήταν －${minT} °C και η μέγιστη ＋${maxT} °C. Πόσους βαθμούς Κελσίου διαφορά είχαν η μέγιστη με την ελάχιστη θερμοκρασία;`,
      correctAnswer: ans.toString(),
      solution: `Υπολογίζουμε τη διαφορά μέγιστης μείον ελάχιστης: (＋${maxT}) － (－${minT}) ＝ ${maxT} ＋ ${minT} ＝ ${ans} °C.`,
    };
  },

  // Πρόβλημα 2: Διαφορά υψομέτρου κορυφής και βυθού
  () => {
    const mountain = randInt(800, 1800);
    const seaFloor = randInt(200, 600);
    const ans = mountain - (-seaFloor);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΥΨΟΜΕΤΡΟ',
      question: `Μια βουνοκορφή έχει υψόμετρο ＋${mountain} m και το πλησιέστερο θαλάσσιο ρήγμα έχει βάθος ${seaFloor} m (υψόμετρο －${seaFloor} m). Ποια είναι η υψομετρική τους διαφορά σε μέτρα;`,
      correctAnswer: ans.toString(),
      solution: `Αφαιρούμε το χαμηλότερο υψόμετρο από το υψηλότερο: (＋${mountain}) － (－${seaFloor}) ＝ ${mountain} ＋ ${seaFloor} ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 3: Διαφορά ετών π.Χ. και μ.Χ.
  () => {
    const bc = randInt(25, 85);
    const ad = randInt(15, 60);
    const ans = ad - (-bc);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΛΟΓΙΕΣ',
      question: `Ένας αρχαίος φιλόσοφος γεννήθηκε το ${bc} π.Χ. (έτος －${bc}) και ένας μαθητής του ίδρυσε σχολή το ${ad} μ.Χ. (έτος ＋${ad}). Πόσα έτη χωρίζουν τα δύο αυτά ιστορικά γεγονότα;`,
      correctAnswer: ans.toString(),
      solution: `Υπολογίζουμε τη διαφορά: (＋${ad}) － (－${bc}) ＝ ${ad} ＋ ${bc} ＝ ${ans} έτη.`,
    };
  },

  // Πρόβλημα 4: Διαφορά τραπεζικού υπολοίπου από χρέος σε κατάθεση
  () => {
    const oldDebt = randInt(50, 120);
    const newCredit = randInt(80, 200);
    const ans = newCredit - (-oldDebt);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Ο τραπεζικός λογαριασμός ενός επαγγελματία ήταν στο κόκκινο με υπόλοιπο －${oldDebt} €. Μετά από πληρωμή πελάτη το νέο υπόλοιπο έγινε ＋${newCredit} €. Πόσα ευρώ προστέθηκαν συνολικά στον λογαριασμό;`,
      correctAnswer: ans.toString(),
      solution: `Νέο υπόλοιπο μείον αρχικό υπόλοιπο: (＋${newCredit}) － (－${oldDebt}) ＝ ${newCredit} ＋ ${oldDebt} ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 5: Πόσο πρέπει να ανέβει η θερμοκρασία για να φτάσει στο 0
  () => {
    const temp = randInt(4, 16);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question: `Σε έναν θάλαμο συντήρησης η θερμοκρασία είναι －${temp} °C. Πόσους βαθμούς Κελσίου πρέπει να ανέβει η θερμοκρασία ώστε να φτάσει ακριβώς στους 0 °C;`,
      correctAnswer: temp.toString(),
      solution: `Η διαφορά είναι: 0 － (－${temp}) ＝ 0 ＋ ${temp} ＝ ${temp} °C.`,
    };
  },

  // Πρόβλημα 6: Διαφορά δύο αρνητικών θερμοκρασιών
  () => {
    const cold1 = randInt(2, 6);
    const cold2 = cold1 + randInt(5, 12);
    const ans = (-cold1) - (-cold2);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question: `Στο Ελσίνκι η θερμοκρασία είναι －${cold1} °C, ενώ στη Σιβηρία είναι －${cold2} °C. Πόσους βαθμούς θερμότερο είναι το Ελσίνκι από τη Σιβηρία;`,
      correctAnswer: ans.toString(),
      solution: `Αφαιρούμε τη χαμηλότερη θερμοκρασία από την υψηλότερη: (－${cold1}) － (－${cold2}) ＝ －${cold1} ＋ ${cold2} ＝ ${ans} °C.`,
    };
  },

  // Πρόβλημα 7: Διαφορά υψομέτρου δύο καταδύσεων
  () => {
    const d1 = randInt(15, 30);
    const d2 = d1 + randInt(20, 45);
    const ans = (-d1) - (-d2);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΟΣ',
      question: `Ένας δύτης καταδύεται πρώτα σε βάθος ${d1} m (－${d1} m) και στη συνέχεια σε βάθος ${d2} m (－${d2} m). Πόσα μέτρα ψηλότερα ήταν η πρώτη του στάση σε σχέση με τη δεύτερη;`,
      correctAnswer: ans.toString(),
      solution: `(－${d1}) － (－${d2}) ＝ －${d1} ＋ ${d2} ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 8: Διαφορά ορόφων ανελκυστήρα
  () => {
    const basement = randInt(2, 4);
    const floor = randInt(4, 9);
    const ans = floor - (-basement);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΝΕΛΚΥΣΤΗΡΑΣ',
      question: `Πόσους ορόφους διανύει ένας ανελκυστήρας όταν ανεβαίνει από το ${basement}ο υπόγειο (όροφος －${basement}) μέχρι τον ${floor}ο όροφο (＋${floor});`,
      correctAnswer: ans.toString(),
      solution: `(＋${floor}) － (－${basement}) ＝ ${floor} ＋ ${basement} ＝ ${ans} όροφοι.`,
    };
  },

  // Πρόβλημα 9: Διαφορά σκορ σε τηλεπαιχνίδι
  () => {
    const p1 = randInt(15, 40);
    const p2 = randInt(10, 35);
    const ans = p1 - (-p2);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question: `Στον τελικό ενός κουίζ ο πρώτος παίκτης συγκέντρωσε ＋${p1} πόντους, ενώ ο δεύτερος παίκτης είχε ποινές και συγκέντρωσε －${p2} πόντους. Πόσους πόντους διαφορά είχαν οι δύο παίκτες;`,
      correctAnswer: ans.toString(),
      solution: `(＋${p1}) － (－${p2}) ＝ ${p1} ＋ ${p2} ＝ ${ans} πόντοι.`,
    };
  },

  // Πρόβλημα 10: Μείωση χρέους
  () => {
    const initialDebt = randInt(120, 250);
    const remainingDebt = initialDebt - randInt(40, 90);
    const ans = remainingDebt - initialDebt;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Το χρέος ενός δανειολήπτη ήταν αρχικά ${initialDebt} € (υπόλοιπο －${initialDebt} €). Μετά από μία δόση το χρέος μειώθηκε στα ${remainingDebt} € (υπόλοιπο －${remainingDebt} €). Πόσα ευρώ ήταν η δόση που πληρώθηκε;`,
      correctAnswer: Math.abs(ans).toString(),
      solution: `Η διαφορά των δύο καταστάσεων είναι: (－${remainingDebt}) － (－${initialDebt}) ＝ －${remainingDebt} ＋ ${initialDebt} ＝ ${Math.abs(ans)} €.`,
    };
  },

  // Πρόβλημα 11: Μεταβολή θερμοκρασίας θαλάμου δοκιμών
  () => {
    const tStart = randInt(10, 25);
    const tEnd = randInt(-15, -4);
    const drop = tStart - tEnd;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question: `Σε έναν πειραματικό θάλαμο η θερμοκρασία μειώθηκε από τους ＋${tStart} °C στους ${tEnd} °C. Κατά πόσους βαθμούς Κελσίου έπεσε η θερμοκρασία;`,
      correctAnswer: drop.toString(),
      solution: `Αρχική μείον τελική: (＋${tStart}) － (${tEnd}) ＝ ${tStart} ＋ ${Math.abs(tEnd)} ＝ ${drop} °C.`,
    };
  },

  // Πρόβλημα 12: Διαφορά υψομέτρου μεταξύ δύο πόλεων
  () => {
    const highCity = randInt(600, 1100);
    const lowLake = randInt(50, 200); // π.χ. κάτω από την επιφάνεια θάλασσας
    const ans = highCity - (-lowLake);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΥΨΟΜΕΤΡΟ',
      question: `Μια πόλη βρίσκεται σε υψόμετρο ＋${highCity} m, ενώ μια παραλίμνια περιοχή βρίσκεται σε βαθούλωμα ${lowLake} m κάτω από την επιφάνεια της θάλασσας (－${lowLake} m). Ποια είναι η υψομετρική διαφορά των δύο σημείων;`,
      correctAnswer: ans.toString(),
      solution: `(＋${highCity}) － (－${lowLake}) ＝ ${highCity} ＋ ${lowLake} ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 13: Διαφορά τιμών μετοχής
  () => {
    const lossDay = randInt(8, 20);
    const gainDay = randInt(5, 18);
    const ans = gainDay - (-lossDay);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΗΜΑΤΙΣΤΗΡΙΟ',
      question: `Τη Δευτέρα μια μετοχή έκλεισε με μεταβολή －${lossDay} μονάδες, ενώ την Τρίτη σημείωσε άνοδο ＋${gainDay} μονάδες. Πόσες μονάδες καλύτερη ήταν η επίδοση της Τρίτης σε σύγκριση με τη Δευτέρα;`,
      correctAnswer: ans.toString(),
      solution: `(＋${gainDay}) － (－${lossDay}) ＝ ${gainDay} ＋ ${lossDay} ＝ ${ans} μονάδες.`,
    };
  },

  // Πρόβλημα 14: Απόσταση στάθμης πετρελαιοπηγής
  () => {
    const rigHeight = randInt(25, 45);
    const drillDepth = randInt(150, 300);
    const ans = rigHeight - (-drillDepth);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΟΣ',
      question: `Η κορυφή μιας εξέδρας άντλησης βρίσκεται ${rigHeight} m πάνω από τη θάλασσα (＋${rigHeight} m), ενώ το τρυπάνι της έχει φτάσει σε βάθος ${drillDepth} m (－${drillDepth} m). Ποια είναι η συνολική απόσταση κορυφής και τρυπανιού;`,
      correctAnswer: ans.toString(),
      solution: `(＋${rigHeight}) － (－${drillDepth}) ＝ ${rigHeight} ＋ ${drillDepth} ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 15: Διαφορά βαθμών ποινής
  () => {
    const penA = randInt(10, 25);
    const penB = penA + randInt(6, 18);
    const ans = (-penA) - (-penB);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question: `Σε ένα τουρνουά η ομάδα Α συγκέντρωσε －${penA} πόντους και η ομάδα Β συγκέντρωσε －${penB} πόντους. Πόσους πόντους περισσότερους έχει η ομάδα Α από την ομάδα Β;`,
      correctAnswer: ans.toString(),
      solution: `(－${penA}) － (－${penB}) ＝ －${penA} ＋ ${penB} ＝ ${ans} πόντοι.`,
    };
  },

  // Πρόβλημα 16: Μεταβολή στάθμης ποταμού
  () => {
    const low = randInt(15, 35);
    const high = randInt(20, 50);
    const ans = high - (-low);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΤΑΘΜΗ',
      question: `Το καλοκαίρι η στάθμη ενός ποταμού ήταν ${low} cm κάτω από τον μέσο όρο (－${low} cm). Τον χειμώνα ανέβηκε στα ${high} cm πάνω από τον μέσο όρο (＋${high} cm). Ποια ήταν η συνολική άνοδος της στάθμης σε cm;`,
      correctAnswer: ans.toString(),
      solution: `(＋${high}) － (－${low}) ＝ ${high} ＋ ${low} ＝ ${ans} cm.`,
    };
  },

  // Πρόβλημα 17: Κατάψυξη τροφίμων
  () => {
    const roomT = randInt(18, 26);
    const freezerT = randInt(14, 22);
    const ans = roomT - (-freezerT);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question: `Ένα τρόφιμο μεταφέρεται από θερμοκρασία δωματίου ＋${roomT} °C στην κατάψυξη στους －${freezerT} °C. Πόσους βαθμούς Κελσίου ψύχθηκε το τρόφιμο;`,
      correctAnswer: ans.toString(),
      solution: `(＋${roomT}) － (－${freezerT}) ＝ ${roomT} ＋ ${freezerT} ＝ ${ans} °C.`,
    };
  },

  // Πρόβλημα 18: Διαφορά ετών ζωής ιστορικού προσώπου
  () => {
    const birthBC = randInt(40, 80);
    const deathBC = birthBC - randInt(30, 55);
    const age = birthBC - deathBC;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΛΟΓΙΕΣ',
      question: `Ένας Ρωμαίος στρατηγός γεννήθηκε το ${birthBC} π.Χ. (έτος －${birthBC}) και απεβίωσε το ${deathBC} π.Χ. (έτος －${deathBC}). Σε ποια ηλικία πέθανε;`,
      correctAnswer: age.toString(),
      solution: `Το έτος θανάτου είναι μεγαλύτερο: (－${deathBC}) － (－${birthBC}) ＝ －${deathBC} ＋ ${birthBC} ＝ ${age} έτη.`,
    };
  },

  // Πρόβλημα 19: Διαφορά πίεσης σε πείραμα
  () => {
    const p1 = randInt(12, 28);
    const p2 = randInt(8, 24);
    const ans = p1 - (-p2);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΠΙΕΣΗ',
      question: `Σε έναν αγωγό αερίου η πίεση μετρήθηκε ＋${p1} kPa πάνω από την ατμοσφαιρική, ενώ σε έναν θάλαμο κενού μετρήθηκε ${p2} kPa κάτω από την ατμοσφαιρική (－${p2} kPa). Ποια είναι η διαφορά πίεσης μεταξύ τους σε kPa;`,
      correctAnswer: ans.toString(),
      solution: `(＋${p1}) － (－${p2}) ＝ ${p1} ＋ ${p2} ＝ ${ans} kPa.`,
    };
  },

  // Πρόβλημα 20: Σύγκριση ελλείμματος δύο δήμων
  () => {
    const d1 = randInt(30, 60);
    const d2 = d1 + randInt(15, 40);
    const ans = (-d1) - (-d2);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Ο Δήμος Α κατέγραψε ταμειακό έλλειμμα ${d1} χιλιάδων ευρώ (－${d1}), ενώ ο Δήμος Β έλλειμμα ${d2} χιλιάδων ευρώ (－${d2}). Πόσες χιλιάδες ευρώ καλύτερο ήταν το ταμειακό αποτέλεσμα του Δήμου Α;`,
      correctAnswer: ans.toString(),
      solution: `(－${d1}) － (－${d2}) ＝ －${d1} ＋ ${d2} ＝ ${ans} χιλιάδες ευρώ.`,
    };
  },
];

export default function AfairesiAkeraionAsk() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Παραγωγή: 10 ασκήσεις πράξεων + 2 ρεαλιστικά προβλήματα = 12 συνολικά
  const generateQuestions = () => {
    const shuffledCalcs = shuffleArray(CALCULATION_GENERATORS);
    const shuffledProblems = shuffleArray(WORD_PROBLEM_GENERATORS);

    const selectedCalcs = shuffledCalcs.slice(0, 10).map((gen, idx) => ({
      id: idx + 1,
      ...gen(),
    }));

    const selectedProblems = shuffledProblems.slice(0, 2).map((gen, idx) => ({
      id: 11 + idx,
      ...gen(),
    }));

    setQuestions([...selectedCalcs, ...selectedProblems]);
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    generateQuestions();
  }, []);

  const handleInputChange = (id, val) => {
    if (isSubmitted) return;
    let clean = val.replace('.', ',');
    clean = clean.replace(/[^0-9,-]/g, '');

    if (clean.includes('-')) {
      const parts = clean.split('-');
      clean = '-' + parts.join('').replace(/-/g, '');
    }

    const commaCount = (clean.match(/,/g) || []).length;
    if (commaCount > 1) return;
    if (clean.length > 10) return;

    setUserAnswers((prev) => ({ ...prev, [id]: clean }));
  };

  const handleMCQSelect = (id, option) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [id]: option }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitted) return;

    let totalCorrect = 0;
    questions.forEach((q) => {
      let userAns = (userAnswers[q.id] || '').trim().replace(/\s+/g, '');
      let correctAns = q.correctAnswer.trim().replace(/\s+/g, '');

      userAns = userAns.replace(/^\+/, '');
      correctAns = correctAns.replace(/^\+/, '');

      if (userAns === correctAns) {
        totalCorrect += 1;
      }
    });

    setScore(totalCorrect);
    setIsSubmitted(true);
  };

  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] && userAnswers[k].trim() !== ''
  ).length;

  const scorePercentage = Math.round((score / 12) * 100);

  return (
    <Layout
      title="Ασκήσεις: Αφαίρεση Ακεραίων | Α' Γυμνασίου"
      description="Εξάσκηση σε 12 δυναμικές ασκήσεις και προβλήματα στην αφαίρεση ομόσημων και ετερόσημων ακεραίων αριθμών."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/07-afairesi-akeraion"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
        >
          <span>📖</span>
          <span>ΘΕΩΡΙΑ</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 pb-32 sm:pb-36 space-y-8">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Α' ΓΥΜΝΑΣΙΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Αφαίρεση Ακέραιων Αριθμών
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 πράξεις και θεωρία + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
            {questions.map((q) => {
              const userAns = userAnswers[q.id] || '';
              const cleanUser = userAns.trim().replace(/\s+/g, '').replace(/^\+/, '');
              const cleanCorrect = q.correctAnswer.trim().replace(/\s+/g, '').replace(/^\+/, '');
              const isCorrect = isSubmitted && cleanUser === cleanCorrect;
              const isWordProblem = q.id >= 11;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 ${
                    isWordProblem ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200'
                  } ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-400 ring-2 ring-emerald-100'
                        : 'border-rose-400 ring-2 ring-rose-100'
                      : 'hover:border-indigo-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-extrabold text-xs sm:text-sm ${
                            isWordProblem ? 'bg-amber-100 text-amber-900' : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {q.id}
                        </span>
                        {isWordProblem && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                            ΠΡΟΒΛΗΜΑ
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-md">
                        {q.topic}
                      </span>
                    </div>

                    <div
                      className="text-slate-900 font-semibold text-base sm:text-lg leading-snug"
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                  </div>

                  {/* Input ή MCQ */}
                  <div className="space-y-2 pt-2">
                    {q.type === 'input' ? (
                      <div className="relative max-w-xs">
                        <input
                          type="text"
                          inputMode="text"
                          maxLength={10}
                          disabled={isSubmitted}
                          placeholder="Απάντηση..."
                          value={userAns}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          className={`w-full h-11 px-4 text-base font-bold rounded-xl border transition-all outline-none ${
                            isSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                                : 'bg-rose-50 border-rose-500 text-rose-950'
                              : 'bg-slate-50 border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-slate-900'
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = userAns === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={isSubmitted}
                              onClick={() => handleMCQSelect(q.id, opt)}
                              className={`h-11 px-3 text-xs sm:text-sm font-bold rounded-xl border text-left flex items-center justify-between transition-all touch-manipulation active:scale-[0.98] ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              } ${isSubmitted ? 'cursor-default' : ''}`}
                            >
                              <span dangerouslySetInnerHTML={{ __html: opt }} />
                              {isSelected && <span>✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Feedback & Λύση */}
                    {isSubmitted && (
                      <div
                        className={`p-4 rounded-xl text-xs sm:text-sm space-y-2.5 mt-3 border ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/80 border-rose-200 text-rose-950'
                        }`}
                      >
                        {isCorrect ? (
                          <div className="font-black flex items-center gap-1.5 text-emerald-700 text-sm sm:text-base">
                            <span>✅</span>
                            <span>ΣΩΣΤΟ</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="font-black flex items-center gap-1.5 text-rose-700 text-sm sm:text-base">
                              <span>❌</span>
                              <span>ΛΑΘΟΣ</span>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/80 py-1.5 px-3 rounded-lg border border-rose-200 inline-block">
                              ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ: <span className="text-emerald-700 font-black ml-1" dangerouslySetInnerHTML={{ __html: q.correctAnswer }} />
                            </div>
                          </div>
                        )}

                        <div
                          className="text-slate-700 leading-relaxed font-normal pt-1.5 border-t border-slate-200/60"
                          dangerouslySetInnerHTML={{ __html: q.solution }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Κουμπί Ελέγχου / Ανανέωσης εντός σελίδας */}
          <div className="flex justify-center pt-4">
            {!isSubmitted ? (
              <button
                type="submit"
                disabled={answeredCount === 0}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🎯</span>
                <span>ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR (12 Ασκήσεις) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                {isSubmitted ? 'ΤΕΛΙΚΟ ΣΚΟΡ' : 'ΠΡΟΟΔΟΣ'}
              </div>
              <div className="text-base sm:text-xl font-black text-amber-400 font-mono">
                {isSubmitted ? `${score} / 12` : `${answeredCount} / 12`}
              </div>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-4 sm:pl-6 hidden xs:block">
                <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                  ΕΠΙΤΥΧΙΑ
                </div>
                <div
                  className={`text-base sm:text-xl font-black font-mono ${
                    scorePercentage >= 80
                      ? 'text-emerald-400'
                      : scorePercentage >= 50
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {scorePercentage}%
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={generateQuestions}
              className="px-3 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>🎯</span>
                <span>ΕΛΕΓΧΟΣ</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="px-4 sm:px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition"
              >
                ΕΠΑΝΑΛΗΨΗ
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
