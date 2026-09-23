import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Component Frac με ασφαλή ανίχνευση προσήμου
const Frac = ({ num, den, className = "" }) => {
  const numStr = String(num).trim();
  const denStr = String(den).trim();

  const isNumNeg = numStr.startsWith('-');
  const isDenNeg = denStr.startsWith('-');
  const isNegative = (isNumNeg && !isDenNeg) || (!isNumNeg && isDenNeg);

  const cleanNum = numStr.replace('-', '');
  const cleanDen = denStr.replace('-', '');

  return (
    <span className={`inline-flex items-center align-middle mx-1 font-mono font-semibold ${className}`}>
      {isNegative && <span className="mr-0.5 text-base sm:text-lg font-bold">-</span>}
      <span className="inline-flex flex-col items-center text-center leading-none text-xs sm:text-sm">
        <span className="border-b border-current px-1 pb-0.5">{cleanNum}</span>
        <span className="pt-0.5 px-1">{cleanDen}</span>
      </span>
    </span>
  );
};

// Ενιαίο SVG σύμβολο ρίζας: μονοκόμματο σχήμα με οριζόντια γραμμή (vinculum)
const Sqrt = ({ children, className = "" }) => {
  return (
    <span className={`inline-flex items-center align-middle mx-1 relative font-mono font-semibold ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none text-current overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 58 L 4 52 L 10 92 L 16 6 L 100 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="pl-4 sm:pl-4.5 pr-1 pt-1 pb-0.5 leading-none inline-flex items-center">
        {children}
      </span>
    </span>
  );
};

// Εξασφάλιση 4 μοναδικών επιλογών στα MCQs
const makeUniqueOptions = (correctVal, rawDistractors) => {
  const options = [correctVal];
  for (const dist of rawDistractors) {
    if (!options.includes(dist)) {
      options.push(dist);
    }
    if (options.length === 4) break;
  }
  let counter = 1;
  while (options.length < 4) {
    const fallback = `${correctVal} (${counter})`;
    if (!options.includes(fallback)) options.push(fallback);
    counter++;
  }
  return options.sort(() => Math.random() - 0.5);
};

// ==========================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΓΕΝΝΗΤΡΙΕΣ ΠΡΑΞΕΩΝ & ΘΕΩΡΙΑΣ
// ==========================================
const POOL_THEORY = [
  // 1. Εύρεση περιόδου απλού κλάσματος
  () => {
    const correct = '3';
    return {
      type: 'mcq',
      badge: 'ΠΕΡΙΟΔΙΚΟΙ',
      question: (
        <span>
          Ποια είναι η περίοδος του δεκαδικού αριθμού που προκύπτει από το κλάσμα <strong className="text-indigo-700 text-lg font-mono">1/3</strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1', '0', '33', 'Δεν έχει περίοδο']),
      hint: '1 : 3 = 0,3333... Το ψηφίο που επαναλαμβάνεται επ\' άπειρον είναι το 3, άρα η περίοδος είναι το 3.'
    };
  },
  // 2. Διάκριση καθαρού και μικτού περιοδικού
  () => {
    const correct = 'Μικτός περιοδικός';
    return {
      type: 'mcq',
      badge: 'ΤΑΞΙΝΟΜΗΣΗ',
      question: (
        <span>
          Ο αριθμός <strong className="text-indigo-700 text-lg font-mono">0,1666... ＝ 0,1<span className="border-t-2 border-indigo-700 pt-0.5">6</span></strong> είναι:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Καθαρός περιοδικός',
        'Πεπερασμένος δεκαδικός',
        'Άρρητος αριθμός'
      ]),
      hint: 'Επειδή μετά την υποδιαστολή υπάρχει το μη περιοδικό ψηφίο 1 πριν την περίοδο 6, ο αριθμός ονομάζεται μικτός περιοδικός.'
    };
  },
  // 3. Πρόβλεψη πεπερασμένου δεκαδικού από τον παρονομαστή
  () => {
    const correct = '3/8';
    return {
      type: 'mcq',
      badge: 'ΚΛΑΣΜΑΤΑ',
      question: (
        <span>
          Ποιο από τα παρακάτω ανάγωγα κλάσματα δίνει <strong>πεπερασμένο</strong> δεκαδικό αριθμό;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1/3', '2/7', '5/6']),
      hint: 'Ο παρονομαστής 8 αναλύεται σε 2³. Όταν ο παρονομαστής περιέχει μόνο δυνάμεις του 2 ή/και του 5, το κλάσμα δίνει πεπερασμένο δεκαδικό (3/8 = 0,375).'
    };
  },
  // 4. Εύρεση μη περιοδικού μέρους
  () => {
    const correct = '8';
    return {
      type: 'input',
      badge: 'ΠΕΡΙΟΔΙΚΟΙ',
      question: (
        <span>
          Στον αριθμό <strong className="text-indigo-700 text-lg font-mono">0,8333... ＝ 0,8<span className="border-t-2 border-indigo-700 pt-0.5">3</span></strong>, ποιο ψηφίο αποτελεί το μη περιοδικό μέρος;
        </span>
      ),
      correct,
      hint: 'Το ψηφίο 8 βρίσκεται μεταξύ της υποδιαστολής και της περιόδου (3) και δεν επαναλαμβάνεται.'
    };
  },
  // 5. Αναγνώριση άρρητου αριθμού
  () => {
    const correct = '√3';
    return {
      type: 'mcq',
      badge: 'ΑΡΡΗΤΟΙ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Ποιος από τους παρακάτω αριθμούς είναι <strong>άρρητος</strong>;</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['√4', '3/5', '0,777...']),
      hint: 'Το 3 δεν είναι τέλειο τετράγωνο, οπότε το √3 έχει άπειρα δεκαδικά ψηφία χωρίς περίοδο. Αντίθετα, √4 = 2 (ρητός).'
    };
  },
  // 6. Περίοδος του κλάσματος 1/7
  () => {
    const correct = '142857';
    return {
      type: 'mcq',
      badge: 'ΠΕΡΙΟΔΙΚΟΙ',
      question: (
        <span>
          Η περίοδος του κλάσματος <strong className="text-indigo-700 text-lg font-mono">1/7</strong> αποτελείται από την ομάδα ψηφίων:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['14', '142', '7', '2857']),
      hint: '1 : 7 = 0,142857142857... Η περίοδος έχει μήκος 6 ψηφία: 142857.'
    };
  },
  // 7. Έλεγχος ρίζας τέλειου τετραγώνου (Input)
  () => {
    const correct = 'ΡΗΤΟΣ';
    return {
      type: 'mcq',
      badge: 'ΤΑΞΙΝΟΜΗΣΗ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Ο αριθμός </span>
          <strong className="text-indigo-700 text-lg mx-1"><Sqrt>49</Sqrt></strong>
          <span> είναι ρητός ή άρρητος;</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['ΑΡΡΗΤΟΣ', 'ΟΥΤΕ ΡΗΤΟΣ ΟΥΤΕ ΑΡΡΗΤΟΣ', 'ΜΟΝΟ ΦΑΝΤΑΣΤΙΚΟΣ']),
      hint: 'Επειδή √49 = 7 = 7/1, γράφεται ως κλάσμα ακεραίων, άρα είναι ρητός αριθμός.'
    };
  },
  // 8. Ο αριθμός π (pi)
  () => {
    const correct = 'Άρρητος αριθμός';
    return {
      type: 'mcq',
      badge: 'ΘΕΩΡΙΑ',
      question: (
        <span>
          Ο αριθμός <strong className="text-indigo-700 text-lg font-serif">π ≈ 3,14159...</strong> είναι:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Ρητός αριθμός',
        'Περιοδικός δεκαδικός',
        'Φυσικός αριθμός'
      ]),
      hint: 'Ο αριθμός π έχει άπειρα δεκαδικά ψηφία χωρίς καμία περίοδο και δεν μπορεί να εκφραστεί ακριβώς ως κλάσμα δύο ακεραίων.'
    };
  },
  // 9. Μετατροπή απλού κλάσματος σε δεκαδικό (Input)
  () => {
    const correct = '0,25';
    return {
      type: 'input',
      badge: 'ΜΕΤΑΤΡΟΠΗ',
      question: (
        <span>
          Γράψε σε δεκαδική μορφή (με κόμμα) το κλάσμα <strong className="text-indigo-700 text-lg font-mono">1/4</strong>:
        </span>
      ),
      correct,
      hint: '1 : 4 = 0,25 (πεπερασμένος δεκαδικός).'
    };
  },
  // 10. Αναγνώριση καθαρού περιοδικού
  () => {
    const correct = '0,555...';
    return {
      type: 'mcq',
      badge: 'ΠΕΡΙΟΔΙΚΟΙ',
      question: (
        <span>
          Ποιος από τους παρακάτω αριθμούς είναι <strong>καθαρός (απλός) περιοδικός</strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['0,1555...', '1,02333...', '0,75']),
      hint: 'Στο 0,555... η περίοδος (5) ξεκινά αμέσως μετά την υποδιαστολή, χωρίς να μεσολαβεί μη περιοδικό ψηφίο.'
    };
  },
  // 11. Παρονομαστής που περιέχει το 3
  () => {
    const correct = 'Άπειρος περιοδικός δεκαδικός';
    return {
      type: 'mcq',
      badge: 'ΚΛΑΣΜΑΤΑ',
      question: (
        <span>
          Το ανάγωγο κλάσμα <strong className="text-indigo-700 text-lg font-mono">7/15</strong> δίνει:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Πεπερασμένο δεκαδικό',
        'Άρρητο αριθμό',
        'Ακέραιο αριθμό'
      ]),
      hint: 'Ο παρονομαστής είναι 15 = 3 · 5. Επειδή περιέχει τον πρώτο παράγοντα 3, η διαίρεση δίνει άπειρο περιοδικό δεκαδικό (0,4666...).'
    };
  },
  // 12. Αριθμός με κανόνα αλλά χωρίς περίοδο
  () => {
    const correct = 'Άρρητος αριθμός';
    return {
      type: 'mcq',
      badge: 'ΑΡΡΗΤΟΙ',
      question: (
        <span>
          Ο αριθμός <strong className="text-indigo-700 text-lg font-mono">0,1010010001...</strong> (τα μηδενικά αυξάνονται κατά ένα) είναι:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Περιοδικός δεκαδικός',
        'Ρητός αριθμός',
        'Πεπερασμένος δεκαδικός'
      ]),
      hint: 'Παρόλο που υπάρχει κανόνας σχηματισμού, καμία σταθερή ομάδα ψηφίων δεν επαναλαμβάνεται περιοδικά, άρα είναι άρρητος.'
    };
  },
  // 13. Πραγματικοί αριθμοί (Θεωρία)
  () => {
    const correct = 'Όλοι οι ρητοί και όλοι οι άρρητοι αριθμοί μαζί';
    return {
      type: 'mcq',
      badge: 'ΘΕΩΡΙΑ',
      question: (
        <span>
          Το σύνολο των <strong>Πραγματικών Αριθμών (ℝ)</strong> αποτελείται από:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Μόνο τους θετικούς ρητούς αριθμούς',
        'Μόνο τους ακέραιους αριθμούς',
        'Μόνο τους αριθμούς που γράφονται σε κλάσμα'
      ]),
      hint: 'Πραγματικοί (ℝ) = Ρητοί (ℚ) ∪ Άρρητοι. Κάθε σημείο στον άξονα των αριθμών αντιστοιχεί σε έναν πραγματικό αριθμό.'
    };
  },
  // 14. Περίοδος του κλάσματος 2/11 (Input)
  () => {
    const correct = '18';
    return {
      type: 'input',
      badge: 'ΠΕΡΙΟΔΙΚΟΙ',
      question: (
        <span>
          Ποια είναι η περίοδος του κλάσματος <strong className="text-indigo-700 text-lg font-mono">2/11</strong> (γράψε τα ψηφία της περιόδου);
        </span>
      ),
      correct,
      hint: '2 : 11 = 0,181818... Η ομάδα ψηφίων που επαναλαμβάνεται είναι το 18.'
    };
  },
  // 15. Έλεγχος ρίζας μη τέλειου τετραγώνου
  () => {
    const correct = 'Άρρητος αριθμός';
    return {
      type: 'mcq',
      badge: 'ΑΡΡΗΤΟΙ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Ο αριθμός </span>
          <strong className="text-indigo-700 text-lg mx-1"><Sqrt>10</Sqrt></strong>
          <span> είναι:</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Ρητός αριθμός',
        'Πεπερασμένος δεκαδικός',
        'Περιοδικός δεκαδικός'
      ]),
      hint: 'Το 10 δεν είναι τέλειο τετράγωνο (3² = 9, 4² = 16), επομένως το √10 είναι άρρητος.'
    };
  },
  // 16. Κλάσμα που δίνει ακέραιο
  () => {
    const correct = 'Ρητός αριθμός';
    return {
      type: 'mcq',
      badge: 'ΤΑΞΙΝΟΜΗΣΗ',
      question: (
        <span>
          Ο ακέραιος αριθμός <strong className="text-indigo-700 text-lg font-mono">-5</strong> είναι:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Άρρητος αριθμός',
        'Μόνο φυσικός αριθμός',
        'Δεν ανήκει στους πραγματικούς'
      ]),
      hint: 'Κάθε ακέραιος αριθμός μπορεί να γραφτεί ως κλάσμα με παρονομαστή 1 (-5 = -5/1), άρα είναι ρητός.'
    };
  },
  // 17. Πλήθος ψηφίων περιόδου
  () => {
    const correct = '2';
    return {
      type: 'input',
      badge: 'ΠΕΡΙΟΔΙΚΟΙ',
      question: (
        <span>
          Πόσα ψηφία έχει η περίοδος του αριθμού <strong className="text-indigo-700 text-lg font-mono">3,14252525...</strong>;
        </span>
      ),
      correct,
      hint: 'Η περίοδος είναι το "25", δηλαδή αποτελείται από 2 ψηφία.'
    };
  },
  // 18. Άθροισμα ρητού και άρρητου
  () => {
    const correct = 'Άρρητος αριθμός';
    return {
      type: 'mcq',
      badge: 'ΙΔΙΟΤΗΤΕΣ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Το αποτέλεσμα της πράξης </span>
          <strong className="text-indigo-700 text-lg mx-1">1 + <Sqrt>2</Sqrt></strong>
          <span> είναι:</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Ρητός αριθμός',
        'Πεπερασμένος δεκαδικός',
        'Ακέραιος αριθμός'
      ]),
      hint: 'Το άθροισμα ενός ρητού και ενός άρρητου αριθμού είναι πάντοτε άρρητος αριθμός.'
    };
  },
  // 19. Ισοδυναμία κλάσματος και περιοδικού
  () => {
    const correct = '2/3';
    return {
      type: 'mcq',
      badge: 'ΜΕΤΑΤΡΟΠΗ',
      question: (
        <span>
          Ποιο κλάσμα αντιστοιχεί στον αριθμό <strong className="text-indigo-700 text-lg font-mono">0,666...</strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['3/5', '6/10', '1/3', '6/7']),
      hint: '2 : 3 = 0,6666... Επομένως 0,666... = 2/3.'
    };
  },
  // 20. Ανάλυση παρονομαστή για 1/20
  () => {
    const correct = 'Πεπερασμένος δεκαδικός';
    return {
      type: 'mcq',
      badge: 'ΚΛΑΣΜΑΤΑ',
      question: (
        <span>
          Χωρίς να κάνεις τη διαίρεση, τι είδους δεκαδικό δίνει το κλάσμα <strong className="text-indigo-700 text-lg font-mono">1/20</strong>;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Άπειρο περιοδικό',
        'Άρρητο αριθμό',
        'Μικτό περιοδικό'
      ]),
      hint: '20 = 2² · 5. Επειδή περιέχει αποκλειστικά παράγοντες 2 και 5, το κλάσμα δίνει πεπερασμένο δεκαδικό (1/20 = 0,05).'
    };
  }
];

// ==========================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ
// ==========================================
const POOL_PROBLEMS = [
  // 1. Μοιρασιά λογαριασμού σε 3 άτομα
  () => {
    const correct = '3,33';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Τρεις φίλοι μοιράζονται εξίσου έναν λογαριασμό 10€. Αν εκφραστεί με ακρίβεια λεπτού (2 δεκαδικά ψηφία), πόσα ευρώ αναλογούν στον καθένα (<strong className="font-mono text-amber-800">10/3 €</strong>);
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['3,30', '3,50', '3,34', '3,00']),
      hint: '10 : 3 = 3,333... € (περιοδικός). Με στρογγυλοποίηση στα 2 δεκαδικά ψηφία είναι 3,33€.'
    };
  },
  // 2. Διαγώνιος τετράγωνης πλατείας
  () => {
    const correct = 'Άρρητος αριθμός';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Η διαγώνιος μιας τετράγωνης πλατείας με πλευρά 1 m ισούται με </span>
          <strong className="font-mono text-amber-800 mx-1"><Sqrt>2</Sqrt> m</strong>.
          <span> Το μήκος αυτό εκφράζεται από:</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Πεπερασμένο δεκαδικό αριθμό',
        'Περιοδικό δεκαδικό αριθμό',
        'Ακέραιο αριθμό'
      ]),
      hint: 'Το √2 είναι άρρητος αριθμός (1,41421356... m). Δεν μπορεί να μετρηθεί ακριβώς με κλάσμα μέτρων.'
    };
  },
  // 3. Μοίρασμα πίτσας σε 6 ίσα κομμάτια
  () => {
    const correct = 'Μικτός περιοδικός';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Κόβουμε μία πίτσα σε 6 ίσα κομμάτια. Το ποσοστό που αντιστοιχεί σε κάθε κομμάτι είναι <strong className="font-mono text-amber-800">1/6 ＝ 0,1666...</strong>. Τι είδους δεκαδικός είναι;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Καθαρός περιοδικός',
        'Πεπερασμένος δεκαδικός',
        'Άρρητος αριθμός'
      ]),
      hint: 'Έχει μη περιοδικό ψηφίο το 1 και περίοδο το 6, άρα είναι μικτός περιοδικός δεκαδικός.'
    };
  },
  // 4. Υπολογισμός περιμέτρου κυκλικής λίμνης
  () => {
    const correct = 'Άρρητος αριθμός';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Μια κυκλική λίμνη έχει διάμετρο 10 m. Το ακριβές μήκος της όχθης της δίνεται από τον τύπο <strong className="font-mono text-amber-800">10 · π</strong> μέτρα. Το μήκος αυτό είναι:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Ρητός αριθμός',
        'Ακέραιος αριθμός',
        'Πεπερασμένος δεκαδικός'
      ]),
      hint: 'Επειδή το π είναι άρρητος, το γινόμενο 10 · π είναι επίσης άρρητος αριθμός.'
    };
  },
  // 5. Διαίρεση υφάσματος σε 3 κομμάτια (Input)
  () => {
    const correct = '3';
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα ύφασμα μήκους 2 μέτρων κόβεται σε 3 ίσα μέρη (<strong className="font-mono text-amber-800">2/3 m</strong>). Ποιο είναι το μοναδικό ψηφίο της περιόδου στο μήκος αυτό (0,666...);
        </span>
      ),
      correct: '6',
      hint: '2 : 3 = 0,6666... Το ψηφίο της περιόδου είναι το 6.'
    };
  },
  // 6. Σύρμα περίφραξης για τετράγωνο οικόπεδο εμβαδού 5 m²
  () => {
    const correct = 'Άρρητος αριθμός';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Η πλευρά ενός οικοπέδου με εμβαδόν 5 m² είναι </span>
          <strong className="font-mono text-amber-800 mx-1"><Sqrt>5</Sqrt> m</strong>.
          <span> Το μήκος αυτό είναι:</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Ρητός αριθμός',
        'Περιοδικός δεκαδικός',
        'Ακέραιος αριθμός'
      ]),
      hint: 'Επειδή το 5 δεν είναι τέλειο τετράγωνο, το √5 είναι άρρητος αριθμός (2,23606...).'
    };
  },
  // 7. Μοίρασμα χυμού 1 λίτρου σε 8 ποτήρια (Input)
  () => {
    const correct = '0,125';
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Μοιράζουμε 1 λίτρο χυμού σε 8 ίσα ποτήρια (<strong className="font-mono text-amber-800">1/8 L</strong>). Γράψε σε δεκαδική μορφή με κόμμα πόσα λίτρα έχει κάθε ποτήρι:
        </span>
      ),
      correct,
      hint: '1 : 8 = 0,125 L (πεπερασμένος δεκαδικός, αφού 8 = 2³).'
    };
  },
  // 8. Χρόνος πτώσης σώματος (Φυσική)
  () => {
    const correct = 'Άρρητος αριθμός';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Ο χρόνος πτώσης μιας πέτρας υπολογίζεται ως </span>
          <strong className="font-mono text-amber-800 mx-1"><Sqrt>6</Sqrt></strong>
          <span> δευτερόλεπτα. Ο χρόνος αυτός ανήκει στους:</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Ρητούς αριθμούς',
        'Περιοδικούς δεκαδικούς',
        'Φυσικούς αριθμούς'
      ]),
      hint: 'Το √6 είναι άρρητος αριθμός διότι το 6 δεν είναι τέλειο τετράγωνο.'
    };
  },
  // 9. Καύσιμα ανά 100 χλμ (Κλάσμα με 3)
  () => {
    const correct = '7,333...';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα αυτοκίνητο κατανάλωσε 22 λίτρα βενζίνης σε 300 χλμ, δηλαδή <strong className="font-mono text-amber-800">22/3</strong> L/100km. Η δεκαδική μορφή είναι:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['7,3', '7,25', '7,35', '7,03']),
      hint: '22 : 3 = 7,3333... (περιοδικός με ακέραιο μέρος 7 και περίοδο 3).'
    };
  },
  // 10. Διανομή κέρδους εταιρείας σε 7 εταίρους
  () => {
    const correct = 'Άπειρος περιοδικός';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα κέρδος μοιράζεται ισόποσα σε 7 συνεταίρους (<strong className="font-mono text-amber-800">1/7</strong> του κέρδους στον καθένα). Το μερίδιο του καθενός ως δεκαδικός αριθμός είναι:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Πεπερασμένος δεκαδικός',
        'Άρρητος αριθμός',
        'Ακέραιος αριθμός'
      ]),
      hint: 'Επειδή ο παρονομαστής 7 είναι πρώτος αριθμός (διάφορος του 2 και του 5), προκύπτει άπειρος περιοδικός δεκαδικός (0,142857...).'
    };
  },
  // 11. Πλευρά τετραγώνου με εμβαδόν 16 m² (Ρητό μέγεθος)
  () => {
    const correct = '4';
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα τετράγωνο δωμάτιο έχει εμβαδόν 16 m². Πόσα μέτρα είναι το μήκος της πλευράς του;
        </span>
      ),
      correct,
      hint: 'Η πλευρά είναι α = √16 = 4 m (ρητός και ακέραιος αριθμός).'
    };
  },
  // 12. Μέτρηση με ανακριβή μεζούρα
  () => {
    const correct = 'Άρρητος αριθμός';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Αν κατασκευάσουμε ένα ορθογώνιο τρίγωνο με κάθετες πλευρές 1 m και 2 m, η υποτείνουσα ισούται με </span>
          <strong className="font-mono text-amber-800 mx-1"><Sqrt>5</Sqrt> m</strong>.
          <span> Το ακριβές αυτό μήκος είναι:</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Ρητός αριθμός',
        'Περιοδικός δεκαδικός',
        'Ακέραιος αριθμός'
      ]),
      hint: 'Το μήκος √5 είναι άρρητος αριθμός.'
    };
  },
  // 13. Μοίρασμα 5 κιλών αλευριού σε 4 σακούλες
  () => {
    const correct = '1,25';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Σε έναν φούρνο μοιράζουν 5 κιλά αλεύρι σε 4 ίσες σακούλες (<strong className="font-mono text-amber-800">5/4 kg</strong>). Πόσα κιλά περιέχει κάθε σακούλα;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['1,20', '1,50', '1,33', '1,24']),
      hint: '5 : 4 = 1,25 kg (πεπερασμένος δεκαδικός).'
    };
  },
  // 14. Εύρεση περιόδου σε μοίρασμα κληρονομιάς
  () => {
    const correct = '1';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα χωράφι χωρίζεται σε 9 ίσα μερίδια (<strong className="font-mono text-amber-800">1/9</strong> του χωραφιού). Ποια είναι η περίοδος του δεκαδικού αριθμού 0,1111...;
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, ['9', '0', '11', 'Δεν έχει περίοδο']),
      hint: '1 : 9 = 0,1111... Το επαναλαμβανόμενο ψηφίο είναι το 1.'
    };
  },
  // 15. Ταχύτητα φωτός και λόγοι
  () => {
    const correct = 'Ρητός αριθμός';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένα σωματίδιο κινείται καλύπτοντας απόσταση 7 μέτρων σε 8 δευτερόλεπτα. Η μέση ταχύτητά του είναι <strong className="font-mono text-amber-800">7/8 m/s</strong>. Η ταχύτητα αυτή είναι:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Άρρητος αριθμός',
        'Μη πραγματικός αριθμός',
        'Άπειρος περιοδικός'
      ]),
      hint: 'Το 7/8 = 0,875 είναι πεπερασμένος δεκαδικός και ρητός αριθμός.'
    };
  },
  // 16. Περιφέρεια τροχού ποδηλάτου
  () => {
    const correct = 'Άρρητος αριθμός';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Η περιφέρεια ενός τροχού με ακτίνα R = 1 m υπολογίζεται ως <strong className="font-mono text-amber-800">2 · π</strong> μέτρα. Η τιμή αυτή εκφράζεται από:
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Ρητό αριθμό',
        'Περιοδικό δεκαδικό αριθμό',
        'Ακέραιο αριθμό'
      ]),
      hint: 'Επειδή ο αριθμός π είναι άρρητος, το γινόμενο 2π είναι επίσης άρρητος.'
    };
  },
  // 17. Μοίρασμα χρημάτων σε 11 παιδιά (Input)
  () => {
    const correct = '45';
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Μοιράζουμε 5€ σε 11 παιδιά (<strong className="font-mono text-amber-800">5/11 €</strong>). Αν 5 : 11 = 0,454545... €, γράψε τα ψηφία της περιόδου:
        </span>
      ),
      correct,
      hint: 'Η επαναλαμβανόμενη ομάδα ψηφίων είναι το 45.'
    };
  },
  // 18. Κατασκευή τετράγωνης βάσης αγάλματος
  () => {
    const correct = 'Άρρητος αριθμός';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Ένας γλύπτης κατασκευάζει τετράγωνη βάση με εμβαδόν 7 m² (πλευρά </span>
          <strong className="font-mono text-amber-800 mx-1"><Sqrt>7</Sqrt> m</strong>).
          <span> Το μήκος της πλευράς είναι:</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Ρητός αριθμός',
        'Πεπερασμένος δεκαδικός',
        'Ακέραιος αριθμός'
      ]),
      hint: 'Το √7 είναι άρρητος αριθμός (2,64575...).'
    };
  },
  // 19. Ποσοστό επιτυχίας σε διαγώνισμα
  () => {
    const correct = '0,85';
    return {
      type: 'input',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span>
          Ένας μαθητής απάντησε σωστά σε 17 από τις 20 ερωτήσεις (<strong className="font-mono text-amber-800">17/20</strong>). Γράψε το ποσοστό ως δεκαδικό αριθμό με κόμμα:
        </span>
      ),
      correct,
      hint: '17 : 20 = 0,85 (πεπερασμένος δεκαδικός, δηλαδή 85%).'
    };
  },
  // 20. Χρυσή τομή (φ) στην τέχνη
  () => {
    const correct = 'Άρρητος αριθμός';
    return {
      type: 'mcq',
      badge: 'ΠΡΟΒΛΗΜΑ',
      question: (
        <span className="flex items-center flex-wrap">
          <span>Ο λόγος της χρυσής τομής στην αρχαία ελληνική αρχιτεκτονική δίνεται από τον τύπο </span>
          <strong className="font-mono text-amber-800 mx-1">(1 + <Sqrt>5</Sqrt>) / 2</strong>.
          <span> Ο αριθμός αυτός είναι:</span>
        </span>
      ),
      correct,
      options: makeUniqueOptions(correct, [
        'Ρητός αριθμός',
        'Πεπερασμένος δεκαδικός',
        'Ακέραιος αριθμός'
      ]),
      hint: 'Επειδή περιέχει το √5, ο χρυσός λόγος φ ≈ 1,618033... είναι άρρητος αριθμός.'
    };
  }
];

export default function RitoiArritoiAsk() {
  const [exercises, setExercises] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const generateQuiz = useCallback(() => {
    const shuffledTheory = [...POOL_THEORY].sort(() => Math.random() - 0.5).slice(0, 10);
    const shuffledProblems = [...POOL_PROBLEMS].sort(() => Math.random() - 0.5).slice(0, 2);

    const full12 = [...shuffledTheory, ...shuffledProblems].map((gen, idx) => ({
      id: idx + 1,
      ...gen()
    }));

    setExercises(full12);
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    generateQuiz();
  }, [generateQuiz]);

  const handleAnswerChange = (id, val) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [id]: val }));
  };

  const handleInputChange = (id, rawVal) => {
    if (isSubmitted) return;
    const sanitized = rawVal.replace(/[^0-9,\/\-\sA-Za-zΑ-Ωα-ωΆ-Ώά-ώ]/g, '');
    setUserAnswers(prev => ({ ...prev, [id]: sanitized }));
  };

  const handleSubmit = () => {
    let currentScore = 0;
    exercises.forEach(ex => {
      const userAns = (userAnswers[ex.id] || '').trim().replace(/\s+/g, '').replace('.', ',');
      const correctAns = ex.correct.trim().replace(/\s+/g, '').replace('.', ',');
      if (userAns.toLowerCase() === correctAns.toLowerCase()) {
        currentScore += 1;
      }
    });
    setScore(currentScore);
    setIsSubmitted(true);
  };

  const percentage = Math.round((score / 12) * 100);

  return (
    <Layout
      title="Ασκήσεις: Ρητοί, Άρρητοι & Περιοδικοί Δεκαδικοί | Β' Γυμνασίου"
      description="12 δυναμικές ασκήσεις δεκαδικών αναπαραστάσεων, αναγνώρισης περιόδου, ρητών και άρρητων αριθμών."
      backUrl="/b-gymnasiou/05-ritoi-arritoi"
      backText="ΘΕΩΡΙΑ"
      showAds={true}
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-10 pb-32 sm:pb-36 space-y-8 sm:space-y-12">

        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 5
              </span>
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                12 ΑΣΚΗΣΕΙΣ
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
              ΕΞΑΣΚΗΣΗ: ΡΗΤΟΙ, ΑΡΡΗΤΟΙ & ΠΕΡΙΟΔΙΚΟΙ ΑΡΙΘΜΟΙ
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Εξασκήσου στη δεκαδική αναπαράσταση των ρητών αριθμών, στην εύρεση περιόδου, στη διάκριση καθαρών και μικτών περιοδικών και στην αναγνώριση των άρρητων αριθμών.
            </p>
          </div>
        </section>

        {/* Grid 12 Ασκήσεων */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {exercises.map((ex) => {
            const userVal = userAnswers[ex.id] || '';
            const isCorrect = isSubmitted && (userVal.trim().replace(/\s+/g, '').replace('.', ',').toLowerCase() === ex.correct.trim().replace(/\s+/g, '').replace('.', ',').toLowerCase());

            return (
              <div
                key={ex.id}
                className={`bg-white rounded-3xl p-5 sm:p-7 shadow-sm border transition-all flex flex-col justify-between space-y-4 ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'border-rose-400 ring-2 ring-rose-500/20'
                    : 'border-slate-200/80 hover:border-indigo-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs sm:text-sm">
                      {ex.id}
                    </span>
                    <span
                      className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        ex.badge === 'ΠΡΟΒΛΗΜΑ'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {ex.badge}
                    </span>
                  </div>

                  <div className="text-slate-800 text-sm sm:text-base leading-relaxed">
                    {ex.question}
                  </div>
                </div>

                <div className="pt-2">
                  {ex.type === 'mcq' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {ex.options.map((opt, optIdx) => {
                        const isSelected = userVal === opt;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleAnswerChange(ex.id, opt)}
                            className={`p-3 rounded-2xl border text-xs sm:text-sm font-mono font-bold transition-all text-center touch-manipulation truncate ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-700 shadow-md'
                                : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">
                        ΓΡΑΨΕ ΤΗΝ ΑΠΑΝΤΗΣΗ:
                      </label>
                      <input
                        type="text"
                        disabled={isSubmitted}
                        value={userVal}
                        onChange={(e) => handleInputChange(ex.id, e.target.value)}
                        placeholder="π.χ. 3 ή 0,25 ή 18"
                        className="w-full h-11 px-4 rounded-xl border border-slate-300 font-mono text-sm sm:text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  )}

                  {isSubmitted && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs sm:text-sm">
                      {isCorrect ? (
                        <div className="text-emerald-700 font-bold flex items-center gap-1.5">
                          <span>✓</span>
                          <span>ΣΩΣΤΟ!</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="text-rose-600 font-bold flex items-center gap-1.5">
                            <span>✗</span>
                            <span>ΛΑΘΟΣ</span>
                          </div>
                          <div className="text-slate-700">
                            ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ: <strong className="font-mono text-indigo-700">{ex.correct}</strong>
                          </div>
                        </div>
                      )}
                      {ex.hint && (
                        <div className="text-slate-500 text-xs mt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                          💡 <strong>Επεξήγηση:</strong> {ex.hint}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-indigo-950/95 backdrop-blur-md border-t border-indigo-700/60 text-white shadow-2xl py-3 px-4 sm:px-8">
        <div className="max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold">ΣΚΟΡ:</span>
              <span className="font-mono text-xl sm:text-2xl font-black text-amber-400">
                {isSubmitted ? score : Object.keys(userAnswers).length} / 12
              </span>
            </div>

            {isSubmitted && (
              <div className="flex items-center gap-2 border-l border-indigo-800 pl-4">
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold">ΕΠΙΤΥΧΙΑ:</span>
                <span className={`font-mono text-lg sm:text-xl font-black ${
                  percentage >= 75 ? 'text-emerald-400' : percentage >= 50 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {percentage}%
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md touch-manipulation"
              >
                ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuiz}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md touch-manipulation flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
