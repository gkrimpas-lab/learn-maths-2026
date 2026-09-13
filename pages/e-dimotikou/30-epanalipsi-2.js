// pages/e-dimotikou/30-epanalipsi-2.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --- ΔΕΞΑΜΕΝΗ ΓΕΝΝΗΤΡΙΩΝ ΑΣΚΗΣΕΩΝ ΓΙΑ ΤΑ ΚΕΦΑΛΑΙΑ 13 ΕΩΣ 29 --- //

// ΚΕΦΑΛΑΙΟ 13: Κλάσματα (Ισοδυναμία & Απλοποίηση)
function genCh13(variant) {
  if (variant === 1) {
    const mult = getRandomInt(3, 7);
    const num = getRandomInt(2, 5);
    const den = getRandomInt(num + 1, 9);
    const bigNum = num * mult;
    const bigDen = den * mult;
    return {
      ch: 13,
      title: 'ΚΕΦ. 13 • ΙΣΟΔΥΝΑΜΑ ΚΛΑΣΜΑΤΑ',
      type: 'input',
      correct: bigDen,
      unit: '(παρονομαστής)',
      prompt: `Βρες τον άγνωστο όρο ώστε τα κλάσματα να είναι ισοδύναμα: ${num}/${den} ＝ ${bigNum}/?`,
      explanation: `Ο αριθμητής πολλαπλασιάστηκε με το ${mult} (${num} · ${mult} ＝ ${bigNum}). Επομένως πολλαπλασιάζουμε και τον παρονομαστή με το ${mult}: ${den} · ${mult} ＝ ${bigDen}.`
    };
  } else {
    const cases = [
      { f: '12/18', simp: '2/3', distractors: ['3/4', '1/2', '4/5'] },
      { f: '15/20', simp: '3/4', distractors: ['2/3', '4/5', '1/4'] },
      { f: '18/24', simp: '3/4', distractors: ['2/3', '5/6', '3/8'] },
      { f: '14/21', simp: '2/3', distractors: ['1/3', '3/4', '4/7'] }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];
    return {
      ch: 13,
      title: 'ΚΕΦ. 13 • ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ',
      type: 'mcq',
      correct: c.simp,
      options: shuffleArray([c.simp, ...c.distractors]),
      prompt: `Ποιο είναι το ισοδύναμο ανάγωγο (πλήρως απλοποιημένο) κλάσμα του ${c.f};`,
      explanation: `Διαιρούμε αριθμητή και παρονομαστή με τον Μέγιστο Κοινό Διαιρέτη τους και βρίσκουμε το ${c.simp}.`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 14: Πρόσθεση & Αφαίρεση Κλασμάτων
function genCh14(variant) {
  if (variant === 1) {
    // Πρόσθεση ετερώνυμων: 1/a + 1/b
    const a = 3;
    const b = 4;
    // 1/3 + 1/4 = 7/12
    return {
      ch: 14,
      title: 'ΚΕΦ. 14 • ΠΡΟΣΘΕΣΗ ΕΤΕΡΩΝΥΜΩΝ',
      type: 'mcq',
      correct: '7/12',
      options: shuffleArray(['7/12', '2/7', '2/12', '5/12']),
      prompt: `Ποιο είναι το αποτέλεσμα της πρόσθεσης: 1/3 ＋ 1/4 ＝ ;`,
      explanation: `Βρίσκουμε το ΕΚΠ(3, 4) ＝ 12 και μετατρέπουμε σε ομώνυμα: 4/12 ＋ 3/12 ＝ 7/12.`
    };
  } else {
    // Αφαίρεση από ακέραιο: 2 - 3/5 = 10/5 - 3/5 = 7/5 = 1 2/5
    return {
      ch: 14,
      title: 'ΚΕΦ. 14 • ΑΦΑΙΡΕΣΗ ΑΠΟ ΑΚΕΡΑΙΟ',
      type: 'mcq',
      correct: '7/5',
      options: shuffleArray(['7/5', '1/5', '3/5', '9/5']),
      prompt: `Ποιο είναι το αποτέλεσμα της πράξης: 2 － 3/5 ＝ ;`,
      explanation: `Γράφουμε τον ακέραιο 2 ως κλάσμα με παρονομαστή το 5: 2 ＝ 10/5. Άρα 10/5 － 3/5 ＝ 7/5.`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 15: Πολλαπλασιασμός Κλασμάτων
function genCh15(variant) {
  if (variant === 1) {
    // Κλάσμα επί ακέραιο
    const whole = getRandomInt(3, 6);
    const num = 2;
    const den = 3;
    const resNum = whole * num;
    return {
      ch: 15,
      title: 'ΚΕΦ. 15 • ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΜΕ ΑΚΕΡΑΙΟ',
      type: 'input',
      correct: resNum,
      unit: '/3 (αριθμητής)',
      prompt: `Υπολόγισε τον αριθμητή του αποτελέσματος: ${whole} · 2/3 ＝ ?/3`,
      explanation: `Πολλαπλασιάζουμε τον ακέραιο αποκλειστικά με τον αριθμητή: ${whole} · 2 ＝ ${resNum}. Το κλάσμα είναι ${resNum}/3.`
    };
  } else {
    // 2/3 · 3/4 = 6/12 = 1/2
    return {
      ch: 15,
      title: 'ΚΕΦ. 15 • ΓΙΝΟΜΕΝΟ ΚΛΑΣΜΑΤΩΝ',
      type: 'mcq',
      correct: '1/2',
      options: shuffleArray(['1/2', '5/7', '6/7', '2/4']),
      prompt: `Υπολόγισε το γινόμενο των κλασμάτων σε ανάγωγη μορφή: 2/3 · 3/4 ＝ ;`,
      explanation: `Πολλαπλασιάζουμε αριθμητές και παρονομαστές: ( 2 · 3 ) / ( 3 · 4 ) ＝ 6/12 ＝ 1/2.`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 16: Διαίρεση Κλασμάτων & Αντίστροφοι
function genCh16(variant) {
  if (variant === 1) {
    // 3/4 : 1/2 = 3/4 · 2/1 = 6/4 = 3/2
    return {
      ch: 16,
      title: 'ΚΕΦ. 16 • ΔΙΑΙΡΕΣΗ ΚΛΑΣΜΑΤΩΝ',
      type: 'mcq',
      correct: '3/2',
      options: shuffleArray(['3/2', '3/8', '1/2', '4/3']),
      prompt: `Ποιο είναι το αποτέλεσμα της διαίρεσης σε απλοποιημένη μορφή: 3/4 ： 1/2 ＝ ;`,
      explanation: `Αντιστρέφουμε τον διαιρέτη και κάνουμε πολλαπλασιασμό: 3/4 · 2/1 ＝ 6/4 ＝ 3/2.`
    };
  } else {
    return {
      ch: 16,
      title: 'ΚΕΦ. 16 • ΑΝΤΙΣΤΡΟΦΟΙ ΑΡΙΘΜΟΙ',
      type: 'mcq',
      correct: '5/4',
      options: shuffleArray(['5/4', '4/5', '1/4', '5/1']),
      prompt: `Ποιος είναι ο αντίστροφος αριθμός του μεικτού αριθμού 1 1/4;`,
      explanation: `Πρώτα μετατρέπουμε τον μεικτό σε κλάσμα: 1 1/4 ＝ 5/4. Ο αντίστροφος αριθμός είναι το 4/5 (ή αντίστροφα του 4/5 είναι το 5/4).`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 17: Δεκαδικά Κλάσματα & Δεκαδικοί
function genCh17(variant) {
  if (variant === 1) {
    const whole = getRandomInt(1, 9);
    const frac = 25; // 25/1000 = 0.025
    const val = parseFloat((whole + frac / 1000).toFixed(3));
    return {
      ch: 17,
      title: 'ΚΕΦ. 17 • ΔΕΚΑΔΙΚΟ ΚΛΑΣΜΑ ΣΕ ΑΡΙΘΜΟ',
      type: 'input',
      correct: val,
      unit: '(δεκαδικός)',
      prompt: `Γράψε ως δεκαδικό αριθμό το κλάσμα ${whole * 1000 + frac}/1.000:`,
      explanation: `Διαιρούμε με το 1.000 μετακινώντας την υποδιαστολή 3 θέσεις αριστερά: ${val.toLocaleString('el-GR')}.`
    };
  } else {
    return {
      ch: 17,
      title: 'ΚΕΦ. 17 • ΑΞΙΑ ΘΕΣΗΣ ΨΗΦΙΟΥ',
      type: 'mcq',
      correct: 'Εκατοστά',
      options: shuffleArray(['Εκατοστά', 'Δέκατα', 'Χιλιοστά', 'Δεκάδες']),
      prompt: `Στον δεκαδικό αριθμό 48,275 ποια είναι η αξία θέσης του ψηφίου 7;`,
      explanation: `Το 2 είναι τα δέκατα, το 7 είναι τα εκατοστά και το 5 είναι τα χιλιοστά.`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 18: Πράξεις με Δεκαδικούς (Πρόσθεση, Αφαίρεση, Πολλαπλασιασμός)
function genCh18(variant) {
  if (variant === 1) {
    // 15 - 3,45 = 11,55
    const whole = [10, 15, 20, 25][getRandomInt(0, 3)];
    const sub = 3.45;
    const res = parseFloat((whole - sub).toFixed(2));
    return {
      ch: 18,
      title: 'ΚΕΦ. 18 • ΑΦΑΙΡΕΣΗ ΔΕΚΑΔΙΚΩΝ',
      type: 'input',
      correct: res,
      unit: '(αποτέλεσμα)',
      prompt: `Υπολόγισε το αποτέλεσμα της αφαίρεσης: ${whole} － ${sub.toLocaleString('el-GR')} ＝ ?`,
      explanation: `Συμπληρώνουμε μηδενικά στον ακέραιο: ${whole},00 － ${sub.toLocaleString('el-GR')} ＝ ${res.toLocaleString('el-GR')}.`
    };
  } else {
    // 0,4 · 0,5 = 0,2
    return {
      ch: 18,
      title: 'ΚΕΦ. 18 • ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΔΕΚΑΔΙΚΩΝ',
      type: 'mcq',
      correct: '0,2',
      options: shuffleArray(['0,2', '2', '0,02', '0,200']),
      prompt: `Ποιο είναι το αποτέλεσμα του πολλαπλασιασμού: 0,4 · 0,5 ＝ ;`,
      explanation: `4 · 5 ＝ 20. Έχουμε συνολικά 2 δεκαδικά ψηφία, άρα 0,20 ＝ 0,2.`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 19: Διαίρεση Δεκαδικών
function genCh19(variant) {
  if (variant === 1) {
    // 14,4 : 1,2 = 12
    return {
      ch: 19,
      title: 'ΚΕΦ. 19 • ΔΙΑΙΡΕΣΗ ΜΕ ΔΕΚΑΔΙΚΟ ΔΙΑΙΡΕΤΗ',
      type: 'input',
      correct: 12,
      unit: '(πηλίκο)',
      prompt: `Υπολόγισε το πηλίκο της διαίρεσης: 14,4 ： 1,2 ＝ ?`,
      explanation: `Πολλαπλασιάζουμε διαιρετέο και διαιρέτη με το 10 για να γίνει ο διαιρέτης ακέραιος: 144 ： 12 ＝ 12.`
    };
  } else {
    // 45 : 100 = 0,45
    return {
      ch: 19,
      title: 'ΚΕΦ. 19 • ΔΙΑΙΡΕΣΗ ΜΕ 100',
      type: 'mcq',
      correct: '0,45',
      options: shuffleArray(['0,45', '4,5', '0,045', '450']),
      prompt: `Ποιο είναι το πηλίκο της διαίρεσης: 45 ： 100 ＝ ;`,
      explanation: `Στη διαίρεση με το 100 μετακινούμε την υποδιαστολή 2 θέσεις αριστερά: 0,45.`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 20: Μήκος Κύκλου
function genCh20(variant) {
  if (variant === 1) {
    // L = π · δ με π = 3,14 και δ = 10 -> L = 31,4 cm
    const d = [10, 20, 30][getRandomInt(0, 2)];
    const l = parseFloat((3.14 * d).toFixed(2));
    return {
      ch: 20,
      title: 'ΚΕΦ. 20 • ΜΗΚΟΣ ΚΥΚΛΟΥ',
      type: 'input',
      correct: l,
      unit: 'cm',
      prompt: `Ένας κύκλος έχει διάμετρο δ ＝ ${d} cm. Πόσο είναι το μήκος του ( L ), αν χρησιμοποιήσουμε π ＝ 3,14;`,
      explanation: `Εφαρμόζουμε τον τύπο L ＝ π · δ: 3,14 · ${d} ＝ ${l.toLocaleString('el-GR')} cm.`
    };
  } else {
    return {
      ch: 20,
      title: 'ΚΕΦ. 20 • ΑΡΙΘΜΟΣ π',
      type: 'mcq',
      correct: 'Το πηλίκο του μήκους του κύκλου προς τη διάμετρό του ( L ： δ )',
      options: [
        'Το πηλίκο του μήκους του κύκλου προς τη διάμετρό του ( L ： δ )',
        'Το γινόμενο της ακτίνας επί τη διάμετρο',
        'Η περίμετρος ενός τετραγώνου',
        'Το μισό της ακτίνας του κύκλου'
      ],
      prompt: `Τι εκφράζει στη γεωμετρία ο σταθερός αριθμός π ≈ 3,14;`,
      explanation: `Σε οποιονδήποτε κύκλο, αν διαιρέσουμε το μήκος του κύκλου με τη διάμετρό του ( L ： δ ), βρίσκουμε πάντοτε τον αριθμό π ≈ 3,14.`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 21: Μονάδες Μέτρησης Μήκους
function genCh21(variant) {
  if (variant === 1) {
    const km = 3.5;
    const m = 3500;
    return {
      ch: 21,
      title: 'ΚΕΦ. 21 • ΜΕΤΑΤΡΟΠΗ km ΣΕ m',
      type: 'input',
      correct: m,
      unit: 'm',
      prompt: `Μετάτρεψε την απόσταση των ${km.toLocaleString('el-GR')} km σε μέτρα ( m ):`,
      explanation: `Επειδή 1 km ＝ 1.000 m, πολλαπλασιάζουμε με το 1.000: ${km.toLocaleString('el-GR')} · 1.000 ＝ ${m.toLocaleString('el-GR')} m.`
    };
  } else {
    return {
      ch: 21,
      title: 'ΚΕΦ. 21 • ΚΑΝΟΝΑΣ ΣΚΑΛΑΣ ΜΗΚΟΥΣ',
      type: 'mcq',
      correct: 'Διαιρούμε με το 100',
      options: shuffleArray(['Διαιρούμε με το 100', 'Πολλαπλασιάζουμε με το 100', 'Διαιρούμε με το 10', 'Πολλαπλασιάζουμε με το 1.000']),
      prompt: `Όταν μετατρέπουμε από εκατοστά ( cm ) σε μέτρα ( m ), τι μαθηματική πράξη κάνουμε;`,
      explanation: `Ανεβαίνουμε 2 σκαλοπάτια (από μικρότερη σε μεγαλύτερη μονάδα), άρα διαιρούμε με το 100.`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 22: Πολύγωνα
function genCh22(variant) {
  if (variant === 1) {
    // Περίμετρος ανώμαλου τετραπλεύρου
    const a = 8;
    const b = 12;
    const c = 7;
    const d = 15;
    const p = a + b + c + d;
    return {
      ch: 22,
      title: 'ΚΕΦ. 22 • ΠΕΡΙΜΕΤΡΟΣ ΠΟΛΥΓΩΝΟΥ',
      type: 'input',
      correct: p,
      unit: 'cm',
      prompt: `Ένα τετράπλευρο έχει πλευρές ${a} cm, ${b} cm, ${c} cm και ${d} cm. Πόσα cm είναι η περίμετρός του;`,
      explanation: `Προσθέτουμε όλες τις πλευρές: ${a} ＋ ${b} ＋ ${c} ＋ ${d} ＝ ${p} cm.`
    };
  } else {
    return {
      ch: 22,
      title: 'ΚΕΦ. 22 • ΔΙΑΓΩΝΙΟΙ ΤΡΙΓΩΝΟΥ',
      type: 'mcq',
      correct: '0 διαγώνιους',
      options: shuffleArray(['0 διαγώνιους', '1 διαγώνιο', '3 διαγώνιους', '2 διαγώνιους']),
      prompt: `Πόσες διαγωνίους έχει συνολικά ένα τρίγωνο;`,
      explanation: `Το τρίγωνο δεν έχει καμία μη διαδοχική κορυφή, επομένως έχει ακριβώς 0 διαγωνίους.`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 23: Κανονικά Πολύγωνα
function genCh23(variant) {
  if (variant === 1) {
    // Κεντρική γωνία εξαγώνου: 360 : 6 = 60
    return {
      ch: 23,
      title: 'ΚΕΦ. 23 • ΚΕΝΤΡΙΚΗ ΓΩΝΙΑ',
      type: 'input',
      correct: 60,
      unit: 'μοίρες ( ° )',
      prompt: `Πόσες μοίρες είναι η κεντρική γωνία ενός κανονικού εξαγώνου ( 6 πλευρές );`,
      explanation: `Διαιρούμε τον πλήρη κύκλο με το πλήθος των πλευρών: 360° ： 6 ＝ 60°.`
    };
  } else {
    return {
      ch: 23,
      title: 'ΚΕΦ. 23 • ΟΡΙΣΜΟΣ ΚΑΝΟΝΙΚΟΥ ΠΟΛΥΓΩΝΟΥ',
      type: 'mcq',
      correct: 'Όλες οι πλευρές του είναι ίσες ΚΑΙ όλες οι γωνίες του είναι ίσες',
      options: [
        'Όλες οι πλευρές του είναι ίσες ΚΑΙ όλες οι γωνίες του είναι ίσες',
        'Έχει μόνο όλες τις γωνίες του ίσες με 90°',
        'Έχει άρτιο αριθμό πλευρών',
        'Έχει περίμετρο μεγαλύτερη από 100 cm'
      ],
      prompt: `Πότε ένα πολύγωνο χαρακτηρίζεται ως ΚΑΝΟΝΙΚΟ;`,
      explanation: `Ένα πολύγωνο είναι κανονικό όταν είναι ταυτόχρονα ισόπλευρο (όλες οι πλευρές ίσες) και ισογώνιο (όλες οι γωνίες ίσες).`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 24: Περίμετρος
function genCh24(variant) {
  if (variant === 1) {
    // Ορθογώνιο: Μήκος 18, Πλάτος 12 -> Π = 2 · 30 = 60 m
    const l = 18;
    const w = 12;
    const p = 2 * (l + w);
    return {
      ch: 24,
      title: 'ΚΕΦ. 24 • ΠΕΡΙΜΕΤΡΟΣ ΟΡΘΟΓΩΝΙΟΥ',
      type: 'input',
      correct: p,
      unit: 'm',
      prompt: `Ένα οικόπεδο έχει μήκος ${l} m και πλάτος ${w} m. Πόσα μέτρα είναι η περίμετρός του;`,
      explanation: `Π ＝ 2 · ( Μήκος ＋ Πλάτος ) ＝ 2 · ( ${l} ＋ ${w} ) ＝ 2 · ${l + w} ＝ ${p} m.`
    };
  } else {
    return {
      ch: 24,
      title: 'ΚΕΦ. 24 • ΠΕΡΙΜΕΤΡΟΣ ΤΕΤΡΑΓΩΝΟΥ',
      type: 'mcq',
      correct: '9 cm',
      options: shuffleArray(['9 cm', '18 cm', '6 cm', '12 cm']),
      prompt: `Ένα τετράγωνο έχει περίμετρο 36 cm. Πόσο είναι το μήκος της κάθε πλευράς του;`,
      explanation: `Διαιρούμε την περίμετρο με το 4: 36 ： 4 ＝ 9 cm.`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 25: Έννοια Εμβαδού
function genCh25(variant) {
  if (variant === 1) {
    // Εμβαδόν ορθογωνίου: 8 x 6 = 48 cm²
    const l = 8;
    const w = 6;
    const a = l * w;
    return {
      ch: 25,
      title: 'ΚΕΦ. 25 • ΕΜΒΑΔΟΝ ΟΡΘΟΓΩΝΙΟΥ',
      type: 'input',
      correct: a,
      unit: 'cm²',
      prompt: `Πόσα cm² είναι το εμβαδόν ενός ορθογωνίου με μήκος ${l} cm και πλάτος ${w} cm;`,
      explanation: `Εμβαδόν ＝ Μήκος · Πλάτος ＝ ${l} · ${w} ＝ ${a} cm².`
    };
  } else {
    return {
      ch: 25,
      title: 'ΚΕΦ. 25 • ΜΟΝΑΔΑ ΕΜΒΑΔΟΥ',
      type: 'mcq',
      correct: 'Σε τετραγωνικές μονάδες ( cm², m² )',
      options: shuffleArray(['Σε τετραγωνικές μονάδες ( cm², m² )', 'Σε γραμμικές μονάδες ( cm, m )', 'Σε κυβικές μονάδες ( cm³, m³ )', 'Σε λίτρα ( l )']),
      prompt: `Σε ποιες μονάδες μετράμε το ΕΜΒΑΔΟΝ μιας επιφάνειας;`,
      explanation: `Το εμβαδόν εκφράζει δισδιάστατη επιφάνεια και μετριέται σε τετραγωνικές μονάδες (τετραγωνικά εκατοστά cm², τετραγωνικά μέτρα m²).`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 26: Εμβαδόν Σχημάτων (Τρίγωνα & Σύνθετα)
function genCh26(variant) {
  if (variant === 1) {
    // Ορθογώνιο τρίγωνο: (8 · 6) : 2 = 24 cm²
    const b = 8;
    const h = 6;
    const a = (b * h) / 2;
    return {
      ch: 26,
      title: 'ΚΕΦ. 26 • ΕΜΒΑΔΟΝ ΟΡΘΟΓΩΝΙΟΥ ΤΡΙΓΩΝΟΥ',
      type: 'input',
      correct: a,
      unit: 'cm²',
      prompt: `Ένα ορθογώνιο τρίγωνο έχει κάθετες πλευρές ${b} cm και ${h} cm. Πόσα cm² είναι το εμβαδόν του;`,
      explanation: `Εμβαδόν Τριγώνου ＝ ( Βάση · Ύψος ) ： 2 ＝ ( ${b} · ${h} ) ： 2 ＝ ${b * h} ： 2 ＝ ${a} cm².`
    };
  } else {
    return {
      ch: 26,
      title: 'ΚΕΦ. 26 • ΣΧΕΣΗ ΤΡΙΓΩΝΟΥ & ΟΡΘΟΓΩΝΙΟΥ',
      type: 'mcq',
      correct: 'Είναι ακριβώς το μισό του ορθογωνίου ( : 2 )',
      options: [
        'Είναι ακριβώς το μισό του ορθογωνίου ( : 2 )',
        'Είναι διπλάσιο από το ορθογώνιο ( · 2 )',
        'Είναι ίσο με το ορθογώνιο',
        'Είναι το ένα τρίτο του ορθογωνίου ( : 3 )'
      ],
      prompt: `Ποια σχέση έχει το εμβαδόν ενός ορθογώνιου τριγώνου με το εμβαδόν ενός ορθογωνίου που έχει τις ίδιες διαστάσεις;`,
      explanation: `Η διαγώνιος του ορθογωνίου το χωρίζει σε δύο ίσα ορθογώνια τρίγωνα, γι' αυτό το εμβαδόν του τριγώνου είναι ακριβώς το μισό.`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 27: Μονάδες Επιφάνειας
function genCh27(variant) {
  if (variant === 1) {
    // 4,5 m² = 450 dm²
    const m2 = 4.5;
    const dm2 = 450;
    return {
      ch: 27,
      title: 'ΚΕΦ. 27 • ΜΕΤΑΤΡΟΠΗ m² ΣΕ dm²',
      type: 'input',
      correct: dm2,
      unit: 'dm²',
      prompt: `Μετάτρεψε την επιφάνεια των ${m2.toLocaleString('el-GR')} m² σε τετραγωνικά δεκατόμετρα ( dm² ):`,
      explanation: `Στις μονάδες επιφάνειας κάθε σκαλοπάτι αξίζει 100. Άρα: ${m2.toLocaleString('el-GR')} · 100 ＝ ${dm2} dm².`
    };
  } else {
    return {
      ch: 27,
      title: 'ΚΕΦ. 27 • ΣΤΡΕΜΜΑΤΑ',
      type: 'mcq',
      correct: '1.000 m²',
      options: shuffleArray(['1.000 m²', '100 m²', '10.000 m²', '100.000 m²']),
      prompt: `Σε πόσα τετραγωνικά μέτρα ( m² ) ισούται ακριβώς 1 στρέμμα;`,
      explanation: `1 στρέμμα ＝ 1.000 m².`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 28: Έννοια Όγκου
function genCh28(variant) {
  if (variant === 1) {
    // V = 5 · 4 · 3 = 60 cm³
    const l = 5;
    const w = 4;
    const h = 3;
    const v = l * w * h;
    return {
      ch: 28,
      title: 'ΚΕΦ. 28 • ΥΠΟΛΟΓΙΣΜΟΣ ΟΓΚΟΥ',
      type: 'input',
      correct: v,
      unit: 'cm³',
      prompt: `Ένα κουτί έχει μήκος ${l} cm, πλάτος ${w} cm και ύψος ${h} cm. Πόσα cm³ είναι ο όγκος του;`,
      explanation: `Όγκος ＝ Μήκος · Πλάτος · Ύψος ＝ ${l} · ${w} · ${h} ＝ ${v} cm³.`
    };
  } else {
    return {
      ch: 28,
      title: 'ΚΕΦ. 28 • ΧΩΡΗΤΙΚΟΤΗΤΑ & ΛΙΤΡΟ',
      type: 'mcq',
      correct: '1 dm³',
      options: shuffleArray(['1 dm³', '1 cm³', '1 m³', '10 dm³']),
      prompt: `Σε ποια κυβική μονάδα όγκου ισοδυναμεί ακριβώς 1 λίτρο ( 1 l ) υγρού;`,
      explanation: `1 λίτρο ισούται με 1 κυβικό δεκατόμετρο ( 1 dm³ ＝ 1.000 cm³ ).`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 29: Όγκοι Σχημάτων & Στερεά
function genCh29(variant) {
  if (variant === 1) {
    // Όγκος κύβου: 4 · 4 · 4 = 64 cm³
    const a = 4;
    const v = a * a * a;
    return {
      ch: 29,
      title: 'ΚΕΦ. 29 • ΟΓΚΟΣ ΚΥΒΟΥ',
      type: 'input',
      correct: v,
      unit: 'cm³',
      prompt: `Ένας κύβος έχει ακμή μήκους ${a} cm. Πόσα cm³ είναι ο όγκος του;`,
      explanation: `V ＝ α · α · α ＝ ${a} · ${a} · ${a} ＝ ${v} cm³.`
    };
  } else {
    return {
      ch: 29,
      title: 'ΚΕΦ. 29 • ΣΧΕΣΗ ΠΡΙΣΜΑΤΟΣ & ΠΥΡΑΜΙΔΑΣ',
      type: 'mcq',
      correct: 'Η πυραμίδα έχει το ένα τρίτο του όγκου του πρίσματος ( : 3 )',
      options: [
        'Η πυραμίδα έχει το ένα τρίτο του όγκου του πρίσματος ( : 3 )',
        'Η πυραμίδα έχει τον μισό όγκο του πρίσματος ( : 2 )',
        'Έχουν ακριβώς τον ίδιο όγκο',
        'Η πυραμίδα έχει τριπλάσιο όγκο από το πρίσμα'
      ],
      prompt: `Ποια σχέση έχει ο όγκος μιας πυραμίδας με τον όγκο ενός πρίσματος που έχει την ίδια βάση και το ίδιο ύψος;`,
      explanation: `Ο όγκος της πυραμίδας (και του κώνου) ισούται με το ένα τρίτο (: 3) του όγκου του αντίστοιχου πρίσματος (ή κυλίνδρου).`
    };
  }
}

// Δημιουργία των 34 ασκήσεων (2 από κάθε κεφάλαιο 13-29)
function generateAllQuestions() {
  const generators = [
    genCh13, genCh14, genCh15, genCh16, genCh17,
    genCh18, genCh19, genCh20, genCh21, genCh22,
    genCh23, genCh24, genCh25, genCh26, genCh27,
    genCh28, genCh29
  ];

  const qMap = {};
  generators.forEach((gen, idx) => {
    const chNum = 13 + idx;
    qMap[`q_${chNum}_1`] = gen(1);
    qMap[`q_${chNum}_2`] = gen(2);
  });

  return qMap;
}

export default function Epanalipsi2Page() {
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuiz = () => {
    const newQ = generateAllQuestions();
    setQuestions(newQ);
    const initialAns = {};
    Object.keys(newQ).forEach((k) => {
      initialAns[k] = '';
    });
    setAnswers(initialAns);
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewQuiz();
  }, []);

  if (!questions) return null;

  const handleStrictNumberInput = (key, rawVal) => {
    if (submitted) return;
    let clean = rawVal.replace('.', ',').replace(/[^0-9,]/g, '');
    const parts = clean.split(',');
    if (parts.length > 2) {
      clean = parts[0] + ',' + parts.slice(1).join('');
    }
    if (clean.length > 10) {
      clean = clean.slice(0, 10);
    }
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const handleMcqSelect = (key, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const parseUserFloat = (val) => {
    if (!val || val === ',') return NaN;
    return parseFloat(val.replace(',', '.'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;
    Object.keys(questions).forEach((key) => {
      const q = questions[key];
      if (q.type === 'input') {
        const uVal = parseUserFloat(answers[key]);
        if (!isNaN(uVal) && Math.abs(uVal - q.correct) < 0.01) {
          currentScore += 1;
        }
      } else {
        if (answers[key] === q.correct) {
          currentScore += 1;
        }
      }
    });

    setScore(currentScore);
    setSubmitted(true);
  };

  const totalQuestions = Object.keys(questions).length; // 34

  return (
    <Layout
      title="Επανάληψη 2 (Κεφάλαια 13 - 29) - Ε' Δημοτικού | LearnMaths.gr"
      description="Μεγάλη επαναληπτική δοκιμασία μαθηματικών Ε' Δημοτικού στα κεφάλαια 13 έως 29: κλάσματα, δεκαδικοί, μήκος κύκλου, πολύγωνα, περίμετρος, εμβαδόν και όγκος."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl text-sm 2xl:text-base transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📚</span> Ύλη
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-8 pb-32">
        
        {/* HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-14 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-4xl">
            <span className="bg-white/10 border border-white/20 text-sky-200 text-xs 2xl:text-sm font-black px-3.5 py-1.5 rounded-full tracking-wider inline-block">
              Ε' ΔΗΜΟΤΙΚΟΥ • ΜΕΓΑΛΗ ΕΠΑΝΑΛΗΨΗ 2
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight pt-1">
              📝 Επαναληπτικό Τεστ: Κεφάλαια 13 έως 29
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed">
              34 απαιτητικές ασκήσεις (2 από κάθε κεφάλαιο: κλάσματα, δεκαδικοί, γεωμετρία, περίμετρος, εμβαδόν και όγκος). Δημιουργούνται δυναμικά από τη δεξαμενή!
            </p>
          </div>

          <button
            type="button"
            onClick={loadNewQuiz}
            className="bg-amber-400 text-slate-950 font-black px-5 py-3 sm:px-7 sm:py-4 rounded-2xl shadow-lg hover:bg-amber-300 transition active:scale-95 text-sm sm:text-base whitespace-nowrap shrink-0 self-stretch md:self-auto text-center"
          >
            🔄 Νέες Ασκήσεις
          </button>
        </section>

        {/* ΦΟΡΜΑ 34 ΑΣΚΗΣΕΩΝ ΟΜΑΔΟΠΟΙΗΜΕΝΩΝ ΑΝΑ ΚΕΦΑΛΑΙΟ */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {Array.from({ length: 17 }).map((_, i) => {
            const chNum = 13 + i;
            const k1 = `q_${chNum}_1`;
            const k2 = `q_${chNum}_2`;
            const q1 = questions[k1];
            const q2 = questions[k2];

            return (
              <div key={chNum} className="space-y-4 bg-slate-50 p-4 sm:p-6 2xl:p-8 rounded-3xl border border-slate-200">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <span className="bg-blue-600 text-white font-mono font-black text-xs px-2.5 py-1 rounded-lg">
                    ΚΕΦ. {chNum}
                  </span>
                  <h2 className="text-sm sm:text-base font-black text-slate-800 uppercase tracking-wide">
                    {q1.title.split('•')[1]?.trim() || `Κεφάλαιο ${chNum}`}
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Άσκηση 1 */}
                  {renderQuestionCard(k1, q1, i * 2 + 1, answers, submitted, handleStrictNumberInput, handleMcqSelect, parseUserFloat)}
                  {/* Άσκηση 2 */}
                  {renderQuestionCard(k2, q2, i * 2 + 2, answers, submitted, handleStrictNumberInput, handleMcqSelect, parseUserFloat)}
                </div>
              </div>
            );
          })}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-6">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-xl font-black px-12 py-4 sm:py-5 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95"
              >
                🎯 Έλεγχος Όλων των Απαντήσεων (34)
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 2xl:py-5 z-50">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 2xl:px-5 2xl:py-2 rounded-xl text-base sm:text-lg 2xl:text-xl flex items-center gap-2 shadow-sm">
              <span>🏆 Σκορ:</span>
              <span className="text-xl sm:text-2xl 2xl:text-3xl font-mono">{score} / {totalQuestions}</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-300">
                Επιτυχία: <span className="text-emerald-400 font-black">{Math.round((score / totalQuestions) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewQuiz}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 2xl:px-7 2xl:py-2.5 rounded-xl shadow-md transition text-xs sm:text-sm 2xl:text-base flex items-center gap-2 active:scale-95"
              >
                <span>🔄</span> Νέες Ασκήσεις
              </button>
            ) : (
              <p className="text-xs 2xl:text-sm text-slate-400 hidden sm:block">
                Απάντησε και στις 34 ερωτήσεις και πάτα «Έλεγχος Όλων των Απαντήσεων»!
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Βοηθητικό Render Component για Κάρτα Ερώτησης
function renderQuestionCard(key, qData, numIdx, answers, submitted, handleStrictNumberInput, handleMcqSelect, parseUserFloat) {
  let isCorrect = false;
  if (submitted) {
    if (qData.type === 'input') {
      const uVal = parseUserFloat(answers[key]);
      isCorrect = !isNaN(uVal) && Math.abs(uVal - qData.correct) < 0.01;
    } else {
      isCorrect = answers[key] === qData.correct;
    }
  }

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between ${
        submitted
          ? isCorrect
            ? 'border-emerald-500 bg-emerald-50/25'
            : 'border-rose-400 bg-rose-50/25'
          : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-start gap-2.5">
          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-indigo-600 text-white font-mono font-black text-xs shrink-0 flex items-center justify-center">
            {numIdx}
          </span>
          <h3 className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-900 leading-snug">
            {qData.prompt}
          </h3>
        </div>

        {/* INPUT TYPE */}
        {qData.type === 'input' ? (
          <div className="flex items-center gap-2.5 pl-8 sm:pl-9">
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              maxLength={10}
              placeholder="?"
              value={answers[key] || ''}
              onChange={(e) => handleStrictNumberInput(key, e.target.value)}
              disabled={submitted}
              className="w-28 sm:w-36 h-10 sm:h-11 text-center rounded-xl border-2 border-slate-300 font-mono text-base font-black focus:border-indigo-600 focus:outline-none bg-slate-50/60 focus:bg-white text-slate-900 disabled:opacity-80"
            />
            <span className="text-xs sm:text-sm font-semibold text-slate-600">
              {qData.unit}
            </span>
          </div>
        ) : (
          /* MCQ TYPE */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8 sm:pl-9">
            {qData.options.map((opt, oIdx) => {
              const isSelected = answers[key] === opt;
              return (
                <label
                  key={oIdx}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs sm:text-sm font-mono font-bold select-none transition ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  } ${submitted ? 'pointer-events-none' : ''}`}
                >
                  <input
                    type="radio"
                    name={key}
                    value={opt}
                    checked={isSelected}
                    onChange={() => handleMcqSelect(key, opt)}
                    disabled={submitted}
                    className="w-3.5 h-3.5 text-indigo-600 shrink-0"
                  />
                  <span className="truncate">{opt}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {submitted && (
        <div className="mt-3 pl-8 sm:pl-9 text-xs leading-relaxed font-mono">
          {isCorrect ? (
            <p className="text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              {qData.explanation}
            </p>
          ) : (
            <p className="text-rose-800 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              Σωστό: <strong className="text-rose-950">{qData.correct.toLocaleString ? qData.correct.toLocaleString('el-GR') : qData.correct}</strong>. {qData.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
