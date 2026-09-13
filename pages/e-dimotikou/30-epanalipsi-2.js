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

// --- ΔΕΞΑΜΕΝΗ ΓΕΝΝΗΤΡΙΩΝ ΑΣΚΗΣΕΩΝ ΓΙΑ ΤΑ ΓΕΩΜΕΤΡΙΚΑ ΚΕΦΑΛΑΙΑ 13 ΕΩΣ 29 --- //

// ΚΕΦΑΛΑΙΟ 13: Γωνίες
function genCh13(variant) {
  if (variant === 1) {
    // Παραπληρωματικές γωνίες (άθροισμα 180°)
    const angleA = [45, 60, 75, 110, 125, 135][getRandomInt(0, 5)];
    const angleB = 180 - angleA;
    return {
      ch: 13,
      title: 'ΚΕΦ. 13 • ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΕΣ ΓΩΝΙΕΣ',
      type: 'input',
      correct: angleB,
      unit: 'μοίρες ( ° )',
      prompt: `Δύο γωνίες είναι παραπληρωματικές (το άθροισμά τους είναι 180°). Αν η μία είναι ${angleA}°, πόσες μοίρες ( ° ) είναι η άλλη;`,
      explanation: `Αφαιρούμε τη γνωστή γωνία από τις 180°: 180° － ${angleA}° ＝ ${angleB}°.`
    };
  } else {
    return {
      ch: 13,
      title: 'ΚΕΦ. 13 • ΕΙΔΗ ΓΩΝΙΩΝ',
      type: 'mcq',
      correct: 'Αμβλεία γωνία ( μεγαλύτερη από 90° και μικρότερη από 180° )',
      options: shuffleArray([
        'Αμβλεία γωνία ( μεγαλύτερη από 90° και μικρότερη από 180° )',
        'Οξεία γωνία ( μικρότερη από 90° )',
        'Ορθή γωνία ( ακριβώς 90° )',
        'Ευθεία γωνία ( ακριβώς 180° )'
      ]),
      prompt: `Πώς ονομάζεται μια γωνία με μέτρο 128°;`,
      explanation: `Κάθε γωνία που είναι μεγαλύτερη από 90° και μικρότερη από 180° ονομάζεται αμβλεία γωνία.`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 14: Τρίγωνα - Γωνίες
function genCh14(variant) {
  if (variant === 1) {
    // Άθροισμα γωνιών τριγώνου = 180°
    const a = [40, 50, 65, 70][getRandomInt(0, 3)];
    const b = [45, 55, 60, 35][getRandomInt(0, 3)];
    const c = 180 - (a + b);
    return {
      ch: 14,
      title: 'ΚΕΦ. 14 • ΑΘΡΟΙΣΜΑ ΓΩΝΙΩΝ ΤΡΙΓΩΝΟΥ',
      type: 'input',
      correct: c,
      unit: 'μοίρες ( ° )',
      prompt: `Σε ένα τρίγωνο οι δύο γωνίες έχουν μέτρο ${a}° και ${b}°. Πόσες μοίρες ( ° ) είναι η τρίτη γωνία του;`,
      explanation: `Το άθροισμα των τριών γωνιών κάθε τριγώνου είναι πάντοτε 180°. Άρα: 180° － ( ${a}° ＋ ${b}° ) ＝ 180° － ${a + b}° ＝ ${c}°.`
    };
  } else {
    return {
      ch: 14,
      title: 'ΚΕΦ. 14 • ΟΡΘΟΓΩΝΙΟ ΤΡΙΓΩΝΟ',
      type: 'mcq',
      correct: 'Έχει μία ορθή γωνία ( 90° ) και δύο οξείες γωνίες',
      options: [
        'Έχει μία ορθή γωνία ( 90° ) και δύο οξείες γωνίες',
        'Έχει δύο ορθές γωνίες ( 90° )',
        'Έχει όλες τις γωνίες του ίσες με 90°',
        'Έχει μία αμβλεία και μία ορθή γωνία'
      ],
      prompt: `Ποια από τις παρακάτω προτάσεις είναι ΣΩΣΤΗ για ένα ορθογώνιο τρίγωνο;`,
      explanation: `Ένα ορθογώνιο τρίγωνο έχει ακριβώς μία ορθή γωνία (90°). Οι άλλες δύο γωνίες του είναι υποχρεωτικά οξείες και έχουν άθροισμα 90°.`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 15: Τρίγωνα - Πλευρές
function genCh15(variant) {
  if (variant === 1) {
    // Περίμετρος ισόπλευρου τριγώνου: Π = 3 · α
    const side = [7, 9, 12, 14, 16][getRandomInt(0, 4)];
    const perim = 3 * side;
    return {
      ch: 15,
      title: 'ΚΕΦ. 15 • ΙΣΟΠΛΕΥΡΟ ΤΡΙΓΩΝΟ',
      type: 'input',
      correct: perim,
      unit: 'cm (περίμετρος)',
      prompt: `Κάθε πλευρά ενός ισόπλευρου τριγώνου έχει μήκος ${side} cm. Πόσα cm είναι η περίμετρός του;`,
      explanation: `Το ισόπλευρο τρίγωνο έχει και τις 3 πλευρές του ίσες: 3 · ${side} ＝ ${perim} cm.`
    };
  } else {
    return {
      ch: 15,
      title: 'ΚΕΦ. 15 • ΕΙΔΗ ΤΡΙΓΩΝΩΝ ΩΣ ΠΡΟΣ ΤΙΣ ΠΛΕΥΡΕΣ',
      type: 'mcq',
      correct: 'Σκαληνό τρίγωνο',
      options: shuffleArray(['Σκαληνό τρίγωνο', 'Ισοσκελές τρίγωνο', 'Ισόπλευρο τρίγωνο', 'Κανονικό τρίγωνο']),
      prompt: `Πώς ονομάζεται το τρίγωνο που έχει και τις τρεις πλευρές του διαφορετικού μήκους μεταξύ τους;`,
      explanation: `Το τρίγωνο με 3 άνισες πλευρές ονομάζεται σκαληνό τρίγωνο.`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 16: Κάθετες - Ευθείες
function genCh16(variant) {
  if (variant === 1) {
    return {
      ch: 16,
      title: 'ΚΕΦ. 16 • ΓΩΝΙΑ ΚΑΘΕΤΩΝ ΕΥΘΕΙΩΝ',
      type: 'input',
      correct: 90,
      unit: 'μοίρες ( ° )',
      prompt: `Πόσες μοίρες ( ° ) είναι η γωνία που σχηματίζουν μεταξύ τους δύο κάθετες ευθείες;`,
      explanation: `Δύο ευθείες τέμνονται κάθετα όταν σχηματίζουν ακριβώς ορθή γωνία 90°.`
    };
  } else {
    return {
      ch: 16,
      title: 'ΚΕΦ. 16 • ΠΑΡΑΛΛΗΛΕΣ ΕΥΘΕΙΕΣ',
      type: 'mcq',
      correct: 'Δεν συναντιούνται ποτέ όσο κι αν προεκταθούν και έχουν σταθερή απόσταση',
      options: [
        'Δεν συναντιούνται ποτέ όσο κι αν προεκταθούν και έχουν σταθερή απόσταση',
        'Τέμνονται υπό ορθή γωνία 90°',
        'Συναντιούνται σε ακριβώς 2 κοινά σημεία',
        'Σχηματίζουν οξεία γωνία'
      ],
      prompt: `Ποιο είναι το βασικό χαρακτηριστικό δύο παράλληλων ευθειών στο επίπεδο;`,
      explanation: `Παράλληλες ονομάζονται οι ευθείες του ίδιου επιπέδου που δεν έχουν κανένα κοινό σημείο και διατηρούν σταθερή απόσταση μεταξύ τους.`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 17: Απόσταση Σημείου από Ευθεία
function genCh17(variant) {
  if (variant === 1) {
    return {
      ch: 17,
      title: 'ΚΕΦ. 17 • ΣΥΝΤΟΜΟΤΕΡΗ ΑΠΟΣΤΑΣΗ',
      type: 'mcq',
      correct: 'Το κάθετο ευθύγραμμο τμήμα από το σημείο προς την ευθεία',
      options: shuffleArray([
        'Το κάθετο ευθύγραμμο τμήμα από το σημείο προς την ευθεία',
        'Οποιοδήποτε πλάγιο ευθύγραμμο τμήμα',
        'Μια καμπύλη γραμμή που ενώνει το σημείο με την ευθεία',
        'Το διπλάσιο του πλάγιου τμήματος'
      ]),
      prompt: `Ποιο τμήμα ορίζει τη συντομότερη απόσταση ενός σημείου από μια ευθεία;`,
      explanation: `Η απόσταση σημείου από ευθεία είναι το μήκος του κάθετου ευθύγραμμου τμήματος που άγεται από το σημείο προς την ευθεία.`
    };
  } else {
    // Σύγκριση κάθετου και πλάγιου τμήματος
    return {
      ch: 17,
      title: 'ΚΕΦ. 17 • ΚΑΘΕΤΟ VS ΠΛΑΓΙΟ ΤΜΗΜΑ',
      type: 'mcq',
      correct: 'Το κάθετο τμήμα είναι πάντοτε μικρότερο από κάθε πλάγιο τμήμα',
      options: [
        'Το κάθετο τμήμα είναι πάντοτε μικρότερο από κάθε πλάγιο τμήμα',
        'Το κάθετο τμήμα είναι μεγαλύτερο από το πλάγιο τμήμα',
        'Το κάθετο και το πλάγιο τμήμα είναι πάντοτε ίσα',
        'Δεν μπορούμε να συγκρίνουμε τα δύο τμήματα'
      ],
      prompt: `Αν φέρουμε από ένα σημείο ένα κάθετο και ένα πλάγιο τμήμα προς μια ευθεία, τι ισχύει για τα μήκη τους;`,
      explanation: `Το κάθετο τμήμα είναι πάντοτε το μικρότερο σε μήκος (συντομότερη διαδρομή).`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 18: Ύψος Τριγώνου
function genCh18(variant) {
  if (variant === 1) {
    return {
      ch: 18,
      title: 'ΚΕΦ. 18 • ΠΛΗΘΟΣ ΥΨΩΝ ΤΡΙΓΩΝΟΥ',
      type: 'input',
      correct: 3,
      unit: 'ύψη',
      prompt: `Πόσα ύψη έχει συνολικά κάθε τρίγωνο (ένα από κάθε κορυφή προς την απέναντι πλευρά);`,
      explanation: `Σε κάθε τρίγωνο αντιστοιχούν ακριβώς 3 ύψη, όσες είναι και οι κορυφές του.`
    };
  } else {
    return {
      ch: 18,
      title: 'ΚΕΦ. 18 • ΥΨΗ ΑΜΒΛΥΓΩΝΙΟΥ ΤΡΙΓΩΝΟΥ',
      type: 'mcq',
      correct: 'Δύο από τα τρία ύψη πέφτουν έξω από το τρίγωνο ( στην προέκταση των πλευρών )',
      options: [
        'Δύο από τα τρία ύψη πέφτουν έξω από το τρίγωνο ( στην προέκταση των πλευρών )',
        'Και τα 3 ύψη βρίσκονται πάντοτε στο εσωτερικό του τριγώνου',
        'Τα ύψη ταυτίζονται με τις πλευρές του τριγώνου',
        'Το αμβλυγώνιο τρίγωνο δεν έχει κανένα ύψος'
      ],
      prompt: `Τι συμβαίνει με τα ύψη σε ένα αμβλυγώνιο τρίγωνο;`,
      explanation: `Στο αμβλυγώνιο τρίγωνο, τα ύψη που ξεκινούν από τις δύο οξείες κορυφές πέφτουν εξωτερικά, στις προεκτάσεις των απέναντι πλευρών.`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 19: Άξονας Συμμετρίας
function genCh19(variant) {
  if (variant === 1) {
    // Τετράγωνο: 4 άξονες
    return {
      ch: 19,
      title: 'ΚΕΦ. 19 • ΑΞΟΝΕΣ ΣΥΜΜΕΤΡΙΑΣ ΤΕΤΡΑΓΩΝΟΥ',
      type: 'input',
      correct: 4,
      unit: 'άξονες συμμετρίας',
      prompt: `Πόσους άξονες συμμετρίας έχει συνολικά ένα τετράγωνο;`,
      explanation: `Το τετράγωνο έχει 4 άξονες συμμετρίας: τις 2 μεσοκαθέτους των απέναντι πλευρών και τις 2 διαγωνίους του.`
    };
  } else {
    return {
      ch: 19,
      title: 'ΚΕΦ. 19 • ΑΞΟΝΕΣ ΣΥΜΜΕΤΡΙΑΣ ΚΥΚΛΟΥ',
      type: 'mcq',
      correct: 'Άπειρους άξονες συμμετρίας ( κάθε ευθεία που περνάει από το κέντρο )',
      options: [
        'Άπειρους άξονες συμμετρίας ( κάθε ευθεία που περνάει από το κέντρο )',
        'Μόνο 4 άξονες συμμετρίας',
        'Μόνο 2 άξονες συμμετρίας',
        'Κανέναν άξονα συμμετρίας'
      ],
      prompt: `Πόσους άξονες συμμετρίας έχει ένας κύκλος;`,
      explanation: `Κάθε ευθεία που διέρχεται από το κέντρο του κύκλου (διάμετρος) αποτελεί άξονα συμμετρίας του. Άρα ο κύκλος έχει άπειρους άξονες συμμετρίας.`
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
      title: 'ΚΕΦ. 20 • ΥΠΟΛΟΓΙΣΜΟΣ ΜΗΚΟΥΣ ΚΥΚΛΟΥ',
      type: 'input',
      correct: l,
      unit: 'cm',
      prompt: `Ένας κύκλος έχει διάμετρο δ ＝ ${d} cm. Πόσα cm είναι το μήκος του ( L ), αν χρησιμοποιήσουμε π ＝ 3,14;`,
      explanation: `Εφαρμόζουμε τον τύπο L ＝ π · δ: 3,14 · ${d} ＝ ${l.toLocaleString('el-GR')} cm.`
    };
  } else {
    return {
      ch: 20,
      title: 'ΚΕΦ. 20 • ΣΤΑΘΕΡΟΣ ΑΡΙΘΜΟΣ π',
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
    const km = 4.5;
    const m = 4500;
    return {
      ch: 21,
      title: 'ΚΕΦ. 21 • ΜΕΤΑΤΡΟΠΗ km ΣΕ m',
      type: 'input',
      correct: m,
      unit: 'm',
      prompt: `Μετάτρεψε την απόσταση των ${km.toLocaleString('el-GR')} km σε μέτρα ( m ):`,
      explanation: `1 km ＝ 1.000 m. Άρα: ${km.toLocaleString('el-GR')} · 1.000 ＝ ${m.toLocaleString('el-GR')} m.`
    };
  } else {
    return {
      ch: 21,
      title: 'ΚΕΦ. 21 • ΣΚΑΛΑ ΜΗΚΟΥΣ ( cm ΣΕ m )',
      type: 'mcq',
      correct: 'Διαιρούμε με το 100',
      options: shuffleArray(['Διαιρούμε με το 100', 'Πολλαπλασιάζουμε με το 100', 'Διαιρούμε με το 10', 'Πολλαπλασιάζουμε με το 1.000']),
      prompt: `Όταν μετατρέπουμε από εκατοστά ( cm ) σε μέτρα ( m ), τι μαθηματική πράξη κάνουμε;`,
      explanation: `Ανεβαίνουμε 2 σκαλοπάτια στη σκάλα του μήκους (από μικρότερη σε μεγαλύτερη μονάδα), επομένως διαιρούμε με το 100.`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 22: Πολύγωνα
function genCh22(variant) {
  if (variant === 1) {
    // Περίμετρος πενταγώνου
    const s1 = 8;
    const s2 = 12;
    const s3 = 10;
    const s4 = 14;
    const s5 = 11;
    const p = s1 + s2 + s3 + s4 + s5;
    return {
      ch: 22,
      title: 'ΚΕΦ. 22 • ΠΕΡΙΜΕΤΡΟΣ ΠΟΛΥΓΩΝΟΥ',
      type: 'input',
      correct: p,
      unit: 'cm',
      prompt: `Ένα πεντάγωνο έχει πλευρές ${s1} cm, ${s2} cm, ${s3} cm, ${s4} cm και ${s5} cm. Πόσα cm είναι η περίμετρός του;`,
      explanation: `Προσθέτουμε τα μήκη όλων των πλευρών: ${s1} ＋ ${s2} ＋ ${s3} ＋ ${s4} ＋ ${s5} ＝ ${p} cm.`
    };
  } else {
    return {
      ch: 22,
      title: 'ΚΕΦ. 22 • ΔΙΑΓΩΝΙΟΙ ΤΡΙΓΩΝΟΥ',
      type: 'mcq',
      correct: '0 διαγώνιους',
      options: shuffleArray(['0 διαγώνιους', '1 διαγώνιο', '3 διαγώνιους', '2 διαγώνιους']),
      prompt: `Πόσες διαγωνίους (ευθύγραμμα τμήματα που ενώνουν μη διαδοχικές κορυφές) έχει συνολικά ένα τρίγωνο;`,
      explanation: `Στο τρίγωνο όλες οι κορυφές είναι διαδοχικές μεταξύ τους, επομένως έχει ακριβώς 0 διαγωνίους.`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 23: Κανονικά Πολύγωνα
function genCh23(variant) {
  if (variant === 1) {
    // Κεντρική γωνία κανονικού εξαγώνου: 360 : 6 = 60°
    return {
      ch: 23,
      title: 'ΚΕΦ. 23 • ΚΕΝΤΡΙΚΗ ΓΩΝΙΑ ΕΞΑΓΩΝΟΥ',
      type: 'input',
      correct: 60,
      unit: 'μοίρες ( ° )',
      prompt: `Πόσες μοίρες ( ° ) είναι η κεντρική γωνία ενός κανονικού εξαγώνου ( 6 ίσες πλευρές );`,
      explanation: `Διαιρούμε τον πλήρη κύκλο των 360° με το πλήθος των πλευρών: 360° ： 6 ＝ 60°.`
    };
  } else {
    return {
      ch: 23,
      title: 'ΚΕΦ. 23 • ΟΡΙΣΜΟΣ ΚΑΝΟΝΙΚΟΥ ΠΟΛΥΓΩΝΟΥ',
      type: 'mcq',
      correct: 'Έχει όλες τις πλευρές του ίσες ΚΑΙ όλες τις γωνίες του ίσες',
      options: [
        'Έχει όλες τις πλευρές του ίσες ΚΑΙ όλες τις γωνίες του ίσες',
        'Έχει μόνο όλες τις γωνίες του ίσες με 90°',
        'Έχει άρτιο αριθμό πλευρών',
        'Έχει περίμετρο μεγαλύτερη από 100 cm'
      ],
      prompt: `Πότε ένα πολύγωνο χαρακτηρίζεται ως ΚΑΝΟΝΙΚΟ;`,
      explanation: `Ένα πολύγωνο ονομάζεται κανονικό μόνο όταν είναι ταυτόχρονα ισόπλευρο (όλες οι πλευρές ίσες) και ισογώνιο (όλες οι γωνίες ίσες).`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 24: Περίμετρος
function genCh24(variant) {
  if (variant === 1) {
    // Περίμετρος ορθογωνίου: Π = 2 · (l + w)
    const l = 20;
    const w = 15;
    const p = 2 * (l + w);
    return {
      ch: 24,
      title: 'ΚΕΦ. 24 • ΠΕΡΙΜΕΤΡΟΣ ΟΡΘΟΓΩΝΙΟΥ',
      type: 'input',
      correct: p,
      unit: 'm',
      prompt: `Ένα ορθογώνιο οικόπεδο έχει μήκος ${l} m και πλάτος ${w} m. Πόσα μέτρα ( m ) είναι η περίμετρός του;`,
      explanation: `Π ＝ 2 · ( Μήκος ＋ Πλάτος ) ＝ 2 · ( ${l} ＋ ${w} ) ＝ 2 · ${l + w} ＝ ${p} m.`
    };
  } else {
    return {
      ch: 24,
      title: 'ΚΕΦ. 24 • ΠΛΕΥΡΑ ΤΕΤΡΑΓΩΝΟΥ ΑΠΟ ΠΕΡΙΜΕΤΡΟ',
      type: 'mcq',
      correct: '12 cm',
      options: shuffleArray(['12 cm', '24 cm', '8 cm', '16 cm']),
      prompt: `Η περίμετρος ενός τετραγώνου είναι 48 cm. Πόσο είναι το μήκος της κάθε πλευράς του;`,
      explanation: `Επειδή το τετράγωνο έχει 4 ίσες πλευρές: 48 ： 4 ＝ 12 cm.`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 25: Εμβαδό
function genCh25(variant) {
  if (variant === 1) {
    // Εμβαδόν ορθογωνίου: Ε = Μήκος · Πλάτος
    const l = 9;
    const w = 7;
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
      title: 'ΚΕΦ. 25 • ΕΝΝΟΙΑ ΤΟΥ ΕΜΒΑΔΟΥ',
      type: 'mcq',
      correct: 'Το μέγεθος της επίπεδης επιφάνειας που περικλείεται μέσα στο σχήμα',
      options: [
        'Το μέγεθος της επίπεδης επιφάνειας που περικλείεται μέσα στο σχήμα',
        'Το μήκος του περιγράμματος γύρω-γύρω από το σχήμα',
        'Το βάρος του γεωμετρικού σχήματος',
        'Ο αριθμός των κορυφών του πολυγώνου'
      ],
      prompt: `Τι εκφράζει το ΕΜΒΑΔΟΝ ενός γεωμετρικού σχήματος;`,
      explanation: `Το εμβαδόν εκφράζει το μέγεθος της εσωτερικής επίπεδης επιφάνειας που κλείνεται μέσα στα όρια του σχήματος (σε αντίθεση με την περίμετρο που μετράει το μήκος γύρω-γύρω).`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 26: Εμβαδό Σχημάτων
function genCh26(variant) {
  if (variant === 1) {
    // Εμβαδόν ορθογώνιου τριγώνου: (α · β) : 2
    const b = 10;
    const h = 6;
    const a = (b * h) / 2;
    return {
      ch: 26,
      title: 'ΚΕΦ. 26 • ΕΜΒΑΔΟΝ ΟΡΘΟΓΩΝΙΟΥ ΤΡΙΓΩΝΟΥ',
      type: 'input',
      correct: a,
      unit: 'cm²',
      prompt: `Ένα ορθογώνιο τρίγωνο έχει κάθετες πλευρές μήκους ${b} cm και ${h} cm. Πόσα cm² είναι το εμβαδόν του;`,
      explanation: `Εμβαδόν Τριγώνου ＝ ( Βάση · Ύψος ) ： 2 ＝ ( ${b} · ${h} ) ： 2 ＝ ${b * h} ： 2 ＝ ${a} cm².`
    };
  } else {
    return {
      ch: 26,
      title: 'ΚΕΦ. 26 • ΣΧΕΣΗ ΤΡΙΓΩΝΟΥ ΜΕ ΟΡΘΟΓΩΝΙΟ',
      type: 'mcq',
      correct: 'Είναι ακριβώς το μισό του ορθογωνίου ( : 2 )',
      options: [
        'Είναι ακριβώς το μισό του ορθογωνίου ( : 2 )',
        'Είναι διπλάσιο από το ορθογώνιο ( · 2 )',
        'Είναι ίσο με το ορθογώνιο',
        'Είναι το ένα τρίτο του ορθογωνίου ( : 3 )'
      ],
      prompt: `Ποια σχέση έχει το εμβαδόν ενός ορθογώνιου τριγώνου με το εμβαδόν ενός ορθογωνίου που έχει τις ίδιες διαστάσεις;`,
      explanation: `Η διαγώνιος του ορθογωνίου το χωρίζει σε δύο ίσα ορθογώνια τρίγωνα, γι' αυτό το εμβαδόν του τριγώνου είναι πάντοτε το μισό.`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 27: Μονάδες Μέτρησης Επιφάνειας
function genCh27(variant) {
  if (variant === 1) {
    // 3,5 m² = 350 dm²
    const m2 = 3.5;
    const dm2 = 350;
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
      title: 'ΚΕΦ. 27 • ΣΤΡΕΜΜΑΤΑ ΣΕ m²',
      type: 'mcq',
      correct: '1.000 m²',
      options: shuffleArray(['1.000 m²', '100 m²', '10.000 m²', '100.000 m²']),
      prompt: `Σε πόσα τετραγωνικά μέτρα ( m² ) ισοδυναμεί ακριβώς 1 στρέμμα;`,
      explanation: `1 στρέμμα ＝ 1.000 m².`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 28: Όγκος
function genCh28(variant) {
  if (variant === 1) {
    // V = l · w · h
    const l = 6;
    const w = 5;
    const h = 4;
    const v = l * w * h;
    return {
      ch: 28,
      title: 'ΚΕΦ. 28 • ΥΠΟΛΟΓΙΣΜΟΣ ΟΓΚΟΥ ΚΟΥΤΙΟΥ',
      type: 'input',
      correct: v,
      unit: 'cm³',
      prompt: `Ένα κουτί έχει μήκος ${l} cm, πλάτος ${w} cm και ύψος ${h} cm. Πόσα cm³ είναι ο όγκος του;`,
      explanation: `Όγκος ＝ Μήκος · Πλάτος · Ύψος ＝ ${l} · ${w} · ${h} ＝ ${v} cm³.`
    };
  } else {
    return {
      ch: 28,
      title: 'ΚΕΦ. 28 • ΧΩΡΗΤΙΚΟΤΗΤΑ ΣΕ ΛΙΤΡΑ',
      type: 'mcq',
      correct: '1 dm³ ( κυβικό δεκατόμετρο )',
      options: shuffleArray([
        '1 dm³ ( κυβικό δεκατόμετρο )',
        '1 cm³ ( κυβικό εκατοστό )',
        '1 m³ ( κυβικό μέτρο )',
        '10 dm³'
      ]),
      prompt: `Σε ποια κυβική μονάδα όγκου ισοδυναμεί ακριβώς 1 λίτρο ( 1 l ) υγρού;`,
      explanation: `1 λίτρο ισούται ακριβώς με 1 κυβικό δεκατόμετρο ( 1 dm³ ＝ 1.000 cm³ ).`
    };
  }
}

// ΚΕΦΑΛΑΙΟ 29: Όγκοι Σχημάτων
function genCh29(variant) {
  if (variant === 1) {
    // Όγκος κύβου: α · α · α
    const a = 5;
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
      title: 'ΚΕΦ. 29 • ΣΧΕΣΗ ΠΡΙΣΜΑΤΟΣ ΚΑΙ ΠΥΡΑΜΙΔΑΣ',
      type: 'mcq',
      correct: 'Η πυραμίδα έχει το ένα τρίτο του όγκου του πρίσματος ( : 3 )',
      options: [
        'Η πυραμίδα έχει το ένα τρίτο του όγκου του πρίσματος ( : 3 )',
        'Η πυραμίδα έχει τον μισό όγκο του πρίσματος ( : 2 )',
        'Έχουν ακριβώς τον ίδιο όγκο',
        'Η πυραμίδα έχει τριπλάσιο όγκο από το πρίσμα'
      ],
      prompt: `Ποια σχέση έχει ο όγκος μιας πυραμίδας με τον όγκο ενός πρίσματος που έχει την ίδια βάση και το ίδιο ύψος;`,
      explanation: `Ο όγκος της πυραμίδας (όπως και του κώνου) ισούται με το ένα τρίτο (: 3) του όγκου του αντίστοιχου πρίσματος (ή κυλίνδρου).`
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
      title="Επανάληψη 2: Γεωμετρία (Κεφάλαια 13 - 29) - Ε' Δημοτικού | LearnMaths.gr"
      description="Μεγάλη επαναληπτική δοκιμασία μαθηματικών Ε' Δημοτικού στη Γεωμετρία (κεφάλαια 13 έως 29): γωνίες, τρίγωνα, κάθετες ευθείες, μήκος κύκλου, πολύγωνα, περίμετρος, εμβαδόν και όγκος."
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
              Ε' ΔΗΜΟΤΙΚΟΥ • ΜΕΓΑΛΗ ΕΠΑΝΑΛΗΨΗ ΓΕΩΜΕΤΡΙΑΣ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight pt-1">
              📐 Επαναληπτικό Τεστ: Κεφάλαια 13 έως 29
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed">
              34 απαιτητικές ασκήσεις (2 από κάθε κεφάλαιο: γωνίες, τρίγωνα, ευθείες, ύψη, συμμετρία, κύκλος, πολύγωνα, περίμετρος, εμβαδόν και όγκος). Δημιουργούνται δυναμικά από τη δεξαμενή!
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
