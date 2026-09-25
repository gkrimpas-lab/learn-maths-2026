// pages/st-dimotikou/55-apeikonisi-data-ask.js
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

// Μορφοποιηση αριθμου (ακεραιος η δεκαδικος με κομμα)
function formatNum(val, decimals = 1) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// Δεξαμενη Κανονικων Προβληματων Ραβδογραμματων & Εικονογραμματων (10 διαφορετικα προβληματα)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'data_std_1',
    generate: () => {
      const scale = pickRandom([5, 10, 20]);
      const fullSyms = randInt(4, 7);
      const totalUnits = fullSyms * scale;
      return {
        text: `Σε ένα εικονόγραμμα ανακύκλωσης κάθε σύμβολο 📦 αντιστοιχεί σε ${scale} kg χαρτιού. Αν για μια τάξη έχουν σχεδιαστεί ${fullSyms} σύμβολα, πόσα kg χαρτιού συγκέντρωσε η τάξη αυτή;`,
        correctVal: totalUnits,
        correctStr: String(totalUnits),
        unit: 'kg',
        explanation: `Πολλαπλασιάζουμε το πλήθος των συμβόλων με την τιμή του υπομνήματος: ${fullSyms} · ${scale} ＝ ${totalUnits} kg.`
      };
    }
  },
  {
    id: 'data_std_2',
    generate: () => {
      const vA = randInt(15, 30);
      const vB = randInt(10, 25);
      const vC = randInt(20, 35);
      const total = vA + vB + vC;
      return {
        text: `Ένα ραβδόγραμμα δείχνει τις προτιμήσεις των μαθητών σε 3 γεύσεις παγωτού: Σοκολάτα ${vA}, Βανίλια ${vB} και Φράουλα ${vC}. Πόσοι ήταν συνολικά οι μαθητές που συμμετείχαν στην έρευνα;`,
        correctVal: total,
        correctStr: String(total),
        unit: 'μαθητές',
        explanation: `Αθροίζουμε τις συχνότητες όλων των ράβδων: ${vA} ＋ ${vB} ＋ ${vC} ＝ ${total} μαθητές.`
      };
    }
  },
  {
    id: 'data_std_3',
    generate: () => {
      const vMon = randInt(25, 45);
      const vFri = vMon + randInt(10, 25);
      const diff = vFri - vMon;
      return {
        text: `Σε ένα ραβδόγραμμα επισκεπτών μουσείου, τη Δευτέρα καταγράφηκαν ${vMon} επισκέπτες και την Παρασκευή ${vFri} επισκέπτες. Πόσους περισσότερους επισκέπτες είχε το μουσείο την Παρασκευή;`,
        correctVal: diff,
        correctStr: String(diff),
        unit: 'επισκέπτες',
        explanation: `Βρίσκουμε τη διαφορά υψών των ράβδων: ${vFri} － ${vMon} ＝ ${diff} επισκέπτες.`
      };
    }
  },
  {
    id: 'data_std_4',
    generate: () => {
      const totalTrees = pickRandom([60, 80, 100, 120]);
      const scale = pickRandom([10, 20]);
      const reqSymbols = totalTrees / scale;
      return {
        text: `Ένας γεωπόνος θέλει να σχεδιάσει εικονόγραμμα για ${totalTrees} ελαιόδεντρα, χρησιμοποιώντας υπόμνημα 🌳 ＝ ${scale} δέντρα. Πόσα σύμβολα πρέπει να σχεδιάσει;`,
        correctVal: reqSymbols,
        correctStr: String(reqSymbols),
        unit: 'σύμβολα',
        explanation: `Διαιρούμε το συνολικό πλήθος με την κλίμακα του υπομνήματος: ${totalTrees} : ${scale} ＝ ${reqSymbols} σύμβολα.`
      };
    }
  },
  {
    id: 'data_std_5',
    generate: () => {
      return {
        text: `Σε έναν πίνακα συχνοτήτων καταγράφηκαν τα αγαπημένα κατοικίδια: Σκύλος 30, Γάτα 24, Παπαγάλος 18. Ποιο είναι το ποσοστό (%) των παιδιών που προτιμούν τον σκύλο αν ρωτήθηκαν συνολικά 60 παιδιά;`,
        correctVal: 50,
        correctStr: '50',
        unit: '%',
        explanation: `Ο σκύλος έχει συχνότητα 30 σε σύνολο 60 παιδιών: (30 : 60) · 100 ＝ 0,5 · 100 ＝ 50 %.`
      };
    }
  },
  {
    id: 'data_std_6',
    generate: () => {
      const baseVal = randInt(12, 20);
      const doubleVal = baseVal * 2;
      return {
        text: `Σε ένα ραβδόγραμμα η ράβδος της ομάδας Α έχει ύψος ${baseVal} πόντους και η ράβδος της ομάδας Β έχει ακριβώς διπλάσιο ύψος. Πόσους πόντους συγκέντρωσε η ομάδα Β;`,
        correctVal: doubleVal,
        correctStr: String(doubleVal),
        unit: 'πόντοι',
        explanation: `Εφόσον το ύψος είναι διπλάσιο: ${baseVal} · 2 ＝ ${doubleVal} πόντοι.`
      };
    }
  },
  {
    id: 'data_std_7',
    generate: () => {
      const scale = 5;
      const fullSyms = randInt(3, 6);
      const totalVal = fullSyms * scale + 2.5;
      return {
        text: `Σε ένα εικονόγραμμα ισχύει το υπόμνημα 🚗 ＝ 5 αυτοκίνητα. Αν για ένα συνεργείο υπάρχουν ${fullSyms} ολόκληρα σύμβολα και 1 μισό σύμβολο (½), πόσα αυτοκίνητα επισκευάστηκαν;`,
        correctVal: totalVal,
        correctStr: formatNum(totalVal),
        unit: 'αυτοκίνητα',
        explanation: `Τα ολόκληρα σύμβολα είναι: ${fullSyms} · 5 ＝ ${fullSyms * 5}. Το μισό σύμβολο αντιστοιχεί σε 2,5 αυτοκίνητα. Σύνολο: ${formatNum(totalVal)}.`
      };
    }
  },
  {
    id: 'data_std_8',
    generate: () => {
      const bus = randInt(20, 35);
      const walk = randInt(15, 30);
      const car = randInt(10, 20);
      return {
        text: `Ένα ραβδόγραμμα μετακίνησης μαθητών προς το σχολείο δείχνει: Λεωφορείο ${bus}, Με τα πόδια ${walk}, Αυτοκίνητο ${car}. Πόσοι μαθητές μετακινούνται με όχημα (λεωφορείο ή αυτοκίνητο);`,
        correctVal: bus + car,
        correctStr: String(bus + car),
        unit: 'μαθητές',
        explanation: `Αθροίζουμε τις συχνότητες των οχημάτων: ${bus} ＋ ${car} ＝ ${bus + car} μαθητές.`
      };
    }
  },
  {
    id: 'data_std_9',
    generate: () => {
      return {
        text: `Σε ένα κατάστημα φρούτων πουλήθηκαν 45 kg μήλα, 30 kg πορτοκάλια και 25 kg μπανάνες. Πόσα kg φρούτων πουλήθηκαν συνολικά;`,
        correctVal: 100,
        correctStr: '100',
        unit: 'kg',
        explanation: `45 ＋ 30 ＋ 25 ＝ 100 kg φρούτων.`
      };
    }
  },
  {
    id: 'data_std_10',
    generate: () => {
      const symbolVal = pickRandom([4, 6, 8]);
      const symCount = randInt(5, 9);
      const totalUnits = symCount * symbolVal;
      return {
        text: `Σε ένα εικονόγραμμα κάθε αστέρι ⭐ αντιπροσωπεύει ${symbolVal} βαθμούς. Ένας μαθητής συγκέντρωσε ${symCount} αστέρια. Πόσους βαθμούς πέτυχε;`,
        correctVal: totalUnits,
        correctStr: String(totalUnits),
        unit: 'βαθμοί',
        explanation: `${symCount} · ${symbolVal} ＝ ${totalUnits} βαθμοί.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας (10 διαφορετικα προβληματα)
const HARD_PROBLEMS_POOL = [
  {
    id: 'data_hard_1',
    generate: () => {
      const mon = 40;
      const tue = 60;
      const wed = 50;
      const thu = 70;
      const total = mon + tue + wed + thu; // 220
      const avg = total / 4; // 55
      return {
        text: `Σε ένα ραβδόγραμμα καταγράφηκε η ημερήσια παραγωγή κιβωτίων ενός εργοστασίου: Δευτέρα 40, Τρίτη 60, Τετάρτη 50, Πέμπτη 70. Ποιος ήταν ο μέσος όρος παραγωγής ανά ημέρα;`,
        correctVal: avg,
        correctStr: String(avg),
        unit: 'κιβώτια',
        explanation: `1ο Βήμα: Συνολική παραγωγή: 40 ＋ 60 ＋ 50 ＋ 70 ＝ ${total} κιβώτια. 2ο Βήμα: Μέσος όρος: ${total} : 4 ＝ ${avg} κιβώτια ανά ημέρα.`
      };
    }
  },
  {
    id: 'data_hard_2',
    generate: () => {
      const totalStudents = 120;
      const soccer = 48; // 40%
      const basket = 36; // 30%
      const rem = totalStudents - soccer - basket; // 36
      const pctRem = (rem / totalStudents) * 100; // 30%
      return {
        text: `Σε έρευνα 120 μαθητών για το αγαπημένο τους άθλημα, 48 επέλεξαν ποδόσφαιρο και 36 μπάσκετ. Οι υπόλοιποι μαθητές επέλεξαν στίβο. Τι ποσοστό (%) των μαθητών επέλεξε στίβο;`,
        correctVal: pctRem,
        correctStr: String(pctRem),
        unit: '%',
        explanation: `Μαθητές στίβου: 120 － (48 ＋ 36) ＝ 120 － 84 ＝ 36 μαθητές. Ποσοστό: (36 : 120) · 100 ＝ 0,30 · 100 ＝ ${pctRem} %.`
      };
    }
  },
  {
    id: 'data_hard_3',
    generate: () => {
      const totalVotes = 200;
      const catA = 90;
      const catB = 70;
      const catC = totalVotes - catA - catB; // 40
      const diff = catA - catC; // 50
      return {
        text: `Σε ένα σχολικό συμβούλιο ψήφισαν 200 μαθητές για 3 προτάσεις: Η πρόταση Α έλαβε 90 ψήφους, η πρόταση Β έλαβε 70 ψήφους και οι υπόλοιποι ψήφισαν την πρόταση Γ. Πόσες περισσότερες ψήφους έλαβε η πρόταση Α από την πρόταση Γ;`,
        correctVal: diff,
        correctStr: String(diff),
        unit: 'ψήφοι',
        explanation: `Ψήφοι πρότασης Γ: 200 － (90 ＋ 70) ＝ 200 － 160 ＝ 40 ψήφοι. Διαφορά: 90 － 40 ＝ ${diff} ψήφοι.`
      };
    }
  },
  {
    id: 'data_hard_4',
    generate: () => {
      const scale = 25; // 1 σύμβολο = 25 δέντρα
      const symTeamA = 6;
      const symTeamB = 8;
      const diffTrees = (symTeamB - symTeamA) * scale; // 50 δέντρα
      return {
        text: `Σε ένα εικονόγραμμα αναδάσωσης ισχύει το υπόμνημα 🌲 ＝ 25 δέντρα. Η ομάδα Α έχει σχεδιάσει 6 σύμβολα και η ομάδα Β έχει σχεδιάσει 8 σύμβολα. Πόσα περισσότερα δέντρα φύτεψε η ομάδα Β;`,
        correctVal: diffTrees,
        correctStr: String(diffTrees),
        unit: 'δέντρα',
        explanation: `Διαφορά συμβόλων: 8 － 6 ＝ 2 σύμβολα. Σε δέντρα: 2 · 25 ＝ ${diffTrees} δέντρα.`
      };
    }
  },
  {
    id: 'data_hard_5',
    generate: () => {
      const maxVal = 180;
      const steps = 6;
      const stepVal = maxVal / steps; // 30
      return {
        text: `Στον κατακόρυφο άξονα ενός ραβδογράμματος, το μέγιστο ύψος είναι 180 και ο άξονας χωρίζεται σε 6 ίσα διαστήματα (υποδιαιρέσεις). Πόσες μονάδες αντιπροσωπεύει κάθε διάστημα της κλίμακας;`,
        correctVal: stepVal,
        correctStr: String(stepVal),
        unit: 'μονάδες',
        explanation: `Διαιρούμε το μέγιστο ύψος με τον αριθμό των ίσων διαστημάτων: 180 : 6 ＝ ${stepVal} μονάδες ανά διάστημα.`
      };
    }
  },
  {
    id: 'data_hard_6',
    generate: () => {
      const a = 35;
      const b = 45;
      const c = 20;
      const total = a + b + c; // 100
      const pctB = (b / total) * 100; // 45%
      return {
        text: `Σε ένα ραβδόγραμμα 100 συνολικά αναγνωστών, η εφημερίδα Α έχει 35 αναγνώστες, η Β έχει 45 και η Γ έχει 20. Ποιο είναι το ποσοστό (%) των αναγνωστών της εφημερίδας Β;`,
        correctVal: pctB,
        correctStr: String(pctB),
        unit: '%',
        explanation: `Εφόσον το σύνολο είναι 100, η συχνότητα 45 αντιστοιχεί απευθείας σε ${pctB} %.`
      };
    }
  },
  {
    id: 'data_hard_7',
    generate: () => {
      const origHeightCm = 15;
      const origUnits = 60;
      const newUnits = 100;
      const newHeightCm = (origHeightCm * newUnits) / origUnits; // 25 cm
      return {
        text: `Σε ένα ραβδόγραμμα, μια ράβδος ύψους 15 cm αντιστοιχεί σε 60 πωλήσεις προϊόντων. Πόσα εκατοστά (cm) ύψος πρέπει να έχει μια άλλη ράβδος στο ίδιο γράφημα για να αναπαραστήσει 100 πωλήσεις;`,
        correctVal: newHeightCm,
        correctStr: String(newHeightCm),
        unit: 'cm',
        explanation: `Τα ύψη των ράβδων είναι ανάλογα των συχνοτήτων: χ ＝ (15 · 100) : 60 ＝ 1.500 : 60 ＝ ${newHeightCm} cm.`
      };
    }
  },
  {
    id: 'data_hard_8',
    generate: () => {
      const scaleA = 5;
      const totalItems = 150;
      const symA = totalItems / scaleA; // 30 σύμβολα
      const scaleB = 15;
      const symB = totalItems / scaleB; // 10 σύμβολα
      const diffSyms = symA - symB; // 20
      return {
        text: `Για να αναπαραστήσουμε 150 μονάδες σε εικονόγραμμα, αν αλλάξουμε το υπόμνημα από 1 σύμβολο ＝ 5 μονάδες σε 1 σύμβολο ＝ 15 μονάδες, πόσα λιγότερα σύμβολα θα χρειαστεί να σχεδιάσουμε;`,
        correctVal: diffSyms,
        correctStr: String(diffSyms),
        unit: 'σύμβολα',
        explanation: `Με κλίμακα 5: 150 : 5 ＝ 30 σύμβολα. Με κλίμακα 15: 150 : 15 ＝ 10 σύμβολα. Διαφορά: 30 － 10 ＝ ${diffSyms} λιγότερα σύμβολα.`
      };
    }
  },
  {
    id: 'data_hard_9',
    generate: () => {
      const girls = 28;
      const boys = 32;
      const diff = boys - girls; // 4
      return {
        text: `Στο ραβδόγραμμα δύο τμημάτων της ΣΤ' τάξης καταγράφηκαν 28 κορίτσια και 32 αγόρια. Πόσα περισσότερα είναι τα αγόρια από τα κορίτσια;`,
        correctVal: diff,
        correctStr: String(diff),
        unit: 'αγόρια',
        explanation: `Διαφορά: 32 － 28 ＝ ${diff} αγόρια.`
      };
    }
  },
  {
    id: 'data_hard_10',
    generate: () => {
      const q1 = 120;
      const q2 = 180;
      const q3 = 150;
      const q4 = 210;
      const total = q1 + q2 + q3 + q4; // 660
      return {
        text: `Σε ένα τριμηνιαίο ραβδόγραμμα καταγράφηκαν οι πωλήσεις 4 τριμήνων: Α' 120, Β' 180, Γ' 150, Δ' 210. Ποιες ήταν οι συνολικές πωλήσεις ολόκληρου του έτους;`,
        correctVal: total,
        correctStr: String(total),
        unit: 'πωλήσεις',
        explanation: `Σύνολο: 120 ＋ 180 ＋ 150 ＋ 210 ＝ ${total} πωλήσεις.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Ανάγνωση υπομνήματος εικονογράμματος
  {
    const scale = pickRandom([4, 5, 8, 10]);
    const symbols = randInt(3, 7);
    const total = symbols * scale;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΑΝΑΓΝΩΣΗ ΕΙΚΟΝΟΓΡΑΜΜΑΤΟΣ',
      instruction: 'Υπολογίστε το συνολικό μέγεθος βάσει του υπομνήματος:',
      prompt: `Σε ένα εικονόγραμμα το υπόμνημα δηλώνει: 📚 ＝ ${scale} βιβλία. Αν ένας μαθητής έχει δίπλα στο όνομά του ${symbols} σύμβολα 📚, πόσα βιβλία διάβασε συνολικά;`,
      correctVal: total,
      correctStr: String(total),
      explanation: `Πολλαπλασιάζουμε τα σύμβολα με την τιμή του υπομνήματος: ${symbols} · ${scale} ＝ ${total} βιβλία.`
    });
  }

  // Q2 (MCQ): Κανόνες ραβδογράμματος
  {
    const correctRule = 'Όλες οι ράβδοι πρέπει να έχουν αυστηρά το ίδιο πλάτος και ίσα κενά μεταξύ τους';
    const fake1 = 'Οι ράβδοι πρέπει να έχουν διαφορετικό πλάτος ανάλογα με την προτίμηση';
    const fake2 = 'Δεν χρειάζεται να αναγράφεται κλίμακα στον κατακόρυφο άξονα';
    const fake3 = 'Τα κενά ανάμεσα στις ράβδους πρέπει να μεγαλώνουν συνεχώς';

    const options = [
      { text: correctRule, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • ΚΑΝΟΝΕΣ ΚΑΤΑΣΚΕΥΗΣ ΡΑΒΔΟΓΡΑΜΜΑΤΟΣ',
      instruction: 'Επιλέξτε τον σωστό κανόνα:',
      prompt: `Ποιος από τους παρακάτω κανόνες είναι υποχρεωτικός κατά τη σχεδίαση ενός ραβδογράμματος;`,
      options,
      correctText: correctRule,
      explanation: `Στο ραβδόγραμμα μόνο το ύψος των ράβδων αλλάζει (ανάλογα με τη συχνότητα). Το πλάτος τους και οι αποστάσεις ανάμεσά τους παραμένουν αυστηρά ίσα.`
    });
  }

  // Q3 (Input - Decimal): Εύρεση πλήθους συμβόλων για εικονόγραμμα
  {
    const totalItems = pickRandom([40, 50, 60, 80, 100]);
    const scale = pickRandom([5, 10, 20]);
    const reqSyms = totalItems / scale;

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΣΧΕΔΙΑΣΗ ΣΥΜΒΟΛΩΝ',
      instruction: 'Βρείτε πόσα σύμβολα απαιτούνται:',
      prompt: `Θέλουμε να απεικονίσουμε ${totalItems} δέντρα σε εικονόγραμμα με υπόμνημα 🌲 ＝ ${scale} δέντρα. Πόσα σύμβολα 🌲 πρέπει να σχεδιάσουμε;`,
      correctVal: reqSyms,
      correctStr: String(reqSyms),
      explanation: `Διαιρούμε το συνολικό μέγεθος με την κλίμακα του υπομνήματος: ${totalItems} : ${scale} ＝ ${reqSyms} σύμβολα.`
    });
  }

  // Q4 (MCQ): Τι είναι η συχνότητα
  {
    const correctConcept = 'Ο αριθμός που δείχνει πόσες φορές εμφανίζεται μια συγκεκριμένη τιμή ή επιλογή';
    const fake1 = 'Το συνολικό άθροισμα όλων των αριθμών ενός προβλήματος';
    const fake2 = 'Η διαφορά ανάμεσα στη μέγιστη και την ελάχιστη τιμή';
    const fake3 = 'Το πλάτος της στήλης σε ένα ραβδόγραμμα';

    const options = [
      { text: correctConcept, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • Η ΕΝΝΟΙΑ ΤΗΣ ΣΥΧΝΟΤΗΤΑΣ',
      instruction: 'Επιλέξτε τον σωστό ορισμό:',
      prompt: `Τι ονομάζουμε «συχνότητα» ενός δεδομένου στη Στατιστική;`,
      options,
      correctText: correctConcept,
      explanation: `Συχνότητα είναι το πλήθος των φορών που παρατηρείται ή επαναλαμβάνεται μια συγκεκριμένη τιμή ή κατηγορία.`
    });
  }

  // Q5 (Input - Decimal): Ανάγνωση διαφοράς από ραβδόγραμμα
  {
    const valHigh = randInt(25, 40);
    const valLow = randInt(10, 20);
    const diff = valHigh - valLow;

    qList.push({
      id: 5,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 5 • ΣΥΓΚΡΙΣΗ ΥΨΩΝ ΡΑΒΔΩΝ',
      instruction: 'Υπολογίστε τη διαφορά συχνοτήτων:',
      prompt: `Σε ένα ραβδόγραμμα η ράβδος της κατηγορίας Α φτάνει στο νούμερο ${valHigh} και η ράβδος της κατηγορίας Β φτάνει στο νούμερο ${valLow}. Πόσο μεγαλύτερη είναι η συχνότητα της κατηγορίας Α;`,
      correctVal: diff,
      correctStr: String(diff),
      explanation: `Αφαιρούμε τα ύψη των δύο ράβδων: ${valHigh} － ${valLow} ＝ ${diff}.`
    });
  }

  // Q6 (MCQ): Γιατί είναι απαραίτητο το υπόμνημα
  {
    const correctReason = 'Επειδή χωρίς υπόμνημα δεν γνωρίζουμε πόσες μονάδες αντιπροσωπεύει κάθε εικόνα';
    const fake1 = 'Για να ομορφύνει το χρώμα του γραφήματος';
    const fake2 = 'Για να μην χρειάζεται να κάνουμε πολλαπλασιασμό';
    const fake3 = 'Επειδή είναι υποχρεωτικό μόνο στα ραβδογράμματα';

    const options = [
      { text: correctReason, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • Η ΣΗΜΑΣΙΑ ΤΟΥ ΥΠΟΜΝΗΜΑΤΟΣ',
      instruction: 'Επιλέξτε τη σωστή εξήγηση:',
      prompt: `Για ποιο λόγο είναι απολύτως απαραίτητο το υπόμνημα σε ένα εικονόγραμμα;`,
      options,
      correctText: correctReason,
      explanation: `Το υπόμνημα καθορίζει την αναλογία/κλίμακα του συμβόλου (π.χ. 1 σύμβολο ＝ 5 μονάδες). Χωρίς αυτό, το εικονόγραμμα δεν μπορεί να διαβαστεί ποσοτικά.`
    });
  }

  // Q7 & Q8: Κανονικά Προβλήματα από τη δεξαμενή (1 Input, 1 MCQ)
  {
    const shuffledStd = [...STANDARD_PROBLEMS_POOL].sort(() => Math.random() - 0.5);
    const stdProb1 = shuffledStd[0].generate();
    const stdProb2 = shuffledStd[1].generate();

    // Q7 (Input - Decimal)
    qList.push({
      id: 7,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΓΡΑΦΗΜΑΤΟΣ',
      instruction: 'Λύστε το πρόβλημα και εισαγάγετε το τελικό αποτέλεσμα:',
      prompt: stdProb1.text,
      correctVal: stdProb1.correctVal,
      correctStr: stdProb1.correctStr,
      explanation: stdProb1.explanation
    });

    // Q8 (MCQ)
    const val8 = stdProb2.correctVal;
    const unit8 = stdProb2.unit ? ` ${stdProb2.unit}` : '';
    const fake8A = typeof val8 === 'number' ? formatNum(val8 + randInt(5, 12)) : '0';
    const fake8B = typeof val8 === 'number' ? formatNum(Math.max(1, val8 - randInt(4, 10))) : '0';
    const fake8C = typeof val8 === 'number' ? formatNum(val8 * 1.4) : '0';

    const optionsQ8 = [
      { text: `${stdProb2.correctStr}${unit8}`, isCorrect: true },
      { text: `${fake8A}${unit8}`, isCorrect: false },
      { text: `${fake8B}${unit8}`, isCorrect: false },
      { text: `${fake8C}${unit8}`, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΕΡΜΗΝΕΙΑΣ ΔΕΔΟΜΕΝΩΝ',
      instruction: 'Επιλέξτε τη σωστή τιμή για το πρόβλημα:',
      prompt: stdProb2.text,
      options: optionsQ8,
      correctText: `${stdProb2.correctStr}${unit8}`,
      explanation: stdProb2.explanation
    });
  }

  // Q9 & Q10: Προβλήματα Αυξημένης Δυσκολίας (1 Input, 1 MCQ)
  {
    const shuffledHard = [...HARD_PROBLEMS_POOL].sort(() => Math.random() - 0.5);
    const hardProb1 = shuffledHard[0].generate();
    const hardProb2 = shuffledHard[1].generate();

    // Q9 (Input - Decimal)
    qList.push({
      id: 9,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 9 • ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΑΥΞΗΜΕΝΗΣ ΔΥΣΚΟΛΙΑΣ',
      instruction: 'Υπολογίστε με προσοχή και εισαγάγετε το αποτέλεσμα:',
      prompt: hardProb1.text,
      correctVal: hardProb1.correctVal,
      correctStr: hardProb1.correctStr,
      explanation: hardProb1.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας - Εμφάνιση '%' ΜΟΝΟ όταν πρόκειται για ποσοστό)
    const val10 = hardProb2.correctVal;
    const isPercentageQuestion = hardProb2.unit === '%';
    const unitSuffix = isPercentageQuestion ? ' %' : '';

    const fake10A = typeof val10 === 'number' ? formatNum(val10 + randInt(5, 10)) : '0';
    const fake10B = typeof val10 === 'number' ? formatNum(Math.max(2, val10 - randInt(3, 7))) : '0';
    const fake10C = typeof val10 === 'number' ? formatNum(val10 * 1.3) : '0';

    const optionsQ10 = [
      { text: `${hardProb2.correctStr}${unitSuffix}`, isCorrect: true },
      { text: `${fake10A}${unitSuffix}`, isCorrect: false },
      { text: `${fake10B}${unitSuffix}`, isCorrect: false },
      { text: `${fake10C}${unitSuffix}`, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 10,
      type: 'mcq',
      title: isPercentageQuestion
        ? 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΣΤΑΤΙΣΤΙΚΗΣ & ΠΟΣΟΣΤΩΝ'
        : 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΣΤΑΤΙΣΤΙΚΗΣ ΑΠΕΙΚΟΝΙΣΗΣ',
      instruction: 'Επιλέξτε τη σωστή απάντηση:',
      prompt: hardProb2.text,
      options: optionsQ10,
      correctText: `${hardProb2.correctStr}${unitSuffix}`,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

export default function ApeikonisiDataExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Δημιουργια νεων ασκησεων
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

  // Χειρισμος Input με καθαρισμο χαρακτηρων (0-9 και κομμα)
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

  // Χειρισμος MCQ
  const handleSelectMCQ = (qId, optionText) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: optionText
    }));
  };

  // Ελεγχος Απαντησεων
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
      title="Ασκήσεις: Απεικόνιση Δεδομένων (Ραβδόγραμμα & Εικονόγραμμα) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στα ραβδογράμματα, τα εικονογράμματα, την ερμηνεία υπομνήματος και τον υπολογισμό συχνοτήτων για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/55-apeikonisi-data"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>📖 Θεωρία</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-8 pb-32">
        
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-14 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
              <span>ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Ασκήσεις: Ραβδόγραμμα &amp; Εικονόγραμμα
            </h1>
            <p className="text-sky-100 text-sm sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες με 4 ρεαλιστικά προβλήματα (2 βασικά &amp; 2 αυξημένης δυσκολίας). Διαβάστε κλίμακες αξόνων, ερμηνεύστε υπομνήματα εικονογραμμάτων και υπολογίστε συχνότητες, διαφορές και ποσοστά.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
            <span className="text-xs sm:text-sm text-sky-200">
              ⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίες παραμέτρους.
            </span>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm"
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
                className={`bg-white rounded-3xl border p-6 sm:p-8 shadow-sm transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Επικεφαλιδα Ερωτησης */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
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
                <div className="space-y-3 mb-5">
                  <p className="text-xs sm:text-sm font-semibold text-slate-500">
                    {q.instruction}
                  </p>
                  <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                    {q.prompt}
                  </p>
                </div>

                {/* Περιοχη Απαντησης */}
                <div className="py-2">
                  
                  {/* Decimal / Number Input */}
                  {q.type === 'decimal_input' && (
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder="Απάντηση..."
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(`q_${q.id}`, e.target.value)}
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs text-slate-500">
                        (Ακέραιος η δεκαδικός με κόμμα)
                      </span>
                    </div>
                  )}

                  {/* Multiple Choice (MCQ) */}
                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[`q_${q.id}`] === opt.text;
                        return (
                          <button
                            key={`opt-${q.id}-${oIdx}`}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleSelectMCQ(q.id, opt.text)}
                            className={`p-3.5 rounded-2xl border text-left font-semibold text-sm sm:text-base transition active:scale-98 touch-manipulation flex items-center justify-between ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            } disabled:cursor-not-allowed`}
                          >
                            <span>{opt.text}</span>
                            <span
                              className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
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
                    className={`mt-4 p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-1.5 ${
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
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-lg px-8 py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation"
          >
            <span>🎯 Έλεγχος Απαντήσεων</span>
          </button>
        </div>

      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">
                ΣΚΟΡ
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-amber-300">
                {score} <span className="text-slate-500 text-base">/ 10</span>
              </span>
            </div>

            <div className="hidden xs:block border-l border-slate-700 pl-4 sm:pl-8">
              <span className="text-xs text-slate-400 font-semibold block">
                ΠΟΣΟΣΤΟ
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-emerald-400">
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
