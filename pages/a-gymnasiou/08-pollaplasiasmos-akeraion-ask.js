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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΠΡΑΞΕΩΝ ΚΑΙ ΘΕΩΡΙΑΣ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Γινόμενο δύο θετικών (Input)
  () => {
    const a = randInt(3, 9);
    const b = randInt(4, 11);
    const ans = a * b;
    return {
      type: 'input',
      topic: 'ΟΜΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question: `Υπολόγισε το γινόμενο: (＋${a}) · (＋${b})`,
      correctAnswer: ans.toString(),
      solution: `Ομόσημοι θετικοί αριθμοί: (＋) · (＋) ＝ ＋. Επομένως ＋(${a} · ${b}) ＝ ＋${ans}.`,
    };
  },

  // 2. Γινόμενο δύο αρνητικών (Input)
  () => {
    const a = randInt(3, 8);
    const b = randInt(4, 9);
    const ans = a * b;
    return {
      type: 'input',
      topic: 'ΟΜΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question: `Υπολόγισε το γινόμενο: (－${a}) · (－${b})`,
      correctAnswer: ans.toString(),
      solution: `Ομόσημοι αρνητικοί αριθμοί: (－) · (－) ＝ ＋. Επομένως ＋(${a} · ${b}) ＝ ＋${ans}.`,
    };
  },

  // 3. Γινόμενο θετικού επί αρνητικό (Input)
  () => {
    const a = randInt(3, 9);
    const b = randInt(4, 8);
    const ans = -(a * b);
    return {
      type: 'input',
      topic: 'ΕΤΕΡΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question: `Υπολόγισε το γινόμενο: (＋${a}) · (－${b})`,
      correctAnswer: ans.toString(),
      solution: `Ετερόσημοι αριθμοί: (＋) · (－) ＝ －. Επομένως －(${a} · ${b}) ＝ ${ans}.`,
    };
  },

  // 4. Γινόμενο αρνητικού επί θετικό (Input)
  () => {
    const a = randInt(4, 9);
    const b = randInt(3, 8);
    const ans = -(a * b);
    return {
      type: 'input',
      topic: 'ΕΤΕΡΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question: `Υπολόγισε το γινόμενο: (－${a}) · (＋${b})`,
      correctAnswer: ans.toString(),
      solution: `Ετερόσημοι αριθμοί: (－) · (＋) ＝ －. Επομένως －(${a} · ${b}) ＝ ${ans}.`,
    };
  },

  // 5. Πολλαπλασιασμός με το μηδέν (Input)
  () => {
    const a = randInt(12, 85);
    return {
      type: 'input',
      topic: 'ΜΗΔΕΝΙΚΟ ΣΤΟΙΧΕΙΟ',
      question: `Υπολόγισε το γινόμενο: (－${a}) · 0`,
      correctAnswer: '0',
      solution: `Το μηδέν είναι το μηδενικό στοιχείο του πολλαπλασιασμού: κάθε αριθμός επί 0 ισούται με 0.`,
    };
  },

  // 6. Πολλαπλασιασμός με το ＋1 (Input)
  () => {
    const a = randInt(15, 60);
    return {
      type: 'input',
      topic: 'ΟΥΔΕΤΕΡΟ ΣΤΟΙΧΕΙΟ',
      question: `Υπολόγισε το γινόμενο: (－${a}) · (＋1)`,
      correctAnswer: `-${a}`,
      solution: `Το ＋1 είναι το ουδέτερο στοιχείο του πολλαπλασιασμού: (－${a}) · (＋1) ＝ －${a}.`,
    };
  },

  // 7. Πολλαπλασιασμός με το －1 (Input)
  () => {
    const a = randInt(14, 55);
    return {
      type: 'input',
      topic: 'ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΜΕ ΤΟ -1',
      question: `Υπολόγισε το γινόμενο: (＋${a}) · (－1)`,
      correctAnswer: `-${a}`,
      solution: `Ο πολλαπλασιασμός ενός αριθμού με το －1 δίνει πάντοτε τον αντίθετό του: (＋${a}) · (－1) ＝ －${a}.`,
    };
  },

  // 8. Πολλαπλασιασμός αρνητικού με το －1 (Input)
  () => {
    const a = randInt(12, 70);
    return {
      type: 'input',
      topic: 'ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΜΕ ΤΟ -1',
      question: `Υπολόγισε το γινόμενο: (－${a}) · (－1)`,
      correctAnswer: a.toString(),
      solution: `(－) · (－) ＝ ＋. Επομένως (－${a}) · (－1) ＝ ＋${a}.`,
    };
  },

  // 9. Γινόμενο τριών παραγόντων με 2 αρνητικούς (Input)
  () => {
    const a = randInt(2, 4);
    const b = randInt(2, 5);
    const c = randInt(2, 3);
    const ans = a * b * c;
    return {
      type: 'input',
      topic: 'ΓΙΝΟΜΕΝΟ ΠΟΛΛΩΝ ΟΡΩΝ',
      question: `Υπολόγισε το γινόμενο: (－${a}) · (＋${b}) · (－${c})`,
      correctAnswer: ans.toString(),
      solution: `Έχουμε 2 αρνητικούς παράγοντες (άρτιο πλήθος), άρα το τελικό πρόσημο είναι θετικό (＋): ＋(${a} · ${b} · ${c}) ＝ ＋${ans}.`,
    };
  },

  // 10. Γινόμενο τριών παραγόντων με 3 αρνητικούς (Input)
  () => {
    const a = randInt(2, 4);
    const b = randInt(2, 3);
    const c = randInt(2, 5);
    const ans = -(a * b * c);
    return {
      type: 'input',
      topic: 'ΓΙΝΟΜΕΝΟ ΠΟΛΛΩΝ ΟΡΩΝ',
      question: `Υπολόγισε το γινόμενο: (－${a}) · (－${b}) · (－${c})`,
      correctAnswer: ans.toString(),
      solution: `Έχουμε 3 αρνητικούς παράγοντες (περιττό πλήθος), άρα το τελικό πρόσημο είναι αρνητικό (－): －(${a} · ${b} · ${c}) ＝ ${ans}.`,
    };
  },

  // 11. Πρόσημο γινομένου πολλών παραγόντων (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΘΕΩΡΙΑ ΠΡΟΣΗΜΩΝ',
      question: `Σε ένα γινόμενο 8 αρνητικών και 5 θετικών παραγόντων, ποιο είναι το τελικό πρόσημο;`,
      options: makeUniqueOptions(
        'Θετικό (＋)',
        ['Αρνητικό (－)', 'Μηδέν', 'Δεν μπορούμε να γνωρίζουμε']
      ),
      correctAnswer: 'Θετικό (＋)',
      solution: `Το τελικό πρόσημο εξαρτάται αποκλειστικά από τους αρνητικούς παράγοντες. Επειδή το πλήθος τους (8) είναι άρτιο, το γινόμενο είναι θετικό (＋).`,
    };
  },

  // 12. Περιττό πλήθος αρνητικών παραγόντων (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΘΕΩΡΙΑ ΠΡΟΣΗΜΩΝ',
      question: `Αν πολλαπλασιάσουμε 7 αρνητικούς αριθμούς, τι πρόσημο θα έχει το αποτέλεσμα;`,
      options: makeUniqueOptions(
        'Αρνητικό (－)',
        ['Θετικό (＋)', 'Μηδέν', 'Θα εξαρτηθεί από το μέγεθος των αριθμών']
      ),
      correctAnswer: 'Αρνητικό (－)',
      solution: `Το πλήθος των αρνητικών παραγόντων είναι 7 (περιττός αριθμός), επομένως το γινόμενο είναι πάντοτε αρνητικό (－).`,
    };
  },

  // 13. Επιμεριστική ιδιότητα (Input)
  () => {
    const a = randInt(3, 6);
    const b = randInt(10, 20);
    const c = randInt(2, 5);
    const ans = a * (b - c);
    return {
      type: 'input',
      topic: 'ΕΠΙΜΕΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ',
      question: `Υπολόγισε την παράσταση: (－${a}) · [(－${b}) ＋ (＋${c})]`,
      correctAnswer: ans.toString(),
      solution: `Μέσα στην αγκύλη: (－${b}) ＋ (＋${c}) ＝ －${b - c}. Έπειτα: (－${a}) · (－${b - c}) ＝ ＋${ans}.`,
    };
  },

  // 14. Εύρεση άγνωστου παράγοντα (Input)
  () => {
    const a = randInt(3, 8);
    const target = -(a * randInt(3, 7));
    const x = target / a;
    return {
      type: 'input',
      topic: 'ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ',
      question: `Βρες τον ακέραιο x ώστε: (＋${a}) · x ＝ ${target}`,
      correctAnswer: x.toString(),
      solution: `x ＝ (${target}) ： (＋${a}) ＝ ${x}.`,
    };
  },

  // 15. Εύρεση άγνωστου με δύο αρνητικά (Input)
  () => {
    const a = randInt(3, 7);
    const mult = randInt(4, 9);
    const target = a * mult;
    const x = -mult;
    return {
      type: 'input',
      topic: 'ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ',
      question: `Βρες τον ακέραιο x ώστε: (－${a}) · x ＝ ＋${target}`,
      correctAnswer: x.toString(),
      solution: `x ＝ (＋${target}) ： (－${a}) ＝ ${x}.`,
    };
  },

  // 16. Τετράγωνο αρνητικού αριθμού (Input)
  () => {
    const a = randInt(4, 10);
    const ans = a * a;
    return {
      type: 'input',
      topic: 'ΔΥΝΑΜΕΙΣ ΑΚΕΡΑΙΩΝ',
      question: `Υπολόγισε την τιμή: (－${a}) · (－${a})`,
      correctAnswer: ans.toString(),
      solution: `Ομόσημοι αρνητικοί: (－) · (－) ＝ ＋. Επομένως (－${a}) · (－${a}) ＝ ＋${ans}.`,
    };
  },

  // 17. Γινόμενο με παράγοντα το 0 ανάμεσα σε πολλούς (MCQ)
  () => {
    const a = randInt(2, 9);
    const b = randInt(3, 8);
    const c = randInt(4, 9);
    return {
      type: 'mcq',
      topic: 'ΜΗΔΕΝΙΚΟ ΣΤΟΙΧΕΙΟ',
      question: `Ποιο είναι το αποτέλεσμα: (－${a}) · (＋${b}) · 0 · (－${c});`,
      options: makeUniqueOptions('0', ['1', `－${a * b * c}`, `＋${a * b * c}`]),
      correctAnswer: '0',
      solution: `Όταν ανάμεσα στους παράγοντες ενός γινομένου υπάρχει ο αριθμός 0, το αποτέλεσμα μηδενίζεται αυτόματα.`,
    };
  },

  // 18. Προτεραιότητα πράξεων: Πολλαπλασιασμός πριν την πρόσθεση (Input)
  () => {
    const a = randInt(5, 15);
    const b = randInt(2, 6);
    const c = randInt(3, 7);
    const ans = a + b * (-c);
    return {
      type: 'input',
      topic: 'ΠΡΟΤΕΡΑΙΟΤΗΤΑ ΠΡΑΞΕΩΝ',
      question: `Υπολόγισε: ${a} ＋ (＋${b}) · (－${c})`,
      correctAnswer: ans.toString(),
      solution: `Προηγείται ο πολλαπλασιασμός: (＋${b}) · (－${c}) ＝ －${b * c}. Στη συνέχεια προσθέτουμε: ${a} ＋ (－${b * c}) ＝ ${ans}.`,
    };
  },

  // 19. Προτεραιότητα με δύο γινόμενα (Input)
  () => {
    const a = randInt(2, 4);
    const b = randInt(3, 5);
    const c = randInt(2, 4);
    const d = randInt(2, 5);
    const ans = (-a) * b + (-c) * (-d);
    return {
      type: 'input',
      topic: 'ΠΡΟΤΕΡΑΙΟΤΗΤΑ ΠΡΑΞΕΩΝ',
      question: `Υπολόγισε: (－${a}) · (＋${b}) ＋ (－${c}) · (－${d})`,
      correctAnswer: ans.toString(),
      solution: `(－${a}) · (＋${b}) ＝ －${a * b} και (－${c}) · (－${d}) ＝ ＋${c * d}. Τελικό άθροισμα: (－${a * b}) ＋ (＋${c * d}) ＝ ${ans}.`,
    };
  },

  // 20. Αντιμεταθετική ιδιότητα (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΙΔΙΟΤΗΤΕΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ',
      question: `Ποια ιδιότητα δηλώνει η ισότητα: (－4) · (＋7) ＝ (＋7) · (－4);`,
      options: makeUniqueOptions(
        'Αντιμεταθετική ιδιότητα',
        ['Προσεταιριστική ιδιότητα', 'Επιμεριστική ιδιότητα', 'Ουδέτερο στοιχείο']
      ),
      correctAnswer: 'Αντιμεταθετική ιδιότητα',
      solution: `Η αλλαγή της σειράς των παραγόντων χωρίς να μεταβάλλεται το γινόμενο είναι η Αντιμεταθετική ιδιότητα (α · β ＝ β · α).`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Σταθερή πτώση θερμοκρασίας ανά ώρα
  () => {
    const dropPerHour = randInt(2, 4);
    const hours = randInt(3, 6);
    const ans = -(dropPerHour * hours);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question: `Κατά τη διάρκεια μιας χιονοθύελλας η θερμοκρασία μειώνεται σταθερά κατά ${dropPerHour} °C κάθε ώρα (－${dropPerHour} °C/h). Ποια θα είναι η συνολική μεταβολή της θερμοκρασίας μετά από ${hours} ώρες;`,
      correctAnswer: ans.toString(),
      solution: `Πολλαπλασιάζουμε τη μείωση ανά ώρα επί τις ώρες: ${hours} · (－${dropPerHour}) ＝ ${ans} °C.`,
    };
  },

  // Πρόβλημα 2: Μηνιαία πάγια συνδρομή σε τραπεζικό λογαριασμό
  () => {
    const fee = randInt(8, 25);
    const months = randInt(4, 9);
    const ans = -(fee * months);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Από έναν λογαριασμό αφαιρείται αυτόματα κάθε μήνα συνδρομή ${fee} € (μεταβολή －${fee} €). Ποια θα είναι η συνολική επίδραση στον λογαριασμό μετά από ${months} μήνες;`,
      correctAnswer: ans.toString(),
      solution: `${months} · (－${fee}) ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 3: Κατάδυση υποβρυχίου με σταθερή ταχύτητα
  () => {
    const speed = randInt(12, 25);
    const mins = randInt(4, 8);
    const ans = -(speed * mins);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΟΣ',
      question: `Ένα υποβρύχιο καταδύεται με ρυθμό ${speed} m ανά λεπτό (－${speed} m/min). Σε ποιο υψόμετρο θα βρίσκεται μετά από ${mins} λεπτά ξεκινώντας από την επιφάνεια;`,
      correctAnswer: ans.toString(),
      solution: `${mins} · (－${speed}) ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 4: Επαναλαμβανόμενες ποινές σε παιχνίδι
  () => {
    const penalty = randInt(15, 30);
    const rounds = randInt(3, 5);
    const ans = -(penalty * rounds);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question: `Σε ένα διαδικτυακό παιχνίδι ο παίκτης δέχεται ποινή －${penalty} πόντων για κάθε λάθος. Αν έκανε ${rounds} διαδοχικά λάθη, πόσους πόντους έχασε συνολικά;`,
      correctAnswer: ans.toString(),
      solution: `${rounds} · (－${penalty}) ＝ ${ans} πόντοι.`,
    };
  },

  // Πρόβλημα 5: Εβδομαδιαία ζημιά καταστήματος
  () => {
    const weeklyLoss = randInt(120, 250);
    const weeks = randInt(3, 5);
    const ans = -(weeklyLoss * weeks);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Μια νεοσύστατη επιχείρηση κατέγραψε ζημιά ${weeklyLoss} € κάθε εβδομάδα (－${weeklyLoss} €/εβδομάδα) για ${weeks} συνεχόμενες εβδομάδες. Ποιο ήταν το συνολικό ταμειακό αποτέλεσμα;`,
      correctAnswer: ans.toString(),
      solution: `${weeks} · (－${weeklyLoss}) ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 6: Σταθερή κάθοδος ανελκυστήρα ορυχείου
  () => {
    const metersPerSec = randInt(3, 6);
    const seconds = randInt(15, 30);
    const ans = -(metersPerSec * seconds);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΟΣ',
      question: `Ο ανελκυστήρας ενός μεταλλείου κατεβαίνει με ταχύτητα ${metersPerSec} m/s (－${metersPerSec} m/s). Ποιο θα είναι το βάθος του μετά από ${seconds} δευτερόλεπτα ξεκινώντας από το έδαφος;`,
      correctAnswer: ans.toString(),
      solution: `${seconds} · (－${metersPerSec}) ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 7: Πτώση στάθμης δεξαμενής
  () => {
    const dropPerDay = randInt(4, 9);
    const days = randInt(5, 10);
    const ans = -(dropPerDay * days);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΤΑΘΜΗ',
      question: `Λόγω ξηρασίας η στάθμη μιας δεξαμενής μειώνεται κατά ${dropPerDay} cm καθημερινά (－${dropPerDay} cm/ημέρα). Πόσα cm θα είναι η συνολική μεταβολή της στάθμης μετά από ${days} ημέρες;`,
      correctAnswer: ans.toString(),
      solution: `${days} · (－${dropPerDay}) ＝ ${ans} cm.`,
    };
  },

  // Πρόβλημα 8: Ακύρωση μηνιαίων δόσεων χρέους
  () => {
    const installment = randInt(25, 50);
    const count = randInt(3, 6);
    const ans = installment * count;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Μια τράπεζα διαγράφει ${count} μηνιαίες χρεώσεις των ${installment} € η καθεμία (αφαίρεση χρέους: (－${count}) · (－${installment})). Ποιο είναι το συνολικό όφελος σε €;`,
      correctAnswer: ans.toString(),
      solution: `(－${count}) · (－${installment}) ＝ ＋(${count} · ${installment}) ＝ ＋${ans} €.`,
    };
  },

  // Πρόβλημα 9: Σταθερή ψύξη χημικού διαλύματος
  () => {
    const coolRate = randInt(2, 5);
    const mins = randInt(6, 12);
    const ans = -(coolRate * mins);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question: `Σε ένα εργαστήριο ένα διάλυμα ψύχεται κατά ${coolRate} °C κάθε λεπτό (－${coolRate} °C/min). Πόσους βαθμούς Κελσίου θα έχει μεταβληθεί η θερμοκρασία του μετά από ${mins} λεπτά;`,
      correctAnswer: ans.toString(),
      solution: `${mins} · (－${coolRate}) ＝ ${ans} °C.`,
    };
  },

  // Πρόβλημα 10: Απώλεια πόντων σε αθλητικό τουρνουά
  () => {
    const yellowCardPenalty = 2;
    const cards = randInt(3, 7);
    const ans = -(yellowCardPenalty * cards);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question: `Στο πρωτάθλημα fair play κάθε κίτρινη κάρτα επιφέρει ποινή －${yellowCardPenalty} βαθμών. Αν μια ομάδα δέχτηκε ${cards} κίτρινες κάρτες, πόσοι είναι οι συνολικοί βαθμοί ποινής;`,
      correctAnswer: ans.toString(),
      solution: `${cards} · (－${yellowCardPenalty}) ＝ ${ans} βαθμοί.`,
    };
  },

  // Πρόβλημα 11: Σταθερή υποχώρηση παγετώνα
  () => {
    const retreat = randInt(5, 12);
    const years = randInt(4, 8);
    const ans = -(retreat * years);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΠΕΡΙΒΑΛΛΟΝ',
      question: `Ένας παγετώνας υποχωρεί κατά μέσο όρο ${retreat} m κάθε χρόνο (－${retreat} m/έτος). Ποια θα είναι η συνολική μετατόπιση του μετώπου του μετά από ${years} χρόνια;`,
      correctAnswer: ans.toString(),
      solution: `${years} · (－${retreat}) ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 12: Ημερήσια απώλεια βάρους φορτίου
  () => {
    const lossKg = randInt(4, 9);
    const days = randInt(6, 12);
    const ans = -(lossKg * days);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΡΟΣ',
      question: `Λόγω εξάτμισης υγρασίας, ένα φορτίο χάνει ${lossKg} kg καθημερινά (－${lossKg} kg/ημέρα). Ποια είναι η συνολική μεταβολή της μάζας του μετά από ${days} ημέρες;`,
      correctAnswer: ans.toString(),
      solution: `${days} · (－${lossKg}) ＝ ${ans} kg.`,
    };
  },

  // Πρόβλημα 13: Μείωση τιμής προϊόντος
  () => {
    const discount = randInt(3, 7);
    const items = randInt(8, 15);
    const ans = -(discount * items);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Ένα κατάστημα προσφέρει έκπτωση ${discount} € σε κάθε μπλούζα (μεταβολή －${discount} €). Αν πουλήθηκαν ${items} μπλούζες, ποια ήταν η συνολική έκπτωση στο ταμείο;`,
      correctAnswer: ans.toString(),
      solution: `${items} · (－${discount}) ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 14: Κατάδυση αυτόνομου βαθυσκάφους
  () => {
    const speed = randInt(8, 15);
    const hours = randInt(2, 4);
    const ans = -(speed * hours);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΟΣ',
      question: `Ένα ωκεανογραφικό βαθυσκάφος κατεβαίνει προς την άβυσσο με ρυθμό ${speed} m ανά ώρα (－${speed} m/h). Σε ποιο υψόμετρο θα βρίσκεται μετά από ${hours} ώρες;`,
      correctAnswer: ans.toString(),
      solution: `${hours} · (－${speed}) ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 15: Σειρά λανθασμένων απαντήσεων σε διαγώνισμα
  () => {
    const minusPerMistake = 3;
    const mistakes = randInt(4, 9);
    const ans = -(minusPerMistake * mistakes);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question: `Σε ένα τεστ πολλαπλής επιλογής κάθε λανθασμένη απάντηση αφαιρεί ${minusPerMistake} μόρια (－${minusPerMistake}). Αν ένας υποψήφιος έκανε ${mistakes} λάθη, πόσα μόρια έχασε συνολικά;`,
      correctAnswer: ans.toString(),
      solution: `${mistakes} · (－${minusPerMistake}) ＝ ${ans} μόρια.`,
    };
  },

  // Πρόβλημα 16: Καθημερινή διαρροή καυσίμου
  () => {
    const liters = randInt(5, 12);
    const days = randInt(3, 7);
    const ans = -(liters * days);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΓΚΟΣ',
      question: `Από ένα παλιό ρεζερβουάρ διαρρέουν σταθερά ${liters} l καυσίμου την ημέρα (－${liters} l/ημέρα). Ποια είναι η συνολική απώλεια καυσίμου μετά από ${days} ημέρες;`,
      correctAnswer: ans.toString(),
      solution: `${days} · (－${liters}) ＝ ${ans} l.`,
    };
  },

  // Πρόβλημα 17: Αποπληρωμή μηνιαίων δόσεων κάρτας
  () => {
    const installment = randInt(30, 70);
    const months = randInt(3, 6);
    const ans = -(installment * months);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Ένας καταναλωτής πληρώνει μηνιαία δόση ${installment} € για αγορά υπολογιστή (χρέωση －${installment} €/μήνα). Ποια είναι η συνολική εκροή χρημάτων μετά από ${months} μήνες;`,
      correctAnswer: ans.toString(),
      solution: `${months} · (－${installment}) ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 18: Πτώση πίεσης ανά λεπτό
  () => {
    const barPerMin = randInt(2, 5);
    const mins = randInt(4, 8);
    const ans = -(barPerMin * mins);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΠΙΕΣΗ',
      question: `Κατά τη διαδικασία αποσυμπίεσης ενός θαλάμου, η πίεση μειώνεται κατά ${barPerMin} bar κάθε λεπτό (－${barPerMin} bar/min). Ποια είναι η μεταβολή της πίεσης μετά από ${mins} λεπτά;`,
      correctAnswer: ans.toString(),
      solution: `${mins} · (－${barPerMin}) ＝ ${ans} bar.`,
    };
  },

  // Πρόβλημα 19: Απώλεια χρόνου σε αγώνα ράλι
  () => {
    const penaltySec = randInt(5, 15);
    const obstacles = randInt(3, 6);
    const ans = -(penaltySec * obstacles);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ',
      question: `Σε μια ειδική διαδρομή ράλι, κάθε παράβαση ορίου ταχύτητας επιφέρει ποινή χρόνου ${penaltySec} δευτερολέπτων (－${penaltySec} s). Αν ένα πλήρωμα υπέπεσε σε ${obstacles} παραβάσεις, ποια είναι η συνολική ποινή;`,
      correctAnswer: ans.toString(),
      solution: `${obstacles} · (－${penaltySec}) ＝ ${ans} s.`,
    };
  },

  // Πρόβλημα 20: Μείωση επιπέδου θορύβου
  () => {
    const decibelPerLayer = randInt(4, 8);
    const layers = randInt(3, 5);
    const ans = -(decibelPerLayer * layers);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΗΧΟΣΥΝΘΕΣΗ',
      question: `Κάθε στρώμα ηχομονωτικού υλικού μειώνει τον θόρυβο κατά ${decibelPerLayer} dB (－${decibelPerLayer} dB). Αν τοποθετηθούν ${layers} διαδοχικά στρώματα, ποια είναι η συνολική μείωση της έντασης;`,
      correctAnswer: ans.toString(),
      solution: `${layers} · (－${decibelPerLayer}) ＝ ${ans} dB.`,
    };
  },
];

export default function PollaplasiasmosAkeraionAsk() {
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
      title="Ασκήσεις: Πολλαπλασιασμός Ακεραίων | Α' Γυμνασίου"
      description="Εξάσκηση σε 12 δυναμικές ασκήσεις και προβλήματα στον πολλαπλασιασμό ομόσημων, ετερόσημων και πολλών ακεραίων παραγόντων."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/08-pollaplasiasmos-akeraion"
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
              Πολλαπλασιασμός Ακέραιων Αριθμών
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
