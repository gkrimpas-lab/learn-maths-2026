import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ----------------------------------------------------
// ΔΕΞΑΜΕΝΗ 30+ ΔΥΝΑΜΙΚΩΝ ΘΕΜΑΤΩΝ ΓΕΩΜΕΤΡΙΑΣ (Δ' ΔΗΜΟΤΙΚΟΥ)
// ----------------------------------------------------
const GEOMETRY_QUESTIONS_POOL = [
  // 1-5: Παράλληλες & Κάθετες Ευθείες
  () => ({
    q: 'Δύο ευθείες που βρίσκονται στο ίδιο επίπεδο και δεν τέμνονται (δεν συναντιούνται) ποτέ, όσιο κι αν τις προεκτείνουμε, λέγονται:',
    correct: 'Παράλληλες ευθείες',
    options: ['Παράλληλες ευθείες', 'Κάθετες ευθείες', 'Τεμνόμενες ευθείες', 'Διαγώνιες ευθείες'],
    explain: 'Παράλληλες λέγονται οι ευθείες που διατηρούν πάντα σταθερή απόσταση μεταξύ τους και δεν συναντιούνται ποτέ.'
  }),
  () => ({
    q: 'Όταν δύο ευθείες τέμνονται και σχηματίζουν 4 ορθές γωνίες (90°), ονομάζονται:',
    correct: 'Κάθετες ευθείες',
    options: ['Κάθετες ευθείες', 'Παράλληλες ευθείες', 'Οριζόντιες ευθείες', 'Κατακόρυφες ευθείες'],
    explain: 'Δύο ευθείες είναι κάθετες όταν τέμνονται σχηματίζοντας ορθές γωνίες (90°).'
  }),
  () => {
    const d = getRandomInt(3, 12);
    return {
      q: `Δύο παράλληλες ευθείες (ε1) και (ε2) απέχουν μεταξύ τους ${d} cm. Αν τις προεκτείνουμε κατά 50 cm, πόση θα είναι η μεταξύ τους απόσταση;`,
      correct: `${d} cm`,
      options: [`${d} cm`, `${d + 50} cm`, `${d * 2} cm`, '0 cm'],
      explain: `Οι παράλληλες ευθείες διατηρούν ΠΑΝΤΑ σταθερή την μεταξύ τους απόσταση (${d} cm).`
    };
  },
  () => ({
    q: 'Ποιο όργανο σχεδίασης χρησιμοποιούμε για να ελέγξουμε αν δύο ευθείες είναι κάθετες;',
    correct: 'Το γνώμονα',
    options: ['Το γνώμονα', 'Το χάρακα (ρίγα)', 'Το διαβήτη', 'Το μοιρογνωμόνιο'],
    explain: 'Με το γνώμονα ελέγχουμε αν μια γωνία είναι ορθή (90°).'
  }),
  () => ({
    q: 'Ποιο από τα παρακάτω αντικείμενα της τάξης μας έχει παράλληλες πλευρές;',
    correct: 'Η πάνω και η κάτω πλευρά του μαυροπίνακα',
    options: ['Η πάνω και η κάτω πλευρά του μαυροπίνακα', 'Δύο διπλανοί τοίχοι που σχηματίζουν γωνία', 'Οι δύο δείκτες του ρολογιού στις 3:00', 'Οι πλευρές ενός τριγώνου'],
    explain: 'Η πάνω και η κάτω πλευρά του πίνακα είναι οριζόντιες και παράλληλες μεταξύ τους.'
  }),

  // 6-10: Απόσταση Σημείου από Ευθεία
  () => ({
    q: 'Απόσταση ενός σημείου Α από μια ευθεία (ε) ονομάζεται το μήκος του ευθύγραμμου τμήματος που είναι:',
    correct: 'Κάθετο από το σημείο προς την ευθεία',
    options: ['Κάθετο από το σημείο προς την ευθεία', 'Παράλληλο προς την ευθεία', 'Οποιοδήποτε λοξό τμήμα', 'Το μεγαλύτερο δυνατό τμήμα'],
    explain: 'Η απόσταση σημείου από ευθεία είναι πάντα το μήκος του ΚΑΘΕΤΟΥ ευθύγραμμου τμήματος (το συντομότερο μονοπάτι).'
  }),
  () => {
    const d = getRandomInt(4, 15);
    return {
      q: `Το κάθετο τμήμα από το σημείο Κ προς την ευθεία (ε) έχει μήκος ${d} cm. Ένα λοξό τμήμα από το Κ προς την (ε) έχει μήκος ${d + 3} cm. Πόση είναι η απόσταση του σημείου Κ από την ευθεία (ε);`,
      correct: `${d} cm`,
      options: [`${d} cm`, `${d + 3} cm`, `${2 * d + 3} cm`, '3 cm'],
      explain: `Η απόσταση είναι ΜΟΝΟ το μήκος του κάθετου τμήματος (${d} cm). Τα λοξά τμήματα είναι πάντα μεγαλύτερα.`
    };
  },
  () => ({
    q: 'Ανάμεσα σε όλα τα ευθύγραμμα τμήματα που κινούνται από ένα σημείο Α προς μια ευθεία (ε), ποιο έχει το μικρότερο μήκος;',
    correct: 'Το κάθετο ευθύγραμμο τμήμα',
    options: ['Το κάθετο ευθύγραμμο τμήμα', 'Το πιο λοξό τμήμα', 'Το οριζόντιο τμήμα', 'Όλα έχουν το ίδιο μήκος'],
    explain: 'Το κάθετο τμήμα είναι το συντομότερο μονοπάτι (μικρότερο μήκος).'
  }),
  () => {
    const s = getRandomInt(5, 12);
    return {
      q: `Σε ένα τετράγωνο ΑΒΓΔ πλευράς ${s} cm, πόση είναι η απόσταση της κορυφής Α από την απέναντι πλευρά ΓΔ;`,
      correct: `${s} cm`,
      options: [`${s} cm`, `${2 * s} cm`, `${s * s} cm`, `${s / 2} cm`],
      explain: `Αφού οι πλευρές του τετραγώνου είναι κάθετες, η απόσταση είναι ίση με το μήκος της πλευράς (${s} cm).`
    };
  },
  () => ({
    q: 'Αν ένα σημείο Α βρίσκεται ΠΑΝΩ στην ευθεία (ε), πόση είναι η απόστασή του από την ευθεία;',
    correct: '0 cm',
    options: ['0 cm', '1 cm', 'Απειρη', 'Δεν μπορούμε να ξέρουμε'],
    explain: 'Αφού το σημείο ανήκει στην ευθεία, η απόστασή του από αυτήν είναι μηδέν (0).'
  }),

  // 11-15: Περίμετρος
  () => {
    const a = getRandomInt(4, 15);
    return {
      q: `Ένα τετράγωνο έχει πλευρά a = ${a} cm. Πόση είναι η περίμετρός του;`,
      correct: `${4 * a} cm`,
      options: [`${4 * a} cm`, `${a * a} cm`, `${2 * a} cm`, `${a + 4} cm`],
      explain: `Περίμετρος τετραγώνου = 4 × πλευρά = 4 × ${a} = ${4 * a} cm.`
    };
  },
  () => {
    const w = getRandomInt(8, 20), h = getRandomInt(4, 12);
    return {
      q: `Ένα ορθογώνιο έχει μήκος ${w} cm και πλάτος ${h} cm. Πόση είναι η περίμετρός του;`,
      correct: `${2 * w + 2 * h} cm`,
      options: [`${2 * w + 2 * h} cm`, `${w + h} cm`, `${w * h} cm`, `${2 * w + h} cm`],
      explain: `Περίμετρος ορθογωνίου = (2 × μήκος) + (2 × πλάτος) = (2 × ${w}) + (2 × ${h}) = ${2 * w + 2 * h} cm.`
    };
  },
  () => {
    const s = getRandomInt(6, 18);
    return {
      q: `Ένα ισόπλευρο τρίγωνο έχει περίμετρο ${3 * s} cm. Πόσο είναι το μήκος της μίας πλευράς του;`,
      correct: `${s} cm`,
      options: [`${s} cm`, `${3 * s} cm`, `${s / 3} cm`, `${s * 3} cm`],
      explain: `Αφού το ισόπλευρο τρίγωνο έχει 3 ίσες πλευρές: ${3 * s} : 3 = ${s} cm.`
    };
  },
  () => {
    const perim = getRandomInt(4, 15) * 4;
    return {
      q: `Ένα τετράγωνο έχει συνολική περίμετρο ${perim} cm. Πόσο μήκος έχει η κάθε πλευρά του;`,
      correct: `${perim / 4} cm`,
      options: [`${perim / 4} cm`, `${perim / 2} cm`, `${perim * 4} cm`, `${perim - 4} cm`],
      explain: `Πλευρά τετραγώνου = Περίμετρος : 4 = ${perim} : 4 = ${perim / 4} cm.`
    };
  },
  () => {
    const a = getRandomInt(5, 12), b = getRandomInt(6, 12), c = getRandomInt(7, 14);
    return {
      q: `Ένα τριγωνικό παρτέρι έχει πλευρές ${a} m, ${b} m και ${c} m. Πόσα μέτρα περίφραξη χρειάζεται γύρω-γύρω;`,
      correct: `${a + b + c} m`,
      options: [`${a + b + c} m`, `${a * b * c} m`, `${2 * (a + b)} m`, `${a + b} m`],
      explain: `Περίμετρος τριγώνου = άθροισμα πλευρών = ${a} + ${b} + ${c} = ${a + b + c} m.`
    };
  },

  // 16-20: Εμβαδόν
  () => ({
    q: 'Τι εκφράζει το εμβαδόν ενός γεωμετρικού σχήματος;',
    correct: 'Το μέγεθος της επιφάνειας που καλύπτει το σχήμα',
    options: ['Το μέγεθος της επιφάνειας που καλύπτει το σχήμα', 'Το συνολικό μήκος του περιγράμματός του', 'Τον αριθμό των γωνιών του', 'Το βάρος του σχήματος'],
    explain: 'Το εμβαδόν μετράει την εσωτερική επιφάνεια (το «μέσα») ενός σχήματος.'
  }),
  () => {
    const a = getRandomInt(3, 10);
    return {
      q: `Ένα τετράγωνο έχει πλευρά a = ${a} cm. Πόσο είναι το εμβαδόν του;`,
      correct: `${a * a} cm²`,
      options: [`${a * a} cm²`, `${4 * a} cm²`, `${2 * a} cm²`, `${a + a} cm²`],
      explain: `Εμβαδόν τετραγώνου = πλευρά × πλευρά = ${a} × ${a} = ${a * a} cm².`
    };
  },
  () => {
    const w = getRandomInt(5, 12), h = getRandomInt(3, 8);
    return {
      q: `Ένα ορθογώνιο έχει μήκος ${w} cm και πλάτος ${h} cm. Πόσο είναι το εμβαδόν του;`,
      correct: `${w * h} cm²`,
      options: [`${w * h} cm²`, `${2 * w + 2 * h} cm²`, `${w + h} cm²`, `${2 * (w * h)} cm²`],
      explain: `Εμβαδόν ορθογωνίου = μήκος × πλάτος = ${w} × ${h} = ${w * h} cm².`
    };
  },
  () => ({
    q: 'Ποια είναι η θεμελιώδης μονάδα μέτρησης του εμβαδού;',
    correct: 'Το τετραγωνικό μέτρο (τ.μ. ή m²)',
    options: ['Το τετραγωνικό μέτρο (τ.μ. ή m²)', 'Το μέτρο (m)', 'Το εκατοστό (cm)', 'Το λίτρο (L)'],
    explain: 'Το εμβαδόν μετριέται σε τετραγωνικές μονάδες (m², cm², mm²).'
  }),
  () => {
    const w = getRandomInt(4, 10), h = getRandomInt(2, 6);
    const area = w * h;
    return {
      q: `Ένα ορθογώνιο έχει εμβαδόν ${area} cm² και μήκος ${w} cm. Πόσο είναι το πλάτος του;`,
      correct: `${h} cm`,
      options: [`${h} cm`, `${area * w} cm`, `${area + w} cm`, `${w / 2} cm`],
      explain: `Πλάτος ορθογωνίου = Εμβαδόν : Μήκος = ${area} : ${w} = ${h} cm.`
    };
  },

  // 21-25: Τετράπλευρα
  () => ({
    q: 'Ποιο τετράπλευρο έχει 4 ίσες πλευρές και 4 ορθές γωνίες;',
    correct: 'Το Τετράγωνο',
    options: ['Το Τετράγωνο', 'Ο Ρόμβος', 'Το Ορθογώνιο', 'Το Τραπέζιο'],
    explain: 'Το τετράγωνο συνδυάζει 4 ίσες πλευρές ΚΑΙ 4 ορθές γωνίες.'
  }),
  () => ({
    q: 'Ποια είναι η βασική ιδιότητα του Ρόμβου;',
    correct: 'Έχει 4 ίσες πλευρές, αλλά οι γωνίες του δεν είναι ορθές',
    options: ['Έχει 4 ίσες πλευρές, αλλά οι γωνίες του δεν είναι ορθές', 'Έχει μόνο 2 ίσες πλευρές', 'Έχει 4 ορθές γωνίες', 'Έχει 3 πλευρές'],
    explain: 'Ο ρόμβος έχει 4 ίσες πλευρές όπως το τετράγωνο, αλλά οι γωνίες του είναι οξείες και αμβλείες.'
  }),
  () => ({
    q: 'Ένα τετράπλευρο που έχει ΜΟΝΟ δύο πλευρές παράλληλες μεταξύ τους ονομάζεται:',
    correct: 'Τραπέζιο',
    options: ['Τραπέζιο', 'Παραλληλόγραμμο', 'Ρόμβος', 'Τετράγωνο'],
    explain: 'Το τραπέζιο έχει μόνο μία ομάδα παράλληλων πλευρών (τις βάσεις του).'
  }),
  () => ({
    q: 'Πόσες μοίρες είναι το άθροισμα των γωνιών οποιουδήποτε τετράπλευρου;',
    correct: '360°',
    options: ['360°', '180°', '90°', '540°'],
    explain: 'Το άθροισμα των γωνιών κάθε τετράπλευρου είναι πάντα 360° (όσο 2 τρίγωνα).'
  }),
  () => ({
    q: 'Ποιο από τα παρακάτω σχήματα ΔΕΝ είναι παραλληλόγραμμο;',
    correct: 'Το Τραπέζιο',
    options: ['Το Τραπέζιο', 'Το Τετράγωνο', 'Το Ορθογώνιο', 'Ο Ρόμβος'],
    explain: 'Τα παραλληλόγραμμα έχουν τις απέναντι πλευρές παράλληλες ανά δύο. Το τραπέζιο έχει μόνο μία ομάδα παράλληλων πλευρών.'
  }),

  // 26-30+: Συμμετρία & Άξονας Συμμετρίας
  () => ({
    q: 'Πόσους άξονες συμμετρίας έχει το Τετράγωνο;',
    correct: '4',
    options: ['4', '2', '1', 'Άπειρους'],
    explain: 'Το τετράγωνο έχει 4 άξονες συμμετρίας (1 κατακόρυφο, 1 οριζόντιο, 2 διαγώνιους).'
  }),
  () => ({
    q: 'Πόσους άξονες συμμετρίας έχει το Ορθογώνιο Παραλληλόγραμμο;',
    correct: '2',
    options: ['2', '4', '1', '0'],
    explain: 'Το ορθογώνιο έχει 2 άξονες συμμετρίας (1 κατακόρυφο, 1 οριζόντιο). Οι διαγώνιοί του ΔΕΝ είναι άξονες.'
  }),
  () => ({
    q: 'Πόσους άξονες συμμετρίας έχει ο Κύκλος;',
    correct: 'Απεριορίστους (άπειρους)',
    options: ['Απεριορίστους (άπειρους)', '4', '2', '1'],
    explain: 'Κάθε ευθεία που περνάει από το κέντρο του κύκλου είναι άξονας συμμετρίας.'
  }),
  () => ({
    q: 'Πόσους άξονες συμμετρίας έχει ένα Σκαληνό Τρίγωνο (με όλες τις πλευρές άνισες);',
    correct: '0',
    options: ['0', '1', '2', '3'],
    explain: 'Το σκαληνό τρίγωνο δεν έχει κανέναν άξονα συμμετρίας (0).'
  }),
  () => {
    const halfArea = getRandomInt(12, 40);
    return {
      q: `Ένας άξονας συμμετρίας χωρίζει ένα σχήμα σε δύο συμμετρικά μέρη. Αν το ένα μέρος έχει εμβαδόν ${halfArea} cm², πόσο είναι το συνολικό εμβαδόν του σχήματος;`,
      correct: `${2 * halfArea} cm²`,
      options: [`${2 * halfArea} cm²`, `${halfArea} cm²`, `${halfArea * halfArea} cm²`, `${halfArea + 2} cm²`],
      explain: `Τα δύο συμμετρικά μέρη είναι ακριβώς ίσα, οπότε το συνολικό εμβαδόν είναι ${halfArea} + ${halfArea} = ${2 * halfArea} cm².`
    };
  },
  () => {
    const perim = getRandomInt(15, 35);
    return {
      q: `Ένας άξονας συμμετρίας χωρίζει ένα σχήμα σε δύο συμμετρικά μέρη. Αν το πρώτο μέρος έχει περίμετρο ${perim} cm, πόση είναι η περίμετρος του δεύτερου μέρους;`,
      correct: `${perim} cm`,
      options: [`${perim} cm`, `${2 * perim} cm`, `${perim / 2} cm`, 'Δεν μπορούμε να υπολογίσουμε'],
      explain: `Τα δύο συμμετρικά μέρη είναι ακριβώς ίσα, επομένως έχουν ΑΚΡΙΒΩΣ την ίδια περίμετρο (${perim} cm).`
    };
  }
];

// ----------------------------------------------------
// GENERATOR 10 ΤΥΧΑΙΩΝ ΕΡΩΤΗΣΕΩΝ
// ----------------------------------------------------
function generateRandomExam() {
  const shuffled = [...GEOMETRY_QUESTIONS_POOL].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 10);

  return selected.map((fn, index) => {
    const raw = fn();
    const shuffledOptions = [...raw.options].sort(() => Math.random() - 0.5);
    return {
      id: index + 1,
      ...raw,
      options: shuffledOptions
    };
  });
}

export default function EpanalipsiGeometryPage() {
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewExam = () => {
    const newQuestions = generateRandomExam();
    setQuestions(newQuestions);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewExam();
  }, []);

  if (!questions) return null;

  const handleSelectOption = (qId, optionText) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionText }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) {
        currentScore += 1;
      }
    });

    setScore(currentScore);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between pb-24">
      <Head>
        <title>📐 Επανάληψη Γεωμετρίας (Δ' Δημοτικού) - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full sticky top-0 z-50">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/d-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <button 
                onClick={loadNewExam}
                className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2"
              >
                <span>🔄</span> Νέες Ερωτήσεις
              </button>
              <Link href="/d-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
                🔙 Επιστροφή
              </Link>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-10 space-y-8`}>
          
          {/* HEADER BANNER */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ • ΕΝΟΤΗΤΑ 19
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">
                📐 Μεγάλη Επανάληψη Γεωμετρίας
              </h1>
              <p className="text-indigo-100 text-sm md:text-base mt-1">
                Παράλληλες, Απόσταση, Εμβαδόν, Τετράπλευρα, Περίμετρος & Συμμετρία! Πατώντας **«Νέες Ερωτήσεις»** οι ασκήσεις αλλάζουν.
              </p>
            </div>

            <button
              onClick={loadNewExam}
              className="bg-white text-gray-900 font-black px-5 py-3 rounded-2xl shadow-lg hover:bg-amber-50 transition transform active:scale-95 text-sm whitespace-nowrap"
            >
              🔄 Αλλαγή Ερωτήσεων
            </button>
          </div>

          {/* FORM ΕΡΩΤΗΣΕΩΝ */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {questions.map((q) => {
              const isUserCorrect = answers[q.id] === q.correct;

              return (
                <div 
                  key={q.id}
                  className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
                    submitted 
                      ? (isUserCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
                      : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-indigo-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">
                      {q.id}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 leading-snug">{q.q}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-11">
                    {q.options.map((opt, idx) => {
                      const isSelected = answers[q.id] === opt;

                      return (
                        <label 
                          key={idx} 
                          className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                            isSelected 
                              ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-900' 
                              : 'border-gray-200 hover:bg-gray-50 text-gray-800'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name={`question-${q.id}`}
                            value={opt}
                            checked={isSelected}
                            onChange={() => handleSelectOption(q.id, opt)}
                            disabled={submitted}
                            className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm md:text-base font-bold">{opt}</span>
                        </label>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
                      {isUserCorrect ? (
                        <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
                      ) : (
                        <p className="text-red-600">❌ Λάθος. {q.explain || `Η σωστή απάντηση είναι: ${q.correct}`}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
            {!submitted && (
              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
                >
                  🎯 Έλεγχος Απαντήσεων
                </button>
              </div>
            )}

          </form>

        </main>
      </div>

      {/* STICKY FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-4 px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col md:flex-row justify-between items-center gap-3`}>
          
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-900 font-black px-4 py-2 rounded-xl text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 Σκορ:</span>
              <span className="text-2xl font-mono">{score} / 10</span>
            </div>
            {submitted && (
              <span className="text-sm font-bold text-slate-300">
                Ποσοστό Επιτυχίας: <span className="text-emerald-400 font-black">{Math.round((score / 10) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewExam}
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-black px-6 py-2.5 rounded-xl shadow-md transition text-sm flex items-center gap-2"
              >
                <span>🔄</span> Παίξε ξανά με νέες ερωτήσεις!
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden md:block">
                Συμπλήρωσε όλες τις ερωτήσεις και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
